FROM mirrors.tencent.com/iomc/master/nginx:1.18-with-staff
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# copy build package from ./dist to /usr/share/nginx/html
COPY ./dist/ /usr/share/nginx/html
