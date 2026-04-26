import { increment } from "../redux/slices/cardSlice"
import { useDispatch, useSelector } from "react-redux"

export function CreateCardElement() {
  const { value } = useSelector((state) => state.card_state);
  const dispatch = useDispatch();

  const deleteLastSquare = () => {
    console.log("dlelte last square")
  }
  const createNewCard = () => {
    dispatch(increment())
  }

  return (
    <div className="card">

      <div className="imageWrapper">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZLWKJBYIyWPCVVi2ZtdZ_TLu2Cfs4n5hg5Q&s" alt="card" className="image" />
      </div>

      <div className="buttons">
        <button className="btn delete" onClick={deleteLastSquare}>
          Delete
        </button>

        <button className="btn solve" onClick={createNewCard}>
          {value}
        </button>
      </div>
    </div>
  );
}