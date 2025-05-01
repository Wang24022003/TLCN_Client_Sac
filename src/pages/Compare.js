import React from "react";
import { useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";

const Compare = () => {
  const compareList = useSelector((state) => state.product.compareList);

  const getPriceRangeFromVariants = (product) => {
    const variants = product?.inventory?.productVariants;
  
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return "Đang cập nhật giá";
    }
  
    const prices = variants
      .map((v) => v.sellPrice)
      .filter((p) => p !== undefined && p !== null);
  
    if (prices.length === 0) return "Đang cập nhật giá";
  
    const min = Math.min(...prices);
    const max = Math.max(...prices);
  
    return min === max
      ? `${min.toLocaleString("vi-VN")} ₫`
      : `${min.toLocaleString("vi-VN")} ₫ - ${max.toLocaleString("vi-VN")} ₫`;
  };

  
  return (
    <div className="container py-5">
      <h2>So sánh sản phẩm</h2>
      {compareList.length === 0 ? (
        <p>Không có sản phẩm nào để so sánh</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Thuộc tính</th>
              {compareList.map((product) => (
                <th key={product._id}>{product.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Giá</td>
              {compareList.map((product) => (
                <td key={product._id}>
                {getPriceRangeFromVariants(product)}
                </td>
              ))}
            </tr>
            <tr>
              <td>Hình ảnh</td>
              {compareList.map((product) => (
                <td key={product._id}>
                <img
                  src={product?.images[0]}
                  alt={product.name}
                  className="img-fluid"
                  style={{ maxHeight: "200px", objectFit: "contain" }}
                />
                </td>
              ))}
            </tr>
            <tr>
              <td>Màu sắc</td>
              {compareList.map((product) => (
                <td key={product._id}>
                  {product.inventory?.productVariants?.length > 0 ? (
                    [...new Set(
                      product.inventory.productVariants
                        .map((v) => v.attributes?.color?.name || v.attributes?.color)
                        .filter((color) => color && color.trim() !== "") // ❗ bỏ rỗng
                    )].length > 0 ? (
                      [...new Set(
                        product.inventory.productVariants
                          .map((v) => v.attributes?.color?.name || v.attributes?.color)
                          .filter((color) => color && color.trim() !== "")
                      )].map((color, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: "inline-block",
                            width: "20px",
                            height: "20px",
                            backgroundColor: color,
                            border: "1px solid #ccc",
                            borderRadius: "50%",
                            marginRight: "8px",
                            verticalAlign: "middle"
                          }}
                          title={color}
                        ></span>
                      ))
                    ) : (
                      <span>Không có màu</span>
                    )
                  ) : (
                    <span>Không có màu</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td>Kích thước</td>
              {compareList.map((product) => {
                const sizes = product.inventory?.productVariants?.map(
                  (v) => v.attributes?.size?.name || v.attributes?.size
                ).filter((size) => size && String(size).trim() !== "");

                const uniqueSizes = [...new Set(sizes)];

                return (
                  <td key={product._id}>
                    {uniqueSizes.length > 0 ? (
                      uniqueSizes.map((size, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            marginRight: "6px",
                            fontSize: "0.9rem"
                          }}
                        >
                          {size}
                        </span>
                      ))
                    ) : (
                      "Không có kích thước"
                    )}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td>Danh mục</td>
              {compareList.map((product) => (
                <td key={product._id}>{product.category?.name}</td>
              ))}
            </tr>
            <tr>
              <td>Đánh giá</td>
              {compareList.map((product) => (
                <td key={product._id}>
                  <ReactStars
                    count={+5}
                    size={24}
                    value={+product?.totalrating}
                    edit={false}
                    activeColor="#ffd700"
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td>Chi tiết</td>
              {compareList.map((product) => (
                <td key={product._id}>
                  {product.title === "iPhone 15 Pro Max" ? (
                    <div>
                      <p>
                        <strong>Đặc điểm nổi bật của iPhone 15 Pro Max:</strong>
                      </p>
                      <p>
                        • Tăng độ cứng cáp và tối ưu khối lượng với chất liệu
                        Titan
                      </p>
                      <p>
                        • Bứt phá mọi giới hạn về hiệu năng nhờ chip A17 Pro
                      </p>
                      <p>• Phiên bản duy nhất cải tiến camera tele 5x</p>
                      <p>• Tích hợp camera 48 MP</p>
                      <p>• Nút tác vụ (Action Button) thay thế cần gạt rung</p>
                      <p>
                        • Chuyển đổi cổng sạc USB-C, truyền tải dữ liệu tốc độ
                        cao
                      </p>
                    </div>
                  ) : (
                    <p
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    ></p>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Compare;
