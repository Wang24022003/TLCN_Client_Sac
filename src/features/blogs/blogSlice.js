import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { blogService } from "./blogService";

// Thunk to get all blogs
export const getAllBlogs = createAsyncThunk("blogs/get", async (thunkAPI) => {
  const re = await blogService.getBlogs();
  if (re && re.data) {
    return re;
  } else {
    return thunkAPI.rejectWithValue(re);
  }
});

// Thunk to get a single blog
export const getABlog = createAsyncThunk("blog/get", async (id, thunkAPI) => {
  const re = await blogService.getBlog(id);
  if (re && re.data) {
    return re;
  } else {
    return thunkAPI.rejectWithValue(re);
  }
});

// Thunk to get blog categories
export const getBlogCategories = createAsyncThunk(
  "blogs/getCategories",
  async (thunkAPI) => {
    try {
      return await blogService.getBlogCategories();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const blogState = {
  blog: "",
  categories: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const blogSlice = createSlice({
  name: "blog",
  initialState: blogState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBlogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.blog = action.payload.data.result;
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getABlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getABlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.singleblog = action.payload.data;
      })
      .addCase(getABlog.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getBlogCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBlogCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.categories = action.payload;
      })
      .addCase(getBlogCategories.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      });
  },
});

export default blogSlice.reducer;
