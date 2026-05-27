import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Calculator, DollarSign } from "lucide-react"

interface BudgetItem {
  id: string
  category: string
  description: string
  estimatedCost: number
  actualCost: number
  vendor?: string
  status: 'planned' | 'booked' | 'paid'
  dueDate?: string
  notes?: string
}

interface Budget {
  id: string
  eventName: string
  eventDate: string
  totalBudget: number
  items: BudgetItem[]
  createdAt: string
  userId: string
  status: 'draft' | 'active' | 'completed'
}

export default function LineItemBudgeting() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null)
  const [eventName, setEventName] = useState('')
  const [totalBudget, setTotalBudget] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [selectedEventId, setSelectedEventId] = useState('')
  const [userEvents, setUserEvents] = useState<any[]>([])
  const [newItem, setNewItem] = useState({ category: '', description: '', estimatedCost: '', vendor: '', dueDate: '', notes: '' })
  const [filter, setFilter] = useState('all')
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
    if (userStr) {
      const user = JSON.parse(userStr)
      const id = user.id || user.email || user.username
      setUserId(id)
      loadBudgets(id)
      loadUserEvents(id)
    }
  }, [])

  const loadUserEvents = (userId: string) => {
    const events = JSON.parse(localStorage.getItem(`userEvents_${userId}`) || '[]')
    setUserEvents(events)
  }

  const loadBudgets = (userId: string) => {
    const budgetData = JSON.parse(localStorage.getItem(`budgets_${userId}`) || '[]')
    setBudgets(budgetData)
  }

  const saveBudgets = (budgetData: Budget[]) => {
    localStorage.setItem(`budgets_${userId}`, JSON.stringify(budgetData))
    setBudgets(budgetData)
  }

  const createNewBudget = () => {
    let finalEventName = eventName
    let finalEventDate = eventDate
    let autoItems: BudgetItem[] = []
    
    if (selectedEventId) {
      const selectedEvent = userEvents.find(e => e.id === selectedEventId)
      if (selectedEvent) {
        finalEventName = selectedEvent.name
        finalEventDate = selectedEvent.date
        
        // Auto-generate budget items from event details
        let itemId = 1
        
        // Add venue
        if (selectedEvent.location || selectedEvent.city) {
          autoItems.push({
            id: (itemId++).toString(),
            category: 'Venue',
            description: 'Venue rental',
            estimatedCost: 0,
            actualCost: 0,
            status: 'planned'
          })
        }
        
        // Add catering based on guest count
        if (selectedEvent.guestCount || selectedEvent.guests) {
          autoItems.push(
            {
              id: (itemId++).toString(),
              category: 'Catering',
              description: 'Main course (vegetarian)',
              estimatedCost: 0,
              actualCost: 0,
              status: 'planned'
            },
            {
              id: (itemId++).toString(),
              category: 'Catering',
              description: 'Beverages',
              estimatedCost: 0,
              actualCost: 0,
              status: 'planned'
            }
          )
        }
        
        // Add decoration if theme exists
        if (selectedEvent.theme || selectedEvent.description?.includes('theme')) {
          autoItems.push({
            id: (itemId++).toString(),
            category: 'Decoration',
            description: 'Theme decoration',
            estimatedCost: 0,
            actualCost: 0,
            status: 'planned'
          })
        }
        
        // Add vendors from event
        if (selectedEvent.vendors && selectedEvent.vendors.length > 0) {
          selectedEvent.vendors.forEach((vendor: string) => {
            let category = 'Other'
            let description = vendor
            
            if (vendor.toLowerCase().includes('photo')) {
              category = 'Photography'
              description = 'Photography services'
            } else if (vendor.toLowerCase().includes('dj') || vendor.toLowerCase().includes('music')) {
              category = 'Entertainment'
              description = 'DJ services'
            } else if (vendor.toLowerCase().includes('cater') || vendor.toLowerCase().includes('food')) {
              category = 'Catering'
              description = 'Catering services'
            } else if (vendor.toLowerCase().includes('decor') || vendor.toLowerCase().includes('flower')) {
              category = 'Decoration'
              description = 'Decoration services'
            }
            
            autoItems.push({
              id: (itemId++).toString(),
              category,
              description,
              estimatedCost: 0,
              actualCost: 0,
              vendor,
              status: 'planned'
            })
          })
        }
        
        // Add requirements as budget items
        if (selectedEvent.requirements && selectedEvent.requirements.length > 0) {
          selectedEvent.requirements.forEach((req: string) => {
            autoItems.push({
              id: (itemId++).toString(),
              category: 'Other',
              description: req,
              estimatedCost: 0,
              actualCost: 0,
              status: 'planned'
            })
          })
        }
      }
    }
    
    if ((!finalEventName && !selectedEventId) || !totalBudget) {
      alert('Please select an event or enter event name and total budget')
      return
    }
    
    if (!totalBudget || parseFloat(totalBudget) <= 0) {
      alert('Please enter a valid total budget')
      return
    }

    const newBudget: Budget = {
      id: Date.now().toString(),
      eventName: finalEventName,
      eventDate: finalEventDate,
      totalBudget: parseFloat(totalBudget),
      items: autoItems,
      createdAt: new Date().toISOString(),
      userId,
      status: 'draft'
    }

    const updated = [...budgets, newBudget]
    saveBudgets(updated)
    setCurrentBudget(newBudget)
    setEventName('')
    setTotalBudget('')
    setEventDate('')
    setSelectedEventId('')
    
    if (autoItems.length > 0) {
      alert(`Budget created with ${autoItems.length} items from your event details!`)
    }
  }

  const addBudgetItem = () => {
    if (!currentBudget || !newItem.category || !newItem.estimatedCost) {
      alert('Please fill in category and estimated cost')
      return
    }

    const item: BudgetItem = {
      id: Date.now().toString(),
      category: newItem.category,
      description: newItem.description,
      estimatedCost: parseFloat(newItem.estimatedCost),
      actualCost: 0,
      vendor: newItem.vendor,
      status: 'planned',
      dueDate: newItem.dueDate,
      notes: newItem.notes
    }

    const updatedBudget = {
      ...currentBudget,
      items: [...currentBudget.items, item]
    }

    const updatedBudgets = budgets.map(b => b.id === currentBudget.id ? updatedBudget : b)
    saveBudgets(updatedBudgets)
    setCurrentBudget(updatedBudget)
    setNewItem({ category: '', description: '', estimatedCost: '', vendor: '', dueDate: '', notes: '' })
  }

  const updateItem = (itemId: string, updates: Partial<BudgetItem>) => {
    if (!currentBudget) return

    const updatedBudget = {
      ...currentBudget,
      items: currentBudget.items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    }

    const updatedBudgets = budgets.map(b => b.id === currentBudget.id ? updatedBudget : b)
    saveBudgets(updatedBudgets)
    setCurrentBudget(updatedBudget)
  }

  const deleteItem = (itemId: string) => {
    if (!currentBudget) return

    const updatedBudget = {
      ...currentBudget,
      items: currentBudget.items.filter(item => item.id !== itemId)
    }

    const updatedBudgets = budgets.map(b => b.id === currentBudget.id ? updatedBudget : b)
    saveBudgets(updatedBudgets)
    setCurrentBudget(updatedBudget)
  }

  const totalEstimated = currentBudget?.items.reduce((sum, item) => sum + item.estimatedCost, 0) || 0
  const totalActual = currentBudget?.items.reduce((sum, item) => sum + item.actualCost, 0) || 0
  const remaining = (currentBudget?.totalBudget || 0) - totalActual

  const categoryItems = {
    'Venue': ['Venue rental', 'Setup charges', 'Cleanup fee', 'Overtime charges'],
    'Catering': ['Appetizers', 'Main course (vegetarian)', 'Main course (non-vegetarian)', 'Desserts', 'Beverages', 'Service charges', 'Waitstaff'],
    'Decoration': ['Stage decoration', 'Table centerpieces', 'Entrance decoration', 'Backdrop', 'Lighting decoration', 'Balloon arrangements'],
    'Photography': ['Photographer fee', 'Videographer fee', 'Photo editing', 'Video editing', 'Photo prints', 'USB/DVD'],
    'Entertainment': ['DJ services', 'Live band', 'Sound system', 'Microphones', 'Dance floor'],
    'Transportation': ['Guest transportation', 'Vendor transportation', 'Equipment transport'],
    'Flowers': ['Bridal bouquet', 'Centerpieces', 'Stage flowers', 'Entrance flowers', 'Garlands'],
    'Audio/Visual': ['Sound system', 'Projector', 'Screens', 'Lighting', 'Microphones'],
    'Security': ['Security guards', 'CCTV setup', 'Crowd control'],
    'Insurance': ['Event insurance', 'Equipment insurance'],
    'Permits': ['Event permits', 'Music license', 'Alcohol license'],
    'Staff': ['Event coordinator', 'Helpers', 'Cleanup crew'],
    'Other': ['Miscellaneous']
  }
  
  const categories = Object.keys(categoryItems)
  
  const filteredItems = currentBudget?.items.filter(item => {
    if (filter === 'all') return true
    if (filter === 'overbudget') return item.actualCost > item.estimatedCost
    if (filter === 'unpaid') return item.status !== 'paid'
    return item.status === filter
  }) || []

  return (
    <div className="p-6 w-full max-w-full mx-0 bg-white min-h-screen">
      <div className="bg-brand-gradient rounded-lg p-6 mb-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Line-Item Budgeting</h1>
        <p className="text-white/90 text-lg">Track detailed expenses for your events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget List */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>My Budgets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {budgets.map(budget => (
                <div
                  key={budget.id}
                  onClick={() => setCurrentBudget(budget)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    currentBudget?.id === budget.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h4 className="font-medium">{budget.eventName}</h4>
                  <p className="text-sm text-gray-600">₹{budget.totalBudget.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{budget.items.length} items</p>
                  <Badge className={`text-xs ${budget.status === 'completed' ? 'bg-green-100 text-green-800' : budget.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {budget.status}
                  </Badge>
                </div>
              ))}
              
              <div className="pt-4 border-t space-y-3">
                <div>
                  <Label className="text-sm font-medium">Select Existing Event</Label>
                  <select
                    className="w-full p-2 border rounded-lg mt-1"
                    value={selectedEventId}
                    onChange={(e) => {
                      setSelectedEventId(e.target.value)
                      if (e.target.value) {
                        setEventName('')
                        setEventDate('')
                      }
                    }}
                  >
                    <option value="">Choose from my events</option>
                    {userEvents.map(event => (
                      <option key={event.id} value={event.id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="text-center text-gray-500 text-sm">OR</div>
                
                <Input
                  placeholder="New event name"
                  value={eventName}
                  onChange={(e) => {
                    setEventName(e.target.value)
                    if (e.target.value) setSelectedEventId('')
                  }}
                  disabled={!!selectedEventId}
                />
                <Input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  disabled={!!selectedEventId}
                />
                <Input
                  placeholder="Total budget"
                  type="number"
                  min="1"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                />
                <button 
                  onClick={createNewBudget} 
                  className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 font-medium"
                >
                  Create Budget
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Details */}
        <div className="lg:col-span-2">
          {currentBudget ? (
            <div className="space-y-6">
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{currentBudget.eventName}</span>
                    <Badge className="bg-green-100 text-green-800">
                      ₹{remaining.toLocaleString()} remaining
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">₹{currentBudget.totalBudget.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Budget</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">₹{totalEstimated.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Estimated</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">₹{totalActual.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Actual Spent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add Item */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Budget Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label>Category</Label>
                      <select
                        className="w-full p-2 border rounded-lg"
                        value={newItem.category}
                        onChange={(e) => {
                          setNewItem({...newItem, category: e.target.value, description: ''})
                        }}
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Specific Item</Label>
                      <select
                        className="w-full p-2 border rounded-lg"
                        value={newItem.description}
                        onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                        disabled={!newItem.category}
                      >
                        <option value="">Select specific item</option>
                        {newItem.category && categoryItems[newItem.category as keyof typeof categoryItems]?.map(item => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Estimated Cost</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={newItem.estimatedCost}
                        onChange={(e) => setNewItem({...newItem, estimatedCost: e.target.value})}
                        onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                      />
                    </div>
                    <div>
                      <Label>Vendor</Label>
                      <Input
                        placeholder="Vendor name"
                        value={newItem.vendor}
                        onChange={(e) => setNewItem({...newItem, vendor: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={newItem.dueDate}
                        onChange={(e) => setNewItem({...newItem, dueDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Input
                        placeholder="Additional notes"
                        value={newItem.notes}
                        onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button onClick={addBudgetItem} className="mt-4 bg-purple-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </CardContent>
              </Card>

              {/* Budget Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Budget Items ({filteredItems.length})</span>
                    <select
                      className="p-2 border rounded-lg text-sm"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">All Items</option>
                      <option value="planned">Planned</option>
                      <option value="booked">Booked</option>
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="overbudget">Over Budget</option>
                    </select>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredItems.map(item => (
                      <div key={item.id} className={`p-4 border rounded-lg ${item.actualCost > item.estimatedCost ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{item.category}</Badge>
                              <h4 className="font-medium">{item.description || 'No description'}</h4>
                              <Badge className={`text-xs ${
                                item.status === 'paid' ? 'bg-green-100 text-green-800' :
                                item.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {item.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <Label className="text-xs text-gray-500">Estimated</Label>
                                <p className="font-medium">₹{item.estimatedCost.toLocaleString()}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-gray-500">Actual</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  className="h-8 mt-1"
                                  value={item.actualCost}
                                  onChange={(e) => updateItem(item.id, { actualCost: parseFloat(e.target.value) || 0 })}
                                  onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-gray-500">Status</Label>
                                <select
                                  className="w-full p-1 border rounded text-xs mt-1"
                                  value={item.status}
                                  onChange={(e) => updateItem(item.id, { status: e.target.value as any })}
                                >
                                  <option value="planned">Planned</option>
                                  <option value="booked">Booked</option>
                                  <option value="paid">Paid</option>
                                </select>
                              </div>
                              <div>
                                <Label className="text-xs text-gray-500">Vendor</Label>
                                <Input
                                  className="h-8 mt-1 text-xs"
                                  value={item.vendor || ''}
                                  onChange={(e) => updateItem(item.id, { vendor: e.target.value })}
                                  placeholder="Vendor name"
                                />
                              </div>
                            </div>
                            
                            {(item.dueDate || item.notes) && (
                              <div className="mt-2 text-xs text-gray-600">
                                {item.dueDate && <span>Due: {item.dueDate} • </span>}
                                {item.notes && <span>{item.notes}</span>}
                              </div>
                            )}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteItem(item.id)}
                            className="text-white hover:text-gray-200 ml-2 bg-red-500 hover:bg-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {filteredItems.length === 0 && currentBudget.items.length > 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No items match the current filter.</p>
                      </div>
                    )}
                    
                    {currentBudget.items.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>No budget items yet. Add your first item above.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No budget selected</h3>
                <p className="text-gray-500">Create a new budget or select an existing one to get started</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}