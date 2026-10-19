import { Search, Globe, ShoppingBag, Code2, Megaphone, Palette, Layers, MessageCircle, Cpu, Target, Smartphone, PenTool, TrendingUp, Rocket, Wrench } from 'lucide-react'

export const iconMap = { Search, Globe, ShoppingBag, Code2, Megaphone, Palette, Layers, Cpu, Target, Smartphone, PenTool, TrendingUp, Rocket, Wrench }

const env = import.meta.env
export const site = {
  name: 'Zeon Scale Agency',
  tagline: 'We Build Digital Experiences That Scale.',
  email: env.VITE_CONTACT_EMAIL || 'zeonscale@gmail.com',
  phone: '+92 348 3755011',
  phoneHref: 'tel:+923483755011',
  whatsapp: `https://wa.me/${env.VITE_WHATSAPP_NUMBER || '923483755011'}`,
  address: 'Haroonabad, Punjab, Pakistan 62100',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Haroonabad%2C+Punjab%2C+Pakistan+62100',
  formEndpoint: env.VITE_FORM_ENDPOINT || '',
  socials: [
    { label: 'Facebook', url: env.VITE_FACEBOOK_URL || 'https://www.facebook.com/profile.php?id=61592718736569', icon: 'Facebook' },
    { label: 'Instagram', url: env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/zeonscale/', icon: 'Instagram' },
    { label: 'TikTok', url: env.VITE_TIKTOK_URL || 'https://www.tiktok.com/@zeon.scale', icon: 'TikTok' },
    { label: 'Fiverr', url: env.VITE_FIVERR_URL || 'https://www.fiverr.com/zeonscale', icon: 'Fiverr' },
    { label: 'LinkedIn', url: env.VITE_LINKEDIN_URL, icon: 'Linkedin' },
    { label: 'GitHub', url: env.VITE_GITHUB_URL, icon: 'Github' },
  ].filter((s) => s.url),
}

export const services = [
  { slug: 'seo', title: 'SEO & Content Writing', icon: Search, text: 'Search-friendly pages and articles written to be found, read and trusted.' },
  { slug: 'wordpress', title: 'WordPress Development', icon: Globe, text: 'Custom themes and easy-to-edit sites your team can manage without a developer.' },
  { slug: 'shopify', title: 'Shopify Store Development', icon: ShoppingBag, text: 'Stores built for clear product pages, fast checkout and simple catalog management.' },
  { slug: 'custom', title: 'Custom Web Development', icon: Code2, text: 'React and modern web apps for ideas that templates cannot handle.' },
  { slug: 'marketing', title: 'Digital Marketing', icon: Megaphone, text: 'Campaigns and channels planned around the customers you want to reach.' },
  { slug: 'design', title: 'Graphic Design', icon: Palette, text: 'Logos, social creatives and brand assets that look consistent everywhere.' },
]

const demoProjects = [
  { slug: 'bloom-boutique', video_url: '/videos/bloom-boutique.mp4', poster_url: '/videos/bloom-boutique.jpg', title: 'Bloom Boutique', category: 'Shopify', icon: ShoppingBag, text: 'A clothing store concept with filterable collections and a streamlined checkout.', scope: ['Store structure', 'Product page layout', 'Mobile checkout'] },
  { slug: 'northline-consulting', video_url: '/videos/northline-consulting.mp4', poster_url: '/videos/northline-consulting.jpg', title: 'Northline Consulting', category: 'WordPress', icon: Globe, text: 'A services website concept with editable pages and a lead-capture contact flow.', scope: ['Custom theme', 'Editable page blocks', 'Contact flow'] },
  { slug: 'orbit-dashboard', video_url: '/videos/orbit-dashboard.mp4', poster_url: '/videos/orbit-dashboard.jpg', title: 'Orbit Dashboard', category: 'Custom Web', icon: Code2, text: 'A React dashboard concept for tracking tasks and team activity.', scope: ['Component system', 'Responsive layouts', 'State management'] },
  { slug: 'fieldnotes-blog', video_url: '/videos/fieldnotes-blog.mp4', poster_url: '/videos/fieldnotes-blog.jpg', title: 'Fieldnotes Blog', category: 'SEO', icon: Search, text: 'A content hub concept with topic clusters, clean structure and fast loading.', scope: ['Topic research', 'Article templates', 'On-page SEO'] },
  { slug: 'kite-brand-kit', video_url: '/videos/kite-brand-kit.mp4', poster_url: '/videos/kite-brand-kit.jpg', title: 'Kite Brand Kit', category: 'Design', icon: Palette, text: 'A brand identity concept covering logo, colors, typography and social templates.', scope: ['Logo system', 'Color and type', 'Social templates'] },
]
export const projects = demoProjects.map((p) => ({ ...p, demo: true }))
export const categoryIcon = { Shopify: ShoppingBag, WordPress: Globe, 'Custom Web': Code2, SEO: Search, Design: Palette }

export const reasons = [
  { icon: Layers, title: 'Quality you can inspect', text: 'Clean, documented code and carefully checked layouts.' },
  { icon: MessageCircle, title: 'Responsive communication', text: 'Clear updates at every stage, with questions answered quickly.' },
  { icon: Cpu, title: 'Modern technology', text: 'Current frameworks chosen for speed, security and easy upkeep.' },
  { icon: Target, title: 'Tailored solutions', text: 'Every build starts from your goals, not a recycled template.' },
]

export const process = [
  ['Discovery', 'We learn about your business, audience and goals.'],
  ['Strategy', 'We agree on scope, structure and what success looks like.'],
  ['Design', 'We create the look and feel, and refine it with your feedback.'],
  ['Development', 'We build, test and connect everything.'],
  ['Launch & Optimization', 'We go live, then keep improving based on real results.'],
]

// Add genuine client reviews here, with permission. Leave empty until you have them.
export const testimonials = []
