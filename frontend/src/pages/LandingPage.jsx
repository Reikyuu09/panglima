import Header from '../components/Landing/header'
import Hero from '../components/Landing/hero-home'
import Features from '../components/Landing/features'
import Footer from '../components/Landing/footer'
import './landing-styles.css'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  )
}