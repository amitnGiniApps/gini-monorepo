
## Running the LLM Locally with Ollama

Follow these steps to download and run the AI model locally using [Ollama](https://ollama.com):

1. Download and install Ollama for your platform:  
   👉 [Download Ollama for Mac](https://ollama.com/download/mac)

2. Check if Ollama is installed correctly by running the following command in your terminal:
```bash
ollama --version
```

3. Start the Ollama service. This command will start the server and needs to be run separately or in the background:
```bash
ollama serve
```
> **Note**: You can run `ollama serve` in a separate terminal or background process. It will keep the Ollama server running, allowing you to interact with the models.

4. Pull the `gemma3:4b` model:
```bash
ollama pull gemma3:4b
```

5. View all the models you have downloaded:
```bash
ollama list
```

6. Start interacting with the `gemma3:4b` model:
```bash
ollama run gemma3:4b
```

7. Create a new model named `gini-bot` from a custom `Modelfile` (inside `gini-monorepo/packages/backend/src/models`):
```bash
ollama create gini-site-checker-bot -f site-checker-Modelfile
```

7. Create a new model named `docs-genrator-bot` from a custom `Modelfile` (inside `gini-monorepo/packages/backend/src/models`):
```bash
 ollama create docs-genrator-bot -f docs-generator-Modelfile
```

8. Create a new model named `gini-site-checker-bot` from a custom `Modelfile` (inside `gini-monorepo/packages/backend/src/models`):
```bash
ollama create gini-bot -f Modelfile
```

8. Run your custom `gini-bot` model:
```bash
ollama run gini-bot
```

ollama pull mistral  
