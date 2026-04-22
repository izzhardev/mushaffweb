import React from 'react';
import { WifiOff } from 'lucide-react';
import { useAppDatabase } from '../hooks/useAppDatabase';
import { motion, AnimatePresence } from 'motion/react';

export default function ConnectivityBanner() {
  const { isOffline } = useAppDatabase();

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-red-600 text-white overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
            <WifiOff className="w-4 h-4" />
            <span>Koneksi terputus. Menunggu koneksi kembali...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
