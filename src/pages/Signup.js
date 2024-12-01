import React, { useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { active_account, registerUser } from "../features/user/userSlice";
import logo from "../assets/Remove-bg.ai_1720413887960.png"; // Adjust the path according to your project structure
import "./../Css/CssLogin.css";

// Updated Yup schema
let signUpSchema = yup.object({
  username: yup.string().required("Tên không được để trống"),
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  password: yup
    .string()
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //   "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt"
    // )
    .required("Mật khẩu không được để trống"),
});

const Signup = () => {
  const authState = useSelector((state) => state.auth);
  let { isSuccess, isLoading, handleApi } = authState;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: signUpSchema,
    onSubmit: (values) => {
      dispatch(
        registerUser({
          name: values.username,
          email: values.email,
          password: values.password,
        })
      );
      // if (isSuccess === true) {
      //   navigate(`/otp/${values.email}`);
      // }
      //navigate(`/login`);

      // Optionally navigate on successful registration
    },
  });
  // Dùng useEffect để lắng nghe isSuccess thay đổi
  useEffect(() => {
    if (isSuccess && handleApi === "resgister") {
      navigate(`/otp/${formik.values.email}`); // Chuyển trang nếu đăng ký thành công
    }
  }, [isSuccess, handleApi]);
  return (
    <>
      <Meta title={"Sign Up"} />
      <BreadCrumb title="Sign Up" />
      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-cardss d-flex">
              {/* Bên trái - Ảnh */}
              <div className="login-image d-flex justify-content-center align-items-center">
                <img
                  src="images/Home1.jpg"
                  alt="Login Illustration"
                  className="img-fluid"
                />
              </div>
              <div className="login-form">
                <h3 className="text-center mb-3">Đăng ký tài khoản</h3>
                <p className="text-left mb-3">
                  Nhập thông tin của bạn bên dưới
                </p>

                <form
                  className="d-flex flex-column gap-15"
                  onSubmit={formik.handleSubmit}
                >
                  <label htmlFor="username" className="form-labels">
                    Họ và Tên <span className="required">*</span>
                  </label>
                  <CustomInput
                    type="text"
                    name="username"
                    placeholder="Nhập Họ và Tên"
                    value={formik.values.username}
                    onChange={formik.handleChange("username")}
                    onBlur={formik.handleBlur("username")}
                  />
                  <div className="error">
                    {formik.touched.username && formik.errors.username}
                  </div>
                  <label htmlFor="email" className="form-labels">
                    Email <span className="required">*</span>
                  </label>
                  <CustomInput
                    type="email"
                    name="email"
                    placeholder="Nhập Email"
                    value={formik.values.email}
                    onChange={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                  />
                  <div className="error">
                    {formik.touched.email && formik.errors.email}
                  </div>
                  <label htmlFor="email" className="form-labels">
                    Mật khẩu <span className="required">*</span>
                  </label>
                  <CustomInput
                    type="password"
                    name="password"
                    placeholder="Nhập mật khẩu"
                    value={formik.values.password}
                    onChange={formik.handleChange("password")}
                    onBlur={formik.handleBlur("password")}
                  />
                  <div className="error">
                    {formik.touched.password && formik.errors.password}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <button className="buttons border-0 button" type="submit">
                      Đăng ký
                    </button>
                  </div>
                  <span>
                    Bạn đã có tài khoản?{" "}
                    <Link to="/login" className="signup-link">
                      Đăng nhập
                    </Link>
                  </span>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Signup;
