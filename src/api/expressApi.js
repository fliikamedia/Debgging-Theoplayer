import axios from "axios";

export default axios.create({
  baseURL: "https://fliika-user-api.azurewebsites.net/",
});
