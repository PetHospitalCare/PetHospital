import axios from "../axios";
const getPetByUser = (data) => {
    return axios.get(`/pet/get-pet-by-user`);
}
const createPetByUser = (data) => {
    return axios.post(`/pet/create-pet-by-user`,data);
}
const updatePet = (id, data) => {
    return axios.put(`/pet/update-pet-info/${id}`,data);
}
const uploadPetAvatar = (id, data) => {
    return axios.post(`/pet/upload-pet-avatar/${id}`,data);
}

const deletePetByUser = (id) => {
    return axios.delete(`/pet/delete-pet-by-user/${id}`);
}

export const PetService = {
    getPetByUser,
    createPetByUser,
    updatePet,
    uploadPetAvatar,
    deletePetByUser
};
