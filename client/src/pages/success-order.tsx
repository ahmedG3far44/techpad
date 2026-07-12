import { useNavigate } from "react-router-dom";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import SEO from "../components/SEO";

function SuccessOrder() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex justify-center items-center  min-h-full flex-col">
      <SEO title="Order Successful" description="Your order has been placed successfully." />
      <div role="status" aria-live="assertive" className="w-[400px] mt-60 bg-gray-50 p-4 rounded-md border border-gray-300 flex flex-col justify-center items-center gap-4">
        <h1 className="flex flex-col justify-center items-center gap-2 text-2xl text-gray-900 font-bold">
          <span className="text-green-500">
            <IoCheckmarkDoneCircle size={30} />
          </span>
          Thank You for your order
        </h1>
        <p className="text-sm text-gray-700 text-center">
          Congrats your order was created success, navigate to home page, and
          complete your shopping!!
        </p>
        <button
          className="p-2 rounded-md bg-blue-500 text-white w-full hover:bg-blue-800 duration-150 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Back Home
        </button>
      </div>
    </div>
  );
}

export default SuccessOrder;
