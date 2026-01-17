"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const monuments = [
  {
    id: "hampi",
    name: "Hampi Ruins",
    location: "Karnataka",
    description: "Ancient ruins of the Vijayanagara Empire with intricate stone carvings and temples.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "ajanta",
    name: "Ajanta Caves",
    location: "Maharashtra",
    description: "Rock-cut cave monuments featuring masterpieces of Buddhist religious art.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "khajuraho",
    name: "Khajuraho Temples",
    location: "Madhya Pradesh",
    description: "Medieval Hindu and Jain temples famous for their nagara-style architectural symbolism.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "konark",
    name: "Konark Sun Temple",
    location: "Odisha",
    description: "13th-century Sun Temple known for its intricate stone carvings and architectural grandeur.",
    image: "/placeholder.svg?height=400&width=600",
  },
]

export default function FeaturedMonuments() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div ref={ref} className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-amber-900 mb-4">Featured Monuments</h2>
        <p className="text-lg text-amber-800 max-w-3xl mx-auto">
          Explore our collection of detailed 3D models of India's most significant heritage sites.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {monuments.map((monument, index) => (
          <motion.div
            key={monument.id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
              activeIndex === index ? "ring-2 ring-amber-500" : ""
            }`}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={monument.image || "/placeholder.svg"}
                alt={monument.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-amber-900 mb-1">{monument.name}</h3>
              <p className="text-amber-600 mb-3">{monument.location}</p>
              <p className="text-amber-700 mb-4 line-clamp-2">{monument.description}</p>
              <Link href={`/monuments/${monument.id}`}>
                <Button variant="outline" className="w-full border-amber-500 text-amber-700 hover:bg-amber-50">
                  View in 3D <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link href="/monuments">
          <Button variant="outline" className="border-amber-700 text-amber-800 hover:bg-amber-50">
            View All Monuments <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
