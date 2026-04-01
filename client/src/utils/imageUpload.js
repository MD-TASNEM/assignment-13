/**
 * ImageBB Upload Utility
 * Upload images to imageBB and get hosted URL
 */

const IMAGEBB_API_KEY =
  import.meta.env.VITE_IMAGEBB_API_KEY || "your_imagebb_api_key";

export const uploadToImageBB = async (file) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP)",
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("File size exceeds 5MB limit");
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("key", IMAGEBB_API_KEY);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || "Image upload failed");
    }

    return {
      success: true,
      url: data.data.url,
      imageId: data.data.id,
      deleteUrl: data.data.delete_url,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Convert file input to base64 for preview
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Get file info for validation
 */
export const getFileInfo = (file) => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    sizeInMB: (file.size / (1024 * 1024)).toFixed(2),
  };
};
