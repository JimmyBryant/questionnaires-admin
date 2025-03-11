import type { Questionnaire, QuestionnaireStatusConfig } from '@/types/questionnaires';

// 状态配置
export const statusConfigs: QuestionnaireStatusConfig[] = [
  {
    value: 'Processing',
    label: 'Processing',
    tagType: 'default',
    icon: 'mdi:progress-clock'
  },
  {
    value: 'Started',
    label: 'Started',
    tagType: 'info',
    icon: 'mdi:play-circle'
  },
  {
    value: 'Ready for Review',
    label: 'Ready for Review',
    tagType: 'warning',
    icon: 'mdi:file-document-edit'
  },
  {
    value: 'Approved',
    label: 'Approved',
    tagType: 'success',
    icon: 'mdi:check-circle'
  },
  {
    value: 'Completed',
    label: 'Completed',
    tagType: 'primary',
    icon: 'mdi:flag-checkered'
  }
];

export const mockQuestionnaires: Questionnaire[] = [
  // Processing 状态（Security 类型）
  {
    id: 'Q-001',
    status: 'Processing',
    customerName: 'Microsoft',
    dueDate: Date.now() + 86400000 * 3,
    assignee: 'john.doe',
    type: 'Security',
    progress: 30,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 7200000
  },

  // Started 状态（Compliance + GDPR 类型）
  {
    id: 'Q-002',
    status: 'Started',
    customerName: 'Google',
    dueDate: Date.now() + 86400000 * 5,
    assignee: 'michael',
    type: 'Compliance',
    progress: 50,
    collaborators: ['michael.chen'],
    file: 'compliance-checklist.pdf',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 3600000
  },
  {
    id: 'Q-003',
    status: 'Started',
    customerName: 'Tesla',
    dueDate: Date.now() + 86400000 * 7,
    assignee: 'john',
    type: 'GDPR',
    progress: 70,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 1800000
  },

  // Ready for Review 状态（SOC 2 类型）
  {
    id: 'Q-004',
    status: 'Ready for Review',
    customerName: 'Amazon',
    dueDate: Date.now() + 86400000 * 2,
    assignee: 'sarah.nguyen',
    type: 'SOC 2',
    progress: 90,
    collaborators: ['david.smith', 'lisa.wang'],
    file: 'soc2-audit.docx',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 3600000
  },

  // Approved 状态（Vendor 类型）
  {
    id: 'Q-005',
    status: 'Approved',
    customerName: 'Meta',
    dueDate: Date.now() + 86400000,
    assignee: 'michael.jordan',
    type: 'Vendor',
    progress: 100,
    file: 'vendor-assessment.pdf',
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000
  }

  // 预留 Custom 类型示例（可根据需要启用）
  // {
  //   id: 'Q-006',
  //   status: 'Processing',
  //   customerName: 'Netflix',
  //   dueDate: Date.now() + 86400000 * 4,
  //   assignee: 'linda.chen',
  //   type: 'Custom',
  //   progress: 45,
  //   customFields: ['AI Ethics Review'],
  //   createdAt: Date.now() - 86400000 * 1.5,
  //   updatedAt: Date.now() - 4800000
  // }
];
