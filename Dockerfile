FROM stim/nginx:latest

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/conf.d /etc/nginx/conf.d
COPY nginx/GeoIP.dat /etc/nginx/GeoIP.dat
COPY dist /www

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
