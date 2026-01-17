import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Axis3d, Github, Mail, TwitterIcon, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  // Social links
  const socialLinks = [
    { 
      icon: Github, 
      href: "https://github.com/Ritam646", 
      label: "GitHub",
      color: "hover:text-[#f0f6fc] hover:shadow-[0_0_8px_#f0f6fc]"
    },
    { 
      icon: TwitterIcon, 
      href: "https://x.com/RitamPa04585016", 
      label: "Twitter",
      color: "hover:text-[#1DA1F2] hover:shadow-[0_0_8px_#1DA1F2]"
    },
    { 
      icon: Mail, 
      href: "mailto:ritampatra888@gmail.com", 
      label: "Email",
      color: "hover:text-[#EA4335] hover:shadow-[0_0_8px_#EA4335]"
    },
    { 
      icon: Instagram, 
      href: "https://www.instagram.com/ritampatra846/", 
      label: "Instagram",
      color: "hover:text-[#E1306C] hover:shadow-[0_0_8px_#E1306C]"
    }
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-dark pt-16 pb-8 border-t border-primary/20">
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Animated glow effects */}
      <motion.div 
        className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-primary/5 filter blur-3xl mix-blend-screen"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-secondary/5 filter blur-3xl mix-blend-screen"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.08, 0.03, 0.08],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="glass-panel p-6 rounded-xl">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-full relative overflow-hidden liquid-gradient-button flex items-center justify-center">
                <Axis3d className="text-white text-xl relative z-10" />
              </div>
              <span className="font-bold text-xl text-white">Heritage<span className="neon-text-accent">3D</span></span>
            </Link>
            <p className="text-slate-300 mb-6">
              Bringing India's rich cultural heritage to life through immersive 3D experiences and virtual tours.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-full relative overflow-hidden liquid-gradient-button flex items-center justify-center transition-all duration-300 ${social.color}`}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="h-5 w-5 text-white relative z-10" />
                </motion.a>
              ))}
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-6 neon-text">Navigation</h3>
            <ul className="space-y-4">
              {[
                { label: 'Home', href: '/' },
                { label: '3D Models', href: '/models' },
                { label: 'Text to 3D', href: '/converter' },
                { label: 'Knowledge Hub', href: '/assistant' },
                { label: 'Virtual Tours', href: '/models' }
              ].map((link, index) => (
                <motion.li 
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link 
                    href={link.href}
                    className="group flex items-center text-slate-300 hover:text-white transition-all duration-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary mr-2 transition-colors"></span>
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
          
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-6 neon-text-accent">Resources</h3>
            <ul className="space-y-4">
              {[
                'Cultural Heritage Preservation',
                'Historical References',
                'Indian Architecture Database',
                'Educational Materials',
                'Texturing Techniques'
              ].map((item, index) => (
                <motion.li 
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + (index * 0.05) }}
                >
                  <a 
                    href="#" 
                    className="group flex items-center text-slate-300 hover:text-white transition-all duration-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 group-hover:bg-secondary mr-2 transition-colors"></span>
                    <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
          
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-6 neon-text">Stay Connected</h3>
            <p className="text-slate-300 mb-5 leading-relaxed">
              Get updates on new monuments, features, and Indian heritage content delivered to your inbox.
            </p>
            <form className="mb-5">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-lg bg-card/30 backdrop-blur-sm border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-primary neon-border"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 liquid-gradient-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </Button>
              </div>
            </form>
            <motion.p 
              className="text-slate-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </motion.p>
          </div>
        </div>
        
        <motion.div 
          className="relative border-t border-primary/10 pt-8 glass-panel rounded-xl mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {/* Animated horizontal line */}
          <motion.div 
            className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }}
          />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              className="mb-6 md:mb-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <p className="text-slate-300 text-sm">
                © 2025 Heritage<span className="neon-text-accent">3D</span>. Created by <a href="https://github.com/Ritam646" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">Ritam Patra</a>
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Preserving India's architectural marvels through digital innovation
              </p>
            </motion.div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3">
              {[
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Contact', href: 'mailto:ritampatra888@gmail.com' }
              ].map((item, index) => (
                <motion.a 
                  key={item.label}
                  href={item.href} 
                  className="text-slate-400 hover:text-white hover:neon-text transition-all duration-300 text-sm relative group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + (index * 0.1) }}
                >
                  <span>{item.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300"></span>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
