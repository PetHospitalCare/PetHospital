import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/HomePage/Home'
import Login from './pages/Login&SignUp/Login.jsx'
import SignUp from './pages/Login&SignUp/SignUp.jsx'
import ProductManagerment from './pages/ProductManagerment/Product_Managerment.jsx'
import Service_Managerment from './pages/ServiceManagement/ServiceManagement.jsx'
import OTP_Input from './pages/Login&SignUp/OTP_Input.jsx'
import SignupSuccess from './pages/Login&SignUp/SignupSuccess.jsx'
import LoadingScreen from './pages/Login&SignUp/LoadingScreen.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/SignUp' element={<SignUp />} />
        <Route path='/otp' element={<OTP_Input/>} />
        <Route path="/loading" element={<LoadingScreen />} />
        <Route path='/signup-success' element={<SignupSuccess/>} />
        <Route path='/Product_Managerment' element={<ProductManagerment />} />
        <Route path='/Service_Managerment' element={<Service_Managerment />} />
        <Route path='/Account_Managerment' element={<Service_Managerment />} />
      </Routes>
    </BrowserRouter>

  </StrictMode>
)
