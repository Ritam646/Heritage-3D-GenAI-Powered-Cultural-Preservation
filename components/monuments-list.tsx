"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Eye, Info, MapPin } from "lucide-react"

// Sample data - in a real app, this would come from an API or database
const monuments = [
  {
    id: "hampi",
    name: "Hampi Ruins",
    location: "Karnataka",
    period: "14th-16th century",
    category: "UNESCO World Heritage",
    description: "Ancient ruins of the Vijayanagara Empire with intricate stone carvings and temples.",
    image: "/placeholder.svg?height=400&width=600",
    endangered: true,
  },
  {
    id: "ajanta",
    name: "Ajanta Caves",
    location: "Maharashtra",
    period: "2nd century BCE-6th century CE",
    category: "UNESCO World Heritage",
    description: "Rock-cut cave monuments featuring masterpieces of Buddhist religious art.",
    image: "/placeholder.svg?height=400&width=600",
    endangered: false,
  },
  {
    id: "khajuraho",
    name: "Khajuraho Temples",
    location: "Madhya Pradesh",
    period: "950-1050 CE",
    category: "UNESCO World Heritage",
    description: "Medieval Hindu and Jain temples famous for their nagara-style architectural symbolism.",
    image: "/placeholder.svg?height=400&width=600",
    endangered: false,
  },
  {
    id: "konark",
    name: "Konark Sun Temple",
    location: "Odisha",
    period: "13th century",
    category: "UNESCO World Heritage",
    description: "13th-century Sun Temple known for its intricate stone carvings and architectural grandeur.",
    image: "/placeholder.svg?height=400&width=600",
    endangered: true,
  },
  {
    id: "rani-ki-vav",
    name: "Rani ki Vav",
    location: "Gujarat",
    period: "11th century",
    category: "Stepwell",
    description: "Intricately constructed stepwell built as a memorial to a king in the 11th century.",
    image: "/placeholder.svg?height=400&width=600",
    endangered: false,
  },
  {
    id: "ellora",
    name: "Ellora Caves",
    location: "Maharashtra",
    period: "6th-10th century CE",
    category: "Rock-cut Architecture",
    description: "A complex of cave temples dedicated to Buddhism, Hinduism and Jainism.",
    image: "/placeholder.svg?height=400&width=600",
    endangered: false,
  },
  {
    id: "mahabalipuram",
    name: "Mahabalipuram",
    location: "Tamil Nadu",
    period: "7th-8th century CE",
    category: "Coastal Temples",
    description: "Group of monuments with over 400 ancient structures including the famous Shore Temple.",
    image: "/placeholder.svg?height=400&width=600",
    endangered: true,
  },
  {
    id: "kailasa-temple",
    name: "Kailasa Temple",
    location: "Maharashtra",
    period: "8th century CE",
    category: "Rock-cut Architecture",
    description: "Massive rock-cut temple dedicated to Lord Shiva, carved out of a single rock.",
    image: "/placeholder.svg?height=400&width=600",
    endangered: false,
  },
]

export default function MonumentsList() {
  const [visibleMonuments, setVisibleMonuments] = useState(monuments)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
    >
      {visibleMonuments.map((monument) => (
        <motion.div
          key={monument.id}
          variants={item}
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
        >
          <div className="relative">
            <div className="relative h-56 overflow-hidden">
              <Image
                src={monument.image || "/placeholder.svg"}
                alt={monument.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            {monument.endangered && (
              <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Endangered
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-amber-700/80 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {monument.location}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold text-amber-900 mb-1">{monument.name}</h3>
            <p className="text-amber-600 text-sm mb-3">
              {monument.period} • {monument.category}
            </p>
            <p className="text-amber-700 mb-4 line-clamp-2">{monument.description}</p>

            <div className="flex space-x-2">
              <Link href={`/monuments/${monument.id}`} className="flex-1">
                <Button variant="default" className="w-full bg-amber-600 hover:bg-amber-700">
                  <Eye className="mr-2 h-4 w-4" /> View in 3D
                </Button>
              </Link>
              <Link href={`/monuments/${monument.id}/info`} className="flex-1">
                <Button variant="outline" className="w-full border-amber-600 text-amber-700 hover:bg-amber-50">
                  <Info className="mr-2 h-4 w-4" /> Details
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
