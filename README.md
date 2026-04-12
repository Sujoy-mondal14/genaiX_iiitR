# Campus Problem Solver AI Agent

An AI-powered campus problem resolver that automatically classifies student complaints and routes them to the correct department using natural language processing.

## Challenge Overview
Students can submit issues via a web portal, which are then categorized by an AI agent and assigned to maintenance or other relevant staff for resolution. 

### Features
- **Student Submission Portal**: A web form allowing students to submit campus issues with textual descriptions and image uploads.
- **AI Classification Agent**: Leverages an LLM (Google Generative AI) to accurately categorize complaints into predefined categories:
  - Bathroom & Hygiene
  - Anti-Ragging & Safety
  - Mess & Food Quality
  - Academic Issues
  - Infrastructure/Maintenance
  - Other
- **Automatic Routing**: Maps the classified category to the specific department or resolution executive.
- **Dashboards**:
  - *User Tracking Dashboard*: Students can track the live status of their submitted issues, view tracking IDs, and read admin responses.
  - *Admin/Executive Dashboard*: Staff can view assigned problems, update statuses (e.g., In Progress, Resolved), and add resolution remarks.

## Tech Stack
- **Frontend**: React (Vite), TailwindCSS, React Router DOM, Lucide React
- **Backend API**: FastAPI, Uvicorn, Python-Multipart
- **Database**: SQLite & SQLAlchemy
- **AI / Machine Learning**: Google Generative AI (Gemini)

---

## Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v16.x or higher)
- **Python** (v3.8 or higher)
- **A valid Google Gemini API Key**

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd "<your-project-directory>"
```

### 2. Backend Setup
Set up the Python environment and run the backend FastAPI server.

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# For macOS/Linux:
source venv/bin/activate
# For Windows:
# venv\Scripts\activate

# Install the required dependencies
pip install -r requirements.txt
```

**Environment Variables**: 
Create a file named `.env` in the root (or `backend`) directory with your API key:
```env
GOOGLE_API_KEY="your_api_key_here"
```

**Run the Backend Server**:
```bash
cd backend
uvicorn main:app --reload
```
*The API will run locally at `http://127.0.0.1:8000`*

### 3. Frontend Setup
Open a new terminal window / tab, and navigate to the frontend folder.

```bash
cd frontend

# Install Node modules
npm install

# Start the Vite development server
npm run dev
```
*The Frontend will run locally at `http://localhost:5173`*

---

## Usage Instructions

1. **Access the Portal**: Open your web browser and navigate to `http://localhost:5173`.
2. **Submit a Grievance**: Use the home page to describe the problem. The AI agent will process your submission, classify it, and route it to the correct department.
3. **Track Status**: A confirmation tracking ID will be generated. You can monitor the resolution progress from your user dashboard.
4. **Admin Resolution**: Staff and executives can log in to the admin dashboard to review categorized tickets, mark them as 'Resolved', and assist students efficiently.

---

## AI Agent Classification Accuracy
The classification agent utilizes LLM capabilities for text processing and contextual understanding to accurately bucket the inputs into the 6 categories. *Note: As per project guidelines, the target accuracy threshold is ≥ 75%.* Low-confidence predictions apply a fallback strategy alerting the admin for manual review.
