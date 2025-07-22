# Orbin Bank - Modern Banking Frontend (React)

This repository contains the source code for the Orbin Bank web application, a modern, responsive frontend built with React. It serves as the user interface that consumes the powerful Jakarta EE backend, providing a seamless digital banking experience for both customers and administrators.

**Developed by:** R. Ashan Himantha Rathnayaka
**GitHub Profile:** [github.com/AshanHimantha](https://github.com/AshanHimantha)

---

### **Companion Repositories**
*   **Frontend (This Repo):** [https://github.com/AshanHimantha/baking-webapp](https://github.com/AshanHimantha/baking-webapp)
*   **Backend (Jakarta EE API):** [https://github.com/AshanHimantha/enterprise-banking-platform](https://github.com/AshanHimantha/enterprise-banking-platform)

---

## 🚀 Features

This React application provides a user-friendly interface for all of the backend's capabilities:

*   **Seamless Onboarding:** Multi-step user registration, email verification, and a comprehensive KYC submission form with file uploads.
*   **Interactive Dashboard:** A central hub for customers to view their total balance, a list of all their accounts, recent transaction activity, and upcoming scheduled payments.
*   **Complete Transaction Suite:** Interfaces for performing user-to-user transfers and one-time bill payments, with robust form validation.
*   **Detailed History:** A filterable and paginated view of transaction history, with options to view full transaction details or download PDF receipts.
*   **Virtual Card Management:** A secure area to view, create, freeze, terminate, and manage PINs and spending limits for virtual cards. Includes a password-protected modal to reveal full card details.
*   **Scheduled Payments Hub:** A dedicated section for users to create, view, pause, resume, and cancel their recurring payments.
*   **Comprehensive Admin Panel:** A separate, role-protected section of the UI for administrators to:
    *   View an analytics dashboard with charts.
    *   Manage customers (search, view audit trails, suspend/reactivate).
    *   Manage employees and their roles.
    *   Process in-branch cash deposits.
    *   Configure system settings like billers and interest rates.

---

## 🛠️ Technology Stack

*   **Framework:** React (with Vite)
*   **Styling:** Tailwind CSS with shadcn/ui for component primitives.
*   **State Management:** Zustand for simple, powerful global state management (e.g., authentication).
*   **API Communication:** Axios with a centralized service wrapper that automatically handles JWT authentication.
*   **Routing:** React Router for client-side navigation.
*   **Icons:** Lucide-React
*   **Charting:** Chart.js with react-chartjs-2

---

## ⚙️ Local Setup and Running Guide

Follow these steps to run the frontend application on your local machine.

### Prerequisites

*   **Node.js:** Version 18.x or higher.
*   **npm or yarn:** Package manager.
*   **Running Backend:** The Jakarta EE backend application must be running and accessible (e.g., on `localhost:8080`).

### Step 1: Clone the Repository

```bash
git clone https://github.com/AshanHimantha/baking-webapp.git
cd baking-webapp
```

## 🧪 Step 2: Install Dependencies

Using **npm**:

```bash
npm install
```
## ⚙️ Step 3: Configure Environment Variables
The frontend needs to know the base URL of the backend API.

1.In the root of the frontend project, create a file named .env.local
2.Add the following line to the file (adjust the URL if needed):

```
VITE_API_BASE_URL=http://localhost:8080/bank
```

## ▶️ Step 4: Run the Development Server
```
npm run dev
```

