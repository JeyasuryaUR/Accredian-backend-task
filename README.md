# Refer and Earn Backend - Accredian backend task

This project provides the backend support for handling referral form submissions. It features RESTful APIs developed with Express.js, database connectivity using Prisma ORM with a MySQL database, and email notifications through the Google Mail Service API.

## Features

- **RESTful APIs**: Endpoints to save referral data submitted through the referral form.
- **Database Connectivity**: Uses Prisma ORM to connect with a MySQL database for storing referral information.
- **Data Validation**: Ensures the integrity of user data with comprehensive validation checks.
- **Error Handling**: Robust error handling to manage scenarios like missing fields or invalid data inputs.
- **Email Notification**: Sends an email notification via Google Mail Service API upon successful referral submission.

## Getting Started

### Prerequisites

- Node.js
- MySQL Database
- Google Mail Service API credentials

### Installation

1. Clone the repository:

2. Navigate to the project directory with `cd referral-form-backend`.

3. Install dependencies with `npm install`.

4. Configure your environment variables in a `.env` file based on the sample `.env.sample` file

    NOTE: Donot use your gmail password, Create an App Password and use it. For more information see https://support.google.com/accounts/answer/185833.

5. Run the Prisma migrations with `npx prisma migrate dev`

6. Start the server with `npm server.js`


## API Endpoints

- **POST /referrals**: Submit referral data. Requires `referrerName`, `referrerEmail`, `refereeName`, and `refereeEmail` and optional `message`.
