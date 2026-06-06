import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Report from './pages/Report'
import FormScreen from './screens/FormScreen'
import PreviewScreen from './screens/PreviewScreen'
import ResumePreview from './components/ResumePreview'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/report" element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          } />
          
          <Route path="/resume">
            <Route index element={<Navigate to="form" />} />
            <Route path="form" element={
              <ProtectedRoute>
                <FormScreen />
              </ProtectedRoute>
            } />
            <Route path="preview" element={
              <ProtectedRoute>
                <PreviewScreen />
              </ProtectedRoute>
            } />
          </Route>
          
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}