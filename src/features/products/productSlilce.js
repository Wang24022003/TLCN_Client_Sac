import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { productSevice } from "./productService";

export const getAllProducts = createAsyncThunk(
  "product/get",
  async (data, thunkAPI) => {
    const re = await productSevice.getProducts(data);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const getAProduct = createAsyncThunk(
  "product/getAProduct",
  async (data, thunkAPI) => {
    const { id, isLogin } = data;
    const re =
      isLogin === true
        ? await productSevice.getSingleProductForUser(id)
        : await productSevice.getSingleProduct(id);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "product/wishlist/add",
  async (prodId, thunkAPI) => {
    const re = await productSevice.addToWishlist(prodId);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);
export const removeToWishlist = createAsyncThunk(
  "product/wishlist/remove",
  async (prodId, thunkAPI) => {
    const re = await productSevice.removeToWishlist(prodId);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const addRating = createAsyncThunk(
  "product/rating",
  async (data, thunkAPI) => {
    const re = await productSevice.rateProduct(data);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/update-order",
  async (data, thunkAPI) => {
    try {
      return await productSevice.updateOrder(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);


export const getUserReviews = createAsyncThunk(
  "product/getUserReviews",
  async (data, thunkAPI) => {
    const re = await productSevice.getUserReviews(data);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);


const productState = {
  product: [],
  compareList: [],
  singleproduct: null,
  addToWishlist: null,
  userReviews: [],
  rating: null,
  isReload: false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const productSlice = createSlice({
  name: "product",
  initialState: productState,
  reducers: {
    toggleCompare: (state, action) => {
      const productId = action.payload;
      const existingIndex = state.compareList.findIndex(
        (item) => item._id === productId
      );
      if (existingIndex >= 0) {
        state.compareList.splice(existingIndex, 1);
      } else {
        const product = state.product.find((item) => item._id === productId);
        if (product) state.compareList.push(product);
      }
    },
    clearCompareList: (state) => {
      state.compareList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isReload = false;
      
        const result = action.payload.data.result;
      
        // Đảm bảo inventory không bị mất trong map/redux
        state.product = result.map((item) => ({
          ...item,
          inventory: item.inventory,
        }));
      })      
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;

        state.addToWishlist = action.payload;
        state.message = "Product Added to Wishlist!";
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(removeToWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;

        state.removeToWishlist = action.payload;
        state.message = "Product Added to Wishlist!";
      })
      .addCase(removeToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.singleproduct = {
          ...action.payload.data.product,
          quantityComments: action.payload.data.quantityComments,
          inventory: action.payload.data.inventory,
        };
        state.isReload = false;

        state.message = "Product Fetched Successfully";
      })
      .addCase(getAProduct.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getUserReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.userReviews = action.payload.data.result; // ✅ Gán danh sách đánh giá
      })
      .addCase(getUserReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(addRating.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addRating.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isReload = true;
        state.rating = action.payload.data;
        state.message = "Rating Added Successfully";
        if (state.isSuccess) {
          
        }
      })
      .addCase(addRating.rejected, (state, action) => {
        if (state.isError) {
          toast.error(action.payload.message);
        }
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(updateOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.updateorder = action.payload;
        if (state.isSuccess === true) {
          toast.success("Trạng thái đơn hàng đã được cập nhật");
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      });
      
  },
});

export const { toggleCompare, clearCompareList } = productSlice.actions;

export default productSlice.reducer;
