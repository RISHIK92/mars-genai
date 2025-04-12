"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
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
} from "lucide-react"

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

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<{ prompt: string; output: string; id: number }[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [splitView, setSplitView] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [systemStats, setSystemStats] = useState({ cpu: 42, memory: 68, uptime: "12:34:56" })
  const [secondaryOutput, setSecondaryOutput] = useState("")

  const promptRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats({
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        uptime: new Date().toLocaleTimeString(),
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (prompt.trim()) {
      const matchingCommands = COMMANDS.filter((cmd) => cmd.name.startsWith(prompt.trim().split(" ")[0])).map(
        (cmd) => cmd.name,
      )

      setSuggestions(matchingCommands)
      setShowSuggestions(matchingCommands.length > 0 && matchingCommands[0] !== prompt.trim())
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [prompt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setOutput("")
    setShowSuggestions(false)

    setCommandHistory((prev) => [prompt, ...prev])
    setHistoryIndex(-1)

    let response = ""
    const command = prompt.trim().split(" ")[0].toLowerCase()
    const args = prompt.trim().split(" ").slice(1).join(" ")

    switch (command) {
      case "help":
        response =
          "Available commands:\n\n" +
          COMMANDS.map((cmd) => `${cmd.name}${cmd.args ? " " + cmd.args : ""} - ${cmd.description}`).join("\n")
        break
      case "clear":
        setOutput("")
        setIsLoading(false)
        setPrompt("")
        return
      case "echo":
        response = args || ""
        break
      case "system":
        response = `System Information:\n\nCPU Usage: ${systemStats.cpu}%\nMemory Usage: ${systemStats.memory}%\nUptime: ${systemStats.uptime}`
        break
      case "time":
        response = `Current time: ${new Date().toLocaleString()}`
        break
      case "theme":
        response = `Theme changed to: ${args || "default"}`
        break
      case "split":
        setSplitView(!splitView)
        response = `Split view ${!splitView ? "enabled" : "disabled"}`
        break
      case "fullscreen":
        setFullscreen(!fullscreen)
        response = `Fullscreen mode ${!fullscreen ? "enabled" : "disabled"}`
        break
      case "save":
        response = `Session saved with ID: SESSION_${Math.floor(Math.random() * 10000)}`
        break
      default:
        response = `This is a simulated response for: "${prompt}"\n\nIn a real implementation, this would connect to your AI model backend and return the actual generated content based on the user's prompt.`
    }

    if (splitView && command !== "split") {
      setSecondaryOutput(response)
    } else {
      let displayedOutput = ""
      const newId = Date.now()
      setActiveId(newId)

      for (let i = 0; i < response.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 15))
        displayedOutput += response[i]
        setOutput(displayedOutput)
      }

      setHistory((prev) => [...prev, { prompt, output: response, id: newId }])
    }

    setIsLoading(false)
    setPrompt("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
        setPrompt(commandHistory[newIndex])
      }
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setPrompt(commandHistory[newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setPrompt("")
      }
      return
    }

    if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const loadFromHistory = (item: { prompt: string; output: string; id: number }) => {
    setPrompt(item.prompt)
    setOutput(item.output)
    setActiveId(item.id)
    if (promptRef.current) {
      promptRef.current.focus()
    }
  }

  const clearOutput = () => {
    setOutput("")
    setActiveId(null)
  }

  const clearHistory = () => {
    setHistory([])
    setCommandHistory([])
  }

  const applySuggestion = (suggestion: string) => {
    setPrompt(suggestion + " ")
    setShowSuggestions(false)
    if (promptRef.current) {
      promptRef.current.focus()
    }
  }

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

                {showSuggestions && (
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
                  <div className="text-xs text-white/70 line-clamp-2">{item.output}</div>
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
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs text-white/50 hover:text-white transition-colors px-2 py-1 hover:bg-white/10 rounded-sm flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                COPY
              </button>
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="text-xs text-white/50 hover:text-white transition-colors px-2 py-1 hover:bg-white/10 rounded-sm"
              >
                {fullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {splitView && !fullscreen ? (
            <div className="flex-1 flex">
              <div className="w-1/2 border-r border-white/20 relative">
                <div className="absolute top-0 left-0 p-2 text-xs text-white/40 bg-black/50 rounded-br-sm">
                  Mars 1
                </div>
                <div ref={outputRef} className="h-full p-6 overflow-auto text-sm whitespace-pre-wrap leading-relaxed">
                  {output ? (
                    <div className="relative">
                      {output}
                      {isLoading && cursorVisible && (
                        <span className="inline-block w-2 h-4 bg-white ml-0.5 animate-pulse"></span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-12 h-12 border-2 border-white/20 rounded-full mb-4 flex items-center justify-center">
                        <Terminal className="w-5 h-5 text-white/50" />
                      </div>
                      <span className="text-white/40 italic">Mars 1 output...</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-1/2 relative">
                <div className="absolute top-0 left-0 p-2 text-xs text-white/40 bg-black/50 rounded-br-sm">
                  Mars 2
                </div>
                <div className="h-full p-6 overflow-auto text-sm whitespace-pre-wrap leading-relaxed">
                  {secondaryOutput ? (
                    <div className="relative">{secondaryOutput}</div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-12 h-12 border-2 border-white/20 rounded-full mb-4 flex items-center justify-center">
                        <Terminal className="w-5 h-5 text-white/50" />
                      </div>
                      <span className="text-white/40 italic">Mars 2 output...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              ref={outputRef}
              className="flex-1 p-6 overflow-auto text-sm whitespace-pre-wrap leading-relaxed relative"
            >
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_80%)]"></div>
              {output ? (
                <div className="relative">
                  {output}
                  {isLoading && cursorVisible && (
                    <span className="inline-block w-2 h-4 bg-white ml-0.5 animate-pulse"></span>
                  )}
                </div>
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
          )}
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