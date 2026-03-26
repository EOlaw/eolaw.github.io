const ResponseEngine = {
  library: {
    data_analysis: {
      keywords: ['data analysis', 'analyze data', 'sales data', 'csv', 'excel', 'spreadsheet', 'analytics', 'dataset', 'kpi', 'metrics'],
      response: `**Sales & Data Analysis Framework**\n\nEffective data analysis starts with defining the right questions before touching a single row. For most business contexts, focus on these layers:\n\n• **Descriptive** — what happened? (revenue trends, volume, churn)\n• **Diagnostic** — why did it happen? (cohort analysis, funnel breakdowns)\n• **Predictive** — what will happen? (forecasting with \`statsmodels\` or Prophet)\n\nFor a clean Python pipeline: load with \`pandas\`, validate with \`great_expectations\`, visualize with \`plotly\` or \`seaborn\`. Export executive summaries as PDF via \`reportlab\` or push to a live Power BI / Looker dashboard.\n\nThe most overlooked step is data quality — garbage in, garbage out. Always profile your data with \`df.describe()\` and \`df.isnull().sum()\` before any analysis.`,
      followups: ['How do I clean messy data in pandas?', 'What KPIs should I track for my business?', 'Can you show me a Python analysis template?']
    },

    python: {
      keywords: ['python', 'pandas', 'numpy', 'django', 'flask', 'fastapi', 'pip', 'virtualenv', 'jupyter'],
      response: `**Python Best Practices for Production Code**\n\nAfter years of data science and backend work, here are the habits that separate good Python from great Python:\n\n• Always use type hints: \`def process(df: pd.DataFrame) -> dict:\`\n• Structure projects with \`pyproject.toml\` and manage deps with \`poetry\`\n• Use \`pydantic\` for data validation — it catches bugs before runtime\n• Format with \`black\`, lint with \`ruff\` (faster than flake8)\n• Write tests with \`pytest\` — aim for 80%+ coverage on business logic\n\nFor data work: vectorize with NumPy instead of Python loops — a 100x speedup is common. Use \`df.apply()\` sparingly; prefer native pandas methods. Profile bottlenecks with \`cProfile\` before optimizing.`,
      followups: ['What is the best project structure for a Python API?', 'How do I use pandas groupby effectively?', 'Can you explain async Python with FastAPI?']
    },

    sql: {
      keywords: ['sql', 'database', 'query', 'postgres', 'mysql', 'sqlite', 'joins', 'aggregate', 'bigquery', 'snowflake'],
      response: `**SQL for Data Professionals**\n\nSQL is still the most valuable skill in data. Here are the patterns I use constantly:\n\n• **Window functions** are game-changers: \`ROW_NUMBER()\`, \`LAG()\`, \`LEAD()\`, and \`SUM() OVER()\` replace dozens of self-joins\n• Use CTEs (\`WITH\` clauses) to break complex queries into readable steps\n• Index your WHERE and JOIN columns — missing indexes cause 99% of slow queries\n• \`EXPLAIN ANALYZE\` in Postgres shows exactly where time is spent\n\nFor analytical workloads: BigQuery and Snowflake use columnar storage — filter columns in SELECT, not just rows in WHERE. Partition large tables by date. Avoid \`SELECT *\` in production — specify columns explicitly for both performance and documentation.`,
      followups: ['How do window functions work with an example?', 'What is the difference between INNER and LEFT JOIN?', 'How do I optimize a slow SQL query?']
    },

    machine_learning: {
      keywords: ['machine learning', 'model', 'train', 'classification', 'regression', 'scikit', 'sklearn', 'random forest', 'xgboost', 'neural network'],
      response: `**ML Workflow — Production-Ready Approach**\n\nHere is the full lifecycle I follow for every ML project:\n\n• **Problem framing first** — define success metrics (accuracy? recall? ROI?) before touching data\n• **Baseline model always** — start with logistic regression or a decision tree, then beat it\n• **Feature engineering wins** — domain knowledge encoded as features beats model complexity\n• **Validation strategy matters** — time-series data needs temporal splits, not random splits\n• **XGBoost / LightGBM** dominate tabular data; transformers dominate text and vision\n\nFor deployment: wrap your model in a \`FastAPI\` endpoint, containerize with \`Docker\`, monitor for data drift with \`Evidently AI\`. A model that degrades silently in production is worse than no model.`,
      followups: ['How do I handle imbalanced classes in ML?', 'What is feature engineering and why does it matter?', 'How do I deploy a model with FastAPI and Docker?']
    },

    rag: {
      keywords: ['rag', 'retrieval', 'vector', 'embedding', 'langchain', 'llama index', 'chromadb', 'pinecone', 'faiss', 'semantic search'],
      response: `**Building RAG Systems for Production**\n\nRetrieval-Augmented Generation (RAG) is the most practical way to add domain knowledge to LLMs without fine-tuning. The core pipeline:\n\n• **Ingest** — chunk documents (512–1024 tokens with overlap), embed with \`text-embedding-3-small\` or a local model\n• **Store** — use \`pgvector\` for Postgres setups, \`Pinecone\` for cloud scale, or \`Chroma\` for local dev\n• **Retrieve** — hybrid search (dense + BM25 sparse) beats pure vector search for most domains\n• **Generate** — pass top-k retrieved chunks as context; instruct the LLM to cite sources\n\nCommon failure modes: chunks too large (dilutes signal), no reranking step (irrelevant chunks pass through), missing metadata filters (retrieves from wrong document sets). Use \`LangChain\` or \`LlamaIndex\` to accelerate the plumbing.`,
      followups: ['What chunk size should I use for RAG?', 'How does hybrid search improve retrieval quality?', 'What is a reranker and when do I need one?']
    },

    llm: {
      keywords: ['llm', 'gpt', 'claude', 'openai', 'prompt', 'fine-tune', 'transformers', 'huggingface', 'chatgpt', 'gemini'],
      response: `**Working with Large Language Models**\n\nLLMs are powerful but require deliberate design to use well. Key principles:\n\n• **Prompt engineering** is underrated — clear system prompts with role, context, and output format dramatically improve results\n• **Temperature 0** for factual/deterministic tasks; **0.7–1.0** for creative tasks\n• Fine-tuning is rarely the first move — try RAG, few-shot examples, and better prompts first\n• **Function calling / tool use** is the unlock for agentic workflows — let the LLM decide which tool to invoke\n• Cost control: cache repeated queries, use smaller models (\`gpt-4o-mini\`) for classification tasks\n\nFor open-source: \`Llama 3\`, \`Mistral\`, and \`Qwen\` are excellent. Run locally with \`Ollama\` for dev, \`vLLM\` for production throughput.`,
      followups: ['How do I write better system prompts?', 'When should I fine-tune vs use RAG?', 'How do I build an LLM agent with tool use?']
    },

    react: {
      keywords: ['react', 'nextjs', 'hooks', 'useState', 'useEffect', 'component', 'jsx', 'typescript', 'vite', 'tailwind'],
      response: `**React & Next.js Best Practices**\n\nModern React development has evolved significantly. What works in production:\n\n• **Server Components** (Next.js 13+) eliminate unnecessary client JavaScript — use them by default, opt into \`"use client"\` only when needed\n• Manage state with \`useState\` + \`useReducer\` locally; use \`Zustand\` or \`Jotai\` for global state (lighter than Redux)\n• Data fetching: \`React Query\` (TanStack Query) handles caching, refetching, and loading states better than custom hooks\n• Style with \`Tailwind CSS\` for speed; \`shadcn/ui\` for accessible component primitives\n• Performance: \`React.memo\`, \`useMemo\`, and \`useCallback\` only when profiling confirms a real bottleneck\n\nKey: co-locate state close to where it is used. Lifting state too high causes unnecessary re-renders.`,
      followups: ['When should I use Server Components vs Client Components?', 'How does React Query improve data fetching?', 'What is the best folder structure for a Next.js app?']
    },

    nodejs: {
      keywords: ['node', 'nodejs', 'express', 'fastapi', 'api', 'rest', 'backend', 'server', 'middleware', 'authentication'],
      response: `**Node.js & Backend API Design**\n\nBuilding reliable APIs requires attention to the layers most tutorials skip:\n\n• **Input validation** at the boundary — use \`zod\` or \`joi\` before business logic ever runs\n• **Error handling middleware** — one centralized error handler prevents inconsistent responses\n• Authentication: JWT for stateless APIs; sessions + Redis for stateful apps\n• Rate limiting with \`express-rate-limit\` and API keys for public endpoints\n• Use \`Prisma\` for type-safe database access — the ORM that actually improves productivity\n\nFor performance: \`Node.js\` is excellent for I/O-bound work (APIs, proxies) but not CPU-bound tasks. Offload heavy computation to worker threads or a Python service. Monitor with \`pino\` for structured logging and Prometheus for metrics.`,
      followups: ['How do I structure a Node.js API project?', 'What is the best way to handle JWT authentication?', 'How do I add rate limiting to my API?']
    },

    nextjs: {
      keywords: ['next.js', 'nextjs', 'next js', 'app router', 'pages router', 'server action', 'vercel', 'static generation'],
      response: `**Next.js App Router — Production Guide**\n\nNext.js App Router changed everything about full-stack React. Core concepts:\n\n• **\`layout.tsx\`** persists across route changes — ideal for sidebar, nav, and auth wrappers\n• **Server Actions** (\`"use server"\`) replace API routes for form submissions and mutations\n• \`loading.tsx\` and \`error.tsx\` files handle suspense and error boundaries automatically\n• Use \`generateStaticParams\` for static generation of dynamic routes at build time\n• Environment variables: \`NEXT_PUBLIC_\` prefix for client-side, plain for server-only\n\nDeployment: Vercel is the zero-config choice; for self-hosted use Docker with \`next build && next start\`. Edge runtime reduces cold starts for auth and geolocation logic.`,
      followups: ['How do Server Actions work in Next.js?', 'What is the difference between SSR and SSG in Next.js?', 'How do I handle authentication in Next.js App Router?']
    },

    career: {
      keywords: ['career', 'job', 'interview', 'resume', 'transition', 'hire', 'salary', 'promotion', 'skills', 'portfolio'],
      response: `**Career Strategy — A Framework That Actually Works**\n\nAfter working with many professionals navigating tech careers, here is what separates those who break through from those who stall:\n\n• **Build in public** — GitHub commits, blog posts, LinkedIn articles. Hiring managers find you instead of you chasing them\n• **Portfolio over credentials** — 3 strong projects beat 10 certifications. One real project shipped beats 5 tutorials\n• **Network with specificity** — connect with engineers at target companies, not just recruiters\n• **Negotiate always** — the first offer is rarely the best. Research Levels.fyi and Glassdoor; counter with data\n• **Specialize to generalize** — become known for one thing first (data engineering, ML ops, frontend), then expand\n\nThe fastest path: solve a real problem publicly, document it well, and share the results.`,
      followups: ['How do I build a strong tech portfolio?', 'What should I put on my resume as a career changer?', 'How do I negotiate a salary offer?']
    },

    coaching: {
      keywords: ['coach', 'motivation', 'goal', 'mindset', 'transform', 'discipline', 'habit', 'purpose', 'success', 'growth'],
      response: `**Life Coaching — The Principle That Changes Everything**\n\nThe most consistent observation from coaching: *the gap between where you are and where you want to be is almost never a knowledge gap — it is an action gap.*\n\nThe three blockers I see most:\n\n• **Fear of judgment** — you delay starting because you are worried about what others think\n• **Perfectionism paralysis** — waiting for the right time, the right resources, the perfect conditions\n• **Clarity confusion** — not acting because you are not 100% sure of the destination\n\nThe one question that breaks through all three: *What is the smallest possible action I could take TODAY that moves me 1% toward my goal?*\n\nConsistency compounds. A 1% improvement every day is a 37x improvement over a year. You do not need a breakthrough — you need a decision followed by a daily practice.`,
      followups: ['How do I build better daily habits?', 'How do I overcome fear of failure?', 'What is the best way to set and track goals?']
    },

    bible: {
      keywords: ['bible', 'scripture', 'faith', 'god', 'pray', 'prayer', 'wisdom', 'christian', 'jesus', 'verse', 'spiritual'],
      response: `**Biblical Wisdom for the Journey**\n\n*"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."* — Jeremiah 29:11\n\nThis passage carries particular weight for anyone navigating uncertainty in career or business. It teaches:\n\n• **Purpose is intentional** — your gifts and skills are not accidental; they are assignments\n• **Setbacks are redirections** — what looks like a closed door is often a course correction toward better alignment\n• **Faith and work cooperate** — trust the process while doing the work faithfully\n\n*"Commit to the LORD whatever you do, and he will establish your plans."* — Proverbs 16:3\n\nThe most practical application: bring your plans before God in prayer, then act with full effort. The combination of spiritual surrender and diligent work is the formula found throughout Proverbs.`,
      followups: ['What does the Bible say about work and purpose?', 'Are there scriptures about overcoming fear?', 'What is biblical wisdom on financial stewardship?']
    },

    finance: {
      keywords: ['finance', 'financial', 'invest', 'stock', 'portfolio', '401k', 'retirement', 'roth', 'index fund', 'wealth'],
      response: `**Investment & Wealth Building Strategy**\n\nThe foundation of wealth building is simpler than the financial industry wants you to believe:\n\n• **Order of operations**: 401k match (free money) → HSA → Roth IRA → taxable brokerage\n• **Index funds win**: \`VOO\` (S&P 500) or \`VTI\` (total market) beat 90%+ of active managers over 20 years\n• **Time beats timing**: $500/month for 30 years at 8% average return = $680,000+. Start before you feel ready\n• **Tax-advantaged accounts first**: Roth IRA grows tax-free; max it out ($7,000/year in 2024)\n• **Emergency fund before investing**: 3–6 months of expenses in a high-yield savings account (4–5% APY currently available)\n\nThe wealth gap is largely an information gap. Most people are one financial education away from a completely different trajectory.`,
      followups: ['What is the difference between Roth and Traditional IRA?', 'How do I start investing with limited income?', 'What percentage of income should I save?']
    },

    budget: {
      keywords: ['budget', 'budgeting', 'money', 'debt', 'saving', 'expense', 'income', 'spending', 'frugal', 'cash flow'],
      response: `**Budget Planning — The Framework That Builds Wealth**\n\nBudgeting is not about restriction — it is about intention. The system that works for most people:\n\n• **50/30/20 Rule**: 50% needs, 30% wants, 20% wealth building (savings + debt payoff + investing)\n• **Pay yourself first**: automate the 20% on payday before you can spend it\n• **Debt payoff**: Avalanche method (highest interest first) saves the most money; Snowball (smallest balance first) builds momentum\n• **Track for 30 days**: most people underestimate spending by 20–30%. Use \`Copilot\` or \`YNAB\` for automatic categorization\n• **Subscriptions audit**: the average household has $200+/month in forgotten subscriptions\n\nThe most powerful budget habit: a weekly 10-minute money review. Review last week's spending, plan next week's. Awareness alone reduces unnecessary spending by 15–20%.`,
      followups: ['How do I pay off debt while also saving?', 'What budgeting apps do you recommend?', 'How do I create an emergency fund from scratch?']
    },

    dashboard: {
      keywords: ['dashboard', 'chart', 'visualization', 'power bi', 'tableau', 'looker', 'grafana', 'chart.js', 'report', 'd3'],
      response: `**Dashboard Design & Data Visualization**\n\nA great dashboard answers a specific question in under 5 seconds. Design principles:\n\n• **One dashboard, one audience** — an executive dashboard and an ops dashboard are different products\n• **Hierarchy of attention**: title → key metric → trend → detail. Guide the eye deliberately\n• **Chart type matters**: line for trends over time, bar for comparisons, scatter for correlations, avoid pie charts beyond 3 slices\n• **Color intentionally**: use one accent color for attention, grey for context, red only for alerts\n• **Refresh strategy**: real-time for ops, daily for business, weekly for strategy\n\nFor implementation: \`Chart.js\` for custom web apps, \`Recharts\` in React, \`Power BI\` for enterprise, \`Metabase\` for team self-serve analytics. Always include data freshness timestamp and a "last updated" indicator.`,
      followups: ['What chart type should I use for my data?', 'How do I build a real-time dashboard with Chart.js?', 'What makes a good executive dashboard?']
    },

    api: {
      keywords: ['api', 'rest', 'graphql', 'webhook', 'endpoint', 'swagger', 'openapi', 'http', 'json', 'integration'],
      response: `**API Design Best Practices**\n\nWell-designed APIs are a product. These principles make them a joy to use:\n\n• **RESTful conventions**: \`GET /users\`, \`POST /users\`, \`PATCH /users/:id\`, \`DELETE /users/:id\` — be predictable\n• **Consistent error responses**: always return \`{error: {code, message, details}}\` — never raw stack traces\n• **Versioning from day one**: \`/api/v1/...\` saves painful migrations later\n• **Pagination on all list endpoints**: \`?page=1&limit=20\` or cursor-based for large datasets\n• **Document with OpenAPI**: auto-generate Swagger UI so consumers can test without writing code\n\nAuthentication: use OAuth 2.0 + JWT for user-facing APIs; API keys with HMAC signing for service-to-service. Rate limit everything. Log request/response pairs (redacting sensitive fields) for debugging.`,
      followups: ['What is the difference between REST and GraphQL?', 'How do I document my API with OpenAPI/Swagger?', 'How should I version my API?']
    },

    docker: {
      keywords: ['docker', 'container', 'kubernetes', 'k8s', 'dockerfile', 'compose', 'deploy', 'devops', 'ci cd', 'github actions'],
      response: `**Docker & Container Deployment**\n\nContainers solve the "works on my machine" problem permanently. Essentials for production:\n\n• **Multi-stage builds** keep images small: build stage installs deps, production stage copies only artifacts\n• **Non-root user** in production images: \`USER node\` or \`USER appuser\` — never run as root\n• **Health checks** in Dockerfile: \`HEALTHCHECK CMD curl -f http://localhost:3000/health\`\n• **\`.dockerignore\`** is mandatory: exclude \`node_modules\`, \`.git\`, \`.env\` files\n• **Docker Compose** for local development multi-service setups (app + db + cache)\n\nFor Kubernetes: \`Helm charts\` for templating, \`Kustomize\` for environment overlays. Start simple — a single Deployment + Service + HorizontalPodAutoscaler covers most production use cases.`,
      followups: ['How do I write an optimized Dockerfile for Node.js?', 'What is Docker Compose and when should I use it?', 'How do I set up GitHub Actions for CI/CD?']
    },

    cloud: {
      keywords: ['aws', 'gcp', 'azure', 'cloud', 'lambda', 'serverless', 's3', 'ec2', 'vertex', 'sagemaker'],
      response: `**Cloud Architecture for Modern Applications**\n\nCloud platforms are powerful but expensive when misused. Guiding principles:\n\n• **Start serverless for variable workloads**: AWS Lambda / GCP Cloud Run scale to zero and cost nothing at rest\n• **S3 / GCS for everything static**: files, model artifacts, backups — cheap, durable, and CDN-friendly\n• **Managed databases over self-hosted**: RDS, Cloud SQL, Supabase — let the cloud handle backups and patches\n• **IAM roles, not credentials**: never hardcode AWS keys; use instance roles and Workload Identity\n• **Cost visibility from day one**: set billing alerts, use Cost Explorer, tag all resources by project and environment\n\nFor ML specifically: AWS SageMaker or GCP Vertex AI handle training, versioning, and deployment in one platform. Start there rather than building custom infrastructure.`,
      followups: ['Should I use AWS, GCP, or Azure for my project?', 'How do I reduce my cloud bill?', 'What is serverless and when is it the right choice?']
    },

    architecture: {
      keywords: ['architecture', 'microservices', 'monolith', 'system design', 'scalable', 'distributed', 'event driven', 'kafka', 'redis', 'caching'],
      response: `**Software Architecture — Pragmatic Principles**\n\nSystem design is about making the right tradeoffs for your context. What I have learned:\n\n• **Start with a monolith** — microservices solve scaling and team problems that most early-stage products do not have yet\n• **CQRS** (Command Query Responsibility Segregation) cleanly separates read and write workloads as scale demands it\n• **Event-driven architecture** with Kafka or SQS decouples services and enables audit trails — but adds operational complexity\n• **Cache at the right layer**: CDN for static assets, Redis for session/rate-limit data, database query cache for expensive aggregations\n• **Design for failure**: circuit breakers (\`Resilience4j\`, \`opossum\`), retries with exponential backoff, dead-letter queues\n\nThe hardest architectural decision is not the initial design — it is knowing when to break apart a component that has outgrown its current shape.`,
      followups: ['When should I migrate from monolith to microservices?', 'How does Redis improve application performance?', 'What is event-driven architecture and when is it useful?']
    },

    general: {
      keywords: ['help', 'question', 'advice', 'learn', 'how to', 'what is', 'explain', 'tell me', 'can you', 'assist'],
      response: `**Welcome — How Can I Help?**\n\nI am the InsightSerenity AI Assistant, powered by expertise across data science, software engineering, AI/ML, life coaching, and faith-based guidance.\n\nHere are the areas I can help you with most:\n\n• **Technical** — Python, SQL, Machine Learning, React, Node.js, APIs, Docker, Cloud\n• **Data & AI** — Data analysis, RAG systems, LLMs, dashboards, visualization\n• **Career** — Job strategy, portfolio building, interviews, salary negotiation\n• **Finance** — Budgeting, investing, debt payoff, wealth building\n• **Coaching & Faith** — Goal setting, mindset, biblical wisdom, purpose\n\nThe more specific your question, the more targeted my response. What are you working on?`,
      followups: ['How do I get started with data science?', 'Can you help me plan my career transition?', 'What financial habits should I build this year?']
    }
  },

  getResponse(message) {
    const lower = message.toLowerCase();

    // Check in order of specificity
    const order = [
      'rag', 'llm', 'sql', 'machine_learning', 'python', 'react', 'nextjs',
      'nodejs', 'docker', 'cloud', 'architecture', 'api', 'dashboard',
      'data_analysis', 'bible', 'coaching', 'career', 'budget', 'finance', 'general'
    ];

    for (const key of order) {
      const entry = this.library[key];
      if (!entry) continue;
      const matched = entry.keywords.some(kw => lower.includes(kw));
      if (matched) {
        return {
          response: entry.response,
          followups: entry.followups
        };
      }
    }

    // Default
    return {
      response: `That is a great question! I am happy to explore this with you.\n\nCould you give me a bit more context about what you are trying to achieve? The more specific you are, the more targeted my advice will be.\n\nFor example, are you looking for:\n\n• **Technical guidance** (code, data, AI/ML)\n• **Career or business strategy**\n• **Personal development or coaching**\n• **Financial literacy or budgeting**`,
      followups: ['Tell me about data analysis and Python', 'I need career advice for a tech transition', 'Help me with budgeting and saving money']
    };
  },

  formatText(text) {
    // Bold: **text**
    let html = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Inline code: `code`
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bullet points: lines starting with •
    // Group consecutive bullet lines into <ul>
    const lines = html.split('\n');
    const result = [];
    let inList = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('•')) {
        if (!inList) { result.push('<ul>'); inList = true; }
        result.push('<li>' + trimmed.slice(1).trim() + '</li>');
      } else {
        if (inList) { result.push('</ul>'); inList = false; }
        result.push(line);
      }
    }
    if (inList) result.push('</ul>');

    // Paragraph breaks: \n\n
    return result.join('\n').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
  },

  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 17) return 'Good afternoon!';
    if (hour < 21) return 'Good evening!';
    return 'Hello!';
  }
};
