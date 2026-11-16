import React from 'react';
import { Play, RotateCw, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  title: string;
  description: string;
  onRunPipeline: () => void;
  isRunningPipeline: boolean;
  lastProcessedAt?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  description,
  onRunPipeline,
  isRunningPipeline,
  lastProcessedAt,
}) => {
  return (
    <header className="h-16 border-b border-border-subtle bg-white flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
      <div>
        <h2 className="text-lg font-semibold text-content-primary tracking-tight leading-none">
          {title}
        </h2>
        <p className="text-xs text-content-secondary mt-1">{description}</p>
      </div>

      <div className="flex items-center gap-3">
        {lastProcessedAt && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-content-secondary border border-border-subtle px-2.5 py-1.5 rounded-md bg-surface-muted">
            <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
            <span>Results snapshot · {lastProcessedAt}</span>
          </div>
        )}

        <button
          onClick={onRunPipeline}
          disabled={isRunningPipeline}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/70 text-white text-xs font-medium shadow-subtle transition-all cursor-pointer"
        >
          {isRunningPipeline ? (
            <>
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>Processing Spark Jobs...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Run full analysis</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
