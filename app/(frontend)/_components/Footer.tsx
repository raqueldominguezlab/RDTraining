export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 dark:bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm">Copyright © Rdtraining {new Date().getFullYear()} reservados todos los derechos.</div>

        <div className="flex items-center gap-4 text-sm">
          <a
            href="mailto:info@rdtraining.es"
            className="hover:opacity-80 flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 4L12 13 2 4" />
            </svg>
            info@rdtraining.es
          </a>

          <span className="text-gray-600">|</span>

          <a
            href="https://www.instagram.com/rdominguezg"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 flex items-center gap-1.5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            @rdominguezg
          </a>

          <span className="text-gray-600">|</span>

          <a href="/terminos-y-condiciones" className="text-gray-400 hover:text-white transition-colors">
            Términos y Condiciones
          </a>
        </div>
      </div>
    </footer>
  );
}
