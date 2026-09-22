# Task 16 — JWT Authentication Write-up

**Project Repository:** [ecommerce-task16](file:///C:/Project/ecommerce-task16)  
**Type:** Full Stack — React + Flask  
**Authentication Standard:** JSON Web Tokens (JWT Access & Refresh Tokens)

---

## 1. What is the difference between an access token and a refresh token? Why are they different expiry lengths?

### Access Token vs. Refresh Token

| Property | Access Token | Refresh Token |
| :--- | :--- | :--- |
| **Purpose** | Authenticate and authorize every API request. | Obtain a new access token when the current access token expires. |
| **Lifespan** | Short-lived (**15 minutes** in our app). | Long-lived (**7 days** in our app). |
| **Transmission** | Sent with **every request** in `Authorization: Bearer <token>` header. | Sent **only** to the `/api/refresh` endpoint when refreshing access. |
| **Payload Content** | User ID, role (`admin`/`customer`), user name, and expiration timestamp (`exp`). | User ID and token type (`refresh`). |
| **Revocation** | Checked against revocation blocklist on protected route access. | Checked on refresh requests and invalidated upon user logout. |

### Why Different Expiry Lengths? (Security Rationale)

1. **Minimizing Window of Vulnerability:**  
   Because access tokens are transmitted with every single HTTP request, they have a higher probability of being intercepted in network logs, browser memory, or XSS attacks. Giving access tokens a short lifespan (**15 minutes**) ensures that even if an access token is leaked, an attacker's window of opportunity is extremely limited before the token becomes completely invalid.

2. **User Experience Without Sacrificing Security:**  
   If an application only used 15-minute access tokens without a refresh token, users would be forced to enter their password every 15 minutes. The 7-day refresh token allows users to stay logged in seamlessly for up to 7 days while keeping individual access tokens short-lived.

3. **Centralized Access Revocation:**  
   Since JWTs are stateless, the server trusts any valid signature until expiration. By using short access token lifespans and validating refresh tokens against a database blocklist during `/api/refresh`, administrators can revoke user access (e.g., on logout or password change) without storing state for every individual API request.

---

## 2. What is an Axios interceptor and why is it better than manually adding the token to every API call?

### What is an Axios Interceptor?
An **Axios interceptor** is a middleware function provided by the Axios HTTP client that intercepts HTTP requests before they are sent from the browser and HTTP responses before they are passed to `.then()` or `await` handlers.

In our React application (`src/api/client.js`), we configured two interceptors:
- **Request Interceptor:** Intercepts outgoing requests, reads `access_token` from `localStorage`, and appends `Authorization: Bearer <access_token>` header automatically.
- **Response Interceptor:** Intercepts incoming responses, detects `401 Unauthorized` errors, automatically requests a fresh access token via `POST /api/refresh`, and silently retries the failed original request.

### Why Interceptors are Better than Manual Header Insertion:

1. **DRY (Don't Repeat Yourself):**  
   Without interceptors, every single component file making API calls (`Home.jsx`, `AdminOrders.jsx`, `MyOrders.jsx`, `ProductForm.jsx`) would have to manually import `localStorage` and construct headers:
   ```javascript
   // Tedious manual approach (without interceptor)
   const token = localStorage.getItem('access_token');
   await axios.get('/api/orders', {
     headers: { Authorization: `Bearer ${token}` }
   });
   ```
   With interceptors, components simply call `api.get('/api/orders')` cleanly.

2. **Centralized Error & Silent Refresh Handling:**  
   Handling token expiration manually in every component would require duplicating `try/catch` logic across dozens of files. Interceptors handle `401 Unauthorized` responses in **one single place** across the entire application transparently.

3. **Separation of Concerns & Maintainability:**  
   UI components focus purely on rendering view state and user interactions, while authentication and transport mechanics are encapsulated entirely inside `src/api/client.js`.

---

## 3. What happens in your app when the access token expires mid-session? Walk through the exact sequence of events in your interceptor code.

When a user's 15-minute access token expires while they are actively using the React application, the following step-by-step sequence occurs transparently:

```
[React UI Component] ──(1. GET /api/orders)──> [Flask Backend API]
                                                      │ (2. Token Expired)
                                                      ▼
[React UI Component] <──(3. HTTP 401 Error)──── [Flask Backend API]
        │
        ▼ (Captured by Axios Response Interceptor)
[Axios Interceptor] ──(4. Read refresh_token from localStorage)
        │
        ├──(5. POST /api/refresh with Bearer refresh_token)──> [Flask API]
        │                                                           │
        │ <──(6. HTTP 200 + New access_token)───────────────────────┘
        │
        ├──(7. Store new access_token in localStorage)
        ├──(8. Update original.headers.Authorization = 'Bearer new_access_token')
        │
        └──(9. Retry original GET /api/orders)──> [Flask Backend API]
                                                      │
[React UI Component] <──(10. HTTP 200 OK + Data)──────┘ (Seamless Success!)
```

### Detailed Sequence of Code Execution:

1. **Request Execution:** The component calls `api.get('/api/admin/orders')`. The request interceptor attaches the current (expired) access token.
2. **Backend Rejection:** Flask JWT (`@jwt_required()`) validates the token, detects `exp` timestamp has passed, and returns `HTTP 401 Unauthorized` with `{"msg": "Token has expired"}`.
3. **Interceptor Trap:** Axios triggers the error handler in `api.interceptors.response.use()`. The interceptor checks `if (error.response?.status === 401 && !original._retry)`.
4. **Prevent Infinite Loops:** The interceptor sets `original._retry = true` so the same request won't trigger infinite refresh loops if refresh fails.
5. **Token Retrieval:** The interceptor retrieves `refresh_token` from `localStorage`.
6. **Refresh Call:** The interceptor executes:
   ```javascript
   const res = await axios.post('http://localhost:5000/api/refresh', {}, {
     headers: { Authorization: `Bearer ${refreshToken}` }
   });
   ```
7. **Store New Access Token:** The backend verifies the refresh token and returns a new access token. The interceptor updates storage:
   ```javascript
   localStorage.setItem('access_token', res.data.access_token);
   ```
8. **Re-attach & Re-send:** The interceptor updates the authorization header on the original failed request configuration:
   ```javascript
   original.headers.Authorization = `Bearer ${res.data.access_token}`;
   return api(original); // Re-executes original request!
   ```
9. **Seamless UI Update:** The original `api.get('/api/admin/orders')` call resolves with the HTTP 200 response data. The user notices no disruption or logout.
10. **Fallback on Failure:** If the `refresh_token` is also expired (after 7 days) or revoked, `axios.post('/api/refresh')` fails with 401. The interceptor catches the exception, clears `localStorage`, dispatches `auth-expired` event, and redirects the user to `/login`.

---

## 4. What is the difference between JWT authentication and Flask session authentication? Why is JWT better for a React single-page application?

### Difference Between JWT and Flask Session Authentication

| Architectural Feature | Flask Session Authentication | JWT (JSON Web Token) Authentication |
| :--- | :--- | :--- |
| **Statefulness** | **Stateful:** Server creates a session on login and stores data in a session store/cookie. | **Stateless:** Server issues a signed token containing payload claims. Server stores no session state. |
| **Session Lookup** | Server must look up session data in memory or DB on every request. | Server verifies cryptographic signature (`HMAC-SHA256`) using `JWT_SECRET_KEY` in memory. |
| **Transport Mechanism** | HTTP Cookies (`Cookie: session=...`). | Authorization Header (`Authorization: Bearer <token>`). |
| **Cross-Origin (CORS)** | Vulnerable to CORS/SameSite issues when frontend and backend run on different domains. | CORS friendly. Headers work across any domain, port, or mobile client. |
| **Scalability** | Requires sticky sessions or a shared session store (Redis) across server nodes. | Fully scalable. Any API server node with the secret key can verify tokens independently. |

### Why JWT is Superior for a React Single-Page Application (SPA):

1. **Cross-Origin & Microservice Compatibility:**  
   In modern production architectures, React frontend applications (e.g., hosted on Vercel or Netlify) run on different domains or ports from Flask REST APIs (e.g., AWS EC2 or Render). Cookies encounter complex browser `SameSite`, `Secure`, and third-party cookie restrictions across origins. JWTs passed in `Authorization` headers bypass cookie restrictions completely.

2. **Mobile & Third-Party API Support:**  
   A REST backend serving a React SPA often needs to support mobile clients (React Native, iOS, Android) or external API integrations. Mobile SDKs do not have native browser cookie managers, but all clients natively support HTTP Authorization headers.

3. **Horizontal Scalability:**  
   When traffic grows, Flask backend services scale across multiple server instances or serverless containers. With session authentication, servers require a centralized Redis cache for session lookups. With JWT authentication, every server node can instantly verify requests in micro-seconds using the shared secret key without database hits.
