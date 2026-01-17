import { motion } from 'framer-motion';
import { Box, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ModelCard = ({ model, onClick }) => {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={model.imageUrl}
            alt={model.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="absolute top-3 right-3">
          <Badge 
            variant={model.modelUrl ? "default" : "outline"}
            className={model.modelUrl ? "bg-primary text-primary-foreground" : "text-muted-foreground"}
          >
            {model.modelUrl ? '3D Available' : 'Coming Soon'}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-xl">{model.name}</h3>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Share functionality would go here
              }}
              title="Share"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {model.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{model.location}</span>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="sm"
              className="gap-2"
              onClick={() => onClick && onClick()}
              disabled={!model.modelUrl}
            >
              <Box className="h-4 w-4" />
              {model.modelUrl ? 'View 3D Model' : 'Preview Soon'}
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelCard;
