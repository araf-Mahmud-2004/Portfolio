import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Eye, 
  BarChart3,
  LogOut,
  Home,
  Code,
  Calendar,
  Star,
  Award,
  ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProfileWithSocialLinks from '../components/admin/ProfileWithSocialLinks';
import SocialLinksManager from '../components/admin/SocialLinksManager';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
  type: string;
  techStack: string[];
  liveUrl: string;
  githubUrl?: string;
  imageUrl?: string;
  featured: boolean;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'skills' | 'profile' | 'social' | 'settings'>('overview');
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingProject, setEditingProject] = useState<number | null>(null);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newProject, setNewProject] = useState<Project>({
    id: 0,
    title: '',
    description: '',
    type: 'personal',
    techStack: [],
    liveUrl: '',
    githubUrl: '',
    imageUrl: '',
    featured: false,
    createdAt: ''
  });

  const [newSkill, setNewSkill] = useState<Skill>({
    id: '',
    name: '',
    category: 'Frontend Development',
    proficiency: 50
  });

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    bio: '',
    githubUrl: '',
    linkedinUrl: '',
    profilePictureUrl: ''
  });

  const [resumeStatus, setResumeStatus] = useState<string>('');

  const skillCategories = [
    'Frontend Development',
    'Styling & Design',
    'Backend & Database',
    'Development Tools'
  ];

  const stats = {
    totalProjects: projects.length,
    totalSkills: skills.length,
    totalViews: 1247,
    totalLikes: 89,
    responseRate: '< 24h'
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin-login');
      } else {
        fetchProfile();
      }
    };
    checkUser();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch and map projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (projectsError) {
          throw new Error(`Error fetching projects: ${projectsError.message}`);
        }
        
        if (projectsData) {
          const mappedProjects = projectsData.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            type: p.type,
            techStack: p.tech_stack || [],
            liveUrl: p.live_url || '',
            githubUrl: p.github_url || '',
            imageUrl: p.image_url || '',
            featured: p.featured || false,
            createdAt: p.created_at || ''
          }));
          setProjects(mappedProjects);
        }

        // Fetch skills
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('*')
          .order('category', { ascending: true });
        
        if (skillsError) {
          throw new Error(`Error fetching skills: ${skillsError.message}`);
        }
        
        setSkills(skillsData || []);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("User not found, can't fetch profile.");
        return;
      }

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('full_name, email, bio, github_url, linkedin_url, profile_picture_url')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Ignore error if no profile found yet
        console.error('Error fetching profile:', error);
      } else if (profileData) {
        setProfile({
          fullName: profileData.full_name || '',
          email: profileData.email || '',
          bio: profileData.bio || '',
          githubUrl: profileData.github_url || '',
          linkedinUrl: profileData.linkedin_url || '',
          profilePictureUrl: profileData.profile_picture_url || ''
        });
      }
    } catch (error) {
      console.error('Unexpected error in fetchProfile:', error);
    }
  };

  const handleAddProject = async () => {
    if (newProject.title && newProject.description) {
      const projectForInsert = {
        title: newProject.title,
        description: newProject.description,
        type: newProject.type,
        tech_stack: newProject.techStack,
        live_url: newProject.liveUrl,
        github_url: newProject.githubUrl,
        image_url: newProject.imageUrl,
        featured: newProject.featured,
      };
      const { data, error } = await supabase.from('projects').insert([projectForInsert]).select().single();
      if (error) {
        console.error('Error adding project:', error);
      } else if (data) {
        const addedProject = {
          id: data.id,
          title: data.title,
          description: data.description,
          type: data.type,
          techStack: data.tech_stack || [],
          liveUrl: data.live_url || '',
          githubUrl: data.github_url || '',
          imageUrl: data.image_url || '',
          featured: data.featured || false,
          createdAt: data.created_at || ''
        };
        setProjects([addedProject, ...projects]);
        setNewProject({
          id: 0,
          title: '',
          description: '',
          type: 'personal',
          techStack: [],
          liveUrl: '',
          githubUrl: '',
          imageUrl: '',
          featured: false,
          createdAt: ''
        });
        setIsAddingProject(false);
      }
    }
  };

  const handleUpdateProject = async (id: number) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      const projectForUpdate = {
        title: project.title,
        description: project.description,
        type: project.type,
        tech_stack: project.techStack,
        live_url: project.liveUrl,
        github_url: project.githubUrl,
        image_url: project.imageUrl,
        featured: project.featured,
      };
      const { data, error } = await supabase.from('projects').update(projectForUpdate).eq('id', id).select().single();
      if (error) {
        console.error('Error updating project:', error);
      } else if (data) {
        const updatedProject = {
          id: data.id,
          title: data.title,
          description: data.description,
          type: data.type,
          techStack: data.tech_stack || [],
          liveUrl: data.live_url || '',
          githubUrl: data.github_url || '',
          imageUrl: data.image_url || '',
          featured: data.featured || false,
          createdAt: data.created_at || ''
        };
        setProjects(projects.map(p => (p.id === id ? updatedProject : p)));
        setEditingProject(null);
      }
    }
  };

  const handleAddSkill = async () => {
    if (newSkill.name) {
      const skill = {
        name: newSkill.name,
        category: newSkill.category,
        proficiency: newSkill.proficiency
      };
      const { data, error } = await supabase.from('skills').insert([skill]).select();
      if (error) {
        console.error('Error adding skill:', error);
      } else if (data && data.length > 0) {
        setSkills([...skills, data[0]]);
        setNewSkill({
          id: '',
          name: '',
          category: 'Frontend Development',
          proficiency: 50
        });
        setIsAddingSkill(false);
      }
    }
  };

  const handleDeleteProject = async (id: number) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      console.error('Error deleting project:', error);
    } else {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleDeleteSkill = async (id: string) => {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) {
      console.error('Error deleting skill:', error);
    } else {
      setSkills(skills.filter(s => s.id !== id));
    }
  };

  const handleUpdateSkill = async (id: string, updates: Partial<Skill>) => {
    const { data, error } = await supabase.from('skills').update(updates).eq('id', id).select();
    if (error) {
      console.error('Error updating skill:', error);
    } else if (data && data.length > 0) {
      setSkills(skills.map(skill => 
        skill.id === id ? { ...skill, ...data[0] } : skill
      ));
      setEditingSkill(null);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("User not found, can't update profile.");
        alert('Failed to update profile. User not authenticated.');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: profile.fullName,
          email: profile.email,
          bio: profile.bio,
          github_url: profile.githubUrl,
          linkedin_url: profile.linkedinUrl,
          profile_picture_url: profile.profilePictureUrl
        }, {
          onConflict: 'user_id',
        });

      if (error) {
        console.error('Error updating profile:', error.message);
        console.error('Error details:', error.details || 'No details available');
        console.error('Error hint:', error.hint || 'No hint available');
        alert(`Failed to update profile. Error: ${error.message}`);
      } else {
        console.log('Profile update successful:', data);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Unexpected error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProjectImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, projectId?: number) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("User not found, can't upload image.");
        return;
      }

      // Create a unique filename for the project image
      const fileExt = file.name.split('.').pop();
      const fileName = projectId 
        ? `project-${projectId}-${Date.now()}.${fileExt}`
        : `project-new-${Date.now()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      // Upload the file to the 'project-images' bucket
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) {
        throw new Error("Could not get public URL for the uploaded file.");
      }

      const imageUrl = urlData.publicUrl;

      // Update the project or newProject state with the new image URL
      if (projectId) {
        // Update existing project
        setProjects(projects.map(p => 
          p.id === projectId ? { ...p, imageUrl } : p
        ));
      } else {
        // Update new project form
        setNewProject({ ...newProject, imageUrl });
      }

      alert('Project image uploaded successfully!');

    } catch (error: any) {
      console.error('Error uploading project image:', error);
      alert(`Failed to upload project image: ${error.message}`);
    }
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
          console.error("User not found, can't upload picture.");
          return;
      }

      // Use a consistent file path for the user's profile picture to allow for easy updates.
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}.${fileExt}`;

      // Upload the file to the 'profile-pictures' bucket, overwriting if it exists.
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded file.
      const { data: urlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) {
          throw new Error("Could not get public URL for the uploaded file.");
      }
      
      // Add a timestamp for cache busting. This ensures the browser fetches the new image.
      const cacheBustedUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;

      // Update the user's profile in the database with the new picture URL.
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture_url: cacheBustedUrl })
        .eq('user_id', user.id);

      if (updateError) {
          throw updateError;
      }

      // Update the local state to show the new picture immediately.
      setProfile({ ...profile, profilePictureUrl: cacheBustedUrl });
      alert('Profile picture updated successfully!');

    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      alert(`Failed to upload profile picture: ${error.message}`);
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setResumeStatus('Uploading resume...');

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only PDF, DOC, and DOCX files are allowed');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not found, can't upload resume.");
      }

      // Use a consistent filename for the resume
      const fileExt = file.name.split('.').pop();
      const fileName = `resume.${fileExt}`;

      // Upload the file to the 'resume' bucket, overwriting if it exists
      const { error: uploadError } = await supabase.storage
        .from('resume')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      setResumeStatus('Resume uploaded successfully! Visitors can now download your resume.');

      // Clear the status after 5 seconds
      setTimeout(() => setResumeStatus(''), 5000);

    } catch (error: any) {
      console.error('Error uploading resume:', error);
      setResumeStatus(`Failed to upload resume: ${error.message}`);
      
      // Clear error after 5 seconds
      setTimeout(() => setResumeStatus(''), 5000);
    }
  };

  const handleResumeDelete = async () => {
    try {
      if (!confirm('Are you sure you want to delete your resume? This action cannot be undone.')) {
        return;
      }

      setResumeStatus('Deleting resume...');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not found, can't delete resume.");
      }

      // Try to delete both PDF and DOC versions
      const filesToDelete = ['resume.pdf', 'resume.doc', 'resume.docx'];
      
      for (const fileName of filesToDelete) {
        const { error } = await supabase.storage
          .from('resume')
          .remove([fileName]);
        
        // Don't throw error if file doesn't exist
        if (error && !error.message.includes('not found')) {
          console.error(`Error deleting ${fileName}:`, error);
        }
      }

      setResumeStatus('Resume deleted successfully.');

      // Clear the status after 3 seconds
      setTimeout(() => setResumeStatus(''), 3000);

    } catch (error: any) {
      console.error('Error deleting resume:', error);
      setResumeStatus(`Failed to delete resume: ${error.message}`);
      
      // Clear error after 5 seconds
      setTimeout(() => setResumeStatus(''), 5000);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'social', label: 'Social Links', icon: ExternalLink },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderProjectEditForm = () => {
    if (editingProject === null) return null;
    const project = projects.find(p => p.id === editingProject);
    if (!project) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="bg-charcoal/50 backdrop-blur-xl rounded-2xl border border-olive/30 p-6 mb-6"
      >
        <h3 className="text-xl font-bold text-off-white mb-6">Edit Project</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-light-gray mb-2">Project Title</label>
            <input
              type="text"
              value={project.title}
              onChange={(e) => setProjects(projects.map(p => p.id === project.id ? {...p, title: e.target.value} : p))}
              className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-olive/30 outline-none"
              placeholder="Project Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-light-gray mb-2">Type</label>
            <select
              value={project.type}
              onChange={(e) => setProjects(projects.map(p => p.id === project.id ? {...p, type: e.target.value} : p))}
              className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
            >
              <option value="personal">Personal</option>
              <option value="official">Official</option>
              <option value="collaboration">Collaboration</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-light-gray mb-2">Description</label>
            <textarea
              value={project.description}
              onChange={(e) => setProjects(projects.map(p => p.id === project.id ? {...p, description: e.target.value} : p))}
              rows={3}
              className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
              placeholder="Brief project description..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-light-gray mb-2">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={project.techStack.join(', ')}
              onChange={(e) => setProjects(projects.map(p => p.id === project.id ? {...p, techStack: e.target.value.split(',').map((tech: string) => tech.trim())} : p))}
              className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
              placeholder="React, TypeScript, Tailwind"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-light-gray mb-2">Live URL</label>
            <input
              type="url"
              value={project.liveUrl}
              onChange={(e) => setProjects(projects.map(p => p.id === project.id ? {...p, liveUrl: e.target.value} : p))}
              className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-light-gray mb-2">GitHub URL</label>
            <input
              type="url"
              value={project.githubUrl || ''}
              onChange={(e) => setProjects(projects.map(p => p.id === project.id ? {...p, githubUrl: e.target.value} : p))}
              className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
              placeholder="https://github.com/araf-Mahmud-2004/repo"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-light-gray mb-2">Project Image</label>
            <div className="flex items-center gap-4">
              {project.imageUrl && (
                <div className="w-20 h-20 rounded-lg bg-olive/20 flex items-center justify-center overflow-hidden">
                  <img 
                    src={project.imageUrl} 
                    alt="Project preview" 
                    className="w-full h-full object-cover rounded-lg" 
                  />
                </div>
              )}
              <div>
                <label className="flex items-center gap-2 bg-neon text-charcoal px-4 py-2 rounded-xl font-bold hover:bg-yellow-300 transition-colors cursor-pointer">
                  <Upload className="w-5 h-5" />
                  Upload Image
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleProjectImageUpload(e, project.id)} 
                  />
                </label>
                <p className="text-muted-gray text-sm mt-2">JPG, PNG or GIF. Max size 5MB</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <input
              type="checkbox"
              checked={project.featured}
              onChange={(e) => setProjects(projects.map(p => p.id === project.id ? {...p, featured: e.target.checked} : p))}
              className="w-5 h-5 bg-olive/20 border border-olive/30 rounded text-neon focus:ring-neon/20"
              id={`featured-${project.id}`}
            />
            <label htmlFor={`featured-${project.id}`} className="text-sm font-medium text-light-gray">Featured Project</label>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => handleUpdateProject(project.id)}
            className="bg-neon text-charcoal px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={() => setEditingProject(null)}
            className="bg-olive/20 text-light-gray px-6 py-3 rounded-xl font-bold hover:bg-olive/30 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-olive/10 to-charcoal">
      {/* Header */}
      <header className="bg-charcoal/80 backdrop-blur-xl border-b border-olive/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-bold text-neon">
                Araf<span className="text-off-white">.</span>
              </Link>
              <span className="text-muted-gray">/ Admin Dashboard</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                to="/"
                className="flex items-center gap-2 text-muted-gray hover:text-neon transition-colors"
              >
                <Home className="w-5 h-5" />
                View Site
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-muted-gray hover:text-crimson transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-charcoal/50 backdrop-blur-xl rounded-2xl border border-olive/30 p-6">
              <h2 className="text-xl font-bold text-off-white mb-6">Dashboard</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    whileHover={{ x: 5 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-neon text-charcoal font-bold'
                        : 'text-muted-gray hover:text-off-white hover:bg-olive/20'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-neon mx-auto mb-4"></div>
                  <p className="text-muted-gray">Loading dashboard data...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-crimson/20 border border-crimson/30 rounded-2xl p-6 mb-6">
                <h3 className="text-crimson font-bold mb-2">Error Loading Data</h3>
                <p className="text-crimson/80">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-crimson text-white px-4 py-2 rounded-xl hover:bg-crimson/80 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Main Content */}
            {!loading && !error && (
              <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div>
                    <h1 className="text-3xl font-bold text-off-white mb-2">Welcome back! 👋</h1>
                    <p className="text-muted-gray">Here's what's happening with your portfolio</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">
                    {[
                      { label: 'Total Projects', value: stats.totalProjects, icon: Code, color: 'text-neon' },
                      { label: 'Total Skills', value: stats.totalSkills, icon: Award, color: 'text-purple-400' },
                      { label: 'Portfolio Views', value: stats.totalViews, icon: Eye, color: 'text-blue-400' },
                      { label: 'Project Likes', value: stats.totalLikes, icon: BarChart3, color: 'text-green-400' },
                      { label: 'Response Time', value: stats.responseRate, icon: Calendar, color: 'text-orange-400' }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-charcoal/50 backdrop-blur-xl rounded-2xl border border-olive/30 p-6 hover:border-neon/30 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <stat.icon className={`w-8 h-8 ${stat.color}`} />
                          <span className="text-2xl font-bold text-off-white">{stat.value}</span>
                        </div>
                        <p className="text-muted-gray">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Projects */}
                  <div className="bg-charcoal/50 backdrop-blur-xl rounded-2xl border border-olive/30 p-6">
                    <h3 className="text-xl font-bold text-off-white mb-6">Recent Projects</h3>
                    <div className="space-y-4">
                      {projects.slice(0, 3).map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 bg-olive/20 rounded-xl border border-olive/30">
                          <div>
                            <h4 className="font-bold text-off-white">{project.title}</h4>
                            <p className="text-sm text-muted-gray">{project.type} • {project.createdAt}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {project.featured && (
                              <span className="px-2 py-1 bg-neon/20 text-neon text-xs rounded-full">Featured</span>
                            )}
                            <button className="p-2 text-muted-gray hover:text-neon transition-colors" onClick={() => setEditingProject(project.id)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-off-white">Manage Skills</h1>
                    <motion.button
                      onClick={() => setIsAddingSkill(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-neon text-charcoal px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-300 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add Skill
                    </motion.button>
                  </div>

                  {/* Add Skill Form */}
                  {isAddingSkill && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-charcoal/50 backdrop-blur-xl rounded-2xl border border-olive/30 p-6"
                    >
                      <h3 className="text-xl font-bold text-off-white mb-6">Add New Skill</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-light-gray mb-2">Skill Name</label>
                          <input
                            type="text"
                            value={newSkill.name}
                            onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                            className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
                            placeholder="e.g., React"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-light-gray mb-2">Category</label>
                          <select
                            value={newSkill.category}
                            onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                            className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
                          >
                            {skillCategories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-light-gray mb-2">
                            Proficiency ({newSkill.proficiency}%)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={newSkill.proficiency}
                            onChange={(e) => setNewSkill({...newSkill, proficiency: parseInt(e.target.value)})}
                            className="w-full h-2 bg-olive/20 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4 mt-6">
                        <button
                          onClick={handleAddSkill}
                          className="bg-neon text-charcoal px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors"
                        >
                          Save Skill
                        </button>
                        <button
                          onClick={() => setIsAddingSkill(false)}
                          className="bg-olive/20 text-light-gray px-6 py-3 rounded-xl font-bold hover:bg-olive/30 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Skills by Category */}
                  {skillCategories.map(category => {
                    const categorySkills = skills.filter(skill => skill.category === category);
                    
                    return (
                      <div key={category} className="bg-charcoal/50 backdrop-blur-xl rounded-2xl border border-olive/30 p-6">
                        <h3 className="text-xl font-bold text-off-white mb-6 flex items-center gap-2">
                          <Award className="w-6 h-6 text-neon" />
                          {category} ({categorySkills.length})
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {categorySkills.map((skill) => (
                            <motion.div
                              key={skill.id}
                              layout
                              className="flex items-center justify-between p-4 bg-olive/20 rounded-xl border border-olive/30 hover:border-neon/30 transition-all duration-300"
                            >
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-bold text-off-white">{skill.name}</h4>
                                  <div className="flex items-center gap-1">
                                    <span className="text-sm text-neon font-bold">{skill.proficiency}%</span>
                                    <Star className="w-4 h-4 text-neon fill-current" />
                                  </div>
                                </div>
                                <div className="w-full bg-charcoal/50 rounded-full h-2">
                                  <div 
                                    className="h-full bg-gradient-to-r from-neon to-yellow-300 rounded-full transition-all duration-500"
                                    style={{ width: `${skill.proficiency}%` }}
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => setEditingSkill(skill.id)}
                                  className="p-2 text-muted-gray hover:text-neon transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSkill(skill.id)}
                                  className="p-2 text-muted-gray hover:text-crimson transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-off-white">Manage Projects</h1>
                    <motion.button
                      onClick={() => setIsAddingProject(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-neon text-charcoal px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-300 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add Project
                    </motion.button>
                  </div>

                  {/* Add Project Form */}
                  {isAddingProject && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-charcoal/50 backdrop-blur-xl rounded-2xl border border-olive/30 p-6"
                    >
                      <h3 className="text-xl font-bold text-off-white mb-6">Add New Project</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-light-gray mb-2">Project Title</label>
                          <input
                            type="text"
                            value={newProject.title}
                            onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                            className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
                            placeholder="Project Title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-light-gray mb-2">Type</label>
                          <select
                            value={newProject.type}
                            onChange={(e) => setNewProject({...newProject, type: e.target.value})}
                            className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
                          >
                            <option value="personal">Personal</option>
                            <option value="official">Official</option>
                            <option value="collaboration">Collaboration</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-light-gray mb-2">Description</label>
                          <textarea
                            value={newProject.description}
                            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                            rows={3}
                            className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
                            placeholder="Brief project description..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-light-gray mb-2">Tech Stack (comma separated)</label>
                          <input
                            type="text"
                            value={newProject.techStack.join(', ')}
                            onChange={(e) => setNewProject({...newProject, techStack: e.target.value.split(',').map((tech: string) => tech.trim())})}
                            className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
                            placeholder="React, TypeScript, Tailwind"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-light-gray mb-2">Live URL</label>
                          <input
                            type="url"
                            value={newProject.liveUrl}
                            onChange={(e) => setNewProject({...newProject, liveUrl: e.target.value})}
                            className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
                            placeholder="https://example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-light-gray mb-2">GitHub URL</label>
                          <input
                            type="url"
                            value={newProject.githubUrl}
                            onChange={(e) => setNewProject({...newProject, githubUrl: e.target.value})}
                            className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
                            placeholder="https://github.com/araf-Mahmud-2004/repo"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-light-gray mb-2">Project Image</label>
                          <div className="flex items-center gap-4">
                            {newProject.imageUrl && (
                              <div className="w-20 h-20 rounded-lg bg-olive/20 flex items-center justify-center overflow-hidden">
                                <img 
                                  src={newProject.imageUrl} 
                                  alt="Project preview" 
                                  className="w-full h-full object-cover rounded-lg" 
                                />
                              </div>
                            )}
                            <div>
                              <label className="flex items-center gap-2 bg-neon text-charcoal px-4 py-2 rounded-xl font-bold hover:bg-yellow-300 transition-colors cursor-pointer">
                                <Upload className="w-5 h-5" />
                                Upload Image
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => handleProjectImageUpload(e)} 
                                />
                              </label>
                              <p className="text-muted-gray text-sm mt-2">JPG, PNG or GIF. Max size 5MB</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pt-4">
                          <input
                            type="checkbox"
                            checked={newProject.featured}
                            onChange={(e) => setNewProject({...newProject, featured: e.target.checked})}
                            className="w-5 h-5 bg-olive/20 border border-olive/30 rounded text-neon focus:ring-neon/20"
                            id="featured-new"
                          />
                          <label htmlFor="featured-new" className="text-sm font-medium text-light-gray">Featured Project</label>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-6">
                        <button
                          onClick={handleAddProject}
                          className="bg-neon text-charcoal px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors"
                        >
                          Save Project
                        </button>
                        <button
                          onClick={() => setIsAddingProject(false)}
                          className="bg-olive/20 text-light-gray px-6 py-3 rounded-xl font-bold hover:bg-olive/30 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Edit Project Form */}
                  {editingProject && renderProjectEditForm()}

                  {/* Projects List */}
                  <div className="bg-charcoal/50 backdrop-blur-xl rounded-2xl border border-olive/30 p-6">
                    <h3 className="text-xl font-bold text-off-white mb-6">Your Projects</h3>
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 bg-olive/20 rounded-xl border border-olive/30">
                          <div>
                            <h4 className="font-bold text-off-white">{project.title}</h4>
                            <p className="text-sm text-muted-gray">{project.type} • {project.createdAt}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {project.featured && (
                              <span className="px-2 py-1 bg-neon/20 text-neon text-xs rounded-full">Featured</span>
                            )}
                            <button className="p-2 text-muted-gray hover:text-neon transition-colors" onClick={() => setEditingProject(project.id)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-muted-gray hover:text-crimson transition-colors" onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <ProfileWithSocialLinks
                    profile={profile}
                    setProfile={setProfile}
                    handleProfileUpdate={handleProfileUpdate}
                    handleProfilePictureUpload={handleProfilePictureUpload}
                    handleResumeUpload={handleResumeUpload}
                    handleResumeDelete={handleResumeDelete}
                    resumeStatus={resumeStatus}
                  />
                </motion.div>
              )}

              {/* Social Links Tab */}
              {activeTab === 'social' && (
                <motion.div
                  key="social"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <SocialLinksManager />
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h1 className="text-3xl font-bold text-off-white">Settings</h1>
                  
                  <div className="bg-charcoal/50 backdrop-blur-xl rounded-2xl border border-olive/30 p-6">
                    <h2 className="text-xl font-bold text-off-white mb-6">General Settings</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-off-white">Portfolio Visibility</h3>
                          <p className="text-muted-gray text-sm">Make your portfolio publicly visible</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-off-white">Contact Form</h3>
                          <p className="text-muted-gray text-sm">Enable contact form submissions</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-off-white">Analytics</h3>
                          <p className="text-muted-gray text-sm">Track portfolio visits and interactions</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-charcoal/50 backdrop-blur-xl rounded-2xl border border-crimson/30 p-6">
                    <h2 className="text-xl font-bold text-crimson mb-6">Danger Zone</h2>
                    
                    <div className="space-y-4">
                      <button className="bg-crimson/20 text-crimson px-6 py-3 rounded-xl font-bold hover:bg-crimson/30 transition-colors border border-crimson/30">
                        Reset All Data
                      </button>
                      <p className="text-muted-gray text-sm">This will permanently delete all projects and settings.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;