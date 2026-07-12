import { HiShoppingCart } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function ShoppingCart({ itemsCartNumber }: { itemsCartNumber: number }) {
  const navigate = useNavigate();
  const handelNavigateToCart = () => {
    navigate("/cart");
  };
  return (
    <div
      onClick={handelNavigateToCart}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") handelNavigateToCart(); }}
      className="relative flex items-center justify-center w-10 h-10 text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all cursor-pointer"
    >
      {itemsCartNumber > 0 && (
        <span className="absolute -right-1 -top-0.5 w-5 h-5 text-[10px] flex justify-center items-center rounded-full bg-primary-600 text-white font-bold">
          {itemsCartNumber <= 9 ? itemsCartNumber : "9+"}
        </span>
      )}

      <HiShoppingCart size={22} />
    </div>
  );
}

export default ShoppingCart;
