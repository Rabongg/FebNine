FROM node:16-alpine
COPY ./ /home/nest
WORKDIR /home/nest
RUN yarn
EXPOSE 3000
CMD ["yarn", "start:dev"]