import React, { useState, useEffect } from "react";

const VoucherCard = ({ voucher }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(voucher.code)
        .then(() => {
          setCopySuccess(true);
        })
        .catch(() => {
          // Thông báo thất bại (có thể mở rộng)
        });
    } else {
      // Trình duyệt không hỗ trợ sao chép
    }
  };

  // Ẩn thông báo sau 2.5 giây
  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  return (
    <div className="relative flex items-stretch bg-white shadow rounded-lg overflow-hidden w-full max-w-3xl border">
      {/* Thông báo copy thành công */}
      {copySuccess && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded shadow-md text-sm select-none z-10">
          Đã sao chép mã giảm giá!
        </div>
      )}

      {/* Bên trái: logo Shopee */}
     <div className="relative bg-green-700 text-white flex flex-col justify-center items-center w-28 p-4">
     <div className="absolute top-0 left-[-8px] h-full flex flex-col justify-between py-2">
     {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="w-4 h-4 bg-white rounded-full my-0.5" />
     ))}
     </div>
     <div className="text-4xl font-bold">S</div>
     <div className="text-sm font-semibold mt-2">SẮC</div>
     </div>


      {/* Bên phải: thông tin voucher */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="text-lg font-bold mb-1 text-gray-800">{voucher.name}</div>
          <div className="text-sm text-gray-600 mb-2">
            Mã giảm giá: <span className="font-medium">{voucher.code}</span>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            🕒 Hạn dùng:{" "}
            {new Date(voucher.couponExpired).toLocaleDateString("vi-VN")}
          </div>
          <div className="text-sm mt-1 text-gray-500">
            Trạng thái:{" "}
            <span className={voucher.isActive ? "text-green-600" : "text-red-500"}>
              {voucher.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
            </span>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4 mt-3">
          <button className="text-blue-600 text-sm underline">Điều kiện</button>
          <button
            onClick={handleCopyCode}
            className="border border-orange-500 text-orange-500 px-4 py-1 rounded hover:bg-orange-100"
          >
            Sao chép mã
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherCard;
