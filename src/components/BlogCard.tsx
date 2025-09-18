import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, MapPin } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  user: {
    name: string;
    email: string;
  };
  destination?: string;
}

interface BlogCardProps {
  blog: BlogPost;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="blog-card h-full overflow-hidden group cursor-pointer">
      <Link to={`/blog/${blog.id}`} className="block h-full">
        {/* Blog Image */}
        <div className="relative h-48 overflow-hidden">
          {blog.image_url ? (
            <img 
              src={blog.image_url} 
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full hero-gradient flex items-center justify-center">
              <MapPin className="h-12 w-12 text-white/80" />
            </div>
          )}
          
          {/* Destination Badge */}
          {blog.destination && (
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-white/90 text-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                {blog.destination}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          {/* Title */}
          <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {blog.title}
          </h3>
          
          {/* Content Preview */}
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {truncateContent(blog.content)}
          </p>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex items-center justify-between text-sm text-muted-foreground">
          {/* Author */}
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{blog.user.name}</span>
          </div>
          
          {/* Date */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(blog.created_at)}</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default BlogCard;