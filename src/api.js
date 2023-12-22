import axios from "axios"

const mapApi = axios.create({
  withCredentials: true,
  baseURL: window.API_URL
})

export default mapApi;
