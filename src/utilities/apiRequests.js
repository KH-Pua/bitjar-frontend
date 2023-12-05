import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const apiRequest = axios.create({
  baseURL: BACKEND_URL,
});

export { apiRequest };
