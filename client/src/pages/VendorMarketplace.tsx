import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FaStar, FaMapMarkerAlt, FaHeart, FaRegHeart } from "react-icons/fa"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Filter, Search, MapPin, Star, DollarSign, Tag, Grid2X2, List, Edit, Trash2 } from "lucide-react"

// Same mock data as BrowseVendors

const vendorData = [
  {
    id: 1,
    name: "Elite Events Caterers",
    category: "Catering",
    location: "Hyderabad",
    price: 25000,
    rating: 4.5,
    reviewCount: 127,
    description: "Premium catering services for all types of events with customized menus and professional staff.",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop&crop=center",
    tags: ["North Indian", "South Indian", "Continental"],
    featured: true,
    liked: false,
    details: {
      phone: "+91 98765 43210",
      email: "info@eliteevents.com",
      experience: "8+ years",
      capacity: "50-500 guests",
      specialties: ["Wedding Catering", "Corporate Events", "Theme Parties"],
      availability: "Available"
    }
  },
  {
    id: 2,
    name: "Blissful Blooms Decor",
    category: "Decoration",
    location: "Bangalore",
    price: 15000,
    rating: 4.7,
    reviewCount: 89,
    description: "Creative decoration services that transform venues into magical spaces for weddings and events.",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center",
    tags: ["Floral", "Theme Decor", "Lighting"],
    featured: false,
    liked: true,
    details: {
      phone: "+91 98765 43211",
      email: "hello@blissfulblooms.com",
      experience: "6+ years",
      capacity: "Any venue size",
      specialties: ["Wedding Decor", "Corporate Events", "Birthday Parties"],
      availability: "Available"
    }
  },
  {
    id: 3,
    name: "DJ Night Beats",
    category: "DJ",
    location: "Chennai",
    price: 12000,
    rating: 4.3,
    reviewCount: 56,
    description: "Professional DJ services with state-of-the-art sound equipment and extensive music collection.",
    image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&h=600&fit=crop&crop=center",
    tags: ["Bollywood", "International", "Wedding"],
    featured: false,
    liked: false,
  },
  {
    id: 4,
    name: "Shutter Shots Photography",
    category: "Photography",
    location: "Hyderabad",
    price: 30000,
    rating: 4.8,
    reviewCount: 112,
    description: "Award-winning photography services capturing beautiful moments with artistic vision.",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop&crop=center",
    tags: ["Wedding", "Pre-wedding", "Candid"],
    featured: true,
    liked: false,
  },
  {
    id: 5,
    name: "Royal Venue Palace",
    category: "Venue",
    location: "Delhi",
    price: 75000,
    rating: 4.6,
    reviewCount: 203,
    description: "Luxurious venue with grand halls and beautiful gardens for weddings and corporate events.",
    image: "https://images.unsplash.com/photo-1519167758481-83f29c1fe8ea?w=800&h=600&fit=crop&crop=center",
    tags: ["Banquet", "Outdoor", "Luxury"],
    featured: true,
    liked: true,
  },
  {
    id: 6,
    name: "Sweet Delights Bakery",
    category: "Cake",
    location: "Mumbai",
    price: 8000,
    rating: 4.9,
    reviewCount: 78,
    description: "Artisanal bakery specializing in custom cakes and desserts for special occasions.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop&crop=center",
    tags: ["Custom Cakes", "Fondant", "Dessert Tables"],
    featured: false,
    liked: false,
  },
  {
    id: 7,
    name: "Grand Mehendi Artists",
    category: "Mehendi",
    location: "Jaipur",
    price: 10000,
    rating: 4.7,
    reviewCount: 92,
    description: "Traditional and modern mehendi designs by skilled artists for weddings and functions.",
    image: "https://th.bing.com/th/id/OIP.rfaUZoXdzieRC1URryhbbQHaLH?w=122&h=183&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    tags: ["Bridal", "Arabic", "Indo-Western"],
    featured: false,
    liked: false,
  },
  {
    id: 8,
    name: "Glamour Makeup Studio",
    category: "Makeup",
    location: "Bangalore",
    price: 18000,
    rating: 4.5,
    reviewCount: 147,
    description: "Professional makeup services using high-end products for brides and special occasions.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop&crop=center",
    tags: ["Bridal", "Party", "HD Makeup"],
    featured: false,
    liked: false,
  },
  {
    id: 9,
    name: "Spice Route Catering",
    category: "Catering",
    location: "Mumbai",
    price: 22000,
    rating: 4.6,
    reviewCount: 156,
    description: "Authentic Indian cuisine with modern presentation. Specializing in regional delicacies and fusion menus.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&crop=center",
    tags: ["Regional Cuisine", "Fusion", "Live Counters"],
    featured: false,
    liked: false,
  },
  {
    id: 10,
    name: "Elegant Affairs Decor",
    category: "Decoration",
    location: "Delhi",
    price: 35000,
    rating: 4.8,
    reviewCount: 134,
    description: "Luxury event decoration with premium flowers, drapes, and custom installations for grand celebrations.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center",
    tags: ["Luxury Decor", "Custom Installations", "Premium Flowers"],
    featured: true,
    liked: false,
  },
  {
    id: 11,
    name: "Rhythm Masters DJ",
    category: "DJ",
    location: "Pune",
    price: 15000,
    rating: 4.4,
    reviewCount: 89,
    description: "High-energy DJ performances with professional lighting and sound systems for unforgettable parties.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center",
    tags: ["Party Music", "Professional Lighting", "Sound Systems"],
    featured: false,
    liked: false,
  },
  {
    id: 12,
    name: "Candid Moments Studio",
    category: "Photography",
    location: "Chennai",
    price: 28000,
    rating: 4.7,
    reviewCount: 198,
    description: "Cinematic wedding photography and videography capturing natural emotions and beautiful moments.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop&crop=center",
    tags: ["Cinematic", "Candid Photography", "Videography"],
    featured: false,
    liked: false,
  },
  {
    id: 13,
    name: "Grand Ballroom Events",
    category: "Venue",
    location: "Bangalore",
    price: 85000,
    rating: 4.9,
    reviewCount: 167,
    description: "Spectacular ballroom venue with crystal chandeliers and state-of-the-art facilities for grand events.",
    image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop&crop=center",
    tags: ["Ballroom", "Crystal Chandeliers", "Grand Events"],
    featured: true,
    liked: false,
  },
  {
    id: 14,
    name: "Artisan Cake Boutique",
    category: "Cake",
    location: "Hyderabad",
    price: 12000,
    rating: 4.8,
    reviewCount: 145,
    description: "Handcrafted designer cakes with intricate sugar work and premium ingredients for special celebrations.",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop&crop=center",
    tags: ["Designer Cakes", "Sugar Art", "Premium Ingredients"],
    featured: false,
    liked: false,
  },
  {
    id: 15,
    name: "Henna Heritage Artists",
    category: "Mehendi",
    location: "Delhi",
    price: 15000,
    rating: 4.6,
    reviewCount: 123,
    description: "Master mehendi artists creating intricate traditional and contemporary designs for brides and guests.",
    image: "https://th.bing.com/th/id/OIP.SoNnVuu2XNwSzrwPYiXbPwHaDy?w=326&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    tags: ["Master Artists", "Traditional Designs", "Contemporary Patterns"],
    featured: false,
    liked: false,
  },
  {
    id: 16,
    name: "Radiance Beauty Lounge",
    category: "Makeup",
    location: "Mumbai",
    price: 25000,
    rating: 4.7,
    reviewCount: 189,
    description: "Celebrity makeup artist team providing glamorous makeovers with international cosmetic brands.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&crop=center",
    tags: ["Celebrity Artists", "International Brands", "Glamorous Makeovers"],
    featured: true,
    liked: false,
  },
  {
    id: 17,
    name: "Garden Paradise Venue",
    category: "Venue",
    location: "Jaipur",
    price: 65000,
    rating: 4.5,
    reviewCount: 98,
    description: "Beautiful outdoor garden venue with lush greenery and traditional Rajasthani architecture.",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&crop=center",
    tags: ["Garden Venue", "Outdoor Events", "Traditional Architecture"],
    featured: false,
    liked: false,
  },
  {
    id: 18,
    name: "Fusion Beats Entertainment",
    category: "DJ",
    location: "Hyderabad",
    price: 18000,
    rating: 4.6,
    reviewCount: 112,
    description: "Multi-genre DJ services blending traditional and modern music with spectacular light shows.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&crop=center",
    tags: ["Multi-genre", "Traditional & Modern", "Light Shows"],
    featured: false,
    liked: false,
  },
  {
    id: 19,
    name: "Royal Feast Catering",
    category: "Catering",
    location: "Chennai",
    price: 30000,
    rating: 4.4,
    reviewCount: 176,
    description: "Traditional South Indian cuisine with royal presentation and authentic flavors for grand celebrations.",
    image: "https://th.bing.com/th/id/OIP.oDYeyjOez7ucItGrDmsWhAHaHa?w=180&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    tags: ["South Indian", "Royal Presentation", "Authentic Flavors"],
    featured: false,
    liked: false,
  },
  {
    id: 20,
    name: "Dreamy Decor Studio",
    category: "Decoration",
    location: "Pune",
    price: 20000,
    rating: 4.5,
    reviewCount: 87,
    description: "Creative theme-based decorations with personalized touches and innovative design concepts.",
    image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop&crop=center",
    tags: ["Theme-based", "Personalized", "Innovative Design"],
    featured: false,
    liked: false,
  },
  {
    id: 21,
    name: "Spice Symphony Catering",
    category: "Catering",
    location: "Kolkata",
    price: 18000,
    rating: 4.6,
    reviewCount: 134,
    description: "Bengali and East Indian cuisine specialists with authentic flavors and traditional cooking methods.",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&crop=center",
    tags: ["Bengali Cuisine", "Traditional Cooking", "East Indian"],
    featured: false,
    liked: false,
  },
  {
    id: 22,
    name: "Vintage Lens Photography",
    category: "Photography",
    location: "Goa",
    price: 35000,
    rating: 4.9,
    reviewCount: 156,
    description: "Destination wedding photography with vintage aesthetics and artistic storytelling approach.",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop&crop=center",
    tags: ["Destination Weddings", "Vintage Style", "Artistic"],
    featured: true,
    liked: false,
  },
  {
    id: 23,
    name: "Bollywood Beats DJ",
    category: "DJ",
    location: "Mumbai",
    price: 20000,
    rating: 4.4,
    reviewCount: 98,
    description: "Bollywood music specialist with live mixing and crowd interaction for energetic celebrations.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center",
    tags: ["Bollywood", "Live Mixing", "Crowd Interaction"],
    featured: false,
    liked: false,
    details: {
      phone: "+91 98765 43223",
      email: "beats@bollywoodbeats.com",
      experience: "10+ years",
      capacity: "100-1000 guests",
      specialties: ["Bollywood Hits", "Punjabi Music", "Retro Classics"],
      availability: "Available"
    }
  },
  {
    id: 24,
    name: "Coastal Venue Resort",
    category: "Venue",
    location: "Goa",
    price: 95000,
    rating: 4.8,
    reviewCount: 89,
    description: "Beachfront resort venue with ocean views and tropical ambiance for destination weddings.",
    image: "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=800&h=600&fit=crop&crop=center",
    tags: ["Beachfront", "Ocean Views", "Destination Weddings"],
    featured: true,
    liked: false,
  },
  {
    id: 25,
    name: "Artisan Mehendi Collective",
    category: "Mehendi",
    location: "Udaipur",
    price: 12000,
    rating: 4.7,
    reviewCount: 76,
    description: "Rajasthani mehendi artists creating intricate royal patterns with natural henna.",
    image: "https://images.unsplash.com/photo-1607602132700-068c8de0c4e9?w=800&h=600&fit=crop&crop=center",
    tags: ["Rajasthani Patterns", "Royal Designs", "Natural Henna"],
    featured: false,
    liked: false,
    details: {
      phone: "+91 98765 43225",
      email: "art@mehendcollective.com",
      experience: "12+ years",
      capacity: "1-50 people",
      specialties: ["Bridal Mehendi", "Arabic Designs", "Traditional Rajasthani"],
      availability: "Available"
    }
  },
  {
    id: 26,
    name: "Gourmet Cake Studio",
    category: "Cake",
    location: "Pune",
    price: 15000,
    rating: 4.8,
    reviewCount: 112,
    description: "European-style cakes and pastries with premium ingredients and elegant designs.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop&crop=center",
    tags: ["European Style", "Premium Ingredients", "Elegant Designs"],
    featured: false,
    liked: false,
  },
  {
    id: 27,
    name: "Bridal Glow Makeup",
    category: "Makeup",
    location: "Delhi",
    price: 22000,
    rating: 4.6,
    reviewCount: 145,
    description: "Bridal makeup specialist with airbrush techniques and long-lasting formulations.",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop&crop=center",
    tags: ["Bridal Specialist", "Airbrush", "Long-lasting"],
    featured: false,
    liked: false,
  },
  {
    id: 28,
    name: "Heritage Palace Venue",
    category: "Venue",
    location: "Udaipur",
    price: 120000,
    rating: 4.9,
    reviewCount: 67,
    description: "Royal palace venue with traditional Rajasthani architecture and lakeside views.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
    tags: ["Royal Palace", "Traditional Architecture", "Lakeside Views"],
    featured: true,
    liked: false,
  },
  {
    id: 29,
    name: "Fusion Flavors Catering",
    category: "Catering",
    location: "Bangalore",
    price: 28000,
    rating: 4.5,
    reviewCount: 123,
    description: "Indo-Chinese and fusion cuisine with innovative presentations and live cooking stations.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&crop=center",
    tags: ["Indo-Chinese", "Fusion Cuisine", "Live Cooking"],
    featured: false,
    liked: false,
  },
  {
    id: 30,
    name: "Elegant Drapes Decor",
    category: "Decoration",
    location: "Kolkata",
    price: 25000,
    rating: 4.4,
    reviewCount: 91,
    description: "Luxury fabric draping and floral arrangements with Bengali cultural elements.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&crop=center",
    tags: ["Luxury Draping", "Floral Arrangements", "Bengali Culture"],
    featured: false,
    liked: false,
  }
]

export default function VendorMarketplace() {
  const [category, setCategory] = useState("all")
  const [location, setLocation] = useState("all")
  const [maxPrice, setMaxPrice] = useState(50000)
  const [minRating, setMinRating] = useState("any")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewType, setViewType] = useState<"grid" | "list">("grid")
  const [likedVendors, setLikedVendors] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedVendor, setSelectedVendor] = useState<any>(null)
  const [, setShowRegistrationForm] = useState(false)
  const [, setEditingVendor] = useState<any>(null)
  const [registeredVendors, setRegisteredVendors] = useState<any[]>([])
  const itemsPerPage = 6

  useEffect(() => {
    loadRegisteredVendors()
  }, [])

  const loadRegisteredVendors = () => {
    const stored = localStorage.getItem('registered_vendors')
    if (stored) {
      const vendors = JSON.parse(stored)
      setRegisteredVendors(vendors)
      const liked = vendors.filter((v: any) => v.liked).map((v: any) => v.id)
      setLikedVendors(liked)
    } else {
      // Initialize with some sample data
      setRegisteredVendors(vendorData)
      localStorage.setItem('registered_vendors', JSON.stringify(vendorData))
    }
  }

  // Handle image loading errors with SVG fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    target.src = "data:image/svg+xml;base64," + btoa(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle" dy=".3em">
          Image Not Available
        </text>
      </svg>
    `)
  }

  // Filter vendors based on all criteria
  const filteredVendors = registeredVendors.filter((vendor) => {
    const matchesSearch =
      searchQuery === "" ||
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
      matchesSearch &&
      (category === "all" || vendor.category === category) &&
      (location === "all" || vendor.location === location) &&
      vendor.price <= maxPrice &&
      (minRating === "any" || vendor.rating >= Number.parseFloat(minRating))
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage)
  const paginatedVendors = filteredVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const toggleLike = (id: number) => {
    const updatedVendors = registeredVendors.map(vendor => 
      vendor.id === id ? { ...vendor, liked: !vendor.liked } : vendor
    )
    setRegisteredVendors(updatedVendors)
    localStorage.setItem('registered_vendors', JSON.stringify(updatedVendors))
    
    const updatedLikes = updatedVendors.filter(v => v.liked).map(v => v.id)
    setLikedVendors(updatedLikes)
  }

  const deleteVendor = (id: number) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      const updatedVendors = registeredVendors.filter(vendor => vendor.id !== id)
      setRegisteredVendors(updatedVendors)
      localStorage.setItem('registered_vendors', JSON.stringify(updatedVendors))
    }
  }


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FaStar
        key={index}
        className={`h-3.5 w-3.5 ${index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full max-w-full mx-0">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-brand-gradient rounded-xl p-8 mb-6 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Vendor Marketplace</h1>
          <p className="text-white/90 max-w-xl">Discover and connect with top-rated vendors in our exclusive marketplace.</p>

          {/* Search Bar */}
          <div className="mt-6 max-w-lg">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search vendors, services, or specialties..."
                className="pl-10 pr-4 py-3 rounded-lg text-gray-900 border-0 shadow-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mt-20 -mr-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -mb-20 -ml-20"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <Card className="card-hover border-0 shadow-md overflow-hidden sticky top-4">
            <div className="bg-brand-gradient p-4 text-white">
              <h3 className="font-medium flex items-center">
                <Filter className="mr-2 h-5 w-5" /> Marketplace Filters
              </h3>
            </div>
            <CardContent className="p-5 space-y-5">
              <div>
                <label className="text-sm font-medium flex items-center mb-2">
                  <Tag className="h-4 w-4 mr-2 text-gray-500" /> Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Catering">Catering</SelectItem>
                    <SelectItem value="Decoration">Decoration</SelectItem>
                    <SelectItem value="DJ">DJ</SelectItem>
                    <SelectItem value="Photography">Photography</SelectItem>
                    <SelectItem value="Venue">Venue</SelectItem>
                    <SelectItem value="Cake">Cake</SelectItem>
                    <SelectItem value="Mehendi">Mehendi</SelectItem>
                    <SelectItem value="Makeup">Makeup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium flex items-center mb-2">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" /> Location
                </label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Jaipur">Jaipur</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                    <SelectItem value="Kolkata">Kolkata</SelectItem>
                    <SelectItem value="Goa">Goa</SelectItem>
                    <SelectItem value="Udaipur">Udaipur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium flex items-center mb-2">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-500" /> Price Range
                </label>
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>₹5,000</span>
                    <span>₹{formatPrice(maxPrice)}</span>
                    <span>₹100,000</span>
                  </div>
                  <Slider
                    min={5000}
                    max={100000}
                    step={1000}
                    value={[maxPrice]}
                    onValueChange={([value]) => setMaxPrice(value)}
                    className="py-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium flex items-center mb-2">
                  <Star className="h-4 w-4 mr-2 text-gray-500" /> Minimum Rating
                </label>
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Rating</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                    <SelectItem value="4.0">4.0+ stars</SelectItem>
                    <SelectItem value="3.5">3.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setCategory("all")
                    setLocation("all")
                    setMaxPrice(50000)
                    setMinRating("any")
                    setSearchQuery("")
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vendor Listings */}
        <div className="lg:col-span-3">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">
                {filteredVendors.length} {filteredVendors.length === 1 ? "Vendor" : "Vendors"} in Marketplace
              </h2>
              <p className="text-gray-500 text-sm">
                {category !== "all" ? `Category: ${category}` : "All categories"}
                {location !== "all" ? ` • Location: ${location}` : ""}
              </p>
            </div>

            <div className="flex items-center gap-2">

              <Button
                variant={viewType === "grid" ? "default" : "outline"}
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => setViewType("grid")}
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === "list" ? "default" : "outline"}
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => setViewType("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {filteredVendors.length > 0 ? (
            viewType === "grid" ? (
              // Grid View
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedVendors.map((vendor) => (
                    <Card
                      key={vendor.id}
                      className="card-hover border-0 shadow-md overflow-hidden h-full cursor-pointer"
                    >
                      <div className="relative">
                        <div className="aspect-[4/3] w-full overflow-hidden">
                          <img
                            src={vendor.image}
                            alt={vendor.name}
                            onError={handleImageError}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            loading="lazy"
                          />
                        </div>

                        {/* Like button & featured badge */}
                        <div className="absolute top-3 right-3">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
                            onClick={(e) => {
                              e.preventDefault()
                              toggleLike(vendor.id)
                            }}
                          >
                            {likedVendors.includes(vendor.id) ? (
                              <FaHeart className="h-4 w-4 text-red-500" />
                            ) : (
                              <FaRegHeart className="h-4 w-4 text-gray-700" />
                            )}
                          </Button>
                        </div>

                        {vendor.featured && (
                          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                            Featured
                          </Badge>
                        )}

                        {/* Price badge */}
                        <div className="absolute bottom-3 left-3">
                          <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 shadow-sm font-semibold px-3 py-1">
                            From ₹{formatPrice(vendor.price)}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{vendor.name}</h3>
                            <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                              <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                                {vendor.category}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <FaMapMarkerAlt className="h-3 w-3 text-gray-400" />
                                {vendor.location}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1">{renderStars(vendor.rating)}</div>
                            <span className="text-xs text-gray-500 mt-0.5">{vendor.reviewCount} reviews</span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mt-3 line-clamp-2">{vendor.description}</p>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {vendor.tags.map((tag: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-4 pt-3 border-t flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-button-gradient text-white"
                            onClick={() => setSelectedVendor(vendor)}
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="px-2"
                            onClick={() => {
                              setEditingVendor(vendor)
                              setShowRegistrationForm(true)
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="px-2 text-red-600 hover:text-red-700"
                            onClick={() => deleteVendor(vendor.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              // List View
              <>
                <div className="space-y-4">
                  {paginatedVendors.map((vendor) => (
                    <Card key={vendor.id} className="card-hover border-0 shadow-md overflow-hidden cursor-pointer">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative md:w-1/3">
                          <div className="md:h-full aspect-video md:aspect-auto">
                            <img
                              src={vendor.image}
                              alt={vendor.name}
                              onError={handleImageError}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>

                          {/* Like button & Featured badge */}
                          <div className="absolute top-3 right-3">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
                              onClick={(e) => {
                                e.preventDefault()
                                toggleLike(vendor.id)
                              }}
                            >
                              {likedVendors.includes(vendor.id) ? (
                                <FaHeart className="h-4 w-4 text-red-500" />
                              ) : (
                                <FaRegHeart className="h-4 w-4 text-gray-700" />
                              )}
                            </Button>
                          </div>

                          {vendor.featured && (
                            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                              Featured
                            </Badge>
                          )}

                          {/* Price badge */}
                          <div className="absolute bottom-3 left-3">
                            <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 shadow-sm font-semibold px-3 py-1">
                              From ₹{formatPrice(vendor.price)}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-5 md:w-2/3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{vendor.name}</h3>
                              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                                  {vendor.category}
                                </Badge>
                                <span className="flex items-center gap-1">
                                  <FaMapMarkerAlt className="h-3 w-3 text-gray-400" />
                                  {vendor.location}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-1">{renderStars(vendor.rating)}</div>
                              <span className="text-xs text-gray-500 mt-0.5">{vendor.reviewCount} reviews</span>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mt-3">{vendor.description}</p>

                          <div className="flex items-center justify-between mt-5">
                            <div className="flex flex-wrap gap-1.5">
                              {vendor.tags.map((tag: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <Button
                              size="sm"
                              className="bg-button-gradient text-white"
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )
          ) : (
            <Card className="border-0 shadow-md p-6 text-center">
              <div className="py-10">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold">No vendors found</h3>
                <p className="text-gray-500 mt-2">
                  No vendors match your current filters. Try adjusting your search criteria.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => {
                    setCategory("all")
                    setLocation("all")
                    setMaxPrice(50000)
                    setMinRating("any")
                    setSearchQuery("")
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Vendor Details Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedVendor.image}
                alt={selectedVendor.name}
                className="w-full h-48 object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => setSelectedVendor(null)}
              >
                ×
              </Button>
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedVendor.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-purple-100 text-purple-800">{selectedVendor.category}</Badge>
                    <span className="text-gray-600">{selectedVendor.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">{renderStars(selectedVendor.rating)}</div>
                  <span className="text-sm text-gray-500">{selectedVendor.reviewCount} reviews</span>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{selectedVendor.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold mb-2">Contact Info</h3>
                  <p className="text-sm text-gray-600">📞 {selectedVendor.details?.phone || '+91 98765 43210'}</p>
                  <p className="text-sm text-gray-600">✉️ {selectedVendor.details?.email || 'contact@vendor.com'}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Service Details</h3>
                  <p className="text-sm text-gray-600">🎯 Experience: {selectedVendor.details?.experience || '5+ years'}</p>
                  <p className="text-sm text-gray-600">👥 Capacity: {selectedVendor.details?.capacity || '50-200 guests'}</p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {(selectedVendor.details?.specialties || selectedVendor.tags).map((specialty: string, idx: number) => (
                    <Badge key={idx} variant="outline">{specialty}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <span className="text-2xl font-bold text-green-600">₹{formatPrice(selectedVendor.price)}</span>
                  <span className="text-gray-500 ml-1">starting from</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Contact Vendor</Button>
                  <Button className="bg-button-gradient text-white">Book Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}