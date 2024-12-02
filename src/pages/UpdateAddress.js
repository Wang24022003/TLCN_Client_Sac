import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { add_address_user, address_district, address_province, address_ward, messageClear, patch_address_user } from '../../../store/reducers/addressReducer';
import toast from 'react-hot-toast';
import { get_address_user } from '../../../store/reducers/addressReducer';

const UpdateAddress = () => {
    const { _id } = useParams(); 

    

    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [receiver, setReceiver] = useState('');
    const [phone, setPhone] = useState('');
    const [specific, setSpecific] = useState('');
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [provinceName, setProvinceName] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [wardName, setWardName] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    const { provinces, districts, wards, successMessage, errorMessage, errorMessages } = useSelector((state) => state.address);
    const { user } = useSelector((state) => state.dashboard);
    const { adressDetail } = useSelector((state) => state.address);

    useEffect(() => {
        dispatch(address_province());
        dispatch(get_address_user(_id)); // Lấy thông tin địa chỉ từ API
    }, [_id, dispatch]);
    

    useEffect(() => {
        if (adressDetail) {
            setReceiver(adressDetail.receiver);
            setPhone(adressDetail.phone);
            setSpecific(adressDetail.specific);
            setProvince(adressDetail.province);
            setDistrict(adressDetail.districts);
            setWard(adressDetail.wards);
            setIsDefault(adressDetail.isDefault);
        }
    }, [adressDetail]);

    const handleProvinceChange = (e) => {
        const selectedProvinceId = e.target.value;
        setProvince(selectedProvinceId);
        setProvinceName(provinces.find((prov) => prov.Id === selectedProvinceId)?.Name || '');
        setDistrict('');
        setWard('');
        if (selectedProvinceId) {
            dispatch(address_district(selectedProvinceId));
        }
    };

    const handleDistrictChange = (e) => {
        const selectedDistrictId = e.target.value;
        setDistrict(selectedDistrictId);
        setDistrictName(districts.find((dist) => dist.Id === selectedDistrictId)?.Name || '');
        setWard('');
        if (selectedDistrictId) {
            dispatch(address_ward({ provinceId: province, districtId: selectedDistrictId }));
        }
    };

    const handleWardChange = (e) => {
        const selectedWardId = e.target.value;
        setWard(selectedWardId);
        setWardName(wards.find((w) => w.Id === selectedWardId)?.Name || '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newAddress = {
            receiver,
            phone,
            specific,
            province: provinceName,
            districts: districtName,
            wards: wardName,
            isDefault,
            _id
        };

        dispatch(patch_address_user({
            user: user.user._id,
            ...newAddress
        }));
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
        if (errorMessages) {
            toast.error(errorMessages);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessages, navigate, dispatch]);


    
    return (
        <div className="bg-white p-6 rounded-md">
            <h2 className="text-2xl font-semibold mb-6">Cập nhật địa chỉ</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="flex space-x-2">
                    <div className="flex-1">
                        <label className="block text-gray-700">Tỉnh/Thành phố</label>
                        <select
                            value={province || ''}
                            onChange={handleProvinceChange}
                            className="w-full px-4 py-2 border rounded-md"
                            required
                        >
                            <option value="">Chọn Tỉnh/Thành phố</option>
                            {provinces.map((prov) => (
                                <option key={prov.Id} value={prov.Id} >{prov.Name}</option>
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

export default UpdateAddress;
