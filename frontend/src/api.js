import axios from "axios";

const API = axios.create({
  baseURL: "https://event-management-backend-gkne.onrender.com",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.authorization = token;
  }

  return req;
});

export default API;
