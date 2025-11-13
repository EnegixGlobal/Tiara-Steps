import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Axios from "../Axios";
import MultiSelectBox from "./MultiSelectBox";

const ProductForm = ({
  data,
  handleInputChange,
  link,
  changeLink,
  imageLinks,
  changeImageLinks,
  fields,
  changeFields,
  name,
  handleSubmit,
  handleCancel,
  changeCategory,
}) => {
  const uploadImageToCloudinary = async (file, skipRemoveBg = false) => {
    try {
      let fileToUpload = file;
      
      // Try to remove background first (unless skipRemoveBg is true)
      if (!skipRemoveBg) {
        try {
          let formData = new FormData();
          formData.append("size", "auto");
          formData.append("image_file", file);
          
          const response = await axios({
            method: "post",
            url: "https://api.remove.bg/v1.0/removebg",
            data: formData,
            responseType: "arraybuffer",
            headers: {
              "X-Api-Key": `${import.meta.env.VITE_REACT_APP_REMOVEBG_KEY}`,
            },
            timeout: 30000, // 30 second timeout
          });

          if (response.status === 200 && response.data) {
            // Create a Blob from the response data
            const blob = new Blob([response.data], { type: "image/png" });
            fileToUpload = blob;
          } else {
            // If remove.bg fails, use original file
            console.warn("Background removal failed, uploading original image");
          }
        } catch (removeBgError) {
          // If remove.bg fails, upload original file directly
          console.warn("Background removal error, uploading original image:", removeBgError.message);
          fileToUpload = file;
        }
      }

      // Upload to Cloudinary (either processed or original)
      const formData = new FormData();
      
      // If it's a Blob, use it directly, otherwise append the file
      if (fileToUpload instanceof Blob) {
        formData.append("file", fileToUpload, "photo.png");
      } else {
        formData.append("file", fileToUpload);
      }
      
      formData.append("upload_preset", "tiarasteps");
      formData.append("folder", "image");

      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dnwcwqhue/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000, // 60 second timeout
        }
      );

      if (cloudinaryResponse.data && cloudinaryResponse.data.secure_url) {
        return cloudinaryResponse.data.secure_url;
      } else {
        throw new Error("Cloudinary did not return a secure URL");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      const errorMessage = error.response?.data?.error?.message || 
                          error.message || 
                          "Failed to upload image. Please try again.";
      // Don't show toast here - let handleMultipleFiles handle it
      throw new Error(errorMessage);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadImageToCloudinary(file);
        if (imageUrl) {
          changeLink(imageUrl);
          toast.success("Image uploaded successfully");
        }
      } catch (error) {
        toast.error(error.message || "Failed to upload image. Please try again.");
      }
    }
  };

  const handleMultipleFiles = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Clear the input so same files can be selected again
    event.target.value = "";

    toast.info(`Uploading ${files.length} image(s)...`);
    
    // Upload files one by one with better error handling
    const uploadedUrls = [];
    const failedUploads = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const url = await uploadImageToCloudinary(file);
        if (url) {
          uploadedUrls.push(url);
        } else {
          failedUploads.push(file.name || `Image ${i + 1}`);
        }
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        failedUploads.push(file.name || `Image ${i + 1}`);
      }
    }
    
    // Update image links with successful uploads
    if (uploadedUrls.length > 0) {
      const currentImages = imageLinks || [];
      const newImageLinks = [...currentImages, ...uploadedUrls];
      changeImageLinks(newImageLinks);
      
      if (failedUploads.length > 0) {
        toast.warning(
          `${uploadedUrls.length} image(s) uploaded successfully. ${failedUploads.length} failed: ${failedUploads.join(", ")}`,
          { autoClose: 5000 }
        );
      } else {
        toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
      }
    } else {
      toast.error(`Failed to upload all ${files.length} image(s). Please try again.`);
    }
  };

  const removeImage = (index) => {
    if (!imageLinks || imageLinks.length === 0) return;
    const newImageLinks = imageLinks.filter((_, i) => i !== index);
    changeImageLinks(newImageLinks);
    toast.success("Image removed");
  };

  const handleChange = (index, size, event) => {
    const newFields = [...fields];
    if (!newFields[index]) {
      newFields[index] = { size: size, quantity: 0 };
    }
    newFields[index].quantity = event.target.value;
    changeFields(newFields);
  };
  const [options, setOptions] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await Axios.get("product/options");
        console.log(res.data);
        setOptions({ ...res.data });
        // setOptions(res.data.brandOptions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const token = localStorage.getItem("jwtAdmin");
        if (!token) {
          console.log("No admin token found");
          return;
        }
        const res = await Axios.get("/colors", {
          headers: {
            Authorization: token,
          },
        });
        if (res.data.success) {
          const colorNames = res.data.colors.map((color) => color.name);
          setColors(colorNames);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchColors();
  }, []);

  // const colors = [
  //   "Red",
  //   "Green",
  //   "Blue",
  //   "Cyan",
  //   "Magenta",
  //   "Yellow",
  //   "Black",
  //   "White",
  //   "Grey",
  //   "Lime",
  //   "Maroon",
  //   "Navy",
  //   "Olive",
  //   "Purple",
  //   "Silver",
  //   "Biege",
  //   "Cream",
  //   "Brown",
  //   "Orange",
  //   "Pink",
  // ];
  return (
    <form className="w-full flex flex-col">
      <div className="flex flex-row gap-4 mb-6 max-[768px]:flex-col">
        <div className="w-full flex flex-col gap-4">
          <div className="w-full">
            <label htmlFor="name" className="text-sm font-medium text-[#1a1a1a] mb-2 block">
              Product Name
            </label>
            <input
              type="text"
              className="py-2 px-3 text-sm font-normal text-[#1a1a1a] bg-white border border-[#ccc] rounded w-full outline-none focus:border-[#54bab9] transition-colors"
              id="name"
              placeholder="Enter product name"
              value={data.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="w-full">
            <label htmlFor="desc" className="text-sm font-medium text-[#1a1a1a] mb-2 block">
              Product Description
            </label>
            <textarea
              rows={4}
              placeholder="Enter product description"
              id="desc"
              className="py-2 px-3 text-sm font-normal text-[#1a1a1a] bg-white border border-[#ccc] rounded w-full outline-none focus:border-[#54bab9] transition-colors resize-y"
              value={data.desc}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full">
            <label htmlFor="sku" className="text-sm font-medium text-[#1a1a1a] mb-2 block">
              Product SKU Number
            </label>
            <input
              type="text"
              className="py-2 px-3 text-sm font-normal text-[#1a1a1a] bg-white border border-[#ccc] rounded w-full outline-none focus:border-[#54bab9] transition-colors"
              id="sku"
              value={data.sku}
              onChange={handleInputChange}
              placeholder="Enter product SKU number"
            />
          </div>
          <div className="w-full">
            <label htmlFor="price" className="text-sm font-medium text-[#1a1a1a] mb-2 block">
              Price
            </label>
            <input
              type="number"
              className="py-2 px-3 text-sm font-normal text-[#1a1a1a] bg-white border border-[#ccc] rounded w-full outline-none focus:border-[#54bab9] transition-colors"
              id="price"
              value={data.price}
              onChange={handleInputChange}
              min={0}
              placeholder="Enter product price"
            />
          </div>
        </div>
        <div className="w-full max-[768px]:w-full">
          {/* Main Image Upload */}
          <div className="mb-4">
            <label className="text-sm font-medium text-[#1a1a1a] mb-2 block">
              Main Product Image (Required)
            </label>
            <label htmlFor="dropzone-file" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#ccc] rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                {link ? (
                  <img src={link} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-10 h-10 mb-3 text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> main image
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or WEBP</p>
                  </div>
                )}
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>

          {/* Multiple Images Upload */}
          <div>
            <label className="text-sm font-medium text-[#1a1a1a] mb-2 block">
              Additional Product Images (Optional)
            </label>
            <label htmlFor="multiple-images" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center w-full py-4 border-2 border-dashed border-[#ccc] rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <svg
                  className="w-8 h-8 mb-2 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> multiple images
                </p>
                <p className="text-xs text-gray-500">You can select multiple files</p>
              </div>
              <input
                id="multiple-images"
                type="file"
                className="hidden"
                onChange={handleMultipleFiles}
                accept="image/*"
                multiple
              />
            </label>

            {/* Display uploaded multiple images */}
            {imageLinks && imageLinks.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">
                  {imageLinks.length} image(s) uploaded
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {imageLinks.map((imgUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imgUrl}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-red-600"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="w-full">
          <label htmlFor="color" className="text-sm font-medium text-[#1a1a1a] mb-2 block">
            Product Color
          </label>
          <select
            className="py-2 px-3 text-sm font-normal text-[#1a1a1a] bg-white border border-[#ccc] rounded w-full outline-none focus:border-[#54bab9] transition-colors"
            id="color"
            onChange={handleInputChange}
            value={data.color}
          >
            <option value="">Select a color</option>
            {colors.map((color, index) => (
              <option key={index} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="brand" className="text-sm font-medium text-[#1a1a1a] mb-2 block">
            Product Brand
          </label>
          <select
            className="py-2 px-3 text-sm font-normal text-[#1a1a1a] bg-white border border-[#ccc] rounded w-full outline-none focus:border-[#54bab9] transition-colors"
            id="brand"
            onChange={handleInputChange}
            value={data.brand}
          >
            <option value="">Select a brand</option>
            {options.brandOptions &&
              options.brandOptions.map((brand, index) => (
                <option key={index} value={brand}>
                  {brand}
                </option>
              ))}
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="material" className="text-sm font-medium text-[#1a1a1a] mb-2 block">
            Product Material
          </label>
          <input
            type="text"
            className="py-2 px-3 text-sm font-normal text-[#1a1a1a] bg-white border border-[#ccc] rounded w-full outline-none focus:border-[#54bab9] transition-colors"
            id="material"
            value={data.material}
            onChange={handleInputChange}
            placeholder="Enter product material"
          />
        </div>
        <div className="w-full">
          <label htmlFor="featured" className="text-sm font-medium text-[#1a1a1a] mb-2 block">
            Product Featured
          </label>
          <select
            className="py-2 px-3 text-sm font-normal text-[#1a1a1a] bg-white border border-[#ccc] rounded w-full outline-none focus:border-[#54bab9] transition-colors"
            id="featured"
            onChange={handleInputChange}
            value={data.featured}
          >
            <option value="false">false</option>
            <option value="true">true</option>
          </select>
        </div>
      </div>
      <div className="w-full mb-6">
        <label htmlFor="category" className="text-sm font-medium text-[#1a1a1a] mb-2 block">
          Product Category
        </label>
        <MultiSelectBox
          customWidth={true}
          multiple={true}
          options={
            options.categoryOptions
              ? options.categoryOptions.map((category) => ({
                  value: category,
                  label: category,
                }))
              : []
          }
          value={data.category === "" ? [] : data.category.split(",")}
          onChange={(e) => {
            changeCategory(e.join(","));
          }}
        />
      </div>
      <div className="w-full mb-6 overflow-x-auto">
        <table className="min-w-full border border-[#ccc] rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wide text-[#1a1a1a] text-left border-b border-[#ccc]">
                Size
              </th>
              {Array.from({ length: 12 }, (_, i) => i + 3).map(
                (size, index) => (
                  <th
                    key={index}
                    className="py-3 px-4 text-xs font-bold uppercase tracking-wide text-[#1a1a1a] text-center border-b border-[#ccc]"
                  >
                    {size}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 px-4 text-sm text-[#1a1a1a] border-b border-[#ccc] font-medium">
                Quantity
              </td>
              {Array.from({ length: 12 }, (_, i) => i + 3).map(
                (size, index) => (
                  <td
                    key={index}
                    className="py-0 px-0 border-b border-[#ccc]"
                  >
                    <input
                      type="number"
                      className="w-full h-full text-center py-3 px-2 border-none outline-none focus:bg-gray-50 transition-colors text-sm text-[#1a1a1a]"
                      min={0}
                      id={`qty${index}`}
                      name="quantity"
                      value={fields[index]?.quantity || 0}
                      placeholder="0"
                      onChange={(event) => handleChange(index, size, event)}
                    />
                  </td>
                )
              )}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-4 mt-4 max-[650px]:flex-col">
        <button
          type="button"
          onClick={handleCancel}
          className="py-2 px-6 w-36 text-base font-medium text-[#1a1a1a] bg-gray-200 border border-gray-300 rounded cursor-pointer hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="py-2 px-6 w-36 text-base font-medium text-white bg-[#54bab9] border-none rounded cursor-pointer hover:bg-[#45a5a4] transition-colors"
        >
          {name}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
