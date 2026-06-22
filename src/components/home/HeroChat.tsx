import { useQuizComposer } from '../../hooks/useQuizComposer'
import { SkyComposer } from './SkyComposer'
import { SkyGreeting } from './SkyGreeting'
import { SkyResults } from './SkyResults'

export function HeroChat() {
  const quiz = useQuizComposer()

  const chatClassName = [
    'hero__chat',
    quiz.hasResults ? 'has-results' : '',
    quiz.isScrolled ? 'is-scrolled' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`hero__left${quiz.hasResults ? ' has-results' : ''}`}>
      <div className="hero__grid" />

      <div className={chatClassName} id="hero-chat">
        <SkyGreeting />

        <div
          className="hero__chat-messages"
          id="hero-chat-messages"
          ref={quiz.messagesRef}
          onScroll={quiz.handleMessagesScroll}
        >
          <SkyResults
            visible={quiz.showResults}
            isRevealing={quiz.isRevealing}
            meta={quiz.resultsMeta}
            isLoading={quiz.isLoading}
            error={quiz.error}
            questions={quiz.questions}
            onRevealEnd={() => quiz.setIsRevealing(false)}
            onUpdateQuestion={quiz.updateQuestion}
          />
        </div>

        <div className="hero__chat-footer">
          <SkyComposer
            fileInputRef={quiz.fileInputRef}
            showUploadCommand={quiz.showUploadCommand}
            composerNotes={quiz.composerNotes}
            onComposerNotesChange={quiz.setComposerNotes}
            selectedFile={quiz.selectedFile}
            previewUrl={quiz.previewUrl}
            fileExt={quiz.fileExt}
            isLoading={quiz.isLoading}
            onFileChange={quiz.handleFileSelect}
            onRemoveFile={quiz.removeFile}
            onAttachClick={quiz.openFilePicker}
            onSend={quiz.handleSend}
          />
        </div>
      </div>
    </div>
  )
}
