import { createSlice } from "@reduxjs/toolkit";

const cardSlice = createSlice({
  name: "cardSlice",
  initialState: {
    api: "/api",
    cards: JSON.parse(localStorage.getItem("userCards")) || [], 
    loadingApi: false,
    image: null,
    ratio: 2,
    rects: [],
    rectCount: 1,
    activeId: null,
    questionPopup: false,
    questionPopupMessage: "",
    rightAnswerPopup: false,
    deletePopup: false,
    deleteId: null,
    rightAnswer: "",
    updateCard: false,
    updateCardId: null,
    dropDownMenu: false,
    rId: ""

  },
  reducers: {
    setLoadingApi: (state, action) => {
      state.loadingApi = action.payload;
    },
    clearCreate: (state) => {
      state.image = "/imagePlaceholder6.jpg";
      state.rects = [];
      state.rectCount = 1;
      
    },
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

      const { id, field, value } = action.payload;
      state.rects = state.rects.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      )
    },
    setActiveId: (state, action) => {
      state.activeId = action.payload;
    },
    setAnswer: (state, action) => {
       

      state.cards.map((elem) => {
        if (elem.id == action.payload.cardId) {
          let deletedSomething = false;

          elem.rects = elem.rects.filter((r) => {
            const userValue = action.payload.value || "a"
            const emptyAnswer = r.answer || "a"
            const shouldDelete =
              r.id === action.payload.id &&
              userValue.toLowerCase() === emptyAnswer.toLowerCase();

            if (shouldDelete) {
              deletedSomething = true;
            }

            return !shouldDelete;
          });

          // 👉 run ONCE
          if (deletedSomething) {
            console.log("Something was deleted");
          } else {
            console.log("Nothing matched");
            state.rightAnswerPopup = true;
            elem.wrong += 1;
          }
        }

      })
    },
    setQuestionPopup: (state, action) => {
      
     
        state.questionPopup = !state.questionPopup;
     
         
      
      state.questionPopupMessage = action.payload.question;
      state.rId = action.payload.id;

    },
    setDeleteCard: (state, action) => {
      state.cards = state.cards.filter((el) => {
        return el.id !== action.payload;
      })
      localStorage.setItem("userCards", JSON.stringify(state.cards));

    },
    setRight: (state, action) => {

      state.cards.map((elem) => {
        if (elem.id == action.payload)
          elem.right = elem.right + 1
      })
    },
    setRightAnswer: (state) => {
      state.rightAnswerPopup = false;


    },
    answerMessage: (state, action) => {
      const { cardId, id } = action.payload;
      state.cards.forEach((elem) => {
        if (elem.id == cardId) {
          elem.rects.forEach((el) => {
            if (el.id == id) {
              state.rightAnswer = el.answer;
            }
          })
        }
      })
    },
    deleteCard: (state, action) => {
      state.cards = state.cards.filter((elem) => {
        return elem.id != action.payload;
      })
      
    },
    deleteLast: (state) => {
      state.rects.pop()
    },
    setCount: (state) => {
      state.rectCount = state.rects.length + 1;
    },
    updateElem: (state, action) => {
      const a = state.cards.filter((elem) => {
        return elem.id == action.payload;
      })
      state.rects = a[0].rects;
      state.image = a[0].image;
      state.rectCount = a[0].rects.length + 1;
      state.updateCard = true;
      state.updateCardId = action.payload
      state.ratio = a[0].ratio;
    },

    createCard: (state, action) => {
      state.cards = [action.payload, ...state.cards];
    },
    updateExist: (state, action) => {
      state.cards = state.cards.map(elem =>
        elem.id === state.updateCardId ? action.payload : elem
      );
      state.updateCard = false;
      localStorage.setItem("userCards", JSON.stringify(state.cards));
    },
    setDeletePopup: (state, action) => {
      const {status, id} = action.payload;
      if(status == "open"){
        state.deletePopup = true;
        state.deleteId = id;
      }
      if(status == "close"){
        state.deletePopup = false;
        state.deleteId = id;
      }
      if(status == "delete"){
        state.deletePopup = false;
         state.cards = state.cards.filter((elem) => {
        return elem.id != state.deleteId;
      })
      state.deleteId = id;
      }
      localStorage.setItem("userCards", JSON.stringify(state.cards));
    },
    setDropDownMenu: (state) => {
      state.dropDownMenu = !state.dropDownMenu;
    },
    setCards: (state, action) => {
    state.cards = action.payload;
  },

  appendCards: (state, action) => {
    state.cards = [...state.cards, ...action.payload];
  },

  clearCards: (state) => {
    state.cards = [];
  },
  },
});

export const { increment, setImage, setRatio, setAddRect, setModifyRect,
  setFilterRect, setUpdateField, setActiveId, setAnswer, setQuestionPopup,
  setDeleteCard, setRight, setRightAnswer, answerMessage, deleteCard, deleteLast, setCount, updateElem,
  createCard, updateExist, clearCreate, setDeletePopup, setDropDownMenu, appendCards, setCards,
  clearCards, setLoadingApi
} = cardSlice.actions;
export default cardSlice.reducer;