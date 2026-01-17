import { useEffect, useState, useRef } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Info, BookOpen, History, Box, Boxes } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import ThreeJSCanvas from '@/components/ThreeJSCanvas';
import { apiRequest } from '@/lib/queryClient';

// Simulated featured models (to be replaced with actual API data)
const FEATURED_MODELS = [
  {
    id: 1,
    name: 'Taj Mahal',
    description: 'One of the seven wonders of the world, built by Emperor Shah Jahan in memory of his beloved wife.',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    modelUrl: '/attached_assets/Tajmahal_model_2.obj',
  },
  {
    id: 2,
    name: 'Qutub Minar',
    description: 'The tallest brick minaret in the world, built in the early 13th century.',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80',
    modelUrl: '/attached_assets/Qutub_Minar_3d_Model.obj',
  },
];

// TypeWriter component for animated text
function TypeWriter({ text, speed = 60, onComplete }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete && onComplete();
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  return <span>{displayText}<span className="animate-pulse">|</span></span>;
}

// Blur in image component
function BlurImage({ src, alt, className, delay = 0 }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.img
      src={src}
      alt={alt}
      className={`${className} transition-all duration-1000 ${isLoaded ? 'blur-0' : 'blur-lg'}`}
      initial={{ opacity: 0, filter: 'blur(20px)' }}
      animate={{ 
        opacity: isLoaded ? 1 : 0,
        filter: isLoaded ? 'blur(0px)' : 'blur(20px)'
      }}
      transition={{ 
        opacity: { delay, duration: 0.8 },
        filter: { delay: delay + 0.2, duration: 1.2 }
      }}
      onLoad={() => setIsLoaded(true)}
    />
  );
}

export default function HomePage() {
  const { t } = useLanguage();
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModel, setActiveModel] = useState(null);
  const [typingComplete, setTypingComplete] = useState(true); // Initialize to true for immediate display
  const modelViewerRef = useRef(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest('GET', '/api/models');
        const data = await response.json();
        
        if (data && data.length > 0) {
          setModels(data);
          setActiveModel(data[0]);
        } else {
          // Fallback to featured models if API returns empty
          setModels(FEATURED_MODELS);
          setActiveModel(FEATURED_MODELS[0]);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        // Fallback to featured models on error
        setModels(FEATURED_MODELS);
        setActiveModel(FEATURED_MODELS[0]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  const handleModelChange = (model) => {
    setActiveModel(model);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section with Typewriter and 3D Preview */}
      <section className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 relative z-20">
              <div className="bg-background/80 py-1 px-2 backdrop-blur-sm rounded-md inline-block">
                <span className="text-primary">Explore</span> <span className="text-secondary">Indian Heritage</span> <span className="text-primary">in 3D</span>
              </div>
            </h1>
            
            <AnimatePresence>
              {typingComplete && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-lg text-muted-foreground mb-8"
                >
                  {t('heroSubtitle')}
                </motion.p>
              )}
            </AnimatePresence>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <AnimatePresence>
                {typingComplete && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <Link href="/models">
                        <Button size="lg" className="btn-animated">
                          {t('exploreButton')}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <Link href="/assistant">
                        <Button variant="outline" size="lg" className="btn-animated">
                          <Info className="mr-2 h-4 w-4" />
                          {t('learnMore')}
                        </Button>
                      </Link>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-gradient-to-br from-primary/5 to-secondary/5 p-0 rounded-2xl shadow-lg h-[550px] relative overflow-hidden border border-primary/10"
          >
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl" />
            
            {/* Model viewer overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-transparent to-transparent z-10 pointer-events-none" />
            
            {/* Animated 3D visuals */}
            <div className="w-full h-full flex items-center justify-center">
              <motion.div 
                className="relative w-full h-full flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {/* Animated floating elements */}
                <motion.div 
                  className="absolute w-40 h-40 border-4 border-primary/40 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1], 
                    rotate: [0, 90, 180, 270, 360],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                />
                
                <motion.div 
                  className="absolute w-60 h-60 border-2 border-secondary/30 rounded-full"
                  animate={{ 
                    scale: [1, 1.1, 1], 
                    rotate: [360, 270, 180, 90, 0],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    duration: 15, 
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                />
                
                <motion.div 
                  className="absolute w-80 h-80 border border-primary/20 rounded-full"
                  animate={{ 
                    scale: [1, 1.05, 1], 
                    rotate: [0, 180, 360],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                />
                
                {/* Central icon */}
                <motion.div 
                  className="bg-gradient-to-br from-primary/90 to-secondary/90 p-6 rounded-2xl shadow-xl"
                  animate={{ 
                    y: [0, -15, 0],
                    rotateY: [0, 180, 360],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                >
                  <Box className="w-20 h-20 text-white" />
                </motion.div>
                
                {/* Floating particles */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-primary"
                    style={{
                      width: Math.random() * 10 + 2,
                      height: Math.random() * 10 + 2,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      x: [0, Math.random() * 100 - 50, 0],
                      y: [0, Math.random() * 100 - 50, 0],
                      opacity: [0, 0.8, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: Math.random() * 10 + 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2
                    }}
                  />
                ))}
              </motion.div>
            </div>
            
            {/* Title banner */}
            <div className="absolute top-4 left-4 right-4 z-20 bg-background/70 backdrop-blur-sm rounded-lg p-3 border border-muted">
              <h3 className="text-xl font-semibold text-center">Experience Indian Heritage</h3>
            </div>
            
            {/* Interactive buttons */}
            <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center gap-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="bg-background/70 backdrop-blur-sm rounded-full px-6 py-3 border border-primary/20 shadow-lg"
              >
                <Link href="/models">
                  <Button size="lg" variant="gradient" className="font-medium">
                    Explore 3D Monuments
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="text-center text-white bg-background/40 backdrop-blur-sm rounded-lg px-4 py-2"
              >
                <p className="text-sm font-medium">Immerse yourself in interactive 3D models of India's iconic monuments</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mb-20"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-3xl font-bold text-center mb-12"
        >
          Explore Indian Heritage
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div variants={itemVariants}>
            <Card className="h-full card-3d">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <History className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Rich History</h3>
                <p className="text-muted-foreground">
                  Discover the fascinating history behind iconic Indian monuments and cultural sites.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="h-full card-3d">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
                <p className="text-muted-foreground">
                  Ask questions and get detailed information about any Indian heritage monument.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="h-full card-3d">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3L17 8H14V16H10V8H7L12 3Z" fill="currentColor" />
                    <path d="M19 13H22L17 18L12 13H15V5H19V13Z" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">3D Models</h3>
                <p className="text-muted-foreground">
                  Explore detailed 3D models of monuments with interactive controls and immersive views.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Featured Models Section (with Blur Effect) */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold text-center mb-12">
          Featured Monuments
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURED_MODELS.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true, amount: 0.2 }}
              className="relative overflow-hidden rounded-xl group"
            >
              <div className="aspect-video overflow-hidden">
                <BlurImage
                  src={model.imageUrl || `/assets/${model.id}.jpg`}
                  alt={model.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  delay={index * 0.3}
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-2">{model.name}</h3>
                <p className="text-white/80 mb-4 line-clamp-2">{model.description}</p>
                <Link href={`/models/${model.id}`}>
                  <Button variant="default" className="w-full sm:w-auto">
                    View 3D Model
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/models">
            <Button variant="outline" size="lg" className="btn-animated">
              View All Models
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}