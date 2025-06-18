import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  is_active: boolean;
  display_order: number;
}

export const useSocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch social links
  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      setSocialLinks(data || []);
    } catch (err: any) {
      console.error('Error fetching social links:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add social link
  const addSocialLink = async (platform: string, url: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('social_links')
        .insert([{
          user_id: user.id,
          platform,
          url,
          is_active: true,
          display_order: socialLinks.length + 1
        }])
        .select()
        .single();

      if (error) throw error;

      setSocialLinks([...socialLinks, data]);
      return data;
    } catch (err: any) {
      console.error('Error adding social link:', err);
      throw err;
    }
  };

  // Update social link
  const updateSocialLink = async (id: string, updates: Partial<SocialLink>) => {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSocialLinks(socialLinks.map(link => 
        link.id === id ? { ...link, ...data } : link
      ));
      return data;
    } catch (err: any) {
      console.error('Error updating social link:', err);
      throw err;
    }
  };

  // Delete social link
  const deleteSocialLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSocialLinks(socialLinks.filter(link => link.id !== id));
    } catch (err: any) {
      console.error('Error deleting social link:', err);
      throw err;
    }
  };

  // Reorder social links
  const reorderSocialLinks = async (reorderedLinks: SocialLink[]) => {
    try {
      const updates = reorderedLinks.map((link, index) => ({
        id: link.id,
        display_order: index + 1
      }));

      for (const update of updates) {
        await supabase
          .from('social_links')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      setSocialLinks(reorderedLinks);
    } catch (err: any) {
      console.error('Error reordering social links:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSocialLinks();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('social_links_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'social_links'
        },
        () => {
          fetchSocialLinks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    socialLinks,
    loading,
    error,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    reorderSocialLinks,
    refetch: fetchSocialLinks
  };
};