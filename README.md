<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,100:22c55e&height=200&section=header&text=CuraDesk&fontSize=40&fontColor=ffffff&animation=fadeIn&fontAlignY=35"/>
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?size=22&color=22C55E&center=true&vCenter=true&width=700&lines=Hospital+Management+System;MERN+Stack+Project;Admin+Doctor+Patient+Panels;Secure+Payments+%26+Appointments"/>
</p>

# Hospital Management System (MERN Stack)

<p align="center">

![Frontend](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)
![Backend](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js)
![Database](https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb)
![Payments](https://img.shields.io/badge/Payments-Stripe-purple?style=for-the-badge&logo=stripe)

</p>

## 🚀 Features

👨‍💼 Admin Panel

-	Add, edit, and manage doctors & services
-	View, reschedule, or cancel appointments
-	Update appointment status (Pending, Confirmed, Completed, Cancelled)
-	Track earnings and bookings
-	Dark mode enabled dashboard 🌙

 🩺 Doctor Panel

-	View assigned appointments
-	Update appointment status
-	Manage patient interactions

 🧑 Patient Panel

-	Register/Login securely (Clerk Auth)
-	Book appointments with doctors/services
-	View appointment history
-	Chatbot assistance for doctor discovery 🤖



## ✨ Core Functionalities

-	🔐 Role-based Authentication (Admin / Doctor / Patient)
-	📅 Appointment Scheduling System with status tracking
-	💳 Online Payments using Stripe (secure checkout & auto-confirmation)
-	📧 Email Notifications (Nodemailer) for booking updates
-	🤖 Chatbot Integration for guided doctor booking
-	🌙 Dark Mode Support (Admin Panel)
-	🖼️ Image Uploads via Cloudinary
-	⚡ Responsive UI built with React + Tailwind CSS
-	🔒 Protected Backend APIs & Middleware Security


## 🛠️ Tech Stack

 Frontend:

-	React.js (Vite)
-	Tailwind CSS
-	Context API

 Backend:

-	Node.js
-	Express.js

 Database:

-	MongoDB (Mongoose)

 Authentication:

-	Clerk

 Integrations:

-	Stripe (Payments)
-	Cloudinary (Image Uploads)
-	Nodemailer (Emails)



## 📦 Project Structure

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


## ⚙️ Installation & Setup

 1️⃣ Clone Repository

	git clone https://github.com/tyagi1tushar/curadesk-hospital-management-system.git
	
	cd hospital-management-system
	
 2️⃣ Backend Setup

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
	EMAIL_PASS=your_email_app_password

Run backend:

	npm start

 3️⃣ Frontend Setup

Patient/Doctor Frontend

	cd frontend
	npm install
	npm run dev

Admin Panel

	cd admin
	npm install
	npm run dev

## 🔄 Workflow Overview

1.	Patient selects doctor/service
2.	Books appointment
3.	Completes Stripe payment
4.	Appointment automatically marked as Confirmed
5.	Email notification sent to patient



## 📸 Screenshots

### 🧑‍💻 User Experience

<table>
<tr>
<td align="center">

<img src="./screenshots/user-dashboard.png" width="100%" />
<br/>
<b>User Dashboard</b><br/>
Overview of user activity and appointments

</td>

<td align="center">

<img src="./screenshots/booking.png" width="100%" />
<br/>
<b>Booking System</b><br/>
Book appointments with doctors/services

</td>
</tr>

<tr>
<td align="center">

<img src="./screenshots/payment.png" width="100%" />
<br/>
<b>Payment Flow</b><br/>
Secure Stripe checkout experience

</td>

<td align="center">

<img src="./screenshots/chatbot.png" width="100%" />
<br/>
<b>AI Chatbot</b><br/>
Helps users discover suitable doctors

</td>
</tr>

<tr>
<td align="center">

<img src="./screenshots/user-history.png" width="100%" />
<br/>
<b>Appointment History</b><br/>
Track past and upcoming bookings

</td>

<td align="center">

<img src="./screenshots/user-profile.png" width="100%" />
<br/>
<b>User Profile</b><br/>
Manage personal details and records

</td>
</tr>
</table>

---

### 🩺 Doctor Panel

<table>
<tr>
<td align="center">

<img src="./screenshots/doctor-dashboard.png" width="100%" />
<br/>
<b>Doctor Dashboard</b><br/>
View and manage assigned appointments

</td>

<td align="center">

<img src="./screenshots/doctor-profile.png" width="100%" />
<br/>
<b>Doctor Profile Management</b><br/>
Update profile status and manage patient interactions

</td>
</tr>
</table>

---

### 🌗 Admin Dashboard (Light vs Dark Mode)

<table>
<tr>
<td align="center">

<b>🌞 Light Mode</b><br/>
<img src="./screenshots/admin-dashboard-light.png" width="100%" />

</td>

<td align="center">

<b>🌙 Dark Mode</b><br/>
<img src="./screenshots/admin-dashboard-dark.png" width="100%" />

</td>
</tr>
</table>

Dark mode is implemented in the admin panel to enhance usability during extended operational workflows.

---

### 👨‍💼 Admin Controls

<table>
<tr>
<td align="center">

<img src="./screenshots/admin-doctors.png" width="100%" />
<br/>
<b>Doctor Management</b><br/>
Add, edit, and manage doctors

</td>

<td align="center">

<img src="./screenshots/admin-appointments-doctors.png" width="100%" />
<br/>
<b>Doctor Appointment Management</b><br/>
Update statuses and manage bookings for Doctors

</td>
</tr>

<tr>
<td align="center">

<img src="./screenshots/admin-appointment-services.png" width="100%" />
<br/>
<b>Service Appointment Management</b><br/>
Update statuses and manage bookings for Services

</td>

<td align="center">

<img src="./screenshots/admin-services.png" width="100%" />
<br/>
<b>Service Management</b><br/>
Manage available hospital services

</td>
</tr>
</table>



## 🌟 Future Improvements

-	📊 Dashboard analytics (charts & insights)
-	📱 Full dark mode across all panels
-	📩 SMS/WhatsApp notifications
-	🏥 Multi-hospital support



## 📌 Learning Outcomes

-	Built a complete MERN stack application from scratch
-	Implemented role-based access control & secure APIs
-	Integrated Stripe payments, Cloudinary, and email services
-	Improved skills in system design, UI/UX, and scalability

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:22c55e,100:0f172a&height=120&section=footer"/>
</p>






