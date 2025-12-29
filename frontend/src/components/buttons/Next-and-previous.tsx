"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface NextAndPreviousProps {
  currentIndex: number;
  maxIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  label?: string; // t.ex. "Vecka 3" eller "2025-01-12"
}

export default function NextAndPrevious({
                                          currentIndex,
                                          maxIndex,
                                          onPrevious,
                                          onNext,
                                          label,
                                        }: Readonly<NextAndPreviousProps>) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === maxIndex;

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Previous */}
      <button
        onClick={onPrevious}
        disabled={isFirst}
        className={`
          flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium mb-5
          transition
          ${
          isFirst
            ? "cursor-not-allowed opacity-30"
            : "hover:bg-secondary hover:text-white"
        }
        `}
        aria-disabled={isFirst}
      >
        <ChevronLeft size={18} />
        Previous
      </button>

      {/* Center label */}
      {label && (
        <span className="text-sm font-semibold text-primary mb-5">
          {label}
        </span>
      )}

      {/* Next */}
      <button
        onClick={onNext}
        disabled={isLast}
        className={`
          flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium mb-5
          transition
          ${
          isLast
            ? "cursor-not-allowed opacity-30"
            : "hover:bg-secondary hover:text-white"
        }
        `}
        aria-disabled={isLast}
      >
        Next
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
