<!-- views/questionnaires/modules/QuestionnaireTable.vue -->
<script setup>
import { defineProps, h } from 'vue';
import { NButton, NTag, NText } from 'naive-ui';
import { formatDate } from '@/utils/date';

defineProps({
  data: {
    type: Array,
    required: true
  }
});

const pagination = { pageSize: 10 };

const createColumns = () => [
  {
    title: 'Customer',
    key: 'customerName',
    sorter: (a, b) => a.customerName.localeCompare(b.customerName)
  },
  {
    title: 'Status',
    key: 'status',
    render(row) {
      return h(NTag, { type: statusColorMap[row.status], bordered: false }, { default: () => row.status });
    }
  },
  {
    title: 'Due Date',
    key: 'dueDate',
    render(row) {
      return h(NText, { depth: 3 }, () => formatDate(row.dueDate));
    },
    sorter: (a, b) => a.dueDate - b.dueDate
  },
  {
    title: 'Actions',
    key: 'actions',
    render() {
      return h(NButton, { size: 'small', tertiary: true }, { default: () => 'View Details' });
    }
  }
];

const statusColorMap = {
  Processing: 'default',
  Started: 'info',
  'Ready for Review': 'warning',
  Approved: 'success',
  Completed: 'primary'
};

const columns = createColumns();
</script>

<template>
  <NDataTable :columns="columns" :data="data" :pagination="pagination" :bordered="false" striped />
</template>
