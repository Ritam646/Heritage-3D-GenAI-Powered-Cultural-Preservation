import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Axis3d, Wand2 } from 'lucide-react';
import ThreeJSCanvas from '@/components/ThreeJSCanvas';
import ModelCard from '@/components/ModelCard';
import TourCard from '@/components/TourCard';

// Featured models data
const featuredModels = [
  {
    id: 1,
    name: "Taj Mahal",
    description: "Built by Emperor Shah Jahan in memory of his wife Mumtaz Mahal, this ivory-white marble mausoleum is one of the world's most iconic monuments.",
    location: "Agra, Uttar Pradesh",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
  },
  {
    id: 2,
    name: "Qutub Minar",
    description: "A soaring 73-meter minaret built in the early 13th century, featuring intricate carvings and inscriptions from the Delhi Sultanate period.",
    location: "Delhi, India",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80"
  },
  {
    id: 3,
    name: "Hawa Mahal",
    description: "Known as the \"Palace of Winds,\" this five-story palace features 953 small windows decorated with intricate latticework.",
    location: "Jaipur, Rajasthan",
    imageUrl: "https://images.unsplash.com/photo-1590733840202-2419ecf9b2e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  }
];

// Featured tour
const featuredTour = {
  id: 1,
  name: "Taj Mahal: Moonlight Tour",
  description: "Experience the breathtaking beauty of the Taj Mahal under moonlight. This virtual tour takes you through the marble mausoleum and its gardens when they're bathed in the ethereal glow of the moon.",
  location: "Agra, Uttar Pradesh",
  imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
  rating: 5,
  reviewCount: 240,
  featured: true,
  duration: "2 hours",
  availability: "Daily at sunset",
  groupSize: "Virtual",
  createdAt: new Date().toISOString()
};

// Additional tours
const additionalTours = [
  {
    id: 2,
    name: "Ellora Caves",
    location: "Aurangabad, Maharashtra",
    imageUrl: "https://images.unsplash.com/photo-1602313306079-c96725738c58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    rating: 4,
    reviewCount: 156,
    duration: "3 hours",
    availability: "Daily from 9 AM - 5 PM",
    groupSize: "4-8 people",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Mysore Palace",
    location: "Mysore, Karnataka",
    imageUrl: "https://images.unsplash.com/photo-1592635196078-9fbb53ab45e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 5,
    reviewCount: 194,
    duration: "2.5 hours",
    availability: "Wed-Sun, 10 AM - 6 PM",
    groupSize: "2-10 people",
    createdAt: new Date().toISOString()
  }
];

export default function HomePage() {
  const [activeModelId, setActiveModelId] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section with Advanced Effects */}
      <motion.section 
        id="home" 
        className="relative py-20 min-h-screen flex items-center overflow-hidden bg-gradient-dark"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center opacity-10 dark:opacity-5"></div>
        
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Glowing orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 filter blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 8, 
            ease: "easeInOut", 
            repeat: Infinity 
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-secondary/20 filter blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ 
            duration: 10, 
            ease: "easeInOut", 
            repeat: Infinity,
            delay: 2
          }}
        />
        
        {/* Main content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <motion.div 
                className="max-w-xl backdrop-blur-sm p-8 rounded-xl bg-card/5 border border-white/5"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                    <span className="liquid-gradient-border inline-block px-2 py-1">
                      Explore <span className="liquid-gradient font-extrabold">India's Heritage</span> in <span className="neon-text-intense">3D</span>
                    </span>
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8 liquid-gradient-glow p-4 rounded-lg backdrop-blur-sm">
                    Transform text descriptions into detailed 3D models of India's cultural landmarks and monuments. Experience the rich heritage through our interactive virtual tours.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <Button 
                    size="lg" 
                    className="liquid-gradient-button group relative overflow-hidden"
                    asChild
                  >
                    <Link href="/converter">
                      <Wand2 className="mr-2 h-5 w-5 group-hover:animate-bounce text-white" /> 
                      <span className="relative z-10 text-white font-medium">Create 3D Model</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="liquid-gradient-border group hover:scale-105 transition-transform"
                    asChild
                  >
                    <Link href="/models">
                      <Axis3d className="mr-2 h-5 w-5 group-hover:text-primary transition-colors" /> 
                      Explore Models
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
            
            <div className="lg:w-1/2 flex justify-center">
              <motion.div 
                className="relative w-full max-w-lg h-80 md:h-[450px]"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* Main 3D model display */}
                <div className="absolute inset-0 rounded-2xl animated-border neon-card overflow-hidden flex items-center justify-center">
                  <ThreeJSCanvas placeholder={true} />
                  
                  {/* Central icon with glow */}
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                  >
                    <motion.div 
                      className="w-20 h-20 rounded-full bg-background/30 backdrop-blur-md flex items-center justify-center shadow-lg border border-primary/30"
                      animate={{ 
                        boxShadow: [
                          "0 0 10px rgba(59, 130, 246, 0.5)", 
                          "0 0 20px rgba(59, 130, 246, 0.7)", 
                          "0 0 10px rgba(59, 130, 246, 0.5)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Axis3d className="h-10 w-10 text-primary" />
                    </motion.div>
                  </motion.div>
                  
                  {/* Rotating outer ring */}
                  <motion.div 
                    className="absolute w-40 h-40 rounded-full border-2 border-primary/20 pointer-events-none"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                {/* Decorative elements */}
                <motion.div 
                  className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-70"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity 
                  }}
                />
                
                <motion.div 
                  className="absolute -top-6 -right-6 w-40 h-40 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-70"
                  animate={{ 
                    scale: [1.2, 1, 1.2],
                    opacity: [0.7, 0.4, 0.7]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity 
                  }}
                />
              </motion.div>
            </div>
          </div>
          
          {/* Stats */}
          <motion.div 
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              { value: "20+", label: "Historical Sites", color: "text-primary" },
              { value: "5K+", label: "3D Models Created", color: "text-secondary" },
              { value: "800+", label: "Virtual Tours", color: "text-yellow-600" },
              { value: "24/7", label: "Knowledge Access", color: "text-primary" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className={`font-bold text-3xl md:text-4xl ${stat.color}`}>{stat.value}</p>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>
      
      {/* Enhanced Featured Models Section */}
      <section id="models" className="py-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-dark"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-40 left-20 w-96 h-96 rounded-full bg-primary/5 mix-blend-screen filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-secondary/10 mix-blend-screen filter blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="font-bold text-3xl md:text-4xl neon-text-intense mb-4">
              Explore India's Landmarks in 3D
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto glass-panel p-4 rounded-lg">
              Immerse yourself in the intricate architecture and historical beauty of India's most iconic monuments.
            </p>
          </motion.div>
          
          {/* Animated line separator */}
          <motion.div 
            className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-16"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredModels.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <ModelCard 
                  model={{
                    ...model,
                    featured: index === 0, // Make first model featured
                    year: index === 0 ? "1632-1653" : index === 1 ? "1192-1220" : "1799-1803", 
                    style: index === 0 ? "Mughal Architecture" : index === 1 ? "Indo-Islamic" : "Rajput Architecture",
                    material: index === 0 ? "White Marble" : index === 1 ? "Red Sandstone & Marble" : "Pink Sandstone"
                  }} 
                  onClick={() => window.location.href = `/models?id=${model.id}`} 
                />
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Button 
              variant="outline" 
              size="lg" 
              className="liquid-gradient-button group relative overflow-hidden px-10 py-6"
              asChild
            >
              <Link href="/models">
                <span className="relative z-10 flex items-center font-medium text-white">
                  View All 3D Models
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
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
                </span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Enhanced Text to 3D Converter Section Preview */}
      <section className="py-20 relative overflow-hidden">
        {/* Background with gradient and grid pattern */}
        <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Animated decorative elements */}
        <motion.div 
          className="absolute top-20 left-[10%] w-96 h-96 rounded-full bg-primary/10 filter blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-10 right-[10%] w-64 h-64 rounded-full bg-secondary/15 filter blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.05, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/5 pointer-events-none"
          style={{ opacity: 0.2 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Text content */}
            <div className="lg:w-1/2">
              <motion.div 
                className="max-w-xl"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="font-bold text-3xl md:text-4xl neon-text-intense mb-6">
                  Transform Text to 3D Models
                </h2>
                <p className="text-muted-foreground glass-panel p-6 rounded-lg mb-8 leading-relaxed">
                  Enter detailed descriptions of Indian heritage monuments and watch as our AI generates interactive 3D models. Our advanced technology transforms your words into stunning virtual replicas for education, exploration, and preservation.
                </p>
                <motion.div 
                  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Button 
                    size="lg" 
                    className="liquid-gradient-button group relative overflow-hidden"
                    asChild
                  >
                    <Link href="/converter">
                      <Wand2 className="mr-2 h-5 w-5 group-hover:animate-bounce text-white" /> 
                      <span className="relative z-10 text-white">Try Text to 3D Converter</span>
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Visualization side */}
            <div className="lg:w-1/2">
              <motion.div 
                className="relative w-full h-[400px] rounded-xl"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                {/* Visualization container */}
                <div className="absolute inset-0 rounded-xl neon-card overflow-hidden flex items-center justify-center">
                  <motion.div 
                    className="w-full h-full bg-gradient-to-br from-secondary/5 to-primary/5 rounded-xl flex flex-col items-center justify-center p-8 text-center relative"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    {/* Text to 3D conversion illustration */}
                    <div className="flex items-center mb-6 relative">
                      <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center border border-white/10">
                        <div className="text-xs text-white/70 font-mono p-2">
                          {"<description>\nTaj Mahal\nWhite marble\nDomed central chamber\nFour minarets\n</description>"}
                        </div>
                      </div>
                      
                      <div className="mx-4 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </div>
                      
                      <div className="w-40 h-40 rounded-xl neon-border-accent overflow-hidden flex items-center justify-center animated-border">
                        <div className="w-full h-full bg-black/30 flex items-center justify-center">
                          <motion.div 
                            className="w-24 h-24"
                            animate={{ 
                              rotateY: 360,
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-primary opacity-80">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                    
                    <motion.p 
                      className="text-sm text-muted-foreground mt-6 hologram-text" 
                      data-text="AI Processing..."
                    >
                      AI Processing...
                    </motion.p>
                    
                    {/* Processing dots */}
                    <div className="flex space-x-2 mt-2">
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                      />
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                      />
                    </div>
                  </motion.div>
                </div>
                
                {/* Decorative elements */}
                <motion.div 
                  className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary rounded-full mix-blend-screen filter blur-xl opacity-30 pointer-events-none"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
                
                <motion.div 
                  className="absolute -top-10 -right-10 w-40 h-40 bg-primary/50 rounded-full mix-blend-screen filter blur-xl opacity-20 pointer-events-none"
                  animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.25, 0.15] }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Virtual Tour Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background with gradient and texture */}
        <div className="absolute inset-0 bg-gradient-dark opacity-90"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute inset-0 marble-texture opacity-10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-secondary/20 to-transparent"></div>
        
        <motion.div 
          className="absolute top-1/3 -left-28 w-56 h-56 rounded-full bg-primary/10 filter blur-3xl"
          animate={{ 
            opacity: [0.05, 0.1, 0.05],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-1/3 -right-28 w-56 h-56 rounded-full bg-secondary/10 filter blur-3xl"
          animate={{ 
            opacity: [0.1, 0.05, 0.1],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="font-bold text-3xl md:text-4xl neon-text-intense mb-4">
              Virtual Heritage Tours
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto glass-panel p-4 rounded-lg">
              Immerse yourself in 360° virtual tours of India's most fascinating historical sites and monuments.
              Experience the grandeur and architectural brilliance through interactive explorations.
            </p>
          </motion.div>
          
          {/* Animated separator */}
          <motion.div 
            className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-16"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Featured Tour with enhanced animation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="row-span-2"
            >
              <TourCard tour={featuredTour} featured={true} />
            </motion.div>
            
            {/* Additional Tours with staggered animations */}
            <div className="grid grid-cols-1 gap-8">
              {additionalTours.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <TourCard tour={tour} />
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Button 
              variant="outline" 
              size="lg" 
              className="liquid-gradient-button relative group overflow-hidden px-10 py-6"
            >
              <span className="relative z-10 flex items-center font-medium text-white">
                Explore All Virtual Tours
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
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
              </span>
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Enhanced Knowledge Hub Preview */}
      <section className="py-24 relative overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-accent opacity-5"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Animated particles */}
        <motion.div 
          className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-primary/5 filter blur-3xl mix-blend-screen"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 right-1/3 w-60 h-60 rounded-full bg-secondary/10 filter blur-3xl mix-blend-screen"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.05, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Content Side */}
            <div className="lg:w-1/2 order-2 lg:order-1">
              <motion.div 
                className="max-w-xl"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="font-bold text-3xl md:text-4xl neon-text-accent mb-6">
                  Heritage Knowledge Hub
                </h2>
                <p className="text-muted-foreground glass-panel p-6 rounded-lg mb-8 leading-relaxed">
                  Access a vast repository of information about Indian monuments, cultural traditions, 
                  historical events, and architectural styles. Our AI-powered knowledge assistant provides 
                  accurate and detailed answers to your questions about India's rich heritage.
                </p>
                
                <div className="space-y-4 mb-8">
                  {[
                    "Learn about architectural styles and influences",
                    "Discover historical significance and cultural context",
                    "Explore preservation efforts and restoration techniques",
                    "Understand monument construction methods and materials"
                  ].map((feature, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      viewport={{ once: true }}
                    >
                      <div className="mr-3 mt-1 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-muted-foreground">{feature}</p>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Button 
                    size="lg" 
                    className="glow-button-accent group relative overflow-hidden"
                    asChild
                  >
                    <Link href="/assistant">
                      <span className="relative z-10 flex items-center">
                        Explore Knowledge Hub
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
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
                      </span>
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Chat Visualization */}
            <div className="lg:w-1/2 order-1 lg:order-2">
              <motion.div 
                className="relative w-full h-[450px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="absolute inset-0 rounded-xl neon-card overflow-hidden flex flex-col p-6">
                  {/* Chat interface mockup */}
                  <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                    <h3 className="text-lg font-semibold hologram-text" data-text="Heritage Knowledge Assistant">
                      Heritage Knowledge Assistant
                    </h3>
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {/* Sample chat messages */}
                    <motion.div 
                      className="flex justify-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-3 max-w-[80%] text-sm">
                        <p>Tell me about the architectural design of the Taj Mahal.</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex justify-end"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <div className="bg-secondary/10 backdrop-blur-sm rounded-xl p-3 max-w-[80%] text-sm">
                        <p>The Taj Mahal is a masterpiece of Mughal architecture, combining elements from Persian, Islamic, and Indian architectural styles...</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex justify-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-3 max-w-[80%] text-sm">
                        <p>What materials were used in its construction?</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex justify-end"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 }}
                      viewport={{ once: true }}
                    >
                      <div className="bg-secondary/10 backdrop-blur-sm rounded-xl p-3 max-w-[80%] text-sm">
                        <p>The Taj Mahal is primarily constructed of white marble from Makrana, Rajasthan. Semi-precious stones like jade, crystal, turquoise, lapis lazuli, and sapphire were used for the intricate inlay work...</p>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Input field mockup */}
                  <motion.div 
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center bg-card/30 rounded-lg border border-white/10 backdrop-blur-sm p-3">
                      <input 
                        type="text" 
                        className="flex-1 bg-transparent border-none outline-none text-sm placeholder-white/40"
                        placeholder="Ask about Indian heritage monuments..."
                        disabled
                      />
                      <button className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                </div>
                
                {/* Decorative elements */}
                <motion.div 
                  className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-accent/10 filter blur-3xl opacity-40 mix-blend-screen"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.4, 0.3]
                  }}
                  transition={{ duration: 7, repeat: Infinity }}
                />
                
                <motion.div 
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-secondary/20 filter blur-3xl opacity-40 mix-blend-screen"
                  animate={{ 
                    scale: [1.2, 1, 1.2],
                    opacity: [0.4, 0.3, 0.4]
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
