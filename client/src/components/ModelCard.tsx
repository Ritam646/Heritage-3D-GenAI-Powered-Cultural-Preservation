import { motion } from 'framer-motion';
import { Axis3d, Eye, Landmark, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Model } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

interface ModelCardProps {
  model: Partial<Model>;
  onClick?: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onClick }) => {
  return (
    <motion.div 
      className={`
        liquid-gradient-border neon-card card-3d rounded-xl overflow-hidden relative group
        ${model.name?.includes('Taj Mahal') ? 'marble-texture' : 'sandstone-texture'}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300,
        damping: 20
      }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
    >
      <div className="relative h-56 overflow-hidden">
        <motion.img 
          src={
            model.name?.includes("Taj Mahal") 
              ? "/taj-mahal.jpeg"
              : "/qutub-minar.jpg"
          } 
          alt={model.name || "3D Model"} 
          className="w-full h-full object-cover transition-transform duration-700" 
          whileHover={{ scale: 1.1 }}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* 3D icon badge */}
        <motion.div 
          className="absolute top-4 right-4 bg-background/20 backdrop-blur-lg rounded-full p-2 shadow-lg border border-white/10"
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.7)"
          }}
        >
          <Axis3d className="text-white h-5 w-5 drop-shadow-glow" />
        </motion.div>
        
        {/* Featured badge (if applicable) */}
        {model.featured && (
          <Badge 
            variant="secondary" 
            className="absolute top-4 left-4 shadow-lg neon-border-accent"
          >
            <Award className="h-3 w-3 mr-1" /> Featured
          </Badge>
        )}
      </div>
      
      <div className="p-6 backdrop-blur-sm relative z-10">
        <h3 className="font-bold text-xl mb-2 group-hover:neon-text transition-all duration-300">
          {model.name || "Unnamed Model"}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {model.description || "No description available for this 3D model."}
        </p>
        
        <div className="flex flex-col gap-3">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-4 justify-between">
              <span className="text-xs text-muted-foreground flex items-center">
                <Landmark className="h-3 w-3 mr-1 text-primary" />
                {model.location || "Unknown Location"}
              </span>
              
              <span className="text-xs text-muted-foreground flex items-center">
                <Calendar className="h-3 w-3 mr-1 text-primary" />
                {model.year || "Unknown Age"}
              </span>
            </div>
            
            {model.material && (
              <div className="flex flex-wrap items-center mt-1 gap-2">
                <Badge 
                  variant="outline" 
                  className={`
                    text-xs bg-background/20 backdrop-blur-sm border 
                    ${model.name?.includes('Taj Mahal') 
                      ? 'border-blue-300/30 bg-blue-500/10 text-blue-200' 
                      : 'border-amber-300/30 bg-amber-500/10 text-amber-200'}
                    shadow-glow transition-all duration-300 animate-in fade-in
                  `}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`
                    h-3 w-3 mr-1 
                    ${model.name?.includes('Taj Mahal') ? 'text-blue-300' : 'text-amber-300'}
                  `} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                  {model.material}
                </Badge>
                {model.style && (
                  <Badge variant="outline" className="text-xs bg-background/20 backdrop-blur-sm border-secondary/20 shadow-glow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    {model.style}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {model.id ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="default" 
                size="sm" 
                className="liquid-gradient-button flex-1 flex items-center justify-center gap-2 mt-2"
                onClick={onClick}
              >
                <Eye className="h-4 w-4 text-white" /> 
                <span className="font-medium text-white">Quick View</span>
              </Button>
              
              <Link href={`/models/${model.id}`}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="liquid-gradient-border flex-1 flex items-center justify-center gap-2 mt-2 hover:scale-105 transition-transform"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                  </svg>
                  <span className="font-medium">Details</span>
                </Button>
              </Link>
            </div>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              className="liquid-gradient-button w-full flex items-center justify-center gap-2 mt-2"
              onClick={onClick}
            >
              <Eye className="h-4 w-4 text-white" /> 
              <span className="font-medium text-white">Explore in 3D</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Decorative corner element */}
      <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M64 0v64H0C0 28.7 28.7 0 64 0z" fill="url(#paint0_linear)" fillOpacity="0.2"/>
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="64" x2="64" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6"/>
              <stop offset="1" stopColor="#3B82F6" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </motion.div>
  );
};

export default ModelCard;
