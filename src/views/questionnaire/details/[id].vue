<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { NH1, useMessage } from 'naive-ui';
import { Icon } from '@iconify/vue';
import request from 'axios'; // 使用项目配置的 axios 实例
import type { Question, Questionnaire } from '@/types/questionnaires';

const route = useRoute();
const questionnaire = ref<Questionnaire | null>(null);
const activeTab = ref('overview');
const loading = ref(true);
const answers = ref<Record<string, string | string[]>>({});

// 模拟的 Excel 数据（英文）
const excelData = ref([
  ['Q1', 'Safety Training Completion', 'Single Choice', 'Yes/No'],
  ['Q2', 'Compliance Documents', 'Multiple', 'GDPR, CCPA'],
  ['Q3', 'Risk Assessment', 'Text Input', 'Open Response']
]);

// 状态颜色配置
const statusColors = {
  approved: { type: 'success', color: '#52c41a' }, // 批准 - 绿色
  readyToApprove: { type: 'info', color: '#1890ff' }, // 待批准 - 蓝色
  flagged: { type: 'error', color: '#ff4d4f' }, // 标记 - 红色
  answered: { type: 'warning', color: '#faad14' }, // 已答 - 橙色
  unanswered: { type: 'default', color: '#d9d9d9' } // 未答 - 灰色
} as const;

// 计算状态数量
const statusCounts = computed(() => {
  const counts = {
    approved: 0,
    readyToApprove: 0,
    flagged: 0,
    answered: 0,
    unanswered: 0,
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
    // 初始化答案
    answers.value = data.questions.reduce((acc: any, q: Question) => {
      acc[q.id] = q.answer || (q.type === 'checkbox' ? [] : '');
      return acc;
    }, {});
  } catch (error) {
    useMessage().error(error);
  } finally {
    loading.value = false;
  }
};

// 答案更新处理
const handleAnswerChange = (questionId: string, value: string | string[]) => {
  answers.value[questionId] = value;
};

// 提交答案（使用 axios）
const submitAnswers = async () => {
  try {
    await request.post(`/questionnaires/${questionnaire.value?.id}/answers`, answers.value);
    useMessage().success('submit success');
  } catch (error) {
    useMessage().error(error);
  }
};

onMounted(fetchData);
</script>

<template>
  <div class="questionnaire-detail">
    <NSpin :show="loading">
      <template v-if="questionnaire">
        <NH1>{{ questionnaire.customerName }}</NH1>
        <NTabs v-model:value="activeTab">
          <NTabPane name="overview" label="Overview">
            <NGrid :cols="12" :x-gap="24">
              <NGi :span="4">
                <NCard title="Basic Information" class="mb-4">
                  <NGrid :cols="2" :x-gap="12">
                    <NGi>
                      <NStatistic label="Status">
                        <NTag :type="questionnaire.status === 'completed' ? 'success' : 'warning'">
                          {{ questionnaire.status }}
                        </NTag>
                      </NStatistic>
                    </NGi>
                    <NGi>
                      <NStatistic label="Due Date">
                        <NText class="text-sm">{{ new Date(questionnaire.dueDate).toLocaleDateString() }}</NText>
                      </NStatistic>
                    </NGi>
                    <NGi>
                      <NStatistic label="Created By">
                        <div class="flex items-center">
                          <Icon icon="mdi:account" class="mr-2" />
                          <NText class="text-sm">{{ questionnaire.assignee }}</NText>
                        </div>
                      </NStatistic>
                    </NGi>
                    <NGi>
                      <NStatistic label="Last Updated">
                        <NText class="text-sm">{{ new Date(questionnaire.updatedAt).toLocaleDateString() }}</NText>
                      </NStatistic>
                    </NGi>
                  </NGrid>
                </NCard>
                <!-- 问题统计卡片 -->
                <NCard title="Question Status">
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
                <NCard title="Raw Data Preview">
                  <div class="excel-table">
                    <div v-for="(row, i) in excelData" :key="i" class="excel-row">
                      <div
                        v-for="(cell, j) in row"
                        :key="j"
                        class="excel-cell"
                        :style="{ width: j === 1 ? '40%' : '20%' }"
                      >
                        {{ cell }}
                      </div>
                    </div>
                  </div>
                </NCard>
              </NGi>
            </NGrid>
          </NTabPane>

          <NTabPane name="answers" label="Answers"></NTabPane>
        </NTabs>
      </template>
    </NSpin>
  </div>
</template>

<style lang="scss" scoped>
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
  padding: 4px 10px;
  font-weight: 700;
  font-size: 13px;
}

/* 暗黑模式适配 */
.dark .status-tag[data-status='unanswered'] {
  --n-color: #434343;
  --n-text-color: rgba(255, 255, 255, 0.8);
}
</style>
