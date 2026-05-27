import { useState } from "react"
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Ticket,
  Lock,
  Unlock,
  Star,
  Heart,
  Share2,
  MoreHorizontal,
  CheckCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OngoingEvents() {
  const [activeTab, setActiveTab] = useState("nearby")
  const [userLocation] = useState("Bangalore, India")
  const [searchQuery, setSearchQuery] = useState("")
  const [radius, setRadius] = useState("10")
  const [eventType, setEventType] = useState("all")
  const [showAccessible, setShowAccessible] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Sample data for ongoing events
  const events = [
    {
      id: 1,
      title: "Tech Startup Meetup",
      description: "Network with tech entrepreneurs and investors in your area",
      date: "May 23, 2025",
      time: "6:00 PM - 9:00 PM",
      location: "Innovation Hub, Kormangala",
      distance: "1.2 km",
      image:
        "https://images.unsplash.com/photo-1540304453527-62f979142a17?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      organizer: {
        name: "Bangalore Tech Network",
        image: "https://ui-avatars.com/api/?name=Bangalore+Tech&background=4f46e5&color=fff",
      },
      attendees: 42,
      maxAttendees: 50,
      tags: ["Technology", "Networking", "Startups"],
      isPublic: true,
      isFeatured: true,
      rating: 4.8,
      reviewCount: 15,
      bookingFee: "Free",
      accessible: true,
    },
    {
      id: 2,
      title: "Yoga in the Park",
      description: "Join us for a rejuvenating morning yoga session amidst nature",
      date: "May 24, 2025",
      time: "7:00 AM - 8:30 AM",
      location: "Cubbon Park, MG Road",
      distance: "3.5 km",
      image:
        "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      organizer: {
        name: "Urban Yogis",
        image: "https://ui-avatars.com/api/?name=Urban+Yogis&background=059669&color=fff",
      },
      attendees: 18,
      maxAttendees: 30,
      tags: ["Fitness", "Yoga", "Outdoors"],
      isPublic: true,
      isFeatured: false,
      rating: 4.6,
      reviewCount: 8,
      bookingFee: "₹200",
      accessible: true,
    },
    {
      id: 3,
      title: "Corporate Leadership Summit",
      description: "Exclusive leadership training for senior executives",
      date: "May 25, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Grand Meridian Hotel, Whitefield",
      distance: "7.8 km",
      image: "https://images.unsplash.com/photo-1558403194-611308249627?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      organizer: {
        name: "Executive Institute",
        image: "https://ui-avatars.com/api/?name=Executive+Institute&background=1e40af&color=fff",
      },
      attendees: 35,
      maxAttendees: 40,
      tags: ["Business", "Leadership", "Corporate"],
      isPublic: false,
      isFeatured: true,
      rating: 4.9,
      reviewCount: 22,
      bookingFee: "By invitation",
      accessible: true,
    },
    {
      id: 4,
      title: "Live Music at Brewsky",
      description: "Local bands performing live with great food and drinks",
      date: "May 22, 2025",
      time: "8:00 PM - 11:30 PM",
      location: "Brewsky, JP Nagar",
      distance: "4.3 km",
      image:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      organizer: {
        name: "Brewsky",
        image: "https://ui-avatars.com/api/?name=Brewsky&background=b91c1c&color=fff",
      },
      attendees: 85,
      maxAttendees: 100,
      tags: ["Music", "Nightlife", "Food & Drinks"],
      isPublic: true,
      isFeatured: false,
      rating: 4.5,
      reviewCount: 12,
      bookingFee: "₹500",
      accessible: false,
    },
    {
      id: 5,
      title: "Blockchain Developer Workshop",
      description: "Hands-on workshop on building decentralized applications",
      date: "May 26, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "CoWorks, Indiranagar",
      distance: "2.8 km",
      image:
        "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      organizer: {
        name: "Crypto Devs India",
        image: "https://ui-avatars.com/api/?name=Crypto+Devs&background=f59e0b&color=fff",
      },
      attendees: 22,
      maxAttendees: 30,
      tags: ["Technology", "Blockchain", "Development"],
      isPublic: true,
      isFeatured: false,
      rating: 4.7,
      reviewCount: 6,
      bookingFee: "₹1,500",
      accessible: true,
    },
    {
      id: 6,
      title: "Art Exhibition: Urban Perspectives",
      description: "Contemporary art showcase featuring local artists",
      date: "May 24-26, 2025",
      time: "11:00 AM - 7:00 PM",
      location: "Gallery 1, MG Road",
      distance: "3.1 km",
      image:
        "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      organizer: {
        name: "Bangalore Art Collective",
        image: "https://ui-avatars.com/api/?name=Art+Collective&background=ec4899&color=fff",
      },
      attendees: 110,
      maxAttendees: 200,
      tags: ["Art", "Culture", "Exhibition"],
      isPublic: true,
      isFeatured: true,
      rating: 4.8,
      reviewCount: 32,
      bookingFee: "₹300",
      accessible: true,
    },
  ]

  // Filter events based on search and filters
  const filteredEvents = events.filter((event) => {
    // Text search
    if (
      searchQuery &&
      !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !event.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !event.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Event type filter
    if (eventType !== "all") {
      if (eventType === "public" && !event.isPublic) return false
      if (eventType === "private" && event.isPublic) return false
    }

    // Accessibility filter
    if (showAccessible && !event.accessible) return false

    return true
  })

  // Sort by distance
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
  })

  // Pagination
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage)
  const paginatedEvents = sortedEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleEventBooking = (event: any) => {
    setSelectedEvent(event)
    setIsBookingDialogOpen(true)
  }

  const closeBookingDialog = () => {
    setIsBookingDialogOpen(false)
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full max-w-full mx-0">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 mb-6 text-white">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Calendar className="h-8 w-8" />
                Ongoing Events
              </h1>
              <p className="text-white/90 max-w-xl">
                Discover exciting events happening around you. Join community gatherings, workshops, concerts and more.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <MapPin className="h-5 w-5 text-white/80" />
              <div>
                <div className="text-sm font-semibold">{userLocation}</div>
                <div className="text-xs text-white/70">Your current location</div>
              </div>
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                Change
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mt-20 -mr-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -mb-20 -ml-20"></div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg border shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events, venues, or keywords..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 md:gap-4">
            <Select value={radius} onValueChange={setRadius}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
                <SelectItem value="20">20 km</SelectItem>
                <SelectItem value="50">50 km</SelectItem>
              </SelectContent>
            </Select>

            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="public">Public Events</SelectItem>
                <SelectItem value="private">Private Events</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Switch id="accessible" checked={showAccessible} onCheckedChange={setShowAccessible} />
              <Label htmlFor="accessible" className="text-sm">
                Accessible
              </Label>
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="nearby" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="upcoming">This Weekend</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Events Display */}
      {sortedEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No events found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            We couldn't find any events matching your criteria. Try adjusting your filters or search query.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow group border-0 shadow">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <Badge
                      className={`${event.isPublic ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"} font-medium`}
                    >
                      {event.isPublic ? <Unlock className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                      {event.isPublic ? "Public Event" : "Private Event"}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2 mt-1">{event.description}</CardDescription>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium">{event.date}</div>
                        <div className="text-xs text-gray-500">{event.time}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium">{event.location}</div>
                        <div className="text-xs text-gray-500">{event.distance} away</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <div className="text-sm text-gray-700">
                        {event.attendees}/{event.maxAttendees} attending
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="border-t pt-4 flex justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7 border border-gray-200">
                      <AvatarImage src={event.organizer.image || "/placeholder.svg"} />
                      <AvatarFallback>{event.organizer.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="text-xs">
                      <div className="font-medium">{event.organizer.name}</div>
                      <div className="flex items-center text-amber-500 mt-0.5">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < Math.floor(event.rating) ? "fill-current" : "fill-none"}`}
                            />
                          ))}
                        <span className="text-gray-600 ml-1">{event.rating}</span>
                      </div>
                    </div>
                  </div>

                  {event.isPublic ? (
                    <Button
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0"
                      onClick={() => handleEventBooking(event)}
                    >
                      Book Now
                    </Button>
                  ) : (
                    <Button variant="outline" disabled>
                      Private Event
                    </Button>
                  )}
                </CardFooter>
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
        <>
          <div className="space-y-4">
            {paginatedEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden border-0 shadow hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-4 h-full">
                  <div className="relative h-48 md:h-auto">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {event.isFeatured && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-white px-2">
                          <Star className="mr-1 h-3 w-3" /> Featured
                        </Badge>
                      </div>
                    )}
                    <Badge
                      className={`absolute bottom-3 left-3 ${event.isPublic ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"} font-medium`}
                    >
                      {event.isPublic ? <Unlock className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                      {event.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>

                  <div className="col-span-3 p-5 flex flex-col h-full">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-bold text-xl">{event.title}</h3>
                          <p className="text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                        </div>
                        <div className="hidden md:flex items-start gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Add to Calendar</DropdownMenuItem>
                              <DropdownMenuItem>View Similar Events</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Report Event</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mt-4">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium">{event.date}</div>
                            <div className="text-xs text-gray-500">{event.time}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium">{event.location}</div>
                            <div className="text-xs text-gray-500">{event.distance} away</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-4">
                        {event.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-gray-200">
                          <AvatarImage src={event.organizer.image || "/placeholder.svg"} />
                          <AvatarFallback>{event.organizer.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{event.organizer.name}</div>
                          <div className="flex items-center text-amber-500">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < Math.floor(event.rating) ? "fill-current" : "fill-none"}`}
                                />
                              ))}
                            <span className="text-xs text-gray-600 ml-1">
                              {event.rating} ({event.reviewCount} reviews)
                            </span>
                          </div>
                        </div>

                        <Separator orientation="vertical" className="h-8" />

                        <div className="text-sm">
                          <span className="text-gray-500">Price:</span>{" "}
                          <span className="font-medium">{event.bookingFee}</span>
                        </div>
                      </div>

                      {event.isPublic ? (
                        <Button
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0"
                          onClick={() => handleEventBooking(event)}
                        >
                          <Ticket className="mr-2 h-4 w-4" /> Book
                        </Button>
                      ) : (
                        <Button variant="outline" disabled>
                          <Lock className="mr-2 h-4 w-4" /> Private Event
                        </Button>
                      )}
                    </div>
                  </div>
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
      )}

      {/* Event Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>Book Event Ticket</DialogTitle>
                <DialogDescription>Complete your booking for {selectedEvent.title}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex gap-4 items-start">
                  <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={selectedEvent.image || "/placeholder.svg"}
                      alt={selectedEvent.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedEvent.title}</h3>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      {selectedEvent.date} • {selectedEvent.time}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      {selectedEvent.location}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Ticket Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ticketCount">Number of Tickets</Label>
                      <Select defaultValue="1">
                        <SelectTrigger id="ticketCount">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Ticket</SelectItem>
                          <SelectItem value="2">2 Tickets</SelectItem>
                          <SelectItem value="3">3 Tickets</SelectItem>
                          <SelectItem value="4">4 Tickets</SelectItem>
                          <SelectItem value="5">5 Tickets</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="ticketType">Ticket Type</Label>
                      <Select defaultValue="regular">
                        <SelectTrigger id="ticketType">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                          <SelectItem value="group">Group</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Ticket Price</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>Ticket Price</span>
                      <span>{selectedEvent.bookingFee === "Free" ? "Free" : selectedEvent.bookingFee}</span>
                    </div>
                    {selectedEvent.bookingFee !== "Free" && (
                      <>
                        <div className="flex justify-between mt-2">
                          <span>Service Fee</span>
                          <span>₹50</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>₹{Number.parseInt(selectedEvent.bookingFee.replace(/[^\d]/g, "")) + 50}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeBookingDialog}>
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Booking
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}