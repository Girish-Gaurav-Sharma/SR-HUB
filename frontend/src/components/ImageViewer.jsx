import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import OpenSeadragon from 'openseadragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchPlus, faSearchMinus, faHome, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import '../styles/image-viewer.css';

// Import fabric globally - make sure it's available
import 'fabric';
// fabric.js attaches itself to the window object as window.fabric

const ImageViewer = ({ image, setImage, onRgbCalculated, rgbValue, title, type, setError }) => {
  // Create a local reference to window.fabric
  const fabric = window.fabric;

  const viewerRef = useRef(null);
  const viewerInstance = useRef(null);
  const fabricOverlay = useRef(null);
  const selectionRect = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectionVisible, setIsSelectionVisible] = useState(true);

  // Handle image upload
  const handleImageUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    if (!file.type.match('image.*')) {
      setError('Please select a valid image file.');
      return;
    }
    
    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage({
          src: event.target.result,
          file: file,
          width: img.width,
          height: img.height
        });
        setIsLoading(false);
      };
      img.onerror = () => {
        setError('Failed to load image.');
        setIsLoading(false);
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (e.dataTransfer.files[0].type.match('image.*')) {
        handleImageUpload({ target: { files: e.dataTransfer.files } });
      } else {
        setError('Please drop an image file.');
      }
    }
  };

  // Initialize OpenSeadragon when image changes
  useEffect(() => {
    // Clean up previous viewer
    if (viewerInstance.current) {
      viewerInstance.current.destroy();
      viewerInstance.current = null;
      fabricOverlay.current = null;
      selectionRect.current = null;
    }
    
    if (!image || !viewerRef.current) return;
    
    try {
      console.log(`Creating OpenSeadragon viewer for ${type}...`);
      
      // Create the viewer
      const viewer = OpenSeadragon({
        id: `${type}-viewer`,
        tileSources: {
          type: 'image',
          url: image.src
        },
        animationTime: 0.3,
        blendTime: 0.1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 3,
        minZoomLevel: 0.8,
        maxZoomLevel: 40,
        zoomPerClick: 1.2,
        zoomPerScroll: 1.2,
        showNavigator: true,
        navigatorPosition: 'BOTTOM_RIGHT',
        navigatorHeight: 80,
        navigatorWidth: 100,
        immediateRender: true,
        preserveViewport: true,
        visibilityRatio: 1,
        springStiffness: 6.5,
        debugMode: false,
        gestureSettingsMouse: {
          clickToZoom: true,
          dblClickToZoom: true,
          pinchToZoom: true,
          scrollToZoom: true
        }
      });

      viewerInstance.current = viewer;
      
      // Wait for OpenSeadragon to initialize
      viewer.addOnceHandler('open', () => {
        console.log(`OpenSeadragon viewer opened for ${type}`);
        setupFabricOverlay(viewer);
      });
      
    } catch (e) {
      console.error("Error creating OpenSeadragon viewer:", e);
      setError('Failed to initialize image viewer. Please refresh and try again.');
    }
    
    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
        viewerInstance.current = null;
      }
    };
  }, [image, type, setError]);
  
  // Setup fabric overlay
  const setupFabricOverlay = (viewer) => {
    try {
      console.log("Setting up fabric overlay...");
      
      if (typeof viewer.fabricjsOverlay !== 'function') {
        console.error("fabricjsOverlay not available on viewer");
        setError("Fabric overlay plugin not available. Please refresh the page.");
        return;
      }
      
      const overlay = viewer.fabricjsOverlay();
      fabricOverlay.current = overlay;
      
      // Create a selection rectangle
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        fill: 'rgba(0, 0, 255, 0.2)',
        stroke: 'blue',
        strokeWidth: 2,
        cornerColor: 'blue',
        cornerSize: 8,
        transparentCorners: false,
        hasRotatingPoint: false
      });
      
      selectionRect.current = rect;
      overlay.canvas.add(rect);
      overlay.canvas.setActiveObject(rect);
      
      // Add event handlers for selection changes
      overlay.canvas.on('object:modified', calculateRgbFromSelection);
      overlay.canvas.on('object:moving', calculateRgbFromSelection);
      overlay.canvas.on('object:scaling', calculateRgbFromSelection);
      
      // Initial calculation
      calculateRgbFromSelection();
      
      console.log("Fabric overlay setup complete");
    } catch (err) {
      console.error("Error setting up fabric overlay:", err);
      setError(`Error setting up selection tool: ${err.message}`);
    }
  };
  
  // Calculate RGB values from the selection rectangle
  const calculateRgbFromSelection = () => {
    if (!viewerInstance.current || !fabricOverlay.current || !selectionRect.current || !image) {
      console.log("Missing required objects for RGB calculation");
      return;
    }
    
    try {
      console.log("Calculating RGB from selection...");
      
      // Create a temporary canvas for RGB calculation
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      
      // Get the rectangle position and size
      const rect = selectionRect.current;
      const viewer = viewerInstance.current;
      
      // Get image info
      const currentImage = new Image();
      currentImage.src = image.src;
      
      // Set up canvas dimensions
      tempCanvas.width = image.width;
      tempCanvas.height = image.height;
      
      // Draw the full image to the canvas
      ctx.drawImage(currentImage, 0, 0, image.width, image.height);
      
      // Calculate rectangle position in original image coordinates
      const viewportCoords = viewer.viewport.imageToViewportCoordinates(new OpenSeadragon.Point(rect.left, rect.top));
      const rectBottomRight = viewer.viewport.imageToViewportCoordinates(
        new OpenSeadragon.Point(rect.left + rect.width * rect.scaleX, rect.top + rect.height * rect.scaleY)
      );
      
      const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportCoords);
      const imagePointBottomRight = viewer.viewport.viewportToImageCoordinates(rectBottomRight);
      
      // Ensure coordinates are within bounds
      const x = Math.max(0, Math.min(image.width, imagePoint.x));
      const y = Math.max(0, Math.min(image.height, imagePoint.y));
      const width = Math.max(1, Math.min(image.width - x, imagePointBottomRight.x - imagePoint.x));
      const height = Math.max(1, Math.min(image.height - y, imagePointBottomRight.y - imagePoint.y));
      
      console.log(`Selection area: x=${x}, y=${y}, w=${width}, h=${height}`);
      
      // Get pixel data from the selection area
      let imageData;
      try {
        imageData = ctx.getImageData(x, y, width, height);
      } catch (err) {
        console.error("Error getting image data:", err);
        return;
      }
      
      const pixels = imageData.data;
      let r = 0, g = 0, b = 0, count = 0;
      
      // Calculate average RGB
      for (let i = 0; i < pixels.length; i += 4) {
        r += pixels[i];
        g += pixels[i + 1];
        b += pixels[i + 2];
        count++;
      }
      
      if (count > 0) {
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        
        const rgbString = `rgb(${r}, ${g}, ${b})`;
        console.log(`Calculated RGB: ${rgbString}`);
        onRgbCalculated(rgbString);
      } else {
        console.log("No pixels found in selection");
      }
    } catch (err) {
      console.error("Error in RGB calculation:", err);
      setError("Failed to calculate RGB values. Please try adjusting the selection area.");
    }
  };

  // Zoom and control handlers
  const handleZoomIn = () => {
    if (viewerInstance.current) {
      viewerInstance.current.viewport.zoomBy(1.2);
    }
  };

  const handleZoomOut = () => {
    if (viewerInstance.current) {
      viewerInstance.current.viewport.zoomBy(0.8);
    }
  };

  const handleReset = () => {
    if (viewerInstance.current) {
      viewerInstance.current.viewport.goHome();
    }
  };

  const toggleSelection = () => {
    if (selectionRect.current) {
      selectionRect.current.visible = !selectionRect.current.visible;
      fabricOverlay.current?.canvas.renderAll();
      setIsSelectionVisible(!isSelectionVisible);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-lg rounded-xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-4 py-3">
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      
      {/* Image container */}
      <div 
        className="relative h-96"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-gray-600">Loading image...</p>
            </div>
          </div>
        )}
        
        {!image ? (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Upload {type} image</h3>
            <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            <div className="mt-4">
              <label htmlFor={`${type}-upload`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
                Select file
                <input id={`${type}-upload`} type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500">or drag and drop</p>
          </div>
        ) : (
          <div id={`${type}-viewer`} className="w-full h-full" ref={viewerRef}></div>
        )}
      </div>
      
      {/* Zoom controls */}
      {image && (
        <div className="flex space-x-2 bg-gray-100 p-2 border-t border-gray-200">
          <button 
            onClick={handleZoomIn} 
            title="Zoom In"
            className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors"
          >
            <FontAwesomeIcon icon={faSearchPlus} className="text-gray-700" />
          </button>
          <button 
            onClick={handleZoomOut} 
            title="Zoom Out"
            className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors"
          >
            <FontAwesomeIcon icon={faSearchMinus} className="text-gray-700" />
          </button>
          <button 
            onClick={handleReset} 
            title="Reset View"
            className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors"
          >
            <FontAwesomeIcon icon={faHome} className="text-gray-700" />
          </button>
          <button 
            onClick={toggleSelection} 
            title="Toggle Selection"
            className={`p-2 rounded-md shadow transition-colors ${isSelectionVisible ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <FontAwesomeIcon icon={faToggleOn} />
          </button>
        </div>
      )}
      
      {/* Image info and RGB result */}
      {image && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <p className="text-sm text-gray-500 truncate max-w-xs" title={image.file?.name || ''}>
                {image.file?.name || 'Image'} • {image.width}×{image.height}px
              </p>
            </div>
            <button
              onClick={() => {
                if (viewerInstance.current) {
                  viewerInstance.current.destroy();
                  viewerInstance.current = null;
                }
                setImage(null);
                onRgbCalculated(null);
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
          
          {/* Display RGB values */}
          {rgbValue && (
            <div className="mt-3 bg-white border border-gray-200 rounded-md p-3 shadow-sm">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-md border border-gray-300 shadow-inner" 
                  style={{ backgroundColor: rgbValue }}
                ></div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Selected Area RGB</p>
                  <p className="text-sm font-mono">{rgbValue}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-3 text-xs text-gray-500">
            <p className="font-medium">Controls:</p>
            <ul className="list-disc pl-4 mt-1 space-y-1">
              <li>Drag the blue selection box to select an area</li>
              <li>Resize the selection by dragging the corner handles</li>
              <li>Mouse wheel or pinch to zoom the image</li>
              <li>Click and drag to pan around</li>
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ImageViewer;