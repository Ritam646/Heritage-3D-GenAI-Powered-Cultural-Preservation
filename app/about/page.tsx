import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "About | Heritage 3D",
  description: "Learn about Heritage 3D's mission to preserve Indian cultural heritage through GenAI-powered 3D models",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">About Heritage 3D</h1>
          <p className="text-lg text-amber-800 max-w-3xl mx-auto">
            Heritage 3D is an innovative project dedicated to preserving India's cultural heritage through Generative AI
            technology and educational outreach.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-amber-900 mb-4">Our Mission</h2>
            <p className="text-amber-800 mb-4">
              Heritage 3D aims to digitally preserve endangered and lesser-known Indian monuments using cutting-edge
              Generative AI technology, making them accessible to everyone through interactive 3D models and educational
              content.
            </p>
            <p className="text-amber-800 mb-4">
              We believe that cultural heritage belongs to everyone, and our mission is to ensure that India's
              architectural treasures are documented, preserved, and shared with future generations, regardless of
              geographical or socioeconomic barriers.
            </p>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-amber-900 mb-2">Our Core Values:</h3>
              <ul className="list-disc list-inside text-amber-800 space-y-1">
                <li>Preservation of cultural heritage for future generations</li>
                <li>Accessibility and inclusivity in cultural education</li>
                <li>Innovation through responsible use of AI technology</li>
                <li>Accuracy and respect for historical and cultural context</li>
                <li>Collaboration with experts, institutions, and communities</li>
              </ul>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=400&width=600" alt="Heritage 3D Team" fill className="object-cover" />
            </div>
            <div className="mt-4 p-4 bg-amber-50 rounded-lg">
              <h3 className="font-semibold text-amber-900 mb-2">Why It Matters</h3>
              <p className="text-amber-700">
                Many of India's historical monuments are at risk due to environmental factors, urbanization, and
                neglect. By creating detailed 3D models, we're preserving these cultural treasures digitally while
                making them accessible to students, researchers, and enthusiasts worldwide.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-20">
          <h2 className="text-3xl font-bold text-amber-900 mb-6 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image src="/placeholder.svg?height=128&width=128" alt="Team Member" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900">Priya Sharma</h3>
              <p className="text-amber-700">Founder & AI Specialist</p>
              <p className="text-amber-600 text-sm mt-2">
                Expert in AI and cultural heritage preservation with 8+ years of experience.
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image src="/placeholder.svg?height=128&width=128" alt="Team Member" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900">Rahul Patel</h3>
              <p className="text-amber-700">3D Artist & Technical Lead</p>
              <p className="text-amber-600 text-sm mt-2">
                Specializes in 3D modeling and Blender optimization for cultural artifacts.
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image src="/placeholder.svg?height=128&width=128" alt="Team Member" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900">Dr. Ananya Gupta</h3>
              <p className="text-amber-700">Historical Consultant</p>
              <p className="text-amber-600 text-sm mt-2">
                PhD in Indian Art History with expertise in architectural heritage.
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image src="/placeholder.svg?height=128&width=128" alt="Team Member" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900">Vikram Singh</h3>
              <p className="text-amber-700">Education Outreach</p>
              <p className="text-amber-600 text-sm mt-2">
                Develops educational programs and partnerships with schools and museums.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1 bg-white p-4 rounded-xl shadow-md">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Impact of Heritage 3D"
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-amber-50 p-3 rounded-lg">
                <h3 className="font-semibold text-amber-900 mb-1">15+</h3>
                <p className="text-sm text-amber-700">Monuments Preserved</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <h3 className="font-semibold text-amber-900 mb-1">5,000+</h3>
                <p className="text-sm text-amber-700">Students Reached</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <h3 className="font-semibold text-amber-900 mb-1">12</h3>
                <p className="text-sm text-amber-700">Educational Partners</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <h3 className="font-semibold text-amber-900 mb-1">3</h3>
                <p className="text-sm text-amber-700">Conservation Projects</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">Our Impact</h2>
            <p className="text-amber-800 mb-4">
              Since our inception, Heritage 3D has been working to bridge the gap between technology, education, and
              cultural preservation. Our impact extends across multiple dimensions:
            </p>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-amber-900 mb-2">Educational Access</h3>
                <p className="text-amber-800">
                  We've partnered with schools across India to bring 3D models of monuments into classrooms,
                  particularly in rural areas where students have limited access to cultural sites.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-amber-900 mb-2">Digital Preservation</h3>
                <p className="text-amber-800">
                  Our detailed 3D models serve as digital records of monuments, some of which are at risk of
                  deterioration or damage, ensuring their visual preservation for future generations.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-amber-900 mb-2">Tourism Support</h3>
                <p className="text-amber-800">
                  By highlighting lesser-known monuments, we're helping to diversify tourism beyond the most famous
                  sites, supporting local economies and encouraging conservation efforts.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-700 to-orange-600 rounded-xl p-8 text-white text-center mb-20">
          <h2 className="text-3xl font-bold mb-4">Our Partners</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We collaborate with educational institutions, cultural organizations, and technology partners to maximize
            our impact and reach.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="h-16 w-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-xl">ASI</span>
              </div>
              <p className="text-white font-medium">Archaeological Survey of India</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="h-16 w-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-xl">MIT</span>
              </div>
              <p className="text-white font-medium">Ministry of Tourism</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="h-16 w-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-xl">NCERT</span>
              </div>
              <p className="text-white font-medium">National Council of Educational Research</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="h-16 w-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-xl">INTACH</span>
              </div>
              <p className="text-white font-medium">Indian National Trust for Art and Cultural Heritage</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-amber-900 mb-4">Join Our Mission</h2>
          <p className="text-lg text-amber-800 max-w-3xl mx-auto mb-8">
            Whether you're an educator, historian, technologist, or simply passionate about preserving cultural
            heritage, there are many ways to get involved with Heritage 3D.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
            <Link href="/contact">
              <Button className="bg-amber-700 hover:bg-amber-800 text-white">Contact Us</Button>
            </Link>
            <Link href="/volunteer">
              <Button variant="outline" className="border-amber-700 text-amber-800 hover:bg-amber-50">
                Volunteer Opportunities
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="outline" className="border-amber-700 text-amber-800 hover:bg-amber-50">
                Support Our Work
              </Button>
            </Link>
          </div>

          <Link href="/monuments" className="inline-flex items-center text-amber-700 hover:text-amber-900">
            Explore our 3D monument collection <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  )
}
