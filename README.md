
## Description

This backend assignment involves designing and implementing a **Rewards API** that serves as the core backend service for a realtime rewards dashboard application. The main objectives of this assignment include:

- Developing a scalable and modular RESTful API using **NestJS**, following best practices for clean architecture and maintainability.
- Utilizing **MongoDB** with **Mongoose** ODM for efficient and flexible data modeling of user rewards, transactions, and redemptions.
- Implementing real-time capabilities using **Socket.io** to provide live updates on reward points and transactions.
- Integrating **Redis** for caching frequently accessed data and improving the performance of the API.
- Writing automated tests using **Jest** to ensure the reliability and correctness of the API endpoints and business logic.

This assignment demonstrates skills in backend development, API design, real-time communication, database management, caching strategies, and testing in a modern Node.js environment.


- User reward point tracking  
- Reward transactions  
- Point redemption for various reward types  
- WebSocket-based live updates  
- Caching and analytics  

## Tech Stack Used
- NestJS  
- MongoDB  
- Mongoose  
- Socket.io  
- Redis  
- Jest  

# Rewards Dashboard Client

A real-time dashboard for monitoring reward point transactions and redemptions. Connects to the Rewards API backend to display live updates via WebSocket.

## Features

- Real-time reward point updates
- WebSocket connection management
- Console logging for debugging
- Responsive UI components
- Automatic reconnection handling

## Prerequisites

- Node.js v16+
- Backend API running at `http://localhost:3000`
- Rewards API with WebSocket support enabled

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/rewards-system.git
cd rewards-api/rewards-client
```
