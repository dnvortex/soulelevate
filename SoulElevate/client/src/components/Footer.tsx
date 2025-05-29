import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background/80 border-t border-primary/10 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              INNER APPRAISAL
            </h2>
            <p className="text-gray-400 text-sm mt-1">Transform Your Inner Self</p>
          </div>
          
          <nav className="mb-4 md:mb-0">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-primary text-sm">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/quotes">
                  <a className="text-gray-300 hover:text-primary text-sm">Daily Quotes</a>
                </Link>
              </li>
              <li>
                <Link href="/tips">
                  <a className="text-gray-300 hover:text-primary text-sm">Tips</a>
                </Link>
              </li>
              <li>
                <Link href="/media">
                  <a className="text-gray-300 hover:text-primary text-sm">Video & Audio</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-300 hover:text-primary text-sm">Contact</a>
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="text-gray-400 text-sm">
            &copy; {currentYear} Inner Appraisal. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
