import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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

import PetRecordManagement from "@/pages/pet-record-management/pet-record-management.jsx";
import AdminLayout from './layout/AdminRoutes'
import ManageBooking from './pages/BookingSchedule/ManageBooking'

import ProductPage from "@/pages/product/product-page.jsx";
import ProductDetail from "@/pages/product/product-detail.jsx";
import PublicLayout from './layout/PublicRoutes'

import { io } from "socket.io-client";
import UserProfile from './pages/UserProfile/UserProfile'
import HistoryBooking from './pages/HistoryBooking/historyBooking'
import ShoppingCartDetail from "@/pages/shoping-cart/shopping-cart-detail.jsx";

import News_Management from './pages/NewsManagement/News_Management'

import ShoppingCartPayment from "@/pages/shoping-cart/shopping-cart-payment.jsx";
import PaymentResult from "@/pages/payments/payment-result.jsx";
import MedicalDetail from './pages/HistoryBooking/MedicalDetail/Medical_Detail'
import NewDetail from './pages/NewDetail/NewDetail'

export const socket = io.connect("http://localhost:9999",);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />} >
          <Route path='/' element={<Home />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path='/otp' element={<OTP_Input />} />
          <Route path='/change-email' element={<ChangeEmail />} />
          <Route path='/new-detail/:id' element={<NewDetail />} />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path='/signup-success' element={<SignupSuccess />} />
          <Route path='/unauthorized' element={<Unauthorized />} />
          <Route path='/product' element={<ProductPage />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/history-booking' element={<HistoryBooking />} />
          <Route path='/product-detail' element={<ProductDetail />} />
          <Route path='/shopping-cart-detail' element={<ShoppingCartDetail />} />
          <Route path='/shopping-cart-payment' element={<ShoppingCartPayment />} />
          <Route path='/payment-result' element={<PaymentResult />} />
          <Route path='/medical-detail/:id' element={<MedicalDetail />} />
        </Route>

        {/* Trang dành cho admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}> {/* Bọc toàn bộ route admin */}
            <Route path='/Product_Management' element={<ProductManagerment />} />
            <Route path='/Medicine_Management' element={<MedicineManagerment />} />
            <Route path='/Service_Management/:id' element={<Service_Managerment />} />
            <Route path='/Account_Management' element={<AccountManagement />} />
            <Route path='/Schedule' element={<Calendar />} />
            <Route path='/PetRecord_Management' element={<PetRecordManagement />} />
            <Route path='/Booking_Management' element={<ManageBooking />} />
            <Route path='/News_Management' element={<News_Management />} />
          </Route>
        </Route>
        <Route path="*" element={< Notfound />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
