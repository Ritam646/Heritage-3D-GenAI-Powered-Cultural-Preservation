import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertUserSchema } from '@shared/schema';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { loginMutation, registerMutation } = useAuth();
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      name: "",
      terms: false,
    },
  });

  const onSubmitLogin = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        onClose();
        loginForm.reset();
      }
    });
  };

  const onSubmitRegister = (data: RegisterFormValues) => {
    // Remove confirmPassword and terms as they're not part of the API schema
    const { confirmPassword, terms, ...registerData } = data;
    
    registerMutation.mutate(registerData, {
      onSuccess: () => {
        onClose();
        registerForm.reset();
      }
    });
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };
  
  const modalVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />
          
          <motion.div 
            className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            variants={modalVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Tab Navigation */}
            <div className="flex border-b">
              <button 
                className={`flex-1 px-6 py-4 font-medium text-center transition-colors ${
                  activeTab === 'login' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button 
                className={`flex-1 px-6 py-4 font-medium text-center transition-colors ${
                  activeTab === 'signup' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground'
                }`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
              <button 
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors"
                onClick={onClose}
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            
            <AnimatePresence mode="wait">
              {/* Login Form */}
              {activeTab === 'login' && (
                <motion.div 
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  <h2 className="font-bold text-2xl text-card-foreground mb-6 text-center">
                    Welcome Back
                  </h2>
                  
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your username" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center">
                              <FormLabel>Password</FormLabel>
                              <a href="#" className="text-xs text-primary hover:underline">
                                Forgot Password?
                              </a>
                            </div>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter your password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Logging in..." : "Log In"}
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="relative flex items-center justify-center my-6">
                    <div className="flex-grow border-t border-muted"></div>
                    <span className="flex-shrink mx-4 text-muted-foreground text-sm">
                      or continue with
                    </span>
                    <div className="flex-grow border-t border-muted"></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {['google', 'facebook', 'twitter'].map((provider) => (
                      <Button
                        key={provider}
                        variant="outline"
                        className="flex items-center justify-center"
                        type="button"
                      >
                        <i className={`ri-${provider}-fill text-xl`}></i>
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Sign Up Form */}
              {activeTab === 'signup' && (
                <motion.div 
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  <h2 className="font-bold text-2xl text-card-foreground mb-6 text-center">
                    Create Account
                  </h2>
                  
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your full name" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Enter your email" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Choose a username" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Create a password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Confirm your password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal">
                                I agree to the{' '}
                                <a href="#" className="text-primary hover:underline">
                                  Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-primary hover:underline">
                                  Privacy Policy
                                </a>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating Account..." : "Sign Up"}
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="relative flex items-center justify-center my-6">
                    <div className="flex-grow border-t border-muted"></div>
                    <span className="flex-shrink mx-4 text-muted-foreground text-sm">
                      or sign up with
                    </span>
                    <div className="flex-grow border-t border-muted"></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {['google', 'facebook', 'twitter'].map((provider) => (
                      <Button
                        key={provider}
                        variant="outline"
                        className="flex items-center justify-center"
                        type="button"
                      >
                        <i className={`ri-${provider}-fill text-xl`}></i>
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
