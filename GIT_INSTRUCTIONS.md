# How to Push Your Code to Git

This guide will walk you through the process of pushing your code to a Git repository.

## Prerequisites
- Git is installed on your machine
- You have a GitHub, GitLab, or other Git hosting service account

## Step 1: Configure Git (if not already done)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 2: Add a Remote Repository

Since you don't have a remote repository configured yet, you need to create one and add it to your local repository.

### Option A: Create a new repository on GitHub/GitLab
1. Go to GitHub.com or GitLab.com and log in
2. Create a new repository (don't initialize it with README, .gitignore, or license)
3. Copy the repository URL (it will look like `https://github.com/username/repository.git` or `git@github.com:username/repository.git`)
4. Add the remote to your local repository:
```bash
git remote add origin YOUR_REPOSITORY_URL
```

### Option B: Use an existing remote repository
If someone has already created a repository for you:
```bash
git remote add origin YOUR_REPOSITORY_URL
```

## Step 3: Stage Your Changes
You already have many files staged for commit. If you want to stage additional files:
```bash
# Stage specific files
git add path/to/file

# Stage all files
git add .
```

## Step 4: Commit Your Changes
```bash
git commit -m "Your commit message describing the changes"
```

## Step 5: Push Your Changes
For the first push to a new repository:
```bash
git push -u origin master
```

For subsequent pushes:
```bash
git push
```

## Common Issues and Solutions

### Authentication Issues
- If using HTTPS, you might be prompted for username and password
- GitHub no longer accepts password authentication; use a personal access token instead
- For SSH, ensure your SSH key is added to your GitHub/GitLab account

### Branch Issues
- If your local branch has a different name than the remote branch:
```bash
git push -u origin local-branch-name:remote-branch-name
```

### Merge Conflicts
If your push is rejected due to conflicts:
1. Pull the latest changes: `git pull origin master`
2. Resolve any conflicts
3. Commit the resolved changes
4. Push again: `git push origin master`

## Additional Git Commands

### Check Status
```bash
git status
```

### View Commit History
```bash
git log
```

### Create and Switch to a New Branch
```bash
git checkout -b new-branch-name
```

### Switch Between Branches
```bash
git checkout branch-name
```