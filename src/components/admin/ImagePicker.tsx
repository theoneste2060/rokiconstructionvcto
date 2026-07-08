import { useEffect, useRef, useState } from "react";
import { listImages, uploadImage, type AdminAuth } from "~/server/functions";

/**
 * Modal image gallery + uploader. Shows every image in the site's library,
 * accepts drag & drop (or click-to-browse) uploads, and returns the chosen
 * image path via onSelect.
 */
export function ImagePickerModal({
  auth,
  onSelect,
  onClose,
}: {
  auth: AdminAuth;
  onSelect: (path: string) => void;
  onClose: () => void;
}) {
  const [images, setImages] = useState<string[] | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = async () => {
    const result = await listImages({ data: { auth } }).catch(() => ({ ok: false, images: [] }));
    setImages(result.images);
  };
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiles = async (files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const dataBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      const result = await uploadImage({ data: { auth, filename: file.name, dataBase64 } });
      if (result.ok && result.path) {
        await load();
        onSelect(result.path);
      } else {
        setError(result.error ?? "Upload failed.");
      }
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">Choose an Image</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Upload zone */}
        <div className="px-5 pt-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              void handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInput.current?.click()}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
              dragging
                ? "border-primary bg-primary/10"
                : "border-gray-300 dark:border-gray-700 hover:border-primary/60 hover:bg-primary/5"
            }`}
          >
            <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {uploading ? "Uploading…" : "Drag & drop an image here, or click to browse"}
            </span>
            <span className="text-xs text-gray-400">PNG, JPG, WEBP or GIF — up to 8 MB</span>
            <input
              ref={fileInput}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => e.target.files && void handleFiles(e.target.files)}
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>

        {/* Gallery */}
        <div className="flex-1 overflow-y-auto p-5">
          {images === null ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading images…</p>
          ) : images.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No images yet — upload one above.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {images.map((img) => (
                <button
                  key={img}
                  onClick={() => onSelect(img)}
                  title={img}
                  className="group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-primary focus:border-primary focus:outline-none transition-colors"
                >
                  <img src={img} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 px-1.5 py-1 text-[10px] text-white bg-black/60 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {img.split("/").pop()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
