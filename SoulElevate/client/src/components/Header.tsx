import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-primary/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary cursor-pointer">
              INNER APPRAISAL
            </h1>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link href="/">
                <a className={`${isActive("/") ? "text-primary" : "text-white"} hover:text-primary transition-colors`}>
                  Home
                </a>
              </Link>
            </li>
            <li>
              <Link href="/quotes">
                <a className={`${isActive("/quotes") ? "text-primary" : "text-white"} hover:text-primary transition-colors`}>
                  Daily Quotes
                </a>
              </Link>
            </li>
            <li>
              <Link href="/tips">
                <a className={`${isActive("/tips") ? "text-primary" : "text-white"} hover:text-primary transition-colors`}>
                  Tips
                </a>
              </Link>
            </li>
            <li>
              <Link href="/media">
                <a className={`${isActive("/media") ? "text-primary" : "text-white"} hover:text-primary transition-colors`}>
                  Video & Audio
                </a>
              </Link>
            </li>
            <li>
              <Link href="/challenges">
                <a className={`${isActive("/challenges") ? "text-primary" : "text-white"} hover:text-primary transition-colors`}>
                  Challenges
                </a>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <a className={`${isActive("/contact") ? "text-primary" : "text-white"} hover:text-primary transition-colors`}>
                  Contact
                </a>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMenu} 
          className="md:hidden text-white focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md pt-16 px-4">
          <div className="h-full flex flex-col items-center justify-center space-y-6 text-xl">
            <Link href="/">
              <a 
                className="text-white hover:text-primary transition-colors" 
                onClick={closeMenu}
              >
                Home
              </a>
            </Link>
            <Link href="/quotes">
              <a 
                className="text-white hover:text-primary transition-colors" 
                onClick={closeMenu}
              >
                Daily Quotes
              </a>
            </Link>
            <Link href="/tips">
              <a 
                className="text-white hover:text-primary transition-colors" 
                onClick={closeMenu}
              >
                Tips
              </a>
            </Link>
            <Link href="/media">
              <a 
                className="text-white hover:text-primary transition-colors" 
                onClick={closeMenu}
              >
                Video & Audio
              </a>
            </Link>
            <Link href="/challenges">
              <a 
                className="text-white hover:text-primary transition-colors" 
                onClick={closeMenu}
              >
                Challenges
              </a>
            </Link>
            <Link href="/contact">
              <a 
                className="text-white hover:text-primary transition-colors" 
                onClick={closeMenu}
              >
                Contact
              </a>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={closeMenu} 
              className="mt-8 text-white"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
