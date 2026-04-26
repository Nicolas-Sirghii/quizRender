
import './App.css'

import { ImageCanvasEditor2 } from './source/startingElement'


import { CreateCardElement } from './Create_quiz_card/Create_post'
import { CardElement } from './Render_quiz_card/Display_card'

function App() {
  

  return (
    <div className='app-container'>
      <ImageCanvasEditor2 />

      <CreateCardElement />
      <CardElement />
      
    </div>
  )
}

export default App
