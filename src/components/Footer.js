import React from "react";
import { Link } from "react-router-dom";
import { BsLinkedin, BsGithub, BsYoutube, BsInstagram } from "react-icons/bs";
import newsletter from "../images/newsletter.png";
import "./../Css/CssFooter.css";

const Footer = () => {
  return (
<footer className="footer-gradient-bg text-white position-relative">
      {/* LỚP ẢNH MỜ TRÊN NỀN ĐEN */}
      <div
        className="footer-overlay"
        style={{
          backgroundImage: `url("/images/BRF.png")`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          opacity: 0.2,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      ></div>

      {/* NỘI DUNG FOOTER */}
      <div className="position-relative" style={{ zIndex: 1 }}>
        {/* Phần 1 */}
        <div className="py-4">
          <div className="container-xxl">
            <div className="row align-items-center">
              <div className="col-5">
                <div className="footer-top-data d-flex gap-30 align-items-center">
                  <img src={newsletter} alt="newsletter" />
                  <h2 className="mb-0 text-white">Đăng ký nhận bản tin</h2>
                </div>
              </div>
              <div className="col-7">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control py-1"
                    placeholder="Nhập gmail ở đây"
                    aria-label="Your Email Address"
                    aria-describedby="basic-addon2"
                  />
                 <span
                    className="input-group-text p-2"
                    id="basic-addon2"
                    style={{
                      backgroundColor: "rgba(128, 128, 128, 0.5)", // Màu xám trong suốt
                      color: "white",
                      border: "1px solid white", // tuỳ chọn, để viền rõ hơn
                      backdropFilter: "blur(2px)", // tuỳ chọn, làm mờ nền sau nút nếu cần
                    }}
                  >
                    Đăng ký
                  </span>

                </div>
              </div>
            </div>
          </div>
        </div>
        <hr style={{ backgroundColor: "white", height: "2px", opacity: 0.5, margin: 0 }} />
        {/* Phần 2 */}
        <div className="py-4">
          <div className="container-xxl">
            <div className="row">
              <div className="col-4">
                <h4 className="text-white mb-4">Liên hệ với chúng tôi</h4>
                <address className="text-white fs-6">
                  Địa chỉ : 1 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP.HCM
                </address>
                <a href="tel:+84971035440" className="d-block text-white mb-1">
                  +84 971035440
                </a>
                <a
                  href="mailto:quangle.24022003@gmail.com"
                  className="d-block text-white mb-1"
                >
                  quangle.24022003@gmail.com
                </a>
                <div className="social_icons d-flex gap-30 mt-3">
                  <a className="text-white" href="#">
                    <BsLinkedin className="fs-4" />
                  </a>
                  <a className="text-white" href="#">
                    <BsInstagram className="fs-4" />
                  </a>
                  <a className="text-white" href="#">
                    <BsGithub className="fs-4" />
                  </a>
                  <a className="text-white" href="#">
                    <BsYoutube className="fs-4" />
                  </a>
                </div>
              </div>
              <div className="col-3">
                <h4 className="text-white mb-4">Thông tin</h4>
                <div className="footer-link d-flex flex-column">
                  <Link to="/privacy-policy" className="text-white py-2">
                    Chính sách bảo hành
                  </Link>
                  <Link to="/refund-policy" className="text-white py-2">
                    Chính sách hoàn trả
                  </Link>
                  <Link to="/shipping-policy" className="text-white py-2">
                    Chính sách vận chuyển
                  </Link>
                  <Link to="/term-conditions" className="text-white py-2">
                    Điều khoản & dịch vụ
                  </Link>
                  <Link to="/blogs" className="text-white py-2">
                    Bài viết
                  </Link>
                </div>
              </div>
              <div className="col-3">
                <h4 className="text-white mb-4">Tài khoản</h4>
                <div className="footer-link d-flex flex-column">
                  <Link to="/contact" className="text-white py-2">
                    Liên hệ
                  </Link>
                  <Link className="text-white py-2">Câu hỏi thường gặp</Link>
                  <Link className="text-white py-2">Về chúng tôi</Link>
                </div>
              </div>
              <div className="col-2">
                <h4 className="text-white mb-4">Liên kết nhanh</h4>
                <div className="footer-link d-flex flex-column">
                  <Link className="text-white py-2">Hoàng Bào</Link>
                  <Link className="text-white py-2">Áo Dài</Link>
                  <Link className="text-white py-2">Áo Nhật Bình</Link>
                  <Link className="text-white py-2">Áo Ngũ Thân</Link>
                  <Link className="text-white py-2">Áo Giao Lĩnh</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr style={{ backgroundColor: "white", height: "2px", opacity: 0.5, margin: 0 }} />
        {/* Phần 3 */}
        <div className="py-3">
          <div className="container-xxl">
            <div className="row">
              <div className="col-12">
                <p className="text-center text-white mb-0">
                  &copy; {new Date().getFullYear()} - Được phát triển bởi Sắc
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
