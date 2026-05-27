import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useContext } from "react";
import { UserTypeContext } from "@/main";

export default function VendorPromoSection() {
  const { isAuthenticated } = useAuth();
  const { setIsVendor } = useContext(UserTypeContext);
  const { toast } = useToast();

  const handleVendorSignup = async () => {
    if (!isAuthenticated) {
      window.location.href = "/signup";
    } else {
      try {
        await apiRequest("/api/users/vendor", { method: "POST" });
        setIsVendor(true);
        toast({
          title: "Success!",
          description: "You are now registered as a vendor.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to register as vendor. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const benefits = [
    "Reach thousands of potential clients",
    "Showcase your portfolio and services",
    "Simple booking and payment management",
    "24/7 support for vendors"
  ];

  return (
    <section className="bg-brand-gradient py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-10 md:mb-0 md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">Are You an Event Service Provider?</h2>
            <p className="text-xl text-white/90 mb-6">
              Join our platform to connect with customers looking for your services. Expand your business across India.
            </p>
            <ul className="mb-8 space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center text-white">
                  <CheckCircle className="mr-3 text-[#FFD700]" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Button 
              onClick={handleVendorSignup}
              className="py-3 px-8 bg-button-gradient-1 text-brand-purple rounded-lg border border-brand-purple transition duration-300 font-semibold h-auto"
            >
              Register as Vendor
            </Button>
          </div>
          <div className="md:w-2/5">
            <img 
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500" 
              alt="Event vendor team" 
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
