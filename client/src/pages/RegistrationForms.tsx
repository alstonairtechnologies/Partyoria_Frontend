import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Form name is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  audience: z.string().min(1, 'Target audience is required'),
  description: z.string().optional(),
  notificationEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  status: z.enum(['draft', 'active']),
  requiresApproval: z.boolean().optional(),
  allowMultipleSubmissions: z.boolean().optional(),
  sendConfirmationEmail: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FormItem extends FormValues {
  id: number;
  fields: number;
  submissions: number;
  created: string;
  updated: string;
}

export default function RegistrationForms() {
  const [forms, setForms] = useState<FormItem[]>([]);
  const [activeForm, setActiveForm] = useState<FormItem | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingForm, setEditingForm] = useState<FormItem | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      purpose: '',
      audience: '',
      description: '',
      notificationEmail: '',
      status: 'draft',
      requiresApproval: false,
      allowMultipleSubmissions: false,
      sendConfirmationEmail: false,
    },
  });


  useEffect(() => {
    const formsData = JSON.parse(localStorage.getItem('vendor_forms') || '[]');
    setForms(formsData);
  }, []);

  const onSubmit = (data: FormValues) => {
    const newFormData: FormItem = {
      ...data,
      id: editingForm ? editingForm.id : Date.now(),
      fields: 8,
      submissions: editingForm ? editingForm.submissions || 0 : 0,
      created: editingForm ? editingForm.created : new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0]
    };
    
    let updated: FormItem[];
    if (editingForm) {
      updated = forms.map(f => f.id === editingForm.id ? newFormData : f);
    } else {
      updated = [...forms, newFormData];
    }
    
    setForms(updated);
    localStorage.setItem('vendor_forms', JSON.stringify(updated));
    setShowCreateForm(false);
    setEditingForm(null);
    form.reset();
  };





  const formFields = [
    { id: 1, label: "Business Name", type: "text", required: true },
    { id: 2, label: "Email Address", type: "email", required: true },
    { id: 3, label: "Phone Number", type: "tel", required: true },
    { id: 4, label: "Category", type: "select", required: true, options: ["Catering", "Decoration", "DJ", "Photography", "Venue", "Cake", "Mehendi", "Makeup"] },
    { id: 5, label: "Location", type: "text", required: true },
    { id: 6, label: "Starting Price", type: "number", required: true },
    { id: 7, label: "Description", type: "textarea", required: true },
    { id: 8, label: "Experience", type: "text", required: false },
    { id: 9, label: "Service Capacity", type: "text", required: false },
    { id: 10, label: "Specialties", type: "textarea", required: false }
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full max-w-full mx-0 bg-white min-h-screen">
      <div className="bg-brand-gradient rounded-lg p-6 mb-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Registration Forms Management</h1>
            <p className="text-white/90">Create and manage registration forms for your events and services</p>
          </div>
          <Button 
            onClick={() => {
              setEditingForm(null);
              form.reset();
              setShowCreateForm(true);
            }}
            className="bg-white text-brand-purple hover:bg-gray-100 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New Form
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Total Forms</h3>
            <p className="text-3xl font-bold text-blue-600">{forms.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Active Forms</h3>
            <p className="text-3xl font-bold text-green-600">{forms.filter(f => f.status === 'active').length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Form Submissions</h3>
            <p className="text-3xl font-bold text-purple-600">{forms.reduce((sum, f) => sum + (f.submissions || 0), 0)}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Draft Forms</h3>
            <p className="text-3xl font-bold text-orange-600">{forms.filter(f => f.status === 'draft').length}</p>
          </CardContent>
        </Card>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Form Management</h2>
          </div>
          <div className="p-6">
            {forms.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No forms created yet. Create your first form to start collecting submissions!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {forms.map(formItem => (
                  <div key={formItem.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{formItem.name}</h3>
                        <p className="text-sm text-gray-600">{formItem.fields || 8} fields • {formItem.submissions || 0} submissions</p>
                        <p className="text-xs text-gray-500">Created: {formItem.created}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setActiveForm(formItem)}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Preview
                        </button>
                        <button 
                          onClick={() => {
                            setEditingForm(formItem);
                            form.reset({
                              name: formItem.name || '',
                              purpose: formItem.purpose || '',
                              audience: formItem.audience || '',
                              description: formItem.description || '',
                              notificationEmail: formItem.notificationEmail || '',
                              status: formItem.status || 'draft',
                              requiresApproval: formItem.requiresApproval || false,
                              allowMultipleSubmissions: formItem.allowMultipleSubmissions || false,
                              sendConfirmationEmail: formItem.sendConfirmationEmail || false,
                            });
                            setShowCreateForm(true);
                          }}
                          className="text-green-600 text-sm hover:underline"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Delete ${formItem.name}?`)) {
                              const updated = forms.filter(f => f.id !== formItem.id);
                              setForms(updated);
                              localStorage.setItem('vendor_forms', JSON.stringify(updated));
                              if (activeForm?.id === formItem.id) setActiveForm(null);
                            }
                          }}
                          className="text-red-600 text-sm hover:underline"
                        >
                          Delete
                        </button>
                        <button 
                          onClick={() => {
                            const updated = forms.map(f => 
                              f.id === formItem.id ? {...f, status: f.status === 'active' ? 'draft' as const : 'active' as const} : f
                            );
                            setForms(updated);
                            localStorage.setItem('vendor_forms', JSON.stringify(updated));
                          }}
                          className={`px-2 py-1 rounded text-xs ${formItem.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                        >
                          {formItem.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
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
            <h2 className="text-xl font-semibold">Form Preview</h2>
          </div>
          <div className="p-6">
            {activeForm ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{activeForm.name}</h3>
                {formFields.slice(0, activeForm.fields).map(field => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea className="w-full p-2 border rounded-md" rows={3} disabled />
                    ) : field.type === 'select' ? (
                      <select className="w-full p-2 border rounded-md" disabled>
                        <option>Select an option</option>
                        {field.options?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input type={field.type} className="w-full p-2 border rounded-md" disabled />
                    )}
                  </div>
                ))}
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md" disabled>
                  Submit Form
                </button>
              </div>
            ) : (
              <p className="text-gray-500">Select a form to preview</p>
            )}
          </div>
        </div>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
            <CardHeader className="relative">
              <Button 
                variant="ghost" 
                className="absolute top-4 right-4 hover:bg-transparent bg-transparent text-black" 
                size="icon" 
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingForm(null);
                  form.reset();
                }}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl font-bold">
                {editingForm ? 'Edit Form' : 'Create New Form'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter form name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Purpose</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="event-registration">Event Registration</SelectItem>
                            <SelectItem value="vendor-application">Vendor Application</SelectItem>
                            <SelectItem value="service-inquiry">Service Inquiry</SelectItem>
                            <SelectItem value="partnership-request">Partnership Request</SelectItem>
                            <SelectItem value="feedback">Feedback Form</SelectItem>
                            <SelectItem value="contact">Contact Form</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="audience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select audience" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="customers">Customers</SelectItem>
                            <SelectItem value="vendors">Vendors</SelectItem>
                            <SelectItem value="partners">Partners</SelectItem>
                            <SelectItem value="general">General Public</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the purpose and use of this form" 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notificationEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notification Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Email to receive form submissions" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <FormLabel>Form Settings</FormLabel>
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="requiresApproval"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <input 
                                type="checkbox" 
                                checked={field.value}
                                onChange={field.onChange}
                                className="rounded border-gray-300"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Requires approval before activation
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="allowMultipleSubmissions"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <input 
                                type="checkbox" 
                                checked={field.value}
                                onChange={field.onChange}
                                className="rounded border-gray-300"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Allow multiple submissions from same user
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sendConfirmationEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <input 
                                type="checkbox" 
                                checked={field.value}
                                onChange={field.onChange}
                                className="rounded border-gray-300"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Send confirmation email to submitters
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingForm ? 'Update Form' : 'Create Form'}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingForm(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}



    </div>
  );
}