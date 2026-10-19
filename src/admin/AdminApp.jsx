import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'
import { NotConfigured, Spinner } from './ui'
import Login from './Login'
import Layout from './Layout'
import Dashboard from './Dashboard'
import Submissions from './Submissions'
import Manager from './Manager'
import SeoAnalytics from './SeoAnalytics'
import { projects as demoProjects } from '../data/site'

const demoSeed = demoProjects.map((p, i) => ({ slug: p.slug, title: p.title, category: p.category, description: p.text, scope: p.scope, video_url: p.video_url || null, poster_url: p.poster_url || null, demo: true, published: true, sort_order: i + 1 }))

function RequireAdmin({ children }) {
  const { loading, session, isAdmin } = useAuth()
  if (loading) return <Spinner />
  return session && isAdmin ? children : <Navigate to="/admin/login" replace />
}

const projectFields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'category', label: 'Category', type: 'select', required: true, options: ['Shopify', 'WordPress', 'Custom Web', 'SEO', 'Design', 'Marketing'] },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'scope', label: 'What you delivered', type: 'lines', help: 'One item per line.' },
  { name: 'video_url', label: 'Project video', type: 'upload', bucket: 'project-media', accept: 'video/mp4,video/webm', placeholder: 'Upload an MP4, or paste an MP4 / YouTube / Vimeo link', help: 'Short silent MP4s (under 50 MB) work best for the card preview.' },
  { name: 'poster_url', label: 'Video thumbnail (optional)', type: 'upload', bucket: 'project-media', accept: 'image/jpeg,image/png,image/webp', placeholder: 'Upload or paste an image link', help: 'Shown while the video loads and for YouTube/Vimeo links.' },
  { name: 'slug', label: 'URL slug', help: 'Leave blank to create it from the title.' },
  { name: 'sort_order', label: 'Display order', type: 'number', help: 'Lower numbers appear first.' },
  { name: 'demo', label: 'This is a sample or concept project', type: 'checkbox', help: 'Adds a “Concept demo” label. Leave unchecked only for real client work.' },
  { name: 'published', label: 'Show on the website', type: 'checkbox', help: 'Once you publish a project, the sample demos stop showing.' },
]
const serviceFields = [
  { name: 'title', label: 'Service name', required: true },
  { name: 'description', label: 'Short description', type: 'textarea', required: true, help: 'One or two sentences shown on the service card.' },
  { name: 'icon', label: 'Icon', type: 'select', required: true, options: ['Search', 'Globe', 'ShoppingBag', 'Code2', 'Megaphone', 'Palette', 'Layers', 'Cpu', 'Target', 'Smartphone', 'PenTool', 'TrendingUp', 'Rocket', 'Wrench'] },
  { name: 'features', label: 'What is included (optional)', type: 'lines', help: 'One item per line. Shown as a short checklist on the service card.' },
  { name: 'slug', label: 'URL slug', help: 'Leave blank to create it from the name. It is used in the quote form link.' },
  { name: 'sort_order', label: 'Display order', type: 'number', help: 'Lower numbers appear first.' },
  { name: 'published', label: 'Show on the website', type: 'checkbox' },
]
const testimonialFields = [
  { name: 'name', label: 'Client name', required: true },
  { name: 'role', label: 'Role or company' },
  { name: 'rating', label: 'Star rating (1 to 5)', type: 'number', help: 'Optional.' },
  { name: 'email', label: 'Reviewer email (private)', help: 'Never shown on the website. Only used if you need to contact the reviewer.' },
  { name: 'quote', label: 'Testimonial', type: 'textarea', required: true, help: 'Only add real reviews that the client has approved.' },
  { name: 'published', label: 'Show on the website', type: 'checkbox' },
]

export default function AdminApp() {
  useEffect(() => {
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex,nofollow'
    document.head.appendChild(m); document.title = 'Admin | Zeon Scale Agency'
    return () => m.remove()
  }, [])
  if (!supabase) return <NotConfigured />

  return (
    <AuthProvider>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<RequireAdmin><Layout /></RequireAdmin>}>
          <Route index element={<Dashboard />} />
          <Route path="messages" element={<Submissions key="messages" kind="messages" />} />
          <Route path="quotes" element={<Submissions key="quotes" kind="quotes" />} />
          <Route path="services" element={<Manager key="services" table="services" title="Services" text="The services shown on the website and in the quote form." noun="service" fields={serviceFields}
            blank={{ title: '', description: '', icon: 'Layers', features: '', slug: '', sort_order: 0, published: true }}
            order={{ col: 'sort_order', asc: true }} primary={(r) => r.title} secondary={(r) => r.description} />} />
          <Route path="projects" element={<Manager key="projects" table="projects" title="Projects" text="Portfolio items shown on the website." noun="project" fields={projectFields} seed={demoSeed}
            blank={{ title: '', category: '', description: '', scope: '', video_url: '', poster_url: '', slug: '', sort_order: 0, demo: false, published: false }}
            order={{ col: 'sort_order', asc: true }} primary={(r) => r.title} secondary={(r) => `${r.category}${r.demo ? ' · concept demo' : ''}`} />} />
          <Route path="seo" element={<SeoAnalytics />} />
          <Route path="testimonials" element={<Manager key="testimonials" table="testimonials" title="Testimonials" text="Reviews from clients. Reviews sent from the website wait here until you approve them." noun="testimonial" approval fields={testimonialFields}
            blank={{ name: '', role: '', rating: '', email: '', quote: '', published: false, status: 'approved' }}
            order={{ col: 'created_at', asc: false }} primary={(r) => r.name} secondary={(r) => `${r.rating ? '★'.repeat(r.rating) + ' ' : ''}${r.quote}`} />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  )
}
