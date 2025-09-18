import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useBlogs } from '@/hooks/useBlogs';
import { supabase } from '@/integrations/supabase/client';
import { Save, ArrowLeft, Image, MapPin } from 'lucide-react';

const CreateBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const { toast } = useToast();
  const { createBlog, updateBlog } = useBlogs();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    destination: '',
    image_url: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(id);

  // Load blog data for editing
  useEffect(() => {
    const loadBlog = async () => {
      if (id) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;

          if (data) {
            setFormData({
              title: data.title,
              content: data.content,
              destination: data.destination || '',
              image_url: data.image_url || ''
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load blog post.",
            variant: "destructive"
          });
          navigate('/dashboard');
        } finally {
          setLoading(false);
        }
      }
    };

    loadBlog();
  }, [id, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const blogData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        destination: formData.destination.trim() || undefined,
        image_url: formData.image_url.trim() || undefined
      };

      if (isEdit && id) {
        await updateBlog(id, blogData);
      } else {
        await createBlog(blogData);
      }
      
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in the hooks
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-8 max-w-4xl">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
            <p className="text-muted-foreground">
              {isEdit 
                ? 'Update your travel story' 
                : 'Share your travel adventures with the world'
              }
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter your blog title..."
                  value={formData.title}
                  onChange={handleInputChange}
                  className="text-lg"
                />
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="destination"
                    name="destination"
                    placeholder="Where did you travel?"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image_url">Cover Image URL</Label>
                <div className="relative">
                  <Image className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="image_url"
                    name="image_url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Add a cover image to make your blog more engaging
                </p>
              </div>

              {/* Image Preview */}
              {formData.image_url && (
                <div className="space-y-2">
                  <Label>Image Preview</Label>
                  <div className="relative h-48 overflow-hidden rounded-lg">
                    <img 
                      src={formData.image_url} 
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Tell your travel story... Share your experiences, tips, and memorable moments."
                  value={formData.content}
                  onChange={handleInputChange}
                  className="min-h-64 resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  {formData.content.length} characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              type="submit" 
              variant="hero" 
              size="lg" 
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              <Save className="h-4 w-4" />
              {isSubmitting 
                ? (isEdit ? 'Updating...' : 'Publishing...') 
                : (isEdit ? 'Update Blog' : 'Publish Blog')
              }
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/dashboard')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateBlog;