import React, { useState, useRef } from 'react';
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

const CreateNew = ({ open, onOpenChange, onSuccess }) => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const quillRef = useRef(null);

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
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
            // Make sure the field name matches what your backend expects
            formData.append('image', image);
        }

        try {
            const response = await NewServices.CreateNew(formData);
            onSuccess(); // Callback khi tạo bài viết thành công
            onOpenChange(false); // Đóng dialog
            toast.success("Tạo bài viết thành công");
            // Reset form
            setTitle('');
            setContent('');
            setImage(null);
            setImagePreview(null);
        } catch (error) {
            console.error('Error creating post:', error);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
            alert(`Không thể tạo bài viết: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1200px]">
                <DialogHeader>
                    <DialogTitle>Thêm bài viết mới</DialogTitle>
                    <DialogDescription>Nhập thông tin để thêm bài viết vào hệ thống.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                            required
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
                            {isSubmitting ? 'Đang xử lý...' : 'Đăng bài'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateNew;