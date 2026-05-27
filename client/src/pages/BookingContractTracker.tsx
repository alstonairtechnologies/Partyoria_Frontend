import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Clock,  
  Plus, 
  Eye, 
  Building
} from 'lucide-react';

interface Contract {
  id: number;
  eventId: string;
  eventName: string;
  vendorName: string;
  vendorType: string;
  contractType: 'service' | 'venue' | 'catering' | 'decoration' | 'photography' | 'other';
  status: 'draft' | 'sent' | 'signed' | 'completed' | 'cancelled';
  amount: number;
  advanceAmount: number;
  remainingAmount: number;
  startDate: string;
  endDate: string;
  signedDate?: string;
  terms: string;
  documents: string[];
  milestones: ContractMilestone[];
  createdAt: string;
  updatedAt: string;
}

interface ContractMilestone {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'completed' | 'overdue';
  completedDate?: string;
}

interface Booking {
  id: number;
  eventId: string;
  eventName: string;
  vendorName: string;
  serviceType: string;
  bookingDate: string;
  eventDate: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  contractId?: number;
  notes: string;
  createdAt: string;
}

export default function BookingContractTracker() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [, setVendors] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'contracts' | 'bookings'>('contracts');
  const [showContractForm, setShowContractForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [contractForm, setContractForm] = useState<Partial<Contract>>({});
  const [bookingForm, setBookingForm] = useState<Partial<Booking>>({});
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const currentUserId = String(user.id || user.username || 'default');
      setUserId(currentUserId);
      loadData(currentUserId);
    }
  }, []);

  const loadData = (userId: string) => {
    // Load user events
    const userEventsKey = `userEvents_${userId}`;
    const eventsData = JSON.parse(localStorage.getItem(userEventsKey) || '[]');
    setEvents(eventsData);

    // Load contracts
    const contractsKey = `contracts_${userId}`;
    const contractsData = JSON.parse(localStorage.getItem(contractsKey) || '[]');
    setContracts(contractsData);

    // Load bookings
    const bookingsKey = `bookings_${userId}`;
    const bookingsData = JSON.parse(localStorage.getItem(bookingsKey) || '[]');
    setBookings(bookingsData);

    // Mock vendors data
    setVendors([
      { name: 'Elite Catering', type: 'catering' },
      { name: 'Dream Decorators', type: 'decoration' },
      { name: 'Perfect Shots Photography', type: 'photography' },
      { name: 'Grand Venues', type: 'venue' },
      { name: 'Sound & Light Pro', type: 'other' }
    ]);
  };

  const saveContract = () => {
    if (!userId || !contractForm.eventId || !contractForm.vendorName) return;

    const newContract: Contract = {
      id: Date.now(),
      eventId: contractForm.eventId!,
      eventName: events.find(e => e.id.toString() === contractForm.eventId)?.name || '',
      vendorName: contractForm.vendorName!,
      vendorType: contractForm.vendorType || 'other',
      contractType: contractForm.contractType || 'service',
      status: 'draft',
      amount: Number(contractForm.amount) || 0,
      advanceAmount: Number(contractForm.advanceAmount) || 0,
      remainingAmount: (Number(contractForm.amount) || 0) - (Number(contractForm.advanceAmount) || 0),
      startDate: contractForm.startDate || new Date().toISOString().split('T')[0],
      endDate: contractForm.endDate || new Date().toISOString().split('T')[0],
      terms: contractForm.terms || '',
      documents: [],
      milestones: contractForm.milestones || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [...contracts, newContract];
    setContracts(updated);
    localStorage.setItem(`contracts_${userId}`, JSON.stringify(updated));
    
    setShowContractForm(false);
    setContractForm({});
  };

  const saveBooking = () => {
    if (!userId || !bookingForm.eventId || !bookingForm.vendorName) return;

    const newBooking: Booking = {
      id: Date.now(),
      eventId: bookingForm.eventId!,
      eventName: events.find(e => e.id.toString() === bookingForm.eventId)?.name || '',
      vendorName: bookingForm.vendorName!,
      serviceType: bookingForm.serviceType || '',
      bookingDate: new Date().toISOString().split('T')[0],
      eventDate: bookingForm.eventDate || new Date().toISOString().split('T')[0],
      status: 'pending',
      totalAmount: Number(bookingForm.totalAmount) || 0,
      paidAmount: Number(bookingForm.paidAmount) || 0,
      remainingAmount: (Number(bookingForm.totalAmount) || 0) - (Number(bookingForm.paidAmount) || 0),
      notes: bookingForm.notes || '',
      createdAt: new Date().toISOString()
    };

    const updated = [...bookings, newBooking];
    setBookings(updated);
    localStorage.setItem(`bookings_${userId}`, JSON.stringify(updated));
    
    setShowBookingForm(false);
    setBookingForm({});
  };

  const updateContractStatus = (contractId: number, status: Contract['status']) => {
    if (!userId) return;
    
    const updated = contracts.map(contract => 
      contract.id === contractId 
        ? { ...contract, status, updatedAt: new Date().toISOString() }
        : contract
    );
    setContracts(updated);
    localStorage.setItem(`contracts_${userId}`, JSON.stringify(updated));
  };

  const updateBookingStatus = (bookingId: number, status: Booking['status']) => {
    if (!userId) return;
    
    const updated = bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status }
        : booking
    );
    setBookings(updated);
    localStorage.setItem(`bookings_${userId}`, JSON.stringify(updated));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'signed': case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContracts = filterStatus === 'all' 
    ? contracts 
    : contracts.filter(c => c.status === filterStatus);

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  const contractStats = {
    total: contracts.length,
    signed: contracts.filter(c => c.status === 'signed').length,
    pending: contracts.filter(c => c.status === 'sent' || c.status === 'draft').length,
    totalValue: contracts.reduce((sum, c) => sum + c.amount, 0)
  };

  const bookingStats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    totalValue: bookings.reduce((sum, b) => sum + b.totalAmount, 0)
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full max-w-full mx-0 bg-white min-h-screen">
      {/* Header */}
      <div className="bg-brand-gradient rounded-lg p-6 mb-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Booking & Contract Tracker</h1>
            <p className="text-white/90">Manage contracts, track bookings, and monitor vendor agreements</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowContractForm(true)}
              className="bg-white text-brand-purple hover:bg-gray-100"
            >
              <FileText className="h-4 w-4 mr-2" />
              New Contract
            </Button>
            <Button 
              onClick={() => setShowBookingForm(true)}
              className="bg-button-gradient text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Contracts</p>
                <h3 className="text-2xl font-bold text-gray-900">{contractStats.total}</h3>
                <p className="text-xs text-green-600">{contractStats.signed} signed</p>
              </div>
              <FileText className="h-8 w-8 text-brand-purple" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <h3 className="text-2xl font-bold text-gray-900">{bookingStats.total}</h3>
                <p className="text-xs text-blue-600">{bookingStats.confirmed} confirmed</p>
              </div>
              <Calendar className="h-8 w-8 text-brand-coral" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contract Value</p>
                <h3 className="text-2xl font-bold text-gray-900">₹{(contractStats.totalValue / 1000).toFixed(0)}K</h3>
                <p className="text-xs text-gray-500">Total committed</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Booking Value</p>
                <h3 className="text-2xl font-bold text-gray-900">₹{(bookingStats.totalValue / 1000).toFixed(0)}K</h3>
                <p className="text-xs text-gray-500">Total booked</p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'contracts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('contracts')}
            className={activeTab === 'contracts' ? 'bg-brand-purple text-white' : ''}
          >
            Contracts ({contracts.length})
          </Button>
          <Button
            variant={activeTab === 'bookings' ? 'default' : 'outline'}
            onClick={() => setActiveTab('bookings')}
            className={activeTab === 'bookings' ? 'bg-brand-purple text-white' : ''}
          >
            Bookings ({bookings.length})
          </Button>
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="signed">Signed</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {activeTab === 'contracts' ? (
        <div className="grid gap-4">
          {filteredContracts.map(contract => (
            <Card key={contract.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{contract.vendorName}</h3>
                      <Badge className={getStatusColor(contract.status)}>
                        {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                      </Badge>
                      <Badge variant="outline">{contract.contractType}</Badge>
                    </div>
                    <p className="text-gray-600 mb-2">Event: {contract.eventName}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ₹{contract.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedContract(contract)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Select
                      value={contract.status}
                      onValueChange={(value) => updateContractStatus(contract.id, value as Contract['status'])}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="signed">Signed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {contract.milestones.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Payment Milestones</h4>
                    <div className="space-y-2">
                      {contract.milestones.map(milestone => (
                        <div key={milestone.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{milestone.title}</span>
                            <span className="text-sm text-gray-500 ml-2">Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">₹{milestone.amount.toLocaleString()}</span>
                            <Badge className={getStatusColor(milestone.status)}>
                              {milestone.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {filteredContracts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No contracts found</p>
                <Button 
                  onClick={() => setShowContractForm(true)}
                  className="mt-4 bg-brand-gradient text-white"
                >
                  Create First Contract
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map(booking => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{booking.vendorName}</h3>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                      <Badge variant="outline">{booking.serviceType}</Badge>
                    </div>
                    <p className="text-gray-600 mb-2">Event: {booking.eventName}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Event: {new Date(booking.eventDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ₹{booking.totalAmount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Remaining: ₹{booking.remainingAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Select
                      value={booking.status}
                      onValueChange={(value) => updateBookingStatus(booking.id, value as Booking['status'])}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Payment Progress</span>
                    <span>{Math.round((booking.paidAmount / booking.totalAmount) * 100)}%</span>
                  </div>
                  <Progress value={(booking.paidAmount / booking.totalAmount) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredBookings.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No bookings found</p>
                <Button 
                  onClick={() => setShowBookingForm(true)}
                  className="mt-4 bg-brand-gradient text-white"
                >
                  Create First Booking
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Contract Form Dialog */}
      <Dialog open={showContractForm} onOpenChange={setShowContractForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Contract</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Event *</Label>
                <Select value={contractForm.eventId} onValueChange={(value) => setContractForm({...contractForm, eventId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map(event => (
                      <SelectItem key={event.id} value={event.id.toString()}>{event.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Vendor Name *</Label>
                <Input
                  value={contractForm.vendorName || ''}
                  onChange={(e) => setContractForm({...contractForm, vendorName: e.target.value})}
                  placeholder="Enter vendor name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Contract Type</Label>
                <Select value={contractForm.contractType} onValueChange={(value) => setContractForm({...contractForm, contractType: value as Contract['contractType']})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="venue">Venue</SelectItem>
                    <SelectItem value="catering">Catering</SelectItem>
                    <SelectItem value="decoration">Decoration</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Vendor Type</Label>
                <Input
                  value={contractForm.vendorType || ''}
                  onChange={(e) => setContractForm({...contractForm, vendorType: e.target.value})}
                  placeholder="e.g., Catering, Photography"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Total Amount *</Label>
                <Input
                  type="number"
                  min="0"
                  value={contractForm.amount || ''}
                  onChange={(e) => setContractForm({...contractForm, amount: Number(e.target.value)})}
                  onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                  placeholder="Total contract amount"
                />
              </div>
              <div>
                <Label>Advance Amount</Label>
                <Input
                  type="number"
                  min="0"
                  value={contractForm.advanceAmount || ''}
                  onChange={(e) => setContractForm({...contractForm, advanceAmount: Number(e.target.value)})}
                  onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                  placeholder="Advance payment"
                />
              </div>
              <div>
                <Label>Remaining</Label>
                <Input
                  value={`₹${((contractForm.amount || 0) - (contractForm.advanceAmount || 0)).toLocaleString()}`}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={contractForm.startDate || ''}
                  onChange={(e) => setContractForm({...contractForm, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={contractForm.endDate || ''}
                  onChange={(e) => setContractForm({...contractForm, endDate: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label>Terms & Conditions</Label>
              <Textarea
                value={contractForm.terms || ''}
                onChange={(e) => setContractForm({...contractForm, terms: e.target.value})}
                placeholder="Enter contract terms and conditions"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowContractForm(false)}>
                Cancel
              </Button>
              <Button onClick={saveContract} className="bg-brand-gradient text-white">
                Create Contract
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Form Dialog */}
      <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Event *</Label>
                <Select value={bookingForm.eventId} onValueChange={(value) => setBookingForm({...bookingForm, eventId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map(event => (
                      <SelectItem key={event.id} value={event.id.toString()}>{event.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Vendor Name *</Label>
                <Input
                  value={bookingForm.vendorName || ''}
                  onChange={(e) => setBookingForm({...bookingForm, vendorName: e.target.value})}
                  placeholder="Enter vendor name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Service Type</Label>
                <Input
                  value={bookingForm.serviceType || ''}
                  onChange={(e) => setBookingForm({...bookingForm, serviceType: e.target.value})}
                  placeholder="e.g., Photography, Catering"
                />
              </div>
              <div>
                <Label>Event Date</Label>
                <Input
                  type="date"
                  value={bookingForm.eventDate || ''}
                  onChange={(e) => setBookingForm({...bookingForm, eventDate: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Total Amount *</Label>
                <Input
                  type="number"
                  min="0"
                  value={bookingForm.totalAmount || ''}
                  onChange={(e) => setBookingForm({...bookingForm, totalAmount: Number(e.target.value)})}
                  onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                  placeholder="Total booking amount"
                />
              </div>
              <div>
                <Label>Paid Amount</Label>
                <Input
                  type="number"
                  min="0"
                  value={bookingForm.paidAmount || ''}
                  onChange={(e) => setBookingForm({...bookingForm, paidAmount: Number(e.target.value)})}
                  onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                  placeholder="Amount already paid"
                />
              </div>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={bookingForm.notes || ''}
                onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                placeholder="Additional notes or requirements"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBookingForm(false)}>
                Cancel
              </Button>
              <Button onClick={saveBooking} className="bg-brand-gradient text-white">
                Create Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contract Details Dialog */}
      <Dialog open={!!selectedContract} onOpenChange={() => setSelectedContract(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedContract && (
            <>
              <DialogHeader>
                <DialogTitle>Contract Details - {selectedContract.vendorName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Event</Label>
                      <p className="font-semibold">{selectedContract.eventName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Contract Type</Label>
                      <p className="font-semibold capitalize">{selectedContract.contractType}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      <Badge className={getStatusColor(selectedContract.status)}>
                        {selectedContract.status.charAt(0).toUpperCase() + selectedContract.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Total Amount</Label>
                      <p className="font-semibold text-lg">₹{selectedContract.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Advance Paid</Label>
                      <p className="font-semibold text-green-600">₹{selectedContract.advanceAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Remaining</Label>
                      <p className="font-semibold text-red-600">₹{selectedContract.remainingAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Contract Period</Label>
                  <p className="font-semibold">
                    {new Date(selectedContract.startDate).toLocaleDateString()} - {new Date(selectedContract.endDate).toLocaleDateString()}
                  </p>
                </div>

                {selectedContract.terms && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Terms & Conditions</Label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedContract.terms}</p>
                    </div>
                  </div>
                )}

                {selectedContract.milestones.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Payment Milestones</Label>
                    <div className="mt-2 space-y-3">
                      {selectedContract.milestones.map(milestone => (
                        <div key={milestone.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{milestone.title}</h4>
                            <Badge className={getStatusColor(milestone.status)}>
                              {milestone.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{milestone.description}</p>
                          <div className="flex justify-between text-sm">
                            <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                            <span className="font-semibold">₹{milestone.amount.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Booking Details - {selectedBooking.vendorName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Event</Label>
                    <p className="font-semibold">{selectedBooking.eventName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Service Type</Label>
                    <p className="font-semibold">{selectedBooking.serviceType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Event Date</Label>
                    <p className="font-semibold">{new Date(selectedBooking.eventDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <Badge className={getStatusColor(selectedBooking.status)}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Total Amount</Label>
                    <p className="font-semibold text-lg">₹{selectedBooking.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Paid Amount</Label>
                    <p className="font-semibold text-green-600">₹{selectedBooking.paidAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Remaining</Label>
                    <p className="font-semibold text-red-600">₹{selectedBooking.remainingAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Payment Progress</Label>
                  <div className="mt-2">
                    <Progress value={(selectedBooking.paidAmount / selectedBooking.totalAmount) * 100} className="h-3" />
                    <p className="text-sm text-gray-500 mt-1">
                      {Math.round((selectedBooking.paidAmount / selectedBooking.totalAmount) * 100)}% completed
                    </p>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Notes</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{selectedBooking.notes}</p>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-gray-500">Booking Created</Label>
                  <p className="text-sm text-gray-600">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}