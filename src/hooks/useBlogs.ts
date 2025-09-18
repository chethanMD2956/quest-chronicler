import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Blog {
  id: string;
  title: string;
  content: string;
  destination: string | null;
  image_url: string | null;
  created_at: string;
  user_id: string;
  profiles: {
    name: string;
    email: string;
  } | null;
}

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          profiles (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({
        title: "Error",
        description: "Failed to load blogs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (blogData: {
    title: string;
    content: string;
    destination?: string;
    image_url?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .insert([{ ...blogData, user_id: (await supabase.auth.getUser()).data.user?.id }])
        .select(`
          *,
          profiles!user_id (
            name,
            email
          )
        `)
        .single();

      if (error) throw error;

      toast({
        title: "Blog Created!",
        description: "Your travel story has been published successfully."
      });

      await fetchBlogs(); // Refresh the list
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create blog post. Please try again.",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const updateBlog = async (id: string, blogData: {
    title: string;
    content: string;
    destination?: string;
    image_url?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .update(blogData)
        .eq('id', id)
        .select(`
          *,
          profiles!user_id (
            name,
            email
          )
        `)
        .single();

      if (error) throw error;

      toast({
        title: "Blog Updated!",
        description: "Your changes have been saved successfully."
      });

      await fetchBlogs(); // Refresh the list
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update blog post. Please try again.",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Blog Deleted",
        description: "Your blog post has been deleted successfully."
      });

      await fetchBlogs(); // Refresh the list
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post. Please try again.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const getUserBlogs = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          profiles!user_id (
            name,
            email
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    blogs,
    loading,
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    getUserBlogs
  };
};