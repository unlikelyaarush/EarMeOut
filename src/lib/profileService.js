import { supabase } from './supabase';

export const profileService = {
  // Get user profile
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          userId
        });
        throw error;
      }

      return data;
    } catch (error) {
      // PGRST116 is "no rows returned" - this is expected if profile doesn't exist
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Unexpected error fetching profile:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        userId
      });
      return null;
    }
  },

  // Create or update profile
  async upsertProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error upserting profile:', {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          userId
        });
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in upsertProfile:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        userId
      });
      throw error;
    }
  },

  // Update specific fields (uses upsert to create if doesn't exist)
  async updateProfile(userId, updates) {
    try {
      // First, check if profile exists
      const existingProfile = await this.getProfile(userId);
      
      if (!existingProfile) {
        // Profile doesn't exist, create it with updates
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            ...updates,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating profile during update:', {
            error,
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            userId
          });
          throw error;
        }
        return data;
      } else {
        // Profile exists, update it
        const { data, error } = await supabase
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select()
          .single();

        if (error) {
          console.error('Error updating existing profile:', {
            error,
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            userId
          });
          throw error;
        }
        return data;
      }
    } catch (error) {
      console.error('Error in updateProfile:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        userId
      });
      throw error;
    }
  },

  // Initialize profile for new users
  async initializeProfile(userId, email) {
    try {
      // Check if profile already exists
      const existing = await this.getProfile(userId);
      if (existing) {
        return existing;
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          display_name: '',
          pronouns: 'prefer-not-to-say',
          echo_style: 'empathetic',
          response_length: 'deeper',
          focus_areas: [],
          anonymous_mode: false,
          check_in_reminders: true,
          reminder_time: '09:00',
          quiet_hours_enabled: false,
          quiet_hours_start: '22:00',
          quiet_hours_end: '08:00',
          text_size: 'medium',
          language: 'en'
        })
        .select()
        .single();

      if (error) {
        console.error('Error initializing profile:', {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          userId,
          email
        });
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in initializeProfile:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        userId,
        email
      });
      throw error;
    }
  }
};