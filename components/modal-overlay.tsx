'use client';

import React from 'react';

interface ModalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep?: number;
  totalSteps?: number;
  children: React.ReactNode;
}

export default function ModalOverlay({ 
  isOpen, 
  onClose, 
  currentStep = 1, 
  totalSteps = 3, 
  children 
}: ModalOverlayProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-[1100px] max-h-[90vh] overflow-y-auto p-10 relative animate-in fade-in-0 slide-in-from-top-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md p-2 transition-all duration-200 text-xl font-medium"
          onClick={onClose}
        >
          ×
        </button>
        <div className="absolute top-4 right-16 text-sm text-gray-500 font-medium">
          Step {currentStep} of {totalSteps}
        </div>
        <div className="mt-8">
          {children}
        </div>
      </div>
    </div>
  );
}