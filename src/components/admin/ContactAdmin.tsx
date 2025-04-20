
import React, { useState, useEffect } from 'react';
import { Save, Mail, Phone, MapPin, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useContact, Message } from '@/hooks/useContact';

const ContactAdmin = () => {
  const { 
    contactInfo, 
    messages, 
    loading, 
    fetchContactInfo, 
    updateContactInfo, 
    fetchMessages, 
    markMessageAsRead, 
    deleteMessage 
  } = useContact();
  
  const [contactData, setContactData] = useState({
    email: 'contact@example.com',
    phone: '+1 (555) 123-4567',
    address: 'San Francisco, CA',
    enable_contact_form: true,
    notification_email: 'notifications@example.com',
  });
  
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const contactData = await fetchContactInfo();
      await fetchMessages();
      
      if (contactData) {
        setContactData({
          email: contactData.email,
          phone: contactData.phone || '',
          address: contactData.address || '',
          enable_contact_form: contactData.enable_contact_form,
          notification_email: contactData.notification_email || '',
        });
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  const updateContactField = (field: string, value: string | boolean) => {
    setContactData({
      ...contactData,
      [field]: value
    });
  };
  
  const viewMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markMessageAsRead(message.id);
    }
  };
  
  const handleDeleteMessage = (id: string) => {
    deleteMessage(id);
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };
  
  const saveChanges = async () => {
    // debugger
    setIsLoading(true);
      await updateContactInfo(contactInfo.id, {
        email: contactData.email,
        phone: contactData.phone || null,
        address: contactData.address || null,
        enable_contact_form: contactData.enable_contact_form,
        notification_email: contactData.notification_email || null,
      });
    setIsLoading(false);

  };
  
  const unreadCount = messages.filter(msg => !msg.read).length;
  
  if (isLoading && !contactInfo && messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contact Management</h1>
        <Button onClick={saveChanges} className="flex items-center gap-2">
          <Save size={16} />
          <span>Save Settings</span>
        </Button>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-[1fr,1.5fr]">
        <div className="space-y-6">
          <div className="p-6 bg-card rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-primary" size={20} />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    value={contactData.email}
                    onChange={(e) => updateContactField('email', e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="text-primary" size={20} />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={contactData.phone}
                    onChange={(e) => updateContactField('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="text-primary" size={20} />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="address">Location/Address</Label>
                  <Input 
                    id="address" 
                    value={contactData.address}
                    onChange={(e) => updateContactField('address', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-card rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">Form Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enable Contact Form</h3>
                  <p className="text-sm text-muted-foreground">Allow visitors to contact you via form</p>
                </div>
                <Switch 
                  checked={contactData.enable_contact_form}
                  onCheckedChange={(checked) => updateContactField('enable_contact_form', checked)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="notification-email">Notification Email</Label>
                <Input 
                  id="notification-email" 
                  value={contactData.notification_email}
                  onChange={(e) => updateContactField('notification_email', e.target.value)}
                  placeholder="Where to receive notifications"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You'll receive a notification at this email when someone contacts you.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-card rounded-lg border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Messages</h2>
            {unreadCount > 0 && (
              <div className="bg-primary px-2 py-1 rounded-full text-xs font-medium">
                {unreadCount} unread
              </div>
            )}
          </div>
          
          {messages.length > 0 ? (
            <div className="grid lg:grid-cols-[300px,1fr] gap-4 h-[500px]">
              <div className="border rounded-md overflow-hidden h-full">
                <div className="max-h-full overflow-y-auto">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      onClick={() => viewMessage(message)}
                      className={`
                        p-4 border-b cursor-pointer transition-colors
                        ${selectedMessage?.id === message.id ? 'bg-secondary' : 'hover:bg-secondary/50'}
                        ${!message.read ? 'border-l-4 border-l-primary' : ''}
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className={`font-medium ${!message.read ? 'text-primary' : ''}`}>
                          {message.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{message.subject}</p>
                      <p className="text-xs truncate mt-2">{message.message}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedMessage ? (
                <div className="border rounded-md p-4 overflow-y-auto h-full flex flex-col">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground">
                    <div><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</div>
                    <div><strong>Date:</strong> {new Date(selectedMessage.created_at).toLocaleDateString()}</div>
                  </div>
                  
                  <div className="mt-6 flex-1 overflow-y-auto">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      <Mail size={16} className="mr-2" />
                      Reply via Email
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border rounded-md p-8 flex flex-col items-center justify-center text-center text-muted-foreground">
                  <Mail size={40} className="mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">No message selected</h3>
                  <p className="text-sm mt-2">Select a message from the list to view its contents</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center text-center text-muted-foreground">
              <Mail size={40} className="mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No messages yet</h3>
              <p className="text-sm mt-2">When someone contacts you, their messages will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactAdmin;
