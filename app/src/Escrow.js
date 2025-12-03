export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  approved,
  handleApprove,
}) {
  return (
    <div
      className="
      p-4 rounded-xl border border-white/10
      bg-white/5 backdrop-blur-lg
      text-white font-mono
      hover:bg-white/10
    "
    >
      <div className="flex justify-between text-sm mb-2">
        <span className="text-white/60">Arbiter</span>
        <span>{arbiter}</span>
      </div>

      <div className="flex justify-between text-sm mb-2">
        <span className="text-white/60">Beneficiary</span>
        <span>{beneficiary}</span>
      </div>

      <div className="flex justify-between text-sm mb-4">
        <span className="text-white/60">Value (ETH)</span>
        <span>{value}</span>
      </div>

      {approved ? (
        <p className="text-green-300 text-sm font-medium">✓ Approved</p>
      ) : (
        <button
          id={address}
          onClick={handleApprove}
          className="
          w-full py-2 rounded-lg text-sm font-semibold text-center
          bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600
          hover:from-indigo-500 hover:via-sky-500 hover:to-emerald-500
        "
        >
          Approve
        </button>
      )}
    </div>
  );
}
