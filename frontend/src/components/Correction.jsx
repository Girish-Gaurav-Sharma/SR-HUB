import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { 
  FaCloudUploadAlt, FaTrash, FaExclamationTriangle, 
  FaUndo, FaDownload, FaRedo, FaSatellite, FaPlane
} from 'react-icons/fa';

// Constants
const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];

export default function Correction() {
  // Satellite image states
  const [satelliteImageSrc, setSatelliteImageSrc] = useState(null);
  const [satelliteCrop, setSatelliteCrop] = useState({ x: 0, y: 0 });
  const [satelliteZoom, setSatelliteZoom] = useState(1);
  const [satelliteCroppedAreaPixels, setSatelliteCroppedAreaPixels] = useState(null);
  const [satelliteCroppedImage, setSatelliteCroppedImage] = useState(null);
  const [satelliteImageDimensions, setSatelliteImageDimensions] = useState({ width: 0, height: 0 });
  const [satelliteOriginalCroppedImage, setSatelliteOriginalCroppedImage] = useState(null);
  const [satelliteAverageImage, setSatelliteAverageImage] = useState(null);
  const [satelliteAvgRgb, setSatelliteAvgRgb] = useState({ r: 0, g: 0, b: 0 });

  // Drone image states
  const [droneImageSrc, setDroneImageSrc] = useState(null);
  const [droneCrop, setDroneCrop] = useState({ x: 0, y: 0 });
  const [droneZoom, setDroneZoom] = useState(1);
  const [droneCroppedAreaPixels, setDroneCroppedAreaPixels] = useState(null);
  const [droneCroppedImage, setDroneCroppedImage] = useState(null);
  const [droneImageDimensions, setDroneImageDimensions] = useState({ width: 0, height: 0 });
  const [droneOriginalCroppedImage, setDroneOriginalCroppedImage] = useState(null);
  const [droneAverageImage, setDroneAverageImage] = useState(null);
  const [droneAvgRgb, setDroneAvgRgb] = useState({ r: 0, g: 0, b: 0 });

  // Shared states
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  // Satellite image upload handler
  const handleSatelliteImageUpload = (file) => {
    if (!file) return;
    
    setSatelliteCroppedImage(null);
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

  // Drone image upload handler
  const handleDroneImageUpload = (file) => {
    if (!file) return;
    
    setDroneCroppedImage(null);
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

  const handleSatelliteFileChange = (e) => {
    if (e.target.files?.[0]) handleSatelliteImageUpload(e.target.files[0]);
  };

  const handleDroneFileChange = (e) => {
    if (e.target.files?.[0]) handleDroneImageUpload(e.target.files[0]);
  };

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

    // Capture the original cropped image
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

    // Capture the averaged image
    const averagedDataUrl = canvas.toDataURL('image/png');

    return {
      originalDataUrl,
      averagedDataUrl,
      avgR,
      avgG,
      avgB
    };
  };

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
    setSatelliteCroppedImage(null);
    setSatelliteOriginalCroppedImage(null);
    setSatelliteAverageImage(null);
    setSatelliteAvgRgb({ r: 0, g: 0, b: 0 });
    resetSatelliteEditor();
  };
  
  const resetDroneAll = () => {
    setError(null);
    setDroneImageSrc(null);
    setDroneCroppedImage(null);
    setDroneOriginalCroppedImage(null);
    setDroneAverageImage(null);
    setDroneAvgRgb({ r: 0, g: 0, b: 0 });
    resetDroneEditor();
  };

  return (
    <div className="backdrop-blur-lg bg-white/50 text-gray-800 p-6 md:p-8 overflow-y-auto rounded-3xl shadow-2xl w-full max-w-5xl mx-auto my-6 border border-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Image Comparison</h1>

      {error && (
        <div className="mt-4 mb-5 text-red-600 flex items-center bg-red-50 p-4 rounded-lg border-l-4 border-red-500 shadow-sm animate-pulse">
          <FaExclamationTriangle className="mr-3 flex-shrink-0" /> 
          <span className="font-medium">{error}</span>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center my-8 py-4">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Satellite Image Section */}
        <div className="border border-gray-200 p-5 rounded-xl shadow-md bg-white">
          <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
            <FaSatellite className="text-blue-600 mr-3 text-xl" />
            <h2 className="text-xl font-bold text-gray-800">Satellite Image</h2>
          </div>

          {!satelliteImageSrc && !isLoading && (
            <div className="p-8 md:p-10 border-dashed border-2 border-blue-300 rounded-xl mb-6 text-center bg-gradient-to-b from-white/80 to-blue-50/60 shadow-md hover:shadow-lg hover:border-blue-400 transition-all duration-300 group">
              <FaCloudUploadAlt className="mx-auto text-4xl md:text-5xl text-blue-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <p className="mb-5 text-gray-700 font-medium">Upload your satellite image</p>
              <input
                type="file"
                onChange={handleSatelliteFileChange}
                accept={ACCEPTED_FILE_TYPES.join(',')}
                className="hidden"
                id="satelliteFileInput"
              />
              <label
                htmlFor="satelliteFileInput"
                className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-full transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0"
              >
                Select Image
              </label>
            </div>
          )}

          {satelliteImageSrc && !isLoading && (
            <>
              <div className="relative w-full h-[20rem] border rounded-xl overflow-hidden mb-4 bg-gray-100 shadow-inner">
                <Cropper
                  image={satelliteImageSrc}
                  crop={satelliteCrop}
                  zoom={satelliteZoom}
                  maxZoom={10}
                  aspect={1}
                  onCropChange={setSatelliteCrop}
                  onZoomChange={setSatelliteZoom}
                  onCropComplete={onSatelliteCropComplete}
                />
              </div>
              
              {satelliteImageDimensions.width > 0 && (
                <div className="mb-3 text-sm text-gray-600 bg-gray-50 inline-block px-3 py-1 rounded-md">
                  Original: {satelliteImageDimensions.width} × {satelliteImageDimensions.height}px
                </div>
              )}
              
              <div className="flex flex-wrap items-center gap-2 mb-4 mt-2">
                <div className="flex space-x-2 mr-auto">
                  <button
                    onClick={() => setSatelliteZoom(Math.min(10, satelliteZoom + 0.2))}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-all duration-200 shadow-sm text-sm"
                    title="Zoom in"
                  >
                    Zoom In
                  </button>
                  <button
                    onClick={() => setSatelliteZoom(Math.max(1, satelliteZoom - 0.2))}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-all duration-200 shadow-sm text-sm"
                    title="Zoom out"
                  >
                    Zoom Out
                  </button>
                  <button
                    onClick={resetSatelliteEditor}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-lg transition-all duration-200 shadow-sm text-sm"
                    title="Reset changes"
                  >
                    <FaUndo className="inline mr-1 -mt-0.5" /> Reset
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={showSatelliteCroppedImage}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg transition-all duration-200 shadow-sm font-medium"
                  >
                    Crop Image
                  </button>
                  <button
                    onClick={resetSatelliteAll}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 shadow-sm font-medium"
                  >
                    <FaTrash className="inline mr-1 -mt-0.5" /> Cancel
                  </button>
                </div>
              </div>
            </>
          )}

          {satelliteOriginalCroppedImage && !isLoading && (
            <div className="mb-4 bg-white p-4 rounded-xl shadow border border-gray-100">
              <h3 className="font-semibold text-lg text-gray-800 mb-2 pb-1 border-b border-gray-100">Cropped Pixels</h3>
              <img
                src={satelliteOriginalCroppedImage}
                alt="Satellite Cropped"
                className="border border-gray-200 rounded-lg mb-3 max-w-full object-contain hover:shadow-md transition-shadow duration-300"
              />
            </div>
          )}

          {satelliteAverageImage && !isLoading && (
            <div className="mb-4 bg-white p-4 rounded-xl shadow border border-gray-100">
              <h3 className="font-semibold text-lg text-gray-800 mb-2 pb-1 border-b border-gray-100">Averaged Pixels</h3>
              <img
                src={satelliteAverageImage}
                alt="Satellite Averaged"
                className="border border-gray-200 rounded-lg mb-3 max-w-full object-contain hover:shadow-md transition-shadow duration-300"
              />
              <p className="text-gray-700 font-medium text-sm">
                Average RGB: R = {satelliteAvgRgb.r}, G = {satelliteAvgRgb.g}, B = {satelliteAvgRgb.b}
              </p>
            </div>
          )}
        </div>

        {/* Drone Image Section */}
        <div className="border border-gray-200 p-5 rounded-xl shadow-md bg-white">
          <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
            <FaPlane className="text-green-600 mr-3 text-xl" />
            <h2 className="text-xl font-bold text-gray-800">Drone Image</h2>
          </div>

          {!droneImageSrc && !isLoading && (
            <div className="p-8 md:p-10 border-dashed border-2 border-green-300 rounded-xl mb-6 text-center bg-gradient-to-b from-white/80 to-green-50/60 shadow-md hover:shadow-lg hover:border-green-400 transition-all duration-300 group">
              <FaCloudUploadAlt className="mx-auto text-4xl md:text-5xl text-green-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <p className="mb-5 text-gray-700 font-medium">Upload your drone image</p>
              <input
                type="file"
                onChange={handleDroneFileChange}
                accept={ACCEPTED_FILE_TYPES.join(',')}
                className="hidden"
                id="droneFileInput"
              />
              <label
                htmlFor="droneFileInput"
                className="cursor-pointer inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-full transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0"
              >
                Select Image
              </label>
            </div>
          )}

          {droneImageSrc && !isLoading && (
            <>
              <div className="relative w-full h-[20rem] border rounded-xl overflow-hidden mb-4 bg-gray-100 shadow-inner">
                <Cropper
                  image={droneImageSrc}
                  crop={droneCrop}
                  zoom={droneZoom}
                  maxZoom={10}
                  aspect={1}
                  onCropChange={setDroneCrop}
                  onZoomChange={setDroneZoom}
                  onCropComplete={onDroneCropComplete}
                />
              </div>
              
              {droneImageDimensions.width > 0 && (
                <div className="mb-3 text-sm text-gray-600 bg-gray-50 inline-block px-3 py-1 rounded-md">
                  Original: {droneImageDimensions.width} × {droneImageDimensions.height}px
                </div>
              )}
              
              <div className="flex flex-wrap items-center gap-2 mb-4 mt-2">
                <div className="flex space-x-2 mr-auto">
                  <button
                    onClick={() => setDroneZoom(Math.min(10, droneZoom + 0.2))}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-all duration-200 shadow-sm text-sm"
                    title="Zoom in"
                  >
                    Zoom In
                  </button>
                  <button
                    onClick={() => setDroneZoom(Math.max(1, droneZoom - 0.2))}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-all duration-200 shadow-sm text-sm"
                    title="Zoom out"
                  >
                    Zoom Out
                  </button>
                  <button
                    onClick={resetDroneEditor}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-lg transition-all duration-200 shadow-sm text-sm"
                    title="Reset changes"
                  >
                    <FaUndo className="inline mr-1 -mt-0.5" /> Reset
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={showDroneCroppedImage}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg transition-all duration-200 shadow-sm font-medium"
                  >
                    Crop Image
                  </button>
                  <button
                    onClick={resetDroneAll}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 shadow-sm font-medium"
                  >
                    <FaTrash className="inline mr-1 -mt-0.5" /> Cancel
                  </button>
                </div>
              </div>
            </>
          )}

          {droneOriginalCroppedImage && !isLoading && (
            <div className="mb-4 bg-white p-4 rounded-xl shadow border border-gray-100">
              <h3 className="font-semibold text-lg text-gray-800 mb-2 pb-1 border-b border-gray-100">Cropped Pixels</h3>
              <img
                src={droneOriginalCroppedImage}
                alt="Drone Cropped"
                className="border border-gray-200 rounded-lg mb-3 max-w-full object-contain hover:shadow-md transition-shadow duration-300"
              />
            </div>
          )}

          {droneAverageImage && !isLoading && (
            <div className="mb-4 bg-white p-4 rounded-xl shadow border border-gray-100">
              <h3 className="font-semibold text-lg text-gray-800 mb-2 pb-1 border-b border-gray-100">Averaged Pixels</h3>
              <img
                src={droneAverageImage}
                alt="Drone Averaged"
                className="border border-gray-200 rounded-lg mb-3 max-w-full object-contain hover:shadow-md transition-shadow duration-300"
              />
              <p className="text-gray-700 font-medium text-sm">
                Average RGB: R = {droneAvgRgb.r}, G = {droneAvgRgb.g}, B = {droneAvgRgb.b}
              </p>
            </div>
          )}
        </div>
      </div>

      {(satelliteAverageImage && droneAverageImage) && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="font-semibold text-xl text-gray-800 mb-4 pb-2 border-b border-gray-100">Color Comparison</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Satellite Image</h3>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-md shadow-md border border-gray-200" 
                  style={{backgroundColor: `rgb(${satelliteAvgRgb.r}, ${satelliteAvgRgb.g}, ${satelliteAvgRgb.b})`}}
                ></div>
                <span className="font-mono text-sm">
                  RGB({satelliteAvgRgb.r}, {satelliteAvgRgb.g}, {satelliteAvgRgb.b})
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Drone Image</h3>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-md shadow-md border border-gray-200" 
                  style={{backgroundColor: `rgb(${droneAvgRgb.r}, ${droneAvgRgb.g}, ${droneAvgRgb.b})`}}
                ></div>
                <span className="font-mono text-sm">
                  RGB({droneAvgRgb.r}, {droneAvgRgb.g}, {droneAvgRgb.b})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}