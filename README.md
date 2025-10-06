# Sentinel-AI

## Overview

Sentinal-AI is a comprehensive cybersecurity scanning and monitoring platform designed to identify, analyze, and report on various security vulnerabilities in web applications. The platform leverages AI to provide intelligent threat detection and actionable security insights.

## Features

- **Vulnerability Scanning**: Detect SQL injections, XSS, and other common web vulnerabilities
- **Network Monitoring**: Real-time network traffic analysis and visualization
- **Security Reports**: Generate detailed security reports with remediation recommendations
- **Dashboard Analytics**: Visualize security metrics and trends
- **User Authentication**: Secure login and user management via Firebase
- **Customizable Scans**: Configure scan types (Quick, Full, Custom) based on your needs

## How it Works (Workflow)

1. **Login Page**
   ![Login](https://github.com/user-attachments/assets/697a67b8-2c51-4595-bbd9-c7eab404dc24)
   > Secure user login via Firebase Authentication

2. **Dashboard page**
   ![Dashboard](https://github.com/user-attachments/assets/489fc543-0bd1-4edb-8454-f468bbd4cb14)
   > Visual metrics and analytics about threats, past scans, and risk levels

3. **Scanner Page**
   ![Scanner](https://github.com/user-attachments/assets/3e8fee69-f4f0-4125-a124-2161e4124639)
   > Users can upload any url & configure scan options: Quick, Full, or Custom

 **Scan Results**
 4. **SQL Injection**
   ![SQL Injection](https://github.com/user-attachments/assets/b3f8d92f-bb89-403c-ad04-c261e8321f34)
   > 2D visualization showing the scan progress and percentage for SQL Injection vulnerability

5. **DDoS Attack**
   ![DDoS Attack](https://github.com/user-attachments/assets/10010a17-8ba1-408e-9c17-4459d053898a)
   > 2D visualization showing the scan progress and percentage for DDoS attack vulnerability

6. **MITM Attack**
   ![MITM Attack](https://github.com/user-attachments/assets/bb074b81-7f11-4676-8a61-4aaa58531eec)
   > 2D visualization showing the scan progress and percentage for MITM attack vulnerability

7. **Reports Section**
   ![Reports](https://github.com/user-attachments/assets/99ce498c-aae1-40ce-b85d-c06903c84af1)
   > List of generated reports for downloaded insights and report table with types, severity, and recommendations of the scanned link

8. **Network Graph**
   ![Network](https://github.com/user-attachments/assets/7524c948-eebb-4f40-aa64-746ed56bbcee)
   > Visual representation of network connections and vulnerabilities of the scanned link

9. **User Profile**
   ![Profile](https://github.com/user-attachments/assets/c6c4bc36-c45a-4317-bbb8-13d15422268d)
   > User settings and past activity overview

---

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn-ui, Tailwind CSS, Lucide React icons
- **State Management**: React Context API, TanStack Query
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Visualization**: Recharts, vis-network
- **PDF Export**: jsPDF, jsPDF-autotable


## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Firebase account for authentication and database services

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/GarvLakhina/Sentinal-AI.git
   cd Sentinal-AI
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Configure Firebase:
   - Create a `.env` file in the root directory
   - Add your Firebase configuration:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. Start the development server:
   ```sh
   npm run dev
   ```

5. For the backend scanning service:
   - install FastAPI `pip install fastapi uvicorn`
   - Ensure the backend API is running on `http://localhost:8000`
   - run cd backend and `uvicorn main:app --reload --port 5000`
   - Or update the API endpoint in `src/contexts/ScanContext.tsx`

## Usage

1. **Login**: Access the application using your Firebase authentication credentials
2. **Dashboard**: View overall security metrics and recent scan results
3. **Scanner**: Configure and run security scans on target websites
4. **Reports**: Generate and export detailed security reports
5. **Network**: Visualize network connections and potential threats
6. **Monitoring**: Set up continuous monitoring for critical assets

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build

### Project Structure

```
Sentinal-AI/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── layout/      # Layout components
│   │   ├── reports/     # Report-related components
│   │   ├── scanner/     # Scanner-related components
│   │   └── ui/          # shadcn UI components
│   ├── contexts/        # React Context providers
│   ├── firebase/        # Firebase configuration
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   ├── styles/          # Global styles
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── .env                 # Environment variables (create this)
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
## Acknowledgments

- shadcn-ui for the beautiful UI components
- Firebase for authentication and database services
- The React community for their amazing tools and libraries

## Acknowledgments

- shadcn-ui for the beautiful UI components
- Firebase for authentication and database services
- The React community for their amazing tools and libraries

  ## Contributors

- [Jitesh050](https://github.com/Jitesh050)
- [Meghashree-V](https://github.com/Meghashree-V)
- [GarvLakhina](https://github.com/GarvLakhina)
- [nehakaruna](https://github.com/nehakaruna)

