# autoFlow ⚡️

**A self-hosted workflow automation platform — an n8n / Zapier-style clone**

autoFlow is an open-source project to build a powerful, extensible workflow automation platform with a visual editor, connectors, triggers, and an execution engine. The goal is to provide a developer-friendly, self-hostable alternative to existing automation platforms like n8n and Zapier.

---

## 🚀 Key Features

- Visual workflow editor (drag & drop) — design automations using nodes
- Triggers & actions (HTTP, webhooks, scheduled, third-party connectors)
- Extensible node system (custom connectors & reusable nodes)
- Workflow execution engine with retry and error handling
- Authentication & multi-tenant support
- Marketplace for sharing connectors and workflows (planned)

---

## 🏗️ Project Structure

Monorepo (Nx) layout:

- apps/
  - api/ (NestJS API server, workflow engine, persistence)
  - frontend/ (Next.js UI, visual editor, marketplace)
- libs/ (shared code, utilities, UI components)

This repo uses Nx and pnpm for workspace tooling and package management.

---

## 🔧 Getting Started (Local Development)

Requirements:

- Node.js 18+ (LTS recommended)
- pnpm
- Docker (optional, for database or other services)

Quick start:

1. Install dependencies from the repository root (recommended):

   ```bash
   pnpm install
   # or explicitly: pnpm -w install
   ```

2. Run the API:

   ```bash
   # from the repo root (uses pnpm workspace filtering)
   pnpm --filter ./apps/api... install
   pnpm --filter ./apps/api... run start:dev
   ```

3. Run the Frontend:

   ```bash
   # from the repo root (uses pnpm workspace filtering)
   pnpm --filter ./apps/frontend... install
   pnpm --filter ./apps/frontend... run dev
   ```

4. Start both services from the repo root (concurrently):

   ```bash
   pnpm run dev
   ```

5. Open the frontend app (usually at http://localhost:3000) and start building workflows.

Notes:

- The API expects some environment variables for database, JWT, etc. See `apps/api/README.md` or `.env.example` (coming soon).
- For rapid iteration, run both services concurrently in separate terminals.

---

## 🧪 Tests

- API: unit and e2e tests using Jest. Run from `apps/api`:

  ```bash
  pnpm test
  pnpm test:e2e
  ```

- Frontend: add tests using your preferred testing library (React Testing Library / Vitest / Playwright for E2E).

---

## 🎯 Roadmap

Planned milestones:

1. Core workflow editor with node palette and connections
2. Workflow execution engine with persistent queues and retries
3. Built-in connectors (HTTP, Slack, Gmail, Trello, etc.)
4. Authentication & multi-tenant workspace management
5. Marketplace for sharing connectors and flows
6. CI/CD deployment guides & Helm charts

Contributions and feature requests are welcome — see **Contributing** below.

---

## �� Contributing

We welcome contributions! Suggested steps:

1. Open an issue to propose a feature or report a bug.
2. Fork the repository and create a feature branch.
3. Add tests and documentation for your changes.
4. Submit a pull request and reference the issue.

Coding style:

- Follow the existing code style and linting rules (ESLint, Prettier as configured).
- Write tests for new functionality.

---

## 🧭 Developer Notes

- Architecture: API (NestJS) will provide orchestration, node registry, execution scheduling, and persistence; Frontend (Next.js) will provide the visual builder and UX.
- Persistence: use a relational DB (Postgres) or a document DB depending on needs; workflows and executions must be durable.
- Execution: design to be horizontally scalable — use queues/workers for executing long-running jobs.

---

## 👀 How to Help / Get Involved

- Try running the projects locally and report issues
- Implement connectors for popular services
- Improve the visual editor UX and accessibility
- Write documentation and sample workflows

---

## ⚖️ License

This project is licensed under the MIT License — see `LICENSE` (TBD).

---

## Contact

For questions or collaboration, open issues or reach out via the project's GitHub repository.

Happy automating! ✨
