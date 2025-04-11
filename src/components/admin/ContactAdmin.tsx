
import React, { useState } from 'react';
import { Save, Mail, Phone, MapPin, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

// Sample message type
interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

// Mock data
const sampleMessages: Message[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    subject: 'Project Inquiry',
    message: 'Hi there, I\'m interested in working with you on a new project. Can we schedule a call to discuss the details?',
    date: '2023-08-15',
    read: true,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    subject: 'Collaboration Opportunity',
    message: 'Hello! I saw your portfolio and I\'m impressed with your work. I think we could collaborate on an upcoming project.',
    date: '2023-08-10',
    read: false,
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    subject: 'Question about your services',
    message: 'I\'m looking for a developer who can help with a React application. Do you have experience with large-scale applications?',
    date: '2023-08-05',
    read: false,
  },
];

const ContactAdmin = () => {
  const [contactInfo, setContactInfo] = useState({
    email: 'contact@example.com',
    phone: '+1 (555) 123-4567',
    address: 'San Francisco, CA',
    enableContactForm: true,
    notificationEmail: 'notifications@example.com',
  });
  
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
  const updateContactInfo = (field: string, value: string | boolean) => {
    setContactInfo({
      ...contactInfo,
      [field]: value
    });
  };
  
  const markAsRead = (id: string) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };
  
  const deleteMessage = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };
  
  const viewMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.id);
    }
  };
  
  const saveChanges = () => {
    console.log('Saving contact settings:', contactInfo);
    alert('Contact settings updated successfully!');
  };
  
  const unreadCount = messages.filter(msg => !msg.read).length;
  
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
                    value={contactInfo.email}
                    onChange={(e) => updateContactInfo('email', e.target.value)}
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
                    value={contactInfo.phone}
                    onChange={(e) => updateContactInfo('phone', e.target.value)}
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
                    value={contactInfo.address}
                    onChange={(e) => updateContactInfo('address', e.target.value)}
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
                  checked={contactInfo.enableContactForm}
                  onCheckedChange={(checked) => updateContactInfo('enableContactForm', checked)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="notification-email">Notification Email</Label>
                <Input 
                  id="notification-email" 
                  value={contactInfo.notificationEmail}
                  onChange={(e) => updateContactInfo('notificationEmail', e.target.value)}
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
                          {new Date(message.date).toLocaleDateString()}
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
                      onClick={() => deleteMessage(selectedMessage.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground">
                    <div><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</div>
                    <div><strong>Date:</strong> {new Date(selectedMessage.date).toLocaleDateString()}</div>
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
