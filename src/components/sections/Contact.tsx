
import React, { useRef, useState, useEffect } from 'react';
import { useInView } from '@/hooks/useInView';
import AnimatedText from '../ui/AnimatedText';
import { Mail, MapPin, Phone, Loader2 } from 'lucide-react';
import SocialIcon from '../ui/SocialIcon';
import { useContact } from '@/hooks/useContact';
import { toast } from '@/hooks/use-toast';

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1, once: true });
  const { contact, loading, fetchContact, submitMessage } = useContact();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    fetchContact();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields in the form.",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      await submitMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } finally {
      setSubmitting(false);
    }
  };
  
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
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <span>Loading contact form...</span>
              </div>
            ) : contact && contact.enable_contact_form ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
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
                        value={formData.name}
                        onChange={handleChange}
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
                        value={formData.email}
                        onChange={handleChange}
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
                      value={formData.subject}
                      onChange={handleChange}
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
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Sending...</span>
                    </div>
                  ) : 'Send Message'}
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-64">
                <Mail className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Contact form is disabled</h3>
                <p className="text-muted-foreground">
                  Please use the contact information on the right to get in touch.
                </p>
              </div>
            )}
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
                    <p className="text-muted-foreground">{contact?.address || 'San Francisco, California'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full text-primary">
                    <Mail size={20} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-medium">Email</h4>
                    <a href={`mailto:${contact?.email || 'hello@example.com'}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {contact?.email || 'hello@example.com'}
                    </a>
                  </div>
                </div>
                
                {contact?.phone && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full text-primary">
                      <Phone size={20} />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium">Phone</h4>
                      <a href={`tel:${contact.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-bold">Connect with me</h3>
              <div className="flex flex-wrap gap-4">
                <SocialIcon platform="github" url="https://github.com" />
                <SocialIcon platform="linkedin" url="https://linkedin.com" />
                <SocialIcon platform="twitter" url="https://twitter.com" />
                <SocialIcon platform="instagram" url="https://instagram.com" />
                <SocialIcon platform="email" url={`mailto:${contact?.email || 'hello@example.com'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
