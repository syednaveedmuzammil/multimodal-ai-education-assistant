import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}) {
  return (
    <AnimatePresence>

      {isOpen && (

        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

          exit={{ opacity: 0 }}
        >

          <motion.div
            className="bg-card border border-border rounded-2xl w-full max-w-lg p-6"

            initial={{
              scale: .95,
              opacity: 0,
            }}

            animate={{
              scale: 1,
              opacity: 1,
            }}

            exit={{
              scale: .95,
              opacity: 0,
            }}
          >

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-semibold">
                {title}
              </h2>

              <button
                onClick={onClose}
                className="hover:text-primary transition"
              >
                <X size={22}/>
              </button>

            </div>

            {children}

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
}