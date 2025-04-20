# Collaborative Project Management Tool

A full-stack web application for team collaboration and project management with real-time features.

## Features

- 🔐 User Authentication & Authorization

  - JWT-based authentication
  - Role-based access control (Admin, Member, Observer)
  - Secure password handling

- 📋 Project Management

  - Interactive Kanban board with drag-and-drop
  - Gantt chart for timeline visualization
  - Task creation and management
  - Project analytics and reporting

- 🔄 Real-time Collaboration

  - Live chat functionality
  - Real-time task updates
  - Typing indicators
  - Instant notifications

- 📊 Analytics & Reporting
  - Project progress tracking
  - Time tracking
  - Exportable reports (PDF/CSV)

## Tech Stack

### Frontend

- React.js with TypeScript
- Material-UI for components
- Redux Toolkit for state management
- Socket.io-client for real-time features
- React Router for navigation
- React Beautiful DnD for drag-and-drop

### Backend

- Node.js with Express
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- TypeScript for type safety

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   Create `.env` files in both frontend and backend directories.

4. Start the development servers:

   ```bash
   npm start
   ```

   This will start both frontend and backend servers concurrently.

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000
```

## Project Structure

```
project-root/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── store/      # Redux store
│   │   └── types/      # TypeScript types
│   └── ...
├── backend/           # Node.js backend application
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utility functions
│   └── ...
└── package.json      # Root package.json
```

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

MIT
