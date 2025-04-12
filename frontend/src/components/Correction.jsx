import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCloudUploadAlt, FaTrash, FaExclamationTriangle, 
  FaUndo, FaDownload, FaWrench, FaSatellite, FaPlane, 
  FaChartBar, FaImage, FaTimes, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import Analysis from './Analysis';

// Sample images
import satelliteImage1 from '../../public/sattelite.png';
import droneImage1 from '../../public/1.jpg';
import droneImage2 from '../../public/2.jpg';
import droneImage3 from '../../public/3.jpg';
import droneImage4 from '../../public/4.jpg';
import droneImage5 from '../../public/5.jpg';
import droneImage6 from '../../public/6.jpg';
import droneImage7 from '../../public/7.jpg';

// Constants
const MAX_FILE_SIZE_MB = 100;
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];
const dummySatelliteImages = [satelliteImage1];
const dummyDroneImages = [
  droneImage1, droneImage2, droneImage3, droneImage4, 
  droneImage5, droneImage6, droneImage7
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const errorVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 500, damping: 15 }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
};

// Helper components
const AnimatedLoader = () => (
  <motion.div 
    className="flex justify-center items-center my-8 py-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="relative w-16 h-16">
      <motion.div 
        className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-t-4 border-blue-600 border-opacity-80"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute top-1 left-1 right-1 bottom-1 rounded-full border-t-4 border-green-500 border-opacity-80"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  </motion.div>
);

// Reusable Gallery Popup Component
const ImageGalleryPopup = ({ isOpen, onClose, onImageSelect, images, title, buttonColor }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleImageClick = (idx) => setSelectedIndex(idx);
  const handleCloseFullscreen = () => setSelectedIndex(null);

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSelectImage = (src) => {
    onImageSelect(src);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-white/95 z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <motion.button
              onClick={onClose}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTimes className="text-gray-700" />
            </motion.button>
          </div>
          <div className="p-5 grid grid-cols-3 md:grid-cols-5 gap-4 overflow-y-auto flex-grow">
            {images.map((imageSrc, index) => (
              <motion.div key={index}>
                <motion.img
                  src={imageSrc}
                  alt={`Gallery Image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md shadow-sm hover:shadow-lg cursor-pointer transition-all duration-200"
                  onClick={() => handleImageClick(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
                <button
                  className={`mt-2 w-full bg-${buttonColor}-600 hover:bg-${buttonColor}-700 text-white text-sm py-1 rounded-md`}
                  onClick={() => handleSelectImage(imageSrc)}
                >
                  Select
                </button>
              </motion.div>
            ))}
          </div>
          
          <AnimatePresence>
            {selectedIndex !== null && (
              <motion.div
                className="fixed top-0 left-0 w-full h-full bg-black/80 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={handleCloseFullscreen}
              >
                <motion.img
                  src={images[selectedIndex]}
                  alt="Fullscreen Image"
                  className="max-w-screen-lg max-h-screen object-contain cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.button
                  onClick={handleCloseFullscreen}
                  className="absolute top-6 right-6 p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes className="text-gray-700" />
                </motion.button>
                <motion.button
                  onClick={handlePrev}
                  className="absolute left-6 p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaChevronLeft className="text-gray-700" />
                </motion.button>
                <motion.button
                  onClick={handleNext}
                  className="absolute right-14 p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaChevronRight className="text-gray-700" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Reusable Image Editor Component
const ImageEditor = ({ 
  type,
  imageSrc, 
  setImageSrc,
  crop, 
  setCrop, 
  zoom, 
  setZoom, 
  handleCropComplete,
  resetEditor,
  resetAll,
  showCroppedImage,
  imageDimensions,
  isGalleryOpen,
  setIsGalleryOpen,
  galleryImages,
  color
}) => {
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        return false;
      }
      
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return false;
      }
      
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGallerySelect = (imageSrc) => {
    setImageSrc(imageSrc);
    setIsGalleryOpen(false);
  };

  return (
    <div className="border border-gray-200 p-5 rounded-md shadow-sm bg-white">
      <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
        <motion.div
          initial={{ rotate: type === 'satellite' ? -90 : 90 }}
          animate={{ rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
        >
          {type === 'satellite' ? 
            <FaSatellite className="text-blue-600 mr-3 text-xl" /> : 
            <FaPlane className="text-green-600 mr-3 text-xl" />
          }
        </motion.div>
        <h2 className="text-xl font-bold text-gray-800">
          {type === 'satellite' ? 'Satellite Image' : 'Drone Image'}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {!imageSrc && (
          <motion.div 
            className="mb-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div 
              className={`p-8 md:p-10 border-dashed border-2 border-${color}-300 rounded-md text-center bg-gradient-to-b from-white/80 to-${color}-50/60 shadow-md hover:shadow-lg hover:border-${color}-400 transition-all duration-300 group flex-1`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <FaImage className={`mx-auto text-4xl md:text-5xl text-${color}-500 mb-4 group-hover:scale-110 transition-transform duration-300`} />
              </motion.div>
              <motion.p 
                className="mb-5 text-gray-700 font-medium"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Select an Image
              </motion.p>
              
              <motion.label
                htmlFor={`${type}FileInput`}
                className={`cursor-pointer inline-block bg-${color}-600 hover:bg-${color}-700 text-white font-medium px-5 py-2 rounded-md transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 mb-3`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                Upload from Device
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={ACCEPTED_FILE_TYPES.join(',')}
                  className="hidden"
                  id={`${type}FileInput`}
                />
              </motion.label>

              <motion.button
                onClick={() => setIsGalleryOpen(true)}
                className={`cursor-pointer inline-block bg-${color}-600 hover:bg-${color}-700 text-white font-medium px-5 py-2 rounded-md transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                Select from Gallery
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ImageGalleryPopup
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onImageSelect={handleGallerySelect}
        images={galleryImages}
        title={type === 'satellite' ? 'Satellite Image Gallery' : 'Drone Image Gallery'}
        buttonColor={color}
      />

      <AnimatePresence>
        {imageSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div 
              className="relative w-full h-[20rem] border rounded-md overflow-hidden mb-4 bg-gray-100 shadow-inner"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                maxZoom={20}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </motion.div>
            
            {imageDimensions?.width > 0 && (
              <motion.div 
                className="mb-3 text-sm text-gray-600 bg-gray-50 inline-block px-3 py-1 rounded-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Original: {imageDimensions.width} × {imageDimensions.height}px
              </motion.div>
            )}
            
            <div className="flex flex-wrap items-center gap-2 mb-4 mt-2">
              <div className="flex space-x-2 mr-auto">
                <motion.button
                  onClick={() => setZoom(Math.min(20, zoom + 0.2))}
                  className={`bg-${color}-600 hover:bg-${color}-700 text-white px-3 py-1 rounded-md transition-all duration-200 shadow-sm text-sm`}
                  title="Zoom in"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Zoom In
                </motion.button>
                <motion.button
                  onClick={() => setZoom(Math.max(1, zoom - 0.2))}
                  className={`bg-${color}-600 hover:bg-${color}-700 text-white px-3 py-1 rounded-md transition-all duration-200 shadow-sm text-sm`}
                  title="Zoom out"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Zoom Out
                </motion.button>
                <motion.button
                  onClick={resetEditor}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md transition-all duration-200 shadow-sm text-sm"
                  title="Reset changes"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <FaUndo className="inline mr-1 -mt-0.5" /> Reset
                </motion.button>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  onClick={showCroppedImage}
                  className={`bg-${color}-600 hover:bg-${color}-700 text-white px-4 py-2 rounded-md transition-all duration-200 font-medium flex items-center justify-center`}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" 
                  }}
                >
                  Crop Image
                </motion.button>
                <motion.button
                  onClick={resetAll}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-all duration-200 font-medium flex items-center justify-center"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" 
                  }}
                >
                  <FaTrash className="inline mr-1 -mt-0.5" /> Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Image Processing Utilities
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  
  // Draw the cropped area
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Original cropped image
  const originalDataUrl = canvas.toDataURL('image/png');

  // Calculate average color
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let totalR = 0, totalG = 0, totalB = 0;
  for (let i = 0; i < imageData.data.length; i += 4) {
    totalR += imageData.data[i];
    totalG += imageData.data[i + 1];
    totalB += imageData.data[i + 2];
  }
  const count = imageData.data.length / 4;
  const avgR = Math.round(totalR / count);
  const avgG = Math.round(totalG / count);
  const avgB = Math.round(totalB / count);

  // Apply average color
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = avgR;
    imageData.data[i + 1] = avgG;
    imageData.data[i + 2] = avgB;
  }
  ctx.putImageData(imageData, 0, 0);

  // Averaged image
  const averagedDataUrl = canvas.toDataURL('image/png');

  return {
    originalDataUrl,
    averagedDataUrl,
    avgR,
    avgG,
    avgB
  };
};

// Main component
export default function Correction() {
  // Satellite image states
  const [satelliteImageSrc, setSatelliteImageSrc] = useState(null);
  const [satelliteCrop, setSatelliteCrop] = useState({ x: 0, y: 0 });
  const [satelliteZoom, setSatelliteZoom] = useState(1);
  const [satelliteCroppedAreaPixels, setSatelliteCroppedAreaPixels] = useState(null);
  const [satelliteOriginalCroppedImage, setSatelliteOriginalCroppedImage] = useState(null);
  const [satelliteAverageImage, setSatelliteAverageImage] = useState(null);
  const [satelliteAvgRgb, setSatelliteAvgRgb] = useState({ r: 0, g: 0, b: 0 });
  const [satelliteImageDimensions, setSatelliteImageDimensions] = useState({ width: 0, height: 0 });
  const [satelliteCorrectedImage, setSatelliteCorrectedImage] = useState(null);
  const [isSatelliteGalleryOpen, setIsSatelliteGalleryOpen] = useState(false);

  // Drone image states
  const [droneImageSrc, setDroneImageSrc] = useState(null);
  const [droneCrop, setDroneCrop] = useState({ x: 0, y: 0 });
  const [droneZoom, setDroneZoom] = useState(1);
  const [droneCroppedAreaPixels, setDroneCroppedAreaPixels] = useState(null);
  const [droneOriginalCroppedImage, setDroneOriginalCroppedImage] = useState(null);
  const [droneAverageImage, setDroneAverageImage] = useState(null);
  const [droneAvgRgb, setDroneAvgRgb] = useState({ r: 0, g: 0, b: 0 });
  const [droneImageDimensions, setDroneImageDimensions] = useState({ width: 0, height: 0 });
  const [isDroneGalleryOpen, setIsDroneGalleryOpen] = useState(false);

  // Shared states
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Crop completion handlers
  const onSatelliteCropComplete = useCallback((_, croppedAreaPixels) => {
    setSatelliteCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onDroneCropComplete = useCallback((_, croppedAreaPixels) => {
    setDroneCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // File validation
  const validateFile = (file) => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setError(`Unsupported file type. Please use JPG, PNG, WebP or TIFF.`);
      return false;
    }
    
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File exceeds ${MAX_FILE_SIZE_MB}MB. Please upload a smaller image.`);
      return false;
    }
    
    return true;
  };

  // Satellite image handling
  const handleSatelliteImageUpload = (file) => {
    if (!file) return;
    
    setSatelliteOriginalCroppedImage(null);
    setError(null);
    
    if (!validateFile(file)) return;
    
    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setSatelliteImageDimensions({
          width: img.width,
          height: img.height
        });
        setIsLoading(false);
      };
      img.src = reader.result;
      setSatelliteImageSrc(reader.result);
    };
    
    reader.onerror = () => {
      setError('Failed to read file');
      setIsLoading(false);
    };
    
    reader.readAsDataURL(file);
  };

  // Drone image handling
  const handleDroneImageUpload = (file) => {
    if (!file) return;
    
    setDroneOriginalCroppedImage(null);
    setError(null);
    
    if (!validateFile(file)) return;
    
    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setDroneImageDimensions({
          width: img.width,
          height: img.height
        });
        setIsLoading(false);
      };
      img.src = reader.result;
      setDroneImageSrc(reader.result);
    };
    
    reader.onerror = () => {
      setError('Failed to read file');
      setIsLoading(false);
    };
    
    reader.readAsDataURL(file);
  };

  // Reset functions
  const resetSatelliteEditor = () => {
    setSatelliteCrop({ x: 0, y: 0 });
    setSatelliteZoom(1);
  };
  
  const resetDroneEditor = () => {
    setDroneCrop({ x: 0, y: 0 });
    setDroneZoom(1);
  };
  
  const resetSatelliteAll = () => {
    setError(null);
    setSatelliteImageSrc(null);
    setSatelliteOriginalCroppedImage(null);
    setSatelliteAverageImage(null);
    setSatelliteAvgRgb({ r: 0, g: 0, b: 0 });
    setSatelliteCorrectedImage(null);
    resetSatelliteEditor();
  };
  
  const resetDroneAll = () => {
    setError(null);
    setDroneImageSrc(null);
    setDroneOriginalCroppedImage(null);
    setDroneAverageImage(null);
    setDroneAvgRgb({ r: 0, g: 0, b: 0 });
    resetDroneEditor();
  };

  // Cropping functions
  const showSatelliteCroppedImage = useCallback(async () => {
    if (!satelliteCroppedAreaPixels) return;
    
    try {
      setIsLoading(true);
      const { originalDataUrl, averagedDataUrl, avgR, avgG, avgB } = await getCroppedImg(
        satelliteImageSrc, 
        satelliteCroppedAreaPixels
      );
      setSatelliteOriginalCroppedImage(originalDataUrl);
      setSatelliteAverageImage(averagedDataUrl);
      setSatelliteAvgRgb({ r: avgR, g: avgG, b: avgB });
    } catch (e) {
      setError('Cropping failed');
    } finally {
      setIsLoading(false);
    }
  }, [satelliteImageSrc, satelliteCroppedAreaPixels]);
  
  const showDroneCroppedImage = useCallback(async () => {
    if (!droneCroppedAreaPixels) return;
    
    try {
      setIsLoading(true);
      const { originalDataUrl, averagedDataUrl, avgR, avgG, avgB } = await getCroppedImg(
        droneImageSrc, 
        droneCroppedAreaPixels
      );
      setDroneOriginalCroppedImage(originalDataUrl);
      setDroneAverageImage(averagedDataUrl);
      setDroneAvgRgb({ r: avgR, g: avgG, b: avgB });
    } catch (e) {
      setError('Cropping failed');
    } finally {
      setIsLoading(false);
    }
  }, [droneImageSrc, droneCroppedAreaPixels]);
  
  // Analysis functions
  const calculateRgbDifferencePercentage = () => {
    if (!satelliteAvgRgb || !droneAvgRgb) return null;
    
    return {
      r: droneAvgRgb.r === 0 ? 0 : (((droneAvgRgb.r - satelliteAvgRgb.r) / droneAvgRgb.r) * 100).toFixed(1),
      g: droneAvgRgb.g === 0 ? 0 : (((droneAvgRgb.g - satelliteAvgRgb.g) / droneAvgRgb.g) * 100).toFixed(1),
      b: droneAvgRgb.b === 0 ? 0 : (((droneAvgRgb.b - satelliteAvgRgb.b) / droneAvgRgb.b) * 100).toFixed(1)
    };
  };

  const calculateColorDifferencePercentage = () => {
    if (!satelliteAvgRgb || !droneAvgRgb) return null;
    
    const droneMagnitude = Math.sqrt(
      droneAvgRgb.r * droneAvgRgb.r + 
      droneAvgRgb.g * droneAvgRgb.g + 
      droneAvgRgb.b * droneAvgRgb.b
    );
    
    if (droneMagnitude === 0) return "0.0";
    
    const dr = droneAvgRgb.r - satelliteAvgRgb.r;
    const dg = droneAvgRgb.g - satelliteAvgRgb.g;
    const db = droneAvgRgb.b - satelliteAvgRgb.b;
    
    const distance = Math.sqrt(dr*dr + dg*dg + db*db);
    return ((distance / droneMagnitude) * 100).toFixed(1);
  };

  // Apply correction
  const applyCorrection = useCallback(async () => {
    if (!satelliteImageSrc || !satelliteAvgRgb || !droneAvgRgb) return;
    
    setIsLoading(true);
    try {
      const img = await createImage(satelliteImageSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const rgbDiff = calculateRgbDifferencePercentage();
      
      for (let i = 0; i < imageData.data.length; i += 4) {
        const rAdjustment = (parseFloat(rgbDiff.r) / 100) * droneAvgRgb.r;
        const gAdjustment = (parseFloat(rgbDiff.g) / 100) * droneAvgRgb.g;
        const bAdjustment = (parseFloat(rgbDiff.b) / 100) * droneAvgRgb.b;
        
        imageData.data[i] = Math.min(255, Math.max(0, Math.round(imageData.data[i] - rAdjustment)));
        imageData.data[i + 1] = Math.min(255, Math.max(0, Math.round(imageData.data[i + 1] - gAdjustment)));
        imageData.data[i + 2] = Math.min(255, Math.max(0, Math.round(imageData.data[i + 2] - bAdjustment)));
      }
      
      ctx.putImageData(imageData, 0, 0);
      const correctedDataUrl = canvas.toDataURL('image/png');
      setSatelliteCorrectedImage(correctedDataUrl);
    } catch (e) {
      setError('Image correction failed');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [satelliteImageSrc, satelliteAvgRgb, droneAvgRgb, calculateRgbDifferencePercentage]);

  return (
    <motion.div 
      className="backdrop-blur-sm bg-white/90 text-gray-800 p-5 md:p-8 overflow-y-auto rounded-md shadow-lg w-full max-w-5xl mx-auto my-5 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-xl font-bold text-gray-800 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Image Comparison
      </motion.h1>

      <AnimatePresence>
        {error && (
          <motion.div 
            className="mt-5 mb-5 text-red-600 flex items-center bg-red-50 p-4 rounded-md border-l-4 border-red-500 shadow-sm"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <FaExclamationTriangle className="mr-3 flex-shrink-0" /> 
            <span className="font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoading && <AnimatedLoader />}
      </AnimatePresence>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Satellite Image Editor */}
        <motion.div variants={itemVariants}>
          <ImageEditor
            type="satellite"
            imageSrc={satelliteImageSrc}
            setImageSrc={setSatelliteImageSrc}
            crop={satelliteCrop}
            setCrop={setSatelliteCrop}
            zoom={satelliteZoom}
            setZoom={setSatelliteZoom}
            handleCropComplete={onSatelliteCropComplete}
            resetEditor={resetSatelliteEditor}
            resetAll={resetSatelliteAll}
            showCroppedImage={showSatelliteCroppedImage}
            imageDimensions={satelliteImageDimensions}
            isGalleryOpen={isSatelliteGalleryOpen}
            setIsGalleryOpen={setIsSatelliteGalleryOpen}
            galleryImages={dummySatelliteImages}
            color="blue"
          />

          <AnimatePresence>
            {satelliteOriginalCroppedImage && !isLoading && (
              <motion.div 
                className="mt-5 bg-white p-5 rounded-md shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="font-semibold text-lg text-gray-800 mb-2 pb-1 border-b border-gray-100">Cropped Pixels</h3>
                <motion.img
                  src={satelliteOriginalCroppedImage}
                  alt="Satellite Cropped"
                  className="border border-gray-200 rounded-md mb-3 max-w-full object-contain hover:shadow-md transition-shadow duration-300"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {satelliteAverageImage && !isLoading && (
              <motion.div 
                className="mt-5 bg-white p-5 rounded-md shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h3 className="font-semibold text-lg text-gray-800 mb-2 pb-1 border-b border-gray-100">Averaged Pixels</h3>
                <motion.img
                  src={satelliteAverageImage}
                  alt="Satellite Averaged"
                  className="border border-gray-200 rounded-md mb-3 max-w-full object-contain hover:shadow-md transition-shadow duration-300"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.p 
                  className="text-gray-700 font-medium text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  Average RGB: R = {satelliteAvgRgb.r}, G = {satelliteAvgRgb.g}, B = {satelliteAvgRgb.b}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Drone Image Editor */}
        <motion.div variants={itemVariants}>
          <ImageEditor
            type="drone"
            imageSrc={droneImageSrc}
            setImageSrc={setDroneImageSrc}
            crop={droneCrop}
            setCrop={setDroneCrop}
            zoom={droneZoom}
            setZoom={setDroneZoom}
            handleCropComplete={onDroneCropComplete}
            resetEditor={resetDroneEditor}
            resetAll={resetDroneAll}
            showCroppedImage={showDroneCroppedImage}
            imageDimensions={droneImageDimensions}
            isGalleryOpen={isDroneGalleryOpen}
            setIsGalleryOpen={setIsDroneGalleryOpen}
            galleryImages={dummyDroneImages}
            color="green"
          />

          <AnimatePresence>
            {droneOriginalCroppedImage && !isLoading && (
              <motion.div 
                className="mt-5 bg-white p-5 rounded-md shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="font-semibold text-lg text-gray-800 mb-2 pb-1 border-b border-gray-100">Cropped Pixels</h3>
                <motion.img
                  src={droneOriginalCroppedImage}
                  alt="Drone Cropped"
                  className="border border-gray-200 rounded-md mb-3 max-w-full object-contain hover:shadow-md transition-shadow duration-300"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {droneAverageImage && !isLoading && (
              <motion.div 
                className="mt-5 bg-white p-5 rounded-md shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h3 className="font-semibold text-lg text-gray-800 mb-2 pb-1 border-b border-gray-100">Averaged Pixels</h3>
                <motion.img
                  src={droneAverageImage}
                  alt="Drone Averaged"
                  className="border border-gray-200 rounded-md mb-3 max-w-full object-contain hover:shadow-md transition-shadow duration-300"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.p 
                  className="text-gray-700 font-medium text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  Average RGB: R = {droneAvgRgb.r}, G = {droneAvgRgb.g}, B = {droneAvgRgb.b}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Color Comparison Section */}
      <AnimatePresence>
        {(satelliteAverageImage && droneAverageImage) && (
          <motion.div 
            className="mt-5 bg-white p-5 rounded-md shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Color Comparison</h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Comparison details rendered here */}
              {/* Satellite color box */}
              <motion.div variants={itemVariants}>
                <h3 className="font-medium text-gray-700 mb-2">Satellite Image</h3>
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="w-12 h-12 rounded-md shadow-md border border-gray-200" 
                    style={{backgroundColor: `rgb(${satelliteAvgRgb.r}, ${satelliteAvgRgb.g}, ${satelliteAvgRgb.b})`}}
                    initial={{ scale: 0, borderRadius: "50%" }}
                    animate={{ scale: 1, borderRadius: "6px" }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  />
                  <motion.span 
                    className="font-mono text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    RGB({satelliteAvgRgb.r}, {satelliteAvgRgb.g}, {satelliteAvgRgb.b})
                  </motion.span>
                </div>
              </motion.div>
              
              {/* Drone color box */}
              <motion.div variants={itemVariants}>
                <h3 className="font-medium text-gray-700 mb-2">Drone Image</h3>
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="w-12 h-12 rounded-md shadow-md border border-gray-200" 
                    style={{backgroundColor: `rgb(${droneAvgRgb.r}, ${droneAvgRgb.g}, ${droneAvgRgb.b})`}}
                    initial={{ scale: 0, borderRadius: "50%" }}
                    animate={{ scale: 1, borderRadius: "6px" }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  />
                  <motion.span 
                    className="font-mono text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    RGB({droneAvgRgb.r}, {droneAvgRgb.g}, {droneAvgRgb.b})
                  </motion.span>
                </div>
              </motion.div>
              
              {/* Difference analysis */}
              <motion.div variants={itemVariants}>
                <h3 className="font-medium text-gray-700 mb-2">RGB Difference</h3>
                {calculateRgbDifferencePercentage() && (
                  <>
                    <div className="flex items-center space-x-3 mb-2">
                      <motion.div 
                        className="w-12 h-12 rounded-md shadow-md border border-gray-200" 
                        style={{
                          background: `linear-gradient(135deg, 
                            rgb(${satelliteAvgRgb.r}, ${satelliteAvgRgb.g}, ${satelliteAvgRgb.b}) 0%, 
                            rgb(${droneAvgRgb.r}, ${droneAvgRgb.g}, ${droneAvgRgb.b}) 100%)`
                        }}
                        initial={{ scale: 0, borderRadius: "50%" }}
                        animate={{ scale: 1, borderRadius: "6px" }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      />
                      <motion.div 
                        className="font-mono text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, staggerChildren: 0.1 }}
                      >
                        <motion.div 
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          R: {calculateRgbDifferencePercentage().r}%
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          G: {calculateRgbDifferencePercentage().g}%
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          B: {calculateRgbDifferencePercentage().b}%
                        </motion.div>
                      </motion.div>
                    </div>
                    <motion.div 
                      className="mt-2 p-2 bg-gray-50 rounded-md"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="text-gray-700 font-medium">Total difference: </span>
                      <span className="font-mono">{calculateColorDifferencePercentage()}%</span>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Add this new information section about RGB values in remote sensing */}
            <motion.div 
              className="mt-5 p-5 bg-indigo-50 rounded-md border border-indigo-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-indigo-800 font-medium text-lg mb-2">Understanding RGB Values in Remote Sensing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-indigo-700">
                <div className="bg-white/70 p-3 rounded-md">
                  <h4 className="font-medium text-indigo-900 mb-1">Red Channel (R)</h4>
                  <p>Indicates absorption by chlorophyll and is sensitive to vegetation health. Lower values often suggest healthier vegetation. Red is also responsive to soil types, certain minerals, and built surfaces.</p>
                </div>
                <div className="bg-white/70 p-3 rounded-md">
                  <h4 className="font-medium text-indigo-900 mb-1">Green Channel (G)</h4>
                  <p>Reflects green light from vegetation and captures chlorophyll content. Higher values often correlate with greener, more vigorous vegetation. Green is also useful for distinguishing between vegetation types.</p>
                </div>
                <div className="bg-white/70 p-3 rounded-md">
                  <h4 className="font-medium text-indigo-900 mb-1">Blue Channel (B)</h4>
                  <p>Provides information about atmospheric conditions and water features. Blue is often absorbed by healthy vegetation. It helps with distinguishing water bodies, shadows, and certain urban features.</p>
                </div>
              </div>
              <div className="mt-3 text-sm text-indigo-700">
                <p>The color differences between satellite and drone imagery affect vegetation indices and analysis accuracy. Correcting these differences improves consistency in environmental monitoring and agricultural assessments.</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="mt-5 flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={applyCorrection}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-all duration-200 shadow-md font-medium flex items-center"
                disabled={isLoading}
                whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.15)" }}
                whileTap={{ scale: 0.95 }}
              >
                <FaWrench className="mr-2" /> Apply Correction to Satellite Image
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Before & After Comparison */}
      <AnimatePresence>
        {satelliteCorrectedImage && (
          <motion.div 
            className="mt-5 bg-white p-5 rounded-md shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Before & After Comparison</h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <h3 className="font-medium text-gray-700 mb-3">Original Satellite Image</h3>
                <motion.div 
                  className="relative border border-gray-200 rounded-md overflow-hidden shadow-md"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={satelliteImageSrc}
                    alt="Original Satellite"
                    className="w-full object-contain"
                  />
                </motion.div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <h3 className="font-medium text-gray-700 mb-3">Corrected Satellite Image</h3>
                <motion.div 
                  className="relative border border-gray-200 rounded-md overflow-hidden shadow-md"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={satelliteCorrectedImage}
                    alt="Corrected Satellite"
                    className="w-full object-contain"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Enhanced information section about color correction impacts */}
            <motion.div 
              className="mt-5 p-5 bg-gray-50 rounded-md border border-gray-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-gray-800 font-medium text-lg mb-2">Impact of Color Correction on Analysis</h3>
              <div className="text-sm text-gray-700 mb-2">
                <p>The corrected image adjusts RGB values to match the drone image's color characteristics. This correction can significantly impact the calculation of vegetation and surface indices:</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="bg-white/70 p-3 rounded-md text-sm text-gray-700">
                  <h4 className="font-medium text-gray-900 mb-1">Vegetation Indices</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li><span className="font-medium">VARI, ExG, NGRDI:</span> More accurate vegetation detection</li>
                    <li><span className="font-medium">TGI:</span> Improved chlorophyll content estimation</li>
                    <li><span className="font-medium">GLI:</span> Enhanced green leaf density mapping</li>
                    <li><span className="font-medium">CIVE:</span> Better vegetation extraction in complex scenes</li>
                  </ul>
                </div>
                <div className="bg-white/70 p-3 rounded-md text-sm text-gray-700">
                  <h4 className="font-medium text-gray-900 mb-1">Surface & Color Indices</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li><span className="font-medium">Soil Color Index:</span> More consistent soil detection</li>
                    <li><span className="font-medium">Urban Indices:</span> Improved built surface identification</li>
                    <li><span className="font-medium">RGB Ratios:</span> More accurate material classification</li>
                    <li><span className="font-medium">Color Metrics:</span> Enhanced scene interpretation</li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex justify-end mt-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.a
                href={satelliteCorrectedImage}
                download="corrected_satellite_image.png"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-all duration-200 shadow-sm font-medium flex items-center"
                whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.15)" }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDownload className="mr-2" /> Download Corrected Image
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add a new explanation section about RGB indices */}
      <AnimatePresence>
        {(satelliteAverageImage && droneAverageImage) && (
          <motion.div 
            className="mt-5 bg-white p-5 rounded-md shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Why RGB Values Matter in Remote Sensing
            </h2>
            <div className="text-gray-700">
              <p className="mb-4">
                RGB values from satellite and drone imagery provide crucial data for environmental monitoring, agriculture, and land use analysis. 
                Accurate color representation is essential for deriving meaningful vegetation and surface indices.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                  <h3 className="font-medium text-gray-800 mb-2">RGB-based Vegetation Indices</h3>
                  <p className="text-sm mb-3">
                    RGB imagery can be used to calculate various vegetation indices that assess plant health, density, and stress levels without requiring specialized multispectral sensors.
                  </p>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    <li><span className="font-medium">ExG (Excess Green):</span> Highlights green vegetation</li>
                    <li><span className="font-medium">VARI:</span> Reduces atmospheric effects</li>
                    <li><span className="font-medium">TGI:</span> Correlates with chlorophyll content</li>
                    <li><span className="font-medium">GLI:</span> Assesses green leaf density</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                  <h3 className="font-medium text-gray-800 mb-2">Impacts of Color Correction</h3>
                  <p className="text-sm mb-3">
                    Color differences between image sources can lead to inconsistent analysis. Proper correction:
                  </p>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    <li>Improves data consistency across platforms</li>
                    <li>Enhances accuracy of vegetation monitoring</li>
                    <li>Allows for more reliable time-series analysis</li>
                    <li>Reduces errors in environmental assessments</li>
                    <li>Enables better integration of multiple data sources</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 text-sm text-yellow-800">
                <h3 className="font-medium mb-2">Important Considerations</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>RGB corrections cannot compensate for all spectral differences between sensors</li>
                  <li>Environmental conditions (time of day, season, atmospheric conditions) affect RGB values</li>
                  <li>For the most accurate analysis, use consistent imaging conditions when possible</li>
                  <li>Advanced studies may still require specialized multispectral or hyperspectral sensors</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Analysis Button */}
      <AnimatePresence>
        {(satelliteAverageImage && droneAverageImage) && !showAnalysis && (
          <motion.div 
            className="mt-5 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            <motion.button
              onClick={() => setShowAnalysis(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-all duration-200 shadow-md font-medium flex items-center"
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.15)" }}
              whileTap={{ scale: 0.95 }}
            >
              <FaChartBar className="mr-2" /> View Advanced Analysis
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Component */}
      <AnimatePresence>
        {showAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Analysis 
              satelliteData={satelliteAvgRgb}
              droneData={droneAvgRgb}
              satelliteImageSrc={satelliteImageSrc}
              satelliteCorrectedImage={satelliteCorrectedImage}
              onBack={() => setShowAnalysis(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}