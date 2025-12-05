import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Prism from "./Prism";
import Dock from "./Dock";
import NewContractForm from "./NewContractForm";
import ExistingContracts from "./ExistingContracts";
import PanelWrapper from "./PanelWrapper";
import deploy from "./deploy";
import EscrowArtifact from "./artifacts/contracts/Escrow.sol/Escrow.json";
import ImportModal from "./ImportModal";
import Toast from "./Toast";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [escrows, setEscrows] = useState([]);
  const [activePanel, setActivePanel] = useState("new");
  const [hasRestored, setHasRestored] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [formError, setFormError] = useState("");
  const [userAddress, setUserAddress] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  function showToast(message) {
    setToast({ show: true, message });

    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2300);
  }

  useEffect(() => {
    async function initWallet() {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setSigner(provider.getSigner());
      setUserAddress(accounts[0].toLowerCase());
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
        setSigner(provider.getSigner());
        setUserAddress(accounts[0].toLowerCase());
      });
    }
    initWallet();
  }, []);

  useEffect(() => {
    if (!signer) return;

    async function restoreEscrows() {
      const saved = JSON.parse(localStorage.getItem("escrows") || "[]");

      if (!Array.isArray(saved)) return;

      const restored = await Promise.all(
        saved.map(async (e) => {
          try {
            const contract = new ethers.Contract(
              e.address,
              EscrowArtifact.abi,
              signer
            );

            const arbiter = await contract.arbiter();
            const beneficiary = await contract.beneficiary();
            const isApproved = await contract.isApproved();
            const isRefunded = await contract.isRefunded();
            const deadline = await contract.deadline();

            return {
              address: e.address,
              arbiter,
              beneficiary,
              value: e.value,
              contractInstance: contract,
              approved: isApproved,
              refunded: isRefunded,
              deadline: deadline.toString(),
              handleApprove: async () => {
                try {
                  contract.on("Approved", () => {
                    showToast("🎉 Contract Approved & Funds Released!");

                    setEscrows((prev) =>
                      prev.map((item) =>
                        item.address === e.address
                          ? { ...item, approved: true }
                          : item
                      )
                    );
                  });

                  await approve(contract, signer);
                } catch (err) {
                  if (err.code === 4001) {
                    showToast("❌ Approval rejected.");
                  } else {
                    showToast("🚫 Only the arbiter can approve.");
                  }
                }
              },
              handleRefund: async () => {
                try {
                  contract.on("Refunded", () => {
                    showToast("💸 Refunded to depositor!");

                    setEscrows((prev) =>
                      prev.map((item) =>
                        item.address === e.address
                          ? { ...item, refunded: true }
                          : item
                      )
                    );
                  });

                  await contract.connect(signer).refund();
                } catch (err) {
                  if (err.code === 4001) {
                    showToast("❌ Refund rejected.");
                  } else if (/Deadline not passed/gi.test(err.reason)) {
                    showToast("⏳ Refund not available until deadline.");
                  } else {
                    showToast("🚫 Only arbiter can refund.");
                  }
                }
              },
            };
          } catch (err) {
            console.error("Restore failed for:", e.address, err);
            return null;
          }
        })
      );

      setEscrows(restored.filter(Boolean));
      setHasRestored(true);
    }

    restoreEscrows();
  }, [signer]);

  useEffect(() => {
    if (!hasRestored) return;

    const minimalData = escrows.map((e) => ({
      address: e.address,
      arbiter: e.arbiter,
      beneficiary: e.beneficiary,
      value: e.value,
      approved: e.approved,
      refunded: e.refunded,
      deadline: e.deadline,
    }));

    localStorage.setItem("escrows", JSON.stringify(minimalData));
  }, [escrows, hasRestored]);

  useEffect(() => {
    const openModal = () => setImportOpen(true);
    window.addEventListener("open-import-modal", openModal);
    return () => window.removeEventListener("open-import-modal", openModal);
  }, []);

  async function importEscrow(address, setError, onSuccess) {
    if (!ethers.utils.isAddress(address)) {
      setError("Invalid Ethereum address.");
      return;
    }

    try {
      const contract = new ethers.Contract(address, EscrowArtifact.abi, signer);

      const arbiter = await contract.arbiter();
      const beneficiary = await contract.beneficiary();
      const approved = await contract.isApproved();

      const escrow = {
        address,
        arbiter,
        beneficiary,
        value: "Unknown",
        approved,
        handleApprove: async () => {
          contract.on("Approved", () => {
            document.getElementById(address).innerText = "It's approved!";
          });
          await approve(contract, signer);
        },
      };

      setEscrows((prev) => [...prev, escrow]);

      onSuccess(); // closes modal
    } catch (err) {
      setError("This is not a valid Escrow contract.");
    }
  }

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value.trim();
    const arbiter = document.getElementById("arbiter").value.trim();
    const eth = document.getElementById("eth").value.trim();

    setFormError(""); // reset old errors

    // --- Address validation ---
    if (!ethers.utils.isAddress(beneficiary)) {
      return setFormError("❌ Beneficiary address is invalid.");
    }

    if (!ethers.utils.isAddress(arbiter)) {
      return setFormError("❌ Arbiter address is invalid.");
    }

    const sender = await signer.getAddress();

    if (arbiter.toLowerCase() === beneficiary.toLowerCase()) {
      return setFormError(
        "❌ Arbiter and Beneficiary cannot be the same address."
      );
    }

    if (sender.toLowerCase() === arbiter.toLowerCase()) {
      return setFormError("❌ You cannot assign yourself as the arbiter.");
    }

    if (sender.toLowerCase() === beneficiary.toLowerCase()) {
      return setFormError("❌ You cannot be your own beneficiary.");
    }

    // --- ETH validation ---
    if (isNaN(parseFloat(eth)) || parseFloat(eth) <= 0) {
      return setFormError("❌ Deposit amount must be a positive number.");
    }

    const value = ethers.utils.parseEther(eth);

    try {
      setIsDeploying(true);

      const escrowContract = await deploy(signer, arbiter, beneficiary, value);

      const escrow = {
        address: escrowContract.address,
        arbiter,
        beneficiary,
        value: eth,
        approved: false,
        refunded: false,
        contractInstance: escrowContract,
        deadline: (await escrowContract.deadline()).toString(),

        handleApprove: async () => {
          escrowContract.on("Approved", () => {
            showToast("🎉 Contract Approved & Funds Released!");

            setEscrows((prev) =>
              prev.map((item) =>
                item.address === escrowContract.address
                  ? { ...item, approved: true }
                  : item
              )
            );
          });

          await approve(escrowContract, signer);
        },

        handleRefund: async () => {
          try {
            escrowContract.on("Refunded", () => {
              showToast("💸 Refunded to depositor!");

              setEscrows((prev) =>
                prev.map((item) =>
                  item.address === escrowContract.address
                    ? { ...item, refunded: true }
                    : item
                )
              );
            });

            await escrowContract.connect(signer).refund();
          } catch (err) {
            if (err.code === 4001) {
              showToast("❌ Refund cancelled.");
            } else if (/Deadline not passed/.test(err.reason)) {
              showToast("⏳ Refund only available after deadline.");
            } else {
              showToast("🚫 Only arbiter can refund.");
            }
          }
        },
      };

      setEscrows((prev) => [...prev, escrow]);

      // Reset form
      document.getElementById("beneficiary").value = "";
      document.getElementById("arbiter").value = "";
      document.getElementById("eth").value = "";

      showToast("🥳 New Contract Deployed!");
    } catch (err) {
      // User rejected in MetaMask
      if (err.code === 4001 || err.code === "ACTION_REJECTED") {
        showToast("Deployment cancelled.🥀");
        return setIsDeploying(false);
      }

      // Hardhat simulated revert (normal when cancelling)
      if (err.message?.includes("Transaction reverted without a reason")) {
        console.warn("Simulated call reverted (harmless during cancellation).");
        showToast("Deployment cancelled.🥀");
        return setIsDeploying(false);
      }

      // Unexpected errors
      console.error("Deployment failed:", err);
      showToast("🚨 Unexpected deployment error.");
    } finally {
      setIsDeploying(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      {/* Background */}
      <div className="fixed top-0 left-0 bg-gradient-to-br from-black to-blue-950 w-full h-full -z-50">
        <Prism
          animationType="rotate"
          timeScale={0.3}
          height={7}
          baseWidth={7}
          scale={3}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        />
      </div>

      <Toast message={toast.message} show={toast.show} />

      {/* Panels */}
      <main className="fixed mt-20 mb-40 w-full flex justify-center">
        <PanelWrapper active={activePanel === "new"} direction="left">
          <NewContractForm
            newContract={newContract}
            isDeploying={isDeploying}
            formError={formError}
          />
        </PanelWrapper>

        <PanelWrapper active={activePanel === "existing"} direction="right">
          <ExistingContracts escrows={escrows} userAddress={userAddress} />
        </PanelWrapper>
      </main>

      {/* Dock */}
      <Dock
        items={[
          { icon: "📝", label: "New", onClick: () => setActivePanel("new") },
          {
            icon: "📄",
            label: "Contracts",
            onClick: () => setActivePanel("existing"),
          },
        ]}
        magnification={90}
        baseItemSize={42}
      />
      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={importEscrow}
      />
    </div>
  );
}

export default App;
