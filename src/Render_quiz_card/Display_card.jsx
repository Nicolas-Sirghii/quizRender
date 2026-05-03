import { useState } from "react";
import "./Display_card_styles.css"
import { useNavigate } from "react-router-dom";

import { SquaresLayout } from "./Display_squares/Display_squares";
import { useDispatch, useSelector } from "react-redux";
import { setAnswer, setDeleteCard, setRight, answerMessage, deleteCard, updateElem, setDeletePopup } from "../redux/slices/cardSlice";

export function CardElement({

  createdAt = new Date().toLocaleString(),

  card

}) {


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cards } = useSelector((state) => state.card_state);
  // const card = cards[0]


  const [expanded, setExpanded] = useState(false);
  const [answers, setAnswers] = useState(["", "", ""]);
  const [color, setColor] = useState("#111")

  const handleChange = (id, value) => {
    const copy = [...answers];
    copy[id] = value;
    setAnswers(copy);
  };

  const handleSubmit = (index, id, cardId) => {
     
    const data = cards.filter((el)=> {
      return el.id == cardId
    })
    dispatch(answerMessage({cardId, id}))

    if((data[0].rects.length == 1) && (data[0].rects[0].answer.toLowerCase() == answers[index].toLowerCase())){
      dispatch(setRight(cardId))
      setColor("grey")
      setTimeout(() => {
        dispatch(setDeleteCard(cardId))
      }, 4000);
      
    }
    
    

    dispatch(setAnswer({
      id,
      value: answers[index],
      index,
      cardId
    }))
    setAnswers(["", "", ""])
    
   


  };


  const deletePost = (id) => {
    // dispatch(deleteCard(id))
    dispatch(setDeletePopup({status: "open", id: id}))
  }
  const updatePost = (im, id) => {
    dispatch(updateElem(id))
    navigate("/createPost")
  }


  return (
    <div className="card" style={{background: `${color}`}}>
      {/* IMAGE */}
      <div className="imageWrapper">
        <SquaresLayout data={card} />
      </div>

      {/* INFO */}
      <div className="info">
        <span className="date">📅 {card.created}</span>

        <div className="stats">
          <span className="right">✔ {card.right}</span>
          <span className="wrong">✖ {card.wrong}</span>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="buttons">
        <button className="btn delete" onClick={ () => deletePost(card.id)}>
          Delete
        </button>

        <button className="btn update" onClick={() => updatePost(card.image, card.id)}>
          Update
        </button>
         {
          card.rects.length != 0 &&
          <button
          className="btn solve"
          onClick={() => setExpanded((p) => !p)}
        >
          {expanded ? "Close" : "Solve"}
        </button>
         }
        
      </div>

      {/* EXPANDED AREA */}
      {expanded && (
        <div className="solveArea">
          {card.rects.map((rect, index) => (
            <div key={rect.id} className="inputRow">
              <div>{rect.num}</div>
              <input
                className="input"
                placeholder={rect.question}
                value={answers[index] ?? ""}
                onChange={(e) => handleChange(index, e.target.value)}
              />
              <button
                className="submitBtn"
                onClick={() => handleSubmit(index, rect.id, card.id)}
              >
                Submit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}