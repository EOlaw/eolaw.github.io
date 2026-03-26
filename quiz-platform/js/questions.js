/* quiz-platform/js/questions.js */
const QuestionBank = {

  CATEGORIES: {
    datascience:  { name: 'Data Science',    icon: '📊' },
    fullstack:    { name: 'Full-Stack Dev',   icon: '💻' },
    aiml:         { name: 'AI & ML',          icon: '🤖' },
    generaltech:  { name: 'General Tech',     icon: '⚡' }
  },

  data: {
    datascience: [
      {
        id: 'ds01',
        text: "Which Python library is primarily used for data manipulation and analysis?",
        options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
        correct: 1,
        explanation: "Pandas provides DataFrame and Series structures ideal for data manipulation."
      },
      {
        id: 'ds02',
        text: "What does EDA stand for in data science?",
        options: ["Extended Data Analysis", "Exploratory Data Analysis", "External Data Architecture", "Enhanced Data Algorithm"],
        correct: 1,
        explanation: "EDA (Exploratory Data Analysis) is the process of analyzing datasets to summarize their main characteristics."
      },
      {
        id: 'ds03',
        text: "Which measure is most resistant to outliers?",
        options: ["Mean", "Median", "Mode", "Range"],
        correct: 1,
        explanation: "The median is the middle value and is not affected by extreme outliers like the mean is."
      },
      {
        id: 'ds04',
        text: "What is the purpose of normalization in machine learning?",
        options: ["Increase dataset size", "Scale features to similar ranges", "Remove duplicate rows", "Split data into train/test"],
        correct: 1,
        explanation: "Normalization scales features to a similar range (often 0–1), preventing features with large values from dominating."
      },
      {
        id: 'ds05',
        text: "Which chart type is best for showing distribution of a single continuous variable?",
        options: ["Bar chart", "Scatter plot", "Histogram", "Pie chart"],
        correct: 2,
        explanation: "Histograms display the frequency distribution of a continuous variable across ranges (bins)."
      },
      {
        id: 'ds06',
        text: "What is the difference between supervised and unsupervised learning?",
        options: ["Speed of training", "Presence or absence of labeled training data", "Number of features", "Size of dataset"],
        correct: 1,
        explanation: "Supervised learning uses labeled data; unsupervised learning finds patterns in unlabeled data."
      },
      {
        id: 'ds07',
        text: "Which SQL clause is used to filter rows based on a condition?",
        options: ["GROUP BY", "ORDER BY", "WHERE", "HAVING"],
        correct: 2,
        explanation: "WHERE filters rows before any grouping; HAVING filters after GROUP BY is applied."
      },
      {
        id: 'ds08',
        text: "What does 'overfitting' mean in machine learning?",
        options: ["Model is too simple", "Model performs well on training but poorly on new data", "Model has too few parameters", "Dataset is too small"],
        correct: 1,
        explanation: "Overfitting occurs when a model memorizes training data so well it fails to generalize to new examples."
      },
      {
        id: 'ds09',
        text: "Which visualization tool is owned by Microsoft?",
        options: ["Tableau", "Looker", "Power BI", "Metabase"],
        correct: 2,
        explanation: "Power BI is Microsoft's business intelligence and data visualization tool, deeply integrated with Azure."
      },
      {
        id: 'ds10',
        text: "What is the Pearson correlation coefficient range?",
        options: ["-100 to 100", "0 to 1", "-1 to 1", "0 to 100"],
        correct: 2,
        explanation: "Pearson correlation ranges from -1 (perfect negative) to 1 (perfect positive), with 0 indicating no linear relationship."
      }
    ],

    fullstack: [
      {
        id: 'fs01',
        text: "What does REST stand for?",
        options: ["Remote Execution State Transfer", "Representational State Transfer", "Rapid Endpoint Service Technology", "Resource Encoded State Transport"],
        correct: 1,
        explanation: "REST (Representational State Transfer) is an architectural style for distributed hypermedia systems."
      },
      {
        id: 'fs02',
        text: "Which HTTP status code means 'Not Found'?",
        options: ["200", "301", "403", "404"],
        correct: 3,
        explanation: "404 is returned when the server cannot find the requested resource."
      },
      {
        id: 'fs03',
        text: "What is the primary purpose of a CDN?",
        options: ["Compress code", "Deliver content from servers close to users", "Manage database queries", "Encrypt data in transit"],
        correct: 1,
        explanation: "A CDN (Content Delivery Network) distributes content from geographically distributed servers to reduce latency."
      },
      {
        id: 'fs04',
        text: "Which of these is a NoSQL database?",
        options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite"],
        correct: 2,
        explanation: "MongoDB stores data as JSON-like documents, making it a popular NoSQL document database."
      },
      {
        id: 'fs05',
        text: "What does 'async/await' solve in JavaScript?",
        options: ["Memory leaks", "Callback hell and complex promise chains", "Variable hoisting", "Event bubbling"],
        correct: 1,
        explanation: "async/await is syntactic sugar over Promises that makes asynchronous code readable and easier to reason about."
      },
      {
        id: 'fs06',
        text: "What is JWT used for?",
        options: ["Database encryption", "Stateless authentication and authorization", "Image compression", "CSS animations"],
        correct: 1,
        explanation: "JWT (JSON Web Token) is a compact way to transmit authentication claims between parties."
      },
      {
        id: 'fs07',
        text: "Which React hook manages side effects?",
        options: ["useState", "useRef", "useEffect", "useContext"],
        correct: 2,
        explanation: "useEffect runs after render and handles side effects like data fetching, subscriptions, and DOM manipulation."
      },
      {
        id: 'fs08',
        text: "What does CI/CD stand for?",
        options: ["Code Integration/Code Delivery", "Continuous Integration/Continuous Deployment", "Computer Interface/Compiled Data", "Centralized Infrastructure/Cloud Distribution"],
        correct: 1,
        explanation: "CI/CD automates code integration, testing, and deployment to speed up and stabilize software delivery."
      },
      {
        id: 'fs09',
        text: "Which is NOT a valid HTTP method?",
        options: ["GET", "POST", "FETCH", "DELETE"],
        correct: 2,
        explanation: "FETCH is not an HTTP method — it's a JavaScript browser API. Standard HTTP methods include GET, POST, PUT, DELETE, PATCH."
      },
      {
        id: 'fs10',
        text: "What is Docker primarily used for?",
        options: ["Version control", "Containerizing applications for consistent environments", "Cloud storage", "Database management"],
        correct: 1,
        explanation: "Docker packages applications and their dependencies into containers that run consistently across any environment."
      }
    ],

    aiml: [
      {
        id: 'ai01',
        text: "What does LLM stand for?",
        options: ["Large Language Model", "Linear Learning Machine", "Layered Logic Module", "Long-term Learning Method"],
        correct: 0,
        explanation: "LLM (Large Language Model) refers to AI models like GPT that are trained on vast text datasets to understand and generate language."
      },
      {
        id: 'ai02',
        text: "What is RAG in the context of AI?",
        options: ["Random Assignment Generator", "Retrieval-Augmented Generation", "Recursive Algorithm Graph", "Real-time Analytics Gateway"],
        correct: 1,
        explanation: "RAG combines a retrieval system with an LLM, allowing the model to query external knowledge bases for more accurate answers."
      },
      {
        id: 'ai03',
        text: "Which activation function outputs values between 0 and 1?",
        options: ["ReLU", "Sigmoid", "Tanh", "Softmax"],
        correct: 1,
        explanation: "Sigmoid maps any input to a value between 0 and 1, making it useful for binary classification output layers."
      },
      {
        id: 'ai04',
        text: "What is the purpose of a training/test split?",
        options: ["Speed up computation", "Evaluate model on data it hasn't seen during training", "Balance class distribution", "Reduce overfitting via regularization"],
        correct: 1,
        explanation: "Splitting data ensures we evaluate how well the model generalizes to unseen data, not just training performance."
      },
      {
        id: 'ai05',
        text: "Which metric is most appropriate for imbalanced classification?",
        options: ["Accuracy", "F1 Score", "Mean Squared Error", "R-squared"],
        correct: 1,
        explanation: "F1 Score balances precision and recall, making it more meaningful than accuracy when classes are imbalanced."
      },
      {
        id: 'ai06',
        text: "What does 'prompt engineering' mean?",
        options: ["Designing fast algorithms", "Crafting inputs to guide LLM behavior", "Engineering the neural network architecture", "Writing code prompts in IDEs"],
        correct: 1,
        explanation: "Prompt engineering is the practice of designing and refining inputs to large language models to get desired outputs."
      },
      {
        id: 'ai07',
        text: "Which algorithm is used in gradient boosting?",
        options: ["Decision Trees", "k-Nearest Neighbors", "Support Vector Machines", "Naive Bayes"],
        correct: 0,
        explanation: "Gradient Boosting (XGBoost, LightGBM) sequentially trains weak decision trees, each correcting errors of the previous."
      },
      {
        id: 'ai08',
        text: "What is transfer learning?",
        options: ["Moving data between servers", "Reusing a pre-trained model on a new related task", "Transferring model weights to ONNX", "Training on multiple GPUs"],
        correct: 1,
        explanation: "Transfer learning applies knowledge from a model trained on one task to a different but related task, saving time and data."
      },
      {
        id: 'ai09',
        text: "What is a vector embedding?",
        options: ["A compressed image format", "A numerical representation of data in high-dimensional space", "A type of database index", "A GPU memory allocation"],
        correct: 1,
        explanation: "Vector embeddings represent semantic meaning as numerical vectors, enabling similarity comparisons in semantic search and RAG systems."
      },
      {
        id: 'ai10',
        text: "Which company created TensorFlow?",
        options: ["OpenAI", "Meta", "Google", "Microsoft"],
        correct: 2,
        explanation: "TensorFlow was developed by Google Brain and open-sourced in 2015. It remains one of the most widely used ML frameworks."
      }
    ],

    generaltech: [
      {
        id: 'gt01',
        text: "What does API stand for?",
        options: ["Application Processing Interface", "Automated Program Integration", "Application Programming Interface", "Advanced Protocol Implementation"],
        correct: 2,
        explanation: "API (Application Programming Interface) defines how software components communicate with each other."
      },
      {
        id: 'gt02',
        text: "What is Git used for?",
        options: ["Web hosting", "Version control and collaborative code management", "Database management", "Server monitoring"],
        correct: 1,
        explanation: "Git is a distributed version control system that tracks code changes and enables team collaboration."
      },
      {
        id: 'gt03',
        text: "What does 'latency' measure in networking?",
        options: ["Bandwidth capacity", "Amount of data transferred", "Time for data to travel from source to destination", "Number of active connections"],
        correct: 2,
        explanation: "Latency is the time delay between a request being sent and a response being received, measured in milliseconds."
      },
      {
        id: 'gt04',
        text: "Which cloud provider offers EC2 instances?",
        options: ["Google Cloud", "Microsoft Azure", "Amazon Web Services", "IBM Cloud"],
        correct: 2,
        explanation: "EC2 (Elastic Compute Cloud) is Amazon Web Services' virtual server offering."
      },
      {
        id: 'gt05',
        text: "What is the purpose of SSL/TLS?",
        options: ["Speed up page loads", "Encrypt data transmitted between client and server", "Compress images", "Cache web content"],
        correct: 1,
        explanation: "SSL/TLS (Secure Sockets Layer/Transport Layer Security) encrypts data in transit to prevent interception."
      },
      {
        id: 'gt06',
        text: "What does 'open source' mean?",
        options: ["Free software with no license", "Software whose source code is publicly available", "Software developed by government", "Cloud-hosted software"],
        correct: 1,
        explanation: "Open source software has publicly available source code that anyone can inspect, modify, and distribute."
      },
      {
        id: 'gt07',
        text: "What is a microservices architecture?",
        options: ["A very small web application", "An app built as a collection of small, independent services", "Serverless computing", "A type of database architecture"],
        correct: 1,
        explanation: "Microservices decomposes applications into small, independently deployable services that communicate over APIs."
      },
      {
        id: 'gt08',
        text: "Which data format is most commonly used in REST APIs?",
        options: ["XML", "CSV", "JSON", "YAML"],
        correct: 2,
        explanation: "JSON (JavaScript Object Notation) is lightweight, human-readable, and natively supported by JavaScript, making it the standard for REST APIs."
      },
      {
        id: 'gt09',
        text: "What does DevOps combine?",
        options: ["Design and operations", "Development and operations", "Data and operations", "Docker and operating systems"],
        correct: 1,
        explanation: "DevOps is a culture and practice combining software development (Dev) and IT operations (Ops) to shorten delivery cycles."
      },
      {
        id: 'gt10',
        text: "What is 'Big O notation' used for?",
        options: ["Database query optimization", "Describing algorithm time and space complexity", "Measuring network speed", "Formatting code output"],
        correct: 1,
        explanation: "Big O notation describes how algorithm performance scales with input size, helping developers choose efficient solutions."
      }
    ]
  },

  _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  get(category, count) {
    const all = this.data[category] || [];
    return this._shuffle(all).slice(0, count);
  },

  getAll(category) {
    return [...(this.data[category] || [])];
  }
};
