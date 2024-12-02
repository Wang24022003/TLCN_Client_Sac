import React, { useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Container from "../components/Container";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../features/user/userSlice";
import { FiEdit } from "react-icons/fi";

let profileSchema = yup.object({
  firstname: yup.string().required("First Name is Required"),
  lastname: yup.string().required("Last Name is Required"),
  email: yup
    .string()
    .required("Email is Required")
    .email("Email Should be valid"),
  mobile: yup.number().required().positive().integer("Mobile No is Required"),
});

const Profile = () => {
  const getTokenFromLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;

  const config2 = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
      Accept: "application/json",
      "ngrok-skip-browser-warning": "69420"
    },
  };
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.auth.user);
  const [edit, setEdit] = useState(true);
  const formik = useFormik({
    initialValues: {
      firstname: userState?.firstname,
      lastname: userState?.lastname,
      email: userState?.email,
      mobile: userState?.mobile,
    },
    validationSchema: profileSchema,
    onSubmit: (values) => {
      dispatch(updateProfile({ data: values, config2: config2 }));
      setEdit(true);
    },
  });

  return (
    <>
      <BreadCrumb title="My Profile" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
          <div className="text-center mb-4">
              <img
                src={userState?.avatar || "/default-avatar.png"}
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
                <button className="btn btn-link text-primary p-0 mt-2">
                  Thay đổi ảnh
                </button>
              )}
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="my-3">Thông tin tài khoản</h3>

              <FiEdit className="fs-3" onClick={() => setEdit(false)} />
            </div>
          </div>
          <div className="col-12">
            <form action="" onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <div className="mb-3">
                  <label htmlFor="example1" className="form-label">
                    Họ Và Tên
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    className="form-control"
                    id="example1"
                    disabled={edit}
                    value={formik.values.firstname}
                    onChange={formik.handleChange("firstname")}
                    onBlur={formik.handleBlur("firstname")}
                  />
                  <div className="error">
                    {formik.touched.firstname && formik.errors.firstname}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="example1" className="form-label">
                    Gmail
                  </label>
                  <input
                    type="text"
                    name="gmail"
                    className="form-control"
                    id="example1"
                    disabled={edit}
                    value={formik.values.firstname}
                    onChange={formik.handleChange("firstname")}
                    onBlur={formik.handleBlur("firstname")}
                  />
                  <div className="error">
                    {formik.touched.firstname && formik.errors.firstname}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="example1" className="form-label">
                    Giới tính
                  </label>
                  <input
                    type="text"
                    name="gmail"
                    className="form-control"
                    id="example1"
                    disabled={edit}
                    value={formik.values.firstname}
                    onChange={formik.handleChange("firstname")}
                    onBlur={formik.handleBlur("firstname")}
                  />
                  <div className="error">
                    {formik.touched.firstname && formik.errors.firstname}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="example1" className="form-label">
                    Tuổi
                  </label>
                  <input
                    type="text"
                    name="gmail"
                    className="form-control"
                    id="example1"
                    disabled={edit}
                    value={formik.values.firstname}
                    onChange={formik.handleChange("firstname")}
                    onBlur={formik.handleBlur("firstname")}
                  />
                  <div className="error">
                    {formik.touched.firstname && formik.errors.firstname}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="example1" className="form-label">
                    Điểm tích lũy
                  </label>
                  <input
                    type="text"
                    name="gmail"
                    className="form-control"
                    id="example1"
                    disabled={edit}
                    value={formik.values.firstname}
                    onChange={formik.handleChange("firstname")}
                    onBlur={formik.handleBlur("firstname")}
                  />
                  <div className="error">
                    {formik.touched.firstname && formik.errors.firstname}
                  </div>
                </div>
              </div>

              {edit === false && (
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              )}
            </form>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Profile;
