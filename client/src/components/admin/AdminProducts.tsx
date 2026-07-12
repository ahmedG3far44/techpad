import SEO from "../../components/SEO";
import { handlePrice } from "../../utils/handlers";
import { useRef, useState, useEffect } from "react";
import { FiCheck, FiAlertCircle, FiSearch } from "react-icons/fi";
import { useCategory } from "../../context/category/CategoryContext";

import toast from "react-hot-toast";
import useAuth from "../../context/auth/AuthContext";

import UploadedImages from "./UploadedImages";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

export interface CustomFile {
  lastModified: number;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

interface Product {
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  price: number;
  stock: number;
  categoryId: string;
  categoryName: string;
  totalSales: number;
  ordersCount: number;
  createdAt?: string;
}

function AdminProducts() {
  const { token } = useAuth();
  const { categories } = useCategory();
  const [files, setFiles] = useState<CustomFile[]>([]);
  const [pending, setPending] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef<any>(null);
  const addProductFormRef = useRef<any>(null);
  const descriptionRef = useRef<any>(null);
  const categoryRef = useRef<HTMLSelectElement | null>(null);
  const imagesRef = useRef<any>(null);
  const priceRef = useRef<any>("0");
  const stockRef = useRef<any>("0");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      if (titleRef.current) titleRef.current.value = editingProduct.title;
      if (descriptionRef.current) descriptionRef.current.value = editingProduct.description;
      if (categoryRef.current) categoryRef.current.value = editingProduct.categoryId;
      if (priceRef.current) priceRef.current.value = editingProduct.price.toString();
      if (stockRef.current) stockRef.current.value = editingProduct.stock.toString();
      const thumbnailIndex = editingProduct.images.findIndex(
        (img) => img === editingProduct.thumbnail
      );
      setSelectedThumbnailIndex(thumbnailIndex >= 0 ? thumbnailIndex : 0);
      addProductFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editingProduct]);

  const handleRemoveSelectedFile = (removedFile: File) => {
    const filterFiles = files.filter((file) => file !== removedFile);
    setFiles(filterFiles);
    if (selectedThumbnailIndex >= filterFiles.length && filterFiles.length > 0) {
      setSelectedThumbnailIndex(filterFiles.length - 1);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await fetch(`${BASE_URL}/product`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handelAddNewProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!token) { toast.error("Authentication required"); return; }
      setPending(true);
      setError(null);
      setUploadError(null);
      let imagesUpload: string[] = [];

      if (files.length > 0) {
        setIsUploading(true);
        const filesArray: File[] = Array.from(imagesRef?.current?.files || []);
        try {
          imagesUpload = await uploadImages(filesArray);
          if (!imagesUpload || imagesUpload.length <= 0) {
            throw new Error("Failed to upload images to server");
          }
        } catch (uploadErr: any) {
          setUploadError(uploadErr.message || "Image upload failed");
          throw uploadErr;
        } finally { setIsUploading(false); }
      } else if (editingProduct) {
        imagesUpload = editingProduct.images;
      } else {
        throw new Error("Please upload at least one image");
      }

      const thumbnailIdx = Math.min(selectedThumbnailIndex, imagesUpload.length - 1);
      const selectedCategoryId = categoryRef.current?.value as string;
      const categoryName = categories.find(
        (category) => category._id === selectedCategoryId
      )?.name as string;

      const product = {
        categoryId: selectedCategoryId,
        categoryName,
        title: titleRef?.current?.value as string,
        description: descriptionRef?.current?.value as string,
        thumbnail: imagesUpload[thumbnailIdx],
        images: imagesUpload,
        price: parseFloat(priceRef?.current?.value),
        stock: parseInt(stockRef?.current?.value),
      };

      const url = editingProduct ? `${BASE_URL}/product/${editingProduct._id}` : `${BASE_URL}/product`;
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${editingProduct ? "update" : "add"} product`);
      }

      if (addProductFormRef.current) {
        setError(null); setUploadError(null);
        addProductFormRef.current.reset();
        setFiles([]); setEditingProduct(null); setSelectedThumbnailIndex(0);
      }

      toast.success(`Product ${editingProduct ? "updated" : "added"} successfully!`);
      await fetchProducts();
    } catch (err: any) {
      console.error(err?.message);
      setError(err?.message);
      toast.error(err?.message);
    } finally { setPending(false); setIsUploading(false); }
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    try {
      const formData = new FormData();
      for (const file of files) formData.append("image", file);
      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload images");
      }
      const data = await response.json();
      if (!data || !data.images) throw new Error("Invalid response from server");
      return data.images;
    } catch (err: any) {
      console.error("Upload error:", err?.message);
      throw err;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      if (!token) { toast.error("Authentication required"); return; }
      const response = await fetch(`${BASE_URL}/product/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }
      toast.success("Product deleted successfully!");
      await fetchProducts();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to delete product");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setError(null);
    setUploadError(null);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setError(null); setUploadError(null);
    setFiles([]); setSelectedThumbnailIndex(0);
    if (addProductFormRef.current) addProductFormRef.current.reset();
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const previewImages = files.map((file) => URL.createObjectURL(file as any));

  return (
    <div className="w-full py-6 sm:py-8">
      <SEO title="Manage Products" description="Add, edit, and delete products." />
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">Products</h1>
        <p className="text-surface-500 text-sm mt-1">Manage your product inventory</p>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 mb-8 motion-safe:animate-slideUp motion-safe:[animation-fill-mode:backwards]">
        <div className="border-b border-surface-200 px-5 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-surface-900">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            {editingProduct && (
              <button onClick={handleCancelEdit} className="text-sm text-surface-500 hover:text-surface-700 font-medium motion-safe:transition-colors">
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        <form ref={addProductFormRef} onSubmit={handelAddNewProduct} className="p-5 space-y-5">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2.5" role="alert">
              <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-sm font-medium text-red-800">{error}</span>
            </div>
          )}
          {uploadError && (
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-2.5" role="alert">
              <FiAlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <span className="text-sm font-medium text-amber-800">Upload Error: {uploadError}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Title</label>
            <input
              ref={titleRef}
              className="w-full px-3.5 py-2.5 border border-surface-300 rounded-lg text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent motion-safe:transition-shadow motion-safe:duration-150 disabled:bg-surface-50 disabled:text-surface-400"
              type="text" name="title" placeholder="Short sleeve t-shirt" required disabled={pending} aria-label="Product title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Description</label>
            <textarea
              ref={descriptionRef}
              className="w-full px-3.5 py-2.5 border border-surface-300 rounded-lg text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent motion-safe:transition-shadow motion-safe:duration-150 resize-none disabled:bg-surface-50 disabled:text-surface-400"
              name="description" rows={4} placeholder="Describe your product..." required disabled={pending} aria-label="Product description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Product Images{" "}
              {editingProduct && <span className="text-surface-400 text-xs font-normal">(Leave empty to keep existing images)</span>}
            </label>
            <div className="border-2 border-dashed border-surface-300 rounded-lg p-6 hover:border-primary-400 motion-safe:transition-colors motion-safe:duration-150">
              <input
                className="hidden" name="image" id="image" type="file" multiple accept="image/*"
                ref={imagesRef} disabled={pending || isUploading}
                onChange={(e) => {
                  if (e.target.files) { setFiles(Array.from(e.target.files)); setSelectedThumbnailIndex(0); setUploadError(null); }
                }}
              />
              <label htmlFor="image" className={`flex flex-col items-center justify-center ${pending || isUploading ? "cursor-not-allowed" : "cursor-pointer"}`}>
                <svg className="w-10 h-10 text-surface-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-surface-600 mb-0.5">
                  <span className="text-primary-600 font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-surface-400">PNG, JPG, GIF up to 10MB (multiple files supported)</p>
              </label>
            </div>

            {isUploading && (
              <div className="mt-3 p-3.5 bg-primary-50 border border-primary-200 rounded-lg flex items-center gap-2.5">
                <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium text-primary-700">Uploading images to server...</span>
              </div>
            )}

            {files.length > 0 && !isUploading && (
              <div className="mt-4 space-y-4">
                <UploadedImages uploadStatus={false} removeFiles={handleRemoveSelectedFile} uploaded={files as File[]} />
                <div className="p-4 bg-surface-50 rounded-lg border border-surface-200">
                  <h3 className="text-sm font-medium text-surface-800 mb-3">Select Thumbnail Image</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3" role="listbox" aria-label="Select thumbnail">
                    {previewImages.map((preview, idx) => (
                      <button
                        key={idx} type="button"
                        onClick={() => setSelectedThumbnailIndex(idx)}
                        role="option"
                        aria-selected={selectedThumbnailIndex === idx}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 motion-safe:transition-all motion-safe:duration-150 ${
                          selectedThumbnailIndex === idx ? "border-primary-500 ring-2 ring-primary-200" : "border-surface-200 hover:border-surface-300"
                        }`}
                      >
                        <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        {selectedThumbnailIndex === idx && (
                          <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                            <div className="bg-primary-500 rounded-full p-1"><FiCheck className="w-3.5 h-3.5 text-white" /></div>
                          </div>
                        )}
                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[11px] px-1.5 py-0.5 rounded">
                          {idx + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-surface-400 mt-2">Selected: Image {selectedThumbnailIndex + 1}</p>
                </div>
              </div>
            )}

            {editingProduct && files.length === 0 && (
              <div className="mt-4 p-4 bg-surface-50 rounded-lg border border-surface-200">
                <h3 className="text-sm font-medium text-surface-800 mb-3">Current Images</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3" role="listbox" aria-label="Select thumbnail">
                  {editingProduct.images.map((img, idx) => (
                    <button
                      key={idx} type="button"
                      onClick={() => setSelectedThumbnailIndex(idx)}
                      role="option"
                      aria-selected={selectedThumbnailIndex === idx}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 motion-safe:transition-all motion-safe:duration-150 ${
                        selectedThumbnailIndex === idx ? "border-primary-500 ring-2 ring-primary-200" : "border-surface-200 hover:border-surface-300"
                      }`}
                    >
                      <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                      {selectedThumbnailIndex === idx && (
                        <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                          <div className="bg-primary-500 rounded-full p-1"><FiCheck className="w-3.5 h-3.5 text-white" /></div>
                        </div>
                      )}
                      {img === editingProduct.thumbnail && (
                        <div className="absolute top-1 left-1 bg-emerald-500 text-white text-[11px] px-1.5 py-0.5 rounded">Current</div>
                      )}
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[11px] px-1.5 py-0.5 rounded">{idx + 1}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-surface-400 mt-2">Click to select thumbnail</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Category</label>
              <select
                ref={categoryRef}
                className="w-full px-3.5 py-2.5 border border-surface-300 rounded-lg text-sm text-surface-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent motion-safe:transition-shadow motion-safe:duration-150 disabled:bg-surface-50 disabled:text-surface-400"
                name="category" required disabled={pending} aria-label="Select category"
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Price (USD)</label>
              <input
                ref={priceRef}
                className="w-full px-3.5 py-2.5 border border-surface-300 rounded-lg text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent motion-safe:transition-shadow motion-safe:duration-150 disabled:bg-surface-50 disabled:text-surface-400"
                type="number" name="price" placeholder="0.00" min="0" step="0.01" required disabled={pending} aria-label="Product price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Stock</label>
              <input
                ref={stockRef}
                className="w-full px-3.5 py-2.5 border border-surface-300 rounded-lg text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent motion-safe:transition-shadow motion-safe:duration-150 disabled:bg-surface-50 disabled:text-surface-400"
                type="number" name="stock" placeholder="0" min="0" required disabled={pending} aria-label="Stock quantity"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {editingProduct && (
              <button type="button" onClick={handleCancelEdit}
                className="px-5 py-2.5 bg-surface-100 text-surface-700 rounded-lg font-medium hover:bg-surface-200 motion-safe:transition-colors motion-safe:duration-150 disabled:opacity-50"
                disabled={pending || isUploading}
              >Cancel</button>
            )}
            <button
              className="px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 active:bg-primary-800 disabled:bg-surface-300 disabled:cursor-not-allowed motion-safe:transition-all motion-safe:duration-150 shadow-sm hover:shadow disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              type="submit" disabled={pending || isUploading}
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </span>
              ) : pending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {editingProduct ? "Updating..." : "Creating..."}
                </span>
              ) : editingProduct ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
        <div className="border-b border-surface-200 px-5 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-surface-900">All Products</h2>
              {filteredProducts.length > 0 && (
                <span className="text-sm text-surface-400">({filteredProducts.length} of {products.length})</span>
              )}
            </div>
            <div className="flex gap-2.5">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4" />
                <input
                  type="text" placeholder="Search products..."
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3.5 py-2 border border-surface-300 rounded-lg text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent motion-safe:transition-shadow motion-safe:duration-150 w-full sm:w-auto"
                  aria-label="Search products"
                />
              </div>
              <select
                value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3.5 py-2 border border-surface-300 rounded-lg text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent motion-safe:transition-shadow motion-safe:duration-150"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loadingProducts ? (
          <div className="flex justify-center items-center py-16" role="status">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-surface-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-sm font-medium text-surface-700">No products found</h3>
            <p className="text-xs text-surface-400 mt-1">
              {searchTerm || filterCategory !== "all" ? "Try adjusting your filters" : "Get started by creating a new product"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto" aria-label="Product list">
            <table className="min-w-full divide-y divide-surface-200">
              <thead className="bg-surface-50">
                <tr>
                  {["Product", "Category", "Price", "Stock", "Status", "Sales", "Orders", "Actions"].map((h) => (
                    <th key={h} scope="col" className={`px-5 py-3.5 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider ${h === "Sales" || h === "Orders" || h === "Actions" ? "text-right" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-surface-100">
                {filteredProducts.map((product) => (
                  <ProductItem
                    key={product._id}
                    deleteProduct={() => deleteProduct(product._id as string)}
                    editProduct={handleEditProduct}
                    product={product}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;

function ProductItem({
  product, deleteProduct, editProduct,
}: {
  product: Product; deleteProduct: (id: string) => void; editProduct: (product: Product) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDeleteProduct() {
    if (!confirm(`Are you sure you want to delete "${product.title}"?`)) return;
    try { setLoading(true); await deleteProduct(product._id as string); }
    catch (error) { console.error((error as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <tr className="hover:bg-surface-50 motion-safe:transition-colors motion-safe:duration-100">
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-surface-100 border border-surface-200 p-1">
            <img className="w-full h-full object-contain rounded" src={product.thumbnail} alt={product.title}
              onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
            />
          </div>
          <div className="max-w-[200px]">
            <div className="text-sm font-medium text-surface-900 truncate">{product.title}</div>
            <div className="text-xs text-surface-400 line-clamp-1">{product.description}</div>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
          {product.categoryName}
        </span>
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-surface-900">{handlePrice(product.price)}</td>
      <td className="px-5 py-4 whitespace-nowrap text-sm text-surface-600">{product.stock} items</td>
      <td className="px-5 py-4 whitespace-nowrap">
        {product.stock > 0 ? (
          <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">In Stock</span>
        ) : (
          <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Out of Stock</span>
        )}
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-right text-sm">
        {product.totalSales > 0 ? (
          <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">{handlePrice(product.totalSales)}</span>
        ) : (
          <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-surface-100 text-surface-500">N/A</span>
        )}
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-right text-sm">
        {product.ordersCount > 0 ? (
          <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">{product.ordersCount}</span>
        ) : (
          <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-surface-100 text-surface-500">N/A</span>
        )}
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2.5">
          <button onClick={() => editProduct(product)} disabled={loading}
            className="text-primary-600 hover:text-primary-800 disabled:text-primary-300 motion-safe:transition-colors motion-safe:duration-100"
          >Edit</button>
          <button disabled={loading} onClick={handleDeleteProduct}
            className="text-red-600 hover:text-red-800 disabled:text-red-300 motion-safe:transition-colors motion-safe:duration-100"
          >{loading ? "Deleting..." : "Delete"}</button>
        </div>
      </td>
    </tr>
  );
}
