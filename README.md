# Rice Inspection App

## Description

This project is a Node.js application that allows users to submit inspection data and upload files. It connects to a PostgreSQL database to store and retrieve historical data.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [PostgreSQL](https://www.postgresql.org/) (version 12 or higher)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/punaisxx/TestRiceInspection.git

   cd TestRiceInspection

   npm install

   ```

2. **Navigate to the project directory**:

   psql -U your_username

   CREATE DATABASE history;

   ```
   CREATE TABLE history (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    standard VARCHAR(255),
    note TEXT,
    price NUMERIC,
    sampling_point JSONB,
    sampling_datetime TIMESTAMPTZ,
    upload VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    total_sample INTEGER,
    results JSONB
   );

   ```

3. **Update Environment Variables**:

add your database connection in file /lib/db.js (It’s supposed to be in a .env file for better security.)

Change yourfile path.

4. **Running the Application**:

   npm start

   npm run dev
