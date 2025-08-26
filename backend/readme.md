Backend Folder structure:

![Backend Screenshot](https://github.com/ganesh9912/ratings-app/blob/88ce3f8f93a8a31817390b3bdd7dc1d3204886f9/projectimages/backend.jpg?raw=true)


- `config/` : Database connection configuration.
- `controllers/` : API controller functions.
- `models/` : Database models.
- `routes/` : API routes.
- `utils/` : You can find database table Schema or Structure here.
- `index.js` : Backend server entry point.
- `.env` : Environment variables.

How to Run the Project

Set up Node.js
Ensure that Node.js is installed on your system. 

Set up the Database

Install XAMPP (or any MySQL server).

Create a database named rating.

The project will automatically create the required tables based on the defined table structure.

Configure Environment Variables

Open the .env file in the backend folder.

Set your database credentials:

DB_HOST=your_host
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=rating


Run the Backend Server

Navigate to the backend folder in the terminal.

Run the server using:

run index.js using nodemon or node index.js


This will start the backend and connect to your database and by using utils it creates tables automatically in your backend

Run the Frontend

Navigate to the frontend folder.
Install React using npm
Start React Server using:
npm start


The application should now be running on your local machine.
