// import React from "react";

// export default function Add_Modal({ open, onClose }) {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
//         <h2 className="text-lg font-bold mb-4">Thêm sản phẩm mới</h2>
//         <form>
//           <div className="mb-4">
//             <label htmlFor="pName" className="block text-sm font-medium">Tên sản phẩm</label>
//             <input
//               type="text"
//               id="pName"
//               className="border rounded-md w-1/2 p-2 mt-1"
//               placeholder="Enter your email"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="quantity" className="block text-sm font-medium">số lượng</label>
//             <input
//               type="number"
//               id="quantity"
//               className="border rounded-md w-1/2 p-2 mt-1"
//               placeholder="Enter your password"
//             />
//           </div>
//           <div className="flex justify-between items-center">
//           <button
//               type="button"
//               onClick={onClose}
//               className="text-red-500 underline"
//             >
//               Cancel
//             </button>
//             <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Thêm sản phẩm</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";

export default function Add_Modal({ open, onClose }) {
  const [images, setImages] = useState([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > 9) {
      alert("Bạn chỉ được tải tối đa 9 ảnh.");
      return;
    }
    setImages([...images, ...files]);
  };

  const handleImageRemove = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4 text-left">Thêm sản phẩm mới</h2>
        <form>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="pName" className="block text-sm font-medium text-left mb-1">Tên sản phẩm</label>
              <input
                type="text"
                id="pName"
                className="border rounded-md w-full p-2"
                placeholder="Nhập tên sản phẩm"
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-left mb-1">Số lượng</label>
              <input
                type="number"
                id="quantity"
                className="border rounded-md w-full p-2"
                placeholder="Nhập số lượng"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-left mb-1">Giá tiền</label>
              <input
                type="number"
                id="price"
                className="border rounded-md w-full p-2"
                placeholder="Nhập giá tiền"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-left mb-1">Danh mục</label>
              <select
                id="category"
                className="border rounded-md w-full p-2"
                defaultValue=""
              >
                <option value="" disabled>Chọn danh mục</option>
                <option value="Thuốc">Thuốc</option>
                <option value="Phụ kiện">Phụ kiện</option>
                <option value="Đồ ăn">Đồ ăn</option>
              </select>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-left mb-1">Loài động vật</label>
              <select
                id="type"
                className="border rounded-md w-full p-2"
                defaultValue=""
              >
                <option value="" disabled>Chọn loài động vật</option>
                <option value="Dog">Chó</option>
                <option value="Cat">Mèo</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-left mb-1">Thêm ảnh (tối đa 9 ảnh)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="border rounded-md w-full p-2"
            />
            <div className="grid grid-cols-3 gap-2 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Uploaded preview"
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex justify-center items-center"
                    onClick={() => handleImageRemove(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="text-red-500 underline"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Thêm sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
