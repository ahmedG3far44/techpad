import { productSchema } from "../utils/validationSchema";
import productModel from "../models/product";
import categoryModel from "../models/category";
import { deleteFromCloudinary } from "../utils/cloudinary";

export const getAllProducts = async () => {
  try {
    const products = await productModel.find();
    return { data: products, statusCode: 200 };
  } catch (err: any) {
    return { data: err.message, statusCode: 400 };
  }
};

interface AddProductParams {
  productData: any;
}

export const addNewProduct = async ({ productData }: AddProductParams) => {
  try {
    const validProductData = productSchema.safeParse(productData);
    if (!validProductData.success) {
      return {
        data: `the product data are not valid => ${validProductData.error.message}`,
        statusCode: 400,
      };
    }

    const category = await categoryModel.findById(validProductData.data.categoryId);
    if (!category) {
      return {
        data: "Category not found",
        statusCode: 404,
      };
    }

    const newProduct = await productModel.create({
      ...validProductData.data,
      totalSales: 0,
      ordersCount: 0,
    });

    await categoryModel.findByIdAndUpdate(
      validProductData.data.categoryId,
      {
        $inc: { numberOfProducts: 1 }
      },
      { new: true }
    );

    return { data: newProduct, statusCode: 201 };
  } catch (err) {
    console.error("Error creating product:", err);
    return { data: "can't create a product", statusCode: 400 };
  }
};

interface IUpdateProduct {
  product: any;
  productId: string;
}

export const updateNewProduct = async ({
  productId,
  product,
}: IUpdateProduct) => {
  try {
    const existProduct = await productModel.findById(productId);
    if (!existProduct) {
      return { data: "this product not found!!", statusCode: 400 };
    }

    const validProductData = productSchema.safeParse(product);
    if (!validProductData.success) {
      return { data: "the product data are not valid", statusCode: 400 };
    }

    let categoryName = existProduct.categoryName;
    if (String(existProduct.categoryId) !== validProductData.data.categoryId) {
      const category = await categoryModel.findById(validProductData.data.categoryId);
      if (!category) {
        return {
          data: "Category not found",
          statusCode: 400,
        };
      }
      categoryName = category.name;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      {
        ...validProductData.data,
        categoryName,
        totalSales: existProduct.totalSales,
        ordersCount: existProduct.ordersCount,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return { data: "can't update product info", statusCode: 400 };
    }

    return { data: updatedProduct, statusCode: 200 };
  } catch (err) {
    return { data: "can't update product info", statusCode: 400 };
  }
};

interface GetProductByCategoryNameParams {
  categoryName: string;
}
export const getProductsByCategoryName = async ({ categoryName }: GetProductByCategoryNameParams) => {
  try {
    const products = await productModel.find({ categoryName });
    if (!products) throw new Error("no products found !!");

    return { data: products, statusCode: 200 };
  } catch (error) {
    return { data: `Error: ${(error as Error).message}`, statusCode: 400 };
  }
};

interface GetProductByIdParams {
  productId: string;
}

export const getProductById = async ({ productId }: GetProductByIdParams) => {
  try {
    const productDetails = await productModel.findById(productId);
    if (!productDetails) {
      return { data: "The product doesn't found!!", statusCode: 404 };
    }
    return { data: productDetails, statusCode: 200 };
  } catch (err) {
    return { data: "can't get product by Id", statusCode: 400 };
  }
};

export const deleteProductById = async ({ productId }: GetProductByIdParams) => {
  try {
    const product = await productModel.findById(productId);
    if (!product) {
      return {
        data: "failed to delete, this product doesn't exist!!",
        statusCode: 404
      };
    }

    for (const img of product?.images as string[]) {
      await deleteFromCloudinary(img);
    }

    await productModel.findByIdAndDelete(productId);

    await categoryModel.findByIdAndUpdate(
      product.categoryId,
      {
        $inc: { numberOfProducts: -1 }
      },
      { new: true }
    );
    return { data: product, statusCode: 200, message: "product deleted success!!" };
  } catch (err) {
    return { data: "can't delete product by Id", statusCode: 400 };
  }
};
