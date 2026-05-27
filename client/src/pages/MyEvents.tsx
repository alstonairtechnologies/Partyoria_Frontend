import { useState, useEffect } from "react"
import { FaEye, FaEdit, FaTimes, FaPlus, FaTag, FaCheckCircle, FaClock, FaSearch } from "react-icons/fa"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CalendarIcon, MapPin, Plus, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

export default function MyEvents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const itemsPerPage = 6

  const defaultEvents: any[] = []

  // Load user-specific events from localStorage
  const loadEvents = () => {
    setIsLoading(true)
    try {
      const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
      const user = userStr ? JSON.parse(userStr) : null
      const userId = user?.id || user?.email || user?.username
      
      if (userId) {
        const userEventsKey = `userEvents_${userId}`
        const userEvents = JSON.parse(localStorage.getItem(userEventsKey) || '[]')
        setEvents(userEvents.length > 0 ? userEvents : defaultEvents)
      } else {
        setEvents(defaultEvents)
      }
    } catch (error) {
      console.error('Error loading events:', error)
      setEvents(defaultEvents)
    } finally {
      setIsLoading(false)
    }
  }

  // Save user-specific events to localStorage
  const saveEvents = (updatedEvents: any[]) => {
    try {
      const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
      const user = userStr ? JSON.parse(userStr) : null
      const userId = user?.id || user?.email || user?.username
      
      if (userId) {
        const userEventsKey = `userEvents_${userId}`
        localStorage.setItem(userEventsKey, JSON.stringify(updatedEvents))
        setEvents(updatedEvents)
        // Trigger dashboard refresh
        window.dispatchEvent(new CustomEvent('dataUpdated'))
      }
    } catch (error) {
      console.error('Error saving events:', error)
    }
  }

  // Delete event
  const deleteEvent = (eventId: number) => {
    const updatedEvents = events.filter(event => event.id !== eventId)
    saveEvents(updatedEvents)
    setIsDeleteDialogOpen(false)
    setSelectedEvent(null)
  }

  // Update event status
  const updateEventStatus = (eventId: number, newStatus: string) => {
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, status: newStatus } : event
    )
    saveEvents(updatedEvents)
  }

  // Duplicate event
  const duplicateEvent = (eventToDuplicate: any) => {
    const newEvent = {
      ...eventToDuplicate,
      id: Date.now(),
      name: `${eventToDuplicate.name} (Copy)`,
      status: 'Planning',
      progress: 0
    }
    const updatedEvents = [...events, newEvent]
    saveEvents(updatedEvents)
  }

  useEffect(() => {
    loadEvents()
  }, [])

  // Filter and sort events
  const filteredEvents = events
    .filter((event) => {
      // Filter by search term
      if (
        searchTerm &&
        !event.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !event.location.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // Filter by status
      if (statusFilter !== "all" && event.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false
      }

      // Filter by type
      if (typeFilter !== "all" && event.type !== typeFilter) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Convert dates to timestamps for comparison
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()

      if (sortOrder === "newest") {
        return dateA - dateB // Ascending (future dates first)
      } else {
        return dateB - dateA // Descending (past dates first)
      }
    })

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Get status style
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return { bg: "bg-emerald-100", text: "text-emerald-800", icon: <FaClock className="h-3 w-3" /> }
      case "planning":
        return { bg: "bg-blue-100", text: "text-blue-800", icon: <FaEdit className="h-3 w-3" /> }
      case "completed":
        return { bg: "bg-gray-100", text: "text-gray-800", icon: <FaCheckCircle className="h-3 w-3" /> }
      case "cancelled":
        return { bg: "bg-red-100", text: "text-red-800", icon: <FaTimes className="h-3 w-3" /> }
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", icon: null }
    }
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full max-w-full mx-0">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-brand-gradient rounded-xl p-8 mb-6 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">My Events</h1>
          <p className="text-white/90 max-w-xl">
            Manage your events, track progress, and coordinate with vendors all in one place.
          </p>

          <div className="mt-6 flex gap-3">
            <Button 
              className="bg-white text-brand-purple border border-brand-purple"
              onClick={() => {
                const event = new CustomEvent('navigate', { detail: 'create-event' });
                window.dispatchEvent(event);
              }}
            >
              <Plus className="mr-2 h-4 w-4 text-brand-purple" /> Create New Event
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mt-20 -mr-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -mb-20 -ml-20"></div>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search events..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Wedding">Wedding</SelectItem>
            <SelectItem value="Birthday Party">Birthday Party</SelectItem>
            <SelectItem value="Corporate Event">Corporate Event</SelectItem>
            <SelectItem value="Engagement">Engagement</SelectItem>
            <SelectItem value="Anniversary">Anniversary</SelectItem>
            <SelectItem value="Baby Shower">Baby Shower</SelectItem>
            <SelectItem value="Graduation">Graduation</SelectItem>
            <SelectItem value="Holiday Party">Holiday Party</SelectItem>
            <SelectItem value="Conference">Conference</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Upcoming First</SelectItem>
            <SelectItem value="oldest">Past First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!isLoading && paginatedEvents.length > 0 ? (
          paginatedEvents.map((event) => {
            const statusStyle = getStatusStyle(event.status)

            return (
              <Card key={event.id} className="card-hover border-0 shadow-md overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-gray-900">{event.name}</h3>
                    <Badge className={`${statusStyle.bg} ${statusStyle.text} flex items-center gap-1.5`}>
                      {statusStyle.icon}
                      {event.status}
                    </Badge>
                  </div>

                  {event.status === "Upcoming" && (
                    <div className="mt-2">
                      <Badge className="bg-emerald-100 text-emerald-800 font-medium px-3 py-1">
                        {event.daysLeft} days left
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-5 flex-1 flex flex-col">

                  <div className="mt-3 space-y-1.5 flex-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2 text-[#FF5A5F]" />
                      {event.date ? new Date(event.date).toLocaleDateString() : 'No date'} at {event.time || 'No time'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-[#673AB7]" />
                      {event.location || `${event.city || ''}, ${event.state || ''}`.trim().replace(/^,|,$/, '') || 'No location'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaTag className="h-4 w-4 mr-2 text-[#FFD700]" />
                      {event.type} • {event.guestCount || event.guests || 0} Guests
                    </div>

                    {event.status !== "Cancelled" && event.status !== "Completed" && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium">Planning Progress</span>
                          <span>{event.progress}%</span>
                        </div>
                        <Progress value={event.progress} className="h-1.5" />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{event.vendorCount || event.vendors?.length || 0}</span> vendors
                    </div>
                    <div className="text-sm text-gray-600">
                      Budget: <span className="font-medium">₹{parseInt(event.budget || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Button 
                      variant="default" 
                      className="w-full bg-button-gradient text-white"
                      onClick={() => {
                        setSelectedEvent(event)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <FaEye className="mr-2 h-4 w-4" /> View Details
                    </Button>

                    <div className="flex gap-2">
                      {event.status !== "Completed" && event.status !== "Cancelled" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            const event = new CustomEvent('navigate', { detail: 'create-event' });
                            window.dispatchEvent(event);
                          }}
                        >
                          <FaEdit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => duplicateEvent(event)}
                      >
                        <FaPlus className="mr-2 h-4 w-4" /> Duplicate
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setSelectedEvent(event)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <FaTimes className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : isLoading ? (
          <div className="col-span-full text-center py-12">
            <div className="mx-auto bg-[#FF5A5F]/10 rounded-full p-6 w-16 h-16 flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5A5F]"></div>
            </div>
            <h3 className="text-lg font-semibold">Loading events...</h3>
            <p className="text-gray-500 mt-2">Please wait while we fetch your events.</p>
          </div>
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="mx-auto bg-gray-100 rounded-full p-6 w-16 h-16 flex items-center justify-center mb-4">
              <FaSearch className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold">No events found</h3>
            <p className="text-gray-500 mt-2 mb-6">Try adjusting your search filters or create a new event.</p>
            <Button onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'create-event' });
              window.dispatchEvent(event);
            }}>
              <FaPlus className="mr-2 h-4 w-4" /> Create New Event
            </Button>
          </div>
        )}
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

      {/* Event Details Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {selectedEvent.name}
                </DialogTitle>
                <DialogDescription>
                  Event details and management options
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Event Type</Label>
                      <p className="text-base font-medium">{selectedEvent.type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Date & Time</Label>
                      <p className="text-base">{selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString() : 'No date'} at {selectedEvent.time || 'No time'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Location</Label>
                      <p className="text-base">{selectedEvent.location || `${selectedEvent.city || ''}, ${selectedEvent.state || ''}`.trim().replace(/^,|,$/, '') || 'No location'}</p>
                    </div>
                    {selectedEvent.address && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Full Address</Label>
                        <p className="text-base">{selectedEvent.address}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Guest Count</Label>
                      <p className="text-base font-medium">{selectedEvent.guestCount || selectedEvent.guests || 0} people</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Budget</Label>
                      <p className="text-base font-medium text-green-600">₹{parseInt(selectedEvent.budget || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      <Select 
                        value={selectedEvent.status.toLowerCase()} 
                        onValueChange={(value) => {
                          const capitalizedStatus = value.charAt(0).toUpperCase() + value.slice(1)
                          updateEventStatus(selectedEvent.id, capitalizedStatus)
                          setSelectedEvent({...selectedEvent, status: capitalizedStatus})
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Created</Label>
                      <p className="text-base">{selectedEvent.createdAt ? new Date(selectedEvent.createdAt).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                  </div>
                </div>
                
                {selectedEvent.description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                    <p className="text-base mt-1 p-3 bg-gray-50 rounded-lg">{selectedEvent.description}</p>
                  </div>
                )}
                
                {selectedEvent.requirements && selectedEvent.requirements.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Special Requirements</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedEvent.requirements.map((req: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">{req}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedEvent.vendors && selectedEvent.vendors.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Selected Vendors</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedEvent.vendors.map((vendor: string, index: number) => (
                        <Badge key={index} className="bg-purple-100 text-purple-700">{vendor}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedEvent.status !== "Cancelled" && selectedEvent.status !== "Completed" && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Planning Progress</Label>
                    <div className="mt-2">
                      <Progress value={selectedEvent.progress || 0} className="h-3" />
                      <p className="text-sm text-gray-600 mt-2 font-medium">{selectedEvent.progress || 0}% complete</p>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-button-gradient text-white"
                    onClick={() => {
                      const event = new CustomEvent('navigate', { detail: 'create-event' });
                      window.dispatchEvent(event);
                    }}
                  >
                    <FaEdit className="mr-2 h-4 w-4" /> Edit Event
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => duplicateEvent(selectedEvent)}
                  >
                    <FaPlus className="mr-2 h-4 w-4" /> Duplicate
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      setIsEditDialogOpen(false)
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    <FaTimes className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <FaTimes className="h-5 w-5" />
              Delete Event
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedEvent?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedEvent && deleteEvent(selectedEvent.id)}
            >
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}