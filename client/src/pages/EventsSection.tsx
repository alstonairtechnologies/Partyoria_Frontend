import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EventCardProps {
  image: string;
  title: string;
  description: string;
  location: string;
  category: string;
  categoryColor: string;
  planner: {
    name: string;
    image: string;
  };
}

const EventCard = ({ 
  image, 
  title, 
  description, 
  location, 
  category, 
  categoryColor, 
  planner 
}: EventCardProps) => (
  <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white">
    <img 
      src={image} 
      alt={title} 
      className="w-full h-64 object-cover" 
    />
    <div className="p-6">
      <div className="flex justify-between items-center mb-3">
        <Badge className={`bg-${categoryColor}/10 text-${categoryColor} hover:bg-${categoryColor}/20`}>
          {category}
        </Badge>
        <span className="text-gray-500 text-sm">{location}</span>
      </div>
      <h3 className="text-xl font-bold mb-2 font-heading">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={planner.image} alt={planner.name} />
          <AvatarFallback>{planner.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-gray-700 text-sm">Planned by <strong>{planner.name}</strong></span>
      </div>
    </div>
  </div>
);

export default function EventsSection() {
  const events = [
    {
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      title: "Royal Palace Wedding",
      description: "An opulent celebration at a historic palace with 500+ guests and traditional ceremonies.",
      location: "Udaipur, Rajasthan",
      category: "Wedding",
      categoryColor: "primary",
      planner: {
        name: "Elegant Affairs",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      title: "Annual Tech Summit",
      description: "A three-day conference with multiple speakers, interactive sessions, and networking events.",
      location: "Bengaluru, Karnataka",
      category: "Corporate",
      categoryColor: "secondary",
      planner: {
        name: "Future Events Co.",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1543353071-10c8ba85a904?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      title: "Sunset Beach Party",
      description: "An exclusive beachside celebration with custom decor, live music, and gourmet dining.",
      location: "Goa",
      category: "Birthday",
      categoryColor: "accent",
      planner: {
        name: "Coastal Celebrations",
        image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      title: "Grand Engagement Ceremony",
      description: "A traditional engagement celebration with elaborate decorations and cultural performances.",
      location: "Mumbai, Maharashtra",
      category: "Engagement",
      categoryColor: "primary",
      planner: {
        name: "Dream Makers",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      title: "Silver Jubilee Anniversary",
      description: "A memorable 25th anniversary celebration with family and friends in an elegant ballroom setting.",
      location: "Delhi, NCR",
      category: "Anniversary",
      categoryColor: "secondary",
      planner: {
        name: "Milestone Events",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      title: "Baby Shower Celebration",
      description: "A joyful baby shower with pastel decorations, games, and delightful treats for expecting parents.",
      location: "Pune, Maharashtra",
      category: "Baby Shower",
      categoryColor: "accent",
      planner: {
        name: "Little Moments",
        image: "https://images.unsplash.com/photo-1494790108755-2616c27b1e2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      title: "Graduation Ceremony",
      description: "A proud graduation celebration with academic honors, family gathering, and achievement recognition.",
      location: "Chennai, Tamil Nadu",
      category: "Graduation",
      categoryColor: "primary",
      planner: {
        name: "Academic Celebrations",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1482575832494-771f74bf6857?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      title: "Diwali Festival Celebration",
      description: "A vibrant Diwali celebration with traditional decorations, cultural performances, and festive dining.",
      location: "Jaipur, Rajasthan",
      category: "Festival",
      categoryColor: "secondary",
      planner: {
        name: "Festival Organizers",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      title: "Product Launch Event",
      description: "A sophisticated product launch with media coverage, demonstrations, and networking opportunities.",
      location: "Hyderabad, Telangana",
      category: "Product Launch",
      categoryColor: "accent",
      planner: {
        name: "Corporate Solutions",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      }
    }
  ];

  return (
    <section id="events" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#FF5A5F] font-semibold">FEATURED EVENTS</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 font-heading">
            Inspiration for Your Celebration
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our showcase of beautifully executed events from across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.slice(0, 6).map((event, index) => (
            <EventCard
              key={index}
              image={event.image}
              title={event.title}
              description={event.description}
              location={event.location}
              category={event.category}
              categoryColor={event.categoryColor}
              planner={event.planner}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            className="py-3 px-8 bg-[#FF5A5F] text-white rounded-lg hover:bg-[#FF5A5F]/90 transition duration-300 font-semibold h-auto"
            onClick={() => window.location.href = '/events'}
          >
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
}
