import { useRef, useState } from "react";
import MediaModal from "./MediaModal";
import { SlPicture } from "react-icons/sl";
import { FaPaperclip } from "react-icons/fa6";
import { motion as Motion, AnimatePresence } from "framer-motion";

const MediaUploadButton = ({ id }) => {
  const mediaModal = useRef(null);
  const [isDropUpOpen, setIsDropUpOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const handleShowMedia = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      // Si es imagen o video, genera la preview
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
          mediaModal.current.showModal();
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };
  return (
    <>
      <div className="relative">
        <button
          className={`cursor-pointer transition-colors duration-200 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-200 ${
            isDropUpOpen ? "bg-gray-200" : ""
          }`}
          onClick={() => setIsDropUpOpen((prev) => !prev)}
        >
          <FaPaperclip size={20} />
        </button>

        <AnimatePresence>
          {isDropUpOpen && (
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-12 left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-40 z-20"
            >
              <label className="w-full cursor-pointer flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 text-gray-700">
                <SlPicture />
                <span>Foto o video</span>
                <input
                  type="file"
                  hidden
                  accept=".jpg, .jpeg, .png, .gif, .webp, .mp4"
                  onChange={handleShowMedia}
                />
              </label>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal para mostrar archivos multimedia */}
      <MediaModal
        ref={mediaModal}
        file={file}
        filePreview={filePreview}
        id={id}
      />
    </>
  );
};

export default MediaUploadButton;
