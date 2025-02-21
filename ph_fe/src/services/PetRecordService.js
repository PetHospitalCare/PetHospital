import axios from "../axios";

const createPetRecord = (data) => {
    return axios.post(`/petRecord/create`,data);
  
}

const deletePetRecord = (id) => {
  return axios.delete(`/petRecord/delete${id}`);
}

const getAllPetRecords = () => axios.get("/petRecord/get-all");

const updatePetRecord = (id) => {
    return axios.put(`/petRecord/update${id}`);
}

export const PetRecordService = {
    createPetRecord,
    deletePetRecord,
    getAllPetRecords,
    updatePetRecord
};
