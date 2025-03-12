<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { NButton, NDataTable, NIcon, NInput, NTag, useMessage } from 'naive-ui';
import type { DataTableColumn } from 'naive-ui';
import { Icon } from '@iconify/vue';
import request from 'axios'; // 使用项目配置的 axios 实例
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import { read, utils } from 'xlsx';
import type { Question, Questionnaire } from '@/types/questionnaires';
import { questions_answers } from './mock';

const route = useRoute();
const questionnaire = ref<Questionnaire | null>(null);
const activeTab = ref('overview');
const loading = ref(true);
const answersData = ref<any[]>(questions_answers);
registerAllModules();
// 定义 Handsontable 实例的类型
interface HotTableInstance {
  hotInstance: {
    loadData: (data: any[][]) => void;
    render: () => void;
  };
}

// 修改 hotTableRef 的类型声明
const hotTableRef = ref<HotTableInstance | null>(null);
// 表格配置
const hotSettings = ref({
  data: [
    [
      'Does your organization have a comprehensive Business Continuity Plan?',
      'Yes',
      "Yes, the organization has a comprehensive Business Continuity Plan . This is evidenced by the fact that the company's contingency planning and incident response playbooks are maintained and updated to reflect emerging continuity risks and lessons learned from past incidents (CC.07.07). These playbooks are crucial components of the Business Continuity Plan, ensuring the organization can effectively respond to and recover from potential disruptions.",
      'p41'
    ]
  ],
  colHeaders: [] as string[],
  rowHeaders: true,
  height: 'auto',
  width: '100%',
  autoWrapRow: true,
  autoWrapCol: true,
  licenseKey: 'non-commercial-and-evaluation', // 非商业用途授权
  contextMenu: true, // 启用右键菜单
  manualColumnResize: true, // 允许调整列宽
  manualRowResize: true // 允许调整行高
});

// 状态颜色配置（移除progress属性，flagged使用橙色系）
const statusColors = {
  approved: {
    type: 'success',
    color: '#7dbd84' // 柔和的青绿色
  },
  readyToApprove: {
    type: 'info',
    color: '#4a90e2' // 深天蓝色
  },
  answered: {
    type: 'primary',
    color: '#48c7a8' // 蓝绿色
  },
  flagged: {
    type: 'warning',
    color: '#ffa726' // 橙色系（Material Orange 400）
  },
  unAnswered: {
    type: 'default',
    color: '#cfd8dc' // 浅灰蓝色
  }
} as const;

const questionnaireStatusColors = {
  Processing: {
    type: 'success',
    color: '#7dbd84' // 柔和的青绿色
  },
  Started: {
    type: 'info',
    color: '#4a90e2' // 深天蓝色
  },
  'Ready for Review': {
    type: 'primary',
    color: '#48c7a8' // 蓝绿色
  },
  Approved: {
    type: 'warning',
    color: '#ffa726' // 橙色系（Material Orange 400）
  },
  Completed: {
    type: 'default',
    color: '#cfd8dc' // 浅灰蓝色
  }
} as const;

// 计算状态数量
const statusCounts = computed(() => {
  const counts = {
    approved: 0,
    readyToApprove: 0,
    flagged: 0,
    answered: 0,
    unAnswered: 0,
    total: 0
  };

  questionnaire.value?.questions?.forEach((q: Question) => {
    counts[q.status] += 1;
    counts.total += 1;
  });

  return counts;
});

// 获取数据（使用 axios）
const fetchData = async () => {
  try {
    const { data } = await request.get(`/api/questionnaires/${route.params.id}`);
    questionnaire.value = data.data;
    console.log('返回数据：', data);
  } catch (error) {
    console.error('数据加载失败:', error);
    useMessage().error('出错了');
  } finally {
    loading.value = false;
  }
};

// 答案更新处理
// const handleAnswerChange = (questionId: string, value: string | string[]) => {
//   answers.value[questionId] = value;
// };

// 定义 StatusKey 类型
type StatusKey = keyof typeof questionnaireStatusColors;

// 修改 getQuestionnaireStatusType 函数
const getQuestionnaireStatusType = (
  status: string
): 'primary' | 'info' | 'success' | 'warning' | 'error' | 'default' => {
  const statusKey = status as StatusKey;
  return statusKey in questionnaireStatusColors ? questionnaireStatusColors[statusKey].type : 'default';
};

// 提交答案（使用 axios）
// const submitAnswers = async () => {
//   try {
//     await request.post(`/questionnaires/${questionnaire.value?.id}/answers`, answers.value);
//     useMessage().success('submit success');
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     useMessage().error('error');
//   }
// };

// 加载 Excel 文件
const loadExcel = async (file: string) => {
  try {
    // 1. 获取文件
    const response = await fetch(file);
    if (!response.ok) throw new Error('文件加载失败');

    // 2. 转换为 ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // 3. 解析 Excel
    const workbook = read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // 4. 转换为二维数组 (Handsontable 兼容格式)
    const jsonData = utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '', // 处理空单元格
      raw: false // 解析格式化后的值
    });

    // 5. 处理表头
    const headers = jsonData[0] as string[];
    const rows = jsonData.slice(1);

    // 6. 更新表格配置
    if (hotTableRef.value?.hotInstance) {
      const hot = hotTableRef.value.hotInstance;
      // 将 rows 显式转换为 any[][]
      const data: any[][] = rows as any[][];
      console.log(data);
      hot.loadData(data); // 强制加载新数据
      hot.render(); // 手动触发重渲染
    }
    hotSettings.value = {
      ...hotSettings.value,
      colHeaders: headers
    };
  } catch (err) {
    console.error('文件处理失败:', err);
  } finally {
    loading.value = false;
  }
};

const selectedRowKeys = ref<number[]>([]);
// 操作处理方法
const approveQuestion = (question: any) => {
  question.status = 'approved';
};

const flagQuestion = (question: any) => {
  question.status = question.status === 'flagged' ? 'unAnswered' : 'flagged';
};

const columns: DataTableColumn<any>[] = [
  {
    type: 'selection',
    fixed: 'left',
    width: 50
  },
  {
    title: 'Question',
    key: 'text',
    ellipsis: {
      tooltip: true
    },
    render(row: any) {
      return h('div', { class: 'question-text' }, row.text);
    }
  },
  {
    title: 'Answer',
    key: 'answer',
    render(row: any) {
      return h(NInput, {
        type: 'textarea',
        value: row.answer,
        rows: 2,
        autosize: {
          minRows: 2,
          maxRows: 4
        },
        onUpdateValue(v) {
          row.answer = v;
        },
        class: 'editable-answer'
      });
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    fixed: 'right',
    width: 150,
    render(row: any) {
      return h('div', { class: 'action-buttons' }, [
        h(
          NButton,
          {
            text: true,
            onClick: () => approveQuestion(row),
            class: 'approve-btn'
          },
          {
            icon: () => h(NIcon, null, () => h(Icon, { icon: 'mdi:check' }))
          }
        ),
        h(
          NButton,
          {
            text: true,
            onClick: () => flagQuestion(row),
            class: 'flag-btn'
          },
          {
            icon: () => h(NIcon, null, () => h(Icon, { icon: 'mdi:warning' }))
          }
        )
      ]);
    }
  }
];

const pagination = {
  pageSize: 15,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  prefix({ itemCount }: any) {
    return `Total: ${itemCount}`;
  }
};

onMounted(async () => {
  await fetchData();
  if (questionnaire.value?.file) {
    console.log('questionnaire.file', questionnaire.value.file);
    loadExcel(questionnaire.value.file);
  }
});
</script>

<template>
  <div class="questionnaire-detail">
    <NSpin :show="loading">
      <template v-if="questionnaire">
        <NH1>{{ questionnaire.title }}</NH1>
        <NTabs v-model:value="activeTab">
          <NTabPane name="overview" label="Overview">
            <NGrid :cols="12" :x-gap="24">
              <NGi :span="4">
                <NCard title="Basic Information" class="mb-4">
                  <NGrid :cols="2" :x-gap="12">
                    <NGi>
                      <NStatistic label="Status">
                        <NTag :type="getQuestionnaireStatusType(questionnaire.status)">
                          {{ questionnaire.status }}
                        </NTag>
                      </NStatistic>
                    </NGi>
                    <NGi>
                      <NStatistic label="Due Date">
                        <NText class="text-sm">
                          {{
                            questionnaire.dueDate ? new Date(questionnaire.dueDate).toLocaleDateString() : 'Undefined'
                          }}
                        </NText>
                      </NStatistic>
                    </NGi>
                    <NGi>
                      <NStatistic label="Created By">
                        <div>
                          <Icon icon="mdi:account" class="mr-2" />
                          <NText class="text-sm">{{ questionnaire.assignee }}</NText>
                        </div>
                      </NStatistic>
                    </NGi>
                    <NGi>
                      <NStatistic label="Created Date">
                        <NText class="text-sm">
                          {{
                            questionnaire.createdAt
                              ? new Date(questionnaire.createdAt).toLocaleDateString()
                              : 'Undefined'
                          }}
                        </NText>
                      </NStatistic>
                    </NGi>
                  </NGrid>
                </NCard>
                <!-- 问题统计卡片 -->
                <NCard title="Question Status">
                  <!-- 进度条 -->
                  <div class="progress-container">
                    <div class="mb-2">
                      <NText strong>Questions {{ statusCounts.total }}</NText>
                    </div>
                    <div class="progress-bar">
                      <div
                        v-for="[statusKey, config] in Object.entries(statusColors)"
                        :key="config.type"
                        class="progress-segment"
                        :style="{
                          width: (statusCounts[statusKey] / statusCounts.total) * 100 + '%',
                          backgroundColor: config['color']
                        }"
                      ></div>
                    </div>
                  </div>
                  <div class="status-grid">
                    <NTag
                      v-for="[statusKey, config] in Object.entries(statusColors)"
                      :key="statusKey"
                      :type="config.type"
                      :color="{
                        color: config.color,
                        textColor: statusKey === 'unanswered' ? 'rgba(0,0,0,0.8)' : 'white'
                      }"
                      round
                      class="status-tag"
                    >
                      <div class="tag-content">
                        <span class="status-label">
                          {{ statusKey }}
                        </span>
                        <span class="status-count">
                          {{ statusCounts[statusKey] }}
                        </span>
                      </div>
                    </NTag>
                  </div>
                </NCard>
              </NGi>

              <NGi :span="8">
                <NCard title="Original Format">
                  <div class="excel-table">
                    <!-- 使用 Handsontable 组件显示 Excel 数据 -->
                    <HotTable ref="hotTableRef" :settings="hotSettings"></HotTable>
                  </div>
                </NCard>
              </NGi>
            </NGrid>
          </NTabPane>

          <NTabPane name="answers" label="Answers">
            <NCard title="Answers Management" class="answers-section">
              <NDataTable
                v-model:checked-row-keys="selectedRowKeys"
                :columns="columns"
                :data="answersData"
                :pagination="pagination"
              >
                <template #empty>
                  <NEmpty description="No questions available"></NEmpty>
                </template>
              </NDataTable>
            </NCard>
          </NTabPane>
        </NTabs>
      </template>
    </NSpin>
  </div>
</template>

<style lang="scss">
.questionnaire-detail {
  width: 100%;
  margin: 0 auto;
  padding: 24px;
}

.excel-table {
  border: 1px solid #ddd;
}

.excel-row {
  display: flex;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
}

.excel-cell {
  padding: 8px 12px;
  border-right: 1px solid #eee;
  &:last-child {
    border-right: none;
  }
}

.answer-cell {
  min-width: 400px;
}
.text-sm {
  font-size: 1rem;
}
.submit-section {
  text-align: center;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 8px;
}
:deep(.n-data-table) {
  th {
    background: #fafafa;
  }
  tr:hover td {
    background-color: #f5f5f5 !important;
  }
}
svg {
  display: inline-block;
}
.status-grid {
  display: flex;
  gap: 12px;
  flex-direction: row;
  justify-content: start;
  flex-wrap: wrap;
}

.status-tag {
  display: inline-flex;
  width: auto;
  padding: 8px 16px;
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
}

.status-label {
  font-weight: 500;
  font-size: 14px;
}

.status-count {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 4px;
  margin-left: 4px;
  font-weight: 700;
  font-size: 13px;
}
.progress-container {
  .progress-bar {
    width: 100%;
    height: 8px;
    display: flex;
    overflow: hidden;
    margin-bottom: 1rem;
    border-radius: 10px;
    .progress-segment {
      height: 100%;
      &:last-child {
        flex: 1;
      }
    }
  }
}
/* 增强表格样式 */
.handsontable {
  font-size: 14px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.handsontable th {
  background: #f8f9fa;
  font-weight: 600;
  color: #1a1a1a;
  border-color: #e9ecef;
}

.handsontable td {
  padding: 12px;
  vertical-align: middle;
}

.handsontable .htMissingValue {
  background: #fff9db;
}
.handsontable .wtSpreader {
  width: 100%;
}
.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
/* 暗黑模式适配 */
.dark .status-tag[data-status='unanswered'] {
  --n-color: #434343;
  --n-text-color: rgba(255, 255, 255, 0.8);
}
</style>
