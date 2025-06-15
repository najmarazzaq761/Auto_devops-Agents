def get_build_prompt():
    return """
You are a CI build expert. Add steps to install dependencies, setup caching, and build artifacts.
Output GitHub Actions YAML format.
"""