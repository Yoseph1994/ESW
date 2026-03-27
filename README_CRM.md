# EWS Frontend - CRM Manager Role

This is the front-end implementation for the **CRM Manager** role in the Early Warning System (EWS). It follows the Admin design system while implementing the specific functional requirements for case assignment and management.

## Features

### Role-Based Access
- **Mock Login Page**: Redirects to the appropriate layout based on user role.
- **Credentials**: 
  - Username: `crm_manager`
  - Password: `password123`
- **Session Management**: Stores role and user name in `localStorage`.

### Dashboard
- **Summary Cards**: "New Cases" and "Completed Cases" with real-time counts.
- **Recent Cases Preview**: A table showing the most recent unassigned cases for quick navigation.

### New Cases Management
- **Status Tabs**: Separates cases into "Yet to be Assigned" and "Assigned".
- **Dynamic Assignment**: Move cases between tabs by assigning or reassigning CRM Officers via a modal.
- **Search & Pagination**: Full search capabilities and pagination with configurable page size (matching screenshots).

### Completed Cases
- **Case History**: View all cases completed by CRM Officers.
- **Detailed Evaluation**: Click "Detail" to see a full breakdown of the case and the criteria evaluated by the officer (Credit Score, Repayment History, Collateral, etc.).

## Tech Stack
- **React 19**
- **Vite**
- **Tailwind CSS v4**
- **shadcn/ui** (Base UI components)
- **Framer Motion** (Animations)
- **TanStack Table v8** (Data management)
- **Lucide React** (Icons)
- **Sonner** (Toast notifications)

## Running Locally

1. **Clone/Setup project**:
   ```bash
   cd ews-frontend
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```

3. **Login**:
   - Access `http://localhost:5173`
   - Use `crm_manager` / `password123` for the CRM Manager dashboard.
   - Use `admin` / `password` for the existing Admin dashboard.

## Production Build
To create a production-ready bundle:
```bash
npm run build
```
