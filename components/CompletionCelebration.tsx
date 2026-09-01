import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PartyPopper, Sparkles, Trophy, X } from 'lucide-react';

interface CompletionCelebrationProps {
  onDismiss: () => void;
}

const encouragingMessages = [
  "🎉 Amazing work! You've crushed it today!",
  "✨ All done! You're absolutely unstoppable!",
  "🌟 Perfect! Take a moment to celebrate!",
  "🎊 Fantastic! You've conquered your task list!",
  "💫 Incredible! You're on fire today!",
  "🏆 Champion! All tasks completed!",
  "⭐ Outstanding! Time for a well-deserved break!",
  "🎯 Bulls-eye! You've cleared everything!"
];

export function CompletionCelebration({ onDismiss }: CompletionCelebrationProps) {
  const [message] = useState(() => 
    encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onDismiss]);

  // Generate random confetti particles
  const confettiCount = 30;
  const confetti = Array.from({ length: confettiCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
    delay: Math.random() * 0.5,
    color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)]
  }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onDismiss}
      >
        {/* Confetti */}
        {confetti.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              y: -20, 
              x: `${particle.x}vw`,
              opacity: 1,
              rotate: 0
            }}
            animate={{ 
              y: '110vh',
              rotate: particle.rotation,
              opacity: 0
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: particle.delay,
              ease: 'easeIn'
            }}
            className="absolute top-0 pointer-events-none"
          >
            <div
              className="w-3 h-3 rounded-sm"
              style={{ 
                backgroundColor: particle.color,
                transform: `scale(${particle.scale})`
              }}
            />
          </motion.div>
        ))}

        {/* Main celebration card */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
          }}
          exit={{ scale: 0, rotate: 10 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15 
          }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-gradient-to-br from-[#1a2332] to-[#0f1419] border-2 border-blue-500/50 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto"
        >
          {/* Close button */}
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Animated trophy icon */}
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ 
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <Trophy className="w-20 h-20 text-yellow-400" />
              {/* Sparkles around trophy */}
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 1.5, repeat: Infinity }
                }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </motion.div>
              <motion.div
                animate={{ 
                  rotate: -360,
                  scale: [1, 1.3, 1]
                }}
                transition={{ 
                  rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity, delay: 0.5 }
                }}
                className="absolute -bottom-2 -left-2"
              >
                <PartyPopper className="w-6 h-6 text-pink-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-4"
          >
            <h2 className="text-gray-100 text-2xl">
              {message}
            </h2>
            <p className="text-gray-400">
              You've completed all your tasks! Time to relax and recharge for tomorrow's challenges.
            </p>

            {/* Animated progress ring */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="flex justify-center pt-4"
            >
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-700"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    className="text-green-500"
                    initial={{ strokeDasharray: '251.2 251.2', strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl text-gray-100">100%</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Dismiss button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={onDismiss}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 transition-colors"
          >
            Awesome!
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
