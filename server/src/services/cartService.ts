
import { CheckoutCartParams, IProductItem } from "../utils/types";

import cartModel from "./../models/cart";
import userModel from "../models/user";
import productModel from "../models/product";
import orderModel from "../models/order";
import categoryModel from "../models/category";

interface CreateCartParams {
  userId: string;
}

const createUserCart = async ({ userId }: CreateCartParams) => {
  let cart = await cartModel.create({ userId });
  await cart.save();
  return cart;
};

interface GetActiveCartParams {
  userId: string;
}

export const getActiveCart = async ({ userId }: GetActiveCartParams) => {
  try {
    let cart = await cartModel.findOne({ userId, status: "ACTIVE" });
    if (!cart) {
      cart = await createUserCart({ userId });
      return cart;
    }
    return cart;
  } catch (err) {
    return {
      data: `can't get user active cart ${err}`,
      statusCode: 400,
    };
  }
};

interface AddProductToCartParams {
  userId: string;
  productId: string;
  quantity: number;
}
export const addProductToCart = async ({
  userId,
  productId,
  quantity,
}: AddProductToCartParams) => {
  try {
    const product = await productModel.findById(productId);

    console.log(product)

    if (!product) {
      return { data: "this product not found", statusCode: 400 };
    }

    if (product.stock < quantity) {
      return { data: "this product is out of stock!!", statusCode: 400 };
    }

    let cart = await getActiveCart({ userId });

    if ("statusCode" in cart) {
      return cart;
    }


    const isAddedToCart = cart.items.find(
      (item) => item.productId.toString() === productId.toString()
    );

    if (isAddedToCart) {
      return { data: "this product is already on cart!!", statusCode: 400 };
    }

    const newProduct: IProductItem = {
      productId,
      product: {
        title: product.title,
        thumbnail: product.images?.[0] || "",
        description: product.description,
        categoryId: product.categoryId.toString(),
        categoryName: product.categoryName,
        price: product.price,
        stock: product.stock,
      },
      quantity,
    };

    console.log(newProduct)

    cart.items.push(newProduct);
    cart.totalAmount += product.price * quantity;

    const updatedCart = await cart.save();

    return { data: updatedCart, statusCode: 200 };
  } catch (err: any) {
    return { data: err.message, statusCode: 400 };
  }
};

interface UpdateItemsInCartParams {
  productId: string;
  userId: string;
  quantity: number;
}
export const updateItemsInCart = async ({
  productId,
  userId,
  quantity,
}: UpdateItemsInCartParams) => {
  try {
    let cart = await getActiveCart({ userId });

    if ("statusCode" in cart) {
      return cart;
    }

    const updatedItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!updatedItem) {
      return {
        data: "failed to update this item not found!!",
        statusCode: 400,
      };
    }

    console.log(updatedItem)

    updatedItem.quantity = quantity;
    
    cart.totalAmount = calculateItemsInCartTotalPrice(cart.items);

    const updatedCart = await cart.save();

    return { data: updatedCart, statusCode: 200 };
  } catch (err: any) {
    return { data: err.message, statusCode: 400 };
  }
};
const calculateItemsInCartTotalPrice = (totalItems: IProductItem[]): number => {
  return totalItems.reduce((acc, current) => {
    return acc + current.product.price * current.quantity;
  }, 0);
};

interface DeleteItemFromCartParams {
  userId: string;
  productId: string;
}
export const deleteItemFromCart = async ({
  userId,
  productId,
}: DeleteItemFromCartParams) => {
  try {
    let cart = await getActiveCart({ userId });

    if ("statusCode" in cart) {
      return cart;
    }

    // Find the item to delete (should use === not !==)
    const itemToDelete = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!itemToDelete) {
      return {
        data: "failed to delete this item!!",
        statusCode: 400,
      };
    }

    // Filter out the deleted item
    const totalItems = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    const totalItemsPrice = calculateItemsInCartTotalPrice(totalItems);

    cart.totalAmount = totalItemsPrice;
    cart.items = totalItems;

    const deletedCart = await cart.save();

    return { data: deletedCart, statusCode: 200 };
  } catch (err) {
    return { data: err, statusCode: 400 };
  }
};

interface ClearCartParams {
  userId: string;
}
export const clearCart = async ({ userId }: ClearCartParams) => {
  try {
    let cart = await getActiveCart({ userId });

    if ("statusCode" in cart) {
      return cart;
    }

    cart.totalAmount = 0;
    cart.items = [];

    const clearedCart = await cart.save();

    return { data: clearedCart, statusCode: 200 };
  } catch (err) {
    return { data: err, statusCode: 400 };
  }
};

export const checkout = async ({ userId, shipInfo }: CheckoutCartParams) => {
  try {
    const cart = await getActiveCart({ userId });
    if ("statusCode" in cart) {
      return cart;
    }
    if (!cart.items.length) {
      return { data: "can't checkout cart is empty", statusCode: 400 };
    }

    let orderItems = [];

    const categorySalesMap = new Map<string, number>();

    for (const item of cart.items) {
      const product = await productModel.findById(item.productId);
      if (!product) {
        return { data: "error products order not found!!", statusCode: 400 };
      }

      if (product.stock < item.quantity) {
        return { 
          data: `Not enough stock for ${product.title}. Available: ${product.stock}, Requested: ${item.quantity}`, 
          statusCode: 400 
        };
      }

 
      const productOrder = {
        productTitle: product.title || "",
        productDescription: product.description || null,
        productImages: product.images?.[0] || "",
        productPrice: product.price,
        quantity: item.quantity,
      };
      orderItems.push(productOrder);

      const itemTotalPrice = product.price * item.quantity;

    
      await productModel.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            stock: -item.quantity,           
            totalSales: itemTotalPrice,     
            ordersCount: 1                    
          }
        },
        { new: true }
      );

      const categoryId = product.categoryId.toString();
      const currentCategorySales = categorySalesMap.get(categoryId) || 0;
      categorySalesMap.set(categoryId, currentCategorySales + itemTotalPrice);
    }

 
    for (const [categoryId, salesAmount] of categorySalesMap.entries()) {
      await categoryModel.findByIdAndUpdate(
        categoryId,
        {
          $inc: {
            categorySales: salesAmount  
          }
        },
        { new: true }
      );
    }

    const customer = await userModel.findById(userId);
    if (!customer) {
      return { data: "User not found!", statusCode: 404 };
    }

    const addr = shipInfo?.address;
    const addressStr = addr
      ? [
          addr.building && `Building ${addr.building}`,
          addr.floor && `Floor ${addr.floor}`,
          addr.apartment && `Apt ${addr.apartment}`,
          addr.street,
          addr.area,
          addr.state,
          addr.country,
        ]
          .filter(Boolean)
          .join(", ")
      : "";

    const order = await orderModel.create({
      orderItems,
      customer: {
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        address: addressStr,
        area: addr ? `${addr.area}, ${addr.state}` : "",
        phone: addr?.phone || "",
      },
      userId,
      totalOrderPrice: cart.totalAmount,
    });


    await cartModel.findByIdAndUpdate(cart._id, {
      status: "COMPLETED",
    });
    await clearCart({ userId });

    return { data: order, statusCode: 201 };
  } catch (err) {
    console.error("Checkout error:", err);
    return { 
      data: err instanceof Error ? err.message : "Checkout failed", 
      statusCode: 400 
    };
  }
};
