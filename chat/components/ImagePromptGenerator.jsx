"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Check, Copy, Download, ImageIcon, Paintbrush, Settings, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const artStyles = [
  "Photorealistic", 
  "Digital Art",
  "Cinematic",
  "3D Render",
  "Fantasy",
  "Anime",
  "Oil Painting",
  "Watercolor",
  "Sketch",
  "Pixel Art",
  "Concept Art",
  "Abstract",
  "Isometric",
];

const aspectRatios = [
  { name: "1:1 Square", value: "1:1" },
  { name: "16:9 Landscape", value: "16:9" },
  { name: "9:16 Portrait", value: "9:16" },
  { name: "4:3 Standard", value: "4:3" },
  { name: "3:2 Classic", value: "3:2" },
  { name: "2:1 Panorama", value: "2:1" },
];

export default function ImagePromptGenerator({ messages }) {
  const [isOpen, setIsOpen] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Photorealistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [detailLevel, setDetailLevel] = useState(5);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // Process messages to extract context for the image generation prompt
  useEffect(() => {
    if (isOpen && messages && messages.length > 0) {
      // Get the last few messages to use as context
      const relevantMessages = messages.slice(-5);
      
      // Extract text content from messages
      const context = relevantMessages.map(message => {
        const text = message.parts
          .filter(part => part.type === "text")
          .map(part => part.text)
          .join("");
        
        return `${message.role === "user" ? "Human" : "AI"}: ${text}`;
      }).join("\n\n");
      
      // Extract key nouns, adjectives and descriptive phrases
      const extractedContent = extractKeyDescriptors(context);
      
      setGeneratedPrompt(extractedContent);
      updateEnhancedPrompt(extractedContent, selectedStyle, detailLevel, aspectRatio);
    }
  }, [isOpen, messages]);

  // Update enhanced prompt when options change
  useEffect(() => {
    if (generatedPrompt) {
      updateEnhancedPrompt(generatedPrompt, selectedStyle, detailLevel, aspectRatio);
    }
  }, [generatedPrompt, selectedStyle, detailLevel, aspectRatio]);

  const extractKeyDescriptors = (text) => {
    // A basic extraction algorithm that tries to identify key descriptive elements
    // In a real implementation, you might want to use NLP or a model to do this more precisely
    
    // Remove common filler words and non-descriptive content
    const fillerWords = ["the", "a", "an", "and", "or", "but", "for", "as", "I", "you", "we", "they", "it", "is", "are", "was", "were"];
    
    // Split text into sentences
    const sentences = text.replace(/\n/g, " ").split(/[.!?]/);
    
    // Look for descriptive sentences
    const descriptiveSentences = sentences.filter(sentence => {
      const words = sentence.trim().toLowerCase().split(/\s+/);
      // Count descriptive words (adjectives often precede nouns)
      const descriptiveWordCount = words.filter(word => 
        word.length > 3 && !fillerWords.includes(word.toLowerCase())
      ).length;
      
      return descriptiveWordCount > 2;
    });
    
    // If we found good descriptive sentences, use them
    if (descriptiveSentences.length > 0) {
      return descriptiveSentences
        .slice(0, 3) // Take up to 3 descriptive sentences
        .map(s => s.trim())
        .join(". ")
        .replace(/\s+/g, " ")
        .trim();
    }
    
    // Fallback to just the last user message if we couldn't find good descriptive content
    const lastUserMessage = messages
      .filter(m => m.role === "user")
      .pop();
      
    if (lastUserMessage) {
      const text = lastUserMessage.parts
        .filter(part => part.type === "text")
        .map(part => part.text)
        .join("");
      
      return text.slice(0, 200); // Limit length
    }
    
    return "Generate an image based on the conversation";
  };

  const updateEnhancedPrompt = (basePrompt, style, detail, ratio) => {
    // Create an enhanced prompt with the selected style and detail level
    let enhanced = basePrompt;
    
    // Add style
    enhanced += `, ${style} style`;
    
    // Add detail level descriptors
    if (detail >= 8) {
      enhanced += ", highly detailed, intricate details, sharp focus";
    } else if (detail >= 5) {
      enhanced += ", detailed, good lighting";
    }
    
    // Add aspect ratio
    enhanced += `, aspect ratio ${ratio}`;
    
    // Additional quality boosters
    enhanced += ", professional quality";
    
    setEnhancedPrompt(enhanced);
  };

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(enhancedPrompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy prompt: ", err);
    }
  };

  const handleDetailChange = (e) => {
    setDetailLevel(parseInt(e.target.value));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-border bg-card shadow-xs hover:bg-card/90 hover:border-ring h-8 px-2.5"
        title="Generate Image Prompt"
      >
        <ImageIcon size={16} className="text-accent" />
        <span>Generate Image</span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-auto"
            >
              <div className="sticky top-0 flex items-center justify-between p-4 border-b border-border bg-card">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Paintbrush size={18} className="text-accent" />
                  Image Prompt Generator
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Extracted Content</label>
                  <div className="p-3 bg-muted/30 rounded-md text-sm text-muted-foreground">
                    {generatedPrompt || "No content extracted"}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Art Style</label>
                    <div className="grid grid-cols-3 gap-1">
                      {artStyles.slice(0, 9).map(style => (
                        <button
                          key={style}
                          onClick={() => setSelectedStyle(style)}
                          className={cn(
                            "text-xs rounded-md p-1 border border-border transition-colors",
                            selectedStyle === style 
                              ? "bg-accent text-accent-foreground border-accent" 
                              : "hover:bg-muted"
                          )}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="mt-1 w-full text-xs">
                          <Settings size={14} className="mr-1" />
                          More Styles
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {artStyles.slice(9).map(style => (
                          <DropdownMenuItem
                            key={style}
                            onClick={() => setSelectedStyle(style)}
                          >
                            {style}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Aspect Ratio</label>
                    <div className="grid grid-cols-3 gap-1">
                      {aspectRatios.slice(0, 6).map(ratio => (
                        <button
                          key={ratio.value}
                          onClick={() => setAspectRatio(ratio.value)}
                          className={cn(
                            "text-xs rounded-md p-1 border border-border transition-colors",
                            aspectRatio === ratio.value 
                              ? "bg-accent text-accent-foreground border-accent" 
                              : "hover:bg-muted"
                          )}
                        >
                          {ratio.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    Detail Level: {detailLevel}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={detailLevel}
                    onChange={handleDetailChange}
                    className="w-full accent-accent h-2 rounded-lg appearance-none bg-muted"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Simple</span>
                    <span>Detailed</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Final Prompt</label>
                  <div className="relative">
                    <textarea
                      value={enhancedPrompt}
                      onChange={(e) => setEnhancedPrompt(e.target.value)}
                      className="w-full p-3 rounded-md border border-border bg-background min-h-[100px] text-foreground"
                    />
                    <button
                      onClick={handleCopyClick}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-background border border-border hover:bg-muted transition-colors"
                      aria-label="Copy prompt"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {copySuccess ? (
                          <motion.div
                            key="check"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Check size={16} className="text-accent" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Copy size={16} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mb-4">
                  <p>This prompt has been optimized for image generation AI tools like Midjourney, DALL-E, or Stable Diffusion.</p>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={handleCopyClick}>
                    {copySuccess ? "Copied!" : "Copy Prompt"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}