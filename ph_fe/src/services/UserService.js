import axios from "../axios";

const signInService = (data) => {
  return axios.post(`/account/signin`, data);
};
const signUpService = (data) => {
  return axios.post("/account/signup", data);
}
const sendOtp = (data) => {
  return axios.post("/account/send-otp", data);

}
const verifyOTP = (data) => {
  return axios.post("/account/verify-otp", data);

}
const getAllAccount = () => axios.get("/account/get-all");

const createAccount = (data) => {
  return axios.post("/account/createnewaccount", data);
}

const updateAccount = (id, data) => {
  return axios.put(`/account/edit/${id}`, data);
}
const deleteAccount = (id) => {
  return axios.delete(`/account/delete${id}`);
}
export const UserService = {
  signInService,
  signUpService,
  sendOtp,
  verifyOTP,
  getAllAccount,
  createAccount,
  updateAccount,
  deleteAccount
};
