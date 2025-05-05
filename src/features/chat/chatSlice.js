import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { chatService } from './chatService';

export const sendMessage = createAsyncThunk(
  'message',
  async (data, thunkAPI) => {
    const re = await chatService.sendMessage(data);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  },
);

export const getChatRoom = createAsyncThunk(
  'client/chat-rooms',
  async (thunkAPI) => {
    const re = await chatService.getChatRoom();
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  },
);
