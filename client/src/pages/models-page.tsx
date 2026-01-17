import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRoute } from 'wouter';
import { ChevronDown, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ModelCard from '@/components/ModelCard';
import ModelViewer from '@/components/ModelViewer';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Sample data for models - in real app, this would come from an API
const models = [
  {
    id: 1,
    name: "Taj Mahal",
    description: "Built by Emperor Shah Jahan in memory of his wife Mumtaz Mahal, this ivory-white marble mausoleum is one of the world's most iconic monuments and a UNESCO World Heritage Site.",
    location: "Agra, Uttar Pradesh",
    userId: 1,
    modelUrl: "/api/modelfiles/Tajmahal_model_2.obj",
    imageUrl: "/attached_assets/photo-1564507592333-c60657eea523.jpeg",
    createdAt: "2023-01-01",
    material: "White Marble",
    year: "1632-1653",
    style: "Mughal Architecture"
  },
  {
    id: 2,
    name: "Qutub Minar",
    description: "A soaring 73-meter minaret built in the early 13th century, featuring intricate carvings and inscriptions from the Delhi Sultanate period, known for its unique red sandstone texture.",
    location: "Delhi, India",
    userId: 1,
    modelUrl: "/api/modelfiles/Qutub_Minar_3d_Model.obj",
    imageUrl: "/attached_assets/qutub1_042717100950.jpg",
    createdAt: "2023-01-02",
    material: "Red Sandstone & Marble",
    year: "1192-1220",
    style: "Indo-Islamic Architecture"
  },
  {
    id: 3,
    name: "Hawa Mahal",
    description: "Known as the \"Palace of Winds,\" this five-story palace features 953 small windows decorated with intricate latticework.",
    location: "Jaipur, Rajasthan",
    userId: 1,
    modelUrl: "/models/hawa-mahal.glb",
    imageUrl: "https://images.unsplash.com/photo-1590733840202-2419ecf9b2e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    createdAt: "2023-01-03"
  },
  {
    id: 4,
    name: "Golden Temple",
    description: "Also known as Sri Harmandir Sahib, this is the holiest gurdwara and an important pilgrimage site of Sikhism.",
    location: "Amritsar, Punjab",
    userId: 1,
    modelUrl: "/models/golden-temple.glb",
    imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    createdAt: "2023-01-04"
  },
  {
    id: 5,
    name: "India Gate",
    description: "A war memorial dedicated to the soldiers of the British Indian Army who died during the First World War.",
    location: "New Delhi, India",
    userId: 1,
    modelUrl: "/models/india-gate.glb",
    imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    createdAt: "2023-01-05"
  },
  {
    id: 6,
    name: "Mysore Palace",
    description: "Also known as Amba Vilas Palace, it is the official residence and seat of the Wadiyars, the former royal family of Mysore, who ruled the princely state of Mysore.",
    location: "Mysore, Karnataka",
    userId: 1,
    modelUrl: "/models/mysore-palace.glb",
    imageUrl: "https://images.unsplash.com/photo-1592635196078-9fbb53ab45e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    createdAt: "2023-01-06"
  }
];

export default function ModelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    region: 'all',
    century: 'all',
    type: 'all'
  });
  
  // Handle URL parameters for direct access to a model
  const [, params] = useRoute('/models/:id');
  
  // Initialize model from URL parameters
  useEffect(() => {
    // Check for route parameter first
    if (params && params.id) {
      setSelectedModel(parseInt(params.id, 10));
    } else {
      // Fallback to query parameter for backward compatibility
      const queryParams = new URLSearchParams(window.location.search);
      const queryModelId = queryParams.get('id');
      if (queryModelId) {
        setSelectedModel(parseInt(queryModelId, 10));
      }
    }
  }, [params]);
  
  // Filter models based on search query and filters
  const filteredModels = models.filter(model => {
    return model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           model.location.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const selectedModelData = selectedModel 
    ? models.find(model => model.id === selectedModel) 
    : null;
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-4">3D Models Gallery</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore detailed 3D models of India's most iconic monuments and heritage sites. Rotate, zoom, and examine these architectural marvels in full detail.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8"
          >
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search monuments, locations, or features..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ChevronDown className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Models</SheetTitle>
                    <SheetDescription>
                      Narrow down models by region, time period, and type
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="py-6 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Region</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {['All', 'North India', 'South India', 'East India', 'West India', 'Central India'].map((region) => (
                          <Button
                            key={region}
                            variant={filters.region === region.toLowerCase() ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilters({...filters, region: region.toLowerCase()})}
                          >
                            {region}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Century</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {['All', '10th-12th', '13th-15th', '16th-18th', '19th-20th'].map((century) => (
                          <Button
                            key={century}
                            variant={filters.century === century.toLowerCase() ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilters({...filters, century: century.toLowerCase()})}
                          >
                            {century}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Monument Type</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {['All', 'Temples', 'Forts', 'Palaces', 'Tombs', 'Mosques'].map((type) => (
                          <Button
                            key={type}
                            variant={filters.type === type.toLowerCase() ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilters({...filters, type: type.toLowerCase()})}
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setFilters({region: 'all', century: 'all', type: 'all'})}>
                      Reset All
                    </Button>
                    <Button>Apply Filters</Button>
                  </div>
                </SheetContent>
              </Sheet>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Models Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredModels.length > 0 ? (
              filteredModels.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ModelCard 
                    model={model} 
                    onClick={() => setSelectedModel(model.id)} 
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No models found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Model Viewer Sheet */}
      <Sheet open={selectedModel !== null} onOpenChange={(open) => !open && setSelectedModel(null)}>
        <SheetContent className="sm:max-w-3xl w-full p-0 overflow-y-auto" side="right">
          <div className="h-full flex flex-col">
            <div className="p-6 flex justify-between items-center border-b">
              <SheetTitle className="text-2xl">{selectedModelData?.name || 'Model Viewer'}</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedModel(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-grow">
              <div className="h-96">
                <ModelViewer 
                  modelUrl={selectedModelData?.modelUrl} 
                  name={selectedModelData?.name} 
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{selectedModelData?.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{selectedModelData?.location}</p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedModelData?.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Location History</h4>
                    <p className="text-muted-foreground">
                      This monument is located in {selectedModelData?.location} and represents a significant part of Indian heritage and architectural history.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Model Controls</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"></path>
                          <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8"></path>
                          <path d="M12 2v2"></path>
                          <path d="M12 20v2"></path>
                          <path d="m4.9 4.9 1.4 1.4"></path>
                          <path d="m17.7 17.7 1.4 1.4"></path>
                          <path d="M2 12h2"></path>
                          <path d="M20 12h2"></path>
                          <path d="m6.3 17.7-1.4 1.4"></path>
                          <path d="m19.1 4.9-1.4 1.4"></path>
                        </svg>
                        Toggle Lighting
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                          <path d="M3 9h18"></path>
                          <path d="M9 21V9"></path>
                        </svg>
                        View Sections
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
