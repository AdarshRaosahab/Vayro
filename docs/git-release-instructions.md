# Git Release Instructions

## Tagging v1.0.0

1.  **Ensure Clean State**
    ```bash
    git status
    # Should be clean
    ```

2.  **Run Release Check**
    ```bash
    npm run release:check
    # Ensure all checks pass
    ```

3.  **Commit Final Changes**
    ```bash
    git add .
    git commit -m "chore: prepare v1 release"
    ```

4.  **Tag Version**
    ```bash
    git tag -a v1.0.0 -m "VAYRO Version 1.0.0 Release"
    ```

5.  **Push to Remote**
    ```bash
    git push origin main
    git push origin v1.0.0
    ```

## Branching Strategy
- **`main`**: Production-ready code. Deploys to Production environment.
- **`dev`** (or feature branches): Development work. Deploys to Preview environments.
- **Hotfixes**: Branch from `main`, fix, merge back to `main` and `dev`.

## Changelog
For future versions, generate changelog using:
```bash
git log v1.0.0..HEAD --oneline
```
