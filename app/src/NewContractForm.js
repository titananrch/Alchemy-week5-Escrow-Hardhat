export default function NewContractForm({
  newContract,
  isDeploying,
  formError,
}) {
  return (
    <div
      className="
      w-full max-w-xl bg-transparent border border-white/30
      rounded-2xl
      backdrop-hue-rotate-15 backdrop-blur-2xl
    "
    >
      <div className="rounded-t-2xl bg-white/10 backdrop-blur-2xl mb-4 py-6 px-8">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r">
          Create New Escrow Contract
        </h1>
        <p className="text-md text-white/60 font-light mt-1">
          Define the arbiter, beneficiary, and deposit.
        </p>
      </div>
      <div className="px-8 pb-10 pt-4">
        {/* Arbiter */}
        <label className="flex flex-col mb-6 text-sm text-white font-mono">
          Arbiter Address
          <input
            type="text"
            id="arbiter"
            className="mt-2 bg-white/20 hover:bg-white/30 text-white 
          border border-white/20 rounded-lg px-3 py-2 
          focus:ring-1 focus:ring-white outline-none"
          />
        </label>

        {/* Beneficiary */}
        <label className="flex flex-col mb-6 text-sm text-white font-mono">
          Beneficiary Address
          <input
            type="text"
            id="beneficiary"
            className="mt-2 bg-white/20 hover:bg-white/30 text-white 
          border border-white/20 rounded-lg px-3 py-2 
          focus:ring-1 focus:ring-white outline-none"
          />
        </label>

        {/* Deposit */}
        <label className="flex flex-col text-sm text-white font-mono">
          Deposit Amount (ETH)
          <input
            type="text"
            id="eth"
            className="mt-2 bg-white/20 hover:bg-white/30 text-white 
          border border-white/20 rounded-lg px-3 py-2 
          focus:ring-1 focus:ring-white outline-none"
          />
        </label>

        {/* Deploy button */}
        <div
          onClick={!isDeploying ? newContract : null}
          className={`w-full text-center text-white mt-10 py-3 font-semibold rounded-xl
            ${
              isDeploying
                ? "bg-white/20 border border-white/30 cursor-not-allowed"
                : "cursor-pointer bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 hover:from-indigo-500 hover:via-sky-500 hover:to-emerald-500"
            }
          `}
        >
          {isDeploying ? "Deploying..." : "Deploy"}
        </div>
        {formError && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {formError}
          </p>
        )}

        <div className="mt-10 text-center text-white/70 text-sm">
          <p className="mb-1">Already deployed an Escrow manually?</p>

          <button
            className={`underline ${isDeploying ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={!isDeploying? () =>
              window.dispatchEvent(new CustomEvent("open-import-modal")) : null
            }
          >
            Import Existing Contract
          </button>
        </div>
      </div>
    </div>
  );
}
