# 🏨 LuxeStay - Hotel Booking System

A full-stack Hotel Booking System built with **Spring Boot** (backend) and **React** (frontend).

---

## 👥 User Roles
| Role | Access |
|------|--------|
| **Customer** | Browse rooms, make bookings, payment, cancel |
| **Admin** | Dashboard, manage rooms, manage all bookings, check-in/check-out |

---

## ✨ Features
- Register & Login (role-based)
- Browse & Filter Rooms by type and availability
- Room Booking with date selection
- Payment Page (Cash / UPI / Card / Net Banking)
- My Bookings with cancel option
- Admin Dashboard with stats
- Admin Room Management (Add / Edit / Delete)
- Admin Booking Management (Check-in / Check-out / Cancel)

---

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.2, Spring Data JPA |
| Database | MySQL |
| Frontend | React 18, React Router, Axios |
| Styling | Plain CSS |

---

## ⚙️ Setup Instructions

### Step 1 — MySQL Database
Open MySQL and run:
```sql
CREATE DATABASE hotel_booking_db;
```

### Step 2 — Configure Backend
Open this file:
```
backend/src/main/resources/application.properties
```
Update your MySQL password:
```properties
spring.datasource.password=your_mysql_password
```

### Step 3 — Run Backend in VS Code
1. Open VS Code
2. File → Open Folder → select the `backend` folder
3. Open `src/main/java/com/hotelbooking/HotelBookingApplication.java`
4. Click **Run** above the main method

OR in VS Code terminal:
```powershell
.\mvnw.cmd spring-boot:run
```

Wait for: `Started HotelBookingApplication in X seconds`
Backend runs on: **http://localhost:8080**

### Step 4 — Run Frontend
Open a new terminal in VS Code (click + button):
```powershell
cd ..\frontend
npm install
npm start
```
Frontend runs on: **http://localhost:3000**

---

## 🧪 How to Test

### As Admin
- Login with: `admin@hotel.com` / `admin123`
  *(Register an admin account first with these credentials)*
- Go to **Manage Rooms** → Add rooms
- Go to **All Bookings** → Check-in / Check-out guests

### As Customer
- Register a new Customer account
- Go to **Browse Rooms** → Filter by type
- Click **Book Now** → Select dates → Pay
- Go to **My Bookings** → Track status

---

## 📡 API Endpoints

### Users
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/users/register | Register |
| POST | /api/users/login | Login |
| GET | /api/users | Get all users |

### Rooms
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/rooms | All rooms |
| GET | /api/rooms/available | Available rooms |
| POST | /api/rooms | Add room |
| PUT | /api/rooms/{id} | Update room |
| DELETE | /api/rooms/{id} | Delete room |

### Bookings
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/bookings | Create booking |
| GET | /api/bookings | All bookings |
| GET | /api/bookings/user/{id} | User's bookings |
| PUT | /api/bookings/{id}/status | Update status |
| PUT | /api/bookings/{id}/payment | Confirm payment |
| PUT | /api/bookings/{id}/cancel | Cancel booking |

---

## 📁 Project Structure

```
hotel-booking-system/
├── backend/
│   ├── pom.xml
│   ├── mvnw.cmd
│   └── src/main/java/com/hotelbooking/
│       ├── HotelBookingApplication.java
│       ├── config/CorsConfig.java
│       ├── model/     (User, Room, Booking)
│       ├── repository/
│       ├── service/
│       └── controller/
│
└── frontend/
    ├── package.json
    └── src/
        ├── App.js
        ├── index.css
        ├── services/api.js
        ├── components/Navbar.js
        └── pages/
            ├── Login.js
            ├── Register.js
            ├── Rooms.js
            ├── BookRoom.js
            ├── PaymentPage.js
            ├── MyBookings.js
            ├── AdminDashboard.js
            ├── ManageRooms.js
            └── ManageBookings.js
```

---

*Built for academic submission — Hotel Booking System*
"# TT_Project" 
