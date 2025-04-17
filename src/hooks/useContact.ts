
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
  const [contactInfo, setContactInfo] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('contact')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      setContactInfo(data);
      return data;
    } catch (err: any) {
      console.error('Error fetching contact info:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to load contact info: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createContactInfo = async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('contact')
        .insert(contact)
        .select();
      
      if (error) throw error;
      
      setContactInfo(data[0]);
      toast({
        title: 'Success',
        description: 'Contact info created successfully',
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error creating contact info:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to create contact info: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateContactInfo = async (id: string, updates: Partial<Omit<Contact, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('contact')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      setContactInfo(data[0]);
      toast({
        title: 'Success',
        description: 'Contact info updated successfully',
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error updating contact info:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to update contact info: ${err.message}`,
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

  const submitMessage = async (messageData: Omit<Message, 'id' | 'read' | 'created_at'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          ...messageData,
          read: false
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Message sent successfully',
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

  const markMessageAsRead = async (id: string, isRead: boolean = true) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('messages')
        .update({ read: isRead })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, read: isRead } : msg));
      
      toast({
        title: 'Success',
        description: `Message marked as ${isRead ? 'read' : 'unread'}`,
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error updating message:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to update message: ${err.message}`,
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
    contactInfo,
    messages,
    loading,
    error,
    fetchContactInfo,
    createContactInfo,
    updateContactInfo,
    fetchMessages,
    submitMessage,
    markMessageAsRead,
    deleteMessage
  };
};
