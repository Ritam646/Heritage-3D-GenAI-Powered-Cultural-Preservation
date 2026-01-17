import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Move, ZoomIn, RotateCcw } from 'lucide-react';
import ThreeJSCanvas from './ThreeJSCanvas.jsx';

const ModelViewer = ({ modelUrl, isPreview = false }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={`w-full h-full flex flex-col ${isPreview ? 'bg-slate-100 dark:bg-slate-800 rounded-lg p-4' : ''}`}>
      {isPreview && (
        <h3 className="font-poppins font-semibold text-xl text-foreground mb-4">Preview</h3>
      )}
      
      <div className="flex-grow model-viewer-container relative rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : modelUrl ? (
          <ThreeJSCanvas modelUrl={modelUrl} />
        ) : (
          <motion.div
            className="h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <p className="text-muted-foreground">Your 3D model preview will appear here</p>
            </div>
          </motion.div>
        )}
      </div>
      
      {isPreview && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          <button 
            className="p-2 rounded bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center"
            title="Rotate"
          >
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </button>
          <button 
            className="p-2 rounded bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center"
            title="Pan"
          >
            <Move className="h-4 w-4 text-muted-foreground" />
          </button>
          <button 
            className="p-2 rounded bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center"
            title="Zoom"
          >
            <ZoomIn className="h-4 w-4 text-muted-foreground" />
          </button>
          <button 
            className="p-2 rounded bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center"
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ModelViewer;