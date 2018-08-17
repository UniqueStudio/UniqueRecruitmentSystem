FROM nginx:1.15.2-alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /usr/src/app/dashboard /www/dashboard

CMD ["nginx", "-g", "daemon off;"]