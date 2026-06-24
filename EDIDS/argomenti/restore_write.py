import json

transcript_path = r'C:\Users\Davide\.gemini\antigravity-ide\brain\f853a422-2ac4-4b2a-98f9-1cdc9970a51a\.system_generated\logs\transcript_full.jsonl'

lines = []
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'tool_calls' in data:
                for tc in data['tool_calls']:
                    if tc['function']['name'] == 'default_api:write_to_file':
                        args_str = tc['function']['arguments']
                        args = json.loads(args_str)
                        if 'TargetFile' in args and '0' in args['TargetFile'] and 'EDIDS' in args['TargetFile']:
                            filename = args['TargetFile'].replace('\\', '/').split('/')[-1]
                            with open(filename, 'w', encoding='utf-8') as out:
                                out.write(args['CodeContent'])
                            print(f"Restored {filename} from write_to_file!")
        except Exception as e:
            pass
