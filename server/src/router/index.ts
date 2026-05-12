import { Router } from "express"
import profilesRouter from "./profiles"
import projectsRouter from "./projects"
import proposalsRouter from "./proposals"
import contractsRouter from "./contracts"
import reviewsRouter from "./reviews"
import conversationsRouter from "./conversation"

const apiRouter = Router()

// Tanto Contractors como Freelancers usan el mismo router de perfiles
// profiles/freelancers
// profiles/contractors
apiRouter.use("/profiles", profilesRouter)

apiRouter.use("/projects", projectsRouter)
apiRouter.use("/proposals", proposalsRouter)
apiRouter.use("/contracts", contractsRouter)
apiRouter.use("/reviews", reviewsRouter)
apiRouter.use("/conversations", conversationsRouter)

export default apiRouter
