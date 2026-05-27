import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import { useState, useEffect, useRef } from "react";
import { UserTypeContext } from "./main";

import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import Events from './pages/Events';
import Dashboard from './pages/Dashboard';
import VendorDashboard from './pages/VendorDashboard';
import MyEvents from './pages/MyEvents';
import BrowseVendors from './pages/BrowseVendors';
import Messages from './pages/Messages';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import CreateEvent from './pages/CreateEvent';
import BudgetAnalytics from './pages/BudgetAnalytics';
import Activities from './pages/Activities';
import NotificationsPage from './pages/NotificationsPage';
import RSVPManager from './pages/RSVPManager';
import EventTimeline from './pages/EventTimeline';
import PortfolioManagement from './pages/PortfolioManagement';
import VendorOnboarding from './pages/VendorOnboarding';
import RegistrationForms from './pages/RegistrationForms';
import VenueManagement from './pages/VenueManagement';
import VendorMatching from './pages/VendorMatching';
import ReviewsScorecards from './pages/ReviewsScorecards';
import VenueCatalog from './pages/VenueCatalog';
import VendorMarketplace from './pages/VendorMarketplace';
import RequestQuote from './pages/RequestQuote';
import LineItemBudgeting from './pages/LineItemBudgeting';
import BookingContractTracker from './pages/BookingContractTracker';

import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { initializeData } from "@/lib/jsonData";







function Router() {
  const [userType, setUserType] = useState("customer")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const updateUserType = () => {
      try {
        const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
        if (userStr) {
          const user = JSON.parse(userStr)
          setUserType(user.isVendor ? "vendor" : "customer")
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsAuthenticated(false)
      }
    }
    
    updateUserType()
    initializeData();
    
    // Listen for storage changes
    window.addEventListener('storage', updateUserType)
    
    // Listen for custom user login events
    const handleUserLogin = () => {
      setTimeout(updateUserType, 100)
    }
    window.addEventListener('userLogin', handleUserLogin)
    
    return () => {
      window.removeEventListener('storage', updateUserType)
      window.removeEventListener('userLogin', handleUserLogin)
    }
  }, [])

  return (
    <Switch>
      <Route path="/">
        <Layout><Home /></Layout>
      </Route>
      <Route path="/login">
        {isAuthenticated ? 
          <DashboardLayout userType={userType} /> : 
          <Layout><LoginPage /></Layout>
        }
      </Route>
      <Route path="/signup">
        {isAuthenticated ? 
          <DashboardLayout userType={userType} /> : 
          <Layout><SignupPage /></Layout>
        }
      </Route>
      <Route path="/events">
        <Layout><Events /></Layout>
      </Route>
      <Route path="/dashboard">
        <DashboardLayout userType={userType} />
      </Route>
      <Route path="/vendor-dashboard">
        <DashboardLayout userType={userType} />
      </Route>
      <Route>
        <Layout><NotFound /></Layout>
      </Route>
    </Switch>
  );
}

function DashboardLayout({ }: { userType: string }) {
  const [activeComponent, setActiveComponent] = useState("dashboard")
  const [open, setOpen] = useState(false)
  const [currentUserType, setCurrentUserType] = useState("customer")
  const [, setIsMessagesOpen] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const mainContentRef = useRef<HTMLDivElement>(null)
  
  // Check user type on every render to ensure accuracy
  useEffect(() => {
    const checkUserType = () => {
      const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          const detectedType = user.isVendor === true ? "vendor" : "customer"
          setCurrentUserType(detectedType)
          
          // Show welcome modal for first time login
          const hasSeenWelcome = localStorage.getItem(`welcome_seen_${user.id || user.username}`)
          if (!hasSeenWelcome) {
            setShowWelcomeModal(true)
          }
        } catch (error) {
          console.error('Failed to parse user data in checkUserType:', error);
          setCurrentUserType("customer")
        }
      } else {
        setCurrentUserType("customer")
      }
    }
    
    checkUserType()
    
    // Listen for storage changes instead of polling
    window.addEventListener('storage', checkUserType)
    
    return () => {
      window.removeEventListener('storage', checkUserType)
    }
  }, [])

  useEffect(() => {
    const handleNavigation = (event: CustomEvent) => {
      setActiveComponent(event.detail);
    };

    (window as any).addEventListener('navigate', handleNavigation);
    
    return () => {
      (window as any).removeEventListener('navigate', handleNavigation);
    };
  }, [])

  const isLoggedIn = () => {
    const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
    return !!userStr
  }

  if (!isLoggedIn()) {
    window.location.href = '/';
    return null;
  }

  const allLinks = [
    { label: "Dashboard", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>), component: "dashboard", userTypes: ["customer", "vendor"] },
    
    // Customer-only features
    { label: "My Events", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" /></svg>), component: "my-events", userTypes: ["customer"] },


    { label: "RSVP Manager", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1.01L12 14l-2.99-4.99A2.5 2.5 0 0 0 6.86 8H5.54c-.8 0-1.54.37-2.01 1.01L1 16.5H3.5V22h2v-6h2.5l2.5-4.17L12.5 16H15v6h2z" /></svg>), component: "rsvp-manager", userTypes: ["customer"] },
    { label: "Timeline", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>), component: "event-timeline", userTypes: ["customer"] },
    { label: "Budget Analytics", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2h-4zM10 4h4v2h-4V4zm6 15a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8h10v11z" /></svg>), component: "budget-analytics", userTypes: ["customer"] },
    { label: "Line-Item Budget", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /></svg>), component: "line-item-budgeting", userTypes: ["customer"] },
    { label: "Booking & Contracts", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" /></svg>), component: "booking-contracts", userTypes: ["customer", "vendor"] },
    { label: "Create Event", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>), component: "create-event", userTypes: ["customer"] },
    { label: "Request Quote", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" /></svg>), component: "request-quote", userTypes: ["customer"] },
    
    // Vendor-only features
    { label: "Portfolio Management", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>), component: "portfolio-management", userTypes: ["vendor"] },
    { label: "Vendor Marketplace", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z" /></svg>), component: "vendor-marketplace", userTypes: ["vendor"] },
    { label: "Vendor Onboarding", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>), component: "vendor-onboarding", userTypes: ["vendor"] },
    { label: "Registration Forms", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" /></svg>), component: "registration-forms", userTypes: ["vendor"] },
    { label: "Venue Management", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>), component: "venue-management", userTypes: ["vendor"] },
    { label: "Vendor Matching", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>), component: "vendor-matching", userTypes: ["vendor"] },
    { label: "Reviews & Scorecards", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>), component: "reviews-scorecards", userTypes: ["vendor"] },
    { label: "Venue Catalog", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>), component: "venue-catalog", userTypes: ["vendor"] },
    
    // Shared features
    { label: "Browse Vendors", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2zm0 4.24l-2.18 4.41-4.85.7 3.51 3.42-.83 4.81L12 17.27l4.35 2.29-.83-4.81 3.51-3.42-4.85-.7L12 6.24z" /></svg>), component: "browse-vendors", userTypes: ["customer"] },
    { label: "Payments", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M13.66 7C13.1 5.82 11.9 5 10.5 5S7.9 5.82 7.34 7H6v2h1.34C7.9 10.18 9.1 11 10.5 11s2.6-.82 3.16-2H15V7h-1.34zM10.5 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm7 3H16v2h1.5c.55 0 1 .45 1 1s-.45 1-1 1H16v2h1.5c1.38 0 2.5-1.12 2.5-2.5V14.5c0-1.38-1.12-2.5-2.5-2.5z" /></svg>), component: "payments", userTypes: ["customer"] },

    { label: "Activities", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>), component: "activities", userTypes: ["customer"] },
    { label: "Settings", href: "#", icon: (<svg className="w-5 h-5" fill="#6b21a8" viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l1.86-1.41c.2-.15.25-.42.13-.64l-1.86-3.23c-.12-.22-.39-.3-.61-.22l-2.17.87c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.46 5.42c-.22-.08-.49 0-.61.22L2.99 8.87c-.12.22-.07.49.13.64L4.98 11c-.04.32-.07.65-.07.97 0 .32.03.65.07.97l-1.86 1.41c-.2.15-.25.42-.13.64l1.86 3.23c.12.22.39.3.61.22l2.17-.87c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.17.87c.22.08.49 0 .61-.22l1.86-3.23c.12-.22.07-.49-.13-.64l-1.86-1.41M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5z" /></svg>), component: "settings", userTypes: ["customer", "vendor"] }
  ];
  
  const links = allLinks.filter(link => link.userTypes.includes(currentUserType))

  const renderActiveComponent = () => {
    
    switch (activeComponent) {
      case "dashboard": 
        return currentUserType === "vendor" ? <VendorDashboard /> : <Dashboard />
      case "my-events": return <MyEvents />
      case "browse-vendors": return <BrowseVendors />
      case "messages": return <Messages />
      case "payments": return <Payments />
      case "settings": return <Settings />
      case "create-event": return <CreateEvent />
      case "request-quote": return <RequestQuote />
      case "line-item-budgeting": return <LineItemBudgeting />
      case "booking-contracts": return <BookingContractTracker />


      case "rsvp-manager": return <RSVPManager />
      case "event-timeline": return <EventTimeline />
      case "budget-analytics": return <BudgetAnalytics />

      case "activities": return <Activities />
      case "notifications": return <NotificationsPage />
      case "portfolio-management": return <PortfolioManagement />
      case "vendor-marketplace": return <VendorMarketplace />
      case "vendor-onboarding": return <VendorOnboarding />
      case "registration-forms": return <RegistrationForms />
      case "venue-management": return <VenueManagement />
      case "vendor-matching": return <VendorMatching />
      case "reviews-scorecards": return <ReviewsScorecards />
      case "venue-catalog": return <VenueCatalog />
      default: 
        return currentUserType === "vendor" ? <VendorDashboard /> : <Dashboard />
    }
  }

  const getUserData = () => {
    const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
    try {
      if (userStr) {
        const user = JSON.parse(userStr)
        return {
          name: user.firstName || user.username || 'User',
          email: user.email || 'user@example.com',
          type: user.isVendor ? 'Vendor' : 'Customer'
        }
      }
    } catch (error) {
      console.error('Failed to parse user data in getUserData:', {
        error: error instanceof Error ? error.message : String(error),
        userStr: userStr?.substring(0, 50) + '...'
      });
    }
    return { name: 'User', email: 'user@example.com', type: 'Customer' }
  }
  
  const userData = getUserData()

  const handleLogout = () => {
    sessionStorage.removeItem('partyoria_user')
    localStorage.removeItem('partyoria_user')
    window.location.href = '/'
  }

  const handleWelcomeClose = () => {
    try {
      const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
      if (userStr) {
        const user = JSON.parse(userStr)
        localStorage.setItem(`welcome_seen_${user.id || user.username}`, 'true')
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    setShowWelcomeModal(false)
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="mb-6">
              <img src="/partyoria.gif" alt="Partyoria" className="h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Partyoria!</h2>
              <p className="text-gray-600 mb-4">
                {currentUserType === 'vendor' 
                  ? 'Thank you for joining as a vendor. Start showcasing your services and connect with customers looking for amazing events!'
                  : 'Thank you for joining Partyoria! Start planning your perfect events with our amazing vendors.'
                }
              </p>
            </div>
            <button 
              onClick={handleWelcomeClose}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              OK, Let's Get Started!
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <div className={cn("flex flex-col bg-white w-full flex-1 overflow-hidden")}>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/partyoria.gif" alt="Partyoria" className="h-8" />
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button 
                onClick={() => {
                  if (activeComponent === 'notifications') {
                    setActiveComponent('dashboard')
                  } else {
                    setActiveComponent('notifications')
                  }
                }}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </button>
              
              {/* Profile */}
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-brand-purple text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {userData.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{userData.name}</span>
                </button>
                
                {/* Profile Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-brand-purple text-white rounded-full flex items-center justify-center text-lg font-medium">
                        {userData.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{userData.name}</p>
                        <p className="text-sm text-gray-500">{userData.email}</p>
                        <p className="text-xs text-brand-purple font-medium">{userData.type} Account</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => setActiveComponent('settings')}
                      className="w-full flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5z" />
                      </svg>
                      Settings
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex flex-1 overflow-hidden">
            <Sidebar open={open} setOpen={setOpen}>
              <SidebarBody className="justify-between gap-10 border-r border-purple-200" style={{backgroundColor: 'white'}}>
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                  <div className="mt-2 flex flex-col gap-1">
                    {links.map((link, idx) => {
                      const isActive = activeComponent === link.component;
                      return (
                        <div
                          key={`${link.component}-${idx}`}
                          onClick={() => setActiveComponent(link.component)}
                          className="cursor-pointer rounded-lg mx-1 p-3 mb-1"
                          style={{
                            background: isActive ? '#7c3aed' : 'white',
                            color: isActive ? 'white' : '#6b21a8',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.transform = 'translateY(-4px)'
                              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)'
                              e.currentTarget.style.background = '#e9d5ff'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.transform = 'translateY(0px)'
                              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
                              e.currentTarget.style.background = 'white'
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div style={{color: isActive ? 'white' : '#6b21a8'}}>
                              <svg className="w-5 h-5" fill={isActive ? 'white' : '#6b21a8'} viewBox="0 0 24 24">
                                {link.icon.props.children}
                              </svg>
                            </div>
                            <span style={{color: isActive ? 'white' : '#6b21a8'}} className="font-medium">{link.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </SidebarBody>
            </Sidebar>
            <div ref={mainContentRef} className="flex flex-1 overflow-auto bg-gray-50 relative">
              {renderActiveComponent()}
              
              {/* Messages Float Button */}
              <button 
                onClick={() => {
                  if (activeComponent === 'messages') {
                    setActiveComponent('dashboard')
                    setIsMessagesOpen(false)
                  } else {
                    setActiveComponent('messages')
                    setIsMessagesOpen(true)
                  }
                }}
                className={`fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 ${
                  activeComponent === 'messages' ? 'bg-gray-600' : 'bg-brand-gradient'
                }`}
              >
                {activeComponent === 'messages' ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [isVendor, setIsVendor] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider attribute="class" defaultTheme="light">
          <UserTypeContext.Provider value={{ isVendor, setIsVendor }}>
            <Toaster />
            <Router />
          </UserTypeContext.Provider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;