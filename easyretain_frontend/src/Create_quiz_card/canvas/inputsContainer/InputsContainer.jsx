
import { useDispatch, useSelector } from "react-redux";
import { setUpdateField } from "../../../redux/slices/cardSlice";

export function InputsContainer() {
    const { image, ratio, activeId, rects } = useSelector((state) => state.card_state);

    const dispatch = useDispatch();

     const updateField = (id, field, value) => {
        dispatch(setUpdateField({id, field, value}))
      };

    return (
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
              marginBottom: 10,
            }}
          >
            <input
              className="input-create"
              placeholder="Set the answer."
              value={r.answer}
              onChange={(e) =>
                updateField(r.id, "answer", e.target.value)
              }
            />
            <div>{r.num}</div>

            <input
              className="input-create"
              placeholder="Set the question."
              value={r.question}
              onChange={(e) =>
                updateField(r.id, "question", e.target.value)
              }
            />
          </div>
        ))}
        
      </div>
    )
}