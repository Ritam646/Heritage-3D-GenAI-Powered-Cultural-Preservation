import { Link } from "wouter";
import { motion } from "framer-motion";
import { Globe, Mail, Twitter, Github, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerItemAnimation = {
    hover: { 
      y: -3,
      transition: { duration: 0.2 }
    }
  };
  
  const iconAnimation = {
    hover: { 
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.2 }
    }
  };

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Globe className="h-6 w-6 text-primary mr-2" />
              <Link href="/" className="font-bold text-xl text-foreground">
                Heritage3D
              </Link>
            </div>
            <p className="text-muted-foreground text-sm">
              Explore India's rich heritage through interactive 3D models and immersive virtual tours.
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Explore</h3>
            <ul className="space-y-2">
              {["Home", "3D Models", "Text to 3D", "Assistant"].map((item) => (
                <motion.li key={item} variants={footerItemAnimation} whileHover="hover">
                  <Link 
                    href={`/${item === "Home" ? "" : item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              {["About", "FAQ", "Privacy", "Terms"].map((item) => (
                <motion.li key={item} variants={footerItemAnimation} whileHover="hover">
                  <Link 
                    href={`/${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
          
          {/* Connect */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <div className="flex space-x-4">
              {[
                { icon: Mail, href: "mailto:info@heritage3d.com" },
                { icon: Twitter, href: "https://twitter.com" },
                { icon: Github, href: "https://github.com" },
                { icon: Instagram, href: "https://instagram.com" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                  variants={iconAnimation}
                  whileHover="hover"
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} Heritage3D. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}