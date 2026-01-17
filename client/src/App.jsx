import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";
import SimpleModelViewer from "./pages/SimpleModelViewer"; // Import our simpler model viewer
import AssistantPage from "./pages/AssistantPage"; // Import our heritage assistant page
import HomePage from "./pages/home-page"; // New enhanced home page
import ModelsPage from "./pages/models-page"; // New models showcase page
import ConverterPage from "@/pages/converter-page";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useContext, useEffect } from "react";
import { Redirect, useLocation } from "wouter";
import { Loader2 } from "lucide-react";

// Import context providers
import { AuthContext, AuthProvider } from "./context/auth-context";
import { LanguageProvider } from "./context/language-context";

// Simple protected route component without Clerk
const ProtectedRoute = ({ component: Component, ...rest }) => {
  // Use our auth context to check if user is authenticated
  const auth = useContext(AuthContext);
  const [isLoading] = useState(false);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!auth || !auth.user) {
    return <Redirect to="/sign-in" />;
  }

  return <Component {...rest} />;
};

function Router() {
  const [location] = useLocation();
  
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/models" component={ModelsPage} />
      <Route path="/viewer" component={SimpleModelViewer} />
      <Route path="/sign-in" component={SignInPage} />
      <Route path="/sign-up" component={SignUpPage} />
      <Route path="/converter">
        <ProtectedRoute component={ConverterPage} />
      </Route>
      <Route path="/assistant" component={AssistantPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
            <Toaster />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;