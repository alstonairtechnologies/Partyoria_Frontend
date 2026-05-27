
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CATEGORIES = ["All", "Wedding", "Corporate", "Birthday", "Concert", "Festival", "Conference", "Social", "Religious"];

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [displayCount, setDisplayCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  
  const events = [
    {
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop&auto=format&q=75",
      title: "Royal Palace Wedding",
      description: "An opulent celebration at a historic palace with traditional ceremonies.",
      location: "Udaipur, Rajasthan",
      date: "Dec 15, 2024",
      category: "Wedding",
      categoryColor: "primary",
      planner: {
        name: "Elegant Affairs",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&auto=format&q=75"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&auto=format&q=75",
      title: "Tech Innovation Summit 2024",
      description: "A premier tech conference featuring industry leaders and innovative showcases.",
      location: "Bengaluru, Karnataka",
      date: "Nov 20, 2024",
      category: "Conference",
      categoryColor: "secondary",
      planner: {
        name: "Future Events Co.",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&fit=crop&auto=format&q=75"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1543353071-10c8ba85a904",
      title: "Sunset Beach Festival",
      description: "Annual music festival featuring top artists and beachside entertainment.",
      location: "Goa",
      date: "Oct 10, 2024",
      category: "Festival",
      categoryColor: "accent",
      planner: {
        name: "Coastal Celebrations",
        image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865",
      title: "Corporate Leadership Summit",
      description: "Annual business leadership conference with networking opportunities.",
      location: "Mumbai, Maharashtra",
      date: "Sep 25, 2024",
      category: "Corporate",
      categoryColor: "primary",
      planner: {
        name: "Summit Solutions",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3",
      title: "Diwali Cultural Night",
      description: "Traditional cultural celebration with performances and festivities.",
      location: "Delhi",
      date: "Nov 5, 2024",
      category: "Religious",
      categoryColor: "secondary",
      planner: {
        name: "Cultural Connect",
        image: "https://images.unsplash.com/photo-1548449112-96a38a643324"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1525441273400-056e9c7517b3?auto=format&fit=crop&w=600&q=80",
      title: "Sweet Sixteen Celebration",
      description: "Elegant birthday celebration with customized themes and entertainment.",
      location: "Chennai, Tamil Nadu",
      date: "Aug 30, 2024",
      category: "Birthday",
      categoryColor: "accent",
      planner: {
        name: "Party Perfect",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1501612780327-45045538702b",
      title: "Rock Music Concert",
      description: "High-energy rock concert featuring popular bands and live performances.",
      location: "Pune, Maharashtra",
      date: "Jan 15, 2025",
      category: "Concert",
      categoryColor: "primary",
      planner: {
        name: "Music Events Pro",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
      title: "Charity Gala Dinner",
      description: "Elegant social gathering for fundraising with dinner and entertainment.",
      location: "Hyderabad, Telangana",
      date: "Feb 20, 2025",
      category: "Social",
      categoryColor: "secondary",
      planner: {
        name: "Social Impact Events",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
      title: "Golden Anniversary Celebration",
      description: "50th wedding anniversary celebration with family and friends.",
      location: "Jaipur, Rajasthan",
      date: "Mar 10, 2025",
      category: "Wedding",
      categoryColor: "accent",
      planner: {
        name: "Milestone Celebrations",
        image: "https://images.unsplash.com/photo-1494790108755-2616c27b1e2d"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8",
      title: "Product Launch Showcase",
      description: "Corporate product launch with media coverage and demonstrations.",
      location: "Kolkata, West Bengal",
      date: "Apr 5, 2025",
      category: "Corporate",
      categoryColor: "primary",
      planner: {
        name: "Corporate Solutions",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1482575832494-771f74bf6857",
      title: "Holi Festival Celebration",
      description: "Vibrant Holi festival with colors, music, and traditional festivities.",
      location: "Mathura, Uttar Pradesh",
      date: "Mar 25, 2025",
      category: "Festival",
      categoryColor: "secondary",
      planner: {
        name: "Festival Organizers",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
      title: "Graduation Party",
      description: "Celebration of academic achievement with family and friends.",
      location: "Ahmedabad, Gujarat",
      date: "May 15, 2025",
      category: "Social",
      categoryColor: "accent",
      planner: {
        name: "Academic Celebrations",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&w=600&q=80",
      title: "Diamond Jubilee Birthday",
      description: "Elegant 60th birthday celebration with family gathering and special moments.",
      location: "Lucknow, Uttar Pradesh",
      date: "Jun 20, 2025",
      category: "Birthday",
      categoryColor: "primary",
      planner: {
        name: "Birthday Bliss",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80"
      }
    }
  ];

  const filteredEvents = selectedCategory === "All" 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  const displayedEvents = filteredEvents.slice(0, displayCount);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 font-heading">Discover Events</h1>
        <p className="text-lg text-gray-600 mb-8">
          Find and explore amazing events happening across India
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Input 
            type="search" 
            placeholder="Search events..." 
            className="max-w-xs"
          />
          <div className="flex gap-2 flex-wrap justify-center">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="h-8"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedEvents.map((event, index) => (
          <div key={index} className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-64 object-cover" 
              loading="lazy"
            />
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <Badge className={`bg-${event.categoryColor}/10 text-${event.categoryColor} hover:bg-${event.categoryColor}/20`}>
                  {event.category}
                </Badge>
                <span className="text-gray-500 text-sm">{event.date}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 font-heading">{event.title}</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={event.planner.image} alt={event.planner.name} />
                    <AvatarFallback>{event.planner.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-gray-700 text-sm">By <strong>{event.planner.name}</strong></span>
                </div>
                <span className="text-gray-500 text-sm">{event.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayCount < filteredEvents.length && (
        <div className="text-center mt-8">
          <Button 
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setDisplayCount(prev => prev + 3);
                setIsLoading(false);
              }, 100);
            }}
            disabled={isLoading}
            className="bg-[#FF5A5F] hover:bg-[#FF5A5F]/90"
          >
            {isLoading ? 'Loading...' : 'Load More Events'}
          </Button>
        </div>
      )}
    </div>
  );
}
