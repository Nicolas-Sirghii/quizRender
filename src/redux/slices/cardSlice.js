import { createSlice } from "@reduxjs/toolkit";

const cardSlice = createSlice({
  name: "cardSlice",
  initialState: {
    value: 0,
    image: null,
    ratio: 2,
    rects: [],
    activeId: null
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    setImage: (state, action) => {
      state.image = action.payload
    },
    setRatio: (state, action) => {
      state.ratio = action.payload;
    },
    setAddRect: (state, action) => {
     state.rects = [...state.rects, action.payload];
     
    
    },
    setModifyRect: (state, action) => {
      const { mode, mx, my, start, offset } = action.payload;
      const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
     
       state.rects = state.rects.map((r) => {
        if (r.id !== state.activeId) return r;

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
    

    },
    setFilterRect: (state) => {
      const prev = state.rects
      state.rects = prev.filter((r) => r.width > 1 && r.height > 1);
       
    },
    setUpdateField: (state, action) => {
      const prev = state.rects;
      const {id, field, value} = action.payload;
       state.rects = prev.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      )
    },
    setActiveId: (state, action) => {
      state.activeId = action.payload;
    }
  },
});

export const { increment, setImage, setRatio, setAddRect, setModifyRect,
setFilterRect, setUpdateField, setActiveId
 } = cardSlice.actions;
export default cardSlice.reducer;