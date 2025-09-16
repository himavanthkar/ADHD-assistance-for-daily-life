import unittest
from unittest.mock import patch, MagicMock
import json
import os
from ai_agents.task_agent import TaskAgent

class TestTaskAgent(unittest.TestCase):

    def setUp(self):
        # Set a dummy API key for tests to ensure we don't depend on .env
        os.environ["GROQ_API_KEY"] = "test_key"

    @patch('ai_agents.task_agent.OpenAI')
    def test_process_transcript_success(self, MockOpenAI):
        """
        Tests successful processing of a transcript with tasks and schedule items.
        """
        # Arrange
        mock_client_instance = MockOpenAI.return_value
        mock_completion_response = MagicMock()
        expected_json_output = {
            "tasks": ["Buy groceries"],
            "schedule": [{"event": "Dentist appointment", "time": "Friday at 3pm"}]
        }
        mock_completion_response.choices[0].message.content = json.dumps(expected_json_output)
        mock_client_instance.chat.completions.create.return_value = mock_completion_response

        # Instantiate the agent. __init__ will use the mocked OpenAI client.
        agent = TaskAgent()

        transcript = "hey I need to remember to buy groceries and I also need to schedule a dentist appointment for Friday at 3pm"

        # Act
        result_str = agent.process_transcript(transcript)
        result_json = json.loads(result_str)

        # Assert
        self.assertEqual(result_json, expected_json_output)
        mock_client_instance.chat.completions.create.assert_called_once()
        
        # Verify that the correct arguments were passed to the API
        call_args = mock_client_instance.chat.completions.create.call_args
        self.assertEqual(call_args.kwargs['model'], agent.model)
        user_message_content = next(m['content'] for m in call_args.kwargs['messages'] if m['role'] == 'user')
        self.assertEqual(user_message_content, transcript)


    def test_process_transcript_empty(self):
        """
        Tests the agent's handling of an empty transcript.
        """
        # Arrange
        agent = TaskAgent()
        transcript = ""

        # Act
        result_str = agent.process_transcript(transcript)
        result_json = json.loads(result_str)

        # Assert
        self.assertEqual(result_json, {"status": "error", "message": "Empty transcript received"})

if __name__ == '__main__':
    unittest.main() 