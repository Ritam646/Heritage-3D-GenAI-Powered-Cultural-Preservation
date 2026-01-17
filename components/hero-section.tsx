"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Globe } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function HeroSection() {
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const content = {
    en: {
      title: "Discover India's Heritage in 3D",
      subtitle: "Explore ancient monuments through interactive 3D models powered by AI",
      cta: "Start Exploring",
      search: "Search monuments...",
    },
    hi: {
      title: "भारत की विरासत को 3D में खोजें",
      subtitle: "AI द्वारा संचालित इंटरैक्टिव 3D मॉडल के माध्यम से प्राचीन स्मारकों का अन्वेषण करें",
      cta: "अन्वेषण शुरू करें",
      search: "स्मारकों की खोज करें...",
    },
  }

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en")
  }

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-r from-amber-800 to-orange-700">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5,
              transform: `scale(${Math.random() * 0.5 + 0.5})`,
              animation: `float ${Math.random() * 10 + 15}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="absolute top-4 right-4">
          <Button
            onClick={toggleLanguage}
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Globe className="mr-2 h-4 w-4" />
            {language === "en" ? "हिंदी" : "English"}
          </Button>
        </div>

        <div className="max-w-4xl mx-auto text-center" ref={ref}>
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {content[language].title}
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-amber-100 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {content[language].subtitle}
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
              <input
                type="text"
                placeholder={content[language].search}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <Link href="/monuments">
              <Button className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-amber-950 px-6 py-3 rounded-lg text-lg">
                {content[language].cta}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
