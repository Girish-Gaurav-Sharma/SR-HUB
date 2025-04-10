import { useState, useEffect } from 'react';
import { 
  calculateRGBDifference, 
  calculateRGBPercentageDifference, 
  applyCorrectionToRGB 
} from '../utils/colorUtils';
import ImageViewer from './ImageViewer';
import AnalysisResults from './AnalysisResults';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/image-viewer.css'; // Import additional CSS

const Correction = () => {
    // Image states
    const [droneImage, setDroneImage] = useState(null);
    const [satelliteImage, setSatelliteImage] = useState(null);
    
    // RGB values
    const [droneRGB, setDroneRGB] = useState(null);
    const [satelliteRGB, setSatelliteRGB] = useState(null);
    
    // Analysis results
    const [rgbDifference, setRgbDifference] = useState(null);
    const [percentageDifference, setPercentageDifference] = useState(null);
    const [correctedRgb, setCorrectedRgb] = useState(null);
    const [error, setError] = useState(null);
    const [showInstructions, setShowInstructions] = useState(true);

    // Calculate differences when both RGB values are available
    useEffect(() => {
        if (!droneRGB || !satelliteRGB) {
            setRgbDifference(null);
            setPercentageDifference(null);
            setCorrectedRgb(null);
            return;
        }
        
        try {
            // Calculate absolute difference
            const difference = calculateRGBDifference(droneRGB, satelliteRGB);
            setRgbDifference(difference);

            // Calculate percentage difference
            const percDiff = calculateRGBPercentageDifference(droneRGB, satelliteRGB);
            setPercentageDifference(percDiff);
            
            // Calculate corrected RGB value
            const corrected = applyCorrectionToRGB(satelliteRGB, percDiff);
            setCorrectedRgb(corrected);
        } catch (err) {
            console.error("Error calculating differences:", err);
            setError("Failed to calculate color differences. Please ensure you've selected valid areas in both images.");
        }
    }, [droneRGB, satelliteRGB]);

    // Clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0 flex items-center">
                        <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 11.955 0 0112 2.944a11.955 11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Satellite-Drone Image Correction Tool
                    </h1>
                    
                    <button 
                        onClick={() => setShowInstructions(!showInstructions)}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-200 transition-colors flex items-center"
                    >
                        {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
                        <svg 
                            className={`ml-2 h-5 w-5 transform transition-transform ${showInstructions ? 'rotate-180' : ''}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
                
                <AnimatePresence>
                    {showInstructions && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4"
                        >
                            <h2 className="text-lg font-medium text-blue-800 mb-2">How to use this tool</h2>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                                <li>Upload a drone image (ground truth) and a satellite image of the same geographic area</li>
                                <li>Use the blue selection box to select the same corresponding area in both images</li>
                                <li>The tool will calculate color differences and generate correction factors</li>
                                <li>These correction factors can be applied to future satellite images to achieve more accurate colors</li>
                            </ol>
                            
                            <div className="mt-4 flex items-start">
                                <svg className="h-5 w-5 text-blue-700 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-xs text-blue-700">
                                    For best results, select areas with consistent color and similar features in both images.
                                    Avoid shadows, reflective surfaces, or areas that may have changed between image captures.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
            
            <AnimatePresence>
                {error && (
                    <motion.div 
                        className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <p className="font-bold">Error</p>
                                <p>{error}</p>
                                <button 
                                    onClick={() => setError(null)}
                                    className="mt-2 text-sm text-red-700 hover:text-red-900 font-medium underline"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <ImageViewer
                    image={droneImage}
                    setImage={setDroneImage}
                    onRgbCalculated={setDroneRGB}
                    rgbValue={droneRGB}
                    title="Drone Image (Ground Truth)"
                    type="drone"
                    setError={setError}
                />
                
                <ImageViewer
                    image={satelliteImage}
                    setImage={setSatelliteImage}
                    onRgbCalculated={setSatelliteRGB}
                    rgbValue={satelliteRGB}
                    title="Satellite Image"
                    type="satellite" 
                    setError={setError}
                />
            </div>
            
            {/* Analysis Results */}
            <AnimatePresence>
                {rgbDifference && percentageDifference && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <AnalysisResults 
                            rgbDifference={rgbDifference}
                            percentageDifference={percentageDifference}
                            correctedRgb={correctedRgb}
                            satelliteRGB={satelliteRGB}
                            droneRGB={droneRGB}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Correction;