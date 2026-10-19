import useSeo from '../lib/useSeo'
import ContactSection from '../components/ContactSection'

export default function Contact() {
  useSeo('Contact Us', 'Contact Zeon Scale Agency about your website, store, SEO or marketing project.')
  return <ContactSection as="h1" />
}
