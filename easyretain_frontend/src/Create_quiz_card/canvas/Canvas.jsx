import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImage, setRatio, setActiveId, setAddRect, setModifyRect, setFilterRect, setUpdateField, setCount} from "../../redux/slices/cardSlice";
 import { InputsContainer } from "./inputsContainer/InputsContainer";
 

export function ImageCanvasEditor() {
  const dispatch = useDispatch();
    const { image, ratio, activeId, rects, rectCount, updateCard } = useSelector((state) => state.card_state);
   
    
  const containerRef = useRef(null);
  
  
     
  
  
  const mode = useRef("idle");
  const start = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const pointerId = useRef(null);

  const createId = () => crypto.randomUUID();


  // ---------------- IMAGE LOAD ----------------
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
     dispatch(setRatio(img.width / img.height));
     dispatch(setImage(url)) 
    };

    img.src = url;
  };

  const getPercent = (e) => {
    const rect = containerRef.current.getBoundingClientRect();

    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  // ---------------- CREATE RECT ----------------
  const onPointerDownCanvas = (e) => {
    
    if (e.target.dataset.type) return;
    if ((!image) || (image == "/imagePlaceholder6.jpg")) return;

    const { x, y } = getPercent(e);

    start.current = { x, y };
    const id = createId();

   
    dispatch(setAddRect({
        id,
        x,
        y,
        width: 0,
        height: 0,
        answer: "",
        question: "",
        num: rectCount,

      }))
      
     
    dispatch(setActiveId(id));
    mode.current = "draw";

    pointerId.current = e.pointerId;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  // ---------------- MOVE ----------------
  const onPointerMove = (e) => {
     dispatch(setCount(1))
    if (pointerId.current !== e.pointerId) return;

    const { x: mx, y: my } = getPercent(e);

    dispatch(setModifyRect({ mode, mx, my, start, offset }))
  };

  const onPointerUp = () => {
    mode.current = "idle";
    pointerId.current = null;

    dispatch(setFilterRect())
  };

  const startDrag = (e, r) => {
    
    e.stopPropagation();

    dispatch(setActiveId(r.id));
    mode.current = "drag";

    const { x, y } = getPercent(e);

    offset.current = {
      x: x - r.x,
      y: y - r.y,
    };

    pointerId.current = e.pointerId;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const startResize = (e, r) => {
    e.stopPropagation();

    dispatch(setActiveId(r.id));
    mode.current = "resize";

    pointerId.current = e.pointerId;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

 

  return (
    <div
      style={{ position: "relative" }}
    >
     {!updateCard && <input type="file" className="fileInput"  onChange={handleImage} />}  
      


      {/* CANVAS */}
      <div
        ref={containerRef}
        onPointerDown={onPointerDownCanvas}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          width: "100%",
          // border: "1px solid red",
          height: "auto",
          aspectRatio: ratio,
          position: "relative",
          overflow: "hidden",
          userSelect: "none",
          touchAction: "none",
          backgroundImage: image ? `url(${image})` : "url(/imagePlaceholder6.jpg)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {rects.map((r) => (
          <div
            key={r.id}
            data-type="box"
            onPointerDown={(e) => startDrag(e, r)}
            style={{
              position: "absolute",
              left: `${r.x}%`,
              top: `${r.y}%`,
              width: `${r.width}%`,
              height: `${r.height}%`,
              background:
                r.id === activeId
                  ? "rgba(255,0,0,0.5)"
                  : "rgba(255,0,0,1)",
              borderRadius: 12,
              color: "white",
              fontSize: 10,
              padding: 4,
              boxSizing: "border-box",
              outline:
                r.id === activeId
                  ? "2px solid black"
                  : "none",
              touchAction: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >{r.num}
            <div
              data-type="resize"
              onPointerDown={(e) => startResize(e, r)}
              style={{
                width: 16,
                height: 16,
                background: "black",
                position: "absolute",
                right: 2,
                bottom: 2,
                borderRadius: 8,
              }}
            />
          </div>
        ))}
        
      </div>

      {/* INPUTS */}
      <InputsContainer/>
    </div>
  );
}