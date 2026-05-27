import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

const vendors = [
  {
    id: 1,
    name: "Royal Wedding Planners",
    location: "Mumbai, Bandra West",
    rating: 4.9,
    reviews: 124,
    price: "₹2,50,000",
    oldPrice: "₹3,00,000",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
    tags: ["Wedding Planning", "Decorations", "Photography"],
    type: "Wedding Specialist",
    verified: true,
    available: true,
    description: "Royal Wedding Planners is Mumbai's premier wedding planning service with over 10 years of experience. We specialize in creating magical moments with attention to every detail. Our team handles everything from venue selection to catering, decorations, and photography. We have successfully planned over 500 weddings across India, making each celebration unique and memorable.",
  },
  {
    id: 2,
    name: "Spice Route Catering",
    location: "Delhi, Connaught Place",
    rating: 4.8,
    reviews: 89,
    price: "₹1,200",
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80",
    tags: ["Indian Cuisine", "Live Counters", "Vegan Options"],
    type: "Catering Expert",
    verified: true,
    available: true,
    perPerson: true,
    description: "Spice Route Catering brings authentic Indian flavors to your special occasions. With a team of expert chefs and a menu featuring regional cuisines from across India, we cater to events of all sizes. Our live counters, customizable menus, and exceptional service have made us Delhi's most trusted catering partner for weddings, corporate events, and celebrations.",
  },
  {
    id: 3,
    name: "Lens & Light Studios",
    location: "Bangalore, Koramangala",
    rating: 4.9,
    reviews: 156,
    price: "₹85,000",
    oldPrice: "₹1,00,000",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?auto=format&fit=crop&w=600&q=80",
    tags: ["Wedding Photography", "Albums", "Cinematography"],
    type: "Photography Pro",
    verified: true,
    available: 2,
    description: "Lens & Light Studios is Bangalore's award-winning photography and cinematography team. We specialize in capturing candid moments and creating cinematic wedding films. Our portfolio includes over 300 weddings across South India. We use state-of-the-art equipment and offer same-day editing, premium albums, and drone photography services.",
  },
  {
    id: 4,
    name: "Bollywood Beats DJ",
    location: "Mumbai, Juhu",
    rating: 4.7,
    reviews: 92,
    price: "₹45,000",
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=600&q=80",
    tags: ["DJ Services", "Sound System", "Lighting"],
    type: "Entertainment",
    verified: true,
    available: true,
    description: "Bollywood Beats DJ brings high-energy entertainment to your celebrations. With an extensive music library spanning Bollywood hits, international tracks, and regional favorites, we keep your guests dancing all night. Our professional sound systems, LED lighting, and interactive DJ performances have made us Mumbai's most sought-after entertainment service.",
  },
  {
    id: 5,
    name: "Grand Palace Venues",
    location: "Delhi, CP",
    rating: 4.9,
    reviews: 203,
    price: "₹3,50,000",
    oldPrice: null,
    image: "https://th.bing.com/th/id/OIP.9TZnh9eJ71pfXFBB7lFPRQHaE8?w=277&h=185&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    tags: ["Palace Weddings", "Corporate Events", "Available"],
    type: "Premium Venue",
    verified: true,
    available: true,
    description: "Grand Palace Venues offers luxurious event spaces in the heart of Delhi. Our heritage property features grand ballrooms, beautiful gardens, and state-of-the-art facilities. With a capacity for up to 1000 guests, we host weddings, corporate events, and celebrations. Our in-house catering, valet parking, and dedicated event coordinators ensure a seamless experience.",
  },
  {
    id: 6,
    name: "Petals & Blooms",
    location: "Hyderabad, Jubilee Hills",
    rating: 4.6,
    reviews: 67,
    price: "₹75,000",
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80",
    tags: ["Floral Design", "Mandap Decor", "Bridal Bouquets"],
    type: "Floral Designer",
    verified: true,
    available: true,
    description: "Petals & Blooms is Hyderabad's premier floral design studio specializing in wedding decorations and event styling. We create stunning mandap designs, bridal bouquets, and venue decorations using fresh flowers and innovative arrangements. Our team of skilled florists has decorated over 200 weddings, bringing natural beauty and elegance to every celebration.",
  },
];

export default function VendorShowcaseSection() {
  const [showCount, setShowCount] = useState(6);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const openVendorProfile = (vendor: any) => {
    setSelectedVendor(vendor);
    setIsProfileOpen(true);
  };

  const handleBookNow = () => {
    window.location.href = '/signup';
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Filter/Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-4 items-center justify-between mb-12">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <select className="border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]">
              <option>Event Type</option>
              <option>Wedding</option>
              <option>Corporate</option>
              <option>Birthday</option>
              <option>Engagement</option>
              <option>Anniversary</option>
              <option>Baby Shower</option>
              <option>Graduation</option>
              <option>Festival</option>
              <option>Product Launch</option>
              <option>Conference</option>
              <option>Seminar</option>
              <option>Housewarming</option>
            </select>
            <select className="border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]">
              <option>Location</option>
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Bangalore</option>
              <option>Chennai</option>
              <option>Hyderabad</option>
              <option>Pune</option>
              <option>Kolkata</option>
              <option>Ahmedabad</option>
              <option>Jaipur</option>
              <option>Surat</option>
              <option>Lucknow</option>
              <option>Kanpur</option>
              <option>Nagpur</option>
              <option>Indore</option>
              <option>Bhopal</option>
              <option>Visakhapatnam</option>
              <option>Patna</option>
              <option>Vadodara</option>
              <option>Ghaziabad</option>
            </select>
            <input type="date" className="border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]" />
            <select className="border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]">
              <option>Guest Count</option>
              <option>1-50</option>
              <option>51-200</option>
              <option>201+</option>
            </select>
          </div>
          <Button className="bg-button-gradient text-white px-8 py-3 rounded-lg font-semibold">Find Vendors</Button>
        </div>

        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4 md:mb-0">Premium Vendors Available</h2>
          <div className="flex items-center gap-3">
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#22C55E"/><path d="M17 9l-5.2 5.2-2.8-2.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              168 verified vendors
            </span>
            <Button variant="outline" className="border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm">More Filters</Button>
          </div>
        </div>

        {/* Vendor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendors.slice(0, showCount).map((vendor) => (
            <Card key={vendor.id} className="relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <img src={vendor.image} alt={vendor.name} className="w-full h-48 object-cover" />
              <CardHeader className="pb-2 pt-4 flex-row items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-gray-100 text-gray-700 font-medium px-2 py-1 text-xs">{vendor.type}</Badge>
                    {vendor.verified && <Badge className="bg-green-100 text-green-700 font-medium px-2 py-1 text-xs flex items-center gap-1">Verified <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#22C55E"/><path d="M17 9l-5.2 5.2-2.8-2.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Badge>}
                    {vendor.available !== true && <Badge className="bg-blue-100 text-blue-700 font-medium px-2 py-1 text-xs">{vendor.available} Available</Badge>}
                  </div>
                  <CardTitle className="text-lg font-bold mb-1 leading-tight">{vendor.name}</CardTitle>
                  <span className="text-gray-500 text-xs">{vendor.location}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-yellow-500 font-semibold flex items-center gap-1 text-sm">
                    {vendor.rating} <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                  </span>
                  <span className="text-gray-400 text-xs">({vendor.reviews} reviews)</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {vendor.tags.map((tag, i) => (
                    <Badge key={i} className="bg-gray-50 text-gray-600 font-normal px-2 py-1 text-xs border border-gray-200">{tag}</Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-pink-600 font-bold text-lg">{vendor.price}{vendor.perPerson && <span className="text-xs font-normal text-gray-500"> per person</span>}</span>
                  {vendor.oldPrice && <span className="text-gray-400 line-through text-sm">{vendor.oldPrice}</span>}
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-end">
                <Button 
                  className="bg-button-gradient text-white px-6 py-2 rounded-lg font-semibold"
                  onClick={() => openVendorProfile(vendor)}
                >
                  View Profile
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Load More Vendors Button */}
        <div className="text-center mt-10">
          {showCount < vendors.length && (
            <Button 
              className="py-3 px-8 bg-button-gradient text-white rounded-lg transition duration-300 font-semibold h-auto"
              onClick={() => setShowCount(showCount + 3)}
            >
              Load More Vendors
            </Button>
          )}
        </div>

        {/* Vendor Profile Dialog */}
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedVendor && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {selectedVendor.name}
                    {selectedVendor.verified && (
                      <Badge className="bg-green-100 text-green-700 text-xs">Verified</Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedVendor.type} • {selectedVendor.location}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={selectedVendor.image} 
                      alt={selectedVendor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Rating</span>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500 font-semibold flex items-center gap-1">
                          {selectedVendor.rating} 
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385-2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/>
                          </svg>
                        </span>
                        <span className="text-sm text-gray-600">({selectedVendor.reviews} reviews)</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Starting Price</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-brand-purple">{selectedVendor.price}</span>
                        {selectedVendor.oldPrice && (
                          <span className="text-gray-400 line-through text-sm">{selectedVendor.oldPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">About</span>
                    <p className="text-gray-700 mt-1 leading-relaxed">{selectedVendor.description}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Services</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedVendor.tags.map((tag: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="bg-brand-purple/10 text-brand-purple">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      className="flex-1 bg-button-gradient text-white"
                      onClick={handleBookNow}
                    >
                      Book Now
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Contact Vendor
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
} 