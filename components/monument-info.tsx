"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, History, MapPin, Calendar, Tag, AlertTriangle, Share2, Download, Globe } from "lucide-react"

export default function MonumentInfo({ monument }: { monument: any }) {
  const [language, setLanguage] = useState<"en" | "hi">("en")

  const content = {
    en: {
      description: monument.description,
      location: "Location",
      period: "Time Period",
      category: "Category",
      endangered: "Conservation Status",
      endangeredStatus: monument.endangered ? "Endangered" : "Well Preserved",
      facts: "Interesting Facts",
      share: "Share",
      download: "Download 3D Model",
      about: "About",
      history: "History",
      architecture: "Architecture",
    },
    hi: {
      description:
        "यह स्थल विजयनगर साम्राज्य की राजधानी शहर के अवशेषों का प्रतिनिधित्व करता है, जो सबसे महान हिंदू राज्यों में से एक था। इस स्थल में 4,187 हेक्टेयर का क्षेत्र शामिल है और इसमें दक्षिण भारत के अंतिम महान हिंदू राज्य के 1,600 से अधिक जीवित अवशेष शामिल हैं, जिनमें किले, मंदिर, मंदिर, स्तंभित हॉल और बहुत कुछ शामिल हैं।",
      location: "स्थान",
      period: "समय अवधि",
      category: "श्रेणी",
      endangered: "संरक्षण स्थिति",
      endangeredStatus: monument.endangered ? "खतरे में" : "अच्छी तरह से संरक्षित",
      facts: "रोचक तथ्य",
      share: "साझा करें",
      download: "3D मॉडल डाउनलोड करें",
      about: "परिचय",
      history: "इतिहास",
      architecture: "वास्तुकला",
    },
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image src={monument.image || "/placeholder.svg"} alt={monument.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            >
              <Globe className="mr-2 h-4 w-4" />
              {language === "en" ? "हिंदी" : "English"}
            </Button>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="about" className="p-4">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="about" className="text-amber-800">
            <Info className="h-4 w-4 mr-2" />
            {content[language].about}
          </TabsTrigger>
          <TabsTrigger value="history" className="text-amber-800">
            <History className="h-4 w-4 mr-2" />
            {content[language].history}
          </TabsTrigger>
          <TabsTrigger value="architecture" className="text-amber-800">
            <Tag className="h-4 w-4 mr-2" />
            {content[language].architecture}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-4">
          <p className="text-amber-800">{content[language].description}</p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-amber-600">{content[language].location}</p>
                <p className="font-medium text-amber-900">{monument.location}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-amber-600">{content[language].period}</p>
                <p className="font-medium text-amber-900">{monument.period}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Tag className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-amber-600">{content[language].category}</p>
                <p className="font-medium text-amber-900">{monument.category}</p>
              </div>
            </div>

            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-amber-600">{content[language].endangered}</p>
                <p className={`font-medium ${monument.endangered ? "text-red-600" : "text-green-600"}`}>
                  {content[language].endangeredStatus}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-amber-900 mb-2">{content[language].facts}</h3>
            <ul className="space-y-2">
              {monument.facts.map((fact: string, index: number) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-amber-800 text-xs font-medium">{index + 1}</span>
                  </div>
                  <span className="text-amber-800">{fact}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            <p className="text-amber-800">
              The ruins of Hampi represent the remnants of the capital city of the Vijayanagara Empire. Founded in 1336
              by the brothers Harihara and Bukka Raya of the Sangama dynasty, it became one of the richest and largest
              cities in the world during its prime.
            </p>
            <p className="text-amber-800">
              The city reached its peak under the rule of Krishnadevaraya (1509-1529), when it controlled most of
              Southern India. The empire's wealth came from trade, agriculture, and control over the spice routes.
            </p>
            <p className="text-amber-800">
              In 1565, the city was captured and destroyed by a coalition of Deccan sultanates after the Battle of
              Talikota, leading to the collapse of the Vijayanagara Empire. The site was abandoned and fell into ruin,
              remaining largely untouched until rediscovery in the 19th century.
            </p>
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <h4 className="font-semibold text-amber-900 mb-2">Timeline</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="font-medium text-amber-800 w-24">1336</span>
                  <span className="text-amber-700">Foundation of Vijayanagara Empire</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium text-amber-800 w-24">1509-1529</span>
                  <span className="text-amber-700">Golden Age under Krishnadevaraya</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium text-amber-800 w-24">1565</span>
                  <span className="text-amber-700">Battle of Talikota and destruction</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium text-amber-800 w-24">1800s</span>
                  <span className="text-amber-700">Rediscovery by British archaeologists</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium text-amber-800 w-24">1986</span>
                  <span className="text-amber-700">UNESCO World Heritage Site designation</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="architecture">
          <div className="space-y-4">
            <p className="text-amber-800">
              The architectural style of Hampi represents the culmination of the Dravidian style of architecture that
              developed in southern India. The site contains numerous temples, palaces, aquatic structures,
              fortifications, and more.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <h4 className="font-semibold text-amber-900 mb-2">Temple Architecture</h4>
                <p className="text-amber-700 text-sm">
                  The temples feature towering gopurams (entrance towers), mandapas (pillared halls), and intricate
                  stone carvings depicting Hindu mythology, daily life, and royal processions.
                </p>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <h4 className="font-semibold text-amber-900 mb-2">Secular Structures</h4>
                <p className="text-amber-700 text-sm">
                  The royal enclosure contains audience halls, stepped tanks, and the famous "Mahanavami Dibba" platform
                  used for ceremonial functions and royal appearances.
                </p>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <h4 className="font-semibold text-amber-900 mb-2">Water Systems</h4>
                <p className="text-amber-700 text-sm">
                  Advanced aqueducts, canals, and stepped tanks demonstrate sophisticated water management systems that
                  supported the large population.
                </p>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <h4 className="font-semibold text-amber-900 mb-2">Stone Craftsmanship</h4>
                <p className="text-amber-700 text-sm">
                  The site is renowned for its monolithic sculptures, including the Narasimha statue, the Sasivekalu
                  Ganesha, and the iconic Stone Chariot at the Vittala Temple.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-amber-900 mb-2">Key Structures</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-amber-800 text-xs">1</span>
                  </div>
                  <div>
                    <span className="font-medium text-amber-900">Virupaksha Temple</span>
                    <p className="text-sm text-amber-700">
                      The only temple still in active worship, dedicated to Lord Shiva
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-amber-800 text-xs">2</span>
                  </div>
                  <div>
                    <span className="font-medium text-amber-900">Vittala Temple</span>
                    <p className="text-sm text-amber-700">Famous for its stone chariot and musical pillars</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-amber-800 text-xs">3</span>
                  </div>
                  <div>
                    <span className="font-medium text-amber-900">Lotus Mahal</span>
                    <p className="text-sm text-amber-700">A unique blend of Hindu and Islamic architectural styles</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
