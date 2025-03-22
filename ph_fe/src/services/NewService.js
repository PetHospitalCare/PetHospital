import axios from "../axios";

//Lấy danh sách bài viết
const GetAllNews = (data) => {
    return axios.get(`/new/get-all`);
};

//Tạo bài viết mới
const CreateNew = (data) => {
    return axios.post(`/new/create-new`, data);
};

//Chỉnh sửa thuốc
const updateNew = (id, data) => {
    return axios.put(`/new/update-new/${id}`, data);
}

//Xóa bài viết
const deleteNew = (id) => {
    return axios.delete(`/new/delete-new/${id}`);
}

export const NewServices = {
    GetAllNews,
    CreateNew,
    updateNew,
    deleteNew
};
