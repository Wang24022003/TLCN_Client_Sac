import React, { useEffect, useState } from "react";
import { RiAccountCircleLine } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";
import { FaBell, FaBorderAll, FaClipboardList, FaGift, FaHeart, FaHistory, FaList, FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";
import { authService } from "../features/user/userService";
import "./../Css/CssDashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const blogState = useSelector((state) => state?.blog?.blog || []);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const userState = useSelector((state) => state.auth.user);
  const [filterShow, setFilterShow] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard'); 

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const handleLogout = async () => {
    const re = await authService.logoutApi();
    if (re && re.data) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard/address')) {
      setSelectedMenu('address');
    } else if (path.includes('/dashboard/product-history')) {
      setSelectedMenu('product-history');
    } else if (path.includes('/dashboard/history')) {
      setSelectedMenu('history');
    } else if (path.includes('/dashboard/my-orders')) {
      setSelectedMenu('my-orders');
    } 
    else if (path.includes('/dashboard/my-reviews')) {
      setSelectedMenu('my-reviews');
    }
    else if (path.includes('/dashboard/my-wishlist')) {
      setSelectedMenu('my-wishlist');
    } else if (path.includes('/dashboard/voucher')) {
      setSelectedMenu('voucher');
    } else if (path.includes('/dashboard/notifications')) {
      setSelectedMenu('notifications');
    } else {
      setSelectedMenu('my-profile');
    }
  }, [location.pathname]);

  return (
    <div className="bg-slate-200 min-h-screen">
      <div className="w-[90%] mx-auto md-lg:block hidden py-4">
        <button onClick={() => setFilterShow(!filterShow)} className="text-center py-3 px-3 bg-green-500 text-white">
          <FaList />
        </button>
      </div>

      <div className="h-full mx-auto">
        <div className="py-5 flex md-lg:w-[90%] mx-auto relative">
          <div
            className={`rounded-md z-50 md-lg:absolute ${filterShow ? '-left-4' : '-left-[360px]'} w-[270px] ml-4 bg-white shadow-lg transition-all duration-300`}
          >
            <ul className="py-2 text-slate-600 px-4">
              {/* User Info Section */}
              <div className="flex items-center gap-3 p-4">
                <img
                  src={userState?.avatar || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-lg font-semibold">{userState?.name}</span>
              </div>

              <div
                style={{ backgroundColor: 'rgba(0, 46, 41, 1)' }}
                className="h-[2px] w-full my-2"
              />
        
              <Link
                to="/dashboard/my-profile"
                onClick={() => handleMenuClick('my-profile')}
                className="block w-full"  // ⬅️ Đây là điểm quan trọng để giữ chiều ngang
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <li
                  className={`relative flex items-center gap-2 py-3 px-4 rounded-lg cursor-pointer ${
                    selectedMenu === 'my-profile' ? 'nav-selected justify-center' : 'hover:bg-slate-100'
                  }`}
                >
                  {/* Ảnh nền bên trái */}
                  {selectedMenu === 'my-profile' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png"
                      alt="left-decor"
                      className="absolute left-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-left-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}

                  {/* Nội dung */}
                  <RiAccountCircleLine className="text-xl z-10" />
                  <span className="block z-10">Tài khoản của tôi</span>

                  {/* Ảnh nền bên phải */}
                  {selectedMenu === 'my-profile' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png"
                      alt="right-decor"
                      className="absolute right-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-right-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}
                </li>
              </Link>

              <Link
                to="/dashboard/address"
                onClick={() => handleMenuClick('address')}
                className="block w-full"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <li
                  className={`relative flex items-center gap-2 py-3 px-4 rounded-lg cursor-pointer ${
                    selectedMenu === 'address' ? 'nav-selected justify-center' : 'hover:bg-slate-100'
                  }`}
                >
                  {/* Ảnh nền bên trái */}
                  {selectedMenu === 'address' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png"
                      alt="left-decor"
                      className="absolute left-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-left-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}

                  {/* Nội dung */}
                  <FaMapMarkerAlt className="text-xl z-10" />
                  <span className="block z-10">Địa chỉ</span>

                  {/* Ảnh nền bên phải */}
                  {selectedMenu === 'address' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png"
                      alt="right-decor"
                      className="absolute right-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-right-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}
                </li>
              </Link>

              <Link
                to="/dashboard/my-orders"
                onClick={() => handleMenuClick('my-orders')}
                className="block w-full"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <li
                  className={`relative flex items-center gap-2 py-3 px-4 rounded-lg cursor-pointer ${
                    selectedMenu === 'my-orders' ? 'nav-selected justify-center' : 'hover:bg-slate-100'
                  }`}
                >
                  {/* Ảnh nền bên trái */}
                  {selectedMenu === 'my-orders' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png"
                      alt="left-decor"
                      className="absolute left-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-left-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}

                  {/* Nội dung */}
                  <FaClipboardList className="text-xl z-10" />
                  <span className="block z-10">Đơn mua</span>

                  {/* Ảnh nền bên phải */}
                  {selectedMenu === 'my-orders' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png"
                      alt="right-decor"
                      className="absolute right-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-right-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}
                </li>
              </Link>
 
              <Link
                to="/dashboard/my-reviews"
                onClick={() => handleMenuClick('my-reviews')}
                className="block w-full"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <li
                  className={`relative flex items-center gap-2 py-3 px-4 rounded-lg cursor-pointer ${
                    selectedMenu === 'my-reviews' ? 'nav-selected justify-center' : 'hover:bg-slate-100'
                  }`}
                >
                  {selectedMenu === 'my-reviews' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png"
                      alt="left-decor"
                      className="absolute left-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-left-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}

                  <FaBorderAll className="text-xl z-10" />
                  <span className="block z-10">Đánh giá của tôi</span>

                  {selectedMenu === 'my-reviews' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png"
                      alt="right-decor"
                      className="absolute right-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-right-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}
                </li>
              </Link>

              <Link
                to="/dashboard/product-history"
                onClick={() => handleMenuClick('product-history')}
                className="block w-full"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <li
                  className={`relative flex items-center gap-2 py-3 px-4 rounded-lg cursor-pointer ${
                    selectedMenu === 'product-history' ? 'nav-selected justify-center' : 'hover:bg-slate-100'
                  }`}
                >
                  {/* Ảnh nền bên trái */}
                  {selectedMenu === 'product-history' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png"
                      alt="left-decor"
                      className="absolute left-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-left-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}

                  {/* Nội dung */}
                  <FaHistory className="text-xl z-10" />
                  <span className="block z-10">Lịch sử xem</span>

                  {/* Ảnh nền bên phải */}
                  {selectedMenu === 'product-history' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png"
                      alt="right-decor"
                      className="absolute right-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-right-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}
                </li>
              </Link>

              <Link
                to="/dashboard/my-wishlist"
                onClick={() => handleMenuClick('my-wishlist')}
                className="block w-full"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <li
                  className={`relative flex items-center gap-2 py-3 px-4 rounded-lg cursor-pointer ${
                    selectedMenu === 'my-wishlist' ? 'nav-selected justify-center' : 'hover:bg-slate-100'
                  }`}
                >
                  {/* Ảnh nền bên trái */}
                  {selectedMenu === 'my-wishlist' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png"
                      alt="left-decor"
                      className="absolute left-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-left-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}

                  {/* Nội dung */}
                  <FaHeart className="text-xl z-10" />
                  <span className="block z-10">Sản phẩm yêu thích</span>

                  {/* Ảnh nền bên phải */}
                  {selectedMenu === 'my-wishlist' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png"
                      alt="right-decor"
                      className="absolute right-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-right-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}
                </li>
              </Link>
      
              <Link
                to="/dashboard/history"
                onClick={() => handleMenuClick('history')}
                className="block w-full"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <li
                  className={`relative flex items-center gap-2 py-3 px-4 rounded-lg cursor-pointer ${
                    selectedMenu === 'history' ? 'nav-selected justify-center' : 'hover:bg-slate-100'
                  }`}
                >
                  {/* Ảnh nền bên trái */}
                  {selectedMenu === 'history' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png"
                      alt="left-decor"
                      className="absolute left-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-left-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}

                  {/* Nội dung */}
                  <FaShoppingCart className="text-xl z-10" />
                  <span className="block z-10">Sản phẩm đã mua</span>

                  {/* Ảnh nền bên phải */}
                  {selectedMenu === 'history' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png"
                      alt="right-decor"
                      className="absolute right-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-right-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}
                </li>
              </Link>

              <Link
                to="/dashboard/voucher"
                onClick={() => handleMenuClick('voucher')}
                className="block w-full"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <li
                  className={`relative flex items-center gap-2 py-3 px-4 rounded-lg cursor-pointer ${
                    selectedMenu === 'voucher' ? 'nav-selected justify-center' : 'hover:bg-slate-100'
                  }`}
                >
                  {/* Ảnh nền bên trái */}
                  {selectedMenu === 'voucher' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png"
                      alt="left-decor"
                      className="absolute left-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-left-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}

                  {/* Nội dung */}
                  <FaGift className="text-xl z-10" />
                  <span className="block z-10">Kho Voucher</span>

                  {/* Ảnh nền bên phải */}
                  {selectedMenu === 'voucher' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png"
                      alt="right-decor"
                      className="absolute right-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-right-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}
                </li>
              </Link>

              <Link
                to="/dashboard/notifications"
                onClick={() => handleMenuClick('notifications')}
                className="block w-full"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <li
                  className={`relative flex items-center gap-2 py-3 px-4 rounded-lg cursor-pointer ${
                    selectedMenu === 'notifications' ? 'nav-selected justify-center' : 'hover:bg-slate-100'
                  }`}
                >
                  {/* Ảnh nền bên trái */}
                  {selectedMenu === 'notifications' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png"
                      alt="left-decor"
                      className="absolute left-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-left-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}

                  {/* Nội dung */}
                  <FaBell className="text-xl z-10" />
                  <span className="block z-10">Thông Báo</span>

                  {/* Ảnh nền bên phải */}
                  {selectedMenu === 'notifications' && (
                    <img
                      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png"
                      alt="right-decor"
                      className="absolute right-2 top-1/2 w-14 h-14 object-contain pointer-events-none float-right-animation"
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}
                </li>
              </Link>

              {/* Logout */}
              <li
                className="flex items-center gap-2 py-3 px-4 rounded-lg cursor-pointer hover:bg-red-100"
                onClick={handleLogout}
              >
                <IoMdLogOut className="text-xl text-red-500" />
                <span className="text-red-500">Logout</span>
              </li>
            </ul>
          </div>

          <div className="w-[calc(100%-270px)] md-lg:w-full">
            <div className="mx-4 md-lg:mx-0">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;

