import axios from "axios";
import host from "./api";

const API_URL = host + "/api/auth";

export const register = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

export const login = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData);
};
