## CRUD Assignment

A full-stack CRUD application built to manage users. This project demonstrates a clean UI using React & Tailwind CSS, a robust backend with Node.js & Express, and automated email notifications using Nodemailer. The project is hosted live [here](https://crud-hosted-frontend.vercel.app/) (it might be a little bit slow because it's hosted on the free vercel tier).

### Features
1. User Management (CRUD):
    - Create: Add new users with Name, Email, and State.
    - Read: View a clean list of all users.
    - Update: Edit user details with pre-filled forms.
    - Delete: Remove users with a safety confirmation prompt.

2. Automated Notifications:
    - Users receive real-time emails via Nodemailer when their account is created, updated, or deleted.
    - Non-blocking UI popups provide instant feedback for every action.

3. Analytics:
    - Displays user distribution grouped by Indian States.

## Techstack
Frontend: React (Vite), Tailwind CSS and Axios
Backend: Node.js, Express.js
Database: MongoDB (mongoose)
Services: Nodemailer (Gmail)

## How to run locally:

### Step 1: Install necessary packages:
Run `npm install` inside both backend and frontend folders.

### Step 2: .env file
Create a .env file inside backend folder. It should contain the following content:

```
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Start the servers

In backend folder, run `npm run server` and in frontend folder, run `npm run dev`. Now open your browser and go to the URL http://localhost:5173
