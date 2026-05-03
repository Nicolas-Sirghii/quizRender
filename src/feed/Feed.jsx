import "./Feed.css"
import { CardElement } from "../Render_quiz_card/Display_card"
import { useSelector, useDispatch } from "react-redux";
import { setQuestionPopup, setRightAnswer, setDeletePopup } from "../redux/slices/cardSlice";

export function Feed () {

const { cards, questionPopup, questionPopupMessage, rightAnswerPopup, rightAnswer, deletePopup } = useSelector((state) => state.card_state);
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
            {deletePopup && <div className="delete-popup">
                <button className="btn delete" onClick={() => dispatch(setDeletePopup({status: "delete", id: null}))}>Delete</button>
                <button className="btn solve" onClick={() => dispatch(setDeletePopup({status: "close", id: null}))}>Cancel</button>
                </div>}
            {cards.map((elem) => {
                return(
                    <CardElement card={elem} key={elem.id} />
                )
            })}
        </div>
    )
}