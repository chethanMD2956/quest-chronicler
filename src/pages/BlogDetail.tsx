import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import BlogCard from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, User, MapPin, Eye, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BlogDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  // Mock blog data - will be replaced with Supabase data
  const [blog, setBlog] = useState({
    id: '1',
    title: 'Adventures in the Swiss Alps',
    content: `The Swiss Alps have always been a dream destination for me, and finally experiencing them firsthand was nothing short of magical. From the moment I stepped off the train in Interlaken, I was surrounded by towering peaks, crystal-clear lakes, and the freshest mountain air I've ever breathed.

## The Journey Begins

My adventure started in Zurich, where I caught the scenic train route through the heart of Switzerland. The journey itself was part of the experience – watching the landscape transform from rolling hills to dramatic mountain vistas through panoramic windows.

## Hiking Through Paradise

The hiking trails in the Swiss Alps are incredibly well-maintained and offer something for every skill level. I spent my first day on an easier trail around Lake Brienz, where the turquoise waters perfectly reflected the surrounding mountains. The contrast of colors was absolutely stunning.

On day two, I challenged myself with a more demanding hike up to Harder Kulm. The 2-hour climb was worth every step when I reached the viewpoint. The panoramic view of Interlaken, nestled between two lakes with the Jungfrau massif in the background, was breathtaking.

## Alpine Culture and Cuisine

The local culture is as rich as the landscapes. I stayed in a traditional chalet where the hosts treated me like family. Every morning started with fresh bread, local cheeses, and homemade jams while watching the sunrise paint the mountains in golden hues.

The Swiss are incredibly proud of their mountain heritage, and it shows in everything from their perfectly maintained hiking trails to the warm hospitality in every mountain hut along the way.

## Tips for Future Travelers

- Pack layers – mountain weather can change quickly
- Start hikes early to avoid afternoon thunderstorms
- Don't miss the local alpine cheeses and rösti
- Consider the Swiss Travel Pass for seamless transportation
- Book accommodations early, especially during peak season

The Swiss Alps exceeded every expectation I had. This trip reminded me why we travel – to be humbled by nature's beauty and to connect with cultures that have learned to live in harmony with their environment.`,
    image_url: '/placeholder.svg?height=600&width=1200',
    created_at: '2024-01-15',
    destination: 'Switzerland',
    views: 425,
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    }
  });

  const [relatedBlogs] = useState([
    {
      id: '2',
      title: 'Sunset in Santorini',
      content: 'Witnessing the most spectacular sunsets from the white-washed buildings of Santorini.',
      image_url: '/placeholder.svg?height=400&width=600',
      created_at: '2024-01-10',
      destination: 'Greece',
      user: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    },
    {
      id: '3',
      title: 'Northern Lights in Iceland',
      content: 'Chasing the aurora borealis across the dramatic landscapes of Iceland.',
      image_url: '/placeholder.svg?height=400&width=600',
      created_at: '2024-01-05',
      destination: 'Iceland',
      user: {
        name: 'Jane Smith',
        email: 'jane@example.com'
      }
    }
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Blog link has been copied to your clipboard.",
    });
  };

  // Format content for display (convert markdown-like syntax to HTML)
  const formatContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        if (paragraph.startsWith('## ')) {
          return (
            <h2 key={index} className="text-2xl font-semibold mt-8 mb-4 text-foreground">
              {paragraph.replace('## ', '')}
            </h2>
          );
        }
        return (
          <p key={index} className="text-foreground/80 leading-relaxed mb-4">
            {paragraph}
          </p>
        );
      });
  };

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
            {/* Title and Meta */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                {blog.destination && (
                  <Badge variant="secondary">
                    <MapPin className="h-3 w-3 mr-1" />
                    {blog.destination}
                  </Badge>
                )}
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(blog.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{blog.views} views</span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {blog.title}
              </h1>

              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{blog.user.name}</p>
                    <p className="text-sm text-muted-foreground">Travel Blogger</p>
                  </div>
                </div>

                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

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
          </div>

          <Separator />

          {/* Content */}
          <div className="prose-travel">
            {formatContent(blog.content)}
          </div>

          <Separator />

          {/* Author Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">About {blog.user.name}</h3>
                  <p className="text-muted-foreground">
                    Passionate travel blogger exploring the world one destination at a time. 
                    Sharing authentic experiences and practical tips to inspire your next adventure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </article>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold mb-8">More Travel Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <BlogCard key={relatedBlog.id} blog={relatedBlog} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default BlogDetail;