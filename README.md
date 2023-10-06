# InternetRadio

[![Version 1.0](https://img.shields.io/badge/Version-v1.0.0-blue)]()
[![Live demo](https://img.shields.io/badge/Live-Demo-blue)](http://jkluradio.sidharthv.tech/)

A Cross-platform Real-time Audio Streaming platform.

# Tech Stacks

![](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![](https://img.shields.io/badge/NodeJS-logo?style=for-the-badge&logo=nodedotjs&logoColor=white)
![](https://img.shields.io/badge/ExpressJS-logo?style=for-the-badge&logo=express&logoColor=white&color=grey)
![](https://img.shields.io/badge/MongoDB-logo?style=for-the-badge&logo=mongodb&logoColor=white)
![](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![](https://img.shields.io/badge/WebRTC-logo?style=for-the-badge&logo=webrtc&color=red)

# Features
- Authentication - Email/Phone No.
- Create Profile - Upload avatar
- Create Rooms
- Join Rooms
- Real-Time Audio sharing

# Setup Project

### How to run the Project
### Install without docker

Follow the following steps to get development environment running without Docker.

* Clone repository from GitHub
  
  ```
  
  git clone https://github.com/sidharth1017/InternetRadio.git
  
  ```

* Go to frontend folder

  ```
  
  cd .\frontend\
  
  ```

* Install node modules

   ```
   
   npm install

   ```

* Now, go to backend folder in another terminal
  
  ```
  
  cd .\backend\
  
  ```

* Similarly install node modules here too

  ```
   
   npm install
  
  ```

### Starting servers

* Frontend server

  You have to create .env file to run the server
  
  ```
  
    REACT_APP_API_URL=http://localhost:5500
    REACT_APP_SOCKET_SERVER_URL=http://localhost:5500
    NODE_ENV=development
  
  ```
  Go to terminal where you installed frontend node modules

  ```

  npm start

  ```

  Note - Server will start on port 5500

* Backend server
  
  You have to create .env file to run the server
  ```
  
    HASH_SECRET = 
    SMS_SID = 
    SMS_AUTH_TOKEN = 
    SMS_FROM_NUMBER = 
    DB_URL = 
    JWT_ACCESS_TOKEN_SECRET = 
    JWT_REFRESH_TOKEN_SECRET = 
    EMAIL = 
    PASSWORD =
    BASE_URL = http://localhost:5500
    FRONT_URL = http://localhost:3000
    NODE_ENV = development
  
  ```
  
  Now, go to the terminal where you installed backend node modules
  
    ```

      npm run dev

    ```

### Install and run with docker

Follow the following steps to get development environment running using Docker.
  ```
    docker-compose -f .\docker-compose.dev.yml up -d --build
  ```

---





    


    

  

  




