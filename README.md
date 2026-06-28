# User Management Dashboard

The User Management Dashboard is a robust, client-side React application designed to manage, display, and manipulate user data. Built as a comprehensive demonstration of modern frontend engineering practices, it allows administrators to efficiently view, search, filter, and modify user records through a polished and accessible user interface.

## Project Overview

This project was built to fulfill an interview assignment objective: creating a complete User Management Dashboard utilizing a mock REST API (JSONPlaceholder). The application demonstrates proficiency in complex state management, clean architecture, responsive design, and defensive programming. Key functionalities include real-time multi-column sorting, advanced filtering, client-side pagination, and full CRUD (Create, Read, Update, Delete) operations, all synchronized seamlessly with local state to provide a fluid user experience despite the read-only nature of the backend API.

## Features

- **View Users**: Tabular display of all active users with clear data hierarchy.
- **Real-time Search**: Instantaneous search across First Name, Last Name, and Email fields.
- **Multi-column Sorting**: Ascending and descending sorting capabilities on all table columns.
- **Advanced Filtering**: Dedicated modal to filter records by specific fields (e.g., Department, Name).
- **Client-side Pagination**: Dynamic pagination controls with adjustable page sizes (e.g., 10, 25, 50, 100 rows per page).
- **Add User**: Form interface to create new user records.
- **Edit User**: Form interface populated with existing data to modify user records.
- **Delete User**: Secure deletion workflow with a confirmation modal to prevent accidental data loss.
- **Client-side Validation**: Robust form validation providing immediate, inline feedback before submission.
- **API Error Handling**: Graceful degradation and user-friendly error popups during network or API failures.
- **Responsive Design**: Fluid layouts that adapt perfectly to desktop, tablet, and mobile devices.
- **Accessible UI**: Semantic HTML, ARIA attributes, keyboard navigation, and focus trapping within modals.
- **Reusable Components**: Modular architecture leveraging highly reusable components (Modals, Buttons) and custom hooks.

## Tech Stack

| Category    | Technology        |
| :---------- | :---------------- |
| Frontend    | React 19          |
| Build Tool  | Vite              |
| Language    | JavaScript (ES6+) |
| Styling     | CSS3 (Vanilla)    |
| HTTP Client | Axios             |

## Project Structure

```text
src/
├── api/          # Centralized API service functions (fetch, create, update, delete)
├── components/   # Reusable UI components (Modals, Forms, Tables, Buttons)
├── constants/    # Global constants (e.g., predefined department lists)
├── hooks/        # Custom React hooks (useUsers, useTableState, useModalState)
├── utils/        # Pure utility functions (validators, sorting, pagination helpers)
├── App.css       # Global layout styles
├── App.jsx       # Root application component orchestrating state and layout
├── index.css     # CSS variables, resets, and global keyframe animations
└── main.jsx      # React DOM entry point
```

## Installation

```bash
git clone https://github.com/vignesh-programmer3269/user-management-dashboard
```

```bash
cd user-management-dashboard
```

```bash
npm install
```

## Running the Project

```bash
npm run dev
```

## API Used

**Base URL**

```text
https://jsonplaceholder.typicode.com/users
```

This project interfaces with the JSONPlaceholder mock API using standard RESTful methods:

- **GET**: Fetch the initial list of users.
- **POST**: Simulate creating a new user.
- **PUT**: Simulate updating an existing user.
- **DELETE**: Simulate deleting a user.

_Note: JSONPlaceholder simulates successful write operations (returning 200/201 status codes) but does not persist changes to their database. All mutations are handled in the client's local state to reflect the expected outcome._

## Libraries Used

| Library | Purpose                                                                                                              |
| :------ | :------------------------------------------------------------------------------------------------------------------- |
| (None)  | This project utilizes zero external dependencies beyond React and Vite to demonstrate core engineering fundamentals. |

## Engineering Assumptions

### Name Mapping

The JSONPlaceholder API provides a single `name` field (e.g., "Leanne Graham"). To fit the dashboard's requirements of separate First and Last Name columns, the application splits the string at the first space:

- **First Name**: "Leanne"
- **Last Name**: "Graham"

If a user has a multiple-word last name (e.g., "Mrs. Dennis Schulist"), the first word is treated as the First Name ("Mrs."), and the remainder is joined as the Last Name ("Dennis Schulist").

### Department Mapping

Because JSONPlaceholder does not provide a "Department" field, the application assigns departments programmatically using a deterministic mapping algorithm:

```text
User ID % Department Count
```

This ensures that the same user always receives the exact same department every time the application is refreshed, maintaining data consistency during the evaluation.

### Mock Data Expansion

- The JSONPlaceholder `/users` endpoint returns only **10 users**, which is insufficient to properly demonstrate a dashboard with searching, sorting, filtering, pagination, and CRUD interactions.
- During initialization, the fetched dataset is programmatically duplicated on the client side until approximately **120 users** are available (original dataset × 12).
- Each duplicated record is assigned:
  - A unique ID to avoid collisions.
  - A deterministic department using the existing department assignment logic.
- No additional API requests are made.
- The original API response remains unchanged.
- This approach is used solely for demonstration purposes because the assignment uses a mock API with limited sample data.

## Validation Rules

Client-side validation occurs instantly before any API request is dispatched. Inline error messages are displayed directly adjacent to the offending inputs.

- **First Name**: Required. Cannot be solely whitespace.
- **Last Name**: Required. Cannot be solely whitespace.
- **Email**: Required. Must match a valid email regex format (`^[^\s@]+@[^\s@]+\.[^\s@]+$`).
- **Department**: Required. Must be a valid selection from the predefined department list.

## Error Handling

All asynchronous API operations are wrapped in robust `try...catch` blocks. If an HTTP request fails (e.g., network error, 500 status code), the application intercepts the error and displays a user-friendly Error Popup Modal.

- The application will not crash.
- Network failures are handled gracefully.
- The local UI state remains completely stable and synchronized, allowing the user to seamlessly retry the operation or dismiss the error.

## Responsive Design

The application provides a polished experience across Desktop, Tablet, and Mobile viewports.

- **Flexible Tables**: The table container utilizes `overflow-x: auto` to prevent horizontal page scrolling on narrow devices.
- **CSS Media Queries**: Breakpoints automatically stack form inputs, adjust padding, and resize modal constraints on smaller screens.
- **Accessible Touch Targets**: All interactive elements (buttons, inputs, pagination controls) enforce a minimum size of **44 × 44 px** for mobile accessibility.

## Accessibility

- **Semantic HTML**: Proper use of `<main>`, `<header>`, `<thead>`, `<tbody>`, and `<th scope="col/row">` elements.
- **Keyboard Navigation**: Full support for `Tab` index navigation across all interactive elements.
- **Focus Management**: Focus is intelligently trapped within open modals and restored to the triggering element upon closure.
- **ARIA Attributes**: Strategic implementation of `aria-label`, `aria-hidden`, `aria-expanded`, and `aria-sort` to assist screen readers.
- **Accessible Dialogs**: Modals can be dismissed effortlessly using the `Escape` key.

## Challenges Faced

### JSONPlaceholder Read-Only API

Because POST, PUT, and DELETE requests are simulated but not persisted by JSONPlaceholder, the local React state must act as the source of truth post-initialization. Local state is updated immediately upon a successful API simulation to accurately reflect Create, Update, and Delete operations in the UI.

### Limited Dataset

JSONPlaceholder provides a maximum of 10 users. To realistically demonstrate advanced features like pagination, sorting, and filtering, the dataset was expanded client-side to approximately 120 users. Every generated record calculates a unique ID while carefully preserving the deterministic department assignment.

### State Synchronization

Ensuring that Search, Advanced Filters, Sorting, Pagination, and CRUD operations remain perfectly synchronized after every local state update required strict adherence to immutable state updates and optimized `useMemo` dependency arrays.

### Reusable Architecture

Extracting duplicated modal animations, form handlers, and complex table states into reusable components and custom hooks (`useTableState`, `useModalState`) was critical to reducing code bloat, but required careful prop drilling and React context management to maintain clean separation of concerns.

## Future Improvements

If given more time, the following enhancements would be prioritized:

- Column visibility, resizing, and drag-and-drop reordering
- Bulk user actions (select multiple users and perform batch operations)
- Data export (CSV/Excel)
- Performance optimizations using React.lazy, code splitting, and memoization where appropriate
- Backend integration with a persistent database instead of a mock API
- Authentication and role-based access control
- Server-side pagination, filtering, sorting, and search
- Comprehensive unit and integration testing using Jest and React Testing Library
- End-to-end testing using Playwright
- Dark mode with theme persistence
- Internationalization (i18n) and localization
- Virtualized tables for efficiently rendering large datasets

## Deployment

**Live Demo**

```text
https://user-management-dashboard-xi-gilt.vercel.app/
```

**GitHub Repository**

```text
https://github.com/vignesh-programmer3269/user-management-dashboard
```
