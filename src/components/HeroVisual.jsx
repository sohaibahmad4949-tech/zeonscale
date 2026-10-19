import { motion } from 'framer-motion'
import { Search, ShoppingBag, Smartphone } from 'lucide-react'

// Browser-window concept: rising bars and a growth arrow (echoing the logo) drawn once on load.
export default function HeroVisual() {
  const bars = [{ x: 40, h: 60 }, { x: 98, h: 105 }, { x: 156, h: 150 }]
  const chip = 'glass absolute flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm font-semibold shadow-xl shadow-brand/10'
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-6 rounded-[3rem] bg-brand/20 blur-3xl" aria-hidden="true" />
      <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }}
        className="glass relative overflow-hidden rounded-3xl shadow-2xl shadow-brand/20">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 flex-1 rounded-full border border-line px-3 py-1 text-xs text-muted">yourbrand.com</span>
        </div>
        <div className="p-5">
          <div className="h-3 w-2/5 rounded-full bg-ink/15" />
          <div className="mt-2 h-3 w-3/5 rounded-full bg-ink/10" />
          <svg viewBox="0 0 300 220" className="mt-4 h-auto w-full" role="img" aria-label="Rising bars and a growth arrow">
            <defs>
              <linearGradient id="hb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3d82ff" /><stop offset="1" stopColor="#0a3fd1" /></linearGradient>
              <linearGradient id="ha" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#0a3fd1" /><stop offset="1" stopColor="#4aa3ff" /></linearGradient>
            </defs>
            <line x1="10" x2="290" y1="200" y2="200" stroke="currentColor" strokeOpacity=".15" />
            {bars.map((b, i) => (
              <motion.rect key={b.x} x={b.x} width="40" rx="6" fill="url(#hb)" initial={{ y: 200, height: 0 }} animate={{ y: 200 - b.h, height: b.h }} transition={{ duration: 0.7, delay: 0.5 + i * 0.15, ease: 'easeOut' }} />
            ))}
            <motion.path d="M20 190 C 100 205, 220 160, 268 40" fill="none" stroke="url(#ha)" strokeWidth="9" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 1, ease: 'easeInOut' }} />
            <motion.path d="M240 44 L276 14 L284 62 Z" fill="#4aa3ff" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }} />
          </svg>
        </div>
      </motion.div>
      <div className={`${chip} float-a -left-3 top-16 sm:-left-8`}><span className="grid h-8 w-8 place-items-center rounded-xl bg-brand/15 text-brand"><Search size={16} /></span>SEO-ready</div>
      <div className={`${chip} float-b -right-2 top-1/2 sm:-right-8`}><span className="grid h-8 w-8 place-items-center rounded-xl bg-brand/15 text-brand"><ShoppingBag size={16} /></span>Store live</div>
      <div className={`${chip} float-c -bottom-4 left-8 sm:left-14`}><span className="grid h-8 w-8 place-items-center rounded-xl bg-brand/15 text-brand"><Smartphone size={16} /></span>Mobile first</div>
    </div>
  )
}
