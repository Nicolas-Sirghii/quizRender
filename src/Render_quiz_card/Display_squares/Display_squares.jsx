import { useDispatch, useSelector } from "react-redux";
import { setQuestionPopup } from "../../redux/slices/cardSlice";

export function SquaresLayout({ data }) {
  const dispatch = useDispatch();

  const showQuestion = (r) => {
    dispatch(setQuestionPopup({set: 1, question: r}))
  }

  const {  ratio, rects } = data;
  return (
    
    <div
      style={{
        width: "100%",
        aspectRatio: ratio,
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${data.image})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {rects.map((r, i) => (
        <div
          onClick={ () => showQuestion(r.field2)}
          key={r.id}
          style={{
            cursor: "pointer",
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "50%",
            left: `${r.x}%`,
            top: `${r.y}%`,
            width: `${r.width}%`,
            height: `${r.height}%`,
            background: "rgba(255, 0, 0, 1)",
            border: "2px solid rgb(48, 45, 45)",
            borderRadius: 10,
            boxSizing: "border-box",
          }}
        >
          {/* optional labels */}
          {(r.field2) && (
           r.num
          )}
        </div>
      ))}
    </div>
    
    
  );
}