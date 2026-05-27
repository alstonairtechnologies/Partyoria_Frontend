import { useState, useEffect } from 'react';

export default function VenueManagement() {
  const [venues, setVenues] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const venuesData = JSON.parse(localStorage.getItem('vendor_venues') || '[]');
    setVenues(venuesData);

    const bookingsData = JSON.parse(localStorage.getItem('vendor_bookings') || '[]');
    setBookings(bookingsData);
  }, []);

  const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.revenue || 0), 0);
  const avgOccupancy = Math.round((bookings.length / (venues.length * 30)) * 100);

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full max-w-full mx-0 bg-white min-h-screen">
      <div className="bg-brand-gradient rounded-lg p-6 mb-6 text-white">
        <h1 className="text-2xl font-semibold text-white mb-2">Venue Management</h1>
        <p className="text-white/90">Manage your venue inventory and bookings</p>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Venue Overview</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-button-gradient text-white px-4 py-2 rounded-lg"
        >
          Add New Venue
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Venues</h3>
          <p className="text-3xl font-bold text-brand-purple">{venues.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Active Bookings</h3>
          <p className="text-3xl font-bold text-brand-coral">{bookings.filter(b => b.status === 'confirmed').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Monthly Revenue</h3>
          <p className="text-3xl font-bold text-brand-purple">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Occupancy Rate</h3>
          <p className="text-3xl font-bold text-brand-coral">{avgOccupancy}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Venue Inventory</h2>
          </div>
          <div className="p-6">
            {venues.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No venues added yet. Add your first venue to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {venues.map(venue => (
                  <div key={venue.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{venue.name}</h3>
                        <p className="text-gray-600">Capacity: {venue.capacity} guests</p>
                        <p className="text-sm text-gray-500">₹{venue.hourlyRate || 0}/hour</p>
                        <p className="text-sm text-yellow-600">★ {venue.rating || 4.0} ({venue.bookings || 0} bookings)</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs ${venue.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {venue.status}
                        </span>
                        <div className="mt-2 space-x-2">
                          <button 
                            onClick={() => {
                              setEditingVenue(venue);
                              setFormData(venue);
                              setShowAddForm(true);
                            }}
                            className="text-blue-600 text-sm hover:underline"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`Delete ${venue.name}?`)) {
                                const updated = venues.filter(v => v.id !== venue.id);
                                setVenues(updated);
                                localStorage.setItem('vendor_venues', JSON.stringify(updated));
                              }
                            }}
                            className="text-red-600 text-sm hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Recent Bookings</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{booking.venue}</h3>
                      <p className="text-gray-600">{booking.client}</p>
                      <p className="text-sm text-gray-500">{booking.date} • {booking.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{(booking.revenue || 0).toLocaleString()}</p>
                      <span className={`px-2 py-1 rounded text-xs ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{editingVenue ? 'Edit Venue' : 'Add New Venue'}</h3>
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingVenue(null);
                  setFormData({});
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
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
                <label className="block text-sm font-medium mb-1">Venue Type *</label>
                <select 
                  value={formData.type || ''}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Type</option>
                  <option value="Indoor">Indoor</option>
                  <option value="Outdoor">Outdoor</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Capacity *</label>
                <input 
                  type="number" 
                  min="1"
                  max="10000"
                  value={formData.capacity || ''}
                  onChange={(e) => {
                    const value = Math.max(1, parseInt(e.target.value) || 1);
                    setFormData({...formData, capacity: value});
                  }}
                  onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                  className="w-full p-2 border rounded"
                  placeholder="Maximum guests"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Hourly Rate *</label>
                <input 
                  type="number" 
                  min="1"
                  step="1"
                  value={formData.hourlyRate || ''}
                  onChange={(e) => {
                    const value = Math.max(1, parseInt(e.target.value) || 1);
                    setFormData({...formData, hourlyRate: value});
                  }}
                  onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                  className="w-full p-2 border rounded"
                  placeholder="Price per hour"
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
                  placeholder="Venue location"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  {['A/V Equipment', 'Catering Kitchen', 'Parking', 'WiFi', 'Air Conditioning', 'Garden Setting', 'City Views', 'Bar Setup'].map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={formData.amenities?.includes(amenity) || false}
                        onChange={(e) => {
                          const amenities = formData.amenities || [];
                          const updated = e.target.checked 
                            ? [...amenities, amenity]
                            : amenities.filter((a: string) => a !== amenity);
                          setFormData({...formData, amenities: updated});
                        }}
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
              

              
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select 
                  value={formData.status || 'available'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-6">
              <button 
                onClick={() => {
                  if (!formData.name || !formData.type || !formData.capacity || !formData.hourlyRate || !formData.location) {
                    alert('Please fill in all required fields');
                    return;
                  }
                  
                  const venueData = {
                    ...formData,
                    id: editingVenue ? editingVenue.id : Date.now(),
                    bookings: formData.bookings || 0,
                    rating: formData.rating || 4.0,
                    amenities: formData.amenities || [],
                    images: formData.images || 1
                  };
                  
                  let updated;
                  if (editingVenue) {
                    updated = venues.map(v => v.id === editingVenue.id ? venueData : v);
                  } else {
                    updated = [...venues, venueData];
                  }
                  
                  setVenues(updated);
                  localStorage.setItem('vendor_venues', JSON.stringify(updated));
                  setShowAddForm(false);
                  setEditingVenue(null);
                  setFormData({});
                }}
                className="flex-1 bg-button-gradient text-white py-2 rounded"
              >
                {editingVenue ? 'Update Venue' : 'Add Venue'}
              </button>
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingVenue(null);
                  setFormData({});
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}