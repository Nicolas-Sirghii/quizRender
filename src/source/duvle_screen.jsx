import { useEffect, useState } from "react";
import "./TouchCounter.css";

export function TouchCounter() {
  const [touches, setTouches] = useState(0);

  useEffect(() => {
    const updateTouches = (e) => {
      setTouches(e.touches.length);
    };

    const resetTouches = () => {
      setTouches(0);
    };

    window.addEventListener("touchstart", updateTouches);
    window.addEventListener("touchmove", updateTouches);
    window.addEventListener("touchend", updateTouches);
    window.addEventListener("touchcancel", resetTouches);

    return () => {
      window.removeEventListener("touchstart", updateTouches);
      window.removeEventListener("touchmove", updateTouches);
      window.removeEventListener("touchend", updateTouches);
      window.removeEventListener("touchcancel", resetTouches);
    };
  }, []);

  return (
    <div className="touch-counter">
      👆 {touches}
    </div>
  );
}