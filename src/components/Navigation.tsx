import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MapPin, 
  User, 
  LogOut, 
  Menu, 
  X,
  PenTool,
  Home,
  LogIn
} from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-gradient">TravelTales</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="flex items-center space-x-1 text-foreground/80 hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          
          {user && (
            <>
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-1 text-foreground/80 hover:text-foreground transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link to="/create">
                <Button variant="accent" size="sm">
                  <PenTool className="h-4 w-4" />
                  Write Blog
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">
                Welcome back!
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/auth">
                <Button variant="hero" size="sm">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-3">
            <Link 
              to="/" 
              className="flex items-center space-x-2 py-2 text-foreground/80 hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 py-2 text-foreground/80 hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/create"
                  className="flex items-center space-x-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="accent" size="sm" className="w-full justify-start">
                    <PenTool className="h-4 w-4" />
                    Write Blog
                  </Button>
                </Link>
                <div className="pt-2 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-2 pt-2 border-t">
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button 
                    variant="hero" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;