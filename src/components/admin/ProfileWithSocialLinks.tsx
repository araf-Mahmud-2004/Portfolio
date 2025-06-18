import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Upload, 
  Trash2, 
  Plus, 
  Edit3, 
  Github, 
  Linkedin, 
  Twitter, 
  MessageCircle,
  Mail,
  Save,
  X,
  ExternalLink
} from 'lucide-react';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import type { SocialLink } from '../../hooks/useSocialLinks';

interface ProfileWithSocialLinksProps {
  profile: {
    fullName: string;
    email: string;
    bio: string;
    githubUrl: string;
    linkedinUrl: string;
    profilePictureUrl: string;
  };
  setProfile: (profile: any) => void;
  handleProfileUpdate: () => void;
  handleProfilePictureUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleResumeUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleResumeDelete: () => void;
  resumeStatus: string;
}

const ProfileWithSocialLinks: React.FC<ProfileWithSocialLinksProps> = ({
  profile,
  setProfile,
  handleProfileUpdate,
  handleProfilePictureUpload,
  handleResumeUpload,
  handleResumeDelete,
  resumeStatus
}) => {
  const { socialLinks, loading: socialLoading, addSocialLink, updateSocialLink, deleteSocialLink } = useSocialLinks();
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [newSocialLink, setNewSocialLink] = useState({ platform: 'github', url: '' });

  const platformOptions = [
    { value: 'github', label: 'GitHub', icon: Github, color: 'text-gray-400', placeholder: 'https://github.com/username' },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-400', placeholder: 'https://linkedin.com/in/username' },
    { value: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-sky-400', placeholder: 'https://twitter.com/username' },
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-green-400', placeholder: 'https://wa.me/1234567890 or +1234567890' },
  ];

  const getPlatformInfo = (platform: string) => {
    return platformOptions.find(p => p.value === platform) || 
           { value: platform, label: platform, icon: Mail, color: 'text-neon', placeholder: 'https://example.com' };
  };

  const validateUrl = (url: string, platform: string) => {
    if (!url) return false;
    
    try {
      new URL(url);
      return true;
    } catch {
      // For WhatsApp, allow phone number format
      if (platform === 'whatsapp' && /^\+?\d{10,15}$/.test(url.replace(/\s/g, ''))) {
        return true;
      }
      return false;
    }
  };

  const formatWhatsAppUrl = (input: string) => {
    // If it's already a URL, return as is
    if (input.startsWith('http')) return input;
    
    // If it's a phone number, format as WhatsApp URL
    const phoneNumber = input.replace(/\D/g, '');
    return `https://wa.me/${phoneNumber}`;
  };

  const handleAddSocialLink = async () => {
    if (!validateUrl(newSocialLink.url, newSocialLink.platform)) return;
    
    try {
      const finalUrl = newSocialLink.platform === 'whatsapp' 
        ? formatWhatsAppUrl(newSocialLink.url)
        : newSocialLink.url;
        
      await addSocialLink(newSocialLink.platform, finalUrl);
      setNewSocialLink({ platform: 'github', url: '' });
      setIsAddingSocial(false);
    } catch (error) {
      console.error('Error adding social link:', error);
      alert('Failed to add social link. Please try again.');
    }
  };

  const handleUpdateSocialLink = async (id: string, updates: Partial<SocialLink>) => {
    try {
      if (updates.url && updates.platform === 'whatsapp') {
        updates.url = formatWhatsAppUrl(updates.url);
      }
      await updateSocialLink(id, updates);
      setEditingSocialId(null);
    } catch (error) {
      console.error('Error updating social link:', error);
      alert('Failed to update social link. Please try again.');
    }
  };

  const handleDeleteSocialLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social link?')) return;
    
    try {
      await deleteSocialLink(id);
    } catch (error) {
      console.error('Error deleting social link:', error);
      alert('Failed to delete social link. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-off-white">Profile Settings</h1>
      </div>

      {/* Personal Information */}
      <div className="bg-charcoal/50 backdrop-blur-xl rounded-2xl border border-olive/30 p-6">
        <h3 className="text-xl font-bold text-off-white mb-6">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-light-gray mb-2">Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-light-gray mb-2">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
              placeholder="email@example.com"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-light-gray mb-2">Bio</label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
              placeholder="Tell visitors about yourself..."
            />
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <button 
            onClick={handleProfileUpdate}
            className="bg-neon text-charcoal px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Profile Picture */}
      <div className="bg-charcoal/50 backdrop-blur-xl rounded-2xl border border-olive/30 p-6">
        <h3 className="text-xl font-bold text-off-white mb-6">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-olive/20 flex items-center justify-center overflow-hidden">
            {profile.profilePictureUrl ? (
              <img 
                src={profile.profilePictureUrl} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full" 
              />
            ) : (
              <User className="w-12 h-12 text-muted-gray" />
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 bg-neon text-charcoal px-4 py-2 rounded-xl font-bold hover:bg-yellow-300 transition-colors cursor-pointer">
              <Upload className="w-5 h-5" />
              Upload Photo
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleProfilePictureUpload} 
              />
            </label>
            <p className="text-muted-gray text-sm mt-2">JPG, PNG or GIF. Max size 2MB</p>
          </div>
        </div>
      </div>

      {/* Social Links Management */}
      <div className="bg-charcoal/50 backdrop-blur-xl rounded-2xl border border-olive/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-off-white">Social Links</h3>
            <p className="text-muted-gray text-sm mt-1">Manage your social media links for the contact section</p>
          </div>
          <motion.button
            onClick={() => setIsAddingSocial(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-neon text-charcoal px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Link
          </motion.button>
        </div>

        {/* Add Social Link Form */}
        <AnimatePresence>
          {isAddingSocial && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-olive/10 rounded-xl border border-olive/20"
            >
              <h4 className="text-lg font-bold text-off-white mb-4">Add New Social Link</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-gray mb-2">Platform</label>
                  <select
                    value={newSocialLink.platform}
                    onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                    className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
                  >
                    {platformOptions.map(platform => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-gray mb-2">
                    URL {newSocialLink.platform === 'whatsapp' && '(URL or phone number)'}
                  </label>
                  <input
                    type="text"
                    value={newSocialLink.url}
                    onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                    className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
                    placeholder={getPlatformInfo(newSocialLink.platform).placeholder}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleAddSocialLink}
                  disabled={!validateUrl(newSocialLink.url, newSocialLink.platform)}
                  className="bg-neon text-charcoal px-4 py-2 rounded-xl font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Link
                </button>
                <button
                  onClick={() => {
                    setIsAddingSocial(false);
                    setNewSocialLink({ platform: 'github', url: '' });
                  }}
                  className="bg-olive/20 text-light-gray px-4 py-2 rounded-xl font-bold hover:bg-olive/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Social Links List */}
        {socialLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-neon"></div>
          </div>
        ) : socialLinks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-olive/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <ExternalLink className="w-6 h-6 text-muted-gray" />
            </div>
            <h4 className="text-lg font-bold text-off-white mb-2">No social links yet</h4>
            <p className="text-muted-gray mb-4">Add your first social link to get started</p>
            <button
              onClick={() => setIsAddingSocial(true)}
              className="bg-neon text-charcoal px-4 py-2 rounded-xl font-bold hover:bg-yellow-300 transition-colors"
            >
              Add Your First Link
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {socialLinks.map((link) => {
              const platformInfo = getPlatformInfo(link.platform);
              const IconComponent = platformInfo.icon;
              const isEditing = editingSocialId === link.id;
              
              return (
                <motion.div
                  key={link.id}
                  layout
                  className="flex items-center gap-4 p-4 bg-olive/10 rounded-xl border border-olive/20 hover:border-neon/30 transition-all duration-300"
                >
                  <div className={`p-2 rounded-lg bg-charcoal/50 ${platformInfo.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="grid md:grid-cols-2 gap-3">
                        <select
                          value={link.platform}
                          onChange={(e) => handleUpdateSocialLink(link.id, { platform: e.target.value })}
                          className="bg-charcoal/50 border border-olive/30 rounded-lg px-3 py-2 text-off-white focus:border-neon outline-none"
                        >
                          {platformOptions.map(platform => (
                            <option key={platform.value} value={platform.value}>
                              {platform.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => handleUpdateSocialLink(link.id, { url: e.target.value })}
                          className="bg-charcoal/50 border border-olive/30 rounded-lg px-3 py-2 text-off-white focus:border-neon outline-none"
                          placeholder="Enter URL"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-off-white capitalize">{link.platform}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            link.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {link.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-muted-gray hover:text-neon transition-colors truncate block"
                        >
                          {link.url}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => setEditingSocialId(null)}
                          className="p-2 text-neon hover:bg-neon/20 rounded-lg transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingSocialId(null)}
                          className="p-2 text-muted-gray hover:bg-olive/20 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleUpdateSocialLink(link.id, { is_active: !link.is_active })}
                          className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                            link.is_active 
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          }`}
                        >
                          {link.is_active ? 'Hide' : 'Show'}
                        </button>
                        <button
                          onClick={() => setEditingSocialId(link.id)}
                          className="p-2 text-muted-gray hover:text-neon transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSocialLink(link.id)}
                          className="p-2 text-muted-gray hover:text-crimson transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Preview */}
        {socialLinks.filter(link => link.is_active).length > 0 && (
          <div className="mt-6 p-4 bg-olive/5 rounded-xl border border-olive/10">
            <h4 className="text-sm font-bold text-off-white mb-3">Preview (Contact Section)</h4>
            <div className="flex gap-3">
              {socialLinks.filter(link => link.is_active).map((link) => {
                const platformInfo = getPlatformInfo(link.platform);
                const IconComponent = platformInfo.icon;
                
                return (
                  <div
                    key={link.id}
                    className={`p-3 bg-olive/20 rounded-xl border border-olive/30 ${platformInfo.color}`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Resume Management */}
      <div className="bg-charcoal/50 backdrop-blur-xl rounded-2xl border border-olive/30 p-6">
        <h3 className="text-xl font-bold text-off-white mb-6">Resume Management</h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-xl bg-olive/20 flex items-center justify-center">
            <div className="text-center">
              <Upload className="w-8 h-8 text-neon mx-auto mb-2" />
              <p className="text-xs text-muted-gray">PDF</p>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 bg-neon text-charcoal px-4 py-2 rounded-xl font-bold hover:bg-yellow-300 transition-colors cursor-pointer">
                <Upload className="w-5 h-5" />
                Upload Resume
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  className="hidden" 
                  onChange={handleResumeUpload} 
                />
              </label>
              <button
                onClick={handleResumeDelete}
                className="flex items-center gap-2 bg-crimson/20 text-crimson px-4 py-2 rounded-xl font-bold hover:bg-crimson/30 transition-colors border border-crimson/30"
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
            </div>
            <p className="text-muted-gray text-sm mb-2">PDF, DOC, or DOCX. Max size 10MB</p>
            {resumeStatus && (
              <div className={`text-sm font-medium ${resumeStatus.includes('successfully') ? 'text-neon' : 'text-crimson'}`}>
                {resumeStatus}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileWithSocialLinks;