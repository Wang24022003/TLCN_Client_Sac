import React, { useEffect, useState } from "react";
import { RiAccountCircleLine } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";
import { FaBell, FaBorderAll, FaGift, FaHeart, FaList } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";
import { authService } from "../features/user/userService";

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
      setSelectedMenu('history');
    } else if (path.includes('/dashboard/my-orders')) {
      setSelectedMenu('my-orders');
    } else if (path.includes('/dashboard/my-wishlist')) {
      setSelectedMenu('my-wishlist');
    } else if (path.includes('/dashboard/voucher')) {
      setSelectedMenu('voucher');
    } else if (path.includes('/dashboard/notifications')) {
      setSelectedMenu('notifications');
    } else {
      setSelectedMenu('profile');
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
              <div className="flex items-center gap-3 p-4 border-b">
                <img
                  src={userState?.avatar || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-lg font-semibold">{userState?.name}</span>
              </div>

              {/* Menu Items */}
              <li
                className={`flex items-center gap-2 py-3 px-4 rounded-lg cursor-pointer ${selectedMenu === 'account' ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white' : 'hover:bg-slate-100'}`}
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              >
                <RiAccountCircleLine className="text-xl" />
                <span>Tài khoản của tôi</span>
              </li>

              {accountMenuOpen && (
                <ul className="pl-8 text-gray-500">
                  <li className={`py-1 px-3 ${selectedMenu === 'profile' ? 'bg-green-300 text-white rounded' : 'hover:bg-green-100'}`}>
                    <Link to='/dashboard/my-profile' onClick={() => handleMenuClick('profile')} style={{ textDecoration: 'none', color: 'inherit' }}>Hồ sơ</Link>
                  </li>
                  <li className={`py-1 px-3 ${selectedMenu === 'address' ? 'bg-green-300 text-white rounded' : 'hover:bg-green-100'}`}>
                    <Link to='/dashboard/address' onClick={() => handleMenuClick('address')} style={{ textDecoration: 'none', color: 'inherit' }}>Địa chỉ</Link>
                  </li>
                  <li className={`py-1 px-3 ${selectedMenu === 'history' ? 'bg-green-300 text-white rounded' : 'hover:bg-green-100'}`}>
                    <Link to='/dashboard/product-history' onClick={() => handleMenuClick('history')}style={{ textDecoration: 'none', color: 'inherit' }}>Sản phẩm xem gần đây</Link>
                  </li>
                </ul>
              )}

              {/* Other Menu Items */}
              <li
                className={`flex items-center gap-2 py-3 px-4 rounded-lg cursor-pointer ${selectedMenu === 'my-orders' ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white' : 'hover:bg-slate-100'}`}
                onClick={() => handleMenuClick('my-orders')}
              >
                <FaBorderAll className="text-xl" />
                <Link to='/dashboard/my-orders' className="block" style={{ textDecoration: 'none', color: 'inherit' }}>Đơn mua</Link>
              </li>

              <li
                className={`flex items-center gap-2 py-3 px-4 rounded-lg cursor-pointer ${selectedMenu === 'wishlist' ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white' : 'hover:bg-slate-100'}`}
                onClick={() => handleMenuClick('wishlist')}
              >
                <FaHeart className="text-xl" />
                <Link to='/dashboard/my-wishlist' className="block" style={{ textDecoration: 'none', color: 'inherit' }}>Sản phẩm yêu thích</Link>
              </li>

              <li
                className={`flex items-center gap-2 py-3 px-4 rounded-lg cursor-pointer ${selectedMenu === 'voucher' ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white' : 'hover:bg-slate-100'}`}
                onClick={() => handleMenuClick('voucher')}
              >
                <FaGift className="text-xl" />
                <Link to='/dashboard/voucher' className="block" style={{ textDecoration: 'none', color: 'inherit' }}>Kho Voucher</Link>
              </li>

              <li
                className={`flex items-center gap-2 py-3 px-4 rounded-lg cursor-pointer ${selectedMenu === 'notifications' ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white' : 'hover:bg-slate-100'}`}
                onClick={() => handleMenuClick('notifications')}
              >
                <FaBell className="text-xl" />
                <Link to='/dashboard/notifications' className="block"style={{ textDecoration: 'none', color: 'inherit' }}>Thông Báo</Link>
              </li>

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