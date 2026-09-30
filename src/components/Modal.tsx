"use client";

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeStyles: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <div
        className={`
          relative bg-white rounded-lg shadow-lg
          ${sizeStyles[size]}
          w-full max-h-[90vh] overflow-y-auto
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        {title && (
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2
              id="modal-title"
              className="text-lg font-bold"
              style={{ color: "var(--color-ink)" }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-2xl leading-none"
              style={{ color: "var(--color-muted)" }}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div
            className="px-6 py-4 border-t"
            style={{ borderColor: "var(--color-border)" }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
