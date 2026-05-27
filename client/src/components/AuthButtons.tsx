import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { UserTypeContext } from "@/main";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface AuthButtonsProps {
  className?: string;
}

export default function AuthButtons({ className = "flex space-x-2 w-full" }: AuthButtonsProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { setIsVendor } = useContext(UserTypeContext);
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    setIsVendor(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    // Redirect to home page to show normal home page
    window.location.href = '/';
  };

  if (isAuthenticated) {
    return (
      <div className={className}>
        <span className="text-gray-700 mr-3">
          Welcome, {(user as any)?.firstName || (user as any)?.username}!
        </span>
        <Button
          onClick={() => window.location.href = '/dashboard'}
          variant="default"
          className="bg-primary text-white hover:bg-primary/90 transition duration-300 mr-2"
        >
          Dashboard
        </Button>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-white transition duration-300"
        >
          Log Out
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <Link href="/login">
        <Button
          variant="outline"
          className="border-2 border-primary text-primary hover:bg-primary/10 hover:border-primary/80 transition-all duration-300 shadow-sm px-6"
        >
          Login
        </Button>
      </Link>
      <div className="w-3" /> {/* Spacing between buttons */}
      <Link href="/signup" onClick={() => window.scrollTo(0, 0)}>
        <Button
          className="bg-primary text-white hover:bg-primary/90 transition-all duration-300 shadow-md px-6 hover:scale-105"
        >
          Sign Up
        </Button>
      </Link>
    </div>
  );
}
