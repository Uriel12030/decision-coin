"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// Mandelbrot iteration: returns iteration count or maxIter if in set
function mandelbrot(cx: number, cy: number, maxIter: number): number {
  let zx = 0;
  let zy = 0;
  let i = 0;
  while (zx * zx + zy * zy <= 4 && i < maxIter) {
    const tmp = zx * zx - zy * zy + cx;
    zy = 2 * zx * zy + cy;
    zx = tmp;
    i++;
  }
  // Smooth coloring
  if (i < maxIter) {
    const log2 = Math.log(2);
    const nu = Math.log(Math.log(zx * zx + zy * zy) / log2) / log2;
    return i + 1 - nu;
  }
  return maxIter;
}

// HSL to RGB conversion
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

function getColor(iter: number, maxIter: number): [number, number, number] {
  if (iter >= maxIter) return [0, 0, 0];
  const hue = (iter * 8) % 360;
  const sat = 0.8;
  const light = 0.5;
  return hslToRgb(hue, sat, light);
}

interface ViewState {
  centerX: number;
  centerY: number;
  zoom: number;
  maxIter: number;
}

const INITIAL_VIEW: ViewState = {
  centerX: -0.5,
  centerY: 0,
  zoom: 3.5,
  maxIter: 100,
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [view, setView] = useState<ViewState>(INITIAL_VIEW);
  const [rendering, setRendering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setRendering(true);

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const { centerX, centerY, zoom, maxIter } = view;
    const aspect = width / height;
    const xMin = centerX - (zoom / 2) * aspect;
    const yMin = centerY - zoom / 2;
    const xStep = (zoom * aspect) / width;
    const yStep = zoom / height;

    for (let py = 0; py < height; py++) {
      const cy = yMin + py * yStep;
      for (let px = 0; px < width; px++) {
        const cx = xMin + px * xStep;
        const iter = mandelbrot(cx, cy, maxIter);
        const [r, g, b] = getColor(iter, maxIter);
        const idx = (py * width + px) * 4;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setRendering(false);
  }, [view]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      // Limit resolution for performance
      const scale = Math.min(dpr, 1.5);
      canvas.width = Math.floor(rect.width * scale);
      canvas.height = Math.floor(rect.height * scale);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    render();
  }, [render]);

  // Convert pixel position to complex plane coordinates
  const pixelToComplex = useCallback(
    (px: number, py: number): { cx: number; cy: number } => {
      const canvas = canvasRef.current;
      if (!canvas) return { cx: 0, cy: 0 };
      const rect = canvas.getBoundingClientRect();
      const x = ((px - rect.left) / rect.width) * canvas.width;
      const y = ((py - rect.top) / rect.height) * canvas.height;
      const aspect = canvas.width / canvas.height;
      const cx = view.centerX - (view.zoom / 2) * aspect + (x / canvas.width) * view.zoom * aspect;
      const cy = view.centerY - view.zoom / 2 + (y / canvas.height) * view.zoom;
      return { cx, cy };
    },
    [view]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.3 : 1 / 1.3;
      const { cx, cy } = pixelToComplex(e.clientX, e.clientY);

      setView((prev) => {
        const newZoom = prev.zoom * factor;
        // Keep the point under the cursor fixed
        const newCenterX = cx - (cx - prev.centerX) * factor;
        const newCenterY = cy - (cy - prev.centerY) * factor;
        // Increase iterations when zoomed in
        const newMaxIter = Math.max(100, Math.floor(100 + 50 * Math.log2(INITIAL_VIEW.zoom / newZoom)));
        return {
          centerX: newCenterX,
          centerY: newCenterY,
          zoom: newZoom,
          maxIter: newMaxIter,
        };
      });
    },
    [pixelToComplex]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0) {
        setIsDragging(true);
        dragStart.current = {
          x: e.clientX,
          y: e.clientY,
          cx: view.centerX,
          cy: view.centerY,
        };
      }
    },
    [view.centerX, view.centerY]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !dragStart.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const aspect = canvas.width / canvas.height;

      setView((prev) => ({
        ...prev,
        centerX: dragStart.current!.cx - (dx / rect.width) * prev.zoom * aspect,
        centerY: dragStart.current!.cy - (dy / rect.height) * prev.zoom,
      }));
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const { cx, cy } = pixelToComplex(e.clientX, e.clientY);
      const factor = e.shiftKey ? 3 : 1 / 3;
      setView((prev) => {
        const newZoom = prev.zoom * factor;
        const newMaxIter = Math.max(100, Math.floor(100 + 50 * Math.log2(INITIAL_VIEW.zoom / newZoom)));
        return {
          centerX: cx,
          centerY: cy,
          zoom: newZoom,
          maxIter: newMaxIter,
        };
      });
    },
    [pixelToComplex]
  );

  const handleReset = () => setView(INITIAL_VIEW);

  return (
    <div className="flex h-screen w-screen flex-col bg-black" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
        <h1 className="text-lg font-bold text-zinc-100">
          Mandelbrot Set Viewer
        </h1>
        <div className="flex items-center gap-4 text-xs text-zinc-400">
          {rendering && <span className="text-yellow-400">...rendering</span>}
          <span>
            Zoom: {(INITIAL_VIEW.zoom / view.zoom).toFixed(1)}x
          </span>
          <span>
            Iterations: {view.maxIter}
          </span>
          <span>
            Center: ({view.centerX.toFixed(6)}, {view.centerY.toFixed(6)})
          </span>
          <button
            onClick={handleReset}
            className="rounded bg-zinc-700 px-2 py-1 text-zinc-200 transition-colors hover:bg-zinc-600"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-zinc-900/80 px-4 py-1 text-center text-xs text-zinc-500">
        Scroll to zoom | Drag to pan | Double-click to zoom in | Shift+double-click to zoom out
      </div>

      {/* Canvas */}
      <div className="relative flex-1">
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 ${isDragging ? "cursor-grabbing" : "cursor-crosshair"}`}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
}
