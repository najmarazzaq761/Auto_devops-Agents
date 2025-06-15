def get_stack_prompt():
    return """
You are a code stack detection expert. Based on the files like requirements.txt, package.json, or pom.xml,
determine what language and framework the project is using.
Reply in JSON format with 'language' and 'framework'.
"""

def get_stack_tool():
    return {
        "type": "function",
        "function": {
            "name": "detect_stack",
            "description": "Detects programming language and framework.",
            "parameters": {
                "type": "object",
                "properties": {
                    "files": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "required": ["files"]
            }
        }
    }