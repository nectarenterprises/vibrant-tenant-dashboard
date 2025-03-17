
import React from 'react';
import { Link } from 'react-router-dom';

const FooterSection = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-tenant-darkGreen to-tenant-green bg-clip-text text-transparent">
              SweetLease
            </h3>
            <p className="text-muted-foreground">
              Simplified property management for commercial occupiers.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-muted-foreground hover:text-foreground">Help Center</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} SweetLease. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="#" className="text-muted-foreground hover:text-foreground">Twitter</Link>
            <Link to="#" className="text-muted-foreground hover:text-foreground">LinkedIn</Link>
            <Link to="#" className="text-muted-foreground hover:text-foreground">Facebook</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
