import { useLocation } from "wouter";

export default function CustomerHome() {
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    sessionStorage.removeItem('partyoria_user');
    localStorage.removeItem('partyoria_user');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logout button */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <img src="/partyoria.gif" alt="Partyoria Logo" style={{ height: "40px" }} />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5z" />
            </svg>
            Logout
          </button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Your Customer Dashboard</h1>
          <p className="text-xl text-gray-600">Plan and manage your perfect events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/dashboard')}>
            <div className="text-blue-600 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
            <p className="text-gray-600">Access your main dashboard with all event management tools</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/dashboard')}>
            <div className="text-green-600 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Create Event</h3>
            <p className="text-gray-600">Start planning your next amazing event</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/dashboard')}>
            <div className="text-purple-600 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2zm0 4.24l-2.18 4.41-4.85.7 3.51 3.42-.83 4.81L12 17.27l4.35 2.29-.83-4.81 3.51-3.42-4.85-.7L12 6.24z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Browse Vendors</h3>
            <p className="text-gray-600">Find the perfect vendors for your event</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/dashboard')}>
            <div className="text-orange-600 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Budget Tracker</h3>
            <p className="text-gray-600">Keep track of your event expenses</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/dashboard')}>
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1.01L12 14l-2.99-4.99A2.5 2.5 0 0 0 6.86 8H5.54c-.8 0-1.54.37-2.01 1.01L1 16.5H3.5V22h2v-6h2.5l2.5-4.17L12.5 16H15v6h2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">RSVP Manager</h3>
            <p className="text-gray-600">Manage guest invitations and responses</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/dashboard')}>
            <div className="text-indigo-600 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Event Timeline</h3>
            <p className="text-gray-600">Track milestones and deadlines</p>
          </div>
        </div>
      </div>
    </div>
  );
}