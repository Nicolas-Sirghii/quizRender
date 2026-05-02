
import {  useSelector, useDispatch } from "react-redux"
import { ImageCanvasEditor } from "./canvas/Canvas";
import { deleteLast, setCount } from "../redux/slices/cardSlice";

export function CreateCardElement() {
  const dispatch = useDispatch();
  const { image, ratio, rects } = useSelector((state) => state.card_state);
  

  const deleteLastSquare = () => {
    console.log("dlelte last square")
   dispatch(deleteLast())
   dispatch(setCount(-1))
  }
  const createNewCard = () => {
    console.log(
      JSON.stringify(
        {
          id: crypto.randomUUID(),
          created: "today",
          right: 0,
          wrong: 0,
          image,
          ratio,
          rects,
        },
        null,
        2
      )
    );
  }


  return (
    <div className="card">

      <div className="imageWrapper">
        <ImageCanvasEditor/>
      </div>
       {
        image && 
        <div className="buttons">
          { (rects.length != 0) &&
            <button className="btn delete" onClick={deleteLastSquare}>
          Delete
        </button>
          }
        

        <button className="btn solve" onClick={createNewCard}>
          Create
        </button>
      </div>
       }
      
    </div>
  );
}