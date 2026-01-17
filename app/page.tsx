import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, BookOpen, MapPin } from "lucide-react"
import HeroSection from "@/components/hero-section"
import FeaturedMonuments from "@/components/featured-monuments"
import AboutSection from "@/components/about-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <HeroSection />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-amber-900 mb-4">Preserving India's Cultural Heritage</h2>
          <p className="text-lg text-amber-800 max-w-3xl mx-auto">
            Explore detailed 3D models of endangered and lesser-known Indian monuments, created using cutting-edge
            Generative AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Globe className="text-amber-800" />
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">Digital Preservation</h3>
            <p className="text-amber-700">
              Creating digital twins of endangered monuments to preserve their cultural significance for future
              generations.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="text-amber-800" />
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">Educational Access</h3>
            <p className="text-amber-700">
              Providing multilingual educational content to make cultural heritage accessible to all, especially in
              rural areas.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <MapPin className="text-amber-800" />
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">Virtual Tourism</h3>
            <p className="text-amber-700">
              Enabling virtual tours of monuments, supporting tourism and conservation efforts through increased
              awareness.
            </p>
          </div>
        </div>

        <FeaturedMonuments />
        <AboutSection />

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-amber-900 mb-4">Start Exploring India's Heritage</h2>
          <p className="text-lg text-amber-800 max-w-3xl mx-auto mb-8">
            Discover the beauty and history of India's monuments through our interactive 3D models and educational
            content.
          </p>
          <Link href="/monuments">
            <Button className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-lg text-lg">
              Explore Monuments <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
