import "dotenv/config"
import { db } from "./database"
import { skill } from "./schema/profiles"
import { randomUUID } from "node:crypto"

const skillSeeds = [
  // Frontend
  { name: "React", category: "Frontend" },
  { name: "Vue.js", category: "Frontend" },
  { name: "Angular", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "HTML/CSS", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },

  // Backend
  { name: "Node.js", category: "Backend" },
  { name: "Express.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "Django", category: "Backend" },
  { name: "FastAPI", category: "Backend" },
  { name: "PHP", category: "Backend" },
  { name: "Laravel", category: "Backend" },
  { name: "Java", category: "Backend" },
  { name: "Spring Boot", category: "Backend" },
  { name: "Go", category: "Backend" },
  { name: "Ruby on Rails", category: "Backend" },

  // Mobile
  { name: "React Native", category: "Mobile" },
  { name: "Flutter", category: "Mobile" },
  { name: "Swift", category: "Mobile" },
  { name: "Kotlin", category: "Mobile" },

  // Base de datos
  { name: "PostgreSQL", category: "Base de datos" },
  { name: "MySQL", category: "Base de datos" },
  { name: "MongoDB", category: "Base de datos" },
  { name: "Redis", category: "Base de datos" },
  { name: "SQLite", category: "Base de datos" },

  // DevOps
  { name: "Docker", category: "DevOps" },
  { name: "Kubernetes", category: "DevOps" },
  { name: "AWS", category: "DevOps" },
  { name: "Google Cloud", category: "DevOps" },
  { name: "Azure", category: "DevOps" },
  { name: "CI/CD", category: "DevOps" },
  { name: "Linux", category: "DevOps" },

  // Diseño
  { name: "UI/UX Design", category: "Diseño" },
  { name: "Figma", category: "Diseño" },
  { name: "Adobe XD", category: "Diseño" },
  { name: "Photoshop", category: "Diseño" },
  { name: "Illustrator", category: "Diseño" },

  // Datos / IA
  { name: "Machine Learning", category: "Datos / IA" },
  { name: "Data Analysis", category: "Datos / IA" },
  { name: "TensorFlow", category: "Datos / IA" },
  { name: "PyTorch", category: "Datos / IA" },
  { name: "SQL", category: "Datos / IA" },

  // Marketing
  { name: "SEO", category: "Marketing" },
  { name: "Google Ads", category: "Marketing" },
  { name: "Social Media", category: "Marketing" },
  { name: "Email Marketing", category: "Marketing" },
  { name: "Copywriting", category: "Marketing" },

  // Otros
  { name: "WordPress", category: "Otros" },
  { name: "Shopify", category: "Otros" },
  { name: "Blockchain", category: "Otros" },
  { name: "Testing / QA", category: "Otros" },
  { name: "Scrum / Agile", category: "Otros" },
]

async function seed() {
  console.log("🌱 Seeding skills...")
  try {
    const dataToInsert = skillSeeds.map((s) => ({
      id: randomUUID(),
      name: s.name,
      category: s.category,
    }))

    await db.insert(skill).values(dataToInsert).onConflictDoNothing()
    console.log("✅ Skills seeded successfully!")
  } catch (error) {
    console.error("❌ Error seeding skills:", error)
    process.exit(1)
  }
}

seed()
