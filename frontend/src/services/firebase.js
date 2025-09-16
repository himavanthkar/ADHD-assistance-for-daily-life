import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs, onSnapshot, orderBy, addDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_DiemM4b5k3HXB1rgbRVc_KAdGy4R9cw",
  authDomain: "neuroboost-bb20d.firebaseapp.com",
  projectId: "neuroboost-bb20d",
  storageBucket: "neuroboost-bb20d.firebasestorage.app",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Admin credentials
export const ADMIN_CREDENTIALS = {
  email: 'admin@neuroboost.com',
  password: 'admin123'
};

export const DEMO_CREDENTIALS = {
  email: 'demo@neuroboost.com', 
  password: 'demo123'
};

// Authentication functions
export const registerUser = async (email, password, additionalData = {}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save additional user data to Firestore with proper user isolation
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      createdAt: new Date().toISOString(),
      isAdmin: email === ADMIN_CREDENTIALS.email,
      subscription: email === ADMIN_CREDENTIALS.email ? 'premium' : 'free',
      displayName: additionalData.displayName || `User ${user.uid.substring(0, 8)}`,
      permissions: email === ADMIN_CREDENTIALS.email ? ['admin', 'read', 'write', 'delete'] : ['read', 'write'],
      ...additionalData
    });
    
    // If this is demo user, add sample data
    if (email === DEMO_CREDENTIALS.email) {
      await createSampleDataForUser(user.uid);
    }
    
    console.log(`✅ User created: ${email} (Admin: ${email === ADMIN_CREDENTIALS.email})`);
    return user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Create admin and demo users
export const createDefaultUsers = async () => {
  try {
    console.log('🔧 Creating default users...');
    
    // Create admin user
    try {
      await registerUser(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password, {
        displayName: 'Admin User'
      });
    } catch (error) {
      if (error.code !== 'auth/email-already-in-use') {
        console.error('Error creating admin user:', error);
      } else {
        console.log('ℹ️  Admin user already exists');
      }
    }
    
    // Create demo user
    try {
      await registerUser(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password, {
        displayName: 'Demo User'
      });
    } catch (error) {
      if (error.code !== 'auth/email-already-in-use') {
        console.error('Error creating demo user:', error);
      } else {
        console.log('ℹ️  Demo user already exists');
      }
    }
    
    console.log('✅ Default users setup complete');
    console.log('📋 Login Credentials:');
    console.log('   Admin:', ADMIN_CREDENTIALS.email, '/', ADMIN_CREDENTIALS.password);
    console.log('   Demo: ', DEMO_CREDENTIALS.email, '/', DEMO_CREDENTIALS.password);
    
  } catch (error) {
    console.error('Error creating default users:', error);
  }
};

// Create sample data for demo user
const createSampleDataForUser = async (userId) => {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Sample tasks - each user gets their own isolated data
    const sampleTasks = [
      {
        text: 'Complete morning routine',
        type: 'personal',
        done: true,
        date: today.toISOString().split('T')[0],
        completedAt: new Date().toISOString(),
        source: 'manual'
      },
      {
        text: 'Review ADHD productivity tips',
        type: 'learning',
        done: false,
        date: today.toISOString().split('T')[0],
        completedAt: null,
        source: 'ai'
      },
      {
        text: 'Practice mindfulness meditation',
        type: 'wellness',
        done: false,
        date: tomorrow.toISOString().split('T')[0],
        completedAt: null,
        source: 'voice'
      }
    ];
    
    // Add tasks to user's isolated collection
    for (const task of sampleTasks) {
      await saveUserTask(userId, task);
    }
    
    // Sample mood data - isolated per user
    const sampleMoods = [
      { mood: 'focused', confidence: 0.9, context: 'Working on important project', source: 'ai_detection' },
      { mood: 'energetic', confidence: 0.8, context: 'Just had coffee!', source: 'user_manual' },
      { mood: 'calm', confidence: 0.7, context: 'Finished meditation session', source: 'ai_detection' }
    ];
    
    for (const mood of sampleMoods) {
      await saveMoodData(userId, mood);
    }
    
    console.log(`✅ Sample data created for user ${userId}`);
  } catch (error) {
    console.error('Error creating sample data:', error);
  }
};

// User data functions - all data is isolated by user ID
export const saveUserData = async (userId, data) => {
  try {
    await setDoc(doc(db, 'users', userId), data, { merge: true });
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

// Task management functions - isolated per user
export const saveUserTask = async (userId, taskData) => {
  try {
    // Each user gets their own tasks subcollection: users/{userId}/tasks/{taskId}
    const docRef = await addDoc(collection(db, 'users', userId, 'tasks'), {
      ...taskData,
      userId: userId, // Extra safety measure
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getUserTasks = async (userId) => {
  try {
    // Only get tasks for this specific user
    const q = query(
      collection(db, 'users', userId, 'tasks'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const tasks = [];
    querySnapshot.forEach((doc) => {
      const taskData = doc.data();
      // Double-check user isolation
      if (taskData.userId === userId || !taskData.userId) {
        tasks.push({ id: doc.id, ...taskData });
      }
    });
    return tasks;
  } catch (error) {
    throw error;
  }
};

export const updateUserTask = async (userId, taskId, updates) => {
  try {
    // Only update tasks in this user's collection
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    throw error;
  }
};

export const deleteUserTask = async (userId, taskId) => {
  try {
    // Only delete from this user's collection
    await deleteDoc(doc(db, 'users', userId, 'tasks', taskId));
  } catch (error) {
    throw error;
  }
};

// Real-time task subscription - isolated per user
export const subscribeToUserTasks = (userId, callback) => {
  // Only subscribe to this user's tasks
  const q = query(
    collection(db, 'users', userId, 'tasks'),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    callback(tasks);
  });
};

// Mood tracking functions - isolated per user
export const saveMoodData = async (userId, moodData) => {
  try {
    // Each user gets their own moods subcollection: users/{userId}/moods/{moodId}
    await addDoc(collection(db, 'users', userId, 'moods'), {
      ...moodData,
      userId: userId, // Extra safety measure
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw error;
  }
};

export const getUserMoods = async (userId, limit = 10) => {
  try {
    // Only get moods for this specific user
    const q = query(
      collection(db, 'users', userId, 'moods'),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const moods = [];
    querySnapshot.forEach((doc) => {
      const moodData = doc.data();
      // Double-check user isolation
      if (moodData.userId === userId || !moodData.userId) {
        moods.push({ id: doc.id, ...moodData });
      }
    });
    return moods.slice(0, limit);
  } catch (error) {
    throw error;
  }
};

// Analytics functions - isolated per user
export const saveAnalyticsData = async (userId, analyticsData) => {
  try {
    // Each user gets their own analytics subcollection
    await addDoc(collection(db, 'users', userId, 'analytics'), {
      ...analyticsData,
      userId: userId, // Extra safety measure
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw error;
  }
};

// Admin functions - only accessible to admin users
export const getAllUsers = async () => {
  try {
    const q = query(collection(db, 'users'));
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    throw error;
  }
};

export const getUserAnalytics = async (userId) => {
  try {
    const [tasks, moods] = await Promise.all([
      getUserTasks(userId),
      getUserMoods(userId, 30)
    ]);
    
    const analytics = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.done).length,
      moodEntries: moods.length,
      lastActivity: tasks.length > 0 ? Math.max(...tasks.map(t => new Date(t.updatedAt || t.createdAt).getTime())) : null,
      averageMood: moods.length > 0 ? calculateAverageMood(moods) : null
    };
    
    return analytics;
  } catch (error) {
    throw error;
  }
};

export const checkUserPermissions = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        isAdmin: userData.isAdmin || false,
        subscription: userData.subscription || 'free',
        permissions: userData.permissions || ['read', 'write']
      };
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Helper functions
const calculateAverageMood = (moods) => {
  const moodValues = {
    'stressed': 1,
    'neutral': 3,
    'calm': 4,
    'focused': 4,
    'happy': 5,
    'energetic': 4
  };
  
  const total = moods.reduce((sum, mood) => {
    return sum + (moodValues[mood.mood] || 3);
  }, 0);
  
  return total / moods.length;
};

export default app; 