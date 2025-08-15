# Scrum - Professional Project Management Platform

A full-featured, professional-grade project management application inspired by Jira, built with modern web technologies.

## 🚀 Features

- **🔐 Authentication & Authorization**: Clerk-powered authentication with Google and email/password, plus organization roles (admin/member)
- **📋 Project Management**: Create and manage multiple projects per organization with unique project keys
- **📅 Sprint Management**: Plan and execute sprints with date ranges and status tracking
- **🎯 Issue Tracking**: Comprehensive issue management with priorities, assignments, and status tracking
- **📊 Kanban Board**: Drag-and-drop Kanban board with real-time updates and filtering
- **👥 Team Collaboration**: Role-based access control and user management
- **🎨 Modern UI**: Beautiful, responsive interface built with ShadCN UI and Tailwind CSS
- **⚡ Performance**: Built with Next.js 15 and optimized for speed

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **UI Components**: ShadCN UI, Radix UI primitives
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **Forms**: React Hook Form with Zod validation
- **Drag & Drop**: @hello-pangea/dnd
- **Date Handling**: react-day-picker, date-fns
- **Deployment**: Vercel-ready

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (local or cloud)
- Clerk account for authentication

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd SAAS-Product
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/scrum_db"

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Configure authentication methods (Google, email/password)
4. Copy your publishable key and secret key to `.env.local`
5. Configure organization settings in Clerk dashboard

### 5. Database Setup

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in `.env.local`
3. Run Prisma migrations:

```bash
npx prisma generate
npx prisma db push
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
SAAS-Product/
├── app/                          # Next.js app directory
│   ├── dashboard/               # Dashboard routes
│   │   ├── projects/           # Project management
│   │   └── layout.js           # Dashboard layout
│   ├── globals.css             # Global styles
│   ├── layout.js               # Root layout
│   └── page.js                 # Landing page
├── components/                  # React components
│   ├── ui/                     # ShadCN UI components
│   ├── create-project-dialog.jsx
│   ├── create-sprint-dialog.jsx
│   ├── create-issue-dialog.jsx
│   ├── kanban-board.jsx
│   └── issue-dialog.jsx
├── lib/                        # Utility functions
│   ├── actions.js              # Server actions
│   ├── auth.js                 # Authentication utilities
│   ├── db.js                   # Database client
│   └── utils.js                # General utilities
├── prisma/                     # Database schema
│   └── schema.prisma           # Prisma schema
└── public/                     # Static assets
```

## 🔧 Configuration

### Clerk Configuration

The app uses Clerk for authentication. Key configuration points:

- **Public Routes**: Only the landing page (`/`) is public
- **Protected Routes**: All dashboard routes require authentication
- **Organization Management**: Users must be part of an organization to access the app

### Database Schema

The Prisma schema includes:

- **Users**: User accounts with Clerk integration
- **Organizations**: Multi-tenant organizations
- **OrganizationMembers**: Role-based membership (ADMIN/MEMBER)
- **Projects**: Projects within organizations
- **Sprints**: Time-boxed development cycles
- **Issues**: Work items with priorities and assignments

### Role-Based Access Control

- **ADMIN**: Can create projects, sprints, and manage organization settings
- **MEMBER**: Can view projects, create issues, and participate in sprints

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Ensure these are set in your production environment:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_production_clerk_key
CLERK_SECRET_KEY=your_production_clerk_secret
DATABASE_URL=your_production_database_url
```

### Database Migration

For production deployments, run:

```bash
npx prisma migrate deploy
```

## 🎯 Usage Guide

### Getting Started

1. **Sign Up**: Create an account using the landing page
2. **Create Organization**: Set up your first organization
3. **Create Project**: Admins can create new projects
4. **Add Sprints**: Plan development cycles with start/end dates
5. **Create Issues**: Add work items to sprints
6. **Manage Board**: Use the Kanban board to track progress

### Project Management

- **Project Keys**: Unique identifiers that influence sprint naming
- **Sprint Status**: Track planned, active, and completed sprints
- **Issue Workflow**: Move issues through TODO → IN_PROGRESS → IN_REVIEW → DONE

### Team Collaboration

- **User Assignment**: Assign issues to team members
- **Priority Levels**: Set LOW, MEDIUM, HIGH, or URGENT priorities
- **Real-time Updates**: See changes immediately across the team

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection**: Ensure PostgreSQL is running and accessible
2. **Clerk Keys**: Verify your Clerk environment variables are correct
3. **Prisma Issues**: Run `npx prisma generate` after schema changes
4. **Build Errors**: Clear `.next` folder and reinstall dependencies

### Development Tips

- Use `npm run dev` for development with hot reload
- Check browser console for client-side errors
- Monitor terminal for server-side errors
- Use Prisma Studio (`npx prisma studio`) to inspect database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [ShadCN UI](https://ui.shadcn.com/)
- Authentication by [Clerk](https://clerk.com/)
- Database ORM by [Prisma](https://www.prisma.io/)
- Icons by [Lucide React](https://lucide.dev/)

## 📞 Support

For support or questions:
- Create an issue in this repository
- Check the documentation
- Review the troubleshooting section

---

**Happy Project Managing! 🎉**
