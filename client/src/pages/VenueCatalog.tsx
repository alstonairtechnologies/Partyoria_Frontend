import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, IndianRupee, Star, Calendar, Plus, Edit, Trash2, X, Wifi, Car, Coffee, Camera, Music, Phone, Eye, Image as ImageIcon } from 'lucide-react';

export default function VenueCatalog() {
  const [venues, setVenues] = useState<any[]>([]);
  const [filters, setFilters] = useState({ capacity: '', price: '', type: '', location: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState<any>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [userType, setUserType] = useState<string>('');

  useEffect(() => {
    initializeUser();
    loadVenues();
  }, []);

  const initializeUser = () => {
    try {
      const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserId(user.id || user.username || 'default');
        setUserType(user.isVendor ? 'vendor' : 'client');
      }
    } catch (error) {
      console.error('Error initializing user:', error);
    }
  };

  const loadVenues = () => {
    try {
      // Clear existing data to force reload of new venues
      localStorage.removeItem('venue_catalog');
      const venuesData = JSON.parse(localStorage.getItem('venue_catalog') || '[]');
      if (venuesData.length === 0) {
        const mockVenues = [
          {
            id: 1,
            name: 'Grand Ballroom',
            location: 'Mumbai, Maharashtra',
            type: 'Banquet Hall',
            capacity: 500,
            hourlyRate: 15000,
            rating: 4.8,
            reviews: 124,
            availability: 'Available',
            images: 8,
            photos: [
              'https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=800&h=600&fit=crop'
            ],
            amenities: ['Parking', 'WiFi', 'Catering', 'DJ/Music', 'Photography'],
            description: 'Elegant ballroom perfect for weddings and corporate events',
            contact: '+91 98765 43210',
            vendorId: 'vendor1'
          },
          {
            id: 2,
            name: 'Garden Paradise',
            location: 'Delhi, NCR',
            type: 'Garden',
            capacity: 300,
            hourlyRate: 8000,
            rating: 4.5,
            reviews: 89,
            availability: 'Available',
            images: 6,
            photos: [
              'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
            ],
            amenities: ['Parking', 'Catering', 'Decoration'],
            description: 'Beautiful outdoor garden venue with natural ambiance',
            contact: '+91 87654 32109',
            vendorId: 'vendor2'
          },
          {
            id: 3,
            name: 'Rooftop Terrace',
            location: 'Bangalore, Karnataka',
            type: 'Rooftop',
            capacity: 150,
            hourlyRate: 12000,
            rating: 4.7,
            reviews: 67,
            availability: 'Booked',
            images: 6,
            photos: [
              'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1514525253161-7a4b6ad7a6c3?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
            ],
            amenities: ['WiFi', 'DJ/Music', 'Photography'],
            description: 'Modern rooftop venue with city skyline views',
            contact: '+91 76543 21098',
            vendorId: 'vendor3'
          },
          {
            id: 4,
            name: 'Beach Resort Villa',
            location: 'Goa, India',
            type: 'Beach',
            capacity: 200,
            hourlyRate: 18000,
            rating: 4.9,
            reviews: 156,
            availability: 'Available',
            images: 5,
            photos: [
              'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
            ],
            amenities: ['Parking', 'WiFi', 'Catering', 'Photography', 'DJ/Music'],
            description: 'Stunning beachfront venue with ocean views and sunset ceremonies',
            contact: '+91 98234 56789',
            vendorId: 'vendor4'
          },
          {
            id: 5,
            name: 'Heritage Palace',
            location: 'Jaipur, Rajasthan',
            type: 'Resort',
            capacity: 800,
            hourlyRate: 25000,
            rating: 4.6,
            reviews: 203,
            availability: 'Available',
            images: 5,
            photos: [
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'
            ],
            amenities: ['Parking', 'WiFi', 'Catering', 'DJ/Music', 'Photography', 'Decoration'],
            description: 'Royal heritage palace with traditional Rajasthani architecture',
            contact: '+91 94567 89012',
            vendorId: 'vendor5'
          },
          {
            id: 6,
            name: 'Modern Convention Center',
            location: 'Hyderabad, Telangana',
            type: 'Hotel',
            capacity: 1000,
            hourlyRate: 20000,
            rating: 4.4,
            reviews: 178,
            availability: 'Available',
            images: 4,
            photos: [
              'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1519167758481-83f29c8e8d4b?w=800&h=600&fit=crop'
            ],
            amenities: ['Parking', 'WiFi', 'Catering', 'Photography'],
            description: 'State-of-the-art convention center with modern facilities',
            contact: '+91 91234 67890',
            vendorId: 'vendor6'
          },
          {
            id: 7,
            name: 'Lakeside Pavilion',
            location: 'Udaipur, Rajasthan',
            type: 'Garden',
            capacity: 250,
            hourlyRate: 14000,
            rating: 4.8,
            reviews: 92,
            availability: 'Available',
            images: 5,
            photos: [
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop'
            ],
            amenities: ['Parking', 'Catering', 'Decoration', 'Photography'],
            description: 'Serene lakeside venue with panoramic water views',
            contact: '+91 97654 32108',
            vendorId: 'vendor7'
          },
          {
            id: 8,
            name: 'Urban Loft Space',
            location: 'Pune, Maharashtra',
            type: 'Rooftop',
            capacity: 120,
            hourlyRate: 10000,
            rating: 4.3,
            reviews: 45,
            availability: 'Available',
            images: 4,
            photos: [
              'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop'
            ],
            amenities: ['WiFi', 'DJ/Music', 'Photography'],
            description: 'Trendy urban loft with industrial chic design',
            contact: '+91 98765 12345',
            vendorId: 'vendor8'
          }
        ];
        localStorage.setItem('venue_catalog', JSON.stringify(mockVenues));
        setVenues(mockVenues);
      } else {
        setVenues(venuesData);
      }
    } catch (error) {
      console.error('Error loading venues:', error);
      setVenues([]);
    }
  };

  const saveVenue = () => {
    if (!formData.name || !formData.location || !formData.capacity || !formData.hourlyRate) {
      alert('Please fill in all required fields');
      return;
    }

    const venueData = {
      ...formData,
      id: editingVenue ? editingVenue.id : Date.now(),
      rating: editingVenue ? editingVenue.rating : 4.0,
      reviews: editingVenue ? editingVenue.reviews : 0,
      images: editingVenue ? editingVenue.images : (formData.photos?.length || 0),
      photos: formData.photos || [],
      availability: editingVenue ? editingVenue.availability : 'Available',
      vendorId: userId,
      amenities: formData.amenities ? Object.keys(formData.amenities).filter(key => formData.amenities[key]) : []
    };

    let updatedVenues;
    if (editingVenue) {
      updatedVenues = venues.map(v => v.id === editingVenue.id ? venueData : v);
    } else {
      updatedVenues = [...venues, venueData];
    }

    setVenues(updatedVenues);
    localStorage.setItem('venue_catalog', JSON.stringify(updatedVenues));
    setShowAddForm(false);
    setEditingVenue(null);
    setFormData({});
  };

  const deleteVenue = (venueId: number) => {
    if (confirm('Are you sure you want to delete this venue?')) {
      const updatedVenues = venues.filter(v => v.id !== venueId);
      setVenues(updatedVenues);
      localStorage.setItem('venue_catalog', JSON.stringify(updatedVenues));
    }
  };

  const bookVenue = () => {
    if (!bookingData.eventDate || !bookingData.duration || !bookingData.eventType) {
      alert('Please fill in all booking details');
      return;
    }

    const booking = {
      id: Date.now(),
      venueId: selectedVenue.id,
      venueName: selectedVenue.name,
      clientId: userId,
      ...bookingData,
      totalCost: selectedVenue.hourlyRate * parseInt(bookingData.duration),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const existingBookings = JSON.parse(localStorage.getItem(`venue_bookings_${userId}`) || '[]');
    const updatedBookings = [...existingBookings, booking];
    localStorage.setItem(`venue_bookings_${userId}`, JSON.stringify(updatedBookings));

    alert(`Booking request sent for ${selectedVenue.name}!`);
    setShowBookingForm(false);
    setSelectedVenue(null);
    setBookingData({});
  };

  const filteredVenues = venues.filter(venue => {
    return (
      (!filters.capacity || venue.capacity >= parseInt(filters.capacity)) &&
      (!filters.price || venue.hourlyRate <= parseInt(filters.price)) &&
      (!filters.type || venue.type === filters.type) &&
      (!filters.location || venue.location.toLowerCase().includes(filters.location.toLowerCase()))
    );
  });


  return (
    <div className="p-3 sm:p-4 md:p-6 w-full max-w-full mx-0 bg-gray-50 min-h-screen">
      <div className="bg-brand-gradient rounded-lg p-6 mb-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Venue Catalog</h1>
            <p className="text-white/90">Discover and book amazing venues for your events</p>
          </div>
          {userType === 'vendor' && (
            <Button 
              onClick={() => {
                setEditingVenue(null);
                setFormData({});
                setShowAddForm(true);
              }}
              className="bg-white text-brand-purple hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Venue
            </Button>
          )}
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Search & Filter Venues</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input 
                type="text" 
                maxLength={50}
                className="w-full p-2 border rounded-md"
                placeholder="City, State"
                value={filters.location}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z\s,.-]/g, '');
                  setFilters({...filters, location: value});
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Capacity</label>
              <input 
                type="number" 
                min="1"
                className="w-full p-2 border rounded-md"
                placeholder="e.g. 100"
                value={filters.capacity}
                onChange={(e) => setFilters({...filters, capacity: e.target.value})}
                onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price/Hour (₹)</label>
              <input 
                type="number" 
                min="1"
                className="w-full p-2 border rounded-md"
                placeholder="e.g. 15000"
                value={filters.price}
                onChange={(e) => setFilters({...filters, price: e.target.value})}
                onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue Type</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="">All Types</option>
                <option value="Banquet Hall">Banquet Hall</option>
                <option value="Garden">Garden</option>
                <option value="Rooftop">Rooftop</option>
                <option value="Beach">Beach</option>
                <option value="Resort">Resort</option>
                <option value="Hotel">Hotel</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => setFilters({ capacity: '', price: '', type: '', location: '' })}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.map(venue => (
          <Card key={venue.id} className="hover:shadow-lg transition-shadow">
            <div className="h-48 rounded-t-lg relative overflow-hidden">
              {venue.photos && venue.photos.length > 0 ? (
                <img 
                  src={venue.photos[0]} 
                  alt={venue.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="bg-brand-gradient w-full h-full flex items-center justify-center"><div class="text-white text-center"><svg class="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg><p class="text-sm">Image Error</p></div></div>';
                    }
                  }}
                />
              ) : (
                <div className="bg-brand-gradient w-full h-full flex items-center justify-center">
                  <div className="text-white text-center">
                    <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                    <p className="text-sm">No Photos</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                {venue.photos?.length || 0} Photos
              </div>
              {userType === 'vendor' && venue.vendorId === userId && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => {
                      setEditingVenue(venue);
                      setFormData(venue);
                      setShowAddForm(true);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => deleteVenue(venue.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{venue.name}</h3>
                <Badge className={venue.availability === 'Available' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}>
                  {venue.availability}
                </Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-600 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {venue.type} • {venue.location}
                </p>
                <p className="text-gray-600 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Capacity: {venue.capacity} guests
                </p>
                <p className="text-lg font-semibold text-green-600 flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  ₹{venue.hourlyRate?.toLocaleString()}/hour
                </p>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-yellow-500">{venue.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">({venue.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-1">
                  {venue.amenities?.slice(0, 3).map((amenity: string) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {venue.amenities?.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{venue.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setSelectedVenue(venue)}
                  className="flex-1 bg-button-gradient text-white"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                {userType === 'client' && venue.availability === 'Available' && (
                  <Button 
                    onClick={() => {
                      setSelectedVenue(venue);
                      setShowBookingForm(true);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Book Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVenues.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No venues match your current filters.</p>
          <Button 
            onClick={() => setFilters({ capacity: '', price: '', type: '', location: '' })}
            className="bg-button-gradient text-white"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Venue Details Modal */}
      {selectedVenue && !showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">{selectedVenue.name}</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedVenue(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="h-48 rounded-lg mb-4 overflow-hidden">
                    {selectedVenue.photos && selectedVenue.photos.length > 0 ? (
                      <div className="relative">
                        <img 
                          src={selectedVenue.photos[0]} 
                          alt={selectedVenue.name}
                          className="w-full h-48 object-cover"
                        />
                        {selectedVenue.photos.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                            +{selectedVenue.photos.length - 1} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-brand-gradient w-full h-48 flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {selectedVenue.photos && selectedVenue.photos.length > 1 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {selectedVenue.photos.slice(1, 4).map((photo: string, index: number) => (
                        <img 
                          key={index}
                          src={photo} 
                          alt={`${selectedVenue.name} ${index + 2}`}
                          className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() => window.open(photo, '_blank')}
                        />
                      ))}
                    </div>
                  )}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-600" />
                      <span>{selectedVenue.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-600" />
                      <span>{selectedVenue.capacity} guests capacity</span>
                    </div>
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-2 text-gray-600" />
                      <span>₹{selectedVenue.hourlyRate?.toLocaleString()}/hour</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-600" />
                      <span>{selectedVenue.contact}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>{selectedVenue.rating} ({selectedVenue.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Description</h4>
                  <p className="text-gray-600 mb-4">{selectedVenue.description}</p>
                  
                  <h4 className="font-semibold mb-3">Amenities</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedVenue.amenities?.map((amenity: string) => (
                      <div key={amenity} className="flex items-center">
                        {amenity === 'Parking' && <Car className="h-4 w-4 mr-2" />}
                        {amenity === 'WiFi' && <Wifi className="h-4 w-4 mr-2" />}
                        {amenity === 'Catering' && <Coffee className="h-4 w-4 mr-2" />}
                        {amenity === 'Photography' && <Camera className="h-4 w-4 mr-2" />}
                        {amenity === 'DJ/Music' && <Music className="h-4 w-4 mr-2" />}
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                  
                  {userType === 'client' && selectedVenue.availability === 'Available' && (
                    <Button 
                      onClick={() => setShowBookingForm(true)}
                      className="w-full mt-6 bg-button-gradient text-white"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book This Venue
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Book {selectedVenue.name}</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setShowBookingForm(false);
                  setBookingData({});
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Date *</label>
                <input 
                  type="date" 
                  value={bookingData.eventDate || ''}
                  onChange={(e) => setBookingData({...bookingData, eventDate: e.target.value})}
                  className="w-full p-2 border rounded"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Duration (hours) *</label>
                <input 
                  type="number" 
                  min="1"
                  max="24"
                  value={bookingData.duration || ''}
                  onChange={(e) => setBookingData({...bookingData, duration: e.target.value})}
                  onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                  className="w-full p-2 border rounded"
                  placeholder="Number of hours"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Event Type *</label>
                <select 
                  value={bookingData.eventType || ''}
                  onChange={(e) => setBookingData({...bookingData, eventType: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Event Type</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Birthday">Birthday Party</option>
                  <option value="Corporate">Corporate Event</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Reception">Reception</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Guest Count</label>
                <input 
                  type="number" 
                  min="1"
                  max={selectedVenue.capacity}
                  value={bookingData.guestCount || ''}
                  onChange={(e) => setBookingData({...bookingData, guestCount: e.target.value})}
                  onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                  className="w-full p-2 border rounded"
                  placeholder={`Max ${selectedVenue.capacity} guests`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Special Requirements</label>
                <textarea 
                  value={bookingData.requirements || ''}
                  onChange={(e) => setBookingData({...bookingData, requirements: e.target.value})}
                  className="w-full p-2 border rounded" 
                  rows={3}
                  placeholder="Any special requirements or notes"
                />
              </div>
              
              {bookingData.duration && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Total Cost:</p>
                  <p className="text-lg font-semibold text-green-600">
                    ₹{(selectedVenue.hourlyRate * parseInt(bookingData.duration || 0)).toLocaleString()}
                  </p>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={bookVenue}
                  className="flex-1 bg-button-gradient text-white"
                >
                  Send Booking Request
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowBookingForm(false);
                    setBookingData({});
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add/Edit Venue Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">{editingVenue ? 'Edit Venue' : 'Add New Venue'}</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingVenue(null);
                  setFormData({});
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Venue Name *</label>
                  <input 
                    type="text" 
                    maxLength={100}
                    value={formData.name || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z0-9\s&.-]/g, '');
                      setFormData({...formData, name: value});
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="Enter venue name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Location *</label>
                  <input 
                    type="text" 
                    maxLength={100}
                    value={formData.location || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z0-9\s,.-]/g, '');
                      setFormData({...formData, location: value});
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="City, State"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Capacity (guests) *</label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                    onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                    className="w-full p-2 border rounded"
                    placeholder="Max guests"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Hourly Rate (₹) *</label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.hourlyRate || ''}
                    onChange={(e) => setFormData({...formData, hourlyRate: parseInt(e.target.value)})}
                    onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                    className="w-full p-2 border rounded"
                    placeholder="Rate per hour"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Venue Type</label>
                  <select 
                    value={formData.type || ''}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Type</option>
                    <option value="Banquet Hall">Banquet Hall</option>
                    <option value="Garden">Garden</option>
                    <option value="Rooftop">Rooftop</option>
                    <option value="Beach">Beach</option>
                    <option value="Resort">Resort</option>
                    <option value="Hotel">Hotel</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Number</label>
                  <input 
                    type="tel" 
                    maxLength={10}
                    value={formData.contact || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        setFormData({...formData, contact: value});
                      }
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="10-digit contact number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded" 
                  rows={3}
                  placeholder="Venue description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Photos</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input 
                      type="url" 
                      placeholder="Enter photo URL (e.g., https://example.com/photo.jpg)"
                      className="flex-1 p-2 border rounded"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const url = e.currentTarget.value.trim();
                          if (url) {
                            const photos = formData.photos || [];
                            setFormData({...formData, photos: [...photos, url]});
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                    <Button 
                      type="button"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        const url = input.value.trim();
                        if (url) {
                          const photos = formData.photos || [];
                          setFormData({...formData, photos: [...photos, url]});
                          input.value = '';
                        }
                      }}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.photos && formData.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {formData.photos.map((photo: string, index: number) => (
                        <div key={index} className="relative group">
                          <img 
                            src={photo} 
                            alt={`Photo ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="absolute top-1 right-1 bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                            onClick={() => {
                              const photos = formData.photos.filter((_: string, i: number) => i !== index);
                              setFormData({...formData, photos});
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Add photo URLs from image hosting services like Unsplash, Imgur, or your own server. Press Enter or click + to add.
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Parking', 'WiFi', 'Catering', 'Photography', 'DJ/Music', 'Decoration'].map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        checked={formData.amenities?.[amenity] || false}
                        onChange={(e) => setFormData({
                          ...formData, 
                          amenities: {
                            ...formData.amenities,
                            [amenity]: e.target.checked
                          }
                        })}
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={saveVenue}
                  className="flex-1 bg-button-gradient text-white"
                >
                  {editingVenue ? 'Update Venue' : 'Add Venue'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingVenue(null);
                    setFormData({});
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}