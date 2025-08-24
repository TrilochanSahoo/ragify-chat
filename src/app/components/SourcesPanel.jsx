"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Upload, Plus, FileText, Link, Globe, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";


export function SourcesPanel({ isCollapsed = false, onToggleCollapse }) {
  const [sources, setSources] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addSource = async (source) => {
    setIsLoading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newSource = {
      ...source,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    setSources([newSource, ...sources]);
    setIsDialogOpen(false);
    setIsLoading(false);
  };

  const removeSource = (id) => {
    setSources(sources.filter(s => s.id !== id));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (20MB limit)
      const maxSize = 20 * 1024 * 1024; // 20MB in bytes
      if (file.size > maxSize) {
        alert('File size exceeds 20MB limit. Please choose a smaller file.');
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(res.data.message);
        addSource({
        type: 'file',
        title: file.name,
        content: `File: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
        });

      } catch (err) {
        console.error(err);
        // setMessage("Upload failed");
      }
      
      
    }
  };

  const handleTextSubmit = (title, content) => {
    addSource({
      type: 'text',
      title: title || 'Text Note',
      content,
    });
  };

  const handleUrlSubmit = (url, title) => {
    addSource({
      type: 'url',
      title: title || new URL(url).hostname,
      url,
    });
  };

  return (
    <div className={`h-full bg-[hsl(var(--sources-background))] border-r border-border flex flex-col transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && <h2 className="text-lg font-semibold text-foreground">Sources</h2>}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="ml-auto p-2"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
        
        {!isCollapsed && (
          <div className="mt-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-primary text-primary-foreground border-0 hover:opacity-90 w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Source
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-gradient-card border-border light:glass-card">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Add Source</DialogTitle>
                </DialogHeader>
                <SourceUploadTabs 
                  onFileUpload={handleFileUpload}
                  onTextSubmit={handleTextSubmit}
                  onUrlSubmit={handleUrlSubmit}
                  isLoading={isLoading}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Collapsed Icons */}
      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center pt-4 space-y-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
            title="Upload files"
            onClick={() => setIsDialogOpen(true)}
          >
            <Upload className="w-4 h-4" />
          </Button>
          {sources.length > 0 && (
            <div className="w-2 h-2 bg-primary rounded-full" title={`${sources.length} sources`} />
          )}
        </div>
      )}

      {/* Sources List - Only when expanded */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sources.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">No sources added yet</p>
              <p className="text-xs text-muted-foreground mt-1">Click Add to get started</p>
            </motion.div>
          ) : (
            sources.map((source, index) => (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <SourceItem source={source} onRemove={removeSource} />
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function SourceUploadTabs({ onFileUpload, onTextSubmit, onUrlSubmit, isLoading }) {
  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [url, setUrl] = useState("");
  const [urlTitle, setUrlTitle] = useState("");

  return (
    <Tabs defaultValue="file" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-muted">
        <TabsTrigger value="file">File</TabsTrigger>
        <TabsTrigger value="text">Text</TabsTrigger>
        <TabsTrigger value="url">URL</TabsTrigger>
      </TabsList>
      
      <TabsContent value="file" className="space-y-4">
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors">
          <FileText className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">Upload a file</p>
          <input
            type="file"
            onChange={onFileUpload}
            className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90"
            accept=".pdf,.txt,.doc,.docx,.md"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="text" className="space-y-4">
        <Input
          placeholder="Note title (optional)"
          value={textTitle}
          onChange={(e) => setTextTitle(e.target.value)}
          className="bg-input border-border"
        />
        <Textarea
          placeholder="Enter your text content..."
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          className="bg-input border-border min-h-[100px]"
        />
        <Button 
          onClick={() => {
            if (textContent.trim()) {
              onTextSubmit(textTitle, textContent);
              setTextTitle("");
              setTextContent("");
            }
          }}
          className="w-full bg-gradient-secondary text-secondary-foreground"
          disabled={!textContent.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            'Add Text'
          )}
        </Button>
      </TabsContent>
      
      <TabsContent value="url" className="space-y-4">
        <Input
          placeholder="Enter URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-input border-border"
          type="url"
        />
        <Input
          placeholder="Title (optional)"
          value={urlTitle}
          onChange={(e) => setUrlTitle(e.target.value)}
          className="bg-input border-border"
        />
        <Button 
          onClick={() => {
            if (url.trim()) {
              onUrlSubmit(url, urlTitle);
              setUrl("");
              setUrlTitle("");
            }
          }}
          className="w-full bg-gradient-accent text-accent-foreground"
          disabled={!url.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            'Add URL'
          )}
        </Button>
      </TabsContent>
    </Tabs>
  );
}

function SourceItem({ source, onRemove }) {
  const getIcon = () => {
    switch (source.type) {
      case 'file': return <FileText className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      case 'url': return <Globe className="w-4 h-4" />;
    }
  };

  const getGradient = () => {
    switch (source.type) {
      case 'file': return 'bg-gradient-primary';
      case 'text': return 'bg-gradient-secondary';
      case 'url': return 'bg-gradient-accent';
    }
  };

  return (
    <Card className="p-3 bg-[hsl(var(--sources-item))] hover:bg-[hsl(var(--sources-item-hover))] transition-colors border-border group light:glass-card">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className={`p-2 rounded-lg ${getGradient()}`}>
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate">{source.title}</h3>
            {source.content && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{source.content}</p>
            )}
            {source.url && (
              <p className="text-xs text-muted-foreground mt-1 truncate">{source.url}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {source.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(source.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-muted-foreground hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}