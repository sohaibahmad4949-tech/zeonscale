import { Link } from 'react-router-dom'
export default function Logo({ className = '' }) {
  return (
    <Link to="/" aria-label="Zeon Scale Agency home" className={`flex items-center gap-2.5 ${className}`}>
      <img src="/logo.png" alt="" width="36" height="36" className="h-9 w-9 object-contain" />
      <span className="font-display text-lg font-bold leading-none">Zeon Scale<span className="block text-[11px] font-semibold text-brand">Agency</span></span>
    </Link>
  )
}
