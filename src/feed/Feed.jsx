import "./Feed.css"
import { CardElement } from "../Render_quiz_card/Display_card"
import { useSelector, useDispatch } from "react-redux";
import { setQuestionPopup } from "../redux/slices/cardSlice";

export function Feed () {

const { cards, questionPopup, questionPopupMessage } = useSelector((state) => state.card_state);
const dispatch = useDispatch();
  
   

    return (
        <div className="feed-container">
            { questionPopup && <div className="quiestion-popup" onClick={() => dispatch(setQuestionPopup({set: 0}))}>{questionPopupMessage}</div>}
            {cards.map((elem) => {
                return(
                    <CardElement card={elem} key={elem.id} />
                )
            })}
        </div>
    )
}