import React, { useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import AnimatedText from '../ui/AnimatedText';
import { Mail, MapPin, Phone } from 'lucide-react';
import SocialIcon from '../ui/SocialIcon';

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1, once: true });
  
  return (
    <section id="contact" ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <AnimatedText
            text="Get In Touch"
            as="h2"
            animation="reveal"
            className="text-3xl md:text-4xl font-bold mb-4"
          />
          <AnimatedText
            text="Have a project in mind or want to chat? Feel free to reach out!"
            as="p"
            animation="fade"
            delay={300}
            className="text-muted-foreground max-w-2xl mx-auto"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div 
            className={`bg-card rounded-2xl border border-border p-8 shadow-sm transition-all duration-700 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <form className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                      placeholder="Your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                    placeholder="Subject"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all resize-none"
                    placeholder="Your message"
                    required
                  ></textarea>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
          
          <div 
            className={`space-y-8 transition-all duration-700 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Contact Information</h3>
              <p className="text-muted-foreground">
                Feel free to reach out through any of these channels. I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full text-primary">
                    <MapPin size={20} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-medium">Location</h4>
                    <p className="text-muted-foreground">San Francisco, California</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full text-primary">
                    <Mail size={20} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-medium">Email</h4>
                    <a href="mailto:hello@example.com" className="text-muted-foreground hover:text-primary transition-colors">
                      hello@example.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full text-primary">
                    <Phone size={20} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-medium">Phone</h4>
                    <a href="tel:+11234567890" className="text-muted-foreground hover:text-primary transition-colors">
                      +1 (123) 456-7890
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-bold">Connect with me</h3>
              <div className="flex flex-wrap gap-4">
                <SocialIcon platform="github" url="https://github.com" />
                <SocialIcon platform="linkedin" url="https://linkedin.com" />
                <SocialIcon platform="twitter" url="https://twitter.com" />
                <SocialIcon platform="instagram" url="https://instagram.com" />
                <SocialIcon platform="email" url="hello@example.com" />
                <SocialIcon platform="website" url="https://example.com" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
