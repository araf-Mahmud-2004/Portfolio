import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Github, 
  Linkedin, 
  Twitter, 
  MessageCircle,
  Mail,
  Save,
  X,
  ExternalLink,
  GripVertical
} from 'lucide-react';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import type { SocialLink } from '../../hooks/useSocialLinks';

const SocialLinksManager: React.FC = () => {
  const { socialLinks, loading, addSocialLink, updateSocialLink, deleteSocialLink } = useSocialLinks();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLink, setNewLink] = useState({ platform: 'github', url: '' });

  const platformOptions = [
    { value: 'github', label: 'GitHub', icon: Github, color: 'text-gray-400' },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-400' },
    { value: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-sky-400' },
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-green-400' },
  ];

  const getPlatformInfo = (platform: string) => {
    return platformOptions.find(p => p.value === platform) || 
           { value: platform, label: platform, icon: Mail, color: 'text-neon' };
  };

  const handleAddLink = async () => {
    if (!newLink.url.trim()) return;
    
    try {
      await addSocialLink(newLink.platform, newLink.url);
      setNewLink({ platform: 'github', url: '' });
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding social link:', error);
      alert('Failed to add social link. Please try again.');
    }
  };

  const handleUpdateLink = async (id: string, updates: Partial<SocialLink>) => {
    try {
      await updateSocialLink(id, updates);
      setEditingId(null);
    } catch (error) {
      console.error('Error updating social link:', error);
      alert('Failed to update social link. Please try again.');
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social link?')) return;
    
    try {
      await deleteSocialLink(id);
    } catch (error) {
      console.error('Error deleting social link:', error);
      alert('Failed to delete social link. Please try again.');
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-neon"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-off-white">Social Links</h1>
          <p className="text-muted-gray mt-2">Manage your social media links that appear in the contact section</p>
        </div>
        <motion.button
          onClick={() => setIsAdding(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-neon text-charcoal px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-300 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Social Link
        </motion.button>
      </div>

      {/* Add New Link Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-charcoal/50 backdrop-blur-xl rounded-2xl border border-olive/30 p-6"
          >
            <h3 className="text-xl font-bold text-off-white mb-6">Add New Social Link</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-light-gray mb-2">Platform</label>
                <select
                  value={newLink.platform}
                  onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
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
                  URL {newLink.platform === 'whatsapp' && '(URL or phone number)'}
                </label>
                <input
                  type="text"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="w-full bg-olive/20 border border-olive/30 rounded-xl px-4 py-3 text-off-white focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none"
                  placeholder={
                    newLink.platform === 'whatsapp' 
                      ? 'https://wa.me/1234567890 or +1234567890'
                      : `https://${newLink.platform}.com/username`
                  }
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddLink}
                disabled={!validateUrl(newLink.url, newLink.platform)}
                className="bg-neon text-charcoal px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Link
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewLink({ platform: 'github', url: '' });
                }}
                className="bg-olive/20 text-light-gray px-6 py-3 rounded-xl font-bold hover:bg-olive/30 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Links List */}
      <div className="bg-charcoal/50 backdrop-blur-xl rounded-2xl border border-olive/30 p-6">
        <h3 className="text-xl font-bold text-off-white mb-6">Your Social Links</h3>
        
        {socialLinks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-olive/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-muted-gray" />
            </div>
            <h4 className="text-lg font-bold text-off-white mb-2">No social links yet</h4>
            <p className="text-muted-gray mb-6">Add your first social link to get started</p>
            <button
              onClick={() => setIsAdding(true)}
              className="bg-neon text-charcoal px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors"
            >
              Add Your First Link
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {socialLinks.map((link) => {
              const platformInfo = getPlatformInfo(link.platform);
              const IconComponent = platformInfo.icon;
              const isEditing = editingId === link.id;
              
              return (
                <motion.div
                  key={link.id}
                  layout
                  className="flex items-center gap-4 p-4 bg-olive/20 rounded-xl border border-olive/30 hover:border-neon/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-gray cursor-move" />
                    <div className={`p-2 rounded-lg bg-charcoal/50 ${platformInfo.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        <select
                          value={link.platform}
                          onChange={(e) => handleUpdateLink(link.id, { platform: e.target.value })}
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
                          onChange={(e) => handleUpdateLink(link.id, { url: e.target.value })}
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
                          onClick={() => setEditingId(null)}
                          className="p-2 text-neon hover:bg-neon/20 rounded-lg transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 text-muted-gray hover:bg-olive/20 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleUpdateLink(link.id, { is_active: !link.is_active })}
                          className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                            link.is_active 
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          }`}
                        >
                          {link.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => setEditingId(link.id)}
                          className="p-2 text-muted-gray hover:text-neon transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
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
      </div>

      {/* Preview Section */}
      {socialLinks.length > 0 && (
        <div className="bg-charcoal/50 backdrop-blur-xl rounded-2xl border border-olive/30 p-6">
          <h3 className="text-xl font-bold text-off-white mb-6">Preview</h3>
          <p className="text-muted-gray mb-4">This is how your social links will appear in the contact section:</p>
          <div className="flex gap-4 p-4 bg-olive/10 rounded-xl">
            {socialLinks.filter(link => link.is_active).map((link) => {
              const platformInfo = getPlatformInfo(link.platform);
              const IconComponent = platformInfo.icon;
              
              return (
                <div
                  key={link.id}
                  className={`p-4 bg-olive/20 rounded-xl border border-olive/30 ${platformInfo.color}`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialLinksManager;