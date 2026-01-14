# Crawlytics

**Crawlytics** is a high-performance, full-stack web scraping and content analytics platform. Built for speed and precision, it allows users to transform raw URLs into structured knowledge assets with AI-driven insights.

![ETL Pipeline](images/ETL%20Pipeline.png)

## Features

- **High-Fidelity Scraping**: Powered by **Firecrawl**, Crawlytics extracts clean markdown and structured JSON from even the most complex web pages.
- **Intelligent Mapping**: Map entire website architectures and discover deep links with a single click.
- **AI Executive Summaries**: Automatically generates high-level insights and summaries for every scraped asset.
- **Collaborative Library**: A unified, searchable command center for your entire collection of web data.
- **Premium UX/UI**: A futuristic, glassmorphism-inspired interface featuring:
  - **Zero-Scroll Dashboards**: Fixed-view content readers for maximum focus.
  - **Sticky Metadata Sidebars**: Keep asset context pinned while you read.
  - **Advanced Keyboard Shortcuts**: Power-user features like `Cmd+K` for global search.
- **Type-Safe Architecture**: End-to-end type safety from the scraping engine to the dashboard UI.

## Tech Stack

Crawlytics is built on the cutting edge of the modern web ecosystem:

- **Core Framework**: [TanStack Start](https://tanstack.com/router/start) (Full-stack React 19)
- **Routing & State**: [TanStack Router](https://tanstack.com/router) & [TanStack Form](https://tanstack.com/form)
- **Scraping Engine**: [Firecrawl](https://firecrawl.dev/)
- **Database Layer**: [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://better-auth.com/) (Secure, modern auth management)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)

## Getting Started

### Prerequisites

- **Node.js**: v20+
- **PostgreSQL**: A running instance
- **Firecrawl API Key**: Required for scraping

### Installation

1. **Clone the Hub**
   ```bash
   git clone https://github.com/yourusername/crawlytics.git
   cd crawlytics
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root and add your credentials:
   ```env
   DATABASE_URL="postgresql://..."
   FIRECRAWL_API_KEY="fc-..."
   BETTER_AUTH_SECRET="your-secret"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

4. **Initialize Database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Fire it up**
   ```bash
   npm run dev
   ```

---

## Architecture

Crawlytics uses a **Server Functions** architecture via TanStack Start, enabling seamless data fetching and scraping operations without the need for a separate API layer.

- `src/data/`: Server-side logic for Prisma operations and Firecrawl integration.
- `src/routes/`: File-based routing with integrated loaders and metadata management.
- `src/components/`: Modular UI system built on atomic design principles.
