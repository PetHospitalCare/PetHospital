import axios from "../axios";

const GetAllNews = (data) => {
    return axios.get(`/new/get-all`);
};
const CreateNews = (data) => {
    return axios.post(`/new/create`, data);
};

export const NewServices = {
    GetAllNews,
    CreateNews
};
