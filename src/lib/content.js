import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { projects as demoProjects, testimonials as staticTestimonials, services as staticServices, iconMap } from '../data/site'

// Projects: published rows from Supabase. Falls back to the sample demos until you publish your own.
export function useProjects() {
  const [list, setList] = useState(demoProjects)
  const [ready, setReady] = useState(!supabase)
  useEffect(() => {
    if (!supabase) return
    supabase.from('projects').select('*').eq('published', true)
      .order('sort_order').order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data?.length) setList(data.map((p) => ({ ...p, text: p.description, scope: p.scope || [] })))
        setReady(true)
      })
  }, [])
  return { projects: list, categories: ['All', ...new Set(list.map((p) => p.category))], ready }
}

export function useTestimonials() {
  const [list, setList] = useState(staticTestimonials)
  useEffect(() => {
    if (!supabase) return
    supabase.from('testimonials').select('id,name,role,quote,rating,created_at').eq('published', true).order('created_at', { ascending: false })
      .then(({ data }) => { if (data?.length) setList(data) })
  }, [])
  return list
}

// Services: published rows from Supabase (fetched once per page load). Falls back to the built-in list.
let servicesReq
const loadServices = () => (servicesReq ||= supabase.from('services').select('*').eq('published', true)
  .order('sort_order').order('created_at')
  .then(({ data }) => (data?.length ? data.map((s) => ({ slug: s.slug, title: s.title, text: s.description, features: s.features || [], icon: iconMap[s.icon] || iconMap.Layers })) : null)))

export function useServices() {
  const [list, setList] = useState(staticServices)
  useEffect(() => {
    if (!supabase) return
    loadServices().then((l) => l && setList(l))
  }, [])
  return list
}

// SEO overrides saved in Admin > SEO & Analytics. Fetched once per page load.
let seoReq
export const loadSeoOverrides = () => (seoReq ||= !supabase ? Promise.resolve({}) :
  supabase.from('seo_pages').select('path,title,description,noindex')
    .then(({ data }) => Object.fromEntries((data || []).map((r) => [r.path, r])), () => ({})))
