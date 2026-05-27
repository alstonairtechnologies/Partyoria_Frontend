import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface StepProps {
  number: number;
  title: string;
  description: string;
  delay: number;
}

const Step = ({ number, title, description, delay }: StepProps) => (
  <div className="text-center">
    <div 
      className="w-20 h-20 bg-[#FF5A5F]/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce" 
      style={{ 
        animationDuration: '3s', 
        animationDelay: `${delay}s`,
        animationIterationCount: 'infinite'
      }}
    >
      <span className="text-[#FF5A5F] text-3xl font-bold">{number}</span>
    </div>
    <h3 className="text-xl font-semibold mb-3 font-heading">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default function HowItWorksSection() {
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      window.location.href = "/signup";
    } else {
      // Scroll to services section if already logged in
      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const steps = [
    {
      number: 1,
      title: "Sign Up",
      description: "Create your account as a customer seeking services or as a vendor offering them.",
      delay: 0
    },
    {
      number: 2,
      title: "Browse Services",
      description: "Explore our wide range of vendors, venues, and services available near you.",
      delay: 0.5
    },
    {
      number: 3,
      title: "Book & Customize",
      description: "Select your preferred options and customize your package to suit your needs.",
      delay: 1
    },
    {
      number: 4,
      title: "Enjoy Your Event",
      description: "Sit back and enjoy while we handle the coordination for your perfect celebration.",
      delay: 1.5
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#FF5A5F] font-semibold">HOW IT WORKS</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 font-heading">
            Simple Steps to Your Perfect Event
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our streamlined process makes planning any celebration a breeze.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Step
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
              delay={step.delay}
            />
          ))}
        </div>

        <div className="mt-16 p-8 bg-white rounded-xl shadow-sm text-center">
          <h3 className="text-2xl font-bold mb-4 font-heading">Ready to Start Planning Your Event?</h3>
          <p className="text-lg text-gray-600 mb-6">
            Join thousands of satisfied customers who've created memorable celebrations with Partyoria.
          </p>
          <Button 
            onClick={handleGetStarted}
            className="py-3 px-8 bg-[#FF5A5F] text-white rounded-lg hover:bg-[#FF5A5F]/90 transition duration-300 font-semibold h-auto"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
