#!/usr/bin/env python3
"""
NeuroBoost Setup Script
Sets up admin user and demo data for Firebase
"""
import firebase_admin
from firebase_admin import credentials, firestore, auth
import json
from datetime import datetime, timedelta

def setup_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # If you have a service account key, use this:
        # cred = credentials.Certificate("path/to/serviceAccountKey.json")
        # firebase_admin.initialize_app(cred)
        
        # For development, we'll use environment variable
        # You'll need to set GOOGLE_APPLICATION_CREDENTIALS
        firebase_admin.initialize_app()
        
        db = firestore.client()
        print("✅ Firebase initialized successfully")
        return db
        
    except Exception as e:
        print(f"❌ Firebase initialization failed: {e}")
        print("\n💡 To fix this:")
        print("1. Go to Firebase Console > Project Settings > Service Accounts")
        print("2. Generate a new private key")
        print("3. Save as serviceAccountKey.json")
        print("4. Set GOOGLE_APPLICATION_CREDENTIALS environment variable")
        return None

def create_admin_user(db):
    """Create an admin user"""
    try:
        # Create admin user in Firebase Auth
        admin_user = auth.create_user(
            email='admin@neuroboost.com',
            password='admin123',
            display_name='Admin User'
        )
        
        # Add admin user to Firestore
        db.collection('users').document(admin_user.uid).set({
            'uid': admin_user.uid,
            'email': 'admin@neuroboost.com',
            'displayName': 'Admin User',
            'isAdmin': True,
            'subscription': 'premium',
            'createdAt': datetime.now().isoformat(),
            'permissions': ['admin', 'read', 'write', 'delete']
        })
        
        print(f"✅ Admin user created: admin@neuroboost.com (password: admin123)")
        return admin_user.uid
        
    except Exception as e:
        print(f"⚠️  Admin user creation: {e}")
        return None

def create_demo_user(db):
    """Create a demo user with sample data"""
    try:
        # Create demo user
        demo_user = auth.create_user(
            email='demo@neuroboost.com',
            password='demo123',
            display_name='Demo User'
        )
        
        # Add demo user to Firestore
        db.collection('users').document(demo_user.uid).set({
            'uid': demo_user.uid,
            'email': 'demo@neuroboost.com',
            'displayName': 'Demo User',
            'isAdmin': False,
            'subscription': 'free',
            'createdAt': datetime.now().isoformat(),
            'permissions': ['read', 'write']
        })
        
        # Add sample tasks
        tasks_ref = db.collection('users').document(demo_user.uid).collection('tasks')
        
        sample_tasks = [
            {
                'text': 'Complete morning routine',
                'type': 'personal',
                'done': True,
                'date': datetime.now().strftime('%Y-%m-%d'),
                'completedAt': datetime.now().isoformat(),
                'source': 'manual'
            },
            {
                'text': 'Review ADHD productivity tips',
                'type': 'learning',
                'done': False,
                'date': datetime.now().strftime('%Y-%m-%d'),
                'completedAt': None,
                'source': 'ai'
            },
            {
                'text': 'Practice mindfulness meditation',
                'type': 'wellness',
                'done': False,
                'date': (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d'),
                'completedAt': None,
                'source': 'voice'
            }
        ]
        
        for task in sample_tasks:
            task['createdAt'] = datetime.now().isoformat()
            task['updatedAt'] = datetime.now().isoformat()
            tasks_ref.add(task)
        
        # Add sample mood data
        moods_ref = db.collection('users').document(demo_user.uid).collection('moods')
        
        sample_moods = [
            {'mood': 'focused', 'confidence': 0.9, 'context': 'Working on important project', 'source': 'ai_detection'},
            {'mood': 'energetic', 'confidence': 0.8, 'context': 'Just had coffee!', 'source': 'user_manual'},
            {'mood': 'calm', 'confidence': 0.7, 'context': 'Finished meditation session', 'source': 'ai_detection'}
        ]
        
        for mood in sample_moods:
            mood['timestamp'] = datetime.now().isoformat()
            moods_ref.add(mood)
        
        print(f"✅ Demo user created: demo@neuroboost.com (password: demo123)")
        print(f"   - Added {len(sample_tasks)} sample tasks")
        print(f"   - Added {len(sample_moods)} sample mood entries")
        
        return demo_user.uid
        
    except Exception as e:
        print(f"⚠️  Demo user creation: {e}")
        return None

def main():
    print("🎯 NeuroBoost Firebase Setup")
    print("=" * 50)
    
    # Initialize Firebase
    db = setup_firebase()
    if not db:
        return
    
    # Create users
    admin_uid = create_admin_user(db)
    demo_uid = create_demo_user(db)
    
    print("\n" + "=" * 50)
    print("🎉 Setup Complete!")
    print("\n📋 Login Credentials:")
    print("   Admin: admin@neuroboost.com / admin123")
    print("   Demo:  demo@neuroboost.com / demo123")
    
    print("\n💡 Next Steps:")
    print("1. Run the app: python run_app.py")
    print("2. Open http://localhost:3001")
    print("3. Login with admin or demo account")
    print("4. Test voice features and admin dashboard")
    
    print("\n🔧 Firebase Rules to Set:")
    print("   - Enable Authentication > Email/Password")
    print("   - Set Firestore security rules")
    print("   - Enable offline persistence")

if __name__ == "__main__":
    main() 