import type { Metadata } from "next"
import MonumentsList from "@/components/monuments-list"
import MonumentsFilter from "@/components/monuments-filter"

export const metadata: Metadata = {
  title: "Monuments | Heritage 3D",
  description: "Explore 3D models of Indian monuments created using Generative AI",
}

export default function MonumentsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">Explore Indian Monuments</h1>
          <p className="text-lg text-amber-800 max-w-3xl mx-auto">
            Discover detailed 3D models of India's most significant heritage sites, created using cutting-edge
            Generative AI technology.
          </p>
        </div>

        <MonumentsFilter />
        <MonumentsList />
      </div>
    </main>
  )
}
