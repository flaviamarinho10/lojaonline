import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Admin from './pages/Admin'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import FlyToCart from './components/FlyToCart'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AuthProvider>
          <FlyToCart />
          <Routes>
            {/* Public Store */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
