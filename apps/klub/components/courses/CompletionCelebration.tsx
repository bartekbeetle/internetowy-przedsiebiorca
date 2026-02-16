"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Trophy, X } from "lucide-react";

interface CompletionCelebrationProps {
  type: "lesson" | "course";
  show: boolean;
  onClose: () => void;
  pointsEarned?: number;
}

export function CompletionCelebration({
  type,
  show,
  onClose,
  pointsEarned,
}: CompletionCelebrationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      if (type === "lesson") {
        const timer = setTimeout(() => {
          setVisible(false);
          onClose();
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [show, type, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div
            className={`rounded-xl shadow-2xl p-4 flex items-center gap-3 border ${
              type === "course"
                ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-orange-500/30"
                : "bg-slate-800 border-green-500/30"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                type === "course"
                  ? "bg-orange-500/20"
                  : "bg-green-500/20"
              }`}
            >
              {type === "course" ? (
                <Trophy className="h-5 w-5 text-orange-400" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {type === "course"
                  ? "Kurs ukonczony!"
                  : "Lekcja ukonczona!"}
              </p>
              {pointsEarned && (
                <p className="text-xs text-orange-400">
                  +{pointsEarned} pkt
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setVisible(false);
                onClose();
              }}
              className="ml-2 p-1 text-slate-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
