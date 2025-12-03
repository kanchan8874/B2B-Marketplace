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
import AdminProfile from './pages/admin/Profile.jsx'
import CategoryManagement from './pages/admin/CategoryManagement.jsx'
import CategoryDirectory from './pages/buyer/CategoryDirectory.jsx'
import ProductListing from './pages/buyer/ProductListing.jsx'
import ProductDetails from './pages/buyer/ProductDetails.jsx'
import RFQSubmission from './pages/buyer/RFQSubmission.jsx'
import RFQCenter from './pages/buyer/RFQCenter.jsx'
import BuyerProfile from './pages/buyer/Profile.jsx'
import BuyerKYCSubmission from './pages/buyer/BuyerKYCSubmission.jsx'
import ContactSeller from './pages/buyer/ContactSeller.jsx'
import Messages from './pages/buyer/Messages.jsx'
import RFQDetail from './pages/buyer/RFQDetail.jsx'
import SellerProfile from './pages/seller/Profile.jsx'
import ProductCatalog from './pages/seller/ProductCatalog.jsx'
import ProductEditor from './pages/seller/ProductEditor.jsx'
import RFQInbox from './pages/seller/RFQInbox.jsx'
import RFQResponse from './pages/seller/RFQResponse.jsx'
import SellerProductView from './pages/seller/ProductView.jsx'
import SellerKYCSubmission from './pages/seller/SellerKYCSubmission.jsx'
import SellerMessages from './pages/seller/Messages.jsx'
import UserManagement from './pages/admin/UserManagement.jsx'
import ProductModeration from './pages/admin/ProductModeration.jsx'
import KYCOverview from './pages/admin/KYCOverview.jsx'
import SellerKYCManagement from './pages/admin/SellerKYCManagement.jsx'
import BuyerKYCManagement from './pages/admin/BuyerKYCManagement.jsx'
import RFQMonitoring from './pages/admin/RFQMonitoring.jsx'
import AdminProductView from './pages/admin/ProductView.jsx'
import SubscriptionManagement from './pages/admin/SubscriptionManagement.jsx'
import SubscriptionSellers from './pages/admin/SubscriptionSellers.jsx'
import PrivacyPolicy from './pages/legal/PrivacyPolicy.jsx'
import DataKYCStorage from './pages/legal/DataKYCStorage.jsx'
import TermsOfUse from './pages/legal/TermsOfUse.jsx'
import MessageOversight from './pages/admin/MessageOversight.jsx'
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
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/data-kyc" element={<DataKYCStorage />} />
          <Route path="/terms" element={<TermsOfUse />} />
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
          <Route
            path="/buyer/rfqs/:rfqId"
            element={
              <ProtectedRoute allowed={['buyer']}>
                <BuyerLayout>
                  <RFQDetail />
                </BuyerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer/profile"
            element={
              <ProtectedRoute allowed={['buyer']}>
                <BuyerLayout>
                  <BuyerProfile />
                </BuyerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/kyc"
            element={
              <ProtectedRoute allowed={['buyer']}>
                <BuyerLayout>
                  <BuyerKYCSubmission />
                </BuyerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/messages/contact"
            element={
              <ProtectedRoute allowed={['buyer']}>
                <BuyerLayout>
                  <ContactSeller />
                </BuyerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/messages"
            element={
              <ProtectedRoute allowed={['buyer']}>
                <BuyerLayout>
                  <Messages />
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
            path="/seller/products/:productId/view"
            element={
              <ProtectedRoute allowed={['seller']}>
                <SellerLayout>
                  <SellerProductView />
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
            path="/seller/profile"
            element={
              <ProtectedRoute allowed={['seller']}>
                <SellerLayout>
                  <SellerProfile />
                </SellerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/kyc"
            element={
              <ProtectedRoute allowed={['seller']}>
                <SellerLayout>
                  <SellerKYCSubmission />
                </SellerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/messages"
            element={
              <ProtectedRoute allowed={['seller']}>
                <SellerLayout>
                  <SellerMessages />
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
            path="/admin/categories"
            element={
              <ProtectedRoute allowed={['admin']}>
                <AdminLayout>
                  <CategoryManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subscriptions"
            element={
              <ProtectedRoute allowed={['admin']}>
                <AdminLayout>
                  <SubscriptionManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subscriptions/sellers"
            element={
              <ProtectedRoute allowed={['admin']}>
                <AdminLayout>
                  <SubscriptionSellers />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/kyc"
            element={
              <ProtectedRoute allowed={['admin']}>
                <AdminLayout>
                  <KYCOverview />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/kyc/sellers"
            element={
              <ProtectedRoute allowed={['admin']}>
                <AdminLayout>
                  <SellerKYCManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/kyc/buyers"
            element={
              <ProtectedRoute allowed={['admin']}>
                <AdminLayout>
                  <BuyerKYCManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/:productId/view"
            element={
              <ProtectedRoute allowed={['admin']}>
                <AdminLayout>
                  <AdminProductView />
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
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute allowed={['admin']}>
                <AdminLayout>
                  <AdminProfile />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute allowed={['admin']}>
                <AdminLayout>
                  <MessageOversight />
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
