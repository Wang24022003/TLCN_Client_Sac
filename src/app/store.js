import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/user/userSlice";
import productReducer from "../features/products/productSlilce";
import blogReducer from "../features/blogs/blogSlice";
import contactReducer from "../features/contact/contactSlice";
import addressReducer from "../features/addresses/addressSlice";
import pCategoryReducer from "../features/pcategory/pcategorySlice";
import warehouseReducer from "../features/warehouse/warehouseSlide";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    blog: blogReducer,
    contact: contactReducer,
    addressData: addressReducer,
    pCategory: pCategoryReducer,
    warehouse: warehouseReducer,
  },
});
