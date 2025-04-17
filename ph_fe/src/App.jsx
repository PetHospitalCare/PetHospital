
import './App.css'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Home from './pages/HomePage/Home'
import Login from './pages/Login&SignUp/Login.jsx'
import SignUp from './pages/Login&SignUp/SignUp.jsx'
import ProductManagerment from './pages/ProductManagerment/Product_Managerment.jsx'
import Service_Managerment from './pages/ServiceManagement/ServiceManagement.jsx'
import OTP_Input from './pages/Login&SignUp/OTP_Input.jsx'
import SignupSuccess from './pages/Login&SignUp/SignupSuccess.jsx'
import LoadingScreen from './pages/Login&SignUp/LoadingScreen.jsx'
import AccountManagement from './pages/AccountManagement/Account_Management.jsx'
import Unauthorized from './pages/Unauthorized'
import ProtectedRoute from './pages/protectedroute'
import ChangeEmail from './pages/Login&SignUp/Change_email'
import Notfound from './pages/PageNotFound'
import MedicineManagerment from './pages/MedicineManagement/Medicine_Managerment'

import Calendar from './pages/BookingSchedule/CalendarPage'

import AdminLayout from './layout/AdminRoutes'
import ManageBooking from './pages/BookingSchedule/ManageBooking'

import ProductPage from "@/pages/product/product-page.jsx";
import ProductDetail from "@/pages/product/product-detail.jsx";
import PublicLayout from './layout/PublicRoutes'

import { io } from "socket.io-client";
import UserProfile from './pages/UserProfile/UserProfile'
import ShoppingCartDetail from "@/pages/shoping-cart/shopping-cart-detail.jsx";
import News_Management from './pages/NewsManagement/News_Management'
import ShoppingCartPayment from "@/pages/shoping-cart/shopping-cart-payment.jsx";
import PaymentResult from "@/pages/payments/payment-result.jsx";
import MedicalDetail from './pages/HistoryBooking/MedicalDetail/Medical_Detail'
import NewDetail from './pages/NewDetail/NewDetail'
import CustomerChat from './pages/Chat/CustomerChat'
import { StaffChat } from './pages/Chat/StaffChat'
import Dashboard from './pages/DashBoard/dash-board'
import UserOrdersPage from "@/pages/user-order-page/user-orders-page.jsx";
import Forgot_Password from './pages/Login&SignUp/Forgot_password/Forgot_Password'
import ResetPassword from './pages/Login&SignUp/Forgot_password/Reset_Password'
import MedicalRecord from './pages/MedicalRecord.js/MedicalRecord.jsx';
import HistoryBooking from './pages/HistoryBooking/HistoryBooking';
import OrdersManagement from "@/pages/orders-management/orders-management.jsx";
import News from './pages/NewDetail/News'
import AllDoctors from './pages/AllDoctor/View_doctor'
export const socket = io.connect("https://pethospital.onrender.com");
// export const socket = io.connect("http://localhost:9999",);
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />} >
          <Route path='/' element={<Home />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path='/forgot-password' element={<Forgot_Password />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/change-password' element={<ResetPassword />} />
          <Route path='/otp' element={<OTP_Input />} />
          <Route path='/change-email' element={<ChangeEmail />} />
          <Route path='/news' element={<News />} />
          <Route path='/new-detail/:id' element={<NewDetail />} />
          <Route path='/all-doctor' element={<AllDoctors />} />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path='/signup-success' element={<SignupSuccess />} />
          <Route path='/product' element={<ProductPage />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/history-booking' element={<HistoryBooking />} />
          <Route path='/product-detail' element={<ProductDetail />} />
          <Route path='/shopping-cart-detail' element={<ShoppingCartDetail />} />
          <Route path='/shopping-cart-payment' element={<ShoppingCartPayment />} />
          <Route path='/payment-result' element={<PaymentResult />} />
          <Route path='/medical-detail/:id' element={<MedicalDetail />} />
          <Route path='/orders' element={<UserOrdersPage />} />
        </Route>
        {/* Trang dành cho admin */}
        <Route>
          <Route element={<AdminLayout />}>
            {/* Routes cho Admin - có quyền truy cập tất cả */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path='/Account_Management' element={<AccountManagement />} />
              <Route path='/Dashboard' element={<Dashboard />} />
            </Route>

            {/* Routes cho Staff */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'staff']} />}>
              <Route path='/chat' element={<StaffChat />} />
              <Route path='/Booking_Management' element={<ManageBooking />} />
              <Route path='/orders_management' element={<OrdersManagement />} />
              <Route path='/Service_Management/:id' element={<Service_Managerment />} />
              <Route path='/News_Management' element={<News_Management />} />
              <Route path='/Product_Management' element={<ProductManagerment />} />
              <Route path='/Medicine_Management' element={<MedicineManagerment />} />
            </Route>

            {/* Routes cho Doctor */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'doctor']} />}>
              <Route path='/Schedule' element={<Calendar />} />
            </Route>

            {/* Routes chung cho tất cả roles trong admin layout */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'staff', "doctor"]} />}>
              <Route path='admin/profile' element={<UserProfile />} />
              <Route path='/MedicalRecord' element={<MedicalRecord />} />
              <Route path="/MedicalRecord/:id" element={<MedicalDetail />} />
            </Route>
          </Route>
        </Route>
        <Route path='/*' element={<Notfound />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
