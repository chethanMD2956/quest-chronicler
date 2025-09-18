import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Blog } from '@/hooks/useBlogs';
import { ArrowLeft, Calendar, MapPin, User, Share2, Heart } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blogs')
          .select(`
            *,
            profiles!user_id (
              name,
              email
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching blog:', error);
          return;
        }

        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // Could add toast notification here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
            <Link to="/">
              <Button variant="hero">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <article className="space-y-8">
          {/* Hero Section */}
          <div className="space-y-6">
            {/* Hero Image */}
            {blog.image_url && (
              <div className="relative h-96 md:h-[500px] overflow-hidden rounded-xl">
                <img 
                  src={blog.image_url} 
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title and Meta */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                {blog.destination && (
                  <Badge variant="secondary">
                    <MapPin className="h-3 w-3 mr-1" />
                    {blog.destination}
                  </Badge>
                )}
                <div className="flex items-center text-muted-foreground text-sm">
                  <User className="h-4 w-4 mr-1" />
                  <span>By {blog.profiles?.name || 'Anonymous'}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {blog.title}
              </h1>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" onClick={() => setLiked(!liked)}>
                  <Heart className={`h-4 w-4 ${liked ? 'fill-current text-red-500' : ''}`} />
                  {liked ? 'Liked' : 'Like'}
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {blog.content.split('\n').map((paragraph, index) => {
              if (paragraph.trim().startsWith('##')) {
                // Handle headings
                return (
                  <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-foreground">
                    {paragraph.replace('##', '').trim()}
                  </h2>
                );
              } else if (paragraph.trim()) {
                // Handle paragraphs
                return (
                  <p key={index} className="mb-6 text-muted-foreground leading-relaxed">
                    {paragraph.trim()}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </article>
      </main>
    </div>
  );
};

export default BlogDetail;