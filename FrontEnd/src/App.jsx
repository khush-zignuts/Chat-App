import Signup from './assets/components/Auth/SignUp';
// // import VerifyOTP from './assets/components/Auth/verifyOtp';
import Login from './assets/components/Auth/Login';
import Logout from './assets/components/Auth/LogOut';
// import ChangePassword from './assets/components/Auth/ChangePassword';
// import ForgotPassword from './assets/components/Auth/ForgotPassword';
// import ResetPassword from "./assets/components/Auth/ResetPassword";
import Wp from "./assets/components/Wp";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import './App.css'
import Profile from './assets/Components/Profile';
import VerifyOtp from './assets/Components/Auth/verifyotp';

function App() {


  return (
    <div>

      <Routes>
        <Route path="/" element={<Navigate to="/api/user/signup" />} />
        <Route path="/api/user/signup" element={<Signup />} />
        <Route path="/api/user/verifyOtp" element={<VerifyOtp />} />
        <Route path="/api/user/login" element={<Login />} />
        {/* <Route path="/api/user/forgot-password" element={<ForgotPassword />} /> */}
        {/* <Route path="/api/user/forgot-password/reset-password" element={<ResetPassword />} /> */}
        {/* <Route path="/api/user/change-password" element={<ChangePassword />} /> */}
        <Route path="/api/user/logout" element={<Logout />} />


        <Route path="/api/user/wp" element={<Wp />} />
        <Route path="/api/user/wp/profile/:userId" element={<Profile />} />


      </Routes>

    </div>
  )
}

export default App
