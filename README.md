# MindLift

MindLift is an web based application that allows you track your day-to-day challenges and reactions providing you with a summarized insight of your personality throughout the week.

## Overview

MindLift is designed to be sort of a personal free therapist. It is not capable of holding conversations its main focus is to support you with decision making and improving one's mental health.

Features currently available are:

- Daily report requests
- OTP login, no password needed to prevent the issue of forgetting a password
- Summary generation at the end of every week, data from the week is aggregated and summarized

## Local Development

Navigate to src
Create a file and rename it `.env`, this file holds all the information the server needs.

Inside the `.env`, fill in the following information:

```
DATABASE_URL=""
PORT=8080
APP_PASSWORD=""
APP_USER=""
ACCESS_TOKEN_SECRET=''
REFRESH_TOKEN_SECRET=''
GEMINI_API_KEY=''
```

`DATABASE_URL` holds the connection string to your database, prisma might generate this for you.

`PORT` is the localhost port the frontend requires to access the APIs.

`APP_PASSWORD` refers to the app password on your google account, not your google account password.

`APP_USER` refers to the email address of where the app password was gotten and the email to send emails from.

`ACCESS_TOKEN_SECRET` is a key used to encrypt the jwt.

`REFRESH_TOKEN_SECRET` is used to verify and recreate access tokens.

`GEMINI_API_KEY` is a gemini api key used to access gemini api.

After all that is done, make sure you're in the root directory, then run

```
npm install
npx tsc
npm start
```

`npm install` installs all the required dependencies.

`npx tsc` compiles all the typescript files to vanilla javascript.

`npm start` starts the server.

Navigate to [app.ts](src/app.ts) and set the `origin` property of

```
app.use(
	cors({
		origin: "https://mind-lift-ashen.vercel.app",
		credentials: true,
	}),
);
```

to your local frontend server, e.g `http://localhost:3000`

## Stack

- TypeScript
- Expressjs
- Nodemailer
- Prisma
