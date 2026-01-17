import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useContext } from "react";
import { Link, useLocation } from "wouter";
import { AuthContext } from "../context/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useContext(AuthContext);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login - in a real app, this would call an API
    if (email && password) {
      if (auth && auth.signIn) {
        auth.signIn({ id: 1, email, name: email.split('@')[0] });
        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
        navigate("/");
      } else {
        toast({
          title: "Authentication error",
          description: "Unable to sign in at this time",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error signing in",
        description: "Please fill in all fields",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex min-h-[80vh] w-full flex-col md:flex-row">
      {/* Left column - Sign In Form */}
      <motion.div 
        className="flex-1 flex items-center justify-center p-8 md:p-16" 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="example@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Sign In</Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account? <Link href="/sign-up" className="text-primary hover:underline">Sign up</Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
      
      {/* Right column - Hero Image and Text */}
      <motion.div 
        className="hidden md:flex flex-1 bg-primary/5 dark:bg-primary/10 p-16 items-center justify-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-md">
          <motion.div 
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Explore India's Heritage in 3D</h2>
            <p className="text-muted-foreground">Discover incredible monuments and heritage sites through immersive 3D models and virtual tours.</p>
          </motion.div>
          
          <motion.div
            className="bg-background rounded-xl overflow-hidden shadow-xl" 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da" 
              alt="Taj Mahal"
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="font-semibold text-lg text-foreground mb-2">Taj Mahal</h3>
              <p className="text-muted-foreground text-sm">Experience the beauty of this iconic monument in stunning 3D detail.</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}