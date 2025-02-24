import React, { useState } from "react";

const ImageUpload = ({ onImageSelect }) => {
  const [imagePreview, setImagePreview] = useState("");

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        onImageSelect(reader.result); // Send image data to parent component
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 whitespace-nowrap">
        <label className="font-semibold text-[#333]">
          Profile Image(Max :10KB):
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:border-2 file:border-[#91aeb2] file:rounded-lg file:bg-[#91aeb2] file:px-4 file:py-2 file:text-sm file:cursor-pointer"
        />
      </div>

      {imagePreview && (
        <div className="w-16 h-16 relative left-[300px] ">
          <img
            src={imagePreview}
            alt="Profile Preview"
            className="w-full h-full rounded-full border-2 border-gray-300 object-cover shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
