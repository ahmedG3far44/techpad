import { useState, useEffect, useCallback } from "react";

interface ImageSliderProps {
  images: string[];
  interval?: number;
  placeholderSrc?: string;
}

function ImageSlider({ 
  images, 
  interval = 10000,
  placeholderSrc 
}: ImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Map<number, boolean>>(new Map());
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  useEffect(() => {
    const newLoadedImages = new Map<number, boolean>();
    const newFailedImages = new Set<number>();

    images.forEach((src, index) => {
      if (!src || typeof src !== 'string') {
        newFailedImages.add(index);
        return;
      }

      const img = new Image();
      
      img.onload = () => {
        setLoadedImages(prev => new Map(prev).set(index, true));
      };

      img.onerror = () => {
        setFailedImages(prev => new Set(prev).add(index));
        setLoadedImages(prev => new Map(prev).set(index, false));
      };

      img.src = src;
    });

    return () => {
      images.forEach((_, index) => {
        newLoadedImages.delete(index);
      });
    };
  }, [images]);

  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, isAutoPlaying]);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, []);

  const ImagePlaceholder = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
      <svg className="w-16 h-16 text-zinc-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p className="text-zinc-500 text-sm">Image unavailable</p>
    </div>
  );

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-2xl overflow-hidden">
        <ImagePlaceholder />
      </div>
    );
  }

  const currentImageFailed = failedImages.has(activeIndex);
  const currentImageLoaded = loadedImages.get(activeIndex);

  return (
    <div role="region" aria-label="Image gallery" className="w-full h-full flex flex-col justify-center items-center overflow-hidden relative rounded-2xl bg-zinc-100">
      <div aria-live="polite" aria-atomic="true" className="contents">
        {currentImageLoaded === undefined && !currentImageFailed && (
          <div className="absolute inset-0 bg-zinc-200 animate-pulse" />
        )}

        {currentImageFailed || !images[activeIndex] ? (
          placeholderSrc ? (
            <img
              src={placeholderSrc}
              alt="Placeholder"
              className="w-full h-full object-cover"
            />
          ) : (
            <ImagePlaceholder />
          )
        ) : (
          <img
            loading="lazy"
            src={images[activeIndex]}
            alt={`Slide ${activeIndex + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={() => {
              setFailedImages(prev => new Set(prev).add(activeIndex));
            }}
          />
        )}
      </div>
      {images.length > 1 && (
        <div role="tablist" aria-label="Slides" className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 border border-zinc-300/50 px-3 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg">
          {images.map((_, index) => {
            const isFailed = failedImages.has(index);
            return (
              <button
                key={index}
                role="tab"
                aria-selected={index === activeIndex}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`relative transition-all duration-200 ${
                  index === activeIndex 
                    ? "w-6 h-2" 
                    : "w-2 h-2"
                } rounded-full ${
                  isFailed 
                    ? "bg-red-400" 
                    : index === activeIndex 
                    ? "bg-sky-500" 
                    : "bg-zinc-300 hover:bg-zinc-400"
                }`}
                title={isFailed ? "Image failed to load" : undefined}
              />
            );
          })}
        </div>
      )}
      {!isAutoPlaying && images.length > 1 && (
        <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm">
          Paused
        </div>
      )}
    </div>
  );
}

export default ImageSlider;
