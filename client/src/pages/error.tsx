import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen flex justify-center items-center ">
      <SEO title="Page Not Found" description="The page you are looking for does not exist." />
      <div role="alert" className="w-[600px] p-4 border border-zinc-300 flex flex-col justify-center items-center gap-4 rounded-md">
        <h1 className="text-8xl font-black text-blue-500">404</h1>
        <h2 className="text-2xl">This page not found</h2>
        <p className="text-gray-400 text-sm text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
          necessitatibus rem, iste culpa, nostrum eaque facere ipsum autem in
          molestias soluta asperiores quae illo nihil maiores aliquam dolorum
          illum ut!
        </p>
        <button
          className={
            "px-4 py-2 rounded-xl text-white hover:bg-blue-800 duration-150 bg-blue-500 cursor-pointer"
          }
          onClick={() => navigate("/")}
        >
          Back Home
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
