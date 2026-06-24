import json

transcript_path = r'C:\Users\Davide\.gemini\antigravity-ide\brain\f853a422-2ac4-4b2a-98f9-1cdc9970a51a\.system_generated\logs\transcript_full.jsonl'

lines = []
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'tool_calls' in data:
                for tc in data['tool_calls']:
                    if tc['function']['name'] == 'default_api:run_command':
                        args_str = tc['function']['arguments']
                        args = json.loads(args_str)
                        cmd = args.get('CommandLine', '')
                        if '01-fondamenti.html' in cmd:
                            with open('script_found.txt', 'a', encoding='utf-8') as out:
                                out.write(cmd + '\n\n-----------------\n\n')
                            print("Found script!")
        except Exception as e:
            pass
