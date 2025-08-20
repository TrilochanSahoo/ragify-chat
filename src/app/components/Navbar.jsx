"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Sun, Moon, BookOpen } from "lucide-react";

export function Navbar() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check if user has a theme preference stored
    const theme = localStorage.getItem('theme') || 'dark';
    setIsDark(theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-card border-b border-border px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Research Assistant</h1>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="text-foreground hover:bg-muted"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDark ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.div>
          <span className="ml-2">{isDark ? 'Light' : 'Dark'}</span>
        </Button>
      </div>
    </motion.nav>
  );
}