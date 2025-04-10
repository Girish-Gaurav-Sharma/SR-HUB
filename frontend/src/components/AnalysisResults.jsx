import React from 'react';
import { motion } from 'framer-motion';

const AnalysisResults = ({ rgbDifference, percentageDifference, correctedRgb, satelliteRGB, droneRGB }) => {
  // Format numbers for display
  const formatNumberWithSign = (num) => {
    const value = parseFloat(num);
    return value >= 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
  };

  // Extract RGB components for display
  const extractRGB = (rgbString) => {
    if (!rgbString) return { r: 0, g: 0, b: 0 };
    
    const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10)
      };
    }
    return { r: 0, g: 0, b: 0 };
  };
  
  const droneValues = droneRGB ? extractRGB(droneRGB) : null;
  const satelliteValues = satelliteRGB ? extractRGB(satelliteRGB) : null;
  const correctedValues = correctedRgb ? extractRGB(correctedRgb) : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg rounded-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-4 py-3">
        <h2 className="text-xl font-bold text-white">Analysis Results</h2>
      </div>
      
      <div className="p-6">
        {/* Color comparison section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Color Comparison</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm text-center">
              <div 
                className="h-16 w-full rounded-md border border-gray-300 shadow-inner mb-2" 
                style={{ backgroundColor: droneRGB }}
              ></div>
              <p className="text-sm font-medium">Drone (Ground Truth)</p>
              {droneValues && (
                <p className="text-xs font-mono mt-1">
                  R: {droneValues.r} G: {droneValues.g} B: {droneValues.b}
                </p>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm text-center">
              <div 
                className="h-16 w-full rounded-md border border-gray-300 shadow-inner mb-2" 
                style={{ backgroundColor: satelliteRGB }}
              ></div>
              <p className="text-sm font-medium">Satellite (Original)</p>
              {satelliteValues && (
                <p className="text-xs font-mono mt-1">
                  R: {satelliteValues.r} G: {satelliteValues.g} B: {satelliteValues.b}
                </p>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm text-center">
              <div 
                className="h-16 w-full rounded-md border border-gray-300 shadow-inner mb-2" 
                style={{ backgroundColor: correctedRgb }}
              ></div>
              <p className="text-sm font-medium">Satellite (Corrected)</p>
              {correctedValues && (
                <p className="text-xs font-mono mt-1">
                  R: {correctedValues.r} G: {correctedValues.g} B: {correctedValues.b}
                </p>
              )}
            </div>
          </div>
        </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RGB Difference */}
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
            <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">RGB Difference</h3>
              <p className="text-xs text-gray-500">Absolute difference between images</p>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Red</span>
                    <span className="text-sm font-mono">{rgbDifference.r}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${Math.min(rgbDifference.r / 2.55, 100)}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Green</span>
                    <span className="text-sm font-mono">{rgbDifference.g}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min(rgbDifference.g / 2.55, 100)}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-sm mr-2"></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Blue</span>
                    <span className="text-sm font-mono">{rgbDifference.b}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(rgbDifference.b / 2.55, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Percentage Difference */}
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
            <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Percentage Difference</h3>
              <p className="text-xs text-gray-500">How satellite colors differ from drone</p>
            </div>
            <div className="p-4">
              {[
                { channel: 'Red', value: percentageDifference.r, color: 'bg-red-500' },
                { channel: 'Green', value: percentageDifference.g, color: 'bg-green-500' },
                { channel: 'Blue', value: percentageDifference.b, color: 'bg-blue-500' }
              ].map(item => (
                <div key={item.channel} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{item.channel}</span>
                    <span className="text-sm font-mono">{formatNumberWithSign(item.value)}</span>
                  </div>
                  
                  <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 w-1/2 h-full border-r border-gray-400"></div>
                    <div 
                      className={`absolute top-0 h-full ${item.color} transition-all duration-500`} 
                      style={{
                        width: `${Math.min(Math.abs(parseFloat(item.value)), 100)}%`,
                        left: parseFloat(item.value) < 0 ? 
                               `calc(50% - ${Math.min(Math.abs(parseFloat(item.value)), 100)}%)` : 
                               '50%'
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                    <span>-100%</span>
                    <span>0%</span>
                    <span>+100%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Corrected RGB */}
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
            <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Correction Formula</h3>
              <p className="text-xs text-gray-500">Apply this to future satellite images</p>
            </div>
            <div className="p-4">
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-4">
                <p className="text-sm font-medium mb-2">Correction factors:</p>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2 bg-red-50 rounded border border-red-100">
                    Red: {(1 / (1 + parseFloat(percentageDifference.r) / 100)).toFixed(5)}x
                  </div>
                  <div className="p-2 bg-green-50 rounded border border-green-100">
                    Green: {(1 / (1 + parseFloat(percentageDifference.g) / 100)).toFixed(5)}x
                  </div>
                  <div className="p-2 bg-blue-50 rounded border border-blue-100">
                    Blue: {(1 / (1 + parseFloat(percentageDifference.b) / 100)).toFixed(5)}x
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Corrected RGB value:</p>
                <div className="bg-white p-2 border border-gray-200 rounded-md">
                  <p className="text-sm font-mono text-gray-700 break-all overflow-x-auto">{correctedRgb}</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100">
                <p className="text-xs text-yellow-800">
                  <span className="font-bold">How to use:</span> Multiply each RGB channel of your satellite images by these correction factors to obtain more accurate colors that match ground truth.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Export options */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            <p>These correction factors can be applied to future satellite imagery to achieve more accurate colors.</p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => {
                const correctionData = {
                  dateGenerated: new Date().toISOString(),
                  droneRGB,
                  satelliteRGB,
                  correctedRGB: correctedRgb,
                  correctionFactors: {
                    r: (1 / (1 + parseFloat(percentageDifference.r) / 100)),
                    g: (1 / (1 + parseFloat(percentageDifference.g) / 100)),
                    b: (1 / (1 + parseFloat(percentageDifference.b) / 100))
                  }
                };
                
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(correctionData, null, 2));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "satellite-correction-factors.json");
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Export Correction Data
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisResults;