import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Phone, Mail } from 'lucide-react';
import logo from '../Images/Tiara-logo2.png'

const Footer = () => {
  return (
    <>
      <footer className="bg-[#f5e6e6] py-7 px-6">
        <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Tiara Steps Logo" className="w-20 h-auto" />
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Step into elegance with Tiara Steps, where style meets comfort. Crafted for women who walk with confidence, grace, and timeless charm.
            </p>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm mb-3">KEEP IN TOUCH</h3>
              <div className="flex gap-4">
                <a href="#" className="text-gray-800 hover:text-[#b89396] transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-800 hover:text-[#b89396] transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-800 hover:text-[#b89396] transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div className='mt-[20px]'>
            <h3 className="font-semibold text-gray-800 mb-4">Usefull links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-700 hover:text-[#b89396] transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-700 hover:text-[#b89396] transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-700 hover:text-[#b89396] transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-700 hover:text-[#b89396] transition-colors text-sm">
                  Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className='mt-[20px]'>
            <h3 className="font-semibold text-gray-800 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-700 hover:text-[#b89396] transition-colors text-sm">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-700 hover:text-[#b89396] transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-700 hover:text-[#b89396] transition-colors text-sm">
                  Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className='mt-[20px]'>
            <h3 className="font-semibold text-gray-800 mb-4">Contact</h3>
            <div className="space-y-3">
              <a href="tel:+12345678900" className="flex items-center gap-3 text-gray-700 hover:text-[#b89396] transition-colors text-sm">
                <Phone size={18} />
                <span>+91 9304978001</span>
              </a>
              <a href="mailto:knowmore@tiarasteps.in" className="flex items-center gap-3 text-gray-700 hover:text-[#b89396] transition-colors text-sm break-all">
                <Mail size={18} />
                <span>tiarasteps4you@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        </div>
      </footer>
      
      {/* Copyright */}
      <div className="bg-black py-4">
        <p className="text-center text-sm text-white">
          © 2025 - Tiara steps Private Limited . All right are reserved
        </p>
      </div>
    </>
  );
};

export default Footer;