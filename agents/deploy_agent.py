def get_deploy_prompt(platform):
    return f"""
You are a deployment agent. The user wants to deploy a project on {platform}.
Write deployment steps in GitHub Actions YAML format suitable for that platform.
Include build, deploy commands, and any required service setup.
"""