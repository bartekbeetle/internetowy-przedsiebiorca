"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getLevelInfo } from "@/lib/gamification/constants";
import { X } from "lucide-react";

interface LevelUpCelebrationProps {
  level: number;
  show: boolean;
  onClose: () => void;
}

export function LevelUpCelebration({ level, show, onClose }: LevelUpCelebrationProps) {
  const info = getLevelInfo(level);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="relative bg-brand-primary border border-slate-700/50 rounded-2xl p-8 max-w-sm mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-slate-500 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 10 }}
              className="text-6xl mb-4"
            >
              {info.icon}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-white mb-1">
                Nowy Poziom!
              </h2>
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: info.color }}
              >
                Poziom {level}
              </div>
              <p className="text-slate-400">
                Jestes teraz <span className="font-semibold text-white">{info.name}</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6"
            >
              <button
                onClick={onClose}
                className="h-10 px-6 rounded-lg font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors"
              >
                Swietnie!
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
