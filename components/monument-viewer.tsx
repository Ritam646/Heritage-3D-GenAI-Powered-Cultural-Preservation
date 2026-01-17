"use client"

import { useState, useRef, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Html, useProgress } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, RotateCcw, Maximize, Minimize, Info, X } from "lucide-react"

function Model({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath)
  return <primitive object={scene} scale={2} position={[0, -1, 0]} />
}

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
        <div className="text-amber-800 font-medium">Loading 3D Model...</div>
        <div className="w-32 h-2 bg-amber-100 rounded-full mt-2">
          <div className="h-full bg-amber-600 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </Html>
  )
}

export default function MonumentViewer({ monument }: { monument: any }) {
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<any>(null)

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.5, 5))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.5, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
    controlsRef.current?.reset()
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-gradient-to-b from-amber-800/10 to-orange-700/10 rounded-xl overflow-hidden shadow-lg ${
        isFullscreen ? "fixed inset-0 z-50" : "h-[500px]"
      }`}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <Model modelPath={monument.modelPath} />
          <Environment preset="sunset" />
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2 * zoom}
            maxDistance={10 * zoom}
          />
        </Suspense>
      </Canvas>

      {/* Controls overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          className="h-8 w-8 rounded-full bg-white/50 hover:bg-white text-amber-800"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <Slider
          value={[zoom]}
          min={0.5}
          max={5}
          step={0.1}
          onValueChange={(value) => setZoom(value[0])}
          className="w-24"
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          className="h-8 w-8 rounded-full bg-white/50 hover:bg-white text-amber-800"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-amber-200 mx-1"></div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="h-8 w-8 rounded-full bg-white/50 hover:bg-white text-amber-800"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="h-8 w-8 rounded-full bg-white/50 hover:bg-white text-amber-800"
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowInfo(!showInfo)}
          className="h-8 w-8 rounded-full bg-white/50 hover:bg-white text-amber-800"
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>

      {/* Info overlay */}
      {showInfo && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-amber-900">About This 3D Model</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInfo(false)}
              className="h-6 w-6 rounded-full hover:bg-amber-100"
            >
              <X className="h-4 w-4 text-amber-800" />
            </Button>
          </div>
          <p className="text-sm text-amber-800 mb-2">
            This 3D model was created using Generative AI technology from a detailed text prompt, then refined in
            Blender for accuracy.
          </p>
          <div className="text-xs text-amber-600">
            <p>• Use mouse to rotate the model</p>
            <p>• Scroll to zoom in/out</p>
            <p>• Right-click and drag to pan</p>
          </div>
        </div>
      )}
    </div>
  )
}
