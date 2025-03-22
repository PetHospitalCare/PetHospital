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

const EditNew = ({ open, onOpenChange, post, onSuccess }) => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const quillRef = useRef(null);

    useEffect(() => {
        if (post) {
            setTitle(post.title || '');
            setContent(post.content || '');
        }
    }, [post]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // const response = await NewServices.UpdateNews(post._id, { title, content });
            console.log('Post updated:', response.data);
            onSuccess(); // Callback khi cập nhật bài viết thành công
            onOpenChange(false); // Đóng dialog
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
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
                        <Button type="submit">Lưu thay đổi</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditNew;
