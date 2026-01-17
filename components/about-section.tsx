"use client"

import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"

export default function AboutSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div ref={ref} className="py-16 bg-amber-50 rounded-3xl my-16 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-200 rounded-full opacity-50"></div>
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-orange-200 rounded-full opacity-40"></div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-amber-900 mb-6">Our Mission</h2>
            <p className="text-lg text-amber-800 mb-6">
              Heritage 3D leverages cutting-edge Generative AI technology to create detailed 3D models of endangered and
              lesser-known Indian heritage sites from simple text prompts.
            </p>
            <p className="text-lg text-amber-800 mb-6">
              Our mission is to digitally preserve India's cultural heritage while making it accessible to everyone,
              especially in rural areas with limited physical access to these sites.
            </p>
            <div className="bg-white p-4 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-amber-900 mb-2">How It Works:</h3>
              <ol className="list-decimal list-inside text-amber-800 space-y-2">
                <li>We use pre-trained text-to-3D models like Stable Diffusion 3D</li>
                <li>Models are generated from detailed text prompts</li>
                <li>Expert refinement in Blender ensures accuracy and detail</li>
                <li>Educational content is added in multiple languages</li>
              </ol>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-1 rounded-2xl shadow-lg">
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-2xl font-bold text-amber-900 mb-4">Impact</h3>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-amber-100 rounded-full p-2 mr-4 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-amber-700"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900">Digital Preservation</h4>
                      <p className="text-amber-700">Creating permanent digital records of monuments at risk</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-amber-100 rounded-full p-2 mr-4 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-amber-700"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900">Educational Access</h4>
                      <p className="text-amber-700">Bringing cultural heritage to classrooms across India</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-amber-100 rounded-full p-2 mr-4 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-amber-700"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900">Tourism Support</h4>
                      <p className="text-amber-700">Promoting lesser-known sites and boosting tourism</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-amber-100 rounded-full p-2 mr-4 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-amber-700"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900">Future Expansion</h4>
                      <p className="text-amber-700">Potential for VR/AR integration and more monuments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
