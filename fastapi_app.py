# fastapi_app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import os
from agents import (
    stack_detector, test_writer, build_pipeline, 
    deploy_agent, yaml_writer, explain_agent
)

# Configure OpenAI (Groq)
openai.api_key =  os.getenv("GROQ_API_KEY")# Replace with secure loading (env/secrets)
openai.base_url = "https://api.groq.com/openai/v1/"

# Define FastAPI app
app = FastAPI()

class DevOpsRequest(BaseModel):
    repo_url: str
    platform: str
    files: list[str] = ["requirements.txt", "app.py"]

@app.post("/generate-cicd")
async def generate_pipeline(request: DevOpsRequest):
    try:
        # Stack detection
        stack_response = openai.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": stack_detector.get_stack_prompt()},
                {"role": "user", "content": f"files: {request.files}"}
            ]
        )

        # Test steps
        test_response = openai.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": test_writer.get_test_prompt()},
                {"role": "user", "content": f"Generate test YAML for {request.files}"}
            ]
        )

        # Build steps
        build_response = openai.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": build_pipeline.get_build_prompt()},
                {"role": "user", "content": f"Add build steps for Python app with requirements.txt"}
            ]
        )

        # Deploy steps
        deploy_response = openai.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": deploy_agent.get_deploy_prompt(request.platform)},
                {"role": "user", "content": f"Deploy my app to {request.platform}"}
            ]
        )

        # YAML writer
        combined_yaml = openai.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": yaml_writer.get_yaml_writer_prompt()},
                {"role": "user", "content": f"Test Steps:\n{test_response.choices[0].message.content}\nBuild Steps:\n{build_response.choices[0].message.content}\nDeploy Steps:\n{deploy_response.choices[0].message.content}"}
            ]
        )

        # Explanation
        explanation = openai.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": explain_agent.get_explanation_prompt()},
                {"role": "user", "content": combined_yaml.choices[0].message.content}
            ]
        )

        return {
            "yaml": combined_yaml.choices[0].message.content,
            "explanation": explanation.choices[0].message.content
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
