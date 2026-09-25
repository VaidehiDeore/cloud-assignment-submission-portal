# Deployment Notes

## Backend

Deploy the FastAPI application with:

`uvicorn app:app --host 0.0.0.0 --port $PORT`

Set all variables from `.env.example` in the hosting provider's secret/environment-variable settings.

## Frontend

Build:

`npm run build`

Deploy the generated `dist/` directory using a static frontend host.

Set:

`VITE_API_URL=https://YOUR-BACKEND/api`

Use HTTPS in production and add the deployed frontend origin to the backend CORS configuration.
