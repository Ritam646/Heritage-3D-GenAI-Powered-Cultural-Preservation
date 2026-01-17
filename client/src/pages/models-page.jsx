import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EyeIcon, Search, X, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/context/language-context';
import RealisticModelViewer from '@/components/RealisticModelViewer';

// Fallback models if API fails
const FALLBACK_MODELS = [
  {
    id: 1,
    name: 'Taj Mahal',
    description: 'One of the seven wonders of the world, built by Emperor Shah Jahan in memory of his beloved wife.',
    imageUrl: '/images/photo-1564507592333-c60657eea523.jpeg',
    modelUrl: '/models/Tajmahal_model_2.obj',
    location: 'Agra, Uttar Pradesh',
    category: 'Monument',
  },
  {
    id: 2,
    name: 'Qutub Minar',
    description: 'The tallest brick minaret in the world, built in the early 13th century.',
    imageUrl: '/images/qutub1_042717100950.jpg',
    modelUrl: '/models/Qutub_Minar_3d_Model.obj',
    location: 'Delhi',
    category: 'Monument',
  },
];

// Model card component with animation
const ModelCard = ({ model, index, onClick }) => {
  const { t } = useLanguage();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden neon-card card-3d group">
        <div className="relative aspect-video overflow-hidden">
          {model.imageUrl ? (
            <img 
              src={model.imageUrl} 
              alt={model.name} 
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-muted/50 flex items-center justify-center">
              {/* Placeholder for when no image is available */}
              <div className="bg-muted/40 flex items-center justify-center h-full w-full">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-xl">3D</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{model.name}</span>
                </div>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <Button 
              size="sm" 
              variant="secondary" 
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 glow-button-accent"
              onClick={() => onClick(model)}
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              {t('viewDetails')}
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="text-xl font-semibold mb-1 line-clamp-1">{model.name}</h3>
          <p className="text-muted-foreground text-sm mb-2">{model.location}</p>
          <p className="text-sm line-clamp-2">{model.description}</p>
        </CardContent>
        
        <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
          <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {model.category || 'Monument'}
          </div>
          <span className="text-xs text-muted-foreground">
            3D Model
          </span>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Enhanced model previewer modal
const ModelPreviewModal = ({ model, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="glass-panel neon-border overflow-hidden w-full max-w-6xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold">{model.name}</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 min-h-[300px] md:min-h-[500px] overflow-hidden">
          <RealisticModelViewer modelName={model.name} />
        </div>
        
        <div className="p-4 bg-muted/20 border-t">
          <h3 className="text-lg font-semibold mb-2">{model.name}</h3>
          <p className="text-sm text-muted-foreground mb-1">{model.location}</p>
          <p className="mb-4">{model.description}</p>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
            {model.id && (
              <Link href={`/models/${model.id}`}>
                <Button size="sm">Full Details</Button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Page Component
export default function ModelsPage() {
  const { t } = useLanguage();
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);
  
  // Fetch models from API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest('GET', '/api/models');
        const data = await response.json();
        
        if (data && data.length > 0) {
          setModels(data);
          setFilteredModels(data);
        } else {
          // Fallback to static models if API returns empty
          setModels(FALLBACK_MODELS);
          setFilteredModels(FALLBACK_MODELS);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        // Fallback to static models on error
        setModels(FALLBACK_MODELS);
        setFilteredModels(FALLBACK_MODELS);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchModels();
  }, []);
  
  // Handle search input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredModels(models);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = models.filter(model => 
      model.name.toLowerCase().includes(query) || 
      (model.description && model.description.toLowerCase().includes(query)) ||
      (model.location && model.location.toLowerCase().includes(query)) ||
      (model.category && model.category.toLowerCase().includes(query))
    );
    
    setFilteredModels(filtered);
  }, [searchQuery, models]);
  
  // Clear search query
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  // Open model preview
  const handleViewModel = (model) => {
    setSelectedModel(model);
  };
  
  // Close model preview
  const handleCloseModal = () => {
    setSelectedModel(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold mb-4 neon-text-intense">{t('modelsTitle')}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('modelsSubtitle')}
        </p>
      </motion.div>
      
      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search monuments by name, location or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>
      
      {/* Models Grid */}
      <div className="mb-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading 3D models...</p>
          </div>
        ) : filteredModels.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No models found matching your search.</p>
            <Button onClick={clearSearch} variant="outline">Clear Search</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModels.map((model, index) => (
              <ModelCard 
                key={model.id || index}
                model={model}
                index={index}
                onClick={handleViewModel}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Model Preview Modal */}
      {selectedModel && (
        <ModelPreviewModal 
          model={selectedModel}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}