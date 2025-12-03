# How to Push VAYRO to GitHub

It seems **Git** is not installed or not available in your terminal. Follow these steps to get your code on GitHub.

## Step 1: Install Git (If not installed)

1.  Download Git from [git-scm.com](https://git-scm.com/downloads).
2.  Install it (Standard settings are fine).
3.  **Restart your terminal** (or VS Code) after installation.

## Step 2: Initialize and Commit

Once Git is installed, open your terminal in the project folder (`Vayro`) and run:

```bash
# 1. Initialize Git
git init

# 2. Add all files (I've already created a .gitignore for you)
git add .

# 3. Commit your changes
git commit -m "Vayro V1 Launch Ready"
```

## Step 3: Push to GitHub

1.  Go to [GitHub.com](https://github.com) and sign in.
2.  Click the **+** icon in the top right -> **New repository**.
3.  Name it `vayro` (or whatever you prefer).
4.  **Do not** check "Initialize with README" or .gitignore.
5.  Click **Create repository**.

Copy the commands under **"…or push an existing repository from the command line"** and run them in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/vayro.git
git branch -M main
git push -u origin main
```

(Replace `YOUR_USERNAME` with your actual GitHub username).

## Step 4: Deploy to Vercel

Now you can follow the [Vercel Deployment Guide](docs/vercel-deployment.md) to finish the launch!
