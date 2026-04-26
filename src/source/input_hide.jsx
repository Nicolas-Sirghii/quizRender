import { useRef, useState } from "react";
import "./input_hide.css";

export  function ImagePicker() {
  const inputRef = useRef(null);
  const [image, setImage] = useState(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImage(url);
  };

  return (
    <div
      className="image-picker"
      onClick={handleClick}
      style={{
        backgroundImage: image ? `url(${image})` : "none",
      }}
    >
      {!image && <span>Click to add the image</span>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
}