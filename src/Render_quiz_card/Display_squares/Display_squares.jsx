import { useSelector } from "react-redux";

export function SquaresLayout({ data }) {
  const { image } = useSelector((state) => state.card_state);
  const {  ratio, rects } = data;
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: ratio,
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${image})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {rects.map((r) => (
        <div
          key={r.id}
          style={{
            position: "absolute",
            left: `${r.x}%`,
            top: `${r.y}%`,
            width: `${r.width}%`,
            height: `${r.height}%`,
            background: "rgba(255, 0, 0, 0.6)", // semi-transparent overlay
            border: "1px solid rgba(255,255,255,0.6)",
            borderRadius: 10,
            boxSizing: "border-box",
          }}
        >
          {/* optional labels */}
          {(r.field1 || r.field2) && (
            <div
              style={{
                color: "white",
                fontSize: 10,
                padding: 4,
              }}
            >
              <div>{r.field1}</div>
              <div>{r.field2}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}