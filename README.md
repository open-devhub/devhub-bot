# DevHub Bot

[![GitHub Stars](https://img.shields.io/github/stars/open-devhub/devhub-bot?style=social)](https://github.com/open-devhub/devhub-bot/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/open-devhub/devhub-bot?style=social)](https://github.com/open-devhub/devhub-bot/network/members)
[![Homepage](https://img.shields.io/badge/Homepage-devhub--bot.vercel.app-blue)](https://devhub-bot.vercel.app)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Probot](https://img.shields.io/badge/Powered%20by-Probot-ff0092.svg)](https://probot.github.io/)

## Overview ✨

`devhub-bot` is a GitHub Bot designed to automate the boring stuff within the DevHub Organization. Built on the powerful [Probot](https://probot.github.io/) framework, this bot acts as a GitHub App, listening for specific events and performing predefined actions to enhance collaboration, enforce best practices, and reduce manual overhead for repository maintainers and contributors.

## Features 🚀

- **Event-Driven Automation**: Listens to GitHub webhook events (e.g., issues opened, pull requests created, comments) and triggers custom actions.
- **Probot Framework**: Built on Probot, providing a robust and extensible foundation for GitHub App development.
- **TypeScript Support**: Developed with TypeScript for type safety, improved maintainability, and better developer experience.
- **Containerized Deployment**: Docker support for consistent, portable, and scalable deployments.
- **Local Development Tools**: Includes `smee-client` for easily receiving GitHub webhooks locally during development.
- **Automated Testing**: Utilizes Vitest for fast unit and integration testing of bot logic.
- **Vercel Deployment Ready**: Configuration for serverless deployment on Vercel, ideal for a GitHub App.
- **Modular Design**: Logic organized within the `src` directory, promoting clear separation of concerns.

## Tech Stack 🛠️

| Technology      | Version        | Description                                                 |
| :-------------- | :------------- | :---------------------------------------------------------- |
| **TypeScript**  | `^6.0.3`       | Primary programming language.                               |
| **Probot**      | `^14.3.2`      | Framework for building GitHub Apps.                         |
| **Vite**        | N/A (Dev Tool) | Fast development server and build tool.                     |
| **Vitest**      | `^3.2.4`       | Next-generation testing framework.                          |
| **Docker**      | N/A            | Containerization platform.                                  |
| **ioredis**     | `^5.10.1`      | High-performance Redis client (dev dependency).             |
| **nock**        | `^14.0.5`      | HTTP mocking and expectation library (dev dependency).      |
| **smee-client** | `^5.0.0`       | Forwards GitHub webhooks to local machine (dev dependency). |

## Prerequisites ⚙️

Before you can set up and run `devhub-bot`, ensure you have the following installed:

- **Git**: For cloning the repository.
- **Node.js**: `v20` or higher (recommended, aligns with `@types/node` v24+ in dev dependencies).
- **npm** or **Yarn**: Node.js package manager (npm comes with Node.js).
- **Docker**: If you plan to run the bot in a containerized environment.
- **GitHub Account**: Required to create and install a GitHub App for development or deployment.

## Installation 📦

### 1. Clone the Repository

Start by cloning the `devhub-bot` repository to your local machine:

```bash
git clone https://github.com/open-devhub/devhub-bot.git
cd devhub-bot
```

### 2. Install Dependencies

Install the necessary Node.js packages:

```bash
npm install
# or if you prefer yarn
# yarn install
```

### 3. Setup a GitHub App (Required for Local Development & Deployment)

To run a Probot app, you need to register a GitHub App.

1.  Go to your [GitHub Developer Settings](https://github.com/settings/apps/new) and click "New GitHub App".
2.  Fill in the details:
    - **GitHub App name**: A unique name (e.g., `my-devhub-bot-dev`).
    - **Homepage URL**: `https://devhub-bot.vercel.app` or your local Smee.io URL during development.
    - **Webhook URL**:
      - For local development: Use a Smee.io URL (e.g., `https://smee.io/your-channel`). Get one from [smee.io](https://smee.io/).
      - For production/deployment: This will be your deployed app's webhook endpoint (e.g., `https://your-app-domain.vercel.app/api/github/webhooks`).
    - **Webhook Secret**: Generate a random string (e.g., using `openssl rand -hex 20`). Save this value securely.
3.  **Permissions & Events**: Configure the necessary permissions and subscribe to the events your bot needs to listen to. Common permissions include `issues: read & write`, `pull requests: read & write`, `repository metadata: read-only`.
4.  **Create App**: Click "Create GitHub App".
5.  **Generate Private Key**: On your app's settings page, scroll down to "Private keys" and click "Generate a private key". This will download a `.pem` file. Save it securely.
6.  **Get App ID**: Note down your "App ID" from the top of the settings page.

## Usage 🏃‍♀️

### 1. Local Development

For local development, you'll need to use `smee-client` to forward webhooks from GitHub to your local machine.

1.  **Start Smee Client**: Open a new terminal and run:

    ```bash
    npx smee -u <YOUR_SMEE_URL> --port 3000
    ```

    Replace `<YOUR_SMEE_URL>` with the Smee.io URL you set in your GitHub App settings. This will forward webhooks to `http://localhost:3000/api/github/webhooks`.

2.  **Create `.env` File**: Create a `.env` file in the project root with the following environment variables:

    ```
    APP_ID=<YOUR_GITHUB_APP_ID>
    PRIVATE_KEY="<CONTENTS_OF_YOUR_PRIVATE_KEY_FILE>" # or path to .pem file
    WEBHOOK_SECRET=<YOUR_WEBHOOK_SECRET>
    NODE_ENV=development
    ```

    - **`PRIVATE_KEY`**: If your private key is long, you can put the actual multiline content within double quotes, or point to the file: `PRIVATE_KEY_PATH=/path/to/your/private-key.pem`.
    - **Important**: For local development, make sure your GitHub App's webhook URL is set to your Smee.io URL.

3.  **Run the Bot**: In your project's terminal, run the bot:
    ```bash
    npm run dev
    ```
    This will start the Probot server, listening for webhooks forwarded by Smee.io.

Now, any relevant GitHub events in repositories where your app is installed will be forwarded to your local `devhub-bot` instance.

### 2. Deployment (Vercel)

The `vercel.json` file indicates that this bot is configured for deployment on Vercel as a serverless function.

1.  **Configure Environment Variables**: Set the `APP_ID`, `PRIVATE_KEY`, and `WEBHOOK_SECRET` environment variables in your Vercel project settings.
    - For `PRIVATE_KEY`, ensure you provide the entire content of your `.pem` file.
2.  **Deploy**: Connect your GitHub repository to Vercel. Upon pushing changes to your configured branch (e.g., `main`), Vercel will automatically deploy your bot.
3.  **Update Webhook URL**: Once deployed, update your GitHub App's Webhook URL in its settings to the endpoint provided by Vercel (e.g., `https://<YOUR-VERCEL-DOMAIN>/api/github/webhooks`).

### 3. Deployment (Docker)

The `Dockerfile` allows for containerized deployment of the bot.

1.  **Build the Docker Image**:
    ```bash
    docker build -t devhub-bot .
    ```
2.  **Run the Docker Container**:
    Pass your environment variables during runtime.
    ```bash
    docker run -p 3000:3000 \
      -e APP_ID="<YOUR_GITHUB_APP_ID>" \
      -e PRIVATE_KEY="<CONTENTS_OF_YOUR_PRIVATE_KEY_FILE>" \
      -e WEBHOOK_SECRET="<YOUR_WEBHOOK_SECRET>" \
      devhub-bot
    ```
    Ensure the container is accessible from the internet if it's meant to receive GitHub webhooks directly (e.g., behind a reverse proxy or deployed to a cloud platform).

## Environment Variables 🔑

The following environment variables are essential for configuring `devhub-bot`:

| Variable         | Description                                                                                                                                                             | Required | Example                                  |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- | :--------------------------------------- |
| `APP_ID`         | The ID of your GitHub App.                                                                                                                                              | Yes      | `123456`                                 |
| `PRIVATE_KEY`    | The entire content of the `.pem` private key file generated for your GitHub App. Enclose multi-line keys in double quotes or use `PRIVATE_KEY_PATH` to point to a file. | Yes      | `"-----BEGIN RSA PRIVATE KEY-----\n..."` |
| `WEBHOOK_SECRET` | The secret token you configured in your GitHub App settings to secure webhooks.                                                                                         | Yes      | `my-super-secret-webhook-key`            |
| `NODE_ENV`       | Node.js environment mode. Set to `development` for local dev, `production` for deployments. Affects logging and error handling.                                         | No       | `development`, `production`              |
| `LOG_LEVEL`      | Logging level for Probot. Options: `fatal`, `error`, `warn`, `info`, `debug`, `trace`. Default is `info`.                                                               | No       | `debug`                                  |

## Project Structure 🌳

```
.
├── Dockerfile                  # Defines the Docker image for the bot.
├── api                         # Vercel serverless function entry points (e.g., for webhook handling).
├── app.yml                     # GitHub Actions workflow definition for the bot (likely related to deployment or CI).
├── package-lock.json           # Lock file for Node.js package dependencies.
├── package.json                # Project manifest with dependencies and scripts.
├── src                         # Source code directory for the Probot app's logic.
│   └── index.ts                # Main entry file for the Probot app.
├── tsconfig.json               # TypeScript configuration file.
├── vercel.json                 # Configuration file for Vercel deployment.
└── vitest.config.ts            # Configuration for Vitest testing framework.
```

## API Documentation 🌐

While `devhub-bot` functions primarily as an event-driven GitHub App rather than a traditional REST API, the `api` directory suggests the use of serverless functions (likely for Vercel deployment). These functions serve as webhook receivers or internal endpoints for the bot's operations.

- **Webhook Endpoint**: The main entry point for GitHub webhooks. Typically, this is configured in your GitHub App settings and points to `/api/github/webhooks` (or similar) on your deployed instance. This endpoint processes incoming events and delegates them to the Probot app logic in `src`.
- **Internal API Routes**: Any other files within `api` might define additional serverless functions used by the bot for specific tasks, background jobs, or custom HTTP responses.

For detailed information on the specific events the bot listens to and the actions it performs, refer to the source code within the `src` directory, particularly `src/index.ts` and any modules it imports.

## Contributing 🤝

We welcome contributions to `devhub-bot`! If you're interested in improving the bot or adding new features, please follow these guidelines:

1.  **Fork the repository**.
2.  **Clone your forked repository** to your local machine.
3.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `bugfix/issue-description`.
4.  **Make your changes**, ensuring they adhere to the existing code style and best practices.
5.  **Commit your changes** with a clear and concise message.
6.  **Push your branch** to your forked repository.
7.  **Open a Pull Request** to the `main` branch of the `open-devhub/devhub-bot` repository. Provide a detailed description of your changes and why they are valuable.

## License 📜

`devhub-bot` is licensed under the MIT license. See [LICENSE](./LICENSE) for more details.
