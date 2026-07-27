export interface IProduct {
  _id: string;
  title: string;
  description: string | null;
  categoryName: string;
  catergoryId: string;
  images: string[] | [];
  thumbnail?: string;
  price: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductItem {
  productId: string;
  product: IProduct;
  quantity: number;
  updatedAt: Date;
}
export interface ICart {
  items: IProductItem[];
  status: string;
  totalAmount: number;
  userId: string;
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

export function emptyAddress(): IAddress {
  return {
    label: "Home",
    isDefault: false,
    street: "",
    building: "",
    floor: "",
    apartment: "",
    area: "",
    state: "",
    country: "Egypt",
  };
}

export function formatAddress(a: IAddress): string {
  const parts = [
    a.building && `Building ${a.building}`,
    a.floor && `Floor ${a.floor}`,
    a.apartment && `Apt ${a.apartment}`,
    a.street,
    a.area,
    a.state,
    a.country,
  ].filter(Boolean);
  return parts.join(", ");
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  isAdmin: boolean;
  addresses?: IAddress[];
}

export interface AddAndUpdateItemsToCartParamsType {
  productId: string;
  quantity: number;
  token: string;
}
export interface DeleteItemCartParamsType {
  productId: string;
  token: string;
}
export interface ClearCartParamsType {
  token: string;
}
export interface CartContextType {
  cartItems: IProductItem[];
  totalAmount: number;
  totalCartItems: number;
  shippingCost: number;
  taxAmount: number;
  addItemToCart: ({
    productId,
    quantity,
    token,
  }: AddAndUpdateItemsToCartParamsType) => void;
  updateItemInCart: ({
    productId,
    quantity,
    token,
  }: AddAndUpdateItemsToCartParamsType) => void;
  deleteOneItemFromCart: ({
    productId,
    token,
  }: DeleteItemCartParamsType) => void;
  clearAllItemsFromCart: ({ token }: ClearCartParamsType) => void;
  getUserCart: ({ token }: ClearCartParamsType) => void;
  createOrder: ({ token, address }: { token: string; address: IAddress }) => void;
  pending: boolean;
  error: string | null;
}

export interface RegisterUserParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface loginUserParams {
  email: string;
  password: string;
}

export interface OnlyTokenParams {
  token: string;
}

export interface TokenWithAddressParams {
  token: string;
  address: IAddress;
}

export interface OrderList {
  _id: string;
  address: string;
  orderItems: OrderItemProps[];
  status: OrderStatus;
  totalOrderPrice: number;
  createdAt: Date;
}

export interface OrderHistoryProps {
  id: string;
  totalAmount: number;
  address: string;
  status: OrderStatus;
  items: OrderItemProps[];
  orderDate: Date;
}

export enum OrderStatus {
  PENDING,
  SHIPPED,
  DELIVERED,
}

export interface OrderItemProps {
  _id: string;
  productTitle: string;
  productDescription: string;
  productImages?: string;
  quantity: number;
  productPrice: number;
}

export interface OrdersCountType {
  pending: number;
  shipped: number;
  delivered: number;
  totalOrders: number;
}

export interface TopCustomer {
  userId?: string;
  profile?: string;
  email: string;
  orderCount: number;
  totalSpent: number;
}

export interface ProductInITemsList {
  _id: string;
  productTitle: string;
  productImages: string;
  productDescription: string;
  productPrice: number;
  quantity: number;
}

export interface Customer {
  name: string;
  email?: string;
  address: string;
  area?: string;
  phone?: string;
}

export interface Order {
  _id: string;
  orderItems: ProductInITemsList[];
  status: string | "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELED";
  customer?: Customer;
  totalOrderPrice: number;
  createdAt: Date;
  updatedAt?: Date;
  userId: string;
}
