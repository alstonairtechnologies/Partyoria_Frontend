import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function PortfolioManagement() {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalProjects: 0, avgRating: 0, totalRevenue: 0 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
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
    
    loadPortfolioData(currentUserId);
  }, []);

  const loadPortfolioData = (userId: string) => {
    try {
      const portfolioData = JSON.parse(localStorage.getItem(`vendor_portfolio_${userId}`) || '[]');
      const portfolioArray = Array.isArray(portfolioData) ? portfolioData : [];
      setPortfolio(portfolioArray);

      const totalProjects = portfolioArray.length;
      const avgRating = portfolioArray.length ? portfolioArray.reduce((sum: number, p: any) => sum + (p.rating || 0), 0) / portfolioArray.length : 0;
      const totalRevenue = portfolioArray.length ? portfolioArray.reduce((sum: number, p: any) => sum + (parseInt(p.budget) || 0), 0) : 0;
      setStats({ totalProjects, avgRating, totalRevenue });
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setPortfolio([]);
      setStats({ totalProjects: 0, avgRating: 0, totalRevenue: 0 });
    }
  };

  const saveProject = () => {
    if (!formData.title || !formData.client || !formData.budget) {
      alert('Please fill in required fields');
      return;
    }

    try {
      const projectData = {
        ...formData,
        id: editingProject ? editingProject.id : Date.now(),
        createdAt: editingProject ? editingProject.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        budget: parseInt(formData.budget) || 0,
        rating: parseFloat(formData.rating) || 0
      };

      const updated = editingProject 
        ? portfolio.map((p: any) => p.id === editingProject.id ? projectData : p)
        : [...portfolio, projectData];

      setPortfolio(updated);
      localStorage.setItem(`vendor_portfolio_${userId}`, JSON.stringify(updated));
      
      // Update stats
      const totalProjects = updated.length;
      const avgRating = updated.length ? updated.reduce((sum: number, p: any) => sum + (p.rating || 0), 0) / updated.length : 0;
      const totalRevenue = updated.length ? updated.reduce((sum: number, p: any) => sum + (parseInt(p.budget) || 0), 0) : 0;
      setStats({ totalProjects, avgRating, totalRevenue });

      setShowAddForm(false);
      setEditingProject(null);
      setFormData({});
      alert(`Project ${editingProject ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project');
    }
  };

  const deleteProject = (projectId: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const updated = portfolio.filter((p: any) => p.id !== projectId);
        setPortfolio(updated);
        localStorage.setItem(`vendor_portfolio_${userId}`, JSON.stringify(updated));
        
        // Update stats
        const totalProjects = updated.length;
        const avgRating = updated.length ? updated.reduce((sum: number, p: any) => sum + (p.rating || 0), 0) / updated.length : 0;
        const totalRevenue = updated.length ? updated.reduce((sum: number, p: any) => sum + (parseInt(p.budget) || 0), 0) : 0;
        setStats({ totalProjects, avgRating, totalRevenue });
        
        alert('Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project');
      }
    }
  };

  const editProject = (project: any) => {
    setEditingProject(project);
    setFormData(project);
    setShowAddForm(true);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full max-w-full mx-0 bg-white min-h-screen">
      <div className="bg-brand-gradient rounded-lg p-6 mb-6 text-white">
        <h1 className="text-2xl font-semibold text-white mb-2">Portfolio Management</h1>
        <p className="text-white/90">Showcase your work and manage your projects</p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Project Overview</h2>
        <Button 
          onClick={() => {
            setEditingProject(null);
            setFormData({});
            setShowAddForm(true);
          }}
          className="bg-button-gradient text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Total Projects</h3>
            <p className="text-3xl font-bold text-brand-purple">{stats.totalProjects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Average Rating</h3>
            <p className="text-3xl font-bold text-brand-coral">{stats.avgRating.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
            <p className="text-3xl font-bold text-brand-purple">₹{stats.totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">My Projects</h2>
        </div>
        <CardContent className="p-6">
          {portfolio.length === 0 ? (
            <div className="text-center py-12">
              <Plus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No projects yet</p>
              <p className="text-sm text-gray-400 mb-4">Add your first project to showcase your work</p>
              <Button 
                onClick={() => {
                  setEditingProject(null);
                  setFormData({});
                  setShowAddForm(true);
                }}
                className="bg-button-gradient text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Add First Project
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {portfolio.map((project: any) => (
                <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      <p className="text-gray-600">{project.client}</p>
                      <p className="text-sm text-gray-500">{project.date}</p>
                      {project.description && (
                        <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold">₹{parseInt(project.budget || '0').toLocaleString()}</p>
                      <p className="text-sm text-yellow-600">★ {project.rating || 0}</p>
                      <Badge className={`mt-1 ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status || 'pending'}
                      </Badge>
                      <div className="flex space-x-1 mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => editProject(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteProject(project.id)}
                          className="text-white hover:text-gray-200 bg-red-500 hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProject(null);
                  setFormData({});
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Title *</label>
                <input 
                  type="text" 
                  maxLength={100}
                  value={formData.title || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z0-9\s&.-]/g, '');
                    setFormData({...formData, title: value});
                  }}
                  className="w-full p-2 border rounded"
                  placeholder="Enter project title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Client Name *</label>
                <input 
                  type="text" 
                  maxLength={100}
                  value={formData.client || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z0-9\s&.-]/g, '');
                    setFormData({...formData, client: value});
                  }}
                  className="w-full p-2 border rounded"
                  placeholder="Enter client name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Project Date</label>
                <input 
                  type="date" 
                  value={formData.date || ''}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Budget (₹) *</label>
                <input 
                  type="number" 
                  min="1"
                  step="1"
                  value={formData.budget || ''}
                  onChange={(e) => {
                    const value = Math.max(1, parseInt(e.target.value) || 1);
                    setFormData({...formData, budget: value.toString()});
                  }}
                  onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                  className="w-full p-2 border rounded"
                  placeholder="Enter budget in rupees"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="5" 
                  step="0.1"
                  value={formData.rating || ''}
                  onChange={(e) => {
                    const value = Math.min(5, Math.max(1, parseFloat(e.target.value) || 1));
                    setFormData({...formData, rating: value.toString()});
                  }}
                  onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                  className="w-full p-2 border rounded"
                  placeholder="Enter rating (1-5)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select 
                  value={formData.status || ''}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded" 
                  rows={3}
                  placeholder="Project description"
                />
              </div>
            </div>
            
            <div className="flex space-x-2 mt-6">
              <Button 
                onClick={saveProject}
                className="flex-1 bg-button-gradient text-white"
              >
                {editingProject ? 'Update Project' : 'Add Project'}
              </Button>
              <Button 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProject(null);
                  setFormData({});
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}