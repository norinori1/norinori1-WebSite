export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-700">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">norinori1</span>
          <div className="flex gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <a href="#about" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">About</a>
            <a href="#works" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Works</a>
            <a href="#contact" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="text-center">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
            norinori1
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            Web Developer &amp; Designer
          </p>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">About</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-8 text-lg">
            はじめまして、norinori1です。Webサイトの開発・デザインに取り組んでいます。
            このサイトは私のポートフォリオです。
          </p>
        </div>
      </section>

      {/* Works */}
      <section id="works" className="py-24 px-6 bg-zinc-50 dark:bg-zinc-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Works</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-8 text-lg">
            制作実績をここに掲載予定です。
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Contact</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-8 text-lg">
            お問い合わせはGitHubまでお気軽にどうぞ。
          </p>
          <a
            href="https://github.com/norinori1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-medium hover:opacity-80 transition-opacity"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-200 dark:border-zinc-700 text-center text-sm text-zinc-500">
        © 2026 norinori1
      </footer>
    </main>
  );
}
