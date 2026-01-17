import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ModelsPage from "@/pages/models-page";
import ConverterPage from "@/pages/converter-page";
import AssistantPage from "@/pages/assistant-page";
import { ProtectedRoute } from "./lib/protected-route";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage}/>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/models" component={ModelsPage} />
      <ProtectedRoute path="/models/:id" component={ModelsPage} />
      <ProtectedRoute path="/converter" component={ConverterPage} />
      <ProtectedRoute path="/assistant" component={AssistantPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
