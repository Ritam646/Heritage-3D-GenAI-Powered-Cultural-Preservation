"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, Globe } from "lucide-react"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Monuments", href: "/monuments" },
  { name: "About", href: "/about" },
  { name: "Technology", href: "/technology" },
  { name: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mr-2">
              <span className="text-white font-bold text-lg">3D</span>
            </div>
            <span className={`font-bold text-xl ${isScrolled ? "text-amber-900" : "text-white"}`}>Heritage 3D</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? isScrolled
                      ? "bg-amber-100 text-amber-900"
                      : "bg-white/20 text-white"
                    : isScrolled
                      ? "text-amber-800 hover:bg-amber-50"
                      : "text-white/90 hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button
              variant={isScrolled ? "default" : "outline"}
              className={
                isScrolled
                  ? "bg-amber-600 hover:bg-amber-700 ml-2"
                  : "border-white/30 text-white hover:bg-white/20 ml-2"
              }
            >
              <Globe className="mr-2 h-4 w-4" />
              Language
            </Button>
          </nav>

          {/* Mobile navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={isScrolled ? "text-amber-900" : "text-white"}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-gradient-to-b from-amber-50 to-orange-50">
                <div className="flex items-center justify-between mb-8">
                  <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mr-2">
                      <span className="text-white font-bold text-lg">3D</span>
                    </div>
                    <span className="font-bold text-xl text-amber-900">Heritage 3D</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-6 w-6 text-amber-900" />
                  </Button>
                </div>
                <nav className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        pathname === item.href ? "bg-amber-100 text-amber-900" : "text-amber-800 hover:bg-amber-50"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Button className="bg-amber-600 hover:bg-amber-700 mt-4">
                    <Globe className="mr-2 h-4 w-4" />
                    Language
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
