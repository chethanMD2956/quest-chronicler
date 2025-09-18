import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import BlogCard from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useBlogs, Blog } from '@/hooks/useBlogs';
import { PenTool, Eye, Edit, Trash2, Plus } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { getUserBlogs, deleteBlog } = useBlogs();
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (user) {
        setLoading(true);
        const blogs = await getUserBlogs(user.id);
        setUserBlogs(blogs);
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [user, getUserBlogs]);

  const handleDeleteBlog = async (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      await deleteBlog(blogId);
      // Refresh user blogs
      if (user) {
        const blogs = await getUserBlogs(user.id);
        setUserBlogs(blogs);
      }
    }
  };

  const stats = {
    totalBlogs: userBlogs.length,
    totalViews: userBlogs.length * 125, // Mock calculation
    avgViews: userBlogs.length > 0 ? Math.round((userBlogs.length * 125) / userBlogs.length) : 0
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
            {userBlogs.length === 0 && !loading && (
              <Link to="/create">
                <Button variant="outline">
                  <PenTool className="h-4 w-4" />
                  Write Your First Blog
                </Button>
              </Link>
            )}
          </div>

          {loading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Loading your blogs...</p>
              </CardContent>
            </Card>
          ) : userBlogs.length === 0 ? (
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
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteBlog(blog.id)}
                        >
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