import {
  FiEdit2,
  FiTrash2,
  FiX,
  FiUpload,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import { BiX } from "react-icons/bi";
import React, { useState, useRef, ChangeEvent, useEffect } from "react";

import useAuth from "../../context/auth/AuthContext";
import { handlePrice } from "../../utils/handlers";

export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  numberOfProducts?: number;
  categorySales?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryFormData {
  name: string;
  description: string;
  image: File | null;
  removeImage: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  image?: string;
  submit?: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

export const getAllCategories = async (): Promise<Category[] | null> => {
  try {
    const response = await fetch(`${BASE_URL}/category`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to fetch categories: ${response.statusText}`
      );
    }

    const result = await response.json();

    return result.data;
  } catch (error) {
    console.log((error as Error).message);
    return null;
  }
};

const CategoryListTable: React.FC = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    image: null,
    removeImage: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image: null,
      removeImage: false,
    });
    setImagePreview(category.image);
    setShowEditModal(true);
    setErrors({});
    setSuccessMessage(null);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please upload a valid image file",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
        removeImage: false,
      }));
      setErrors((prev) => ({ ...prev, image: undefined }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      removeImage: true,
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory) return;

    setSuccessMessage(null);
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setUpdatingId(editingCategory._id);

    try {
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const formDataToSend = new FormData();
      
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("description", formData.description.trim());

      if (formData.removeImage) {
        formDataToSend.append("removeImage", "true");
      }

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(
        `${BASE_URL}/category/${editingCategory._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to update category: ${response.statusText}`
        );
      }

      const result = await response.json();

      setCategories((prev) =>
        prev.map((cat) => (cat._id === editingCategory._id ? result.data : cat))
      );

      setSuccessMessage("Category updated successfully!");

      setTimeout(() => {
        setShowEditModal(false);
        setEditingCategory(null);
        setSuccessMessage(null);
      }, 1500);
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setDeletingId(categoryToDelete._id);

    try {
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(
        `${BASE_URL}/category/${categoryToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to delete category: ${response.statusText}`
        );
      }

      setCategories((prev) =>
        prev.filter((cat) => cat._id !== categoryToDelete._id)
      );

      setShowDeleteModal(false);
      setCategoryToDelete(null);
      setSuccessMessage("Category deleted successfully!");

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const closeEditModal = () => {
    if (updatingId) return;
    setShowEditModal(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", image: null, removeImage: false });
    setImagePreview(null);
    setErrors({});
    setSuccessMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeDeleteModal = () => {
    if (deletingId) return;
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleFetchAllCategories = async () => {
    setSuccessMessage(null);
    setErrors({});

    try {
      setPending(true);
      const categoriesList = await getAllCategories();

      if (categoriesList) {
        setCategories(categoriesList);
      }
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    handleFetchAllCategories();
  }, []);

  return (
    <div className="motion-safe:animate-fadeIn motion-safe:[animation-fill-mode:backwards]">
      {successMessage && !showEditModal && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
          <FiCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-900">
              {successMessage}
            </p>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 motion-safe:transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {pending ? (
        <div className="bg-white w-full px-4 py-8 border border-surface-200 rounded-xl h-[500px] flex items-center justify-center mx-auto">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-base font-semibold text-surface-900">
                  All Categories
                </h1>
                <p className="text-sm text-surface-500 mt-1">
                  Showing {categories.length} of {categories.length} categories
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Categories table">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  {["Category", "Description", "Sales", "Products", "Actions"].map((h) => (
                    <th key={h} scope="col" className={`px-6 py-3 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider ${h === "Actions" ? "text-right" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-surface-100">
                {categories.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-surface-50 motion-safe:transition-colors motion-safe:duration-100"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 p-1 rounded-lg border border-surface-200 bg-surface-50">
                          <img
                            className="h-full w-full rounded-lg object-contain"
                            src={category.image}
                            alt={category.name}
                            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-surface-900">
                            {category.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-surface-600 max-w-xs truncate">
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-surface-600">
                        <span className="font-medium text-surface-800">{handlePrice(category.categorySales || 0)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {category.numberOfProducts || 0} products
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(category)}
                        disabled={
                          deletingId === category._id ||
                          updatingId === category._id
                        }
                        className="text-primary-600 hover:text-primary-800 mr-4 disabled:opacity-50 disabled:cursor-not-allowed motion-safe:transition-colors motion-safe:duration-100"
                        title="Edit category"
                        aria-label={category.name}
                      >
                        <FiEdit2 className="w-4 h-4 inline align-text-bottom" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category)}
                        disabled={
                          deletingId === category._id ||
                          updatingId === category._id
                        }
                        className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed motion-safe:transition-colors motion-safe:duration-100"
                        title="Delete category"
                        aria-label={category.name}
                      >
                        <FiTrash2 className="w-4 h-4 inline align-text-bottom" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-surface-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm font-medium text-surface-700">No categories found</p>
              <p className="text-xs text-surface-400 mt-1">Get started by creating a new category</p>
            </div>
          )}
        </div>
      )}

      {showEditModal && editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label="Edit category">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto motion-safe:animate-scaleIn">
            <div className="px-6 py-4 border-b border-surface-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-semibold text-surface-900">
                  Edit Category
                </h2>
                <p className="text-sm text-surface-500 mt-1">
                  Update category information
                </p>
              </div>
              <button
                onClick={closeEditModal}
                disabled={!!updatingId}
                className="text-surface-400 hover:text-surface-600 disabled:cursor-not-allowed motion-safe:transition-colors motion-safe:duration-100"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {successMessage && (
              <div className="mx-6 mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                <FiCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-900">
                    {successMessage}
                  </p>
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">
                    {errors.submit}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setErrors((prev) => ({ ...prev, submit: undefined }))
                  }
                  className="text-red-600 hover:text-red-800 motion-safe:transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="edit-name"
                  className="block text-sm font-medium text-surface-700 mb-1.5"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!!updatingId}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-surface-50 disabled:text-surface-400 disabled:cursor-not-allowed motion-safe:transition-shadow motion-safe:duration-150 ${
                    errors.name ? "border-red-300" : "border-surface-300"
                  }`}
                  placeholder="e.g., Electronics, Clothing, Food"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="edit-description"
                  className="block text-sm font-medium text-surface-700 mb-1.5"
                >
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!!updatingId}
                  rows={4}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:bg-surface-50 disabled:text-surface-400 disabled:cursor-not-allowed motion-safe:transition-shadow motion-safe:duration-150 ${
                    errors.description ? "border-red-300" : "border-surface-300"
                  }`}
                  placeholder="Describe this category..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Category Image
                </label>

                {imagePreview ? (
                  <div className="relative w-full h-48 border-2 border-surface-300 rounded-lg overflow-hidden bg-surface-50">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                    {!updatingId && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={pending}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-700 shadow-md motion-safe:transition-colors motion-safe:duration-150 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <BiX className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={!!updatingId}
                      className="hidden"
                      id="edit-image-upload"
                    />
                    <label
                      htmlFor="edit-image-upload"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer motion-safe:transition-colors motion-safe:duration-150 ${
                        errors.image
                          ? "border-red-300 bg-red-50"
                          : "border-surface-300 bg-surface-50 hover:bg-surface-100"
                      } ${updatingId ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <FiUpload className="w-8 h-8 text-surface-400 mb-2" />
                      <span className="text-sm text-surface-600">
                        Click to upload {formData.removeImage ? "new" : "image"}
                      </span>
                      <span className="text-xs text-surface-400 mt-1">
                        PNG, JPG up to 5MB
                      </span>
                    </label>
                  </div>
                )}

                {errors.image && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.image}
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-surface-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={closeEditModal}
                disabled={!!updatingId}
                className="px-4 py-2.5 text-sm font-medium text-surface-700 bg-white border border-surface-300 rounded-lg hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-150"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate} 
                disabled={!!updatingId}
                className="px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-150 min-w-[120px]"
              >
                {updatingId ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Update Category"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label="Delete category" aria-describedby="delete-description">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full motion-safe:animate-scaleIn">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <FiAlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">
                    Delete Category
                  </h3>
                  <p className="text-sm text-surface-500 mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-sm text-surface-700 mb-6" id="delete-description">
                Are you sure you want to delete{" "}
                <span className="font-semibold">"{categoryToDelete.name}"</span>
                ?
                {categoryToDelete.numberOfProducts &&
                  categoryToDelete.numberOfProducts > 0 && (
                    <span className="text-red-600">
                      {" "}
                      This category contains{" "}
                      {categoryToDelete.numberOfProducts}{" "}
                      product(s).
                    </span>
                  )}
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={!!deletingId}
                  className="px-4 py-2.5 text-sm font-medium text-surface-700 bg-white border border-surface-300 rounded-lg hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-150"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={!!deletingId}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-150 min-w-[100px]"
                >
                  {deletingId ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryListTable;
