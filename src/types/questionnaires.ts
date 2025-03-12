// src/types/questionnaire.ts
// types/questionnaires.d.ts

// 问题类型枚举
export type QuestionType =
  | 'radio' // 单选题
  | 'checkbox' // 多选题
  | 'textarea' // 文本题
  | 'dropdown' // 下拉选择题
  | 'rating'; // 评分题

// 问题选项类型
export interface QuestionOption {
  label: string; // 显示文本
  value: string; // 实际值
  icon?: string; // 可选图标
}

// 基础问题结构
export interface BaseQuestion {
  id: string;
  title: string;
  type: QuestionType;
  required?: boolean; // 是否必填
  description?: string; // 问题描述
}

// 选择题扩展
export interface ChoiceQuestion extends BaseQuestion {
  options: QuestionOption[];
  allowCustom?: boolean; // 是否允许自定义答案
}

// 文本题扩展
export interface TextQuestion extends BaseQuestion {
  maxLength?: number; // 最大字符数
  placeholder?: string; // 输入提示
}

// 评分题扩展
export interface RatingQuestion extends BaseQuestion {
  scale: number; // 评分等级（如5分制）
  labels?: string[]; // 各分数描述
}

export type QuestionStatus = 'approved' | 'readyToApprove' | 'flagged' | 'answered' | 'unAnswered';

// 联合问题类型
export interface Question {
  id: string | number;
  text: string;
  answer?: string;
  status: QuestionStatus;
}

// 问卷元数据
export interface QuestionnaireMeta {
  id: string;
  title?: string;
  /** 当前状态 */
  status: QuestionnaireStatus;
  createdBy?: string;
  createdAt?: number; // 时间戳
  updatedAt?: number;
  dueDate?: number; // 截止时间
}

/** 问卷状态类型 */
export type QuestionnaireStatus = 'Processing' | 'Started' | 'Ready for Review' | 'Approved' | 'Completed';

/** 问卷类型分类 */
export type QuestionnaireType = 'Security' | 'Compliance' | 'GDPR' | 'SOC 2' | 'Vendor' | 'Custom';

/** 问卷实体接口 */
export interface Questionnaire extends QuestionnaireMeta {
  /** 客户/潜在客户名称 */
  customerName: string;

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

  questions?: Question[];

  answers?: Record<string, string[]>; // 答案存储 { questionId: answers[] }
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
