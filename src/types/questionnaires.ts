// src/types/questionnaire.ts

/** 问卷状态类型 */
export type QuestionnaireStatus = 'Processing' | 'Started' | 'Ready for Review' | 'Approved' | 'Completed';

/** 问卷类型分类 */
export type QuestionnaireType = 'Security' | 'Compliance' | 'GDPR' | 'SOC 2' | 'Vendor' | 'Custom';

/** 问卷实体接口 */
export interface Questionnaire {
  /** 唯一标识符 */
  id: string;

  /** 当前状态 */
  status: QuestionnaireStatus;

  /** 客户/潜在客户名称 */
  customerName: string;

  /** 截止时间（时间戳） */
  dueDate: number;

  /** 主要负责人ID */
  assignee: string;

  /** 协作者ID数组 */
  collaborators?: string[];

  /** 问卷类型 */
  type: QuestionnaireType;

  /** 进度百分比 0-100 */
  progress?: number;

  /** 问卷识别描述 */
  description?: string;

  /** 上传的文件路径/URL */
  file?: string;

  /** 内部备注 */
  notes?: string;

  /** 创建时间（时间戳） */
  createdAt: number;

  /** 最后更新时间（时间戳） */
  updatedAt: number;
}

/** 问卷状态配置接口 */
export interface QuestionnaireStatusConfig {
  /** 状态值 */
  value: QuestionnaireStatus;

  /** 显示标签 */
  label: string;

  /** 标签类型对应 Naive UI 的 NTag type */
  tagType: 'default' | 'info' | 'success' | 'warning' | 'primary' | 'error';

  /** 图标名称（兼容 Iconify） */
  icon?: string;

  /** 进度条颜色 */
  progressColor?: string;
}

/** 问卷过滤选项接口 */
export interface QuestionnaireFilterOptions {
  /** 按状态过滤 */
  status?: QuestionnaireStatus[];

  /** 按类型过滤 */
  types?: QuestionnaireType[];

  /** 按负责人过滤 */
  assignee?: string;

  /** 时间范围过滤 */
  dateRange?: [number, number];

  /** 关键词搜索 */
  keyword?: string;
}

/** 问卷类型配置 */
export interface QuestionnaireTypeConfig {
  /** 类型值 */
  value: QuestionnaireType;

  /** 显示名称 */
  label: string;

  /** 颜色标签 */
  color: string;

  /** 相关图标 */
  icon: string;
}
