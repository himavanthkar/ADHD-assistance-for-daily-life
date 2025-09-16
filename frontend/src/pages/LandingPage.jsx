import React from 'react';
import { Brain, Target, Palette, BarChart3, Gem, CalendarDays } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import Features from '../components/landing/Features';
import Testimonials from '../components/landing/Testimonials';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';
import { useTheme } from '../context/ThemeContext';

const features = [
  {
    icon: Brain,
    title: "Modular AI Agents",
    description: "TaskAgent organizes your workflow, MoodAgent tracks emotional patterns, and FocusAgent adapts to your attention cycles.",
  },
  {
    icon: Target,
    title: "CBT Pomodoro Mode",
    description: "Cognitive behavioral therapy techniques integrated with focus sessions to build healthy work habits and reduce overwhelm.",
  },
  {
    icon: Palette,
    title: "Adaptive Mood-Based UI",
    description: "Interface colors and layouts automatically adjust based on your energy levels and emotional state for optimal focus.",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics Dashboard",
    description: "Beautiful, easy-to-understand insights about your productivity patterns, mood trends, and goal progress.",
  },
  {
    icon: Gem,
    title: "Gamified Leveling System",
    description: "Stay motivated by earning XP for completing tasks and evolving your unique digital companion.",
  },
  {
    icon: CalendarDays,
    title: "Seamless Calendar Sync",
    description: "Integrate with your existing Google and Apple calendars to see all your commitments in one place.",
  }
];

const testimonials = [
  {
    quote: "NeuroBoost finally gave me the structure I needed without feeling overwhelming. The AI agents actually understand how my ADHD brain works.",
    author: "Sarah M.",
    role: "Software Developer"
  },
  {
    quote: "The mood-based UI is genius. On low-energy days, everything becomes simpler and more calming. It's like having a personal assistant who gets it.",
    author: "Alex R.",
    role: "Creative Director"
  },
  {
    quote: "I've tried every productivity app out there. NeuroBoost is the first one that doesn't make me feel broken when I can't stick to rigid systems.",
    author: "Jordan L.",
    role: "Graduate Student"
  }
];

const LandingPage = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <>
      <Navbar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      <main>
        <HeroSection />
        <Features features={features} />
        <Testimonials testimonials={testimonials} />
        <CTASection />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
