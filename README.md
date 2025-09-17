# Audio Transcription Server

This project is an audio transcription web application built with Node.js, Express, and Supabase. It allows users to upload audio files for transcription and stores the files in Supabase.

## Features

- Upload audio files using Multer middleware.
- Store audio files in Supabase.
- Process audio files for transcription.

## Project Structure

```
audio-transcription-server
├── src
│   ├── app.js                # Entry point of the application
│   ├── routes
│   │   └── upload.js         # Route for handling audio file uploads
│   ├── controllers
│   │   └── transcriptionController.js # Controller for processing audio files
│   ├── services
│   │   └── supabaseService.js # Service for interacting with Supabase
│   └── middleware
│       └── multerConfig.js    # Middleware for configuring file uploads
├── package.json               # NPM configuration file
├── .env                       # Environment variables
└── README.md                  # Project documentation
```

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```
   cd audio-transcription-server
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your Supabase credentials:

   ```
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_KEY=<your-supabase-key>
   ```

## Usage

1. Start the server:

   ```
   npm start
   ```

2. Use a tool like Postman or cURL to send a POST request to `/upload` with the audio file.

## License

This project is licensed under the MIT License.