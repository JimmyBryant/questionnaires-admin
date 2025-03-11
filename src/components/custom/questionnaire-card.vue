<!-- src/components/QuestionnaireCard.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { formatDate } from '@/utils/date';
import { useMembers } from '@/composables/useMembers';
import type { Questionnaire, QuestionnaireType } from '@/types/questionnaires';

const router = useRouter();
defineProps<{
  data: Questionnaire;
}>();

const { getMemberName } = useMembers();

// 定义 NTag 组件允许的颜色类型
type NTagColor = 'success' | 'info' | 'warning' | 'error' | 'default' | 'primary';

// 严格匹配 QuestionnaireType 类型定义
const typeConfigMap: Record<QuestionnaireType, { color: NTagColor; icon: string }> = {
  Security: {
    color: 'success',
    icon: 'mdi:shield-check'
  },
  Compliance: {
    color: 'info',
    icon: 'mdi:file-certificate'
  },
  GDPR: {
    color: 'warning',
    icon: 'mdi:lock-alert'
  },
  'SOC 2': {
    color: 'error',
    icon: 'mdi:security-network'
  },
  Vendor: {
    color: 'default',
    icon: 'mdi:account-group'
  },
  Custom: {
    color: 'primary',
    icon: 'mdi:cube'
  }
};

const getTypeConfig = (type: QuestionnaireType) => {
  return (
    typeConfigMap[type] || {
      color: 'default',
      icon: 'mdi:help-circle'
    }
  );
};
const handleClick = (id: string) => {
  router.push({
    name: 'questionnaire_details',
    params: { id }
  });
};
</script>

<template>
  <NCard hoverable class="questionnaire-card" @click="handleClick(data.id)">
    <NSpace vertical :size="12">
      <NText strong>{{ data.customerName }}</NText>

      <!-- 类型标签 -->
      <NSpace align="center" :size="8">
        <NTag :bordered="false" size="small" round :type="getTypeConfig(data.type).color">
          <template #icon>
            <Icon :icon="getTypeConfig(data.type).icon" width="14" class="tag-icon" />
          </template>
          {{ data.type }}
        </NTag>
        <NText class="questionnare-id" depth="3">#{{ data.id }}</NText>
      </NSpace>

      <!-- 进度条 -->
      <NProgress
        v-if="data.progress"
        type="line"
        :percentage="data.progress"
        :height="6"
        :border-radius="4"
        :fill-border-radius="4"
        :status-color="getTypeConfig(data.type).color"
      />

      <!-- 底部信息 -->
      <NSpace align="center" justify="space-between">
        <NText depth="3">
          <Icon icon="mdi:clock" class="info-icon" />
          {{ formatDate(data.dueDate) }}
        </NText>

        <NTag size="small" round>
          <Icon icon="mdi:account" class="info-icon" />
          {{ getMemberName(data.assignee) }}
        </NTag>
      </NSpace>
    </NSpace>
  </NCard>
</template>

<style lang="scss" scoped>
.questionnaire-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
  padding: 12px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

.tag-icon {
  margin-right: 6px;
  vertical-align: -2px;
}

.info-icon {
  vertical-align: -2px;
  margin-right: 4px;
  font-size: 1.1em;
}
.questionnare-id {
  font-size: 0.9em;
}
:deep(.n-progress .n-progress-graph-line) {
  margin: 4px 0;
}
svg {
  display: inline-block;
}
</style>
