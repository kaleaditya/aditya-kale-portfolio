
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Contact {
  id: string;
  email: string;
  phone: string | null;
  address: string | null;
  enable_contact_form: boolean;
  notification_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export const useContact = () => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContact = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('contact')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      setContact(data);
      return data;
    } catch (err: any) {
      console.error('Error fetching contact data:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to load contact data: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (updates: Partial<Omit<Contact, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      setLoading(true);
      setError(null);
      
      // If there's no contact data yet, create one
      if (!contact) {
        // Make sure the email field exists when creating a new contact
        if (!updates.email) {
          throw new Error("Email is required for contact information");
        }
        
        const { data, error } = await supabase
          .from('contact')
          .insert(updates)
          .select();
        
        if (error) throw error;
        
        setContact(data[0]);
        toast({
          title: 'Success',
          description: 'Contact information created successfully',
        });
        
        return data[0];
      } else {
        // Update existing contact data
        const { data, error } = await supabase
          .from('contact')
          .update(updates)
          .eq('id', contact.id)
          .select();
        
        if (error) throw error;
        
        setContact(data[0]);
        toast({
          title: 'Success',
          description: 'Contact information updated successfully',
        });
        
        return data[0];
      }
    } catch (err: any) {
      console.error('Error updating contact data:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to update contact information: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setMessages(data);
      return data;
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to load messages: ${err.message}`,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const submitMessage = async (message: Omit<Message, 'id' | 'read' | 'created_at'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('messages')
        .insert([message])
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Message Sent',
        description: 'Your message has been sent successfully!',
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error submitting message:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to send message: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const markMessageAsRead = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, read: true } : msg));
      return data[0];
    } catch (err: any) {
      console.error('Error marking message as read:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to mark message as read: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMessages(prev => prev.filter(msg => msg.id !== id));
      toast({
        title: 'Success',
        description: 'Message deleted successfully',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error deleting message:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to delete message: ${err.message}`,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    contact,
    messages,
    loading,
    error,
    fetchContact,
    updateContact,
    fetchMessages,
    submitMessage,
    markMessageAsRead,
    deleteMessage
  };
};
