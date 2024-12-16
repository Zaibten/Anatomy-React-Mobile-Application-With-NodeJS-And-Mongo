import axios from "axios";

const ApiManager = axios.create({
  baseURL: "http://192.168.0.111/api",  // Fixed 'baseurl' to 'baseURL' and added comma
  responseType: 'json',                // Added missing comma
  withCredentials: true                // Added missing comma
});

export default ApiManager;
