export interface Question {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface JSONPlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const categoryMap: { [key: number]: string } = {
  1: "Technology",
  2: "Science",
  3: "History",
  4: "Geography",
  5: "Literature",
  6: "Mathematics",
  7: "Philosophy",
  8: "Art",
  9: "Music",
  10: "Sports",
};

function transformPostToQuestion(post: JSONPlaceholderPost): Question {
  const category = categoryMap[post.userId] || "General";
  const topics = [
    'Artificial Intelligence', 'Machine Learning', 'Quantum Computing', 'Blockchain Technology',
    'Data Science', 'Cloud Computing', 'Cybersecurity', 'Neural Networks',
    'Natural Language Processing', 'Computer Vision', 'Robotics', 'Internet of Things',
    'Web Development', 'Mobile Development', 'Database Management', 'Software Engineering',
    'DevOps', 'Microservices', 'API Design', 'Version Control'
  ];
  
  const questionTemplates = [
    'What is {topic} and why is it important?',
    'How does {topic} work in modern applications?',
    'What are the key benefits of {topic}?',
    'Can you explain {topic} in simple terms?',
    'What are the best practices for {topic}?'
  ];
  
  const topicIndex = (post.id - 1) % topics.length;
  const templateIndex = Math.floor((post.id - 1) / topics.length) % questionTemplates.length;
  
  const topic = topics[topicIndex];
  const questionTemplate = questionTemplates[templateIndex];
  const question = questionTemplate.replace('{topic}', topic);
  
  // Generate meaningful English answers
  const answer = generateAnswer(topic, category);
  
  return {
    id: post.id,
    question,
    answer,
    category,
  };
}

// Generate contextual English answers
function generateAnswer(topic: string, category: string): string {
  const answers: { [key: string]: string } = {
    'Artificial Intelligence': 'Artificial Intelligence (AI) represents the simulation of human intelligence in machines programmed to think and learn. It encompasses machine learning, neural networks, and deep learning. AI systems can analyze vast amounts of data, recognize patterns, and make decisions with minimal human intervention. Applications range from virtual assistants to autonomous vehicles.',
    
    'Machine Learning': 'Machine Learning is a subset of AI that enables computers to learn from data without explicit programming. It uses algorithms to identify patterns and make predictions. There are three main types: supervised learning (with labeled data), unsupervised learning (finding hidden patterns), and reinforcement learning (learning through trial and error).',
    
    'Quantum Computing': 'Quantum Computing harnesses quantum mechanics principles to process information exponentially faster than classical computers. Using qubits instead of traditional bits, quantum computers can exist in multiple states simultaneously through superposition. This technology promises breakthroughs in cryptography, drug discovery, and complex optimization problems.',
    
    'Blockchain Technology': 'Blockchain is a distributed ledger technology that records transactions across multiple computers securely and transparently. Each block contains transaction data, a timestamp, and a cryptographic hash of the previous block. This creates an immutable chain that prevents tampering and ensures data integrity without central authority.',
    
    'Data Science': 'Data Science combines statistics, mathematics, programming, and domain expertise to extract insights from structured and unstructured data. It involves data collection, cleaning, analysis, and visualization. Data scientists use machine learning algorithms and statistical models to solve complex business problems and drive decision-making.',
    
    'Cloud Computing': 'Cloud Computing delivers computing services—including servers, storage, databases, networking, and software—over the internet. It offers scalability, flexibility, and cost-efficiency by eliminating the need for physical infrastructure. Major models include IaaS (Infrastructure), PaaS (Platform), and SaaS (Software) as a Service.',
    
    'Cybersecurity': 'Cybersecurity protects computer systems, networks, and data from digital attacks, unauthorized access, and damage. It encompasses multiple layers of protection including network security, application security, information security, and operational security. Key practices include encryption, firewalls, intrusion detection, and security awareness training.',
    
    'Neural Networks': 'Neural Networks are computing systems inspired by biological neural networks in animal brains. They consist of interconnected nodes (neurons) organized in layers that process information through weighted connections. Deep neural networks with multiple hidden layers enable complex pattern recognition in images, speech, and text.',
    
    'Natural Language Processing': 'Natural Language Processing (NLP) enables computers to understand, interpret, and generate human language. It combines computational linguistics with machine learning to process text and speech. Applications include chatbots, translation services, sentiment analysis, and voice assistants like Siri and Alexa.',
    
    'Computer Vision': 'Computer Vision enables machines to interpret and understand visual information from the world. Using deep learning and neural networks, systems can identify objects, faces, and scenes in images and videos. Applications include facial recognition, autonomous vehicles, medical image analysis, and augmented reality.',
    
    'Robotics': 'Robotics combines engineering, computer science, and AI to design, construct, and operate robots. Modern robots can perform complex tasks autonomously or semi-autonomously. Applications span manufacturing, healthcare, exploration, and service industries. Advanced robotics integrates sensors, actuators, and intelligent control systems.',
    
    'Internet of Things': 'Internet of Things (IoT) connects physical devices to the internet, enabling them to collect and exchange data. Smart devices with sensors and software can communicate and be controlled remotely. IoT applications include smart homes, wearable devices, industrial automation, and smart cities.',
    
    'Web Development': 'Web Development involves creating websites and web applications for the internet. It includes front-end development (user interface), back-end development (server-side logic), and full-stack development (both). Modern web development uses frameworks like React, Angular, Vue.js for front-end and Node.js, Django, Ruby on Rails for back-end.',
    
    'Mobile Development': 'Mobile Development focuses on creating applications for mobile devices like smartphones and tablets. Native development uses platform-specific languages (Swift for iOS, Kotlin for Android), while cross-platform frameworks like React Native and Flutter enable code reuse. Mobile apps must consider touch interfaces, battery life, and varying screen sizes.',
    
    'Database Management': 'Database Management involves storing, organizing, and retrieving data efficiently. Relational databases (SQL) use structured tables with relationships, while NoSQL databases offer flexible schemas for unstructured data. Key concepts include ACID properties, indexing, normalization, and query optimization for performance.',
    
    'Software Engineering': 'Software Engineering applies engineering principles to software development, ensuring reliable, efficient, and maintainable systems. It encompasses requirements analysis, design, implementation, testing, and maintenance. Methodologies include Agile, Scrum, and DevOps. Best practices include version control, code reviews, and continuous integration.',
    
    'DevOps': 'DevOps combines software development (Dev) and IT operations (Ops) to shorten the development lifecycle and deliver high-quality software continuously. It emphasizes automation, collaboration, and monitoring. Key practices include continuous integration/continuous deployment (CI/CD), infrastructure as code, and containerization with Docker and Kubernetes.',
    
    'Microservices': 'Microservices architecture structures applications as collections of loosely coupled, independently deployable services. Each service focuses on a specific business capability and communicates via APIs. This approach enables scalability, flexibility, and faster deployment compared to monolithic architectures.',
    
    'API Design': 'API (Application Programming Interface) Design involves creating interfaces that allow different software systems to communicate. RESTful APIs use HTTP methods and follow stateless principles. Good API design emphasizes consistency, clear documentation, versioning, and security. GraphQL offers an alternative with flexible query capabilities.',
    
    'Version Control': 'Version Control systems track changes to code over time, enabling collaboration and maintaining project history. Git is the most popular distributed version control system. It allows multiple developers to work simultaneously, create branches for features, merge changes, and revert to previous versions when needed.'
  };
  
  return answers[topic] || `${topic} is a crucial concept in ${category} that plays a vital role in modern technology. It involves systematic approaches, best practices, and continuous innovation. Understanding ${topic} helps professionals build better solutions and stay competitive in the rapidly evolving tech landscape.`;
}

let cachedQuestions: Question[] | null = null;

export async function fetchQuestionsFromAPI(): Promise<Question[]> {
  if (cachedQuestions) {
    return cachedQuestions;
  }

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts: JSONPlaceholderPost[] = await response.json();
    cachedQuestions = posts.map(transformPostToQuestion);
    return cachedQuestions;
  } catch (error) {
    console.error('Failed to fetch from JSONPlaceholder:', error);
    return [];
  }
}

export const allQuestions = generateFallbackQuestions();

function generateFallbackQuestions(): Question[] {
  const questions: Question[] = [];
  const categories = Object.values(categoryMap);
  
  const templates = [
    { q: "What is {topic}?", a: "{topic} is a fundamental concept that involves detailed exploration and understanding." },
    { q: "How does {topic} work?", a: "{topic} works through systematic processes and methodologies that have been refined over time." },
    { q: "Why is {topic} important?", a: "{topic} is important because it plays a crucial role in advancing our knowledge and capabilities." },
  ];
  
  const topics = [
    "Artificial Intelligence", "Machine Learning", "Quantum Computing", "Blockchain",
    "Data Science", "Cloud Computing", "Cybersecurity", "Neural Networks",
    "Natural Language Processing", "Computer Vision", "Robotics", "IoT" ,"Web Development", "Mobile Development", "Database Management", "Software Engineering", "DevOps", "Cloud Computing", "Cybersecurity", "Neural Networks",
  ];
  
  let id = 1;
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    const category = categories[i % categories.length];
    
    for (const template of templates) {
      questions.push({
        id: id++,
        question: template.q.replace("{topic}", topic),
        answer: template.a.replace(/{topic}/g, topic),
        category,
      });
    }
  }
  
  return questions;
}

export function searchQuestions(query: string): Question[] {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return allQuestions.filter(
    (q) =>
      q.question.toLowerCase().includes(lowerQuery) ||
      q.category.toLowerCase().includes(lowerQuery)
  ).slice(0, 10);
}

export function getQuestionById(id: number): Question | undefined {
  return allQuestions.find((q) => q.id === id);
}
