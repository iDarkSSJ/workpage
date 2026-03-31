import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import { BrowserRouter, Route, Routes } from "react-router"
import RegisterPage from "./pages/RegisterPage.tsx"
import LoginPage from "./pages/LoginPage.tsx"
import { Toaster } from "react-hot-toast"
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx"
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx"
import { LoadingProvider } from "./context/LoadingContext.tsx"
import AppLoader from "./components/AppLoader.tsx"
import { AuthProvider } from "./context/AuthContext.tsx"
import ProtectedLayout from "./pages/Protected/ProtectedLayout.tsx"
import GuestLayout from "./pages/GuestLayout.tsx"
import GlobalLayout from "./components/layouts/GlobalLayout.tsx"
import FreelancerProfilePage from "./pages/FreelancerProfilePage.tsx"
import ContractorProfilePage from "./pages/ContractorProfilePage.tsx"
import ProfileSetupPage from "./pages/Protected/ProfileSetupPage.tsx"
import EditProfilePage from "./pages/Protected/EditProfilePage.tsx"
import ProjectsPage from "./pages/ProjectsPage.tsx"
import ProjectDetailPage from "./pages/ProjectDetailPage.tsx"
import NewProjectPage from "./pages/Protected/NewProjectPage.tsx"
import MyContractsPage from "./pages/Protected/MyContractsPage.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <LoadingProvider>
        <BrowserRouter>
          <AppLoader />
          <Toaster />
          <Routes>
            <Route path="/" element={<App />} />

            {/* Rutas compartidas con Navbar Dinámico */}
            <Route element={<GlobalLayout />}>
              {/* Rutas públicas de auth */}
              <Route element={<GuestLayout />}>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Route>

              {/* Rutas públicas de negocio */}
              <Route
                path="/freelancers/:id"
                element={<FreelancerProfilePage />}
              />
              <Route
                path="/contractors/:id"
                element={<ContractorProfilePage />}
              />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />

              {/* Rutas protegidas */}
              <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<h1>Dashboard</h1>} />
                <Route path="/profile/setup" element={<ProfileSetupPage />} />
                <Route
                  path="/dashboard/edit-profile"
                  element={<EditProfilePage />}
                />
                <Route path="/projects/new" element={<NewProjectPage />} />
                <Route path="/dashboard/contracts" element={<MyContractsPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </LoadingProvider>
    </AuthProvider>
  </StrictMode>,
)
