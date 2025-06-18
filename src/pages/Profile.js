import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getNewProfile, updateProfile } from "../features/user/userSlice";
import BreadCrumb from "../components/BreadCrumb";
import Container from "../components/Container";
import { FiEdit } from "react-icons/fi";
import { uploadImg } from "../utils/api";
import "./../Css/CssProfile.css";

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
  const [profilebase64, setprofilebase64] = useState();

  useEffect(() => {
  if (!userState || !userState.name) {
    dispatch(getNewProfile());
  }
}, []);

useEffect(() => {
  if (userState && userState.email) {
    setdataProfile({
      name: userState?.name || "",
      age: userState?.age ?? "",
      gender: userState?.gender || TYPE_GENDER.OTHER,
      email: userState?.email || "",
      point: userState?.point || 0,
      avatar: userState?.avatar || "",
    });
  }
}, [userState]);


  const handleSubmit = async (values) => {
    try {
      const result = await dispatch(updateProfile({
        name: values.name,
        age: values.age,
        gender: values.gender,
        avatar: values.avatar || dataProfile?.avatar,
      }));

      if (result?.meta?.requestStatus === "fulfilled") {
        await dispatch(getNewProfile()); // đảm bảo cập nhật lại dữ liệu mới
        setEdit(true);
      } else {
        alert("Cập nhật thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);
    }
  };


  const handleImageChange = async (e) => {
    const file = e.target.files[0]; // Lấy file được chọn
    if (file) {
      const re = await uploadImg(file);
      if (re && re.data) {
        setdataProfile((prevState) => ({
          ...prevState,
          avatar: re.data[0], // Lưu URL base64 vào state
        }));
      }
      const reader = new FileReader();

      reader.onload = () => {
        setprofilebase64(reader.result);
      };
      reader.readAsDataURL(file); // Đọc file và chuyển sang base64
    }
  };

  const GENDER_LABELS = {
  FEMALE: "Nữ",
  MALE: "Nam",
  OTHER: "Khác",
};


  return (
    <>
      <Container class1="cart-wrapper home-wrapper-2 py-5 profile-container">
        {/* <img
        src="/images/bg_profile.png" // ← thay bằng đường dẫn ảnh của bạn
        alt="Background"
        className="profile-background-image"
      /> */}
        <div className="row">
          <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
            <div className="text-center mb-4">
              <div className="avatar-wrapper">
                <div className="avatar-background-second">
                  <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748927044/TD_nho_er2gba.png" alt="Background Layer 2" />
                </div>
                <div className="avatar-background">
                  <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748927049/TD_lon_oqnoye.png" alt="Background Layer 1" />
                </div>
                <img
                  src={profilebase64 || dataProfile?.avatar}
                  alt="Avatar"
                  className="avatar-img"
                />
                 {!edit && (
                <label htmlFor="upload-avatar" className="change-avatar-label">
                  Thay đổi ảnh
                  <input
                    type="file"
                    id="upload-avatar"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </label>
              )}
              </div>


             

            </div>
          </div>

          <div className="col-md-6">
          <div
          style={{
            border: "2px dashed #002E29",
            borderRadius: "8px",
            padding: "20px",
          }}>
             <div className="d-flex justify-content-between align-items-center">
              <h3 className="my-3">Thông tin tài khoản</h3>
              <FiEdit className="fs-3" onClick={() => setEdit(false)} />
            </div>

            <Formik
              initialValues={dataProfile}
              validationSchema={profileSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values }) => (
                <Form>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="name" className="form-label">Họ và Tên</label>
                      <Field
                        type="text"
                        name="name"
                        className="form-control"
                        disabled={edit}
                      />
                      <ErrorMessage name="name" component="div" className="text-danger" />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="email" className="form-label">Email</label>
                      <Field
                        type="text"
                        name="email"
                        className="form-control"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="age" className="form-label">Tuổi</label>
                      <Field
                        type="number"
                        name="age"
                        className="form-control"
                        disabled={edit}
                      />
                      <ErrorMessage name="age" component="div" className="text-danger" />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="gender" className="form-label">Giới tính</label>
                      <Field
                        as="select"
                        name="gender"
                        className="form-select"
                        disabled={edit}
                      >
                        {Object.keys(TYPE_GENDER).map((key) => (
                          <option key={key} value={TYPE_GENDER[key]}>
                            {GENDER_LABELS[TYPE_GENDER[key]]}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="gender" component="div" className="text-danger" />
                    </div>
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
                    <button
                      type="submit"
                      className="btn"
                      style={{
                        backgroundColor: "green",
                        borderColor: "green",
                        color: "white",
                      }}
                    >
                      Lưu thay đổi
                    </button>
                  )}
                </Form>
              )}
            </Formik>
          </div>
           
          </div>
        </div>

      </Container>
    </>
  );
};

export default Profile;
