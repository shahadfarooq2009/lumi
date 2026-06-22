import { FileText, X } from 'lucide-react'
import type { RefObject } from 'react'
import { formatFileSize } from '../../lib/files'

interface SkyComposerProps {
  fileInputRef: RefObject<HTMLInputElement | null>
  showUploadCommand: boolean
  composerNotes: string
  onComposerNotesChange: (value: string) => void
  selectedFile: File | null
  previewUrl: string | null
  fileExt: string
  isLoading: boolean
  onFileChange: (file: File) => void
  onRemoveFile: () => void
  onAttachClick: () => void
  onSend: () => void
}

export function SkyComposer({
  fileInputRef,
  showUploadCommand,
  composerNotes,
  onComposerNotesChange,
  selectedFile,
  previewUrl,
  fileExt,
  isLoading,
  onFileChange,
  onRemoveFile,
  onAttachClick,
  onSend,
}: SkyComposerProps) {
  return (
    <div className="sky-composer-wrap">
      <div className="sky-composer" id="sky-composer">
        <input
          ref={fileInputRef}
          type="file"
          id="file-upload"
          className="sky-composer__file-input"
          accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.csv,.xls,.xlsx,image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFileChange(file)
          }}
        />

        <div className="sky-composer__body">
          <div className="sky-composer__input-area">
            {selectedFile ? (
              <div className="sky-composer__file-bar is-visible">
                <div className="sky-composer__file-bar-icon">
                  {previewUrl ? (
                    <img src={previewUrl} alt={selectedFile.name} />
                  ) : (
                    <FileText size={18} strokeWidth={2.2} />
                  )}
                </div>
                <div className="sky-composer__file-bar-info">
                  <span className="sky-composer__file-bar-name">{selectedFile.name}</span>
                  <span className="sky-composer__file-bar-meta">
                    {fileExt} · {formatFileSize(selectedFile.size)}
                  </span>
                </div>
                <button
                  type="button"
                  className="sky-composer__file-bar-remove"
                  title="Remove file"
                  aria-label="Remove file"
                  onClick={onRemoveFile}
                >
                  <X size={14} strokeWidth={2.4} />
                </button>
              </div>
            ) : showUploadCommand ? (
              <span className="sky-composer__command is-visible">/upload file</span>
            ) : null}
            {!selectedFile ? (
              <textarea
                className="sky-composer__input"
                placeholder="Share your topic — we'll craft your quiz together"
                value={composerNotes}
                onChange={(e) => onComposerNotesChange(e.target.value)}
              />
            ) : null}
          </div>
        </div>

        <div className="sky-composer__toolbar">
          <div className="sky-composer__tools">
            <button type="button" className="sky-tool sky-tool--icon" title="Attach" onClick={onAttachClick}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          <div className="sky-composer__right">
            <button
              type="button"
              className={`sky-send${isLoading ? ' is-loading' : ''}`}
              title="Generate"
              disabled={isLoading}
              onClick={onSend}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
