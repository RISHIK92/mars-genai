"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { generationService, getModelByCategory } from '../services/generation'
import {
  Terminal,
  Code,
  History,
  Copy,
  Cpu,
  Zap,
  ChevronRight,
  Maximize2,
  Minimize2,
  Split,
  Play,
  Clock,
  Command,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  Trash2,
  Upload,
  FileText,
  Download,
  Image as ImageIcon,
} from "lucide-react"
import { fileService } from "../services/file"

interface HistoryItem {
  id: number;
  prompt: string;
  output: string;
  category: string;
  template?: string;
  imageUrl?: string;
}

interface SystemStats {
  cpu: number;
  memory: number;
  uptime: string;
}

interface CustomSettings {
  temperature: number;
  max_tokens: number;
  isCustom: boolean;
}

interface UploadedFile {
  id: string;
  filename: string;
  size: number;
  type: string;
  status: string;
  progress?: number;
  parsedData?: any;
}

const COMMANDS = [
  { name: "help", description: "Show available commands" },
  { name: "clear", description: "Clear the terminal output" },
  { name: "echo", description: "Display a message", args: "<message>" },
  { name: "system", description: "Show system information" },
  { name: "time", description: "Display current time" },
  { name: "theme", description: "Change terminal theme", args: "<theme-name>" },
  { name: "split", description: "Toggle split terminal view" },
  { name: "save", description: "Save current session" },
  { name: "load", description: "Load saved session", args: "<session-id>" },
  { name: "fullscreen", description: "Toggle fullscreen mode" },
]

const TEMPERATURE_MODES = [
  { value: 0.2, label: "Precise", description: "More focused and deterministic" },
  { value: 0.7, label: "Balanced", description: "Good mix of creativity and accuracy" },
  { value: 0.9, label: "Creative", description: "More diverse and experimental" },
  { value: -1, label: "Custom", description: "Set your own temperature", icon: "➕" }
]

const LENGTH_MODES = [
  { value: 500, label: "Short", description: "Brief and concise responses" },
  { value: 1000, label: "Medium", description: "Detailed and balanced responses" },
  { value: 2000, label: "Long", description: "Comprehensive and thorough responses" },
  { value: -1, label: "Custom", description: "Set your own token length", icon: "➕" }
]

const GENERATION_MODES = [
  {
    id: "chat",
    label: "Chat",
    icon: "💬",
    description: "General conversation and Q&A",
    model: "gemini-2.0-flash-lite-001",
    parameters: {
      temperature: 0.7,
      max_tokens: 1000
    }
  },
  {
    id: "research",
    label: "Research",
    icon: "🔍",
    description: "In-depth research and analysis",
    model: "gemini-2.0-pro",
    parameters: {
      temperature: 0.3,
      max_tokens: 2000
    }
  },
  {
    id: "code",
    label: "Code",
    icon: "💻",
    description: "Code generation and programming help",
    model: "gemini-2.0-pro",
    parameters: {
      temperature: 0.2,
      max_tokens: 2000
    }
  },
  {
    id: "image",
    label: "Image",
    icon: "🖼️",
    description: "Image generation from text prompts",
    model: "stable-diffusion-xl-1024-v1-0",
    parameters: {
      temperature: 0.7,
      max_tokens: 1200
    }
  }
]

const MAX_TOKENS = 1000

const PROMPT_CATEGORIES = [
  { id: 'general', label: 'General', icon: '💬' },
  { id: 'research', label: 'Research', icon: '🔍' },
  { id: 'coding', label: 'Coding', icon: '💻' },
  { id: 'creative', label: 'Creative', icon: '🎨' }
]

const ANALYSIS_TYPES = [
  { id: 'summary', label: 'Summary', icon: '📊', description: 'Get a quick overview of the data' },
  { id: 'insights', label: 'Insights', icon: '🔍', description: 'Find key patterns and correlations' },
  { id: 'trends', label: 'Trends', icon: '📈', description: 'Analyze trends and changes over time' },
];

const getTemperatureByMode = (mode: number): number => {
  switch (mode) {
    case 0: // Precise
      return 0.2;
    case 1: // Balanced
      return 0.7;
    case 2: // Creative
      return 0.9;
    default:
      return 0.7;
  }
};

const getMaxTokensByLength = (length: number): number => {
  switch (length) {
    case 0: // Short
      return 500;
    case 1: // Medium
      return 1000;
    case 2: // Long
      return 2000;
    default:
      return 1000;
  }
};

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [splitView, setSplitView] = useState(false)
  const [systemStats, setSystemStats] = useState<SystemStats>({ cpu: 42, memory: 68, uptime: "12:34:56" })
  const [currentOutput, setCurrentOutput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [temperatureMode, setTemperatureMode] = useState(1)
  const [lengthMode, setLengthMode] = useState(1)
  const [generationMode, setGenerationMode] = useState("chat")
  const [showModeSelector, setShowModeSelector] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("general")
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showCustomSettings, setShowCustomSettings] = useState(false)
  const [customSettings, setCustomSettings] = useState<CustomSettings>({
    temperature: 0.7,
    max_tokens: 1000,
    isCustom: false
  })
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const modelSelectorRef = useRef<HTMLDivElement>(null)

  const promptRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const modeSelectorRef = useRef<HTMLDivElement>(null)

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<string>('summary')

  const updateSystemStats = useCallback(() => {
    setSystemStats({
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      uptime: new Date().toLocaleTimeString(),
    })
  }, [])

  const toggleCursor = useCallback(() => {
    setCursorVisible(prev => !prev)
  }, [])

  const scrollToBottom = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modeSelectorRef.current && !modeSelectorRef.current.contains(event.target as Node)) {
        setShowModeSelector(false)
      }
      if (modelSelectorRef.current && !modelSelectorRef.current.contains(event.target as Node)) {
        setShowModelSelector(false)
      }
    }
    if (showModeSelector || showModelSelector) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showModeSelector, showModelSelector])

  useEffect(() => {
    const cursorInterval = setInterval(toggleCursor, 530)
    const statsInterval = setInterval(updateSystemStats, 3000)
   
    return () => {
      clearInterval(cursorInterval)
      clearInterval(statsInterval)
    }
  }, [toggleCursor, updateSystemStats])

  useEffect(() => {
    scrollToBottom()
  }, [output, generatedImage, scrollToBottom])

  const suggestions = useMemo(() => {
    if (!prompt.trim()) return []
    return COMMANDS
      .filter(cmd => cmd.name.startsWith(prompt.trim().split(" ")[0]))
      .map(cmd => cmd.name)
  }, [prompt])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setOutput('');
    setCurrentOutput('');
    setGeneratedImage(null);
    setIsTyping(true);

    try {
      const temperature = customSettings.isCustom
        ? customSettings.temperature
        : getTemperatureByMode(temperatureMode);
     
      const max_tokens = customSettings.isCustom
        ? customSettings.max_tokens
        : getMaxTokensByLength(lengthMode);

      const model = selectedModel || getModelByCategory(selectedCategory);

      if (model === "stable-diffusion-xl-1024-v1-0") {
        const response = await fetch("http://localhost:3000/api/v1/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt.trim(),
            model: "stable-diffusion-xl-1024-v1-0",
            parameters: {
              temperature,
              max_tokens
            }
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
       
        if (result.imageUrl) {
          setGeneratedImage(result.imageUrl);
          setOutput(`Image generated from prompt: "${prompt.trim()}"`);
         
          const newHistoryItem: HistoryItem = {
            prompt,
            output: `Image generated from prompt: "${prompt.trim()}"`,
            id: Date.now(),
            category: selectedCategory,
            imageUrl: result.imageUrl
          };
          setHistory(prev => [...prev, newHistoryItem]);
        } else {
          throw new Error("No image URL in response");
        }
      } else {
        const response = await generationService.createGeneration(
          prompt.trim(),
          selectedCategory,
          temperature,
          max_tokens,
          model
        );

        // @ts-ignore
        const result = response.generation.content;
        const newHistoryItem: HistoryItem = {
          prompt,
          output: result,
          id: Date.now(),
          category: selectedCategory,
          template: selectedTemplate || undefined
        };

        setHistory(prev => [...prev, newHistoryItem]);
        setCommandHistory(prev => [...prev, prompt]);

        let currentText = '';
        for (let i = 0; i < result.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 10));
          currentText += result[i];
          setCurrentOutput(currentText);
        }

        setOutput(result);
      }

      setPrompt('');
      setHistoryIndex(-1);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      setOutput(`Error: ${errorMessage}`);
      setCurrentOutput(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [prompt, temperatureMode, lengthMode, selectedCategory, selectedTemplate, customSettings, selectedModel]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
      return
    }

    if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault()
      setPrompt(suggestions[0] + " ")
      return
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setPrompt(commandHistory[commandHistory.length - 1 - newIndex])
      }
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setPrompt(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setPrompt("")
      }
      return
    }
  }, [handleSubmit, suggestions, commandHistory, historyIndex])

  const loadFromHistory = useCallback((item: HistoryItem) => {
    setPrompt(item.prompt)
    setOutput(item.output)
    setActiveId(item.id)
    if (item.imageUrl) {
      setGeneratedImage(item.imageUrl)
    } else {
      setGeneratedImage(null)
    }
    if (promptRef.current) {
      promptRef.current.focus()
    }
  }, [])

  const clearOutput = useCallback(() => {
    setOutput("")
    setGeneratedImage(null)
    setActiveId(null)
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    setCommandHistory([])
  }, [])

  const applySuggestion = useCallback((suggestion: string) => {
    setPrompt(suggestion + " ")
    if (promptRef.current) {
      promptRef.current.focus()
    }
  }, [])

  const handleModeSelection = useCallback((modeId: string) => {
    setGenerationMode(modeId)
    setShowModeSelector(false)
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.name.match(/\.(csv|json|txt)$/i)) {
          alert('Please upload a CSV, JSON, or TXT file');
          continue;
        }

        const newFile: UploadedFile = {
          id: Date.now().toString(),
          filename: file.name,
          size: file.size,
          type: file.type,
          status: 'uploading',
          progress: 0
        };
        setUploadedFiles(prev => [...prev, newFile]);

        const uploadResponse = await fileService.uploadFile(file);
       
        setUploadedFiles(prev => prev.map(f =>
          f.id === newFile.id
            ? { ...f, id: uploadResponse.id, status: 'processing' }
            : f
        ));

        const processResponse = await fileService.processFile(uploadResponse.id, {
          model: selectedModel || getModelByCategory(selectedCategory),
          temperature: customSettings.isCustom ? customSettings.temperature : getTemperatureByMode(temperatureMode),
          max_tokens: customSettings.isCustom ? customSettings.max_tokens : getMaxTokensByLength(lengthMode)
        });

        setUploadedFiles(prev => prev.map(f =>
          f.id === uploadResponse.id
            ? { ...f, status: processResponse.status }
            : f
        ));

        if (processResponse.status === 'completed' && processResponse.result) {
          setOutput(processResponse.result);
        }
      }
    } catch (error) {
      console.error('File upload error:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-mono">
      <header className="border-b border-white/20 p-4 bg-gradient-to-r from-black to-zinc-900">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-white" />
            <span className="text-xl font-bold tracking-tighter letter-spacing-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Mars.AI
            </span>
            <span className="text-xs text-white/70 border border-white/20 px-2 py-0.5 rounded-full bg-white/5">
              v2.0.0
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSplitView(!splitView)}
                className="text-white/60 hover:text-white transition-colors"
                title="Toggle Split View"
              >
                <Split className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="text-white/60 hover:text-white transition-colors"
                title="Toggle Fullscreen"
              >
                {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <div className="flex items-center gap-2 ml-2">
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)] animate-pulse"></div>
                <span className="text-xs text-white/80">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-zinc-900/50 border-b border-white/10 px-4 py-1 text-xs text-white/60 flex justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            CPU: {systemStats.cpu}%
            <div className="w-16 h-1 bg-white/20 ml-1">
              <div className="h-full bg-white/60" style={{ width: `${systemStats.cpu}%` }}></div>
            </div>
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            MEM: {systemStats.memory}%
            <div className="w-16 h-1 bg-white/20 ml-1">
              <div className="h-full bg-white/60" style={{ width: `${systemStats.memory}%` }}></div>
            </div>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="bg-zinc-900/50 border-b border-white/10 px-4 py-2 text-xs text-white/60 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Category:</span>
            <div className="flex gap-1">
              {PROMPT_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-2 py-1 rounded-sm transition-colors ${
                    selectedCategory === category.id
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10 text-white/60"
                  }`}
                  title={category.label}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>Model:</span>
            <div className="relative">
              <button
                onClick={() => setShowModelSelector(!showModelSelector)}
                className="px-2 py-1 rounded-sm bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1"
              >
                {generationService.getModelOptions().find(m => m.id === selectedModel)?.icon || '🤖'}
                {generationService.getModelOptions().find(m => m.id === selectedModel)?.label || 'Auto Select'}
              </button>
             
              {showModelSelector && (
                <div
                  ref={modelSelectorRef}
                  className="absolute top-full left-0 mt-1 bg-zinc-900 border border-white/10 rounded-sm p-2 w-64 z-50"
                >
                  <div className="space-y-2">
                    {generationService.getModelOptions().map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.id);
                          setShowModelSelector(false);
                        }}
                        className={`w-full p-2 rounded-sm text-left flex items-start gap-2 transition-colors ${
                          selectedModel === model.id
                            ? 'bg-white/20 text-white'
                            : 'hover:bg-white/10 text-white/60'
                        }`}
                      >
                        <span className="text-lg">{model.icon}</span>
                        <div>
                          <div className="font-medium">{model.label}</div>
                          <div className="text-xs text-white/40">{model.description}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {model.capabilities.map(cap => (
                              <span key={cap} className="text-[10px] px-1 py-0.5 bg-white/5 rounded">
                                {cap}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setSelectedModel(null);
                        setShowModelSelector(false);
                      }}
                      className={`w-full p-2 rounded-sm text-left flex items-start gap-2 transition-colors ${
                        selectedModel === null
                          ? 'bg-white/20 text-white'
                          : 'hover:bg-white/10 text-white/60'
                      }`}
                    >
                      <span className="text-lg">🤖</span>
                      <div>
                        <div className="font-medium">Auto Select</div>
                        <div className="text-xs text-white/40">Choose the best model based on category</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>Mode:</span>
            <div className="flex gap-1">
              {TEMPERATURE_MODES.map((mode, index) => (
                <button
                  key={mode.label}
                  onClick={() => {
                    if (mode.value === -1) {
                      setShowCustomSettings(true);
                    } else {
                      setCustomSettings(prev => ({ ...prev, isCustom: false }));
                      setTemperatureMode(index);
                    }
                  }}
                  className={`px-2 py-1 rounded-sm transition-colors ${
                    temperatureMode === index
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10 text-white/60"
                  }`}
                  title={mode.description}
                >
                  {mode.icon || mode.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>Length:</span>
            <div className="flex gap-1">
              {LENGTH_MODES.map((mode, index) => (
                <button
                  key={mode.label}
                  onClick={() => {
                    if (mode.value === -1) {
                      setShowCustomSettings(true);
                    } else {
                      setCustomSettings(prev => ({ ...prev, isCustom: false }));
                      setLengthMode(index);
                    }
                  }}
                  className={`px-2 py-1 rounded-sm transition-colors ${
                    lengthMode === index
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10 text-white/60"
                  }`}
                  title={mode.description}
                >
                  {mode.icon || mode.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.json,.txt"
              className="hidden"
              multiple
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-sm bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2"
              disabled={isUploading}
              title="Upload CSV, JSON, or TXT files"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">
                {isUploading ? 'Uploading...' : 'Upload File'}
              </span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModeSelector(!showModeSelector)}
            className="px-2 py-1 rounded-sm bg-white/10 hover:bg-white/20 transition-colors"
          >
            {GENERATION_MODES.find(m => m.id === generationMode)?.icon} {GENERATION_MODES.find(m => m.id === generationMode)?.label}
          </button>
         
          {showModeSelector && (
            <div
              ref={modeSelectorRef}
              className="absolute top-8 right-0 bg-zinc-900 border border-white/20 rounded-sm p-2 w-64 z-50 shadow-lg"
            >
              <div className="grid grid-cols-2 gap-2">
                {GENERATION_MODES.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => handleModeSelection(mode.id)}
                    className={`p-2 rounded-sm transition-colors flex flex-col items-center gap-1 ${
                      generationMode === mode.id
                        ? "bg-white/20 text-white"
                        : "hover:bg-white/10 text-white/60"
                    }`}
                  >
                    <span className="text-lg">{mode.icon}</span>
                    <span className="text-xs">{mode.label}</span>
                    <span className="text-[10px] text-white/40">{mode.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showCustomSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-lg w-96 border border-white/10 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Custom Settings</h3>
              <button
                onClick={() => setShowCustomSettings(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm">Temperature</label>
                  <span className="text-xs text-white/60">
                    {customSettings.temperature.toFixed(1)}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={customSettings.temperature}
                    onChange={(e) => setCustomSettings(prev => ({
                      ...prev,
                      temperature: parseFloat(e.target.value),
                      isCustom: true
                    }))}
                    className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={customSettings.temperature}
                    onChange={(e) => setCustomSettings(prev => ({
                      ...prev,
                      temperature: parseFloat(e.target.value),
                      isCustom: true
                    }))}
                    className="w-16 bg-black border border-white/20 rounded px-2 py-1 text-sm"
                  />
                </div>
                <div className="flex justify-between text-xs text-white/60 mt-1">
                  <span>Precise (0.2)</span>
                  <span>Balanced (0.7)</span>
                  <span>Creative (0.9)</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm">Max Tokens</label>
                  <span className="text-xs text-white/60">
                    {customSettings.max_tokens}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min="100"
                    max="4000"
                    step="100"
                    value={customSettings.max_tokens}
                    onChange={(e) => setCustomSettings(prev => ({
                      ...prev,
                      max_tokens: parseInt(e.target.value),
                      isCustom: true
                    }))}
                    className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    min="100"
                    max="4000"
                    step="100"
                    value={customSettings.max_tokens}
                    onChange={(e) => setCustomSettings(prev => ({
                      ...prev,
                      max_tokens: parseInt(e.target.value),
                      isCustom: true
                    }))}
                    className="w-20 bg-black border border-white/20 rounded px-2 py-1 text-sm"
                  />
                </div>
                <div className="flex justify-between text-xs text-white/60 mt-1">
                  <span>Short (500)</span>
                  <span>Medium (1000)</span>
                  <span>Long (2000)</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    setShowCustomSettings(false);
                    setCustomSettings(prev => ({ ...prev, isCustom: false }));
                  }}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    setShowCustomSettings(false);
                    setCustomSettings(prev => ({ ...prev, isCustom: true }));
                  }}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="border-b border-white/10 p-2">
          <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
            <FileText className="w-4 h-4" />
            <span>Uploaded Files</span>
          </div>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2 bg-white/5 rounded-sm"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-white/60" />
                  <span className="text-xs">
                    {file.filename} ({Math.round(file.size / 1024)}KB)
                  </span>
                  <span className={`text-[10px] px-1 py-0.5 rounded ${
                    file.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    file.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                    file.status === 'error' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {file.status}
                  </span>
                </div>
                {file.progress !== undefined && (
                  <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/60 transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <main className={`flex-1 flex flex-col md:flex-row overflow-hidden ${fullscreen ? "absolute inset-0 z-10 bg-black" : ""}`}>
        <div className={`border-r border-white/20 flex flex-col bg-gradient-to-b from-black to-zinc-900/30 ${fullscreen ? "hidden" : splitView ? "md:w-1/3" : "md:w-1/2"}`}>
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-4 h-4 text-white/80" />
              <span className="text-xs font-medium text-white/80">INPUT</span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/30 to-transparent"></div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <div className="absolute top-4 left-4 flex items-center gap-2 text-white/60">
                  <ChevronRight className="w-3 h-3" />
                </div>
                <textarea
                  ref={promptRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your command..."
                  className="w-full h-36 p-4 pl-10 bg-black/80 border border-white/30 focus:border-white/60 focus:outline-none resize-none text-sm rounded-sm transition-all duration-200 shadow-inner shadow-white/5"
                  style={{ caretColor: "white" }}
                />

                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 bottom-full mb-1 bg-zinc-900 border border-white/20 rounded-sm shadow-lg z-10">
                    <div className="p-1 max-h-32 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => applySuggestion(suggestion)}
                          className="px-3 py-1 text-sm hover:bg-white/10 cursor-pointer flex items-center gap-2"
                        >
                          <Command className="w-3 h-3 text-white/60" />
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-white/60 font-light">
                  {isLoading ? (
                    <span className="animate-pulse flex items-center gap-2">
                      <span className="inline-block w-1.5 h-1.5 bg-white rounded-full"></span>
                      Processing...
                    </span>
                  ) : (
                    <div className="flex gap-4">
                      <span className="flex items-center gap-2">
                        <ArrowUp className="w-3 h-3" />
                        <ArrowDown className="w-3 h-3" />
                        History
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-white/40">Tab</span>
                        Complete
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPrompt("help")}
                    className="px-2 py-1.5 border border-white/30 hover:bg-white/10 transition-colors text-xs tracking-wide rounded-sm"
                  >
                    <HelpCircle className="w-3 h-3" />
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="px-5 py-1.5 border border-white/50 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide rounded-sm group"
                  >
                    <span className="flex items-center gap-2">
                      <Play className="w-3 h-3 group-hover:animate-pulse" />
                      Execute
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="p-6 overflow-hidden flex-1">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-white/80" />
              <span className="text-xs font-medium text-white/80">HISTORY</span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/30 to-transparent"></div>
              <button
                onClick={clearHistory}
                className="text-xs text-white/50 hover:text-white transition-colors px-2 py-1 hover:bg-white/10 rounded-sm flex items-center gap-1"
                title="Clear History"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto h-full pb-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className={`w-full snap-start cursor-pointer p-3 overflow-hidden transition-all duration-200 relative group border-l-2 ${
                    activeId === item.id
                      ? "border-white bg-white/10"
                      : "border-white/20 bg-black hover:bg-white/5 hover:border-white/70"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="text-xs font-bold mb-2 truncate text-white/90 flex items-center gap-2">
                    <Command className="w-3 h-3 text-white/60" />
                    {item.prompt}
                  </div>
                  <div className="text-xs text-white/70 line-clamp-2">
                    {item.imageUrl ? (
                      <span className="flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        Image generated
                      </span>
                    ) : (
                      item.output
                    )}
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="text-xs text-white/50 italic py-4 flex items-center gap-2">
                  <Terminal className="w-3 h-3" />
                  No history yet. Execute your first command.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`flex flex-col bg-gradient-to-b from-black to-zinc-900/20 ${fullscreen ? "w-full" : splitView ? "md:w-2/3" : "md:w-1/2"}`}>
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-white/80" />
              <span className="text-xs font-medium text-white/80">OUTPUT</span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/30 to-transparent"></div>
              <button
                onClick={clearOutput}
                className="text-xs text-white/50 hover:text-white transition-colors px-2 py-1 hover:bg-white/10 rounded-sm"
              >
                CLEAR
              </button>
              <button
                onClick={() => {
                  if (generatedImage) {
                    navigator.clipboard.writeText(prompt);
                  } else {
                    navigator.clipboard.writeText(output);
                  }
                }}
                className="text-xs text-white/50 hover:text-white transition-colors px-2 py-1 hover:bg-white/10 rounded-sm flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                COPY
              </button>
              {generatedImage && (
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = generatedImage;
                    link.download = `generated-image-${Date.now()}.png`;
                    link.click();
                  }}
                  className="text-xs text-white/50 hover:text-white transition-colors px-2 py-1 hover:bg-white/10 rounded-sm flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  SAVE
                </button>
              )}
            </div>
          </div>

          <div
            ref={outputRef}
            className="flex-1 p-6 overflow-auto text-sm whitespace-pre-wrap leading-relaxed relative"
          >
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_80%)]"></div>
            {isLoading ? (
              <div className="relative">
                {currentOutput}
                {cursorVisible && (
                  <span className="inline-block w-2 h-4 bg-white ml-0.5 animate-pulse"></span>
                )}
              </div>
            ) : generatedImage ? (
              <div className="relative">
                <p className="mb-4">{output}</p>
                <img
                  src={generatedImage}
                  alt={`Generated from prompt: ${prompt}`}
                  className="max-w-full h-auto rounded-sm border border-white/20"
                />
                <div className="mt-4 text-xs text-white/60">
                  <p>Prompt: {prompt || history.find(h => h.imageUrl === generatedImage)?.prompt}</p>
                </div>
              </div>
            ) : output ? (
              <div className="relative">{output}</div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 border-2 border-white/20 rounded-full mb-4 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-white/50" />
                </div>
                <span className="text-white/40 italic">Output will appear here...</span>
                <span className="text-xs text-white/30 mt-2">Type "help" to see available commands</span>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/20 py-3 px-6 text-xs text-white/50 flex justify-between bg-gradient-to-r from-black to-zinc-900">
        <div className="font-medium">Mars.AI © {new Date().getFullYear()}</div>
        <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            STATUS: ONLINE
          </span>
          <span className="flex items-center gap-2">
            <Zap className="w-3 h-3" />
            LATENCY: {Math.floor(Math.random() * 50) + 10}ms
          </span>
        </div>
      </footer>
    </div>
  )
}