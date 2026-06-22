import { RefreshCw } from 'lucide-react'
import { SearchResult } from './SearchResult'

const RESULTS = [
  {
    variant: 'edu' as const,
    title: 'The Mitochondrion: Structure & Function',
    snippet: "Mitochondria generate most of the cell's ATP through oxidative phosphorylation…",
  },
  {
    variant: 'book' as const,
    title: 'Cell Biology — Cambridge University Press',
    snippet: 'A pioneer textbook covering organelle structure, membrane transport, and signaling…',
  },
  {
    variant: 'gov' as const,
    title: 'NIH — Cell Biology Learning Resources',
    snippet: 'Free curated resources from the National Institutes of Health for educators…',
  },
  {
    variant: 'video' as const,
    title: 'How a Cell Actually Works — animated explainer',
    snippet: 'A 7-minute animated walkthrough of organelles, membranes, and energy flow…',
  },
  {
    variant: 'news' as const,
    title: 'Recent Discoveries in Cell Signaling — Nature',
    snippet: 'Breakthroughs in understanding intracellular communication pathways…',
  },
]

export function SearchTool() {
  return (
    <div className="mt-5 overflow-hidden rounded-[14px] border border-border bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-border-soft px-3.5 py-3">
        <span className="rounded-md bg-brand-softer px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-brand-deep">
          MCP Tool
        </span>
        <span className="text-xs text-ink-dim">Search web</span>
        <code className="ml-auto rounded-md bg-surface-soft px-2 py-1 font-mono text-[10.5px] text-ink-soft">
          cell biology mitochondria function
        </code>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-md text-ink-dim transition-transform hover:rotate-90 hover:bg-surface-soft hover:text-ink"
          title="Refresh"
        >
          <RefreshCw size={14} strokeWidth={2} />
        </button>
      </div>
      <div className="space-y-1 p-2">
        {RESULTS.map((result) => (
          <SearchResult key={result.title} {...result} />
        ))}
      </div>
    </div>
  )
}
