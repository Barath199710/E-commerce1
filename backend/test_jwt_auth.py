import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:5000"

def request(endpoint, method='GET', data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f"Bearer {token}"

    body = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as resp:
            resp_body = resp.read().decode('utf-8')
            return resp.status, json.loads(resp_body) if resp_body else {}
    except urllib.error.HTTPError as e:
        resp_body = e.read().decode('utf-8')
        try:
            parsed = json.loads(resp_body)
        except Exception:
            parsed = {"raw": resp_body}
        return e.code, parsed

def test_jwt_workflow():
    print("=== Testing JWT Authentication Backend Endpoints ===")

    # 1. Login as Admin
    print("\n1. Testing Login as Admin (admin@example.com)...")
    status, admin_data = request("/api/login", method="POST", data={
        "email": "admin@example.com",
        "password": "admin123"
    })
    print(f"Status Code: {status}")
    assert status == 200, f"Admin login failed: {admin_data}"
    admin_access_token = admin_data['access_token']
    admin_refresh_token = admin_data['refresh_token']
    print(f"Admin Access Token received: {admin_access_token[:25]}...")
    print(f"Admin Role: {admin_data['user']['role']}")
    assert admin_data['user']['role'] == 'admin'

    # 2. Login as Regular Customer
    print("\n2. Testing Login as Customer (user@example.com)...")
    status, customer_data = request("/api/login", method="POST", data={
        "email": "user@example.com",
        "password": "user123"
    })
    print(f"Status Code: {status}")
    assert status == 200, f"Customer login failed: {customer_data}"
    cust_access_token = customer_data['access_token']
    cust_refresh_token = customer_data['refresh_token']
    print(f"Customer Access Token received: {cust_access_token[:25]}...")
    print(f"Customer Role: {customer_data['user']['role']}")
    assert customer_data['user']['role'] == 'customer'

    # 3. Test Protected Endpoint without Token (Expect 401)
    print("\n3. Testing Protected /api/me without Authorization Token...")
    status, res = request("/api/me")
    print(f"Status Code: {status} (Expected: 401)")
    assert status == 401, f"Should reject unauthenticated request: {res}"

    # 4. Test Protected Endpoint with Customer Token (Expect 200)
    print("\n4. Testing Protected /api/me with Customer Authorization Token...")
    status, profile = request("/api/me", token=cust_access_token)
    print(f"Status Code: {status}")
    assert status == 200, f"Failed to get user profile: {profile}"
    print(f"Profile returned: Name={profile['name']}, Email={profile['email']}, Role={profile['role']}")

    # 5. Test Admin Protected Route with Customer Token (Expect 403)
    print("\n5. Testing Admin Route /api/admin/orders with Customer Token...")
    status, res = request("/api/admin/orders", token=cust_access_token)
    print(f"Status Code: {status} (Expected: 403)")
    assert status == 403, f"Customer should NOT be allowed to access admin orders: {res}"

    # 6. Test Admin Protected Route with Admin Token (Expect 200)
    print("\n6. Testing Admin Route /api/admin/orders with Admin Token...")
    status, res = request("/api/admin/orders", token=admin_access_token)
    print(f"Status Code: {status}")
    assert status == 200, f"Admin failed to access admin orders: {res}"
    print(f"Total Admin Orders returned: {res['total']}")

    # 7. Test Refresh Token Endpoint /api/refresh
    print("\n7. Testing Token Refresh /api/refresh using Refresh Token...")
    status, res = request("/api/refresh", method="POST", token=cust_refresh_token)
    print(f"Status Code: {status}")
    assert status == 200, f"Token refresh failed: {res}"
    new_access_token = res['access_token']
    print(f"New Access Token received: {new_access_token[:25]}...")

    # 8. Test New Access Token on /api/me
    print("\n8. Verifying New Access Token works on /api/me...")
    status, profile = request("/api/me", token=new_access_token)
    print(f"Status Code: {status}")
    assert status == 200, "New access token failed to authenticate."

    # 9. Test Logout & Token Revocation
    print("\n9. Testing Logout / Token Revocation /api/logout...")
    status, res = request("/api/logout", method="POST", token=new_access_token)
    print(f"Status Code: {status}")
    assert status == 200, f"Logout failed: {res}"

    # 10. Verify Revoked Token is Rejected (Expect 401)
    print("\n10. Testing Revoked Access Token on /api/me (Expect 401)...")
    status, res = request("/api/me", token=new_access_token)
    print(f"Status Code: {status} (Expected: 401)")
    assert status == 401, "Revoked token was still accepted!"

    print("\nALL BACKEND JWT TESTS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    test_jwt_workflow()
