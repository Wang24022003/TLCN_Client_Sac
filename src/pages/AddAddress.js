import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  getDistricts,
  getProvinces,
  getWards,
} from "../features/addresses/addressSlice";
import { createAddressUser } from "../features/user/userSlice";

const AddAddress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const provinces = useSelector((state) => state?.addressData?.provinces || []);
  const districts = useSelector((state) => state?.addressData?.districts || []);
  const wards = useSelector((state) => state?.addressData?.wards || []);
  const user = useSelector((state) => state?.auth?.user);
  useEffect(() => {
    dispatch(getProvinces());
  }, [dispatch]);

  const validationSchema = Yup.object().shape({
    receiver: Yup.string().required("Họ và tên không được để trống."),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Số điện thoại phải có 10 chữ số.")
      .required("Số điện thoại không được để trống."),
    specific: Yup.string().required("Số nhà không được để trống."),
    province: Yup.string().required("Vui lòng chọn Tỉnh/Thành phố."),
    district: Yup.string().required("Vui lòng chọn Quận/Huyện."),
    ward: Yup.string().required("Vui lòng chọn Phường/Xã."),
  });

  const handleProvinceChange = (provinceId, setFieldValue) => {
    setFieldValue("district", "");
    setFieldValue("ward", "");
    if (provinceId) dispatch(getDistricts({ provinceId }));
  };

  const handleDistrictChange = (districtId, setFieldValue, provinceId) => {
    setFieldValue("ward", "");
    if (districtId) dispatch(getWards({ provinceId, districtId }));
  };

  const handleSubmit = (values) => {
    const { province, district, ward, ...rest } = values;
    const data = {
      user: user._id,
      receiver: values.receiver,
      phone: values.phone,
      province: provinces.find((p) => p.Id === province)?.Name || "",
      districts: districts.find((d) => d.Id === district)?.Name || "",
      wards: wards.find((w) => w.Id === ward)?.Name || "",
      specific: values.specific,
      isDefault: values.isDefault,
    };
    dispatch(createAddressUser(data));
    navigate("/dashboard/address");
  };

  return (
    <div className="bg-white p-6 rounded-md">
      <h2 className="text-2xl font-semibold mb-6">Thêm địa chỉ mới</h2>
      <Formik
        initialValues={{
          receiver: "",
          phone: "",
          specific: "",
          province: "",
          district: "",
          ward: "",
          isDefault: false,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-4">
            {/* Họ và tên, Số điện thoại */}
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-gray-700">Họ và tên</label>
                <Field
                  name="receiver"
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="receiver"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700">Số điện thoại</label>
                <Field
                  name="phone"
                  type="tel"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            {/* Tỉnh/Thành phố, Quận/Huyện, Phường/Xã */}
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-gray-700">Tỉnh/Thành phố</label>
                <Field
                  as="select"
                  name="province"
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) => {
                    setFieldValue("province", e.target.value);
                    handleProvinceChange(e.target.value, setFieldValue);
                  }}
                >
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  {provinces.map((prov) => (
                    <option key={prov.Id} value={prov.Id}>
                      {prov.Name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="province"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700">Quận/Huyện</label>
                <Field
                  as="select"
                  name="district"
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) => {
                    setFieldValue("district", e.target.value);
                    handleDistrictChange(
                      e.target.value,
                      setFieldValue,
                      values.province
                    );
                  }}
                >
                  <option value="">Chọn Quận/Huyện</option>
                  {districts.map((dist) => (
                    <option key={dist.Id} value={dist.Id}>
                      {dist.Name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="district"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700">Phường/Xã</label>
                <Field
                  as="select"
                  name="ward"
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="">Chọn Phường/Xã</option>
                  {wards.map((w) => (
                    <option key={w.Id} value={w.Id}>
                      {w.Name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="ward"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            {/* Số nhà */}
            <div>
              <label className="block text-gray-700">Số nhà</label>
              <Field
                name="specific"
                type="text"
                className="w-full px-4 py-2 border rounded-md"
              />
              <ErrorMessage
                name="specific"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Địa chỉ mặc định */}
            <div className="flex items-center">
              <Field name="isDefault" type="checkbox" className="mr-2" />
              <label className="text-gray-700">Đặt làm địa chỉ mặc định</label>
            </div>

            {/* Nút Thêm và Hủy */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
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
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddAddress;
