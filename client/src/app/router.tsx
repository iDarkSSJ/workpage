import { BrowserRouter, Route, Routes } from "react-router"
import App from "../App"
import NotFoundPage from "../pages/NotFoundPage"

import GlobalLayout from "../components/layouts/GlobalLayout"
import GuestLayout from "../pages/GuestLayout"
import ProtectedLayout from "../pages/Protected/ProtectedLayout"
import EditProfilePage from "../pages/Protected/EditProfilePage"
import FreelancerProfilePage from "../pages/FreelancerProfilePage"
import ContractorProfilePage from "../pages/ContractorProfilePage"
import RegisterPage from "../pages/RegisterPage"
import LoginPage from "../pages/LoginPage"
import ProfileSetupPage from "../pages/Protected/ProfileSetupPage"
import ProjectDetailPage from "../pages/ProjectDetailPage"
import ProjectsPage from "../pages/ProjectsPage"
import DashboardPage from "../pages/Protected/DashboardPage"
import NewProjectPage from "../pages/Protected/NewProjectPage"
import AccountSettingsPage from "../pages/Protected/AccountSettingsPage"
import ResetPasswordPage from "../pages/ResetPasswordPage"
import ForgotPasswordPage from "../pages/ForgotPasswordPage"
import ContractsPage from "../pages/Protected/ContractsPage"
import ChatPage from "../pages/Protected/ChatPage"

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route element={<GlobalLayout />}>
          <Route element={<GuestLayout />}>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/freelancers/:id" element={<FreelancerProfilePage />} />
          <Route path="/contractors/:id" element={<ContractorProfilePage />} />

          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects/new" element={<NewProjectPage />} />
            <Route path="/profile/setup" element={<ProfileSetupPage />} />
            <Route
              path="/dashboard/edit-profile"
              element={<EditProfilePage />}
            />
            <Route
              path="/dashboard/account"
              element={<AccountSettingsPage />}
            />
            <Route path="/dashboard/contracts" element={<ContractsPage />} />
            <Route path="/dashboard/chat" element={<ChatPage />} />
            <Route path="/dashboard/chat/:id" element={<ChatPage />} />
          </Route>
        </Route>
        
        {/* MATCH-ALL ROUTE (404) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
