// Initialize JSON data in localStorage for the application
export const initializeData = () => {
  // Initialize users data
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }
  
  // Initialize events data
  if (!localStorage.getItem('events')) {
    localStorage.setItem('events', JSON.stringify([]));
  }
  
  // Initialize vendors data
  if (!localStorage.getItem('vendors')) {
    const mockVendors = [
      { name: "Elite Catering Co.", category: "Catering", rating: 4.8, location: "Mumbai", price: "₹500-800/plate" },
      { name: "Dream Decorators", category: "Decoration", rating: 4.6, location: "Delhi", price: "₹15K-50K" },
      { name: "Sound & Light Pro", category: "Audio/Visual", rating: 4.7, location: "Bangalore", price: "₹10K-25K" },
      { name: "Capture Moments", category: "Photography", rating: 4.9, location: "Pune", price: "₹20K-60K" },
      { name: "Party Planners Plus", category: "Event Planning", rating: 4.5, location: "Chennai", price: "₹25K-100K" },
      { name: "Floral Fantasy", category: "Flowers", rating: 4.4, location: "Hyderabad", price: "₹5K-20K" },
      { name: "DJ Beats", category: "Entertainment", rating: 4.6, location: "Kolkata", price: "₹8K-30K" },
      { name: "Cake Creations", category: "Bakery", rating: 4.8, location: "Mumbai", price: "₹1K-5K" }
    ];
    localStorage.setItem('vendors', JSON.stringify(mockVendors));
  }
  
  // Initialize payments data
  if (!localStorage.getItem('payments')) {
    localStorage.setItem('payments', JSON.stringify([]));
  }
  
  // Initialize messages data
  if (!localStorage.getItem('messages')) {
    localStorage.setItem('messages', JSON.stringify([]));
  }
  
  // Initialize approvals data
  if (!localStorage.getItem('approvals')) {
    localStorage.setItem('approvals', JSON.stringify([]));
  }
  
  // Initialize inquiries data
  if (!localStorage.getItem('inquiries')) {
    localStorage.setItem('inquiries', JSON.stringify([]));
  }
};

// User authentication functions
export const addUser = (userData: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isVendor: boolean;
  phoneNumber?: string;
  city?: string;
  state?: string;
}) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const newUser = {
    id: `user_${Date.now()}`,
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  console.log('User added:', newUser);
};

export const getUserByEmail = (email: string) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.find((user: any) => user.email === email) || null;
};

// Event management functions
export const getEvents = () => {
  return JSON.parse(localStorage.getItem('events') || '[]');
};

export const addEvent = (eventData: any) => {
  const events = getEvents();
  const newEvent = {
    id: `evt_${Date.now()}`,
    ...eventData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  events.push(newEvent);
  localStorage.setItem('events', JSON.stringify(events));
  
  // Trigger dashboard refresh
  window.dispatchEvent(new CustomEvent('dataUpdated'));
  
  return newEvent;
};

// Vendor management functions
export const getVendors = () => {
  return JSON.parse(localStorage.getItem('vendors') || '[]');
};

// Payment management functions
export const getPayments = () => {
  return JSON.parse(localStorage.getItem('payments') || '[]');
};

export const addPayment = (paymentData: any) => {
  const payments = getPayments();
  const newPayment = {
    id: `pay_${Date.now()}`,
    ...paymentData,
    createdAt: new Date().toISOString()
  };
  
  payments.push(newPayment);
  localStorage.setItem('payments', JSON.stringify(payments));
  return newPayment;
};

// Message management functions
export const getMessages = () => {
  return JSON.parse(localStorage.getItem('messages') || '[]');
};

export const addMessage = (messageData: any) => {
  const messages = getMessages();
  const newMessage = {
    id: `msg_${Date.now()}`,
    ...messageData,
    timestamp: new Date().toISOString()
  };
  
  messages.push(newMessage);
  localStorage.setItem('messages', JSON.stringify(messages));
  return newMessage;
};

// Contact inquiry function
export const addInquiry = (inquiry: {
  name: string;
  email: string;
  subject: string;
  message: string;
  isResolved: boolean;
}) => {
  const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
  const newInquiry = {
    id: `inq_${Date.now()}`,
    ...inquiry,
    status: inquiry.isResolved ? 'resolved' : 'pending',
    createdAt: new Date().toISOString()
  };
  
  inquiries.push(newInquiry);
  localStorage.setItem('inquiries', JSON.stringify(inquiries));
  return newInquiry;
};