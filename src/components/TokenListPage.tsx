import React, { useCallback, useEffect, useState } from "react";
import { getCollectionStats } from "../utils/collection";
import { removeEntry } from "../utils/storage";
import {
  TOTPEntry,
  getProgressPercentage,
  getTOTPCode,
  getTimeRemaining,
  isSpecialSequence,
} from "../utils/totp";
import ConfirmModal from "./ConfirmModal";
import Toast from "./Toast";

interface TokenListPageProps {
  entries: TOTPEntry[];
  onEntriesChange: (entries: TOTPEntry[]) => void;
  onAddNew: () => void;
  onShowCollection: () => void;
}

const TokenListPage: React.FC<TokenListPageProps> = ({
  entries,
  onEntriesChange,
  onAddNew,
  onShowCollection,
}) => {
  const [codes, setCodes] = useState<{ [key: string]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: number }>(
    {}
  );
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [copySuccess, setCopySuccess] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    entryId: string;
    entryName: string;
  }>({ isOpen: false, entryId: "", entryName: "" });
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({ isVisible: false, message: "", type: "success" });
  const [collectionStats, setCollectionStats] = useState({
    total: 0,
    totalSeen: 0,
    totalGenerated: 0,
    byRarity: { Common: 0, Rare: 0, Epic: 0, Legendary: 0 },
  });

  const updateCodes = useCallback(() => {
    const newCodes: { [key: string]: string } = {};
    const newTimeRemaining: { [key: string]: number } = {};
    const newProgress: { [key: string]: number } = {};

    entries.forEach((entry) => {
      newCodes[entry.id] = getTOTPCode(entry);
      newTimeRemaining[entry.id] = getTimeRemaining(entry.period || 30);
      newProgress[entry.id] = getProgressPercentage(entry.period || 30);
    });

    setCodes(newCodes);
    setTimeRemaining(newTimeRemaining);
    setProgress(newProgress);
  }, [entries]);

  useEffect(() => {
    updateCodes();
    setCollectionStats(getCollectionStats());
    const interval = setInterval(() => {
      updateCodes();
      setCollectionStats(getCollectionStats());
    }, 1000);
    return () => clearInterval(interval);
  }, [updateCodes]);

  const handleDeleteClick = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) {
      setDeleteModal({
        isOpen: true,
        entryId: id,
        entryName: `${entry.issuer} - ${entry.accountName}`,
      });
    }
  };

  const handleDeleteConfirm = () => {
    const newEntries = removeEntry(deleteModal.entryId);
    onEntriesChange(newEntries);
    setDeleteModal({ isOpen: false, entryId: "", entryName: "" });
    setToast({
      isVisible: true,
      message: "Entry deleted successfully",
      type: "success",
    });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, entryId: "", entryName: "" });
  };

  const handleToastClose = () => {
    setToast({ isVisible: false, message: "", type: "success" });
  };

  const handleCopy = async (code: string, entryId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(entryId);
      setToast({
        isVisible: true,
        message: "Code copied to clipboard!",
        type: "success",
      });
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
      setToast({
        isVisible: true,
        message: "Failed to copy code",
        type: "error",
      });
    }
  };

  const getCodeClassName = (code: string, remaining: number) => {
    let baseClasses =
      "text-6xl md:text-7xl font-pixel font-bold tracking-widest select-all";

    if (remaining <= 5) {
      baseClasses += " text-pixel-red animate-pixel-pulse";
    } else if (remaining <= 10) {
      baseClasses += " text-pixel-orange";
    } else {
      baseClasses += " text-pixel-green";
    }

    if (isSpecialSequence(code)) {
      baseClasses += " animate-pixel-bounce text-pixel-yellow";
    }

    return baseClasses;
  };

  const getProgressBarColor = (remaining: number) => {
    if (remaining <= 5) return "bg-pixel-red";
    if (remaining <= 10) return "bg-pixel-orange";
    return "bg-pixel-green";
  };

  if (entries.length === 0) {
    return (
      <div className="min-h-screen bg-pixel-bg flex flex-col justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-pixel font-bold text-pixel-text mb-4">
            NO AUTHENTICATORS YET
          </h2>
          <p className="text-pixel-muted mb-8 font-pixel">
            Add your first authenticator to start collecting!
          </p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center px-6 py-3 border-2 border-pixel-text text-sm font-pixel font-bold rounded-pixel shadow-pixel text-pixel-text bg-pixel-accent hover:bg-pixel-purple hover:shadow-pixel-inset focus:outline-none transition-all duration-150"
          >
            {">>> ADD NEW ENTRY <<<"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pixel-bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-pixel font-bold text-pixel-text">
            PIXEL AUTHENTICATOR
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={onShowCollection}
              className="inline-flex items-center px-4 py-3 border-2 border-pixel-yellow text-sm font-pixel font-bold rounded-pixel shadow-pixel text-pixel-bg bg-pixel-yellow hover:bg-pixel-text hover:text-pixel-bg hover:shadow-pixel-inset focus:outline-none transition-all duration-150"
            >
              🏆 COLLECTION ({collectionStats.total})
            </button>
            <button
              onClick={onAddNew}
              className="inline-flex items-center px-6 py-3 border-2 border-pixel-text text-sm font-pixel font-bold rounded-pixel shadow-pixel text-pixel-text bg-pixel-accent hover:bg-pixel-purple hover:shadow-pixel-inset focus:outline-none transition-all duration-150"
            >
              + ADD NEW
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {entries.map((entry) => {
            const code = codes[entry.id] || "------";
            const remaining = timeRemaining[entry.id] || 0;
            const progressPercent = progress[entry.id] || 0;

            return (
              <div
                key={entry.id}
                className="bg-pixel-surface shadow-pixel-lg rounded-pixel p-6 border-2 border-pixel-primary"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-pixel font-bold text-pixel-text">
                      {entry.issuer}
                    </h3>
                    <p className="text-sm font-pixel text-pixel-muted">
                      {entry.accountName}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCopy(code, entry.id)}
                      className="inline-flex items-center p-2 border-2 border-pixel-text rounded-pixel shadow-pixel text-sm font-pixel font-bold text-pixel-text bg-pixel-primary hover:bg-pixel-secondary hover:shadow-pixel-inset focus:outline-none transition-all duration-150"
                      title="Copy code"
                    >
                      {copySuccess === entry.id ? (
                        <svg
                          className="h-4 w-4 text-pixel-green"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(entry.id)}
                      className="inline-flex items-center p-2 border-2 border-pixel-red rounded-pixel shadow-pixel text-sm font-pixel font-bold text-pixel-red bg-pixel-surface hover:bg-pixel-red hover:text-pixel-text hover:shadow-pixel-inset focus:outline-none transition-all duration-150"
                      title="Delete entry"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="text-center mb-6 py-4">
                  <div
                    className={getCodeClassName(code, remaining)}
                    role="button"
                    aria-label={`2FA Code: ${code
                      .split("")
                      .join(
                        " "
                      )}, ${remaining} seconds remaining. Press Enter or click to copy.`}
                    tabIndex={0}
                    title="Click to copy this code"
                    onClick={() => handleCopy(code, entry.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCopy(code, entry.id);
                      }
                    }}
                    style={{ cursor: "pointer", letterSpacing: "0.2em" }}
                  >
                    {code.split("").map((digit, index) => (
                      <span
                        key={index}
                        className="inline-block mx-1 px-1 bg-pixel-bg bg-opacity-30 rounded-pixel border border-pixel-text border-opacity-20"
                      >
                        {digit}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm font-pixel text-pixel-muted">
                    <span>TIME REMAINING</span>
                    <span className="text-pixel-text">{remaining}s</span>
                  </div>
                  <div className="w-full bg-pixel-bg rounded-pixel h-3 mt-1 border-2 border-pixel-text">
                    <div
                      className={`h-full rounded-pixel transition-all duration-1000 ${getProgressBarColor(
                        remaining
                      )}`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={handleToastClose}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete 2FA Entry"
        message={`Are you sure you want to delete "${deleteModal.entryName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        type="danger"
      />
    </div>
  );
};

export default TokenListPage;
