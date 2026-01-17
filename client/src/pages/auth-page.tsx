import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertUserSchema } from '@shared/schema';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Redirect } from 'wouter';
import { Axis3d } from 'lucide-react';

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

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>('login');
  const { user, loginMutation, registerMutation } = useAuth();
  
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
    loginMutation.mutate(data);
  };

  const onSubmitRegister = (data: RegisterFormValues) => {
    // Remove confirmPassword and terms as they're not part of the API schema
    const { confirmPassword, terms, ...registerData } = data;
    
    registerMutation.mutate(registerData);
  };

  // If user is logged in, redirect to home
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Authentication Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Heritage3D</CardTitle>
              <CardDescription>
                Enter your credentials to access your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
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
                </TabsContent>
                
                <TabsContent value="register">
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
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:block"
        >
          <div className="relative p-6 overflow-hidden rounded-lg bg-gradient-to-br from-primary to-primary/80 text-white h-full">
            <div className="relative z-10">
              <div className="mb-4">
                <Axis3d className="h-12 w-12" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Experience India's Heritage in 3D</h2>
              <p className="mb-8 text-white/90">
                Join our platform to explore authentic 3D models of India's most iconic monuments. Transform text descriptions into detailed 3D visualizations and learn about the rich cultural heritage.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  'Interactive 3D Models',
                  'Virtual Tours',
                  'Text to 3D Conversion',
                  'Heritage Knowledge Base'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-white/20 pt-6">
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white/90 border-2 border-primary flex items-center justify-center text-primary text-xs font-medium">
                        {i}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-white/90">Join 5,000+ users exploring India's heritage sites in 3D</p>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay transform translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full mix-blend-overlay transform -translate-x-1/4 translate-y-1/4"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
