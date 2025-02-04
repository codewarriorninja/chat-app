import { Navigate, Route, Routes } from "react-router-dom"
import { useEffect } from "react"
import Navbar from "./components/Navbar"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import SettingPage from "./pages/SettingPage"
import ProfilePage from "./pages/ProfilePage"
import HomePage from "./pages/HomePage"
import { useAuthStore } from "./store/useAuthStore"
import {Loader} from 'lucide-react'
// import { axiosInstance } from "./lib/axios"

const App = () => {
const {authUser,checkAuth,isCheckingAuth} = useAuthStore();

useEffect(() => {
  checkAuth();
}, [checkAuth]);
console.log({authUser});

if(isCheckingAuth && !authUser){
 return <div className="flex justify-center items-center h-screen">
   <Loader size="50" className="animate-spin"/>
   </div>
}
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to={'/login'} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />} />
      </Routes>
    </div>
  )
}

export default App
