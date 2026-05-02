
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
              className="input"
              placeholder="Set the answer."
              value={r.field1}
              onChange={(e) =>
                updateField(r.id, "field1", e.target.value)
              }
            />

            <input
              className="input"
              placeholder="Set the question."
              value={r.field2}
              onChange={(e) =>
                updateField(r.id, "field2", e.target.value)
              }
            />
          </div>
        ))}
        
      </div>
    )
}