import { useState, useEffect } from 'react';

// Mock client requests for dynamic matching
const mockClientRequests = [
  { id: 1, client: 'Priya & Arjun', event: 'Wedding Reception', eventType: 'Wedding', date: '2024-02-15', budget: '₹50,000', location: 'Mumbai', guests: 200 },
  { id: 2, client: 'Tech Corp', event: 'Annual Conference', eventType: 'Corporate Event', date: '2024-02-20', budget: '₹75,000', location: 'Bangalore', guests: 150 },
  { id: 3, client: 'Rahul Sharma', event: '25th Birthday Party', eventType: 'Birthday Party', date: '2024-02-18', budget: '₹25,000', location: 'Delhi', guests: 80 },
  { id: 4, client: 'Meera & Vikram', event: '10th Anniversary', eventType: 'Anniversary', date: '2024-02-25', budget: '₹40,000', location: 'Hyderabad', guests: 100 },
  { id: 5, client: 'Startup Hub', event: 'Product Launch', eventType: 'Corporate Event', date: '2024-03-01', budget: '₹60,000', location: 'Pune', guests: 120 },
  { id: 6, client: 'Anita Gupta', event: 'Baby Shower', eventType: 'Baby Shower', date: '2024-02-22', budget: '₹20,000', location: 'Chennai', guests: 50 },
  { id: 7, client: 'College Alumni', event: 'Reunion Party', eventType: 'Graduation', date: '2024-03-05', budget: '₹35,000', location: 'Kolkata', guests: 90 },
  { id: 8, client: 'NGO Foundation', event: 'Charity Gala', eventType: 'Fundraiser', date: '2024-03-10', budget: '₹80,000', location: 'Mumbai', guests: 250 }
];

export default function VendorMatching() {
  const [matches, setMatches] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any>({});
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [formData, setFormData] = useState<{
    eventTypes: string[];
    budgetRange: string;
    location: string;
    availability: string;
    minBudget: string;
    maxBudget: string;
    radius: string;
  }>({
    eventTypes: [],
    budgetRange: '',
    location: '',
    availability: '',
    minBudget: '',
    maxBudget: '',
    radius: ''
  });

  useEffect(() => {
    const prefsData = JSON.parse(localStorage.getItem('vendor_preferences') || '{}');
    setPreferences(prefsData);
    setFormData({
      eventTypes: prefsData.eventTypes || [],
      budgetRange: prefsData.budgetRange || '',
      location: prefsData.location || '',
      availability: prefsData.availability || '',
      minBudget: prefsData.minBudget || '',
      maxBudget: prefsData.maxBudget || '',
      radius: prefsData.radius || ''
    });
    
    // Generate matches when preferences exist
    if (prefsData.eventTypes && prefsData.eventTypes.length > 0) {
      generateMatches(prefsData);
    }
  }, []);

  const generateMatches = (prefs: any) => {
    const dynamicMatches = mockClientRequests.map(request => {
      let score = 0;
      
      // Event type matching (40% weight)
      if (prefs.eventTypes && prefs.eventTypes.includes(request.eventType)) {
        score += 40;
      }
      
      // Budget matching (30% weight)
      const requestBudget = parseInt(request.budget.replace(/[^0-9]/g, ''));
      const minBudget = parseInt(prefs.minBudget || '0');
      const maxBudget = parseInt(prefs.maxBudget || '999999');
      if (requestBudget >= minBudget && requestBudget <= maxBudget) {
        score += 30;
      } else if (requestBudget >= minBudget * 0.8 && requestBudget <= maxBudget * 1.2) {
        score += 15; // Partial match
      }
      
      // Location matching (20% weight)
      if (prefs.location && request.location.toLowerCase().includes(prefs.location.toLowerCase())) {
        score += 20;
      }
      
      // Random factor (10% weight) for variety
      score += Math.random() * 10;
      
      return {
        ...request,
        match: Math.min(Math.round(score), 100),
        status: 'new'
      };
    })
    .filter(match => match.match >= 30) // Only show matches above 30%
    .sort((a, b) => b.match - a.match) // Sort by match score
    .slice(0, 6); // Limit to top 6 matches
    
    setMatches(dynamicMatches);
    localStorage.setItem('vendor_matches', JSON.stringify(dynamicMatches));
  };

  const handleEventTypeToggle = (eventType: string) => {
    setFormData(prev => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(eventType)
        ? prev.eventTypes.filter(type => type !== eventType)
        : [...prev.eventTypes, eventType]
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePreferences = () => {
    const updatedPreferences = {
      ...formData,
      budgetRange: `₹${formData.minBudget} - ₹${formData.maxBudget}`
    };
    
    localStorage.setItem('vendor_preferences', JSON.stringify(updatedPreferences));
    setPreferences(updatedPreferences);
    generateMatches(updatedPreferences); // Regenerate matches with new preferences
    setShowPreferencesModal(false);
  };

  const handleDeletePreferences = () => {
    if (confirm('Are you sure you want to delete all preferences? This will clear all your matching criteria.')) {
      localStorage.removeItem('vendor_preferences');
      localStorage.removeItem('vendor_matches');
      setPreferences({});
      setMatches([]);
      setFormData({
        eventTypes: [],
        budgetRange: '',
        location: '',
        availability: '',
        minBudget: '',
        maxBudget: '',
        radius: ''
      });
    }
  };

  const eventTypeOptions = [
    'Wedding', 'Corporate Event', 'Birthday Party', 'Anniversary', 
    'Baby Shower', 'Graduation', 'Holiday Party', 'Fundraiser'
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'proposal_sent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'text-green-600';
    if (match >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 w-full max-w-full mx-0 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-brand-gradient rounded-xl p-8 mb-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Vendor Matching</h1>
            <p className="text-white/90">Find your perfect clients with intelligent matching</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowPreferencesModal(true)}
              className="bg-button-gradient text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 font-medium"
            >
              Update Preferences
            </button>
            {Object.keys(preferences).length > 0 && (
              <button 
                onClick={handleDeletePreferences}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-200 font-medium"
              >
                Delete Preferences
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">New Matches</h3>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">{matches.filter(m => m.status === 'new').length}</p>
          <p className="text-xs text-gray-500 mt-1">Available now</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{matches.filter(m => m.status !== 'new').length}</p>
          <p className="text-xs text-gray-500 mt-1">Active conversations</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Avg Match Score</h3>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">{matches.length > 0 ? Math.round(matches.reduce((sum, m) => sum + m.match, 0) / matches.length) : 0}%</p>
          <p className="text-xs text-gray-500 mt-1">Compatibility rate</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600">73%</p>
          <p className="text-xs text-gray-500 mt-1">Success rate</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Matches Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Potential Matches</h2>
                <span className="text-sm text-gray-500">{matches.length} matches found</span>
              </div>
            </div>
            
            <div className="p-6">
              {matches.length > 0 ? (
                <div className="space-y-6">
                  {matches.map(match => (
                    <div key={match.id} className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-semibold text-lg text-gray-900">{match.client}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                              {match.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-gray-700 font-medium mb-2">{match.event}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              📅 {match.date}
                            </span>
                            <span className="flex items-center gap-1">
                              💰 {match.budget}
                            </span>
                            <span className="flex items-center gap-1">
                              📍 {match.location}
                            </span>
                            <span className="flex items-center gap-1">
                              👥 {match.guests} guests
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right ml-6">
                          <div className={`text-3xl font-bold mb-1 ${getMatchColor(match.match)}`}>
                            {match.match}%
                          </div>
                          <p className="text-xs text-gray-500 mb-4">Match Score</p>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                const updated = matches.map(m => 
                                  m.id === match.id ? {...m, status: 'contacted'} : m
                                );
                                setMatches(updated);
                                localStorage.setItem('vendor_matches', JSON.stringify(updated));
                              }}
                              className="bg-button-gradient text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
                            >
                              Contact
                            </button>
                            <button 
                              onClick={() => {
                                const updated = matches.filter(m => m.id !== match.id);
                                setMatches(updated);
                                localStorage.setItem('vendor_matches', JSON.stringify(updated));
                              }}
                              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              Pass
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
                  <p className="text-gray-600 mb-4">Set your preferences to start finding potential clients</p>
                  <button 
                    onClick={() => setShowPreferencesModal(true)}
                    className="bg-button-gradient text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-colors"
                  >
                    Set Preferences
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preferences Sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Matching Preferences</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Event Types</h3>
              <div className="flex flex-wrap gap-2">
                {preferences.eventTypes?.length > 0 ? (
                  preferences.eventTypes.map((type: string) => (
                    <span key={type} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                      {type}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No event types selected</span>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Budget Range</h3>
              <p className="text-gray-700">{preferences.budgetRange || 'Not set'}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Location</h3>
              <p className="text-gray-700">{preferences.location || 'Not set'}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Availability</h3>
              <p className="text-gray-700">{preferences.availability || 'Not set'}</p>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => setShowPreferencesModal(true)}
                className="w-full bg-button-gradient text-white py-3 rounded-lg font-medium hover:opacity-90 transition-colors"
              >
                Edit Preferences
              </button>
              {Object.keys(preferences).length > 0 && (
                <button 
                  onClick={handleDeletePreferences}
                  className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Delete All Preferences
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Update Matching Preferences</h2>
              <button 
                onClick={() => setShowPreferencesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSavePreferences(); }} className="space-y-6">
              {/* Event Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Event Types</label>
                <div className="grid grid-cols-2 gap-2">
                  {eventTypeOptions.map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.eventTypes.includes(type)}
                        onChange={() => handleEventTypeToggle(type)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Budget (₹)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.minBudget}
                    onChange={(e) => {
                      const value = Math.max(1, parseInt(e.target.value) || 1);
                      handleInputChange('minBudget', value.toString());
                    }}
                    onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="20000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Budget (₹)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.maxBudget}
                    onChange={(e) => {
                      const value = Math.max(1, parseInt(e.target.value) || 1);
                      handleInputChange('maxBudget', value.toString());
                    }}
                    onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100000"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Location</label>
                <input
                  type="text"
                  maxLength={100}
                  value={formData.location}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z\s,.-]/g, '');
                    handleInputChange('location', value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mumbai, Maharashtra"
                />
              </div>

              {/* Service Radius */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Radius (km)</label>
                <select
                  value={formData.radius}
                  onChange={(e) => handleInputChange('radius', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select radius</option>
                  <option value="15">15 km</option>
                  <option value="40">40 km</option>
                  <option value="80">80 km</option>
                  <option value="160">160 km</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select availability</option>
                  <option value="Weekends only">Weekends only</option>
                  <option value="Weekdays only">Weekdays only</option>
                  <option value="Any day">Any day</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPreferencesModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-button-gradient text-white rounded-md hover:opacity-90 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}