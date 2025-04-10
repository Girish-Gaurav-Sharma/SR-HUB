// Image processing utility functions

export const calculateAverageRGB = (canvas, selection, setError) => {
    if (!canvas || !selection) return null;
    
    const ctx = canvas.getContext('2d');
    const { x, y, width, height } = selection;
    
    try {
        const imageData = ctx.getImageData(x, y, width, height);
        const data = imageData.data;
        
        let r = 0, g = 0, b = 0;
        let pixelCount = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            pixelCount++;
        }
        
        if (pixelCount > 0) {
            r = Math.round(r / pixelCount);
            g = Math.round(g / pixelCount);
            b = Math.round(b / pixelCount);
            return `rgb(${r}, ${g}, ${b})`;
        }
        
        return null;
    } catch (err) {
        console.error('Error calculating RGB:', err);
        setError && setError('Failed to calculate RGB values');
        return null;
    }
};

// Image validation utility
export const validateImage = (file) => {
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }
    
    if (!file.type.startsWith('image/')) {
        return { valid: false, error: 'File is not an image' };
    }
    
    return { valid: true };
};

// Helper to draw an image on canvas while preserving aspect ratio
export const drawImageWithAspectRatio = (ctx, img, canvas) => {
    if (!ctx || !img || !canvas) return;
    
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.min(hRatio, vRatio);
    
    const centerX = (canvas.width - img.width * ratio) / 2;
    const centerY = (canvas.height - img.height * ratio) / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        img, 
        0, 0, img.width, img.height, 
        centerX, centerY, img.width * ratio, img.height * ratio
    );
};

// Helper to draw selection rectangle
export const drawSelectionRectangle = (ctx, start, end) => {
    if (!ctx) return;
    
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    
    ctx.strokeRect(x, y, width, height);
    ctx.setLineDash([]);
};