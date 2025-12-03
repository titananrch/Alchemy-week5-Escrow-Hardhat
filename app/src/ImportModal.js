import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function ImportModal({ open, onClose, onImport }) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    setError("");
    onImport(address.trim(), setError, () => {
      setAddress("");
      onClose();
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Modal card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="
              bg-[2d2d2d] backdrop-blur-2xl border border-white/20 
              rounded-xl p-8 w-full max-w-md shadow-lg
            "
            onClick={(e) => e.stopPropagation()} 
          >
            <h1 className="text-xl font-bold mb-2">
              Import Existing Contract
            </h1>
            <p className="text-white/60 text-sm mb-4">
              Paste an Escrow contract address to load.
            </p>

            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0xABC..."
              className="
                w-full px-4 py-2 rounded-lg bg-black/20 border border-white/20 
                text-white placeholder-white/40 outline-none
              "
            />

            {error && (
              <div className="text-red-400 text-sm mt-2">{error}</div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-white/70 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={submit}
                className="
                  px-4 py-2 rounded-lg bg-blue-600/60 hover:bg-blue-600 
                  transition text-white font-semibold
                "
              >
                Import
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
