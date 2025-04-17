import axios from "../axios";

const signInService = (data) => {
  return axios.post(`/account/signin`, data);
};
const signUpService = (data) => {
  return axios.post("/account/signup", data);
}

const forgotPassword = (data) => {
  return axios.post("/account/forgot-password", data);
}
const changePassword = (data) => {
  return axios.post("/account/change-password", data);
}
const resetPassword = (data) => {
  return axios.post("/account/reset-password", data);
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
const getAccountbyId = (id) => {
  return axios.get(`/account/get-account-by-id/${id}`);
}
export const UserService = {
  signInService,
  signUpService,
  forgotPassword,
  resetPassword,
  changePassword,
  sendOtp,
  verifyOTP,
  getAllAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  getAllDoctor,
  getCurrentUser,
  updateUserAccount,
  uploadAvatar,
  getAccountbyId
};
