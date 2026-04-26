import { useRef, useState } from "react";


export function ImageCanvasEditor2() {
  const containerRef = useRef(null);

  const [image, setImage] = useState(null);
  const [ratio, setRatio] = useState(1);

  const [rects, setRects] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // ---------------- NEW OVERLAY STATE ----------------
  const [overlay, setOverlay] = useState(false);
  const showTimer = useRef(null);
  const hideTimer = useRef(null);

  const mode = useRef("idle");
  const start = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const pointerId = useRef(null);

  const createId = () => Date.now() + Math.random();

  // ---------------- OVERLAY HOLD LOGIC ----------------
  const handleOverlayPointerDown = () => {
    if (!overlay) {
      showTimer.current = setTimeout(() => {
        setOverlay(true);
      }, 3000);
    } else {
      hideTimer.current = setTimeout(() => {
        setOverlay(false);
      }, 1000);
    }
  };

  const handleOverlayPointerUp = () => {
    clearTimeout(showTimer.current);
    clearTimeout(hideTimer.current);
  };

  // ---------------- IMAGE LOAD ----------------
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      setRatio(img.width / img.height);
      setImage(url);
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

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // ---------------- CREATE RECT ----------------
  const onPointerDownCanvas = (e) => {
    if (e.target.dataset.type) return;
    if (!image) return;

    const { x, y } = getPercent(e);

    start.current = { x, y };

    const id = createId();

    setRects((prev) => [
      ...prev,
      {
        id,
        x,
        y,
        width: 0,
        height: 0,
        field1: "",
        field2: "",
      },
    ]);

    setActiveId(id);
    mode.current = "draw";

    pointerId.current = e.pointerId;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  // ---------------- MOVE ----------------
  const onPointerMove = (e) => {
    if (pointerId.current !== e.pointerId) return;

    const { x: mx, y: my } = getPercent(e);

    setRects((prev) =>
      prev.map((r) => {
        if (r.id !== activeId) return r;

        if (mode.current === "draw") {
          const width = Math.abs(mx - start.current.x);
          const height = Math.abs(my - start.current.y);

          if (width < 1 || height < 1) return r;

          return {
            ...r,
            x: Math.min(mx, start.current.x),
            y: Math.min(my, start.current.y),
            width,
            height,
          };
        }

        if (mode.current === "drag") {
          const newX = mx - offset.current.x;
          const newY = my - offset.current.y;

          return {
            ...r,
            x: clamp(newX, 0, 100 - r.width),
            y: clamp(newY, 0, 100 - r.height),
          };
        }

        if (mode.current === "resize") {
          return {
            ...r,
            width: clamp(mx - r.x, 2, 100 - r.x),
            height: clamp(my - r.y, 2, 100 - r.y),
          };
        }

        return r;
      })
    );
  };

  const onPointerUp = () => {
    mode.current = "idle";
    pointerId.current = null;

    setRects((prev) => prev.filter((r) => r.width > 1 && r.height > 1));
  };

  const startDrag = (e, r) => {
    e.stopPropagation();

    setActiveId(r.id);
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

    setActiveId(r.id);
    mode.current = "resize";

    pointerId.current = e.pointerId;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const updateField = (id, field, value) => {
    setRects((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      )
    );
  };

  const handleSubmit = () => {
    console.log(
      JSON.stringify(
        {
          image,
          ratio,
          rects,
        },
        null,
        2
      )
    );
  };

  return (
    <div
      onPointerDown={handleOverlayPointerDown}
      onPointerUp={handleOverlayPointerUp}
      style={{ position: "relative" }}
    >
      <input type="file" onChange={handleImage} />

      {/* OVERLAY */}
      {overlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backdropFilter: "blur(8px)",
            background: "rgba(0,0,0,0.2)",
            zIndex: 9999,
          }}
        />
      )}

      {/* CANVAS */}
      <div
        ref={containerRef}
        onPointerDown={onPointerDownCanvas}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          width: "100%",
          aspectRatio: ratio,
          position: "relative",
          overflow: "hidden",
          userSelect: "none",
          touchAction: "none",
          backgroundImage: image ? `url(${image})` : "none",
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
                  ? "2px solid white"
                  : "none",
              touchAction: "none",
            }}
          >
            <div
              data-type="resize"
              onPointerDown={(e) => startResize(e, r)}
              style={{
                width: 16,
                height: 16,
                background: "white",
                position: "absolute",
                right: 2,
                bottom: 2,
                borderRadius: 4,
              }}
            />
          </div>
        ))}
      </div>

      {/* INPUTS */}
      <div style={{ marginTop: 20 }}>
        {rects.map((r) => (
          <div
            key={r.id}
            style={{
              padding: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              border:
                r.id === activeId
                  ? "2px solid red"
                  : "1px solid #ccc",
              marginBottom: 10,
            }}
          >
            <input
              placeholder="Field 1"
              value={r.field1}
              onChange={(e) =>
                updateField(r.id, "field1", e.target.value)
              }
            />

            <input
              placeholder="Field 2"
              value={r.field2}
              onChange={(e) =>
                updateField(r.id, "field2", e.target.value)
              }
            />
          </div>
        ))}

        {rects.length > 0 && (
          <button onClick={handleSubmit}>
            Export Layout
          </button>
        )}
      </div>
    </div>
  );
}