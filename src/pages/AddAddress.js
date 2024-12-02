import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { add_address_user, address_district, address_province, address_ward, messageClear } from '../../../store/reducers/addressReducer';
import toast from 'react-hot-toast';

const AddAddress = () => {
     const navigate = useNavigate();
     const dispatch = useDispatch();
     const [receiver, setReceiver] = useState('');
     const [phone, setPhone] = useState('');
     const [specific, setSpecific] = useState('');
     const [province, setProvince] = useState('');
     const [district, setDistrict] = useState('');
     const [ward, setWard] = useState('');
     const [provinceName, setProvinceName] = useState('');  // Thêm state cho tên tỉnh
     const [districtName, setDistrictName] = useState('');  // Thêm state cho tên quận
     const [wardName, setWardName] = useState('');  // Thêm state cho tên phường
     const [isDefault, setIsDefault] = useState(false);
 
     const { provinces, districts, wards, successMessage, errorMessage, errorMessages } = useSelector((state) => state.address);
     const { user } = useSelector(state => state.dashboard);
 
     useEffect(() => {
         dispatch(address_province());
     }, []);
 
     const handleProvinceChange = (e) => {
         const selectedProvinceId = e.target.value;
         setProvince(selectedProvinceId);
         setProvinceName(provinces.find(prov => prov.Id === selectedProvinceId)?.Name || ''); // Lưu tên tỉnh
         setDistrict('');
         setWard('');
         if (selectedProvinceId) {
             dispatch(address_district(selectedProvinceId));
         }
     };
 
     const handleDistrictChange = (e) => {
         const selectedDistrictId = e.target.value;
         setDistrict(selectedDistrictId);
         setDistrictName(districts.find(dist => dist.Id === selectedDistrictId)?.Name || ''); // Lưu tên quận
         setWard('');
         if (selectedDistrictId) {
             dispatch(address_ward({ provinceId: province, districtId: selectedDistrictId }));
         }
     };
 
     const handleWardChange = (e) => {
         const selectedWardId = e.target.value;
         setWard(selectedWardId);
         setWardName(wards.find(w => w.Id === selectedWardId)?.Name || ''); // Lưu tên phường
     };
 
     const handleSubmit = (e) => {
         e.preventDefault();
         const newAddress = {
             receiver,
             phone,
             specific,
             province: provinceName,  // Gửi cả id và name của tỉnh
             districts: districtName,  // Gửi cả id và name của quận
             wards: wardName,  // Gửi cả id và name của phường
             isDefault,
         };
 
         dispatch(add_address_user({
              "user": user.user._id,
             ...newAddress
         }));
         console.log("🚀 ~ file: AddAddress.jsx:74 ~ handleSubmit ~ successMessage:", successMessage);
     //     if (successMessage) {

             

     //         navigate('/dashboard/address');
     //         toast.success(successMessage);
     //         dispatch(messageClear());
     //     }
 
     //     if (errorMessages) {

     //         toast.error(errorMessages);
     //         dispatch(messageClear());
     //     }
     // //     console.log(newAddress);
 
        
     };
 
     const handleCancel = () => {
         navigate(-1); // Quay lại trang trước đó
     };
 

     useEffect(() => {
          if (successMessage) {
              toast.success(successMessage);
              dispatch(messageClear());
              navigate('/dashboard/address');
          }
          console.log("🚀 ~ file: AddAddress.jsx:104 ~ useEffect ~ errorMessages:", errorMessages);
          if (errorMessages) {

              

              toast.error(errorMessages);
              dispatch(messageClear());
          }
      }, [successMessage, errorMessages]);
     return (
         <div className="bg-white p-6 rounded-md">
             <h2 className="text-2xl font-semibold mb-6">Thêm địa chỉ mới</h2>
             <form onSubmit={handleSubmit} className="space-y-4">
                 {/* Người nhận và Số điện thoại */}
                 <div className="flex space-x-2">
                     <div className="flex-1">
                         <label className="block text-gray-700">Họ và tên</label>
                         <input
                             type="text"
                             value={receiver}
                             onChange={(e) => setReceiver(e.target.value)}
                             placeholder="Nhập họ và tên"
                             className="w-full px-4 py-2 border rounded-md"
                             required
                         />
                     </div>
                     <div className="flex-1">
                         <label className="block text-gray-700">Số điện thoại</label>
                         <input
                             type="tel"
                             value={phone}
                             onChange={(e) => setPhone(e.target.value)}
                             placeholder="Nhập số điện thoại"
                             className="w-full px-4 py-2 border rounded-md"
                             required
                         />
                     </div>
                 </div>
 
                 {/* Tỉnh/Thành phố, Quận/Huyện, Phường/Xã */}
                 <div className="flex space-x-2">
                     <div className="flex-1">
                         <label className="block text-gray-700">Tỉnh/Thành phố</label>
                         <select
                             value={province}
                             onChange={handleProvinceChange}
                             className="w-full px-4 py-2 border rounded-md"
                             required
                         >
                             <option value="">Chọn Tỉnh/Thành phố</option>
                             {provinces.map((prov) => (
                                 <option key={prov.Id} value={prov.Id}>{prov.Name}</option>
                             ))}
                         </select>
                     </div>
                     <div className="flex-1">
                         <label className="block text-gray-700">Quận/Huyện</label>
                         <select
                             value={district}
                             onChange={handleDistrictChange}
                             className="w-full px-4 py-2 border rounded-md"
                             required
                         >
                             <option value="">Chọn Quận/Huyện</option>
                             {districts.map((dist) => (
                                 <option key={dist.Id} value={dist.Id}>{dist.Name}</option>
                             ))}
                         </select>
                     </div>
                     <div className="flex-1">
                         <label className="block text-gray-700">Phường/Xã</label>
                         <select
                             value={ward}
                             onChange={handleWardChange}
                             className="w-full px-4 py-2 border rounded-md"
                             required
                         >
                             <option value="">Chọn Phường/Xã</option>
                             {wards.map((w) => (
                                 <option key={w.Id} value={w.Id}>{w.Name}</option>
                             ))}
                         </select>
                     </div>
                 </div>
 
                 <div>
                     <label className="block text-gray-700">Số nhà</label>
                     <input
                         type="text"
                         value={specific}
                         onChange={(e) => setSpecific(e.target.value)}
                         placeholder="Nhập số nhà"
                         className="w-full px-4 py-2 border rounded-md"
                         required
                     />
                 </div>
 
                 <div className="flex items-center">
                     <input
                         type="checkbox"
                         checked={isDefault}
                         onChange={(e) => setIsDefault(e.target.checked)}
                         className="mr-2"
                     />
                     <label className="text-gray-700">Đặt làm địa chỉ mặc định</label>
                 </div>
 
                 {/* Nút Thêm và Hủy */}
                 <div className="flex justify-end space-x-2">
                     <button
                         type="button"
                         onClick={handleCancel}
                         className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100"
                     >
                         Hủy
                     </button>
                     <button
                         type="submit"
                         className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                     >
                         Hoàn thành
                     </button>
                 </div>
             </form>
         </div>
     );
 };
 
 export default AddAddress;
 


