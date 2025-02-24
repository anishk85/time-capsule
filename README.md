# 🚀 **Digital Time Capsule**  

## 📌 **Overview**  
The **Digital Time Capsule** is an innovative web platform that allows users to store messages, media, and memories, which will be revealed at a **future date**. Developed during **KrackHack 2025**, this project focuses on **security, AI/ML-powered sentiment analysis, and a seamless user experience
- **Live Website:** [Time Capsule](https://time-capsule-404.netlify.app/)
- **Link To Other 2 Repos:**[Time Capsule](https://github.com/anishk85/time-capsule-fastapi.git),(https://github.com/HarryOhm33/TimeCapsule.git)


---

## **🌟 Features**  

### ✅ **User Authentication**  
- Secure **signup/login** with **OTP verification** via email.  
- **JWT authentication** to protect user data.  

### ✅ **Time Capsule Management**  
- **Create, edit, delete, and share** time capsules.  
- Set a **future unlock date** for messages.  
- **Send capsules** to loved ones via email.  

### ✅ **Dashboard**  
- Displays **locked/unlocked capsules** with scheduled release dates.  

### ✅ **AI-Powered Sentiment Analysis**  
- **NLP-based emotion detection** for messages and titles.  
- **Transformers-based model (`DistilBERT`)** trained for sentiment classification.  
- **FastAPI backend deployed on Render** for efficient AI/ML inference.  

### ✅ **Play Zone (Gamification)**  
- **Memory Challenge** 🎯  
- **Upcoming interactive games** (to enhance engagement).  

### ✅ **Secure Storage & Scheduled Execution**  
- **Cloudinary** integration for **secure image uploads**.  
- **Node-cron & Agenda** for **automated capsule releases**.  

### ✅ **Scalability & Performance**  
- **Cloud-based MongoDB Atlas** for scalable data storage.  
- **Optimized FastAPI backend** for **high-performance AI/ML predictions**.  

---

## **🛠 Tech Stack**  

### **Frontend**  
- **React.js** – UI development  
- **Tailwind CSS** – Responsive styling  
- **Axios** – API communication  
- **React Router** – Page navigation  
- **Framer Motion** – Animations  

### **Backend**  
- **Node.js (Express.js)** – API server  
- **MongoDB Atlas** – NoSQL database  
- **JWT & Bcrypt.js** – Secure authentication  
- **Cloudinary** – Media storage  
- **Nodemailer** – OTP verification & email services  
- **Node-cron & Agenda** – Automated scheduling  

### **AI/ML Integration (FastAPI Backend on Render)**  
- **FastAPI** – Deployed on **Render** for AI/ML inference.  
- **Transformers & DistilBERT** – Emotion detection for capsules.  
- **Torch optimizations** – Efficient processing of sentiment analysis.  

### **Deployment**  
- **Frontend**: Deployed on **Vercel & Netlify**.  
- **Backend**:  
  - **Express.js** API on **Render**.  
  - **FastAPI AI backend** on **Render** (for real-time sentiment classification).  
- **Database**: Hosted on **MongoDB Atlas**.  

---

# 📂 Project Folder Structure

```
📂 project-root
│── 📂 public
│── 📂 src
│   ├── 📂 assets
│   ├── 📂 components
│   │   ├── 📄 AuthPage.jsx
│   │   ├── 📄 LoadingSpinner.jsx
│   │   ├── 📄 NavFooter.jsx
│   │   ├── 📄 ProtectedRoute.jsx
│   ├── 📂 pages
│   │   ├── 📄 CapsuleDetails.jsx
│   │   ├── 📄 Create_Capsule.jsx
│   │   ├── 📄 DashBoard.jsx
│   │   ├── 📄 FunZone.jsx
│   │   ├── 📄 GuessTheAge.jsx
│   │   ├── 📄 Home.jsx
│   │   ├── 📄 MemoryGame.jsx
│   │   ├── 📄 Signup.jsx
│   │   ├── 📄 Success.jsx
│   │   ├── 📄 UpdateCapsule.jsx
│   │   ├── 📄 Verify_Signup.jsx
│   ├── 📂 utils
│   │   ├── 📄 App.jsx
│   ├── 📄 index.css
│   ├── 📄 main.jsx
│── 📄 .env
│── 📄 .gitignore
│── 📄 eslint.config.js
│── 📄 index.html
│── 📄 package-lock.json
│── 📄 package.json
│── 📄 README.md
│── 📄 vite.config.js
```
# 📂 Backend Folder Structure

```
time-capsule-backend/
│── 📂 config/
│   ├── 📄 cloudinary.js
│   ├── 📄 db.js
│   ├── 📄 email.js
│
│── 📂 controllers/
│   ├── 📄 authController.js
│   ├── 📄 capsuleController.js
│   ├── 📄 myCapsuleController.js
│   ├── 📄 videoController.js
│
│── 📂 middlewares/
│   ├── 📄 authMiddleware.js
│
│── 📂 models/
│   ├── 📄 Capsule.js
│   ├── 📄 Email.js
│   ├── 📄 myCapsule.js
│   ├── 📄 OTP.js
│   ├── 📄 User.js
│   ├── 📄 video.js
│
│── 📂 routes/
│   ├── 📄 authRoutes.js
│   ├── 📄 capsuleRoutes.js
│   ├── 📄 myCapsuleRoutes.js
│   ├── 📄 videoRoutes.js
│
│── 📂 tmp/
│── 📂 utils/
│── 📄 .env
│── 📄 .gitignore
│── 📄 LICENSE
│── 📄 package-lock.json
│── 📄 package.json
│── 📄 server.js
```

## **🔧 Installation & Setup**  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/anishk85/time-capsule
cd time-capsule
```

### **2️⃣ Set Up the Backend**  
```sh
cd backend
npm install
```
Create a **`.env`** file inside `backend` and add:  
```sh
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
FASTAPI_URL=https://your-fastapi-url.onrender.com/analyze
```
Start the **Express.js backend server**:  
```sh
npm run dev
```

---

### **3️⃣ FastAPI AI Backend (Deployed on Render)**  

### **4️⃣ Set Up the Frontend**  
```sh
cd ../frontend
npm install
```
Create a **`.env`** file inside `frontend` and add:  
```sh
REACT_APP_BACKEND_URL=http://localhost:5000
```
Start the **frontend server**:  
```sh
npm run dev
```

---

### **5️⃣ Access the Application**  
- **Frontend:** `http://localhost:3000`  
- **Backend API (Express.js):** `http://localhost:5000/api`  


---

## **📌 How AI/ML is Integrated**  

- **User messages & titles** are sent to the **FastAPI backend** for **sentiment classification**.  
- The **DistilBERT NLP model** detects **emotions** and enhances **personalized user experiences**.  
- **FastAPI deployment on Render** ensures **scalability** with optimized model inference.  

---

## **🔮 Future Enhancements**  

🔹 **Blockchain-based storage** for tamper-proof capsules.  
🔹 **Multiple file uploads per capsule**.  
🔹 **More interactive Play Zone games**.  
🔹 **AI-powered content filtering & personalization**.  
🔹 **Role-based access control** for team collaborations.  

---

## **🌎 Scalability & Use Cases**  

- **Personal Journaling** – Store emotions and thoughts for future reflection.  
- **Event Time Capsules** – Send messages for anniversaries, birthdays, and special events.  
- **Corporate Memory Storage** – Preserve company milestones for future employees.  
- **Education & History Archives** – Store historical content with AI-driven insights.  

---

## **📌 Conclusion**  

The **Digital Time Capsule** integrates **AI-powered sentiment analysis** with **secure, time-based memory storage**, creating a **unique and engaging user experience**. Built during **KrackHack 2025**, this project is a **fusion of web development, AI/ML, and cloud technologies**.  

---

### **🔥 Developed by 404 BRAIN NOT FOUND @ KrackHack 2025** 🚀

