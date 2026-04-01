This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Docker & Production Deployment

This application is ready to be deployed using Docker. It uses a multi-stage `Dockerfile` with the optimal Next.js `standalone` mode to keep the final image size minimal.

### Prerequisites
- Docker
- Docker Compose

### Environment Configuration
Before you begin, generate a `.env` file from the example template:
```bash
cp .env.example .env
```
Update the `.env` values according to your production configuration. Specifically, `NEXT_PUBLIC_CONSUMET_API`.

### How to Build
To build the Docker image locally without composing:
```bash
docker build -t youru-cinema:latest .
```

### How to Run
To run the full stack in detached mode using Docker Compose:
```bash
docker-compose up -d --build
```

The application will now be running on [http://localhost:3000](http://localhost:3000).

*Note: The `docker-compose.yml` also includes a commented-out definition for the Consumet API if you wish to run it side-by-side with the web app.*

### How to Stop
To gracefully stop the running containers:
```bash
docker-compose down
```

### Common Troubleshooting
- **Missing Environment Variables**: Make sure the `.env` file exists and contains `NEXT_PUBLIC_CONSUMET_API`, as Next.js might need it baked in during the build stage. If you change variables after building, you must rebuild using `docker-compose up -d --build`.
- **Application Crashing on Start**: Use `docker logs youru-cinema-app` to check the actual error logs. Wait 30 seconds to allow the Docker healthcheck to verify if the container is functioning properly.
- **Port Conflict**: If `3000` is already in use, change the exposed port in `docker-compose.yml` mappings: `ports: ["8080:3000"]`.
