declare module '@/components/RealisticModelViewer' {
  interface RealisticModelViewerProps {
    modelUrl?: string;
    isPreview?: boolean;
    name?: string;
    texture?: string;
    materialType?: string;
    lightIntensity?: number;
    rotationSpeed?: number;
    showGround?: boolean;
    showEnvironment?: boolean;
    environmentIntensity?: number;
    showControls?: boolean;
    autoRotate?: boolean;
    isLoading?: boolean;
    onLoad?: () => void;
    onError?: (error: any) => void;
  }

  export default function RealisticModelViewer(props: RealisticModelViewerProps): JSX.Element;
}