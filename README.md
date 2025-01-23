# FitKnight

Welcome to **FitKnight**, a fitness community platform where users can connect, join fitness groups, and find workout buddies based on shared goals and preferences.

## 🚀 Tech Stack

This project is powered by a variety of technologies to ensure a smooth and responsive experience for users.

### Frontend:
- **React (Vite)** – Super fast and modern frontend framework
- **ShadCN** – Beautiful UI components
- **TailwindCSS** – Utility-first styling for rapid UI development
- **React Router DOM** – Smooth client-side navigation
- **React Icons** – Crisp and clean icons
- **React Select** – Stylish dropdowns and multi-select options
- **React Modal** – Seamless modal handling
- **Zustand** – Simple and efficient state management
- **React Leaflet & Leaflet** – Interactive maps and geolocation
- **Axios** – Handling HTTP requests with ease
- **Emoji Picker React** – Add a little fun to your messages with emojis
- **Tooltip** – Smooth and responsive tooltips
- **Lottie** – Beautiful animations for better UX

### Backend:
- **Node.js** – Fast and scalable JavaScript runtime
- **Express.js** – Minimalist web framework for handling routes and API
- **MongoDB Atlas** – Cloud-based NoSQL database
- **Mongoose** – Elegant MongoDB object modeling
- **Dotenv** – Manage environment variables securely
- **Cors** – Secure cross-origin requests
- **Cookie-Parser** – Handle cookies with ease
- **Bcrypt** – Secure password hashing
- **JSON Web Token (JWT)** – Authentication done right
- **Multer** – Handle file uploads effortlessly
- **Nodemon** – Automatic server restarts during development

## 🔥 Features

- **User Authentication:**
  - Secure login & signup with JWT authentication
  - Role-based access (Squire & Knight)
  
- **Profile Management:**
  - Update profile info including fitness goals & preferences
  - Upload profile pictures with file validation
  
- **Group Management:**
  - Create and join fitness groups
  - View group members and send join requests
  - Real-time notifications for requests and approvals
  
- **Buddy System:**
  - Find and connect with fitness buddies based on preferences
  - Accept or decline buddy requests

- **Messaging:**
  - Real-time chat within groups and direct messages
  - Emoji support and smooth UI

- **Geolocation Features:**
  - Find fitness groups based on location
  - Display maps using Leaflet

- **Notifications:**
  - Real-time notifications with WebSockets
  - Track unread messages and actions

## 🛠️ Setup & Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/yourusername/fitknight.git
   cd fitknight
   ```

2. Install dependencies:
   ```sh
   npm install
   cd client
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root folder and add:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLOUDINARY_URL=your_cloudinary_url
   ```

4. Start the server:
   ```sh
   npm run dev
   ```

5. Start the frontend:
   ```sh
   cd client
   npm run dev
   ```

6. Visit `http://localhost:5173` in your browser.

## 📂 Project Structure

```
FitKnight/
│-- backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│
│-- client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│
│-- .env
│-- package.json
│-- README.md
```

## 🚧 Future Improvements

- Implementing push notifications
- Enhancing UI responsiveness for smaller devices
- Adding group activity tracking

## 🏆 Contributing

Feel free to contribute to this project! Fork the repo, make your changes, and submit a pull request.

## 📄 License

This project is licensed under the MIT License.

---

Enjoy building and staying fit with **FitKnight**! 💪

