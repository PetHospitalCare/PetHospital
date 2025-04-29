import axios from "../axios";

const getAllService = () => {
    return axios.get(`/service/get-all`);
};
const getAllServiceById = (id) => {
    return axios.get(`/service/get-by-id/${id}`);
};
const CreateNewSubService = (id, data) => {
    return axios.post(`/service/create/${id}`, data);
};
const DeleteSubService = (id, sid) => {
    return axios.delete(`/service/${id}/sub-service/${sid}`);
};
const EditSubService = (id, sid, data) => {
    return axios.put(`/service/${id}/sub-service/${sid}`, data);
}
export const Services = {
    getAllService, getAllServiceById, CreateNewSubService, DeleteSubService,
    EditSubService
};
