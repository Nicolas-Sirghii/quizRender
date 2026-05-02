
import './App.css'
import { Routes, Route } from "react-router-dom";

// import { ImageCanvasEditor } from './Create_quiz_card/canvas/Canvas'



import { CreateCardElement } from './Create_quiz_card/Create_post'
import { CardElement } from './Render_quiz_card/Display_card'

import { Feed } from './feed/Feed'
import { FeedPage } from './pages/home/Home'
import { Header } from './elements/Header'

function App() {




  return (
    <div className='app-container'>
     <Header />
     <Routes>
      <Route path="/" element={<FeedPage />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/createPost" element={<CreateCardElement />} />
     </Routes>
     
     

    </div>
  )
}

export default App
