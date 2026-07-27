import { IProduct } from "../utils/types";
import { handlePrice } from "../utils/handlers";
import { useNavigate } from "react-router-dom";

import ProductImage from "./ProductImage";
import useAuth from "../context/auth/AuthContext";
import useCart from "../context/cart/CartContext";
import Button from "./Button";

function ProductInfo({
  _id,
  title,
  description,
  categoryName,
  images,
  thumbnail,
  stock,
  price,
  createdAt,
}: IProduct) {
  const navigate = useNavigate();
  const { isAuthenticated, token, user } = useAuth();
  const { cartItems, addItemToCart } = useCart();

  const handelAddToCart = async () => {
    if (!isAuthenticated || !token) {
      navigate("/login");
    } else {
      await addItemToCart({ productId: _id, token, quantity: 1 });
    }
  };

  const handelBuyNow = async () => {
    if (!isAuthenticated || !token) {
      navigate("/login");
    } else {
      const product = cartItems.find((product) => product.productId === _id);
      if (!product) {
        await addItemToCart({ productId: _id, token, quantity: 1 });
        navigate("/cart");
      } else {
        navigate("/cart");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start mt-6 lg:mt-10">
      <div className="w-full lg:flex-1">
        <ProductImage images={images} thumbnail={thumbnail} title={title} />
      </div>

      <div className="w-full lg:flex-1 flex flex-col gap-3 p-0 lg:p-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-surface-900">
          {title}
        </h2>

        <span className="inline-flex w-fit text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
          {categoryName}
        </span>

        <div className="my-2 lg:my-4 text-surface-600 text-sm sm:text-base leading-relaxed">
          <p>{description}</p>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-2xl sm:text-3xl font-bold text-primary-600">
            {handlePrice(price)}
          </span>
          <span className="text-sm text-surface-500">
            {stock > 0 ? `${stock} items in stock` : "Out of stock"}
          </span>
        </div>

        {createdAt && (
          <p className="text-xs text-surface-400">
            Listed: {new Date(createdAt).toLocaleDateString()}
          </p>
        )}

        {isAuthenticated && !user?.isAdmin && (
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-auto pt-4">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={handelAddToCart}
            >
              Add To Cart
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handelBuyNow}
            >
              Buy Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductInfo;
