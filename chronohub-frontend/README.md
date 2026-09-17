# ChronoHub Frontend

React + Vite frontend for the ChronoHub Employee Leave Management System.

## Setup

```bash
npm install
npm run dev
```

## Environment (optional)

Create `.env` in the frontend root if you want **Google Sign-In**:

```env
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

- Get a Client ID from [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → Create OAuth 2.0 Client ID (Web application).
- Add the same value as `GOOGLE_CLIENT_ID` in the **backend** `.env`.
- Without this, the app works with email/password only; the Google button will show a message to add the client ID.

## Tech

- React 19, Vite 7, React Router, Tailwind CSS
- Chart.js, react-hot-toast, @react-oauth/google
