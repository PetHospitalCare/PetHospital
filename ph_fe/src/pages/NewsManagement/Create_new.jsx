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

const CreateNew = ({ open, onOpenChange, onSuccess }) => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const quillRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await NewServices.CreateNews({ title, content });
            console.log('Post created:', response.data);
            onSuccess(); // Callback khi tạo bài viết thành công
            onOpenChange(false); // Đóng dialog
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Thêm bài viết mới</DialogTitle>
                    <DialogDescription>Nhập thông tin để thêm bài viết vào hệ thống.</DialogDescription>
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
                        <ReactQuill
                            ref={quillRef}
                            id="content"
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={{
                                toolbar: [
                                    ['bold', 'italic', 'underline'],
                                    ['link', 'image', 'video']
                                ]
                            }}
                        />
                    </div>

                    <DialogFooter className='mt-4'>
                        <Button type="submit">Đăng bài</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateNew;
