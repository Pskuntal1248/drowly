import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Plus, 
  Lock, 
  Globe, 
  Users, 
  Clock, 
  Trophy, 
  RefreshCw,
  ChevronRight,
  Settings,
  Hash,
  Languages,
  Zap,
  Moon,
  Sun
} from 'lucide-react'
import { cn } from '../lib/utils'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'

export default function LobbyScreen({ stompClient, username, mySessionId, onBack, onJoinRoom }) {
  const [lobbies, setLobbies] = useState([])
  const [lobbyCode, setLobbyCode] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
 
  const [language, setLanguage] = useState('English')
  const [scoring, setScoring] = useState('Chill')
  const [drawTime, setDrawTime] = useState(120)
  const [rounds, setRounds] = useState(4)
  const [maxPlayers, setMaxPlayers] = useState(24)
  const [customWords, setCustomWords] = useState(3)

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggleDark = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('drowly-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('drowly-theme', 'light')
    }
  }

  useEffect(() => {
    refreshLobbies()
  }, [])

  const refreshLobbies = () => {
    setIsRefreshing(true)
    fetch(`${BACKEND_URL}/api/lobby/list`)
      .then(res => res.json())
      .then(data => {
        setLobbies(data)
        setTimeout(() => setIsRefreshing(false), 500)
      })
      .catch(() => {
        setIsRefreshing(false)
      })
  }

  const createRoom = (isPrivate) => {
    const roomCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    
    stompClient.send('/app/join', {}, JSON.stringify({
      username,
      roomId: roomCode,
      action: 'create',
      config: {
        language: language,
        scoringMode: scoring,
        drawingTime: drawTime,
        rounds: rounds,
        maxPlayers: maxPlayers,
        playersPerIpLimit: 999,
        customWordsPerTurn: customWords,
        customWords: [],
        isPrivate: isPrivate,
        lobbyName: isPrivate ? 'Private Game' : 'Public Game'
      }
    }))

    onJoinRoom(roomCode)
  }

  const joinLobbyByCode = () => {
    if (!lobbyCode.trim()) {
      alert('Please enter a room code!')
      return
    }
    joinRoom(lobbyCode)
  }

  const joinRoom = (roomCode) => {
    stompClient.send('/app/join', {}, JSON.stringify({
      username,
      roomId: roomCode,
      action: 'join'
    }))

    onJoinRoom(roomCode)
  }

  const adjustValue = (setter, value, delta, min, max) => {
    const newValue = value + delta
    if (newValue >= min && newValue <= max) {
      setter(newValue)
    }
  }

  return (
    <motion.div 
      className="flex h-screen w-full flex-col bg-[#f8f5f0] dark:bg-black p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <motion.button 
          onClick={onBack}
          whileHover={{ scale: 1.05, x: -3 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-lg bg-white dark:bg-[#121212] px-4 py-2 font-medium text-gray-700 dark:text-amber-200 shadow-sm ring-1 ring-gray-200 dark:ring-amber-900/30 transition-all hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:ring-gray-300 dark:hover:ring-amber-800/40"
        >
          <ArrowLeft size={18} />
          Back
        </motion.button>

        <motion.button
          onClick={toggleDark}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-[#121212] shadow-sm ring-1 ring-amber-200 dark:ring-amber-800 transition-colors"
        >
          {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-amber-700" />}
        </motion.button>
      </div>

      <div className="grid flex-1 gap-6 lg:grid-cols-12">
        {/* Create Lobby Panel */}
        <motion.div 
          className="flex flex-col rounded-2xl bg-white dark:bg-[#121212] p-6 shadow-sm ring-1 ring-gray-200 dark:ring-amber-900/30 lg:col-span-4 xl:col-span-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-amber-100">
            <Settings className="text-amber-500" size={24} />
            Create Lobby
          </h3>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-amber-300/70">
                <Languages size={16} /> Language
              </label>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border-gray-200 dark:border-amber-900/30 bg-gray-50 dark:bg-black dark:text-amber-100 p-2.5 text-sm font-medium outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
              >
                <option>English</option>
                <option>German</option>
                <option>French</option>
                <option>Italian</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-amber-300/70">
                <Trophy size={16} /> Scoring
              </label>
              <select 
                value={scoring} 
                onChange={(e) => setScoring(e.target.value)}
                className="w-full rounded-lg border-gray-200 dark:border-amber-900/30 bg-gray-50 dark:bg-black dark:text-amber-100 p-2.5 text-sm font-medium outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
              >
                <option>Chill</option>
                <option>Normal</option>
                <option>Competitive</option>
              </select>
            </div>

            {[
              { label: 'Drawing Time', icon: Clock, value: drawTime, setter: setDrawTime, min: 30, max: 300, step: 10 },
              { label: 'Rounds', icon: Zap, value: rounds, setter: setRounds, min: 1, max: 10, step: 1 },
              { label: 'Max Players', icon: Users, value: maxPlayers, setter: setMaxPlayers, min: 2, max: 50, step: 2 },
              { label: 'Custom Words', icon: null, emoji: '✏️', value: customWords, setter: setCustomWords, min: 0, max: 5, step: 1 },
            ].map((setting, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border border-gray-100 dark:border-amber-900/20 p-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-amber-300/70">
                  {setting.icon ? <setting.icon size={16} /> : <span>{setting.emoji}</span>}
                  {setting.label}
                </label>
                <div className="flex items-center gap-2">
                  <motion.button 
                    onClick={() => adjustValue(setting.setter, setting.value, -setting.step, setting.min, setting.max)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-black text-gray-600 dark:text-amber-300 hover:bg-gray-200 dark:hover:bg-[#1a1a1a]"
                  >
                    -
                  </motion.button>
                  <span className="w-8 text-center font-medium text-gray-900 dark:text-amber-100">{setting.value}</span>
                  <motion.button 
                    onClick={() => adjustValue(setting.setter, setting.value, setting.step, setting.min, setting.max)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50"
                  >
                    +
                  </motion.button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <motion.button 
              onClick={() => createRoom(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600"
            >
              <Globe size={20} />
              Create Public Lobby
            </motion.button>
            <motion.button 
              onClick={() => createRoom(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-700"
            >
              <Lock size={20} />
              Create Private Lobby
            </motion.button>
          </div>
        </motion.div>

        {/* Join Lobby Panel */}
        <motion.div 
          className="flex flex-col rounded-2xl bg-white dark:bg-[#121212] p-6 shadow-sm ring-1 ring-gray-200 dark:ring-amber-900/30 lg:col-span-8 xl:col-span-9"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-amber-100">
              <Plus className="text-amber-500" size={24} />
              Join Private Lobby
            </h3>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter Room Code..."
                  value={lobbyCode}
                  onChange={(e) => setLobbyCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && joinLobbyByCode()}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-amber-900/30 bg-gray-50 dark:bg-black dark:text-amber-100 px-4 py-3 font-medium outline-none transition-all focus:border-amber-500 focus:bg-white dark:focus:bg-[#121212] focus:ring-4 focus:ring-amber-500/10"
                />
              </div>
              <motion.button 
                onClick={joinLobbyByCode}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-xl bg-amber-600 px-8 font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-700"
              >
                <Lock size={18} />
                Join
              </motion.button>
            </div>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 dark:border-amber-900/20 pb-4">
              <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-amber-100">
                <Globe className="text-amber-500" size={20} />
                Public Lobbies
              </h4>
              <motion.button 
                onClick={refreshLobbies}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-black px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-amber-300 hover:bg-gray-200 dark:hover:bg-[#1a1a1a]"
              >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                Refresh
              </motion.button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
              <AnimatePresence mode="wait">
                {lobbies.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full flex-col items-center justify-center text-center text-gray-400 dark:text-amber-400/40"
                  >
                    <Globe size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">No public lobbies available</p>
                    <p className="text-sm">Create one to get started!</p>
                  </motion.div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {lobbies.map((lobby, index) => (
                      <motion.div 
                        key={lobby.roomId} 
                        onClick={() => joinRoom(lobby.roomId)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="group cursor-pointer rounded-xl border border-gray-200 dark:border-amber-900/30 bg-white dark:bg-black p-4 shadow-sm transition-all hover:border-amber-500 hover:shadow-md"
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <h4 className="font-bold text-gray-900 dark:text-amber-100 group-hover:text-amber-600">
                            {lobby.lobbyName || 'Game Room'}
                          </h4>
                          <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-bold text-green-700 dark:text-green-400">
                            Public
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-500 dark:text-amber-300/60">
                          <div className="flex items-center gap-2">
                            <Users size={14} />
                            <span>{lobby.players.length}/{lobby.maxPlayers} Players</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span>{lobby.drawingTime}s Draw Time</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap size={14} />
                            <span>{lobby.maxRounds} Rounds</span>
                          </div>
                        </div>

                        <motion.button 
                          className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg bg-gray-50 dark:bg-[#121212] py-2 text-sm font-bold text-gray-700 dark:text-amber-200 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 group-hover:text-amber-600 dark:group-hover:text-amber-400"
                        >
                          Join Room <ChevronRight size={16} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute bottom-4 left-0 right-0 text-center"
        >
          <p className="text-xs text-gray-500 dark:text-amber-400/40">
            Made with <span className="text-red-500">❤️</span> by{' '}
            <a 
              href="https://github.com/Pskuntal1248" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              Parth Singh
            </a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
