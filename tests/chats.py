import unittest
import requests
from unittest.mock import patch, MagicMock

class TestChatAPI(unittest.TestCase):
    base_url = "http://localhost:3000"  # Update this with the actual base URL of your API

    def test_access_chat_success(self):
        url = f"{self.base_url}/api/chat/"
        mock_user_id = "mock_user_id"

        # Mocking the requests.post method
        with patch("requests.post") as mock_post:
            mock_post.return_value.json.return_value = {
                "success": True,
                "_id": "mock_chat_id",
                "chatName": "sender",
                "isGroupChat": False,
                "users": ["mock_user_id_1", "mock_user_id_2"],
            }
            mock_post.return_value.status_code = 200

            # Make the actual request to your API
            response = requests.post(url, json={"userId": mock_user_id})

            # Assertions
            self.assertEqual(response.status_code, 200)
            self.assertTrue(response.json()["success"])
            self.assertEqual(response.json()["isGroupChat"], False)
            # Add more assertions based on your API response

    def test_access_chat_failure_missing_param(self):
        url = f"{self.base_url}/api/chat/"

        # Mocking the requests.post method
        with patch("requests.post") as mock_post:
            mock_post.return_value.json.return_value = {
                "success": False,
                "statusCode": 400,
                "message": "UserId param not sent with request",
            }
            mock_post.return_value.status_code = 400

            # Make the actual request to your API
            response = requests.post(url, json={})

            # Assertions
            self.assertEqual(response.status_code, 400)
            self.assertFalse(response.json()["success"])
            self.assertEqual(response.json()["message"], "UserId param not sent with request")
            # Add more assertions based on your API response

    def test_fetch_chats_success(self):
        # Mocking the necessary dependencies
        mock_user_id = "mock_user_id"
        mock_chat_results = [
            {"_id": "mock_chat_id1", "users": [mock_user_id, "other_user_id"], "latestMessage": {"sender": {"name": "Sender1"}}},
            {"_id": "mock_chat_id2", "users": [mock_user_id, "another_user_id"], "latestMessage": {"sender": {"name": "Sender2"}}},
        ]

        # Mocking the Chat.find method
        with patch("path.to.Chat.find") as mock_find:
            mock_find.return_value.populate.return_value.populate.return_value.sort.return_value.exec.return_value = mock_chat_results

            # Mocking the User.populate method
            with patch("path.to.User.populate") as mock_user_populate:
                # Mocking the User.populate method's return value
                mock_user_populate.return_value = mock_chat_results

                # Mocking the response object
                mock_response = MagicMock()
                mock_response.status_code = 200

                # Mocking the res parameter of the fetchChats function
                mock_res = MagicMock()

                # Make the actual call to the fetchChats function
                fetchChats(mock_request, mock_res)

                # Assertions
                mock_res.status.assert_called_with(200)
                mock_res.send.assert_called_with(mock_chat_results)

    def test_fetch_chats_failure(self):
        # Mocking the necessary dependencies
        mock_user_id = "mock_user_id"

        # Mocking the Chat.find method to raise an exception
        with patch("path.to.Chat.find") as mock_find:
            mock_find.return_value.populate.return_value.populate.return_value.sort.return_value.exec.side_effect = Exception("Mock error")

            # Mocking the response object
            mock_response = MagicMock()
            mock_response.status_code = 400

            # Mocking the res parameter of the fetchChats function
            mock_res = MagicMock()

            # Make the actual call to the fetchChats function
            fetchChats(mock_request, mock_res)

            # Assertions
            mock_res.status.assert_called_with(400)
            mock_res.json.assert_called_with({
                "success": False,
                "statusCode": 400,
                "message": "Mock error",
            })

if __name__ == '__main__':
    unittest.main()
