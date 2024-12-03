import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import BreadCrumb from "../components/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAddressUser,
  getAddress,
  getOrders,
  setDefaultAddressUser,
} from "../features/user/userSlice";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const Address = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderState = useSelector((state) => state?.auth?.address?.orders);
  const addressUserState = useSelector((state) => state?.auth?.addressUser);
  const isReload = useSelector((state) => state?.auth?.isReload);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    // dispatch(getOrders(config2));
  }, [dispatch]);
  const getListAddress = () => {
    dispatch(
      getAddress(`&user=${JSON.parse(localStorage.getItem("customer"))._id}`)
    );
  };
  useEffect(() => {
    getListAddress();
  }, [isReload]);

  useEffect(() => {
    if (orderState) {
      setFilteredOrders(
        statusFilter
          ? orderState.filter((order) => order.orderStatus === statusFilter)
          : orderState
      );
    }
  }, [orderState, statusFilter]);
  const handleSetDefault = (id) => {
    dispatch(setDefaultAddressUser(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteAddressUser(id));
  };
  return (
    <>
     
      
        <div className="bg-white p-6 rounded-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Địa chỉ của tôi</h2>
            <Link to="/dashboard/add-address" className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                    + Thêm địa chỉ mới
                </Link>
          </div>
          <hr className="my-4 border-gray-300" />
          <div className="space-y-6">
            {addressUserState && addressUserState.length > 0 ? (
              addressUserState.map((addr) => (
                <div key={addr._id} className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">
                      {addr.receiver}{" "}
                      <span className="font-normal text-gray-600">
                        {addr.phone}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Link
                        to={`/dashboard/update-address/${addr._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        Cập nhật
                      </Link>
                      <button
                        onClick={() => handleDelete(addr._id)}
                        className="text-blue-500 hover:underline"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-gray-700">
                    <p>{addr.specific}</p>
                    <p>
                      {addr.wards}, {addr.districts}, {addr.province}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    {addr.isDefault && (
                      <span className="text-red-500 font-semibold border border-red-500 px-2 py-1 text-xs rounded">
                        Mặc định
                      </span>
                    )}
                  </div>
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr._id)}
                      className="mt-2 bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded hover:bg-gray-300"
                    >
                      Thiết lập mặc định
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">Không có địa chỉ nào.</p>
            )}
          </div>
        </div>
     
    </>
  );
};

export default Address;
