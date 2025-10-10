import { useState, useRef, useLayoutEffect, useCallback } from 'react';
import * as fabric from 'fabric';
import ColorPicker from './ColorPicker';
import DesignControls from './DesignControls';
import TShirtView from './TshirtView';
import TextControls from './TextControls';
import LoadingSpinner from './LoadingSpinner';
import useDataShoppingCart from '../shoppingCart/hooks/useDataShoppingCart';
import SuccessAlert from '../SuccessAlert';
import ErrorAlert from '../ErrorAlert';

const TShirtDesigner = ({ product }) => {

  const { addToCart } = useDataShoppingCart();
  const [tshirtColor, setTshirtColor] = useState('#ffffff');
  const [viewSide, setViewSide] = useState('front');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const fileInputRef = useRef(null);
  const dualImage = '/images/dualchemis.png';
  const tazaImage = '/images/Taza.png'

  const toggleViewSide = useCallback(() => {
    setViewSide(prev => (prev === 'front' ? 'back' : 'front'));
  }, []);

  const saveState = useCallback(() => {
    if (!canvas) return;
    const state = JSON.stringify(canvas.toJSON());
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [canvas, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0 && canvas) {
      const prevState = history[historyIndex - 1];
      canvas.loadFromJSON(prevState, () => {
        canvas.renderAll();
        setHistoryIndex(historyIndex - 1);
      });
    }
  }, [canvas, history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1 && canvas) {
      const nextState = history[historyIndex + 1];
      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
        setHistoryIndex(historyIndex + 1);
      });
    }
  }, [canvas, history, historyIndex]);

  useLayoutEffect(() => {
  const canvasEl = canvasRef.current;
  if (!canvasEl) return;

  // Si ya hay un canvas de fabric inicializado sobre este canvas, eliminarlo antes de crear uno nuevo
  if (canvasRef.current._fabricCanvas) {
    canvasRef.current._fabricCanvas.dispose();
    canvasRef.current._fabricCanvas = null;
  }

  const parent = canvasEl.parentElement;
  if (!parent) return;

  const { width, height } = parent.getBoundingClientRect();
  if (width === 0 || height === 0) return; // o usa setTimeout si quieres esperar

  const fabricCanvas = new fabric.Canvas(canvasEl, {
    selection: true,
    preserveObjectStacking: true,
    perPixelTargetFind: true,
    selectionFullyContained: false,
    skipTargetFind: false,
    renderOnAddRemove: true,
    snapAngle: 15,
    centeredScaling: true,
    centeredRotation: true,
    enableRetinaScaling: true,
    imageSmoothingEnabled: true,
  });

  fabricCanvas.setWidth(width);
  fabricCanvas.setHeight(height);
  fabricCanvas.defaultCursor = 'default';
  fabricCanvas.hoverCursor = 'move';
  fabricCanvas.moveCursor = 'move';
  fabricCanvas.backgroundColor = 'transparent';

  // Guardar referencia directa en el canvas DOM para futuras referencias
  canvasRef.current._fabricCanvas = fabricCanvas;

  // Registrar eventos, saveState, etc...
  fabricCanvas.on('object:modified', (e) => {
    const obj = e.target;
    if (!obj) return;

    const left = Math.max(0, Math.min(obj.left, fabricCanvas.getWidth() - obj.getScaledWidth()));
    const top = Math.max(0, Math.min(obj.top, fabricCanvas.getHeight() - obj.getScaledHeight()));

    obj.set({ left, top });
    obj.setCoords();
    fabricCanvas.renderAll();
    saveState();
  });

  // Aquí puedes agregar más eventos según tu código...

  setCanvas(fabricCanvas);

  return () => {
    fabricCanvas.dispose();
    canvasRef.current._fabricCanvas = null;
  };
}, []);


  const handleImageUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file || !canvas) return;

      if (!['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif'].includes(file.type)) {
        ErrorAlert('Por favor, sube solo imágenes JPG, PNG, SVG o GIF');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        ErrorAlert('La imagen es muy grande. Máximo 10MB');
        return;
      }

      setIsLoading(true);

      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgElement = new Image();
          imgElement.crossOrigin = 'anonymous';
          imgElement.src = event.target.result;

          imgElement.onload = () => {
            // Calcular escala para que la imagen no sea demasiado grande
            const maxSize = Math.min(canvas.getWidth(), canvas.getHeight()) * 0.4;
            const scale = Math.min(maxSize / imgElement.width, maxSize / imgElement.height);

            const fabricImage = new fabric.Image(imgElement, {
              scaleX: scale,
              scaleY: scale,
              left: canvas.getWidth() / 2,
              top: canvas.getHeight() / 2,
              originX: 'center',
              originY: 'center',
              selectable: true,
              evented: true,
              hasControls: true,
              hasBorders: true,
              lockUniScaling: true,
              borderColor: '#ff6b9d',
              cornerColor: '#ff6b9d',
              cornerSize: 10,
              transparentCorners: false,
            });

            canvas.add(fabricImage);
            canvas.setActiveObject(fabricImage);
            canvas.renderAll();
            saveState();
            setIsLoading(false);
          };

          imgElement.onerror = () => {
            console.error('Error al cargar la imagen');
            setIsLoading(false);
          };
        };

        reader.onerror = () => {
          console.error('Error al leer el archivo');
          setIsLoading(false);
        };

        reader.readAsDataURL(file);
        e.target.value = '';
      } catch (error) {
        console.error('Error en handleImageUpload:', error);
        setIsLoading(false);
        ErrorAlert('Error al cargar la imagen');
      }
    },
    [canvas, saveState]
  );

  const handleDeleteDesign = useCallback(() => {
    if (canvas) {
      const activeObjects = canvas.getActiveObjects();
      if (activeObjects.length > 0) {
        activeObjects.forEach(obj => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.renderAll();
        saveState();
      }
    }
  }, [canvas, saveState]);

  const handleAddText = useCallback((text, fontSize, fontFamily, color) => {
    if (!canvas || !text.trim()) return;

    const textObj = new fabric.Textbox(text, {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      originX: 'center',
      originY: 'center',
      fontSize: fontSize || 24,
      fill: color || '#000000',
      fontFamily: fontFamily || 'Arial',
      editable: true,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      lockUniScaling: false,
      borderColor: '#ff6b9d',
      cornerColor: '#ff6b9d',
      cornerSize: 10,
      transparentCorners: false,
      width: Math.min(200, canvas.getWidth() * 0.8),
      splitByGrapheme: false,
    });

    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.renderAll();
    saveState();
  }, [canvas, saveState]);

  // Exporta el diseño combinado
 const exportDesign = useCallback(() => {
  return new Promise((resolve) => {
    if (!canvas) return resolve(null);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.getWidth();
    tempCanvas.height = canvas.getHeight();
    const ctx = tempCanvas.getContext('2d');

    // elegir imagen base según producto
    const baseImage = new Image();
    baseImage.crossOrigin = 'anonymous';
    const isTaza = product?.subCategoryId === "68af2494a7e54f57647273ab";
    baseImage.src = isTaza ? tazaImage : dualImage;

    baseImage.onload = () => {
      ctx.drawImage(baseImage, 0, 0, tempCanvas.width, tempCanvas.height);

      // dibuja el diseño
      const designData = canvas.toDataURL('image/png', 1.0);
      const designImage = new Image();
      designImage.crossOrigin = 'anonymous';
      designImage.src = designData;

      designImage.onload = () => {
        ctx.drawImage(designImage, 0, 0);

        // si NO es taza, dibujar el círculo de color
        if (!isTaza) {
          const circleRadius = 15;
          const padding = 10;
          const circleX = tempCanvas.width - circleRadius - padding;
          const circleY = tempCanvas.height - circleRadius - padding;

          ctx.beginPath();
          ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
          ctx.fillStyle = tshirtColor;
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        const finalImage = tempCanvas.toDataURL('image/png', 1.0);
        resolve(finalImage);
      };

      designImage.onerror = () => resolve(null);
    };

    baseImage.onerror = () => {
      const designData = canvas.toDataURL('image/png', 1.0);
      resolve(designData);
    };
  });
}, [canvas, tshirtColor, product]);




const handleAddToCart = useCallback(async () => {
  if (!canvas || canvas.getObjects().length === 0) {
    ErrorAlert('No hay diseño para agregar.');
    return;
  }

  setIsLoading(true);

  try {
    const finalImage = await exportDesign();

    if (!finalImage) {
      throw new Error('No se pudo exportar el diseño');
    }

    const TAZA_SUBCATEGORY_ID = "68af2494a7e54f57647273ab";
    const isTaza = product?.subCategoryId === TAZA_SUBCATEGORY_ID;

    const customProduct = {
      _id: `custom-${Date.now()}`,
      name: product?.name || (isTaza ? "Taza Personalizada" : "Camiseta Personalizada"),
      price: product?.price || 15.99,
      image: null, // No debe ser finalImage
      customDesign: finalImage,
      baseImage: isTaza ? "/images/Taza.png" : "/images/dualchemis.png", // ✅ Aquí
      description: product?.description || "Diseño único creado en el editor",
      size: product?.selectedSize || null,
      flavor: null,
      isCustom: true,
      subCategoryId: product?.subCategoryId || null,
      tshirtColor: tshirtColor,
      isTaza: isTaza,
    };

    addToCart(customProduct, 1);
    SuccessAlert('Diseño agregado al carrito');
  } catch (err) {
    console.error('Error al agregar al carrito:', err);
    ErrorAlert('No se pudo agregar el diseño al carrito');
  } finally {
    setIsLoading(false);
  }
}, [canvas, exportDesign, addToCart, tshirtColor, product]);


  return (
    <div className="app-container">
      {isLoading && <LoadingSpinner />}

      <div className="header-section">
        <div className="tshirt-display">
          <TShirtView 
            tshirtColor={tshirtColor} 
            viewSide={viewSide} 
            canvasRef={canvasRef} 
          />
        </div>

        <div className="text-controls-header">
          <TextControls
            onAddText={handleAddText}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onUndo={undo}
            onRedo={redo}
          />
        </div>
      </div>

      <div className="content-section">
        <div className="controls-row">
          <ColorPicker color={tshirtColor} onChange={setTshirtColor} />
          <DesignControls
            onImageUpload={handleImageUpload}
            onDelete={handleDeleteDesign}
            hasSelection={canvas?.getActiveObjects()?.length > 0}
            fileInputRef={fileInputRef}
            isLoading={isLoading}
            fabricCanvas={canvas}
            exportDesign={exportDesign}
            product={product}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default TShirtDesigner;