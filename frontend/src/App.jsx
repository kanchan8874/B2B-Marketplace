import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './layouts/AppShell.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import BuyerLayout from './layouts/BuyerLayout.jsx'
import SellerLayout from './layouts/SellerLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import BuyerSignup from './pages/auth/BuyerSignup.jsx'
import BuyerLogin from './pages/auth/BuyerLogin.jsx'
import BuyerDashboard from './pages/buyer/Dashboard.jsx'
import SellerSignup from './pages/auth/SellerSignup.jsx'
import SellerLogin from './pages/auth/SellerLogin.jsx'
import SellerDashboard from './pages/seller/Dashboard.jsx'
import AdminLogin from './pages/auth/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import CategoryDirectory from './pages/buyer/CategoryDirectory.jsx'
import ProductListing from './pages/buyer/ProductListing.jsx'
import ProductDetails from './pages/buyer/ProductDetails.jsx'
import RFQSubmission from './pages/buyer/RFQSubmission.jsx'
import RFQCenter from './pages/buyer/RFQCenter.jsx'
import ProductCatalog from './pages/seller/ProductCatalog.jsx'
import ProductEditor from './pages/seller/ProductEditor.jsx'
import RFQInbox from './pages/seller/RFQInbox.jsx'
import RFQResponse from './pages/seller/RFQResponse.jsx'
import UserManagement from './pages/admin/UserManagement.jsx'
import ProductModeration from './pages/admin/ProductModeration.jsx'
import RFQMonitoring from './pages/admin/RFQMonitoring.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { RFQProvider } from './context/RFQContext.jsx'

const App = () => (
  <AuthProvider>
    <RFQProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
          {/* Public */}
          <Route path="/" element={<PublicLayout />} />
          <Route path="/auth/buyer/signup" element={<BuyerSignup />} />
          <Route path="/auth/buyer/login" element={<BuyerLogin />} />
          <Route path="/auth/seller/signup" element={<SellerSignup />} />
          <Route path="/auth/seller/login" element={<SellerLogin />} />
          <Route path="/auth/admin/login" element={<AdminLogin />} />

          {/* Buyer */}
          <Route
            path="/buyer/dashboard"
            element={
              <ProtectedRoute allowed={['buyer']}>
                <BuyerLayout>
                  <BuyerDashboard />
                </BuyerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/categories"
            element={
              <ProtectedRoute allowed={['buyer']}>
                <BuyerLayout>
                  <CategoryDirectory />
                </BuyerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/products"
            element={
              <ProtectedRoute allowed={['buyer']}>
                <BuyerLayout>
                  <ProductListing />
                </BuyerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/products/:productId"
            element={
              <ProtectedRoute allowed={['buyer']}>
                <BuyerLayout>
                  <ProductDetails />
                </BuyerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/rfq/:productId"
            element={
              <ProtectedRoute allowed={['buyer']}>
                <BuyerLayout>
                  <RFQSubmission />
                </BuyerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/rfqs"
            element={
              <ProtectedRoute allowed={['buyer']}>
                <BuyerLayout>
                  <RFQCenter />
                </BuyerLayout>
              </ProtectedRoute>
            }
          />

          {/* Seller */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute allowed={['seller']}>
                <SellerLayout>
                  <SellerDashboard />
                </SellerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/products"
            element={
              <ProtectedRoute allowed={['seller']}>
                <SellerLayout>
                  <ProductCatalog />
                </SellerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/products/new"
            element={
              <ProtectedRoute allowed={['seller']}>
                <SellerLayout>
                  <ProductEditor mode="create" />
                </SellerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/products/:productId/edit"
            element={
              <ProtectedRoute allowed={['seller']}>
                <SellerLayout>
                  <ProductEditor mode="edit" />
                </SellerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/rfqs"
            element={
              <ProtectedRoute allowed={['seller']}>
                <SellerLayout>
                  <RFQInbox />
                </SellerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/rfqs/:rfqId/respond"
            element={
              <ProtectedRoute allowed={['seller']}>
                <SellerLayout>
                  <RFQResponse />
                </SellerLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowed={['admin']}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowed={['admin']}>
                <AdminLayout>
                  <UserManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sellers"
            element={
              <ProtectedRoute allowed={['admin']}>
                <AdminLayout>
                  <UserManagement scope="sellers" />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowed={['admin']}>
                <AdminLayout>
                  <ProductModeration />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rfqs"
            element={
              <ProtectedRoute allowed={['admin']}>
                <AdminLayout>
                  <RFQMonitoring />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </RFQProvider>
  </AuthProvider>
)

export default App
