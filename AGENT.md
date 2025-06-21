# Agent Instructions for Business Trip Application

## Build/Test Commands
- **Backend (Java/Spring Boot)**: `mvn spring-boot:run` (start), `mvn test` (tests), `mvn clean install` (build)
- **Frontend (React/Vite)**: `npm run dev` (dev server), `npm run build` (build), `npm run lint` (lint)
- **Single test**: `mvn test -Dtest=ClassName#methodName` (backend), no specific frontend test runner configured

## Architecture
- **Monorepo structure**: `020_backend/` (Spring Boot), `030_frontend/` (React), `010_documents/` (docs)
- **Backend**: Spring Boot 3.2.6, Java 21, H2 database, JWT auth, REST API
- **Frontend**: React 18, Vite build tool, React Router, json-server for dev
- **Database**: H2 in-memory database (`business_trip_db.mv.db`)
- **API**: RESTful endpoints under `/users`, `/login` with JWT authentication

## Code Style & Conventions
- **Java**: Package structure `ch.clip.trips.*`, Spring annotations, Lombok for boilerplate
- **React**: JSX components, ES6 modules, camelCase naming, functional components preferred
- **Imports**: Java standard imports, React ES6 imports from relative paths
- **Error handling**: Spring ResponseEntity with HTTP status codes, React ErrorBoundary
- **Types**: Java strong typing, React PropTypes not configured
- **Security**: JWT tokens, CORS configuration, Spring Security integration

## Development Notes
- Backend runs on default Spring Boot port (8080), frontend dev server on Vite default
- Use `concurrently` in frontend for running dev server with json-server
- H2 database files present in backend root directory
