

export function CreateCardElement() {

  const deleteLastSquare = () => {
    console.log("dlelte last square")
  }
  const createNewCard = () => {
    console.log("createNewCard")
  }

  return (
    <div className="card">

      <div className="imageWrapper">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZLWKJBYIyWPCVVi2ZtdZ_TLu2Cfs4n5hg5Q&s" alt="card" className="image" />
      </div>

      <div className="buttons">
        <button className="btn delete" onClick={deleteLastSquare}>
          Delete
        </button>

        <button className="btn solve" onClick={createNewCard}>
          Create
        </button>
      </div>

    </div>
  );
}