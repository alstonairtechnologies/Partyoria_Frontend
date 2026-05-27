import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  X,
  CheckCircle,
  AlertCircle,

} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function CreateEvent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [eventData, setEventData] = useState({
    name: "",
    type: "",
    date: undefined as Date | undefined,
    time: "",
    location: "",
    state: "",
    city: "",
    address: "",
    guestCount: "",
    budget: "",
    description: "",
    requirements: [] as string[],
    vendors: [] as string[],
    theme: "",
    colorScheme: [] as string[],
    decorStyle: [] as string[],
    decorBudget: "",

  })
  const [newRequirement, setNewRequirement] = useState("")
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  const themes = [
    "Classic Elegance", "Modern Minimalist", "Rustic Charm", "Vintage Romance",
    "Bohemian Chic", "Garden Party", "Royal Luxury", "Beach Vibes"
  ]

  const colorPalettes = [
    "Blush & Gold", "Navy & Silver", "Burgundy & Cream", "Sage & Ivory",
    "Coral & Peach", "Lavender & Gray", "Emerald & Gold", "Rose Gold & White"
  ]

  const decorStyles = [
    "Floral Arrangements", "Balloon Decorations", "Fabric Draping", "Lighting Design",
    "Centerpieces", "Backdrop Design", "Table Settings", "Entrance Decor"
  ]

  const eventTypes = [
    "Wedding",
    "Birthday Party",
    "Corporate Event",
    "Engagement",
    "Anniversary",
    "Baby Shower",
    "Graduation",
    "Holiday Party",
    "Conference",
    "Other"
  ]

  const vendorCategories = [
    "Catering",
    "Decoration",
    "Photography",
    "DJ/Music",
    "Venue",
    "Cake",
    "Mehendi",
    "Makeup",
    "Transportation",
    "Security"
  ]

  const citiesByState: { [key: string]: string[] } = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar", "Nalgonda"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda", "Bardhaman", "Kharagpur"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Firozpur", "Batala"],
    "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal"],
    "Delhi": ["New Delhi", "Central Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "North East Delhi", "North West Delhi", "South East Delhi", "South West Delhi", "Shahdara"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Malappuram"],
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kadapa"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore", "Baripada"],
    "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", "Hazaribagh", "Giridih"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Korba", "Bilaspur", "Durg", "Rajnandgaon", "Jagdalpur", "Raigarh"],
    "Goa": ["Panaji", "Vasco da Gama", "Margao", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Sanquelim"]
  }

  const indianStates = Object.keys(citiesByState)

  const steps = [
    { id: 1, title: "Basic Details", description: "Event name, type, and date" },
    { id: 2, title: "Location & Guests", description: "Venue and guest information" },
    { id: 3, title: "Budget & Requirements", description: "Budget and special requirements" },
    { id: 4, title: "Theme & Décor", description: "Select theme and decoration style" },
    { id: 5, title: "Vendors & Services", description: "Select required vendors" },
    { id: 6, title: "Review & Create", description: "Review and finalize event" }
  ]

  const getStepProgress = () => {
    return (currentStep / steps.length) * 100
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setEventData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }))
      setNewRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    setEventData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  const toggleVendor = (vendor: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendor) 
        ? prev.filter(v => v !== vendor)
        : [...prev, vendor]
    )
  }



  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return eventData.type && eventData.date && eventData.time
      case 2:
        return eventData.state && eventData.city && eventData.guestCount
      case 3:
        return eventData.budget
      case 4:
        return eventData.theme && selectedColors.length > 0
      case 5:
        return selectedVendors.length > 0
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const createDefaultMilestones = (eventId: number, eventType: string, _eventDate: Date, userId: string) => {
    const today = new Date()
    const milestones = []
    
    // Common milestones for all events (due dates from today)
    milestones.push(
      {
        id: Date.now() + 1,
        eventId: eventId.toString(),
        title: "Book Venue",
        description: "Secure and confirm venue booking",
        dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: "high",
        status: "pending",
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + 2,
        eventId: eventId.toString(),
        title: "Initial Planning Review",
        description: "Review and confirm initial event planning details",
        dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: "medium",
        status: "pending",
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + 3,
        eventId: eventId.toString(),
        title: "Finalize Guest List",
        description: "Confirm final number of attendees",
        dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: "high",
        status: "pending",
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + 4,
        eventId: eventId.toString(),
        title: "Send Invitations",
        description: "Send out invitations to guests",
        dueDate: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: "medium",
        status: "pending",
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + 5,
        eventId: eventId.toString(),
        title: "Final Preparations",
        description: "Last-minute preparations and confirmations",
        dueDate: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: "high",
        status: "pending",
        createdAt: new Date().toISOString()
      }
    )

    // Event-specific milestones
    if (eventType.toLowerCase() === 'wedding') {
      milestones.push(
        {
          id: Date.now() + 6,
          eventId: eventId.toString(),
          title: "Book Photographer",
          description: "Hire wedding photographer",
          dueDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: "high",
          status: "pending",
          createdAt: new Date().toISOString()
        },
        {
          id: Date.now() + 7,
          eventId: eventId.toString(),
          title: "Order Wedding Cake",
          description: "Finalize and order wedding cake",
          dueDate: new Date(today.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: "medium",
          status: "pending",
          createdAt: new Date().toISOString()
        }
      )
    }

    // Save milestones for this user
    const userMilestonesKey = `eventMilestones_${userId}`
    const existingMilestones = JSON.parse(localStorage.getItem(userMilestonesKey) || '[]')
    const updatedMilestones = [...existingMilestones, ...milestones]
    localStorage.setItem(userMilestonesKey, JSON.stringify(updatedMilestones))
  }

  const handleSubmit = () => {
    // Get current user ID
    const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
    const user = userStr ? JSON.parse(userStr) : null
    const userId = user?.id || user?.email || user?.username
    
    const eventId = Date.now()
    const finalEventData = {
      id: eventId,
      userId: userId,
      name: eventData.name || eventData.type,
      type: eventData.type,
      date: eventData.date ? eventData.date.toISOString() : new Date().toISOString(),
      time: eventData.time,
      location: `${eventData.city}, ${eventData.state}`,
      city: eventData.city,
      state: eventData.state,
      address: eventData.address,
      guestCount: eventData.guestCount,
      guests: eventData.guestCount,
      budget: eventData.budget,
      description: eventData.description,
      requirements: eventData.requirements,
      vendors: selectedVendors,
      theme: eventData.theme,
      colorScheme: selectedColors,
      decorStyle: eventData.decorStyle,
      decorBudget: eventData.decorBudget,
      vendorCount: selectedVendors.length,
      status: "Planning",
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Save event to user-specific storage
    const userEventsKey = `userEvents_${userId}`
    const existingEvents = JSON.parse(localStorage.getItem(userEventsKey) || '[]')
    existingEvents.push(finalEventData)
    localStorage.setItem(userEventsKey, JSON.stringify(existingEvents))

    // Create default milestones for this user
    if (eventData.date && userId) {
      createDefaultMilestones(eventId, eventData.type, eventData.date, userId)
    }

    alert("Event created successfully with default milestones!")
    
    // Trigger data update event
    window.dispatchEvent(new CustomEvent('dataUpdated'));
    
    // Navigate to my events
    const event = new CustomEvent('navigate', { detail: 'my-events' });
    window.dispatchEvent(event);
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="eventType">Event Type *</Label>
              <Select value={eventData.type} onValueChange={(value) => setEventData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={eventData.date ? eventData.date.toISOString().split('T')[0] : ''}
                  onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value ? new Date(e.target.value) : undefined }))}
                />
              </div>

              <div>
                <Label htmlFor="eventTime">Event Time *</Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={eventData.time}
                  onChange={(e) => setEventData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Event Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your event..."
                value={eventData.description}
                onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>


          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">State *</Label>
                <Select value={eventData.state} onValueChange={(value) => setEventData(prev => ({ ...prev, state: value, city: "" }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Select value={eventData.city} onValueChange={(value) => setEventData(prev => ({ ...prev, city: value }))} disabled={!eventData.state}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventData.state && citiesByState[eventData.state]?.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Full Address</Label>
              <Textarea
                id="address"
                placeholder="Enter complete address"
                value={eventData.address}
                onChange={(e) => setEventData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="guestCount">Expected Guest Count *</Label>
              <Input
                id="guestCount"
                type="number"
                min="1"
                max="10000"
                placeholder="Number of guests"
                value={eventData.guestCount}
                onChange={(e) => {
                  const value = Math.max(1, parseInt(e.target.value) || 1);
                  setEventData(prev => ({ ...prev, guestCount: value.toString() }));
                }}
                onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="budget">Total Budget *</Label>
              <Input
                type="number"
                min="1"
                step="1"
                placeholder="Enter your budget in ₹ (e.g., 50000, 100000)"
                value={eventData.budget}
                onChange={(e) => {
                  const value = Math.max(1, parseInt(e.target.value) || 1);
                  setEventData(prev => ({ ...prev, budget: value.toString() }));
                }}
                onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
              />
            </div>

            <div>
              <Label>Special Requirements</Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a requirement"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                  />
                  <Button type="button" onClick={addRequirement} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {eventData.requirements.map((req, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {req}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeRequirement(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Event Theme *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {themes.map(theme => (
                  <div
                    key={theme}
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer text-center transition-colors",
                      eventData.theme === theme
                        ? "border-brand-purple bg-purple-50 text-brand-purple"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setEventData(prev => ({ ...prev, theme }))}
                  >
                    <span className="font-medium text-sm">{theme}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Color Scheme * (Select multiple)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {colorPalettes.map(color => (
                  <div
                    key={color}
                    className={cn(
                      "p-2 border rounded cursor-pointer text-center text-xs transition-colors",
                      selectedColors.includes(color)
                        ? "border-brand-purple bg-purple-50 text-brand-purple"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => {
                      const newColors = selectedColors.includes(color) 
                        ? selectedColors.filter(c => c !== color)
                        : [...selectedColors, color]
                      setSelectedColors(newColors)
                      setEventData(prev => ({ ...prev, colorScheme: newColors }))
                    }}
                  >
                    <span className="font-medium text-sm">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Decoration Style (Select multiple)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {decorStyles.map(style => (
                  <div
                    key={style}
                    className={cn(
                      "p-2 border rounded cursor-pointer text-center text-xs transition-colors",
                      eventData.decorStyle.includes(style)
                        ? "border-brand-purple bg-purple-50 text-brand-purple"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => {
                      const newStyles = eventData.decorStyle.includes(style)
                        ? eventData.decorStyle.filter(s => s !== style)
                        : [...eventData.decorStyle, style]
                      setEventData(prev => ({ ...prev, decorStyle: newStyles }))
                    }}
                  >
                    <span className="font-medium text-sm">{style}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Decoration Budget</Label>
              <Input
                type="number"
                min="0"
                step="1"
                placeholder="Budget for decorations in ₹"
                value={eventData.decorBudget}
                onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value) || 0);
                  setEventData(prev => ({ ...prev, decorBudget: value.toString() }));
                }}
                onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label>Select Required Vendors</Label>
              <p className="text-sm text-gray-500 mb-4">Choose the types of vendors you need for your event</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {vendorCategories.map(vendor => (
                  <div
                    key={vendor}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-colors",
                      selectedVendors.includes(vendor)
                        ? "border-brand-purple bg-purple-50 text-brand-purple"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => toggleVendor(vendor)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{vendor}</span>
                      {selectedVendors.includes(vendor) && (
                        <CheckCircle className="h-5 w-5 text-brand-purple" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-brand-purple mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Review Your Event</h3>
              <p className="text-gray-600">Please review all details before creating your event</p>
            </div>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Event Type</Label>
                    <p className="font-semibold">{eventData.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Date & Time</Label>
                    <p className="font-semibold">
                      {eventData.date ? format(eventData.date, "PPP") : ""} at {eventData.time}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Location</Label>
                    <p className="font-semibold">{eventData.city}, {eventData.state}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Guest Count</Label>
                    <p className="font-semibold">{eventData.guestCount} guests</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Budget</Label>
                    <p className="font-semibold">₹{parseInt(eventData.budget).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Theme</Label>
                    <p className="font-semibold">{eventData.theme}</p>
                  </div>
                </div>

                {eventData.description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                    <p className="text-gray-700">{eventData.description}</p>
                  </div>
                )}

                {eventData.requirements.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Requirements</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {eventData.requirements.map((req, index) => (
                        <Badge key={index} variant="outline">{req}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedColors.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Color Scheme</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedColors.map((color, index) => (
                        <Badge key={index} className="bg-purple-100 text-purple-700">{color}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {eventData.decorStyle.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Decoration Style</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {eventData.decorStyle.map((style, index) => (
                        <Badge key={index} className="bg-purple-100 text-purple-700">{style}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-gray-500">Selected Vendors</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedVendors.map(vendor => (
                      <Badge key={vendor} className="bg-purple-100 text-purple-700">{vendor}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full max-w-full mx-0">
      {/* Header */}
      <div className="relative overflow-hidden bg-brand-gradient rounded-xl p-8 mb-6 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
          <p className="text-white/90 max-w-xl">
            Plan your perfect event step by step. We'll guide you through the entire process.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mt-20 -mr-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -mb-20 -ml-20"></div>
      </div>

      {/* Progress */}
      <Card className="border-0 shadow-md mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Step {currentStep} of {steps.length}</h3>
            <span className="text-sm text-gray-500">{Math.round(getStepProgress())}% Complete</span>
          </div>
          <Progress value={getStepProgress()} className="mb-4" />
          
          <div className="flex justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center text-center max-w-[120px]">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2",
                  step.id <= currentStep 
                    ? "bg-brand-purple text-white" 
                    : "bg-gray-200 text-gray-600"
                )}>
                  {step.id < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="text-xs">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-gray-500 hidden sm:block">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          {currentStep < steps.length ? (
            <Button 
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
            >
              Next Step
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              className="bg-button-gradient text-white"
            >
              Create Event
            </Button>
          )}
        </div>
      </div>

      {/* Validation Messages */}
      {!validateStep(currentStep) && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Please fill in all required fields to continue.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}