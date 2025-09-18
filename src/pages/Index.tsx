import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import BlogCard from '@/components/BlogCard';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBlogs } from '@/hooks/useBlogs';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Compass, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/hero-travel.jpg';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { blogs, loading } = useBlogs();
  const { user } = useAuth();

  const [featuredDestinations] = useState([
    'Switzerland',
    'Greece', 
    'Iceland',
    'Japan',
    'Norway',
    'New Zealand'
  ]);

  // Filter blogs based on search query
  const filteredBlogs = useMemo(() => {
    if (!searchQuery) return blogs;
    
    return blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.profiles?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [blogs, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Travel Adventure" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Travel Tales
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Discover amazing destinations through authentic travel stories and adventures from around the world
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search destinations, stories, or authors..."
              className="w-full"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg">
              <Compass className="h-5 w-5" />
              Explore Stories
            </Button>
            {user ? (
              <Link to="/create">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <MapPin className="h-5 w-5" />
                  Share Your Journey
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <MapPin className="h-5 w-5" />
                  Join Community
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <main className="container py-16">
        {/* Featured Destinations */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Popular Destinations</h2>
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-wrap gap-3">
            {featuredDestinations.map((destination) => (
              <Badge 
                key={destination} 
                variant="secondary" 
                className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleSearch(destination)}
              >
                <MapPin className="h-3 w-3 mr-1" />
                {destination}
              </Badge>
            ))}
          </div>
        </section>

        {/* Blog Posts */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Travel Stories'}
              </h2>
              <p className="text-muted-foreground mt-2">
                {searchQuery 
                  ? `Found ${filteredBlogs.length} ${filteredBlogs.length === 1 ? 'story' : 'stories'}`
                  : 'Discover inspiring travel adventures from fellow explorers'
                }
              </p>
            </div>
            {searchQuery && (
              <Button variant="outline" onClick={() => handleSearch('')}>
                Clear Search
              </Button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading amazing travel stories...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? 'No stories found' : 'No travel stories yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? "Try adjusting your search terms or browse all stories"
                  : "Be the first to share your travel adventure!"
                }
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => handleSearch('')}>
                  Show All Stories
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={{
                    id: blog.id,
                    title: blog.title,
                    content: blog.content,
                    image_url: blog.image_url,
                    created_at: blog.created_at,
                    destination: blog.destination,
                    user: {
                      name: blog.profiles?.name || 'Anonymous',
                      email: blog.profiles?.email || ''
                    }
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
