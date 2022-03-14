# Nest

### 필요조건
+ Node.js 16.X
+ yarn 1.22.17
+ .env.development or .env.test or .env.production
------------
## 실행방법

### Local에서 서버 실행
```
$ yarn
```
</br>

### development 모드로 실행
```
$ yarn start:dev
```

- swagger document
[swagger 문서](http://localhost:3000/api)

</br>

### production 모드

- docker-compose 수정 해주기
- /etc/nginx/default.conf 파일 생성해주기

</br>

### docker로 실행
- docker-compose 이용
```
docker-compose up -d
```

- Dockerfile 변경했을 시
```
docker-compose up -d --build
```
