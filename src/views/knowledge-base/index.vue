<script setup lang="ts">
import { h, ref } from 'vue';
import { NButton, NTag, NTime } from 'naive-ui';
import { Icon } from '@iconify/vue';
import type { DataTableColumns } from 'naive-ui';
import type { Question } from '@/types/questionnaires';
import { questions_answers } from '@/mock/questions';

// 增强数据生成函数
const generatePastAnswers = (baseData: Question[]) => {
  const questionnaires = ['2023 Security Audit', 'GDPR Compliance Review', 'Vendor Risk Assessment'];

  const now = Date.now();

  return baseData.map((item, index) => {
    // 保留原始数据中的核心字段
    const baseItem = {
      id: `QA-${item.id}`, // 保留原始ID并添加前缀
      question: item.text, // 将text字段映射为question
      answer: item.answer, // 保留原始答案
      status: item.status // 保留原始状态
    };

    // 添加需要模拟的字段
    return {
      ...baseItem,
      questionnaire: questionnaires[index % questionnaires.length], // 循环分配问卷
      lastEdited: now - index * 86400000 + Math.random() * 3600000 // 添加时间波动
      // 可以继续添加其他需要模拟的字段
      // flags: generateFlags(item.status),
    };
  });
};

// 表格列配置
const columns: DataTableColumns<any> = [
  {
    type: 'selection',
    fixed: 'left',
    width: 50
  },
  {
    title: 'Question',
    key: 'question',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Answer',
    key: 'answer',
    render(row: any) {
      return h('div', { class: 'answer-content' }, [h('span', row.answer)]);
    }
  },
  {
    title: 'Status',
    key: 'status',
    render(row: any) {
      const statusMap: Record<string, string> = {
        readyToApprove: 'warning',
        answered: 'info',
        approved: 'success',
        flagged: 'error',
        unAnswered: 'default'
      };
      return h(
        NTag,
        { type: statusMap[row.status] as 'error' | 'default' | 'primary' | 'success' | 'info' | 'warning' },
        row.status.toUpperCase()
      );
    }
  },
  {
    title: 'Questionnaire',
    key: 'questionnaire',
    filterOptions: [
      { label: 'Security Audit', value: '2023 Security Audit' },
      { label: 'GDPR Review', value: 'GDPR Compliance Review' },
      { label: 'Vendor Risk', value: 'Vendor Risk Assessment' }
    ],
    filter(value: any, row: any) {
      return row.questionnaire === value;
    }
  },
  {
    title: 'Last Edited',
    key: 'lastEdited',
    render(row: any) {
      return h(NTime, {
        time: row.lastEdited,
        type: 'relative',
        updateInterval: 60
      });
    }
  }
];

// 分页配置
const pagination = {
  pageSize: 30,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  prefix({ itemCount }: any) {
    return `Total Records: ${itemCount}`;
  }
};

const pastAnswers = ref(generatePastAnswers(questions_answers));

const handleImport = () => {
  // 实现导入逻辑
  console.log('Import questions workflow');
};
</script>

<template>
  <NCard title="Knowledge Base">
    <NTabs type="line" animated>
      <!-- Curated Q&As Tab -->
      <NTabPane name="curated" tab="Curated Q&As">
        <NEmpty description="No curated questions yet" class="empty-state">
          <template #extra>
            <NButton type="primary" @click="handleImport">
              <template #icon>
                <Icon icon="mdi:import" />
              </template>
              Import Questions
            </NButton>
          </template>
        </NEmpty>
      </NTabPane>

      <!-- Past Answers Tab -->
      <NTabPane name="past" tab="Past Answers">
        <NDataTable
          :columns="columns"
          :data="pastAnswers"
          :pagination="pagination"
          :row-key="row => row.id"
          class="answers-table readonly-table"
        />
      </NTabPane>

      <!-- External Sources Tab -->
      <NTabPane name="external" tab="External Sources">
        <NEmpty description="You don't have any external sources yet" class="empty-state" />
      </NTabPane>
    </NTabs>
  </NCard>
</template>

<style lang="scss">
.empty-state {
  margin: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.answers-table {
  margin-top: 24px;

  .n-data-table-th {
    background-color: #f8f9fa;
  }

  .answer-content {
    display: flex;
    align-items: center;
    max-width: 400px;
  }

  @media (max-width: 768px) {
    .n-data-table-td:nth-child(4),
    .n-data-table-th:nth-child(4) {
      display: none;
    }
  }
}
.readonly-table {
  tbody tr {
    opacity: 0.5;
    transition-property: opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 0.15s;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
