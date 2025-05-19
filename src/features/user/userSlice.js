import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { authService } from "./userService";
import { toast } from "react-toastify";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    const re = await authService.register(userData);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const active_account = createAsyncThunk(
  "auth/active_account",
  async (userData, thunkAPI) => {
    const re = await authService.active_account(userData);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const check_active_account = createAsyncThunk(
  "auth/check_active_account",
  async (userData, thunkAPI) => {
    const re = await authService.check_active_account(userData);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    const re = await authService.login(userData);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const getuserProductWishlist = createAsyncThunk(
  "user/wishlist",
  async (thunkAPI) => {
    const re = await authService.getUserWislist();
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);
export const getProductUserRecentView = createAsyncThunk(
  "user/recentlist",
  async (thunkAPI) => {
    const re = await authService.getProductUserRecentView();
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const getuserProductHistory = createAsyncThunk(
  "user/history",
  async (_, thunkAPI) => {
    const re = await authService.getUserHistory();
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const addProdToCart = createAsyncThunk(
  "user/cart/add",
  async (cartData, thunkAPI) => {
    const re = await authService.addToCart(cartData);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const getUserCart = createAsyncThunk(
  "user/cart/get",
  async (thunkAPI) => {
    const re = await authService.getCart();
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const deleteUserCart = createAsyncThunk(
  "user/cart/delete",
  async (thunkAPI) => {
    const re = await authService.emptyCart();
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const getOrders = createAsyncThunk(
  "user/orders/get",
  async (thunkAPI) => {
    const re = await authService.getUserOrders();
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const getAddress = createAsyncThunk(
  "user/address/get",
  async (query, thunkAPI) => {
    const re = await authService.getAddressUser(query);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);
export const deleteAddressUser = createAsyncThunk(
  "user/address/delete",
  async (id, thunkAPI) => {
    const re = await authService.deleteAddressUser(id);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);
export const setDefaultAddressUser = createAsyncThunk(
  "user/address/setDefaultAddressUser",
  async (id, thunkAPI) => {
    const re = await authService.setDefaultAddressUser(id);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);
export const createAddressUser = createAsyncThunk(
  "user/address/add",
  async (data, thunkAPI) => {
    const re = await authService.createAddressUser(data);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);
export const updateAddressUser = createAsyncThunk(
  "user/address/update",
  async (data, thunkAPI) => {
    const re = await authService.updateAddressUser(data);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);
export const getAddressUserDetail = createAsyncThunk(
  "user/address/detail",
  async (id, thunkAPI) => {
    const re = await authService.getAddressUserDetail(id);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const deleteCartProduct = createAsyncThunk(
  "user/cart/product/delete",
  async (data, thunkAPI) => {
    const re = await authService.removeProductFromCart(data);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const createAnOrder = createAsyncThunk(
  "user/cart/create-order",
  async (orderDetail, thunkAPI) => {
    try {
      return await authService.createOrder(orderDetail);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateCartProduct = createAsyncThunk(
  "user/cart/product/update",
  async (cartDetail, thunkAPI) => {
    const re = await authService.updateProductFromCart(cartDetail);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/profile/update",
  async (data, thunkAPI) => {
    const re = await authService.updateUser(data);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);
export const getNewProfile = createAsyncThunk(
  "user/profile/newInfor",
  async (thunkAPI) => {
    const re = await authService.getNewInfoUser();
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const forgotPasswordToken = createAsyncThunk(
  "user/password/token",
  async (data, thunkAPI) => {
    try {
      return await authService.forgotPasswordToken(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/password/reset",
  async (data, thunkAPI) => {
    try {
      return await authService.resetPass(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const chatbot = createAsyncThunk(
  "chat-ai",
  async (chatbotData, thunkAPI) => {
    const re = await authService.chatbot(chatbotData);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const resetState = createAction("Reset_all");

const getCustomerfromLocalStorage = localStorage.getItem("customer")
  ? JSON.parse(localStorage.getItem("customer"))
  : null;

const initialState = {
  user: getCustomerfromLocalStorage,
  address: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  handleApi: "...",
  message: "",
  isBlocked: "...",
  history: [],
  isReload: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(chatbot.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(chatbot.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.token = action.payload.data.reply;
       
      })
      .addCase(chatbot.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdUser = action.payload.data;
        if (state.isSuccess === true) {
          state.handleApi = "resgister";
          toast.info("Đăng ký tài khoản thành công");
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        if (state.isError === true) {
          toast.error(action.payload.message);
        }
      })

      .addCase(active_account.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(active_account.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(active_account.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        if (state.isError === true) {
          toast.error(action.payload.message);
        }
      })

      .addCase(check_active_account.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(check_active_account.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isBlocked = false;
        toast.success("Kích hoạt tài khoản thành công");
        state.handleApi = "activeAccount";
      })
      .addCase(check_active_account.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        if (state.isError === true) {
          toast.error(action.payload.message);
        }
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload;

        if (state.isSuccess === true) {
          localStorage.setItem(
            "access_token",
            action.payload.data.access_token
          );
          localStorage.setItem(
            "customer",
            JSON.stringify(action.payload.data.user)
          );
          localStorage.removeItem("password");
          toast.info("User Logged In Successfully");
        }
        //toast.info("User Logged In Successfully");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        if (state.isError === true) {
          toast.error(action.payload.message);
          if (action.payload.message === "Tài khoản chưa được kích hoạt") {
            state.handleApi = "retryActive";
          }
        }
      })
      .addCase(getuserProductWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getuserProductWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.wishlist = action.payload.data.items;
        state.isReload = false;
      })
      .addCase(getuserProductWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getProductUserRecentView.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductUserRecentView.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.recentView = action.payload.data;
        state.isReload = false;
      })
      .addCase(getProductUserRecentView.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getuserProductHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getuserProductHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.history = action.payload.data;
      })
      .addCase(getuserProductHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(addProdToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProdToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.cartProduct = action.payload.data;
        if (state.isSuccess) {
          toast.success("Product Added To Cart");
        }
      })
      .addCase(addProdToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getUserCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.cartProducts = action.payload.data;
        state.isReload = false;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteCartProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedCartProduct = action.payload;
        if (state.isSuccess) {
          toast.success("Product Deleted From Cart Successfully!");
        }
      })
      .addCase(deleteCartProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        if (state.isError) {
          toast.error("Something Went Wrong!");
        }
      })
      .addCase(updateCartProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedCartProduct = action.payload.data;
        if (state.isSuccess) {
          toast.success("Product Updated Successfully!");
        }
      })
      .addCase(updateCartProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        if (state.isError) {
          toast.error("Something Went Wrong!");
        }
      })
      .addCase(createAnOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAnOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.orderedProduct = action.payload;
        if (state.isSuccess) {
          toast.success("Ordered createad Successfully!");
        }
      })
      .addCase(createAnOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        if (state.isError) {
          toast.error("Something Went Wrong!");
        }
      })
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.getorderedProduct = action.payload.data.result;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedUser = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        if (state.isError) {
          toast.error("Something Went Wrong!");
        }
      })
      .addCase(getNewProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNewProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedUser = action.payload.data.user;

        if (state.isSuccess === true) {
          localStorage.setItem(
            "customer",
            JSON.stringify(action.payload.data.user)
          );
          state.user = action.payload.data.user;
          toast.success("Profile Updated Successfully!");
        }
      })
      .addCase(getNewProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        if (state.isError) {
          toast.error("Something Went Wrong!");
        }
      })

      .addCase(forgotPasswordToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPasswordToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.token = action.payload;
        if (state.isSuccess) {
          toast.success("Kiểm tra gmail để đặt lại mật khẩu!");
        }
      })
      .addCase(forgotPasswordToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        if (state.isError) {
          toast.error("Something Went Wrong!");
        }
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.pass = action.payload;
        if (state.isSuccess) {
          toast.success("Password change Successfully!");
        }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        if (state.isError) {
          toast.error("Something Went Wrong!");
        }
      })
      .addCase(deleteUserCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUserCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedCart = action.payload;
      })
      .addCase(deleteUserCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.addressUser = action.payload.data.result;
        state.isReload = false;
      })
      .addCase(getAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteAddressUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAddressUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isReload = true;
        if (state.isSuccess) {
          toast.success("Xóa địa chỉ thành công");
        }
        // state.addressUser = action.payload.data.result;
      })
      .addCase(deleteAddressUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        if (state.isError) {
          toast.error(action.payload.message);
        }
        state.message = action.error;
      })
      .addCase(setDefaultAddressUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setDefaultAddressUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isReload = true;
        // state.addressUser = action.payload.data.result;
      })
      .addCase(setDefaultAddressUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        if (state.isError) {
          toast.error(action.payload.message);
        }
        state.message = action.error;
      })
      .addCase(createAddressUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAddressUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isReload = true;
        if (state.isSuccess) {
          toast.success("Create new address successful");
        }
        // state.addressUser = action.payload.data.result;
      })
      .addCase(updateAddressUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        if (state.isError) {
          toast.error(action.payload.message);
        }
        state.message = action.error;
      })
      .addCase(updateAddressUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAddressUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isReload = true;
        if (state.isSuccess) {
          toast.success("Update address successful");
        }
        // state.addressUser = action.payload.data.result;
      })
      .addCase(createAddressUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        if (state.isError) {
          toast.error(action.payload.message);
        }
        state.message = action.error;
      })
      .addCase(getAddressUserDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAddressUserDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isReload = true;
        if (state.isSuccess) {
          //toast.success("Create new address successful");
          state.address = action.payload.data;
        }
        // state.addressUser = action.payload.data.result;
      })
      .addCase(getAddressUserDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        if (state.isError) {
          toast.error(action.payload.message);
        }
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);
  },
});

export default authSlice.reducer;
