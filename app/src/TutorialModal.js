import { motion, AnimatePresence } from "framer-motion";

export default function TutorialModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            className="
              bg-[#2d2d2d]/80 backdrop-blur-2xl border border-white/20 
              rounded-2xl p-8 w-full max-w-lg h-full shadow-2xl text-white
              overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent scroll-smooth
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <h1 className="text-2xl font-extrabold mb-3 text-white">
              How This Escrow dApp Works
            </h1>

            <p className="text-white/70 text-sm leading-relaxed mb-6">
              This decentralized escrow application lets you safely lock funds,
              set a trusted arbiter, and release or refund the deposit based on
              their decision — all verified on-chain.
            </p>

            {/* Section 1 */}
            <h2 className="text-lg font-bold mb-2">🧩 Why Two Panels?</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              The app is split into <b>two main panels</b> to keep the experience simple:
              <br /><br />
              <b>Left Panel — Create New Contract:</b>  
              <br />You enter:
              <br />• Arbiter address  
              <br />• Beneficiary address  
              <br />• Deposit amount in ETH  
              <br />
              The <b>sender</b> is automatically your connected wallet.  
              All addresses must be valid <b>Sepolia testnet addresses</b>.
              <br /><br />
              After confirming in your wallet, the funds become locked in a new on-chain contract.
            </p>

            {/* Section 2 */}
            <h2 className="text-lg font-bold mb-2">🔐 The Arbiter Panel</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              The <b>right panel</b> shows all deployed escrow contracts.
              The address you entered as <b>Arbiter</b> will have the ability to approve the escrow.
              <br /><br />
              The arbiter must approve <b>within 1 hour</b>.  
              If not, the contract expires and the sender can be refunded.
            </p>

            {/* Section 3 */}
            <h2 className="text-lg font-bold mb-2">⏱ 1-Hour Deadline</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Each contract starts a <b>60-minute countdown</b>.
              <br />
              During this time:
              <br />• The arbiter can approve → funds go to beneficiary  
              <br />• If the deadline passes → deposit becomes refundable  
              <br /><br />
              Once settled (approved or refunded), the contract becomes immutable.
            </p>

            {/* Section 4 */}
            <h2 className="text-lg font-bold mb-2">🚀 Using the App on Sepolia</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Make sure your connected wallet is on <b>Sepolia Testnet</b> with test ETH.
              Every address you enter will be validated to prevent mistakes.
            </p>

            {/* Buttons */}
            <div className="flex justify-end mt-8">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-white/20 text-white/90 
                hover:bg-white/30 transition font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
