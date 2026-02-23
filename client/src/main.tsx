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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoadingProvider>
      <BrowserRouter>
        <AppLoader />
        <Toaster />
        <Routes>
          <Route path="/" element={<App />} />

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* 
        Layout elements
        <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
        </Route> 
      */}
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  </StrictMode>,
)
