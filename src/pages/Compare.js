import React from "react";
import { useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";

const Compare = () => {
  const compareList = useSelector((state) => state.product.compareList);
  console.log("🚀 ~ Compare ~ compareList:", compareList);

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
                  {product.price.toLocaleString("vi-VN")}đ
                </td>
              ))}
            </tr>
            <tr>
              <td>Hình ảnh</td>
              {compareList.map((product) => (
                <td key={product._id}>
                  <img
                    src={product?.images[0]}
                    style={{ width: "300px", height: "200px" }}
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td>Danh mục</td>
              {compareList.map((product) => (
                <td key={product._id}>{product.category}</td>
              ))}
            </tr>
            <tr>
              <td>Đánh giá</td>
              {compareList.map((product) => (
                <td key={product._id}>
                  <ReactStars
                    count={5}
                    size={24}
                    value={product.totalrating}
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
