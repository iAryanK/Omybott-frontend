<div align="center">
  
  <!-- 📷 ADD YOUR LOGO HERE -->
  <img src="https://via.placeholder.com/150/000000/FFFFFF?text=Omybott" alt="Omybott Logo" width="150" height="150" style="border-radius: 20px; margin-bottom: 20px;" />

  # 🤖 Omybott Frontend

  <p>
    <strong>A beautiful, responsive web interface for the Omybott RAG-based knowledge platform.</strong>
  </p>
  <p>
    <b>🚀 Live at</b> <a href="https://omybott.vercel.app">omybott.vercel.app</a>
  </p>

  <p>
    <a href="#-the-most-amazing-feature-embed-anywhere">Embed Anywhere</a> •
    <a href="#-agent-mode-ai-driven-management">Agent Mode</a> •
    <a href="#-architecture--features">Architecture</a> •
    <a href="#-getting-started">Getting Started</a>
  </p>

  <!-- 🎥 ADD YOUR DEMO VIDEO OR HERO IMAGE HERE -->
  <a href="https://omybott.vercel.app">
    <img src="https://via.placeholder.com/800x450/1a1a1a/ffffff?text=Add+Your+Demo+Video+or+Hero+Image+Here" alt="Omybott Demo" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
  </a>
</div>

<br/>

## 🌟 Overview
Omybott's frontend is a premium Next.js and Tailwind application that allows users to seamlessly build, manage, and deploy custom RAG (Retrieval-Augmented Generation) AI bots trained on their own knowledge bases.

---

## 🔥 The Star of the Show: Embed Anywhere!
Building a bot is cool, but **deploying it is where Omybott truly shines**. 

Once you've created and trained a bot, you can easily integrate it into **any web application**—whether it's plain HTML/CSS, a React app, or an Angular dashboard. 

We provide an API key and a minimal code snippet. You just copy and paste it into your project! The bot automatically embeds itself as a sleek chat widget in the bottom right corner of your site. Because you control the initial code snippet, you retain full flexibility to adjust its positioning and behavior according to your app's specific needs.

---

## 🤖 Agent Mode: AI-Driven Management
Tired of clicking through dashboards? Meet **Agent Mode**.

Accessible right from the navbar, Agent Mode is an interactive chat interface that lets you manage your entire Omybott account just by talking to the LLM. Powered by advanced backend tool-calling, you can simply ask the agent to:
- *"Create a new workspace for my client XYZ"*
- *"Set up a new bot named Sales Assistant in the XYZ workspace"*
- *"Delete the testing bot"*

No manual effort required—just natural conversation to manage your architecture!

---

## 🏗️ Architecture & Features

### Workspace-Driven Organization
Omybott is built for scale and multi-tenancy. If a business wants to integrate bots into its products for various clients, our workspace structure makes it effortless:
> **All bots for one specific client can go into a single Workspace. Within that workspace, you can deploy as many specialized bots as you want.**

### Key Pages & Routing
| Route | Description |
|---|---|
| **`/signup` & `/login`** | Secure authentication endpoints allowing users to register and authenticate via their email ID and password. |
| **`/`** | The centralized hub to view and manage all your isolated workspaces. |
| **`/[workspaceId]/bots`** | A dedicated dashboard listing all the bots contained within a selected workspace. |
| **`/[workspaceId]/[botId]`** | Deep dive into a specific bot's configuration. Manage its knowledge base, view analytics, and generate your embed snippet. |
| **`/[workspace]/create-bot`** | A streamlined, intuitive flow to name your bot, upload documents for ingestion, and bring your AI assistant to life. |

---

## 🛠️ Tech Stack
Our frontend is built with a modern, type-safe, and highly optimized stack:
| Category | Technology | Description |
|---|---|---|
| **Core** | [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) | App Router architecture with type safety. |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) | Utility-first styling with accessible Radix UI components. |
| **Authentication** | [NextAuth.js (v5)](https://authjs.dev/) | Secure, seamless user authentication flows. |
| **Forms** | [React Hook Form](https://react-hook-form.com/) | Performant and flexible form handling. |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/), [Phosphor Icons](https://phosphoricons.com/), [Recharts](https://recharts.org/) | Beautiful iconography and interactive analytics. |
| **Markdown** | `react-markdown`, `remark-gfm` | Rendering rich, formatted AI chat responses securely. |
| **Deployment** | [Vercel](https://vercel.com/) | Fast, edge-optimized hosting and continuous deployment. |

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   git clone <repository-url>
   cd omybott/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables in `.env`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   AUTH_SECRET=
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.