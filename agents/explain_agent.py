def get_explanation_prompt():
    return """
You are an expert in explaining DevOps pipelines.
Explain each step of the YAML CI/CD file in simple terms.
Output explanation as bullet points.
"""