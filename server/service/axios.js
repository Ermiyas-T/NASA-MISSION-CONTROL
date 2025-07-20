const axios = require("axios");
const API_BASE_URL = "https://api.spacexdata.com/v4";

const instance = axios.create({
  baseURL: API_BASE_URL,
});
module.exports = instance;
