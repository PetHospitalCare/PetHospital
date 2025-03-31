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
import AccountManagement from './pages/AccountManagement/Account_Management.jsx'
import { UserProvider } from './contexts/UserContext.jsx'
import PetRecordManagement from "@/pages/pet-record-management/pet-record-management.jsx";
import { Toaster } from "@/components/ui/sonner"

import "./index.css"

import { ShoppingCartProvider } from "@/contexts/ShoppingCartContext.jsx";
import { ChatProvider } from './contexts/ChatProvider.jsx'

createRoot(document.getElementById('root')).render(
    <UserProvider>
        <ShoppingCartProvider>
            <ChatProvider>
                <Toaster richColors position="top-right" expand={true} closeButton />
                <App />
            </ChatProvider>
        </ShoppingCartProvider>
    </UserProvider>
)
