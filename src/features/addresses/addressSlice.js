import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { addressService } from "./addressService";

export const getProvinces = createAsyncThunk(
  "addressData/provinces/get",
  async (thunkAPI) => {
    const re = await addressService.getProvinces();
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);
export const getDistricts = createAsyncThunk(
  "addressData/districts/get",
  async (data, thunkAPI) => {
    const { provinceId } = data;
    const re = await addressService.getDistricts(provinceId);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);
export const getWards = createAsyncThunk(
  "addressData/wards/get",
  async (data, thunkAPI) => {
    const { provinceId, districtId } = data;
    const re = await addressService.getWards(provinceId, districtId);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

const addressState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  isReload: false,
  message: "",
  provinces: [],
  districts: [],
  wards: [],
};

export const addressSlice = createSlice({
  name: "addressData",
  initialState: addressState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProvinces.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProvinces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.provinces = action.payload.data;
      })
      .addCase(getProvinces.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getDistricts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDistricts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.districts = action.payload.data;
      })
      .addCase(getDistricts.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getWards.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.wards = action.payload.data;
      })
      .addCase(getWards.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      });
  },
});

export default addressSlice.reducer;
