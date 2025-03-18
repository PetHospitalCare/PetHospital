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
const getAllDoctor = (id) => {
  return axios.get(`/account/get-all-doctor`);
}
const getCurrentUser = (id) => {
  return axios.get(`/account/current-user`);
}
const updateUserAccount = (data) => {
  return axios.put(`/account/update-user-profile`, data);
}
const uploadAvatar = (data) => {
  return axios.post(`/account/upload-avatar`, data);
}
export const UserService = {
  signInService,
  signUpService,
  sendOtp,
  verifyOTP,
  getAllAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  getAllDoctor,
  getCurrentUser,
  updateUserAccount,
  uploadAvatar
};
