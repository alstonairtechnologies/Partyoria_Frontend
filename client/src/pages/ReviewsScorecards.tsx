import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, TrendingUp, Users, MessageSquare, Trash2, X } from 'lucide-react';

interface Review {
  id: number;
  client: string;
  event: string;
  rating: number;
  communication: number;
  creativity: number;
  timeliness: number;
  professionalism: number;
  value: number;
  comment: string;
  date: string;
}

interface Scorecard {
  overall: number;
  categories: {
    communication: string;
    creativity: string;
    timeliness: string;
    professionalism: string;
    value: string;
  };
  totalReviews: number;
  responseRate: number;
  repeatClients: number;
}

export default function ReviewsScorecards() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [scorecard, setScorecard] = useState<Partial<Scorecard>>({});
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [] = useState(false);

  const [, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
    const currentUserId = userStr ? String(JSON.parse(userStr).id || JSON.parse(userStr).username || 'default') : 'default'
    setUserId(currentUserId);
  }, []);

  useEffect(() => {
    if (userId) {
      loadReviewsData(userId);
    }
  }, [userId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && userId) {
        loadReviewsData(userId);
      }
    };
    
    const handleFocus = () => {
      if (userId) {
        loadReviewsData(userId);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [userId]);

  const loadReviewsData = (userId: string) => {
    const reviewsData = JSON.parse(localStorage.getItem(`vendor_reviews_${userId}`) || '[]');
    
    // Add mock reviews if none exist
    if (reviewsData.length === 0) {
      const mockReviews = [
        {
          id: 1,
          client: "Priya & Arjun",
          event: "Wedding Reception",
          rating: 5,
          communication: 5,
          creativity: 4,
          timeliness: 5,
          professionalism: 5,
          value: 4,
          comment: "Absolutely amazing service! Everything was perfect and exceeded our expectations.",
          date: "2024-01-15"
        },
        {
          id: 2,
          client: "Tech Corp",
          event: "Corporate Event",
          rating: 4,
          communication: 4,
          creativity: 5,
          timeliness: 3,
          professionalism: 5,
          value: 4,
          comment: "Great creativity and professional service. Could improve on timing.",
          date: "2024-01-10"
        },
        {
          id: 3,
          client: "Meera Sharma",
          event: "Birthday Party",
          rating: 5,
          communication: 5,
          creativity: 5,
          timeliness: 4,
          professionalism: 4,
          value: 5,
          comment: "Fantastic work! Very creative and great value for money.",
          date: "2024-01-05"
        }
      ];
      localStorage.setItem(`vendor_reviews_${userId}`, JSON.stringify(mockReviews));
      setReviews(mockReviews);
    } else {
      setReviews(reviewsData);
    }

    const finalReviews = reviewsData.length === 0 ? JSON.parse(localStorage.getItem(`vendor_reviews_${userId}`) || '[]') : reviewsData;
    
    // Calculate scorecard metrics
    const totalReviews = finalReviews.length;
    const overallRating = totalReviews ? (finalReviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / totalReviews).toFixed(1) : '0';
    
    // Calculate category averages
    const categories = {
      communication: totalReviews ? (finalReviews.reduce((sum: number, r: Review) => sum + (r.communication || 0), 0) / totalReviews).toFixed(1) : '0',
      creativity: totalReviews ? (finalReviews.reduce((sum: number, r: Review) => sum + (r.creativity || 0), 0) / totalReviews).toFixed(1) : '0',
      timeliness: totalReviews ? (finalReviews.reduce((sum: number, r: Review) => sum + (r.timeliness || 0), 0) / totalReviews).toFixed(1) : '0',
      professionalism: totalReviews ? (finalReviews.reduce((sum: number, r: Review) => sum + (r.professionalism || 0), 0) / totalReviews).toFixed(1) : '0',
      value: totalReviews ? (finalReviews.reduce((sum: number, r: Review) => sum + (r.value || 0), 0) / totalReviews).toFixed(1) : '0'
    };

    const scorecard = {
      overall: parseFloat(overallRating),
      categories,
      totalReviews,
      responseRate: 92,
      repeatClients: 68
    };
    
    setScorecard(scorecard);
    localStorage.setItem(`vendor_scorecard_${userId}`, JSON.stringify(scorecard));
  };


  const getCategoryColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };


  const deleteReview = (reviewId: number) => {
    if (confirm('Are you sure you want to delete this review?')) {
      const updated = reviews.filter(r => r.id !== reviewId);
      setReviews(updated);
      if (userId) {
        localStorage.setItem(`vendor_reviews_${userId}`, JSON.stringify(updated));
        loadReviewsData(userId); // Recalculate scorecard
      }
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full max-w-full mx-0 bg-white min-h-screen">
      <div className="bg-brand-gradient rounded-lg p-6 mb-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Reviews & Scorecards</h1>
            <p className="text-white/90">Manage your reviews and track performance metrics</p>
          </div>
          <Button 
            onClick={() => {
              setEditingReview(null);
              setFormData({});
              setShowRequestForm(true);
            }}
            className="bg-white text-brand-purple hover:bg-gray-100"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Request Review
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Overall Rating</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <p className="text-3xl font-bold text-yellow-600">{scorecard.overall || 0}</p>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(scorecard.overall || 0) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Reviews</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{scorecard.totalReviews || 0}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Response Rate</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">{scorecard.responseRate || 0}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Repeat Clients</h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">{scorecard.repeatClients || 0}%</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Performance Scorecard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(scorecard.categories || {}).map(([category, score]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium capitalize text-gray-700">{category}</h3>
                  <span className={`font-bold text-lg ${getCategoryColor(parseFloat(score))}`}>
                    {score}/5
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-brand-purple to-brand-coral h-3 rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${(parseFloat(score || 0) / 5) * 100}%`,
                      transition: 'width 0.5s ease-in-out'
                    }}
                  ></div>
                </div>
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Improvement Suggestions
              </h3>
              <ul className="text-blue-800 text-sm space-y-1">
                {scorecard.categories?.timeliness && parseFloat(scorecard.categories.timeliness) < 4 && <li>• Focus on timeliness to improve overall score</li>}
                {scorecard.categories?.value && parseFloat(scorecard.categories.value) < 4 && <li>• Consider value-added services for better value perception</li>}
                {scorecard.categories?.communication && parseFloat(scorecard.categories.communication) < 4 && <li>• Improve client communication and responsiveness</li>}
                {(scorecard.totalReviews || 0) < 10 && <li>• Request more reviews to build credibility</li>}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Recent Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reviews.map(review => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{review.client}</h3>
                        <p className="text-sm text-gray-600">{review.event}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-500 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < Math.floor(review.rating) ? 'fill-current' : ''}`} />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{review.rating}/5</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {review.date}
                        </Badge>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReview(review.id)}
                          className="text-white hover:text-gray-200 bg-red-500 hover:bg-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                    {review.communication && (
                      <div className="grid grid-cols-5 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium">Comm.</div>
                          <div className="text-gray-600">{review.communication}/5</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">Creative</div>
                          <div className="text-gray-600">{review.creativity}/5</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">Timely</div>
                          <div className="text-gray-600">{review.timeliness}/5</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">Prof.</div>
                          <div className="text-gray-600">{review.professionalism}/5</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">Value</div>
                          <div className="text-gray-600">{review.value}/5</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No reviews yet</p>
                <p className="text-sm text-gray-400 mb-4">Start by adding your first review or requesting one from clients</p>
                <Button 
                  onClick={() => {
                    setEditingReview(null);
                    setFormData({});
                    setShowRequestForm(true);
                  }}
                  className="bg-button-gradient text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Request First Review
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Request Review Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader className="relative">
              <Button 
                variant="ghost" 
                className="absolute top-4 right-4 hover:bg-transparent bg-transparent text-black" 
                size="icon" 
                onClick={() => {
                  setShowRequestForm(false);
                  setEditingReview(null);
                  setFormData({});
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardTitle>Request Review from Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Client Name *</label>
                <Input 
                  value={formData.client || ''}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  placeholder="Enter client name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Client Email *</label>
                <Input 
                  type="email"
                  value={formData.clientEmail || ''}
                  onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                  placeholder="Client's email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Event/Service *</label>
                <Input 
                  value={formData.event || ''}
                  onChange={(e) => setFormData({...formData, event: e.target.value})}
                  placeholder="Event or service provided"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Event Date *</label>
                <Input 
                  type="date"
                  value={formData.eventDate || ''}
                  onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Review Request Message</label>
                <Textarea 
                  value={formData.requestMessage || ''}
                  onChange={(e) => setFormData({...formData, requestMessage: e.target.value})}
                  placeholder="Personal message to include with review request"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Priority Level</label>
                  <Select value={formData.priority || 'normal'} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Follow-up Reminder</label>
                  <Select value={(formData.followUp || 7).toString()} onValueChange={(value) => setFormData({...formData, followUp: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">1 week</SelectItem>
                      <SelectItem value="14">2 weeks</SelectItem>
                      <SelectItem value="30">1 month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => {
                    if (!formData.client || !formData.clientEmail || !formData.event || !formData.eventDate) {
                      alert('Please fill in all required fields');
                      return;
                    }
                    
                    const reviewData = {
                      ...formData,
                      id: Date.now(),
                      rating: 0,
                      comment: `Review request sent to ${formData.client} for ${formData.event}`,
                      date: new Date().toISOString().split('T')[0],
                      status: 'requested'
                    };
                    
                    const updated = [reviewData, ...reviews];
                    setReviews(updated);
                    if (userId) {
                      localStorage.setItem(`vendor_reviews_${userId}`, JSON.stringify(updated));
                    }
                    setShowRequestForm(false);
                    setFormData({});
                    alert('Review request sent successfully!');
                  }}
                  className="flex-1 bg-button-gradient text-white"
                >
                  Send Request
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowRequestForm(false);
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