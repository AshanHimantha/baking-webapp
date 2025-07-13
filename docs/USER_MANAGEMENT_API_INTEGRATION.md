# User Management API Integration

This document describes the integration of the User Management API into the admin customers page.

## Overview

The User Management API provides comprehensive functionality for managing user accounts in the enterprise banking platform. The integration includes:

- **User listing and search**: Retrieve all users with filtering and pagination
- **User details**: View comprehensive user information
- **Account management**: Suspend and reactivate user accounts
- **Advanced filtering**: Filter users by status, account level, and KYC status
- **Data export**: Export user data to CSV format

## API Integration

### Base Configuration

The API is integrated through the `userManagementApi.ts` service located in `src/lib/userManagementApi.ts`. This service provides:

- Type definitions for all API responses
- Utility functions for common operations
- Centralized API methods for all user management operations

### Authentication

The API uses Bearer token authentication through the `apiClient.ts` which automatically:
- Adds authentication headers to all requests
- Handles token refresh and expiration
- Redirects to login on 401 errors

## Components

### 1. AdminCustomers (`src/pages/admin/Customers.tsx`)

The main customers management page that provides:
- **Search functionality**: Search users by username or email
- **User listing**: Display paginated list of users
- **Quick actions**: Suspend/reactivate users directly from the list
- **User details**: View detailed user information in a modal
- **Advanced filtering**: Filter users by multiple criteria

### 2. AdvancedFilter (`src/components/admin/AdvancedFilter.tsx`)

A sophisticated filtering component that allows filtering by:
- **Account Level**: Bronze, Gold, Platinum, Diamond
- **Status**: Active, Inactive, Suspended, Deactivated
- **KYC Status**: Pending, Verified, Rejected
- **Results per page**: 10, 20, 50, 100

### 3. UserDetailsModal (`src/components/admin/UserDetailsModal.tsx`)

A comprehensive modal for viewing and managing individual users:
- **User overview**: Personal information and account details
- **Security information**: KYC status and security settings
- **Account actions**: Suspend or reactivate accounts with reasons

## API Endpoints Used

### 1. Search Users
```typescript
GET /admin/manage/users/search
```
- Supports pagination with `page` and `limit` parameters
- Filtering by `accountLevel`, `status`, `kycStatus`
- Search by `username` or `email`

### 2. Suspend User
```typescript
POST /admin/manage/users/{username}/suspend
```
- Requires a suspension reason
- Returns success message on completion

### 3. Reactivate User
```typescript
POST /admin/manage/users/{username}/reactivate
```
- Reactivates suspended accounts
- Returns success message on completion

### 4. Export Users
```typescript
GET /admin/manage/users/export
```
- Exports user data based on current filters
- Returns CSV file for download

## Error Handling

The integration includes comprehensive error handling:
- **Toast notifications**: Success and error messages for user actions
- **Loading states**: Visual feedback during API calls
- **Validation**: Input validation for suspension reasons
- **Fallback UI**: Graceful handling of empty states and errors

## Features

### Search and Filtering
- Real-time search as user types
- Advanced filtering panel with multiple criteria
- Active filter badges showing current filters
- Clear all filters functionality

### User Management
- View detailed user information
- Suspend users with mandatory reason
- Reactivate suspended users
- Export user data to CSV

### User Interface
- Responsive design for mobile and desktop
- Loading indicators for better UX
- Consistent styling with the banking theme
- Keyboard navigation support

## Usage Examples

### Basic Search
```typescript
const users = await UserManagementAPI.searchUsers({
  username: 'john',
  limit: 20
});
```

### Advanced Filtering
```typescript
const users = await UserManagementAPI.searchUsers({
  status: 'ACTIVE',
  accountLevel: 'GOLD',
  kycStatus: 'VERIFIED',
  page: 1,
  limit: 50
});
```

### User Management
```typescript
// Suspend user
await UserManagementAPI.suspendUser('johndoe', 'Suspicious activity detected');

// Reactivate user
await UserManagementAPI.reactivateUser('johndoe');
```

## Configuration

### Environment Variables
Make sure to set the following environment variables:
- `VITE_API_BASE_URL`: Base URL for the API endpoints

### Authentication
The integration assumes JWT token authentication stored in `localStorage` with the key `auth_token`.

## Future Enhancements

Potential improvements for the user management system:
1. **Bulk operations**: Select multiple users for bulk actions
2. **Audit log**: Track all user management actions
3. **Advanced search**: Search by date ranges, transaction history
4. **Role management**: Assign and modify user roles
5. **Email notifications**: Notify users of account status changes
6. **Two-factor authentication**: Manage 2FA settings for users

## Security Considerations

The implementation includes several security measures:
- **Role-based access**: Only ADMIN/EMPLOYEE roles can access the API
- **Input validation**: All user inputs are validated
- **Audit trail**: All actions are logged for security purposes
- **Token management**: Automatic token refresh and secure storage

## Testing

To test the integration:
1. Ensure the backend API is running
2. Set up proper authentication tokens
3. Test search functionality with various filters
4. Verify suspend/reactivate operations
5. Test export functionality
6. Validate error handling scenarios
