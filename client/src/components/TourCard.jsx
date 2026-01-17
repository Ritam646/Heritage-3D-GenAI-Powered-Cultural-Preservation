import { motion } from 'framer-motion';
import { Clock, Map, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const TourCard = ({ tour, featured = false, onClick }) => {
  return (
    <div 
      className={`rounded-xl overflow-hidden border border-border ${featured ? 'h-full' : 'h-auto'} group cursor-pointer transition-all duration-300 hover:shadow-lg`}
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={tour.imageUrl} 
          alt={tour.name} 
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${featured ? 'h-64 md:h-72' : 'h-48'}`}
        />
        
        {tour.rating && (
          <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-background/80 backdrop-blur-sm rounded-full py-1 px-2 text-xs font-medium">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{tour.rating}</span>
            <span className="text-muted-foreground">({tour.reviewCount})</span>
          </div>
        )}
        
        {featured && (
          <Badge className="absolute top-3 right-3 bg-primary">
            Featured
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <h3 className={`font-semibold ${featured ? 'text-xl' : 'text-lg'} mb-2`}>{tour.name}</h3>
        
        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <Map className="h-3 w-3 mr-1" />
          <span>{tour.location}</span>
        </div>
        
        {featured && tour.description && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {tour.description}
          </p>
        )}
        
        {featured && (
          <div className="mt-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="sm" className="w-full">
                Start Virtual Tour
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourCard;
