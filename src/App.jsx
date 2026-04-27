
import './App.css'

// import { ImageCanvasEditor } from './Create_quiz_card/canvas/Canvas'



import { CreateCardElement } from './Create_quiz_card/Create_post'
import { CardElement } from './Render_quiz_card/Display_card'

function App() {




  return (
    <div className='app-container'>

      <CreateCardElement />
      <CardElement />

    </div>
  )
}

export default App
