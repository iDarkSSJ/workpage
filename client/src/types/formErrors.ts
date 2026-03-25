// tipos y valores iniciales de los formularios

// -------------- PROFILE -----------------

// freelancer
export type FreelancerFormErrors = {
  category: string
  hourlyRate: string
  country: string
  bio: string
  linkedinUrl: string
  githubUrl: string
  websiteUrl: string
}

export const FL_INITIAL_ERRORS: FreelancerFormErrors = {
  category: "",
  hourlyRate: "",
  country: "",
  bio: "",
  linkedinUrl: "",
  githubUrl: "",
  websiteUrl: "",
}

// contractor
export type ContractorFormErrors = {
  companyName: string
  bio: string
  country: string
  websiteUrl: string
}

export const CT_INITIAL_ERRORS: ContractorFormErrors = {
  companyName: "",
  bio: "",
  country: "",
  websiteUrl: "",
}

// certifications
export type CertificationsFormErrors = {
  name: string
  institution: string
  issuedDate: string
  url: string
}

export const CERT_INITIAL_ERRORS: CertificationsFormErrors = {
  name: "",
  institution: "",
  issuedDate: "",
  url: "",
}

// experience
export type ExperienceFormErrors = {
  title: string
  company: string
  startDate: string
  endDate: string
  description: string
}

export const EXP_INITIAL_ERRORS: ExperienceFormErrors = {
  title: "",
  company: "",
  startDate: "",
  endDate: "",
  description: "",
}

// portfolio
export type PortfolioFormErrors = {
  title: string
  description: string
  projectUrl: string
  imageUrl: string
}

export const PORT_INITIAL_ERRORS: PortfolioFormErrors = {
  title: "",
  description: "",
  projectUrl: "",
  imageUrl: "",
}

// -------------- PROJECT -----------------

// NEW PROJECT
export type ProjectErrors = {
  title: string
  description: string
}

export const PROJECT_INITIAL_ERRORS: ProjectErrors = {
  title: "",
  description: "",
}
