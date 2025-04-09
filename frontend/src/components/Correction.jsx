import { useState, useEffect } from 'react';

const Correction = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Log when component mounts
    useEffect(() => {
        console.log('Correction component mounted');
        return () => console.log('Correction component unmounted');
    }, []);

    // Log when selected image or preview changes
    useEffect(() => {
        if (selectedImage) {
            console.log('Selected image changed:', {
                name: selectedImage.name,
                type: selectedImage.type,
                size: `${(selectedImage.size / 1024).toFixed(2)} KB`
            });
        }
    }, [selectedImage]);

    useEffect(() => {
        console.log('Image preview updated:', imagePreview ? 'Preview available' : 'No preview');
    }, [imagePreview]);

    const handleImageChange = (event) => {
        console.log('Image selection triggered');
        const file = event.target.files[0];
        if (file) {
            console.log('File selected:', file.name);
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log('FileReader: Image loaded successfully');
                setImagePreview(reader.result);
            };
            reader.onerror = (error) => {
                console.error('FileReader error:', error);
            };
            reader.readAsDataURL(file);
        } else {
            console.log('No file selected');
        }
    };

    return (
        <div className="image-upload-container">
            <h2>Image Upload</h2>
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
                {selectedImage && (
                    <p className="file-name">{selectedImage.name}</p>
                )}
            </div>
            
            {imagePreview && (
                <div className="image-preview-container">
                    <h3>Preview:</h3>
                    <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="image-preview" 
                        onLoad={() => console.log('Image preview rendered in DOM')}
                    />
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
                .file-name {
                    margin-top: 10px;
                    font-size: 14px;
                }
                .image-preview-container {
                    margin-top: 20px;
                }
                .image-preview {
                    max-width: 100%;
                    max-height: 300px;
                    border-radius: 4px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    );
};

export default Correction;