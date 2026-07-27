import { useState } from "react";

function Collections() {
  const [features] = useState([
    {
      id: 1,
      name: "MEN CLOTHES",
      image: "/6680311.jpg",
    },
    {
      id: 2,
      name: "WOMEN CLOTHES",
      image: "/7312571.jpg",
    },
    {
      id: 3,
      name: "PANTS",
      image: "/7312591.jpg",
    },
    {
      id: 4,
      name: "HOODIES",
      image: "/7312586.jpg",
    },
  ]);
  return (
    <div className="w-full flex justify-center items-center max-sm:flex-wrap max-md:flex-wrap max-sm:h-auto max-md:h-auto h-[400px] ">
      {features.map((feature) => {
        return (
          <div
            key={feature.id}
            className="group p-4 max-w-72 overflow-hidden flex flex-col justify-center gap-4 items-center cursor-pointer hover:scale-105 duration-150"
          >
            <div className="w-full h-full  relative flex flex-col justify-center items-center rounded-3xl overflow-hidden shadow-md ">
              <img
                src={feature.image}
                alt={feature.name}
                className="w-full h-full object-cover mix-blend-multiply"
              />
              <h1 className="hidden group-hover:flex text-4xl duration-150 font-black absolute bottom-20 text-blue-700 text-center z-50 shadow-2xs underline">
                {feature.name}
              </h1>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Collections;
