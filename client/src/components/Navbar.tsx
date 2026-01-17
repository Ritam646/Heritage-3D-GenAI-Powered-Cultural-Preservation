import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Axis3d, Home, Box, Wand2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ui/theme-provider';
import { useAuth } from '@/hooks/use-auth';
import AuthModal from './AuthModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  // Handle scroll event to add background to navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/models', label: '3D Models', icon: Box },
    { href: '/converter', label: 'Text to 3D', icon: Wand2 },
    { href: '/assistant', label: 'Knowledge Hub', icon: BookOpen }
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-500
        ${isScrolled 
          ? 'bg-background/60 backdrop-blur-lg border-b border-primary/10 shadow-glow' 
          : 'bg-transparent'}`}>
        
        {/* Ambient glow effect on navbar */}
        <div className="absolute inset-x-0 -bottom-4 h-4 bg-gradient-to-b from-primary/5 to-transparent"></div>
        
        {/* Main navbar content */}
        <div className="container mx-auto px-4 py-4 flex justify-between items-center relative">
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div 
              className="w-10 h-10 rounded-full liquid-gradient-background flex items-center justify-center liquid-gradient-border overflow-hidden relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background for the logo */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 opacity-70"
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'linear'
                }}
                style={{ backgroundSize: '200% 200%' }}
              />
              
              <Axis3d className="text-white text-xl relative z-10" />
            </motion.div>
            <span className="font-bold text-xl">
              <span className="text-white group-hover:neon-text transition-all duration-300">Heritage</span>
              <span className="neon-text-accent">3D</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              
              return (
                <motion.div
                  key={link.href}
                  className="relative px-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={link.href}>
                    <a className="flex items-center py-2 px-4 relative z-10">
                      <link.icon className={`w-4 h-4 mr-2 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary transition-colors'}`} />
                      <span className={`font-medium transition-all duration-300 
                        ${isActive 
                          ? 'text-white neon-text' 
                          : 'text-muted-foreground hover:text-white'
                        }`}>
                        {link.label}
                      </span>
                    </a>
                  </Link>
                  
                  {/* Active indicator with animation */}
                  {isActive && (
                    <motion.div 
                      className="absolute bottom-0 left-0 h-0.5 bg-primary w-full rounded-full"
                      layoutId="navbar-indicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Theme toggle with enhanced animation */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
                className="relative overflow-hidden rounded-full bg-card/30 backdrop-blur-sm border border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50"></div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ scale: 0, opacity: 0, rotate: -30 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0, rotate: 30 }}
                    transition={{ 
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                    className="relative z-10"
                  >
                    {theme === 'dark' ? (
                      <Sun className="h-5 w-5 text-yellow-300" />
                    ) : (
                      <Moon className="h-5 w-5 text-slate-700" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </motion.div>
            
            {/* Authentication button with glow effect */}
            {user ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="destructive"
                  onClick={() => logoutMutation.mutate()}
                  className="hidden md:flex relative overflow-hidden liquid-gradient-button"
                >
                  <span className="relative z-10 text-white">Logout</span>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="default" 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hidden md:flex liquid-gradient-button relative overflow-hidden"
                >
                  <span className="relative z-10 text-white">Login</span>
                </Button>
              </motion.div>
            )}
            
            {/* Mobile menu button with animation */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden relative bg-card/30 backdrop-blur-sm border border-white/10 rounded-full"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50 rounded-full"></div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isMobileMenuOpen ? 'close' : 'open'}
                    initial={{ scale: 0, opacity: 0, rotate: -30 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0, rotate: 30 }}
                    transition={{ 
                      duration: 0.2,
                      type: "spring",
                      stiffness: 500,
                      damping: 30 
                    }}
                    className="relative z-10"
                  >
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ 
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 30 
              }}
              className="md:hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-dark opacity-90 backdrop-blur-lg overflow-hidden" />
              <div className="absolute inset-0 bg-grid-pattern opacity-5" />
              
              {/* Animated glowing orbs in background */}
              <motion.div 
                className="absolute top-10 left-1/4 w-40 h-40 rounded-full bg-primary/10 filter blur-3xl opacity-20 mix-blend-screen"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                  y: [0, -10, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div 
                className="absolute bottom-10 right-1/4 w-40 h-40 rounded-full bg-secondary/10 filter blur-3xl opacity-20 mix-blend-screen"
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.1, 0.2],
                  y: [0, 10, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              
              {/* Mobile nav content */}
              <nav className="flex flex-col px-6 py-8 space-y-1 relative z-10">
                {navLinks.map((link, index) => {
                  const isActive = location === link.href;
                  
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="w-full"
                    >
                      <Link 
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <a className={`flex items-center py-3 px-4 rounded-lg mb-1 transition-all duration-300 ${
                          isActive 
                            ? 'bg-primary/10 border border-primary/20 text-white' 
                            : 'bg-transparent hover:bg-card/20 text-muted-foreground hover:text-white'
                        }`}>
                          <span className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                            isActive 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-card/20 text-muted-foreground'
                          }`}>
                            <link.icon className="w-4 h-4" />
                          </span>
                          <span className="font-medium">{link.label}</span>
                          
                          {isActive && (
                            <motion.span 
                              layoutId="mobile-active-indicator"
                              className="ml-auto w-2 h-2 rounded-full bg-primary"
                            />
                          )}
                        </a>
                      </Link>
                    </motion.div>
                  );
                })}
                
                {/* Divider with animation */}
                <motion.div 
                  className="w-full h-px my-4"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </motion.div>
                
                {/* Auth button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="px-4"
                >
                  {user ? (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        logoutMutation.mutate();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full liquid-gradient-button relative overflow-hidden"
                      size="lg"
                    >
                      <span className="relative z-10 text-white">Logout</span>
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full liquid-gradient-button relative overflow-hidden"
                      size="lg"
                    >
                      <span className="relative z-10 text-white">Login</span>
                    </Button>
                  )}
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
