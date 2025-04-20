import React, { useState } from "react";

const Color = ({ colorData, setColor }) => {
  const [selectedColor, setSelectedColor] = useState(null);

  const handleColorClick = (color) => {
    setSelectedColor(color._id);
    setColor(color);
  };

  return (
    <div className="color-selection" style={{ display: "flex", alignItems: "center" }}>
      <span style={{ marginRight: "10px" }}>
        Màu:{" "}
        {selectedColor
          ? colorData.find((c) => c._id === selectedColor)?.color
          : "Chưa chọn"}
      </span>
      <ul className="colors" style={{ display: "flex", padding: 0, margin: 0 }}>
        {colorData?.map((item, index) => (
          <li
            key={index}
            onClick={() => handleColorClick(item)}
            style={{
              backgroundColor: item.color,
              border: selectedColor === item._id ? "2px solid black" : "1px solid #ccc",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              cursor: "pointer",
              margin: "0 5px",
              boxShadow:
                selectedColor === item._id ? "0 0 5px rgba(0, 0, 0, 0.5)" : "none",
            }}
          />
        ))}
      </ul>
      {selectedColor && (
        <button
          onClick={() => {
            setSelectedColor(null);
            setColor(null);
          }}
          style={{
            marginLeft: "10px",
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "14px",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#d32f2f")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#f44336")}
        >
          × Clear
        </button>
      )}
    </div>
  );
};

export default Color;
