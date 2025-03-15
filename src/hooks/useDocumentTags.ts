
import { useState, useEffect } from 'react';
import { DocumentTag } from '@/types/property';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Define a type for the document_tags table response
type DocumentTagResponse = {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
};

export const useDocumentTags = () => {
  const [tags, setTags] = useState<DocumentTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setTags([]);
        return;
      }
      
      // Use the correct table name that we just created
      const { data, error } = await supabase
        .from('document_tags')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching tags:', error);
        toast({
          variant: "destructive",
          title: "Error fetching tags",
          description: error.message,
        });
        setTags([]);
        return;
      }
      
      // Map the database fields to our DocumentTag type
      setTags((data as DocumentTagResponse[]).map(tag => ({
        id: tag.id,
        name: tag.name,
        color: tag.color
      })));
    } catch (error: any) {
      console.error('Error in fetchTags:', error);
      setTags([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTags();
  }, []);
  
  const addTag = async (tag: Omit<DocumentTag, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "You must be logged in to add tags",
        });
        return null;
      }
      
      const newTag = {
        id: uuidv4(),
        name: tag.name,
        color: tag.color,
        user_id: user.id
      };
      
      // Insert into the correct table
      const { data, error } = await supabase
        .from('document_tags')
        .insert(newTag)
        .select()
        .single();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error adding tag",
          description: error.message,
        });
        return null;
      }
      
      const createdTag: DocumentTag = {
        id: (data as DocumentTagResponse).id,
        name: (data as DocumentTagResponse).name,
        color: (data as DocumentTagResponse).color
      };
      
      setTags(prev => [...prev, createdTag]);
      return createdTag;
    } catch (error: any) {
      console.error('Error in addTag:', error);
      return null;
    }
  };
  
  const updateTag = async (tag: DocumentTag) => {
    try {
      // Update the tag in the database
      const { error } = await supabase
        .from('document_tags')
        .update({
          name: tag.name,
          color: tag.color
        })
        .eq('id', tag.id);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error updating tag",
          description: error.message,
        });
        return false;
      }
      
      // Update the tag in our local state
      setTags(prev => prev.map(t => t.id === tag.id ? tag : t));
      return true;
    } catch (error: any) {
      console.error('Error in updateTag:', error);
      return false;
    }
  };
  
  const deleteTag = async (tagId: string) => {
    try {
      // Delete the tag from the database
      const { error } = await supabase
        .from('document_tags')
        .delete()
        .eq('id', tagId);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error deleting tag",
          description: error.message,
        });
        return false;
      }
      
      // Remove the tag from our local state
      setTags(prev => prev.filter(t => t.id !== tagId));
      return true;
    } catch (error: any) {
      console.error('Error in deleteTag:', error);
      return false;
    }
  };
  
  return {
    tags,
    isLoading,
    fetchTags,
    addTag,
    updateTag,
    deleteTag
  };
};
