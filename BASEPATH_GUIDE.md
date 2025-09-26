# Cấu hình Base Path cho ScoreUp Frontend

## Tổng quan
Project này hỗ trợ deploy ở nhiều môi trường khác nhau với các base path khác nhau:

- **Development (localhost)**: `/scoreup/` 
- **Production NEU**: `/scoreup/`
- **Production Root**: `/`

## Cách cấu hình

### 1. Sử dụng Environment Variable (Khuyên dùng)

Tạo/chỉnh sửa file `.env`:

```bash
# Để chạy với base path /scoreup/
VITE_BASE_URL=/scoreup/

# Để chạy ở root /
VITE_BASE_URL=/

# Để chạy với custom path
VITE_BASE_URL=/your-custom-path/
```

### 2. Auto-detect (Fallback)

Nếu không có `VITE_BASE_URL` trong `.env`, hệ thống sẽ:
- Mặc định dùng `/scoreup/` cho tất cả environment
- Có thể tùy chỉnh logic auto-detect trong `src/main.jsx`

## Cấu trúc URL

Với `VITE_BASE_URL=/scoreup/`:

- Homepage: `http://localhost:5173/scoreup/homepage`
- Dashboard: `http://localhost:5173/scoreup/dashboard`  
- Login: `http://localhost:5173/scoreup/`

Với `VITE_BASE_URL=/`:

- Homepage: `http://localhost:5173/homepage`
- Dashboard: `http://localhost:5173/dashboard`
- Login: `http://localhost:5173/`

## Debugging

Khi khởi động app, check console log để xem basepath đang được sử dụng:

```
🚀 ScoreUp Frontend Starting...
📍 Basename: /scoreup/
🌍 Hostname: localhost
🔗 Full URL: http://localhost:5173/scoreup/
```

## Deployment trên Server

### Apache
Cần file `.htaccess`:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /scoreup/
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /scoreup/index.html [L]
</IfModule>
```

### Nginx  
Cấu hình location:
```nginx
location /scoreup/ {
    try_files $uri $uri/ /scoreup/index.html;
}
```

## Common Issues

### 1. Page not found khi access trực tiếp URL
- **Nguyên nhân**: Server chưa được cấu hình để serve SPA
- **Giải pháp**: Cấu hình server để redirect tất cả requests về index.html

### 2. Assets không load được  
- **Nguyên nhân**: Base path không khớp giữa Vite và Router
- **Giải pháp**: Đảm bảo cả `vite.config.js` và `main.jsx` dùng cùng basepath

### 3. Infinite redirect loop
- **Nguyên nhân**: Logic authentication và routing conflict
- **Giải pháp**: Check logic trong `HomePage` component