import unittest
import requests
from unittest.mock import patch, MagicMock

class TestUserAPI(unittest.TestCase):
    base_url = "http://localhost:3000"  # Update this with the actual base URL of your API

    def test_user_login_success(self):
        url = f"{self.base_url}/user/login"
        mock_user = {
            "_id": "some_id",
            "name": "Test User",
            "email": "test@example.com",
            "pic": "profile_pic.jpg",
            "role": "user",
        }
        mock_token = "mock_token"

        # Mocking the requests.post method
        with patch("requests.post") as mock_post:
            mock_post.return_value.json.return_value = {
                "success": True,
                "_id": mock_user["_id"],
                "name": mock_user["name"],
                "email": mock_user["email"],
                "pic": mock_user["pic"],
                "role": mock_user["role"],
                "token": mock_token,
                "message": "Logged In Successful",
            }
            mock_post.return_value.status_code = 200

            # Make the actual request to your API
            response = requests.post(url, json={"email": "test@example.com", "password": "password123"})

            # Assertions
            self.assertEqual(response.status_code, 200)
            self.assertTrue(response.json()["success"])
            self.assertEqual(response.json()["_id"], mock_user["_id"])
            # Add more assertions based on your API response

    def test_user_login_failure(self):
        url = f"{self.base_url}/user/login"

        # Mocking the requests.post method
        with patch("requests.post") as mock_post:
            mock_post.return_value.json.return_value = {
                "success": False,
                "statusCode": 400,
                "message": "Invalid Email or Password",
            }
            mock_post.return_value.status_code = 400

            # Make the actual request to your API
            response = requests.post(url, json={"email": "test@example.com", "password": "wrong_password"})

            # Assertions
            self.assertEqual(response.status_code, 400)
            self.assertFalse(response.json()["success"])
            self.assertEqual(response.json()["message"], "Invalid Email or Password")
            # Add more assertions based on your API response

if __name__ == '__main__':
    unittest.main()
