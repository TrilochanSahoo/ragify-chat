"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Menu, X, MessageSquare, FolderOpen } from "lucide-react";
import { SourcesPanel } from "./SourcesPanel";
import { ChatPanel } from "./ChatPanel";


export function ResponsiveLayout() {
  const [activePanel, setActivePanel] = useState('chat');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSourcesCollapsed, setIsSourcesCollapsed] = useState(false);

  const panels = [
    { id: 'sources', icon: FolderOpen, label: 'Sources' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
  ] 

  const renderPanel = (panel) => {
    switch (panel) {
      case 'sources':
        return <SourcesPanel />;
      case 'chat':
        return <ChatPanel />;
    }
  };

  return (
    <div className="h-screen bg-gradient-background flex flex-col">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-gradient-card">
        <h1 className="text-lg font-semibold text-foreground">Research Assistant</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-foreground"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-border bg-gradient-card"
          >
            <div className="p-4 space-y-2">
              {panels.map((panel) => {
                const Icon = panel.icon;
                return (
                  <Button
                    key={panel.id}
                    variant={activePanel === panel.id ? "default" : "ghost"}
                    className={`
                      w-full justify-start 
                      ${activePanel === panel.id 
                        ? 'bg-[var(--gradient-primary)] text-primary-foreground' 
                        : 'text-foreground hover:bg-muted'
                      }
                    `}
                    onClick={() => {
                      setActivePanel(panel.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {panel.label}
                  </Button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden lg:flex w-full">
          {/* Sources Panel */}
          <motion.div 
            className={`${isSourcesCollapsed ? 'w-12' : 'w-80'} flex-shrink-0 transition-all duration-300`}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            data-panel="sources"
          >
            <SourcesPanel 
              isCollapsed={isSourcesCollapsed}
              onToggleCollapse={() => setIsSourcesCollapsed(!isSourcesCollapsed)}
            />
          </motion.div>

          {/* Chat Panel */}
          <motion.div 
            className="flex-1"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ChatPanel />
          </motion.div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderPanel(activePanel)}
            </motion.div>
          </AnimatePresence>

          {/* Mobile Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-card border-t border-border p-4">
            <div className="flex justify-center space-x-8">
              {panels.map((panel) => {
                const Icon = panel.icon;
                return (
                  <Button
                    key={panel.id}
                    variant="ghost"
                    size="sm"
                    className={`
                      flex flex-col items-center space-y-1 h-auto py-2 px-3
                      ${activePanel === panel.id 
                        ? 'text-primary' 
                        : 'text-muted-foreground hover:text-foreground'
                      }
                    `}
                    onClick={() => setActivePanel(panel.id )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{panel.label}</span>
                    {activePanel === panel.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="w-1 h-1 bg-primary rounded-full"
                      />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}