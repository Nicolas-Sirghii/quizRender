import { useState } from "react";
import "./Display_card_styles.css"
import { oneCard } from "../data/oneCard";

export function CardElement({
  createdAt = new Date().toLocaleString(),


  onSolveSubmit,
}) {


  const [expanded, setExpanded] = useState(false);
  const [answers, setAnswers] = useState(["", "", ""]);

  const handleChange = (id, value) => {
    const copy = [...answers];
    copy[id] = value;
    setAnswers(copy);
  };

  const handleSubmit = (id) => {
    console.log("SUBMIT:", {
      id,
      value: answers[id],
    });

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
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZLWKJBYIyWPCVVi2ZtdZ_TLu2Cfs4n5hg5Q&s" alt="card" className="image" />
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
          {oneCard.rects.map((rect, index) => (
            <div key={rect.id} className="inputRow">
              <input
                className="input"
                placeholder={rect.field2}
                value={answers[index] ?? ""}
                onChange={(e) => handleChange(index, e.target.value)}
              />
              <button
                className="submitBtn"
                onClick={() => handleSubmit(index)}
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