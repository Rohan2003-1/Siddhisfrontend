import { Link } from 'react-router-dom';
import { Monitor, Phone, Mail, MapPin } from 'lucide-react';

const SocialIcon = ({ label }) => (
  <a href="#" aria-label={label} className="w-8 h-8 bg-white/10 hover:bg-accent hover:text-primary rounded-lg flex items-center justify-center transition-colors duration-200 text-xs font-bold">
    {label[0]}
  </a>
);

const Footer = () => (
  <footer className="bg-primary text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-accent/20 rounded-xl"><Monitor size={22} className="text-accent" /></div>
            <div>
              <span className="font-bold text-lg">Siddhis</span>
              <span className="text-accent font-bold text-lg"> Computers</span>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-5">
            Your trusted partner for all computer needs — from premium hardware to expert repair services.
          </p>
          <div className="flex gap-3">
            {['Facebook', 'Instagram', 'Twitter', 'YouTube'].map((name) => (
              <SocialIcon key={name} label={name} />
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-accent">Quick Links</h4>
          <ul className="space-y-2">
            {[
              { label: 'Home', to: '/' },
              { label: 'Products', to: '/products' },
              { label: 'Book Service', to: '/booking' },
              { label: 'My Account', to: '/dashboard' },
            ].map(link => (
              <li key={link.to}>
                <Link to={link.to} className="text-white/70 hover:text-accent transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-accent">Services</h4>
          <ul className="space-y-2">
            {['Laptop Repair', 'PC Assembly', 'Data Recovery', 'OS Installation', 'Virus Removal', 'Network Setup'].map(s => (
              <li key={s}>
                <Link to="/booking" className="text-white/70 hover:text-accent transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-accent">Contact Us</h4>
          <ul className="space-y-3">
            {[
              { icon: MapPin, text: '123, Tech Bazaar, MG Road, Bangalore - 560001' },
              { icon: Phone, text: '+91 98765 43210' },
              { icon: Mail, text: 'support@siddhiscomputers.in' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-white/70 text-sm">
                <Icon size={16} className="text-accent mt-0.5 shrink-0" />
                {text}
              </li>
            ))}
          </ul>
          <div className="mt-5 p-3 bg-white/10 rounded-xl text-sm">
            <p className="text-accent font-semibold">Store Hours</p>
            <p className="text-white/70">Mon–Sat: 9:00 AM – 8:00 PM</p>
            <p className="text-white/70">Sun: 10:00 AM – 6:00 PM</p>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-white/50 text-sm">© 2024 Siddhis Computers. All rights reserved.</p>
        <div className="flex gap-5">
          {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(link => (
            <a key={link} href="#" className="text-white/50 hover:text-accent text-xs transition-colors">{link}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
