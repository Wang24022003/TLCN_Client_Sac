import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getNewProfile, updateProfile } from "../features/user/userSlice";
import BreadCrumb from "../components/BreadCrumb";
import Container from "../components/Container";
import { FiEdit } from "react-icons/fi";

const TYPE_GENDER = {
  FEMALE: "FEMALE",
  MALE: "MALE",
  OTHER: "OTHER",
};

const profileSchema = yup.object().shape({
  name: yup.string().required("Họ và tên là bắt buộc"),
  age: yup
    .number()
    .required("Tuổi là bắt buộc")
    .min(0, "Tuổi không được nhỏ hơn 0")
    .max(150, "Tuổi không được lớn hơn 150"),
  gender: yup.string().required("Giới tính là bắt buộc"),
});

const Profile = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.auth.user);
  const [edit, setEdit] = useState(true);
  const [dataProfile, setdataProfile] = useState();
  useEffect(() => {
    setdataProfile({
      name: userState?.name || "",
      age: userState?.age || "",
      gender: userState?.gender || TYPE_GENDER.OTHER,
      email: userState?.email || "",
      point: userState?.point || 0,
    });
    return () => {};
  }, [userState]);

  const handleSubmit = (values) => {
    dispatch(
      updateProfile({
        name: values.name,
        age: values.age,
        gender: values.gender,
      })
    );
    dispatch(getNewProfile());
    setEdit(true); // Đóng chế độ chỉnh sửa sau khi cập nhật
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Lấy file được chọn
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setdataProfile((prevState) => ({
          ...prevState,
          avatar: reader.result, // Lưu URL base64 vào state
        }));
      };
      reader.readAsDataURL(file); // Đọc file và chuyển sang base64
    }
  };

  return (
    <>
      <BreadCrumb title="My Profile" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="col-12 text-center mb-4">
              <img
                src={dataProfile?.avatar || "/default-avatar.png"}
                alt="Avatar"
                className="rounded-circle"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  border: "2px solid #ddd",
                }}
              />
              {!edit && (
                <div className="mt-3">
                  <label
                    htmlFor="upload-avatar"
                    className="btn btn-link text-primary"
                  >
                    Thay đổi ảnh
                  </label>
                  <input
                    type="file"
                    id="upload-avatar"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <h3 className="my-3">Thông tin tài khoản</h3>
              <FiEdit className="fs-3" onClick={() => setEdit(false)} />
            </div>
          </div>
          <div className="col-12">
            <Formik
              initialValues={dataProfile}
              validationSchema={profileSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values }) => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Họ và Tên
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className="form-control"
                      disabled={edit}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <Field
                      type="text"
                      name="email"
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="age" className="form-label">
                      Tuổi
                    </label>
                    <Field
                      type="number"
                      name="age"
                      className="form-control"
                      disabled={edit}
                    />
                    <ErrorMessage
                      name="age"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="gender" className="form-label">
                      Giới tính
                    </label>
                    <Field
                      as="select"
                      name="gender"
                      className="form-select"
                      disabled={edit}
                    >
                      {Object.keys(TYPE_GENDER).map((key) => (
                        <option key={key} value={TYPE_GENDER[key]}>
                          {TYPE_GENDER[key]}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="point" className="form-label">
                      Điểm tích lũy
                    </label>
                    <Field
                      type="text"
                      name="point"
                      className="form-control"
                      disabled
                    />
                  </div>
                  {!edit && (
                    <button type="submit" className="btn btn-primary">
                      Lưu thay đổi
                    </button>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Profile;
