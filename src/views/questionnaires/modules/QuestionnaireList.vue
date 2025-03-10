<!-- views/questionnaires/modules/QuestionnaireList.vue -->
<script setup lang="ts">
import { defineProps } from 'vue';
import { useMembers } from '@/composables/useMembers';
import { formatDate } from '@/utils/date';

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const statusColorMap = {
  Processing: 'default',
  Started: 'info',
  'Ready for Review': 'warning',
  Approved: 'success',
  Completed: 'primary'
};

const { getMemberName } = useMembers();
</script>

<template>
  <NList bordered>
    <NListItem v-for="item in data" :key="item.id" class="cursor-pointer hover:bg-gray-100">
      <NThing :title="item.customerName" :description="item.description">
        <template #footer>
          <NSpace align="center" size="small">
            <NTag :type="statusColorMap[item.status]">{{ item.status }}</NTag>
            <NText depth="3">Assignee: {{ getMemberName(item.assignee) }}</NText>
            <NText depth="3">Due: {{ formatDate(item.dueDate) }}</NText>
          </NSpace>
        </template>
      </NThing>
    </NListItem>
  </NList>
</template>
