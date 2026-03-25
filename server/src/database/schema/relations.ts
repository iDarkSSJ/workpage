import { relations } from "drizzle-orm"
import { user } from "../auth-schema"
import {
  freelancerProfile,
  contractorProfile,
  freelancerSkill,
  freelancerExperience,
  freelancerCertification,
  featuredProject,
  skill,
} from "./profiles"
import { project, projectSkill, proposal, contract } from "./projects"
import { review } from "./reviews"
import { conversation, message } from "./chat"

// Perfil del freelancer -> todo lo que le pertenece
export const freelancerProfileRelations = relations(
  freelancerProfile,
  ({ one, many }) => ({
    user: one(user, {
      fields: [freelancerProfile.userId],
      references: [user.id],
    }),
    skills: many(freelancerSkill),
    experiences: many(freelancerExperience),
    certifications: many(freelancerCertification),
    featuredProjects: many(featuredProject),
    proposals: many(proposal),
    contracts: many(contract),
  }),
)

// Perfil del contratante -> sus proyectos y contratos
export const contractorProfileRelations = relations(
  contractorProfile,
  ({ one, many }) => ({
    user: one(user, {
      fields: [contractorProfile.userId],
      references: [user.id],
    }),
    projects: many(project),
    contracts: many(contract),
  }),
)

// Proyecto -> propuestas, skills requeridas y conversaciones
export const projectRelations = relations(project, ({ one, many }) => ({
  contractor: one(contractorProfile, {
    fields: [project.contractorId],
    references: [contractorProfile.id],
  }),
  skills: many(projectSkill),
  proposals: many(proposal),
  contracts: many(contract),
  conversations: many(conversation),
}))

// Proyecto -> skills requeridas
export const projectSkillRelations = relations(projectSkill, ({ one }) => ({
  project: one(project, {
    fields: [projectSkill.projectId],
    references: [project.id],
  }),
  skill: one(skill, {
    fields: [projectSkill.skillId],
    references: [skill.id],
  }),
}))

// FreelancerSkill -> freelancer y skill
export const freelancerSkillRelations = relations(
  freelancerSkill,
  ({ one }) => ({
    freelancer: one(freelancerProfile, {
      fields: [freelancerSkill.freelancerId],
      references: [freelancerProfile.id],
    }),
    skill: one(skill, {
      fields: [freelancerSkill.skillId],
      references: [skill.id],
    }),
  }),
)

export const proposalRelations = relations(proposal, ({ one, many }) => ({
  project: one(project, {
    fields: [proposal.projectId],
    references: [project.id],
  }),
  freelancer: one(freelancerProfile, {
    fields: [proposal.freelancerId],
    references: [freelancerProfile.id],
  }),
  contracts: one(contract),
}))

// Contrato -> reviews generados al completarse
export const contractRelations = relations(contract, ({ one, many }) => ({
  proposal: one(proposal, {
    fields: [contract.proposalId],
    references: [proposal.id],
  }),
  project: one(project, {
    fields: [contract.projectId],
    references: [project.id],
  }),
  contractor: one(contractorProfile, {
    fields: [contract.contractorId],
    references: [contractorProfile.id],
  }),
  freelancer: one(freelancerProfile, {
    fields: [contract.freelancerId],
    references: [freelancerProfile.id],
  }),
  reviews: many(review),
}))

// Conversación -> sus mensajes y participantes
export const conversationRelations = relations(
  conversation,
  ({ one, many }) => ({
    project: one(project, {
      fields: [conversation.projectId],
      references: [project.id],
    }),
    participantA: one(user, {
      fields: [conversation.participantAId],
      references: [user.id],
      relationName: "participantA",
    }),
    participantB: one(user, {
      fields: [conversation.participantBId],
      references: [user.id],
      relationName: "participantB",
    }),
    messages: many(message),
  }),
)

// Review -> quien la hizo (reviewer) y quien la recibió (reviewee), ambos son users
export const reviewRelations = relations(review, ({ one }) => ({
  contract: one(contract, {
    fields: [review.contractId],
    references: [contract.id],
  }),
  reviewer: one(user, {
    fields: [review.reviewerId],
    references: [user.id],
    relationName: "reviewer",
  }),
  reviewee: one(user, {
    fields: [review.revieweeId],
    references: [user.id],
    relationName: "reviewee",
  }),
}))

export const freelancerExperienceRelations = relations(
  freelancerExperience,
  ({ one }) => ({
    freelancer: one(freelancerProfile, {
      fields: [freelancerExperience.freelancerId],
      references: [freelancerProfile.id],
    }),
  }),
)

export const freelancerCertificationRelations = relations(
  freelancerCertification,
  ({ one }) => ({
    freelancer: one(freelancerProfile, {
      fields: [freelancerCertification.freelancerId],
      references: [freelancerProfile.id],
    }),
  }),
)

export const featuredProjectRelations = relations(
  featuredProject,
  ({ one }) => ({
    freelancer: one(freelancerProfile, {
      fields: [featuredProject.freelancerId],
      references: [freelancerProfile.id],
    }),
  }),
)
