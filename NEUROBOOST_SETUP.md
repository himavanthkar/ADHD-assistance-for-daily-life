# 🧠 NeuroBoost - AI-Powered ADHD Productivity Platform

## 🎯 **Current Status: WORKING**

✅ **Voice-to-Task Integration**: Working  
✅ **Mood Detection**: Working  
✅ **Firebase Integration**: Configured  
✅ **Admin Dashboard**: Ready  
✅ **User Management**: Implemented  
✅ **Theme System**: Working  

---

## 🚀 **Quick Start**

### 1. **Start All Services**
```bash
python run_app.py
```

### 2. **Open App**
- Frontend: http://localhost:3001
- AI Agents: http://localhost:8000  
- Voice Service: http://localhost:8002

### 3. **Test Everything**
```bash
python test_voice_integration.py
```

---

## 🔧 **What We Fixed**

### ✅ **Issues Resolved:**
1. **DateTime Import Error**: Fixed `timedelta` import in AI agents
2. **Firebase Configuration**: Added your project credentials
3. **User-Specific Data**: Each user gets their own tasks/moods
4. **Admin Dashboard**: Full user management system
5. **Voice Integration**: Working voice-to-task conversion
6. **Mood Detection**: AI-powered mood analysis with Firebase storage

### 🎨 **Key Features Working:**
- **Real-time Mood Detection**: Voice/text → AI analysis → Theme changes
- **Voice Task Management**: "Add workout to Monday" → Task created
- **User Separation**: Different users see different data
- **Admin Controls**: Manage all users, view analytics
- **Firebase Sync**: Real-time data across devices

---

## 👥 **User System**

### **Different User Types:**
1. **Regular Users**: Their own tasks, moods, analytics
2. **Admin Users**: Can see all users + admin dashboard
3. **Premium Users**: Advanced features (future)

### **How to Create Admin User:**
```javascript
// In Firebase Console → Firestore → users collection
{
  uid: "user-id",
  email: "admin@example.com", 
  isAdmin: true,
  subscription: "premium"
}
```

---

## 🗂️ **Firebase Data Structure**

```
neuroboost-bb20d/
├── users/
│   ├── {userId}/
│   │   ├── tasks/
│   │   │   ├── {taskId}
│   │   │   └── ...
│   │   ├── moods/
│   │   │   ├── {moodId}  
│   │   │   └── ...
│   │   └── profile data
│   └── ...
```

### **Task Document:**
```javascript
{
  id: "task_123",
  text: "Complete assignment",
  type: "work", 
  done: false,
  date: "2025-06-22",
  source: "voice",
  user_id: "userId",
  createdAt: "2025-06-22T10:00:00Z"
}
```

### **Mood Document:**
```javascript
{
  mood: "focused",
  confidence: 0.8,
  context: "Working on project",
  source: "ai_detection",
  timestamp: "2025-06-22T10:00:00Z"
}
```

---

## 🎨 **Mood-Based Theming**

### **Available Moods:**
- **Calm** 😌 → Blue theme
- **Energetic** ⚡ → Orange theme  
- **Focused** 🎯 → Green theme
- **Stressed** 😰 → Purple theme
- **Happy** 😊 → Yellow theme
- **Neutral** 😐 → Gray theme

### **How It Works:**
1. User speaks/types text
2. AI analyzes for mood keywords
3. Theme automatically changes
4. Mood saved to Firebase for analytics

---

## 🗣️ **Voice Integration**

### **How to Use:**
1. Click voice button (bottom right)
2. Say: "Add workout session to Monday"
3. Task automatically created
4. Mood detected from tone

### **Supported Commands:**
- "Add [task] to [day]"
- "Remove [task] from [day]"
- Any emotional expression for mood detection

---

## 👑 **Admin Dashboard**

### **Admin Features:**
- View all users
- See user analytics (tasks, moods, activity)
- User management actions
- Platform statistics
- Real-time monitoring

### **Access Admin:**
1. Login as admin user
2. Click "Admin Dashboard" in sidebar
3. Select users to view details

---

## 🔥 **Integration Architecture**

```
Frontend (React) ←→ Firebase (User Data)
     ↕
Voice Service (FastAPI) ←→ AI Agents (Mood/Tasks)
     ↕
VAPI (Voice Interface)
```

### **Service Communication:**
- **Frontend** ↔ **Firebase**: User auth, data storage
- **Frontend** ↔ **Voice Service**: Task operations  
- **Voice Service** ↔ **AI Agents**: Mood detection, task processing
- **All Services** ↔ **Firebase**: Real-time sync

---

## 🔧 **Environment Setup**

### **Your Firebase Config:**
```javascript
{
  apiKey: "AIzaSyB_DiemM4b5k3HXB1rgbRVc_KAdGy4R9cw",
  authDomain: "neuroboost-bb20d.firebaseapp.com", 
  projectId: "neuroboost-bb20d",
  storageBucket: "neuroboost-bb20d.appspot.com",
  messagingSenderId: "37251131871",
  appId: "1:37251131871:web:neuroboost-web-app"
}
```

### **Required Firebase Setup:**
1. **Authentication**: Enable Email/Password
2. **Firestore**: Create database
3. **Security Rules**: Allow authenticated users

---

## 🧪 **Testing Commands**

```bash
# Test all integrations
python test_voice_integration.py

# Start services individually  
cd ai_agents && python -m uvicorn main:app --port 8000
cd voice-service && python -m uvicorn main:app --port 8002  
cd frontend && npm run dev

# Test specific endpoints
curl http://localhost:8000/health
curl http://localhost:8002/health
```

---

## 🚨 **Troubleshooting**

### **Common Issues:**

**1. "Address already in use"**
```bash
pkill -f "uvicorn"
pkill -f "vite"
```

**2. "Firebase not initialized"**
- Check if Firebase credentials are correct
- Ensure Authentication is enabled

**3. "Tasks not syncing"**
- Check user is logged in
- Verify Firebase rules allow read/write

**4. "Voice not working"**
- Check VAPI key is valid
- Ensure microphone permissions

---

## 🎉 **What's Working Now**

### ✅ **Fully Functional:**
1. **User Authentication** (Login/Signup/Logout)
2. **Voice-to-Task** (Say task → Gets added)
3. **Mood Detection** (AI analyzes → Theme changes)
4. **Admin Dashboard** (Manage all users)
5. **Real-time Sync** (Firebase updates instantly)
6. **Responsive UI** (Works on mobile/desktop)

### 🎯 **Ready for Hackathon:**
- Complete ADHD productivity platform
- AI-powered mood detection
- Voice interface for accessibility
- Admin management system
- User analytics and insights
- Beautiful, mood-responsive UI

---

## 🏆 **Hackathon Pitch Points**

1. **🧠 ADHD-Specific**: Built specifically for ADHD users
2. **🗣️ Voice-First**: Accessibility through voice commands
3. **🎨 Mood-Responsive**: UI adapts to emotional state
4. **📊 Analytics**: Track productivity and emotional patterns
5. **👥 Multi-User**: Admin can manage organization/family
6. **🔄 Real-time**: Instant sync across all devices
7. **🎯 Evidence-Based**: Uses CBT and productivity techniques

**The platform combines AI, voice interaction, and psychology to create a truly personalized ADHD productivity solution!** 