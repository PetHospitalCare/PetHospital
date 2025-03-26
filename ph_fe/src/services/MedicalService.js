import axios from "../axios";

const getMedicalByBookingId = (id) => {
    return axios.get(`/medical/get-by-booking/${id}`);
};
const CreateNewMedical = (data) => {
    return axios.post(`/medical/create`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const UpdateMedical = (id, data) => {
    return axios.put(`/medical/update/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
const getAllMedicalRecords = () => {
    return axios.get(`/medical/get-all`);
};
export const MeidicalServices = {
    getMedicalByBookingId, CreateNewMedical, UpdateMedical, getAllMedicalRecords
};
