# Deployment Guide - Farmer Stress Control Site

This guide outlines the steps to deploy the application to **Vercel**, which is the recommended hosting provider for Next.js applications.

## Prerequisites

1.  **GitHub Account**: Push your code to a GitHub repository.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
3.  **MongoDB Atlas Account**: Create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
4.  **Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com).

## Environment Variables

You need to configure the following environment variables in your Vercel project settings:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `MONGODB_URI` | Connection string for your MongoDB cluster. | `mongodb+srv://<user>:<pass>@cluster.mongodb.net/farmer-db` |
| `NEXTAUTH_SECRET` | A random string used to encrypt sessions. | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | The canonical URL of your site. | `https://your-project.vercel.app` (Vercel sets this automatically usually, but good to be explicit) |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary Cloud Name. | `demo` |
| `CLOUDINARY_API_KEY` | Your Cloudinary API Key. | `123456789` |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API Secret. | `abcdef123456` |

## Deployment Steps

1.  **Push to GitHub**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin <your-repo-url>
    git push -u origin main
    ```

2.  **Import to Vercel**:
    - Go to your Vercel Dashboard.
    - Click **"Add New..."** -> **"Project"**.
    - Select your GitHub repository.
    - In the **"Environment Variables"** section, add the variables listed above.
    - Click **"Deploy"**.

3.  **Verify Deployment**:
    - Once deployed, Vercel will provide a URL.
    - Visit the URL and test the Sign Up / Login flows.

## Local Development

To run the project locally:

1.  Create a `.env.local` file in the root directory with the same variables.
2.  Run:
    ```bash
    npm run dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000).
