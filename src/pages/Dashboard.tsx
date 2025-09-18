import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import BlogCard from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenTool, Eye, Edit, Trash2, Plus } from 'lucide-react';

const Dashboard = () => {
  // Mock user blogs data - will be replaced with Supabase data
  const [userBlogs] = useState([
    {
      id: '1',
      title: 'Adventures in the Swiss Alps',
      content: 'Exploring the breathtaking mountain landscapes and charming villages of Switzerland. From hiking through pristine trails to enjoying local cuisine, every moment was magical.',
      image_url: '/placeholder.svg?height=400&width=600',
      created_at: '2024-01-15',
      destination: 'Switzerland',
      user: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    },
    {
      id: '2',
      title: 'Sunset in Santorini',
      content: 'Witnessing the most spectacular sunsets from the white-washed buildings of Santorini. The blue domed churches and endless Aegean Sea create an unforgettable experience.',
      image_url: '/placeholder.svg?height=400&width=600',
      created_at: '2024-01-10',
      destination: 'Greece',
      user: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    }
  ]);

  const stats = {
    totalBlogs: userBlogs.length,
    totalViews: 1250,
    avgViews: Math.round(1250 / userBlogs.length)
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your travel stories and adventures
            </p>
          </div>
          <Link to="/create">
            <Button variant="hero" size="lg">
              <Plus className="h-5 w-5" />
              New Blog Post
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
              <PenTool className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalBlogs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{stats.totalViews}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Views per Blog</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{stats.avgViews}</div>
            </CardContent>
          </Card>
        </div>

        {/* Blogs Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">My Blog Posts</h2>
            {userBlogs.length === 0 && (
              <Link to="/create">
                <Button variant="outline">
                  <PenTool className="h-4 w-4" />
                  Write Your First Blog
                </Button>
              </Link>
            )}
          </div>

          {userBlogs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <PenTool className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No blogs yet</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Start sharing your travel adventures with the world!
                </p>
                <Link to="/create">
                  <Button variant="hero">
                    <Plus className="h-4 w-4" />
                    Create Your First Blog
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userBlogs.map((blog) => (
                <Card key={blog.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Blog Image */}
                      <div className="flex-shrink-0">
                        {blog.image_url ? (
                          <img 
                            src={blog.image_url} 
                            alt={blog.title}
                            className="w-full md:w-32 h-24 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full md:w-32 h-24 hero-gradient rounded-lg flex items-center justify-center">
                            <PenTool className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Blog Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                          {blog.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {blog.content}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          Created on {new Date(blog.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2">
                        <Link to={`/blog/${blog.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </Link>
                        <Link to={`/edit/${blog.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;