import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Cargando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center my-12">
      <div className="w-12 h-12 border-4 border-slate-600 border-t-brand-secondary rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-400">{message}</p>
    </div>
  );
};