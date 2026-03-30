"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-[#0a0f1e] min-h-screen flex items-center justify-center">
        <div className="text-center px-6 py-12 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">An unexpected error occurred. Please try again.</p>
          <button
            onClick={() => reset()}
            className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/30"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
