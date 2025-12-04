# VAYRO Command Cheat Sheet ⌨️

Here is a list of all the important commands you will need to manage, update, and troubleshoot your application.

## 1. Updating Your Live Site (The Most Important!)

Whenever you make changes to the code (or I make them for you), run these 3 commands in order to send them to Vercel:

```bash
# 1. Stage all changes
git add .

# 2. Save the changes (replace "Update" with your own message)
git commit -m "Update: Description of what changed"

# 3. Send to GitHub (Triggers Vercel Deploy)
git push
```

## 2. Local Development

Commands to run the app on your own computer for testing.

```bash
# Start the development server (http://localhost:3000)
npm run dev

# Build the project (checks for errors)
npm run build
```

## 3. Database Management (Prisma)

Commands to interact with your database.

```bash
# Open a visual editor for your database (View Users, Links, etc.)
npx prisma studio

# Update your local database structure if you change schema.prisma
npx prisma db push

# Regenerate the client (Run this if you get Type errors after schema changes)
npx prisma generate
```

## 4. DNS & Network Checks

Commands to check if your domain is working.

```bash
# Check where your domain is pointing (Windows)
nslookup vayro.in

# Check specific DNS records (e.g., Nameservers)
nslookup -type=NS vayro.in
```

## 5. Maintenance

```bash
# Update all software packages to latest versions
npm update

# Install new packages (if I tell you to add one)
npm install package-name
```
