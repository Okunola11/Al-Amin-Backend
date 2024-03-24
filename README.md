# Al Amin Backend API Documentation

This API serves as the backend for managing student and employee information within a school environment. Below you'll find detailed information about the endpoints available, authentication process, and usage guidelines.

## Authentication

### Authentication Endpoints

The `/auth` endpoint group manages authentication.

- **POST /auth/login**: Endpoint for user authentication. Accepts username, password and roles in the request body and returns an access token and refresh token upon successful authentication.
- **POST /auth/refresh**: Endpoint to refresh access token. Requires a valid refresh token in the request body and returns a new access token.
- **POST /auth/logout**: Endpoint to clear access token and cookies. Logs out the user.

### Tokens

- **Access Token**: Assigned to users upon authentication. Expires in a short while and can be regenerated using the refresh token.
- **Refresh Token**: Assigned to users upon authentication. Expires after a longer period compared to access token. Used to refresh access tokens.

## Endpoints

### Results Endpoint

The `/results` endpoint group manages results data.

- **GET /results**: Retrieve results for students.
- **POST /results**: Upload results for students.
- **PUT /results/:id**: Update results for a specific student.
- **DELETE /results/:id**: Delete results for a specific student.

### Students Endpoint

The `/students` endpoint group manages students data.

- **GET /students**: Retrieve information about students.
- **POST /students**: Add a new student.
- **PUT /students/:id**: Update information for a specific student.
- **DELETE /students/:id**: Delete a specific student.

### Employee Endpoint

The `/users` endpoint group manages employee data.

- **GET /users**: Retrieve information about employees (teachers or staff).
- **POST /users**: Add a new employee (teacher or staff).
- **PUT /users/:id**: Update information for a specific employee.
- **DELETE /users/:id**: Delete a specific employee.

## Access Control

- **Class Teachers and Admins**: Can access class-related data, upload and manage results for their assigned classes.
- **Admins**: Can access all students' data and perform CRUD operations on students.
- **Executives and Admins**: Have access to user settings, including creating new users.

## Usage Guidelines

1. **Authentication**: Use the `/auth/login` endpoint to authenticate users and obtain access and refresh tokens. Refresh access tokens using the `/auth/refresh` endpoint when the access token expires.
2. **Authorization**: Ensure that users have the necessary permissions to access specific endpoints based on their roles (e.g., class teachers, admins, executives).
3. **Result Management**: Use the `/results` endpoint to upload, update, retrieve, and delete student results. Ensure that only class teachers have permission to upload results for their assigned classes.
4. **Student Management**: Use the `/students` endpoint to manage student information, including adding, updating, and deleting students. Admins have full control over student data.
5. **User Management**: Use the `/users` endpoint to manage employee information, including adding, updating, and deleting employees. Only executives and admins have access to user settings.

## Error Handling

- Ensure proper error handling is implemented for all endpoints to provide informative error messages in case of failures or invalid requests.

## Technology Stack

- **Backend**: Built with Express.js and Node.js.
- **Authentication**: JWT tokens (access token and refresh token).
- **Database**: MongoDB for data storage.

Thank you for using the School Database Management System API! If you have any questions or need further assistance, feel free to contact us.

---
*Note: This documentation is subject to updates and improvements. Always refer to the latest version for accurate information.*
