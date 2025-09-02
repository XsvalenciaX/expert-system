import axios from "axios";

// Configura la URL base del backend (ajusta el puerto según tu Flask/FastAPI)
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
