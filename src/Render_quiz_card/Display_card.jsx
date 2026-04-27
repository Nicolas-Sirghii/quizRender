import { useState } from "react";
import "./Display_card_styles.css"

import { SquaresLayout } from "./Display_squares/Display_squares";
import { useDispatch, useSelector } from "react-redux";
import { setAnswer } from "../redux/slices/cardSlice";

export function CardElement({
  
  createdAt = new Date().toLocaleString(),


  onSolveSubmit,
}) {

  const dispatch = useDispatch();
  const { cards } = useSelector((state) => state.card_state);
  const card = cards[0]


  const [expanded, setExpanded] = useState(false);
  const [answers, setAnswers] = useState(["", "", ""]);

  const handleChange = (id, value) => {
    const copy = [...answers];
    copy[id] = value;
    setAnswers(copy);
  };

  const handleSubmit = (index, id, cardId) => {
    
   dispatch(setAnswer({
      id,
      value: answers[index],
      index,
      cardId
    }))
   setAnswers(["", "", ""])

  };


  const deletePost = () => {
    console.log("delete post")
  }
  const updatePost = () => {
    console.log("update post")
  }


  return (
    <div className="card">
      {/* IMAGE */}
      <div className="imageWrapper">
        <SquaresLayout data={card}  />
      </div>

      {/* INFO */}
      <div className="info">
        <span className="date">📅 {createdAt}</span>

        <div className="stats">
          <span className="right">✔ {7}</span>
          <span className="wrong">✖ {4}</span>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="buttons">
        <button className="btn delete" onClick={deletePost}>
          Delete
        </button>

        <button className="btn update" onClick={updatePost}>
          Update
        </button>

        <button
          className="btn solve"
          onClick={() => setExpanded((p) => !p)}
        >
          {expanded ? "Close" : "Solve"}
        </button>
      </div>

      {/* EXPANDED AREA */}
      {expanded && (
        <div className="solveArea">
          {card.rects.map((rect, index) => (
            <div key={rect.id} className="inputRow">
              <input
                className="input"
                placeholder={rect.field2}
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