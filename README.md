# OpSite Energy Frontend

A modern, responsive web application for OpSite Energy, built with Next.js, React, Redux Toolkit, and Material-UI. This project provides a robust platform for user authentication, onboarding, dashboard management, and more.

## Features

- User authentication (login, registration, password reset)
- Role-based onboarding workflow
- Dashboard with sidebar navigation
- Responsive design with sidebar collapse/expand
- Internationalization (i18n) support
- State management with Redux Toolkit
- API integration with centralized endpoint management

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Material-UI (MUI)](https://mui.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/)
- [next-i18next](https://github.com/isaachinman/next-i18next)

## Folder Structure

```
app/                # Next.js app directory (pages, layouts)
src/
  components/       # Reusable React components
  dto/              # Data transfer objects (DTOs)
  hooks/            # Custom React hooks
  pages/            # (Legacy) Next.js pages
  providers/        # Context and providers (Redux, theme, i18n)
  services/         # API service functions and endpoint constants
  store/            # Redux slices and store config
  styles/           # MUI and custom styles
  types/            # TypeScript types and enums
  utils/            # Utility functions
public/
  images/           # Static images
  locales/          # i18n translation files
```

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/opsite_energy_frontend.git
   cd opsite_energy_frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure environment variables:**
   - Create a `.env.local` file in the root directory.
   - Add the following:
     ```env
     NEXT_PUBLIC_API_URL=https://your-api-url.com/
     ```
4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Scripts

- `dev` - Start the development server
- `build` - Build the production app
- `start` - Start the production server
- `lint` - Run ESLint

## Internationalization

- Translations are managed in `public/locales/{lang}/common.json`.
- Add new languages or update translations as needed.

---

For any questions or support, please open an issue or contact the maintainers.
