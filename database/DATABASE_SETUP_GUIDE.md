# 🗄️ NeuroBoost Database Migration Guide

## 🎯 **Database Comparison for NeuroBoost**

| Feature | Supabase | PlanetScale | CockroachDB | Firebase (Current) |
|---------|----------|-------------|-------------|-------------------|
| **Real-time** | ✅ PostgreSQL Triggers | ⚠️ Webhooks needed | ⚠️ Custom solution | ✅ Native |
| **ADHD Analytics** | ✅ SQL + Functions | ✅ SQL queries | ✅ Complex SQL | ❌ Limited |
| **Vector/AI Search** | ✅ pgvector | ❌ No vectors | ✅ Vector support | ❌ No vectors |
| **Free Tier** | ✅ Generous | ✅ Good | ⚠️ Limited | ✅ Good |
| **Scaling** | ✅ Auto-scale | ✅ Serverless | ✅ Global | ✅ Auto |
| **Learning Curve** | 🟨 Medium | 🟨 Medium | 🟥 Hard | 🟩 Easy |
| **ADHD Features** | 🟩 Perfect | 🟨 Good | 🟨 Good | 🟥 Limited |

---

## 🚀 **RECOMMENDED: Supabase Setup**

### **Why Supabase for ADHD Platform?**
- **Real-time mood tracking** with instant theme changes
- **Advanced analytics** with SQL functions for ADHD patterns
- **Vector search** for AI-powered insights
- **Row-level security** for user data protection
- **Easy migration** from Firebase

### **Setup Steps:**

1. **Create Supabase Project**
```bash
# Visit https://supabase.com/dashboard
# Create new project
# Note your URL and anon key
```

2. **Install Dependencies**
```bash
cd frontend
npm install @supabase/supabase-js
```

3. **Environment Variables**
```env
# frontend/.env.local
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run Schema Migration**
```sql
-- Copy and run database/supabase_schema.sql in Supabase SQL Editor
-- This creates all tables, indexes, and ADHD-specific functions
```

5. **Update Frontend**
```javascript
// Replace Firebase imports with Supabase
import { auth, saveUserTask, getUserTasks } from './services/supabase.js';
```

---

## 🌟 **Alternative: PlanetScale Setup**

### **When to Choose PlanetScale:**
- Need database branching for team development
- Want MySQL ecosystem familiarity
- Require zero-downtime schema changes

### **Setup:**
```bash
# Install PlanetScale CLI
curl -L https://github.com/planetscale/cli/releases/latest/download/pscale_linux_amd64.tar.gz | tar -xz

# Create database
pscale database create neuroboost

# Create branches
pscale branch create neuroboost dev
pscale branch create neuroboost staging
```

---

## 🏢 **Enterprise: CockroachDB**

### **When to Choose CockroachDB:**
- Global user base requiring multi-region
- Need ACID guarantees across regions
- Enterprise compliance requirements

### **Setup:**
```bash
# CockroachDB Cloud setup
# Visit https://cockroachlabs.cloud/
# Create cluster with regions matching user base
```

---

## 📊 **Migration Strategy**

### **Phase 1: Parallel Setup (Week 1)**
```bash
# Set up Supabase alongside Firebase
# Implement dual-write to both databases
# Test all features work with Supabase
```

### **Phase 2: Data Migration (Week 2)**
```javascript
// Use the migration helper
import { migrateLocalStorageToSupabase } from './services/supabase.js';

// Migrate user data
await migrateLocalStorageToSupabase(currentUser.id);
```

### **Phase 3: Switch & Cleanup (Week 3)**
```bash
# Update all components to use Supabase
# Remove Firebase dependencies
# Monitor performance and user experience
```

---

## 🔧 **ADHD-Specific Database Features**

### **1. Mood-Based Task Suggestions**
```sql
-- Get tasks matching current energy level
SELECT * FROM tasks 
WHERE user_id = $1 
  AND energy_required = get_current_energy_level($1)
  AND done = false
ORDER BY priority DESC;
```

### **2. Pattern Recognition**
```sql
-- Detect ADHD productivity patterns
SELECT 
  EXTRACT(hour FROM completed_at) as hour_of_day,
  COUNT(*) as tasks_completed,
  AVG(estimated_minutes) as avg_duration
FROM tasks 
WHERE user_id = $1 AND done = true
GROUP BY hour_of_day
ORDER BY tasks_completed DESC;
```

### **3. Real-time Mood Themes**
```sql
-- Trigger function for instant theme updates
CREATE OR REPLACE FUNCTION notify_mood_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify frontend of mood change for theme update
  PERFORM pg_notify('mood_updates', json_build_object(
    'user_id', NEW.user_id,
    'mood', NEW.mood,
    'theme', get_theme_for_mood(NEW.mood)
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 📈 **Performance Optimizations**

### **Indexes for ADHD Queries**
```sql
-- Fast task lookups by energy and mood
CREATE INDEX idx_tasks_energy_mood ON tasks(user_id, energy_required, date) 
WHERE done = false;

-- Mood pattern analysis
CREATE INDEX idx_moods_pattern ON moods(user_id, timestamp DESC, mood);

-- Voice note search
CREATE INDEX idx_voice_search ON voice_notes 
USING GIN(to_tsvector('english', text));
```

### **Caching Strategy**
```javascript
// Cache frequently accessed data
const taskCache = new Map();
const moodCache = new Map();

export const getCachedTasks = async (userId) => {
  if (taskCache.has(userId)) {
    return taskCache.get(userId);
  }
  
  const tasks = await getUserTasks(userId);
  taskCache.set(userId, tasks);
  return tasks;
};
```

---

## 🔐 **Security & Privacy**

### **Row Level Security (RLS)**
```sql
-- Users can only access their own data
CREATE POLICY "user_isolation" ON tasks 
FOR ALL USING (auth.uid() = user_id);

-- Admin access for analytics
CREATE POLICY "admin_access" ON analytics_events 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND is_admin = true
  )
);
```

### **Data Encryption**
```javascript
// Encrypt sensitive ADHD data
import { encrypt, decrypt } from './utils/encryption.js';

export const saveSensitiveData = async (userId, data) => {
  const encryptedData = encrypt(JSON.stringify(data));
  return await supabase.from('user_sensitive').insert({
    user_id: userId,
    encrypted_data: encryptedData
  });
};
```

---

## 🚀 **Quick Start Commands**

```bash
# 1. Choose Supabase (recommended)
cd frontend
npm install @supabase/supabase-js

# 2. Set up environment
cp .env.example .env.local
# Add your Supabase credentials

# 3. Run schema migration
# Copy database/supabase_schema.sql to Supabase SQL Editor

# 4. Test the migration
npm run dev
# Login and test all features

# 5. Monitor and optimize
# Check Supabase dashboard for query performance
```

---

## 📋 **Post-Migration Checklist**

- [ ] All user authentication works
- [ ] Tasks sync in real-time
- [ ] Mood changes update themes instantly
- [ ] Voice notes are searchable
- [ ] Analytics show ADHD patterns
- [ ] Admin dashboard functions properly
- [ ] Mobile responsiveness maintained
- [ ] Performance is equal or better than Firebase

---

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **Real-time not working**
```javascript
// Check if subscriptions are properly set up
const subscription = supabase
  .channel('tasks')
  .on('postgres_changes', { ... })
  .subscribe();
```

2. **Slow queries**
```sql
-- Add missing indexes
EXPLAIN ANALYZE SELECT * FROM tasks WHERE user_id = $1;
```

3. **Authentication errors**
```javascript
// Verify RLS policies are correct
const { data, error } = await supabase.auth.getUser();
if (error) console.error('Auth error:', error);
```

Choose **Supabase** for the best balance of features, ease of use, and ADHD-specific capabilities! 🎯 