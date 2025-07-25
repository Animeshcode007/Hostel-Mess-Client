import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-xl border border-white/20 bg-white/10 backdrop-blur-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 p-4 sm:p-6 border-b border-white/20">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300"
              >
                <X size={28} />
              </button>
              <h2 className="text-xl sm:text-3xl font-bold text-center text-white">
                {title}
              </h2>
            </div>
            <div className="flex-grow p-4 sm:p-6 overflow-y-auto">
              <div className="text-white">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
