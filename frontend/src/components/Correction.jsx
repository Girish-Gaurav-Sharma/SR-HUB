import { useState, useEffect, useRef } from 'react';

const Correction = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [rgbValue, setRgbValue] = useState(null);
    const canvasRef = useRef(null);
    const zoomCanvasRef = useRef(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionStart, setSelectionStart] = useState(null);
    const [selectionEnd, setSelectionEnd] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1); // Zoom level for marking
    const [zoomFocus, setZoomFocus] = useState({ x: 0, y: 0 }); // Focus point for zoom

    const [selectedImage2, setSelectedImage2] = useState(null);
    const [imagePreview2, setImagePreview2] = useState(null);
    const [rgbValue2, setRgbValue2] = useState(null);
    const canvasRef2 = useRef(null);
    const zoomCanvasRef2 = useRef(null);
    const [isSelecting2, setIsSelecting2] = useState(false);
    const [selectionStart2, setSelectionStart2] = useState(null);
    const [selectionEnd2, setSelectionEnd2] = useState(null);
    const [zoomLevel2, setZoomLevel2] = useState(1); // Zoom level for marking in the second canvas

    const handleImageChange = (event, setSelectedImage, setImagePreview) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMouseDown = (event, canvasRef, setSelectionStart, setIsSelecting, zoomLevel, setZoomFocus) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) / zoomLevel;
            const y = (event.clientY - rect.top) / zoomLevel;
            setSelectionStart({ x, y });
            setZoomFocus({ x, y }); // Set the zoom focus point
            setIsSelecting(true);
        }
    };

    const handleMouseMove = (event, canvasRef, isSelecting, selectionStart, setSelectionEnd, imagePreview, zoomLevel) => {
        if (isSelecting) {
            const canvas = canvasRef.current;
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const x = (event.clientX - rect.left) / zoomLevel; // Adjust for zoom
                const y = (event.clientY - rect.top) / zoomLevel; // Adjust for zoom
                setSelectionEnd({ x, y });

                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.src = imagePreview;

                img.onload = () => {
                    // Clear and redraw the canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.save();
                    ctx.scale(zoomLevel, zoomLevel); // Apply zoom level
                    ctx.drawImage(img, 0, 0);

                    // Draw selection rectangle
                    if (selectionStart) {
                        ctx.beginPath();
                        ctx.rect(
                            selectionStart.x,
                            selectionStart.y,
                            x - selectionStart.x,
                            y - selectionStart.y
                        );
                        ctx.strokeStyle = 'blue';
                        ctx.lineWidth = 2 / zoomLevel; // Adjust line width for zoom
                        ctx.stroke();
                    }
                    ctx.restore(); // Reset transformations
                };
            }
        }
    };

    const handleMouseUp = (setIsSelecting, selectionStart, selectionEnd, calculateAverageRGB, zoomSelectedArea) => {
        setIsSelecting(false);
        if (selectionStart && selectionEnd) {
            calculateAverageRGB();
            zoomSelectedArea();
        }
    };

    const calculateAverageRGB = (canvasRef, selectionStart, selectionEnd, setRgbValue) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const x = Math.min(selectionStart.x, selectionEnd.x);
            const y = Math.min(selectionStart.y, selectionEnd.y);
            const width = Math.abs(selectionEnd.x - selectionStart.x);
            const height = Math.abs(selectionEnd.y - selectionStart.y);

            const imageData = ctx.getImageData(x, y, width, height).data;
            let r = 0, g = 0, b = 0, count = 0;

            for (let i = 0; i < imageData.length; i += 4) {
                r += imageData[i];
                g += imageData[i + 1];
                b += imageData[i + 2];
                count++;
            }

            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);

            setRgbValue(`rgb(${r}, ${g}, ${b})`);
        }
    };

    useEffect(() => {
        if (imagePreview && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = imagePreview;

            img.onload = () => {
                // Set canvas dimensions to match the image dimensions
                canvas.width = img.width;
                canvas.height = img.height;

                // Clear the canvas and apply zoom
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();

                // Translate to the zoom focus point, apply zoom, and translate back
                ctx.translate(-zoomFocus.x * (zoomLevel - 1), -zoomFocus.y * (zoomLevel - 1));
                ctx.scale(zoomLevel, zoomLevel);

                // Draw the image
                ctx.drawImage(img, 0, 0);
                ctx.restore(); // Reset transformations
            };
        }
    }, [imagePreview, zoomLevel, zoomFocus]);

    useEffect(() => {
        if (imagePreview2 && canvasRef2.current) {
            const canvas = canvasRef2.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = imagePreview2;
            img.onload = () => {
                canvas.width = img.width * zoomLevel2;
                canvas.height = img.height * zoomLevel2;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();
                ctx.scale(zoomLevel2, zoomLevel2);
                ctx.drawImage(img, 0, 0);
                ctx.restore();
            };
        }
    }, [imagePreview2, zoomLevel2]);

    return (
        <div className="image-upload-container">
            <div className="image-section">
                {!imagePreview && (
                    <div className="upload-area">
                        <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, setSelectedImage, setImagePreview)}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="image-upload" className="upload-button">
                            Choose Image
                        </label>
                    </div>
                )}

                {imagePreview && (
                    <div className="image-preview-container">
                        <h3>Preview:</h3>
                        <canvas
                            ref={canvasRef}
                            className="image-preview"
                            onMouseDown={(e) => handleMouseDown(e, canvasRef, setSelectionStart, setIsSelecting, zoomLevel, setZoomFocus)}
                            onMouseMove={(e) => handleMouseMove(e, canvasRef, isSelecting, selectionStart, setSelectionEnd, imagePreview, zoomLevel)}
                            onMouseUp={() => handleMouseUp(setIsSelecting, selectionStart, selectionEnd, () => calculateAverageRGB(canvasRef, selectionStart, selectionEnd, setRgbValue), () => {})}
                        />
                        <div className="zoom-controls">
                            <label>Zoom:</label>
                            <input
                                type="range"
                                min="1"
                                max="3"
                                step="0.1"
                                value={zoomLevel}
                                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                            />
                        </div>
                        {rgbValue && (
                            <p className="rgb-value">Average RGB Value: {rgbValue}</p>
                        )}
                    </div>
                )}
            </div>

            <div className="image-section">
                {!imagePreview2 && (
                    <div className="upload-area">
                        <input
                            type="file"
                            id="image-upload-2"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, setSelectedImage2, setImagePreview2)}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="image-upload-2" className="upload-button">
                            Choose Image
                        </label>
                    </div>
                )}

                {imagePreview2 && (
                    <div className="image-preview-container">
                        <h3>Preview:</h3>
                        <canvas
                            ref={canvasRef2}
                            className="image-preview"
                            onMouseDown={(e) => handleMouseDown(e, canvasRef2, setSelectionStart2, setIsSelecting2, zoomLevel2, setZoomFocus)}
                            onMouseMove={(e) => handleMouseMove(e, canvasRef2, isSelecting2, selectionStart2, setSelectionEnd2, imagePreview2, zoomLevel2)}
                            onMouseUp={() => handleMouseUp(setIsSelecting2, selectionStart2, selectionEnd2, () => calculateAverageRGB(canvasRef2, selectionStart2, selectionEnd2, setRgbValue2), () => {})}
                        />
                        <div className="zoom-controls">
                            <label>Zoom:</label>
                            <input
                                type="range"
                                min="1"
                                max="3"
                                step="0.1"
                                value={zoomLevel2}
                                onChange={(e) => setZoomLevel2(parseFloat(e.target.value))}
                            />
                        </div>
                        {rgbValue2 && (
                            <p className="rgb-value">Average RGB Value: {rgbValue2}</p>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .image-upload-container {
                    display: flex;
                    justify-content: space-between;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .image-section {
                    flex: 1;
                    margin: 0 10px;
                }
                .upload-area {
                    border: 2px dashed #ccc;
                    border-radius: 5px;
                    padding: 20px;
                    text-align: center;
                    margin-bottom: 20px;
                }
                .upload-button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #4285f4;
                    color: white;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-bottom: 10px;
                }
                .image-preview-container {
                    margin-top: 20px;
                }
                .image-preview {
                    max-width: 100%;
                    max-height: 300px;
                    border-radius: 4px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    cursor: crosshair;
                }
                .zoom-controls {
                    margin-top: 10px;
                }
                .zoom-controls label {
                    margin-right: 10px;
                }
                .rgb-value {
                    margin-top: 10px;
                    font-size: 16px;
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
};

export default Correction;