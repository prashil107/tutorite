## users_service 

Thought for a couple of seconds


| Method     | URL                         | Returns                                                |
| ---------- | --------------------------- | ------------------------------------------------------ |
| **POST**   | `/api/users/signup/`        | `{ "username", "email", "role", "access", "refresh"    }` |
| **POST**   | `/api/users/token/`         | `{ "access", "refresh" }`                              |
| **POST**   | `/api/users/token/refresh/` | `{ "access" }`                                         |
| **GET**    | `/api/users/users/`         | `[{ "id", "username", "email", "role", "bio" }, …]`    |
| **POST**   | `/api/users/users/`         | `{ "id", "username", "email", "role", "bio" }`         |
| **GET**    | `/api/users/users/{pk}/`    | `{ "id", "username", "email", "role", "bio" }`         |
| **PUT**    | `/api/users/users/{pk}/`    | `{ "id", "username", "email", "role", "bio" }`         |
| **PATCH**  | `/api/users/users/{pk}/`    | `{ "id", "username", "email", "role", "bio" }`         |
| **DELETE** | `/api/users/users/{pk}/`    | *HTTP 204 No Content*                                  |
| **GET** | `/api/users/users/public/`    | *List of all users id, username, email, role*           |




## course_service
| Endpoint             | Method | Description                           | Request Body                             | Response Body                                                   | Permissions         |
| -------------------- | ------ | ------------------------------------- | ---------------------------------------- | --------------------------------------------------------------- | ------------------- |
| `/api/courses/`      | GET    | List all courses                      | –                                        | `[{ "id":1, "title":"...", "description":"...", "teacher":5 }]` | Authenticated users |
| `/api/courses/`      | POST   | Create a new course                   | `{ "title":"...", "description":"...", "teacher":"...", "linktoplaylist":"..." }` | `{ "id":2, "title":"...", "description":"...", "teacher":5 }`   | Teachers only       |
| `/api/courses/{pk}/` | GET    | Retrieve one course by its ID         | –                                        | `{ "id":1, "title":"...", "description":"...", "teacher":5 }`   | Authenticated users |
| `/api/courses/{pk}/` | PUT    | Replace an existing course            | `{ "title":"...", "description":"..." }` | `{ "id":1, "title":"...", "description":"...", "teacher":5 }`   | Teachers only       |
| `/api/courses/{pk}/` | PATCH  | Update one or more fields of a course | e.g. `{ "description":"..." }`           | `{ "id":1, "title":"...", "description":"...", "teacher":5 }`   | Teachers only       |
| `/api/courses/{pk}/` | DELETE | Delete a course                       | –                                        | HTTP 204 No Content                                             | Teachers only       |
