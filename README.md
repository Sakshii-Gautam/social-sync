# Social-Sync (Social Media Web Application)   

Deployed site link: [SocialSync](https://social-sync.netlify.app/)   

SocialSync is social media application built using React for the frontend and Firebase as the backend service. The app allows users to create and share posts, follow other users, and interact with posts through likes and comments. It provides a seamless and engaging experience for users to connect with others and share their thoughts and content.    

## Features   

* **User Registration and Login:** Users can create an account and securely log in to the app. 
* **Home Feed:** The app displays a personalized home feed that showcases posts from the users that the logged-in user is following. The feed is sorted chronologically, ensuring the latest content is prominently shown.
* **Create New Posts:** Users have the ability to create new posts, including the option to upload images and tag other users. This feature allows for sharing content and mentioning other users in posts.
* **Like and Comment:** Users can like and comment on posts, providing an interactive and engaging experience. Users can express their appreciation for posts through likes and engage in discussions through comments.
* **User Profiles:** Each user has a profile that displays their profile picture, bio, and posts. The posts are sorted by date, showcasing the user's activity and content over time.
* **Follow and Unfollow:** Users can follow or unfollow other users based on their interests and preferences. This functionality enables users to curate their feed and stay up-to-date with the latest content from their favorite creators.

## Technologies Used   

* ReactJS v.18.2
* Typescript for type checkings and code maintainablity
* Material Tailwind as the UI component library
* Tailwind CSS as the css framework
* Firebase for backend functionalities
* React Context API for state management
* Formik with Yup validations for form validations

## Installation and Setup

1. Clone the repository from GitHub   
```git clone https://github.com/Sakshii-Gautam/social-sync.git```

2. Install dependencies  
```npm install```

3. Start the application  
```npm run dev```

4. Access the application on `http://localhost:5173`   

## Deployment

The project can be deployed to a cloud service, by running the following command:

`npm run build`
