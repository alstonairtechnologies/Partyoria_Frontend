import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MapPin, DollarSign, CheckCircle } from "lucide-react"

export default function EventWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [eventData, setEventData] = useState({
    name: '',
    type: '',
    date: '',
    location: '',
    guestCount: '',
    budget: '',
    description: ''
  })

  const steps = [
    { id: 1, title: "Event Details", icon: Calendar },
    { id: 2, title: "Venue & Guests", icon: MapPin },
    { id: 3, title: "Budget", icon: DollarSign },
    { id: 4, title: "Review", icon: CheckCircle }
  ]

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    const newEvent = {
      ...eventData,
      id: Date.now(),
      status: 'Planning',
      progress: 25,
      createdAt: new Date().toISOString()
    }
    
    const events = JSON.parse(localStorage.getItem('userEvents') || '[]')
    events.push(newEvent)
    localStorage.setItem('userEvents', JSON.stringify(events))
    
    alert('Event created successfully!')
  }

  return (
    <div className="p-6 w-full max-w-4xl mx-auto bg-white min-h-screen">
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create New Event</h1>
        <p className="text-gray-600">Follow the steps to create your perfect event</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.id ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-300 text-gray-400'
            }`}>
              <step.icon className="h-5 w-5" />
            </div>
            <span className={`ml-2 text-sm font-medium ${
              currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-gray-900' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input
                    id="eventName"
                    value={eventData.name}
                    onChange={(e) => setEventData({...eventData, name: e.target.value})}
                    placeholder="Enter event name"
                  />
                </div>
                <div>
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select value={eventData.type} onValueChange={(value) => setEventData({...eventData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="corporate">Corporate Event</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={eventData.date}
                    onChange={(e) => setEventData({...eventData, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={eventData.description}
                    onChange={(e) => setEventData({...eventData, description: e.target.value})}
                    placeholder="Describe your event"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Venue & Guests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={eventData.location}
                    onChange={(e) => setEventData({...eventData, location: e.target.value})}
                    placeholder="Enter venue or city"
                  />
                </div>
                <div>
                  <Label htmlFor="guestCount">Number of Guests</Label>
                  <Input
                    id="guestCount"
                    type="number"
                    min="1"
                    value={eventData.guestCount}
                    onChange={(e) => setEventData({...eventData, guestCount: e.target.value})}
                    onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                    placeholder="Expected guest count"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Budget Planning</h3>
              <div>
                <Label htmlFor="budget">Total Budget (₹)</Label>
                <Input
                  id="budget"
                  type="number"
                  min="1"
                  value={eventData.budget}
                  onChange={(e) => setEventData({...eventData, budget: e.target.value})}
                  onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                  placeholder="Enter your budget"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Review Your Event</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600">Event Name</Label>
                    <p className="font-medium">{eventData.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Type</Label>
                    <p className="font-medium">{eventData.type}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Date</Label>
                    <p className="font-medium">{eventData.date}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600">Location</Label>
                    <p className="font-medium">{eventData.location}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Guests</Label>
                    <p className="font-medium">{eventData.guestCount}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Budget</Label>
                    <p className="font-medium">₹{parseInt(eventData.budget || '0').toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Previous
            </Button>
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                Create Event
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}