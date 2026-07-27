import { createContext, useContext } from "react";
import { CartContextType } from "../../utils/types";

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  totalAmount: 0,
  totalCartItems:0,
  addItemToCart: () => {},
  updateItemInCart: () => {},
  deleteOneItemFromCart: () => {},
  clearAllItemsFromCart: () => {},
  getUserCart: () => {},
  createOrder: () => {},
  shippingCost:0,
  taxAmount:0,
  pending:false,
  error:null,
});

const useCart = () => useContext(CartContext);

export default useCart;
