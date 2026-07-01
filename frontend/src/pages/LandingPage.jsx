import Header from '../components/Landing/header'
import Hero from '../components/Landing/hero-home'
import Features from '../components/Landing/features'
import Footer from '../components/Landing/footer'
import './landing-styles.css'
import About from './About/About'
import Pricing from './Harga/Pricing'
import Faq from './FAQ/faq'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <main>
        <Hero />
        <About />
        <Features />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}