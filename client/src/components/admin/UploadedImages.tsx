import { LuX } from "react-icons/lu";

function UploadedImages({
  uploaded,
  removeFiles,
  uploadStatus,
}: {
  uploaded: File[] | null;
  removeFiles: (file: File) => void;
  uploadStatus: boolean;
}) {
  return (
    <div className="flex w-full justify-start items-start flex-wrap gap-2 gap-y-0">
      {uploaded && (
        <>
          {uploaded.map((img, index) => {
            const url = URL.createObjectURL(img);
            return (
              <div
                key={index}
                className="w-20 h-20 shadow-sm rounded-xl my-8 relative border border-surface-200 p-1 motion-safe:animate-scaleIn motion-safe:[animation-fill-mode:backwards]"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {!uploadStatus && (
                  <button
                    onClick={() => {
                      if (uploaded) {
                        removeFiles(img);
                      }
                    }}
                    className="p-1.5 cursor-pointer hover:bg-red-700 motion-safe:duration-150 bg-red-500 text-white shadow-md rounded-lg absolute -top-2 -right-2 z-50 motion-safe:transition-colors motion-safe:duration-150"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <LuX size={14} />
                  </button>
                )}
                <img
                  className="w-full h-full rounded-lg object-cover"
                  src={url}
                  alt={`Upload preview ${index + 1}`}
                />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default UploadedImages;
