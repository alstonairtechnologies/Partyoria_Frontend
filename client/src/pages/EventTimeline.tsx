import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, CheckCircle, Plus, Edit, Trash2 } from "lucide-react"

interface Event {
  id: number
  name: string
  type: string
  date: string
}

interface Milestone {
  id: number
  eventId: string
  title: string
  description: string
  dueDate: string
  priority: string
  status: string
  createdAt: string
  completedAt?: string
  updatedAt?: string
}

export default function EventTimeline() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState("")
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "pending"
  })
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const priorities = [
    { value: "low", label: "Low", color: "bg-gray-100 text-gray-700" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700" },
    { value: "high", label: "High", color: "bg-red-100 text-red-700" }
  ]

  useEffect(() => {
    const loadData = () => {
      const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
      const user = userStr ? JSON.parse(userStr) : null
      const userId = user?.id || user?.email || user?.username
      
      if (userId) {
        const userEventsKey = `userEvents_${userId}`
        const userEvents = JSON.parse(localStorage.getItem(userEventsKey) || '[]')
        setEvents(userEvents)
        
        const userMilestonesKey = `eventMilestones_${userId}`
        const savedMilestones = JSON.parse(localStorage.getItem(userMilestonesKey) || '[]')
        setMilestones(savedMilestones)
        
        // Auto-select first event if available
        if (userEvents.length > 0 && !selectedEvent) {
          setSelectedEvent(userEvents[0].id.toString())
        }
      }
    }
    
    loadData()
    
    // Listen for data updates
    window.addEventListener('dataUpdated', loadData)
    
    return () => {
      window.removeEventListener('dataUpdated', loadData)
    }
  }, [])

  useEffect(() => {
    if (selectedEvent) {
      const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
      const user = userStr ? JSON.parse(userStr) : null
      const userId = user?.id || user?.email || user?.username
      
      if (userId) {
        const userMilestonesKey = `eventMilestones_${userId}`
        const savedMilestones = JSON.parse(localStorage.getItem(userMilestonesKey) || '[]')
        setMilestones(savedMilestones)
      }
    }
  }, [selectedEvent])

  const addMilestone = () => {
    if (newMilestone.title && newMilestone.dueDate && selectedEvent) {
      const milestone = {
        id: Date.now(),
        eventId: selectedEvent,
        ...newMilestone,
        createdAt: new Date().toISOString()
      }
      
      const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
      const user = userStr ? JSON.parse(userStr) : null
      const userId = user?.id || user?.email || user?.username
      
      const updatedMilestones = [...milestones, milestone]
      setMilestones(updatedMilestones)
      
      if (userId) {
        const userMilestonesKey = `eventMilestones_${userId}`
        localStorage.setItem(userMilestonesKey, JSON.stringify(updatedMilestones))
      }
      
      setNewMilestone({ title: "", description: "", dueDate: "", priority: "medium", status: "pending" })
    }
  }

  const updateMilestone = () => {
    if (editingMilestone && editingMilestone.title && editingMilestone.dueDate && editingMilestone.id) {
      const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
      const user = userStr ? JSON.parse(userStr) : null
      const userId = user?.id || user?.email || user?.username
      
      const updatedMilestones = milestones.map(m => 
        m.id === editingMilestone.id ? { ...editingMilestone, updatedAt: new Date().toISOString() } : m
      )
      setMilestones(updatedMilestones)
      
      if (userId) {
        const userMilestonesKey = `eventMilestones_${userId}`
        localStorage.setItem(userMilestonesKey, JSON.stringify(updatedMilestones))
      }
      
      setEditingMilestone(null)
      setIsEditing(false)
    }
  }

  const startEdit = (milestone: Milestone) => {
    setEditingMilestone({ ...milestone })
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setEditingMilestone(null)
    setIsEditing(false)
  }

  const updateMilestoneStatus = (milestoneId: number, status: string) => {
    const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
    const user = userStr ? JSON.parse(userStr) : null
    const userId = user?.id || user?.email || user?.username
    
    const updatedMilestones = milestones.map(m => 
      m.id === milestoneId ? { ...m, status, completedAt: status === 'completed' ? new Date().toISOString() : undefined } : m
    )
    setMilestones(updatedMilestones)
    
    if (userId) {
      const userMilestonesKey = `eventMilestones_${userId}`
      localStorage.setItem(userMilestonesKey, JSON.stringify(updatedMilestones))
    }
    
    // Check if all milestones for the selected event are completed
    if (status === 'completed' && selectedEvent) {
      const eventMilestones = updatedMilestones.filter(m => m.eventId === selectedEvent)
      const allCompleted = eventMilestones.length > 0 && eventMilestones.every(m => m.status === 'completed')
      
      if (allCompleted) {
        const selectedEventData = events.find(e => e.id.toString() === selectedEvent)
        const eventName = selectedEventData?.name || selectedEventData?.type || 'your event'
        alert(`🎉 Congratulations! You have successfully completed all milestones for ${eventName}! Your event is ready to go!`)
      }
    }
  }

  const deleteMilestone = (id: number) => {
    const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
    const user = userStr ? JSON.parse(userStr) : null
    const userId = user?.id || user?.email || user?.username
    
    const updatedMilestones = milestones.filter(m => m.id !== id)
    setMilestones(updatedMilestones)
    
    if (userId) {
      const userMilestonesKey = `eventMilestones_${userId}`
      localStorage.setItem(userMilestonesKey, JSON.stringify(updatedMilestones))
    }
  }

  const eventMilestones = milestones.filter(m => m.eventId === selectedEvent)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  
  const completedCount = eventMilestones.filter(m => m.status === 'completed').length
  const totalCount = eventMilestones.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="p-6 w-full max-w-full mx-0 bg-white min-h-screen">
      <div className="bg-brand-gradient rounded-lg p-6 mb-6 text-white">
        <h1 className="text-2xl font-semibold text-white mb-2">Event Timeline & Milestones</h1>
        <p className="text-white/90">Track important milestones and deadlines for your events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Milestone Form */}
        <Card className="lg:col-span-1 bg-white border border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <h3 className="font-medium text-gray-900">{isEditing ? 'Edit Milestone' : 'Add Milestone'}</h3>
          </div>
          <CardContent className="p-6 space-y-4">
            {!isEditing && (
              <div>
                <Label>Select Event</Label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map(event => (
                      <SelectItem key={event.id} value={event.id.toString()}>
                        {event.name || event.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Milestone Title</Label>
              <Input
                value={isEditing ? editingMilestone?.title || '' : newMilestone.title}
                onChange={(e) => isEditing && editingMilestone
                  ? setEditingMilestone({...editingMilestone, title: e.target.value})
                  : setNewMilestone({...newMilestone, title: e.target.value})
                }
                placeholder="e.g., Book venue"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={isEditing ? editingMilestone?.description || '' : newMilestone.description}
                onChange={(e) => isEditing && editingMilestone
                  ? setEditingMilestone({...editingMilestone, description: e.target.value})
                  : setNewMilestone({...newMilestone, description: e.target.value})
                }
                placeholder="Additional details"
              />
            </div>

            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={isEditing ? editingMilestone?.dueDate || '' : newMilestone.dueDate}
                onChange={(e) => isEditing && editingMilestone
                  ? setEditingMilestone({...editingMilestone, dueDate: e.target.value})
                  : setNewMilestone({...newMilestone, dueDate: e.target.value})
                }
              />
            </div>

            <div>
              <Label>Priority</Label>
              <Select 
                value={isEditing ? editingMilestone?.priority || 'medium' : newMilestone.priority} 
                onValueChange={(value) => isEditing && editingMilestone
                  ? setEditingMilestone({...editingMilestone, priority: value})
                  : setNewMilestone({...newMilestone, priority: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <Button onClick={updateMilestone} className="w-full">
                  <CheckCircle className="mr-2 h-4 w-4" /> Update Milestone
                </Button>
                <Button onClick={cancelEdit} variant="outline" className="w-full">
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={addMilestone} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Milestone
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Timeline Overview */}
        <div className="lg:col-span-2 space-y-6">
          {selectedEvent && (
            <>
              {/* Progress Overview */}
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Event Progress</h3>
                    <span className="text-sm text-gray-500">{completedCount} of {totalCount} completed</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">{progressPercentage.toFixed(0)}% Complete</p>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="bg-white border border-gray-200">
                <div className="border-b border-gray-200 p-4">
                  <h3 className="font-medium text-gray-900">Timeline</h3>
                </div>
                <CardContent className="p-6">
                  {eventMilestones.length > 0 ? (
                    <div className="space-y-4">
                      {eventMilestones.map((milestone, index) => {
                        const daysUntilDue = getDaysUntilDue(milestone.dueDate)
                        const isOverdue = daysUntilDue < 0 && milestone.status !== 'completed'
                        const priority = priorities.find(p => p.value === milestone.priority)
                        
                        return (
                          <div key={milestone.id} className="relative">
                            {index < eventMilestones.length - 1 && (
                              <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                            )}
                            
                            <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                milestone.status === 'completed' ? 'bg-green-100' : 
                                isOverdue ? 'bg-red-100' : 'bg-gray-100'
                              }`}>
                                {milestone.status === 'completed' ? (
                                  <CheckCircle className="h-6 w-6 text-green-600" />
                                ) : (
                                  <Clock className={`h-6 w-6 ${isOverdue ? 'text-red-600' : 'text-gray-600'}`} />
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                                    {milestone.description && (
                                      <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                                    )}
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge className={priority?.color}>
                                        {priority?.label}
                                      </Badge>
                                      <span className="text-sm text-gray-500">
                                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                      </span>
                                      {isOverdue && (
                                        <Badge className="bg-red-100 text-red-700">
                                          {Math.abs(daysUntilDue)} days overdue
                                        </Badge>
                                      )}
                                      {daysUntilDue > 0 && milestone.status !== 'completed' && (
                                        <Badge className="bg-blue-100 text-blue-700">
                                          {daysUntilDue} days left
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    {milestone.status !== 'completed' && (
                                      <Button
                                        size="sm"
                                        onClick={() => updateMilestoneStatus(milestone.id, 'completed')}
                                        className="bg-brand-purple text-white"
                                      >
                                        Complete
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => startEdit(milestone)}
                                      className="bg-brand-purple text-white"
                                    >
                                      <Edit className="h-4 w-4 text-white" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteMilestone(milestone.id)}
                                      className="text-white hover:text-gray-200 bg-red-500 hover:bg-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No milestones yet</h4>
                      <p className="text-gray-500">Add milestones to track your event progress</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {!selectedEvent && (
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Event</h3>
                <p className="text-gray-500">Choose an event to manage its timeline and milestones</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}


