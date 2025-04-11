import React, { useEffect, useState, useRef } from 'react';
import { FaArrowLeft, FaExchangeAlt, FaLeaf, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Analysis({ satelliteData, droneData, onBack, satelliteImageSrc, satelliteCorrectedImage }) {
  const [heatmaps, setHeatmaps] = useState({
    original: {},
    corrected: {}
  });
  const [loading, setLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [processedIndices, setProcessedIndices] = useState([]);
  const [totalIndices, setTotalIndices] = useState(0);
  const [showHeatmaps, setShowHeatmaps] = useState(false);

  // References to hold the original loaded images
  const satelliteImageRef = useRef(null);
  const correctedImageRef = useRef(null);

  if (!satelliteData || !droneData) {
    return (
      <div className="text-center p-8">
        <p>No image data available for analysis</p>
        <button
          onClick={onBack}
          className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm font-medium flex items-center mx-auto"
        >
          <FaArrowLeft className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  // Calculate vegetation indices for a given RGB object
  const calculateIndices = (rgb) => {
    const { r, g, b } = rgb;
    const R = r / 255; // Normalize to 0-1 range
    const G = g / 255;
    const B = b / 255;
    
    // Vegetation indices
    const vari = (G + R - B) !== 0 ? ((G - R) / (G + R - B)).toFixed(3) : "N/A";
    const exg = (2 * G - R - B).toFixed(3);
    const exr = (1.4 * R - G).toFixed(3);
    const cive = (0.441 * R - 0.811 * G + 0.385 * B + 18.78745).toFixed(3);
    const tgi = (-0.5 * (190 * (R - G) - 120 * (R - B))).toFixed(3);
    const gli = (2 * G + R + B) !== 0 ? ((2 * G - R - B) / (2 * G + R + B)).toFixed(3) : "N/A";
    const ngrdi = (G + R) !== 0 ? ((G - R) / (G + R)).toFixed(3) : "N/A";
    
    // Soil & Bare Earth Indices
    const sci = (R + G + B) !== 0 ? ((R - G) / (R + G + B)).toFixed(3) : "N/A";
    
    // Urban / Surface Material Detection
    const rednessIndex = (B * G) !== 0 ? ((R * R) / (B * G)).toFixed(3) : "N/A";
    const bluenessIndex = (R * G) !== 0 ? ((B * B) / (R * G)).toFixed(3) : "N/A";
    const greennessIndex = (R * B) !== 0 ? ((G * G) / (R * B)).toFixed(3) : "N/A";
    const colorRatioR = (G + B) !== 0 ? (R / (G + B)).toFixed(3) : "N/A";
    const colorRatioG = (R + B) !== 0 ? (G / (R + B)).toFixed(3) : "N/A";
    
    // Color/Light/Scene Analysis
    const bi = Math.sqrt(R*R + G*G + B*B).toFixed(3);
    const nbi = ((R + G + B) / 3).toFixed(3);
    const hue = Math.atan2(Math.sqrt(3)*(G - B), 2*R - G - B).toFixed(3);
    const sat = (Math.max(R, G, B) - Math.min(R, G, B)).toFixed(3);
    const intensity = ((R + G + B) / 3).toFixed(3);
    
    return { 
      vari, exg, exr, cive, tgi, gli, ngrdi,    // Vegetation indices
      sci,                                       // Soil indices
      rednessIndex, bluenessIndex, greennessIndex, colorRatioR, colorRatioG,  // Urban/Surface indices
      bi, nbi, hue, sat, intensity               // Color/Light indices
    };
  };

  // Get indices for both images
  const originalIndices = calculateIndices(satelliteData);
  const correctedIndices = calculateIndices(droneData);

  // Calculate percentage errors between original and corrected indices
  const calculatePercentageError = (original, corrected) => {
    if (original === "N/A" || corrected === "N/A") return "N/A";
    
    const origVal = parseFloat(original);
    const corrVal = parseFloat(corrected);
    
    // Handle case where original is 0 (to avoid division by zero)
    if (origVal === 0) {
      return corrVal === 0 ? "0.0%" : "N/A";
    }
    
    // Calculate percentage error
    const percentError = ((corrVal - origVal) / Math.abs(origVal) * 100).toFixed(1);
    return `${percentError}%`;
  };

  // Function to generate color based on index value
  const getColor = (value, indexType) => {
    // Different color scales for different indices
    const scales = {
      // Vegetation indices
      vari: { min: -0.5, max: 0.5, colors: ['#f00', '#fff', '#0f0'] }, // Red to Green
      exg: { min: -1, max: 1, colors: ['#a00', '#fff', '#0a0'] }, // Red to Green
      exr: { min: -0.5, max: 0.5, colors: ['#00a', '#fff', '#a00'] }, // Blue to Red
      cive: { min: 18, max: 20, colors: ['#a00', '#fff', '#0a0'] }, // Red to Green
      tgi: { min: -10, max: 10, colors: ['#a00', '#fff', '#0a0'] }, // Red to Green
      gli: { min: -0.5, max: 0.5, colors: ['#a00', '#fff', '#0a0'] }, // Red to Green
      ngrdi: { min: -0.5, max: 0.5, colors: ['#a00', '#fff', '#0a0'] }, // Red to Green
      
      // Soil indices
      sci: { min: -0.3, max: 0.3, colors: ['#0a0', '#fff', '#a52'] }, // Green to Brown
      
      // Urban/Surface indices
      rednessIndex: { min: 0, max: 3, colors: ['#fff', '#faa', '#f00'] }, // White to Red
      bluenessIndex: { min: 0, max: 3, colors: ['#fff', '#aaf', '#00f'] }, // White to Blue
      greennessIndex: { min: 0, max: 3, colors: ['#fff', '#afa', '#0f0'] }, // White to Green
      colorRatioR: { min: 0, max: 1.5, colors: ['#00a', '#fff', '#a00'] }, // Blue to Red
      colorRatioG: { min: 0, max: 1.5, colors: ['#a00', '#fff', '#0a0'] }, // Red to Green
      
      // Color/Light indices
      bi: { min: 0, max: 1.5, colors: ['#000', '#888', '#fff'] }, // Black to White
      nbi: { min: 0, max: 1, colors: ['#000', '#888', '#fff'] }, // Black to White
      hue: { min: -Math.PI, max: Math.PI, colors: ['#f00', '#0f0', '#00f', '#f00'] }, // Color wheel
      sat: { min: 0, max: 1, colors: ['#888', '#fff', '#f00'] }, // Gray to Vibrant
      intensity: { min: 0, max: 1, colors: ['#000', '#888', '#fff'] } // Dark to Bright
    };
    
    const scale = scales[indexType];
    
    // Clamp the value to the min-max range
    const normalized = Math.max(0, Math.min(1, (value - scale.min) / (scale.max - scale.min)));
    
    // Interpolate between colors
    if (normalized <= 0.5) {
      // Interpolate between first and middle color
      const r = Math.round(parseInt(scale.colors[0].substring(1, 3), 16) * (1 - normalized * 2) + 
                          parseInt(scale.colors[1].substring(1, 3), 16) * (normalized * 2));
      const g = Math.round(parseInt(scale.colors[0].substring(3, 5), 16) * (1 - normalized * 2) + 
                          parseInt(scale.colors[1].substring(3, 5), 16) * (normalized * 2));
      const b = Math.round(parseInt(scale.colors[0].substring(5, 7), 16) * (1 - normalized * 2) + 
                          parseInt(scale.colors[1].substring(5, 7), 16) * (normalized * 2));
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Interpolate between middle and last color
      const normalizedUpper = (normalized - 0.5) * 2;
      const r = Math.round(parseInt(scale.colors[1].substring(1, 3), 16) * (1 - normalizedUpper) + 
                          parseInt(scale.colors[2].substring(1, 3), 16) * normalizedUpper);
      const g = Math.round(parseInt(scale.colors[1].substring(3, 5), 16) * (1 - normalizedUpper) + 
                          parseInt(scale.colors[2].substring(3, 5), 16) * normalizedUpper);
      const b = Math.round(parseInt(scale.colors[1].substring(5, 7), 16) * (1 - normalizedUpper) + 
                          parseInt(scale.colors[2].substring(5, 7), 16) * normalizedUpper);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  // Load images and generate heatmaps
  useEffect(() => {
    if (!satelliteImageSrc || !satelliteCorrectedImage) return;
    
    const generateHeatmaps = async () => {
      setLoading(true);
      setProcessingStatus('Loading images...');
      
      try {
        // Load images
        const loadImage = (src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
          });
        };
        
        const satelliteImg = await loadImage(satelliteImageSrc);
        const correctedImg = await loadImage(satelliteCorrectedImage);
        
        satelliteImageRef.current = satelliteImg;
        correctedImageRef.current = correctedImg;
        
        // Process images
        const processImage = async (img, imageType) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Create heatmaps for each index - prioritize the most important ones first
          const indices = [
            // High priority - vegetation indices people use most
            'vari', 'exg', 'gli', 
            // Medium priority
            'exr', 'cive', 'tgi', 'ngrdi',
            // Soil indices
            'sci',
            // Urban/Surface indices
            'rednessIndex', 'bluenessIndex', 'greennessIndex', 'colorRatioR', 'colorRatioG',
            // Color/Light indices
            'bi', 'nbi', 'hue', 'sat', 'intensity'
          ];
          
          setTotalIndices(indices.length * 2); // For both original and corrected
          setProcessedIndices([]);
          
          const heatmapResults = {};
          
          // Process indices one by one with yielding to the UI thread
          for (let i = 0; i < indices.length; i++) {
            const indexType = indices[i];
            setProcessingStatus(`Processing ${indexType} (${i+1}/${indices.length})...`);
            
            // Yield to UI thread before processing each index
            await new Promise(resolve => setTimeout(resolve, 0));
            
            const heatmapCanvas = document.createElement('canvas');
            const heatmapCtx = heatmapCanvas.getContext('2d');
            
            heatmapCanvas.width = img.width;
            heatmapCanvas.height = img.height;
            
            const heatmapImageData = ctx.createImageData(img.width, img.height);
            const heatmapData = heatmapImageData.data;
            
            // Process in smaller batches
            const batchSize = 10000; // Process 10000 pixels at a time
            const totalPixels = data.length / 4;
            
            for (let pixelStart = 0; pixelStart < totalPixels; pixelStart += batchSize) {
              await new Promise(resolve => requestAnimationFrame(resolve));
              
              const endPixel = Math.min(pixelStart + batchSize, totalPixels);
              
              for (let pixel = pixelStart; pixel < endPixel; pixel++) {
                const i = pixel * 4;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                const R = r / 255;
                const G = g / 255;
                const B = b / 255;
                
                // Calculate index value for this pixel
                let indexValue;
                
                switch (indexType) {
                  // Vegetation indices
                  case 'vari':
                    indexValue = (G + R - B) !== 0 ? (G - R) / (G + R - B) : 0;
                    break;
                  case 'exg':
                    indexValue = 2 * G - R - B;
                    break;
                  case 'exr':
                    indexValue = 1.4 * R - G;
                    break;
                  case 'cive':
                    indexValue = 0.441 * R - 0.811 * G + 0.385 * B + 18.78745;
                    break;
                  case 'tgi':
                    indexValue = -0.5 * (190 * (R - G) - 120 * (R - B));
                    break;
                  case 'gli':
                    indexValue = (2 * G + R + B) !== 0 ? (2 * G - R - B) / (2 * G + R + B) : 0;
                    break;
                  case 'ngrdi':
                    indexValue = (G + R) !== 0 ? (G - R) / (G + R) : 0;
                    break;
                  
                  // Soil indices
                  case 'sci':
                    indexValue = (R + G + B) !== 0 ? (R - G) / (R + G + B) : 0;
                    break;
                  
                  // Urban/Surface indices
                  case 'rednessIndex':
                    indexValue = (B * G) !== 0 ? (R * R) / (B * G) : 0;
                    break;
                  case 'bluenessIndex':
                    indexValue = (R * G) !== 0 ? (B * B) / (R * G) : 0;
                    break;
                  case 'greennessIndex':
                    indexValue = (R * B) !== 0 ? (G * G) / (R * B) : 0;
                    break;
                  case 'colorRatioR':
                    indexValue = (G + B) !== 0 ? R / (G + B) : 0;
                    break;
                  case 'colorRatioG':
                    indexValue = (R + B) !== 0 ? G / (R + B) : 0;
                    break;
                  
                  // Color/Light indices
                  case 'bi':
                    indexValue = Math.sqrt(R*R + G*G + B*B);
                    break;
                  case 'nbi':
                    indexValue = (R + G + B) / 3;
                    break;
                  case 'hue':
                    indexValue = Math.atan2(Math.sqrt(3)*(G - B), 2*R - G - B);
                    break;
                  case 'sat':
                    indexValue = Math.max(R, G, B) - Math.min(R, G, B);
                    break;
                  case 'intensity':
                    indexValue = (R + G + B) / 3;
                    break;
                  default:
                    indexValue = 0;
                }
                
                // Get color for this index value
                const color = getColor(indexValue, indexType);
                const rgb = color.match(/\d+/g);
                
                heatmapData[i] = parseInt(rgb[0]);
                heatmapData[i + 1] = parseInt(rgb[1]);
                heatmapData[i + 2] = parseInt(rgb[2]);
                heatmapData[i + 3] = 255; // Alpha
              }
            }
            
            heatmapCtx.putImageData(heatmapImageData, 0, 0);
            heatmapResults[indexType] = heatmapCanvas.toDataURL('image/png');
            
            setProcessedIndices(prev => [...prev, indexType]);
          }
          
          return heatmapResults;
        };
        
        setProcessingStatus('Processing original image...');
        const originalHeatmaps = await processImage(satelliteImg, 'original');
        
        setProcessingStatus('Processing corrected image...');
        const correctedHeatmaps = await processImage(correctedImg, 'corrected');
        
        setHeatmaps({
          original: originalHeatmaps,
          corrected: correctedHeatmaps
        });
      } catch (error) {
        console.error("Error generating heatmaps:", error);
        setProcessingStatus(`Error: ${error.message}`);
      } finally {
        setLoading(false);
        setProcessingStatus('');
      }
    };
    
    generateHeatmaps();
  }, [satelliteImageSrc, satelliteCorrectedImage]);

  const handleGenerateHeatmaps = () => {
    setShowHeatmaps(true);
  };

  return (
    <div className="backdrop-blur-lg bg-white/50 text-gray-800 p-6 md:p-8 overflow-y-auto rounded-3xl shadow-2xl w-full max-w-5xl mx-auto my-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Advanced Analysis</h1>
        <button
          onClick={onBack}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 shadow-sm font-medium flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Comparison
        </button>
      </div>
      
      {satelliteImageSrc && satelliteCorrectedImage && (
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 mb-6">
          <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
            <FaExchangeAlt className="text-green-600 mr-3 text-xl" />
            <h2 className="text-xl font-bold text-gray-800">Before & After Transformation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Original Satellite Image</h3>
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={satelliteImageSrc} 
                  alt="Original Satellite" 
                  className="w-full object-contain"
                />
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Corrected Satellite Image</h3>
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={satelliteCorrectedImage} 
                  alt="Corrected Satellite" 
                  className="w-full object-contain"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            <p>The correction applies RGB adjustments based on the differences between satellite and drone images. This helps match the satellite imagery's color characteristics to ground truth.</p>
          </div>
        </div>
      )}
      
      {/* Vegetation Indices Analysis */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 mb-6">
        <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
          <FaLeaf className="text-green-600 mr-3 text-xl" />
          <h2 className="text-xl font-bold text-gray-800">Vegetation Indices</h2>
        </div>
        <p className="mb-4 text-gray-700">
          These indices help analyze vegetation characteristics based on RGB values. They're useful for assessing plant health, coverage, and characteristics.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Index</th>
                <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Formula</th>
                <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Original</th>
                <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Corrected</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">% Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b border-r border-gray-200">VARI</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">(G-R)/(G+R-B)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.vari}</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{correctedIndices.vari}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.vari, correctedIndices.vari)}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 px-4 border-b border-r border-gray-200">ExG</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">2G-R-B</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.exg}</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{correctedIndices.exg}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.exg, correctedIndices.exg)}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-r border-gray-200">ExR</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">1.4R-G</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.exr}</td>
                <td className="py-2 px-4 border-b border-gray-200">{correctedIndices.exr}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.exr, correctedIndices.exr)}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 px-4 border-b border-r border-gray-200">CIVE</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">0.441R-0.811G+0.385B+18.787</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.cive}</td>
                <td className="py-2 px-4 border-b border-gray-200">{correctedIndices.cive}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.cive, correctedIndices.cive)}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-r border-gray-200">TGI</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">-0.5×[190(R-G)-120(R-B)]</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.tgi}</td>
                <td className="py-2 px-4 border-b border-gray-200">{correctedIndices.tgi}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.tgi, correctedIndices.tgi)}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 px-4 border-b border-r border-gray-200">GLI</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">(2G-R-B)/(2G+R+B)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.gli}</td>
                <td className="py-2 px-4 border-b border-gray-200">{correctedIndices.gli}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.gli, correctedIndices.gli)}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-r border-gray-200">NGRDI</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">(G-R)/(G+R)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.ngrdi}</td>
                <td className="py-2 px-4 border-b border-gray-200">{correctedIndices.ngrdi}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.ngrdi, correctedIndices.ngrdi)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Soil & Bare Earth Indices */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 mb-6">
        <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
          <FaLeaf className="text-amber-600 mr-3 text-xl" />
          <h2 className="text-xl font-bold text-gray-800">🏜️ Soil & Bare Earth Indices</h2>
        </div>
        <p className="mb-4 text-gray-700">
          These indices help identify and analyze soil characteristics and bare earth areas.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Index</th>
                <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Formula</th>
                <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Original</th>
                <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Corrected</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">% Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b border-r border-gray-200">SCI</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">(R-G)/(R+G+B)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.sci}</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{correctedIndices.sci}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.sci, correctedIndices.sci)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Urban / Surface Material Detection */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 mb-6">
        <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
          <FaLeaf className="text-blue-600 mr-3 text-xl" />
          <h2 className="text-xl font-bold text-gray-800">🏙️ Urban / Surface Material Detection</h2>
        </div>
        <p className="mb-4 text-gray-700">
          These indices help identify different surface materials and urban features in imagery.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Index</th>
                <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Formula</th>
                <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Original</th>
                <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Corrected</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">% Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b border-r border-gray-200">Redness Index</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">R²/(B*G)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.rednessIndex}</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{correctedIndices.rednessIndex}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.rednessIndex, correctedIndices.rednessIndex)}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 px-4 border-b border-r border-gray-200">Blueness Index</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">B²/(R*G)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.bluenessIndex}</td>
                <td className="py-2 px-4 border-b border-gray-200">{correctedIndices.bluenessIndex}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.bluenessIndex, correctedIndices.bluenessIndex)}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-r border-gray-200">Greenness Index</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">G²/(R*B)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.greennessIndex}</td>
                <td className="py-2 px-4 border-b border-gray-200">{correctedIndices.greennessIndex}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.greennessIndex, correctedIndices.greennessIndex)}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 px-4 border-b border-r border-gray-200">Color Ratio (R)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">R/(G+B)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.colorRatioR}</td>
                <td className="py-2 px-4 border-b border-gray-200">{correctedIndices.colorRatioR}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.colorRatioR, correctedIndices.colorRatioR)}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-r border-gray-200">Color Ratio (G)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">G/(R+B)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.colorRatioG}</td>
                <td className="py-2 px-4 border-b border-gray-200">{correctedIndices.colorRatioG}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.colorRatioG, correctedIndices.colorRatioG)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Color/Light/Scene Analysis & General Image Features */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 mb-6">
        <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
          <FaLeaf className="text-purple-600 mr-3 text-xl" />
          <h2 className="text-xl font-bold text-gray-800">🎨 Color/Light/Scene Analysis</h2>
        </div>
        <p className="mb-4 text-gray-700">
          These indices analyze general color, brightness, and image characteristics.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Index</th>
                <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Formula</th>
                <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Original</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Corrected</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">% Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b border-r border-gray-200">BI (Brightness Index)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">sqrt(R²+G²+B²)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.bi}</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{correctedIndices.bi}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.bi, correctedIndices.bi)}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 px-4 border-b border-r border-gray-200">NBI (Normalized Brightness)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">(R+G+B)/3</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.nbi}</td>
                <td className="py-2 px-4 border-b border-gray-200">{correctedIndices.nbi}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.nbi, correctedIndices.nbi)}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-r border-gray-200">HUE (Color Hue)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">atan2(sqrt(3)*(G-B), 2*R-G-B)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.hue}</td>
                <td className="py-2 px-4 border-b border-gray-200">{correctedIndices.hue}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.hue, correctedIndices.hue)}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 px-4 border-b border-r border-gray-200">SAT (Saturation)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">max(R,G,B)-min(R,G,B)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.sat}</td>
                <td className="py-2 px-4 border-b border-gray-200">{correctedIndices.sat}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.sat, correctedIndices.sat)}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-r border-gray-200">I (Intensity)</td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">(R+G+B)/3</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices.intensity}</td>
                <td className="py-2 px-4 border-b border-gray-200">{correctedIndices.intensity}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices.intensity, correctedIndices.intensity)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap Visualizations */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 mb-6">
        <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
          <FaLeaf className="text-green-600 mr-3 text-xl" />
          <h2 className="text-xl font-bold text-gray-800">Heatmap Visualizations</h2>
        </div>
        
        {!showHeatmaps ? (
          <div className="text-center py-8">
            <p className="text-gray-700 mb-4">
              Heatmap generation involves intensive calculations that may temporarily slow down your browser.
            </p>
            <button 
              onClick={handleGenerateHeatmaps}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-sm font-medium"
            >
              Generate Heatmaps
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-full max-w-md bg-gray-100 rounded-full h-4 mb-4">
              <div 
                className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${(processedIndices.length / totalIndices) * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center">
              <FaSpinner className="animate-spin text-blue-500 mr-3 text-xl" />
              <p>{processingStatus || 'Processing images...'}</p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {processedIndices.length > 0 ? 
                `Processed ${processedIndices.length}/${totalIndices} indices` : 
                'Please wait while we analyze the images. This may take a moment...'}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-700">
              These heatmaps show the spatial distribution of vegetation indices across your images. Greener colors typically indicate higher vegetation density or health.
            </p>
            
            {/* VARI Heatmaps */}
            <div className="mb-8">
              <h3 className="font-medium text-lg text-gray-800 mb-3 pb-1 border-b border-gray-100">VARI (Visible Atmospherically Resistant Index)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Original Image</h4>
                  {heatmaps.original.vari ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.original.vari}
                        alt="VARI Original Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Corrected Image</h4>
                  {heatmaps.corrected.vari ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.corrected.vari}
                        alt="VARI Corrected Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                <p>VARI helps estimate vegetation greenness while minimizing atmospheric effects. Higher values (green) indicate more green vegetation.</p>
              </div>
            </div>
            
            {/* ExG Heatmaps */}
            <div className="mb-8">
              <h3 className="font-medium text-lg text-gray-800 mb-3 pb-1 border-b border-gray-100">ExG (Excess Green Index)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Original Image</h4>
                  {heatmaps.original.exg ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.original.exg}
                        alt="ExG Original Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Corrected Image</h4>
                  {heatmaps.corrected.exg ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.corrected.exg}
                        alt="ExG Corrected Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                <p>ExG emphasizes green areas and is excellent for plant segmentation. Higher values (green) indicate more vegetation.</p>
              </div>
            </div>

            {/* ExR Heatmaps */}
            <div className="mb-8">
              <h3 className="font-medium text-lg text-gray-800 mb-3 pb-1 border-b border-gray-100">ExR (Excess Red Index)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Original Image</h4>
                  {heatmaps.original.exr ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.original.exr}
                        alt="ExR Original Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Corrected Image</h4>
                  {heatmaps.corrected.exr ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.corrected.exr}
                        alt="ExR Corrected Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                <p>ExR highlights red-dominant regions and is often used with ExG to enhance contrast. Useful for distinguishing soil from vegetation.</p>
              </div>
            </div>

            {/* CIVE Heatmaps */}
            <div className="mb-8">
              <h3 className="font-medium text-lg text-gray-800 mb-3 pb-1 border-b border-gray-100">CIVE (Color Index of Vegetation Extraction)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Original Image</h4>
                  {heatmaps.original.cive ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.original.cive}
                        alt="CIVE Original Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Corrected Image</h4>
                  {heatmaps.corrected.cive ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.corrected.cive}
                        alt="CIVE Corrected Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                <p>CIVE is designed specifically to detect green vegetation in complex environments. It performs well in separating plants from soil backgrounds.</p>
              </div>
            </div>

            {/* TGI Heatmaps */}
            <div className="mb-8">
              <h3 className="font-medium text-lg text-gray-800 mb-3 pb-1 border-b border-gray-100">TGI (Triangular Greenness Index)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Original Image</h4>
                  {heatmaps.original.tgi ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.original.tgi}
                        alt="TGI Original Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Corrected Image</h4>
                  {heatmaps.corrected.tgi ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.corrected.tgi}
                        alt="TGI Corrected Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                <p>TGI provides estimation of chlorophyll content using RGB values. It is particularly useful for assessing plant health and stress conditions.</p>
              </div>
            </div>

            {/* GLI Heatmaps */}
            <div className="mb-8">
              <h3 className="font-medium text-lg text-gray-800 mb-3 pb-1 border-b border-gray-100">GLI (Green Leaf Index)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Original Image</h4>
                  {heatmaps.original.gli ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.original.gli}
                        alt="GLI Original Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Corrected Image</h4>
                  {heatmaps.corrected.gli ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.corrected.gli}
                        alt="GLI Corrected Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                <p>GLI is similar to ExG but normalized. It's effective for enhancing plant visibility and is less affected by lighting conditions than some other indices.</p>
              </div>
            </div>

            {/* NGRDI Heatmaps */}
            <div className="mb-8">
              <h3 className="font-medium text-lg text-gray-800 mb-3 pb-1 border-b border-gray-100">NGRDI (Normalized Green-Red Difference Index)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Original Image</h4>
                  {heatmaps.original.ngrdi ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.original.ngrdi}
                        alt="NGRDI Original Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Corrected Image</h4>
                  {heatmaps.corrected.ngrdi ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.corrected.ngrdi}
                        alt="NGRDI Corrected Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                <p>NGRDI is a simpler form of VARI and good for estimating plant health. It's frequently used for crop monitoring and assessment from drone imagery.</p>
              </div>
            </div>

            {/* Soil Indices Heatmaps */}
            <div className="mb-8">
              <h3 className="font-medium text-lg text-gray-800 mb-3 pb-1 border-b border-gray-100">SCI (Soil Color Index)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Original Image</h4>
                  {heatmaps.original.sci ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.original.sci}
                        alt="SCI Original Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Corrected Image</h4>
                  {heatmaps.corrected.sci ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.corrected.sci}
                        alt="SCI Corrected Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                <p>The Soil Color Index (SCI) helps identify bare soil and analyze soil characteristics in imagery.</p>
              </div>
            </div>

            {/* Urban/Surface Indices Heatmaps */}
            <div className="mb-8">
              <h3 className="font-medium text-lg text-gray-800 mb-3 pb-1 border-b border-gray-100">Redness Index</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Original Image</h4>
                  {heatmaps.original.rednessIndex ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.original.rednessIndex}
                        alt="Redness Index Original Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Corrected Image</h4>
                  {heatmaps.corrected.rednessIndex ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.corrected.rednessIndex}
                        alt="Redness Index Corrected Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                <p>The Redness Index is useful for detecting red materials such as bricks, rust, and certain types of soil.</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-medium text-lg text-gray-800 mb-3 pb-1 border-b border-gray-100">Blueness Index</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Original Image</h4>
                  {heatmaps.original.bluenessIndex ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.original.bluenessIndex}
                        alt="Blueness Index Original Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Corrected Image</h4>
                  {heatmaps.corrected.bluenessIndex ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.corrected.bluenessIndex}
                        alt="Blueness Index Corrected Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                <p>The Blueness Index helps identify blue surfaces such as water bodies, certain types of roofing, and blue artificial structures.</p>
              </div>
            </div>

            {/* Color/Light Indices Heatmaps */}
            <div className="mb-8">
              <h3 className="font-medium text-lg text-gray-800 mb-3 pb-1 border-b border-gray-100">Brightness Index (BI)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Original Image</h4>
                  {heatmaps.original.bi ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.original.bi}
                        alt="BI Original Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Corrected Image</h4>
                  {heatmaps.corrected.bi ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.corrected.bi}
                        alt="BI Corrected Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                <p>The Brightness Index (BI) shows the overall brightness of the image, highlighting bright areas that may indicate buildings, roads, or other reflective surfaces.</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-medium text-lg text-gray-800 mb-3 pb-1 border-b border-gray-100">Hue</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Original Image</h4>
                  {heatmaps.original.hue ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.original.hue}
                        alt="Hue Original Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Corrected Image</h4>
                  {heatmaps.corrected.hue ? (
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={heatmaps.corrected.hue}
                        alt="Hue Corrected Heatmap"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 text-center bg-gray-50 text-gray-500">No heatmap available</div>
                  )}
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                <p>The Hue visualization shows the dominant color of each pixel, which can help identify different types of surfaces and materials.</p>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-500">Color scale: <span className="inline-block w-20 h-4 bg-gradient-to-r from-red-600 via-white to-green-600 rounded ml-2"></span></p>
              
              <div className="text-right">
                <span className="text-xs text-gray-500 mr-2">Red = Lower values</span>
                <span className="text-xs text-gray-500">Green = Higher values</span>
              </div>
            </div>
          </>
        )}
      </div>
      
      <p className="text-gray-600 text-sm mb-4">
        Note: Heatmaps are generated directly from the image pixels. The color correction applied to the satellite image can significantly affect vegetation index calculations, producing more accurate representations of ground conditions.
      </p>
    </div>
  );
}