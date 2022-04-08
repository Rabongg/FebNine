FROM  --platform=linux/x86-64 node:16-alpine
COPY ./ /home/nest
WORKDIR /home/nest
RUN yarn 
RUN yarn build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["yarn", "start:prod"]