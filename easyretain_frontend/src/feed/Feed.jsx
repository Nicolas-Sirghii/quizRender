// import "./Feed.css"
// import { CardElement } from "../Render_quiz_card/Display_card"
// import { useSelector, useDispatch } from "react-redux";
// import { setQuestionPopup, setRightAnswer, setDeletePopup } from "../redux/slices/cardSlice";

// export function Feed () {

// const { cards, questionPopup, questionPopupMessage, rightAnswerPopup, rightAnswer, deletePopup } = useSelector((state) => state.card_state);
// const dispatch = useDispatch();
  
// if ( rightAnswerPopup ) {
//     setTimeout(() => {
//         dispatch(setRightAnswer())
//     }, 2000);
// }
   

//     return (
//         <div className="feed-container">
//             { questionPopup && <div className="quiestion-popup" onClick={() => dispatch(setQuestionPopup({set: 0}))}>{questionPopupMessage}</div>}
//             {rightAnswerPopup && <div className="right-answer-popup">{rightAnswer}</div>}
//             {deletePopup && <div className="delete-popup">
//                 <button className="btn delete" onClick={() => dispatch(setDeletePopup({status: "delete", id: null}))}>Delete</button>
//                 <button className="btn solve" onClick={() => dispatch(setDeletePopup({status: "close", id: null}))}>Cancel</button>
//                 </div>}
//             {cards.map((elem) => {
//                 return(
//                     <CardElement card={elem} key={elem.id} />
//                 )
//             })}
//         </div>
//     )
// }



import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCards, appendCards } from "../redux/slices/cardSlice";
import { CardElement } from "../Render_quiz_card/Display_card";

export function Feed() {
  const dispatch = useDispatch();
  const cards = useSelector((state) => state.card_state.cards);

  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 10;

  const fetchCards = async (newOffset = 0) => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    setLoading(true);

    const res = await fetch(
      `http://localhost:8000/cards/feed?offset=${newOffset}&limit=${LIMIT}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (data.length < LIMIT) {
      setHasMore(false);
    }

    if (newOffset === 0) {
      dispatch(setCards(data));
    } else {
      dispatch(appendCards(data));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCards(0);
  }, []);

  const loadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    fetchCards(newOffset);
  };

  return (
    <div className="feed-container">
      {cards.map((card) => (
        <CardElement key={card.id} card={card} />
      ))}

      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}