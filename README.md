# Harmonious

### Description
This is a full stack task management website built with security features using auth0, node.js, express, mongodb, mongoose, and handlebars.

### Table of Contents
- [Api Documentation](#api-documentation)
- [Deployed Website](#deployed-website)
- [User Story](#user-story)
- [Installation](#installation)
- [Docker](#docker)
- [Testing](#testing)
- [Website Screenshots](#website-screenshots)
- [Development](#development)
- [Technology Used](#technology-used)
- [Acknowledgements](#acknowledgements)

### Api Documentation
https://documenter.getpostman.com/view/33125592/2sA2rFRL3L

### Deployed Website
https://harmonius.onrender.com/

### User Story
##### As a user, I want to:
      1. Create an account using a third party provider
      2. View my current tasks and projects
      3. Add, update, and delete projects
      4. Add, update, and delete tasks
      5. View stats about my projects
      6. View stats about my tasks
### Installation
Navigate to the `.env.example` file. Remove the `.example` extention from the file name. In this file you will find environment vaiables that need to be defined for this application to work. 

Navigate to [MongoDB](https://www.mongodb.com/) and follow the instructions for setting up a database for the MONGODB_URL 

For the rest of the environment variable Navigate to [Auth0](https://auth0.com/) and follow the instructions for setting up a nodejs web application. 

Once the environment variables are defined, from the root project directory run: 
 ``` javascript
     // install necesarry dependencies
     npm install

     // run the program
     npm run dev
```
If you navigate to the `/seed` directory, there is data that you can use to add projects and tasks
### Docker
This app has an associated Dockerfile attached. The image itself is not on Dockerhub, but you an still build an image and run it locally, to do so follow these steps:

      1. Install Docker
      2. In the root project directory run the follwing commands in the terminal: 
 ``` javascript
      // Build the image
      docker build . -t harmonious
      
      // Run the program
      docker run -p 4000:4000 harmonious
``` 
### Testing 
Run the following from the root diectory to run the tests:
 ``` javascript
 npm run test
```
Note: There will be a handlebars error that can be ignored. Wait a few seconds and the tests should pass despite these errors.
### Website Screenshots
##### Landing Page
![Screenshot 2024-02-28 4 10 52 PM](https://github.com/DominiqueNix/task-manager/assets/145811793/1f80d3b6-71a8-4be6-b891-230e55ec8396)

##### Dashboard
![Screenshot 2024-02-28 4 03 04 PM](https://github.com/DominiqueNix/task-manager/assets/145811793/c8c6a747-51d6-40e6-be7c-780027c72406)

##### Project View
![Screenshot 2024-02-28 4 03 19 PM](https://github.com/DominiqueNix/task-manager/assets/145811793/16fee53d-832d-4cba-a39c-98f9e9220c01)

##### Task View
![Screenshot 2024-02-28 4 03 30 PM](https://github.com/DominiqueNix/task-manager/assets/145811793/e5e06e9b-9e91-4af1-8906-aeb739933d5e)

### Development
##### Wireframes
![Screenshot 2024-02-27 1 36 17 PM](https://github.com/DominiqueNix/task-manager/assets/145811793/0c175f31-4768-4063-a4e7-1fd3432ade75)

### Technology Used
<div>
<img src="https://img.shields.io/badge/Handlebars%20js-f0772b?style=for-the-badge&logo=handlebarsdotjs&logoColor=black" />
<img src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white"/>
<img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
</div>
<div>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
<img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white"/>
<img src="https://img.shields.io/badge/Atuh0-000000?style=for-the-badge&logo=auth0&logoColor=white"/>
</div>

###  Acknowledgements

![MDN](https://img.shields.io/badge/MDN_Web_Docs-black?style=for-the-badge&logo=mdnwebdocs&logoColor=white)
![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)
![Stack Overflow](https://img.shields.io/badge/-Stackoverflow-FE7A16?style=for-the-badge&logo=stack-overflow&logoColor=white)
![GeeksForGeeks](https://img.shields.io/badge/GeeksforGeeks-gray?style=for-the-badge&logo=geeksforgeeks&logoColor=35914c)
![Dribble](https://img.shields.io/badge/Dribbble-EA4C89?style=for-the-badge&logo=dribbble&logoColor=white)
![W3 School](https://img.shields.io/badge/W3Schools-04AA6D?style=for-the-badge&logo=W3Schools&logoColor=white)

