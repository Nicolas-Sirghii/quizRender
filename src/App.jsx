
import './App.css'
import { Routes, Route } from "react-router-dom";
import { CreateCardElement } from './Create_quiz_card/Create_post'
import { Feed } from './feed/Feed'
import { Header } from './elements/Header'

function App() {




  return (
    <div className='app-container'>
     <Header />
     <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/createPost" element={<CreateCardElement />} />
     </Routes>
    </div>
  )
}

export default App
