import { useState, useContext } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Globe,
  User,
  LogOut
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { AuthContext } from "../context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [location, navigate] = useLocation();
  const auth = useContext(AuthContext);
  const { toast } = useToast();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = () => {
    if (auth && auth.signOut) {
      auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
      navigate("/");
    }
  };

  const logoAnimation = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  const navItemAnimation = {
    hover: { 
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2 }
    }
  };

  const buttonAnimation = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const NavLink = ({ to, label }) => {
    const isActive = location === to;
    return (
      <motion.div
        variants={navItemAnimation}
        whileHover="hover"
        className={`${isActive ? 'text-primary font-semibold' : 'text-foreground'}`}
      >
        <Link 
          href={to} 
          className="px-4 py-2 block transition-colors hover:text-primary"
        >
          {label}
        </Link>
      </motion.div>
    );
  };

  const NavLinkMobile = ({ to, label, onClick }) => {
    const isActive = location === to;
    return (
      <Link 
        href={to} 
        onClick={onClick}
        className={`block px-4 py-3 text-lg border-b border-border ${isActive ? 'text-primary font-semibold' : 'text-foreground'}`}
      >
        {label}
      </Link>
    );
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!auth || !auth.user || !auth.user.name) return "?";
    return auth.user.name.split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <motion.div
                variants={logoAnimation}
                whileHover="hover"
              >
                <Link href="/" className="flex items-center">
                  <Globe className="h-8 w-8 text-primary mr-2" />
                  <span className="font-bold text-xl text-foreground">Heritage3D</span>
                </Link>
              </motion.div>
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-4 md:items-center">
              <NavLink to="/" label="Home" />
              <NavLink to="/models" label="3D Models" />
              <NavLink to="/converter" label="Text to 3D" />
              <NavLink to="/assistant" label="Assistant" />
            </div>
          </div>

          {/* User menu and mobile toggle */}
          <div className="flex items-center">
            {/* Language selector */}
            <div className="mr-2 hidden md:block">
              <LanguageSelector />
            </div>

            {/* Theme toggle */}
            <motion.div
              variants={buttonAnimation}
              whileHover="hover"
              whileTap="tap"
              className="mr-2"
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="bg-transparent hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </motion.div>

            {/* Desktop authentication */}
            <div className="hidden md:flex items-center space-x-2">
              {auth && auth.user ? (
                // User is signed in - show user menu
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-muted">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{auth.user.name}</p>
                        <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // User is not signed in - show sign in/up buttons
                <>
                  <motion.div
                    variants={buttonAnimation}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="ghost" 
                      asChild
                      className="hover:bg-muted transition-colors"
                    >
                      <Link href="/sign-in">Sign in</Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    variants={buttonAnimation}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button asChild>
                      <Link href="/sign-up">Sign up</Link>
                    </Button>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-2">
              <Button 
                variant="ghost" 
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center hover:bg-muted"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="pt-2 pb-4 space-y-1">
            <NavLinkMobile to="/" label="Home" onClick={toggleMobileMenu} />
            <NavLinkMobile to="/models" label="3D Models" onClick={toggleMobileMenu} />
            <NavLinkMobile to="/converter" label="Text to 3D" onClick={toggleMobileMenu} />
            <NavLinkMobile to="/assistant" label="Assistant" onClick={toggleMobileMenu} />
            
            {/* Mobile language selector */}
            <div className="px-4 py-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Language</span>
                <LanguageSelector />
              </div>
            </div>

            {/* Mobile auth buttons */}
            <div className="px-4 py-4 border-t border-border">
              {auth && auth.user ? (
                // User is signed in
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{auth.user.name}</p>
                      <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => {
                      handleSignOut();
                      toggleMobileMenu();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              ) : (
                // User is not signed in
                <div className="grid grid-cols-2 gap-2 w-full py-2">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/sign-in" onClick={toggleMobileMenu}>Sign in</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/sign-up" onClick={toggleMobileMenu}>Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}