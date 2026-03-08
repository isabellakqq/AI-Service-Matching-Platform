import { ServiceProvider, ServiceRequest } from './types';

// In-memory data store (module-level singleton)
let providers: ServiceProvider[] = [
  {
    id: 'p1',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    category: 'Web Development',
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST API', 'GraphQL'],
    description:
      'Full-stack developer with 7 years of experience building scalable web applications. Specializes in React/Next.js frontends with Node.js backends. Expert in performance optimization and modern JavaScript ecosystems.',
    hourlyRate: 120,
    availability: 'immediate',
    rating: 4.9,
    completedProjects: 84,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'p2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    category: 'Data Science',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Data Analysis', 'SQL', 'Pandas'],
    description:
      'Data scientist specializing in machine learning and NLP. Has delivered predictive models for e-commerce, healthcare, and finance clients. Strong background in neural networks and large-scale data pipelines.',
    hourlyRate: 140,
    availability: 'within-week',
    rating: 4.8,
    completedProjects: 61,
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'p3',
    name: 'Marcus Chen',
    email: 'marcus@example.com',
    category: 'Design',
    skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Branding', 'Illustration'],
    description:
      'Senior UI/UX designer with a portfolio spanning SaaS products, mobile apps, and brand identities. Passionate about accessibility and data-driven design decisions. Creates intuitive experiences backed by user research.',
    hourlyRate: 95,
    availability: 'within-week',
    rating: 4.7,
    completedProjects: 112,
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'p4',
    name: 'Sofia Torres',
    email: 'sofia@example.com',
    category: 'Marketing',
    skills: ['SEO', 'Content Marketing', 'Google Ads', 'Social Media', 'Email Marketing', 'Analytics', 'Copywriting'],
    description:
      'Digital marketing strategist with proven track record in B2B and B2C growth campaigns. Expert in SEO, paid search, and content strategy. Has driven 300%+ organic traffic growth for multiple clients.',
    hourlyRate: 85,
    availability: 'immediate',
    rating: 4.6,
    completedProjects: 95,
    createdAt: '2024-02-01T08:30:00Z',
  },
  {
    id: 'p5',
    name: 'James Okafor',
    email: 'james@example.com',
    category: 'Mobile Development',
    skills: ['React Native', 'iOS', 'Swift', 'Android', 'Kotlin', 'Firebase', 'REST API', 'App Store'],
    description:
      'Mobile developer experienced in cross-platform and native iOS/Android apps. Shipped 20+ apps to the App Store and Google Play. Strong in performance, offline support, and push notification systems.',
    hourlyRate: 110,
    availability: 'within-week',
    rating: 4.8,
    completedProjects: 47,
    createdAt: '2024-02-05T11:00:00Z',
  },
  {
    id: 'p6',
    name: 'Elena Voronova',
    email: 'elena@example.com',
    category: 'DevOps',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux', 'Monitoring', 'GitHub Actions'],
    description:
      'DevOps engineer specializing in cloud infrastructure on AWS and GCP. Builds robust CI/CD pipelines and containerized microservice architectures. Reduced deployment time by 80% for multiple enterprise clients.',
    hourlyRate: 130,
    availability: 'immediate',
    rating: 4.9,
    completedProjects: 73,
    createdAt: '2024-02-10T09:30:00Z',
  },
  {
    id: 'p7',
    name: 'Noah Williams',
    email: 'noah@example.com',
    category: 'Content Writing',
    skills: ['Technical Writing', 'Blog Writing', 'Copywriting', 'SEO Writing', 'Editing', 'Research', 'Storytelling'],
    description:
      'Technical writer and content strategist with expertise in SaaS, fintech, and developer documentation. Produces clear, engaging content that converts. Experienced with style guides and content management systems.',
    hourlyRate: 65,
    availability: 'within-month',
    rating: 4.5,
    completedProjects: 138,
    createdAt: '2024-02-15T07:00:00Z',
  },
  {
    id: 'p8',
    name: 'Amara Diallo',
    email: 'amara@example.com',
    category: 'Cybersecurity',
    skills: ['Penetration Testing', 'Vulnerability Assessment', 'SIEM', 'Network Security', 'Compliance', 'OWASP', 'Incident Response'],
    description:
      'Certified cybersecurity professional (CISSP, CEH) with deep experience in penetration testing and compliance frameworks (SOC2, ISO 27001). Has protected fintech and healthcare companies from sophisticated threats.',
    hourlyRate: 150,
    availability: 'within-week',
    rating: 4.9,
    completedProjects: 52,
    createdAt: '2024-02-20T10:00:00Z',
  },
  {
    id: 'p9',
    name: 'Liam Anderson',
    email: 'liam@example.com',
    category: 'Web Development',
    skills: ['Vue.js', 'Nuxt.js', 'PHP', 'Laravel', 'MySQL', 'Docker', 'REST API', 'E-commerce'],
    description:
      'Backend-focused web developer with deep expertise in Laravel and PHP. Builds high-performance e-commerce platforms and custom CMS solutions. Comfortable with Vue.js for dynamic frontends.',
    hourlyRate: 100,
    availability: 'within-month',
    rating: 4.6,
    completedProjects: 67,
    createdAt: '2024-03-01T08:00:00Z',
  },
  {
    id: 'p10',
    name: 'Zoe Kim',
    email: 'zoe@example.com',
    category: 'Data Science',
    skills: ['Data Visualization', 'Tableau', 'Power BI', 'Python', 'R', 'Statistical Analysis', 'Dashboards', 'ETL'],
    description:
      'Data analyst and visualization expert helping businesses make sense of their data. Skilled in Tableau, Power BI, and custom Python dashboards. Turns complex datasets into clear executive-ready insights.',
    hourlyRate: 105,
    availability: 'immediate',
    rating: 4.7,
    completedProjects: 89,
    createdAt: '2024-03-05T09:00:00Z',
  },
];

let requests: ServiceRequest[] = [
  {
    id: 'r1',
    clientName: 'TechStart Inc.',
    email: 'founders@techstart.io',
    title: 'Build a React dashboard with real-time analytics',
    description:
      'We need an experienced React developer to build a data dashboard. The dashboard should display real-time analytics, integrate with our REST API, and be responsive. Must have experience with TypeScript and Next.js. We have designs ready in Figma.',
    category: 'Web Development',
    budget: 8000,
    timeline: 'within-week',
    requiredSkills: ['React', 'TypeScript', 'Next.js', 'REST API'],
    createdAt: '2024-03-10T10:00:00Z',
  },
  {
    id: 'r2',
    clientName: 'HealthAI Corp',
    email: 'cto@healthai.com',
    title: 'Machine learning model for patient outcome prediction',
    description:
      'Looking for a data scientist to build a machine learning model that predicts patient outcomes from historical medical data. Must be proficient in Python and TensorFlow or PyTorch. Experience with healthcare data and NLP is a strong plus.',
    category: 'Data Science',
    budget: 15000,
    timeline: 'within-month',
    requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'NLP'],
    createdAt: '2024-03-11T11:00:00Z',
  },
];

export function getProviders(): ServiceProvider[] {
  return [...providers];
}

export function getProviderById(id: string): ServiceProvider | undefined {
  return providers.find((p) => p.id === id);
}

export function addProvider(provider: ServiceProvider): ServiceProvider {
  providers.push(provider);
  return provider;
}

export function getRequests(): ServiceRequest[] {
  return [...requests];
}

export function getRequestById(id: string): ServiceRequest | undefined {
  return requests.find((r) => r.id === id);
}

export function addRequest(request: ServiceRequest): ServiceRequest {
  requests.push(request);
  return request;
}
