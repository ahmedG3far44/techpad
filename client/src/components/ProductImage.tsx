import { useState } from "react";

interface ProductImageProps {
  images: string[];
  thumbnail?: string;
  title?: string;
}

function ProductImage({ images, thumbnail, title }: ProductImageProps) {
  const initialIndex = thumbnail && images.includes(thumbnail) ? images.indexOf(thumbnail) : 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 sm:h-80 md:h-[400px] lg:h-[500px] bg-surface-100 rounded-2xl flex items-center justify-center">
        <span className="text-surface-400">No image available</span>
      </div>
    );
  }

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative w-full rounded-2xl border border-surface-200 bg-surface-50 overflow-hidden group">
        <div className="aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-[500px] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <img
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            src={images[activeIndex]}
            alt={`Product image ${activeIndex + 1}`}
            aria-label={title}
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-surface-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              aria-label="Next image"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-surface-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-black/60 text-white px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-hide pt-3 sm:pt-4">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center cursor-pointer justify-center overflow-hidden transition-all duration-200 ${
                index === activeIndex
                  ? "ring-2 ring-primary-500 ring-offset-1 shadow-sm opacity-100"
                  : "ring-1 ring-surface-200 hover:ring-surface-300 opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                className="w-full h-full object-cover"
                src={img}
                alt={`Thumbnail ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImage;
