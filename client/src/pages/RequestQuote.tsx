import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Send, FileText, Clock, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getVendors } from "@/lib/jsonData"

interface QuoteRequest {
  id: string
  eventType: string
  eventDate: string
  guestCount: number
  budget: string
  location: string
  description: string
  selectedVendors: string[]
  status: 'draft' | 'sent' | 'responded'
  createdAt: string
  responses?: QuoteResponse[]
}

interface QuoteResponse {
  vendorName: string
  price: number
  message: string
  respondedAt: string
}

export default function RequestQuote() {
  const [activeTab, setActiveTab] = useState<'create' | 'sent'>('create')
  const [vendors, setVendors] = useState<any[]>([])
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([])
  const [, setUserId] = useState<string>('')
  
  // Form state
  const [eventType, setEventType] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [budget, setBudget] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])

  useEffect(() => {
    const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
    if (userStr) {
      const user = JSON.parse(userStr)
      setUserId(user.id || user.email || user.username)
    }
    
    // Force initialize vendors if empty
    let vendorData = getVendors()
    if (vendorData.length === 0) {
      const mockVendors = [
        { name: "Elite Catering Co.", category: "Catering", rating: 4.8, location: "Mumbai", price: "₹500-800/plate" },
        { name: "Dream Decorators", category: "Decoration", rating: 4.6, location: "Delhi", price: "₹15K-50K" },
        { name: "Sound & Light Pro", category: "Audio/Visual", rating: 4.7, location: "Bangalore", price: "₹10K-25K" },
        { name: "Capture Moments", category: "Photography", rating: 4.9, location: "Pune", price: "₹20K-60K" },
        { name: "Party Planners Plus", category: "Event Planning", rating: 4.5, location: "Chennai", price: "₹25K-100K" },
        { name: "Floral Fantasy", category: "Flowers", rating: 4.4, location: "Hyderabad", price: "₹5K-20K" },
        { name: "DJ Beats", category: "Entertainment", rating: 4.6, location: "Kolkata", price: "₹8K-30K" },
        { name: "Cake Creations", category: "Bakery", rating: 4.8, location: "Mumbai", price: "₹1K-5K" }
      ]
      localStorage.setItem('vendors', JSON.stringify(mockVendors))
      vendorData = mockVendors
    }
    setVendors(vendorData)
    loadQuoteRequests()
  }, [])

  const loadQuoteRequests = () => {
    const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
    if (userStr) {
      const user = JSON.parse(userStr)
      const userId = user.id || user.email || user.username
      const requests = JSON.parse(localStorage.getItem(`quoteRequests_${userId}`) || '[]')
      setQuoteRequests(requests)
    }
  }


  const handleVendorToggle = (vendorName: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorName) 
        ? prev.filter(v => v !== vendorName)
        : [...prev, vendorName]
    )
  }


  const eventTypes = [
    'Wedding', 'Birthday Party', 'Corporate Event', 'Anniversary', 
    'Baby Shower', 'Graduation', 'Holiday Party', 'Other'
  ]

  return (
    <div className="p-6 w-full max-w-full mx-0 bg-white min-h-screen">
      <div className="bg-brand-gradient rounded-lg p-6 mb-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Request for Quote</h1>
        <p className="text-white/90 text-lg">Get competitive quotes from multiple vendors for your event</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        <Button
          onClick={() => setActiveTab('create')}
          className={cn(
            "px-6 py-3 font-semibold transition-all",
            activeTab === 'create' 
              ? "bg-brand-gradient text-white shadow-lg" 
              : "bg-white text-brand-purple border border-brand-purple hover:bg-purple-50"
          )}
        >
          <Send className="mr-2 h-4 w-4" />
          Create Request
        </Button>
        <Button
          onClick={() => setActiveTab('sent')}
          className={cn(
            "px-6 py-3 font-semibold transition-all",
            activeTab === 'sent' 
              ? "bg-brand-gradient text-white shadow-lg" 
              : "bg-white text-brand-purple border border-brand-purple hover:bg-purple-50"
          )}
        >
          <FileText className="mr-2 h-4 w-4" />
          My Requests ({quoteRequests.length})
        </Button>
      </div>

      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventType">Event Type *</Label>
                    <Select value={eventType} onValueChange={setEventType}>
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
                  
                  <div>
                    <Label htmlFor="eventDate">Event Date *</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestCount">Guest Count *</Label>
                    <Input
                      id="guestCount"
                      type="number"
                      min="1"
                      placeholder="Number of guests"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="budget">Budget Range *</Label>
                    <Select value={budget} onValueChange={setBudget}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-50k">Under ₹50,000</SelectItem>
                        <SelectItem value="50k-100k">₹50,000 - ₹1,00,000</SelectItem>
                        <SelectItem value="100k-200k">₹1,00,000 - ₹2,00,000</SelectItem>
                        <SelectItem value="200k-500k">₹2,00,000 - ₹5,00,000</SelectItem>
                        <SelectItem value="above-500k">Above ₹5,00,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Event location (city, venue, etc.)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Event Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your event requirements, theme, special needs, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vendor Selection */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Select Vendors</span>
                  <Badge className={selectedVendors.length > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                    {selectedVendors.length} selected
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {vendors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Loading vendors...</p>
                    </div>
                  ) : (
                    vendors.map((vendor) => (
                    <div
                      key={vendor.name}
                      onClick={() => handleVendorToggle(vendor.name)}
                      className={cn(
                        "p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                        selectedVendors.includes(vendor.name)
                          ? "border-brand-purple bg-purple-50 shadow-sm"
                          : "border-gray-200 hover:border-brand-purple hover:bg-purple-25"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{vendor.name}</h4>
                          <p className="text-xs text-gray-500">{vendor.category}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-yellow-600">★ {vendor.rating}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{vendor.location}</span>
                          </div>
                          <p className="text-xs text-green-600 font-medium mt-1">{vendor.price}</p>
                        </div>
                        {selectedVendors.includes(vendor.name) && (
                          <CheckCircle className="h-4 w-4 text-brand-purple" />
                        )}
                      </div>
                    </div>
                  ))
                  )}
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="text-sm text-gray-600">
                    {selectedVendors.length === 0 ? 'Select at least one vendor' : `${selectedVendors.length} vendor${selectedVendors.length > 1 ? 's' : ''} selected`}
                  </div>
                  <Button 
                    onClick={() => {
                      if (!eventType || !eventDate || !guestCount || !budget) {
                        alert('Please fill in all required fields');
                        return;
                      }
                      
                      if (selectedVendors.length === 0) {
                        alert('Please select at least one vendor');
                        return;
                      }
                      
                      const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user');
                      const userId = userStr ? JSON.parse(userStr).id || JSON.parse(userStr).email || JSON.parse(userStr).username || 'default' : 'default';
                      
                      const newRequest: QuoteRequest = {
                        id: Date.now().toString(),
                        eventType,
                        eventDate,
                        guestCount: parseInt(guestCount) || 0,
                        budget,
                        location: location || '',
                        description: description || '',
                        selectedVendors: [...selectedVendors],
                        status: 'sent',
                        createdAt: new Date().toISOString()
                      };
                      
                      const existing = JSON.parse(localStorage.getItem(`quoteRequests_${userId}`) || '[]');
                      const updated = [newRequest, ...existing];
                      localStorage.setItem(`quoteRequests_${userId}`, JSON.stringify(updated));
                      setQuoteRequests(updated);
                      
                      alert(`Quote request sent to ${selectedVendors.length} vendor(s) successfully!`);
                      
                      // Reset form
                      setEventType('');
                      setEventDate('');
                      setGuestCount('');
                      setBudget('');
                      setLocation('');
                      setDescription('');
                      setSelectedVendors([]);
                      
                      setActiveTab('sent');
                    }}
                    className="w-full bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-700"
                  >
                    Send Quote Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Sent Requests */
        <div className="space-y-4">
          {quoteRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No quote requests yet</h3>
                <p className="text-gray-500 mb-4">Create your first quote request to get started</p>
                <Button onClick={() => setActiveTab('create')} className="bg-brand-gradient text-white">
                  Create Request
                </Button>
              </CardContent>
            </Card>
          ) : (
            quoteRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{request.eventType}</h3>
                      <p className="text-gray-600">
                        {request.eventDate || 'No date'} • {request.guestCount} guests
                      </p>
                    </div>
                    <Badge className={cn(
                      request.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'responded' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {request.status === 'sent' ? 'Pending' : 
                       request.status === 'responded' ? 'Responded' : 'Draft'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-sm text-gray-500">Budget</Label>
                      <p className="font-medium">{request.budget}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Location</Label>
                      <p className="font-medium">{request.location || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  {request.description && (
                    <div className="mb-4">
                      <Label className="text-sm text-gray-500">Description</Label>
                      <p className="text-sm mt-1">{request.description}</p>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <Label className="text-sm text-gray-500">Vendors ({request.selectedVendors.length})</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {request.selectedVendors.map((vendor) => (
                        <Badge key={vendor} variant="outline">{vendor}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Sent {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                    <span className={request.responses?.length ? 'text-green-600 font-medium' : ''}>
                      {request.responses?.length || 0} responses
                    </span>
                  </div>
                  
                  {request.responses && request.responses.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">Vendor Responses</Label>
                      <div className="space-y-3">
                        {request.responses.map((response, index) => (
                          <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-green-800">{response.vendorName}</h4>
                              <span className="text-lg font-bold text-green-700">₹{response.price.toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-green-700">{response.message}</p>
                            <p className="text-xs text-green-600 mt-1">
                              Responded on {new Date(response.respondedAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}