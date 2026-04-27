
import {  useSelector } from "react-redux"
import { ImageCanvasEditor } from "./canvas/Canvas";

export function CreateCardElement() {
  const { image, ratio, rects } = useSelector((state) => state.card_state);
  

  const deleteLastSquare = () => {
    console.log("dlelte last square")
  }
  const createNewCard = () => {
    console.log(
      JSON.stringify(
        {
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

      <div className="buttons">
        <button className="btn delete" onClick={deleteLastSquare}>
          Delete
        </button>

        <button className="btn solve" onClick={createNewCard}>
          Create
        </button>
      </div>
    </div>
  );
}