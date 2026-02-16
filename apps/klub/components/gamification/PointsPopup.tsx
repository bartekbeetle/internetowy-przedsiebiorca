"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface PointsPopupProps {
  points: number;
  show: boolean;
  onComplete?: () => void;
}

export function PointsPopup({ points, show, onComplete }: PointsPopupProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.5 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-20 right-6 z-50 pointer-events-none"
        >
          <div className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/25">
            +{points} pkt
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
