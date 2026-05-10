
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { ImageCanvasEditor } from "./canvas/Canvas";
import { deleteLast, setCount, createCard, updateExist, setLoadingApi, clearCreate } from "../redux/slices/cardSlice";

export function CreateCardElement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { image, ratio, rects, updateCard, updateCardId } = useSelector((state) => state.card_state);
  const { path } = useSelector((state) => state.path);


  const deleteLastSquare = () => {
    console.log("dlelte last square")
    dispatch(deleteLast())
    dispatch(setCount(-1))
  }
  const createNewCard = () => {
    dispatch(clearCreate())
    const sendCard = async () => {
      if (!image || image === "/imagePlaceholder6.jpg") return;

      const formData = new FormData();

      // blob URL → File
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], "card.png", { type: blob.type });

      formData.append("image", file);
      formData.append("ratio", ratio);
      formData.append("rects", JSON.stringify(rects));

      const token = localStorage.getItem("jwt");
      dispatch(setLoadingApi(true))
      const res = await fetch(`${path}/cards/create`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      console.log("CARD CREATED:", data);
      localStorage.setItem("changes_made", "1")
      dispatch(setLoadingApi(false))
    };
    sendCard()
    dispatch(createCard({
      id: crypto.randomUUID(),
      created: "today",
      right: 0,
      wrong: 0,
      image,
      ratio,
      rects,
    }))


    navigate("/")
  }
  function updateExistingCard() {
    dispatch(updateExist({
      id: updateCardId,
      created: "today",
      right: 0,
      wrong: 0,
      image,
      ratio,
      rects,
    }))
    navigate("/")

    const updateCard = async (cardId, rects) => {
      try {
        const token = localStorage.getItem("jwt");

        const formData = new FormData();
        formData.append("rects", JSON.stringify(rects));

        const response = await fetch(`${path}/cards/update/${cardId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to update card");
        }

        console.log("Updated successfully:", data);

        return data;
      } catch (error) {
        console.error("Update error:", error.message);
      }
    };
   updateCard(updateCardId, rects)


    // console.log(updateCardId)
    // console.log(rects)
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <div className="card">
        <div className="imageWrapper">
          <ImageCanvasEditor />
        </div>
        {
          (image && image != "/imagePlaceholder6.jpg") &&
          <div className="buttons">
            {(rects.length != 0) &&
              <button className="btn delete" onClick={deleteLastSquare}>
                Delete
              </button>
            }
            {
              updateCard ?
                <button className="btn update" onClick={updateExistingCard}>
                  Update
                </button>
                :

                <button className="btn solve" onClick={createNewCard}>
                  Create
                </button>

            }


          </div>
        }

      </div>
    </div>
  );
}