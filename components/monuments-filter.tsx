"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, Filter, X } from "lucide-react"

export default function MonumentsFilter() {
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
          <Input
            type="text"
            placeholder="Search monuments..."
            className="pl-10 border-amber-200 focus:border-amber-500 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          className="border-amber-500 text-amber-700"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? <X className="mr-2 h-4 w-4" /> : <Filter className="mr-2 h-4 w-4" />}
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-amber-100">
          <div>
            <Label htmlFor="location" className="text-amber-800 mb-2 block">
              Location
            </Label>
            <Select>
              <SelectTrigger id="location" className="border-amber-200">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                <SelectItem value="odisha">Odisha</SelectItem>
                <SelectItem value="gujarat">Gujarat</SelectItem>
                <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category" className="text-amber-800 mb-2 block">
              Category
            </Label>
            <Select>
              <SelectTrigger id="category" className="border-amber-200">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="unesco">UNESCO World Heritage</SelectItem>
                <SelectItem value="temple">Temples</SelectItem>
                <SelectItem value="fort">Forts</SelectItem>
                <SelectItem value="cave">Cave Architecture</SelectItem>
                <SelectItem value="stepwell">Stepwells</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="period" className="text-amber-800 mb-2 block">
              Time Period
            </Label>
            <Select>
              <SelectTrigger id="period" className="border-amber-200">
                <SelectValue placeholder="All Periods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Periods</SelectItem>
                <SelectItem value="ancient">Ancient (Before 500 CE)</SelectItem>
                <SelectItem value="medieval">Medieval (500-1500 CE)</SelectItem>
                <SelectItem value="modern">Modern (After 1500 CE)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="endangered" className="text-amber-600 border-amber-300" />
            <Label htmlFor="endangered" className="text-amber-800">
              Show only endangered monuments
            </Label>
          </div>
        </div>
      )}
    </div>
  )
}
