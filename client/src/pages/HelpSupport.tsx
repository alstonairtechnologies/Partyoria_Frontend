import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Search, 
  ChevronDown, 
  ChevronRight,
  BookOpen,
  Video,
  FileText,
  Clock
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState("")
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    priority: "",
    description: ""
  })
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const faqs = [
    {
      id: 1,
      question: "How do I create a new event?",
      answer: "To create a new event, click on the 'Create New Event' button on your dashboard. Fill in the event details including name, date, location, and guest count. You can then start adding vendors and managing your event timeline."
    },
    {
      id: 2,
      question: "How do I book vendors for my event?",
      answer: "Browse vendors in the 'Browse Vendors' section. You can filter by category, location, and price. Click on a vendor to view their profile and click 'Book This Vendor' to send a booking request with your event details."
    },
    {
      id: 3,
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards, debit cards, UPI payments, and bank transfers. All payments are processed securely through our encrypted payment gateway."
    },
    {
      id: 4,
      question: "Can I cancel or modify my booking?",
      answer: "Yes, you can cancel or modify bookings based on the vendor's cancellation policy. Check the specific terms in your booking confirmation or contact the vendor directly through our messaging system."
    },
    {
      id: 5,
      question: "How do I track my event planning progress?",
      answer: "Your dashboard shows the planning progress for each event. You can also use the checklist feature to track completed tasks and upcoming deadlines."
    },
    {
      id: 6,
      question: "How do I communicate with vendors?",
      answer: "Use the built-in messaging system to communicate with vendors. Go to the 'Messages' section to view all your conversations and send new messages."
    }
  ]

  const supportTickets = [
    {
      id: "TKT-001",
      subject: "Payment issue with vendor booking",
      status: "Open",
      priority: "High",
      created: "2024-01-15",
      lastUpdate: "2024-01-16"
    },
    {
      id: "TKT-002",
      subject: "Unable to access event details",
      status: "In Progress",
      priority: "Medium",
      created: "2024-01-14",
      lastUpdate: "2024-01-15"
    },
    {
      id: "TKT-003",
      subject: "Vendor not responding to messages",
      status: "Resolved",
      priority: "Low",
      created: "2024-01-10",
      lastUpdate: "2024-01-12"
    }
  ]

  const handleTicketSubmit = () => {
    // Submit support ticket
    const ticket = {
      id: `TKT-${String(Date.now()).slice(-3)}`,
      subject: ticketForm.subject,
      category: ticketForm.category,
      priority: ticketForm.priority,
      description: ticketForm.description,
      status: 'Open',
      created: new Date().toISOString().split('T')[0],
      lastUpdate: new Date().toISOString().split('T')[0]
    };
    
    // Save to localStorage
    const existingTickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    existingTickets.push(ticket);
    localStorage.setItem('supportTickets', JSON.stringify(existingTickets));
    
    alert("Support ticket submitted successfully! We'll get back to you within 24 hours.");
    setTicketForm({ subject: "", category: "", priority: "", description: "" });
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full max-w-full mx-0">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 mb-6 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
          <p className="text-white/90 max-w-xl">
            Get help with your events, find answers to common questions, or contact our support team.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mt-20 -mr-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -mb-20 -ml-20"></div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card 
          className="hover:shadow-lg transition-shadow border-0 shadow-md cursor-pointer"
          onClick={() => {
            alert('Live Chat: Opening chat window with support team...');
            // In real app, open chat widget
          }}
        >
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600">Chat with our support team</p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow border-0 shadow-md cursor-pointer"
          onClick={() => {
            window.open('tel:+911800123456', '_self');
          }}
        >
          <CardContent className="p-6 text-center">
            <Phone className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Call Support</h3>
            <p className="text-sm text-gray-600">+91 1800-123-4567</p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow border-0 shadow-md cursor-pointer"
          onClick={() => {
            window.open('mailto:support@partyoria.com?subject=Support Request', '_blank');
          }}
        >
          <CardContent className="p-6 text-center">
            <Mail className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-gray-600">support@partyoria.com</p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow border-0 shadow-md cursor-pointer"
          onClick={() => {
            alert('Video Tutorials: Opening tutorial library...');
            // In real app, navigate to video tutorials page
          }}
        >
          <CardContent className="p-6 text-center">
            <Video className="h-8 w-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Video Tutorials</h3>
            <p className="text-sm text-gray-600">Watch how-to guides</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-6">
                <Input
                  type="text"
                  placeholder="Search FAQs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <Collapsible key={faq.id} open={openFAQ === faq.id} onOpenChange={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left border rounded-lg hover:bg-gray-50">
                      <span className="font-medium">{faq.question}</span>
                      {openFAQ === faq.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <p className="text-gray-600 mt-2">{faq.answer}</p>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Your Support Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{ticket.subject}</h3>
                        <p className="text-sm text-gray-500">Ticket ID: {ticket.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Created: {ticket.created}</span>
                      <span>Last Update: {ticket.lastUpdate}</span>
                    </div>
                    <div className="mt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          alert(`Viewing details for ticket ${ticket.id}: ${ticket.subject}`);
                          // In real app, open ticket details modal or navigate to ticket page
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Submit a Support Ticket
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={ticketForm.category} onValueChange={(value) => setTicketForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing & Payments</SelectItem>
                      <SelectItem value="vendor">Vendor Related</SelectItem>
                      <SelectItem value="account">Account Management</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={ticketForm.priority} onValueChange={(value) => setTicketForm(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed information about your issue..."
                  rows={5}
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <Button 
                onClick={handleTicketSubmit}
                disabled={!ticketForm.subject || !ticketForm.category || !ticketForm.description}
                className="w-full md:w-auto"
              >
                Submit Ticket
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6">
                <BookOpen className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="font-semibold mb-2">User Guide</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Complete guide on how to use Partyoria for planning your events.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    alert('Opening User Guide...');
                    // In real app, navigate to user guide page
                  }}
                >
                  Read Guide
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6">
                <Video className="h-8 w-8 text-red-500 mb-4" />
                <h3 className="font-semibold mb-2">Video Tutorials</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Step-by-step video tutorials for common tasks and features.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    alert('Opening Video Tutorials...');
                    // In real app, navigate to video tutorials page
                  }}
                >
                  Watch Videos
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6">
                <FileText className="h-8 w-8 text-green-500 mb-4" />
                <h3 className="font-semibold mb-2">API Documentation</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Technical documentation for developers and integrations.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    alert('Opening API Documentation...');
                    // In real app, navigate to API docs
                  }}
                >
                  View Docs
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-purple-500 mb-4" />
                <h3 className="font-semibold mb-2">Release Notes</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Latest updates, new features, and improvements to the platform.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    alert('Opening Release Notes...');
                    // In real app, navigate to release notes page
                  }}
                >
                  View Updates
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6">
                <MessageCircle className="h-8 w-8 text-orange-500 mb-4" />
                <h3 className="font-semibold mb-2">Community Forum</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Connect with other users, share tips, and get community support.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    alert('Opening Community Forum...');
                    // In real app, navigate to community forum
                  }}
                >
                  Join Forum
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6">
                <HelpCircle className="h-8 w-8 text-indigo-500 mb-4" />
                <h3 className="font-semibold mb-2">Best Practices</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tips and best practices for successful event planning.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    alert('Opening Best Practices Guide...');
                    // In real app, navigate to best practices page
                  }}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}