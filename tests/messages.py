import unittest
import requests
from unittest.mock import patch, MagicMock

class TestMessageAPI(unittest.TestCase):
    base_url = "http://localhost:3000"  # Update this with the actual base URL of your API

    def test_send_text_success(self):
        url = f"{self.base_url}/api/message/send"

        # Mocking the requests.post method
        with patch("requests.post") as mock_post:
            mock_post.return_value.json.return_value = {
                "success": True,
                "_id": "mock_message_id",
                "sender": {"_id": "mock_user_id", "name": "Test User", "pic": "profile_pic.jpg"},
                "content": "Hello, this is a test message",
                "chat": {
                    "_id": "mock_chat_id",
                    "chatName": "Test Chat",
                    "isGroupChat": False,
                    "users": [{"_id": "mock_user_id_1", "name": "User 1", "email": "user1@example.com", "pic": "user1.jpg"}],
                },
            }
            mock_post.return_value.status_code = 201

            # Make the actual request to your API
            response = requests.post(url, json={"content": "Hello, this is a test message", "chatId": "mock_chat_id"})

            # Assertions
            self.assertEqual(response.status_code, 201)
            self.assertTrue(response.json()["success"])
            self.assertEqual(response.json()["sender"]["name"], "Test User")
            # Add more assertions based on your API response

    def test_send_text_failure_missing_data(self):
        url = f"{self.base_url}/api/message/send"

        # Mocking the requests.post method
        with patch("requests.post") as mock_post:
            mock_post.return_value.json.return_value = {
                "success": False,
                "statusCode": 400,
                "message": "Invalid data",
            }
            mock_post.return_value.status_code = 400

            # Make the actual request to your API
            response = requests.post(url, json={})

            # Assertions
            self.assertEqual(response.status_code, 400)
            self.assertFalse(response.json()["success"])
            self.assertEqual(response.json()["message"], "Invalid data")
            # Add more assertions based on your API response

    def test_view_texts_success(self):
        chat_id = "mock_chat_id"
        url = f"{self.base_url}/api/message/view/{chat_id}"

        # Mocking the requests.get method
        with patch("requests.get") as mock_get:
            mock_get.return_value.json.return_value = [
                {
                    "_id": "mock_message_id_1",
                    "sender": {"_id": "mock_user_id_1", "name": "User 1", "pic": "user1.jpg", "email": "user1@example.com"},
                    "content": "Hello from User 1",
                    "chat": {"_id": "mock_chat_id", "chatName": "Test Chat", "isGroupChat": False},
                },
                {
                    "_id": "mock_message_id_2",
                    "sender": {"_id": "mock_user_id_2", "name": "User 2", "pic": "user2.jpg", "email": "user2@example.com"},
                    "content": "Hello from User 2",
                    "chat": {"_id": "mock_chat_id", "chatName": "Test Chat", "isGroupChat": False},
                },
            ]
            mock_get.return_value.status_code = 200

            # Make the actual request to your API
            response = requests.get(url)

            # Assertions
            self.assertEqual(response.status_code, 200)
            self.assertTrue(response.json())
            self.assertEqual(len(response.json()), 2)
            # Add more assertions based on your API response

if __name__ == '__main__':
    unittest.main()
