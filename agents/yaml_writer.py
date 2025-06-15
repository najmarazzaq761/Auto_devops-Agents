def get_yaml_writer_prompt():
    return """
You are a YAML writer. Combine the test, build, and deploy steps into a single GitHub Actions workflow file.
Ensure correct indentation and format.
"""