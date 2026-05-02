import "./Feed.css"
import { CardElement } from "../Render_quiz_card/Display_card"
import { useSelector, useDispatch } from "react-redux";
import { setQuestionPopup, setRightAnswer } from "../redux/slices/cardSlice";

export function Feed () {

const { cards, questionPopup, questionPopupMessage, rightAnswerPopup, rightAnswer } = useSelector((state) => state.card_state);
const dispatch = useDispatch();
  
if ( rightAnswerPopup ) {
    setTimeout(() => {
        dispatch(setRightAnswer())
    }, 2000);
}
   

    return (
        <div className="feed-container">
            { questionPopup && <div className="quiestion-popup" onClick={() => dispatch(setQuestionPopup({set: 0}))}>{questionPopupMessage}</div>}
            {rightAnswerPopup && <div className="right-answer-popup">{rightAnswer}</div>}
            {cards.map((elem) => {
                return(
                    <CardElement card={elem} key={elem.id} />
                )
            })}
        </div>
    )
}