/**
 * OpenSeadragon fabric.js overlay plugin
 */

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
     * @param {Object} options
     * @param {Number} [options.scale=1] Fabric canvas scale
     */
    OpenSeadragon.Viewer.prototype.fabricjsOverlay = function(options) {
        this._fabricjsOverlayInfo = new Overlay(this);
        return this._fabricjsOverlayInfo;
    };

    /**
     * @class Overlay
     * @param {OpenSeadragon.Viewer} viewer The viewer to attach to
     */
    class Overlay {
        constructor(viewer) {
            this.viewer = viewer;
            this.canvas = null;
            this.fabricCanvas = null;
            this._containerWidth = 0;
            this._containerHeight = 0;
            
            this._canvasDiv = document.createElement('div');
            this._canvasDiv.style.position = 'absolute';
            this._canvasDiv.style.left = 0;
            this._canvasDiv.style.top = 0;
            this._canvasDiv.style.width = '100%';
            this._canvasDiv.style.height = '100%';
            this.viewer.canvas.appendChild(this._canvasDiv);
            
            this._fabricDiv = document.createElement('div');
            this._fabricDiv.style.position = 'absolute';
            this._fabricDiv.style.left = 0;
            this._fabricDiv.style.top = 0;
            this._fabricDiv.style.width = '100%';
            this._fabricDiv.style.height = '100%';
            this._canvasDiv.appendChild(this._fabricDiv);
            
            this.fabricCanvas = new fabric.Canvas(this._fabricDiv, {
                enableRetinaScaling: true,
                selection: true
            });
            
            this.canvas = this.fabricCanvas;
            
            // Add event handlers
            this.viewer.addHandler('update-viewport', this.resizeCanvas.bind(this));
            this.viewer.addHandler('open', this.resizeCanvas.bind(this));
            this.viewer.addHandler('rotate', this.resizeCanvas.bind(this));
            this.viewer.addHandler('resize', this.resizeCanvas.bind(this));
            
            // Initialize canvas size
            this.resizeCanvas();
        }
        
        clear() {
            this.canvas.clear();
        }
        
        resizeCanvas() {
            if (!this.viewer || !this.viewer.viewport) return;
            
            const viewportZoom = this.viewer.viewport.getZoom(true);
            const image1 = this.viewer.world.getItemAt(0);
            
            const containerSize = this.viewer.viewport.getContainerSize();
            const canvasWidth = containerSize.x;
            const canvasHeight = containerSize.y;
            
            if (this._containerWidth !== canvasWidth || this._containerHeight !== canvasHeight) {
                this._containerWidth = canvasWidth;
                this._containerHeight = canvasHeight;
                this.canvas.setDimensions({
                    width: canvasWidth,
                    height: canvasHeight
                });
            }
            
            // Set scale and position
            const viewportWindowPoint = this.viewer.viewport.viewportToWindowCoordinates(new OpenSeadragon.Point(0, 0));
            const zoom = this.viewer.viewport.getZoom(true);
            
            if (image1) {
                const imageWindowPoint = image1.imageToWindowCoordinates(new OpenSeadragon.Point(0, 0));
                const x = imageWindowPoint.x - viewportWindowPoint.x;
                const y = imageWindowPoint.y - viewportWindowPoint.y;
                
                const scale = zoom * this.viewer.viewport._containerInnerSize.x * image1._scaleFactors.x;
                
                this.canvas.setZoom(scale);
                this.canvas.absolutePan(new fabric.Point(x, y));
            }
            
            this.canvas.renderAll();
        }
    }

    /**
     * Simplified initialization method
     */
    OpenSeadragon.Viewer.prototype.initFabricjsOverlay = function() {
        if (!this._fabricjsOverlayInfo) {
            this._fabricjsOverlayInfo = new Overlay(this);
        }
        
        return this._fabricjsOverlayInfo;
    };
})();