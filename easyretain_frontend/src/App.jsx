
import './App.css'
import { Routes, Route } from "react-router-dom";
import { CreateCardElement } from './Create_quiz_card/Create_post'
import { Feed } from './feed/Feed'
import { Header } from './elements/Header'
import { Login } from './elements/loginRegister/Login';
import { Register } from './elements/loginRegister/Register';
import { VerifyEmail } from './elements/loginRegister/VerifyEmail';
import { RecoverPassword } from './elements/loginRegister/PasswordRecovery';
import { ForgotPassword } from './elements/loginRegister/ForegotPassword';
import { Profile } from './elements/loginRegister/userProfile/UserProfile';

function App() {




  return (
    <div className='app-container'>
     <Header />
     <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/createPost" element={<CreateCardElement />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/recover-password" element={<RecoverPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
     </Routes>
    </div>
  )
}

export default App
