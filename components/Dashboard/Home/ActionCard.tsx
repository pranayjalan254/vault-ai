import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ActionCard({ icon: Icon, title, description }: ActionCardProps) {
  return (
    <button className="p-4 bg-white/5 border border-gray-700 rounded-lg hover:bg-white/10 text-left backdrop-blur-sm transition-all">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-5 w-5 text-purple-400" />
        <span className="font-medium">{title}</span>
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </button>
  );
}