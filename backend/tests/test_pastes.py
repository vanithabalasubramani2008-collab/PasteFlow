import pytest
from fastapi.testclient import TestClient

def test_health(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_create_public_paste(client: TestClient):
    response = client.post(
        "/api/v1/pastes/",
        json={"content": "print('hello')", "title": "Test Paste", "language": "python", "visibility": "public"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["content"] == "print('hello')"
    assert data["title"] == "Test Paste"
    assert data["visibility"] == "public"
    assert "id" in data

def test_get_pastes_list(client: TestClient):
    # Ensure there's a paste
    client.post(
        "/api/v1/pastes/",
        json={"content": "test content", "visibility": "public"}
    )
    response = client.get("/api/v1/pastes/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["visibility"] == "public"

def test_create_private_paste_without_auth(client: TestClient):
    # Creating a private paste without auth should succeed (it's unowned private, basically lost, but API allows it unless we restrict it)
    # Actually, if we don't have an owner, we might restrict it. Let's see if the API allows it.
    response = client.post(
        "/api/v1/pastes/",
        json={"content": "secret", "visibility": "private"}
    )
    assert response.status_code == 201
    paste_id = response.json()["id"]

    # Try to fetch it
    fetch_response = client.get(f"/api/v1/pastes/{paste_id}")
    assert fetch_response.status_code == 403

def test_password_protected_paste(client: TestClient):
    response = client.post(
        "/api/v1/pastes/",
        json={"content": "top secret", "visibility": "unlisted", "password": "mypassword"}
    )
    assert response.status_code == 201
    paste_id = response.json()["id"]

    # Fetch without password
    fetch_1 = client.get(f"/api/v1/pastes/{paste_id}")
    assert fetch_1.status_code == 200
    assert fetch_1.json()["content"] == "PASSWORD_PROTECTED"
    assert fetch_1.json()["has_password"] == True

    # Fetch with wrong password
    fetch_2 = client.get(f"/api/v1/pastes/{paste_id}?password=wrong")
    assert fetch_2.status_code == 401

    # Fetch with correct password
    fetch_3 = client.get(f"/api/v1/pastes/{paste_id}?password=mypassword")
    assert fetch_3.status_code == 200
    assert fetch_3.json()["content"] == "top secret"
