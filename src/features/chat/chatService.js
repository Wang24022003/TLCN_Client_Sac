import axios from 'axios';
import { base_url, config } from '../../utils/axiosConfig';
import instance from '../../utils/axios-customize';

const sendMessage = async (data) => {
  const response = await instance.post('message', data);
  return response;
};

const getChatRoom = async () => {
  const response = await instance.get('client/chat-rooms');
  return response;
};

const getMessages = async (chatRoom) => {
  const response = await instance.get(
    `message?chatRoom=${chatRoom}&limit=10000`,
  );
  return response;
};

export const chatService = { sendMessage, getChatRoom, getMessages };
