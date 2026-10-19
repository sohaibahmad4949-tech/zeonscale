import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

// Turns a YouTube or Vimeo link into an embeddable URL. Returns null for direct video files.
export function embedUrl(url = '') {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0`
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return null
}

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// mode="card": silent looping preview that plays while on screen.
// mode="player": full player with controls (and sound).
export default function ProjectVideo({ src, poster, title, mode = 'card', className = '' }) {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const embed = embedUrl(src)

  useEffect(() => {
    const v = ref.current
    if (!v || mode !== 'card' || reduced()) return
    const io = new IntersectionObserver(([e]) => { e.isIntersecting ? v.play().catch(() => {}) : v.pause() }, { threshold: 0.4 })
    io.observe(v)
    return () => io.disconnect()
  }, [mode, src])

  if (embed) {
    if (mode === 'card') return poster ? <img src={poster} alt="" loading="lazy" className={`h-full w-full object-cover ${className}`} /> : null
    return <iframe src={embed} title={`${title} video`} className={`aspect-video w-full ${className}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen />
  }

  if (mode === 'card') {
    return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={`${title} preview video`} className={`h-full w-full object-cover ${className}`} />
  }

  const toggle = () => { const v = ref.current; if (!v) return; v.paused ? v.play() : v.pause() }
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-navy ${className}`}>
      <video ref={ref} src={src} poster={poster} muted={muted} loop playsInline preload="metadata" aria-label={`${title} video`} className="aspect-video w-full object-cover"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onClick={toggle} />
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-3">
        <button onClick={toggle} aria-label={playing ? 'Pause video' : 'Play video'} className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30">{playing ? <Pause size={18} /> : <Play size={18} />}</button>
        <button onClick={() => setMuted((m) => !m)} aria-label={muted ? 'Unmute' : 'Mute'} className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30">{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
      </div>
      {!playing && <button onClick={toggle} aria-label="Play video" className="absolute inset-0 grid place-items-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-brand2 shadow-xl"><Play size={26} /></span></button>}
    </div>
  )
}
