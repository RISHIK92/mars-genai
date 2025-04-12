"use client"


import React, { useState } from 'react';
import { Code, MessageSquare, Database, Cloud, Users, Paperclip, Send, Sparkles } from 'lucide-react';

// Simple feature data for the service features section
const features = [
  {
    icon: <MessageSquare className="h-6 w-6 text-white" />,
    title: 'Text Generation',
    description: 'Create marketing copy, emails, and content at scale with customizable AI'
  },
  {
    icon: <Code className="h-6 w-6 text-white" />,
    title: 'Code Generation',
    description: 'Generate production-ready code snippets with our specialized coding models'
  },
  {
    title: 'Image Creation',
    description: 'Generate custom images and graphics for your marketing and product needs'
  },
  {
    icon: <Database className="h-6 w-6 text-white" />,
    title: 'Fine Tuning',
    description: 'Train models on your own data for greater accuracy and brand alignment'
  },
  {
    icon: <Cloud className="h-6 w-6 text-white" />,
    title: 'Cloud-Native',
    description: 'Built for scalability with zero infrastructure management required'
  },
  {
    icon: <Users className="h-6 w-6 text-white" />,
    title: 'Team Workspaces',
    description: 'Collaborate with your team with shared projects and access controls'
  }
];

const Index = () => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle message submission logic here
    console.log('Message:', message);
    console.log('Files:', files);
    setMessage('');
    setFiles([]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">CloudForge AI</h1>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 rounded-md bg-white text-black hover:bg-white/90 transition">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6">
            AI-Powered Solutions for Your Business
          </h1>
          <p className="text-xl text-center text-white/70 mb-10">
            Unlock the power of generative AI with our simple, cloud-native platform built for SMEs and creators.
          </p>

          {/* Chat Input Area */}
          <div className="mb-16">
            <div className="bg-black rounded-xl border border-white/10 p-4">
              {files.length > 0 && (
                <div className="mb-4 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-md text-sm">
                      <div className="flex items-center overflow-hidden">
                        <Paperclip size={16} className="text-white mr-2" />
                        <span className="truncate">{file.name}</span>
                        <span className="ml-2 text-xs text-white/60">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button 
                        className="text-white/70 hover:text-white"
                        onClick={() => removeFile(index)}
                      >
                        <span className="sr-only">Remove</span>
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask anything or type '/' for commands..."
                    className="w-full border-0 bg-transparent py-3 px-4 h-20 focus:outline-none resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <label className="cursor-pointer flex items-center space-x-2 hover:text-white/90">
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Paperclip size={18} className="text-white/70" />
                    </label>
                    <button
                      type="button"
                      className="text-white/70 hover:text-white/90"
                    >
                      <Sparkles size={18} />
                    </button>
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-white text-black px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-white/90 disabled:opacity-50"
                    disabled={!message && files.length === 0}
                  >
                    <Send size={16} />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
            
            <div className="text-xs text-center text-white/50 mt-2">
              CloudForge AI can analyze documents, generate code, and create content for SMEs.
            </div>
          </div>

          {/* Service Features */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-white">
                AI Services Built for Businesses Like Yours
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="bg-black rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-white/10"
                  >
                    <div className="rounded-full bg-white/10 w-12 h-12 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6">
        <div className="container mx-auto px-4 text-center text-white/60 text-sm">
          &copy; {new Date().getFullYear()} CloudForge AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
