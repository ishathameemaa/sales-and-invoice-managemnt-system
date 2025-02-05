worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /run/nginx.pid;

# Load dynamic modules
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format main '$remote_addr - $remote_user [$time_local] '
                      '"$request" $status $body_bytes_sent '
                      '"$http_referer" "$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    keepalive_timeout 65;
    types_hash_max_size 4096;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # SSL Configuration for tomatoez.shop
    server {
        listen 443 ssl;
        server_name tomatoez.shop www.tomatoez.shop;

        ssl_certificate /etc/letsencrypt/live/tomatoez.shop/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/tomatoez.shop/privkey.pem;
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        location / {
            proxy_pass http://localhost:4000;  # Forward to your backend
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }

    # HTTP Configuration for tomatoez.shop - Redirect to HTTPS
    server {
        listen 80;
        server_name tomatoez.shop www.tomatoez.shop;
        return 301 https://$host$request_uri;
    }

    # SSL Configuration for lebaba.tomatoez.shop
    server {
        listen 443 ssl;
        server_name lebaba.tomatoez.shop;

        ssl_certificate /etc/letsencrypt/live/lebaba.tomatoez.shop/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/lebaba.tomatoez.shop/privkey.pem;
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        location / {
            proxy_pass http://localhost:5000;  # Forward to your backend
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }

    # HTTP Configuration for lebaba.tomatoez.shop - Redirect to HTTPS
    server {
        listen 80;
        server_name lebaba.tomatoez.shop;
        return 301 https://$host$request_uri;
    }

    # HTTP Configuration for dashboard.tomatoez.shop (No SSL)
    server {
        listen 80;
        server_name dashboard.tomatoez.shop;

        location / {
            proxy_pass http://localhost:6000;  # Forward to your backend
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
