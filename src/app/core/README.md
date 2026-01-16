# Core Module

This folder contains singleton services, configuration, and core functionality used throughout the application.

## Structure

- **guards/** - Route guards (auth guard, role guard, etc.)
- **interceptors/** - HTTP interceptors (auth token, error handling, etc.)
- **services/** - Singleton services (auth service, API service, etc.)
- **models/** - TypeScript interfaces and types

## Guidelines

- Services in core should be `providedIn: 'root'`
- Core module should only be imported once in the main application
- Keep business logic here that's used across multiple features
