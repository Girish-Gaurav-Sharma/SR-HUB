/**
 * Color utility functions for image correction
 */

// Helper function to extract RGB values from string
const extractRGB = (rgbString) => {
  if (!rgbString) return null;
  
  const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10)
    };
  }
  return null;
};

// Calculate absolute RGB difference between two colors
export const calculateRGBDifference = (rgb1, rgb2) => {
  if (!rgb1 || !rgb2) {
    throw new Error('Invalid RGB values provided');
  }
  
  const color1 = extractRGB(rgb1);
  const color2 = extractRGB(rgb2);
  
  if (!color1 || !color2) {
    throw new Error('Could not parse RGB values');
  }
  
  return {
    r: Math.abs(color1.r - color2.r),
    g: Math.abs(color1.g - color2.g),
    b: Math.abs(color1.b - color2.b)
  };
};

// Calculate percentage differences between RGB values
export const calculateRGBPercentageDifference = (rgb1, rgb2) => {
  if (!rgb1 || !rgb2) {
    throw new Error('Invalid RGB values provided');
  }
  
  const color1 = extractRGB(rgb1); // Drone (ground truth)
  const color2 = extractRGB(rgb2); // Satellite
  
  if (!color1 || !color2) {
    throw new Error('Could not parse RGB values');
  }
  
  // Calculate percentage differences (satellite vs drone)
  // Formula: (satellite - drone) / drone * 100
  const calculatePercentage = (val1, val2) => {
    if (val1 === 0) return val2 === 0 ? 0 : 100;
    return ((val2 - val1) / val1 * 100);
  };
  
  return {
    r: calculatePercentage(color1.r, color2.r),
    g: calculatePercentage(color1.g, color2.g),
    b: calculatePercentage(color1.b, color2.b)
  };
};

// Apply correction to a satellite image RGB value
export const applyCorrectionToRGB = (rgbValue, percentageDifference) => {
  if (!rgbValue || !percentageDifference) {
    throw new Error('Invalid correction parameters');
  }
  
  const color = extractRGB(rgbValue);
  if (!color) {
    throw new Error('Could not parse RGB values');
  }
  
  // Apply correction by inverting the percentage difference
  // We divide by (1 + difference/100) to get the corrected value
  const corrected = {
    r: Math.round(color.r / (1 + parseFloat(percentageDifference.r) / 100)),
    g: Math.round(color.g / (1 + parseFloat(percentageDifference.g) / 100)),
    b: Math.round(color.b / (1 + parseFloat(percentageDifference.b) / 100))
  };
  
  // Ensure values stay in RGB range (0-255)
  corrected.r = Math.max(0, Math.min(255, corrected.r));
  corrected.g = Math.max(0, Math.min(255, corrected.g));
  corrected.b = Math.max(0, Math.min(255, corrected.b));
  
  return `rgb(${corrected.r}, ${corrected.g}, ${corrected.b})`;
};

// Helper function to apply correction factor to an entire image
export const applyImageCorrection = (canvas, correctionFactors) => {
  if (!canvas || !correctionFactors) return false;
  
  try {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Apply correction to each pixel
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, Math.round(data[i] * correctionFactors.r)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round(data[i + 1] * correctionFactors.g)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round(data[i + 2] * correctionFactors.b)));
      // Alpha channel (i+3) remains unchanged
    }
    
    ctx.putImageData(imageData, 0, 0);
    return true;
  } catch (e) {
    console.error('Error applying image correction:', e);
    return false;
  }
};