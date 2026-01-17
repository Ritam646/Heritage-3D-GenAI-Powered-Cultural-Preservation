import { motion } from 'framer-motion';
import { Play, Star, MapPin, Users, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tour } from '@shared/schema';

interface TourCardProps {
  tour: Partial<Tour>;
  featured?: boolean;
  onClick?: () => void;
}

const TourCard: React.FC<TourCardProps> = ({ tour, featured = false, onClick }) => {
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 20,
        duration: 0.5
      }
    },
    hover: { 
      y: -15,
      transition: { 
        type: "spring", 
        stiffness: 400,
        damping: 10
      }
    }
  };
  
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.1,
      boxShadow: "0px 0px 20px rgba(59, 130, 246, 0.6)"
    },
    tap: { scale: 0.95 }
  };

  if (featured) {
    return (
      <motion.div 
        className="liquid-gradient-border neon-card card-3d rounded-2xl overflow-hidden shadow-xl row-span-2 group relative"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        <div className="absolute top-0 right-0 z-10 m-4">
          <Badge variant="secondary" className="bg-accent/90 backdrop-blur-sm font-medium shadow-lg border-none">
            Featured Tour
          </Badge>
        </div>
        
        <div className="relative h-72 overflow-hidden">
          <motion.img 
            src={tour.imageUrl || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"} 
            alt={tour.name || "Virtual Tour"} 
            className="w-full h-full object-cover transition-transform duration-10000" 
            animate={{ scale: 1.05 }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 15
            }}
          />
          
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button 
              className="w-20 h-20 rounded-full liquid-gradient-play backdrop-blur-md flex items-center justify-center border border-primary/50 group"
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={onClick}
            >
              <div className="relative flex items-center justify-center">
                <motion.div
                  className="absolute w-16 h-16 rounded-full border-2 border-white/50 opacity-75"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 0, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <Play className="h-10 w-10 text-white fill-white relative z-10" />
              </div>
            </motion.button>
          </div>
          
          {/* Title overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="font-bold text-2xl neon-text-intense">
              {tour.name || "Unnamed Tour"}
            </h3>
            <div className="flex items-center mt-2">
              <MapPin className="h-4 w-4 text-primary mr-1" />
              <p className="text-sm text-white/90">{tour.location || "Unknown Location"}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 backdrop-blur-sm bg-card/90">
          {/* Rating stars */}
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < (tour.rating ? Number(tour.rating) : 4) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground fill-none'}`} 
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-muted-foreground">
              {tour.rating || "4.8"} ({tour.reviewCount || "240"} reviews)
            </span>
          </div>
          
          {/* Tour details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm">
                {tour.duration || "2 hours"}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm">
                {tour.availability || "Daily"}
              </span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm">
                {tour.groupSize || "Virtual"}
              </span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm">
                Top rated
              </span>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
            {tour.description || "No description available for this virtual tour. Experience an immersive journey through this magnificent heritage site with our virtual tour."}
          </p>
          
          <Button 
            onClick={onClick} 
            className="liquid-gradient-button w-full group relative overflow-hidden"
          >
            <span className="relative z-10 font-medium text-white">Start Virtual Tour</span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="liquid-gradient-border neon-card rounded-xl overflow-hidden relative group"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="relative h-48 overflow-hidden">
        <motion.img 
          src={tour.imageUrl || "https://images.unsplash.com/photo-1602313306079-c96725738c58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"} 
          alt={tour.name || "Virtual Tour"} 
          className="w-full h-full object-cover" 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.button 
            className="w-14 h-14 rounded-full liquid-gradient-play backdrop-blur-md flex items-center justify-center border border-primary/50"
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={onClick}
          >
            <Play className="h-7 w-7 text-white fill-white" />
          </motion.button>
        </div>
        
        {/* Floating info box - appears on hover */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="h-3 w-3 text-primary" />
            <span className="text-xs text-white/90">{tour.duration || "1 hour"}</span>
            
            <Users className="h-3 w-3 text-primary ml-2" />
            <span className="text-xs text-white/90">{tour.groupSize || "Virtual"}</span>
          </div>
          
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${i < (tour.rating ? Number(tour.rating) : 4) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} 
              />
            ))}
            <span className="ml-1 text-xs text-white/70">
              ({tour.reviewCount || "38"})
            </span>
          </div>
        </motion.div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg group-hover:neon-text-accent transition-all duration-300">
          {tour.name || "Unnamed Tour"}
        </h3>
        
        <div className="flex items-center mb-3">
          <MapPin className="h-3 w-3 text-primary mr-1" />
          <p className="text-xs text-muted-foreground">
            {tour.location || "Unknown Location"}
          </p>
        </div>
        
        <Button 
          onClick={onClick}
          size="sm" 
          className="liquid-gradient-button w-full flex items-center justify-center gap-1 mt-2"
        >
          <span className="text-white">Explore Tour</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 ml-1 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Button>
      </div>
    </motion.div>
  );
};

export default TourCard;
