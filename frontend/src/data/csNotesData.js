const csNotesData = {
  "Generative AI": {
  "icon": "ti-brain",
  "color": "#A32D2D",
  "topics": {
    "What is Generative AI?": {
      "explanation": "Generative AI refers to AI systems capable of producing new content â€” text, images, audio, video, and code â€” rather than just classifying or predicting from existing data. It marks a shift from AI that recognizes patterns to AI that creates.",
      "details": [
        "Traditional AI: classification and prediction (spam filter, price prediction)",
        "Generative AI: creates novel outputs (write an email, generate an image)",
        "Key examples: OpenAI â†’ ChatGPT, Google â†’ Gemini, Anthropic â†’ Claude",
        "Modalities: text, image, audio, video, code, 3D, multimodal",
        "Underlying tech: Transformers, Diffusion Models, GANs, VAEs"
],
      "example": "// Traditional AI vs Generative AI\nTraditional AI:\n  Input: \"This email says 'Win $1000 now!!'\"\n  Task:  Binary classification\n  Output: SPAM / NOT SPAM\n\nGenerative AI:\n  Input: \"Write a professional email declining a meeting\"\n  Task:  Content generation\n  Output: \"Dear [Name], Thank you for the invitation...\n           Unfortunately, I'm unable to attend due to...\"\n\n// Real-world applications\nText:    ChatGPT, Claude, Gemini â†’ writing, Q&A, coding\nImages:  DALLÂ·E, Midjourney, Stable Diffusion â†’ art, design\nCode:    GitHub Copilot, Claude Code â†’ code completion\nAudio:   Suno, ElevenLabs â†’ music, voice synthesis\nVideo:   Sora, Runway â†’ video generation\n\n// Foundation: all modern GenAI is built on Transformers\n                  +------------------+\n  Transformers â†’ | Self-Attention    | â†’ Understand context\n                  | Positional Enc.  | â†’ Order-aware\n                  | Feed-Forward     | â†’ Pattern learning\n                  +------------------+"
},
    "Machine Learning Basics": {
      "explanation": "Machine Learning is a subset of AI where systems learn patterns from data rather than following explicitly programmed rules. It is the foundation that makes Generative AI possible.",
      "details": [
        "Supervised learning: labeled data pairs (inputâ†’output); learns to predict",
        "Unsupervised learning: unlabeled data; discovers hidden structure",
        "Reinforcement learning: agent learns by reward/penalty feedback",
        "Features: input variables (columns); Labels: target output (what we predict)",
        "Overfitting: model memorizes training data, fails on new data",
        "Underfitting: model too simple, cannot capture patterns in data",
        "Training/test split: typically 80/20 or 70/30"
],
      "example": "# Supervised Learning â€” Linear Regression (house price)\nfrom sklearn.linear_model import LinearRegression\nimport numpy as np\n\nX = np.array([[1000],[1500],[2000],[2500]])  # sq ft (feature)\ny = np.array([200000, 280000, 350000, 420000])  # price (label)\n\nmodel = LinearRegression()\nmodel.fit(X, y)               # learn from training data\nprint(model.predict([[1800]])) # predict new house: ~319,000\n\n# Classification â€” Logistic Regression (spam or not)\nfrom sklearn.linear_model import LogisticRegression\n# X = email features (word counts, caps ratio, etc.)\n# y = [1=spam, 0=not spam]\n\n# Unsupervised â€” K-Means (customer segmentation)\nfrom sklearn.cluster import KMeans\nkmeans = KMeans(n_clusters=3)  # find 3 customer groups\nkmeans.fit(X)                   # no labels needed!\n\n# Overfitting example\n# Training accuracy: 99%   â† memorized training data\n# Test accuracy:     65%   â† fails on new data\n# Fix: regularization, more data, simpler model\n\n# Underfitting example\n# Training accuracy: 60%   â† model too simple\n# Test accuracy:     58%\n# Fix: more complex model, more features"
},
    "Deep Learning Basics": {
      "explanation": "Deep Learning uses multi-layered neural networks to learn representations of data automatically. It powers almost all modern Generative AI â€” from image generation to language models.",
      "details": [
        "Neural network: layers of artificial neurons inspired by the brain",
        "Input layer: receives raw data (pixels, words, numbers)",
        "Hidden layers: learn increasingly abstract features",
        "Output layer: final prediction (class, score, token)",
        "Activation functions: add non-linearity (ReLU, Sigmoid, Tanh, Softmax)",
        "Backpropagation: computes gradients; weights updated via gradient descent",
        "Epoch: one full pass through the training dataset"
],
      "example": "# Neural network with PyTorch\nimport torch\nimport torch.nn as nn\n\nclass SimpleNN(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.layers = nn.Sequential(\n            nn.Linear(784, 256),   # input â†’ hidden (784 pixels)\n            nn.ReLU(),             # activation: max(0, x)\n            nn.Linear(256, 128),   # hidden â†’ hidden\n            nn.ReLU(),\n            nn.Linear(128, 10),    # hidden â†’ output (10 digits)\n            nn.Softmax(dim=1)      # probabilities: sum=1\n        )\n    def forward(self, x):\n        return self.layers(x)\n\nmodel = SimpleNN()\noptimizer = torch.optim.Adam(model.parameters(), lr=0.001)\ncriterion = nn.CrossEntropyLoss()\n\n# Training loop\nfor epoch in range(50):\n    predictions = model(X_train)       # forward pass\n    loss = criterion(predictions, y)   # measure error\n    optimizer.zero_grad()\n    loss.backward()      # backprop: compute gradients\n    optimizer.step()     # update weights: w -= lr * grad\n\n# Activation function choice:\n# ReLU:    f(x) = max(0, x)  â€” hidden layers (fast, standard)\n# Sigmoid: f(x) = 1/(1+eâ»Ë£) â€” binary output (0 to 1)\n# Softmax: multi-class output (sums to 1)\n# Tanh:    f(x) = (eË£-eâ»Ë£)/(eË£+eâ»Ë£)  â€” (-1 to 1)"
},
    "NLP Fundamentals": {
      "explanation": "Natural Language Processing (NLP) enables computers to understand and process human language. LLMs are built on NLP foundations â€” understanding these concepts is essential for working with language models.",
      "details": [
        "Tokenization: splitting text into tokens (words, subwords, or characters)",
        "Stop words: common words with little meaning (the, is, a, an) â€” often removed",
        "Stemming: reduce word to root form (running â†’ run, studies â†’ studi) â€” crude",
        "Lemmatization: reduce to proper root (running â†’ run, better â†’ good) â€” accurate",
        "POS tagging: label each word's grammatical role (noun, verb, adjective...)",
        "NER: Named Entity Recognition â€” identify names, places, dates in text",
        "Sentiment analysis: detect emotional tone (positive, negative, neutral)"
],
      "example": "import nltk\nfrom nltk.tokenize import word_tokenize\nfrom nltk.corpus import stopwords\nfrom nltk.stem import PorterStemmer, WordNetLemmatizer\n\ntext = \"The students are running quickly through the library\"\n\n# Tokenization\ntokens = word_tokenize(text)\n# [\"The\",\"students\",\"are\",\"running\",\"quickly\",\"through\",\"the\",\"library\"]\n\n# Remove stop words\nstop = set(stopwords.words('english'))\nfiltered = [t for t in tokens if t.lower() not in stop]\n# [\"students\",\"running\",\"quickly\",\"library\"]\n\n# Stemming (crude)\nps = PorterStemmer()\nstemmed = [ps.stem(w) for w in filtered]\n# [\"student\",\"run\",\"quickli\",\"librari\"]   â† \"quickli\" not a real word\n\n# Lemmatization (accurate)\nlem = WordNetLemmatizer()\nlemmatized = [lem.lemmatize(w, pos='v') for w in filtered]\n# [\"student\",\"run\",\"quickly\",\"library\"]  â† proper words\n\n# POS tagging\ntagged = nltk.pos_tag(tokens)\n# [(\"The\",\"DT\"),(\"students\",\"NNS\"),(\"are\",\"VBP\"),(\"running\",\"VBG\")]\n# DT=determiner, NNS=plural noun, VBP=verb, VBG=verb-ing\n\n# NER â€” spaCy\nimport spacy\nnlp = spacy.load(\"en_core_web_sm\")\ndoc = nlp(\"Apple Inc. was founded by Steve Jobs in Cupertino.\")\nfor ent in doc.ents:\n    print(ent.text, ent.label_)\n# Apple Inc.  â†’ ORG\n# Steve Jobs  â†’ PERSON\n# Cupertino   â†’ GPE (geopolitical entity)\n\n# Sentiment Analysis\nfrom transformers import pipeline\nsentiment = pipeline(\"sentiment-analysis\")\nsentiment(\"This movie was absolutely fantastic!\")\n# [{'label': 'POSITIVE', 'score': 0.9998}]"
},
    "Transformers": {
      "explanation": "The Transformer architecture (2017, 'Attention Is All You Need') is the foundation of all modern LLMs. Its self-attention mechanism allows parallel processing and captures long-range dependencies far better than RNNs.",
      "details": [
        "Encoder: reads input, creates contextual representations (used in BERT)",
        "Decoder: generates output token by token (used in GPT)",
        "Self-attention: each token attends to all other tokens simultaneously",
        "Multi-head attention: multiple heads capture different relationships",
        "Positional encoding: adds order information (transformers process all tokens at once)",
        "Why better than RNNs: parallel processing, no vanishing gradient, long-range deps",
        "Attention formula: Attention(Q,K,V) = softmax(QKáµ€ / âˆšd_k) Â· V"
],
      "example": "# Transformer architecture overview\n# Input: \"The cat sat on the mat\"\n\n# STEP 1: Tokenize + Embed\ntokens = [\"The\", \"cat\", \"sat\", \"on\", \"the\", \"mat\"]\nembeddings = embed(tokens)  # each token â†’ 512-dim vector\n\n# STEP 2: Add positional encoding\n# Inject position info (transformers process all tokens at once)\npe = positional_encoding(sequence_length=6, d_model=512)\nx = embeddings + pe\n\n# STEP 3: Self-attention\n# Each token asks: \"which other tokens are relevant to me?\"\n# Q (query): what am I looking for?\n# K (key):   what do I offer?\n# V (value): what info do I provide if matched?\nQ = x @ W_Q  # query projection\nK = x @ W_K  # key projection\nV = x @ W_V  # value projection\n\n# Attention score\nscores = (Q @ K.T) / math.sqrt(d_k)  # scaled dot product\nweights = softmax(scores)              # probabilities\noutput = weights @ V                   # weighted sum of values\n\n# For \"sat\": high attention to \"cat\" (subject) and \"mat\" (object)\n\n# STEP 4: Multi-head attention (8 heads typical)\n# Head 1 might focus on syntax\n# Head 2 might focus on coreference\n# Head 3 might focus on semantic relations\n# Results concatenated + projected\n\n# WHY TRANSFORMERS WIN over RNNs:\n# RNN:         processes tokens one-by-one (slow, sequential)\n# Transformer: processes ALL tokens in PARALLEL (fast)\n# RNN:         struggles with long sequences (gradient vanishes)\n# Transformer: attention spans entire sequence (no distance limit)\n\n# Encoder-only:   BERT â†’ understanding tasks (classification)\n# Decoder-only:   GPT, Claude â†’ generation tasks\n# Encoder-Decoder: T5, BART â†’ translation, summarization"
},
    "Large Language Models": {
      "explanation": "Large Language Models (LLMs) are transformer-based models trained on massive text datasets to predict the next token. Through this simple objective on enough data, they develop emergent abilities like reasoning, coding, and instruction following.",
      "details": [
        "Core task: next-token prediction â€” trained on trillions of tokens",
        "Parameters: adjustable weights (GPT-3: 175B, GPT-4: ~1T estimated)",
        "Pretraining: unsupervised learning on internet-scale text",
        "Fine-tuning: adapt pretrained model to specific task with labeled data",
        "RLHF: Reinforcement Learning from Human Feedback â€” aligns model with human preferences",
        "Context window: max tokens model can process at once (4K â†’ 1M+ tokens)",
        "Hallucination: confident generation of false information"
],
      "example": "# How LLMs work â€” next token prediction\n# Training objective: given context, predict next word\n# \"The Eiffel Tower is located in ___\" â†’ \"Paris\"\n# \"def factorial(n): if n == 0: return ___\" â†’ \"1\"\n\n# Tokenization (GPT-4 uses tiktoken â€” BPE encoding)\nimport tiktoken\nenc = tiktoken.encoding_for_model(\"gpt-4\")\ntokens = enc.encode(\"Hello world!\")\n# [9906, 1917, 0]  â† integer token IDs\n# Token â‰  word: \"unhappy\" â†’ [\"un\", \"happy\"] (2 tokens)\n# Rule of thumb: 1 token â‰ˆ 0.75 words (English)\n\n# Key parameters when calling an LLM API\nimport anthropic\nclient = anthropic.Anthropic()\n\nresponse = client.messages.create(\n    model=\"claude-opus-4-6\",\n    max_tokens=1000,          # max output length\n    temperature=0.7,          # 0=deterministic, 1=creative\n    messages=[\n        {\"role\": \"user\", \"content\": \"Explain backpropagation\"}\n    ]\n)\n\n# Temperature effect:\n# temperature=0.0 â†’ always picks most probable token (consistent)\n# temperature=0.7 â†’ moderate creativity (good default)\n# temperature=1.0 â†’ very creative, sometimes incoherent\n\n# Model size vs capability\n# GPT-2:  1.5B params  â†’ basic text, often incoherent\n# GPT-3:  175B params  â†’ few-shot capable, good general tasks\n# GPT-4:  ~1T params   â†’ reasoning, complex tasks, multimodal\n\n# RLHF pipeline:\n# 1. Pretrain on internet text (predict next token)\n# 2. Fine-tune on demonstration data (supervised)\n# 3. Train reward model from human preference rankings\n# 4. Optimize LLM against reward model via PPO"
},
    "Prompt Engineering": {
      "explanation": "Prompt engineering is the practice of crafting effective inputs to get high-quality, reliable outputs from LLMs. It is a critical skill because the same model can give vastly different results depending on how you phrase the request.",
      "details": [
        "Zero-shot: direct question with no examples â€” relies on model's pretrained knowledge",
        "One-shot: one example before the actual request",
        "Few-shot: 2â€“5 examples to demonstrate the desired pattern",
        "Chain-of-thought: ask model to 'think step by step' â€” dramatically improves reasoning",
        "Role prompting: assign a persona ('You are an expert Python developer...')",
        "System prompt: persistent instructions shaping all responses in a session",
        "Structured output: ask for JSON, XML, or specific formats for downstream use"
],
      "example": "// ZERO-SHOT\n\"Classify the sentiment of: 'This product is terrible!'\"\n// Output: Negative\n\n// ONE-SHOT\n\"Classify sentiment:\n'I love this!' â†’ Positive\n'The battery died after 2 hours.' â†’ \"\n// Output: Negative\n\n// FEW-SHOT\n\"Translate English to SQL:\n'Find all users' â†’ SELECT * FROM users;\n'Count products' â†’ SELECT COUNT(*) FROM products;\n'List orders from 2024' â†’ \"\n// Output: SELECT * FROM orders WHERE YEAR(created_at)=2024;\n\n// CHAIN-OF-THOUGHT\n\"A store had 45 apples. They sold 30% on Monday and 12 on Tuesday.\nHow many remain? Think step by step.\"\n// Step 1: 30% of 45 = 13.5 â†’ sold ~14 on Monday\n// Step 2: Remaining: 45 - 14 = 31\n// Step 3: After Tuesday: 31 - 12 = 19 apples\n\n// ROLE PROMPTING\n\"You are a senior security engineer conducting a code review.\nIdentify SQL injection vulnerabilities and suggest parameterized fixes.\"\n\n// STRUCTURED OUTPUT\n\"Analyze this code and return ONLY valid JSON:\n{\n  'issues': [...],\n  'severity': 'low|medium|high',\n  'fixed_code': '...'\n}\"\n\n// BAD vs GOOD prompt\nBad:  \"Write code\"\nGood: \"Write a Python function that takes a list of integers,\n       removes duplicates, sorts in descending order, and returns\n       the result. Include type hints and a docstring.\"\n\n// Prompt template (LangChain style)\nfrom langchain.prompts import ChatPromptTemplate\nprompt = ChatPromptTemplate.from_template(\n    \"You are a {role}. Explain {concept} to a {audience}.\"\n)\nformatted = prompt.format_messages(\n    role=\"teacher\", concept=\"recursion\", audience=\"10-year-old\"\n)"
},
    "Generative Models": {
      "explanation": "Generative models are the architectural families that power content generation. Three main types dominate: GANs (adversarial), VAEs (variational), and Diffusion Models (noise-based). Each has different strengths.",
      "details": [
        "GAN: Generator + Discriminator compete â€” G creates fakes, D distinguishes real/fake",
        "VAE: encodes data into latent space distribution, decodes to generate new samples",
        "Diffusion: gradually adds noise to data, then learns to reverse the process",
        "Diffusion models power: Stable Diffusion, DALLÂ·E 3, Midjourney, Sora",
        "GANs power: deepfakes, face generation, image-to-image translation",
        "VAEs used for: representation learning, anomaly detection, compression"
],
      "example": "# â”€â”€ GANs (Generative Adversarial Networks) â”€â”€\nimport torch\nimport torch.nn as nn\n\nclass Generator(nn.Module):\n    def __init__(self, z_dim=100):\n        super().__init__()\n        self.net = nn.Sequential(\n            nn.Linear(z_dim, 256),\n            nn.ReLU(),\n            nn.Linear(256, 784),   # 28Ã—28 = 784 pixels\n            nn.Tanh()              # output in [-1, 1]\n        )\n    def forward(self, z):\n        return self.net(z)         # noise â†’ fake image\n\nclass Discriminator(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.net = nn.Sequential(\n            nn.Linear(784, 256),\n            nn.LeakyReLU(0.2),\n            nn.Linear(256, 1),\n            nn.Sigmoid()           # 0=fake, 1=real\n        )\n    def forward(self, x):\n        return self.net(x)\n\n# Training: adversarial game\n# D tries to maximize: log D(real) + log(1 - D(G(z)))\n# G tries to minimize: log(1 - D(G(z)))  â† fool D\n# Nash equilibrium: G generates perfect fakes\n\n# â”€â”€ VAE (Variational Autoencoder) â”€â”€\nclass VAE(nn.Module):\n    def encode(self, x):\n        h = self.encoder(x)\n        mu = self.fc_mu(h)       # mean of latent distribution\n        logvar = self.fc_var(h)  # variance\n        return mu, logvar\n\n    def reparameterize(self, mu, logvar):\n        std = torch.exp(0.5 * logvar)\n        eps = torch.randn_like(std)\n        return mu + eps * std    # sample from N(mu, std)\n\n    def decode(self, z):\n        return self.decoder(z)   # latent â†’ reconstructed image\n\n# â”€â”€ Diffusion Model (conceptual) â”€â”€\n# Forward process: add Gaussian noise step by step\n# xâ‚€ (clean) â†’ xâ‚ (slight noise) â†’ ... â†’ xT (pure noise)\n\n# Reverse process (what the model learns):\n# xT (pure noise) â†’ ... â†’ xâ‚ â†’ xâ‚€ (clean image)\n\n# UNet predicts the noise Îµ added at each step\n# Loss: ||Îµ - Îµ_Î¸(xâ‚œ, t)||Â²\n\n# Text-to-image with diffusion:\nfrom diffusers import StableDiffusionPipeline\npipe = StableDiffusionPipeline.from_pretrained(\"stabilityai/sdxl-turbo\")\nimage = pipe(\"A futuristic city at sunset, cyberpunk style\").images[0]"
},
    "Training Concepts": {
      "explanation": "Understanding how AI models are trained is essential for working with them effectively. The training pipeline â€” from raw data to an aligned, capable model â€” involves several distinct stages.",
      "details": [
        "Dataset: curated collection of (input, output) pairs or raw text",
        "Pretraining: train from scratch on massive unlabeled data (billions of tokens)",
        "Fine-tuning: continue training pretrained model on smaller, task-specific dataset",
        "Transfer learning: use knowledge from one domain to bootstrap another",
        "RLHF: human raters rank outputs â†’ reward model â†’ optimize LLM via PPO",
        "DPO (Direct Preference Optimization): newer alternative to RLHF, more stable",
        "SFT (Supervised Fine-Tuning): first RLHF step â€” train on human demonstrations"
],
      "example": "# Full LLM training pipeline\n\n# STAGE 1: Pretraining (self-supervised)\n# Dataset: Common Crawl, Books, Wikipedia, GitHub, etc.\n# Objective: predict next token\n# Duration: weeks to months on thousands of GPUs\n# Result: base model (knows language but not how to chat)\n\n# Example: GPT-3 pretrained on 570GB of text\n# 300 billion tokens, 175B parameters\n\n# STAGE 2: Supervised Fine-Tuning (SFT)\n# Dataset: human-written (prompt, response) pairs\nsft_data = [\n    {\"prompt\": \"Explain gravity in simple terms\",\n     \"response\": \"Gravity is the force that pulls...\"},\n    {\"prompt\": \"Write Python code to reverse a string\",\n     \"response\": \"def reverse(s):\n    return s[::-1]\"},\n]\n# Result: instruction-following model\n\n# STAGE 3: RLHF\n# Step A: collect preference data\nprefs = [\n    {\"prompt\": \"...\", \"chosen\": \"Great response\", \"rejected\": \"Bad response\"}\n]\n# Step B: train reward model (predicts which response is better)\n# Step C: optimize LLM using PPO (Proximal Policy Optimization)\n#   reward = reward_model(response) - KL_penalty(vs_original_model)\n\n# Transfer Learning â€” fine-tune BERT for classification\nfrom transformers import BertForSequenceClassification, Trainer\nmodel = BertForSequenceClassification.from_pretrained(\n    \"bert-base-uncased\",  # pretrained on Wikipedia+Books\n    num_labels=2          # adapt output for binary classification\n)\ntrainer = Trainer(model=model, train_dataset=your_data)\ntrainer.train()\n\n# Parameter-Efficient Fine-Tuning (LoRA)\n# Instead of updating all 7B params, update only ~1M adapter params\n# 100x cheaper, same quality!"
},
    "Embeddings & Vector DBs": {
      "explanation": "Embeddings convert text (or images, audio) into dense numerical vectors where semantic similarity maps to geometric proximity. Vector databases efficiently store and search these embeddings, enabling semantic search at scale.",
      "details": [
        "Word embedding: each word â†’ fixed-size float vector (e.g., 1536 dimensions)",
        "Semantic similarity: similar meaning â†’ small cosine distance in vector space",
        "Classic: king - man + woman â‰ˆ queen (vector arithmetic works!)",
        "Sentence embeddings: entire sentences as vectors (OpenAI ada-002, Sentence-BERT)",
        "Vector search: find k-nearest neighbors by cosine/dot-product similarity (ANN)",
        "Popular vector DBs: Pinecone (managed), FAISS (local), ChromaDB (open-source)",
        "Use in RAG: embed docs, embed query, find closest docs, feed to LLM"
],
      "example": "# Create embeddings with OpenAI\nfrom openai import OpenAI\nimport numpy as np\n\nclient = OpenAI()\n\ndef embed(text):\n    response = client.embeddings.create(\n        model=\"text-embedding-3-small\",  # 1536 dimensions\n        input=text\n    )\n    return np.array(response.data[0].embedding)\n\n# Semantic similarity\nv1 = embed(\"The dog runs in the park\")\nv2 = embed(\"A puppy is jogging outside\")\nv3 = embed(\"Python list comprehension syntax\")\n\ndef cosine_sim(a, b):\n    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))\n\nprint(cosine_sim(v1, v2))  # ~0.92 (very similar)\nprint(cosine_sim(v1, v3))  # ~0.21 (unrelated)\n\n# Vector DB with ChromaDB (local)\nimport chromadb\n\nclient = chromadb.Client()\ncollection = client.create_collection(\"my_docs\")\n\ncollection.add(\n    documents=[\"AI is transforming healthcare\",\n               \"Python is a popular language\",\n               \"Neural networks learn from data\"],\n    ids=[\"doc1\", \"doc2\", \"doc3\"]\n)\n\n# Semantic search â€” finds by MEANING, not keywords!\nresults = collection.query(\n    query_texts=[\"machine learning\"],\n    n_results=2\n)\n# Returns: [\"Neural networks learn from data\",\n#           \"AI is transforming healthcare\"]\n\n# Pinecone (managed, production-scale)\nimport pinecone\npinecone.init(api_key=\"YOUR_KEY\", environment=\"us-east1\")\nindex = pinecone.Index(\"my-index\")\nindex.upsert([(\"id1\", embedding_vector, {\"source\": \"doc1\"})])\nresults = index.query(vector=query_embedding, top_k=5)"
},
    "RAG": {
      "explanation": "Retrieval-Augmented Generation (RAG) grounds LLM responses in retrieved documents, dramatically reducing hallucinations and enabling use of private or up-to-date knowledge without expensive retraining.",
      "details": [
        "Problem: LLMs have knowledge cutoffs and hallucinate confidently",
        "Solution: retrieve relevant docs at query time â†’ inject into context â†’ LLM answers from facts",
        "Indexing phase: chunk docs â†’ embed â†’ store in vector DB (done once)",
        "Query phase: embed query â†’ find similar chunks â†’ build prompt â†’ LLM generates",
        "Chunk size: 200â€“500 tokens typical; too small = missing context, too large = dilutes relevance",
        "Advantages: accurate, private, updatable, explainable (can cite sources)",
        "Advanced: re-ranking, multi-hop retrieval, HyDE (hypothetical document embeddings)"
],
      "example": "# Full RAG pipeline with LangChain\nfrom langchain.document_loaders import PyPDFLoader\nfrom langchain.text_splitter import RecursiveCharacterTextSplitter\nfrom langchain.embeddings import OpenAIEmbeddings\nfrom langchain.vectorstores import Chroma\nfrom langchain.chat_models import ChatOpenAI\nfrom langchain.chains import RetrievalQA\n\n# â”€â”€ INDEXING (done once) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nloader = PyPDFLoader(\"company_policy.pdf\")\ndocuments = loader.load()\n\nsplitter = RecursiveCharacterTextSplitter(\n    chunk_size=500,\n    chunk_overlap=50  # avoid losing info at chunk boundaries\n)\nchunks = splitter.split_documents(documents)\n\nembeddings = OpenAIEmbeddings()\nvectorstore = Chroma.from_documents(chunks, embeddings)\n\n# â”€â”€ QUERYING (every user request) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nquery = \"What is our parental leave policy?\"\n\nrelevant_chunks = vectorstore.similarity_search(query, k=3)\n\ncontext = \"\\n\\n\".join([c.page_content for c in relevant_chunks])\naugmented_prompt = f\"\"\"\nYou are a helpful HR assistant. Answer based ONLY on the\nprovided context. If not in context, say \"I don't know.\"\n\nContext:\n{context}\n\nQuestion: {query}\n\"\"\"\n\nllm = ChatOpenAI(model=\"gpt-4\")\nanswer = llm.invoke(augmented_prompt)\n\n# â”€â”€ One-liner with RetrievalQA chain â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nqa_chain = RetrievalQA.from_chain_type(\n    llm=ChatOpenAI(),\n    retriever=vectorstore.as_retriever(search_kwargs={\"k\": 3})\n)\nresult = qa_chain.run(\"What is the refund policy?\")"
},
    "AI Agents": {
      "explanation": "AI Agents are LLM-powered systems that autonomously plan, reason, use tools, and take multi-step actions to accomplish goals â€” going beyond single-turn question answering.",
      "details": [
        "Core loop: Observe â†’ Think/Plan â†’ Act â†’ Observe results â†’ Repeat",
        "Tools: web search, code execution, file access, APIs, database queries",
        "ReAct pattern: Reason + Act interleaved â€” model explains before acting",
        "Multi-agent: specialized agents collaborate (planner, coder, critic, researcher)",
        "Memory: short-term (context window) + long-term (vector DB) + episodic",
        "Examples: coding agents (Devin, Claude Code), research agents, computer-use agents"
],
      "example": "# AI Agent with LangChain (ReAct pattern)\nfrom langchain.agents import create_react_agent, AgentExecutor\nfrom langchain.tools import DuckDuckGoSearchRun, WikipediaQueryRun\nfrom langchain.tools import PythonREPLTool\nfrom langchain.chat_models import ChatOpenAI\n\ntools = [\n    DuckDuckGoSearchRun(),   # web search\n    WikipediaQueryRun(),     # Wikipedia\n    PythonREPLTool()         # run Python code\n]\n\nllm = ChatOpenAI(model=\"gpt-4\", temperature=0)\nagent = create_react_agent(llm, tools, prompt=REACT_PROMPT)\nexecutor = AgentExecutor(agent=agent, tools=tools, verbose=True)\n\nresult = executor.invoke({\n    \"input\": \"What is the population of Tokyo and how does it compare \"\n             \"to New York? Calculate the ratio.\"\n})\n\n# Agent's internal monologue (ReAct):\n# Thought: I need to find Tokyo's population first\n# Action: search(\"Tokyo population 2024\")\n# Observation: \"Tokyo population is approximately 14 million...\"\n# Thought: Now I need New York's population\n# Action: search(\"New York City population 2024\")\n# Observation: \"New York City population is approximately 8.3 million...\"\n# Thought: Now I can calculate the ratio\n# Action: python_repl(\"14000000 / 8300000\")\n# Observation: 1.6867...\n# Final Answer: Tokyo (14M) is ~1.69x larger than New York (8.3M)\n\n# Multi-Agent system (AutoGen style)\nfrom autogen import AssistantAgent, UserProxyAgent\n\nplanner = AssistantAgent(\"Planner\", system_message=\"Break tasks into steps\")\ncoder   = AssistantAgent(\"Coder\",   system_message=\"Write and debug code\")\ncritic  = AssistantAgent(\"Critic\",  system_message=\"Review and improve output\")\n# Agents collaborate asynchronously to complete complex tasks"
},
    "Hallucinations": {
      "explanation": "LLM hallucinations occur when models generate confident but factually incorrect content. Understanding why they happen and how to mitigate them is critical for production AI systems.",
      "details": [
        "Factual hallucination: wrong facts stated with confidence ('Einstein said...')",
        "Source hallucination: fabricated citations to non-existent papers/books",
        "Causes: pattern completion over memorized facts, gaps in training data",
        "High temperature â†’ more creative but more hallucination-prone",
        "Mitigation: RAG, grounding, citation requirements, self-consistency checks",
        "Constitutional AI: model trained to critique and revise its own outputs",
        "Detection: fact-checking pipelines, search verification, retrieval comparison"
],
      "example": "# EXAMPLES OF HALLUCINATIONS (illustrating the problem)\n\n# Factual hallucination\nuser: \"When did Einstein publish his theory of quantum computing?\"\nllm:  \"Einstein published his groundbreaking paper on quantum\n       computing in 1932, titled 'Uber die Quantenmechanische\n       Berechnung'.\"\n# WRONG: Einstein never worked on quantum computing.\n# The paper title and date are completely fabricated.\n\n# Source hallucination\nuser: \"Give me sources on transformer architecture\"\nllm:  \"See Vaswani et al. (2017) âœ“ ... and also Smith & Jones\n       (2019) 'Advanced Transformer Variants' in IEEE Trans...\"\n# 'Smith & Jones 2019' may be completely fabricated!\n\n# â”€â”€ MITIGATION STRATEGIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n\n# 1. RAG (most effective) â€” ground answers in retrieved facts\ncontext = retrieve_relevant_docs(query)\nprompt = f\"Answer ONLY using this context:\\n{context}\\n\\nQuestion: {query}\"\n\n# 2. Force citation\nprompt = \"\"\"Answer the question. For every claim, cite:\n[Source: document_name, section X]\nIf you cannot cite it, say 'I don't have a source for this.'\"\"\"\n\n# 3. Temperature = 0 (more deterministic)\nresponse = client.chat.completions.create(\n    model=\"gpt-4\", temperature=0.0)\n\n# 4. Self-consistency (sample multiple, vote)\nresponses = [llm(prompt) for _ in range(5)]\n# Check if answers agree; flag disagreements\n\n# 5. Post-generation verification pipeline\nanswer = llm(question)\nclaims = extract_claims(answer)\nfor claim in claims:\n    evidence = web_search(claim)\n    if not verify(claim, evidence):\n        answer = revise(answer, claim)"
},
    "Evaluation Metrics": {
      "explanation": "Evaluating AI models requires different metrics depending on the task. Classification metrics measure prediction accuracy; generation metrics measure output quality for text generation tasks.",
      "details": [
        "Accuracy: fraction of correct predictions â€” misleading on imbalanced datasets",
        "Precision: of all predicted positives, how many are truly positive",
        "Recall: of all actual positives, how many did we catch",
        "F1-score: harmonic mean of precision and recall â€” balanced metric",
        "BLEU: n-gram overlap between generated and reference text (translation quality)",
        "Perplexity: how well a language model predicts a text â€” lower = better",
        "ROUGE: recall-based n-gram overlap used for summarization quality"
],
      "example": "from sklearn.metrics import (accuracy_score, precision_score,\n                              recall_score, f1_score)\n\ny_true = [1, 0, 1, 1, 0, 1, 0]\ny_pred = [1, 0, 1, 0, 0, 1, 1]\n\nacc  = accuracy_score(y_true, y_pred)   # 5/7 = 0.714\nprec = precision_score(y_true, y_pred)  # TP/(TP+FP) = 3/4 = 0.75\nrec  = recall_score(y_true, y_pred)     # TP/(TP+FN) = 3/4 = 0.75\nf1   = f1_score(y_true, y_pred)         # 2*P*R/(P+R) = 0.75\n\n# Confusion matrix\n#                Predicted\n#              Pos    Neg\n# Actual Pos  [TP=3] [FN=1]   â† recall  = TP/(TP+FN)\n#        Neg  [FP=1] [TN=2]   â† precision = TP/(TP+FP)\n\n# BLEU score (translation quality)\nfrom nltk.translate.bleu_score import sentence_bleu\nreference  = [[\"the\", \"cat\", \"is\", \"on\", \"the\", \"mat\"]]\nhypothesis =  [\"the\", \"cat\", \"sat\", \"on\", \"the\", \"mat\"]\nbleu = sentence_bleu(reference, hypothesis)\n# ~0.83 (good overlap; only \"is\"â†’\"sat\" differs)\n\n# Perplexity â€” lower is better\n# PP(W) = P(wâ‚,wâ‚‚,...,wâ‚™)^(-1/N)\n# Equivalent to: exp(cross-entropy loss)\nimport torch, torch.nn.functional as F\n\ndef perplexity(logits, targets):\n    loss = F.cross_entropy(logits, targets)\n    return torch.exp(loss).item()\n\n# GPT-2 perplexity on Penn Treebank: ~29\n# GPT-4 perplexity: ~3â€“10 on common text\n\n# ROUGE (summarization)\nfrom rouge_score import rouge_scorer\nscorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'])\nscores = scorer.score(\"reference summary\", \"generated summary\")\n# rouge1: unigram overlap\n# rouge2: bigram overlap\n# rougeL: longest common subsequence"
},
    "Model Comparison": {
      "explanation": "Different neural architectures are suited to different data types and tasks. Understanding when to use CNN, RNN, LSTM, or Transformer is fundamental for AI engineering.",
      "details": [
        "CNN: spatial pattern recognition â€” images, not sequential by nature",
        "RNN: sequential data â€” processes token by token, maintains hidden state",
        "LSTM: Long Short-Term Memory â€” solves RNN's vanishing gradient via gating",
        "Transformer: parallel attention over full sequence â€” now dominant for most tasks",
        "CNN + Transformer hybrid: Vision Transformers (ViT) for image understanding",
        "LSTM still used in: time-series forecasting, edge devices (lower compute)",
        "Transformers replaced RNNs/LSTMs for NLP tasks from ~2018 onward"
],
      "example": "# CNN â€” for image classification\nimport torch.nn as nn\n\nclass CNN(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.conv1 = nn.Conv2d(3, 32, kernel_size=3)   # detect edges\n        self.conv2 = nn.Conv2d(32, 64, kernel_size=3)  # detect shapes\n        self.pool  = nn.MaxPool2d(2, 2)                # downsample\n        self.fc    = nn.Linear(64*6*6, 10)             # classify\n\n# RNN â€” basic sequence model\nclass RNN(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.rnn = nn.RNN(input_size=50, hidden_size=100, batch_first=True)\n    # Problem: can't remember long sequences (gradient vanishes)\n    # h_t = tanh(W_h * h_{t-1} + W_x * x_t)\n\n# LSTM â€” solves vanishing gradient with gates\nclass LSTM(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.lstm = nn.LSTM(input_size=50, hidden_size=100, batch_first=True)\n    # Forget gate:  what to forget from previous state\n    # Input gate:   what new info to add\n    # Output gate:  what to output\n    # Cell state:   long-term memory highway\n\n# Transformer â€” parallel attention (dominant today)\nfrom transformers import AutoModel\nmodel = AutoModel.from_pretrained(\"bert-base-uncased\")\n\n# â”€â”€ COMPARISON TABLE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# Model       | Best For           | Parallel | Long-range\n# CNN         | Images, 1D signals | Yes      | Limited\n# RNN         | Short sequences    | No       | Poor\n# LSTM        | Medium sequences   | No       | Good\n# Transformer | Any sequence/text  | Yes      | Excellent\n#\n# When to use (2024 guide):\n# Images:           CNN for efficiency, ViT for best quality\n# Time-series:      LSTM or Transformer\n# NLP (all tasks):  Transformer\n# Resource-limited: CNN or small LSTM\n# State-of-the-art: Transformer variants"
}
}
},
  "Operating Systems": {
  "icon": "ti-cpu",
  "color": "#185FA5",
  "topics": {
    "Process": {
      "explanation": "A process is an instance of a program in execution. It includes the program code, current activity (program counter), stack, data section, and heap. Each process has its own memory space and is independent from other processes.",
      "details": [
        "States: New â†’ Ready â†’ Running â†’ Waiting â†’ Terminated",
        "PCB (Process Control Block): stores PID, state, program counter, CPU registers, memory limits, open files",
        "Types: Foreground (interactive) and Background (daemon) processes"
],
      "example": "// Process states in pseudocode\nProcess P = create(\"program.exe\");\nP.state = NEW;         // process being created\nP.state = READY;       // waiting in ready queue\nP.state = RUNNING;     // being executed by CPU\nP.state = WAITING;     // waiting for I/O or event\nP.state = TERMINATED;  // execution completed\n\n// Fork in C (UNIX)\n#include <unistd.h>\npid_t pid = fork();\nif (pid == 0) {\n    // Child process\n    printf(\"Child PID: %d\\n\", getpid());\n} else {\n    // Parent process\n    printf(\"Parent PID: %d, Child PID: %d\\n\", getpid(), pid);\n}"
},
    "Thread": {
      "explanation": "A thread is the smallest unit of CPU execution within a process. Multiple threads share the same process memory (code, data, heap) but each has its own stack, registers, and program counter. Threads are lighter than processes.",
      "details": [
        "User-level threads: managed by user libraries (faster context switch)",
        "Kernel-level threads: managed by OS kernel (true parallelism)",
        "Benefits: faster creation, shared memory, efficient communication"
],
      "example": "// Java Thread example\nclass MyThread extends Thread {\n    public void run() {\n        System.out.println(\"Thread running: \" + getName());\n    }\n}\nMyThread t1 = new MyThread();\nt1.start();  // creates new thread, calls run()\n\n// Runnable interface (preferred)\nRunnable r = () -> System.out.println(\"Lambda thread\");\nThread t2 = new Thread(r);\nt2.start();\n\n// Python threading\nimport threading\ndef task():\n    print(\"Thread:\", threading.current_thread().name)\n\nt = threading.Thread(target=task)\nt.start()\nt.join()  // wait for thread to finish"
},
    "Process Scheduling": {
      "explanation": "Process scheduling is the activity of the process manager that handles the removal of running process from CPU and selection of another process on basis of a strategy.",
      "details": [
        "Long-term scheduler: decides which processes enter ready queue from disk",
        "Short-term scheduler (CPU scheduler): selects from ready queue â†’ runs on CPU",
        "Medium-term scheduler: swapping processes in/out of memory",
        "Scheduling criteria: CPU utilization, throughput, turnaround time, waiting time, response time"
],
      "example": "// Key scheduling metrics\nArrival Time (AT):  when process enters ready queue\nBurst Time (BT):    CPU time required to complete\nCompletion Time (CT): when process finishes\nTurnaround Time (TAT) = CT - AT\nWaiting Time (WT)    = TAT - BT\n\n// Example\nProcess  AT  BT  CT  TAT  WT\nP1       0   4   4   4    0\nP2       1   3   7   6    3\nP3       2   1   5   3    2\nAverage TAT = (4+6+3)/3 = 4.33\nAverage WT  = (0+3+2)/3 = 1.67"
},
    "CPU Scheduling Algorithms": {
      "explanation": "CPU scheduling algorithms determine the order in which processes in the ready queue get CPU time. Different algorithms optimize for different goals.",
      "details": [
        "FCFS (First Come First Served): non-preemptive, simple, convoy effect",
        "SJF (Shortest Job First): optimal avg wait time, starvation possible",
        "SRTF (Shortest Remaining Time First): preemptive SJF",
        "Round Robin: preemptive, uses time quantum, good for time-sharing",
        "Priority Scheduling: CPU goes to highest priority; aging prevents starvation",
        "Multilevel Queue: multiple queues with different priorities"
],
      "example": "// Round Robin example (Quantum = 2)\nProcesses: P1(BT=4), P2(BT=3), P3(BT=1)\n\nGantt Chart:\n| P1 | P2 | P3 | P1 | P2 |\n0    2    4    5    7    8\n\nP1: CT=7, TAT=7, WT=3\nP2: CT=8, TAT=8, WT=5\nP3: CT=5, TAT=5, WT=4\n\n// FCFS example\nProcesses: P1(AT=0,BT=5), P2(AT=1,BT=3), P3(AT=2,BT=1)\nGantt: | P1 | P2 | P3 |\n        0    5    8    9\n// SJF would order: P3 â†’ P2 â†’ P1 (shorter jobs first)"
},
    "Deadlock": {
      "explanation": "A deadlock is a situation where a set of processes are blocked, each waiting for a resource held by another process in the set. No progress is possible.",
      "details": [
        "Four necessary conditions (Coffman): Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait",
        "Prevention: eliminate one of the four conditions",
        "Avoidance: Banker's Algorithm â€” safe state analysis",
        "Detection: Resource Allocation Graph (RAG); cycle = deadlock",
        "Recovery: process termination or resource preemption"
],
      "example": "// Deadlock scenario\nThread T1:          Thread T2:\nlock(A);            lock(B);\nlock(B); // waits   lock(A); // waits\n// DEADLOCK!\n\n// Banker's Algorithm (Safe State Check)\nAvailable: [3, 3, 2]     (A, B, C resources)\nAllocation:   Need:\nP0: [0,1,0]   [7,4,3]\nP1: [2,0,0]   [1,2,2]\nP2: [3,0,2]   [6,0,0]\nP3: [2,1,1]   [0,1,1]\nP4: [0,0,2]   [4,3,1]\n\nSafe sequence: P1 â†’ P3 â†’ P4 â†’ P2 â†’ P0"
},
    "Synchronization": {
      "explanation": "Process synchronization ensures that multiple processes/threads access shared resources in a controlled manner to avoid race conditions and ensure data consistency.",
      "details": [
        "Race condition: outcome depends on execution order",
        "Critical section: code segment accessing shared resource",
        "Requirements: Mutual exclusion, Progress, Bounded waiting",
        "Mechanisms: Mutex, Semaphore, Monitor, Spinlock"
],
      "example": "// Race condition example\nint counter = 0;\n// Thread 1: counter++\n// Thread 2: counter++\n// Expected: 2, Actual: may be 1 (race!)\n\n// Machine level:\n// T1: READ counter (gets 0)\n// T2: READ counter (gets 0)\n// T1: counter = 0+1 = 1, WRITE\n// T2: counter = 0+1 = 1, WRITE\n// Final: 1 (WRONG! should be 2)\n\n// Solution: synchronize access to counter"
},
    "Semaphores": {
      "explanation": "A semaphore is a synchronization tool â€” an integer variable accessed only through two atomic operations: wait (P/down) and signal (V/up). Used to control access to shared resources.",
      "details": [
        "Binary semaphore (mutex): values 0 or 1 â€” mutual exclusion",
        "Counting semaphore: any non-negative integer â€” resource counting",
        "wait(S): if S>0, S--; else block process",
        "signal(S): S++; if processes blocked, wake one"
],
      "example": "// POSIX Semaphore in C\n#include <semaphore.h>\nsem_t sem;\nsem_init(&sem, 0, 1);  // init to 1 (binary)\n\nsem_wait(&sem);    // P operation: S--\n// --- critical section ---\ncounter++;\n// --- end critical section ---\nsem_post(&sem);    // V operation: S++\n\n// Producer-Consumer\nsem_t full, empty, mutex;\nsem_init(&full,  0, 0);   // items in buffer\nsem_init(&empty, 0, N);   // empty slots\nsem_init(&mutex, 0, 1);   // mutual exclusion\n\n// Producer:\nsem_wait(&empty); sem_wait(&mutex);\n// add item\nsem_post(&mutex); sem_post(&full);\n\n// Consumer:\nsem_wait(&full);  sem_wait(&mutex);\n// remove item\nsem_post(&mutex); sem_post(&empty);"
},
    "Mutex": {
      "explanation": "A Mutex (Mutual Exclusion lock) is a locking mechanism ensuring only one thread can access a resource at a time. Unlike a semaphore, only the thread that locked a mutex can unlock it.",
      "details": [
        "Binary state: locked or unlocked",
        "Ownership: only the locking thread can unlock",
        "Prevents race conditions in critical sections",
        "Deadlock risk if not used carefully"
],
      "example": "// C++ std::mutex\n#include <mutex>\nstd::mutex mtx;\nint shared_data = 0;\n\nvoid increment() {\n    mtx.lock();         // acquire lock\n    shared_data++;      // critical section\n    mtx.unlock();       // release lock\n}\n\n// Better: std::lock_guard (RAII - auto unlock)\nvoid safe_increment() {\n    std::lock_guard<std::mutex> guard(mtx);\n    shared_data++;\n}   // guard destroyed here â†’ auto unlock\n\n// Python\nimport threading\nlock = threading.Lock()\ncounter = 0\n\ndef increment():\n    global counter\n    with lock:          # acquire and auto-release\n        counter += 1"
},
    "Paging": {
      "explanation": "Paging is a memory management scheme that eliminates the need for contiguous memory allocation. Physical memory is divided into fixed-size frames; logical memory into pages of the same size.",
      "details": [
        "Page size = Frame size (typically 4KB)",
        "Internal fragmentation possible (last page may not be full)",
        "No external fragmentation",
        "Page table stored in memory; TLB (cache) speeds up translation"
],
      "example": "// Address translation\npage_number = logical_addr / page_size\noffset      = logical_addr % page_size\n\nExample:\nPage size = 4KB = 4096 bytes\nLogical address = 5000\n\nPage number = 5000 / 4096 = 1\nOffset      = 5000 % 4096 = 904\n\nPage table: page 1 â†’ frame 3\nPhysical = frame * page_size + offset\n         = 3 * 4096 + 904 = 13192\n\n// TLB (Translation Lookaside Buffer)\n// Fast associative cache for page table entries\n// TLB hit: direct physical address\n// TLB miss: go to page table in memory"
},
    "Virtual Memory": {
      "explanation": "Virtual memory creates an illusion of a larger memory by using disk storage. Enables execution of processes not completely in memory, allowing multiprogramming and efficient memory use.",
      "details": [
        "Virtual address space can be larger than physical RAM",
        "Pages loaded on demand (demand paging)",
        "Page fault: accessing a page not in memory",
        "Working set: set of pages a process actively uses"
],
      "example": "// When program accesses virtual address:\n1. Check TLB â†’ if hit, use physical address\n2. If miss â†’ check page table\n3. If page in memory â†’ translate address\n4. If page NOT in memory â†’ PAGE FAULT\n5. OS loads page from disk to memory frame\n6. Update page table\n7. Restart instruction\n\n// Page replacement algorithms (when memory full)\nFIFO:    replace oldest loaded page\nLRU:     replace least recently used\nOptimal: replace page not used longest in future"
},
    "Memory Management": {
      "explanation": "Memory management tracks every memory location (used/free), allocates memory to processes, and deallocates it when done. Goals: efficiency, protection, and sharing.",
      "details": [
        "Contiguous: fixed partition, variable partition",
        "Non-contiguous: paging, segmentation, paged segmentation",
        "Fragmentation: internal (wasted inside partition), external (wasted between)",
        "Compaction: shuffle contents to combine free space"
],
      "example": "// Memory allocation strategies\nFirst Fit: allocate first hole big enough (fast)\nBest Fit:  allocate smallest hole that fits (least waste)\nWorst Fit: allocate largest hole (usually bad)\n\n// Example - holes: [100KB, 500KB, 200KB, 300KB, 600KB]\n// Request 212KB:\nFirst Fit â†’ 500KB hole (wastes 288KB)\nBest Fit  â†’ 300KB hole (wastes 88KB)\nWorst Fit â†’ 600KB hole (wastes 388KB)"
},
    "Context Switching": {
      "explanation": "Context switching saves the state of a currently running process and loads the saved state of the next process. Allows multitasking but introduces overhead â€” no useful work is done during the switch.",
      "details": [
        "Save: PCB of current process (registers, PC, stack pointer)",
        "Load: PCB of next process",
        "Pure overhead: no useful work done during switch",
        "Triggered by: interrupt, system call, time quantum expiry"
],
      "example": "// Context switch sequence\n1. CPU running Process A\n2. Timer interrupt fires (time quantum expired)\n3. Save A's context into PCB_A:\n   - Program Counter: 0x4000\n   - Registers: AX=5, BX=10, ...\n   - Stack Pointer: 0xFF00\n   - State: RUNNING â†’ READY\n4. Load Process B's context from PCB_B:\n   - Restore registers, PC, SP\n   - State: READY â†’ RUNNING\n5. CPU resumes Process B from where it left off\n\n// Context switch time: typically 1â€“10 microseconds"
},
    "File System": {
      "explanation": "A file system organizes and stores data on storage devices. It manages file creation, deletion, reading, writing, and directory organization.",
      "details": [
        "Components: files, directories, metadata",
        "Common FS: FAT32, NTFS (Windows), ext4 (Linux), APFS (macOS)",
        "Inode: data structure storing file metadata (Unix/Linux)",
        "Directory: file containing list of file names and inode numbers"
],
      "example": "// Linux file system structure\n/           root\nâ”œâ”€â”€ bin/    essential binaries\nâ”œâ”€â”€ etc/    configuration files\nâ”œâ”€â”€ home/   user home directories\nâ”œâ”€â”€ var/    variable data (logs)\nâ”œâ”€â”€ tmp/    temporary files\nâ””â”€â”€ dev/    device files\n\n// File operations\nopen(path, flags)         // open file, return fd\nread(fd, buf, n)          // read n bytes\nwrite(fd, buf, n)         // write n bytes\nclose(fd)                 // close file descriptor\nunlink(path)              // delete file"
},
    "Disk Scheduling": {
      "explanation": "Disk scheduling algorithms determine the order in which disk I/O requests are serviced to minimize seek time (time for read/write head to move to the correct track).",
      "details": [
        "FCFS: simple, fair, but poor performance",
        "SSTF (Shortest Seek Time First): minimum seek, starvation possible",
        "SCAN (Elevator): move in one direction, reverse â€” no starvation",
        "C-SCAN: move one direction only, jump back â€” uniform wait time",
        "LOOK/C-LOOK: only go as far as last request"
],
      "example": "// SCAN algorithm example\nHead at position 50, moving toward high numbers\nRequest queue: [82, 170, 43, 140, 24, 16, 190]\n\nSCAN sequence: 50â†’82â†’140â†’170â†’190â†’199â†’43â†’24â†’16\nSeek distance: 32+58+30+20+9+156+19+8 = 332\n\nSSTF sequence: 50â†’43â†’24â†’16â†’82â†’140â†’170â†’190\nSeek distance: 7+19+8+66+58+30+20 = 208 (better!)\nBut: requests 170, 190 may starve"
}
}
},
  "DBMS": {
  "icon": "ti-database",
  "color": "#0F6E56",
  "topics": {
    "DBMS Basics": {
      "explanation": "A Database Management System (DBMS) is software that manages databases, providing controlled access to persistent data. It abstracts raw file storage into tables, queries, and transactions. DBMS handles concurrency (multiple users simultaneously), data integrity, security, and recovery. Understanding the architecture and core concepts is fundamental for backend and full-stack interviews.",
      "details": [
        "DBMS advantages over file systems: no redundancy, data integrity, concurrent access control, security, ACID",
        "3-level architecture (ANSI/SPARC): External (user views), Conceptual (logical schema), Internal (physical storage)",
        "DDL (Data Definition Language): CREATE, ALTER, DROP, TRUNCATE â€” define schema",
        "DML (Data Manipulation Language): SELECT, INSERT, UPDATE, DELETE â€” manipulate data",
        "DCL (Data Control Language): GRANT, REVOKE â€” manage permissions",
        "TCL (Transaction Control Language): COMMIT, ROLLBACK, SAVEPOINT â€” manage transactions",
        "Relational DBMS: data in tables with rows and columns; relationships via keys (MySQL, PostgreSQL, Oracle)",
        "NoSQL: non-relational â€” document (MongoDB), key-value (Redis), column (Cassandra), graph (Neo4j)"
],
      "example": "// DDL: defining structure\nCREATE TABLE Employees (\n    EmpID    INT PRIMARY KEY AUTO_INCREMENT,\n    Name     VARCHAR(100) NOT NULL,\n    Email    VARCHAR(150) UNIQUE NOT NULL,\n    Salary   DECIMAL(10,2) DEFAULT 50000,\n    DeptID   INT,\n    HireDate DATE,\n    FOREIGN KEY (DeptID) REFERENCES Department(DeptID)\n);\nALTER TABLE Employees ADD COLUMN Phone VARCHAR(20);\nDROP TABLE TempTable;\n\n// DML: manipulating data\nINSERT INTO Employees (Name, Email, Salary, DeptID) VALUES ('Alice', 'alice@co.com', 80000, 1);\nUPDATE Employees SET Salary = Salary * 1.10 WHERE DeptID = 1;\nDELETE FROM Employees WHERE EmpID = 5;\n\n// Transaction (TCL)\nSTART TRANSACTION;\n    UPDATE Accounts SET Balance = Balance - 500 WHERE AccID = 1;\n    UPDATE Accounts SET Balance = Balance + 500 WHERE AccID = 2;\nCOMMIT;   -- both updates permanent\n-- If error: ROLLBACK; -- undo both updates"
},
    "ACID Properties": {
      "explanation": "ACID (Atomicity, Consistency, Isolation, Durability) is the set of properties that guarantee database transactions are processed reliably. These properties are what distinguish a proper DBMS from simple file storage. Every transaction must satisfy all four ACID properties to maintain database integrity.",
      "details": [
        "Atomicity: all operations in a transaction succeed or ALL are rolled back â€” 'all or nothing'",
        "Consistency: transaction brings database from one valid state to another â€” constraints always satisfied",
        "Isolation: concurrent transactions execute as if they were sequential â€” intermediate states invisible to others",
        "Durability: committed transaction persists even after system crash â€” written to disk/WAL",
        "Isolation levels (weakest to strongest): Read Uncommitted, Read Committed, Repeatable Read, Serializable",
        "Read Uncommitted: can read dirty data (uncommitted changes from other transactions)",
        "Read Committed: only see committed data; but non-repeatable reads possible",
        "Repeatable Read: same SELECT returns same rows; but phantom reads possible (MySQL InnoDB default)",
        "Serializable: fully isolated; highest correctness but lowest concurrency"
],
      "example": "// Atomicity example: bank transfer\nSTART TRANSACTION;\n    UPDATE Accounts SET Balance = Balance - 1000 WHERE AccID = 1;\n    -- Crash here? Both operations rolled back â†’ no money lost\n    UPDATE Accounts SET Balance = Balance + 1000 WHERE AccID = 2;\nCOMMIT;\n\n// Isolation anomalies and which level prevents them:\nDirty Read:         read uncommitted data from another transaction\nNon-repeatable Read: re-reading row gets different value (another tx committed)\nPhantom Read:       re-running query returns different rows (another tx inserted)\n\nLevel              Dirty  Non-rep  Phantom\nRead Uncommitted:    âœ“      âœ“        âœ“   (all allowed)\nRead Committed:      âœ—      âœ“        âœ“\nRepeatable Read:     âœ—      âœ—        âœ“\nSerializable:        âœ—      âœ—        âœ—   (none allowed)\n\n// Durability: WAL (Write-Ahead Log)\n// Before modifying data pages, write changes to log first\n// On crash: replay WAL to reconstruct committed transactions\n// Ensures committed data is never lost\n\n// Transaction isolation in Java JDBC\nconnection.setAutoCommit(false);\nconnection.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);\ntry {\n    // operations...\n    connection.commit();\n} catch (Exception e) {\n    connection.rollback();\n}"
},
    "Normalization": {
      "explanation": "Normalization is the process of structuring a relational database to reduce data redundancy and improve data integrity. It decomposes tables into smaller ones according to normal form rules. Each normal form eliminates specific types of anomalies (update anomaly, insertion anomaly, deletion anomaly). 3NF or BCNF is the target for most production databases.",
      "details": [
        "Functional Dependency: A â†’ B means knowing A uniquely determines B (like Primary Key â†’ all other columns)",
        "1NF: atomic values only (no repeating groups, no multi-valued attributes in single column)",
        "2NF: 1NF + no partial dependency (non-key attribute must depend on ENTIRE composite primary key)",
        "3NF: 2NF + no transitive dependency (non-key attribute must NOT depend on another non-key attribute)",
        "BCNF (Boyce-Codd NF): stricter than 3NF â€” for every FD Xâ†’Y, X must be a superkey",
        "Update anomaly: changing a value requires updates in many rows (redundancy)",
        "Insertion anomaly: can't insert data without related data existing",
        "Deletion anomaly: deleting a row inadvertently deletes other important data",
        "Denormalization: intentionally introduce redundancy for performance (fewer JOINs)"
],
      "example": "// Un-normalized table (0NF violation)\nOrders: OrderID, CustomerName, CustomerEmail, Products[multiple values!]\n\n// 1NF: Atomic values, unique rows\nOrderID  CustomerName  CustomerEmail    ProductID\n1        Alice         a@co.com         P1\n1        Alice         a@co.com         P2\n2        Bob           b@co.com         P1\n\n// Still has anomalies: update Alice's email â†’ update multiple rows\n\n// 2NF: Remove partial dependencies (assume PK = OrderID+ProductID)\n// CustomerName, CustomerEmail depend only on OrderID (not full composite PK) â†’ move out\nOrders(OrderID, CustomerName, CustomerEmail)   // PK: OrderID\nOrderItems(OrderID, ProductID)                 // PK: OrderID+ProductID\n\n// 3NF: Remove transitive dependencies\n// Suppose: OrderID â†’ CustomerID â†’ CustomerEmail (transitive!)\nOrders(OrderID, CustomerID)           // PK: OrderID\nCustomers(CustomerID, Name, Email)    // PK: CustomerID\nOrderItems(OrderID, ProductID)\n\n// BCNF example: FD must have superkey on left side\n// If Course, Teacher â†’ Room AND Room â†’ Course (Room determines Course)\n// Then Room is not a superkey but Roomâ†’Course exists â†’ violates BCNF\n// Split: RoomCourse(Room, Course), TeacherRoom(Teacher, Room)"
},
    "Joins": {
      "explanation": "A JOIN combines rows from two or more tables based on a related column. Joins are central to relational databases and are a critical interview topic. Understanding when to use each type of join and being able to write correct join queries is essential for any backend or data engineering role.",
      "details": [
        "INNER JOIN: returns rows where match exists in BOTH tables",
        "LEFT JOIN: returns ALL rows from left table + matching rows from right (NULL for non-matches)",
        "RIGHT JOIN: returns ALL rows from right table + matching rows from left",
        "FULL OUTER JOIN: returns ALL rows from both tables; NULLs where no match",
        "CROSS JOIN: Cartesian product â€” every row from A with every row from B; O(mÃ—n) rows",
        "SELF JOIN: join a table to itself â€” used for hierarchical data (employeeâ†’manager)",
        "JOIN performance: index the join columns; smaller table drives the join (nested loop)",
        "Multiple JOINs: each JOIN adds one more table; execution is left-to-right unless optimizer reorders"
],
      "example": "-- Setup\nEmployees: EmpID, Name, DeptID, ManagerID, Salary\nDepartment: DeptID, DeptName, Budget\n\n-- INNER JOIN: employees with their department name\nSELECT e.Name, d.DeptName\nFROM Employees e\nINNER JOIN Department d ON e.DeptID = d.DeptID;\n-- Only employees who have a matching DeptID in Department\n\n-- LEFT JOIN: all employees (even those without a department)\nSELECT e.Name, COALESCE(d.DeptName, 'No Department') AS Dept\nFROM Employees e\nLEFT JOIN Department d ON e.DeptID = d.DeptID;\n-- NULL DeptName â†’ employee has no department\n\n-- FULL OUTER JOIN: all employees + all departments\nSELECT e.Name, d.DeptName\nFROM Employees e\nFULL OUTER JOIN Department d ON e.DeptID = d.DeptID;\n-- Shows employees with no dept AND departments with no employees\n\n-- SELF JOIN: employee with their manager's name\nSELECT e.Name AS Employee, m.Name AS Manager\nFROM Employees e\nLEFT JOIN Employees m ON e.ManagerID = m.EmpID;\n\n-- Multiple JOINs\nSELECT e.Name, d.DeptName, p.ProjectName\nFROM Employees e\nJOIN Department d  ON e.DeptID = d.DeptID\nJOIN EmpProject ep ON e.EmpID = ep.EmpID\nJOIN Projects p    ON ep.ProjectID = p.ProjectID\nWHERE d.DeptName = 'Engineering';"
},
    "Indexes": {
      "explanation": "An index is a data structure (usually a B-tree or hash) that speeds up data retrieval at the cost of additional storage and slower writes. Indexes are the primary tool for query optimization. Knowing when to add indexes, what types exist, and their trade-offs is critical for any database interview.",
      "details": [
        "B-tree index: balanced tree; O(log n) lookup, range queries work (BETWEEN, <, >)",
        "Hash index: O(1) exact match only; doesn't support range queries (used in memory engines)",
        "Clustered index: data rows physically ordered by index key (one per table); in MySQL InnoDB, PK is clustered",
        "Non-clustered index: separate structure with pointers to data rows; multiple per table",
        "Composite index: index on multiple columns; useful for multi-column WHERE/ORDER BY",
        "Covering index: index contains all columns needed by query â€” no table lookup required",
        "Cardinality: number of distinct values; high cardinality â†’ index is more selective/useful",
        "Index overhead: slows INSERT/UPDATE/DELETE (must update index); extra disk space"
],
      "example": "-- Create indexes\nCREATE INDEX idx_emp_dept ON Employees(DeptID);         -- single column\nCREATE INDEX idx_emp_name_dept ON Employees(DeptID, Name); -- composite\nCREATE UNIQUE INDEX idx_emp_email ON Employees(Email);  -- unique\n\n-- EXPLAIN: analyze query execution\nEXPLAIN SELECT * FROM Employees WHERE DeptID = 5;\n-- Shows: type (ALL=full scan vs ref=index lookup), rows scanned, key used\n\n-- When index HELPS:\nSELECT * FROM Employees WHERE DeptID = 5;          -- exact match\nSELECT * FROM Employees WHERE Salary BETWEEN 50000 AND 80000; -- range\nSELECT * FROM Employees ORDER BY DeptID, Name;     -- sort\n\n-- When index DOESN'T help (index skipped):\nSELECT * FROM Employees WHERE YEAR(HireDate) = 2023;  -- function on column\nSELECT * FROM Employees WHERE Name LIKE '%alice%';    -- leading wildcard\nSELECT * FROM Employees WHERE DeptID != 5;            -- low selectivity NOT\n\n-- Composite index rule: leftmost prefix\n-- Index on (DeptID, Name, Salary):\n-- Works: WHERE DeptID=1\n-- Works: WHERE DeptID=1 AND Name='Alice'\n-- Works: WHERE DeptID=1 AND Name='Alice' AND Salary>50000\n-- Skip: WHERE Name='Alice' (not leftmost)"
},
    "Transactions & Concurrency": {
      "explanation": "When multiple users access a database simultaneously, transactions must be isolated to prevent data corruption. The database uses locking protocols or MVCC (Multi-Version Concurrency Control) to manage this. Understanding concurrency control mechanisms is essential for database and backend interviews.",
      "details": [
        "Concurrency problems: dirty read, non-repeatable read, phantom read, lost update",
        "Pessimistic locking: lock data before reading/writing; prevents conflicts but reduces concurrency",
        "Optimistic locking: no lock during read; at write time, check if data was modified â†’ retry if yes",
        "2PL (Two-Phase Locking): growing phase (only acquire locks) then shrinking phase (only release)",
        "Strict 2PL: release all locks only at commit/rollback â†’ guarantees serializability",
        "MVCC (Multi-Version Concurrency Control): each transaction sees a snapshot; reads don't block writes",
        "PostgreSQL uses MVCC; MySQL InnoDB uses MVCC for reads and locking for writes",
        "Deadlock detection: cycle in wait-for graph; victim selection + rollback"
],
      "example": "-- Lost Update problem (without proper isolation)\nT1: READ balance = 1000;      T2: READ balance = 1000;\nT1: balance = 1000 - 100;     T2: balance = 1000 + 200;\nT1: WRITE balance = 900;      T2: WRITE balance = 1200; â† T1's update LOST!\n-- Correct result should be 1100\n\n-- Pessimistic locking: SELECT ... FOR UPDATE\nSTART TRANSACTION;\nSELECT balance FROM Accounts WHERE id=1 FOR UPDATE; -- locks row\nUPDATE Accounts SET balance = balance - 100 WHERE id=1;\nCOMMIT;\n\n-- Optimistic locking: use version column\nCREATE TABLE Accounts (id INT, balance DECIMAL, version INT);\n-- Read: version = 5\n-- Update: WHERE version = 5 â†’ if another tx changed it, rowCount=0 â†’ retry\nUPDATE Accounts SET balance=900, version=6 WHERE id=1 AND version=5;\n\n-- MVCC: how PostgreSQL reads work\n-- Each row has xmin (created by tx) and xmax (deleted by tx)\n-- Transaction snapshot: visible if xmin committed before snapshot AND xmax null/not committed\n-- Readers never block writers; writers never block readers\n\n-- Deadlock example\nT1: LOCK row A; wait for row B\nT2: LOCK row B; wait for row A\n-- Database detects cycle, rolls back T2, T1 continues"
}
}
},
  "SQL Basics": {
  "topics": {
    "What is SQL": {
      "explanation": "SQL (Structured Query Language) is a standardized language for interacting with Relational Database Management Systems (RDBMS). It allows you to create, read, update, and delete data in a structured tabular format. SQL is declarative â€” you describe *what* you want, and the database engine figures out *how* to get it.",
      "details": [
        "Developed by IBM researchers in the 1970s (originally called SEQUEL); standardized by ANSI in 1986",
        "Powers nearly every enterprise system: banking, e-commerce, healthcare, social media",
        "Relational databases store data in tables (rows Ã— columns), linked by keys",
        "Major RDBMSs: MySQL, PostgreSQL, Oracle, Microsoft SQL Server, SQLite, MariaDB",
        "SQL is NOT case-sensitive for keywords (SELECT = select = Select), but identifiers may be",
        "Each vendor has slight SQL dialect differences (T-SQL for SQL Server, PL/SQL for Oracle)"
],
      "example": "-- SQL lets you interact with data in human-readable statements\n\n-- Retrieve all employees earning above average salary\nSELECT Name, Department, Salary\nFROM Employees\nWHERE Salary > (SELECT AVG(Salary) FROM Employees)\nORDER BY Salary DESC;\n\n-- The database engine handles: disk access, indexing, query optimization\n-- You just declare the WHAT, not the HOW"
},
    "SQL Syntax": {
      "explanation": "SQL syntax is the set of grammatical rules governing how SQL statements must be written. Every statement has a defined structure â€” clauses appear in a mandatory order and have required/optional components.",
      "details": [
        "Statements end with semicolon (;) â€” required in scripts, optional in single interactive queries",
        "SQL Keywords conventionally written in UPPERCASE (SELECT, FROM, WHERE, etc.)",
        "String literals use single quotes: 'Alice'. Double quotes wrap identifiers: \"MyColumn\"",
        "Single-line comments: -- comment. Multi-line: /* comment */",
        "Mandatory clause order: SELECT â†’ FROM â†’ JOIN â†’ WHERE â†’ GROUP BY â†’ HAVING â†’ ORDER BY â†’ LIMIT",
        "Logical processing order (different!): FROM â†’ JOIN â†’ WHERE â†’ GROUP BY â†’ HAVING â†’ SELECT â†’ ORDER BY â†’ LIMIT"
],
      "example": "-- Anatomy of a full SQL SELECT statement\n\nSELECT   department,           -- 1. Columns to retrieve\n         COUNT(*) AS headcount, -- Aggregate with alias\n         AVG(salary) AS avg_sal -- Another aggregate\nFROM     employees              -- 2. Source table\nJOIN     departments USING(dept_id) -- 3. Join another table\nWHERE    hire_date >= '2020-01-01'  -- 4. Row filter (pre-group)\nGROUP BY department                  -- 5. Group rows\nHAVING   COUNT(*) > 3               -- 6. Group filter (post-group)\nORDER BY avg_sal DESC               -- 7. Sort result\nLIMIT    5;                         -- 8. Restrict output rows\n\n-- Single-line comment: ignored by SQL engine\n/* Multi-line comment:\n   great for documentation */"
},
    "SQL Data Types": {
      "explanation": "SQL data types define what kind of value a column can store. Choosing the right data type is crucial for data integrity, storage efficiency, and query performance. Types vary slightly between database engines.",
      "details": [
        "NUMERIC: INT / INTEGER, BIGINT, SMALLINT, TINYINT, DECIMAL(p,s), NUMERIC(p,s), FLOAT, DOUBLE, REAL",
        "STRING: CHAR(n) â€” fixed length, VARCHAR(n) â€” variable length, TEXT â€” large text, CLOB â€” character large object",
        "DATE/TIME: DATE (YYYY-MM-DD), TIME (HH:MM:SS), DATETIME, TIMESTAMP, YEAR, INTERVAL",
        "BOOLEAN: BOOLEAN or BOOL (MySQL stores as TINYINT(1), 0=false, 1=true)",
        "BINARY: BINARY(n), VARBINARY(n), BLOB â€” binary large objects (images, files)",
        "Special: JSON, XML, UUID, ARRAY (PostgreSQL), ENUM, SET",
        "DECIMAL(10,2): 10 total digits, 2 after decimal â€” perfect for money",
        "CHAR vs VARCHAR: CHAR(10) always uses 10 bytes; VARCHAR(10) uses only what's needed (+ 1-2 bytes overhead)"
],
      "example": "-- Choosing the right data types matters\n\nCREATE TABLE Products (\n    ProductID    INT            PRIMARY KEY,    -- whole numbers\n    SKU          CHAR(8)        NOT NULL,       -- always 8 chars: 'ABC-0001'\n    Name         VARCHAR(200)   NOT NULL,       -- variable length text\n    Description  TEXT,                          -- unlimited text\n    Price        DECIMAL(10, 2) NOT NULL,       -- exact: 99999999.99\n    Weight       FLOAT,                         -- approximate decimals OK\n    InStock      BOOLEAN        DEFAULT TRUE,   -- true/false\n    CreatedAt    TIMESTAMP      DEFAULT NOW(),  -- date + time\n    ImageData    BLOB,                          -- binary: store images\n    Tags         JSON                           -- structured data (MySQL 5.7+)\n);\n\n-- DECIMAL vs FLOAT: never use FLOAT for money!\n-- FLOAT(0.1) + FLOAT(0.2) = 0.30000000000000004 (floating point error)\n-- DECIMAL(0.1) + DECIMAL(0.2) = 0.3 (exact)"
},
    "SQL Operators": {
      "explanation": "SQL operators are symbols or keywords used to perform operations on values in expressions. They are used in WHERE clauses, SELECT expressions, JOIN conditions, and HAVING clauses.",
      "details": [
        "Arithmetic: + (add), - (subtract), * (multiply), / (divide), % (modulo)",
        "Comparison: = (equal), != or <> (not equal), < > <= >= (relational)",
        "Logical: AND, OR, NOT â€” combine multiple conditions",
        "String: LIKE (pattern match), CONCAT (||), REGEXP/RLIKE (regex)",
        "Set: IN (match list), BETWEEN (range), EXISTS (subquery check)",
        "NULL: IS NULL, IS NOT NULL â€” never use = NULL (always false!)",
        "Operator precedence: NOT > AND > OR (use parentheses to be explicit)",
        "Bitwise: & (AND), | (OR), ^ (XOR), ~ (NOT), << (left shift), >> (right shift)"
],
      "example": "-- Arithmetic operators\nSELECT Price, Price * 1.18 AS PriceWithTax, Price * Qty AS Total\nFROM OrderItems;\n\n-- Comparison + Logical\nSELECT * FROM Employees\nWHERE (Department = 'Sales' OR Department = 'Marketing')\n  AND Salary BETWEEN 40000 AND 80000\n  AND Manager IS NOT NULL;\n\n-- Operator precedence trap\n-- WRONG interpretation: A OR (B AND C)  â† AND binds tighter\nSELECT * FROM T WHERE A = 1 OR B = 2 AND C = 3;\n\n-- CORRECT explicit grouping:\nSELECT * FROM T WHERE (A = 1 OR B = 2) AND C = 3;\n\n-- String operator\nSELECT CONCAT(FirstName, ' ', LastName) AS FullName FROM Users;"
},
    "SQL Commands": {
      "explanation": "SQL commands are categorized into 5 major groups based on their purpose. Understanding this classification helps you know what permissions are needed and what each command does to the database.",
      "details": [
        "DDL (Data Definition Language): Define/modify structure â€” CREATE, ALTER, DROP, TRUNCATE, RENAME",
        "DML (Data Manipulation Language): Manipulate data â€” SELECT, INSERT, UPDATE, DELETE, MERGE",
        "DQL (Data Query Language): Some separate SELECT into its own category",
        "DCL (Data Control Language): Manage permissions â€” GRANT, REVOKE",
        "TCL (Transaction Control Language): Manage transactions â€” COMMIT, ROLLBACK, SAVEPOINT",
        "DDL commands are auto-committed (cannot be rolled back in most databases)",
        "DML commands within a transaction CAN be rolled back",
        "DCL commands typically auto-commit and require admin privileges"
],
      "example": "-- DDL: Changes structure (auto-committed)\nCREATE TABLE Logs (id INT, msg VARCHAR(500));\nALTER TABLE Logs ADD COLUMN created_at TIMESTAMP;\nDROP TABLE Logs;\n\n-- DML: Changes data (can be rolled back)\nINSERT INTO Employees VALUES (1, 'Alice', 75000);\nUPDATE Employees SET Salary = 80000 WHERE EmpID = 1;\nDELETE FROM Employees WHERE EmpID = 1;\n\n-- DCL: Controls access\nGRANT SELECT, INSERT ON Employees TO 'analyst_user';\nREVOKE DELETE ON Employees FROM 'analyst_user';\n\n-- TCL: Controls transactions\nBEGIN;\n  UPDATE Accounts SET Balance = Balance - 500 WHERE ID = 1;\n  UPDATE Accounts SET Balance = Balance + 500 WHERE ID = 2;\nCOMMIT; -- or ROLLBACK if something went wrong"
},
    "DDL Commands": {
      "explanation": "DDL (Data Definition Language) commands define and modify the structure of database objects like tables, indexes, and schemas. They operate on the schema (structure) rather than the data itself, and most are auto-committed.",
      "details": [
        "CREATE: Creates new database objects (database, table, index, view, procedure, function)",
        "ALTER: Modifies existing objects â€” add/drop/modify columns, add constraints, rename",
        "DROP: Permanently deletes objects and all their data â€” irreversible without backup!",
        "TRUNCATE: Removes all rows from a table but keeps structure; faster than DELETE; cannot be rolled back in most DBs",
        "RENAME: Renames a database object",
        "COMMENT: Adds comments to data dictionary",
        "DDL statements cause an implicit COMMIT in MySQL â€” no rollback possible",
        "PostgreSQL DDL can be rolled back within a transaction (unique feature)"
],
      "example": "-- CREATE: define new structure\nCREATE TABLE Students (\n    StudentID INT PRIMARY KEY AUTO_INCREMENT,\n    Name      VARCHAR(100) NOT NULL,\n    GPA       DECIMAL(3,2) CHECK (GPA BETWEEN 0.0 AND 4.0)\n);\n\n-- ALTER: modify structure\nALTER TABLE Students ADD COLUMN Email VARCHAR(150) UNIQUE;\nALTER TABLE Students MODIFY COLUMN Name VARCHAR(200);\nALTER TABLE Students DROP COLUMN GPA;\nALTER TABLE Students RENAME TO Learners;\n\n-- TRUNCATE: empty table, keep structure\nTRUNCATE TABLE Learners;  -- faster than DELETE *, resets AUTO_INCREMENT\n\n-- DROP: destroy completely\nDROP TABLE IF EXISTS Learners;   -- IF EXISTS avoids error if not found\nDROP DATABASE old_archive;"
},
    "DML Commands": {
      "explanation": "DML (Data Manipulation Language) commands manipulate the actual data within database tables. These are the day-to-day operations: reading, writing, changing, and removing records. DML commands within a transaction can be rolled back.",
      "details": [
        "SELECT: Retrieve data â€” the most frequently used SQL command",
        "INSERT: Add new rows to a table",
        "UPDATE: Modify existing rows â€” ALWAYS use WHERE or you update all rows!",
        "DELETE: Remove rows â€” ALWAYS use WHERE or you delete all rows!",
        "MERGE (UPSERT): Insert or update based on a condition â€” supported in Oracle, SQL Server, PostgreSQL",
        "DML changes are not permanent until COMMITted (in auto-commit off mode)",
        "Use SELECT first to verify rows before UPDATE or DELETE â€” a safe habit",
        "Row locks are acquired during DML in concurrent environments"
],
      "example": "-- SELECT: Read data\nSELECT Name, Salary FROM Employees WHERE DeptID = 3;\n\n-- INSERT: Add data (single row)\nINSERT INTO Employees (Name, DeptID, Salary) VALUES ('Bob', 3, 65000);\n\n-- INSERT: Multiple rows\nINSERT INTO Employees (Name, DeptID, Salary) VALUES\n  ('Carol', 2, 72000),\n  ('Dave',  1, 58000);\n\n-- UPDATE: Change data (ALWAYS use WHERE!)\nUPDATE Employees SET Salary = Salary * 1.1 WHERE DeptID = 3;\n\n-- DELETE: Remove data (ALWAYS use WHERE!)\nDELETE FROM Employees WHERE Salary < 30000;\n\n-- MERGE (UPSERT) - PostgreSQL syntax\nINSERT INTO Employees (EmpID, Name, Salary)\nVALUES (1, 'Alice', 80000)\nON CONFLICT (EmpID)\nDO UPDATE SET Salary = EXCLUDED.Salary;"
},
    "DQL Commands": {
      "explanation": "DQL (Data Query Language) refers specifically to the SELECT command used to query and retrieve data from the database. Some SQL classifications separate SELECT from DML because it doesn't modify data â€” it only reads it.",
      "details": [
        "SELECT is the heart of SQL â€” every analyst and developer uses it constantly",
        "DQL = SELECT in most classifications; everything else is DML/DDL/DCL/TCL",
        "SELECT does NOT modify data â€” it's safe to run in production environments",
        "Execution order: FROM â†’ WHERE â†’ GROUP BY â†’ HAVING â†’ SELECT â†’ ORDER BY â†’ LIMIT",
        "Writing order (what you type): SELECT â†’ FROM â†’ WHERE â†’ GROUP BY â†’ HAVING â†’ ORDER BY â†’ LIMIT",
        "Complex SELECT can join dozens of tables, use subqueries, CTEs, window functions"
],
      "example": "-- Simple DQL\nSELECT * FROM Products;\n\n-- Filtered DQL\nSELECT ProductName, Price FROM Products WHERE Price < 100;\n\n-- Aggregated DQL\nSELECT Category, COUNT(*) AS Total, AVG(Price) AS AvgPrice\nFROM Products\nGROUP BY Category\nHAVING AVG(Price) > 50\nORDER BY AvgPrice DESC;\n\n-- DQL with subquery\nSELECT Name FROM Employees\nWHERE DeptID = (SELECT DeptID FROM Departments WHERE DeptName = 'Engineering');"
},
    "DCL Commands": {
      "explanation": "DCL (Data Control Language) commands manage user permissions and access control in a database. They control who can do what to which database objects â€” essential for security in multi-user environments.",
      "details": [
        "GRANT: Give specific privileges to a user or role",
        "REVOKE: Remove previously granted privileges from a user or role",
        "Privileges: SELECT, INSERT, UPDATE, DELETE, EXECUTE, CREATE, DROP, ALL PRIVILEGES",
        "Privileges can be granted at different levels: global, database, table, column, routine",
        "WITH GRANT OPTION: allows the user to grant the same privilege to others",
        "Roles: Named groups of privileges â€” grant the role instead of individual privileges",
        "DCL commands auto-commit â€” they cannot be rolled back",
        "Only users with GRANT OPTION or admin rights can execute DCL commands"
],
      "example": "-- Create a user (MySQL)\nCREATE USER 'analyst'@'localhost' IDENTIFIED BY 'SecurePass123!';\n\n-- GRANT specific privileges\nGRANT SELECT, INSERT ON company_db.employees TO 'analyst'@'localhost';\nGRANT SELECT ON company_db.* TO 'analyst'@'localhost'; -- all tables in db\nGRANT ALL PRIVILEGES ON company_db.* TO 'admin'@'%';  -- all privileges\n\n-- GRANT with ability to re-grant\nGRANT SELECT ON reports.* TO 'teamlead'@'%' WITH GRANT OPTION;\n\n-- REVOKE privileges\nREVOKE INSERT ON company_db.employees FROM 'analyst'@'localhost';\nREVOKE ALL PRIVILEGES ON company_db.* FROM 'analyst'@'localhost';\n\n-- View user privileges\nSHOW GRANTS FOR 'analyst'@'localhost';\n\n-- Roles (MySQL 8+)\nCREATE ROLE 'read_only', 'data_entry';\nGRANT SELECT ON company_db.* TO 'read_only';\nGRANT SELECT, INSERT, UPDATE ON company_db.* TO 'data_entry';\nGRANT 'read_only' TO 'analyst'@'localhost';"
},
    "TCL Commands": {
      "explanation": "TCL (Transaction Control Language) commands manage transactions â€” logical units of work that must either fully succeed or fully fail. TCL is critical for data integrity in multi-step operations like bank transfers.",
      "details": [
        "COMMIT: Permanently save all changes made in the current transaction",
        "ROLLBACK: Undo all changes made since the last COMMIT or SAVEPOINT",
        "SAVEPOINT: Create a named checkpoint within a transaction to rollback to partially",
        "RELEASE SAVEPOINT: Destroy a savepoint (changes up to it remain pending)",
        "SET TRANSACTION: Configure transaction isolation level",
        "Auto-commit: Most databases run in auto-commit mode by default (each statement auto-commits)",
        "Disable auto-commit with: SET autocommit = 0; or BEGIN/START TRANSACTION",
        "ACID properties (Atomicity, Consistency, Isolation, Durability) are enforced by transactions"
],
      "example": "-- Classic bank transfer â€” must be atomic\nSTART TRANSACTION;\n\n  UPDATE Accounts SET Balance = Balance - 1000 WHERE AccID = 'A001';\n  UPDATE Accounts SET Balance = Balance + 1000 WHERE AccID = 'A002';\n\n  -- Check for error, if something went wrong:\n  -- ROLLBACK; â† undoes both UPDATEs\n\nCOMMIT;  -- makes both changes permanent\n\n-- SAVEPOINT example\nSTART TRANSACTION;\n  INSERT INTO Orders (OrdID, Amount) VALUES (501, 250);\n  SAVEPOINT after_order;\n\n  INSERT INTO OrderItems (OrdID, ItemID, Qty) VALUES (501, 99, 2);\n  -- Oops, item 99 doesn't exist\n  ROLLBACK TO after_order;  -- undo only the item insert\n\n  INSERT INTO OrderItems (OrdID, ItemID, Qty) VALUES (501, 45, 2);\nCOMMIT;"
},
    "SQL Comments": {
      "explanation": "SQL comments are text ignored by the SQL engine, used for documentation, explanation, and temporarily disabling code. Good commenting is essential in complex queries and stored procedures.",
      "details": [
        "Single-line comment: -- (two dashes) followed by text; everything after is ignored",
        "Multi-line comment: /* text */ â€” can span multiple lines or inline",
        "MySQL also supports # as single-line comment (non-standard)",
        "Comments don't affect performance or execution",
        "Use comments to document: purpose, author, date, parameter descriptions, complex logic",
        "Inline comments explain specific parts of a line",
        "Block comments are great for temporarily disabling a section of SQL",
        "Stored procedures and functions benefit greatly from comments"
],
      "example": "-- This is a single-line comment\n\nSELECT\n    EmpID,          -- primary key\n    Name,           -- full name (first + last)\n    Salary * 1.18   -- salary including 18% tax gross-up\nFROM Employees\n/* This filter excludes terminated employees\n   and contractors â€” only active full-time staff */\nWHERE Status = 'Active'\n  AND EmployeeType = 'FTE'; -- Full Time Employee\n\n/*\n  Author   : Data Team\n  Created  : 2024-01-15\n  Purpose  : Monthly payroll report\n  Modified : 2024-06-01 â€” added tax column\n*/\n\n# MySQL-only hash comment (avoid for portability)\nSELECT 1; # inline MySQL comment"
},
    "CREATE DATABASE": {
      "explanation": "CREATE DATABASE creates a new empty database (schema) in the RDBMS. It establishes the container that will hold all tables, views, procedures, and other objects for a specific application or purpose.",
      "details": [
        "Syntax: CREATE DATABASE database_name;",
        "IF NOT EXISTS: Prevents error if database already exists",
        "CHARACTER SET: Specifies default character encoding (utf8mb4 recommended for full Unicode including emojis)",
        "COLLATE: Defines sorting/comparison rules for string data",
        "utf8mb4_unicode_ci: case-insensitive comparison (ci) â€” most common choice",
        "One RDBMS instance can host multiple databases",
        "Databases are isolated â€” tables in one DB cannot directly reference tables in another without full qualification",
        "Requires CREATE DATABASE privilege (admin/root in most setups)"
],
      "example": "-- Basic\nCREATE DATABASE company_db;\n\n-- With IF NOT EXISTS (safe to run multiple times)\nCREATE DATABASE IF NOT EXISTS company_db;\n\n-- Full options (MySQL) â€” always use utf8mb4!\nCREATE DATABASE company_db\n  CHARACTER SET utf8mb4\n  COLLATE utf8mb4_unicode_ci;\n\n-- PostgreSQL\nCREATE DATABASE company_db\n  ENCODING 'UTF8'\n  LC_COLLATE 'en_US.utf8'\n  LC_CTYPE 'en_US.utf8';\n\n-- SQL Server\nCREATE DATABASE company_db\nON PRIMARY (\n  NAME = 'company_db_data',\n  FILENAME = '/var/opt/mssql/data/company_db.mdf'\n);"
},
    "DROP DATABASE": {
      "explanation": "DROP DATABASE permanently deletes an entire database and ALL its contents â€” tables, data, views, procedures, everything. This is irreversible without a backup. Use with extreme caution!",
      "details": [
        "Syntax: DROP DATABASE database_name;",
        "IF EXISTS: Prevents error if database doesn't exist",
        "Cannot drop the currently active/in-use database in most systems",
        "Requires DROP privilege (admin/root level)",
        "In production: ALWAYS take a backup before dropping",
        "SQL Server: Cannot drop if there are active connections â€” use SINGLE_USER mode first",
        "Some systems: DROP SCHEMA is equivalent to DROP DATABASE",
        "Irreversible â€” there is no 'undo' unless you have backups or bin logs"
],
      "example": "-- Basic drop (errors if not found)\nDROP DATABASE old_database;\n\n-- Safe drop (no error if not found) \nDROP DATABASE IF EXISTS old_database;\n\n-- Best practice: backup first!\n-- mysqldump -u root -p company_db > backup_$(date +%F).sql\n-- Then: DROP DATABASE company_db;\n\n-- SQL Server: force drop with active connections\nALTER DATABASE company_db SET SINGLE_USER WITH ROLLBACK IMMEDIATE;\nDROP DATABASE company_db;\n\n-- PostgreSQL\nDROP DATABASE IF EXISTS company_db;\n\n-- Check what databases exist before dropping\nSHOW DATABASES;         -- MySQL\nSELECT datname FROM pg_database;  -- PostgreSQL"
},
    "SHOW DATABASES": {
      "explanation": "SHOW DATABASES (MySQL) lists all databases accessible to the current user. The equivalent commands exist in other databases. Used to explore what databases exist on the server.",
      "details": [
        "MySQL: SHOW DATABASES; or SHOW SCHEMAS;",
        "PostgreSQL: \\l or SELECT datname FROM pg_database;",
        "SQL Server: SELECT name FROM sys.databases;",
        "SQLite: .databases (dot command in CLI)",
        "Only shows databases the current user has privilege to access",
        "System databases (mysql, information_schema, performance_schema) appear too â€” don't modify them!",
        "SHOW DATABASES LIKE 'pattern%': filter by name pattern"
],
      "example": "-- MySQL: list all databases\nSHOW DATABASES;\n-- Result:\n-- +--------------------+\n-- | Database           |\n-- +--------------------+\n-- | company_db         |\n-- | information_schema |\n-- | mysql              |\n-- | performance_schema |\n-- | test_db            |\n-- +--------------------+\n\nSHOW DATABASES LIKE 'comp%';  -- filter by prefix\n\n-- PostgreSQL equivalent\nSELECT datname AS database_name FROM pg_database ORDER BY datname;\n\n-- SQL Server equivalent\nSELECT name AS database_name, create_date\nFROM sys.databases\nORDER BY name;\n\n-- Information schema (portable across databases)\nSELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA;"
},
    "USE DATABASE": {
      "explanation": "USE selects a database as the default/active database for the current session. Once selected, all unqualified table references (without db.table prefix) refer to tables in the active database.",
      "details": [
        "Syntax: USE database_name;",
        "Sets the active database context for the session",
        "After USE, you can reference tables without the database prefix: SELECT * FROM employees (not company_db.employees)",
        "Without USE, you must fully qualify: SELECT * FROM company_db.employees",
        "PostgreSQL uses \\c database_name or connection strings â€” no USE command",
        "SQL Server: USE database_name; works similarly",
        "Cross-database queries require full qualification: db1.table JOIN db2.table"
],
      "example": "-- Select active database\nUSE company_db;\n\n-- Now tables can be referenced without prefix\nSELECT * FROM employees;  -- refers to company_db.employees\n\n-- Without USE, need full qualification:\nSELECT * FROM company_db.employees;\n\n-- Cross-database query (MySQL)\nSELECT e.Name, d.DeptName\nFROM company_db.employees e\nJOIN hr_db.departments d ON e.dept_id = d.dept_id;\n\n-- PostgreSQL: connect to a database\nc company_db   -- in psql CLI\n\n-- Check current database\nSELECT DATABASE();          -- MySQL\nSELECT CURRENT_DATABASE();  -- PostgreSQL\nSELECT DB_NAME();           -- SQL Server"
},
    "SHOW TABLES": {
      "explanation": "SHOW TABLES lists all tables in the currently active database. Used to explore database structure when working with an unfamiliar schema.",
      "details": [
        "MySQL: SHOW TABLES; or SHOW FULL TABLES; (shows table type: BASE TABLE vs VIEW)",
        "PostgreSQL: \\dt or SELECT tablename FROM pg_tables WHERE schemaname='public';",
        "SQL Server: SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;",
        "SHOW TABLES LIKE 'pattern': filter by name",
        "SHOW TABLES FROM database_name: list tables from a specific database without switching to it",
        "INFORMATION_SCHEMA.TABLES is portable across most databases"
],
      "example": "-- MySQL: show all tables in active database\nSHOW TABLES;\n\n-- Show table type (BASE TABLE or VIEW)\nSHOW FULL TABLES;\n-- Result:\n-- +------------------+------------+\n-- | Tables_in_co_db  | Table_type |\n-- +------------------+------------+\n-- | customers        | BASE TABLE |\n-- | employees        | BASE TABLE |\n-- | sales_summary    | VIEW       |\n-- +------------------+------------+\n\n-- Filter by pattern\nSHOW TABLES LIKE 'emp%';\n\n-- From a specific database\nSHOW TABLES FROM hr_db;\n\n-- Portable via INFORMATION_SCHEMA\nSELECT TABLE_NAME, TABLE_TYPE\nFROM INFORMATION_SCHEMA.TABLES\nWHERE TABLE_SCHEMA = 'company_db'\nORDER BY TABLE_NAME;"
},
    "DESCRIBE TABLE": {
      "explanation": "DESCRIBE (or DESC) shows the structure of a table â€” its columns, data types, nullability, keys, defaults, and extra properties. Essential for understanding a table before writing queries.",
      "details": [
        "MySQL: DESCRIBE table_name; or DESC table_name; (shorthand)",
        "Shows: Field name, Type, Null (YES/NO), Key (PRI/UNI/MUL), Default, Extra (e.g. auto_increment)",
        "PostgreSQL: \\d table_name in psql CLI",
        "SQL Server: sp_help 'table_name'; or use INFORMATION_SCHEMA.COLUMNS",
        "SHOW CREATE TABLE: shows the full CREATE TABLE statement as-executed",
        "INFORMATION_SCHEMA.COLUMNS: portable across all databases"
],
      "example": "-- MySQL: describe table structure\nDESCRIBE employees;\n-- or shorthand:\nDESC employees;\n\n-- Result:\n-- +------------+--------------+------+-----+-------------------+----------------+\n-- | Field      | Type         | Null | Key | Default           | Extra          |\n-- +------------+--------------+------+-----+-------------------+----------------+\n-- | emp_id     | int          | NO   | PRI | NULL              | auto_increment |\n-- | name       | varchar(100) | NO   |     | NULL              |                |\n-- | salary     | decimal(10,2)| YES  |     | NULL              |                |\n-- | hire_date  | timestamp    | YES  |     | CURRENT_TIMESTAMP |                |\n-- +------------+--------------+------+-----+-------------------+----------------+\n\n-- Full CREATE TABLE statement\nSHOW CREATE TABLE employees;\n\n-- Portable: INFORMATION_SCHEMA\nSELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA\nFROM INFORMATION_SCHEMA.COLUMNS\nWHERE TABLE_SCHEMA = 'company_db' AND TABLE_NAME = 'employees'\nORDER BY ORDINAL_POSITION;\n\n-- PostgreSQL\nd employees  -- in psql CLI"
},
    "CREATE TABLE": {
      "explanation": "CREATE TABLE defines a new table with its columns, data types, constraints, and properties. It's one of the most important DDL statements â€” good table design upfront saves enormous pain later.",
      "details": [
        "Columns defined as: column_name data_type [constraints]",
        "Column-level constraints: NOT NULL, UNIQUE, PRIMARY KEY, DEFAULT, CHECK, REFERENCES",
        "Table-level constraints: PRIMARY KEY(col1,col2), FOREIGN KEY, UNIQUE(col), CHECK(expression)",
        "AUTO_INCREMENT (MySQL) / SERIAL (PostgreSQL) / IDENTITY (SQL Server) for auto-generated IDs",
        "CREATE TABLE IF NOT EXISTS: safe to re-run without error",
        "CREATE TABLE AS SELECT: creates table from query result (copies structure + data)",
        "CREATE TABLE LIKE other_table: copies structure only (MySQL)",
        "Engine/Storage: MySQL supports InnoDB (default, transactions) and MyISAM (no transactions)"
],
      "example": "-- Full CREATE TABLE with common patterns\nCREATE TABLE orders (\n    order_id     INT           PRIMARY KEY AUTO_INCREMENT,\n    customer_id  INT           NOT NULL,\n    order_date   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,\n    total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount >= 0),\n    status       VARCHAR(20)   DEFAULT 'pending',\n    notes        TEXT,\n\n    -- Table-level foreign key constraint\n    CONSTRAINT fk_customer\n        FOREIGN KEY (customer_id)\n        REFERENCES customers(customer_id)\n        ON DELETE RESTRICT\n        ON UPDATE CASCADE,\n\n    -- Table-level check constraint\n    CONSTRAINT chk_status\n        CHECK (status IN ('pending','processing','shipped','delivered','cancelled'))\n);\n\n-- CREATE TABLE from query (snapshot/archive)\nCREATE TABLE employees_2024 AS\nSELECT * FROM employees WHERE YEAR(hire_date) <= 2024;\n\n-- CREATE TABLE like another (copy structure only)\nCREATE TABLE employees_backup LIKE employees;"
},
    "ALTER TABLE": {
      "explanation": "ALTER TABLE modifies an existing table's structure without losing its data. Used to add/remove/modify columns, add/drop constraints, rename columns or the table itself.",
      "details": [
        "ADD COLUMN: Add a new column (appended at end by default; use AFTER col_name for position)",
        "DROP COLUMN: Remove a column permanently â€” all its data is lost!",
        "MODIFY COLUMN (MySQL) / ALTER COLUMN (SQL Server/PostgreSQL): Change data type or constraints",
        "RENAME COLUMN: Change a column's name (MySQL 8+, PostgreSQL, SQL Server 2022+)",
        "ADD CONSTRAINT / DROP CONSTRAINT: Add or remove constraints",
        "RENAME TO: Rename the table itself",
        "ALTER TABLE can be slow on large tables â€” it may lock the table while running",
        "Online DDL (MySQL InnoDB): some ALTER operations run without blocking reads/writes"
],
      "example": "-- Add columns\nALTER TABLE employees\n    ADD COLUMN email       VARCHAR(200) UNIQUE,\n    ADD COLUMN department  VARCHAR(100) DEFAULT 'General' AFTER name;\n\n-- Modify column type (MySQL)\nALTER TABLE employees\n    MODIFY COLUMN name VARCHAR(200) NOT NULL;\n\n-- PostgreSQL change type\nALTER TABLE employees\n    ALTER COLUMN salary TYPE NUMERIC(15,2);\n\n-- Rename column (MySQL 8+)\nALTER TABLE employees\n    RENAME COLUMN dept TO department;\n\n-- Drop column\nALTER TABLE employees DROP COLUMN old_field;\n\n-- Add/Drop constraints\nALTER TABLE employees\n    ADD CONSTRAINT uq_email UNIQUE (email);\nALTER TABLE employees\n    DROP INDEX uq_email;  -- MySQL drops unique constraint via index name\n\n-- Add foreign key\nALTER TABLE orders\n    ADD CONSTRAINT fk_cust FOREIGN KEY (cust_id) REFERENCES customers(id);\n\n-- Rename table\nALTER TABLE employees RENAME TO staff;"
},
    "DROP TABLE": {
      "explanation": "DROP TABLE permanently removes a table â€” its structure AND all its data â€” from the database. This is an irreversible DDL operation. If other tables have foreign keys pointing to this table, you must drop those first or use CASCADE.",
      "details": [
        "Syntax: DROP TABLE table_name;",
        "IF EXISTS: Prevents error if table doesn't exist â€” always use this in scripts",
        "CASCADE: Automatically drops dependent objects (views, foreign keys) â€” PostgreSQL",
        "RESTRICT: Default â€” fails if dependent objects exist",
        "In MySQL: foreign key constraints must be disabled or child tables dropped first",
        "DROP TABLE vs TRUNCATE: DROP removes structure too; TRUNCATE keeps structure",
        "DROP TABLE vs DELETE: DROP removes everything; DELETE removes rows with optional WHERE",
        "Cannot be rolled back in MySQL (DDL auto-commits)"
],
      "example": "-- Basic drop\nDROP TABLE employees;\n\n-- Safe drop (no error if not exists)\nDROP TABLE IF EXISTS employees;\n\n-- Drop multiple tables\nDROP TABLE IF EXISTS order_items, orders, customers;\n\n-- PostgreSQL: drop with dependencies\nDROP TABLE departments CASCADE;  -- also drops views/FKs referencing it\n\n-- MySQL: must disable foreign key checks to drop referenced table\nSET FOREIGN_KEY_CHECKS = 0;\nDROP TABLE departments;\nSET FOREIGN_KEY_CHECKS = 1;\n\n-- Drop and recreate (reset table):\nDROP TABLE IF EXISTS temp_results;\nCREATE TABLE temp_results (id INT, value DECIMAL(10,2));\n\n-- What gets deleted:\n-- âœ“ All rows of data\n-- âœ“ Table structure (columns, types)\n-- âœ“ Indexes on the table\n-- âœ“ Triggers on the table\n-- âœ— Stored procedures that reference it (they just break)"
},
    "RENAME TABLE": {
      "explanation": "RENAME TABLE changes the name of an existing table. This is a DDL operation that only renames the object â€” all data, indexes, and constraints remain intact.",
      "details": [
        "MySQL: RENAME TABLE old_name TO new_name;",
        "MySQL: Can rename multiple tables atomically in one statement",
        "PostgreSQL: ALTER TABLE old_name RENAME TO new_name;",
        "SQL Server: sp_rename 'old_name', 'new_name';",
        "All views, stored procedures, and foreign keys referencing the old name will break!",
        "Use to: swap a new table in place of an old one (blue-green deployment pattern)",
        "Renaming is fast â€” it just updates the metadata, not the data"
],
      "example": "-- MySQL: rename single table\nRENAME TABLE employees TO staff;\n\n-- MySQL: rename multiple tables atomically (swap trick!)\n-- Useful for zero-downtime table replacement:\nRENAME TABLE employees TO employees_old,\n             employees_new TO employees;\n\n-- PostgreSQL\nALTER TABLE employees RENAME TO staff;\n\n-- SQL Server\nEXEC sp_rename 'employees', 'staff';\n\n-- After renaming: update dependent objects!\n-- Views referencing 'employees' will now fail:\n-- Error: Table 'employees' doesn't exist\n-- You must recreate or alter the views to use new name\n\n-- Check for dependent views/procedures before renaming:\nSELECT TABLE_NAME FROM INFORMATION_SCHEMA.VIEWS\nWHERE VIEW_DEFINITION LIKE '%employees%';"
},
    "SQL Constraints": {
      "explanation": "Constraints are rules enforced on table columns to maintain data integrity, accuracy, and reliability. They prevent invalid data from being entered into the database. Constraints can be defined at column level or table level.",
      "details": [
        "NOT NULL: Column cannot store NULL values",
        "UNIQUE: All values in column must be distinct (NULLs are allowed â€” multiple NULLs OK in most DBs)",
        "PRIMARY KEY: Uniquely identifies each row; NOT NULL + UNIQUE; one per table",
        "FOREIGN KEY: Enforces referential integrity between tables",
        "CHECK: Validates that values meet a specified condition/expression",
        "DEFAULT: Provides a default value when no value is specified during INSERT",
        "AUTO_INCREMENT: Automatically generates sequential integers (MySQL); SERIAL in PostgreSQL",
        "Constraints can be named (CONSTRAINT name ...) for easier reference when dropping/altering"
],
      "example": "CREATE TABLE employees (\n    emp_id     INT            NOT NULL AUTO_INCREMENT,  -- NOT NULL + auto\n    emp_code   VARCHAR(10)    NOT NULL UNIQUE,          -- must be unique\n    name       VARCHAR(100)   NOT NULL,\n    dept_id    INT            NOT NULL,\n    salary     DECIMAL(10,2)  DEFAULT 30000.00,         -- default value\n    hire_date  DATE           DEFAULT (CURRENT_DATE),\n    age        INT            CHECK (age >= 18),         -- check constraint\n\n    -- Table-level constraints (preferred for compound constraints)\n    PRIMARY KEY (emp_id),\n\n    CONSTRAINT fk_dept\n        FOREIGN KEY (dept_id) REFERENCES departments(dept_id)\n        ON DELETE RESTRICT ON UPDATE CASCADE,\n\n    CONSTRAINT chk_salary\n        CHECK (salary BETWEEN 10000 AND 500000)\n);\n\n-- Violation examples:\nINSERT INTO employees (emp_code, name) VALUES ('E001', NULL);\n-- ERROR: Column 'name' cannot be null (NOT NULL violated)\n\nINSERT INTO employees (emp_code, name, dept_id) VALUES ('E001', 'Alice', 99);\n-- ERROR: Foreign key constraint fails (dept 99 doesn't exist)"
},
    "SQL Keys": {
      "explanation": "Keys are special constraints that identify rows uniquely or establish relationships between tables. Understanding keys is foundational to proper relational database design.",
      "details": [
        "Super Key: Any set of columns that uniquely identifies a row (may have extra columns)",
        "Candidate Key: Minimal super key â€” no column can be removed and still maintain uniqueness",
        "Primary Key: The chosen candidate key for the table â€” NOT NULL, UNIQUE, one per table",
        "Alternate Key: Candidate keys NOT chosen as primary key (they become UNIQUE constraints)",
        "Foreign Key: Column(s) in one table that reference the PRIMARY KEY of another table",
        "Composite Key: A key made of two or more columns (used when no single column is unique)",
        "Surrogate Key: An artificial key (auto-increment ID) with no business meaning â€” most common",
        "Natural Key: A key with real-world business meaning (e.g., SSN, email, ISBN)"
],
      "example": "-- Table: students\n-- Columns: student_id, ssn, email, name, phone\n\n-- Super Keys: {student_id}, {ssn}, {email}, {student_id, ssn}, {student_id, name}, ...\n-- Candidate Keys: {student_id}, {ssn}, {email}  -- each uniquely identifies a row\n-- Primary Key: {student_id}  -- chosen candidate key\n-- Alternate Keys: {ssn}, {email}  -- other candidate keys\n\nCREATE TABLE students (\n    student_id INT        PRIMARY KEY AUTO_INCREMENT,  -- surrogate PK\n    ssn        CHAR(11)   UNIQUE NOT NULL,             -- alternate key\n    email      VARCHAR(150) UNIQUE NOT NULL,            -- alternate key\n    name       VARCHAR(100) NOT NULL,\n    phone      VARCHAR(15)\n);\n\n-- Foreign Key example\nCREATE TABLE enrollments (\n    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,\n    student_id    INT NOT NULL,\n    course_id     INT NOT NULL,\n\n    -- Composite key (student can't enroll in same course twice)\n    UNIQUE (student_id, course_id),\n\n    FOREIGN KEY (student_id) REFERENCES students(student_id),\n    FOREIGN KEY (course_id)  REFERENCES courses(course_id)\n);"
}
}
},
  "Data Structures": {
  "icon": "ti-binary-tree",
  "color": "#7F77DD",
  "topics": {
    "Arrays": {
      "explanation": "An array is a collection of elements of the same type stored in contiguous memory locations. Provides O(1) access by index.",
      "details": [
        "Access: O(1); Search: O(n); Insert/Delete: O(n) at arbitrary position",
        "Static (fixed size) or dynamic (resizable like ArrayList)",
        "Memory address: base + index Ã— element_size"
],
      "example": "int[] arr = {10, 20, 30, 40, 50};\nint x = arr[2];    // O(1) â†’ 30\n\n// 2D array\nint[][] matrix = {{1,2,3},{4,5,6},{7,8,9}};\nint val = matrix[1][2];  // row 1, col 2 = 6"
},
    "Linked List": {
      "explanation": "A linked list connects nodes by pointers. Each node contains data and a reference to the next node. Dynamic size, efficient insertions/deletions.",
      "details": [
        "Singly linked: each node â†’ next",
        "Doubly linked: each node â†” prev and next",
        "Circular: last node â†’ first node",
        "No random access; must traverse from head"
],
      "example": "class Node { int data; Node next; }\n\n// Prepend: O(1)\nvoid prepend(int data) {\n    Node n = new Node(data);\n    n.next = head; head = n;\n}\n\n// Append: O(n)\nvoid append(int data) {\n    Node n = new Node(data);\n    Node curr = head;\n    while (curr.next != null) curr = curr.next;\n    curr.next = n;\n}"
},
    "Stack": {
      "explanation": "A stack is a LIFO (Last In, First Out) data structure. Elements are added and removed from the same end (top).",
      "details": [
        "Push O(1), Pop O(1), Peek O(1)",
        "Applications: undo/redo, browser back, expression evaluation, recursion"
],
      "example": "Stack<Integer> s = new Stack<>();\ns.push(10); s.push(20); s.push(30);\ns.pop();    // returns 30\ns.peek();   // returns 20 (no removal)\n\n// Balanced parentheses check using stack\n// \"{[()]}\" â†’ push opens, pop+check closes â†’ balanced!"
},
    "Queue": {
      "explanation": "A queue is a FIFO (First In, First Out) data structure. Elements are added at the rear and removed from the front.",
      "details": [
        "Enqueue O(1), Dequeue O(1)",
        "Applications: process scheduling, BFS, print queue",
        "Circular queue solves the wasted-front problem"
],
      "example": "Queue<Integer> q = new LinkedList<>();\nq.offer(10); q.offer(20); q.offer(30);\nq.poll();    // dequeue â†’ returns 10\nq.peek();    // view front â†’ returns 20\n\n// Circular queue: rear = (rear + 1) % capacity"
},
    "Hash Table": {
      "explanation": "A hash table stores key-value pairs with O(1) average lookup using a hash function to map keys to array indices.",
      "details": [
        "Hash function: maps key â†’ index",
        "Collision handling: chaining (linked list per bucket) or open addressing",
        "Load factor: n/m; typically keep < 0.75"
],
      "example": "HashMap<String, Integer> map = new HashMap<>();\nmap.put(\"Alice\", 90);\nmap.get(\"Alice\");                     // 90\nmap.getOrDefault(\"Carol\", 0);         // 0 if missing\nmap.containsKey(\"Alice\");             // true\n\nfor (Map.Entry<String,Integer> e : map.entrySet())\n    System.out.println(e.getKey() + \": \" + e.getValue());"
},
    "Binary Tree": {
      "explanation": "A binary tree is a hierarchical data structure where each node has at most two children (left and right). Root is the topmost node; leaves have no children.",
      "details": [
        "Traversals: Inorder (LNR), Preorder (NLR), Postorder (LRN), Level order (BFS)",
        "Height: longest path from root to leaf",
        "Complete binary tree: all levels full except last (filled left to right)"
],
      "example": "//      1\n//    /   \\\n//   2     3\n//  / \\\n// 4   5\n\n// Inorder (L-N-R):   4, 2, 5, 1, 3\n// Preorder (N-L-R):  1, 2, 4, 5, 3\n// Postorder (L-R-N): 4, 5, 2, 3, 1\n\nvoid inorder(TreeNode node) {\n    if (node == null) return;\n    inorder(node.left);\n    System.out.print(node.val + \" \");\n    inorder(node.right);\n}"
},
    "BST": {
      "explanation": "A Binary Search Tree (BST) is a binary tree where all left subtree values are smaller than the node and all right subtree values are larger.",
      "details": [
        "Search: O(h) â€” O(log n) balanced, O(n) worst case skewed",
        "Inorder traversal of BST gives sorted sequence",
        "Delete: 3 cases â€” leaf, one child, two children"
],
      "example": "//      5\n//    /   \\\n//   3     7\n//  / \\   / \\\n// 2   4  6   8\n\n// Search 6: 5 â†’ 7 â†’ 6 âœ“\n\nTreeNode insert(TreeNode node, int key) {\n    if (node == null) return new TreeNode(key);\n    if (key < node.val) node.left  = insert(node.left,  key);\n    else if (key > node.val) node.right = insert(node.right, key);\n    return node;\n}"
},
    "Graph": {
      "explanation": "A graph is a collection of vertices (nodes) connected by edges. Models networks, relationships, maps, and many real-world problems.",
      "details": [
        "Directed (digraph): edges have direction; Undirected: edges are bidirectional",
        "Weighted: edges have costs; Unweighted: equal edges",
        "Adjacency List O(V+E) space; Adjacency Matrix O(VÂ²) space"
],
      "example": "// Adjacency List (space-efficient)\nMap<Integer, List<Integer>> graph = new HashMap<>();\ngraph.put(0, Arrays.asList(1, 2));\ngraph.put(1, Arrays.asList(0, 3));\n\n// Adjacency Matrix\nint[][] matrix = {\n    {0, 1, 1, 0},  // 0 connects to 1, 2\n    {1, 0, 0, 1},  // 1 connects to 0, 3\n    {1, 0, 0, 0},\n    {0, 1, 0, 0}\n};"
},
    "Heap": {
      "explanation": "A heap is a complete binary tree satisfying the heap property. Max-heap: parent â‰¥ children. Min-heap: parent â‰¤ children.",
      "details": [
        "Insert O(log n), Extract-max/min O(log n), Peek O(1)",
        "Stored as array: parent at i, children at 2i+1 and 2i+2",
        "Used in: Heap Sort, Priority Queue, Dijkstra's algorithm"
],
      "example": "// Min-heap (Java)\nPriorityQueue<Integer> minHeap = new PriorityQueue<>();\nminHeap.offer(5); minHeap.offer(3); minHeap.offer(8);\nminHeap.peek();   // 3 (min)\nminHeap.poll();   // 3 (remove min)\n\n// Max-heap\nPriorityQueue<Integer> maxHeap =\n    new PriorityQueue<>(Collections.reverseOrder());\n\n// Array representation (Max-heap):\n// Index:  0   1   2   3   4\n// Value: [90, 80, 70, 60, 50]\n// Parent of i: (i-1)/2"
}
}
},
  "Algorithms": {
  "icon": "ti-sort-ascending",
  "color": "#BA7517",
  "topics": {
    "Binary Search": {
      "explanation": "Binary search finds an element in a sorted array by repeatedly halving the search space. Each comparison eliminates half of remaining candidates, giving O(log n) time. It is one of the most fundamental and widely applied algorithms in computer science.",
      "details": [
        "Precondition: input MUST be sorted â€” otherwise use linear scan O(n)",
        "At each step: compare middle element with target â†’ go left (smaller) or right (larger)",
        "Overflow-safe midpoint: mid = left + (right - left) / 2, NOT (left + right) / 2",
        "Time: O(log n) â€” 1 billion elements = at most 30 comparisons",
        "Space: O(1) iterative; O(log n) recursive (call stack)",
        "Template variants: find exact, find first occurrence, find last occurrence, find boundary (leftmost true)",
        "Left boundary pattern: when condition is true, narrow right â†’ finds leftmost valid position",
        "Right boundary pattern: when condition is true, narrow left â†’ finds rightmost valid position",
        "Real applications: searching in sorted arrays, finding sqrt(n), peak finding, rotated array search, answer-space BS",
        "Answer-space binary search: BS on the answer range when you can validate a candidate answer in O(n)"
],
      "example": "// â”€â”€ Standard Binary Search â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nint binarySearch(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;   // overflow-safe\n        if      (arr[mid] == target) return mid;\n        else if (arr[mid] <  target) left  = mid + 1;\n        else                         right = mid - 1;\n    }\n    return -1;\n}\n\n// Trace: arr=[2,4,6,8,10,12], target=8\n// left=0, right=5 â†’ mid=2 â†’ arr[2]=6 < 8 â†’ left=3\n// left=3, right=5 â†’ mid=4 â†’ arr[4]=10 > 8 â†’ right=3\n// left=3, right=3 â†’ mid=3 â†’ arr[3]=8 âœ“ return 3\n\n// â”€â”€ Find First Occurrence (Left Boundary) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nint firstOccurrence(int[] arr, int target) {\n    int left = 0, right = arr.length - 1, result = -1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) {\n            result = mid;         // record and keep searching left\n            right = mid - 1;\n        } else if (arr[mid] < target) left  = mid + 1;\n        else                          right = mid - 1;\n    }\n    return result;\n}\n// arr=[1,2,2,2,3], target=2 â†’ returns index 1\n\n// â”€â”€ Find Last Occurrence (Right Boundary) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nint lastOccurrence(int[] arr, int target) {\n    int left = 0, right = arr.length - 1, result = -1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) {\n            result = mid;\n            left = mid + 1;       // record and keep searching right\n        } else if (arr[mid] < target) left  = mid + 1;\n        else                          right = mid - 1;\n    }\n    return result;\n}\n\n// â”€â”€ Binary Search on Answer Space â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// \"Koko eating bananas\" â€” find min eating speed to finish in h hours\nint minEatingSpeed(int[] piles, int h) {\n    int left = 1, right = Arrays.stream(piles).max().getAsInt();\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        if (canFinish(piles, mid, h)) right = mid;   // valid, try slower\n        else                          left  = mid + 1; // too slow\n    }\n    return left;\n}\nboolean canFinish(int[] piles, int speed, int h) {\n    int hours = 0;\n    for (int p : piles) hours += Math.ceil((double) p / speed);\n    return hours <= h;\n}\n\n// â”€â”€ Binary Search on Rotated Array â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nint searchRotated(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[left] <= arr[mid]) {         // left half is sorted\n            if (arr[left] <= target && target < arr[mid]) right = mid - 1;\n            else                                           left  = mid + 1;\n        } else {                             // right half is sorted\n            if (arr[mid] < target && target <= arr[right]) left  = mid + 1;\n            else                                            right = mid - 1;\n        }\n    }\n    return -1;\n}\n\n// â”€â”€ Integer Square Root â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nint mySqrt(int x) {\n    if (x < 2) return x;\n    int left = 1, right = x / 2;\n    while (left <= right) {\n        long mid = left + (right - left) / 2;\n        if      (mid * mid == x) return (int) mid;\n        else if (mid * mid <  x) left  = (int) mid + 1;\n        else                     right = (int) mid - 1;\n    }\n    return right;   // floor of sqrt\n}"
},
    "Merge Sort": {
      "explanation": "Merge Sort uses the divide-and-conquer paradigm: split the array in half recursively until single elements, then merge sorted halves. It guarantees O(n log n) in all cases and is the algorithm of choice when stability is required or when sorting linked lists.",
      "details": [
        "Time: O(n log n) in ALL cases â€” best, average, and worst â€” unlike quicksort which degrades to O(nÂ²)",
        "Space: O(n) auxiliary for the temporary merged array",
        "Stable: equal elements preserve their original relative order â€” important for multi-key sorting",
        "Divide step: O(log n) recursive splits until single elements (trivially sorted)",
        "Conquer step: merge two sorted halves â€” each merge is O(n)",
        "Total work: log n levels Ã— O(n) per level = O(n log n)",
        "External sort: merge sort works when data doesn't fit in memory â€” merge sorted chunks from disk",
        "Linked lists: merge sort is optimal for linked lists (no random access needed, no extra space)",
        "Bottom-up merge sort: iterative version â€” merge pairs, then groups of 4, 8, 16... avoids recursion overhead",
        "Natural merge sort: exploits existing runs in data â€” nearly sorted input runs in O(n) (Timsort basis)",
        "Parallelizable: each half can be sorted independently on different threads"
],
      "example": "// â”€â”€ Standard Merge Sort â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nvoid mergeSort(int[] arr, int left, int right) {\n    if (left >= right) return;              // base case: single element\n    int mid = left + (right - left) / 2;\n    mergeSort(arr, left, mid);             // sort left half\n    mergeSort(arr, mid + 1, right);        // sort right half\n    merge(arr, left, mid, right);          // merge sorted halves\n}\n\nvoid merge(int[] arr, int left, int mid, int right) {\n    int[] temp = new int[right - left + 1];\n    int i = left, j = mid + 1, k = 0;\n\n    while (i <= mid && j <= right) {\n        if (arr[i] <= arr[j])   // <= ensures stability\n            temp[k++] = arr[i++];\n        else\n            temp[k++] = arr[j++];\n    }\n    while (i <= mid)  temp[k++] = arr[i++];  // remaining left\n    while (j <= right) temp[k++] = arr[j++]; // remaining right\n\n    for (int x = 0; x < temp.length; x++)\n        arr[left + x] = temp[x];\n}\n\n// Trace: [38, 27, 43, 3]\n// Split:  [38, 27] | [43, 3]\n// Split:  [38]|[27]  [43]|[3]\n// Merge:  [27, 38]   [3, 43]\n// Merge:  [3, 27, 38, 43] âœ“\n\n// â”€â”€ Count Inversions (classic merge sort application) â”€â”€â”€â”€â”€â”€â”€â”€\n// Inversion: arr[i] > arr[j] where i < j\n// Count inversions in arr = number of swaps bubble sort would make\nlong mergeCount(int[] arr, int left, int right) {\n    if (left >= right) return 0;\n    int mid = left + (right - left) / 2;\n    long count = mergeCount(arr, left, mid)\n               + mergeCount(arr, mid + 1, right);\n\n    int[] temp = new int[right - left + 1];\n    int i = left, j = mid + 1, k = 0;\n    while (i <= mid && j <= right) {\n        if (arr[i] <= arr[j])\n            temp[k++] = arr[i++];\n        else {\n            count += (mid - i + 1);   // all remaining left elements > arr[j]\n            temp[k++] = arr[j++];\n        }\n    }\n    while (i <= mid)   temp[k++] = arr[i++];\n    while (j <= right) temp[k++] = arr[j++];\n    for (int x = 0; x < temp.length; x++) arr[left + x] = temp[x];\n    return count;\n}\n\n// â”€â”€ Bottom-Up Merge Sort (iterative, no recursion) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nvoid mergeSortBottomUp(int[] arr) {\n    int n = arr.length;\n    for (int size = 1; size < n; size *= 2) {      // sizes: 1,2,4,8...\n        for (int left = 0; left < n - size; left += 2 * size) {\n            int mid   = left + size - 1;\n            int right = Math.min(left + 2 * size - 1, n - 1);\n            merge(arr, left, mid, right);\n        }\n    }\n}\n\n// â”€â”€ Merge K Sorted Arrays (extension) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// Use a min-heap to efficiently merge k sorted arrays\n// Time: O(N log k) where N = total elements, k = number of arrays\nimport java.util.PriorityQueue;\nint[] mergeKSorted(int[][] arrays) {\n    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n    int total = 0;\n    for (int i = 0; i < arrays.length; i++) {\n        if (arrays[i].length > 0) {\n            heap.offer(new int[]{arrays[i][0], i, 0});\n            total += arrays[i].length;\n        }\n    }\n    int[] result = new int[total];\n    int idx = 0;\n    while (!heap.isEmpty()) {\n        int[] curr = heap.poll();\n        result[idx++] = curr[0];\n        int arrIdx = curr[1], elemIdx = curr[2];\n        if (elemIdx + 1 < arrays[arrIdx].length)\n            heap.offer(new int[]{arrays[arrIdx][elemIdx+1], arrIdx, elemIdx+1});\n    }\n    return result;\n}"
},
    "Quick Sort": {
      "explanation": "Quick sort partitions the array around a pivot element such that all smaller elements are left and all larger elements are right, then recursively sorts each partition. It is the fastest sorting algorithm in practice due to excellent cache performance and low constant factors.",
      "details": [
        "Average: O(n log n); Worst: O(nÂ²) â€” occurs with sorted input + bad pivot (always first/last element)",
        "Space: O(log n) average for recursion stack; O(n) worst case",
        "NOT stable: equal elements may be reordered",
        "In-place: no auxiliary array needed (unlike merge sort)",
        "Cache-friendly: accesses memory sequentially â†’ excellent CPU cache performance",
        "Pivot strategies: first element (bad for sorted), last element (bad for sorted), random (good), median-of-3 (best)",
        "Lomuto partition: simpler to implement; Hoare partition: fewer swaps, slightly faster",
        "3-way partition (Dutch National Flag): handles duplicate elements efficiently â€” O(n) for all-same array",
        "Introsort: hybrid used in stdlib â€” quicksort + heapsort fallback when depth > 2 log n (avoids O(nÂ²))",
        "Tail call optimization: recurse on smaller partition first â†’ O(log n) stack space guaranteed"
],
      "example": "// â”€â”€ Lomuto Partition Scheme â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nvoid quickSort(int[] arr, int low, int high) {\n    if (low < high) {\n        int pi = partitionLomuto(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}\n\nint partitionLomuto(int[] arr, int low, int high) {\n    // Randomize pivot to avoid O(nÂ²) on sorted input\n    int randIdx = low + (int)(Math.random() * (high - low + 1));\n    swap(arr, randIdx, high);\n\n    int pivot = arr[high];\n    int i = low - 1;                    // boundary of smaller elements\n\n    for (int j = low; j < high; j++) {\n        if (arr[j] <= pivot) {\n            i++;\n            swap(arr, i, j);\n        }\n    }\n    swap(arr, i + 1, high);             // place pivot in correct position\n    return i + 1;\n}\n\n// â”€â”€ Hoare Partition (original, fewer swaps) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nint partitionHoare(int[] arr, int low, int high) {\n    int pivot = arr[low + (high - low) / 2];  // median element\n    int i = low - 1, j = high + 1;\n    while (true) {\n        do { i++; } while (arr[i] < pivot);\n        do { j--; } while (arr[j] > pivot);\n        if (i >= j) return j;\n        swap(arr, i, j);\n    }\n}\n\n// â”€â”€ 3-Way Partition (Dutch National Flag) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// Efficient when many duplicate elements exist\nvoid quickSort3Way(int[] arr, int low, int high) {\n    if (low >= high) return;\n    int pivot = arr[low + (int)(Math.random() * (high - low + 1))];\n    int lt = low, gt = high, i = low;\n\n    while (i <= gt) {\n        if      (arr[i] < pivot) swap(arr, lt++, i++);  // < pivot â†’ left zone\n        else if (arr[i] > pivot) swap(arr, i,  gt--);   // > pivot â†’ right zone\n        else                     i++;                     // == pivot â†’ middle zone\n    }\n    // arr[low..lt-1] < pivot; arr[lt..gt] == pivot; arr[gt+1..high] > pivot\n    quickSort3Way(arr, low, lt - 1);\n    quickSort3Way(arr, gt + 1, high);\n}\n\n// â”€â”€ Quickselect â€” Find Kth Smallest in O(n) average â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// Same partitioning idea, but only recurse on one side\nint quickSelect(int[] arr, int low, int high, int k) {\n    if (low == high) return arr[low];\n    int pi = partitionLomuto(arr, low, high);\n    if      (pi == k) return arr[pi];\n    else if (pi >  k) return quickSelect(arr, low,    pi - 1, k);\n    else              return quickSelect(arr, pi + 1, high,   k);\n}\n// Usage: quickSelect(arr, 0, n-1, k-1) â†’ kth smallest element\n\n// â”€â”€ Trace Example â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// arr = [3, 6, 8, 10, 1, 2, 1], pivot = 3 (Lomuto)\n// After partition: [1, 2, 1, 3, 8, 10, 6], pivot at index 3\n// Left: [1,2,1], Right: [8,10,6] â†’ sort recursively\n\nvoid swap(int[] arr, int i, int j) {\n    int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;\n}"
},
    "BFS": {
      "explanation": "Breadth-First Search (BFS) explores a graph level by level using a queue (FIFO). It visits all nodes at distance k before any node at distance k+1, making it the go-to algorithm for shortest path in unweighted graphs and level-order traversal.",
      "details": [
        "Data structure: Queue (FIFO) â€” nodes at distance k processed before distance k+1",
        "Time: O(V + E) â€” visits every vertex and edge once",
        "Space: O(V) â€” queue can hold all nodes at the widest level",
        "Guarantees shortest path (fewest edges) in unweighted graphs",
        "Dijkstra's = BFS with a priority queue for weighted graphs",
        "Level-order traversal of trees is BFS",
        "Multi-source BFS: enqueue all sources at start simultaneously â€” finds min distance from any source",
        "Bidirectional BFS: search from both source and destination, meet in middle â€” O(b^(d/2)) vs O(b^d)",
        "0-1 BFS: use deque instead of queue â€” front for cost-0 edges, back for cost-1 edges",
        "Applications: shortest path, web crawling, social network friend suggestions, flood fill, bipartite check",
        "Visited array: critical to prevent re-visiting nodes in cyclic graphs"
],
      "example": "import java.util.*;\n\n// â”€â”€ Standard BFS (Adjacency List) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nvoid bfs(Map<Integer, List<Integer>> graph, int start) {\n    Set<Integer> visited = new HashSet<>();\n    Queue<Integer> queue = new LinkedList<>();\n    visited.add(start);\n    queue.offer(start);\n\n    while (!queue.isEmpty()) {\n        int node = queue.poll();\n        System.out.print(node + \" \");\n        for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {\n            if (!visited.contains(neighbor)) {\n                visited.add(neighbor);\n                queue.offer(neighbor);\n            }\n        }\n    }\n}\n\n// â”€â”€ BFS with Shortest Distance â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nMap<Integer, Integer> shortestPath(Map<Integer, List<Integer>> graph, int src) {\n    Map<Integer, Integer> dist = new HashMap<>();\n    Queue<Integer> queue = new LinkedList<>();\n    dist.put(src, 0);\n    queue.offer(src);\n\n    while (!queue.isEmpty()) {\n        int node = queue.poll();\n        for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {\n            if (!dist.containsKey(neighbor)) {\n                dist.put(neighbor, dist.get(node) + 1);\n                queue.offer(neighbor);\n            }\n        }\n    }\n    return dist;  // dist.get(target) = shortest path length\n}\n\n// â”€â”€ Level-Order BFS (process level by level) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nList<List<Integer>> levelOrder(TreeNode root) {\n    List<List<Integer>> result = new ArrayList<>();\n    if (root == null) return result;\n    Queue<TreeNode> queue = new LinkedList<>();\n    queue.offer(root);\n\n    while (!queue.isEmpty()) {\n        int size = queue.size();   // nodes at current level\n        List<Integer> level = new ArrayList<>();\n        for (int i = 0; i < size; i++) {\n            TreeNode node = queue.poll();\n            level.add(node.val);\n            if (node.left  != null) queue.offer(node.left);\n            if (node.right != null) queue.offer(node.right);\n        }\n        result.add(level);\n    }\n    return result;\n}\n\n// â”€â”€ Multi-Source BFS (e.g., walls and gates) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nvoid wallsAndGates(int[][] rooms) {\n    int m = rooms.length, n = rooms[0].length;\n    Queue<int[]> queue = new LinkedList<>();\n\n    for (int i = 0; i < m; i++)            // enqueue all gates\n        for (int j = 0; j < n; j++)\n            if (rooms[i][j] == 0) queue.offer(new int[]{i, j});\n\n    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};\n    while (!queue.isEmpty()) {\n        int[] cell = queue.poll();\n        for (int[] d : dirs) {\n            int r = cell[0] + d[0], c = cell[1] + d[1];\n            if (r < 0 || r >= m || c < 0 || c >= n || rooms[r][c] != Integer.MAX_VALUE)\n                continue;\n            rooms[r][c] = rooms[cell[0]][cell[1]] + 1;\n            queue.offer(new int[]{r, c});\n        }\n    }\n}\n\n// â”€â”€ Bipartite Check via BFS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nboolean isBipartite(int[][] graph) {\n    int n = graph.length;\n    int[] color = new int[n];  // 0=unvisited, 1=red, -1=blue\n    for (int start = 0; start < n; start++) {\n        if (color[start] != 0) continue;\n        Queue<Integer> queue = new LinkedList<>();\n        queue.offer(start);\n        color[start] = 1;\n        while (!queue.isEmpty()) {\n            int node = queue.poll();\n            for (int neighbor : graph[node]) {\n                if (color[neighbor] == 0) {\n                    color[neighbor] = -color[node];\n                    queue.offer(neighbor);\n                } else if (color[neighbor] == color[node]) {\n                    return false;   // same color = not bipartite\n                }\n            }\n        }\n    }\n    return true;\n}\n\n// â”€â”€ 0-1 BFS (deque â€” mix of 0-cost and 1-cost edges) â”€â”€â”€â”€â”€â”€â”€â”€â”€\nint[] bfs01(int[][] graph, int[][] weights, int src, int n) {\n    int[] dist = new int[n];\n    Arrays.fill(dist, Integer.MAX_VALUE);\n    dist[src] = 0;\n    Deque<Integer> deque = new ArrayDeque<>();\n    deque.offerFirst(src);\n    while (!deque.isEmpty()) {\n        int node = deque.pollFirst();\n        for (int i = 0; i < graph[node].length; i++) {\n            int nb = graph[node][i], w = weights[node][i];\n            if (dist[node] + w < dist[nb]) {\n                dist[nb] = dist[node] + w;\n                if (w == 0) deque.offerFirst(nb);   // free edge â†’ front\n                else        deque.offerLast(nb);    // cost-1 edge â†’ back\n            }\n        }\n    }\n    return dist;\n}"
},
    "DFS": {
      "explanation": "Depth-First Search (DFS) explores as far as possible along each path before backtracking. It uses a stack (explicit or implicit via recursion) and is the foundation of many graph algorithms including cycle detection, topological sort, SCCs, and tree path problems.",
      "details": [
        "Data structure: Stack (explicit) or recursion call stack (implicit)",
        "Time: O(V + E); Space: O(V) for the recursion/stack depth",
        "Preorder: process node before children; Postorder: process after all children",
        "Tree traversals: Inorder (Left-Node-Right), Preorder (Node-Left-Right), Postorder (Left-Right-Node)",
        "Topological sort: DFS postorder on DAG â€” valid linear ordering of tasks with dependencies",
        "Cycle detection: track 'in-stack' nodes (gray) â€” back edge to gray node = cycle",
        "Connected components: run DFS from each unvisited node â€” count = number of components",
        "Strongly Connected Components (SCCs): Kosaraju's or Tarjan's algorithm â€” both use DFS",
        "Flood fill: DFS on 2D grid â€” paint connected region",
        "Backtracking: DFS with undo step â€” used for permutations, combinations, N-Queens, Sudoku",
        "Iterative DFS: use explicit stack; note different order than recursive DFS",
        "Bridge/articulation point detection: Tarjan's algorithm using discovery time and low values"
],
      "example": "import java.util.*;\n\n// â”€â”€ Recursive DFS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nvoid dfs(Map<Integer, List<Integer>> graph, int node, Set<Integer> visited) {\n    visited.add(node);\n    System.out.print(node + \" \");\n    for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {\n        if (!visited.contains(neighbor))\n            dfs(graph, neighbor, visited);\n    }\n}\n\n// â”€â”€ Iterative DFS (explicit stack) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nvoid dfsIterative(Map<Integer, List<Integer>> graph, int start) {\n    Set<Integer> visited = new HashSet<>();\n    Deque<Integer> stack = new ArrayDeque<>();\n    stack.push(start);\n    while (!stack.isEmpty()) {\n        int node = stack.pop();\n        if (visited.contains(node)) continue;\n        visited.add(node);\n        System.out.print(node + \" \");\n        for (int nb : graph.getOrDefault(node, new ArrayList<>()))\n            if (!visited.contains(nb)) stack.push(nb);\n    }\n}\n\n// â”€â”€ Topological Sort (DFS postorder) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nList<Integer> topoSort(Map<Integer, List<Integer>> graph, int n) {\n    Set<Integer> visited = new HashSet<>();\n    Deque<Integer> stack = new ArrayDeque<>();\n    for (int i = 0; i < n; i++)\n        if (!visited.contains(i))\n            topoHelper(graph, i, visited, stack);\n    List<Integer> order = new ArrayList<>(stack);\n    return order;\n}\nvoid topoHelper(Map<Integer, List<Integer>> g, int node,\n                Set<Integer> visited, Deque<Integer> stack) {\n    visited.add(node);\n    for (int nb : g.getOrDefault(node, new ArrayList<>()))\n        if (!visited.contains(nb)) topoHelper(g, nb, visited, stack);\n    stack.push(node);   // add to stack AFTER all descendants processed\n}\n\n// â”€â”€ Cycle Detection in Directed Graph â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nboolean hasCycle(Map<Integer, List<Integer>> graph, int n) {\n    Set<Integer> visited = new HashSet<>();\n    Set<Integer> inStack = new HashSet<>();  // gray nodes (in current path)\n    for (int i = 0; i < n; i++)\n        if (!visited.contains(i) && cycleHelper(graph, i, visited, inStack))\n            return true;\n    return false;\n}\nboolean cycleHelper(Map<Integer, List<Integer>> g, int node,\n                    Set<Integer> visited, Set<Integer> inStack) {\n    visited.add(node); inStack.add(node);\n    for (int nb : g.getOrDefault(node, new ArrayList<>())) {\n        if (!visited.contains(nb) && cycleHelper(g, nb, visited, inStack)) return true;\n        if (inStack.contains(nb)) return true;   // back edge = cycle!\n    }\n    inStack.remove(node);\n    return false;\n}\n\n// â”€â”€ Flood Fill (2D Grid DFS) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nvoid floodFill(int[][] image, int r, int c, int newColor) {\n    int original = image[r][c];\n    if (original == newColor) return;\n    fill(image, r, c, original, newColor);\n}\nvoid fill(int[][] img, int r, int c, int orig, int newColor) {\n    if (r < 0 || r >= img.length || c < 0 || c >= img[0].length) return;\n    if (img[r][c] != orig) return;\n    img[r][c] = newColor;\n    fill(img, r+1, c, orig, newColor);\n    fill(img, r-1, c, orig, newColor);\n    fill(img, r, c+1, orig, newColor);\n    fill(img, r, c-1, orig, newColor);\n}\n\n// â”€â”€ Number of Islands â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nint numIslands(char[][] grid) {\n    int count = 0;\n    for (int r = 0; r < grid.length; r++)\n        for (int c = 0; c < grid[0].length; c++)\n            if (grid[r][c] == '1') { sink(grid, r, c); count++; }\n    return count;\n}\nvoid sink(char[][] grid, int r, int c) {\n    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;\n    grid[r][c] = '0';   // sink visited land\n    sink(grid, r+1, c); sink(grid, r-1, c);\n    sink(grid, r, c+1); sink(grid, r, c-1);\n}\n\n// â”€â”€ Backtracking Template (e.g., Permutations) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nList<List<Integer>> permutations(int[] nums) {\n    List<List<Integer>> result = new ArrayList<>();\n    backtrack(nums, new ArrayList<>(), new boolean[nums.length], result);\n    return result;\n}\nvoid backtrack(int[] nums, List<Integer> current, boolean[] used, List<List<Integer>> result) {\n    if (current.size() == nums.length) {\n        result.add(new ArrayList<>(current)); return;\n    }\n    for (int i = 0; i < nums.length; i++) {\n        if (used[i]) continue;\n        used[i] = true;\n        current.add(nums[i]);\n        backtrack(nums, current, used, result);  // recurse\n        current.remove(current.size() - 1);      // UNDO (backtrack)\n        used[i] = false;\n    }\n}"
},
    "Dynamic Programming": {
      "explanation": "Dynamic Programming (DP) solves complex optimization problems by breaking them into overlapping subproblems, solving each subproblem exactly once, and storing results. The key insight: optimal solution uses optimal solutions of subproblems.",
      "details": [
        "Two required properties: (1) Optimal substructure â€” optimal solution built from optimal subproblems; (2) Overlapping subproblems â€” same subproblems solved multiple times",
        "Memoization (top-down): write recursive solution, add a cache â€” problems are only solved when first needed",
        "Tabulation (bottom-up): iteratively fill a table from base cases â€” no recursion overhead, cache-friendly",
        "State design: what minimum information uniquely identifies a subproblem? This defines your DP state",
        "Recurrence relation: express current state in terms of smaller states â€” the heart of DP",
        "Space optimization: often only need previous row/column, reducing space from O(nÂ²) to O(n)",
        "1D DP: Fibonacci, climbing stairs, house robber, coin change, word break",
        "2D DP: knapsack, longest common subsequence, edit distance, matrix chain multiplication",
        "Interval DP: burst balloons, palindrome partitioning â€” solve subarrays, build up to full array",
        "Bitmask DP: subset states â€” travelling salesman problem, assignment problem with n â‰¤ 20",
        "DP on trees: rerooting technique â€” compute DP both from root and reroot for each node",
        "Pattern: if problem asks 'max/min/count' of something with 'choices', think DP"
],
      "example": "// â”€â”€ Fibonacci (memoization vs tabulation) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// Naive recursive: O(2^n) â€” recalculates same values exponentially\n// With memoization: O(n)\nMap<Integer, Long> memo = new HashMap<>();\nlong fibMemo(int n) {\n    if (n <= 1) return n;\n    if (memo.containsKey(n)) return memo.get(n);\n    long result = fibMemo(n-1) + fibMemo(n-2);\n    memo.put(n, result);\n    return result;\n}\n\n// Tabulation (bottom-up):\nlong fibTab(int n) {\n    if (n <= 1) return n;\n    long[] dp = new long[n+1];\n    dp[0] = 0; dp[1] = 1;\n    for (int i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];\n    return dp[n];\n}\n\n// Space-optimized (O(1) space):\nlong fibOpt(int n) {\n    long a = 0, b = 1;\n    for (int i = 2; i <= n; i++) { long c = a + b; a = b; b = c; }\n    return b;\n}\n\n// â”€â”€ 0/1 Knapsack â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// State: dp[i][w] = max value using first i items with capacity w\n// Choice: take item i (if fits) or skip it\nint knapsack(int[] val, int[] weight, int W) {\n    int n = val.length;\n    int[][] dp = new int[n+1][W+1];\n    for (int i = 1; i <= n; i++)\n        for (int w = 0; w <= W; w++)\n            if (weight[i-1] <= w)\n                dp[i][w] = Math.max(dp[i-1][w],\n                                    val[i-1] + dp[i-1][w - weight[i-1]]);\n            else\n                dp[i][w] = dp[i-1][w];\n    return dp[n][W];\n}\n\n// â”€â”€ Longest Common Subsequence (LCS) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// State: dp[i][j] = LCS of s1[0..i-1] and s2[0..j-1]\nint lcs(String s1, String s2) {\n    int m = s1.length(), n = s2.length();\n    int[][] dp = new int[m+1][n+1];\n    for (int i = 1; i <= m; i++)\n        for (int j = 1; j <= n; j++)\n            if (s1.charAt(i-1) == s2.charAt(j-1))\n                dp[i][j] = 1 + dp[i-1][j-1];\n            else\n                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n    return dp[m][n];\n}\n\n// â”€â”€ Edit Distance (Levenshtein) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// Min operations (insert, delete, replace) to convert s1 â†’ s2\nint editDistance(String s1, String s2) {\n    int m = s1.length(), n = s2.length();\n    int[][] dp = new int[m+1][n+1];\n    for (int i = 0; i <= m; i++) dp[i][0] = i;     // delete all of s1\n    for (int j = 0; j <= n; j++) dp[0][j] = j;     // insert all of s2\n    for (int i = 1; i <= m; i++)\n        for (int j = 1; j <= n; j++)\n            if (s1.charAt(i-1) == s2.charAt(j-1))\n                dp[i][j] = dp[i-1][j-1];            // no operation\n            else\n                dp[i][j] = 1 + Math.min(dp[i-1][j-1],      // replace\n                            Math.min(dp[i-1][j],             // delete\n                                     dp[i][j-1]));           // insert\n\n    return dp[m][n];\n}\n\n// â”€â”€ Coin Change (min coins to make amount) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// State: dp[amount] = min coins to make this amount\n// Recurrence: dp[a] = 1 + min(dp[a - coin]) for all coins\nint coinChange(int[] coins, int amount) {\n    int[] dp = new int[amount + 1];\n    Arrays.fill(dp, amount + 1);   // initialize to \"infinity\"\n    dp[0] = 0;\n    for (int a = 1; a <= amount; a++)\n        for (int coin : coins)\n            if (coin <= a) dp[a] = Math.min(dp[a], 1 + dp[a - coin]);\n    return dp[amount] > amount ? -1 : dp[amount];\n}\n\n// â”€â”€ Longest Increasing Subsequence (LIS) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// O(nÂ²) DP\nint lis(int[] nums) {\n    int n = nums.length;\n    int[] dp = new int[n];\n    Arrays.fill(dp, 1);    // each element is LIS of length 1\n    for (int i = 1; i < n; i++)\n        for (int j = 0; j < i; j++)\n            if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);\n    return Arrays.stream(dp).max().getAsInt();\n}\n\n// O(n log n) using patience sorting + binary search\nint lisOptimal(int[] nums) {\n    List<Integer> tails = new ArrayList<>();\n    for (int num : nums) {\n        int pos = Collections.binarySearch(tails, num);\n        if (pos < 0) pos = -(pos + 1);\n        if (pos == tails.size()) tails.add(num);\n        else tails.set(pos, num);\n    }\n    return tails.size();\n}"
},
    "Big O Notation": {
      "explanation": "Big O notation describes the asymptotic upper bound of an algorithm's time or space complexity as input size n grows toward infinity. It captures the dominant term while ignoring constants and lower-order terms, enabling comparison of algorithms independent of hardware.",
      "details": [
        "Formal definition: f(n) = O(g(n)) if âˆƒ c, nâ‚€ such that f(n) â‰¤ cÂ·g(n) for all n > nâ‚€",
        "Drop constants: 5n â†’ O(n); 100 â†’ O(1); 3nÂ² + 2n + 7 â†’ O(nÂ²)",
        "Drop lower-order: O(nÂ² + n) = O(nÂ²); O(n log n + n) = O(n log n)",
        "O(1): constant â€” array index, hash map lookup, stack push/pop",
        "O(log n): logarithmic â€” binary search, balanced BST ops, divide-and-conquer with no combination work",
        "O(n): linear â€” single loop, linear scan, BFS/DFS",
        "O(n log n): linearithmic â€” merge sort, heap sort, FFT; optimal comparison sort lower bound",
        "O(nÂ²): quadratic â€” nested loops, bubble/selection/insertion sort, naive string matching",
        "O(nÂ³): cubic â€” naive matrix multiplication, Floyd-Warshall, some DP",
        "O(2â¿): exponential â€” all subsets, recursive fib without memo, some backtracking",
        "O(n!): factorial â€” all permutations, brute force TSP",
        "Î© (Big Omega): lower bound (best case); Î˜ (Theta): tight bound (best = worst case); O: upper bound (worst case)",
        "Amortized analysis: average cost per operation over a sequence (dynamic array append = O(1) amortized)",
        "Space complexity: accounts for additional memory used, excluding input (or including it â€” specify)"
],
      "example": "// â”€â”€ Complexity Examples â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n\n// O(1) â€” constant time: doesn't depend on input size\nint getFirst(int[] arr) { return arr[0]; }\nmap.get(key);   // HashMap average case\n\n// O(log n) â€” each step halves the problem\nint binarySearch(int[] arr, int t) { ... }  // see Binary Search\nheight of balanced BST with n nodes = O(log n)\n\n// O(n) â€” single pass through input\nint sum(int[] arr) {\n    int s = 0;\n    for (int x : arr) s += x;  // one loop\n    return s;\n}\n\n// O(n log n) â€” divide n times, each level is O(n)\nmergeSort(arr);       // guaranteed\nArrays.sort(arr);     // TimSort (hybrid merge + insertion)\n\n// O(nÂ²) â€” nested loops\nvoid bubbleSort(int[] arr) {\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n-i-1; j++)  // nested loop\n            if (arr[j] > arr[j+1]) swap(arr, j, j+1);\n}\n\n// O(nÂ³) â€” triple nested loop\nvoid matMul(int[][] A, int[][] B, int[][] C, int n) {\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n; j++)\n            for (int k = 0; k < n; k++)\n                C[i][j] += A[i][k] * B[k][j];\n}\n\n// O(2^n) â€” branches double each level\nint fibNaive(int n) {\n    if (n <= 1) return n;\n    return fibNaive(n-1) + fibNaive(n-2);  // 2 recursive calls\n}\n\n// O(n!) â€” generates all orderings\nvoid permutations(int[] arr, int start) {\n    if (start == arr.length) { print(arr); return; }\n    for (int i = start; i < arr.length; i++) {\n        swap(arr, start, i);\n        permutations(arr, start + 1);  // n Ã— (n-1) Ã— (n-2)... paths\n        swap(arr, start, i);\n    }\n}\n\n// â”€â”€ Identifying Complexity â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// One loop = O(n)\n// Loop inside loop = O(nÂ²)\n// Divide by 2 each step = O(log n)\n// Loop + divide = O(n log n)\n// Recursive with 2 branches, halving = O(n) [binary tree = 2n nodes]\n// Recursive with 2 branches, same size = O(2^n)\n\n// â”€â”€ Amortized Analysis â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// Dynamic array (ArrayList): most appends are O(1)\n// Occasionally doubles capacity = O(n) copy\n// Over n appends: total work = n + n/2 + n/4 + ... â‰ˆ 2n = O(n)\n// Amortized per append = O(n)/n = O(1)\n\n// â”€â”€ Space Complexity â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// Merge sort: O(n) aux space for temp array\n// In-place quicksort: O(log n) stack space\n// BFS: O(n) for visited + queue\n// DFS recursive: O(h) stack, h = height of tree/graph\n// DP knapsack: O(nW); space-optimized 1D = O(W)\n\n// â”€â”€ Common Sorting Complexities â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// Algorithm       Best        Average     Worst       Space   Stable?\n// Bubble Sort     O(n)        O(nÂ²)       O(nÂ²)       O(1)    Yes\n// Selection Sort  O(nÂ²)       O(nÂ²)       O(nÂ²)       O(1)    No\n// Insertion Sort  O(n)        O(nÂ²)       O(nÂ²)       O(1)    Yes\n// Merge Sort      O(n log n)  O(n log n)  O(n log n)  O(n)    Yes\n// Quick Sort      O(n log n)  O(n log n)  O(nÂ²)       O(log n) No\n// Heap Sort       O(n log n)  O(n log n)  O(n log n)  O(1)    No\n// Tim Sort        O(n)        O(n log n)  O(n log n)  O(n)    Yes"
},
    "Recursion": {
      "explanation": "Recursion is a problem-solving technique where a function calls itself on a smaller version of the problem. Every recursive solution requires a base case (termination condition) and a recursive case (reduce problem size). Recursion maps naturally to problems with self-similar structure: trees, fractals, divide-and-conquer.",
      "details": [
        "Base case: condition that stops recursion â€” MUST be reached for every input path",
        "Recursive case: problem must shrink toward the base case each call",
        "Call stack: each call pushes a new stack frame with local variables; popped on return",
        "Stack overflow: default max depth is ~1000â€“10000 calls; deep recursion crashes",
        "Head recursion: recursive call before processing (top-down); Tail recursion: call after processing",
        "Tail call optimization (TCO): compiler replaces tail recursion with iteration â€” no stack growth; Java doesn't support TCO, Scala/Haskell do",
        "Mutual recursion: function A calls B which calls A â€” ensure base cases cover both",
        "Memoization: cache return values to avoid recomputing â€” transforms tree recursion to linear",
        "Recurrence relations: T(n) = aT(n/b) + f(n) â€” Master Theorem solves these",
        "Master Theorem: if T(n) = aT(n/b) + O(n^d) â†’ O(n^d) if d>log_b(a), O(n^d log n) if equal, O(n^log_b(a)) if less",
        "Tree recursion: each call spawns multiple sub-calls â€” visualize as a tree; depth = stack depth",
        "When to use recursion: tree/graph traversal, divide-and-conquer, backtracking, mathematical induction-style proofs"
],
      "example": "// â”€â”€ Basic Examples â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// Factorial â€” linear recursion\nint factorial(int n) {\n    if (n == 0) return 1;           // BASE CASE\n    return n * factorial(n - 1);    // RECURSIVE CASE: shrinks toward 0\n}\n// factorial(4) call stack:\n// factorial(4) â†’ 4 Ã— factorial(3)\n//   factorial(3) â†’ 3 Ã— factorial(2)\n//     factorial(2) â†’ 2 Ã— factorial(1)\n//       factorial(1) â†’ 1 Ã— factorial(0)\n//         factorial(0) â†’ 1  â† base case\n// Unwinds: 1â†’1â†’2â†’6â†’24\n\n// â”€â”€ Fibonacci (tree recursion â€” exponential without memo) â”€â”€â”€â”€â”€\nint fib(int n) {\n    if (n <= 1) return n;\n    return fib(n-1) + fib(n-2);   // TWO recursive calls = tree shape\n}\n// fib(5) spawns fib(4)+fib(3), each spawns more... = O(2^n)\n// With @memoization = O(n)\n\n// â”€â”€ Power Function (divide-and-conquer recursion) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\ndouble myPow(double x, int n) {\n    if (n == 0) return 1.0;\n    if (n < 0) { x = 1/x; n = -n; }\n    double half = myPow(x, n/2);\n    return n % 2 == 0 ? half * half : half * half * x;\n}\n// O(log n) instead of O(n) â€” halves the problem each time\n\n// â”€â”€ Tower of Hanoi: T(n) = 2T(n-1) + 1 â†’ O(2^n) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nvoid hanoi(int n, char from, char to, char aux) {\n    if (n == 1) {\n        System.out.println(from + \" â†’ \" + to);\n        return;\n    }\n    hanoi(n-1, from, aux, to);   // move n-1 disks to aux\n    System.out.println(from + \" â†’ \" + to); // move biggest disk\n    hanoi(n-1, aux, to, from);  // move n-1 disks from aux to to\n}\n// hanoi(3, A, C, B):\n// Aâ†’C, Aâ†’B, Câ†’B, Aâ†’C, Bâ†’A, Bâ†’C, Aâ†’C (7 moves = 2Â³-1)\n\n// â”€â”€ Tree Traversals (pure recursion) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nvoid inorder(TreeNode node) {   // Left â†’ Node â†’ Right\n    if (node == null) return;\n    inorder(node.left);\n    System.out.print(node.val + \" \");\n    inorder(node.right);\n}\nvoid preorder(TreeNode node) {  // Node â†’ Left â†’ Right\n    if (node == null) return;\n    System.out.print(node.val + \" \");\n    preorder(node.left);\n    preorder(node.right);\n}\nint height(TreeNode node) {     // max depth of tree\n    if (node == null) return 0;\n    return 1 + Math.max(height(node.left), height(node.right));\n}\n\n// â”€â”€ Generate Subsets (power set) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nList<List<Integer>> subsets(int[] nums) {\n    List<List<Integer>> result = new ArrayList<>();\n    generateSubsets(nums, 0, new ArrayList<>(), result);\n    return result;\n}\nvoid generateSubsets(int[] nums, int idx, List<Integer> current, List<List<Integer>> result) {\n    result.add(new ArrayList<>(current));   // always add current subset\n    for (int i = idx; i < nums.length; i++) {\n        current.add(nums[i]);                // choose\n        generateSubsets(nums, i+1, current, result); // explore\n        current.remove(current.size()-1);   // unchoose (backtrack)\n    }\n}\n\n// â”€â”€ Tail Recursion (optimize to iteration) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// Tail recursive factorial (accumulator pattern):\nint factTail(int n, int acc) {\n    if (n == 0) return acc;\n    return factTail(n-1, n * acc);   // tail call â€” last operation\n}\n// Equivalent iterative:\nint factIter(int n) {\n    int acc = 1;\n    while (n > 0) { acc *= n; n--; }\n    return acc;\n}"
},
    "Greedy Algorithms": {
      "explanation": "Greedy algorithms build solutions piece by piece, always choosing the locally optimal option at each step. They work when the 'greedy choice property' holds: a locally optimal choice leads to a globally optimal solution. They are simpler and faster than DP but don't always work.",
      "details": [
        "Greedy choice property: a locally optimal choice is always part of some globally optimal solution",
        "Optimal substructure: optimal solution to problem contains optimal solutions to subproblems (shared with DP)",
        "Key distinction from DP: greedy commits to one choice and never revisits; DP explores all choices",
        "Proving correctness: use 'greedy stays ahead' or 'exchange argument' â€” assume optimal differs, show you can swap to greedy",
        "Activity selection: sort by finish time, always pick earliest finishing compatible activity",
        "Fractional knapsack: sort by value/weight ratio, take greedily â€” works because fractions allowed",
        "0/1 knapsack: greedy FAILS â€” must use DP (can't take fractions, greedy choice may be suboptimal)",
        "Huffman encoding: build optimal prefix-free code â€” greedy via min-heap, optimal for lossless compression",
        "Coin change with standard coins: greedy works; with arbitrary denominations, use DP",
        "Minimum spanning tree: Kruskal's (sort edges, add if no cycle) and Prim's (grow from start) are both greedy",
        "Dijkstra's shortest path: greedy â€” always expand the unvisited node with minimum distance",
        "Interval scheduling maximization vs minimization: greedy sort differs (finish time vs start time)"
],
      "example": "import java.util.*;\n\n// â”€â”€ Activity Selection (max non-overlapping intervals) â”€â”€â”€â”€â”€â”€â”€â”€\n// Greedy: sort by finish time, pick if compatible (start >= last finish)\nint activitySelection(int[][] intervals) {\n    Arrays.sort(intervals, (a, b) -> a[1] - b[1]);  // sort by finish time\n    int count = 1, lastFinish = intervals[0][1];\n    for (int i = 1; i < intervals.length; i++) {\n        if (intervals[i][0] >= lastFinish) {    // no overlap\n            count++;\n            lastFinish = intervals[i][1];\n        }\n    }\n    return count;\n}\n// intervals: [[1,4],[3,5],[0,6],[5,7],[5,9],[8,9]]\n// sorted by finish: [[1,4],[3,5],[0,6],[5,7],[5,9],[8,9]]\n// pick [1,4] â†’ lastFinish=4\n// skip [3,5] (3<4), skip [0,6] (0<4)\n// pick [5,7] â†’ lastFinish=7\n// skip [5,9] (5<7)\n// pick [8,9] â†’ count=3 âœ“\n\n// â”€â”€ Meeting Rooms II (min rooms needed) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// Greedy: sort start times, use min-heap of end times\nint minMeetingRooms(int[][] intervals) {\n    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);\n    PriorityQueue<Integer> heap = new PriorityQueue<>();  // end times\n    for (int[] i : intervals) {\n        if (!heap.isEmpty() && heap.peek() <= i[0])\n            heap.poll();   // reuse the room that just freed up\n        heap.offer(i[1]);  // allocate room ending at i[1]\n    }\n    return heap.size();    // rooms in use = answer\n}\n\n// â”€â”€ Huffman Encoding â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// Build optimal variable-length prefix-free codes\n// Chars with higher frequency = shorter codes\nclass HuffmanNode implements Comparable<HuffmanNode> {\n    char ch; int freq;\n    HuffmanNode left, right;\n    public int compareTo(HuffmanNode o) { return this.freq - o.freq; }\n}\n\nHuffmanNode buildHuffman(char[] chars, int[] freqs) {\n    PriorityQueue<HuffmanNode> pq = new PriorityQueue<>();\n    for (int i = 0; i < chars.length; i++) {\n        HuffmanNode node = new HuffmanNode();\n        node.ch = chars[i]; node.freq = freqs[i];\n        pq.offer(node);\n    }\n    while (pq.size() > 1) {\n        HuffmanNode left = pq.poll(), right = pq.poll();\n        HuffmanNode parent = new HuffmanNode();\n        parent.freq = left.freq + right.freq;\n        parent.left = left; parent.right = right;\n        pq.offer(parent);\n    }\n    return pq.poll();  // root of Huffman tree\n}\n// Example: a=5, b=9, c=12, d=13, e=16, f=45\n// f=45 (0), c=12 (100), d=13 (101), a=5 (1100), b=9 (1101), e=16 (111)\n// Total bits = 224 (vs 288 for fixed 3-bit encoding)\n\n// â”€â”€ Dijkstra's Algorithm (greedy shortest path) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nint[] dijkstra(int[][] graph, int src) {\n    int n = graph.length;\n    int[] dist = new int[n];\n    Arrays.fill(dist, Integer.MAX_VALUE);\n    dist[src] = 0;\n\n    // [distance, node]\n    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> a[0]-b[0]);\n    pq.offer(new int[]{0, src});\n\n    while (!pq.isEmpty()) {\n        int[] curr = pq.poll();\n        int d = curr[0], u = curr[1];\n        if (d > dist[u]) continue;   // stale entry\n        for (int v = 0; v < n; v++) {\n            if (graph[u][v] > 0 && dist[u] + graph[u][v] < dist[v]) {\n                dist[v] = dist[u] + graph[u][v];\n                pq.offer(new int[]{dist[v], v});\n            }\n        }\n    }\n    return dist;\n}\n\n// â”€â”€ When Greedy FAILS â†’ Use DP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// Coin change with coins [1, 3, 4], amount = 6:\n// Greedy: 4 + 1 + 1 = 3 coins\n// DP: 3 + 3 = 2 coins â† BETTER\n// Greedy chose 4 greedily but missed the optimal [3,3]\n\n// â”€â”€ Fractional Knapsack (greedy works) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\ndouble fractionalKnapsack(int W, int[] val, int[] wt) {\n    int n = val.length;\n    Integer[] idx = new Integer[n];\n    for (int i = 0; i < n; i++) idx[i] = i;\n    Arrays.sort(idx, (a, b) -> Double.compare((double)val[b]/wt[b], (double)val[a]/wt[a]));\n\n    double total = 0; int remaining = W;\n    for (int i : idx) {\n        if (remaining == 0) break;\n        int take = Math.min(wt[i], remaining);\n        total += (double) take / wt[i] * val[i];\n        remaining -= take;\n    }\n    return total;\n}"
},
    "Two Pointers & Sliding Window": {
      "explanation": "Two Pointers and Sliding Window are linear-time techniques that replace O(nÂ²) nested loops. Two pointers use two indices moving through data; sliding window maintains a subarray of variable or fixed size by expanding/shrinking from both ends.",
      "details": [
        "Two pointers â€” opposite ends: start at both ends, move inward (e.g., two-sum sorted, container with most water)",
        "Two pointers â€” same direction: fast/slow pointers for linked list cycles, removing duplicates",
        "Sliding window â€” fixed size: maintain window of size k, slide one element at a time",
        "Sliding window â€” variable size: expand right to include, shrink left when condition violated",
        "Key insight: avoids recomputing entire window each step by subtracting outgoing, adding incoming element",
        "Time: O(n) â€” each element enters and leaves the window at most once",
        "Applications: longest substring without repeats, min window substring, max sum subarray, trapping rain water"
],
      "example": "// â”€â”€ Two Sum in Sorted Array (opposite pointers) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nint[] twoSum(int[] nums, int target) {\n    int left = 0, right = nums.length - 1;\n    while (left < right) {\n        int sum = nums[left] + nums[right];\n        if      (sum == target) return new int[]{left, right};\n        else if (sum <  target) left++;\n        else                    right--;\n    }\n    return new int[]{-1, -1};\n}\n\n// â”€â”€ Linked List Cycle (Floyd's fast/slow) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nboolean hasCycle(ListNode head) {\n    ListNode slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow == fast) return true;   // they meet inside cycle\n    }\n    return false;\n}\n\n// â”€â”€ Max Sum Subarray of size k (fixed window) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nint maxSumK(int[] arr, int k) {\n    int windowSum = 0;\n    for (int i = 0; i < k; i++) windowSum += arr[i];  // first window\n    int maxSum = windowSum;\n    for (int i = k; i < arr.length; i++) {\n        windowSum += arr[i] - arr[i - k];   // slide: add right, remove left\n        maxSum = Math.max(maxSum, windowSum);\n    }\n    return maxSum;\n}\n\n// â”€â”€ Longest Substring Without Repeating (variable window) â”€â”€â”€â”€\nint lengthOfLongestSubstring(String s) {\n    Map<Character, Integer> map = new HashMap<>();\n    int left = 0, maxLen = 0;\n    for (int right = 0; right < s.length(); right++) {\n        char c = s.charAt(right);\n        if (map.containsKey(c) && map.get(c) >= left)\n            left = map.get(c) + 1;   // shrink: move past the duplicate\n        map.put(c, right);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}\n\n// â”€â”€ Container With Most Water â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nint maxArea(int[] height) {\n    int left = 0, right = height.length - 1, max = 0;\n    while (left < right) {\n        int area = Math.min(height[left], height[right]) * (right - left);\n        max = Math.max(max, area);\n        if (height[left] < height[right]) left++;   // move shorter side\n        else                              right--;\n    }\n    return max;\n}"
}
}
},
  "OOPs": {
  "icon": "ti-box",
  "color": "#D85A30",
  "topics": {
    "Class": {
      "explanation": "A class is a blueprint or template for creating objects. It defines attributes (data members) and methods (functions) that objects of the class will have.",
      "details": [
        "Class defines the structure; object is an instance",
        "Members: fields (attributes), methods, constructors",
        "Access modifiers control visibility: public, private, protected",
        "static members belong to class, not individual instances"
],
      "example": "public class BankAccount {\n    private String owner;\n    private double balance;\n    private static int count = 0;\n\n    public BankAccount(String owner, double initial) {\n        this.owner = owner;\n        this.balance = initial;\n        count++;\n    }\n\n    public void deposit(double amount) {\n        if (amount > 0) balance += amount;\n    }\n\n    public double getBalance() { return balance; }\n    public static int getCount() { return count; }\n}\n\nBankAccount acc = new BankAccount(\"Alice\", 1000);\nacc.deposit(500);\nSystem.out.println(acc.getBalance()); // 1500"
},
    "Encapsulation": {
      "explanation": "Encapsulation bundles data (attributes) and methods that operate on the data into a single unit (class), and restricts direct access to internal data.",
      "details": [
        "Private fields: accessed only within the class",
        "Public getters/setters: controlled access with validation",
        "Benefits: data validation, flexibility, security",
        "Follows the 'tell, don't ask' principle"
],
      "example": "class Person {\n    private int age;\n    private String name;\n\n    public int getAge() { return age; }\n\n    public void setAge(int age) {\n        if (age < 0 || age > 150)\n            throw new IllegalArgumentException(\"Invalid age\");\n        this.age = age;\n    }\n\n    public void setName(String name) {\n        if (name == null || name.isEmpty())\n            throw new IllegalArgumentException(\"Name cannot be empty\");\n        this.name = name;\n    }\n}"
},
    "Inheritance": {
      "explanation": "Inheritance allows a child class to inherit properties and methods from a parent class. Promotes code reuse and establishes IS-A relationships.",
      "details": [
        "extends keyword in Java; : in C++",
        "super keyword: access parent class members",
        "Method overriding: child redefines parent method",
        "Single inheritance (Java classes), Multiple (Java interfaces, C++)"
],
      "example": "class Animal {\n    protected String name;\n    public Animal(String name) { this.name = name; }\n    public void makeSound() { System.out.println(\"...\"); }\n    public void eat()       { System.out.println(name + \" is eating\"); }\n}\n\nclass Dog extends Animal {\n    public Dog(String name) { super(name); }\n\n    @Override\n    public void makeSound() { System.out.println(name + \": Woof!\"); }\n\n    public void fetch() { System.out.println(name + \" fetches!\"); }\n}\n\nDog d = new Dog(\"Rex\");\nd.makeSound();  // Rex: Woof! (overridden)\nd.eat();        // Rex is eating (inherited)"
},
    "Polymorphism": {
      "explanation": "Polymorphism means 'many forms' â€” the ability of different objects to respond to the same method call in different ways.",
      "details": [
        "Runtime (dynamic): method overriding + upcasting",
        "Compile-time (static): method overloading",
        "Dynamic dispatch: JVM calls correct version at runtime"
],
      "example": "// Runtime polymorphism\nAnimal[] animals = {new Dog(\"Rex\"), new Cat(\"Whiskers\")};\nfor (Animal a : animals) a.makeSound();\n// Rex: Woof! / Whiskers: Meow!\n\n// Compile-time (overloading)\nclass Calculator {\n    int    add(int a, int b)       { return a + b; }\n    double add(double a, double b) { return a + b; }\n    String add(String a, String b) { return a + b; }\n}\n// Java picks the right add() based on argument types"
},
    "Abstract Classes": {
      "explanation": "An abstract class cannot be instantiated directly. It may contain abstract methods (no body) that subclasses must implement, plus concrete methods.",
      "details": [
        "abstract keyword in Java",
        "Can have constructors, fields, concrete methods",
        "Cannot instantiate abstract class directly",
        "Use when you want enforced contract with partial implementation"
],
      "example": "abstract class Shape {\n    protected String color;\n    public Shape(String color) { this.color = color; }\n\n    abstract double area();          // MUST override\n    abstract double perimeter();\n\n    public String describe() {\n        return \"Shape with area: \" + area();\n    }\n}\n\nclass Circle extends Shape {\n    private double radius;\n    public Circle(String color, double r) { super(color); radius = r; }\n\n    @Override double area()      { return Math.PI * radius * radius; }\n    @Override double perimeter() { return 2 * Math.PI * radius; }\n}\n\n// Shape s = new Shape(\"Red\"); // ERROR!\nShape s = new Circle(\"Red\", 5.0); // OK â†’ polymorphism"
},
    "Interfaces": {
      "explanation": "An interface is a contract specifying what a class can do. Classes implement interfaces, promising to provide the method implementations. A class can implement multiple interfaces.",
      "details": [
        "All methods abstract by default (Java 7); Java 8+ allows default and static methods",
        "All fields are public static final",
        "A class can implement multiple interfaces",
        "Enables loose coupling and 'programming to interface'"
],
      "example": "interface Printable    { void print(); }\ninterface Serializable { byte[] serialize(); }\n\nclass Document implements Printable, Serializable {\n    private String content;\n\n    @Override public void print()        { System.out.println(content); }\n    @Override public byte[] serialize()  { return content.getBytes(); }\n}\n\n// Interface as type (polymorphism)\nPrintable p = new Document();\np.print();\n\n// Abstract class vs Interface\n// Abstract class: shared code, IS-A relationship\n// Interface:      capability contract (Flyable, Comparable)"
}
}
},
  "Computer Networks": {
  "icon": "ti-network",
  "color": "#533AB7",
  "topics": {
    "OSI Model": {
      "explanation": "The OSI (Open Systems Interconnection) model is a conceptual framework with 7 layers standardizing how different network systems communicate.",
      "details": [
        "Layer 7 Application: user interface (HTTP, FTP, SMTP, DNS)",
        "Layer 6 Presentation: encryption, compression, encoding",
        "Layer 5 Session: session management, authentication",
        "Layer 4 Transport: end-to-end communication (TCP, UDP)",
        "Layer 3 Network: routing, logical addressing (IP)",
        "Layer 2 Data Link: framing, MAC addressing (Ethernet)",
        "Layer 1 Physical: bits over wire (cables, signals)"
],
      "example": "// Mnemonic: All People Seem To Need Data Processing\nL7 Application:  HTTP, HTTPS, FTP, SMTP, DNS\nL6 Presentation: SSL/TLS, JPEG, ASCII encoding\nL5 Session:      NetBIOS, RPC, session auth\nL4 Transport:    TCP (reliable), UDP (fast), ports\nL3 Network:      IP, ICMP, routers\nL2 Data Link:    Ethernet, Wi-Fi, switches, MAC\nL1 Physical:     cables, fiber, radio waves\n\n// HTTP request journey:\nApp layer â†’ TCP segment (port 80) â†’ IP packet â†’ Ethernet frame â†’ bits on wire"
},
    "TCP vs UDP": {
      "explanation": "TCP provides reliable, ordered, error-checked delivery. UDP is faster but unreliable â€” fire and forget.",
      "details": [
        "TCP: connection-oriented (3-way handshake: SYNâ†’SYN-ACKâ†’ACK)",
        "TCP: flow control, congestion control, ordering, retransmission",
        "UDP: connectionless, no guarantee of delivery or order",
        "UDP: lower latency, good for video streaming, gaming, DNS"
],
      "example": "// TCP 3-way handshake\nClient â†’ Server: SYN (seq=x)\nServer â†’ Client: SYN-ACK (seq=y, ack=x+1)\nClient â†’ Server: ACK (ack=y+1)\n// Connection established!\n\n// Use TCP: HTTP/HTTPS, FTP, SSH, email\n// Use UDP: DNS, VoIP, video streaming, online games"
},
    "IP Address": {
      "explanation": "An IP address is a unique numerical label assigned to each device on a network. IPv4 uses 32 bits; IPv6 uses 128 bits.",
      "details": [
        "IPv4: 192.168.1.1 (32 bits, ~4.3 billion addresses)",
        "IPv6: 2001:0db8::8a2e:370:7334 (128 bits)",
        "Private ranges: 10.x.x.x, 172.16-31.x.x, 192.168.x.x",
        "Subnet mask: divides IP into network and host parts"
],
      "example": "// IPv4 subnetting\nIP:       192.168.1.0 / 24\nMask:     255.255.255.0\nNetwork:  192.168.1.0\nHosts:    192.168.1.1 â€“ 192.168.1.254  (254 usable)\nBroadcast:192.168.1.255\n\n// /24 â†’ 32-24 = 8 host bits â†’ 2â¸ - 2 = 254 hosts\n\n// NAT: many private IPs share one public IP\n// 192.168.1.x â†’ [NAT Router] â†’ 203.0.113.1 (public)"
},
    "HTTP/HTTPS": {
      "explanation": "HTTP is the foundation of data communication on the web. HTTPS adds TLS/SSL encryption for security.",
      "details": [
        "Methods: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS",
        "Status codes: 2xx success, 3xx redirect, 4xx client error, 5xx server error",
        "Headers: Host, Content-Type, Authorization, Cookie",
        "HTTPS: TLS handshake + certificate verification"
],
      "example": "// HTTP Request\nGET /api/users/123 HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer eyJhbGc...\n\n// HTTP Response\nHTTP/1.1 200 OK\nContent-Type: application/json\n{\"id\": 123, \"name\": \"Alice\"}\n\n// Common status codes\n200 OK, 201 Created, 204 No Content\n301 Moved Permanently, 304 Not Modified\n400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found\n500 Internal Server Error, 503 Service Unavailable"
},
    "DNS": {
      "explanation": "DNS (Domain Name System) translates human-readable domain names to IP addresses. The internet's phone book.",
      "details": [
        "Hierarchical: root â†’ TLD (.com, .org) â†’ domain â†’ subdomain",
        "Records: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), NS (nameserver)",
        "Caching: reduces lookup time; TTL controls cache duration"
],
      "example": "// DNS lookup for \"www.example.com\"\n1. Check local cache\n2. Query recursive resolver (ISP)\n3. Resolver â†’ root nameserver â†’ .com TLD address\n4. Resolver â†’ .com TLD â†’ example.com NS address\n5. Resolver â†’ example.com NS â†’ www IP address\n6. Returns IP, cached for TTL duration\n\n// DNS record types\nA     example.com â†’ 93.184.216.34\nCNAME www.example.com â†’ example.com (alias)\nMX    example.com â†’ mail.example.com"
}
}
},
  "Programming Fundamentals": {
  "icon": "ti-code",
  "color": "#072C53",
  "topics": {
    "Variables & Data Types": {
      "explanation": "Variables are named storage locations in memory. Data types define the kind of data a variable can hold and operations that can be performed on it.",
      "details": [
        "Primitive types: int, float, char, boolean, byte, long, double",
        "Reference types: arrays, objects, strings",
        "Static typing (Java/C++): type checked at compile time",
        "Dynamic typing (Python/JS): type checked at runtime"
],
      "example": "// Java â€” statically typed\nint age = 25;\ndouble salary = 75000.50;\nboolean isActive = true;\nString name = \"Alice\";    // reference type\n\n// Python â€” dynamically typed\nage  = 25          # int\nname = \"Alice\"     # str\nnums = [1, 2, 3]   # list\n\n// Type conversion\nint n = (int)3.7;  // explicit cast â†’ 3\ndouble d = 5;      // implicit (widening) â†’ 5.0"
},
    "Loops": {
      "explanation": "Loops execute a block of code repeatedly. Three main types: for (known iterations), while (condition-based), do-while (executes at least once).",
      "details": [
        "break: exit loop immediately",
        "continue: skip current iteration",
        "Nested loops: O(nÂ²) typical complexity"
],
      "example": "// For loop\nfor (int i = 0; i < 5; i++) System.out.print(i + \" \");\n\n// While loop\nint n = 10;\nwhile (n > 0) { System.out.print(n + \" \"); n -= 3; }\n\n// Python for-each\nfor item in [\"a\", \"b\", \"c\"]: print(item)\n\n# List comprehension\nsquares = [x**2 for x in range(10)]"
},
    "Exception Handling": {
      "explanation": "Exception handling manages runtime errors gracefully, preventing program crashes and providing meaningful error messages or recovery mechanisms.",
      "details": [
        "try: code that might throw exception",
        "catch: handles specific exceptions",
        "finally: always executes (cleanup code)",
        "throw/throws: explicitly raise exceptions"
],
      "example": "try {\n    int result = 10 / 0;  // ArithmeticException\n} catch (ArithmeticException e) {\n    System.out.println(\"Math error: \" + e.getMessage());\n} finally {\n    System.out.println(\"Always executes!\");\n}\n\n# Python\ntry:\n    x = int(input())\n    result = 10 / x\nexcept (ValueError, ZeroDivisionError) as e:\n    print(f\"Error: {e}\")\nelse:\n    print(f\"Result: {result}\")  # runs if no exception"
},
    "Functions/Methods": {
      "explanation": "Functions are reusable blocks of code that perform specific tasks. They accept inputs (parameters) and optionally return outputs.",
      "details": [
        "Parameters: variables in function definition",
        "Arguments: actual values passed when calling",
        "Return type: type of value returned",
        "Scope: local variables exist only within function"
],
      "example": "// Java method\npublic static int add(int a, int b) { return a + b; }\n\n// Method overloading\nint    add(int a, int b)       { return a + b; }\ndouble add(double a, double b) { return a + b; }\n\n// Python with default + keyword args\ndef greet(name, greeting=\"Hello\"):\n    return f\"{greeting}, {name}!\"\n\ngreet(\"Alice\")              # \"Hello, Alice!\"\ngreet(\"Bob\", greeting=\"Hi\") # \"Hi, Bob!\"\n\n# Lambda\nsquare = lambda x: x ** 2\nprint(list(map(square, [1,2,3,4,5])))  # [1,4,9,16,25]"
},
    "Recursion": {
      "explanation": "Recursion is a programming technique where a function calls itself. Requires a base case and a recursive case that reduces the problem.",
      "details": [
        "Call stack: each call creates a new stack frame",
        "Stack overflow: max recursion depth exceeded",
        "Tail recursion optimization: compiler converts to iteration"
],
      "example": "// Factorial\nint factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\n// Fibonacci\nint fib(int n) {\n    if (n <= 1) return n;\n    return fib(n-1) + fib(n-2);\n}\n\n// Recursion tree for fib(4):\n//        fib(4)\n//       /      \\\n//    fib(3)   fib(2)\n//    /   \\    /    \\\n// fib(2) fib(1) fib(1) fib(0)"
}
}
},
  "AI / ML / GenAI": {
  "icon": "ti-brain",
  "color": "#A32D2D",
  "topics": {
    "Machine Learning": {
      "explanation": "Machine Learning is a subset of AI where systems learn from data to make predictions or decisions without being explicitly programmed for each task. It relies on statistical methods to find patterns in data and generalize to new, unseen inputs.",
      "details": [
        "Supervised: labeled data â€” Classification (discrete output: spam/not-spam) and Regression (continuous output: house price)",
        "Unsupervised: unlabeled data â€” Clustering (K-Means, DBSCAN), Dimensionality Reduction (PCA, t-SNE), Anomaly Detection",
        "Semi-supervised: small labeled set + large unlabeled set â€” common in real-world where labeling is expensive",
        "Self-supervised: model creates its own labels from raw data (e.g., predicting masked words â€” used in BERT)",
        "Reinforcement Learning: agent learns by taking actions in an environment, receiving rewards/penalties (e.g., AlphaGo, robotics)",
        "Train/Val/Test split: train=60-70%, validation=15-20%, test=15-20%; validation tunes hyperparams, test gives final unbiased score",
        "Overfitting: model memorizes training data, fails on new data â†’ fix with regularization, dropout, more data, early stopping",
        "Underfitting: model too simple to capture patterns â†’ fix with more features, more complex model, longer training",
        "Bias-Variance Tradeoff: high bias = underfitting; high variance = overfitting; goal is to minimize both",
        "Cross-validation: k-fold CV splits data into k folds, trains k times, averages score â€” reduces evaluation variance",
        "Feature Engineering: creating, selecting, and transforming input features is often more impactful than model choice",
        "Normalization vs Standardization: normalize to [0,1] (MinMaxScaler); standardize to mean=0, std=1 (StandardScaler)"
],
      "example": "from sklearn.linear_model import LinearRegression, LogisticRegression\nfrom sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier\nfrom sklearn.cluster import KMeans, DBSCAN\nfrom sklearn.decomposition import PCA\nfrom sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.metrics import accuracy_score, confusion_matrix, classification_report\nimport numpy as np\n\n# â”€â”€ Supervised: Regression â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nX = np.array([[1],[2],[3],[4],[5]])\ny = np.array([150, 250, 300, 400, 500])\nmodel = LinearRegression()\nmodel.fit(X, y)\nprint(model.predict([[6]]))          # ~580\nprint(\"RÂ² score:\", model.score(X, y))\n\n# â”€â”€ Supervised: Classification â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nfrom sklearn.datasets import load_iris\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(\n    iris.data, iris.target, test_size=0.2, random_state=42)\n\nscaler = StandardScaler()\nX_train = scaler.fit_transform(X_train)\nX_test  = scaler.transform(X_test)          # NEVER fit on test set!\n\nclf = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)\nclf.fit(X_train, y_train)\ny_pred = clf.predict(X_test)\nprint(accuracy_score(y_test, y_pred))\nprint(confusion_matrix(y_test, y_pred))\nprint(classification_report(y_test, y_pred))\n\n# â”€â”€ Cross-Validation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nscores = cross_val_score(clf, iris.data, iris.target, cv=5)\nprint(f\"CV Accuracy: {scores.mean():.3f} Â± {scores.std():.3f}\")\n\n# â”€â”€ Hyperparameter Tuning â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nparam_grid = {'n_estimators': [50, 100], 'max_depth': [3, 5, None]}\ngrid = GridSearchCV(RandomForestClassifier(), param_grid, cv=5)\ngrid.fit(X_train, y_train)\nprint(\"Best params:\", grid.best_params_)\n\n# â”€â”€ Unsupervised: Clustering â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nkmeans = KMeans(n_clusters=3, random_state=42)\nlabels = kmeans.fit_predict(iris.data)\nprint(\"Cluster labels:\", labels[:10])\n\n# DBSCAN â€” no need to specify k, handles noise\ndb = DBSCAN(eps=0.5, min_samples=5)\nlabels_db = db.fit_predict(iris.data)\nprint(\"DBSCAN labels:\", np.unique(labels_db))  # -1 = noise\n\n# â”€â”€ Dimensionality Reduction â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\npca = PCA(n_components=2)\nX_2d = pca.fit_transform(iris.data)\nprint(\"Explained variance:\", pca.explained_variance_ratio_)\n\n# â”€â”€ Regularization (prevent overfitting) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nfrom sklearn.linear_model import Ridge, Lasso, ElasticNet\nridge   = Ridge(alpha=1.0)       # L2: shrinks all weights\nlasso   = Lasso(alpha=0.1)       # L1: drives some weights to 0 (feature selection)\nelastic = ElasticNet(alpha=0.1, l1_ratio=0.5)  # mix of L1 + L2\n\n# â”€â”€ Evaluation Metrics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# Accuracy  = correct / total           (good for balanced classes)\n# Precision = TP / (TP + FP)            (important when FP is costly)\n# Recall    = TP / (TP + FN)            (important when FN is costly)\n# F1        = 2*(P*R)/(P+R)             (balance precision & recall)\n# ROC-AUC   = area under ROC curve      (threshold-independent)\n# MSE/RMSE/MAE                          (regression metrics)\nfrom sklearn.metrics import roc_auc_score, mean_squared_error\n"
},
    "Neural Networks": {
      "explanation": "Neural networks are ML models inspired by the brain's structure. Layers of interconnected neurons (perceptrons) learn by adjusting connection weights through backpropagation and gradient descent. Deep learning = many layers (deep networks).",
      "details": [
        "Perceptron: input â†’ weighted sum â†’ activation â†’ output; the fundamental building block",
        "Layers: Input layer (raw data), Hidden layers (feature extraction), Output layer (prediction)",
        "Activation functions: ReLU (max(0,x), most common), Sigmoid (0â€“1 for binary), Tanh (-1 to 1), Softmax (multiclass probabilities), Leaky ReLU (fixes dying ReLU problem)",
        "Loss functions: MSE for regression, Cross-Entropy for classification, Binary Cross-Entropy for binary output",
        "Backpropagation: compute gradient of loss w.r.t. each weight using chain rule, propagate error backwards",
        "Gradient Descent variants: SGD (noisy but fast), Mini-batch GD (standard), Adam (adaptive lr, most popular)",
        "Learning rate: too high â†’ overshoots minimum; too low â†’ slow convergence; use lr schedulers",
        "Batch Normalization: normalize activations between layers â†’ faster training, less sensitive to initialization",
        "Dropout: randomly zero out neurons during training â†’ prevents overfitting (p=0.2â€“0.5 typical)",
        "Weight initialization: Xavier/Glorot for tanh; He initialization for ReLU",
        "CNN (Convolutional): for image data â€” uses conv filters, pooling layers, translation invariant",
        "RNN/LSTM/GRU: for sequential data (text, time series) â€” maintains hidden state, handles variable-length input",
        "Transformer: attention-based, parallelizable, dominates NLP; also used in vision (ViT)",
        "Epochs vs Batches: one epoch = full pass through dataset; batch = subset processed per weight update"
],
      "example": "import torch\nimport torch.nn as nn\nimport torch.optim as optim\nfrom torch.utils.data import DataLoader, TensorDataset\nimport numpy as np\n\n# â”€â”€ Basic Feedforward Network â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nclass FeedForward(nn.Module):\n    def __init__(self, input_dim, hidden_dim, output_dim, dropout=0.3):\n        super().__init__()\n        self.net = nn.Sequential(\n            nn.Linear(input_dim, hidden_dim),\n            nn.BatchNorm1d(hidden_dim),       # normalize activations\n            nn.ReLU(),\n            nn.Dropout(dropout),              # prevent overfitting\n            nn.Linear(hidden_dim, hidden_dim // 2),\n            nn.BatchNorm1d(hidden_dim // 2),\n            nn.ReLU(),\n            nn.Dropout(dropout),\n            nn.Linear(hidden_dim // 2, output_dim)\n        )\n    def forward(self, x):\n        return self.net(x)\n\nmodel = FeedForward(784, 256, 10, dropout=0.3)\n\n# â”€â”€ Loss & Optimizer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\ncriterion = nn.CrossEntropyLoss()           # for multiclass\n# criterion = nn.BCEWithLogitsLoss()        # for binary\n# criterion = nn.MSELoss()                  # for regression\n\noptimizer = optim.Adam(model.parameters(), lr=1e-3, weight_decay=1e-4)\n# weight_decay = L2 regularization built-in\n\nscheduler = optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.5)\n# halve lr every 10 epochs\n\n# â”€â”€ Training Loop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\ndef train(model, loader, criterion, optimizer, epochs=20):\n    model.train()\n    for epoch in range(epochs):\n        total_loss, correct = 0, 0\n        for X_batch, y_batch in loader:\n            optimizer.zero_grad()            # clear previous gradients\n            outputs = model(X_batch)\n            loss = criterion(outputs, y_batch)\n            loss.backward()                  # backpropagation\n            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)  # gradient clipping\n            optimizer.step()                 # update weights\n            total_loss += loss.item()\n            correct += (outputs.argmax(1) == y_batch).sum().item()\n        scheduler.step()\n        print(f\"Epoch {epoch+1}: Loss={total_loss/len(loader):.4f}, Acc={correct/len(loader.dataset):.4f}\")\n\n# â”€â”€ CNN for Image Classification â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nclass ConvNet(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.features = nn.Sequential(\n            nn.Conv2d(1, 32, kernel_size=3, padding=1),  # 28â†’28\n            nn.ReLU(),\n            nn.MaxPool2d(2),                              # 28â†’14\n            nn.Conv2d(32, 64, kernel_size=3, padding=1), # 14â†’14\n            nn.ReLU(),\n            nn.MaxPool2d(2),                              # 14â†’7\n        )\n        self.classifier = nn.Sequential(\n            nn.Flatten(),\n            nn.Linear(64 * 7 * 7, 128),\n            nn.ReLU(),\n            nn.Dropout(0.5),\n            nn.Linear(128, 10)\n        )\n    def forward(self, x):\n        return self.classifier(self.features(x))\n\n# â”€â”€ LSTM for Sequence Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nclass LSTMClassifier(nn.Module):\n    def __init__(self, vocab_size, embed_dim, hidden_dim, num_layers, output_dim):\n        super().__init__()\n        self.embedding = nn.Embedding(vocab_size, embed_dim)\n        self.lstm = nn.LSTM(embed_dim, hidden_dim, num_layers,\n                            batch_first=True, dropout=0.3, bidirectional=True)\n        self.fc = nn.Linear(hidden_dim * 2, output_dim)  # *2 for bidirectional\n    def forward(self, x):\n        embedded = self.embedding(x)\n        out, (hidden, _) = self.lstm(embedded)\n        return self.fc(torch.cat([hidden[-2], hidden[-1]], dim=1))\n\n# â”€â”€ Activation Function Comparison â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# ReLU:       f(x) = max(0, x)         â€” dying neuron problem\n# Leaky ReLU: f(x) = max(0.01x, x)    â€” fixes dying neurons\n# Sigmoid:    f(x) = 1/(1+e^-x)       â€” saturates (vanishing grad)\n# Tanh:       f(x) = (e^x-e^-x)/(e^x+e^-x) â€” zero-centered\n# Softmax:    normalizes to probability distribution (output layer)\n# GELU:       used in transformers (GPT, BERT)\n\n# â”€â”€ Saving & Loading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\ntorch.save(model.state_dict(), 'model.pth')\nmodel.load_state_dict(torch.load('model.pth'))\nmodel.eval()   # disable dropout/batchnorm during inference\n"
},
    "LLMs": {
      "explanation": "Large Language Models are transformer-based neural networks trained on massive text corpora to understand and generate human language. They learn by predicting the next token and generalize to tasks never seen during training via in-context learning.",
      "details": [
        "Transformer architecture: self-attention allows each token to attend to all others; parallelizable unlike RNNs",
        "Self-attention: Q (Query), K (Key), V (Value) matrices â€” attention = softmax(QKáµ€/âˆšd)V",
        "Multi-head attention: multiple attention heads capture different relationship types simultaneously",
        "Positional encoding: injects sequence order since attention is permutation-invariant",
        "Pre-training: predict next token (GPT-style autoregressive) or masked tokens (BERT-style masked LM) on trillions of tokens",
        "Tokenization: text split into subword tokens (BPE, WordPiece); 'unhappiness' â†’ ['un', 'happiness']",
        "Context window: max tokens model can process at once (GPT-4: 128k, Claude: 200k); longer = more memory",
        "Temperature: controls randomness â€” 0=deterministic (always top token), 1=sampling distribution, >1=more random",
        "Top-p (nucleus sampling): sample from smallest set of tokens whose cumulative prob â‰¥ p",
        "Top-k: sample from top k most probable tokens only",
        "Fine-tuning: continue training on domain-specific data to specialize behavior (e.g., medical, legal)",
        "RLHF: Reinforcement Learning from Human Feedback â€” train reward model on human preferences, then use PPO to optimize",
        "PEFT/LoRA: Parameter-Efficient Fine-Tuning â€” only train small adapter weights, not full model (much cheaper)",
        "Emergent abilities: capabilities that appear unexpectedly at scale (chain-of-thought, arithmetic, translation)",
        "Hallucination root cause: models predict plausible tokens, not truth; no internal fact-checking mechanism",
        "System prompt: hidden instructions that shape model behavior before user messages"
],
      "example": "import anthropic\nfrom openai import OpenAI\nimport tiktoken\n\n# â”€â”€ Claude API (Anthropic) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nclient = anthropic.Anthropic()\n\n# Basic completion\nresponse = client.messages.create(\n    model=\"claude-opus-4-6\",\n    max_tokens=1024,\n    temperature=0.7,           # 0=deterministic, 1=balanced, >1=creative\n    system=\"You are a concise technical assistant. Use bullet points.\",\n    messages=[\n        {\"role\": \"user\", \"content\": \"Explain transformers.\"}\n    ]\n)\nprint(response.content[0].text)\nprint(f\"Input tokens: {response.usage.input_tokens}\")\nprint(f\"Output tokens: {response.usage.output_tokens}\")\n\n# Multi-turn conversation\nconversation = []\ndef chat(user_msg):\n    conversation.append({\"role\": \"user\", \"content\": user_msg})\n    res = client.messages.create(\n        model=\"claude-opus-4-6\",\n        max_tokens=1024,\n        messages=conversation\n    )\n    assistant_msg = res.content[0].text\n    conversation.append({\"role\": \"assistant\", \"content\": assistant_msg})\n    return assistant_msg\n\n# Streaming response\nwith client.messages.stream(\n    model=\"claude-opus-4-6\",\n    max_tokens=1024,\n    messages=[{\"role\": \"user\", \"content\": \"Write a haiku.\"}]\n) as stream:\n    for text in stream.text_stream:\n        print(text, end=\"\", flush=True)\n\n# â”€â”€ OpenAI API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\noai = OpenAI()\nresponse = oai.chat.completions.create(\n    model=\"gpt-4o\",\n    temperature=0.5,\n    top_p=0.9,              # nucleus sampling\n    max_tokens=500,\n    messages=[\n        {\"role\": \"system\", \"content\": \"You are a helpful assistant.\"},\n        {\"role\": \"user\",   \"content\": \"What is backpropagation?\"}\n    ]\n)\nprint(response.choices[0].message.content)\n\n# â”€â”€ Token Counting â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nenc = tiktoken.encoding_for_model(\"gpt-4\")\ntokens = enc.encode(\"Hello, world!\")\nprint(f\"Token count: {len(tokens)}\")    # 4\n# Rule of thumb: 1 token â‰ˆ 0.75 words â‰ˆ 4 chars in English\n\n# â”€â”€ Structured Output / JSON Mode â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nresponse = oai.chat.completions.create(\n    model=\"gpt-4o\",\n    response_format={\"type\": \"json_object\"},   # forces valid JSON\n    messages=[{\n        \"role\": \"user\",\n        \"content\": \"List 3 planets as JSON with name and diameter_km.\"\n    }]\n)\nimport json\ndata = json.loads(response.choices[0].message.content)\n\n# â”€â”€ Function / Tool Calling â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\ntools = [{\n    \"type\": \"function\",\n    \"function\": {\n        \"name\": \"get_weather\",\n        \"description\": \"Get current weather for a city\",\n        \"parameters\": {\n            \"type\": \"object\",\n            \"properties\": {\n                \"city\": {\"type\": \"string\"},\n                \"unit\": {\"type\": \"string\", \"enum\": [\"celsius\", \"fahrenheit\"]}\n            },\n            \"required\": [\"city\"]\n        }\n    }\n}]\n\nresponse = oai.chat.completions.create(\n    model=\"gpt-4o\",\n    tools=tools,\n    messages=[{\"role\": \"user\", \"content\": \"What's the weather in Tokyo?\"}]\n)\n# Model returns tool_call â†’ you execute function â†’ send result back â†’ model responds\n\n# â”€â”€ Transformer Self-Attention (conceptual) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nimport torch, torch.nn.functional as F\n\ndef self_attention(Q, K, V, mask=None):\n    d_k = Q.size(-1)\n    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)\n    if mask is not None:\n        scores = scores.masked_fill(mask == 0, -1e9)\n    weights = F.softmax(scores, dim=-1)      # attention weights\n    return torch.matmul(weights, V)          # weighted value sum\n"
},
    "Prompt Engineering": {
      "explanation": "Prompt engineering is the art and science of designing effective inputs for LLMs to elicit desired, high-quality outputs. It is the primary interface between humans and language models, and small changes in phrasing can dramatically change outputs.",
      "details": [
        "Zero-shot: ask directly with no examples â€” works for simple tasks models understand well",
        "Few-shot: provide 2â€“8 examples in prompt â€” dramatically improves accuracy on specific formats",
        "Chain-of-Thought (CoT): ask model to 'think step by step' â€” unlocks reasoning on math/logic problems",
        "Zero-shot CoT: append 'Let's think step by step.' â€” surprisingly effective without examples",
        "Self-consistency: generate multiple CoT answers, take majority vote â€” improves reliability",
        "Tree of Thoughts (ToT): explore multiple reasoning paths, evaluate and prune â€” best for complex problems",
        "Role prompting: 'You are an expert in X' â€” primes model to use domain-specific knowledge and tone",
        "Instruction following: be explicit and specific; avoid ambiguity; state what you DON'T want",
        "Output formatting: specify JSON, markdown, bullet points, table, or exact schema in the prompt",
        "Negative examples: show the model what NOT to do alongside what to do",
        "Delimiters: use XML tags, triple backticks, or headers to clearly separate sections of the prompt",
        "Temperature guidance: use 0 for factual/deterministic tasks, 0.7 for balanced, >0.9 for creative",
        "Persona + Audience: 'Explain to a 10-year-old' or 'Write for senior engineers' shapes vocabulary and depth",
        "Prompt injection awareness: untrusted input can hijack instructions â€” always sanitize user content",
        "System prompt vs User prompt: system sets behavior/persona; user provides the task"
],
      "example": "// â”€â”€ Zero-shot â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n\"Classify this review as Positive, Negative, or Neutral:\n'The battery dies after 3 hours.'\"\n// Output: Negative\n\n// â”€â”€ Few-shot (more accurate, consistent format) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n\"Classify sentiment:\nInput: 'Terrible product.'         â†’ Negative\nInput: 'I absolutely love it!'     â†’ Positive\nInput: 'Not bad, could be better.' â†’ Neutral\nInput: 'This is absolutely wonderful!' â†’ \"\n// Output: Positive\n\n// â”€â”€ Chain-of-Thought â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n\"Q: A store had 50 apples. They sold 18 and got a delivery of \n   30 more. How many apples do they have now?\nA: Let me think step by step.\n   Step 1: Start with 50 apples.\n   Step 2: Sold 18 â†’ 50 - 18 = 32 apples.\n   Step 3: Delivery of 30 â†’ 32 + 30 = 62 apples.\n   Answer: 62 apples.\"\n\n// â”€â”€ Zero-shot CoT (just add the magic phrase) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n\"Q: If I have 3 boxes with 8 items each, and I give away 7 items,\n   how many items do I have?\nA: Let's think step by step.\"\n// Model will reason through before answering\n\n// â”€â”€ Role Prompting â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n\"You are a senior cybersecurity engineer with 15 years of\n experience in penetration testing. Review this code for\n vulnerabilities and explain each risk clearly:\n [code here]\"\n\n// â”€â”€ Structured Output with Schema â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n\"Extract information from the following job posting and return\n ONLY a valid JSON object with this exact schema:\n {\n   'title': string,\n   'company': string,\n   'salary_range': {'min': number, 'max': number} | null,\n   'required_skills': string[],\n   'remote': boolean\n }\n Do not include any explanation or markdown. Only raw JSON.\n Job posting: [...]\"\n\n// â”€â”€ XML Delimiters for Complex Prompts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n\"<instructions>\n You are a code reviewer. Review the code below.\n Focus on: security, performance, and readability.\n Format: use headers for each category.\n</instructions>\n\n<code>\ndef get_user(id):\n    query = f'SELECT * FROM users WHERE id = {id}'\n    return db.execute(query)\n</code>\n\n<output_format>\n## Security\n## Performance  \n## Readability\n</output_format>\"\n\n// â”€â”€ Self-Consistency (generate 3, pick majority) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nconst responses = await Promise.all([\n  llm(\"Q: Is 17 prime? Think step by step.\"),\n  llm(\"Q: Is 17 prime? Think step by step.\"),\n  llm(\"Q: Is 17 prime? Think step by step.\"),\n])\n// All three should agree: Yes, 17 is prime.\n\n// â”€â”€ Negative Instructions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n\"Summarize this article.\n - DO: use bullet points, keep under 150 words\n - DO NOT: use the phrase 'the article states'\n - DO NOT: include opinions not present in the text\"\n\n// â”€â”€ Temperature Guide â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n// temperature=0.0  â†’ deterministic, best for code/math/facts\n// temperature=0.3  â†’ mostly focused, small variation\n// temperature=0.7  â†’ balanced (default for most tasks)\n// temperature=1.0  â†’ creative writing, brainstorming\n// temperature=1.5+ â†’ very random, experimental\n"
},
    "RAG": {
      "explanation": "Retrieval-Augmented Generation (RAG) enhances LLMs by fetching relevant external documents at inference time and injecting them into the prompt. This grounds responses in up-to-date, domain-specific, or private knowledge without retraining the model.",
      "details": [
        "Problem solved: LLMs have knowledge cutoffs, may hallucinate, and cannot access private data",
        "Core idea: retrieve relevant chunks from a knowledge base â†’ inject into prompt â†’ LLM answers with grounding",
        "Chunking strategy: split documents into ~256â€“512 token chunks with overlap (e.g., 50 tokens) to preserve context",
        "Embeddings: convert text to dense vectors (OpenAI ada-002, Cohere, sentence-transformers) â€” semantically similar texts have close vectors",
        "Vector databases: store and index embeddings for fast similarity search (Chroma, Pinecone, Weaviate, Qdrant, pgvector)",
        "Retrieval: cosine similarity or dot product finds top-k most relevant chunks to the query",
        "Hybrid retrieval: combine vector search (semantic) with BM25 keyword search for best of both worlds",
        "Re-ranking: use a cross-encoder to re-score retrieved chunks before injecting (improves precision)",
        "Query expansion: rephrase or expand the user query to improve retrieval coverage",
        "Hypothetical Document Embeddings (HyDE): generate a hypothetical answer, embed it, use it as retrieval query",
        "Metadata filtering: filter by date, source, category before vector search to improve relevance",
        "Evaluation: measure Faithfulness (is answer supported by context?), Answer Relevance, Context Relevance",
        "Agentic RAG: LLM decides when and what to retrieve, can do multi-hop retrieval",
        "Context window management: retrieved chunks must fit in model's context; prioritize most relevant chunks first"
],
      "example": "from langchain.document_loaders import PyPDFLoader, DirectoryLoader\nfrom langchain.text_splitter import RecursiveCharacterTextSplitter\nfrom langchain.embeddings import OpenAIEmbeddings, HuggingFaceEmbeddings\nfrom langchain.vectorstores import Chroma, FAISS\nfrom langchain.retrievers import BM25Retriever, EnsembleRetriever\nfrom langchain.chat_models import ChatOpenAI\nfrom langchain.chains import RetrievalQA\nimport anthropic\n\n# â”€â”€ Step 1: Load & Chunk Documents â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nloader = DirectoryLoader('./docs', glob=\"**/*.pdf\", loader_cls=PyPDFLoader)\ndocuments = loader.load()\n\nsplitter = RecursiveCharacterTextSplitter(\n    chunk_size=512,        # max tokens per chunk\n    chunk_overlap=64,      # overlap to preserve context across chunks\n    separators=[\"\n\n\", \"\n\", \". \", \" \", \"\"]\n)\nchunks = splitter.split_documents(documents)\nprint(f\"Split into {len(chunks)} chunks\")\n\n# â”€â”€ Step 2: Embed & Store â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# Option A: OpenAI embeddings (1536 dims, paid)\nembeddings = OpenAIEmbeddings(model=\"text-embedding-ada-002\")\n\n# Option B: Free local embeddings\n# embeddings = HuggingFaceEmbeddings(model_name=\"all-MiniLM-L6-v2\")\n\nvectorstore = Chroma.from_documents(\n    chunks,\n    embeddings,\n    persist_directory=\"./chroma_db\"   # saves to disk\n)\n\n# â”€â”€ Step 3: Retrieval â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# Semantic search\nretriever_semantic = vectorstore.as_retriever(\n    search_type=\"similarity\",\n    search_kwargs={\"k\": 5}\n)\n\n# Hybrid: BM25 keyword + semantic vector\nretriever_bm25 = BM25Retriever.from_documents(chunks)\nretriever_bm25.k = 5\n\nhybrid_retriever = EnsembleRetriever(\n    retrievers=[retriever_bm25, retriever_semantic],\n    weights=[0.4, 0.6]     # weight semantic more\n)\n\n# â”€â”€ Step 4: RAG Chain â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nllm = ChatOpenAI(model=\"gpt-4o\", temperature=0)\nqa_chain = RetrievalQA.from_chain_type(\n    llm=llm,\n    chain_type=\"stuff\",          # \"map_reduce\" for many chunks\n    retriever=hybrid_retriever,\n    return_source_documents=True\n)\n\nresult = qa_chain(\"What is the refund policy?\")\nprint(result[\"result\"])\nprint(\"Sources:\", [d.metadata[\"source\"] for d in result[\"source_documents\"]])\n\n# â”€â”€ Step 5: Manual RAG with Claude â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nclient = anthropic.Anthropic()\n\ndef rag_query(user_query: str) -> str:\n    # Retrieve\n    docs = hybrid_retriever.get_relevant_documents(user_query)\n    context = \"\n\n---\n\n\".join([\n        f\"[Source: {d.metadata.get('source','unknown')}]\n{d.page_content}\"\n        for d in docs\n    ])\n\n    # Generate\n    response = client.messages.create(\n        model=\"claude-opus-4-6\",\n        max_tokens=1024,\n        system=\"\"\"You are a helpful assistant. Answer ONLY using the \nprovided context. If the answer is not in the context, say \n'I don't have that information in my knowledge base.' \nAlways cite your source.\"\"\",\n        messages=[{\n            \"role\": \"user\",\n            \"content\": f\"Context:\n{context}\n\nQuestion: {user_query}\"\n        }]\n    )\n    return response.content[0].text\n\n# â”€â”€ Evaluation (RAGAS) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nfrom ragas import evaluate\nfrom ragas.metrics import faithfulness, answer_relevancy, context_precision\n\n# faithfulness: is the answer supported by retrieved context?\n# answer_relevancy: is the answer relevant to the question?\n# context_precision: are retrieved chunks actually useful?\n\ndataset = {\n    \"question\":  [\"What is the refund policy?\"],\n    \"answer\":    [rag_query(\"What is the refund policy?\")],\n    \"contexts\":  [[d.page_content for d in docs]],\n    \"ground_truth\": [\"30-day full refund, no questions asked.\"]\n}\nscores = evaluate(dataset, metrics=[faithfulness, answer_relevancy])\nprint(scores)\n"
},
    "Hallucinations": {
      "explanation": "LLM hallucinations occur when a model generates confident but factually incorrect or fabricated information. This is a fundamental limitation of next-token prediction: models generate plausible text, not verified facts. Understanding types and mitigations is critical for production AI systems.",
      "details": [
        "Intrinsic hallucination: contradicts the provided source/context (e.g., misquoting a document given in the prompt)",
        "Extrinsic hallucination: cannot be verified against source â€” model adds unsupported information",
        "Factual hallucination: wrong real-world facts stated confidently ('The Eiffel Tower was built in 1901')",
        "Source hallucination: fabricating citations, papers, URLs, quotes that don't exist",
        "Reasoning hallucination: flawed logical steps that lead to wrong conclusions presented as correct",
        "Root cause: models optimize for token probability, not factual accuracy â€” plausible â‰  true",
        "Confidence calibration: models often express equal confidence for correct and hallucinated outputs",
        "Mitigation 1 â€” RAG: ground responses in retrieved, verifiable documents",
        "Mitigation 2 â€” Temperature 0: deterministic sampling reduces creative fabrication",
        "Mitigation 3 â€” Force citations: require model to cite sources; if it can't, say 'I don't know'",
        "Mitigation 4 â€” Self-consistency: sample N times, only accept answers appearing in majority",
        "Mitigation 5 â€” External verification: check generated facts against external APIs or databases",
        "Mitigation 6 â€” Constrained output: limit model to choose from provided options (classification vs open-ended)",
        "Mitigation 7 â€” Reflection/critique: ask model to review its own answer for errors",
        "Detection: use NLI models to check if response is entailed by source; use factuality scorers"
],
      "example": "import anthropic\n\nclient = anthropic.Anthropic()\n\n# â”€â”€ Strategy 1: RAG Grounding â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\ndef grounded_answer(context: str, question: str) -> str:\n    return client.messages.create(\n        model=\"claude-opus-4-6\",\n        max_tokens=512,\n        system=\"\"\"Answer ONLY using the provided context.\nIf the answer cannot be found in the context, respond with exactly:\n'INSUFFICIENT_CONTEXT: I cannot answer this from the provided information.'\nDo NOT use any outside knowledge.\"\"\",\n        messages=[{\"role\": \"user\",\n                   \"content\": f\"<context>\n{context}\n</context>\n\nQuestion: {question}\"}]\n    ).content[0].text\n\n# â”€â”€ Strategy 2: Forced Citations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\ncitation_prompt = \"\"\"\nYou are a research assistant. For EVERY factual claim you make:\n- Add a citation: [Source: doc_name, section/page]\n- If you cannot cite it from provided sources, write [UNCITED]\n- Any [UNCITED] claim should be prefaced with 'Possibly: '\nThis makes it clear what is verified vs speculative.\n\"\"\"\n\n# â”€â”€ Strategy 3: Self-Consistency Voting â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\ndef self_consistent_answer(question: str, n: int = 5) -> str:\n    answers = []\n    for _ in range(n):\n        res = client.messages.create(\n            model=\"claude-opus-4-6\",\n            max_tokens=256,\n            temperature=0.7,   # some variation to sample diverse paths\n            messages=[{\"role\": \"user\", \"content\": f\"{question}\nThink step by step.\"}]\n        )\n        answers.append(res.content[0].text)\n\n    # Extract final answers and take majority\n    # (in practice, use an LLM to extract and compare)\n    print(f\"Generated {n} answers â€” take the majority:\")\n    for i, a in enumerate(answers, 1):\n        print(f\"  [{i}] {a[:100]}...\")\n    return answers  # return all for manual review\n\n# â”€â”€ Strategy 4: External Fact Verification â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\ndef verify_claim(claim: str, source_of_truth: dict) -> dict:\n    \"\"\"Check generated claim against a known data source\"\"\"\n    verification_prompt = f\"\"\"\n    Claim to verify: \"{claim}\"\n\n    Ground truth data: {source_of_truth}\n\n    Is the claim supported, contradicted, or unverifiable from the data?\n    Respond as JSON: {{\"verdict\": \"supported|contradicted|unverifiable\", \"reason\": \"...\"}}\n    \"\"\"\n    result = client.messages.create(\n        model=\"claude-opus-4-6\",\n        max_tokens=200,\n        messages=[{\"role\": \"user\", \"content\": verification_prompt}]\n    ).content[0].text\n    import json\n    return json.loads(result)\n\n# â”€â”€ Strategy 5: Constrained Output (Reduce Fabrication) â”€â”€â”€â”€â”€\nclassification_prompt = \"\"\"\nClassify the following customer message into EXACTLY ONE of these categories:\n- BILLING_ISSUE\n- TECHNICAL_SUPPORT\n- FEATURE_REQUEST\n- GENERAL_INQUIRY\n- COMPLAINT\n\nYou MUST choose from the list above. Do not invent new categories.\nCustomer message: \"{message}\"\nReturn ONLY the category name.\n\"\"\"\n\n# â”€â”€ Strategy 6: Reflection / Self-Critique â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\ndef reflect_and_refine(question: str) -> str:\n    # Step 1: Initial answer\n    initial = client.messages.create(\n        model=\"claude-opus-4-6\",\n        max_tokens=512,\n        messages=[{\"role\": \"user\", \"content\": question}]\n    ).content[0].text\n\n    # Step 2: Critique\n    critique = client.messages.create(\n        model=\"claude-opus-4-6\",\n        max_tokens=256,\n        messages=[{\"role\": \"user\",\n                   \"content\": f\"Review this answer for factual errors, unsupported claims, or hallucinations:\n\n{initial}\n\nList any issues found.\"}]\n    ).content[0].text\n\n    # Step 3: Refined answer\n    refined = client.messages.create(\n        model=\"claude-opus-4-6\",\n        max_tokens=512,\n        messages=[{\"role\": \"user\",\n                   \"content\": f\"Original question: {question}\n\nInitial answer: {initial}\n\nCritique: {critique}\n\nNow provide a corrected, more reliable answer.\"}]\n    ).content[0].text\n    return refined\n\n# â”€â”€ NLI-based Hallucination Detection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nfrom transformers import pipeline\nnli = pipeline(\"zero-shot-classification\", model=\"facebook/bart-large-mnli\")\n\ndef is_entailed(claim: str, context: str) -> bool:\n    \"\"\"Check if claim is entailed by context using NLI\"\"\"\n    result = nli(context, [claim])\n    label = result[\"labels\"][0]\n    score = result[\"scores\"][0]\n    print(f\"Entailment: {label} ({score:.2f})\")\n    return label == \"entailment\" and score > 0.7\n"
},
    "Embeddings": {
      "explanation": "Embeddings are dense numerical vector representations of text (or images, audio) that capture semantic meaning. Similar concepts are close together in vector space, enabling semantic search, clustering, and similarity comparison.",
      "details": [
        "Word2Vec / GloVe: early word embeddings trained on co-occurrence; 'king' - 'man' + 'woman' â‰ˆ 'queen'",
        "Sentence embeddings: encode entire sentences/paragraphs into single vectors (SBERT, OpenAI ada)",
        "Dimensions: typical sizes are 384, 768, 1536, 3072 â€” higher dimensions = more expressive but more memory",
        "Cosine similarity: measures angle between vectors (âˆ’1 to 1); 1 = identical, 0 = orthogonal, âˆ’1 = opposite",
        "Dot product similarity: fast approximation when vectors are normalized",
        "Popular models: text-embedding-ada-002 (OpenAI), embed-english (Cohere), all-MiniLM-L6-v2 (free, local)",
        "Multimodal embeddings: CLIP embeds text and images in same space â†’ cross-modal search",
        "ANN (Approximate Nearest Neighbor): FAISS, HNSW â€” much faster than exact search for large datasets",
        "Use cases: semantic search, RAG, clustering, recommendation, duplicate detection, anomaly detection"
],
      "example": "from openai import OpenAI\nfrom sentence_transformers import SentenceTransformer\nimport numpy as np\nimport faiss\n\noai = OpenAI()\n\n# â”€â”€ Generating Embeddings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\ndef embed_openai(text: str) -> list[float]:\n    res = oai.embeddings.create(\n        model=\"text-embedding-ada-002\",\n        input=text\n    )\n    return res.data[0].embedding   # 1536-dim vector\n\n# Free local model (no API cost)\nmodel = SentenceTransformer('all-MiniLM-L6-v2')\nvecs = model.encode([\"Hello world\", \"Hi there\", \"Quantum physics\"])\n\n# â”€â”€ Cosine Similarity â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\ndef cosine_similarity(a, b):\n    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))\n\nv1 = np.array(embed_openai(\"cat\"))\nv2 = np.array(embed_openai(\"kitten\"))\nv3 = np.array(embed_openai(\"automobile\"))\nprint(cosine_similarity(v1, v2))   # ~0.93 (similar)\nprint(cosine_similarity(v1, v3))   # ~0.72 (less similar)\n\n# â”€â”€ Semantic Search with FAISS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\ndocuments = [\n    \"Python is great for data science.\",\n    \"JavaScript is used for web development.\",\n    \"Neural networks are inspired by the brain.\",\n    \"React is a popular UI framework.\"\n]\ndoc_vecs = np.array([embed_openai(d) for d in documents]).astype('float32')\n\nindex = faiss.IndexFlatIP(1536)    # Inner product (for normalized = cosine)\nfaiss.normalize_L2(doc_vecs)\nindex.add(doc_vecs)\n\nquery = \"What's good for AI and ML?\"\nq_vec = np.array([embed_openai(query)]).astype('float32')\nfaiss.normalize_L2(q_vec)\n\ndistances, indices = index.search(q_vec, k=2)\nfor i, idx in enumerate(indices[0]):\n    print(f\"[{distances[0][i]:.3f}] {documents[idx]}\")\n# [0.89] Neural networks are inspired by the brain.\n# [0.81] Python is great for data science.\n"
},
    "Fine-tuning vs RAG": {
      "explanation": "Fine-tuning and RAG are two complementary strategies for adapting LLMs to specific domains. Choosing between them depends on the nature of the knowledge needed and available resources.",
      "details": [
        "Fine-tuning: update model weights on domain data â€” model 'bakes in' the knowledge",
        "RAG: retrieve relevant docs at inference time â€” knowledge stays external and updatable",
        "Use fine-tuning for: tone/style/format changes, specialized jargon, consistent persona, domain-specific reasoning patterns",
        "Use RAG for: up-to-date information, private/proprietary data, large knowledge bases, verifiable citations",
        "Fine-tuning cost: GPU hours, labeled data; RAG cost: vector DB infra, embedding API calls",
        "LoRA (Low-Rank Adaptation): fine-tune only small adapter matrices, not full model â€” 100x cheaper",
        "QLoRA: LoRA on quantized model â€” fine-tune 7B model on a single consumer GPU",
        "Best practice: combine both â€” fine-tune for behavior, RAG for factual grounding",
        "Catastrophic forgetting: fine-tuning can degrade general capabilities; use regularization techniques"
],
      "example": "# â”€â”€ LoRA Fine-tuning with Hugging Face PEFT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nfrom transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments\nfrom peft import LoraConfig, get_peft_model, TaskType\nfrom trl import SFTTrainer\n\nmodel_id = \"mistralai/Mistral-7B-v0.1\"\nmodel = AutoModelForCausalLM.from_pretrained(model_id, load_in_4bit=True)  # QLoRA\ntokenizer = AutoTokenizer.from_pretrained(model_id)\n\nlora_config = LoraConfig(\n    task_type=TaskType.CAUSAL_LM,\n    r=16,                   # rank â€” higher = more capacity, more params\n    lora_alpha=32,          # scaling factor\n    lora_dropout=0.05,\n    target_modules=[\"q_proj\", \"v_proj\"]   # which layers to adapt\n)\n\nmodel = get_peft_model(model, lora_config)\nmodel.print_trainable_parameters()\n# trainable params: 4,194,304 || all params: 3,752,071,168 || 0.11%\n\n# Training dataset format (instruction tuning)\ndataset = [\n    {\"text\": \"<s>[INST] What is the capital of France? [/INST] Paris. </s>\"},\n    {\"text\": \"<s>[INST] Summarize RAG in one sentence. [/INST] RAG retrieves relevant documents and injects them into the LLM prompt for grounded generation. </s>\"}\n]\n\ntrainer = SFTTrainer(\n    model=model,\n    train_dataset=dataset,\n    args=TrainingArguments(\n        output_dir=\"./finetuned\",\n        num_train_epochs=3,\n        per_device_train_batch_size=4,\n        learning_rate=2e-4,\n        warmup_ratio=0.03,\n        lr_scheduler_type=\"cosine\"\n    ),\n    dataset_text_field=\"text\"\n)\ntrainer.train()\nmodel.save_pretrained(\"./finetuned-lora\")\n\n# â”€â”€ RAG vs Fine-tuning Decision Matrix â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n\"\"\"\n                    RAG         Fine-tuning\nâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nKnowledge cutoff    No limit    Fixed at training\nPrivate data        âœ“           âœ“ (but baked in)\nUpdateable          Easy        Expensive retrain\nVerifiable          Citations   Hard to trace\nLatency             +retrieval  Fast inference\nCost                Vector DB   GPU training\nStyle/Tone          Prompt      âœ“ Better\nFormat control      Prompt      âœ“ Better\nReasoning pattern   Limited     âœ“ Better\n\"\"\"\n"
}
}
},
  "Software Engineering": {
  "icon": "ti-settings",
  "color": "#5F5E5A",
  "topics": {
    "SDLC": {
      "explanation": "The Software Development Life Cycle is a structured process for planning, creating, testing, and deploying software.",
      "details": [
        "Phases: Planning, Requirements, Design, Implementation, Testing, Deployment, Maintenance",
        "Models: Waterfall, Agile, Spiral, V-Model, RAD",
        "Goal: deliver high-quality software on time and within budget"
],
      "example": "// SDLC phases\n1. PLANNING       â†’ feasibility, timeline, budget\n2. REQUIREMENTS   â†’ SRS document (functional + non-functional)\n3. DESIGN         â†’ HLD (architecture), LLD (schemas, classes)\n4. IMPLEMENTATION â†’ coding, code review, version control\n5. TESTING        â†’ unit, integration, system, UAT\n6. DEPLOYMENT     â†’ release to production\n7. MAINTENANCE    â†’ bug fixes, updates, enhancements"
},
    "Agile/Scrum": {
      "explanation": "Agile is an iterative methodology. Scrum is a popular framework using short sprints (1â€“4 weeks) to deliver working software incrementally.",
      "details": [
        "Roles: Product Owner, Scrum Master, Development Team",
        "Artifacts: Product Backlog, Sprint Backlog, Increment",
        "Ceremonies: Sprint Planning, Daily Standup, Sprint Review, Retrospective"
],
      "example": "// User Story format\n\"As a [user], I want [feature] so that [benefit]\"\nEx: \"As a customer, I want to filter by price\n     so that I can find affordable items.\"\n\n// Sprint 2 weeks:\nPlanning â†’ Daily Standup (15 min) â†’ Review â†’ Retrospective\n\n// Daily Standup:\n// What did I do yesterday?\n// What will I do today?\n// Any blockers?"
},
    "Git": {
      "explanation": "Git is a distributed version control system that tracks changes in code, enables collaboration, and allows reverting to previous versions.",
      "details": [
        "Repository: project folder tracked by git",
        "Commit: snapshot of changes with a message",
        "Branch: independent line of development",
        "Merge: combine branches; Rebase: replay commits"
],
      "example": "git init / git clone <url>\ngit add . && git commit -m \"Add feature\"\ngit push origin main / git pull origin main\n\ngit branch feature/login    # create branch\ngit checkout -b feature/signup  # create + switch\n\ngit merge feature/login     # merge into current\ngit log --oneline           # view history\ngit stash / git stash pop   # save/restore WIP\ngit reset --soft HEAD~1     # undo last commit (keep changes)"
}
}
},
  "Cybersecurity": {
  "icon": "ti-shield",
  "color": "#3C3489",
  "topics": {
    "Encryption": {
      "explanation": "Encryption converts readable data (plaintext) into unreadable ciphertext using a cryptographic algorithm and key. It is the foundational mechanism for confidentiality in modern computing â€” securing data in transit (TLS), at rest (AES), and end-to-end (Signal protocol).",
      "details": [
        "Symmetric encryption: same key encrypts and decrypts â€” fast, but key distribution is the hard problem",
        "AES (Advanced Encryption Standard): current gold standard symmetric cipher; block cipher operating on 128-bit blocks",
        "AES key sizes: AES-128 (128-bit key), AES-192, AES-256 â€” longer = more secure but marginally slower",
        "AES modes: ECB (never use â€” same block â†’ same ciphertext), CBC (needs IV), GCM (authenticated, preferred), CTR",
        "GCM mode: provides both encryption AND authentication (AEAD) â€” detects tampering without separate HMAC",
        "Asymmetric encryption: public key encrypts, private key decrypts â€” solves key distribution but slow",
        "RSA: based on integer factorization difficulty; 2048-bit minimum, 4096-bit recommended for long-term secrets",
        "ECC (Elliptic Curve Cryptography): same security as RSA but with much smaller keys â€” ECDSA, ECDH",
        "Hybrid encryption: TLS pattern â€” RSA/ECDH to securely exchange a symmetric AES session key, then use AES",
        "Perfect Forward Secrecy (PFS): ephemeral key exchange (ECDHE) â€” compromise of long-term key doesn't expose past sessions",
        "IV (Initialization Vector): random value ensures same plaintext â†’ different ciphertext each time; must be unique, never reuse",
        "Padding: block ciphers need input to be multiple of block size; PKCS#7 is standard; OAEP for RSA",
        "Key derivation: never use passwords directly as keys; use KDF (PBKDF2, scrypt, Argon2) to derive cryptographic key",
        "Quantum threat: AES-256 is quantum-safe; RSA and ECC will be broken by Shor's algorithm â€” NIST post-quantum standards emerging"
],
      "example": "from Crypto.Cipher import AES\nfrom Crypto.Random import get_random_bytes\nfrom Crypto.Util.Padding import pad, unpad\nfrom cryptography.hazmat.primitives.asymmetric import rsa, padding, ec\nfrom cryptography.hazmat.primitives import hashes, serialization\nfrom cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC\nfrom cryptography.hazmat.primitives.ciphers.aead import AESGCM\nimport base64, os\n\n# â”€â”€ AES-256-GCM (Authenticated Encryption) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# GCM = most recommended mode: encryption + integrity check combined\nkey = get_random_bytes(32)      # 256-bit key\nnonce = get_random_bytes(12)    # 96-bit nonce (DO NOT reuse with same key)\nplaintext = b\"Top secret data\"\naad = b\"header info\"            # Additional Authenticated Data (not encrypted but authenticated)\n\naesgcm = AESGCM(key)\nciphertext = aesgcm.encrypt(nonce, plaintext, aad)\n# ciphertext includes 16-byte GCM authentication tag appended\n\ndecrypted = aesgcm.decrypt(nonce, ciphertext, aad)\nassert decrypted == plaintext\n\n# If ciphertext is tampered â†’ cryptography.exceptions.InvalidTag raised\ntry:\n    tampered = ciphertext[:-1] + bytes([ciphertext[-1] ^ 0xFF])\n    aesgcm.decrypt(nonce, tampered, aad)\nexcept Exception as e:\n    print(f\"Tamper detected: {e}\")   # InvalidTag\n\n# â”€â”€ AES-256-CBC (older, requires separate MAC) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nkey_cbc = get_random_bytes(32)\niv  = get_random_bytes(16)      # 128-bit IV, must be random each time\ncipher = AES.new(key_cbc, AES.MODE_CBC, iv)\nct = cipher.encrypt(pad(b\"Secret message\", AES.block_size))\n\n# Decrypt\ncipher2 = AES.new(key_cbc, AES.MODE_CBC, iv)\npt = unpad(cipher2.decrypt(ct), AES.block_size)\n\n# â”€â”€ RSA-OAEP (Asymmetric Encryption) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# Use for encrypting small data (e.g., symmetric key exchange)\nprivate_key = rsa.generate_private_key(\n    public_exponent=65537,\n    key_size=2048       # use 4096 for long-term secrets\n)\npublic_key = private_key.public_key()\n\n# Encrypt with RECIPIENT's public key\nmessage = b\"AES session key goes here\"\nciphertext = public_key.encrypt(\n    message,\n    padding.OAEP(\n        mgf=padding.MGF1(algorithm=hashes.SHA256()),\n        algorithm=hashes.SHA256(),\n        label=None\n    )\n)\n\n# Decrypt with private key\nplaintext = private_key.decrypt(\n    ciphertext,\n    padding.OAEP(\n        mgf=padding.MGF1(algorithm=hashes.SHA256()),\n        algorithm=hashes.SHA256(),\n        label=None\n    )\n)\nassert plaintext == message\n\n# â”€â”€ RSA Digital Signature â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# Sign with SENDER's private key; verify with public key\nsignature = private_key.sign(\n    b\"document content\",\n    padding.PSS(\n        mgf=padding.MGF1(hashes.SHA256()),\n        salt_length=padding.PSS.MAX_LENGTH\n    ),\n    hashes.SHA256()\n)\n\n# Verify (anyone with public key can verify)\ntry:\n    public_key.verify(\n        signature,\n        b\"document content\",\n        padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),\n        hashes.SHA256()\n    )\n    print(\"Signature valid âœ“\")\nexcept Exception:\n    print(\"Signature invalid â€” document tampered!\")\n\n# â”€â”€ ECDH Key Exchange (Elliptic Curve Diffie-Hellman) â”€â”€â”€â”€â”€â”€â”€â”€\n# Both parties derive the same shared secret without transmitting it\n# Basis of Perfect Forward Secrecy (PFS) in TLS 1.3\nfrom cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey\n\nalice_private = X25519PrivateKey.generate()\nbob_private   = X25519PrivateKey.generate()\n\nalice_public = alice_private.public_key()\nbob_public   = bob_private.public_key()\n\n# Exchange public keys (safe to transmit publicly)\nalice_shared = alice_private.exchange(bob_public)\nbob_shared   = bob_private.exchange(alice_public)\nassert alice_shared == bob_shared   # same secret!\n# Now derive AES key from shared secret using HKDF\n\n# â”€â”€ Key Derivation from Password â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# NEVER use password directly as encryption key!\nfrom cryptography.hazmat.primitives.kdf.scrypt import Scrypt\n\npassword = b\"user_password\"\nsalt = os.urandom(16)          # random salt, store alongside ciphertext\n\nkdf = Scrypt(salt=salt, length=32, n=2**14, r=8, p=1)\nderived_key = kdf.derive(password)  # 256-bit AES key\n\n# â”€â”€ Hybrid Encryption Pattern (like TLS) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\ndef hybrid_encrypt(recipient_public_key, message: bytes) -> dict:\n    # 1. Generate random AES session key\n    session_key = get_random_bytes(32)\n    nonce = get_random_bytes(12)\n\n    # 2. Encrypt message with AES-GCM (fast symmetric)\n    aesgcm = AESGCM(session_key)\n    ct = aesgcm.encrypt(nonce, message, None)\n\n    # 3. Encrypt session key with recipient's RSA public key\n    encrypted_key = recipient_public_key.encrypt(\n        session_key,\n        padding.OAEP(mgf=padding.MGF1(hashes.SHA256()), algorithm=hashes.SHA256(), label=None)\n    )\n    return {\"encrypted_key\": encrypted_key, \"nonce\": nonce, \"ciphertext\": ct}\n\n# â”€â”€ Common Pitfalls â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# âŒ WRONG: ECB mode â€” same plaintext block â†’ same ciphertext block (patterns visible!)\n# âŒ WRONG: reusing nonce/IV with same key â†’ catastrophic key stream exposure\n# âŒ WRONG: self-implemented crypto (\"rolling your own crypto\")\n# âŒ WRONG: using MD5/SHA1 for security (broken, use SHA-256+)\n# âŒ WRONG: using RSA directly to encrypt large data (use hybrid)\n# âœ“  RIGHT: AES-256-GCM for symmetric, ECDH for key exchange, RSA/ECDSA for signatures\n"
},
    "Hashing": {
      "explanation": "Hashing converts arbitrary input into a fixed-size digest using a deterministic, one-way function. It is fundamentally different from encryption: you cannot reverse a hash to recover input. Hashing is used for data integrity, password storage, digital signatures, and data structures (hash maps).",
      "details": [
        "One-way (preimage resistance): given hash H, computationally infeasible to find input M such that hash(M) = H",
        "Collision resistance: computationally infeasible to find two different inputs that produce the same hash",
        "Avalanche effect: a single bit change in input produces a completely different hash output",
        "Deterministic: same input ALWAYS produces the same hash â€” enables verification",
        "MD5 (128-bit): BROKEN â€” collisions found; use only for non-security checksums",
        "SHA-1 (160-bit): BROKEN â€” Google's SHAttered attack produced PDF collision in 2017",
        "SHA-256 / SHA-512: secure, widely used for integrity checks, digital signatures, blockchain",
        "SHA-3 (Keccak): NIST standard, different construction (sponge) than SHA-2 â€” resistant to length extension attacks",
        "BLAKE2 / BLAKE3: faster than SHA-2, secure, recommended for performance-sensitive applications",
        "Password hashing: NEVER use SHA-256 for passwords â€” attackers can compute billions/sec; use bcrypt, scrypt, or Argon2",
        "bcrypt: intentionally slow (~100 ops/sec); includes salt automatically; adaptive cost factor",
        "scrypt: memory-hard (requires large RAM) â€” resists GPU/ASIC attacks more than bcrypt",
        "Argon2: winner of Password Hashing Competition 2015; three variants: Argon2i (side-channel), Argon2d (GPU), Argon2id (recommended)",
        "Rainbow tables: precomputed hash â†’ password lookup tables; defeated by salting",
        "HMAC: Hash-based Message Authentication Code â€” uses key + hash to verify both integrity AND authenticity",
        "Length extension attack: SHA-256/512 vulnerable; use HMAC or SHA-3 instead for MACs"
],
      "example": "import hashlib, hmac, os, secrets\nimport bcrypt\nfrom argon2 import PasswordHasher\nfrom argon2.exceptions import VerifyMismatchError\n\n# â”€â”€ General Hashing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\ndata = b\"important document content\"\n\n# SHA-256 â€” file integrity, digital signatures (NOT passwords)\nsha256 = hashlib.sha256(data).hexdigest()\nprint(f\"SHA-256: {sha256}\")   # 64 hex chars = 256 bits\n\n# SHA-512 â€” higher security margin\nsha512 = hashlib.sha512(data).hexdigest()\n\n# BLAKE2b â€” faster than SHA-256, secure, good general purpose\nblake2 = hashlib.blake2b(data, digest_size=32).hexdigest()\n\n# Verify file integrity\ndef verify_file_integrity(filepath: str, expected_hash: str) -> bool:\n    h = hashlib.sha256()\n    with open(filepath, 'rb') as f:\n        for chunk in iter(lambda: f.read(65536), b''):  # 64KB chunks\n            h.update(chunk)\n    return hmac.compare_digest(h.hexdigest(), expected_hash)  # timing-safe compare\n\n# Avalanche effect demo\nh1 = hashlib.sha256(b\"password\").hexdigest()\nh2 = hashlib.sha256(b\"Password\").hexdigest()  # one char different\nprint(h1)  # ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f\nprint(h2)  # 0b14d501a594442a01c6859541bcb3428d2ff0f3d9f2b45e3dddab52938ff5e\n# Completely different!\n\n# â”€â”€ HMAC â€” Message Authentication â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# Ensures message was from someone who knows the secret key\nsecret_key = secrets.token_bytes(32)   # 256-bit key\n\ndef create_hmac(key: bytes, message: bytes) -> str:\n    return hmac.new(key, message, hashlib.sha256).hexdigest()\n\ndef verify_hmac(key: bytes, message: bytes, provided_mac: str) -> bool:\n    expected = create_hmac(key, message)\n    return hmac.compare_digest(expected, provided_mac)  # constant-time!\n\nmac = create_hmac(secret_key, b\"Transfer $1000 to Alice\")\nprint(verify_hmac(secret_key, b\"Transfer $1000 to Alice\", mac))  # True\nprint(verify_hmac(secret_key, b\"Transfer $9999 to Alice\", mac))  # False â€” tampered!\n\n# API request signing pattern:\ndef sign_api_request(api_key: bytes, payload: str) -> dict:\n    timestamp = str(int(__import__('time').time()))\n    message = f\"{timestamp}:{payload}\".encode()\n    signature = create_hmac(api_key, message)\n    return {\"payload\": payload, \"timestamp\": timestamp, \"signature\": signature}\n\n# â”€â”€ Password Hashing with bcrypt â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# bcrypt automatically: generates salt, applies cost factor, stores both in hash\npassword = b\"my_secure_password_123!\"\n\n# Hash at registration:\nhashed = bcrypt.hashpw(password, bcrypt.gensalt(rounds=12))\n# rounds=12 â†’ ~250ms per check (adjust based on your hardware)\n# stored hash looks like: $2b$12$<salt><hash>  (60 chars)\nprint(f\"bcrypt hash: {hashed.decode()}\")\n\n# Verify at login:\nprint(bcrypt.checkpw(password, hashed))           # True\nprint(bcrypt.checkpw(b\"wrong_password\", hashed))  # False\n\n# â”€â”€ Password Hashing with Argon2id (recommended 2024+) â”€â”€â”€â”€â”€â”€â”€\nph = PasswordHasher(\n    time_cost=2,       # number of iterations\n    memory_cost=65536, # 64 MB of RAM required\n    parallelism=2,     # threads\n    hash_len=32,\n    salt_len=16\n)\n\nhashed_argon2 = ph.hash(\"user_password\")\n# Returns: $argon2id$v=19$m=65536,t=2,p=2$<salt>$<hash>\n\ntry:\n    ph.verify(hashed_argon2, \"user_password\")    # raises nothing = correct\n    if ph.check_needs_rehash(hashed_argon2):     # cost factors changed?\n        hashed_argon2 = ph.hash(\"user_password\") # rehash with new params\n    print(\"Password correct âœ“\")\nexcept VerifyMismatchError:\n    print(\"Wrong password âœ—\")\n\n# â”€â”€ Rainbow Table Defense (salting) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# Without salt: hash(\"password123\") is always the same\n# Attacker precomputes billions of (input â†’ hash) pairs\n# With salt: hash(\"password123\" + random_salt) â€” unique per user\n\n# bcrypt/Argon2 handle salting automatically!\n# For manual salting (SHA-256 only for non-passwords):\nsalt = os.urandom(32)\ncombined = salt + b\"data_to_protect\"\ndigest = hashlib.sha256(combined).digest()\n# Store: salt + digest\n\n# â”€â”€ Timing Attack Prevention â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# âŒ WRONG: string comparison leaks timing info\ndef insecure_verify(provided, stored):\n    return provided == stored   # returns early on first mismatch!\n\n# âœ“ RIGHT: constant-time comparison\ndef secure_verify(provided: bytes, stored: bytes) -> bool:\n    return hmac.compare_digest(provided, stored)  # always takes same time\n\n# â”€â”€ Cryptographic vs Non-Cryptographic Hash â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# Cryptographic (SHA-256, SHA-3, BLAKE2):\n#   - Preimage resistant, collision resistant, one-way\n#   - Use for: passwords, integrity, signatures, MACs\n\n# Non-cryptographic (MurmurHash, xxHash, CRC32):\n#   - Fast, NOT secure, easily reversible/collided\n#   - Use for: hash maps, checksums, bloom filters, deduplication\n\n# â”€â”€ Common Mistakes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# âŒ Using SHA-256 directly for passwords (billions/sec on GPU)\n# âŒ Storing passwords in plaintext or reversible encoding (base64)\n# âŒ Using MD5 or SHA-1 for security purposes (broken)\n# âŒ Using == to compare hashes (timing attack)\n# âŒ No salt â†’ rainbow table attack\n# âŒ Shared salt â†’ attacker knows if two users have same password\n# âœ“ Use bcrypt or Argon2id for passwords, always\n"
},
    "Common Attacks": {
      "explanation": "Understanding how attacks work is the foundation of defense. Attackers target the weakest link â€” often not cryptography itself, but injection flaws, broken authentication, misconfiguration, and human error. The OWASP Top 10 covers the most critical web application security risks.",
      "details": [
        "SQL Injection: attacker injects SQL code through user input; manipulates database queries; #1 web vulnerability for decades",
        "XSS (Cross-Site Scripting): inject malicious JavaScript into pages viewed by other users; steals cookies/tokens",
        "CSRF (Cross-Site Request Forgery): trick authenticated user's browser into making unauthorized requests",
        "MITM (Man-in-the-Middle): attacker intercepts communication between two parties; defeated by TLS + cert pinning",
        "Brute Force: systematically try all possible passwords; defeated by rate limiting, account lockout, strong passwords",
        "Credential Stuffing: use leaked username/password pairs from breaches; defeated by MFA, unique passwords",
        "Buffer Overflow: write beyond allocated memory boundary; can overwrite return address, execute arbitrary code",
        "SSRF (Server-Side Request Forgery): server makes requests to internal/attacker-controlled URLs",
        "Path Traversal: ../../etc/passwd â€” access files outside intended directory",
        "Insecure Direct Object Reference (IDOR): /api/invoice/1234 â†’ change to /api/invoice/1235 â†’ see someone else's data",
        "XXE (XML External Entity): malicious XML references external entities to read files or make internal requests",
        "Clickjacking: iframe overlay tricks user into clicking on something they can't see",
        "Social Engineering: phishing, pretexting, vishing â€” exploits human psychology, not technology"
],
      "example": "# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# SQL INJECTION\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\n# âŒ VULNERABLE â€” string concatenation\ndef get_user_VULNERABLE(username: str):\n    query = f\"SELECT * FROM users WHERE username = '{username}'\"\n    return db.execute(query)\n# Input: admin' OR '1'='1\n# Query becomes: SELECT * FROM users WHERE username = 'admin' OR '1'='1'\n# Returns ALL users!\n\n# Input: '; DROP TABLE users; --\n# Query: SELECT * FROM users WHERE username = ''; DROP TABLE users; --\n# Drops the entire table!\n\n# âœ“ SAFE â€” parameterized queries (prepared statements)\ndef get_user_SAFE(username: str):\n    query = \"SELECT * FROM users WHERE username = ?\"\n    return db.execute(query, (username,))  # username treated as data, never code\n\n# âœ“ ORM (Object-Relational Mapper) â€” safe by default\nfrom sqlalchemy import text\nuser = db.session.query(User).filter(User.username == username).first()\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# XSS (Cross-Site Scripting)\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\n# âŒ VULNERABLE â€” rendering user input as HTML\ndef render_comment_VULNERABLE(comment):\n    return f\"<div>{comment}</div>\"\n# Input: <script>document.cookie // send to attacker</script>\n# Victim's browser executes attacker's script!\n# Can steal session cookies, redirect to phishing page, keylog\n\n# âœ“ SAFE â€” escape/sanitize user input\nimport html\ndef render_comment_SAFE(comment: str) -> str:\n    return f\"<div>{html.escape(comment)}</div>\"\n# <script> becomes &lt;script&gt; â€” rendered as text, not executed\n\n# âœ“ Content Security Policy header â€” browser-level protection\nresponse.headers['Content-Security-Policy'] = \"default-src 'self'; script-src 'self'\"\n# Prevents loading scripts from other domains\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# CSRF (Cross-Site Request Forgery)\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\n# Attack: victim visits evil.com, which submits a form to bank.com\n# Bank.com sees the request with victim's session cookie â†’ transfers money\n\n# âœ“ Defense 1: CSRF token (unpredictable, tied to session)\nimport secrets\ndef generate_csrf_token():\n    token = secrets.token_urlsafe(32)\n    session['csrf_token'] = token\n    return token  # embed in every form as hidden field\n\ndef validate_csrf(request):\n    token = request.form.get('csrf_token')\n    if not token or not hmac.compare_digest(token, session['csrf_token']):\n        raise SecurityError(\"CSRF token mismatch!\")\n\n# âœ“ Defense 2: SameSite cookie attribute\nresponse.set_cookie('session', value, samesite='Strict')\n# Browser won't send cookie on cross-origin requests\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# BRUTE FORCE & CREDENTIAL STUFFING\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\nimport time\nfrom collections import defaultdict\n\nclass RateLimiter:\n    def __init__(self, max_attempts=5, window_seconds=300):\n        self.attempts = defaultdict(list)\n        self.max_attempts = max_attempts\n        self.window = window_seconds\n\n    def is_blocked(self, identifier: str) -> bool:\n        now = time.time()\n        # Remove old attempts outside window\n        self.attempts[identifier] = [\n            t for t in self.attempts[identifier]\n            if now - t < self.window\n        ]\n        return len(self.attempts[identifier]) >= self.max_attempts\n\n    def record_attempt(self, identifier: str):\n        self.attempts[identifier].append(time.time())\n\nlimiter = RateLimiter()\n\ndef login(ip: str, username: str, password: str):\n    if limiter.is_blocked(ip) or limiter.is_blocked(username):\n        raise Exception(\"Too many attempts. Wait 5 minutes.\")\n\n    user = get_user(username)\n    if not user or not verify_password(password, user.password_hash):\n        limiter.record_attempt(ip)\n        limiter.record_attempt(username)\n        raise Exception(\"Invalid credentials\")  # don't say \"wrong password\" specifically!\n    return create_session(user)\n\n# âœ“ Add CAPTCHA after N failures\n# âœ“ Alert user of login from new location/device\n# âœ“ Require MFA (TOTP/WebAuthn) â€” stops credential stuffing entirely\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# PATH TRAVERSAL\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\nimport os\n\n# âŒ VULNERABLE\ndef serve_file_VULNERABLE(filename):\n    path = f\"/var/www/uploads/{filename}\"\n    return open(path).read()\n# Input: ../../etc/passwd â†’ reads /etc/passwd\n\n# âœ“ SAFE â€” canonicalize and validate stays within base directory\ndef serve_file_SAFE(filename: str) -> bytes:\n    base_dir = \"/var/www/uploads\"\n    # Remove any path components\n    filename = os.path.basename(filename)    # strips ../\n    full_path = os.path.realpath(os.path.join(base_dir, filename))\n    \n    if not full_path.startswith(os.path.realpath(base_dir)):\n        raise PermissionError(\"Path traversal detected!\")\n    return open(full_path, 'rb').read()\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# IDOR (Insecure Direct Object Reference)\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\n# âŒ VULNERABLE\n@app.route('/api/invoice/<int:invoice_id>')\ndef get_invoice_VULNERABLE(invoice_id):\n    return Invoice.query.get(invoice_id)  # any user can see any invoice!\n\n# âœ“ SAFE â€” always check ownership\n@app.route('/api/invoice/<int:invoice_id>')\ndef get_invoice_SAFE(invoice_id):\n    invoice = Invoice.query.filter_by(\n        id=invoice_id,\n        user_id=current_user.id    # must belong to current user\n    ).first_or_404()\n    return invoice\n\n# Or use UUIDs instead of sequential IDs to prevent enumeration:\n# /api/invoice/550e8400-e29b-41d4-a716-446655440000 (hard to guess)\n"
},
    "Authentication & Authorization": {
      "explanation": "Authentication verifies WHO you are (identity); Authorization determines WHAT you're allowed to do (permissions). These are distinct and both critical. Broken authentication is the #2 cause of data breaches after injection.",
      "details": [
        "Authentication factors: Something you know (password), Something you have (OTP device), Something you are (biometrics)",
        "MFA/2FA: combining two factors â€” drastically reduces account takeover risk (99.9% reduction per Microsoft)",
        "TOTP (Time-based OTP): RFC 6238; shared secret + current time â†’ 6-digit code; used by Google Authenticator",
        "WebAuthn / FIDO2: hardware-backed passkeys; phishing-resistant; no password transmitted",
        "JWT (JSON Web Token): stateless auth token; Header.Payload.Signature; server validates without DB lookup",
        "JWT structure: header (alg, typ) + payload (claims: sub, exp, iat) + signature (HMAC-SHA256 or RS256)",
        "JWT pitfalls: 'alg: none' attack (strip signature), weak secret, no expiry, storing sensitive data in payload",
        "Session tokens: server-side session stored in DB; invalidated server-side (vs JWT which can't be truly revoked)",
        "OAuth 2.0: authorization framework â€” 'Login with Google'; grants limited access without sharing password",
        "OAuth flows: Authorization Code (web apps), PKCE (mobile/SPA), Client Credentials (server-to-server)",
        "RBAC (Role-Based Access Control): assign permissions to roles, assign roles to users",
        "ABAC (Attribute-Based Access Control): policies based on user attributes, resource attributes, environment",
        "Principle of Least Privilege: grant only minimum permissions necessary â€” limits blast radius of breaches",
        "Password policies: min 12 chars, check against breach databases (HaveIBeenPwned), don't force regular rotation"
],
      "example": "import jwt, time, secrets, pyotp, qrcode\nfrom functools import wraps\nfrom flask import request, jsonify\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# JWT (JSON Web Tokens)\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\nSECRET_KEY = secrets.token_urlsafe(64)   # strong random secret; store in env var!\n\ndef create_jwt(user_id: int, role: str) -> str:\n    payload = {\n        \"sub\": str(user_id),             # subject\n        \"role\": role,                     # custom claim\n        \"iat\": int(time.time()),          # issued at\n        \"exp\": int(time.time()) + 3600,  # expires in 1 hour\n        \"jti\": secrets.token_urlsafe(16) # JWT ID â€” unique, prevents replay\n    }\n    return jwt.encode(payload, SECRET_KEY, algorithm=\"HS256\")\n\ndef verify_jwt(token: str) -> dict:\n    try:\n        payload = jwt.decode(\n            token,\n            SECRET_KEY,\n            algorithms=[\"HS256\"],    # ALWAYS specify allowed algorithms!\n            options={\"require\": [\"exp\", \"iat\", \"sub\"]}\n        )\n        return payload\n    except jwt.ExpiredSignatureError:\n        raise Exception(\"Token expired\")\n    except jwt.InvalidTokenError:\n        raise Exception(\"Invalid token\")\n\n# âŒ CRITICAL JWT PITFALLS:\n# 1. Never accept alg=none: jwt.decode(token, \"\", algorithms=[\"none\"]) â†’ catastrophic!\n# 2. Never store sensitive info in payload (it's base64, NOT encrypted, anyone can decode it)\n# 3. Always verify expiry, always specify algorithm\n\n# â”€â”€ JWT Refresh Token Pattern â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# Access token: short-lived (15min), used for API calls\n# Refresh token: long-lived (7 days), stored securely, used to get new access token\n\ndef create_token_pair(user_id: int) -> dict:\n    access_token = create_jwt_with_expiry(user_id, seconds=900)    # 15 min\n    refresh_token = create_jwt_with_expiry(user_id, seconds=604800) # 7 days\n    store_refresh_token_hash(user_id, refresh_token)  # store in DB for revocation\n    return {\"access_token\": access_token, \"refresh_token\": refresh_token}\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# TOTP (Time-Based OTP) â€” Google Authenticator compatible\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\ndef setup_totp(user_id: int, username: str) -> dict:\n    secret = pyotp.random_base32()   # 160-bit secret\n    store_totp_secret(user_id, secret)  # store encrypted in DB\n\n    totp_uri = pyotp.totp.TOTP(secret).provisioning_uri(\n        name=username,\n        issuer_name=\"YourApp\"\n    )\n    # User scans this QR code with their authenticator app\n    qr = qrcode.make(totp_uri)\n    return {\"secret\": secret, \"uri\": totp_uri}\n\ndef verify_totp(user_id: int, code: str) -> bool:\n    secret = get_totp_secret(user_id)\n    totp = pyotp.TOTP(secret)\n    return totp.verify(code, valid_window=1)  # allow 30s clock drift\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# RBAC (Role-Based Access Control) with Flask decorators\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\nPERMISSIONS = {\n    \"viewer\":  {\"read\"},\n    \"editor\":  {\"read\", \"write\"},\n    \"admin\":   {\"read\", \"write\", \"delete\", \"manage_users\"},\n    \"superadmin\": {\"read\", \"write\", \"delete\", \"manage_users\", \"system_config\"}\n}\n\ndef require_auth(f):\n    @wraps(f)\n    def decorated(*args, **kwargs):\n        auth_header = request.headers.get('Authorization', '')\n        if not auth_header.startswith('Bearer '):\n            return jsonify({\"error\": \"No token\"}), 401\n        try:\n            token = auth_header.split(' ')[1]\n            request.user = verify_jwt(token)\n        except Exception as e:\n            return jsonify({\"error\": str(e)}), 401\n        return f(*args, **kwargs)\n    return decorated\n\ndef require_permission(permission: str):\n    def decorator(f):\n        @wraps(f)\n        @require_auth\n        def decorated(*args, **kwargs):\n            user_role = request.user.get(\"role\", \"viewer\")\n            if permission not in PERMISSIONS.get(user_role, set()):\n                return jsonify({\"error\": \"Forbidden\"}), 403\n            return f(*args, **kwargs)\n        return decorated\n    return decorator\n\n@app.route('/api/data')\n@require_permission('read')\ndef get_data():\n    return jsonify({\"data\": \"...\"})\n\n@app.route('/api/data', methods=['DELETE'])\n@require_permission('delete')\ndef delete_data():\n    return jsonify({\"deleted\": True})\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# OAuth 2.0 + PKCE (Authorization Code with PKCE)\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\nimport hashlib, base64\n\n# PKCE prevents authorization code interception\ndef generate_pkce_pair() -> dict:\n    code_verifier = secrets.token_urlsafe(64)   # random string\n    code_challenge = base64.urlsafe_b64encode(\n        hashlib.sha256(code_verifier.encode()).digest()\n    ).rstrip(b'=').decode()\n    return {\"verifier\": code_verifier, \"challenge\": code_challenge}\n\n# Authorization URL â€” send user here to authorize with Google/GitHub/etc.\ndef build_auth_url(client_id: str, redirect_uri: str, pkce: dict) -> str:\n    state = secrets.token_urlsafe(32)  # CSRF protection for OAuth flow\n    store_in_session('oauth_state', state)\n    store_in_session('pkce_verifier', pkce['verifier'])\n\n    return (\n        f\"https://accounts.google.com/o/oauth2/auth\"\n        f\"?client_id={client_id}\"\n        f\"&redirect_uri={redirect_uri}\"\n        f\"&response_type=code\"\n        f\"&scope=openid email profile\"\n        f\"&state={state}\"\n        f\"&code_challenge={pkce['challenge']}\"\n        f\"&code_challenge_method=S256\"\n    )\n\n# â”€â”€ Password Hashing (best practice recap) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nimport bcrypt\n\ndef hash_password(plain: str) -> str:\n    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt(12)).decode()\n\ndef verify_password(plain: str, hashed: str) -> bool:\n    return bcrypt.checkpw(plain.encode(), hashed.encode())\n\n# â”€â”€ Security Headers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n@app.after_request\ndef add_security_headers(response):\n    response.headers['X-Content-Type-Options'] = 'nosniff'\n    response.headers['X-Frame-Options'] = 'DENY'                # clickjacking\n    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'\n    response.headers['Content-Security-Policy'] = \"default-src 'self'\"\n    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'\n    response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'\n    return response\n"
},
    "Network Security": {
      "explanation": "Network security encompasses the protocols, practices, and controls that protect data in transit and network infrastructure from unauthorized access, attacks, and disruptions. TLS, firewalls, VPNs, and intrusion detection systems form the core of network defense.",
      "details": [
        "TLS (Transport Layer Security): encrypts data in transit; TLS 1.3 is current standard (1.0/1.1 deprecated)",
        "TLS handshake: client hello â†’ server hello + certificate â†’ key exchange (ECDHE) â†’ symmetric key derived â†’ encrypted channel",
        "Certificate chain: server cert â†’ intermediate CA â†’ root CA (in browser trust store); pinning adds extra verification",
        "HTTPS: HTTP over TLS; certificate proves server identity AND encrypts traffic",
        "DNS over HTTPS (DoH) / DNS over TLS (DoT): encrypts DNS queries to prevent DNS snooping and spoofing",
        "Firewall: filters traffic by IP, port, protocol; stateless (packet filter) vs stateful (tracks connections)",
        "WAF (Web Application Firewall): inspects HTTP traffic; blocks SQL injection, XSS, malicious bots",
        "VPN: encrypts all traffic between client and server; OpenVPN, WireGuard (modern, faster)",
        "Zero Trust Architecture: 'never trust, always verify' â€” no implicit trust even inside network perimeter",
        "IDS/IPS: Intrusion Detection/Prevention System â€” monitors for known attack patterns; Snort, Suricata",
        "DDoS: Distributed Denial of Service â€” flood target with traffic to exhaust resources; mitigated by CDN, rate limiting, anycast",
        "Port scanning: Nmap discovers open ports/services â€” attackers use this for reconnaissance",
        "Network segmentation: isolate sensitive systems in separate network segments; limits lateral movement after breach"
],
      "example": "import ssl, socket, subprocess\nimport requests\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# TLS / HTTPS â€” Inspecting and Verifying\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\n# Inspect a server's TLS certificate\ndef get_cert_info(hostname: str, port: int = 443) -> dict:\n    context = ssl.create_default_context()\n    with socket.create_connection((hostname, port), timeout=10) as sock:\n        with context.wrap_socket(sock, server_hostname=hostname) as ssock:\n            cert = ssock.getpeercert()\n            cipher = ssock.cipher()\n            version = ssock.version()\n    return {\n        \"subject\": dict(x[0] for x in cert['subject']),\n        \"issuer\":  dict(x[0] for x in cert['issuer']),\n        \"expires\": cert['notAfter'],\n        \"san\":     cert.get('subjectAltName', []),\n        \"cipher\":  cipher,\n        \"tls_version\": version\n    }\n\ninfo = get_cert_info(\"google.com\")\nprint(f\"Issued to: {info['subject']}\")\nprint(f\"Expires: {info['expires']}\")\nprint(f\"TLS: {info['tls_version']} using {info['cipher']}\")\n\n# â”€â”€ Enforce HTTPS + Verify Certificates (requests) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\n# requests verifies TLS by default\nresponse = requests.get(\"https://api.example.com/data\")  # verify=True by default\n\n# âŒ NEVER disable certificate verification in production!\nrequests.get(\"https://...\", verify=False)   # MITM vulnerable!\n\n# âœ“ Certificate pinning â€” extra protection\nimport certifi\nresponse = requests.get(\"https://api.example.com\", verify=\"/path/to/custom-ca-bundle.pem\")\n\n# â”€â”€ Secure TLS Server with Python â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nimport ssl\nfrom http.server import HTTPServer, BaseHTTPRequestHandler\n\ndef create_secure_server(certfile: str, keyfile: str, port: int = 443):\n    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)\n    context.minimum_version = ssl.TLSVersion.TLSv1_3   # TLS 1.3 minimum!\n    context.load_cert_chain(certfile=certfile, keyfile=keyfile)\n    \n    # Strong cipher suites only\n    context.set_ciphers('ECDH+AESGCM:ECDH+CHACHA20:!aNULL:!MD5:!DSS')\n    \n    server = HTTPServer(('', port), BaseHTTPRequestHandler)\n    server.socket = context.wrap_socket(server.socket, server_side=True)\n    return server\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# Firewall Rules (iptables concepts)\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\n# Basic iptables rules (Linux):\n# iptables -P INPUT DROP           # default: drop all inbound\n# iptables -P FORWARD DROP         # default: drop all forwarded\n# iptables -P OUTPUT ACCEPT        # default: allow all outbound\n# iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT  # allow responses\n# iptables -A INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT   # SSH from LAN only\n# iptables -A INPUT -p tcp --dport 443 -j ACCEPT   # HTTPS from anywhere\n# iptables -A INPUT -p tcp --dport 80 -j ACCEPT    # HTTP (redirect to HTTPS)\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# Rate Limiting (DDoS/Brute Force protection)\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\nfrom collections import defaultdict\nimport time\n\nclass TokenBucket:\n    \"\"\"Token bucket rate limiter â€” allows burst, limits sustained rate\"\"\"\n    def __init__(self, capacity: int, refill_rate: float):\n        self.capacity = capacity         # max tokens (burst limit)\n        self.refill_rate = refill_rate   # tokens per second\n        self.buckets = defaultdict(lambda: {\"tokens\": capacity, \"last\": time.time()})\n\n    def allow(self, identifier: str) -> bool:\n        bucket = self.buckets[identifier]\n        now = time.time()\n        elapsed = now - bucket[\"last\"]\n        bucket[\"tokens\"] = min(\n            self.capacity,\n            bucket[\"tokens\"] + elapsed * self.refill_rate\n        )\n        bucket[\"last\"] = now\n\n        if bucket[\"tokens\"] >= 1:\n            bucket[\"tokens\"] -= 1\n            return True\n        return False\n\nlimiter = TokenBucket(capacity=10, refill_rate=1)  # 10 req burst, 1 req/sec sustained\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# Port Scanning with Nmap (reconnaissance tool)\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\nimport nmap\n\ndef scan_host(target: str) -> dict:\n    nm = nmap.PortScanner()\n    nm.scan(target, '1-1024', '-sV -T4')  # -sV detects service versions\n    results = {}\n    for host in nm.all_hosts():\n        results[host] = {\"state\": nm[host].state(), \"ports\": {}}\n        for proto in nm[host].all_protocols():\n            for port in nm[host][proto].keys():\n                service = nm[host][proto][port]\n                results[host][\"ports\"][port] = {\n                    \"state\":   service[\"state\"],\n                    \"service\": service[\"name\"],\n                    \"version\": service.get(\"version\", \"\")\n                }\n    return results\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# DNS Security\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\nimport dns.resolver\n\ndef check_dns_security(domain: str) -> dict:\n    results = {}\n    \n    # Check SPF record (prevents email spoofing)\n    try:\n        spf = dns.resolver.resolve(domain, 'TXT')\n        results['SPF'] = [r.to_text() for r in spf if 'v=spf1' in r.to_text()]\n    except:\n        results['SPF'] = \"NOT FOUND â€” email spoofing possible!\"\n\n    # Check DMARC\n    try:\n        dmarc = dns.resolver.resolve(f'_dmarc.{domain}', 'TXT')\n        results['DMARC'] = [r.to_text() for r in dmarc]\n    except:\n        results['DMARC'] = \"NOT FOUND â€” phishing risk!\"\n\n    # Check DNSSEC\n    try:\n        dns.resolver.resolve(domain, 'DNSKEY')\n        results['DNSSEC'] = \"Enabled âœ“\"\n    except:\n        results['DNSSEC'] = \"Not enabled\"\n\n    return results\n"
},
    "Vulnerability Assessment": {
      "explanation": "Vulnerability assessment and penetration testing (pen testing) systematically identifies, classifies, and prioritizes weaknesses in systems before attackers can exploit them. A structured security program includes vulnerability scanning, pen testing, and bug bounty programs.",
      "details": [
        "CVE (Common Vulnerabilities and Exposures): standardized identifier for publicly known vulnerabilities",
        "CVSS (Common Vulnerability Scoring System): 0-10 score for severity; considers impact, exploitability",
        "OWASP Top 10: most critical web app risks â€” maintained by Open Web Application Security Project",
        "Vulnerability scanning: automated tools (Nessus, OpenVAS, Qualys) identify known vulnerabilities",
        "Penetration testing: authorized simulated attack to find and exploit weaknesses before real attackers",
        "Pen test phases: Reconnaissance â†’ Scanning â†’ Exploitation â†’ Post-exploitation â†’ Reporting",
        "SAST (Static Application Security Testing): analyze source code without running it â€” finds issues early",
        "DAST (Dynamic Application Security Testing): test running application â€” finds runtime vulnerabilities",
        "SCA (Software Composition Analysis): scan dependencies for known CVEs â€” npm audit, Snyk, OWASP Dependency-Check",
        "Threat modeling: STRIDE (Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation of Privilege)",
        "Bug bounty programs: reward external researchers for responsibly disclosing vulnerabilities",
        "Zero-day: vulnerability unknown to vendor; no patch available â€” extremely dangerous"
],
      "example": "# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# DEPENDENCY SCANNING\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\n# Check Python dependencies for known CVEs\n# $ pip install pip-audit\n# $ pip-audit\n\n# Output:\n# Package      Version   ID                  Fix\n# ------------ --------- ------------------- -------\n# cryptography 38.0.1    GHSA-x4qr-2fkf-...  39.0.1\n# requests     2.26.0    CVE-2023-32681      2.31.0\n\n# Check Node.js:\n# $ npm audit\n# $ npm audit fix\n\n# Snyk (comprehensive):\n# $ snyk test\n# $ snyk monitor   # continuous monitoring\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# STATIC ANALYSIS (SAST)\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\n# Bandit â€” Python security linter\n# $ bandit -r ./myapp -f json\n\n# Common findings:\n# B105 hardcoded_password_string â€” never hardcode passwords\n# B106 hardcoded_password_funcarg\n# B108 probable_insecure_tmp_directory â€” use tempfile module\n# B301 pickle â€” don't unpickle untrusted data (code execution!)\n# B501 request_with_no_cert_validation â€” verify=False in requests\n# B506 yaml_load â€” use yaml.safe_load() not yaml.load()\n\n# âŒ What Bandit flags:\nimport pickle\ndata = pickle.loads(untrusted_bytes)    # B301 â€” arbitrary code exec\n\nimport yaml\ndata = yaml.load(user_input)            # B506 â€” use safe_load\n\npassword = \"hardcoded_secret_123\"       # B105 â€” hardcoded credential\n\n# âœ“ Fixed versions:\ndata = pickle.loads(trusted_bytes)      # or use json instead of pickle\ndata = yaml.safe_load(user_input)\npassword = os.environ.get('APP_PASSWORD')\n\n# Semgrep â€” multi-language SAST\n# $ semgrep --config=p/owasp-top-ten ./src\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# DYNAMIC TESTING (DAST) with OWASP ZAP\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\nfrom zapv2 import ZAPv2\n\ndef run_zap_scan(target_url: str) -> dict:\n    zap = ZAPv2(apikey='your-api-key')\n    \n    # Spidering â€” discover pages\n    scan_id = zap.spider.scan(target_url)\n    while int(zap.spider.status(scan_id)) < 100:\n        time.sleep(2)\n    \n    # Active scan â€” test for vulnerabilities\n    ascan_id = zap.ascan.scan(target_url)\n    while int(zap.ascan.status(ascan_id)) < 100:\n        time.sleep(5)\n    \n    alerts = zap.core.alerts(target_url)\n    \n    # Group by risk level\n    by_risk = {\"High\": [], \"Medium\": [], \"Low\": [], \"Informational\": []}\n    for alert in alerts:\n        risk = alert.get('risk', 'Informational')\n        by_risk[risk].append({\n            \"name\": alert['name'],\n            \"url\":  alert['url'],\n            \"description\": alert['description'],\n            \"solution\": alert['solution'],\n            \"cweid\": alert.get('cweid')\n        })\n    return by_risk\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# THREAT MODELING (STRIDE)\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\nSTRIDE_THREATS = {\n    \"Spoofing\":           \"Pretending to be someone else â€” mitigate: authentication (MFA, certs)\",\n    \"Tampering\":          \"Modifying data or code â€” mitigate: integrity checks (HMAC, signing, TLS)\",\n    \"Repudiation\":        \"Denying an action â€” mitigate: audit logs, non-repudiation (digital signatures)\",\n    \"Info Disclosure\":    \"Exposing private data â€” mitigate: encryption, access controls, need-to-know\",\n    \"Denial of Service\":  \"Making service unavailable â€” mitigate: rate limiting, redundancy, CDN\",\n    \"Elevation of Privilege\": \"Gaining unauthorized access â€” mitigate: least privilege, RBAC, sandboxing\"\n}\n\ndef analyze_component(component_name: str, dataflows: list) -> list:\n    threats = []\n    for dataflow in dataflows:\n        for threat, mitigation in STRIDE_THREATS.items():\n            threats.append({\n                \"component\": component_name,\n                \"dataflow\": dataflow,\n                \"threat\": threat,\n                \"mitigation\": mitigation,\n                \"cvss_estimate\": estimate_cvss(threat, dataflow)\n            })\n    return threats\n\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n# SECURE DEVELOPMENT CHECKLIST\n# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\"\"\"\nINPUT VALIDATION:\n  â–¡ Validate and sanitize all user inputs server-side\n  â–¡ Use parameterized queries (no string concatenation in SQL)\n  â–¡ Validate file uploads (type, size, content)\n  â–¡ Encode output to prevent XSS\n\nAUTHENTICATION:\n  â–¡ Hash passwords with bcrypt/Argon2id (min cost 12)\n  â–¡ Implement MFA for sensitive operations\n  â–¡ Use secure session management (HTTPOnly, Secure, SameSite cookies)\n  â–¡ Implement rate limiting on auth endpoints\n  â–¡ Check passwords against breach databases (HaveIBeenPwned API)\n\nAUTHORIZATION:\n  â–¡ Verify permissions on every request server-side\n  â–¡ Implement principle of least privilege\n  â–¡ Validate object ownership (prevent IDOR)\n  â–¡ Log all access control failures\n\nCRYPTO:\n  â–¡ Use TLS 1.2+ everywhere; prefer TLS 1.3\n  â–¡ Use AES-256-GCM for symmetric encryption\n  â–¡ Use ECDSA/RSA-2048+ for asymmetric\n  â–¡ Never roll your own crypto\n\nDEPENDENCIES:\n  â–¡ Run dependency scanner in CI/CD (npm audit, pip-audit, Snyk)\n  â–¡ Keep dependencies updated, automate with Dependabot\n  â–¡ Use lockfiles (package-lock.json, poetry.lock)\n\nSECRETS:\n  â–¡ No hardcoded secrets in code or git history\n  â–¡ Use environment variables or secret managers (AWS Secrets Manager, Vault)\n  â–¡ Rotate secrets regularly, immediately if compromised\n\nLOGGING:\n  â–¡ Log security events (auth failures, access denied, suspicious activity)\n  â–¡ Never log passwords, tokens, or PII\n  â–¡ Send logs to SIEM; set up alerts for anomalies\n\"\"\"\n"
}
}
},
  "Cloud & DevOps": {
  "icon": "ti-cloud",
  "color": "#185FA5",
  "topics": {
    "Docker": {
      "explanation": "Docker packages applications in containers â€” lightweight, portable environments that include everything needed to run the application.",
      "details": [
        "Container: running instance of an image",
        "Image: read-only template built from a Dockerfile",
        "Dockerfile: instructions to build an image",
        "Docker Hub: public registry for images"
],
      "example": "# Dockerfile\nFROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nEXPOSE 8000\nCMD [\"python\", \"app.py\"]\n\n# Build & run\ndocker build -t myapp:latest .\ndocker run -p 8080:8000 myapp:latest\n\n# Common commands\ndocker ps / docker ps -a      # list containers\ndocker images                 # list images\ndocker exec -it <id> bash     # enter container\ndocker logs <id>              # view logs"
},
    "CI/CD": {
      "explanation": "CI/CD automates the process of integrating code changes, running tests, and deploying to production.",
      "details": [
        "CI: automatically build and test on every commit",
        "CD: automatically deploy after tests pass",
        "Tools: GitHub Actions, Jenkins, GitLab CI, CircleCI",
        "Benefits: faster releases, catch bugs early, consistent deployments"
],
      "example": "# .github/workflows/main.yml\nname: CI/CD\non: push\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - run: pip install -r requirements.txt\n      - run: pytest tests/\n\n  deploy:\n    needs: test    # only if tests pass\n    runs-on: ubuntu-latest\n    steps:\n      - run: docker build -t app . && docker push registry/app\n      - run: kubectl rollout restart deployment/app"
}
}
},
  "Java SE 8 (OCA + OCP)": {
  "icon": "ti-coffee",
  "color": "#D85A30",
  "topics": {
    "Java Basics & Class Structure": {
      "explanation": "Java programs are built from classes. Every Java program must have a class, and execution begins with the main() method. The JVM compiles .java files to .class bytecode, which runs on any platform â€” 'Write Once, Run Anywhere'.",
      "details": [
        "File rule: public class name must match filename (Animal.java â†’ public class Animal)",
        "A file can contain multiple classes but only one public class",
        "main() signature: public static void main(String[] args) â€” also accepts String[] or String...",
        "java.lang package is automatically imported (System, String, Object, Math, etc.)",
        "Compile: javac Zoo.java â†’ Run: java Zoo (omit .class extension)",
        "Package naming: reverse domain convention (com.amazon.app), child packages separated by dots",
        "Wildcard import: import java.util.*; â€” imports classes only, not sub-packages or static members"
],
      "example": "// Minimal valid Java program\npublic class Zoo {\n    public static void main(String[] args) {\n        System.out.println(\"Welcome to the Zoo!\");\n    }\n}\n\n// Multiple classes in one file (only one public)\nclass Animal { String name; }\npublic class Zoo { /* must be in Zoo.java */ }\n\n// Import examples\nimport java.util.ArrayList;       // specific import\nimport java.util.*;               // wildcard (imports all classes)\nimport static java.lang.Math.PI;  // static import â€” access PI directly\n\n// Redundant imports (java.lang auto-imported)\nimport java.lang.System;  // redundant\nimport java.lang.*;       // redundant\n\n// Command-line arguments\n// java Zoo Bronx \"San Diego\"\n// args[0] = \"Bronx\", args[1] = \"San Diego\"\n// All args are Strings even if they look like numbers"
},
    "Primitive Types & Variables": {
      "explanation": "Java has 8 primitive types for storing raw values. Reference types point to objects on the heap. Variables must be declared before use, and local variables must be explicitly initialized before reading.",
      "details": [
        "byte (8-bit, -128 to 127), short (16-bit), int (32-bit), long (64-bit, suffix L)",
        "float (32-bit, suffix f), double (64-bit, default for decimals)",
        "char (16-bit Unicode, single quotes 'A'), boolean (true/false only)",
        "Numeric promotion: byte/short/char â†’ int in arithmetic; int + long â†’ long; int/long + float/double â†’ double",
        "Local variables: no default value â€” must initialize before use (compiler error if not)",
        "Instance/static variables: get default values (0, 0.0, false, null, '\\u0000')",
        "Identifier rules: start with letter, $, or _; cannot start with digit; cannot use reserved words"
],
      "example": "// Primitive declarations\nbyte   b  = 127;\nshort  s  = 32767;\nint    i  = 2_000_000;   // underscores allowed (Java 7+)\nlong   l  = 100L;        // L suffix required for long literals\nfloat  f  = 3.14f;       // f suffix required\ndouble d  = 3.14159;     // default decimal type\nchar   c  = 'A';         // single quotes\nboolean ok = true;\n\n// Reference type (null is valid default)\nString str = null;\nString greeting = \"Hello\";   // String literal from pool\n\n// Numeric promotion gotchas\nbyte x = 1; byte y = 2;\n// byte z = x + y;  // DOES NOT COMPILE â€” result is int!\nbyte z = (byte)(x + y);  // explicit cast required\n\n// Cast (narrowing â€” may lose data)\ndouble pi = 3.14159;\nint truncated = (int) pi;  // 3 (truncates decimal)\n\n// Widening (automatic)\nint num = 100;\ndouble wider = num;  // 100.0 â€” implicit widening\n\n// Default values (instance variables)\n// int    â†’ 0\n// double â†’ 0.0\n// booleanâ†’ false\n// char   â†’ '\u0000'\n// Object â†’ null"
},
    "Operators & Statements": {
      "explanation": "Java operators follow strict precedence rules. The switch statement works with byte, short, int, char, String, and enum. Loops come in four forms: for, enhanced-for, while, and do-while.",
      "details": [
        "Operator precedence (highâ†’low): post++/--, pre++/--, unary -/!, cast, */%,  +-, <<>>, <><= instanceof, ==!=, &, ^, |, &&, ||, ?:, =",
        "Compound assignment (+=, -=, *=, /=) include implicit cast â€” e.g., x += 1.5 on int x is valid",
        "switch works with: byte, short, int, char, String, enum (NOT long, float, double, boolean)",
        "switch case values must be compile-time constants (literals or final variables)",
        "break in switch prevents fall-through; without break, execution continues into next case",
        "Labels on loops allow break/continue to target an outer loop",
        "do-while guarantees the body executes at least once"
],
      "example": "// Switch statement\nint day = 3;\nswitch (day) {\n    case 1: System.out.println(\"Mon\"); break;\n    case 2: System.out.println(\"Tue\"); break;\n    case 3:\n    case 4: System.out.println(\"Wed or Thu\"); break;  // fall-through\n    default: System.out.println(\"Other\");\n}\n\n// Switch with String (Java 7+)\nString season = \"SPRING\";\nswitch (season) {\n    case \"SPRING\": case \"SUMMER\": System.out.println(\"Warm\"); break;\n    case \"FALL\":   case \"WINTER\": System.out.println(\"Cold\"); break;\n}\n\n// Compound assignment with implicit cast\nbyte b = 5;\nb += 2;    // OK â€” equivalent to b = (byte)(b + 2)\n// b = b + 2; // DOES NOT COMPILE â€” b+2 is int, needs cast\n\n// Labeled loop\nouter:\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 3; j++) {\n        if (j == 1) continue outer;  // skip to next outer iteration\n        if (i == 2) break outer;     // exit both loops\n        System.out.println(i + \",\" + j);\n    }\n}\n\n// Ternary operator\nint x = 5;\nString result = (x > 3) ? \"big\" : \"small\";  // \"big\""
},
    "String & StringBuilder": {
      "explanation": "Strings are immutable objects from the String pool. StringBuilder is mutable and more efficient for concatenation. Key distinction: == checks reference equality; .equals() checks value equality.",
      "details": [
        "Strings are immutable â€” any 'modification' creates a new String object",
        "String pool: literals are cached; 'new String()' always creates a new heap object",
        "== on String checks reference (same object); .equals() checks character sequence",
        "StringBuilder is mutable, not thread-safe; StringBuffer is thread-safe (slower)",
        "String methods return new Strings: substring(), replace(), toLowerCase(), toUpperCase(), trim()",
        "StringBuilder key methods modify in place and return 'this': append(), insert(), delete(), reverse(), replace()",
        "charAt(i) â€” both; length() â€” both; indexOf(str) â€” both; substring(s,e) â€” both"
],
      "example": "// String immutability\nString s = \"hello\";\ns.toUpperCase();       // creates new String â€” s still \"hello\"!\ns = s.toUpperCase();   // must reassign to use result â†’ \"HELLO\"\n\n// String pool\nString a = \"Java\";\nString b = \"Java\";\nString c = new String(\"Java\");\nSystem.out.println(a == b);       // true  (same pool object)\nSystem.out.println(a == c);       // false (c is new heap object)\nSystem.out.println(a.equals(c));  // true  (same characters)\n\n// Key String methods\n\"Hello World\".length()          // 11\n\"Hello World\".charAt(4)         // 'o'\n\"Hello World\".indexOf(\"World\")  // 6\n\"Hello World\".substring(6)      // \"World\"\n\"Hello World\".substring(0, 5)   // \"Hello\"\n\"  hi  \".trim()                 // \"hi\"\n\"hello\".toUpperCase()           // \"HELLO\"\n\"Hello\".replace('l', 'r')       // \"Herro\"\n\"hello world\".contains(\"world\") // true\n\"abc\".startsWith(\"ab\")          // true\n\n// StringBuilder (mutable, fluent API)\nStringBuilder sb = new StringBuilder(\"Hello\");\nsb.append(\" World\");    // \"Hello World\"\nsb.insert(5, \",\");      // \"Hello, World\"\nsb.delete(5, 6);        // \"Hello World\"\nsb.reverse();           // \"dlroW olleH\"\nsb.replace(0, 5, \"Bye\");// \"Bye World\"   (after reversal undone)\nsb.deleteCharAt(0);     // removes char at index 0\nSystem.out.println(sb.length());\nSystem.out.println(sb.toString());\n\n// StringBuilder == checks reference, NOT content\nStringBuilder sb1 = new StringBuilder(\"hi\");\nStringBuilder sb2 = new StringBuilder(\"hi\");\nSystem.out.println(sb1.equals(sb2));  // false! (Object.equals)"
},
    "Arrays & ArrayList": {
      "explanation": "Arrays are fixed-size, zero-indexed data structures. ArrayList is a resizable List backed by an array. Java 5+ autoboxing converts between primitives and wrapper types automatically.",
      "details": [
        "Array declaration: int[] arr or int arr[] â€” both valid; int[] arr preferred",
        "Arrays are objects â€” default values apply (0, false, null) when created with new",
        "Arrays.sort() sorts in-place; Arrays.binarySearch() requires sorted array",
        "Multi-dimensional: int[][] matrix = new int[3][4]; access: matrix[row][col]",
        "ArrayList is generic: ArrayList<String>; add(), remove(), get(), set(), size(), contains()",
        "Autoboxing: int â†’ Integer (box); Integer â†’ int (unbox); happens automatically",
        "ArrayList.remove(int index) vs remove(Object o) â€” careful with Integer!"
],
      "example": "// Array creation\nint[] nums = new int[5];         // [0,0,0,0,0]\nString[] names = {\"Alice\",\"Bob\"}; // array initializer\nint[][] matrix = {{1,2},{3,4}};\n\n// Array operations\nSystem.out.println(nums.length);   // 5 (field, not method!)\nArrays.sort(nums);\nint idx = Arrays.binarySearch(nums, 3);  // must be sorted first\nint[] copy = Arrays.copyOf(nums, 3);     // [0,0,0]\nSystem.out.println(Arrays.toString(nums));\n\n// Varargs (variable arguments) â€” treated as array\nvoid printAll(String... args) {\n    for (String s : args) System.out.println(s);\n}\nprintAll(\"a\", \"b\", \"c\");  // or pass String[]\n\n// ArrayList<E>\nArrayList<String> list = new ArrayList<>();\nlist.add(\"Alice\");\nlist.add(0, \"Zara\");          // insert at index\nlist.set(1, \"Bob\");           // replace\nlist.remove(\"Alice\");          // remove by value\nlist.remove(0);                // remove by index\nlist.get(0);                   // \"Bob\"\nlist.size();                   // 1\nlist.contains(\"Bob\");          // true\n\n// Autoboxing\nArrayList<Integer> nums2 = new ArrayList<>();\nnums2.add(5);           // autoboxed: 5 â†’ Integer.valueOf(5)\nint val = nums2.get(0); // unboxed: Integer â†’ int\n\n// Converting between array and List\nString[] arr = {\"a\",\"b\",\"c\"};\nList<String> fromArr = Arrays.asList(arr);  // fixed size!\nList<String> mutable = new ArrayList<>(Arrays.asList(arr));\n\n// Sort ArrayList\nCollections.sort(list);\nCollections.sort(list, Comparator.reverseOrder());"
},
    "Methods & Encapsulation": {
      "explanation": "Methods define behavior. Encapsulation protects data with private fields and public getters/setters. Java is pass-by-value â€” primitives copy the value; references copy the pointer.",
      "details": [
        "Method signature: [access] [static] returnType name(params) [throws Exception]",
        "Overloading: same method name, different parameter list (type, number, or order)",
        "Pass-by-value: primitives â€” caller's variable unchanged; references â€” object's state can change but reassigning param doesn't affect caller",
        "Varargs (String... args) must be last parameter; only one varargs per method",
        "Static members belong to class, accessed via ClassName.member (not via instance)",
        "Static initializer blocks run once when class is loaded, before any constructor",
        "final field: must be set in declaration or constructor; cannot change after"
],
      "example": "// Method overloading\nint add(int a, int b)       { return a + b; }\ndouble add(double a, double b) { return a + b; }\nint add(int a, int b, int c) { return a + b + c; }\n\n// Pass-by-value demonstration\nvoid change(int x) { x = 99; }         // caller's int unchanged\nvoid change(StringBuilder sb) {\n    sb.append(\"!!\");                    // modifies original object\n    sb = new StringBuilder(\"new\");     // does NOT affect caller\n}\n\n// Static members\nclass Counter {\n    private static int count = 0;        // shared across instances\n    static { count = 10; }              // static initializer\n    public Counter() { count++; }\n    public static int getCount() { return count; }\n}\nCounter.getCount();   // access via class name\n\n// Encapsulation with validation\nclass BankAccount {\n    private double balance;  // private field\n\n    public double getBalance() { return balance; }\n\n    public void deposit(double amount) {\n        if (amount <= 0) throw new IllegalArgumentException(\"Must be positive\");\n        balance += amount;\n    }\n}\n\n// final field\nclass Circle {\n    private final double radius;   // must be set in constructor\n    Circle(double r) { this.radius = r; }\n    // radius = 5; // compile error after construction\n}\n\n// Varargs\nvoid log(String message, Object... args) {\n    System.out.printf(message, args);\n}\nlog(\"Hello %s, you are %d\", \"Alice\", 30);"
},
    "Class Design & Inheritance": {
      "explanation": "Java supports single class inheritance with extends. Subclasses inherit non-private members. Constructors are not inherited but can be chained with super(). The first line of any constructor must be this() or super().",
      "details": [
        "extends for classes (single), implements for interfaces (multiple)",
        "super() must be first statement in constructor; Java inserts super() if omitted",
        "Method overriding requires same signature + return type (or covariant return)",
        "@Override annotation verifies you are overriding (compile-time check)",
        "Hiding: static methods with same signature create a 'hidden' method, not override",
        "final class: cannot be subclassed; final method: cannot be overridden",
        "instanceof: checks if object is instance of type, returns boolean"
],
      "example": "class Animal {\n    protected String name;\n    Animal(String name) { this.name = name; }\n\n    String speak() { return \"...\"; }\n    static String type() { return \"Animal\"; }\n}\n\nclass Dog extends Animal {\n    private String breed;\n\n    Dog(String name, String breed) {\n        super(name);        // MUST be first line â€” calls Animal constructor\n        this.breed = breed;\n    }\n\n    @Override\n    String speak() { return \"Woof!\"; }         // overrides\n\n    static String type() { return \"Dog\"; }     // HIDES (not overrides)\n}\n\n// Polymorphism\nAnimal a = new Dog(\"Rex\", \"Lab\");\nSystem.out.println(a.speak());    // \"Woof!\" â€” dynamic dispatch\nSystem.out.println(a.type());     // \"Animal\" â€” static method uses reference type!\n\n// instanceof\nif (a instanceof Dog) {\n    Dog d = (Dog) a;              // safe cast after instanceof check\n    System.out.println(d.breed);\n}\n\n// Constructor chaining with this()\nclass Person {\n    String name; int age;\n    Person() { this(\"Unknown\", 0); }         // calls other constructor\n    Person(String name, int age) {\n        this.name = name; this.age = age;\n    }\n}\n\n// Object class methods (all classes inherit)\n// toString(), equals(), hashCode(), getClass(), clone(), finalize()"
},
    "Abstract Classes & Interfaces": {
      "explanation": "Abstract classes cannot be instantiated and may contain abstract methods. Interfaces define contracts. In Java 8, interfaces can have default and static methods. A class can implement multiple interfaces but extend only one class.",
      "details": [
        "abstract class: cannot be instantiated; may have abstract + concrete methods + fields",
        "Abstract method has no body; subclass must implement all abstract methods or be abstract itself",
        "interface (pre-Java 8): all methods public abstract, all fields public static final",
        "Java 8 interface: can have default methods (with body) and static methods",
        "A class can implement multiple interfaces; interfaces can extend multiple interfaces",
        "interface variables are implicitly public static final â€” must be initialized",
        "Choosing abstract class vs interface: use abstract class when sharing code/state; interface for capability contract"
],
      "example": "// Abstract class\nabstract class Shape {\n    protected String color;\n    Shape(String color) { this.color = color; }\n\n    abstract double area();           // abstract â€” no body\n    abstract double perimeter();\n\n    String describe() {               // concrete method\n        return \"Shape: area=\" + area();\n    }\n}\n\nclass Circle extends Shape {\n    private double radius;\n    Circle(String color, double r) { super(color); radius = r; }\n\n    @Override double area()      { return Math.PI * radius * radius; }\n    @Override double perimeter() { return 2 * Math.PI * radius; }\n}\n// Shape s = new Shape(\"red\");  // ERROR â€” can't instantiate abstract\n\n// Interface\ninterface Flyable {\n    double MAX_ALTITUDE = 10000;  // implicitly public static final\n\n    void fly();                   // implicitly public abstract\n\n    default void land() {         // Java 8 default method\n        System.out.println(\"Landing...\");\n    }\n\n    static void checkWeather() {  // Java 8 static method\n        System.out.println(\"Checking weather...\");\n    }\n}\n\ninterface Swimmable { void swim(); }\n\nclass Duck extends Animal implements Flyable, Swimmable {\n    public void fly()  { System.out.println(\"Duck flying\"); }\n    public void swim() { System.out.println(\"Duck swimming\"); }\n}\n\n// interface extending interface\ninterface Athletic extends Flyable, Swimmable {\n    void train();\n}"
},
    "Polymorphism & Casting": {
      "explanation": "Polymorphism allows one reference type to represent many object types. Method calls resolve at runtime based on the actual object type. Casting changes the reference type but not the object.",
      "details": [
        "Upcasting (widening): Dog â†’ Animal â€” always safe, implicit",
        "Downcasting (narrowing): Animal â†’ Dog â€” may throw ClassCastException at runtime",
        "Always use instanceof before downcasting to avoid ClassCastException",
        "Virtual method invocation: instance methods always call the actual object's version",
        "Covariant return type: overriding method can return a subtype of the parent's return type",
        "The reference type determines which fields/static methods are accessible",
        "The object type determines which instance methods are called (dynamic dispatch)"
],
      "example": "// Polymorphism\nAnimal[] animals = { new Dog(\"Rex\"), new Cat(\"Whiskers\") };\nfor (Animal a : animals) {\n    a.speak();  // calls Dog.speak() or Cat.speak() at runtime\n}\n\n// Upcasting â€” implicit, always safe\nAnimal a = new Dog(\"Buddy\");  // OK\n\n// Downcasting â€” explicit, risky\nDog d = (Dog) a;              // OK if a really is a Dog\n// Dog d2 = (Dog) new Cat();  // ClassCastException at runtime!\n\n// Safe downcast with instanceof\nif (a instanceof Dog) {\n    Dog dog = (Dog) a;\n    dog.fetch();\n}\n\n// Reference type vs object type\nAnimal ref = new Dog(\"Rex\");\n// ref.fetch();           // COMPILE ERROR â€” fetch() not in Animal\n((Dog) ref).fetch();     // OK after cast\n\n// Virtual method invocation (always uses object type)\nclass Base {\n    String name = \"Base\";\n    String getName() { return \"Base\"; }\n}\nclass Sub extends Base {\n    String name = \"Sub\";\n    @Override String getName() { return \"Sub\"; }\n}\nBase b = new Sub();\nSystem.out.println(b.name);      // \"Base\"    (field â€” reference type)\nSystem.out.println(b.getName()); // \"Sub\"     (method â€” object type)\n\n// Covariant return\nclass AnimalFactory {\n    Animal create() { return new Animal(); }\n}\nclass DogFactory extends AnimalFactory {\n    @Override Dog create() { return new Dog(); }  // OK â€” Dog is subtype\n}"
},
    "Exceptions": {
      "explanation": "Exceptions are events that disrupt normal program flow. Checked exceptions must be declared or handled; unchecked (RuntimeException) need not be. The finally block always executes. Java 7 introduced try-with-resources and multi-catch.",
      "details": [
        "Hierarchy: Throwable â†’ Error / Exception â†’ RuntimeException",
        "Checked exceptions: must catch or declare with throws (IOException, SQLException)",
        "Unchecked: RuntimeException and subclasses â€” compiler doesn't require handling",
        "Errors: JVM problems (OutOfMemoryError, StackOverflowError) â€” don't catch these",
        "finally runs even if exception thrown or return statement reached (except System.exit())",
        "try-with-resources (Java 7): auto-closes AutoCloseable; resource closed before catch/finally",
        "Multi-catch (Java 7): catch (IOException | SQLException e) â€” e is effectively final"
],
      "example": "// try-catch-finally\ntry {\n    int result = 10 / 0;\n} catch (ArithmeticException e) {\n    System.out.println(\"Caught: \" + e.getMessage());\n} finally {\n    System.out.println(\"Always runs\");\n}\n\n// Multi-catch (Java 7)\ntry {\n    // risky code\n} catch (IOException | SQLException e) {\n    System.out.println(\"DB or IO error: \" + e.getMessage());\n    // e is effectively final â€” cannot reassign e\n}\n\n// try-with-resources (Java 7) â€” auto-closes\ntry (FileReader fr = new FileReader(\"file.txt\");\n     BufferedReader br = new BufferedReader(fr)) {\n    String line = br.readLine();\n} catch (IOException e) {\n    e.printStackTrace();\n}\n// fr and br closed automatically, even if exception thrown\n\n// Custom checked exception\nclass InsufficientFundsException extends Exception {\n    private double amount;\n    InsufficientFundsException(double amount) {\n        super(\"Need \" + amount + \" more\");\n        this.amount = amount;\n    }\n}\n\n// Custom unchecked exception\nclass ValidationException extends RuntimeException {\n    ValidationException(String msg) { super(msg); }\n}\n\n// Common Runtime Exceptions (OCA must-know)\n// NullPointerException:           null.method()\n// ArrayIndexOutOfBoundsException: arr[arr.length]\n// ClassCastException:             (Dog) new Cat()\n// ArithmeticException:            x / 0\n// IllegalArgumentException:       bad method argument\n// StackOverflowError:             infinite recursion (Error, not Exception)\n// NumberFormatException:          Integer.parseInt(\"abc\")"
},
    "Dates, Times & Wrappers": {
      "explanation": "Java 8 introduced the java.time package with immutable date-time classes. Wrapper classes provide object representations of primitives and utility methods for parsing and converting.",
      "details": [
        "LocalDate: date only (year/month/day); LocalTime: time only; LocalDateTime: both",
        "All java.time classes are immutable â€” methods return new objects",
        "Period: date-based duration (years/months/days); Duration: time-based (hours/minutes/seconds)",
        "DateTimeFormatter: format/parse; ISO_LOCAL_DATE is default",
        "Wrapper classes: Integer, Double, Boolean, Character, Byte, Short, Long, Float",
        "Integer.parseInt(str) â†’ int; Integer.valueOf(str) â†’ Integer; toString(int) â†’ String",
        "Integer constants: MAX_VALUE, MIN_VALUE; compareTo(), equals(), intValue()"
],
      "example": "// LocalDate\nLocalDate today = LocalDate.now();\nLocalDate birthday = LocalDate.of(1990, Month.JUNE, 15);\nLocalDate nextWeek = today.plusDays(7);\nLocalDate lastMonth = today.minusMonths(1);\nboolean isBefore = birthday.isBefore(today);  // true\n\n// LocalTime\nLocalTime now = LocalTime.now();\nLocalTime noon = LocalTime.of(12, 0);\nLocalTime later = noon.plusHours(3).plusMinutes(30);  // 15:30\n\n// LocalDateTime\nLocalDateTime dt = LocalDateTime.of(2024, 1, 15, 10, 30);\nLocalDateTime withTime = LocalDate.of(2024,1,1).atTime(9,0);\n\n// Period (date-based)\nPeriod oneYear = Period.ofYears(1);\nPeriod custom = Period.of(1, 2, 3);  // 1 year, 2 months, 3 days\nLocalDate future = today.plus(oneYear);\n\n// DateTimeFormatter\nDateTimeFormatter fmt = DateTimeFormatter.ofPattern(\"MM/dd/yyyy\");\nString formatted = today.format(fmt);          // \"06/15/2024\"\nLocalDate parsed = LocalDate.parse(\"06/15/2024\", fmt);\n\n// Wrapper classes\nint primitive = 42;\nInteger boxed = Integer.valueOf(42);     // preferred boxing\nInteger autoBoxed = 42;                  // autoboxing\n\nint parsed2 = Integer.parseInt(\"123\");   // \"123\" â†’ 123\nString str = Integer.toString(42);       // 42 â†’ \"123\"\nInteger.MAX_VALUE                        // 2147483647\nInteger.MIN_VALUE                        // -2147483648\n\n// Numeric wrapper methods\nDouble.parseDouble(\"3.14\")\nBoolean.parseBoolean(\"true\")   // case-insensitive\nCharacter.isDigit('5')         // true\nCharacter.toUpperCase('a')     // 'A'"
},
    "Lambdas & Functional Interfaces": {
      "explanation": "Java 8 lambdas provide a concise way to implement functional interfaces (interfaces with exactly one abstract method). Predicates, Functions, Consumers, and Suppliers are the core built-in functional interfaces.",
      "details": [
        "Lambda syntax: (params) -> expression or (params) -> { body; return val; }",
        "Functional interface: exactly one abstract method (SAM â€” Single Abstract Method)",
        "Predicate<T>: T â†’ boolean; test() method",
        "Consumer<T>: T â†’ void; accept() method",
        "Supplier<T>: () â†’ T; get() method",
        "Function<T,R>: T â†’ R; apply() method",
        "BiFunction<T,U,R>: (T,U) â†’ R; UnaryOperator<T>: T â†’ T; BinaryOperator<T>: (T,T) â†’ T"
],
      "example": "// Basic lambda syntax\nRunnable r = () -> System.out.println(\"Hello!\");\nComparator<String> c = (s1, s2) -> s1.compareTo(s2);\n// or multi-line:\nComparator<String> c2 = (s1, s2) -> {\n    int result = s1.compareTo(s2);\n    return result;\n};\n\n// Predicate<T>\nPredicate<String> isEmpty = s -> s.isEmpty();\nPredicate<Integer> isEven = n -> n % 2 == 0;\nPredicate<Integer> isPositive = n -> n > 0;\n\n// Chaining predicates\nPredicate<Integer> isEvenAndPositive = isEven.and(isPositive);\nPredicate<Integer> isEvenOrNegative  = isEven.or(n -> n < 0);\nPredicate<Integer> isOdd = isEven.negate();\n\n// Using with Collections\nList<String> names = Arrays.asList(\"Alice\", \"Bob\", \"Charlie\");\nnames.removeIf(s -> s.startsWith(\"A\"));  // removes \"Alice\"\nnames.forEach(s -> System.out.println(s));\n\n// Consumer<T>\nConsumer<String> printer = System.out::println;  // method reference\nprinter.accept(\"Hello\");\n\n// Supplier<T>\nSupplier<LocalDate> todaySupplier = LocalDate::now;\nLocalDate today = todaySupplier.get();\n\n// Function<T,R>\nFunction<String, Integer> strLen = String::length;\nFunction<Integer, String> toStr = Object::toString;\nFunction<String, Integer> composed = strLen.compose(s -> s.trim());\n\n// UnaryOperator\nUnaryOperator<String> toUpper = String::toUpperCase;\n\n// BinaryOperator\nBinaryOperator<Integer> add = (a, b) -> a + b;\n\n// Method references â€” 4 types\n// 1. Static method:            Integer::parseInt\n// 2. Instance on specific obj: myList::add\n// 3. Instance on param type:   String::toUpperCase\n// 4. Constructor:              ArrayList::new"
},
    "Generics & Wildcards (OCP)": {
      "explanation": "Generics provide compile-time type safety. Wildcards (?) represent unknown types. Upper-bounded wildcards (? extends T) allow reading; lower-bounded (? super T) allow writing. Generic methods have type parameters before the return type.",
      "details": [
        "Generic class: class Box<T> { T value; } â€” T is type parameter",
        "Diamond operator: new ArrayList<>() â€” infers type from context (Java 7+)",
        "Bounded type: <T extends Comparable<T>> â€” T must implement Comparable",
        "Unbounded wildcard: List<?> â€” can read as Object, can't add (except null)",
        "Upper-bounded: List<? extends Number> â€” read as Number, can't add",
        "Lower-bounded: List<? super Integer> â€” can add Integer/int, read as Object",
        "PECS: Producer Extends, Consumer Super â€” guideline for wildcard choice"
],
      "example": "// Generic class\nclass Box<T> {\n    private T value;\n    Box(T value) { this.value = value; }\n    T get() { return value; }\n}\nBox<String> strBox  = new Box<>(\"Hello\");\nBox<Integer> intBox = new Box<>(42);\n\n// Generic method\n<T extends Comparable<T>> T max(T a, T b) {\n    return a.compareTo(b) >= 0 ? a : b;\n}\nmax(3, 5)       // 5\nmax(\"cat\",\"dog\")// \"dog\"\n\n// Wildcards\nList<Integer> intList = Arrays.asList(1, 2, 3);\n\n// Upper-bounded: read elements as Number\nvoid printAll(List<? extends Number> list) {\n    for (Number n : list) System.out.println(n);\n}\nprintAll(intList);  // OK â€” Integer extends Number\n// list.add(1);     // COMPILE ERROR â€” can't add to ? extends\n\n// Lower-bounded: add Integer or subtypes\nvoid addInts(List<? super Integer> list) {\n    list.add(42);  // OK\n}\naddInts(new ArrayList<Number>());    // OK\naddInts(new ArrayList<Object>());    // OK\naddInts(new ArrayList<Integer>());   // OK\n// addInts(new ArrayList<Double>()); // COMPILE ERROR\n\n// Unbounded wildcard\nvoid printList(List<?> list) {\n    for (Object o : list) System.out.println(o);\n}\n\n// Type erasure: generics are compile-time only\n// At runtime, List<String> and List<Integer> are both just List"
},
    "Collections Framework (OCP)": {
      "explanation": "Java Collections Framework provides interfaces and implementations for storing and manipulating groups of objects. Key: choose the right collection for the job â€” ordered vs sorted, duplicates allowed, key-value pairs.",
      "details": [
        "List: ordered, duplicates OK â†’ ArrayList (fast get), LinkedList (fast insert/delete)",
        "Set: no duplicates â†’ HashSet (O(1) ops), LinkedHashSet (insertion order), TreeSet (sorted, O(log n))",
        "Map: keyâ†’value, unique keys â†’ HashMap (O(1)), LinkedHashMap (order), TreeMap (sorted)",
        "Queue: FIFO â†’ LinkedList, PriorityQueue (min-heap); Deque: double-ended",
        "Collections utility class: sort(), binarySearch(), min(), max(), frequency(), unmodifiableList()",
        "Comparable: natural order (compareTo, in class); Comparator: custom order (compare, separate)",
        "Arrays.asList() returns fixed-size list; Collections.unmodifiableList() prevents modification"
],
      "example": "// List\nList<String> list = new ArrayList<>(Arrays.asList(\"B\",\"A\",\"C\"));\nCollections.sort(list);                  // [A, B, C]\nCollections.sort(list, Comparator.reverseOrder()); // [C, B, A]\nint idx = Collections.binarySearch(list, \"B\");  // must be sorted first\n\n// Set\nSet<String> hashSet = new HashSet<>();\nSet<String> linked  = new LinkedHashSet<>(); // insertion order\nSet<String> tree    = new TreeSet<>();        // natural sorted order\n\n// Map\nMap<String,Integer> map = new HashMap<>();\nmap.put(\"Alice\", 90);\nmap.putIfAbsent(\"Bob\", 85);          // only if key absent\nmap.getOrDefault(\"Carol\", 0);        // 0 if missing\nmap.forEach((k, v) -> System.out.println(k + \": \" + v));\nmap.entrySet()                        // Set<Map.Entry<K,V>>\nmap.merge(\"Alice\", 5, Integer::sum); // Alice: 90+5=95\n\n// Comparable (natural order â€” in the class)\nclass Student implements Comparable<Student> {\n    int grade;\n    @Override public int compareTo(Student other) {\n        return Integer.compare(this.grade, other.grade);\n    }\n}\n\n// Comparator (external â€” flexible)\nComparator<Student> byName = Comparator.comparing(s -> s.name);\nComparator<Student> byGradeDesc = Comparator.comparingInt(s -> s.grade).reversed();\nComparator<Student> multi = byName.thenComparingInt(s -> s.grade);\n\nList<Student> students = new ArrayList<>();\nstudents.sort(byName);\nCollections.sort(students, byGradeDesc);\n\n// PriorityQueue (min-heap by default)\nPriorityQueue<Integer> pq = new PriorityQueue<>();\npq.offer(3); pq.offer(1); pq.offer(2);\npq.poll();  // 1 (min)\n\n// ArrayDeque (stack/queue operations)\nDeque<String> deque = new ArrayDeque<>();\ndeque.push(\"A\");    // stack push (front)\ndeque.pop();        // stack pop (front)\ndeque.offer(\"B\");   // queue enqueue (back)\ndeque.poll();       // queue dequeue (front)"
},
    "Functional Programming & Streams (OCP)": {
      "explanation": "The Streams API enables declarative data processing. Streams are lazy â€” intermediate operations are not executed until a terminal operation is called. Streams can only be consumed once.",
      "details": [
        "Stream pipeline: source â†’ intermediate ops (lazy) â†’ terminal op (triggers execution)",
        "Intermediate (return Stream): filter(), map(), flatMap(), sorted(), distinct(), limit(), skip()",
        "Terminal (return result): forEach(), count(), collect(), reduce(), min(), max(), anyMatch(), allMatch(), noneMatch(), findFirst(), findAny()",
        "Optional<T>: container that may or may not hold a value; avoids NullPointerException",
        "Optional methods: isPresent(), get(), orElse(), orElseGet(), orElseThrow(), map(), filter()",
        "Collectors: toList(), toSet(), joining(), groupingBy(), partitioningBy(), counting()",
        "Primitive streams: IntStream, LongStream, DoubleStream â€” avoid boxing overhead"
],
      "example": "// Stream pipeline\nList<String> names = Arrays.asList(\"Alice\",\"Bob\",\"Charlie\",\"Anna\");\n\n// filter + map + collect\nList<String> result = names.stream()\n    .filter(s -> s.startsWith(\"A\"))   // intermediate\n    .map(String::toUpperCase)          // intermediate\n    .sorted()                          // intermediate\n    .collect(Collectors.toList());     // terminal â†’ [\"ALICE\",\"ANNA\"]\n\n// count, min, max\nlong count = names.stream().filter(s -> s.length() > 3).count();\nOptional<String> longest = names.stream()\n    .max(Comparator.comparingInt(String::length));\n\n// reduce\nint sum = IntStream.rangeClosed(1, 10).reduce(0, Integer::sum);  // 55\n\n// Collectors\nString joined = names.stream().collect(Collectors.joining(\", \", \"[\", \"]\"));\n// \"[Alice, Bob, Charlie, Anna]\"\n\nMap<Integer, List<String>> byLength = names.stream()\n    .collect(Collectors.groupingBy(String::length));\n\nMap<Boolean, List<String>> partitioned = names.stream()\n    .collect(Collectors.partitioningBy(s -> s.startsWith(\"A\")));\n\n// Optional\nOptional<String> opt = Optional.of(\"Hello\");\nOptional<String> empty = Optional.empty();\nOptional<String> nullable = Optional.ofNullable(null);  // empty\n\nopt.isPresent()         // true\nopt.get()               // \"Hello\"\nempty.orElse(\"default\") // \"default\"\nempty.orElseGet(() -> computeDefault())\nempty.orElseThrow(() -> new RuntimeException(\"No value\"))\nopt.map(String::length) // Optional<Integer> with 5\n\n// Primitive streams (no boxing)\nIntStream.range(1, 5)          // 1,2,3,4\nIntStream.rangeClosed(1, 5)    // 1,2,3,4,5\nIntStream.of(1, 2, 3).sum()    // 6\nIntStream.of(1,2,3).average()  // OptionalDouble(2.0)\n\n// flatMap\nList<List<Integer>> nested = Arrays.asList(\n    Arrays.asList(1,2), Arrays.asList(3,4)\n);\nList<Integer> flat = nested.stream()\n    .flatMap(Collection::stream)\n    .collect(Collectors.toList());  // [1,2,3,4]\n\n// Infinite stream â€” must use limit!\nStream.iterate(0, n -> n + 2).limit(5)  // 0,2,4,6,8\nStream.generate(Math::random).limit(3)  // 3 random doubles"
},
    "Enums & Nested Classes (OCP)": {
      "explanation": "Enums are special classes representing fixed sets of constants. They can have fields, methods, and constructors. Nested classes come in four types: static nested, inner, local, and anonymous.",
      "details": [
        "enum: implicitly extends java.lang.Enum; can have abstract methods, constructors, fields",
        "enum methods: values() â†’ array of all; ordinal() â†’ position (0-based); name() â†’ String name",
        "enum can implement interfaces; cannot extend a class (already extends Enum)",
        "Static nested class: like a regular class inside another; accessed via OuterClass.Inner",
        "Inner class: has access to outer instance; needs outer instance to create",
        "Local class: defined inside a method; can access final/effectively final local vars",
        "Anonymous class: inline class definition used for one-off implementations"
],
      "example": "// Enum with fields and methods\nenum Planet {\n    MERCURY(3.303e+23, 2.4397e6),\n    VENUS  (4.869e+24, 6.0518e6),\n    EARTH  (5.976e+24, 6.37814e6);\n\n    private final double mass;\n    private final double radius;\n\n    Planet(double mass, double radius) {\n        this.mass = mass; this.radius = radius;\n    }\n    double surfaceGravity() { return 6.67300E-11 * mass / (radius*radius); }\n    double surfaceWeight(double mass) { return mass * surfaceGravity(); }\n}\n\n// Enum usage\nPlanet p = Planet.EARTH;\nSystem.out.println(p.name());           // \"EARTH\"\nSystem.out.println(p.ordinal());        // 2\nPlanet[] all = Planet.values();         // all enum constants\nPlanet fromStr = Planet.valueOf(\"MARS\");// IllegalArgumentException\n\n// Enum in switch\nswitch (p) {\n    case EARTH: System.out.println(\"Home\"); break;\n    case MARS:  System.out.println(\"Red\"); break;\n}\n\n// Static nested class (no reference to outer instance)\nclass Outer {\n    static class StaticNested {\n        void greet() { System.out.println(\"Static nested\"); }\n    }\n    class Inner {\n        void greet() { System.out.println(\"Inner of \" + Outer.this); }\n    }\n}\nOuter.StaticNested sn = new Outer.StaticNested();\nOuter.Inner inner = new Outer().new Inner();  // needs outer instance!\n\n// Local class (inside a method)\nvoid process() {\n    final String prefix = \"LOG\";  // must be effectively final\n    class Logger {\n        void log(String msg) { System.out.println(prefix + \": \" + msg); }\n    }\n    new Logger().log(\"Hello\");\n}\n\n// Anonymous class\nComparator<String> comp = new Comparator<String>() {\n    @Override public int compare(String a, String b) {\n        return a.length() - b.length();\n    }\n};\n// Lambda equivalent:\nComparator<String> comp2 = (a, b) -> a.length() - b.length();"
},
    "equals, hashCode & toString (OCP)": {
      "explanation": "Every Java class inherits from Object. The three most commonly overridden methods are toString(), equals(), and hashCode(). They have a critical contract: if two objects are equal, they must have the same hashCode.",
      "details": [
        "toString(): default is ClassName@hexHashCode; override for meaningful output",
        "equals(): default checks reference (==); override to check value equality",
        "hashCode(): default based on memory address; must match equals() contract",
        "equals/hashCode contract: equal objects â†’ same hashCode; same hashCode â†’ not necessarily equal",
        "If you override equals(), ALWAYS override hashCode() â€” required for HashMap/HashSet correctness",
        "equals() must be: reflexive, symmetric, transitive, consistent, and handle null",
        "instanceof check required before casting in equals() implementation"
],
      "example": "class Point {\n    int x, y;\n    Point(int x, int y) { this.x = x; this.y = y; }\n\n    // toString\n    @Override public String toString() {\n        return \"Point(\" + x + \", \" + y + \")\";\n    }\n\n    // equals â€” must handle null and wrong type\n    @Override public boolean equals(Object obj) {\n        if (this == obj) return true;           // same reference\n        if (obj == null) return false;          // null check\n        if (!(obj instanceof Point)) return false; // type check\n        Point other = (Point) obj;\n        return this.x == other.x && this.y == other.y;\n    }\n\n    // hashCode â€” same fields as equals\n    @Override public int hashCode() {\n        return Objects.hash(x, y);  // java.util.Objects helper\n    }\n}\n\n// Without proper hashCode, HashMap breaks:\nSet<Point> set = new HashSet<>();\nset.add(new Point(1, 2));\nSystem.out.println(set.contains(new Point(1, 2)));\n// true only if hashCode() is correct!\n\n// String has equals() and hashCode() implemented:\nString s1 = new String(\"hello\");\nString s2 = new String(\"hello\");\ns1.equals(s2);   // true (value equality)\ns1 == s2;        // false (different objects)\n\n// StringBuilder does NOT override equals:\nStringBuilder sb1 = new StringBuilder(\"hi\");\nStringBuilder sb2 = new StringBuilder(\"hi\");\nsb1.equals(sb2); // false (Object.equals â€” reference check)"
},
    "Concurrency (OCP)": {
      "explanation": "Java concurrency enables parallel execution via threads. The java.util.concurrent package provides higher-level tools: thread pools, futures, concurrent collections, and atomic variables to safely share data between threads.",
      "details": [
        "Thread creation: extend Thread or implement Runnable; prefer Runnable for flexibility",
        "synchronized: ensures mutual exclusion on instance (this) or class object",
        "volatile: guarantees visibility across threads; does not prevent race conditions",
        "Atomic classes (AtomicInteger, AtomicBoolean): lock-free thread-safe operations",
        "ExecutorService: manages thread pool; submit() for Callable (returns Future), execute() for Runnable",
        "Future<T>: get() blocks until result; isDone(); cancel(true)",
        "CyclicBarrier, CountDownLatch, Semaphore: coordination between threads"
],
      "example": "// Thread creation\nclass MyTask implements Runnable {\n    @Override public void run() { System.out.println(\"Running\"); }\n}\nThread t = new Thread(new MyTask());\nt.start();\n\n// Lambda (preferred)\nThread t2 = new Thread(() -> System.out.println(\"Lambda thread\"));\nt2.start();\nt2.join();  // wait for t2 to finish\n\n// Synchronized method (lock on 'this')\nclass SafeCounter {\n    private int count = 0;\n    public synchronized void increment() { count++; }\n    public synchronized int get() { return count; }\n}\n\n// Synchronized block (narrower lock)\nclass BankAccount {\n    private double balance;\n    private final Object lock = new Object();\n    void transfer(double amount) {\n        synchronized (lock) { balance -= amount; }\n    }\n}\n\n// ExecutorService (thread pool)\nExecutorService pool = Executors.newFixedThreadPool(4);\n\n// Runnable (no return value)\npool.execute(() -> System.out.println(\"Task\"));\n\n// Callable (returns value via Future)\nFuture<Integer> future = pool.submit(() -> 42);\nInteger result = future.get();  // blocks until done\nfuture.isDone();                // check without blocking\n\n// Multiple futures\nList<Future<Integer>> futures = new ArrayList<>();\nfor (int i = 0; i < 5; i++) {\n    final int taskId = i;\n    futures.add(pool.submit(() -> taskId * 2));\n}\nfor (Future<Integer> f : futures) System.out.println(f.get());\npool.shutdown();\n\n// Atomic variables (lock-free)\nAtomicInteger counter = new AtomicInteger(0);\ncounter.incrementAndGet();  // thread-safe increment\ncounter.compareAndSet(1, 2); // CAS operation\n\n// Concurrent collections (thread-safe)\nConcurrentHashMap<String,Integer> cmap = new ConcurrentHashMap<>();\nCopyOnWriteArrayList<String> clist = new CopyOnWriteArrayList<>();\n\n// volatile â€” guarantees visibility (not atomicity)\nclass SharedFlag {\n    private volatile boolean running = true;\n    void stop() { running = false; }\n    void run() { while (running) { /* work */ } }\n}"
},
    "IO & NIO.2 (OCP)": {
      "explanation": "Java IO provides stream-based file reading/writing. NIO.2 (Java 7, java.nio.file) provides a modern, more powerful Path-based API for file operations, directory walking, and file watching.",
      "details": [
        "IO streams: InputStream/OutputStream (bytes), Reader/Writer (characters)",
        "Buffered wrappers: BufferedReader, BufferedWriter â€” dramatically improves performance",
        "Serialization: implements Serializable; ObjectOutputStream/ObjectInputStream; transient fields skipped",
        "NIO.2: Path, Paths, Files â€” replacing legacy File class",
        "Path operations: resolve(), relativize(), normalize(), toAbsolutePath()",
        "Files utility: copy(), move(), delete(), readAllLines(), write(), walk(), find()",
        "try-with-resources is essential for IO â€” always closes streams automatically"
],
      "example": "// Reading a file (Java IO)\ntry (BufferedReader br = new BufferedReader(new FileReader(\"file.txt\"))) {\n    String line;\n    while ((line = br.readLine()) != null) {\n        System.out.println(line);\n    }\n} catch (IOException e) { e.printStackTrace(); }\n\n// Writing a file\ntry (BufferedWriter bw = new BufferedWriter(new FileWriter(\"out.txt\"))) {\n    bw.write(\"Hello, World!\");\n    bw.newLine();\n    bw.write(\"Second line\");\n}\n\n// Serialization\nclass Person implements Serializable {\n    String name;\n    transient String password;  // NOT serialized\n}\n// Write:\ntry (ObjectOutputStream oos = new ObjectOutputStream(\n        new FileOutputStream(\"person.ser\"))) {\n    oos.writeObject(new Person(\"Alice\"));\n}\n// Read:\ntry (ObjectInputStream ois = new ObjectInputStream(\n        new FileInputStream(\"person.ser\"))) {\n    Person p = (Person) ois.readObject();\n}\n\n// NIO.2 â€” Path and Files (Java 7+)\nPath path = Paths.get(\"/home/user/file.txt\");\nPath relative = Paths.get(\"src\", \"main\", \"App.java\");\n\n// Path operations\npath.getFileName()     // file.txt\npath.getParent()       // /home/user\npath.getRoot()         // /\npath.toString()        // /home/user/file.txt\npath.resolve(\"other.txt\")   // /home/user/other.txt\npath.relativize(otherPath)  // relative path between two\n\n// Files utility methods\nFiles.exists(path)\nFiles.isDirectory(path)\nFiles.copy(src, dest, StandardCopyOption.REPLACE_EXISTING)\nFiles.move(src, dest)\nFiles.delete(path)\nFiles.deleteIfExists(path)\nList<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8)\nFiles.write(path, lines, StandardCharsets.UTF_8)\n\n// Walking directory tree\nFiles.walk(Paths.get(\"/home/user\"))     // Stream<Path> recursive\n     .filter(Files::isRegularFile)\n     .forEach(System.out::println);\n\n// Files.find with attribute filter\nFiles.find(Paths.get(\"/\"), 10,\n    (p, attr) -> attr.isRegularFile() && p.toString().endsWith(\".java\"))\n    .forEach(System.out::println);"
},
    "JDBC (OCP)": {
      "explanation": "JDBC (Java Database Connectivity) provides a standard API for connecting Java applications to relational databases. It supports executing SQL, managing transactions, and reading results.",
      "details": [
        "Steps: Load driver â†’ get Connection â†’ create Statement â†’ execute SQL â†’ process ResultSet â†’ close",
        "DriverManager.getConnection(url, user, pass) â†’ Connection",
        "Statement: basic SQL; PreparedStatement: parameterized (prevents SQL injection)",
        "ResultSet: cursor starts before first row; next() advances; getXxx(column) retrieves data",
        "Transactions: setAutoCommit(false); commit() or rollback()",
        "try-with-resources works for Connection, Statement, ResultSet (all AutoCloseable)",
        "SQL exceptions: SQLException is checked â€” must be caught or declared"
],
      "example": "// JDBC connection and query\nString url = \"jdbc:postgresql://localhost:5432/mydb\";\nString sql = \"SELECT id, name, salary FROM employees WHERE dept = ?\";\n\ntry (Connection conn = DriverManager.getConnection(url, \"user\", \"pass\");\n     PreparedStatement ps = conn.prepareStatement(sql)) {\n\n    ps.setString(1, \"Engineering\");  // set parameter (1-indexed)\n\n    try (ResultSet rs = ps.executeQuery()) {\n        while (rs.next()) {\n            int id       = rs.getInt(\"id\");\n            String name  = rs.getString(\"name\");\n            double sal   = rs.getDouble(\"salary\");\n            System.out.println(id + \" \" + name + \" \" + sal);\n        }\n    }\n} catch (SQLException e) {\n    e.printStackTrace();\n}\n\n// INSERT with PreparedStatement\nString insert = \"INSERT INTO employees (name, dept, salary) VALUES (?,?,?)\";\ntry (Connection conn = DriverManager.getConnection(url, \"user\", \"pass\");\n     PreparedStatement ps = conn.prepareStatement(insert)) {\n    ps.setString(1, \"Alice\");\n    ps.setString(2, \"Engineering\");\n    ps.setDouble(3, 95000.0);\n    int rowsAffected = ps.executeUpdate();  // returns count\n}\n\n// Transaction management\ntry (Connection conn = DriverManager.getConnection(url, \"user\", \"pass\")) {\n    conn.setAutoCommit(false);  // start transaction\n    try {\n        // multiple operations\n        Statement st = conn.createStatement();\n        st.executeUpdate(\"UPDATE accounts SET balance=balance-100 WHERE id=1\");\n        st.executeUpdate(\"UPDATE accounts SET balance=balance+100 WHERE id=2\");\n        conn.commit();    // success â€” make permanent\n    } catch (SQLException e) {\n        conn.rollback();  // failure â€” undo all\n    }\n}\n\n// ResultSet navigation (default: forward-only, read-only)\n// ResultSet.TYPE_SCROLL_INSENSITIVE â†’ can scroll\n// rs.absolute(n)  â†’ move to row n (-1 = last)\n// rs.first()      â†’ row 1\n// rs.last()       â†’ last row\n// rs.beforeFirst()â†’ before row 1"
},
    "Design Patterns (OCP)": {
      "explanation": "Design patterns are reusable solutions to common software design problems. Java 8 OCP covers Singleton, Immutable, Builder, Factory, and functional interface-based patterns.",
      "details": [
        "Singleton: one instance per JVM; private constructor, static getInstance()",
        "Immutable: no setters, final fields, final class, defensive copies for mutable fields",
        "Builder: step-by-step object construction; fluent API; handles many optional params",
        "Factory: creates objects without exposing creation logic; returns interface type",
        "Observer/Listener: callbacks via functional interfaces (replaces anonymous classes)",
        "Strategy: encapsulate algorithms; swap implementations via interface",
        "Template Method: abstract class defines skeleton; subclasses fill in steps"
],
      "example": "// Singleton (thread-safe with initialization-on-demand)\nclass Singleton {\n    private Singleton() {}\n    private static class Holder {\n        static final Singleton INSTANCE = new Singleton();\n    }\n    public static Singleton getInstance() { return Holder.INSTANCE; }\n}\n\n// Immutable class\nfinal class ImmutablePoint {\n    private final int x;\n    private final int y;\n    ImmutablePoint(int x, int y) { this.x = x; this.y = y; }\n    int getX() { return x; }\n    int getY() { return y; }\n    ImmutablePoint withX(int newX) { return new ImmutablePoint(newX, y); }\n}\n\n// Builder pattern\nclass Animal {\n    private final String name;\n    private final String species;\n    private final int age;\n\n    private Animal(Builder b) {\n        this.name = b.name;\n        this.species = b.species;\n        this.age = b.age;\n    }\n\n    static class Builder {\n        private String name;\n        private String species;\n        private int age;\n\n        Builder name(String name)       { this.name = name; return this; }\n        Builder species(String species) { this.species = species; return this; }\n        Builder age(int age)            { this.age = age; return this; }\n        Animal build()                  { return new Animal(this); }\n    }\n}\nAnimal a = new Animal.Builder().name(\"Rex\").species(\"Dog\").age(3).build();\n\n// Factory pattern\ninterface Shape { double area(); }\nclass Circle implements Shape { double r; Circle(double r){this.r=r;} public double area(){return Math.PI*r*r;} }\nclass Square implements Shape { double s; Square(double s){this.s=s;} public double area(){return s*s;} }\n\nclass ShapeFactory {\n    static Shape create(String type, double size) {\n        return switch (type) {\n            case \"circle\" -> new Circle(size);\n            case \"square\" -> new Square(size);\n            default -> throw new IllegalArgumentException(\"Unknown: \" + type);\n        };\n    }\n}\n\n// Strategy (with lambda!)\ninterface SortStrategy { void sort(List<Integer> list); }\nSortStrategy ascending  = list -> Collections.sort(list);\nSortStrategy descending = list -> Collections.sort(list, Comparator.reverseOrder());"
},
    "Localization & Dates (OCP)": {
      "explanation": "Java provides Locale, ResourceBundle, and NumberFormat for internationalization (i18n). The java.time package with DateTimeFormatter handles locale-sensitive date and number formatting.",
      "details": [
        "Locale: represents a language/country combination (Locale.US, Locale.FRANCE, new Locale('fr','FR'))",
        "ResourceBundle: key-value property files for locale-specific text (messages_en.properties)",
        "NumberFormat.getInstance(locale): format/parse numbers; getCurrencyInstance(); getPercentInstance()",
        "DateTimeFormatter.ofLocalizedDate(FormatStyle.FULL).withLocale(locale): locale-aware dates",
        "DateTimeFormatter patterns: yyyy (year), MM (month), dd (day), HH:mm:ss, EEE (day name)",
        "ZonedDateTime: date+time+timezone; ZoneId.of('America/New_York')",
        "Period vs Duration: Period for dates (years/months/days), Duration for times (hours/minutes/seconds)"
],
      "example": "// Locale\nLocale us  = Locale.US;\nLocale fr  = Locale.FRANCE;\nLocale de  = new Locale(\"de\", \"DE\");\n\n// Number formatting\nNumberFormat nf = NumberFormat.getInstance(Locale.US);\nString formatted = nf.format(1234567.89);  // \"1,234,567.89\"\nNumber parsed = nf.parse(\"1,234.56\");      // 1234.56\n\nNumberFormat currency = NumberFormat.getCurrencyInstance(Locale.US);\ncurrency.format(9.99);  // \"$9.99\"\n\nNumberFormat pct = NumberFormat.getPercentInstance(Locale.US);\npct.format(0.75);       // \"75%\"\n\n// ResourceBundle (internationalization)\n// messages_en.properties: greeting=Hello\n// messages_fr.properties: greeting=Bonjour\nResourceBundle rb = ResourceBundle.getBundle(\"messages\", Locale.FRANCE);\nString greeting = rb.getString(\"greeting\");  // \"Bonjour\"\n\n// DateTimeFormatter patterns\nDateTimeFormatter fmt = DateTimeFormatter.ofPattern(\"MM/dd/yyyy HH:mm\");\nLocalDateTime dt = LocalDateTime.of(2024, 6, 15, 14, 30);\nString out = dt.format(fmt);              // \"06/15/2024 14:30\"\nLocalDateTime parsed2 = LocalDateTime.parse(\"06/15/2024 14:30\", fmt);\n\n// Localized date format\nDateTimeFormatter localFmt = DateTimeFormatter\n    .ofLocalizedDate(FormatStyle.FULL)\n    .withLocale(Locale.FRANCE);\nString frDate = LocalDate.now().format(localFmt);  // \"samedi 15 juin 2024\"\n\n// ZonedDateTime\nZoneId nyZone = ZoneId.of(\"America/New_York\");\nZonedDateTime nyTime = ZonedDateTime.now(nyZone);\nZonedDateTime tokyoTime = nyTime.withZoneSameInstant(ZoneId.of(\"Asia/Tokyo\"));\n\n// Duration vs Period\nDuration d = Duration.ofHours(2).plusMinutes(30);  // 2h 30m\nPeriod p = Period.of(1, 2, 3);                     // 1yr 2mo 3d\nlong minutes = d.toMinutes();                       // 150"
},
    "Assertions & Exceptions Advanced (OCP)": {
      "explanation": "Assertions are used during development to verify assumptions. Advanced exception handling includes try-with-resources chaining, suppressed exceptions, and re-throwing with type inference.",
      "details": [
        "assert condition : 'message' â€” throws AssertionError if condition is false",
        "Assertions disabled by default; enable with -ea (or -enableassertions) JVM flag",
        "Do not use assert for argument validation in public methods (use IllegalArgumentException)",
        "Suppressed exceptions: in try-with-resources, close() exceptions are suppressed; access via getSuppressed()",
        "Exception chaining: new Exception('msg', cause) â€” wraps original exception",
        "Re-throw: catch (Exception e) { throw e; } â€” Java infers specific type",
        "Multi-catch variable is effectively final â€” cannot reassign in catch block"
],
      "example": "// Assertions\nint age = -5;\nassert age >= 0 : \"Age cannot be negative: \" + age;\n// Throws AssertionError if assertions enabled and age < 0\n\n// Enable: java -ea MyApp\n// Disable: java -da MyApp (default)\n\n// DO use assert for:\nassert list != null;            // internal invariant\nassert result > 0 : \"Expected positive, got \" + result;\n\n// DON'T use assert for:\n// public void setAge(int age) { assert age >= 0; }  // wrong!\n// Instead:\npublic void setAge(int age) {\n    if (age < 0) throw new IllegalArgumentException(\"Negative age\");\n    this.age = age;\n}\n\n// Suppressed exceptions (try-with-resources)\nclass Resource implements AutoCloseable {\n    public void use() throws Exception { throw new Exception(\"use\"); }\n    public void close() throws Exception { throw new Exception(\"close\"); }\n}\ntry (Resource r = new Resource()) {\n    r.use();\n} catch (Exception e) {\n    System.out.println(\"Main: \" + e.getMessage());  // \"use\"\n    Throwable[] suppressed = e.getSuppressed();\n    System.out.println(\"Suppressed: \" + suppressed[0].getMessage());  // \"close\"\n}\n\n// Exception chaining\ntry {\n    Integer.parseInt(\"abc\");\n} catch (NumberFormatException e) {\n    throw new RuntimeException(\"Invalid input\", e);  // e is the cause\n}\n\n// Catch and re-throw (Java 7+ infers specific type)\nvoid rethrow() throws IOException, SQLException {\n    try {\n        // may throw IOException or SQLException\n    } catch (Exception e) {\n        throw e;  // Java infers which checked type to rethrow\n    }\n}"
}
}
},
  "DAA": {
  "icon": "ti-math-function",
  "color": "#6B3FA0",
  "topics": {
    "Introduction to Algorithms": {
      "explanation": "An algorithm is a finite, well-defined sequence of steps to solve a problem. It transforms an input into the desired output. Good algorithms are efficient in time, space, and correctness.",
      "details": [
        "Characteristics: Input, Output, Definiteness, Finiteness, Effectiveness",
        "Types: Brute Force, Greedy, Divide & Conquer, Dynamic Programming, Backtracking, Randomized",
        "Performance is analysed by Time Complexity and Space Complexity",
        "Expressed via Pseudocode, flowcharts, or programming languages"
],
      "example": "// Characteristics of a good algorithm\nInput:        Takes zero or more inputs\nOutput:       Produces at least one output\nDefiniteness: Every step is clear and unambiguous\nFiniteness:   Terminates after a finite number of steps\nEffectiveness:Each step is simple enough to be executed\n\n// Pseudocode example â€” linear search\nAlgorithm LinearSearch(A, n, key):\n  for i = 0 to n-1 do\n    if A[i] == key then\n      return i\n  return -1\n\n// Brute Force: try all possibilities\n// Greedy: pick locally optimal at each step\n// D&C: divide â†’ conquer â†’ combine\n// DP: memoize overlapping subproblems\n// Backtracking: try and undo on failure"
},
    "Asymptotic Notations": {
      "explanation": "Asymptotic notations describe algorithm efficiency as input size grows. They characterise the best, average, and worst-case performance without hardware dependence.",
      "details": [
        "Big O (O): upper bound â€” worst-case guarantee",
        "Omega (Î©): lower bound â€” best-case guarantee",
        "Theta (Î˜): tight bound â€” average/exact behaviour",
        "Little o (o): strict upper bound (not asymptotically tight)",
        "Order: O(1) < O(log n) < O(n) < O(n log n) < O(nÂ²) < O(2â¿) < O(n!)"
],
      "example": "// Big O â€” worst case upper bound\n// Linear search: O(n)  â€” at most n comparisons\n\n// Omega â€” best case lower bound\n// Linear search: Î©(1)  â€” found at index 0\n\n// Theta â€” tight bound (same upper and lower)\n// Merge sort: Î˜(n log n) in all cases\n\n// Rules for simplification\nO(3nÂ² + 5n + 1) â†’ O(nÂ²)   // drop constants & lower terms\nO(n + log n)    â†’ O(n)\nO(n * n)        â†’ O(nÂ²)\n\n// Common complexities\nO(1)       : array access, hash table lookup\nO(log n)   : binary search, balanced BST ops\nO(n)       : linear scan, linear search\nO(n log n) : merge sort, heap sort, quick sort (avg)\nO(nÂ²)      : bubble sort, insertion sort (worst)\nO(2â¿)      : Fibonacci naive, all subsets\nO(n!)      : permutations, travelling salesman brute force"
},
    "Divide and Conquer": {
      "explanation": "Divide and Conquer breaks a problem into smaller subproblems, solves each recursively, then combines results. It achieves efficiency via recursive halving.",
      "details": [
        "Divide: split problem into smaller independent subproblems",
        "Conquer: solve each subproblem recursively (base case stops)",
        "Combine: merge subproblem solutions into overall solution",
        "Recurrence: T(n) = aT(n/b) + f(n) â€” solved by Master Theorem",
        "Examples: Merge Sort T(n)=2T(n/2)+n â†’ Î˜(n log n)"
],
      "example": "// General D&C template\nAlgorithm DivideAndConquer(P):\n  if P is small enough (base case):\n    solve directly\n  else:\n    divide P into subproblems P1, P2, ..., Pk\n    for each Pi: Si = DivideAndConquer(Pi)\n    combine S1, S2, ..., Sk into solution S\n    return S\n\n// Majority Element (D&C)\n// Find element appearing > n/2 times\nint majorityElement(int[] nums, int l, int r) {\n    if (l == r) return nums[l];\n    int mid = (l + r) / 2;\n    int left  = majorityElement(nums, l, mid);\n    int right = majorityElement(nums, mid+1, r);\n    if (left == right) return left;\n    int lCount = count(nums, l, r, left);\n    int rCount = count(nums, l, r, right);\n    return lCount > rCount ? left : right;\n}\n\n// Power x^n in O(log n) using D&C\ndouble power(double x, int n) {\n    if (n == 0) return 1;\n    double half = power(x, n / 2);\n    if (n % 2 == 0) return half * half;\n    return x * half * half;\n}"
},
    "Merge Sort": {
      "explanation": "Merge Sort is a stable, comparison-based divide-and-conquer sorting algorithm. It divides the array into halves, recursively sorts them, then merges in O(n log n) always.",
      "details": [
        "Time: Î˜(n log n) in best, average, and worst case",
        "Space: O(n) auxiliary â€” needs temporary arrays",
        "Stable: equal elements maintain their original relative order",
        "Best for: linked lists, external sorting (data too large for RAM)",
        "Recurrence: T(n) = 2T(n/2) + n â†’ O(n log n) by Master Theorem"
],
      "example": "void mergeSort(int[] arr, int left, int right) {\n    if (left >= right) return;         // base case: 1 element\n    int mid = left + (right - left) / 2;\n    mergeSort(arr, left, mid);         // sort left half\n    mergeSort(arr, mid + 1, right);    // sort right half\n    merge(arr, left, mid, right);      // merge sorted halves\n}\n\nvoid merge(int[] arr, int l, int m, int r) {\n    int[] L = Arrays.copyOfRange(arr, l, m + 1);\n    int[] R = Arrays.copyOfRange(arr, m + 1, r + 1);\n    int i = 0, j = 0, k = l;\n    while (i < L.length && j < R.length)\n        arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];\n    while (i < L.length) arr[k++] = L[i++];\n    while (j < R.length) arr[k++] = R[j++];\n}\n\n// Trace: [38, 27, 43, 3]\n// Split:   [38,27]     [43,3]\n// Sort:    [27,38]     [3,43]\n// Merge:   [3, 27, 38, 43] âœ“"
},
    "Quick Sort": {
      "explanation": "Quick Sort picks a pivot, partitions the array around it (smaller left, larger right), then recursively sorts each partition. Average O(n log n) but worst O(nÂ²) with bad pivots.",
      "details": [
        "Average: O(n log n); Worst: O(nÂ²) when array is already sorted with last element pivot",
        "In-place: O(log n) stack space (no auxiliary array needed)",
        "Not stable: equal elements may change relative order",
        "Randomised pivot selection avoids worst-case behaviour",
        "In practice fastest due to cache-friendly memory access"
],
      "example": "void quickSort(int[] arr, int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);   // sort left partition\n        quickSort(arr, pi + 1, high);  // sort right partition\n    }\n}\n\nint partition(int[] arr, int low, int high) {\n    int pivot = arr[high];  // last element as pivot\n    int i = low - 1;        // index of smaller element\n    for (int j = low; j < high; j++) {\n        if (arr[j] <= pivot) {\n            i++;\n            int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;\n        }\n    }\n    int tmp = arr[i+1]; arr[i+1] = arr[high]; arr[high] = tmp;\n    return i + 1;\n}\n\n// Trace: [10, 80, 30, 90, 40] pivot=40\n// Partition â†’ [10, 30, 40, 90, 80]\n// Recurse on [10,30] and [90,80]"
},
    "Binary Search (D&C)": {
      "explanation": "Binary Search is a classic Divide & Conquer algorithm that finds a target in a sorted array by halving the search space each step. O(log n) time, O(1) space iteratively.",
      "details": [
        "Precondition: array must be sorted",
        "Each step eliminates half the remaining elements",
        "Iterative: O(1) space; Recursive: O(log n) stack space",
        "Variants: find first/last occurrence, floor/ceiling, rotated array"
],
      "example": "// Iterative Binary Search\nint binarySearch(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2; // avoid overflow\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target)  left  = mid + 1;\n        else                    right = mid - 1;\n    }\n    return -1;\n}\n\n// Recursive Binary Search\nint bsRecur(int[] arr, int l, int r, int x) {\n    if (l > r) return -1;\n    int mid = l + (r - l) / 2;\n    if (arr[mid] == x) return mid;\n    if (arr[mid] < x)  return bsRecur(arr, mid+1, r, x);\n    return bsRecur(arr, l, mid-1, x);\n}\n\n// Application: Koko Eating Bananas\n// Binary search on the answer (eating speed k)\n// For each k, check: can Koko finish in h hours?\n// Search k in range [1, max(piles)]"
},
    "Greedy Method": {
      "explanation": "The Greedy Method builds a solution piece by piece by always choosing the option that looks best at the current step (locally optimal), hoping to reach a globally optimal solution.",
      "details": [
        "Greedy Choice Property: local optimal choice leads to global optimum",
        "Optimal Substructure: optimal solution contains optimal subsolutions",
        "Does NOT always give optimal (e.g. 0/1 Knapsack needs DP)",
        "Works for: Fractional Knapsack, Activity Selection, Huffman, Prim, Kruskal, Dijkstra"
],
      "example": "// Activity Selection Problem\n// Select maximum number of non-overlapping activities\n// GREEDY: always pick the activity with earliest finish time\n\nActivity[] acts = {{1,4},{3,5},{0,6},{5,7},{3,8},{5,9},{6,10},{8,11},{8,12},{2,13},{12,14}};\nArrays.sort(acts, (a,b) -> a.end - b.end);  // sort by finish time\nint count = 1, lastEnd = acts[0].end;\nfor (int i = 1; i < acts.length; i++) {\n    if (acts[i].start >= lastEnd) { count++; lastEnd = acts[i].end; }\n}\n// Optimal!\n\n// Fractional Knapsack\n// GREEDY: pick items with highest value/weight ratio first\n// Can take fractions of items (unlike 0/1 Knapsack)\nItem[] items = {{60,10},{100,20},{120,30}};  // {value, weight}\nArrays.sort(items, (a,b) -> Double.compare((double)b.v/b.w, (double)a.v/a.w));\ndouble totalValue = 0; int capacity = 50;\nfor (Item item : items) {\n    if (capacity >= item.w) { totalValue += item.v; capacity -= item.w; }\n    else { totalValue += item.v * (double)capacity / item.w; break; }\n}\n// Total = 60 + 100 + 80 = 240"
},
    "Knapsack Problem": {
      "explanation": "The 0/1 Knapsack Problem: given weights and values of n items and a capacity W, find the maximum value subset where total weight â‰¤ W. Each item can only be taken once (0 or 1).",
      "details": [
        "0/1: each item is either taken completely or not at all",
        "Fractional: items can be split â€” solved greedily",
        "0/1 requires Dynamic Programming: dp[i][w] = max value using first i items with capacity w",
        "Time: O(nW); Space: O(nW) or O(W) with space optimisation"
],
      "example": "// 0/1 Knapsack â€” DP Tabulation\nint knapsack(int[] val, int[] wt, int n, int W) {\n    int[][] dp = new int[n+1][W+1];\n    for (int i = 1; i <= n; i++) {\n        for (int w = 0; w <= W; w++) {\n            dp[i][w] = dp[i-1][w];  // don't take item i\n            if (wt[i-1] <= w)       // take item i if it fits\n                dp[i][w] = Math.max(dp[i][w],\n                            val[i-1] + dp[i-1][w - wt[i-1]]);\n        }\n    }\n    return dp[n][W];\n}\n\n// Example: n=4, W=5\n// val = [1, 6, 10, 16], wt = [1, 2, 3, 5]\n// dp table reveals max value = 22 (items 2+3, weight=2+3=5)\n\n// Space-optimised (1D dp)\nint[] dp = new int[W+1];\nfor (int i = 0; i < n; i++)\n    for (int w = W; w >= wt[i]; w--)  // reverse to avoid reuse\n        dp[w] = Math.max(dp[w], val[i] + dp[w - wt[i]]);"
},
    "BFS & DFS": {
      "explanation": "BFS and DFS are the two fundamental graph traversal algorithms. BFS explores level by level (shortest path). DFS explores as deep as possible before backtracking.",
      "details": [
        "BFS: uses Queue, finds shortest path in unweighted graphs, O(V+E)",
        "DFS: uses Stack/Recursion, detects cycles, topological sort, O(V+E)",
        "BFS: level-order traversal, good for 'minimum steps/hops' problems",
        "DFS: good for path finding, flood fill, connected components, backtracking"
],
      "example": "// BFS â€” level by level using Queue\nvoid bfs(List<List<Integer>> graph, int src) {\n    boolean[] visited = new boolean[graph.size()];\n    Queue<Integer> q = new LinkedList<>();\n    visited[src] = true; q.offer(src);\n    while (!q.isEmpty()) {\n        int node = q.poll();\n        System.out.print(node + \" \");\n        for (int nb : graph.get(node))\n            if (!visited[nb]) { visited[nb] = true; q.offer(nb); }\n    }\n}\n\n// DFS â€” deep first using Recursion\nvoid dfs(List<List<Integer>> graph, int node, boolean[] vis) {\n    vis[node] = true;\n    System.out.print(node + \" \");\n    for (int nb : graph.get(node))\n        if (!vis[nb]) dfs(graph, nb, vis);\n}\n\n// BFS applications: Max Area of Island, Shortest Path\n// DFS applications: Number of Islands, Boundary Tree, Maze\n\n// BFS finds shortest path â†’ visits 0â†’1â†’2â†’3 in layers\n// DFS backtracks â†’ explores 0â†’1â†’3 fully before going to 2"
},
    "Backtracking": {
      "explanation": "Backtracking is a systematic search strategy that builds a solution incrementally, abandoning a path (backtracking) as soon as it determines the path cannot lead to a valid solution.",
      "details": [
        "State Space Tree: models all possible choices as a tree",
        "Pruning: cut branches that violate constraints early",
        "More efficient than brute force â€” avoids exploring invalid states",
        "Applications: N-Queens, Sudoku, Hamiltonian Cycle, Graph Colouring"
],
      "example": "// N-Queens Problem: place N queens on NxN board, no two attack each other\nvoid solve(int col, boolean[] rows, boolean[] d1, boolean[] d2,\n           int n, List<List<Integer>> result, int[] board) {\n    if (col == n) { result.add(toList(board)); return; }\n    for (int row = 0; row < n; row++) {\n        if (rows[row] || d1[row-col+n-1] || d2[row+col]) continue;\n        // Place queen\n        board[col] = row;\n        rows[row] = d1[row-col+n-1] = d2[row+col] = true;\n        solve(col+1, rows, d1, d2, n, result, board);\n        // Backtrack (undo)\n        rows[row] = d1[row-col+n-1] = d2[row+col] = false;\n    }\n}\n\n// Hamiltonian Cycle: visit every vertex exactly once\nboolean hamiltonian(int[][] graph, int[] path, int pos) {\n    if (pos == graph.length)\n        return graph[path[pos-1]][path[0]] == 1; // back to start?\n    for (int v = 1; v < graph.length; v++) {\n        if (isSafe(v, graph, path, pos)) {\n            path[pos] = v;\n            if (hamiltonian(graph, path, pos+1)) return true;\n            path[pos] = -1; // backtrack\n        }\n    }\n    return false;\n}"
},
    "Dynamic Programming": {
      "explanation": "Dynamic Programming solves complex optimisation problems by breaking them into overlapping subproblems, solving each once, and storing results to avoid redundant computation.",
      "details": [
        "Two approaches: Top-down (memoization) and Bottom-up (tabulation)",
        "Requires: Optimal Substructure + Overlapping Subproblems",
        "Memoization: recursive with cache (HashMap or array)",
        "Tabulation: iterative, fills table from base cases up",
        "Classic problems: Fibonacci, Knapsack, LCS, LIS, Matrix Chain, TSP"
],
      "example": "// Fibonacci â€” 3 approaches\n// Naive recursion: O(2â¿) â€” terrible\nint fib(int n) { return n<=1 ? n : fib(n-1)+fib(n-2); }\n\n// Memoization (top-down): O(n)\nint[] memo = new int[n+1];\nint fibMemo(int n) {\n    if (n <= 1) return n;\n    if (memo[n] != 0) return memo[n];\n    return memo[n] = fibMemo(n-1) + fibMemo(n-2);\n}\n\n// Tabulation (bottom-up): O(n) time, O(1) space\nint fibTab(int n) {\n    if (n <= 1) return n;\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) { int c = a+b; a = b; b = c; }\n    return b;\n}\n\n// Longest Common Subsequence (LCS)\n// dp[i][j] = LCS of first i chars of X and first j chars of Y\nint lcs(String X, String Y) {\n    int m = X.length(), n = Y.length();\n    int[][] dp = new int[m+1][n+1];\n    for (int i = 1; i <= m; i++)\n        for (int j = 1; j <= n; j++)\n            dp[i][j] = X.charAt(i-1)==Y.charAt(j-1)\n                        ? dp[i-1][j-1]+1\n                        : Math.max(dp[i-1][j], dp[i][j-1]);\n    return dp[m][n];\n}"
},
    "Matrix Chain Multiplication": {
      "explanation": "Matrix Chain Multiplication finds the optimal parenthesisation of a chain of matrices to minimise the total number of scalar multiplications. A classic DP problem.",
      "details": [
        "Multiplying A(pÃ—q)Â·B(qÃ—r) costs pÂ·qÂ·r scalar multiplications",
        "Order of multiplication doesn't change result but changes cost",
        "dp[i][j] = min multiplications to compute matrices i through j",
        "Time: O(nÂ³); Space: O(nÂ²)"
],
      "example": "// dp[i][j] = min cost to multiply matrices i..j\nint matrixChain(int[] p, int n) {\n    int[][] dp = new int[n][n];\n    // len = chain length\n    for (int len = 2; len <= n; len++) {\n        for (int i = 0; i < n - len + 1; i++) {\n            int j = i + len - 1;\n            dp[i][j] = Integer.MAX_VALUE;\n            for (int k = i; k < j; k++) {\n                int cost = dp[i][k] + dp[k+1][j]\n                           + p[i] * p[k+1] * p[j+1];\n                dp[i][j] = Math.min(dp[i][j], cost);\n            }\n        }\n    }\n    return dp[0][n-1];\n}\n\n// Example: dimensions p = [10, 30, 5, 60]\n// Matrices: A(10Ã—30), B(30Ã—5), C(5Ã—60)\n// Option 1: (AÂ·B)Â·C = 10*30*5 + 10*5*60 = 1500+3000 = 4500\n// Option 2: AÂ·(BÂ·C) = 30*5*60 + 10*30*60 = 9000+18000 = 27000\n// dp[0][2] = 4500  â† optimal parenthesisation"
},
    "Branch and Bound": {
      "explanation": "Branch and Bound is an optimisation strategy that systematically explores the solution space using a state space tree, pruning branches that cannot yield better solutions than the current best.",
      "details": [
        "Branching: split problem into subproblems (children in state space tree)",
        "Bounding: compute upper/lower bound for each node; prune if worse than best",
        "FIFO: BFS-style exploration; LC (Least Cost): explore most promising node first",
        "More efficient than backtracking â€” uses cost bounds to prune",
        "Applications: 0/1 Knapsack, Travelling Salesman Problem"
],
      "example": "// Branch and Bound for 0/1 Knapsack\n// Upper bound: take fractional items greedily (relaxation)\ndouble upperBound(Node node, int n, int W, Item[] items) {\n    if (node.weight >= W) return 0;\n    double bound = node.value;\n    int w = node.weight;\n    int j = node.level + 1;\n    while (j < n && w + items[j].weight <= W) {\n        w += items[j].weight;\n        bound += items[j].value;\n        j++;\n    }\n    if (j < n)  // take fraction of next item\n        bound += (W - w) * (double)items[j].value / items[j].weight;\n    return bound;\n}\n\n// State Space Tree traversal:\n// At each node: branch into \"take item\" and \"skip item\"\n// Prune if bound <= current best value\n\n// Backtracking vs Branch & Bound:\n// Backtracking: feasibility check only (DFS)\n// Branch & Bound: cost bounding + optimal solution (BFS/LC-search)\n// B&B finds optimal; Backtracking finds any valid solution"
},
    "NP Hard & NP Complete": {
      "explanation": "Complexity classes classify problems by how hard they are to solve. P problems are solvable in polynomial time; NP problems are verifiable in polynomial time; NP-Complete are the hardest in NP.",
      "details": [
        "P: solvable in polynomial time O(n^k) â€” easy problems",
        "NP: solution verifiable in polynomial time (may take exponential to solve)",
        "NP-Hard: at least as hard as any NP problem (may not even be in NP)",
        "NP-Complete: in NP AND NP-Hard â€” the hardest problems in NP",
        "Cook's Theorem: SAT (Boolean Satisfiability) is NP-Complete",
        "If any NP-Complete problem has polynomial solution â†’ P = NP (unsolved!)"
],
      "example": "// CLASS HIERARCHY\nP âŠ† NP âŠ† NP-Hard\nNP-Complete = NP âˆ© NP-Hard\n\n// P examples (polynomial-time solvable):\n  Sorting: O(n log n)\n  Binary Search: O(log n)\n  Shortest Path (Dijkstra): O(V log V + E)\n\n// NP examples (verifiable in poly time):\n  Travelling Salesman Problem (decision version)\n  0/1 Knapsack\n  Graph Colouring\n  Hamiltonian Cycle\n\n// NP-Complete (hardest in NP):\n  SAT (Boolean Satisfiability) â† Cook's Theorem\n  3-SAT, Vertex Cover, Clique\n  Hamiltonian Path/Cycle\n  TSP (decision version)\n  Sudoku (generalised)\n\n// Proving NP-Completeness:\n// Step 1: Show problem is in NP (verifiable in poly time)\n// Step 2: Reduce known NP-Complete problem to it in poly time\n\n// Deterministic vs Non-deterministic:\n// Deterministic: one outcome per step (real computers)\n// Non-deterministic: can \"guess\" correct choice (theoretical)"
}
}
},
  "Competitive Programming": {
  "icon": "ti-tournament",
  "color": "#B5451B",
  "topics": {
    "Sliding Window": {
      "explanation": "Sliding Window maintains a window (subarray/substring) that slides over data, adding elements from one end and removing from the other. Reduces O(nÂ²) brute force to O(n).",
      "details": [
        "Fixed Window: window size k is constant â€” slide by one each step",
        "Variable Window: window grows/shrinks based on a condition",
        "Key insight: avoid recomputing entire window â€” only process the change",
        "Applications: max subarray sum of size k, longest substring with k distinct chars"
],
      "example": "// Fixed Window â€” max sum subarray of size k\nint maxSumFixed(int[] arr, int k) {\n    int windowSum = 0, maxSum = 0;\n    for (int i = 0; i < k; i++) windowSum += arr[i];  // first window\n    maxSum = windowSum;\n    for (int i = k; i < arr.length; i++) {\n        windowSum += arr[i] - arr[i - k];  // slide: add right, remove left\n        maxSum = Math.max(maxSum, windowSum);\n    }\n    return maxSum;\n}\n// O(n) vs brute force O(n*k)\n\n// Variable Window â€” longest subarray with sum â‰¤ k\nint longestSubarray(int[] arr, int k) {\n    int left = 0, sum = 0, maxLen = 0;\n    for (int right = 0; right < arr.length; right++) {\n        sum += arr[right];\n        while (sum > k) sum -= arr[left++];  // shrink window\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}\n\n// Distinct Numbers in Each Subarray of size K\n// Maximum of All Subarrays of Size K â†’ use Deque (monotonic)"
},
    "Two Pointers": {
      "explanation": "Two Pointers uses two indices that move through data simultaneously, often from both ends or at different speeds. Reduces O(nÂ²) to O(n) for many array/string problems.",
      "details": [
        "Left & Right: start at opposite ends, move towards each other",
        "Fast & Slow: both start at same end, move at different speeds (Floyd's cycle detection)",
        "Sliding window is a special case of two pointers",
        "Applications: pair sum, palindrome check, remove duplicates, 3-sum"
],
      "example": "// Two Sum in sorted array â€” left & right pointers\nint[] twoSum(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left < right) {\n        int sum = arr[left] + arr[right];\n        if (sum == target) return new int[]{left, right};\n        if (sum < target) left++;\n        else right--;\n    }\n    return new int[]{-1, -1};\n}\n\n// Check palindrome\nboolean isPalindrome(String s) {\n    int l = 0, r = s.length() - 1;\n    while (l < r) {\n        if (s.charAt(l) != s.charAt(r)) return false;\n        l++; r--;\n    }\n    return true;\n}\n\n// Remove duplicates from sorted array (in-place)\nint removeDuplicates(int[] nums) {\n    int slow = 0;\n    for (int fast = 1; fast < nums.length; fast++)\n        if (nums[fast] != nums[slow]) nums[++slow] = nums[fast];\n    return slow + 1;\n}\n\n// Closest Pair from Two Sorted Arrays\n// Merge both conceptually, use two pointers"
},
    "Bit Manipulation": {
      "explanation": "Bit Manipulation operates directly on binary representations of integers. Extremely fast (single CPU instruction) and useful for space-efficient solutions.",
      "details": [
        "AND (&): both bits 1 â†’ 1; clears bits, checks if bit is set",
        "OR (|): either bit 1 â†’ 1; sets bits",
        "XOR (^): bits differ â†’ 1; a^a=0, a^0=a; finds unique element",
        "NOT (~): flips all bits",
        "Left shift (<<): multiply by 2; Right shift (>>): divide by 2",
        "Two's complement: negative numbers; -x = ~x + 1"
],
      "example": "// Common bit tricks\nint n = 13;   // binary: 1101\n\n// Check if bit i is set\nboolean isSet = (n & (1 << i)) != 0;\n\n// Set bit i\nn = n | (1 << i);\n\n// Clear bit i\nn = n & ~(1 << i);\n\n// Toggle bit i\nn = n ^ (1 << i);\n\n// XOR â€” find non-repeated element\nint[] arr = {2, 3, 4, 3, 2};\nint unique = 0;\nfor (int x : arr) unique ^= x;  // unique = 4\n\n// Swap without temp\na ^= b; b ^= a; a ^= b;\n\n// Check if n is a power of 2\nboolean isPow2 = (n & (n-1)) == 0;\n\n// Count set bits (Brian Kernighan's)\nint countBits(int n) {\n    int count = 0;\n    while (n > 0) { n &= (n-1); count++; }  // clears lowest set bit\n    return count;\n}\n\n// x & (-x) â†’ isolates lowest set bit (used in Fenwick Tree)"
},
    "Fenwick Tree": {
      "explanation": "A Fenwick Tree (Binary Indexed Tree / BIT) is a data structure for efficient prefix sum queries and point updates. O(log n) for both operations vs O(n) for naive array.",
      "details": [
        "Point update: add value to a specific index â€” O(log n)",
        "Prefix sum query: sum from index 1 to i â€” O(log n)",
        "Range sum: prefixSum(r) - prefixSum(l-1) â€” O(log n)",
        "Key trick: x & (-x) isolates the lowest set bit to navigate the tree",
        "Space: O(n) â€” stored as flat array"
],
      "example": "class FenwickTree {\n    int[] tree;\n    int n;\n\n    FenwickTree(int n) { this.n = n; tree = new int[n+1]; }\n\n    // Point update: add val at index i (1-indexed)\n    void update(int i, int val) {\n        for (; i <= n; i += i & (-i))  // move to parent\n            tree[i] += val;\n    }\n\n    // Prefix sum: sum of elements from 1 to i\n    int query(int i) {\n        int sum = 0;\n        for (; i > 0; i -= i & (-i))   // remove lowest set bit\n            sum += tree[i];\n        return sum;\n    }\n\n    // Range sum: l to r\n    int rangeQuery(int l, int r) { return query(r) - query(l-1); }\n}\n\n// i & (-i) examples:\n// 6 (110) & (-6)(010) = 010 = 2  â† step size\n// 4 (100) & (-4)(100) = 100 = 4\n\n// Build BIT from array in O(n log n):\nFenwickTree bit = new FenwickTree(n);\nfor (int i = 0; i < arr.length; i++) bit.update(i+1, arr[i]);"
},
    "Segment Tree": {
      "explanation": "A Segment Tree is a tree-based data structure for range queries (sum, min, max) and range/point updates. More powerful than Fenwick Tree â€” supports lazy propagation for range updates.",
      "details": [
        "Build: O(n); Query: O(log n); Update: O(log n)",
        "Each node stores aggregate of a range [l, r]",
        "Leaves store individual elements; internal nodes store combined values",
        "Lazy propagation: defer range updates for O(log n) range update",
        "Used for: range sum, range min/max, range GCD"
],
      "example": "class SegmentTree {\n    int[] tree;\n    int n;\n\n    SegmentTree(int[] arr) {\n        n = arr.length;\n        tree = new int[4 * n];\n        build(arr, 0, 0, n - 1);\n    }\n\n    void build(int[] arr, int node, int l, int r) {\n        if (l == r) { tree[node] = arr[l]; return; }\n        int mid = (l + r) / 2;\n        build(arr, 2*node+1, l, mid);\n        build(arr, 2*node+2, mid+1, r);\n        tree[node] = tree[2*node+1] + tree[2*node+2];  // range sum\n    }\n\n    // Point update: set arr[idx] = val\n    void update(int node, int l, int r, int idx, int val) {\n        if (l == r) { tree[node] = val; return; }\n        int mid = (l + r) / 2;\n        if (idx <= mid) update(2*node+1, l, mid, idx, val);\n        else            update(2*node+2, mid+1, r, idx, val);\n        tree[node] = tree[2*node+1] + tree[2*node+2];\n    }\n\n    // Range query: sum from ql to qr\n    int query(int node, int l, int r, int ql, int qr) {\n        if (qr < l || r < ql) return 0;           // out of range\n        if (ql <= l && r <= qr) return tree[node]; // fully in range\n        int mid = (l + r) / 2;\n        return query(2*node+1,l,mid,ql,qr) + query(2*node+2,mid+1,r,ql,qr);\n    }\n}"
},
    "Trie": {
      "explanation": "A Trie (Prefix Tree) is a tree-based data structure for storing strings. Each node represents a character. Enables O(L) insert, search, and prefix-match where L is the string length.",
      "details": [
        "Each node has up to 26 children (for lowercase English letters)",
        "isEndOfWord flag marks complete words",
        "Prefix search: follow characters â€” if path exists, prefix exists",
        "Applications: autocomplete, spell-check, IP routing, word games"
],
      "example": "class TrieNode {\n    TrieNode[] children = new TrieNode[26];\n    boolean isEnd = false;\n}\n\nclass Trie {\n    TrieNode root = new TrieNode();\n\n    void insert(String word) {\n        TrieNode node = root;\n        for (char c : word.toCharArray()) {\n            int idx = c - 'a';\n            if (node.children[idx] == null)\n                node.children[idx] = new TrieNode();\n            node = node.children[idx];\n        }\n        node.isEnd = true;\n    }\n\n    boolean search(String word) {\n        TrieNode node = root;\n        for (char c : word.toCharArray()) {\n            int idx = c - 'a';\n            if (node.children[idx] == null) return false;\n            node = node.children[idx];\n        }\n        return node.isEnd;\n    }\n\n    boolean startsWith(String prefix) {\n        TrieNode node = root;\n        for (char c : prefix.toCharArray()) {\n            int idx = c - 'a';\n            if (node.children[idx] == null) return false;\n            node = node.children[idx];\n        }\n        return true;  // prefix exists\n    }\n}\n\n// Top K Frequent Words: use Trie + DFS to collect words by frequency"
},
    "Graph Algorithms": {
      "explanation": "Advanced graph algorithms solve connectivity, flow, dependency, and ordering problems. Essential for competitive programming and system design.",
      "details": [
        "Topological Sort: linear ordering of DAG vertices â€” O(V+E)",
        "Connected Components: groups of mutually reachable vertices",
        "Bridges: edges whose removal disconnects the graph (Tarjan's)",
        "Articulation Points: vertices whose removal disconnects the graph",
        "LCA: Lowest Common Ancestor â€” uses binary lifting O(log n) per query"
],
      "example": "// Topological Sort (Kahn's Algorithm â€” BFS)\nint[] topologicalSort(int V, List<List<Integer>> adj) {\n    int[] inDegree = new int[V];\n    for (int u = 0; u < V; u++)\n        for (int v : adj.get(u)) inDegree[v]++;\n    Queue<Integer> q = new LinkedList<>();\n    for (int i = 0; i < V; i++) if (inDegree[i] == 0) q.offer(i);\n    int[] order = new int[V]; int idx = 0;\n    while (!q.isEmpty()) {\n        int u = q.poll(); order[idx++] = u;\n        for (int v : adj.get(u))\n            if (--inDegree[v] == 0) q.offer(v);\n    }\n    return order;\n}\n// Application: Course Schedule (detect cycle â†’ if idx < V, cycle exists)\n\n// Connected Components using DFS\nint countComponents(int V, List<List<Integer>> adj) {\n    boolean[] vis = new boolean[V]; int count = 0;\n    for (int i = 0; i < V; i++)\n        if (!vis[i]) { dfs(i, adj, vis); count++; }\n    return count;\n}\n\n// Bridges â€” Tarjan's Algorithm\n// An edge (u,v) is a bridge if low[v] > disc[u]\n// low[v] = min discovery time reachable from subtree of v"
},
    "DSU (Union Find)": {
      "explanation": "Disjoint Set Union (DSU / Union-Find) efficiently tracks a partition of elements into disjoint sets. Supports near-O(1) union and find operations with path compression and union by rank.",
      "details": [
        "Find: returns the root/representative of an element's set",
        "Union: merges two sets â€” connect their roots",
        "Path Compression: flatten tree during Find â€” near-O(1) amortised",
        "Union by Rank: always attach smaller tree under larger â€” O(log n) without compression",
        "Together: nearly O(Î±(n)) â‰ˆ O(1) amortised â€” essentially constant"
],
      "example": "class DSU {\n    int[] parent, rank;\n\n    DSU(int n) {\n        parent = new int[n]; rank = new int[n];\n        for (int i = 0; i < n; i++) parent[i] = i; // each is own root\n    }\n\n    // Find with Path Compression\n    int find(int x) {\n        if (parent[x] != x)\n            parent[x] = find(parent[x]);  // compress path\n        return parent[x];\n    }\n\n    // Union by Rank\n    boolean union(int x, int y) {\n        int px = find(x), py = find(y);\n        if (px == py) return false;  // already in same set (cycle!)\n        if (rank[px] < rank[py]) { int t=px; px=py; py=t; }\n        parent[py] = px;\n        if (rank[px] == rank[py]) rank[px]++;\n        return true;\n    }\n\n    boolean connected(int x, int y) { return find(x) == find(y); }\n}\n\n// Application: Number of Connected Components\nint countComponents(int n, int[][] edges) {\n    DSU dsu = new DSU(n);\n    int components = n;\n    for (int[] e : edges)\n        if (dsu.union(e[0], e[1])) components--;\n    return components;\n}\n\n// Application: Kruskal's MST\n// Sort edges by weight, add edge if it doesn't form a cycle (union returns true)"
}
}
},
  "Python": {
  "icon": "ti-brand-python",
  "color": "#3B6D11",
  "topics": {
    "Python OOP": {
      "explanation": "Python supports OOP with classes, inheritance, and polymorphism. It uses dynamic typing and special methods (dunder/magic methods) for operator overloading.",
      "details": [
        "__init__: constructor",
        "__str__: human-readable string representation",
        "__repr__: developer/debug representation",
        "super(): call parent class method",
        "Multiple inheritance supported"
],
      "example": "class Animal:\n    def __init__(self, name, age):\n        self.name = name\n        self.age  = age\n\n    def speak(self):\n        raise NotImplementedError  # abstract-like\n\n    def __str__(self):\n        return f\"{self.name} ({self.age} yrs)\"\n\nclass Dog(Animal):\n    def __init__(self, name, age, breed):\n        super().__init__(name, age)\n        self.breed = breed\n\n    def speak(self):\n        return f\"{self.name}: Woof!\"\n\n# Operator overloading\nclass Vector:\n    def __init__(self, x, y): self.x, self.y = x, y\n    def __add__(self, o): return Vector(self.x+o.x, self.y+o.y)\n    def __str__(self):    return f\"({self.x}, {self.y})\""
},
    "Dictionaries & Lists": {
      "explanation": "Python's core built-in data structures. Lists are ordered mutable sequences. Dictionaries are mutable key-value mappings (hash tables).",
      "details": [
        "List: [], append, extend, insert, remove, pop, slicing",
        "Dict: {}, get, update, keys, values, items",
        "List comprehension: [expr for x in iterable if cond]",
        "Dict comprehension: {k:v for k,v in pairs}"
],
      "example": "# List operations\nnums = [1, 2, 3, 4, 5]\nnums.append(6)         # [1,2,3,4,5,6]\nnums[::-1]             # [6,5,4,3,2,1] reverse\nsorted(nums)           # sorted copy\n\n# Dictionary operations\nstudent = {\"name\": \"Alice\", \"age\": 20}\nstudent[\"major\"] = \"CS\"             # add key\nstudent.get(\"phone\", \"N/A\")         # \"N/A\" if missing\ndel student[\"age\"]                  # remove key\n\n# List comprehension\nsquares = [x**2 for x in range(10)]\nevens   = [x for x in range(20) if x % 2 == 0]\n\n# Dict comprehension\nword_len = {w: len(w) for w in [\"apple\",\"banana\",\"fig\"]}\n# {'apple': 5, 'banana': 6, 'fig': 3}"
}
}
}
};

export default csNotesData;

