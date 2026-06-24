import json

transcript_path = r'C:\Users\Davide\.gemini\antigravity-ide\brain\f853a422-2ac4-4b2a-98f9-1cdc9970a51a\.system_generated\logs\transcript_full.jsonl'

lines = []
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'tool_calls' in data:
                for tc in data['tool_calls']:
                    print(tc['function']['name'])
        except Exception as e:
            pass
