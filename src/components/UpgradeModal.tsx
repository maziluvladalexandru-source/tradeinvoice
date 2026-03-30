"use client";

interface UpgradeModalProps {
  feature: string;
  onClose: () => void;
}

export default function UpgradeModal({ feature, onClose }: UpgradeModalProps) {
  async function handleUpgrade() {
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 px-4 animate-fade-in" onClick={onClose}>
      <div className="bg-[#111827] border border-gray-700/50 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-black/50 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-5 premium-glow">
            <span className="text-3xl">🔒</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Upgrade to Pro</h3>
          <p className="text-gray-400 mb-6 leading-relaxed">
            <span className="text-amber-400 font-medium">{feature}</span> is a Pro feature. Upgrade to unlock it and get unlimited invoices, custom branding, recurring invoices, and more.
          </p>

          <div className="bg-[#0a0f1e] rounded-2xl p-5 mb-6 border border-gray-700/50">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-bold gradient-text">&euro;15</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-300 text-left">
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Unlimited invoices
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Custom branding &amp; logo on invoices
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Invoice themes &amp; templates
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Recurring invoices
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Payment reminders
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Clean PDFs without watermark
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700/30 text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-700/50 transition-all duration-200 border border-gray-700/50 hover:border-gray-600/50 btn-press"
            >
              Maybe Later
            </button>
            <button
              onClick={handleUpgrade}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 py-3 rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02] btn-press"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProBadge({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 hover:border-amber-500/30 transition-all duration-200"
    >
      🔒 Pro
    </button>
  );
}
