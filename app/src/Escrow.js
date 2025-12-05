import { useEffect, useState } from "react";

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
  handleRefund,
  userAddress,
  contractInstance,
}) {
  const [isApproved, setIsApproved] = useState(false);
  const [isRefunded, setIsRefunded] = useState(false);
  const [deadline, setDeadline] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const showDeadline = !isApproved && !isRefunded;

  const isArbiter = userAddress?.toLowerCase() === arbiter?.toLowerCase();

   //Load contract state on mount (approved, refunded, deadline)
  useEffect(() => {
    async function loadContractState() {
      if (!contractInstance) return;

      try {
        const approved = await contractInstance.isApproved();
        const refunded = await contractInstance.isRefunded();
        const dl = await contractInstance.deadline();

        setIsApproved(approved);
        setIsRefunded(refunded);
        setDeadline(Number(dl.toString()));
      } catch (err) {
        console.error("Failed to read contract state:", err);
      }
    }

    loadContractState();
  }, [contractInstance]);

  useEffect(() => {
    if (!contractInstance) return;

    const onApproved = () => {
      setIsApproved(true);
      setIsRefunded(false);
    };

    const onRefunded = () => {
      setIsRefunded(true);
      setIsApproved(false);
    };

    contractInstance.on("Approved", onApproved);
    contractInstance.on("Refunded", onRefunded);

    return () => {
      contractInstance.off("Approved", onApproved);
      contractInstance.off("Refunded", onRefunded);
    };
  }, [contractInstance]);
  
  //Countdown Timer
  useEffect(() => {
    if (!deadline) return;

    function updateRemaining() {
      const now = Math.floor(Date.now() / 1000);
      const remaining = deadline - now;
      setTimeLeft(remaining > 0 ? remaining : 0);
    }

    updateRemaining();

    const timer = setInterval(updateRemaining, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  const expired = timeLeft <= 0;

  //button UI
  let buttonUI;

  if (isApproved) {
    buttonUI = (
      <span className="px-5 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm font-semibold">
        ✔ Approved
      </span>
    );
  } else if (isRefunded) {
    buttonUI = (
      <span className="px-5 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-semibold">
        ❌ Refunded
      </span>
    );
  } else if (expired && isArbiter) {
    buttonUI = (
      <button
        onClick={handleRefund}
        className="w-full py-2 rounded-lg text-sm font-semibold text-center
        bg-red-600/70 hover:bg-red-600 transition cursor-pointer"
      >
        Refund
      </button>
    );
  } else if (expired && !isArbiter) {
    buttonUI = (
      <span className="px-5 py-2 rounded-lg bg-white/10 text-yellow-400 text-sm font-semibold">
        ⏱ Deadline Passed
      </span>
    );
  } else if (!expired && isArbiter) {
    buttonUI = (
      <button
        onClick={handleApprove}
        className="w-full py-2 rounded-lg text-sm font-semibold text-center
          bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 cursor-pointer
          hover:from-indigo-500 hover:via-sky-500 hover:to-emerald-500 transition"
      >
        Approve
      </button>
    );
  } else {
    buttonUI = (
      <span className="w-full text-center cursor-not-allowed px-3 py-2 rounded-lg text-sm bg-white/10 text-white/40">
        Waiting for arbiter…
      </span>
    );
  }
  
  return (
    <div
      className="
        p-4 rounded-xl border border-white/10
        bg-white/5 backdrop-blur-lg
        text-white font-mono
        hover:bg-white/10 transition
      "
    >
      {/* CONTRACT INFO */}
      <div className="flex justify-between text-sm mb-2">
        <span className="text-white/60">Contract</span>
        <span className="truncate max-w-[60%]">{address}</span>
      </div>

      <div className="flex justify-between text-sm mb-2">
        <span className="text-white/60">Arbiter</span>
        <span className="truncate max-w-[60%]">{arbiter}</span>
      </div>

      <div className="flex justify-between text-sm mb-2">
        <span className="text-white/60">Beneficiary</span>
        <span className="truncate max-w-[60%]">{beneficiary}</span>
      </div>

      <div className="flex justify-between text-sm mb-2">
        <span className="text-white/60">Value (ETH)</span>
        <span>{value}</span>
      </div>

      {/* DEADLINE */}
      {showDeadline && (
        <div className="flex justify-between text-sm mb-4">
          <span className="text-white/60">Deadline</span>
          <span>
            {expired
              ? "Expired"
              : `${Math.floor(timeLeft / 60)}m ${Math.floor(timeLeft % 60)}s`}
          </span>
        </div>
      )}

      {/* BUTTON */}
      <div className="flex justify-end items-center pt-3">{buttonUI}</div>
    </div>
  );
}
