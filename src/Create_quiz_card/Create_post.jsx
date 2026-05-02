
import {  useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { ImageCanvasEditor } from "./canvas/Canvas";
import { deleteLast, setCount, createCard, updateExist } from "../redux/slices/cardSlice";

export function CreateCardElement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { image, ratio, rects, updateCard } = useSelector((state) => state.card_state);
  

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
    dispatch(createCard({
          id: crypto.randomUUID(),
          created: "today",
          right: 0,
          wrong: 0,
          image,
          ratio,
          rects,
        }))


        navigate("/feed")
  }
  function updateExistingCard() {
       dispatch(updateExist({
          id: crypto.randomUUID(),
          created: "today",
          right: 0,
          wrong: 0,
          image,
          ratio,
          rects,
        }))
        navigate("/feed")
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
        {
          updateCard ?
          <button className="btn update" onClick={updateExistingCard}>
          Update
        </button>
        :

          <button className="btn solve" onClick={createNewCard}>
          Create
        </button>
        
        
        }

        
      </div>
       }
      
    </div>
  );
}