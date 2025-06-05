import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserCoupons } from "../features/user/userSlice";

import { Spin, Typography } from "antd";
import VoucherCard from "../components/voucherCard";

const { Title, Text } = Typography;

const VoucherList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const vouchers = useSelector((state) => state.auth.userCoupons);
  const isLoading = useSelector((state) => state.auth.isLoading);

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserCoupons(user._id));
    }
  }, [user, dispatch]);

  return (
    <div className="p-6">
      <Title level={3}>Danh sách mã giảm giá</Title>
      {isLoading ? (
        <Spin tip="Đang tải..." />
      ) : vouchers.length > 0 ? (
        <div className="space-y-4">
          {vouchers.map((voucher) => (
            <VoucherCard key={voucher._id} voucher={voucher} />
          ))}
        </div>
      ) : (
        <Text type="secondary">Không có mã giảm giá khả dụng.</Text>
      )}
    </div>
  );
};

export default VoucherList;
