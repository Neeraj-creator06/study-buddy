import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'AI StudyBuddy is thinking...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative flex items-center justify-center">
        {/* Outer pulsating ring */}
        <div className="w-16 h-16 rounded-full border-2 border-salesport/30 animate-ping absolute" />
        
        {/* Spinning primary loader */}
        <div className="w-14 h-14 rounded-full border-2 border-t-salesport border-r-salesport/40 border-b-transparent border-l-transparent animate-spin" />
        
        {/* Core spark icon */}
        <div className="absolute flex items-center justify-center w-8 h-8 rounded-full bg-salesport/20 text-salesport">
          <Sparkles className="w-4 h-4 animate-bounce" />
        </div>
      </div>

      <p className="mt-5 text-sm font-medium text-alice tracking-wide flex items-center gap-2">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-salesport" />
        {message}
      </p>
      <span className="text-xs text-alice-muted mt-1">Analyzing concepts and structuring response...</span>
    </div>
  );
}
