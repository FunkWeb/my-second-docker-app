# My Second Docker App

This is a boilerplate of a realistic full-stack application.

## Requirements

* Docker 28
* Node 24 LTS
* NPM 11

## Installation

1. fork this repository
2. clone your forked repository
3. run `docker compose up --build -d` in the root directory
4. follow instructions in backend, frontend, and/or worker directories as needed

## Docker

We use Docker to run PostgreSQL, Valkey, and the Worker services used by the application.

We could crate production-ready containers for both backend and frontend as needed.
The backend comes with a ready-made Dockerfile, but the frontend does not.
