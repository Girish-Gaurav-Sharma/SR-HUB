import { useState, useRef } from 'react';

export const useImageProcessing = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [rgbValue, setRgbValue] = useState(null);
  const canvasRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file is an image
      if (!file.type.startsWith('image/')) {
        console.error('File is not an image');
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
      };
      
      reader.readAsDataURL(file);
    }
  };

  return {
    selectedImage,
    imagePreview,
    rgbValue,
    setRgbValue,
    canvasRef,
    zoomLevel,
    setZoomLevel,
    panPosition,
    setPanPosition,
    handleImageChange
  };
};