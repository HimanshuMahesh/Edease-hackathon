# ProjectPilot

ProjectPilot is a powerful project management tool designed to streamline your workflow and boost productivity, offers an intuitive interface for managing projects, sprints, and issues effectively.

## Features

- **Organization Management**: Create and manage multiple organizations to keep your projects organized.
- **Project Dashboard**: Get a bird's-eye view of all your projects within an organization.
- **Sprint Planning**: Plan and manage sprints effectively with our intuitive sprint creation and management tools.
- **Issue Tracking**: Create, assign, and track issues across your projects and sprints.
- **Kanban Board**: Visualize your workflow with a customizable Kanban board for each sprint.
- **User Management**: Easily manage team members and their roles within your organization.
- **Real-time Updates**: Experience seamless collaboration with real-time updates across the platform.
- **Markdown Support**: Use Markdown in issue descriptions for rich text formatting.
- **Priority and Status Management**: Assign priorities and track the status of issues effortlessly.
- **Responsive Design**: Access ProjectPilot on any device with our fully responsive interface.

## Technology Stack

ProjectPilot is built using cutting-edge technologies to ensure performance, scalability, and a great user experience:

- **Next.js**: A React framework for building server-side rendered and statically generated web applications.
- **TailwindCSS**: A utility-first CSS framework for rapidly building custom user interfaces.
- **NeonDB**: A serverless PostgreSQL database for scalable and efficient data storage.
- **Clerk**: A complete user management and authentication solution.

### Additional Technologies

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Prisma**: Next-generation ORM for Node.js and TypeScript.
- **Zod**: TypeScript-first schema declaration and validation library.
- **Lucide React**: A beautiful and consistent icon set for your React projects.
- **React Hook Form**: Performant, flexible and extensible forms with easy-to-use validation.
- **ShadcnUI**: A collection of re-usable components built with Radix UI and Tailwind CSS.

ProjectPilot combines these powerful technologies to provide a robust, scalable, and user-friendly project management solution for teams of all sizes.


### Make sure to create a `.env` file with following variables -

```
DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```
