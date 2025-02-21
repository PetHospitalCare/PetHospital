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
import Example from './pages/Unauthorized'
import ProtectedRoute from './pages/protectedroute'
import ChangeEmail from './pages/Login&SignUp/Change_email'
function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/SignUp' element={<SignUp />} />
        <Route path='/otp' element={<OTP_Input />} />
        <Route path='/change-email' element={<ChangeEmail />} />
        <Route path="/loading" element={<LoadingScreen />} />
        <Route path='/signup-success' element={<SignupSuccess />} />
        <Route path='/unauthorized' element={<Example />} />

        {/* Trang dành cho admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path='/Product_Managerment' element={<ProductManagerment />} />
          <Route path='/Service_Managerment' element={<Service_Managerment />} />
          <Route path='/Account_Managerment' element={<AccountManagement />} />
        </Route>
      </Routes>

    </BrowserRouter>
  )
}

export default App
