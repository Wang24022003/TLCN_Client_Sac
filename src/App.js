import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import OurStore from "./pages/OurStore";
import Compare from "./pages/Compare";
import Blog from "./pages/Blog";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Forgotpassword from "./pages/Forgotpassword";
import Signup from "./pages/Signup";
import Resetpassword from "./pages/Resetpassword";
import SingleBlog from "./pages/SingleBlog";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPloicy from "./pages/RefundPloicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import TermAndContions from "./pages/TermAndContions";
import SingleProduct from "./pages/SingleProduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { PrivateRoutes } from "./routing/PrivateRoutes";
import { OpenRoutes } from "./routing/OpenRoutes";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import VNPayReturn from "./pages/VNPayReturn";
import OTPVerification from "./pages/OTPVerification";
import History from "./pages/History";
import Address from "./pages/Address";
import AddAddress from "./pages/AddAddress";
import UpdateAddress from "./pages/UpdateAddress";
import ProductHistory from "./pages/ProductHistory";
import Dashboard from "./pages/Dashboard";
import ProtectUser from "./utils/ProtectUser";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="product" element={<OurStore />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="product/:id" element={<SingleProduct />} />
            <Route path="blogs" element={<Blog />} />
            <Route path="blog/:id" element={<SingleBlog />} />
            <Route
              path="cart"element={
                <PrivateRoutes>
                  <Cart />
                </PrivateRoutes>
              }
            />
            <Route
              path="my-orders"
              element={
                <PrivateRoutes>
                  <Orders />
                </PrivateRoutes>
              }
            />
            <Route
              path="address"
              element={
                <PrivateRoutes>
                  <Address />
                </PrivateRoutes>
              }
            />
            <Route
              path="add-address"
              element={
                <PrivateRoutes>
                  <AddAddress />
                </PrivateRoutes>
              }
            />
            <Route
              path="update-address/:_id"
              element={
                <PrivateRoutes>
                  <UpdateAddress />
                </PrivateRoutes>
              }
            />
            <Route
              path="my-profile"
              element={
                <PrivateRoutes>
                  <Profile />
                </PrivateRoutes>
              }
            />
            <Route
              path="checkout"
              element={
                <PrivateRoutes>
                  <Checkout />
                </PrivateRoutes>
              }
            />
            <Route
              path="wishlist"
              element={
                <PrivateRoutes>
                  <Wishlist />
                </PrivateRoutes>
              }
            />
            <Route
              path="history"
              element={
                <PrivateRoutes>
                  <History />
                </PrivateRoutes>
              }
            />
            <Route
              path="product-history"
              element={
                <PrivateRoutes>
                  <ProductHistory />
                </PrivateRoutes>
              }
            />
            <Route
              path="login"
              element={
                <OpenRoutes>
                  <Login />
                </OpenRoutes>
              }
            />
            <Route path="forgot-password" element={<Forgotpassword />} />
            <Route
              path="signup"
              element={
                <OpenRoutes>
                  <Signup />
                </OpenRoutes>
              }
            />

            {/* <Route path="/dashboad" element={<Dashboard />} /> */}
            <Route path="/otp/:id" element={<OTPVerification />} />
            <Route path="reset-password/:token" element={<Resetpassword />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="refund-policy" element={<RefundPloicy />} />
            <Route path="shipping-policy" element={<ShippingPolicy />} />
            <Route path="term-conditions" element={<TermAndContions />} />
            <Route path="vnpay_return" element={<VNPayReturn />} />
          </Route>


          <Route path='/dashboard' element={<ProtectUser/>} >
              <Route path='/dashboard' element={<Dashboard/>} >
              
              <Route path='my-orders' element={<Orders/>} />
              <Route path='profile' element={<Profile/>} />
              
              <Route path='my-wishlist' element={<Wishlist/>} /> 
              <Route path='history' element={<History/>} /> 
              <Route path='address' element={<Address/>} />
              <Route path='add-address' element={<AddAddress/>} /> 
              <Route path='update-address/:_id' element={<UpdateAddress/>} />
             
      
            </Route> 
            </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
