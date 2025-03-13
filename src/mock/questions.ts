import type { Question } from '@/types/questionnaires';

export const questions_answers: Question[] = [
  {
    id: 1,
    text: 'Does your organization have a comprehensive Business Continuity Plan?',
    answer: 'Yes',
    status: 'approved'
  },
  {
    id: 2,
    text: 'How does the product authorize User access? Admin access? [local application permissions...]',
    answer: 'The product authorizes user access through a roles-based access control matrix...',
    status: 'approved'
  },
  {
    id: 3,
    text: 'How are new users provisioned in the application? [via an LDAP integration...]',
    answer: '',
    status: 'unAnswered'
  },
  {
    id: 4,
    text: 'If yes to either of the above questions, how and when is the user or group access deprovisioned...',
    answer: 'User accounts are disabled or deleted from the application in a timely manner...',
    status: 'approved'
  },
  {
    id: 5,
    text: 'Do you have an incident management system for identifying, submitting and tracking cloud service incidents?',
    answer: 'Yes. This includes an intrusion detection system...',
    status: 'approved'
  },
  {
    id: 6,
    text: 'What testing processes are established and followed...',
    answer: 'SMT Data establishes rigorous testing processes...',
    status: 'approved'
  },
  {
    id: 7,
    text: 'How does your organization ensure that only application software verifiable as authorized...',
    answer: 'SMT Data ensures only authorized, tested...',
    status: 'approved'
  },
  {
    id: 8,
    text: 'Do change management procedures exist and are those procedures followed?',
    answer: 'Yes, change management procedures exist...',
    status: 'answered'
  },
  {
    id: 9,
    text: 'What is your strategy for engaging (or at least notifying) customers regarding upcoming functional updates?',
    answer: '',
    status: 'unAnswered'
  },
  {
    id: 10,
    text: 'Do you encrypt customer data in storage?',
    answer: 'Yes, customer data in storage is encrypted...',
    status: 'approved'
  },
  {
    id: 11,
    text: 'Do you encrypt customer data during transmission...',
    answer: 'Yes, SMT Data encrypts customer data...',
    status: 'approved'
  },
  {
    id: 12,
    text: 'Do you log electronic access to customer data?',
    answer: 'Yes, electronic access to customer data is logged...',
    status: 'approved'
  },
  {
    id: 13,
    text: 'Describe your system development lifecycle methodology...',
    answer: 'SMT Data follows a structured Software Development Lifecycle...',
    status: 'approved'
  },
  {
    id: 14,
    text: 'In the last 12 months, have you engaged an independent auditing firm...',
    answer: 'Yes, SMT Data engaged an independent auditing firm...',
    status: 'approved'
  },
  {
    id: 15,
    text: 'Does your organization conduct training and awareness activities...',
    answer: 'Yes, SMT Data conducts training...',
    status: 'answered'
  },
  {
    id: 16,
    text: 'Are specific crisis management roles and responsibilities defined...',
    answer: 'Yes, SMT Data defines and documents...',
    status: 'approved'
  },
  {
    id: 17,
    text: 'Is there a defined problem/issue escalation plan for impacted clients?',
    answer: 'Yes, SMT Data has a defined escalation process...',
    status: 'flagged'
  },
  {
    id: 18,
    text: 'Does your organization have a comprehensive Disaster Recovery Plan?',
    answer: 'Yes, the organization has a comprehensive...',
    status: 'approved'
  },
  {
    id: 19,
    text: 'Do procedures exist to ensure that retention and destruction of data...',
    answer: 'Yes, SMT Data has procedures...',
    status: 'readyToApprove'
  },
  {
    id: 20,
    text: 'Describe how load balancing and redundancy are utilized...',
    answer: 'SMT Data utilizes load balancing...',
    status: 'approved'
  },
  {
    id: 21,
    text: 'What are the procedures to recover systems...',
    answer: 'SMT Data performs data restoration checks...',
    status: 'approved'
  },
  {
    id: 22,
    text: 'How do you monitor and respond to alerts...',
    answer: 'SMT Data uses a suite of monitoring tools...',
    status: 'answered'
  },
  {
    id: 23,
    text: 'Do procedures exist to provide that emergency changes...',
    answer: 'Yes, SMT Data has procedures...',
    status: 'answered'
  },
  {
    id: 24,
    text: 'Which data centers will be used to serve our application?',
    answer: '',
    status: 'unAnswered'
  },
  {
    id: 25,
    text: 'What physical security measures are in the data center?',
    answer: 'The data centers employ robust physical security...',
    status: 'approved'
  },
  {
    id: 26,
    text: 'Is there redundant power? Batteries? Generators...',
    answer: "Yes, SMT Data's data centers...",
    status: 'approved'
  },
  {
    id: 27,
    text: 'Please describe your approach and/or practices related to application security...',
    answer: 'SMT Data employs a robust approach...',
    status: 'approved'
  },
  {
    id: 28,
    text: 'How do you monitor for and protect against common web application security vulnerabilities...',
    answer: 'SMT Data monitors and protects...',
    status: 'approved'
  },
  {
    id: 29,
    text: 'Scalability – how does the solution design and infrastructure support growth...',
    answer: "SMT Data's infrastructure, leveraging AWS...",
    status: 'readyToApprove'
  },
  {
    id: 30,
    text: 'What are the procedures to recover systems, applications, and data from operational failures? What is your method for testing recoverability component level versus full restore versus etc.)?',
    answer: 'SMT Data performs data restoration checks annually...',
    status: 'approved'
  }
];
