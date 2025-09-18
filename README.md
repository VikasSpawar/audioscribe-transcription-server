# 🎤 Audio Transcription Server

This is the backend server for **AudioTex**, a real-time and file-based audio transcription app.  
It handles authentication, audio uploads, streaming with AssemblyAI, and history management via Supabase.

---

## 📂 Project Structure

```plaintext
📁 src
├── 📁 controllers
│   ├── streamingController.js        # Handles AssemblyAI WebSocket streaming
│   └── transcriptionController.js    # Handles file-based transcription
├── 📁 middleware
│   ├── authMiddleware.js             # Protects private routes
│   └── multerConfig.js               # File upload config
├── 📁 routes
│   ├── auth.js                       # Authentication routes (login/signup)
│   ├── history.js                    # Manage transcription history
│   └── upload.js                     # Upload audio for transcription
├── 📁 services
│   ├── assemblyaiService.js          # Handles AssemblyAI API (file upload)
│   ├── assemblyaiStreamingService.js # Handles AssemblyAI WebSocket streaming
│   └── supabaseService.js            # Supabase client & queries
└── app.js                            # Express app entry point
🚀 Features
🔑 Authentication (Supabase Auth)

⬆️ Upload Audio Files (MP3, WAV, etc.)

🟢 Real-time Transcription using AssemblyAI WebSocket

📝 Transcription History stored in Supabase

🔒 Protected Routes via middleware

⚡ Modular Structure for easy scaling

🛠️ Tech Stack
Node.js + Express

AssemblyAI (Streaming & File API)

Supabase (Auth + Database)

Multer (file uploads)

⚙️ Setup & Installation
1️⃣ Clone Repo

git clone https://github.com/your-username/audio-transcription-server.git
cd audio-transcription-server

2️⃣ Install Dependencies
npm install

3️⃣ Create .env File
Create a .env file in the root:

PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_or_service_role_key
ASSEMBLYAI_API_KEY=your_assembly_ai_key
JWT_SECRET=your_secret_key

4️⃣ Run Server
npm run dev

Server will run at:
👉 http://localhost:5000

📌 API Endpoints
🔑 Auth
POST /auth/signup → Register new user

POST /auth/login → Login existing user

⬆️ Upload
POST /upload → Upload audio file for transcription

🟢 Streaming
POST /stream/start → Start real-time transcription

📝 History
GET /history → Get user’s transcription history

POST /history → Save a new transcription

🧪 Example Request (Upload)
bash
Copy code
curl -X POST http://localhost:5000/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@sample.mp3
