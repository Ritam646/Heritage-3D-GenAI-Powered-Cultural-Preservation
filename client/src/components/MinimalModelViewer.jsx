import React from 'react';

const MinimalModelViewer = ({ modelName }) => {
  // Determine which monument to display
  const isTajMahal = modelName?.toLowerCase().includes('taj') || modelName?.toLowerCase().includes('mahal');
  const isQutubMinar = modelName?.toLowerCase().includes('qutub') || modelName?.toLowerCase().includes('minar');
  
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
      <div className="relative w-full h-full">
        {isTajMahal && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Main dome */}
              <div className="w-32 h-24 rounded-t-full bg-white absolute left-1/2 top-0 transform -translate-x-1/2"></div>
              
              {/* Dome spike */}
              <div className="w-2 h-10 bg-yellow-400 absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-8"></div>
              
              {/* Base structure */}
              <div className="w-64 h-20 bg-white absolute left-1/2 top-24 transform -translate-x-1/2"></div>
              
              {/* Small domes */}
              <div className="w-12 h-8 rounded-t-full bg-white absolute left-1/4 top-12 transform -translate-x-1/2"></div>
              <div className="w-12 h-8 rounded-t-full bg-white absolute right-1/4 top-12 transform translate-x-1/2"></div>
              
              {/* Monument label */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-16 text-center">
                <p className="font-semibold text-gray-800">Taj Mahal</p>
                <p className="text-xs text-gray-600">Agra, India</p>
              </div>
            </div>
          </div>
        )}
        
        {isQutubMinar && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Main tower */}
              <div className="w-16 h-56 rounded-t-md bg-amber-700 absolute left-1/2 top-0 transform -translate-x-1/2"></div>
              
              {/* Top section */}
              <div className="w-12 h-12 rounded-t-md bg-amber-600 absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-10"></div>
              
              {/* Rings on tower */}
              {[0, 1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className="w-20 h-2 bg-amber-900 absolute left-1/2 transform -translate-x-1/2"
                  style={{ top: `${i * 40 + 20}px` }}
                ></div>
              ))}
              
              {/* Monument label */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-32 text-center">
                <p className="font-semibold text-gray-800">Qutub Minar</p>
                <p className="text-xs text-gray-600">Delhi, India</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Generic monument if neither */}
        {!isTajMahal && !isQutubMinar && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Simple monument shape */}
              <div className="w-32 h-40 bg-gray-300 absolute left-1/2 top-10 transform -translate-x-1/2"></div>
              <div className="w-40 h-10 bg-gray-400 absolute left-1/2 top-0 transform -translate-x-1/2"></div>
              
              {/* Monument label */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-24 text-center">
                <p className="font-semibold text-gray-800">{modelName || 'Heritage Monument'}</p>
                <p className="text-xs text-gray-600">India</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalModelViewer;