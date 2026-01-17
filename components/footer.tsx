import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">3D</span>
              </div>
              <span className="font-bold text-xl text-white">Heritage 3D</span>
            </Link>
            <p className="text-amber-200 mb-4">
              Preserving India's cultural heritage through GenAI-powered 3D models for education and digital
              conservation.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-amber-200 hover:text-white hover:bg-amber-800">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-amber-200 hover:text-white hover:bg-amber-800">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-amber-200 hover:text-white hover:bg-amber-800">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-amber-200 hover:text-white hover:bg-amber-800">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-amber-200 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/monuments" className="text-amber-200 hover:text-white transition-colors">
                  Monuments
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-amber-200 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/technology" className="text-amber-200 hover:text-white transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-amber-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-amber-200 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/research" className="text-amber-200 hover:text-white transition-colors">
                  Research
                </Link>
              </li>
              <li>
                <Link href="/education" className="text-amber-200 hover:text-white transition-colors">
                  Educational Resources
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-amber-200 hover:text-white transition-colors">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-amber-200 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Subscribe</h3>
            <p className="text-amber-200 mb-4">Stay updated with our latest 3D models and educational content.</p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-amber-800/50 border-amber-700 text-white placeholder:text-amber-300 focus-visible:ring-amber-500"
              />
              <Button className="bg-amber-500 hover:bg-amber-600 text-amber-950">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-amber-300 text-sm">© {new Date().getFullYear()} Heritage 3D. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-amber-300 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-amber-300 hover:text-white text-sm">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="text-amber-300 hover:text-white text-sm">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
