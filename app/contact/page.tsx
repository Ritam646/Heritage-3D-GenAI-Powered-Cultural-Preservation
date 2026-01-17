import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact | Heritage 3D",
  description: "Get in touch with the Heritage 3D team for partnerships, educational resources, or general inquiries",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">Contact Us</h1>
          <p className="text-lg text-amber-800 max-w-3xl mx-auto">
            Have questions about Heritage 3D? Interested in partnerships or educational resources? We'd love to hear
            from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">Email Us</h3>
            <p className="text-amber-700 mb-4">For general inquiries, partnerships, or technical support</p>
            <a href="mailto:info@heritage3d.org" className="text-amber-600 hover:text-amber-800 font-medium">
              info@heritage3d.org
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">Call Us</h3>
            <p className="text-amber-700 mb-4">Available Monday to Friday, 9:00 AM to 5:00 PM IST</p>
            <a href="tel:+919876543210" className="text-amber-600 hover:text-amber-800 font-medium">
              +91 98765 43210
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">Visit Us</h3>
            <p className="text-amber-700 mb-4">Our office is located in the heart of New Delhi</p>
            <address className="text-amber-600 not-italic">
              Heritage 3D, 123 Cultural Lane
              <br />
              New Delhi, 110001
              <br />
              India
            </address>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">Send Us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-amber-800">
                    Full Name
                  </Label>
                  <Input id="name" placeholder="Your name" className="border-amber-200 focus:border-amber-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-amber-800">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    className="border-amber-200 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-amber-800">
                  Subject
                </Label>
                <Select>
                  <SelectTrigger id="subject" className="border-amber-200">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                    <SelectItem value="education">Educational Resources</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-amber-800">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Your message"
                  rows={5}
                  className="border-amber-200 focus:border-amber-500"
                />
              </div>

              <Button className="bg-amber-700 hover:bg-amber-800 text-white w-full">
                <Send className="mr-2 h-4 w-4" /> Send Message
              </Button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-amber-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-amber-900 mb-2">How can I use Heritage 3D in my classroom?</h3>
                <p className="text-amber-700">
                  We offer educational resources and lesson plans for teachers. You can access our 3D models online or
                  request offline materials for areas with limited internet connectivity.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-amber-900 mb-2">
                  Can I suggest a monument to be added to your collection?
                </h3>
                <p className="text-amber-700">
                  We welcome suggestions for monuments to add to our collection, especially lesser-known or endangered
                  sites. Please use our contact form to submit your suggestions.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-amber-900 mb-2">Are your 3D models available for download?</h3>
                <p className="text-amber-700">
                  Yes, we offer downloads for educational purposes. Please contact us with details about your intended
                  use, and we'll provide the appropriate files and licensing information.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-amber-900 mb-2">How can I support Heritage 3D's mission?</h3>
                <p className="text-amber-700">
                  You can support us through donations, partnerships, volunteering your expertise, or simply by sharing
                  our resources with your network to increase awareness.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Join Our Newsletter</h2>
          <p className="text-amber-800 mb-6 max-w-2xl mx-auto">
            Stay updated with our latest 3D models, educational resources, and events. We send monthly updates and never
            share your email with third parties.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Your email address" type="email" className="border-amber-200 focus:border-amber-500" />
            <Button className="bg-amber-700 hover:bg-amber-800 text-white whitespace-nowrap">Subscribe</Button>
          </div>
        </div>
      </div>
    </main>
  )
}
