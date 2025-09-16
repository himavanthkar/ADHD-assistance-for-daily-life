import os
import json
from openai import OpenAI

class TaskAgent:
    def __init__(self):
        # We'll use Groq for fast transcription processing via the OpenAI client
        self.client = OpenAI(
            base_url="https://api.groq.com/openai/v1",
            api_key=os.environ.get("GROQ_API_KEY"),
        )
        self.model = "llama3-8b-8192"

    def process_transcript(self, transcript: str):
        """
        Processes the full transcript from Vapi and extracts tasks and schedule items.
        """
        if not transcript:
            return json.dumps({"status": "error", "message": "Empty transcript received"})

        system_prompt = """
        You are an expert task and schedule extractor for a to-do list application.
        Your input is a raw transcript of a user's voice memo.
        Your job is to identify actionable tasks and any events to be scheduled.

        Respond in JSON format with two keys: 'tasks' and 'schedule'.
        'tasks' should be a list of strings.
        'schedule' should be a list of objects, each with 'event' (string) and 'time' (string).
        If no tasks or schedule items are found, return empty lists.

        Example:
        Transcript: "hey I need to remember to buy groceries and I also need to schedule a dentist appointment for Friday at 3pm"
        {
          "tasks": ["Buy groceries"],
          "schedule": [{"event": "Dentist appointment", "time": "Friday at 3pm"}]
        }
        """

        chat_completion = self.client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": transcript},
            ],
            model=self.model,
            temperature=0.0,
            response_format={"type": "json_object"},
        )
        
        content = chat_completion.choices[0].message.content
        if not content:
            return json.dumps({"status": "error", "message": "API returned empty content."})

        return content 