# Access Key Management System

This project implements a **Microservice-based Access Key Management System** using **NestJS**. It allows administrators to create, update, delete, and list API keys, while users can fetch token information based on their access keys. The system uses **Redis** for in-memory key storage, and includes functionality for rate-limiting and key expiration handling.

## Features

### Admin Features:
- **Create API Keys**: Admins can generate new API keys with configurable rate limits and expiration times.
- **Update API Keys**: Admins can update the rate limit or expiration time of existing keys.
- **Delete API Keys**: Admins can delete specific API keys.
- **List All API Keys**: Admins can list all the currently stored API keys.
- **View Logs**: Admins can view logs of all user requests for token information.

### User Features:
- **Fetch Access Plan**: Users can retrieve their access plan details (rate limit, expiration time) using their API key.
- **Enable/Disable API Key**: Users can enable or disable their API key to control its usage.
  
## Technologies Used
- **NestJS**: Framework for building the microservices.
- **Redis**: In-memory database used for storing API keys and logs.
- **TypeScript**: Typed JavaScript used for building the application.
- **Jest**: Testing framework used for unit and integration tests.

## Project Setup

### Prerequisites
- [Node.js](https://nodejs.org/en/) >= 14
- [Yarn](https://yarnpkg.com/) or [NPM](https://www.npmjs.com/)
- [Redis](https://redis.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akshaydodkade/access-management.git