
# Auto-DevOps Agent

> **Zero-config CI/CD pipeline generation using AI Agents**

Auto-DevOps Agent is an intelligent multi-agent system that automatically generates CI/CD pipelines for your project. It detects your tech stack, builds a full GitHub Actions YAML workflow (test, build, deploy), and explains each step — no manual DevOps setup needed!

---

## 🧠 Key Features

* 🔍 Auto-detects tech stack (Python, Node.js, etc.)
* 🧪 Generates test, build, and deployment CI steps
* 📝 Outputs GitHub Actions YAML ready to commit
* 💬 Explains each pipeline step in plain English
* ⚙️ FastAPI backend + React.js frontend
* 💡 Powered by Groq & OpenAI LLM agents

---

## 🧱 Architecture

```
Frontend (React.js) → Backend (FastAPI) → Groq/OpenAI Agents → YAML + Explanation
```

### Agent Responsibilities

| Agent               | Role                                                 |
| ------------------- | ---------------------------------------------------- |
| 🕵 LanguageDetector | Identifies language & framework from project files   |
| 🧪 TestAgent        | Generates test steps for GitHub Actions              |
| 🔨 BuildAgent       | Adds build, caching, and artifact steps              |
| 🚀 DeployAgent      | Writes deployment steps for Streamlit, Vercel, etc.  |
| 📋 YAMLWriter       | Combines all steps into a complete workflow YAML     |
| 📢 ExplainAgent     | Generates human-readable explanation of the pipeline |

---

## 🔧 Technologies Used

* 🧠 LLMs: **Groq**, **OpenAI SDK**
* 🌐 Backend: **FastAPI**
* 🎨 Frontend: **React.js**
* 🛠 DevOps: **GitHub Actions YAML**
* ⚡ Local Agent IDE: **TRAE AI**

---

## 🖥️ Live Demo

👉 [API Docs (FastAPI)](https://web-production-abd3.up.railway.app/docs)
👉 [GitHub Repository](https://github.com/najmarazzaq761/Auto_devops-Agents)

---

## 🚧 Future Improvements

* ✅ Auto-deploy to Vercel, Railway, Streamlit with GitHub secrets config
* ✅ GitHub repo push from agents
* ✅ Dockerfile + docker-compose generation support

---

## 🤝 Contributing

We welcome contributions, ideas, and suggestions!
Feel free to fork, open issues, or submit PRs.

---

## 👩‍💻 Contributors

* **Maria Noor** – Frontend Developer

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
