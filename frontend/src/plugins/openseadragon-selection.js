(function() {
  if (!window.OpenSeadragon) {
    console.error('OpenSeadragon is not available');
    return;
  }

  if (!window.fabric) {
    console.error('fabric is not available');
    return;
  }

  /**
   * Creates a new fabric.js overlay attached to the viewer
   */
  OpenSeadragon.Viewer.prototype.fabricjsOverlay = function() {
    if (this._fabricjsOverlayInfo) {
      return this._fabricjsOverlayInfo;
    }

    this._fabricjsOverlayInfo = new Overlay(this);
    return this._fabricjsOverlayInfo;
  };

  /**
   * @class Overlay adds fabric.js overlay capabilities to OpenSeadragon
   * @param {OpenSeadragon.Viewer} viewer the viewer to attach to
   */
  class Overlay {
    constructor(viewer) {
      this.viewer = viewer;
      
      // Create a div to hold the canvas
      this._containerWidth = 0;
      this._containerHeight = 0;

      this._canvasDiv = document.createElement('div');
      this._canvasDiv.style.position = 'absolute';
      this._canvasDiv.style.left = 0;
      this._canvasDiv.style.top = 0;
      this._canvasDiv.style.width = '100%';
      this._canvasDiv.style.height = '100%';
      this.viewer.canvas.appendChild(this._canvasDiv);

      // Create fabric canvas
      this._canvas = document.createElement('canvas');
      this._canvasDiv.appendChild(this._canvas);
      
      this.canvas = new fabric.Canvas(this._canvas, {
        enableRetinaScaling: false,
        selection: false,
        controlsAboveOverlay: true
      });

      // Keep canvas dimensions in sync with viewer
      this.viewer.addHandler('animation', this._onAnimation.bind(this));
      this.viewer.addHandler('open', this._onOpen.bind(this));
      this.viewer.addHandler('resize', this._onResize.bind(this));
      this.viewer.addHandler('rotate', this._onRotate.bind(this));
      this.viewer.addHandler('update-viewport', this._onUpdateViewport.bind(this));
      
      this._onUpdateViewport();
    }

    _onOpen() {
      this._onUpdateViewport();
    }

    _onRotate() {
      this._onUpdateViewport();
    }

    _onAnimation() {
      this._onUpdateViewport();
    }

    _onResize() {
      this._resizeCanvas();
    }

    _resizeCanvas() {
      const containerSize = this.viewer.viewport.getContainerSize();
      
      if (this._containerWidth !== containerSize.x ||
          this._containerHeight !== containerSize.y) {
        this._containerWidth = containerSize.x;
        this._containerHeight = containerSize.y;
        
        this.canvas.setDimensions({
          width: containerSize.x,
          height: containerSize.y
        });
      }
    }

    _onUpdateViewport() {
      this._resizeCanvas();
      
      const zoom = this.viewer.viewport.getZoom(true);
      const viewportCenter = this.viewer.viewport.getCenter(true);
      const image = this.viewer.world.getItemAt(0);
      
      if (!image) return;
      
      // Calculate scaling factor
      const scale = image.viewportToImageZoom * zoom;
      
      // Get image pixel coordinates
      const imageBounds = this.viewer.world.getItemAt(0).getBounds();
      const viewerPoint = new OpenSeadragon.Point(0, 0);
      const imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewerPoint);
      
      // Calculate pan offset
      const viewportWindowPoint = this.viewer.viewport.viewportToWindowCoordinates(viewerPoint);
      const imageWindowPoint = image.imageToWindowCoordinates(imagePoint);
      const dx = imageWindowPoint.x - viewportWindowPoint.x;
      const dy = imageWindowPoint.y - viewportWindowPoint.y;
      
      // Apply transforms to fabric canvas
      this.canvas.setZoom(scale);
      this.canvas.absolutePan(new fabric.Point(-dx / scale, -dy / scale));
      
      // Render
      this.canvas.renderAll();
    }
    
    /**
     * Get the image coordinates for a point in the fabric canvas
     */
    fabricToImageCoordinates(fabricPoint) {
      const viewerPoint = new OpenSeadragon.Point(fabricPoint.x, fabricPoint.y);
      const image = this.viewer.world.getItemAt(0);
      
      if (!image) return null;
      
      // Convert from fabric point to viewport coordinates
      const vpPoint = this.viewer.viewport.windowToViewportCoordinates(viewerPoint);
      
      // Then convert to image coordinates
      const imagePoint = this.viewer.viewport.viewportToImageCoordinates(vpPoint);
      
      return {
        x: imagePoint.x,
        y: imagePoint.y
      };
    }

    /**
     * Initialize overlay for direct use with OpenSeadragon
     */
    initializeOSD() {
      // Method kept for backward compatibility
      return this;
    }
  }

  // Add alias method for backward compatibility
  OpenSeadragon.Viewer.prototype.initFabricjsOverlay = OpenSeadragon.Viewer.prototype.fabricjsOverlay;
})();