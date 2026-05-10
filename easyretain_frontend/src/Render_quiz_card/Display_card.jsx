import { useEffect, useState } from "react";
import "./Display_card_styles.css"
import { useNavigate } from "react-router-dom";

import { SquaresLayout } from "./Display_squares/Display_squares";
import { useDispatch, useSelector } from "react-redux";
import { setAnswer, setDeleteCard, setRight, answerMessage, deleteCard, updateElem, setDeletePopup, setSend } from "../redux/slices/cardSlice";

export function CardElement({

  createdAt = new Date().toLocaleString(),

  card

}) {


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cards, rects, rightSend, wrongSend} = useSelector((state) => state.card_state);
  const { path } = useSelector((state) => state.path);
  // const card = cards[0]

  const updateCardStats = async (cardId, result) => {
  try {
    const token = localStorage.getItem("jwt");

    const formData = new FormData();
    formData.append("card_id", cardId);
    formData.append("result", result); // "right" or "wrong"

    const response = await fetch(`${path}/cards/update-stats`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to update card stats");
    }

    console.log("Stats updated successfully:", data);

    return data;
  } catch (error) {
    console.error("Update stats error:", error.message);
  }
};

  const [expanded, setExpanded] = useState(false);
  const [answers, setAnswers] = useState(["", "", ""]);
  const [color, setColor] = useState("#111")

  const handleChange = (id, value) => {
    const copy = [...answers];
    copy[id] = value;
    setAnswers(copy);
  };

  const handleSubmit = (index, id, cardId) => {

    console.log(card)

    const data = cards.filter((el) => {
      return el.id == cardId
    })

    console.log(data[0].rects[0].answer.toLowerCase())
    console.log(answers[index].toLowerCase())


    //......................................

    
    dispatch(answerMessage({ cardId, id }))

    if ((data[0].rects.length == 1) && (data[0].rects[index].answer.toLowerCase() == answers[index].toLowerCase())) {

      dispatch(setRight(cardId))
      
      setColor("grey")
      setTimeout(() => {
        updateCardStats(card.id, "right")
        dispatch(setDeleteCard(cardId))
      }, 4000);

    }else {

      if(data[0].rects[index].answer.toLowerCase() != answers[index].toLowerCase()){
        updateCardStats(card.id, "wrong")
      }
      

    }


    dispatch(setAnswer({
      id,
      value: answers[index],
      index,
      cardId
    }))
    setAnswers(["", "", ""])




  };
//....................................

  const deletePost = (id) => {
    // dispatch(deleteCard(id))
    dispatch(setDeletePopup({ status: "open", id: id }))

  }
  const updatePost = (id) => {
    dispatch(updateElem(id))

    navigate("/createPost")
  }

  // FRONTEND (JS)







  // function rightAnswer() {
  //   updateCardStats(card.id, "right")
  // }
  // function wrongAnswer() {
  //   updateCardStats(card.id, "wrong")
  // }


// useEffect(() => {
//   rightSend && rightAnswer()
//   wrongSend && wrongAnswer()
//   console.log(rightSend)
   
//     dispatch(setSend())
  

// }, [wrongSend])

  
 


  return (
    <div className="card" style={{ background: `${color}` }}>
      {/* IMAGE */}
      <div className="imageWrapper">
        <SquaresLayout data={card} />
      </div>

      {/* INFO */}
      <div className="info">
        <span className="date">📅 {card.created.split("T")[0]}</span>

        <div className="stats">
          <span className="right">✔ {card.right}</span>
          <span className="wrong">✖ {card.wrong}</span>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="buttons">
        <button className="btn delete" onClick={() => deletePost(card.id)}>
          Delete
        </button>

        <button className="btn update" onClick={() => updatePost(card.id)}>
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
              <div className="rect-num">{rect.num}</div>
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