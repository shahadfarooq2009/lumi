export function SkyGreeting() {
  return (
    <div className="sky-greeting">
      <div className="sky-avatar">
        <img src="/assets/quizora-mascot.png" alt="Quizora mascot" />
      </div>
      <div className="sky-greeting__hero sky-greeting__text">
        <small>Hi, I&apos;m Quizora</small>
        <h1>
          Always here to help <em>you learn &amp; play</em>
        </h1>
      </div>
      <div className="sky-greeting__chat">
        <span className="sky-greeting__chat-name">Quizora</span>
      </div>
    </div>
  )
}
