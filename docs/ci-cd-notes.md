# VAYRO CI/CD Notes

## Philosophy
VAYRO adopts a minimal, fast, and automated approach to CI/CD. We prioritize build stability and code quality checks on every commit to ensure a premium, bug-free experience.

## CI Checks
Our GitHub Actions pipeline (`ci.yml`) runs the following checks on every push and pull request to `main`:

1.  **Dependency Installation**: Ensures `package-lock.json` is consistent.
2.  **Type Check**: Runs `tsc --noEmit` to catch TypeScript errors.
3.  **Linting**: Runs `next lint` to enforce code style and best practices.
4.  **Build**: Runs `npm run build` to verify that the application compiles successfully for production.

## Preview Builds
The `preview.yml` workflow triggers on pull requests to verify that changes do not break the build process before merging.

## Future Improvements
- **Test Suites**: Integration of Jest or Vitest for unit testing.
- **Stripe Mocks**: Automated testing of payment flows using Stripe webhooks.
- **E2E Testing**: Cypress or Playwright integration for end-to-end user flow verification.

## For Contributors
If a build fails:
1.  Go to the "Actions" tab in the GitHub repository.
2.  Click on the failed workflow run.
3.  Expand the failed step (e.g., "Type Check" or "Build") to view the error logs.
4.  Fix the issue locally and push the changes to retry.
