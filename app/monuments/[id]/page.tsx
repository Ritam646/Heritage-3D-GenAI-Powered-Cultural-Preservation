import type { Metadata } from "next"
import { notFound } from "next/navigation"
import MonumentViewer from "@/components/monument-viewer"
import MonumentInfo from "@/components/monument-info"

// This would typically come from a database or API
const getMonument = (id: string) => {
  const monuments = {
    hampi: {
      id: "hampi",
      name: "Hampi Ruins",
      location: "Karnataka",
      period: "14th-16th century",
      category: "UNESCO World Heritage",
      description:
        "The ruins of Hampi represent the remnants of the capital city of the Vijayanagara Empire, which was one of the greatest Hindu kingdoms. The site encompasses an area of 4,187 hectares and includes more than 1,600 surviving remains of the last great Hindu kingdom in South India, including forts, temples, shrines, pillared halls, and more.",
      image: "/placeholder.svg?height=600&width=800",
      modelPath: "/assets/3d/duck.glb", // Using the sample duck model for demonstration
      endangered: true,
      facts: [
        "Hampi was the second-largest medieval-era city after Beijing",
        "The site contains over 1,600 surviving remains",
        "It was declared a UNESCO World Heritage Site in 1986",
        "The Virupaksha Temple is still in active worship",
        "The Stone Chariot is one of India's most iconic monuments",
      ],
    },
    ajanta: {
      id: "ajanta",
      name: "Ajanta Caves",
      location: "Maharashtra",
      period: "2nd century BCE-6th century CE",
      category: "UNESCO World Heritage",
      description:
        "The Ajanta Caves are approximately 30 rock-cut Buddhist cave monuments dating from the 2nd century BCE to about 480 CE. The caves include paintings and rock-cut sculptures described as among the finest surviving examples of ancient Indian art, particularly expressive paintings that present emotions through gesture, pose and form.",
      image: "/placeholder.svg?height=600&width=800",
      modelPath: "/assets/3d/duck.glb", // Using the sample duck model for demonstration
      endangered: false,
      facts: [
        "The caves were accidentally discovered by a British officer in 1819",
        "The paintings depict the Jataka tales (Buddhist literature)",
        "Natural pigments were used for the paintings",
        "The caves were built in two phases, separated by about 400 years",
        "They were abandoned around 480 CE after the decline of Buddhism in India",
      ],
    },
    mahabalipuram: {
      id: "mahabalipuram",
      name: "Mahabalipuram",
      location: "Tamil Nadu",
      period: "7th-8th century CE",
      category: "UNESCO World Heritage",
      description:
        "Mahabalipuram, also known as Mamallapuram, is a historic city and UNESCO World Heritage Site known for its monuments built by the Pallava dynasty. The group of monuments includes the famous Shore Temple, rathas (chariot-shaped temples), mandapas (cave sanctuaries), and giant open-air rock reliefs such as the famous 'Descent of the Ganges'.",
      image: "/placeholder.svg?height=600&width=800",
      modelPath: "/assets/3d/duck.glb", // Using the sample duck model for demonstration
      endangered: true,
      facts: [
        "The monuments were carved from large blocks of granite during the 7th and 8th centuries",
        "The Shore Temple is one of the oldest structural stone temples of South India",
        "The site features the world's largest bas-relief: 'Descent of the Ganges' or 'Arjuna's Penance'",
        "It was a bustling seaport during the Pallava dynasty",
        "The 2004 tsunami revealed previously undiscovered shore temples",
      ],
    },
    khajuraho: {
      id: "khajuraho",
      name: "Khajuraho Temples",
      location: "Madhya Pradesh",
      period: "950-1050 CE",
      category: "UNESCO World Heritage",
      description:
        "The Khajuraho Group of Monuments is a group of Hindu and Jain temples famous for their nagara-style architectural symbolism and erotic sculptures. Built by the Chandela dynasty between 950 and 1050 CE, these temples represent one of the finest examples of medieval Indian art and architecture.",
      image: "/placeholder.svg?height=600&width=800",
      modelPath: "/assets/3d/duck.glb", // Using the sample duck model for demonstration
      endangered: false,
      facts: [
        "Originally there were over 85 temples, but only about 25 have survived",
        "The temples are divided into three groups: Western, Eastern, and Southern",
        "They were rediscovered in the late 19th century by British engineer T.S. Burt",
        "The Kandariya Mahadeva Temple is the largest and most ornate temple in the complex",
        "The temples feature over 2,000 statues and relief carvings",
      ],
    },
    konark: {
      id: "konark",
      name: "Konark Sun Temple",
      location: "Odisha",
      period: "13th century",
      category: "UNESCO World Heritage",
      description:
        "The Konark Sun Temple is a 13th-century CE sun temple at Konark, Odisha, India. Dedicated to the Hindu sun god Surya, it is one of the most renowned temples in India and is known for its exquisite stone carvings and architectural grandeur. The temple is designed in the form of a colossal chariot with 12 pairs of elaborately carved wheels pulled by seven horses.",
      image: "/placeholder.svg?height=600&width=800",
      modelPath: "/assets/3d/duck.glb", // Using the sample duck model for demonstration
      endangered: true,
      facts: [
        "The temple was built by King Narasimhadeva I of the Eastern Ganga Dynasty",
        "The temple's 24 wheels are actually sundials that can accurately tell the time",
        "The seven horses represent the seven days of the week",
        "The temple's main tower collapsed in the 19th century",
        "It is also known as the 'Black Pagoda' due to its dark appearance to sailors",
      ],
    },
    ellora: {
      id: "ellora",
      name: "Ellora Caves",
      location: "Maharashtra",
      period: "6th-10th century CE",
      category: "Rock-cut Architecture",
      description:
        "The Ellora Caves are a UNESCO World Heritage Site located in the Aurangabad district of Maharashtra, India. It is one of the largest rock-cut monastery-temple cave complexes in the world, featuring Hindu, Buddhist and Jain monuments and artwork dating from the 600-1000 CE period.",
      image: "/placeholder.svg?height=600&width=800",
      modelPath: "/assets/3d/duck.glb", // Using the sample duck model for demonstration
      endangered: false,
      facts: [
        "The site features 34 caves - 17 Hindu, 12 Buddhist, and 5 Jain caves",
        "Cave 16, the Kailasa Temple, is the largest single monolithic rock excavation in the world",
        "The Kailasa Temple was carved out of a single rock, from top to bottom",
        "It took over 100 years to complete the entire cave complex",
        "The caves demonstrate the religious harmony prevalent during that period",
      ],
    },
    // Add more monuments as needed
  }

  return monuments[id as keyof typeof monuments]
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const monument = getMonument(params.id)

  if (!monument) {
    return {
      title: "Monument Not Found | Heritage 3D",
    }
  }

  return {
    title: `${monument.name} | Heritage 3D`,
    description: `Explore a 3D model of ${monument.name}, ${monument.description.substring(0, 100)}...`,
  }
}

export default function MonumentPage({ params }: { params: { id: string } }) {
  const monument = getMonument(params.id)

  if (!monument) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">{monument.name}</h1>
        <p className="text-amber-700 mb-8">
          {monument.location} • {monument.period}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MonumentViewer monument={monument} />
          </div>

          <div>
            <MonumentInfo monument={monument} />
          </div>
        </div>
      </div>
    </main>
  )
}
