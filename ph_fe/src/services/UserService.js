import axios from "../axios";

const signInService = (data) => {
  return axios.post(`/account/signin`, data);
};
export const UserService = {
  signInService,
};
