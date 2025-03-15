
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <AuroraBackground>
      <div className="text-center glass-morphism p-10 rounded-xl max-w-md">
        <AlertTriangle className="h-16 w-16 mx-auto text-amber-500 mb-4" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! The page you're looking for does not exist.
        </p>
        <Button asChild>
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </AuroraBackground>
  );
};

export default NotFound;
