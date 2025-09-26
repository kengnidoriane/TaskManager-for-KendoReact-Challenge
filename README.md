# Task Manager for KendoReact Challenge

TaskManager is a modern task management application built with React, TypeScript, and KendoReact components that helps you organize and track your tasks.

![Task Manager Preview](https://Task+Manager+Preview)

## Features

🎯 **Dual View System**: Switch between detailed grid view and interactive Kanban board
📋 **Complete Task Management**: Create, edit, delete, and organize tasks with priorities
🎨 **Beautiful UI**: Built with KendoReact components for a polished, professional look
📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
🌙 **Dark Mode**: Toggle between light and dark themes
🎉 **Celebration Animations**: Motivational celebrations when completing tasks
⌨️ **Keyboard Shortcuts**: Quick navigation and task creation
🔔 **Smart Notifications**: Real-time feedback for all actions
📊 **Progress Tracking**: Visual progress indicators and statistics
🎯 **Priority System**: High, Medium, Low priority levels with color coding

## Getting Started

### Prerequisites

- Node.js 22.x or later
- npm or pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kengnidoriane/TaskManager-for-KendoReact-Challenge.git
cd TaskManager-for-KendoReact-Challenge
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## How to Use

1. **Create Your First Task**: Click the "+" button or use `Ctrl+N` to open the task form
2. **Fill Task Details**:
   - Task title and description
   - Priority level (High, Medium, Low)
   - Due date
3. **Manage Tasks**:
   - **Grid View**: See all tasks in a detailed list with search and filters
   - **Kanban View**: Drag and drop tasks between Todo, In Progress, and Done columns
4. **Track Progress**: Monitor your productivity with the progress bar and statistics
5. **Stay Motivated**: Enjoy celebration animations when completing tasks

### Keyboard Shortcuts

- `Ctrl+N` - Create new task
- `Ctrl+Shift+V` - Toggle between Grid and Kanban views
- `Ctrl+D` - Toggle dark mode

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Components**: KendoReact
- **Styling**: CSS Variables with responsive design
- **Icons**: Lucide React
- **Animations**: Canvas Confetti
- **Date Handling**: date-fns

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── GridView.tsx
│   │   ├── KanbanView.tsx
│   │   ├── TaskForm.tsx
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   │   ├── useTasks.ts
│   │   ├── useDarkMode.ts
│   │   └── ...
│   ├── services/        # API and data services
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── App.tsx          # Main application component
├── .env                 # Environment variables
└── package.json
```

## Key Components

- **App**: Main application orchestrator with state management
- **GridView**: Detailed task list with search, filters, and sorting
- **KanbanView**: Drag-and-drop board with three columns (Todo, In Progress, Done)
- **TaskForm**: Modal form for creating and editing tasks
- **Header**: Navigation bar with progress tracking and theme toggle
- **Sidebar**: Navigation panel with filters and view controls
- **Celebration**: Animated celebrations for task completions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Built with ❤️ by [Your Name]

---

*Boost your productivity with TaskMaster - where task management meets beautiful design.*