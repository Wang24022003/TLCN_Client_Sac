import React from "react";

const SizeSelect = ({ sizes, selectedSize, onSelectSize }) => {
  return (
    <div>
      <span style={{ marginRight: "10px" }}>Kích thước: {selectedSize || "Chưa chọn"}</span>
      <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
        {sizes.map((size, index) => (
          <button
            key={index}
            onClick={() => onSelectSize(size)}
            style={{
              padding: "5px 10px",
              border: selectedSize === size ? "2px solid black" : "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: selectedSize === size ? "#000" : "#fff",
              color: selectedSize === size ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            {size.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelect;
