import type { Questionnaire, MockQuestionnaireStatusConfig } from './types'

// 状态配置
export const statusConfigs: MockQuestionnaireStatusConfig[] = [
  {
    value: 'Processing',
    label: 'Processing',
    tagType: 'default',
    icon: 'mdi:progress-clock'
  },
  {
    value: 'Started',
    label: 'In Progress',
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
]

// 模拟问卷数据
export const mockQuestionnaires: Questionnaire[] = [
  {
    id: 'Q-001',
    status: 'Processing',
    customerName: 'Microsoft',
    dueDate: Date.now() + 86400000 * 3,
    assignee: 'john',
    type: 'Security',
    progress: 30,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000
  },
  {
    id: 'Q-002',
    status: 'Started',
    customerName: 'Amazon',
    dueDate: Date.now() + 86400000 * 5,
    assignee: 'emma',
    type: 'Compliance',
    progress: 65,
    collaborators: ['michael'],
    file: 'compliance-checklist.pdf',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 1800000
  }
]