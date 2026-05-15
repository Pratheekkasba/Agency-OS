import React from 'react';
import { LucideIcon } from 'lucide-react';

export type EmptyStateVariant = 'default' | 'onboarding' | 'no-results';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: EmptyStateVariant;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  variant = 'default',
  action
}: EmptyStateProps) {
  // Determine variant-specific styling (subtle differences in background, border, padding)
  const variantStyles = {
    default: 'border-[#1F1F2B] bg-[#131317]',
    onboarding: 'border-[#5B5CF6]/20 bg-[#5B5CF6]/5',
    'no-results': 'border-dashed border-[#2D2D3D] bg-transparent'
  };

  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border p-12 text-center transition-all ${variantStyles[variant]}`}>
      <div className={`flex h-14 w-14 items-center justify-center rounded-full mb-4 ${
        variant === 'onboarding' ? 'bg-[#5B5CF6]/20' : 'bg-[#1A1A24]'
      }`}>
        <Icon className={`h-7 w-7 ${
          variant === 'onboarding' ? 'text-[#5B5CF6]' : 'text-[#8A8A98]'
        }`} />
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-[#8A8A98] max-w-sm mx-auto mb-6">
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
            variant === 'onboarding'
              ? 'bg-[#5B5CF6] text-white hover:bg-[#4F50DB] shadow-[0_0_15px_rgba(91,92,246,0.15)] hover:shadow-[0_0_25px_rgba(91,92,246,0.3)]'
              : 'bg-[#1A1A24] text-white border border-[#2D2D3D] hover:bg-[#252533] hover:border-[#3D3D4D]'
          }`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
