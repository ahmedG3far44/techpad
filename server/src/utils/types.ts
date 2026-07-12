import { Request } from "express";
import { GenerateTokenParams } from "../services/userService";

export interface ExtendedRequest extends Request {
  user?: GenerateTokenParams | undefined;
}

export interface CartProduct {
  _id?:string;
  title: string;
  description: string;
  categoryName: string ;
  categoryId:string;
  thumbnail: string;
  price: number;
  stock: number;
}

export interface IProductItem {
  productId: string;
  product: CartProduct;
  quantity: number;
}

export interface ICart {
  status: string;
  items: IProductItem[];
  totalAmount: number;
  userId: string;
}

export interface GetAdminInsightsParams {
  duration:
    | string
    | "toady"
    | "this-month"
    | "last-month"
    | "last-6-month"
    | "last-12-month";
}

export interface CheckoutCartParams {
  userId: string;
  shipInfo: ShipInfo;
}
export interface IAddress {
  label: "Home" | "Office" | "Other";
  isDefault: boolean;
  street: string;
  building: string;
  floor: string;
  apartment: string;
  area: string;
  state: string;
  country: string;
  phone?: string;
}
export interface ShipInfo {
  address: IAddress;
}
export interface Customer {
  name: string;
  email?: string;
  address: string;
  area?: string;
  phone?: string;
}


export interface GetOrderByStatus {
  state: string | "pending" | "shipped" | "delivered" | "canceled";
}