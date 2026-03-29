import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, Moon, Sun } from 'lucide-react'
import { Button, Input, Card, CardBody, CardHeader, Divider, Kbd, Chip } from "@heroui/react"
import logo from '../logo.png'

export default function LoginScreen({ username, setUsername, onPlayClick }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('drowly-theme') === 'dark'
    }
    return false
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('drowly-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('drowly-theme', 'light')
    }
  }, [isDark])

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f8f5f0] dark:bg-black">
      {/* Grid Background with Fade */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e0d5c7 1px, transparent 1px),
            linear-gradient(to bottom, #e0d5c7 1px, transparent 1px)
          `,
          backgroundSize: '20px 30px',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
        }}
      />
      {/* Dark mode grid overlay */}
      <div
        className="absolute inset-0 z-0 hidden dark:block"
        style={{
          backgroundImage: `
            linear-gradient(to right, #3d3529 1px, transparent 1px),
            linear-gradient(to bottom, #3d3529 1px, transparent 1px)
          `,
          backgroundSize: '20px 30px',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
        }}
      />

      {/* Dark Mode Toggle */}
      <motion.button
        onClick={() => setIsDark(!isDark)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-[#121212]/80 shadow-md backdrop-blur-sm ring-1 ring-amber-200 dark:ring-amber-800 transition-colors"
      >
        {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-amber-700" />}
      </motion.button>

      <motion.div 
        className="z-10 w-full max-w-md px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full shadow-2xl border-none bg-white/80 dark:bg-[#121212]/90 backdrop-blur-sm" isBlurred>
            <CardHeader className="flex flex-col gap-2 items-center justify-center pt-6 pb-2">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-center flex flex-col items-center"
                >
                    <div className="mb-0">
                        <img src={logo} alt="Drowly Logo" className="w-48 h-auto object-contain drop-shadow-lg" />
                    </div>
                    <p className="text-default-500 dark:text-amber-400/70 font-medium -mt-2 text-sm">
                        Draw. Guess. Win.
                    </p>
                </motion.div>
            </CardHeader>
            
            <Divider className="my-2" />

            <CardBody className="gap-4 p-6">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex flex-col gap-4"
                >
                    <Input
                        size="md"
                        variant="bordered"
                        label="Nickname"
                        placeholder="Enter your artist name"
                        value={username}
                        onValueChange={setUsername}
                        onKeyDown={(e) => e.key === 'Enter' && onPlayClick()}
                        isClearable
                        classNames={{
                            inputWrapper: "bg-default-100/50 hover:bg-default-200/50 transition-colors border-default-200 dark:border-amber-900/30",
                            label: "text-default-600 dark:text-amber-300/70",
                            input: "text-base font-medium text-default-900 dark:text-amber-100"
                        }}
                        startContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 dark:text-amber-500/50 text-small">@</span>
                            </div>
                        }
                    />

                    <Button 
                        size="lg"
                        color="secondary"
                        variant="shadow"
                        onPress={onPlayClick}
                        className="w-full font-bold text-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20"
                        startContent={<Gamepad2 className="h-5 w-5" />}
                    >
                        Start Playing
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-1 flex flex-col items-center gap-2 rounded-xl bg-default-50 dark:bg-black/50 p-3 border border-default-100 dark:border-amber-900/20"
                >
                    <Chip color="warning" variant="flat" size="sm" className="uppercase font-bold tracking-wider text-[10px]">Pro Tips</Chip>
                    <div className="flex flex-wrap justify-center gap-3 text-[10px] text-default-500 dark:text-amber-400/60">
                        <div className="flex items-center gap-1">
                            <span>Draw</span>
                            <Kbd keys={["q"]}>Q</Kbd>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>Erase</span>
                            <Kbd keys={["e"]}>E</Kbd>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>Size</span>
                            <Kbd>1-4</Kbd>
                        </div>
                    </div>
                </motion.div>
            </CardBody>
        </Card>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-600 dark:text-amber-400/50">
            Made with <span className="text-red-500">❤️</span> by{' '}
            <a 
              href="https://github.com/Pskuntal1248" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
            >
              Parth Singh
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
