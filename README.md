# Gemini Flash API Server

This project is a simple yet powerful backend server built with Express.js that serves as an interface to Google's advanced Gemini AI models. It is specifically configured to use the efficient and capable `gemini-2.5-flash` model, providing a fast and responsive AI experience.

The API exposes several endpoints to handle various types of generative AI tasks, including text generation, image analysis, document summarization, and audio transcription.

## ✨ Features

This API server provides the following capabilities, accessible through distinct endpoints:

1.  **📝 Generate Text (`/generate-text`)**

    - **Functionality**: Accepts a simple text prompt and returns a generated text response from the Gemini model.
    - **Use Case**: Ideal for chatbots, content creation, brainstorming, and general question-answering.

2.  **🖼️ Generate from Image (`/generate-from-image`)**

    - **Functionality**: Allows you to upload an image (e.g., JPEG, PNG) along with an optional text prompt. The API analyzes the image and generates a textual response.
    - **Use Case**: Describing what's in a picture, identifying objects, answering questions about an image, or creating stories based on visual input.

3.  **📄 Generate from Document (`/generate-from-document`)**

    - **Functionality**: Supports uploading documents (e.g., PDF, TXT). You can provide a prompt to guide the AI's analysis of the document content.
    - **Use Case**: Summarizing long reports, extracting key information from articles, answering questions based on a document's content.

4.  **🔊 Generate from Audio (`/generate-from-audio`)**
    - **Functionality**: Takes an audio file (e.g., MP3, WAV) and an optional prompt to process the audio data.
    - **Use Case**: Transcribing spoken words from an audio recording, summarizing meetings, or analyzing audio content.

## 🛠️ Technology Stack

- **Backend**: Node.js with Express.js
- **AI**: Google Gemini AI via `@google/genai` SDK
- **File Handling**: `multer` for processing multipart/form-data uploads
- **Environment**: `dotenv` for managing API keys and configuration

## 🚀 Getting Started

Follow these steps to clone the repository and run the project on your local machine.

### Prerequisites

- Node.js (v18 or later recommended)
- Git

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ras-24/gemini-flash-api.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd gemini-flash-api
    ```
3.  **Install the dependencies:**
    ```bash
    npm install
    ```
4.  **Create an environment file:**
    Create a `.env` file in the root of the project and add your Google Gemini API key:
    ```
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```
5.  **Start the server:**
    ```bash
    npm start
    ```
The server will start and be accessible at `http://localhost:3000`.

## ✅ Testing with Postman

All four API endpoints have been thoroughly tested using **Postman** to ensure they are fully functional and behave as expected. The tests covered:

- Sending text prompts.
- Uploading image, document, and audio files.
- Receiving successful JSON responses from the server.

### Generate Text

### Generate from Image

### Generate from Document

### Generate from Audio
