/*
 * File này (api/upload.js) là backend Serverless của anh.
 * Nhiệm vụ: Nhận file từ frontend, upload lên Vercel Blob, và trả về URL.
 *
 * Anh T làm theo hướng dẫn trong 'quy_trinh_deploy_vercel.md':
 * 1. Cài Vercel CLI.
 * 2. Chạy `vercel link` để kết nối dự án.
 * 3. Chạy `vercel blob link` để liên kết kho lưu trữ Blob.
 * (Vercel sẽ tự động quản lý các biến môi trường sau bước 3)
 */
import { put } from '@vercel/blob';

// Tắt body parser mặc định của Vercel
// Điều này BẮT BUỘC để xử lý file upload (FormData)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request, response) {
  // Chỉ cho phép phương thức POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Vercel tự động cung cấp request.formData() khi config đúng
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return response.status(400).json({ error: 'No file provided.' });
    }

    // Upload file lên Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public', // Cho phép truy cập công khai file này
      // Có thể thêm prefix, ví dụ: `audit_files/${file.name}`
    });

    // Trả về URL của file đã upload
    return response.status(200).json({ url: blob.url });

  } catch (error) {
    console.error('Lỗi upload:', error);
    return response.status(500).json({ error: 'Upload file thất bại.' });
  }
}