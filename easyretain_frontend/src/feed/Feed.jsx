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
import { appendCards, setLoadingApi } from "../redux/slices/cardSlice";
import { CardElement } from "../Render_quiz_card/Display_card";
import { setQuestionPopup, setRightAnswer, setDeletePopup } from "../redux/slices/cardSlice";
import "./Feed.css"

export function Feed() {
  const dispatch = useDispatch();
  const cards = useSelector((state) => state.card_state.cards);
  const { path } = useSelector((state) => state.path);
  useEffect(() => {
    if (cards.length == 0) {
      localStorage.setItem("changes_made", "1")
    }
  })


  const { questionPopup, questionPopupMessage, rightAnswerPopup, rightAnswer, deletePopup } = useSelector((state) => state.card_state);

  if (rightAnswerPopup) {
    setTimeout(() => {
      dispatch(setRightAnswer())
    }, 2000);
  }









  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 10;

  const fetchCards = async (newOffset = 0) => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    setLoading(true);
    dispatch(setLoadingApi(true))

    const res = await fetch(
      `${path}}/cards/feed?offset=${newOffset}&limit=${LIMIT}`,
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

    dispatch(appendCards(data));


    setLoading(false);
    dispatch(setLoadingApi(false))
  };



  const loadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    fetchCards(newOffset);
  };

  return (
    <div className="feed-container">



      {questionPopup && <div className="quiestion-popup" onClick={() => dispatch(setQuestionPopup({ set: 0 }))}>{questionPopupMessage}</div>}
      {rightAnswerPopup && <div className="right-answer-popup">{rightAnswer}</div>}
      {
        deletePopup && <div className="delete-popup">
          <button className="btn delete" onClick={() => dispatch(setDeletePopup({ status: "delete", id: null }))}>Delete</button>
          <button className="btn solve" onClick={() => dispatch(setDeletePopup({ status: "close", id: null }))}>Cancel</button>
        </div>
      }




      {cards.length > 0 && cards.map((card) => (
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