import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Technology | Heritage 3D",
  description: "Learn about the technology behind Heritage 3D's GenAI-powered 3D models of Indian monuments",
}

export default function TechnologyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">Our Technology</h1>
          <p className="text-lg text-amber-800 max-w-3xl mx-auto">
            Heritage 3D leverages cutting-edge Generative AI technology to create detailed 3D models of Indian monuments
            from simple text prompts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-amber-900 mb-4">Text-to-3D Generation</h2>
            <p className="text-amber-800 mb-4">
              Our platform uses state-of-the-art text-to-3D models like Stable Diffusion 3D to generate initial 3D
              models from detailed text prompts. This allows us to quickly create base models of monuments with minimal
              input.
            </p>
            <p className="text-amber-800 mb-4">
              For example, a prompt like "detailed Hampi ruins with stone carvings, ancient temple complex with pillared
              halls and intricate sculptures" generates a base 3D model that captures the essence of the monument.
            </p>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-amber-900 mb-2">Key Benefits:</h3>
              <ul className="list-disc list-inside text-amber-800 space-y-1">
                <li>Rapid generation of complex architectural structures</li>
                <li>Ability to recreate monuments with limited reference material</li>
                <li>Consistent quality across different monument types</li>
                <li>Scalable approach for expanding our monument database</li>
              </ul>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Text-to-3D Generation Process"
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 p-3 bg-amber-50 rounded-lg">
              <h3 className="font-semibold text-amber-900 mb-2">Generation Process</h3>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                    <span className="text-amber-800 font-medium">1</span>
                  </div>
                  <p className="text-sm text-amber-700">Text Prompt</p>
                </div>
                <div className="h-px w-12 bg-amber-200"></div>
                <div className="text-center">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                    <span className="text-amber-800 font-medium">2</span>
                  </div>
                  <p className="text-sm text-amber-700">AI Processing</p>
                </div>
                <div className="h-px w-12 bg-amber-200"></div>
                <div className="text-center">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                    <span className="text-amber-800 font-medium">3</span>
                  </div>
                  <p className="text-sm text-amber-700">Base Model</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1 bg-white p-4 rounded-xl shadow-md">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Blender Refinement Process"
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-amber-50 p-3 rounded-lg">
                <h3 className="font-semibold text-amber-900 mb-1 text-sm">Geometry Cleanup</h3>
                <p className="text-xs text-amber-700">Fixing mesh issues and optimizing topology</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <h3 className="font-semibold text-amber-900 mb-1 text-sm">Texture Enhancement</h3>
                <p className="text-xs text-amber-700">Adding detailed textures and materials</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <h3 className="font-semibold text-amber-900 mb-1 text-sm">Historical Accuracy</h3>
                <p className="text-xs text-amber-700">Ensuring architectural correctness</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">Expert Refinement in Blender</h2>
            <p className="text-amber-800 mb-4">
              While AI generates impressive base models, our team of 3D artists and historians refine these models in
              Blender to ensure historical accuracy, architectural correctness, and visual quality.
            </p>
            <p className="text-amber-800 mb-4">
              This human-in-the-loop approach combines the efficiency of AI with the expertise of specialists who
              understand the cultural and historical significance of each monument.
            </p>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-amber-900 mb-2">Refinement Process:</h3>
              <ol className="list-decimal list-inside text-amber-800 space-y-1">
                <li>Geometry cleanup and optimization</li>
                <li>Texture and material enhancement</li>
                <li>Addition of architectural details based on reference materials</li>
                <li>Historical verification with experts</li>
                <li>Optimization for web viewing and interactive experiences</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-20">
          <h2 className="text-3xl font-bold text-amber-900 mb-6 text-center">Educational Content Integration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-amber-50 p-5 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">Multilingual Content</h3>
              <p className="text-amber-800">
                All educational content is available in both Hindi and English, making it accessible to a wider audience
                across India. We plan to add more regional languages in the future.
              </p>
            </div>
            <div className="bg-amber-50 p-5 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">Historical Context</h3>
              <p className="text-amber-800">
                Each monument comes with detailed historical information, including its significance, the period it was
                built, architectural style, and cultural importance.
              </p>
            </div>
            <div className="bg-amber-50 p-5 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">Interactive Learning</h3>
              <p className="text-amber-800">
                Our platform includes interactive elements like virtual tours, quizzes, and educational activities
                designed for students and tourists to engage with the content.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-amber-900 mb-4">Future Technology Roadmap</h2>
          <p className="text-lg text-amber-800 max-w-3xl mx-auto mb-8">
            We're constantly improving our technology to create more accurate and immersive experiences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">VR Integration</h3>
              <p className="text-amber-800">
                Immersive virtual reality experiences allowing users to explore monuments in full 3D.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">Mobile AR</h3>
              <p className="text-amber-800">
                Augmented reality applications to bring monuments into classrooms and homes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">AI Tour Guides</h3>
              <p className="text-amber-800">
                Interactive AI guides that can answer questions about monuments in multiple languages.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">3D Database</h3>
              <p className="text-amber-800">
                Comprehensive database of all significant Indian monuments preserved in 3D for future generations.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-700 to-orange-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Help us preserve India's cultural heritage through technology and education.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button className="bg-white text-amber-900 hover:bg-amber-100">Partner With Us</Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
