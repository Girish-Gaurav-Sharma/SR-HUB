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

    const handleImageChange = (event) => {
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

    const handleMouseDown = (event) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            setSelectionStart({ x, y });
            setIsSelecting(true);
        }
    };

    const handleMouseMove = (event) => {
        if (isSelecting) {
            const canvas = canvasRef.current;
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                setSelectionEnd({ x, y });

                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.src = imagePreview;
                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                };
            }
        }
    };

    const handleMouseUp = () => {
        setIsSelecting(false);
        if (selectionStart && selectionEnd) {
            calculateAverageRGB();
            zoomSelectedArea();
        }
    };

    const calculateAverageRGB = () => {
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

    const zoomSelectedArea = () => {
        const canvas = canvasRef.current;
        const zoomCanvas = zoomCanvasRef.current;
        if (canvas && zoomCanvas) {
            const ctx = canvas.getContext('2d');
            const zoomCtx = zoomCanvas.getContext('2d');
            const x = Math.min(selectionStart.x, selectionEnd.x);
            const y = Math.min(selectionStart.y, selectionEnd.y);
            const width = Math.abs(selectionEnd.x - selectionStart.x);
            const height = Math.abs(selectionEnd.y - selectionStart.y);

            const zoomFactor = 2; // Zoom level
            zoomCanvas.width = width * zoomFactor;
            zoomCanvas.height = height * zoomFactor;

            const img = new Image();
            img.src = imagePreview;
            img.onload = () => {
                zoomCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
                zoomCtx.drawImage(
                    img,
                    x,
                    y,
                    width,
                    height,
                    0,
                    0,
                    width * zoomFactor,
                    height * zoomFactor
                );
            };
        }
    };

    useEffect(() => {
        if (imagePreview && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = imagePreview;
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
        }
    }, [imagePreview]);

    return (
        <div className="image-upload-container">
            {!imagePreview && (
                <div className="upload-area">
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageChange}
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
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    />
                    {rgbValue && (
                        <p className="rgb-value">Average RGB Value: {rgbValue}</p>
                    )}
                    <h3>Zoomed Selection:</h3>
                    <canvas ref={zoomCanvasRef} className="zoom-preview" />
                </div>
            )}

            <style jsx>{`
                .image-upload-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
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
                .zoom-preview {
                    margin-top: 20px;
                    border: 1px solid #ccc;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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