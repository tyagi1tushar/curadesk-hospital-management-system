# Hospital Management System (MERN Stack)

A full-stack Hospital Management System built using the MERN stack to streamline healthcare operations such as appointment booking, doctor management, patient records, and secure online payments.


# 🚀 Features

## 👨‍💼 Admin Panel

	•	Add, edit, and manage doctors & services
	•	View, reschedule, or cancel appointments
	•	Update appointment status (Pending, Confirmed, Completed, Cancelled)
	•	Track earnings and bookings
	•	Dark mode enabled dashboard 🌙

## 🩺 Doctor Panel

	•	View assigned appointments
	•	Update appointment status
	•	Manage patient interactions

## 🧑 Patient Panel

	•	Register/Login securely (Clerk Auth)
	•	Book appointments with doctors/services
	•	View appointment history
	•	Chatbot assistance for doctor discovery 🤖



# ✨ Core Functionalities

	•	🔐 Role-based Authentication (Admin / Doctor / Patient)
	•	📅 Appointment Scheduling System with status tracking
	•	💳 Online Payments using Stripe (secure checkout & auto-confirmation)
	•	📧 Email Notifications (Nodemailer) for booking updates
	•	🤖 Chatbot Integration for guided booking
	•	🌙 Dark Mode Support (Admin Panel)
	•	🖼️ Image Uploads via Cloudinary
	•	⚡ Responsive UI built with React + Tailwind CSS
	•	🔒 Protected Backend APIs & Middleware Security



# 🧩 Base Template & Customization

This project was initially built using a base template, which was extended and customized with additional features and improvements:

	•	Integrated email notifications (Nodemailer) for appointment updates
	•	Developed a chatbot interface for patient guidance and booking assistance
	•	Implemented dark mode support in the admin panel
	•	Enhanced overall UI/UX and responsiveness
	•	Added Stripe payment integration for secure online transactions
	•	Improved backend logic for appointment status handling and admin controls

# 🛠️ Tech Stack

## Frontend:

	•	React.js (Vite)
	•	Tailwind CSS
	•	Context API

## Backend:

	•	Node.js
	•	Express.js

## Database:

	•	MongoDB (Mongoose)

## Authentication:

	•	Clerk

## Integrations:

	•	Stripe (Payments)
	•	Cloudinary (Image Uploads)
	•	Nodemailer (Emails)



# 📦 Project Structure

```bash
root/
│
├── admin/            # Admin dashboard (React + Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       └── context/
│
├── frontend/         # Patient & Doctor frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── doctor/
│
├── backend/          # Node.js + Express API
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   ├── services/
│   ├── utilities/
│   └── config/
```


# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

	git clone https://github.com/tyagi1tushar/curadesk-hospital-management-system.git
	
	cd hospital-management-system
	
## 2️⃣ Backend Setup

	cd backend
	
	npm install

Create .env file:

	MONGO_URI=your_mongodb_uri
	CLERK_SECRET_KEY=your_clerk_secret
	STRIPE_SECRET_KEY=your_stripe_secret
	CLOUDINARY_CLOUD_NAME=your_cloud_name
	CLOUDINARY_API_KEY=your_api_key
	CLOUDINARY_API_SECRET=your_api_secret
	EMAIL_USER=your_email
	EMAIL_PASS=your_password

Run backend:

	npm start

## 3️⃣ Frontend Setup

Patient/Doctor Frontend

	cd frontend
	npm install
	npm run dev

Admin Panel

	cd admin
	npm install
	npm run dev

# 🔄 Workflow Overview

	1.	Patient selects doctor/service
	2.	Books appointment
	3.	Completes Stripe payment
	4.	Appointment automatically marked as Confirmed
	5.	Email notification sent to patient



# 📸 Screenshots

Add your UI screenshots here (Admin Dashboard, Booking Page, Chatbot, etc.)



# 🌟 Future Improvements

	•	📊 Dashboard analytics (charts & insights)
	•	🔍 Search & filter doctors/services
	•	📱 Full dark mode across all panels
	•	📩 SMS/WhatsApp notifications
	•	🏥 Multi-hospital support



# 📌 Learning Outcomes

	•	Built a complete MERN stack application from scratch
	•	Implemented role-based access control & secure APIs
	•	Integrated Stripe payments, Cloudinary, and email services
	•	Improved skills in system design, UI/UX, and scalability



# 🤝 Contributing

Contributions are welcome! Fork the repo and submit a PR 🚀



# ⭐ Support

If you like this project, give it a ⭐ on GitHub!



# 📬 Contact

Feel free to connect with me for feedback or collaboration.



