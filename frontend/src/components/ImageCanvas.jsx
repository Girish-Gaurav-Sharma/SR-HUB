import { useState, useEffect } from 'react';

const ImageCanvas = ({ 
  imagePreview, 
  canvasRef, 
  zoomLevel, 
  setZoomLevel, 
  panPosition, 
  setPanPosition, 
  onRgbCalculated 
}) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState(null);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);

  const handleMouseDown = (event) => {
    if (event.button === 1 || (event.button === 0 && event.ctrlKey)) {
      event.preventDefault();
      setIsPanning(true);
      setLastPanPoint({ x: event.clientX, y: event.clientY });
    } else {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / zoomLevel;
        const y = (event.clientY - rect.top) / zoomLevel;
        setSelectionStart({ x, y });
        setIsSelecting(true);
      }
    }
  };

  const handleMouseMove = (event) => {
    if (isPanning) {
      const deltaX = event.clientX - lastPanPoint.x;
      const deltaY = event.clientY - lastPanPoint.y;
      
      setPanPosition({
        x: panPosition.x + deltaX,
        y: panPosition.y + deltaY
      });
      
      setLastPanPoint({ x: event.clientX, y: event.clientY });
    } else if (isSelecting) {
      const canvas = canvasRef.current;
      if (canvas && imagePreview) {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / zoomLevel;
        const y = (event.clientY - rect.top) / zoomLevel;
        setSelectionEnd({ x, y });

        drawImageWithSelection(x, y);
      }
    }
  };

  const drawImageWithSelection = (currentX, currentY) => {
    const canvas = canvasRef.current;
    if (!canvas || !imagePreview) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
          currentX - selectionStart.x,
          currentY - selectionStart.y
        );
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2 / zoomLevel; // Adjust line width for zoom
        ctx.stroke();
      }
      ctx.restore(); // Reset transformations
    };
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    } else if (isSelecting) {
      setIsSelecting(false);
      if (selectionStart && selectionEnd) {
        calculateAverageRGB();
      }
    }
  };

  const calculateAverageRGB = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const x = Math.min(selectionStart.x, selectionEnd.x);
      const y = Math.min(selectionStart.y, selectionEnd.y);
      const width = Math.abs(selectionEnd.x - selectionStart.x) || 1; // Ensure non-zero width
      const height = Math.abs(selectionEnd.y - selectionStart.y) || 1; // Ensure non-zero height

      // Clamp values to prevent going outside the canvas
      const safeX = Math.max(0, Math.min(x, canvas.width / zoomLevel));
      const safeY = Math.max(0, Math.min(y, canvas.height / zoomLevel));
      const safeWidth = Math.min(width, (canvas.width / zoomLevel) - safeX);
      const safeHeight = Math.min(height, (canvas.height / zoomLevel) - safeY);
      
      if (safeWidth <= 0 || safeHeight <= 0) return;
      
      const imageData = ctx.getImageData(safeX, safeY, safeWidth, safeHeight).data;
      let r = 0, g = 0, b = 0, count = 0;

      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
        count++;
      }

      if (count > 0) {
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        onRgbCalculated(`rgb(${r}, ${g}, ${b})`);
      }
    } catch (error) {
      console.error("Error calculating RGB values:", error);
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    
    // Get mouse position relative to canvas
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Calculate position in original image coordinates
    const originalX = (mouseX - panPosition.x) / zoomLevel;
    const originalY = (mouseY - panPosition.y) / zoomLevel;
    
    // Determine new zoom level
    const delta = -event.deltaY || event.deltaZ || 0;
    const zoomFactor = 0.1;
    const newZoomLevel = Math.max(1, Math.min(10, zoomLevel * (1 + Math.sign(delta) * zoomFactor)));
    
    // Calculate new pan position to keep the point under cursor at the same position
    const newPanX = mouseX - originalX * newZoomLevel;
    const newPanY = mouseY - originalY * newZoomLevel;
    
    setZoomLevel(newZoomLevel);
    setPanPosition({ x: newPanX, y: newPanY });
  };

  // Effect for initial render and updates
  useEffect(() => {
    if (imagePreview && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      
      // Add error handling for image loading
      img.onerror = () => {
        console.error('Error loading image');
        ctx.fillStyle = '#f8d7da';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#721c24';
        ctx.font = '16px sans-serif';
        ctx.fillText('Error loading image', 20, 50);
      };
      
      img.onload = () => {
        try {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.save();
          
          // Apply pan and zoom transformations
          ctx.translate(panPosition.x, panPosition.y);
          ctx.scale(zoomLevel, zoomLevel);
          
          // Draw the image centered if it's smaller than canvas at current zoom
          const scaledImgWidth = img.width * zoomLevel;
          const scaledImgHeight = img.height * zoomLevel;
          
          if (scaledImgWidth < canvas.width && scaledImgHeight < canvas.height && panPosition.x === 0 && panPosition.y === 0) {
            // Center the image when not panned and smaller than canvas
            const centerX = (canvas.width - scaledImgWidth) / 2 / zoomLevel;
            const centerY = (canvas.height - scaledImgHeight) / 2 / zoomLevel;
            ctx.drawImage(img, centerX, centerY);
          } else {
            // Draw normally with pan and zoom applied
            ctx.drawImage(img, 0, 0);
          }
          
          ctx.restore();
        } catch (error) {
          console.error("Error rendering canvas:", error);
        }
      };
      
      img.src = imagePreview;
    }
  }, [imagePreview, zoomLevel, panPosition, canvasRef]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="w-full max-h-[300px] rounded-lg shadow-md cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onMouseLeave={() => {
          setIsPanning(false);
          setIsSelecting(false);
        }}
        // Add keyboard accessibility
        tabIndex={0}
        aria-label="Image canvas for color selection"
      />
      <div className="mt-3 flex items-center">
        <span className="mr-2 font-medium">Zoom: {zoomLevel.toFixed(1)}x</span>
        <button 
          className="px-2 py-1 bg-gray-200 rounded-md text-sm mr-2"
          onClick={() => {
            setZoomLevel(1);
            setPanPosition({ x: 0, y: 0 });
          }}
        >
          Reset View
        </button>
      </div>
    </>
  );
};

export default ImageCanvas;