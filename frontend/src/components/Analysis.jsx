import React, { useEffect, useState, useRef } from 'react';
import { FaArrowLeft, FaExchangeAlt, FaLeaf, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Analysis({ satelliteData, droneData, onBack, satelliteImageSrc, satelliteCorrectedImage }) {
  const [heatmaps, setHeatmaps] = useState({ original: {}, corrected: {} });
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
      <div className="text-center p-5">
        <p>No image data available for analysis</p>
        <button
          onClick={onBack}
          className="mt-5 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-all duration-200 shadow-sm font-medium flex items-center mx-auto"
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
    
    // Helper for calculations that might produce division by zero
    const safeDiv = (num, denom) => denom !== 0 ? (num / denom).toFixed(3) : "N/A";
    
    return { 
      // Vegetation indices
      vari: safeDiv(G - R, G + R - B),
      exg: (2 * G - R - B).toFixed(3),
      exr: (1.4 * R - G).toFixed(3),
      cive: (0.441 * R - 0.811 * G + 0.385 * B + 18.78745).toFixed(3),
      tgi: (-0.5 * (190 * (R - G) - 120 * (R - B))).toFixed(3),
      gli: safeDiv(2 * G - R - B, 2 * G + R + B),
      ngrdi: safeDiv(G - R, G + R),
      
      // Soil indices
      sci: safeDiv(R - G, R + G + B),
      
      // Urban/Surface indices
      rednessIndex: safeDiv(R * R, B * G),
      bluenessIndex: safeDiv(B * B, R * G),
      greennessIndex: safeDiv(G * G, R * B),
      colorRatioR: safeDiv(R, G + B),
      colorRatioG: safeDiv(G, R + B),
      
      // Color/Light indices
      bi: Math.sqrt(R*R + G*G + B*B).toFixed(3),
      nbi: ((R + G + B) / 3).toFixed(3),
      hue: Math.atan2(Math.sqrt(3)*(G - B), 2*R - G - B).toFixed(3),
      sat: (Math.max(R, G, B) - Math.min(R, G, B)).toFixed(3),
      intensity: ((R + G + B) / 3).toFixed(3)
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
    
    const percentError = ((corrVal - origVal) / Math.abs(origVal) * 100).toFixed(1);
    return `${percentError}%`;
  };

  // Function to generate color based on index value
  const getColor = (value, indexType) => {
    // Different color scales for different indices
    const scales = {
      // Vegetation indices
      vari: { min: -0.5, max: 0.5, colors: ['#f00', '#fff', '#0f0'] },
      exg: { min: -1, max: 1, colors: ['#a00', '#fff', '#0a0'] },
      exr: { min: -0.5, max: 0.5, colors: ['#00a', '#fff', '#a00'] },
      cive: { min: 18, max: 20, colors: ['#a00', '#fff', '#0a0'] },
      tgi: { min: -10, max: 10, colors: ['#a00', '#fff', '#0a0'] },
      gli: { min: -0.5, max: 0.5, colors: ['#a00', '#fff', '#0a0'] },
      ngrdi: { min: -0.5, max: 0.5, colors: ['#a00', '#fff', '#0a0'] },
      
      // Soil indices
      sci: { min: -0.3, max: 0.3, colors: ['#0a0', '#fff', '#a52'] },
      
      // Urban/Surface indices
      rednessIndex: { min: 0, max: 3, colors: ['#fff', '#faa', '#f00'] },
      bluenessIndex: { min: 0, max: 3, colors: ['#fff', '#aaf', '#00f'] },
      greennessIndex: { min: 0, max: 3, colors: ['#fff', '#afa', '#0f0'] },
      colorRatioR: { min: 0, max: 1.5, colors: ['#00a', '#fff', '#a00'] },
      colorRatioG: { min: 0, max: 1.5, colors: ['#a00', '#fff', '#0a0'] },
      
      // Color/Light indices
      bi: { min: 0, max: 1.5, colors: ['#000', '#888', '#fff'] },
      nbi: { min: 0, max: 1, colors: ['#000', '#888', '#fff'] },
      hue: { min: -Math.PI, max: Math.PI, colors: ['#f00', '#0f0', '#00f', '#f00'] },
      sat: { min: 0, max: 1, colors: ['#888', '#fff', '#f00'] },
      intensity: { min: 0, max: 1, colors: ['#000', '#888', '#fff'] }
    };
    
    const scale = scales[indexType];
    
    // Clamp the value to the min-max range
    const normalized = Math.max(0, Math.min(1, (value - scale.min) / (scale.max - scale.min)));
    
    // Helper function to interpolate between colors
    const interpolateColor = (color1, color2, factor) => {
      const r = Math.round(parseInt(color1.substring(1, 3), 16) * (1 - factor) + 
                          parseInt(color2.substring(1, 3), 16) * factor);
      const g = Math.round(parseInt(color1.substring(3, 5), 16) * (1 - factor) + 
                          parseInt(color2.substring(3, 5), 16) * factor);
      const b = Math.round(parseInt(color1.substring(5, 7), 16) * (1 - factor) + 
                          parseInt(color2.substring(5, 7), 16) * factor);
      return `rgb(${r}, ${g}, ${b})`;
    };
    
    // Interpolate between colors
    if (normalized <= 0.5) {
      return interpolateColor(scale.colors[0], scale.colors[1], normalized * 2);
    } else {
      return interpolateColor(scale.colors[1], scale.colors[2], (normalized - 0.5) * 2);
    }
  };

  // Helper function to calculate index value for a pixel
  const calculateIndexForPixel = (R, G, B, indexType) => {
    switch (indexType) {
      // Vegetation indices
      case 'vari': return (G + R - B) !== 0 ? (G - R) / (G + R - B) : 0;
      case 'exg': return 2 * G - R - B;
      case 'exr': return 1.4 * R - G;
      case 'cive': return 0.441 * R - 0.811 * G + 0.385 * B + 18.78745;
      case 'tgi': return -0.5 * (190 * (R - G) - 120 * (R - B));
      case 'gli': return (2 * G + R + B) !== 0 ? (2 * G - R - B) / (2 * G + R + B) : 0;
      case 'ngrdi': return (G + R) !== 0 ? (G - R) / (G + R) : 0;
      
      // Soil indices
      case 'sci': return (R + G + B) !== 0 ? (R - G) / (R + G + B) : 0;
      
      // Urban/Surface indices
      case 'rednessIndex': return (B * G) !== 0 ? (R * R) / (B * G) : 0;
      case 'bluenessIndex': return (R * G) !== 0 ? (B * B) / (R * G) : 0;
      case 'greennessIndex': return (R * B) !== 0 ? (G * G) / (R * B) : 0;
      case 'colorRatioR': return (G + B) !== 0 ? R / (G + B) : 0;
      case 'colorRatioG': return (R + B) !== 0 ? G / (R + B) : 0;
      
      // Color/Light indices
      case 'bi': return Math.sqrt(R*R + G*G + B*B);
      case 'nbi': return (R + G + B) / 3;
      case 'hue': return Math.atan2(Math.sqrt(3)*(G - B), 2*R - G - B);
      case 'sat': return Math.max(R, G, B) - Math.min(R, G, B);
      case 'intensity': return (R + G + B) / 3;
      default: return 0;
    }
  };

  // 1. Implement a simple cache for getColor results (minimizes repeated color interpolation):
  const colorCacheRef = useRef({});

  function cachedGetColor(value, indexType) {
    const key = `${indexType}-${value.toFixed(3)}`;
    if (colorCacheRef.current[key]) {
      return colorCacheRef.current[key];
    }
    const color = getColor(value, indexType); // Original getColor call
    colorCacheRef.current[key] = color;
    return color;
  }

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
        
          // Indices to generate
          const indices = [
            'vari','exg','gli','exr','cive','tgi','ngrdi','sci',
            'rednessIndex','bluenessIndex','greennessIndex','colorRatioR','colorRatioG',
            'bi','nbi','hue','sat','intensity'
          ];
        
          // Process each index but track progress in a local variable first
          const heatmapResults = {};
          for (let i = 0; i < indices.length; i++) {
            const indexType = indices[i];
        
            // Update status text once per index instead of multiple times
            setProcessingStatus(`Processing ${indexType} (${i+1}/${indices.length})...`);
        
            const heatmapCanvas = document.createElement('canvas');
            const heatmapCtx = heatmapCanvas.getContext('2d');
            heatmapCanvas.width = img.width;
            heatmapCanvas.height = img.height;
        
            const heatmapImageData = ctx.createImageData(img.width, img.height);
            const heatmapData = heatmapImageData.data;
        
            // Process pixels in bigger chunks to reduce overhead
            const batchSize = 40000;
            const totalPixels = data.length / 4;
            for (let start = 0; start < totalPixels; start += batchSize) {
              // Yield to UI thread
              await new Promise(resolve => requestAnimationFrame(resolve));
              const end = Math.min(start + batchSize, totalPixels);
        
              for (let pixel = start; pixel < end; pixel++) {
                const idx = pixel * 4;
                const r = data[idx], g = data[idx + 1], b = data[idx + 2];
                const R = r / 255, G = g / 255, B = b / 255;
                const indexValue = calculateIndexForPixel(R, G, B, indexType);
        
                // Use cached color
                const color = cachedGetColor(indexValue, indexType);
                const rgb = color.match(/\d+/g);
                heatmapData[idx] = parseInt(rgb[0]);
                heatmapData[idx + 1] = parseInt(rgb[1]);
                heatmapData[idx + 2] = parseInt(rgb[2]);
                heatmapData[idx + 3] = 255;
              }
            }
        
            heatmapCtx.putImageData(heatmapImageData, 0, 0);
            heatmapResults[indexType] = heatmapCanvas.toDataURL('image/png');
        
            // Only update processed indices once per loop iteration
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

  // Helper components for rendering
  const IndexRow = ({ index, formula, original, corrected }) => (
    <tr className={index % 2 === 0 ? "bg-gray-50" : ""}>
      <td className="py-2 px-4 border-b border-r border-gray-200">{original.name}</td>
      <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">{formula}</td>
      <td className="py-2 px-4 border-b border-r border-gray-200">{original.value}</td>
      <td className="py-2 px-4 border-b border-r border-gray-200">{corrected}</td>
      <td className="py-2 px-4 border-b border-gray-200">
        {calculatePercentageError(original.value, corrected)}
      </td>
    </tr>
  );

  const HeatmapPair = ({ title, description, indexKey }) => (
    <div className="mt-5">
      <h3 className="font-medium text-lg text-gray-800 mb-3 pb-1 border-b border-gray-200">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Original Image</h4>
          {heatmaps.original[indexKey] ? (
            <div className="border rounded-md overflow-hidden shadow-sm">
              <img
                src={heatmaps.original[indexKey]}
                alt={`${title} Original Heatmap`}
                className="w-full"
              />
            </div>
          ) : (
            <div className="border rounded-md p-5 text-center bg-gray-50 text-gray-500">No heatmap available</div>
          )}
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Corrected Image</h4>
          {heatmaps.corrected[indexKey] ? (
            <div className="border rounded-md overflow-hidden shadow-sm">
              <img
                src={heatmaps.corrected[indexKey]}
                alt={`${title} Corrected Heatmap`}
                className="w-full"
              />
            </div>
          ) : (
            <div className="border rounded-md p-5 text-center bg-gray-50 text-gray-500">No heatmap available</div>
          )}
        </div>
      </div>
      <div className="mt-2 p-5 bg-gray-50 rounded-md text-sm text-gray-600">
        <p>{description}</p>
      </div>
    </div>
  );

  const IndexTable = ({ title, icon, description, indices }) => (
    <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 mt-5">
      <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
        <FaLeaf className={`${icon} mr-3 text-xl`} />
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      </div>
      <p className="mb-4 text-gray-700">{description}</p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-3 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Index</th>
              <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Formula</th>
              <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Original</th>
              <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Corrected</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">% Change</th>
            </tr>
          </thead>
          <tbody>
            {indices.map((index, i) => (
              <tr key={index.key} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-2 px-4 border-b border-r border-gray-200 relative group">
                  <div>{index.name}</div>
                  <div className="hidden group-hover:block absolute z-10 bg-white p-5 rounded-md shadow-lg border border-gray-200 w-64 text-xs leading-tight text-gray-700 left-0 mt-1">
                    <div className="font-semibold mb-1 text-gray-800">✅ Advantages:</div>
                    <div className="mb-2">{index.advantages}</div>
                    <div className="font-semibold mb-1 text-gray-800">⚠️ Limitations:</div>
                    <div className="mb-2">{index.limitations}</div>
                    <div className="font-semibold mb-1 text-gray-800">🔍 Use Cases:</div>
                    <div>{index.useCase}</div>
                  </div>
                </td>
                <td className="py-2 px-4 border-b border-r border-gray-200 font-mono text-xs">{index.formula}</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{originalIndices[index.key]}</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{correctedIndices[index.key]}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {calculatePercentageError(originalIndices[index.key], correctedIndices[index.key])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-gray-500 mt-3 italic">
        <p>Hover over index names for more information about advantages, limitations, and use cases.</p>
      </div>
    </div>
  );

  // Data for tables with enhanced information
  const vegetationIndices = [
    { 
      key: 'vari', 
      name: 'VARI', 
      formula: '(G-R)/(G+R-B)',
      advantages: 'Utilizes full visible spectrum; reduces atmospheric effects',
      limitations: 'May be less effective in areas with dense vegetation',
      useCase: 'Crop monitoring, urban vegetation analysis'
    },
    { 
      key: 'exg', 
      name: 'ExG', 
      formula: '2G-R-B',
      advantages: 'Simple computation; effective in distinguishing vegetation',
      limitations: 'Sensitive to lighting conditions',
      useCase: 'Agricultural field analysis, plant segmentation'
    },
    { 
      key: 'exr', 
      name: 'ExR', 
      formula: '1.4R-G',
      advantages: 'Complements ExG for better vegetation discrimination',
      limitations: 'May misclassify non-vegetative red objects',
      useCase: 'Vegetation studies, land cover classification'
    },
    { 
      key: 'cive', 
      name: 'CIVE', 
      formula: '0.441R-0.811G+0.385B+18.787',
      advantages: 'Designed for challenging lighting conditions',
      limitations: 'Requires calibration for different sensors',
      useCase: 'Urban vegetation mapping, remote sensing'
    },
    { 
      key: 'tgi', 
      name: 'TGI', 
      formula: '-0.5×[190(R-G)-120(R-B)]',
      advantages: 'Effective in assessing plant health',
      limitations: 'May be influenced by soil background',
      useCase: 'Precision agriculture, crop health monitoring'
    },
    { 
      key: 'gli', 
      name: 'GLI', 
      formula: '(2G-R-B)/(2G+R+B)',
      advantages: 'Balances green enhancement with normalization',
      limitations: 'Less effective in mixed vegetation areas',
      useCase: 'Forest monitoring, vegetation mapping'
    },
    { 
      key: 'ngrdi', 
      name: 'NGRDI', 
      formula: '(G-R)/(G+R)',
      advantages: 'Easy to compute; effective in green vegetation detection',
      limitations: 'May not perform well in heterogeneous landscapes',
      useCase: 'General vegetation assessment'
    }
  ];

  const soilIndices = [
    { 
      key: 'sci', 
      name: 'SCI', 
      formula: '(R-G)/(R+G+B)',
      advantages: 'Simple computation; effective in bare soil areas',
      limitations: 'May misclassify non-soil features with similar colors',
      useCase: 'Soil mapping, land degradation studies'
    }
  ];

  const urbanIndices = [
    { 
      key: 'rednessIndex', 
      name: 'Redness Index', 
      formula: 'R²/(B*G)',
      advantages: 'Highlights red surfaces effectively',
      limitations: 'May misclassify red vegetation',
      useCase: 'Urban material classification, infrastructure monitoring'
    },
    { 
      key: 'bluenessIndex', 
      name: 'Blueness Index', 
      formula: 'B²/(R*G)',
      advantages: 'Effective in detecting blue features',
      limitations: 'Sensitive to shadows and lighting',
      useCase: 'Water body mapping, urban planning'
    },
    { 
      key: 'greennessIndex', 
      name: 'Greenness Index', 
      formula: 'G²/(R*B)',
      advantages: 'Highlights green surfaces',
      limitations: 'May be influenced by non-vegetative green objects',
      useCase: 'Urban vegetation analysis, land cover classification'
    },
    { 
      key: 'colorRatioR', 
      name: 'Color Ratio (R)', 
      formula: 'R/(G+B)',
      advantages: 'Simple computation; useful in material classification',
      limitations: 'May not distinguish materials with similar color ratios',
      useCase: 'Surface material mapping, urban studies'
    },
    { 
      key: 'colorRatioG', 
      name: 'Color Ratio (G)', 
      formula: 'G/(R+B)',
      advantages: 'Simple computation; useful in material classification',
      limitations: 'May not distinguish materials with similar color ratios',
      useCase: 'Surface material mapping, urban studies'
    }
  ];

  const colorIndices = [
    { 
      key: 'bi', 
      name: 'BI (Brightness Index)', 
      formula: 'sqrt(R²+G²+B²)',
      advantages: 'Provides a single brightness value',
      limitations: 'Does not account for color differences',
      useCase: 'Image enhancement, brightness analysis'
    },
    { 
      key: 'nbi', 
      name: 'NBI (Normalized Brightness)', 
      formula: '(R+G+B)/3',
      advantages: 'Simple and quick to compute',
      limitations: 'May not reflect perceptual brightness accurately',
      useCase: 'Image processing, exposure analysis'
    },
    { 
      key: 'hue', 
      name: 'HUE (Color Hue)', 
      formula: 'atan2(sqrt(3)*(G-B), 2R-G-B)',
      advantages: 'Provides color tone information',
      limitations: 'Sensitive to noise and lighting variations',
      useCase: 'Color-based segmentation, object recognition'
    },
    { 
      key: 'sat', 
      name: 'SAT (Saturation)', 
      formula: 'max(R,G,B)-min(R,G,B)',
      advantages: 'Indicates color intensity',
      limitations: 'Does not provide hue information',
      useCase: 'Image enhancement, color analysis'
    },
    { 
      key: 'intensity', 
      name: 'I (Intensity)', 
      formula: '(R+G+B)/3',
      advantages: 'Simple computation',
      limitations: 'May not reflect human perception of brightness',
      useCase: 'Image processing, exposure analysis'
    }
  ];

  // Heatmap descriptions
  const heatmapDescriptions = {
    vari: "VARI (Visible Atmospherically Resistant Index) enhances vegetation detection under atmospheric variations. It utilizes the full visible spectrum (G-R)/(G+R-B) to reduce atmospheric effects. While effective for crop monitoring and urban vegetation analysis, it may be less effective in areas with very dense vegetation.",
    
    exg: "ExG (Excess Green Index) uses the formula 2G-R-B to highlight green vegetation. Its simple computation is effective in distinguishing vegetation from soil and other backgrounds, making it ideal for agricultural field analysis and plant segmentation. However, it can be sensitive to varying lighting conditions.",
    
    exr: "ExR (Excess Red Index) enhances red features using the formula 1.4R-G. It often complements ExG for better vegetation discrimination in challenging environments. While useful for vegetation studies and land cover classification, it may misclassify non-vegetative red objects.",
    
    cive: "CIVE (Color Index of Vegetation Extraction) is designed specifically for complex environments using the formula 0.441R-0.811G+0.385B+18.78745. It performs well in challenging lighting conditions and is valuable for urban vegetation mapping and remote sensing, though it may require calibration for different sensors.",
    
    tgi: "TGI (Triangular Greenness Index) estimates chlorophyll content using -0.5×[190(R-G)-120(R-B)]. This index is particularly effective for assessing plant health in precision agriculture and crop monitoring. However, soil background may influence its accuracy in some environments.",
    
    gli: "GLI (Green Leaf Index) differentiates green vegetation using (2G-R-B)/(2G+R+B). It balances green enhancement with normalization, making it useful for forest monitoring and vegetation mapping. Its effectiveness may decrease in areas with mixed vegetation types.",
    
    ngrdi: "NGRDI (Normalized Green-Red Difference Index) provides a simple greenness measure with (G-R)/(G+R). Easy to compute and effective for vegetation detection, it's valuable for general vegetation assessment but may not perform optimally in heterogeneous landscapes.",
    
    rgbvi: "RGBVI (RGB Vegetation Index) enhances vegetation detection using (G²-R×B)/(G²+R×B). It utilizes all RGB bands and is effective across various conditions, though it can be sensitive to sensor calibration issues.",
    
    sci: "The Soil Color Index (SCI) detects soil presence using (R-G)/(R+G+B). This simple computation is effective for bare soil areas and valuable for soil mapping and land degradation studies, though it may misclassify non-soil features with similar color properties.",
    
    rednessIndex: "The Redness Index (R²/(B×G)) detects red-colored materials such as bricks, rust, and certain soil types. While effective for urban material classification and infrastructure monitoring, it may misclassify red vegetation or be affected by lighting variations.",
    
    bluenessIndex: "The Blueness Index (B²/(R×G)) identifies blue surfaces such as water bodies and certain roofing materials. It's useful for water mapping and urban planning, though it can be sensitive to shadows and varied lighting conditions.",
    
    greennessIndex: "The Greenness Index (G²/(R×B)) detects green objects beyond vegetation. It's valuable for urban vegetation analysis and land cover classification, though it may be influenced by non-vegetative green objects.",
    
    colorRatioR: "The Color Ratio Index for red (R/(G+B)) differentiates surface materials based on their red component proportion. This simple ratio aids in material classification for surface mapping and urban studies.",
    
    colorRatioG: "The Color Ratio Index for green (G/(R+B)) helps differentiate surface materials based on their green component proportion, useful for distinguishing various urban and natural surfaces.",
    
    bi: "The Brightness Index (BI = √(R²+G²+B²)) measures overall brightness across all channels. It provides a single value for brightness analysis and image enhancement, though it doesn't account for color differences.",
    
    nbi: "The Normalized Brightness Index ((R+G+B)/3) calculates average brightness simply. While quick to compute for general image analysis and exposure correction, it may not reflect perceptual brightness accurately.",
    
    hue: "Hue (atan2(√3×(G-B), 2R-G-B)) determines the dominant color tone. This measure is valuable for color-based segmentation and object recognition, though it can be sensitive to noise and lighting variations.",
    
    sat: "Saturation (max(R,G,B)-min(R,G,B)) measures color intensity. While useful for image enhancement and color analysis, it doesn't provide hue information alone.",
    
    intensity: "Intensity ((R+G+B)/3) calculates overall light intensity. This simple computation is fundamental to image processing and exposure analysis, though it's a simplified measure of perceived brightness."
  };

  return (
    <div className="bg-white/95 text-gray-800 p-5 overflow-y-auto rounded-md shadow-md w-full max-w-5xl mx-auto my-5 border border-gray-200">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Advanced Analysis</h1>
        <button
          onClick={onBack}
          className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded-md transition-all duration-200 font-medium flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Comparison
        </button>
      </div>
      
      {satelliteImageSrc && satelliteCorrectedImage && (
        <div className="bg-white p-5 rounded-md shadow-md border border-gray-100 mt-5">
          <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
            <FaExchangeAlt className="text-green-600 mr-3 text-xl" />
            <h2 className="text-xl font-bold text-gray-800 mb-4">Before & After Transformation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Original Satellite Image</h3>
              <div className="border rounded-md overflow-hidden shadow-sm">
                <img 
                  src={satelliteImageSrc} 
                  alt="Original Satellite" 
                  className="w-full object-contain"
                />
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Corrected Satellite Image</h3>
              <div className="border rounded-md overflow-hidden shadow-sm">
                <img 
                  src={satelliteCorrectedImage} 
                  alt="Corrected Satellite" 
                  className="w-full object-contain"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 p-5 bg-blue-50 rounded-md text-sm text-blue-700">
            <p>The correction applies RGB adjustments based on the differences between satellite and drone images. This helps match the satellite imagery's color characteristics to ground truth.</p>
          </div>
        </div>
      )}
      
      {/* Vegetation Indices Analysis */}
      <IndexTable 
        title="Vegetation Indices"
        icon="text-green-600"
        description="These indices help analyze vegetation characteristics based on RGB values. They utilize different band combinations to highlight plant characteristics, stress conditions, and vegetation coverage. Particularly useful for agricultural monitoring, forestry assessments, and urban greenery analysis."
        indices={vegetationIndices}
      />

      {/* Soil & Bare Earth Indices */}
      <IndexTable 
        title="🏜️ Soil & Bare Earth Indices"
        icon="text-amber-600"
        description="These indices help identify and analyze soil characteristics and bare earth areas. They're particularly useful for land degradation studies, erosion monitoring, and distinguishing soil from other surfaces in remote sensing applications."
        indices={soilIndices}
      />

      {/* Urban / Surface Material Detection */}
      <IndexTable 
        title="🏙️ Urban / Surface Material Detection"
        icon="text-blue-600"
        description="These indices help identify different surface materials and urban features in imagery. By exploiting spectral properties of built materials, they can distinguish between buildings, roads, water bodies, and other urban features, aiding in urban planning and land cover classification."
        indices={urbanIndices}
      />

      {/* Color/Light/Scene Analysis & General Image Features */}
      <IndexTable 
        title="🎨 Color/Light/Scene Analysis"
        icon="text-purple-600"
        description="These indices analyze general color, brightness, and image characteristics. Rather than focusing on specific land cover types, they provide information about the overall properties of the image, useful for scene interpretation, image enhancement, and general analysis tasks."
        indices={colorIndices}
      />

      {/* Heatmap Visualizations */}
      <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 mt-5">
        <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
          <FaLeaf className="text-green-600 mr-3 text-xl" />
          <h2 className="text-xl font-bold text-gray-800 mb-4">Heatmap Visualizations</h2>
        </div>
        
        {!showHeatmaps ? (
          <div className="text-center py-8">
            <p className="text-gray-700 mb-4">
              Heatmap generation involves intensive calculations that may temporarily slow down your browser.
            </p>
            <button 
              onClick={() => setShowHeatmaps(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-all duration-200 shadow-sm font-medium"
            >
              Generate Heatmaps
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-full max-w-md bg-gray-100 rounded-md h-4 mb-4">
              <div 
                className="bg-blue-500 h-4 rounded-md transition-all duration-300"
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
            
            {/* Render heatmap pairs for the main indices */}
            <HeatmapPair 
              title="VARI (Visible Atmospherically Resistant Index)" 
              description={heatmapDescriptions.vari}
              indexKey="vari"
            />
            
            <HeatmapPair 
              title="ExG (Excess Green Index)" 
              description={heatmapDescriptions.exg}
              indexKey="exg"
            />

            <HeatmapPair 
              title="ExR (Excess Red Index)" 
              description={heatmapDescriptions.exr}
              indexKey="exr"
            />

            <HeatmapPair 
              title="CIVE (Color Index of Vegetation Extraction)" 
              description={heatmapDescriptions.cive}
              indexKey="cive"
            />

            <HeatmapPair 
              title="TGI (Triangular Greenness Index)" 
              description={heatmapDescriptions.tgi}
              indexKey="tgi"
            />

            <HeatmapPair 
              title="GLI (Green Leaf Index)" 
              description={heatmapDescriptions.gli}
              indexKey="gli"
            />

            <HeatmapPair 
              title="NGRDI (Normalized Green-Red Difference Index)" 
              description={heatmapDescriptions.ngrdi}
              indexKey="ngrdi"
            />

            <HeatmapPair 
              title="SCI (Soil Color Index)" 
              description={heatmapDescriptions.sci}
              indexKey="sci"
            />

            <HeatmapPair 
              title="Redness Index" 
              description={heatmapDescriptions.rednessIndex}
              indexKey="rednessIndex"
            />

            <HeatmapPair 
              title="Blueness Index" 
              description={heatmapDescriptions.bluenessIndex}
              indexKey="bluenessIndex"
            />

            <HeatmapPair 
              title="Brightness Index (BI)" 
              description={heatmapDescriptions.bi}
              indexKey="bi"
            />

            <HeatmapPair 
              title="Hue" 
              description={heatmapDescriptions.hue}
              indexKey="hue"
            />

            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-500">Color scale: <span className="inline-block w-20 h-4 bg-gradient-to-r from-red-600 via-white to-green-600 rounded-md ml-2"></span></p>
              
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

      <div className="bg-gray-50 p-5 rounded-md border border-gray-200 mt-5">
        <h3 className="text-gray-800 font-medium text-lg mb-2">About RGB-based Indices</h3>
        <p className="text-gray-700 text-sm mb-2">
          The indices shown in this analysis are calculated using only RGB (visible light) channels from standard imagery. While traditional remote sensing often uses multispectral data with NIR (Near-Infrared) bands, these RGB-based alternatives provide valuable insights from regular photography.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div className="bg-white/70 p-5 rounded-md text-sm text-gray-700">
            <h4 className="font-medium text-gray-800 mb-1">Using These Indices:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Combine multiple indices for more robust analysis</li>
              <li>Consider environmental conditions when interpreting results</li>
              <li>Results may vary with different sensors and lighting conditions</li>
              <li>RGB indices complement but don't fully replace multispectral analysis</li>
            </ul>
          </div>
          <div className="bg-white/70 p-5 rounded-md text-sm text-gray-700">
            <h4 className="font-medium text-gray-800 mb-1">Common Applications:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Agricultural crop monitoring and stress detection</li>
              <li>Urban vegetation mapping and health assessment</li>
              <li>Land cover classification and change detection</li>
              <li>Environmental monitoring using consumer-grade cameras</li>
              <li>Drone-based surveys without specialized sensors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}