# Pet Store Website

## Install Packages
Run the following command to install the necessary packages

```bash
npm install bcryptjs jsonwebtoken mongoose next react react-dom zustand && npm install -D @tailwindcss/postcss @types/bcryptjs @types/jsonwebtoken @types/node @types/react @types/react-dom dotenv eslint eslint-config-next tailwindcss ts-node typescript
```

## Email verification
Set one of these SMTP configurations for signup verification emails:

```bash
SMTP_URL=
# or
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
```

In local development, if SMTP is not configured, the signup response includes the verification code so the flow can still be tested.

## Run
Run the development server:

```bash
npm run dev
```