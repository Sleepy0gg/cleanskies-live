export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-space-900/60">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-300 flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} CleanSkies Live.</p>
        <p className="text-slate-400">Designed with a NASA-inspired theme.</p>
      </div>
    </footer>
  );
}


