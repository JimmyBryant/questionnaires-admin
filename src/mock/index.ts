// src/mock/index.ts
import Mock from 'mockjs';
import type { Question, QuestionStatus, Questionnaire } from '@/types/questionnaires';

interface XHRResponse {
  url: string;
  type: string;
  body: string | null;
}

// 问题状态权重配置
const STATUS_WEIGHTS = {
  approved: 2,
  readyToApprove: 3,
  flagged: 1,
  answered: 4,
  unAnswered: 3
};

const weightedPick = (items: { value: string; weight: number }[]): QuestionStatus => {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    if (random < item.weight) return item.value;
    random -= item.weight;
  }
  return items[items.length - 1].value;
};

const generateAnswer = (status: QuestionStatus) => {
  const answerStrategies: Record<QuestionStatus, string[]> = {
    approved: ['Yes', 'Confirmed', 'Verified'],
    readyToApprove: ['Provisional approval', 'Pending final review'],
    flagged: ['Requires clarification', 'Discrepancy found'],
    answered: ['Yes', 'No'],
    unAnswered: ['']
  };

  return Mock.Random.pick(answerStrategies[status]);
};

const questionTemplates = [
  'Has the {module} been properly validated?',
  'Are {subject} documented according to {standard} requirements?',
  'Was {process} completed within the expected timeframe?',
  'Has the {document} been reviewed and approved?',
  'Were any deviations found during {activity}?'
];

const fillPlaceholders = (template: string) => {
  return template
    .replace('{module}', Mock.Random.pick(['System', 'Software', 'Policy']))
    .replace('{subject}', Mock.Random.pick(['Records', 'Reports', 'Logs']))
    .replace('{standard}', Mock.Random.pick(['ISO 27001', 'SOC 2', 'GDPR']))
    .replace('{process}', Mock.Random.pick(['Audit', 'Testing', 'Verification']))
    .replace('{document}', Mock.Random.pick(['Report', 'Contract', 'Agreement']))
    .replace('{activity}', Mock.Random.pick(['Review', 'Inspection', 'Assessment']));
};

const generateQuestion = (index: number): Question => {
  const status = weightedPick(Object.entries(STATUS_WEIGHTS).map(([value, weight]) => ({ value, weight })));

  return {
    id: `QID-${index + Mock.Random.uuid().slice(0, 8)}`,
    text: fillPlaceholders(Mock.Random.pick(questionTemplates)),
    status,
    answer: status !== 'unAnswered' ? generateAnswer(status) : undefined
  };
};

// 问卷生成器
const generateBaseQuestionnaire = (): Questionnaire => ({
  ...Mock.mock({
    customerName: Mock.Random.pick(['Biogen', 'Novartis', 'Pfizer', 'Moderna']),
    progress: Mock.Random.integer(0, 100),
    createdAt: Mock.Random.date('yyyy-MM-dd')
  }),
  questions: Array.from({ length: Mock.Random.integer(50, 100) }, (_, i) => generateQuestion(i + 1))
});

// 创建初始问卷池（包含所有状态）
const questionnairePool: Questionnaire[] = [
  // Processing 状态 (1条)
  Mock.mock({
    ...generateBaseQuestionnaire(),
    id: 'Q-001',
    status: 'Processing',
    progress: Mock.Random.integer(10, 40)
  }),

  // Started 状态 (2条)
  Mock.mock({
    ...generateBaseQuestionnaire(),
    id: 'Q-002',
    status: 'Started',
    progress: Mock.Random.integer(41, 70),
    collaborators: () => Mock.Random.range(1, 3).map(() => Mock.Random.name())
  }),
  Mock.mock({
    ...generateBaseQuestionnaire(),
    id: 'Q-003',
    status: 'Started',
    progress: Mock.Random.integer(71, 85),
    file: `${Mock.Random.word(5)}.${Mock.Random.pick(['pdf', 'docx'])}`
  }),

  // Ready for Review 状态 (1条)
  Mock.mock({
    ...generateBaseQuestionnaire(),
    id: 'Q-004',
    status: 'Ready for Review',
    progress: Mock.Random.integer(86, 99),
    collaborators: () => Mock.Random.range(2, 4).map(() => Mock.Random.name()),
    file: `${Mock.Random.word(5)}_review.docx`
  }),

  // Approved 状态 (1条)
  Mock.mock({
    ...generateBaseQuestionnaire(),
    id: 'Q-005',
    status: 'Approved',
    progress: 100,
    file: `${Mock.Random.word(5)}_approved.pdf`
  })
];

// 配置 Mock 路由
Mock.mock(/\/api\/questionnaires$/, 'get', () => ({
  code: 200,
  data: questionnairePool.map(q => ({
    id: q.id,
    status: q.status,
    customerName: q.customerName,
    type: q.type,
    dueDate: q.dueDate,
    progress: q.progress
  }))
}));

Mock.mock(/\/api\/questionnaires\/[A-Za-z0-9-]+/, 'get', (options: XHRResponse) => {
  const id = options.url.split('/').pop();
  const target = questionnairePool.find(q => q.id === id);

  return target
    ? {
        code: 200,
        data: {
          ...target,
          // 添加动态字段
          lastModified: Mock.Random.now('timestamp'),
          auditLogs: Mock.Random.range(1, 5).map(() => ({
            timestamp: Mock.Random.now('timestamp'),
            action: Mock.Random.pick(['created', 'updated', 'reviewed', 'approved']),
            operator: Mock.Random.name()
          }))
        }
      }
    : {
        code: 404,
        message: `Questionnaire ${id} not found`
      };
});

// 类型验证函数（开发环境使用）
// if (import.meta.env.DEV) {
const validateTypes = () => {
  questionnairePool.forEach(q => {
    const validStatus: Questionnaire['status'][] = [
      'Processing',
      'Started',
      'Ready for Review',
      'Approved',
      'Completed'
    ];
    const validType: Questionnaire['type'][] = ['Security', 'Compliance', 'GDPR', 'SOC 2', 'Vendor', 'Custom'];

    if (!validStatus.includes(q.status)) {
      console.error(`Invalid status: ${q.status} in questionnaire ${q.id}`);
    }
    if (!validType.includes(q.type)) {
      console.error(`Invalid type: ${q.type} in questionnaire ${q.id}`);
    }
  });
};
validateTypes();
// }
