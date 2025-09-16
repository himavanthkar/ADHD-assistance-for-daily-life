import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication
export const auth = {
  signInWithEmailAndPassword: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  createUserWithEmailAndPassword: async (email, password, displayName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        }
      }
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  onAuthStateChanged: (callback) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  }
};

// User management
export const saveUserData = async (userId, userData) => {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      id: userId,
      ...userData,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
};

export const getUserData = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

// Task management with ADHD optimizations
export const saveUserTask = async (userId, taskData) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      ...taskData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserTasks = async (userId, dateFilter = null) => {
  let query = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (dateFilter) {
    query = query.eq('date', dateFilter);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const updateUserTask = async (taskId, updates) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteUserTask = async (taskId) => {
  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
  
  if (error) throw error;
  return data;
};

// Real-time task subscription
export const subscribeToUserTasks = (userId, callback) => {
  const subscription = supabase
    .channel('tasks')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        // Fetch updated tasks and call callback
        getUserTasks(userId).then(callback);
      }
    )
    .subscribe();
  
  return () => subscription.unsubscribe();
};

// Mood tracking with real-time theme updates
export const saveMoodData = async (userId, moodData) => {
  const { data, error } = await supabase
    .from('moods')
    .insert({
      user_id: userId,
      ...moodData,
      timestamp: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserMoods = async (userId, limit = 10) => {
  const { data, error } = await supabase
    .from('moods')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};

// Real-time mood subscription for theme changes
export const subscribeToMoodChanges = (userId, callback) => {
  const subscription = supabase
    .channel('moods')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'moods',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
  
  return () => subscription.unsubscribe();
};

// Voice notes management
export const saveVoiceNote = async (userId, noteData) => {
  const { data, error } = await supabase
    .from('voice_notes')
    .insert({
      user_id: userId,
      ...noteData,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserVoiceNotes = async (userId, searchTerm = null) => {
  let query = supabase
    .from('voice_notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (searchTerm) {
    query = query.textSearch('searchable', searchTerm);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const deleteVoiceNote = async (noteId) => {
  const { data, error } = await supabase
    .from('voice_notes')
    .delete()
    .eq('id', noteId);
  
  if (error) throw error;
  return data;
};

// Focus sessions (CBT/Pomodoro)
export const saveFocusSession = async (userId, sessionData) => {
  const { data, error } = await supabase
    .from('focus_sessions')
    .insert({
      user_id: userId,
      ...sessionData,
      started_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateFocusSession = async (sessionId, updates) => {
  const { data, error } = await supabase
    .from('focus_sessions')
    .update({
      ...updates,
      completed_at: updates.completed ? new Date().toISOString() : null
    })
    .eq('id', sessionId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserFocusSessions = async (userId, limit = 20) => {
  const { data, error } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};

// Analytics and insights
export const trackAnalyticsEvent = async (userId, eventType, eventData) => {
  const { data, error } = await supabase
    .from('analytics_events')
    .insert({
      user_id: userId,
      event_type: eventType,
      event_data: eventData,
      timestamp: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
};

export const getUserAnalytics = async (userId) => {
  // Get productivity score using the database function
  const { data: productivityData } = await supabase
    .rpc('calculate_productivity_score', { user_uuid: userId });
  
  // Get mood trends
  const { data: moodTrends } = await supabase
    .rpc('get_mood_trends', { user_uuid: userId });
  
  // Get basic stats
  const { data: tasks } = await getUserTasks(userId);
  const { data: sessions } = await getUserFocusSessions(userId);
  
  return {
    productivity_score: productivityData || 0,
    mood_trends: moodTrends || [],
    total_tasks: tasks?.length || 0,
    completed_tasks: tasks?.filter(t => t.done).length || 0,
    focus_sessions: sessions?.length || 0,
    last_activity: tasks?.[0]?.updated_at || null
  };
};

// AI conversation history
export const saveAIConversation = async (userId, agentType, query, response) => {
  const { data, error } = await supabase
    .from('ai_conversations')
    .insert({
      user_id: userId,
      agent_type: agentType,
      query: query,
      response: response,
      created_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
};

// User goals and achievements
export const saveUserGoal = async (userId, goalData) => {
  const { data, error } = await supabase
    .from('user_goals')
    .insert({
      user_id: userId,
      ...goalData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserGoals = async (userId) => {
  const { data, error } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const updateUserGoal = async (goalId, updates) => {
  const { data, error } = await supabase
    .from('user_goals')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', goalId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Achievements and gamification
export const unlockAchievement = async (userId, achievementData) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .insert({
      user_id: userId,
      ...achievementData,
      unlocked_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserAchievements = async (userId) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Admin functions
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      tasks:tasks(count),
      moods:moods(count),
      focus_sessions:focus_sessions(count)
    `);
  
  if (error) throw error;
  return data;
};

// ADHD-specific helper functions
export const getTasksByEnergyLevel = async (userId, energyLevel) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('energy_required', energyLevel)
    .eq('done', false)
    .order('priority', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getTasksByDifficulty = async (userId, difficulty) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('difficulty', difficulty)
    .eq('done', false)
    .order('priority', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getMoodPatterns = async (userId, days = 30) => {
  const { data, error } = await supabase
    .from('moods')
    .select('mood, timestamp, confidence')
    .eq('user_id', userId)
    .gte('timestamp', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
    .order('timestamp', { ascending: true });
  
  if (error) throw error;
  return data;
};

// Migration helper - convert localStorage to Supabase
export const migrateLocalStorageToSupabase = async (userId) => {
  try {
    // Migrate voice notes
    const voiceNotes = JSON.parse(localStorage.getItem('voiceNotes') || '[]');
    for (const note of voiceNotes) {
      await saveVoiceNote(userId, {
        text: note.text,
        source: note.source || 'voice',
        tags: note.tags || []
      });
    }
    
    // Clear localStorage after migration
    localStorage.removeItem('voiceNotes');
    
    console.log('✅ Successfully migrated localStorage data to Supabase');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

export default supabase; 