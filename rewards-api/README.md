#  Rewards API (NestJS + MongoDB)

This is the backend API for a Rewards Dashboard. It is built using **NestJS** and **MongoDB**, with support for WebSockets (real-time updates), caching, and proper validation. The API allows users to **earn**, **redeem**, and **track reward points** via various endpoints.

---

##  rewards-api Folder Overview

The `rewards-api` folder includes:

-  Business logic and APIs for rewards
-  Mock user data (no authentication needed)
-  MongoDB schemas for rewards, transactions, and redemptions
-  Real-time updates via WebSocket
-  Unit testing with Jest
-  Redis caching (optional)

---

##  Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/rewards-dashboard.git
cd rewards-dashboard/rewards-api
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Run the Server
```bash
# Development
npm run start:dev

# Production
npm run start

```
##  API Endpoints

### 1. Get Total Reward Points


**Query Parameters:**

| Parameter | Type   | Required | Description                    |
| --------- | ------ | -------- | ----------------------------- |
| userId    | string | Yes      | The ID of the user to fetch points for |

**Response:**

```json
{
  "totalPoints": 1500
}
```

### 2. Redeem Reward Points

```bash
POST /rewards/redeem
{
  "userId": "u123",
  "points": 100,
  "rewardType": "gift-card"
}
```
- userId: User who wants to redeem points
- points: Number of points to redeem
- rewardType: Type/category of reward to redeem

### 2. Redeem Reward Points
```bash
{
  "message": "Redeem successful",
  "remainingPoints": 1400
}
```
### 3. Get Reward Transactions
```bash
GET /rewards/transactions
```
### 3. Get Reward Transactions
```bash
[
  {
    "transactionId": "txn_001",
    "userId": "u123",
    "points": 100,
    "type": "redeem",
    "date": "2025-07-08T12:00:00Z"
  },
  {
    "transactionId": "txn_002",
    "userId": "u123",
    "points": 200,
    "type": "earn",
    "date": "2025-07-01T12:00:00Z"
  }
]
```
### 3. Get Reward Transactions
```bash
POST /rewards/points/add
```
### 3. Get Reward Transactions
```bash
{
  "userId": "u123",
  "points": 500,
  "reason": "Referral bonus"
}

```

### 3. Get Reward Transactions
```bash
{
  "message": "Points added successfully",
  "newTotalPoints": 2000
}

```
