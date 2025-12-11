import React from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface ContactOptionProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  colorClass?: string;
  bgClass?: string;
  onClick?: () => void;
}

export function ContactOption({
  icon: Icon,
  title,
  subtitle,
  colorClass = "text-orange-500",
  bgClass = "bg-orange-50",
  onClick
}: ContactOptionProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full ${bgClass} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${colorClass}`} />
        </div>
        <div className="text-left">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  );
}
