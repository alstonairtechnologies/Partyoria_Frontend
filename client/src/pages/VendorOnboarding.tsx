import { useState, useEffect } from 'react';

export default function VendorOnboarding() {
  const [onboardingSteps, setOnboardingSteps] = useState<any[]>([]);
  const [completionRate, setCompletionRate] = useState(0);
  const [activeStep, setActiveStep] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID
    const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
    let currentUserId = 'default'
    if (userStr) {
      const user = JSON.parse(userStr)
      currentUserId = user.id || user.username || 'default'
    }
    setUserId(currentUserId)
    
    // Load user-specific onboarding data
    const savedSteps = localStorage.getItem(`vendor_onboarding_${currentUserId}`);
    const steps = savedSteps ? JSON.parse(savedSteps) : [
      { id: 1, title: "Business Profile Setup", description: "Complete your business information", completed: false, required: true },
      { id: 2, title: "Service Categories", description: "Select your service offerings", completed: false, required: true },
      { id: 3, title: "Portfolio Upload", description: "Add photos and case studies", completed: false, required: true },
      { id: 4, title: "Pricing Structure", description: "Set your service rates", completed: false, required: true },
      { id: 5, title: "Availability Calendar", description: "Configure your booking calendar", completed: false, required: false },
      { id: 6, title: "Payment Setup", description: "Connect payment methods", completed: false, required: true },
      { id: 7, title: "Verification Process", description: "Submit documents for verification", completed: false, required: true }
    ];
    
    if (!savedSteps) {
      localStorage.setItem(`vendor_onboarding_${currentUserId}`, JSON.stringify(steps));
    }
    setOnboardingSteps(steps);
    const completed = steps.filter((step: any) => step.completed).length;
    setCompletionRate(Math.round((completed / steps.length) * 100));

    // Load existing user-specific form data
    const loadedData = {};
    ['businessProfile', 'serviceCategories', 'portfolio', 'pricing', 'availability', 'payment', 'verification'].forEach(key => {
      const saved = localStorage.getItem(`vendor_${key}_${currentUserId}`);
      if (saved) (loadedData as any)[key] = JSON.parse(saved);
    });
    setFormData(loadedData);
  }, []);

  const toggleStep = (stepId: number) => {
    const updatedSteps = onboardingSteps.map((step: any) => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );
    setOnboardingSteps(updatedSteps);
    
    const completed = updatedSteps.filter(step => step.completed).length;
    setCompletionRate(Math.round((completed / updatedSteps.length) * 100));
    
    localStorage.setItem(`vendor_onboarding_${userId}`, JSON.stringify(updatedSteps));
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full max-w-full mx-0 bg-white min-h-screen">
      <div className="bg-brand-gradient rounded-lg p-6 mb-6 text-white">
        <h1 className="text-2xl font-semibold text-white mb-2">Vendor Onboarding</h1>
        <p className="text-white/90">Complete your profile setup to start receiving bookings</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">{completionRate}%</span>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-2">
            <div className="bg-brand-purple h-2 rounded-full transition-all duration-300" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>

        <div className="space-y-4">
          {onboardingSteps.map(step => (
            <div key={step.id} className={`border rounded-lg p-4 ${step.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step.completed ? 'bg-brand-gradient text-white' : 'bg-gray-300'}`}>
                    {step.completed ? '✓' : step.id}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {step.required && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Required</span>}
                  <button 
                    onClick={() => step.completed ? toggleStep(step.id) : setActiveStep(step)}
                    className={`px-4 py-2 rounded text-sm font-medium ${step.completed ? 'bg-button-gradient text-white' : 'bg-button-gradient text-white'}`}
                  >
                    {step.completed ? 'Edit' : 'Start'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {completionRate === 100 ? (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Profile Ready!</h3>
            <p className="text-green-800 text-sm mb-4">All steps completed. Click below to activate your vendor profile.</p>
            <button 
              onClick={() => {
                if (userId) {
                  localStorage.setItem(`vendor_profile_activated_${userId}`, 'true');
                }
                alert('🎉 Congratulations! Your vendor profile has been activated and you can now start receiving bookings from clients. Welcome to the Partyoria vendor community!');
              }}
              className="w-full bg-button-gradient text-white py-2 px-4 rounded font-medium"
            >
              Activate Vendor Profile
            </button>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Next Steps</h3>
            <p className="text-blue-800 text-sm">Complete all required steps to activate your vendor profile and start receiving bookings.</p>
          </div>
        )}
      </div>

      {activeStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg" style={{width: '80vw', maxWidth: 'none', maxHeight: '90vh', overflowY: 'auto'}}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{activeStep.title}</h3>
              <button 
                onClick={() => setActiveStep(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {renderStepForm(activeStep)}
          </div>
        </div>
      )}
    </div>
  );

  function renderStepForm(step: any) {
    switch(step.id) {
      case 1: return renderBusinessProfileForm();
      case 2: return renderServiceCategoriesForm();
      case 3: return renderPortfolioUploadForm();
      case 4: return renderPricingStructureForm();
      case 5: return renderAvailabilityCalendarForm();
      case 6: return renderPaymentSetupForm();
      case 7: return renderVerificationProcessForm();
      default: return null;
    }
  }

  function renderBusinessProfileForm() {
    const data = formData.businessProfile || {};
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Business Name *</label>
          <input 
            type="text" 
            maxLength={100}
            value={data.businessName || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^a-zA-Z0-9\s&.-]/g, '');
              setFormData({...formData, businessProfile: {...data, businessName: value}});
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter business name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Business Type *</label>
          <select 
            value={data.businessType || ''}
            onChange={(e) => setFormData({...formData, businessProfile: {...data, businessType: e.target.value}})}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Type</option>
            <option value="catering">Catering</option>
            <option value="photography">Photography</option>
            <option value="venue">Venue</option>
            <option value="decoration">Decoration</option>
            <option value="music">Music/DJ</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Business Address *</label>
          <textarea 
            value={data.address || ''}
            onChange={(e) => setFormData({...formData, businessProfile: {...data, address: e.target.value}})}
            className="w-full p-2 border rounded" rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number *</label>
          <input 
            type="tel" 
            maxLength={10}
            value={data.phone || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 10) {
                setFormData({...formData, businessProfile: {...data, phone: value}});
              }
            }}
            className="w-full p-2 border rounded"
            placeholder="10-digit mobile number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Years in Business *</label>
          <input 
            type="number" 
            min="0"
            max="100"
            value={data.yearsInBusiness || ''}
            onChange={(e) => {
              const value = Math.max(0, parseInt(e.target.value) || 0);
              setFormData({...formData, businessProfile: {...data, yearsInBusiness: value}});
            }}
            onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex space-x-2 pt-4">
          <button 
            onClick={() => saveStepData(1, 'businessProfile')}
            className="flex-1 bg-button-gradient text-white py-2 rounded"
          >
            Save & Complete
          </button>
          <button 
            onClick={() => setActiveStep(null)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  function renderServiceCategoriesForm() {
    const data = formData.serviceCategories || {};
    const categories = ['Catering', 'Photography', 'Videography', 'Decoration', 'Music/DJ', 'Venue', 'Planning', 'Transportation'];
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Your Services *</label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(cat => (
              <label key={cat} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={data.selected?.includes(cat) || false}
                  onChange={(e) => {
                    const selected = data.selected || [];
                    const updated = e.target.checked 
                      ? [...selected, cat]
                      : selected.filter((s: string) => s !== cat);
                    setFormData({...formData, serviceCategories: {...data, selected: updated}});
                  }}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Service Description</label>
          <textarea 
            value={data.description || ''}
            onChange={(e) => setFormData({...formData, serviceCategories: {...data, description: e.target.value}})}
            className="w-full p-2 border rounded" rows={3}
            placeholder="Describe your services in detail..."
          />
        </div>
        <div className="flex space-x-2 pt-4">
          <button 
            onClick={() => saveStepData(2, 'serviceCategories')}
            className="flex-1 bg-button-gradient text-white py-2 rounded"
          >
            Save & Complete
          </button>
          <button 
            onClick={() => setActiveStep(null)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  function renderPortfolioUploadForm() {
    const data = formData.portfolio || {};
    const images = data.images || [];
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const newImages = files.map((file: File) => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));
      setFormData({...formData, portfolio: {...data, images: [...images, ...newImages]}});
    };
    
    const removeImage = (imageId: any) => {
      const updatedImages = images.filter((img: any) => img.id !== imageId);
      setFormData({...formData, portfolio: {...data, images: updatedImages}});
    };
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Portfolio Title *</label>
          <input 
            type="text" 
            maxLength={100}
            value={data.title || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^a-zA-Z0-9\s&.-]/g, '');
              setFormData({...formData, portfolio: {...data, title: value}});
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter portfolio title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Project Category *</label>
          <select 
            value={data.category || ''}
            onChange={(e) => setFormData({...formData, portfolio: {...data, category: e.target.value}})}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Category</option>
            <option value="wedding">Wedding</option>
            <option value="corporate">Corporate Event</option>
            <option value="birthday">Birthday Party</option>
            <option value="decoration">Decoration</option>
            <option value="catering">Catering</option>
            <option value="photography">Photography</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Project Description *</label>
          <textarea 
            value={data.description || ''}
            onChange={(e) => setFormData({...formData, portfolio: {...data, description: e.target.value}})}
            className="w-full p-2 border rounded" rows={3}
            placeholder="Describe your project and what you delivered"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Upload Portfolio Images *</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="portfolio-upload"
            />
            <label htmlFor="portfolio-upload" className="cursor-pointer">
              <div className="text-gray-600">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg font-medium">Click to upload images</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
              </div>
            </label>
          </div>
        </div>
        
        {images.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">Uploaded Images ({images.length})</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image: any) => (
                <div key={image.id} className="relative border rounded-lg overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={image.name}
                    className="w-full h-24 object-cover"
                  />
                  <button 
                    onClick={() => removeImage(image.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                  <div className="p-2">
                    <p className="text-xs text-gray-600 truncate">{image.name}</p>
                    <p className="text-xs text-gray-500">{(image.size / 1024 / 1024).toFixed(1)}MB</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium mb-1">Client Name</label>
          <input 
            type="text" 
            maxLength={100}
            value={data.clientName || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^a-zA-Z0-9\s&.-]/g, '');
              setFormData({...formData, portfolio: {...data, clientName: value}});
            }}
            className="w-full p-2 border rounded"
            placeholder="Client or company name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Project Date</label>
          <input 
            type="date" 
            value={data.projectDate || ''}
            onChange={(e) => setFormData({...formData, portfolio: {...data, projectDate: e.target.value}})}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="flex space-x-2 pt-4">
          <button 
            onClick={() => saveStepData(3, 'portfolio')}
            className="flex-1 bg-button-gradient text-white py-2 rounded"
          >
            Save & Complete
          </button>
          <button 
            onClick={() => setActiveStep(null)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  function renderPricingStructureForm() {
    const data = formData.pricing || {};
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Base Price (₹) *</label>
          <input 
            type="number" 
            min="1"
            step="1"
            value={data.basePrice || ''}
            onChange={(e) => {
              const value = Math.max(1, parseInt(e.target.value) || 1);
              setFormData({...formData, pricing: {...data, basePrice: value}});
            }}
            onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
            className="w-full p-2 border rounded"
            placeholder="Enter price in rupees"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Pricing Model *</label>
          <select 
            value={data.model || ''}
            onChange={(e) => setFormData({...formData, pricing: {...data, model: e.target.value}})}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Model</option>
            <option value="hourly">Hourly Rate</option>
            <option value="fixed">Fixed Price</option>
            <option value="package">Package Deal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Additional Services</label>
          <textarea 
            value={data.additionalServices || ''}
            onChange={(e) => setFormData({...formData, pricing: {...data, additionalServices: e.target.value}})}
            className="w-full p-2 border rounded" rows={3}
          />
        </div>
        <div className="flex space-x-2 pt-4">
          <button 
            onClick={() => saveStepData(4, 'pricing')}
            className="flex-1 bg-button-gradient text-white py-2 rounded"
          >
            Save & Complete
          </button>
          <button 
            onClick={() => setActiveStep(null)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  function renderAvailabilityCalendarForm() {
    const data = formData.availability || {};
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Working Days</label>
          <div className="grid grid-cols-2 gap-2">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <label key={day} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={data.workingDays?.includes(day) || false}
                  onChange={(e) => {
                    const days = data.workingDays || [];
                    const updated = e.target.checked 
                      ? [...days, day]
                      : days.filter((d: string) => d !== day);
                    setFormData({...formData, availability: {...data, workingDays: updated}});
                  }}
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Working Hours</label>
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="time" 
              value={data.startTime || ''}
              onChange={(e) => setFormData({...formData, availability: {...data, startTime: e.target.value}})}
              className="p-2 border rounded"
            />
            <input 
              type="time" 
              value={data.endTime || ''}
              onChange={(e) => setFormData({...formData, availability: {...data, endTime: e.target.value}})}
              className="p-2 border rounded"
            />
          </div>
        </div>
        <div className="flex space-x-2 pt-4">
          <button 
            onClick={() => saveStepData(5, 'availability')}
            className="flex-1 bg-button-gradient text-white py-2 rounded"
          >
            Save & Complete
          </button>
          <button 
            onClick={() => setActiveStep(null)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  function renderPaymentSetupForm() {
    const data = formData.payment || {};
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Payment Methods *</label>
          <div className="space-y-2">
            {['UPI', 'Bank Transfer', 'Credit/Debit Card', 'Cash', 'Paytm', 'PhonePe', 'Google Pay'].map(method => (
              <label key={method} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={data.methods?.includes(method) || false}
                  onChange={(e) => {
                    const methods = data.methods || [];
                    const updated = e.target.checked 
                      ? [...methods, method]
                      : methods.filter((m: string) => m !== method);
                    setFormData({...formData, payment: {...data, methods: updated}});
                  }}
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bank Account Number</label>
          <input 
            type="text" 
            maxLength={18}
            value={data.bankAccount || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 18) {
                setFormData({...formData, payment: {...data, bankAccount: value}});
              }
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter Indian bank account number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">IFSC Code</label>
          <input 
            type="text" 
            maxLength={11}
            value={data.ifscCode || ''}
            onChange={(e) => {
              const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
              if (value.length <= 11) {
                setFormData({...formData, payment: {...data, ifscCode: value}});
              }
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter IFSC code (e.g., SBIN0001234)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">UPI ID</label>
          <input 
            type="text" 
            maxLength={50}
            value={data.upiId || ''}
            onChange={(e) => {
              const value = e.target.value.toLowerCase().replace(/[^a-z0-9@._-]/g, '');
              setFormData({...formData, payment: {...data, upiId: value}});
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter UPI ID (e.g., name@paytm)"
          />
        </div>
        <div className="flex space-x-2 pt-4">
          <button 
            onClick={() => saveStepData(6, 'payment')}
            className="flex-1 bg-button-gradient text-white py-2 rounded"
          >
            Save & Complete
          </button>
          <button 
            onClick={() => setActiveStep(null)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  function renderVerificationProcessForm() {
    const data = formData.verification || {};
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Business License Number *</label>
          <input 
            type="text" 
            value={data.licenseNumber || ''}
            onChange={(e) => setFormData({...formData, verification: {...data, licenseNumber: e.target.value}})}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tax ID Number *</label>
          <input 
            type="text" 
            value={data.taxId || ''}
            onChange={(e) => setFormData({...formData, verification: {...data, taxId: e.target.value}})}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Insurance Policy Number</label>
          <input 
            type="text" 
            value={data.insurancePolicy || ''}
            onChange={(e) => setFormData({...formData, verification: {...data, insurancePolicy: e.target.value}})}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex space-x-2 pt-4">
          <button 
            onClick={() => saveStepData(7, 'verification')}
            className="flex-1 bg-button-gradient text-white py-2 rounded"
          >
            Save & Complete
          </button>
          <button 
            onClick={() => setActiveStep(null)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  function saveStepData(stepId: number, dataKey: string) {
    const stepData = formData[dataKey];
    if (!stepData || Object.keys(stepData).length === 0) {
      alert('Please fill in required fields');
      return;
    }

    // Save to user-specific localStorage
    if (userId) {
      localStorage.setItem(`vendor_${dataKey}_${userId}`, JSON.stringify(stepData));
    }
    
    // Mark step as completed
    const updatedSteps = onboardingSteps.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    );
    setOnboardingSteps(updatedSteps);
    if (userId) {
      localStorage.setItem(`vendor_onboarding_${userId}`, JSON.stringify(updatedSteps));
    }
    
    // Update completion rate
    const completed = updatedSteps.filter(step => step.completed).length;
    const newCompletionRate = Math.round((completed / updatedSteps.length) * 100);
    setCompletionRate(newCompletionRate);
    
    setActiveStep(null);
    
    // Check if all steps are completed
    if (newCompletionRate === 100) {
      alert('🎉 Congratulations! You have successfully completed all onboarding steps! Your vendor profile is now ready to receive bookings. Welcome to the Partyoria vendor community!');
    } else {
      alert('Step completed successfully!');
    }
  }
}