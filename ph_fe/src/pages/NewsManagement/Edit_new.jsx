import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { NewServices } from '@/services/NewService';
import { X } from 'lucide-react';
import { toast } from 'sonner';

const EditNew = ({ open, onOpenChange, post, onsuccess }) => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const quillRef = useRef(null);

    useEffect(() => {
        if (post) {
            setTitle(post.title || '');
            setContent(post.content || '');
            setImagePreview(post.images?.url || null);
        }
    }, [post]);

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            // Kiểm tra dung lượng file (tối đa 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Dung lượng ảnh vượt quá 5MB, vui lòng chọn ảnh nhỏ hơn.");
                return;
            }

            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);

        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await NewServices.updateNew(post._id, formData);
            onsuccess(); // Callback khi cập nhật bài viết thành công
            onOpenChange(false); // Đóng dialog
            toast.success("Chỉnh sửa bài viết thành công");
        } catch (error) {
            console.error('Error updating post:', error);
            toast.error("Có lỗi xảy ra khi cập nhật bài viết");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto ">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
                    <DialogDescription>Chỉnh sửa thông tin bài viết và lưu thay đổi.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="title">Tiêu đề bài viết</Label>
                        <Input
                            type="text"
                            id="title"
                            placeholder="Tiêu đề"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className='mt-6'>
                        <Label htmlFor="content">Nội dung bài viết</Label>
                        <div style={{ height: '300px', overflowY: 'auto' }}>
                            <ReactQuill
                                ref={quillRef}
                                id="content"
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={{
                                    toolbar: [
                                        [{ header: [1, 2, 3, false] }],
                                        [{ font: [] }],
                                        [{ size: ['small', false, 'large', 'huge'] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ color: [] }, { background: [] }],
                                        [{ script: 'sub' }, { script: 'super' }],
                                        [{ align: [] }],
                                        [{ list: 'ordered' }, { list: 'bullet' }],
                                        [{ indent: '-1' }, { indent: '+1' }],
                                        ['blockquote', 'code-block'],
                                        ['link', 'image', 'video'],
                                        ['clean']
                                    ]
                                }}
                                style={{ height: '250px' }}
                            />
                        </div>
                    </div>
                    <div className='mt-6'>
                        <Label htmlFor="image">Chọn ảnh</Label>
                        <Input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    {imagePreview && (
                        <div className="relative mt-4 w-48">
                            <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-lg shadow" />
                            <button
                                type="button"
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                onClick={handleRemoveImage}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                    <DialogFooter className='mt-4'>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Đang xử lý...' : 'Cập nhật bài viết'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditNew;
