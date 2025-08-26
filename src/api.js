// src/api/api.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/datn/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;