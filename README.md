# AI Resume Analyzer

An intelligent resume analysis platform that leverages AI to evaluate resumes, extract key information, and provide actionable insights for job seekers and recruiters.

## 🚀 Features

- **AI-Powered Analysis**: Advanced resume parsing and evaluation using machine learning
- **Multi-format Support**: Supports PDF and image file uploads with conversion capabilities
- **Real-time Processing**: Instant resume analysis and feedback
- **Interactive Dashboard**: Modern, responsive UI for viewing analysis results
- **Cloud Integration**: Seamless file handling with Puter.js cloud storage
- **RESTful API**: Comprehensive backend API for integration capabilities

## 🛠️ Tech Stack

### Frontend
- **React 18+** - Modern JavaScript library for building user interfaces
- **React Router v7** - Latest version for client-side routing
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development

### Backend
- **Python 3.8+** - Core backend language
- **Django 4.x** - High-level Python web framework
- **Django REST Framework (DRF)** - Powerful toolkit for building Web APIs

### AI & Machine Learning
- **MLC (Machine Learning Compiler)** - AI model optimization and deployment

### File Processing
- **PDF Library** - PDF parsing and text extraction
- **Image Conversion** - Image-to-text conversion for scanned documents
- **Puter.js** - Cloud storage and file management

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)
- npm or yarn

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Database Setup
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Optional: create admin user
```

#### Start Backend Server
```bash
python manage.py runserver
```
Backend will be available at `http://localhost:8000`

### 3. Frontend Setup

#### Open New Terminal and Navigate to Frontend
```bash
cd frontend
```

#### Install Node Dependencies
```bash
npm install
# or
yarn install
```

#### Start Development Server
```bash
npm run dev
# or
yarn dev
```
Frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
ai-resume-analyzer/
├── backend/
│   ├── ai_resume_analyzer/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── resumes/
│   │   ├── analysis/
│   │   └── users/
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
├── docs/
├── .gitignore
└── README.md
```

## 🔧 Configuration

### Backend Configuration

Create a `.env` file in the backend directory:
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3

# AI Model Configuration
MLC_MODEL_PATH=path/to/your/model
AI_API_KEY=your-ai-api-key

# Puter.js Configuration
PUTER_API_KEY=your-puter-api-key
```

### Frontend Configuration

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_PUTER_API_KEY=your-puter-api-key
```

## 🚀 API Endpoints

### Resume Analysis
- `POST /api/resumes/upload/` - Upload resume file
- `GET /api/resumes/{id}/` - Get resume details
- `POST /api/resumes/{id}/analyze/` - Analyze resume
- `GET /api/analysis/{id}/` - Get analysis results

### User Management
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout

## 🎯 Usage

1. **Upload Resume**: Navigate to the upload page and select your PDF or image file
2. **Processing**: The system will automatically extract text and convert images if needed
3. **AI Analysis**: Advanced ML models analyze the resume for:
   - Skills extraction
   - Experience evaluation
   - Format assessment
   - Improvement suggestions
4. **Results**: View comprehensive analysis results with actionable insights

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📦 Deployment

### Backend Deployment (Production)

1. **Install Production Dependencies**
```bash
pip install gunicorn psycopg2-binary
```

2. **Update Settings for Production**
```python
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']
```

3. **Run with Gunicorn**
```bash
gunicorn ai_resume_analyzer.wsgi:application
```

### Frontend Deployment

```bash
npm run build
# Deploy the build folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing frontend framework
- Django team for the robust backend framework
- MLC team for AI optimization tools
- Puter.js for cloud storage solutions
- All contributors who helped make this project better

## 📞 Support

If you have any questions or run into issues, please:
- Check the [Issues](https://github.com/yourusername/ai-resume-analyzer/issues) page
- Create a new issue if needed
- Contact us at support@yourproject.com

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added image conversion support
- **v1.2.0** - Enhanced AI analysis capabilities

---

**Made with ❤️ for better resume analysis**
