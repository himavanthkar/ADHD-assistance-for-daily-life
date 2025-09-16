#!/bin/bash

echo "🗄️ NeuroBoost Supabase Setup"
echo "=================================="

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the neuroboost root directory"
    exit 1
fi

echo ""
echo "📋 Setup Steps:"
echo "1. Create Supabase project at https://supabase.com/dashboard"
echo "2. Copy your project URL and anon key"
echo "3. Run the database schema"
echo "4. Install dependencies"
echo ""

# Check if Supabase is already configured
if [ -f "frontend/.env.local" ]; then
    echo "⚠️  Found existing .env.local file"
    echo "   Make sure it includes your Supabase credentials:"
    echo "   VITE_SUPABASE_URL=https://your-project.supabase.co"
    echo "   VITE_SUPABASE_ANON_KEY=your-anon-key"
else
    echo "📝 Creating .env.local template..."
    cat > frontend/.env.local << EOF
# Supabase Configuration
# Replace with your actual Supabase project values from https://supabase.com/dashboard
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# WebSocket for real-time updates
VITE_WS_URL=ws://localhost:3000
EOF
    echo "✅ Created frontend/.env.local - please edit with your Supabase credentials"
fi

echo ""
echo "🔧 Installing Supabase dependencies..."
cd frontend
npm install @supabase/supabase-js
echo "✅ Supabase client installed"

echo ""
echo "📋 Next Steps:"
echo "1. Edit frontend/.env.local with your Supabase URL and key"
echo "2. Copy database/supabase_schema.sql to Supabase SQL Editor and run it"
echo "3. Test: npm run dev"
echo ""
echo "🔗 Helpful Links:"
echo "   Supabase Dashboard: https://supabase.com/dashboard"
echo "   Setup Guide: database/DATABASE_SETUP_GUIDE.md"
echo ""

cd ..
echo "🎯 Ready to migrate from Firebase to Supabase!" 