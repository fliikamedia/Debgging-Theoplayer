import axios from "axios";

export default axios.create({
  baseURL:
    // "https://ipgeolocation.abstractapi.com/v1/?api_key=1a9aca489f7a4011bf341eb6c3883062",
    "https://api.ipdata.co/?api-key=2c7b6a05daec7950cc0b3d7fd70d0bc08761644db9d5191b0dafcd12",
});
