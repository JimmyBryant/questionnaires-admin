<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { $t } from '@/locales';

const { t } = useI18n();

const currentDate = ref(new Date().toLocaleDateString());

const dashboardData = reactive({
  todoCount: 3,
  needsAttention: [
    {
      id: 1,
      title: t('dashboard.attention.items.training'),
      description: t('dashboard.attention.descriptions.training'),
      status: 'urgent'
    },
    {
      id: 2,
      title: t('dashboard.attention.items.approval'),
      description: t('dashboard.attention.descriptions.approval'),
      status: 'pending'
    }
  ],
  knowledgeProgress: [
    { id: 1, name: 'safety', percentage: 65, color: '#19be6b' },
    { id: 2, name: 'operations', percentage: 42, color: '#2d8cf0' },
    { id: 3, name: 'regulations', percentage: 88, color: '#ff9900' }
  ],
  questionnaireStages: [
    { id: 1, name: 'design', date: '2024-02-15', status: 'success' },
    { id: 2, name: 'collection', date: '2024-03-01', status: 'success' },
    { id: 3, name: 'analysis', date: '2024-03-15', status: 'info' },
    { id: 4, name: 'reporting', date: '2024-04-01', status: 'default' }
  ]
});
</script>

<template>
  <div class="dashboard-container p-4">
    <NGrid x-gap="12" y-gap="12" :cols="4" responsive="screen" item-responsive>
      <!-- 欢迎板块 -->
      <NGi :span="4" :md="4">
        <NCard :title="$t('dashboard.welcome.title')" hoverable>
          <NStatistic :label="$t('dashboard.welcome.currentDate')">
            {{ currentDate }}
          </NStatistic>
          <NSpace vertical class="mt-4">
            <NText>{{ $t('dashboard.welcome.todoItems', { count: dashboardData.todoCount }) }}</NText>
            <NText type="info">{{ $t('dashboard.welcome.systemHealth') }} 98%</NText>
          </NSpace>
        </NCard>
      </NGi>

      <!-- Needs Attention 板块 -->
      <NGi :span="4" :md="2">
        <NCard :title="$t('dashboard.attention.title')" hoverable>
          <NThing v-for="item in dashboardData.needsAttention" :key="item.id" class="mb-4">
            <template #header>
              <NIcon :component="Warning" color="#ff4d4f" />
              {{ item.title }}
            </template>
            <NTag :type="item.status === 'urgent' ? 'error' : 'warning'" size="small">
              {{ $t(`dashboard.attention.status.${item.status}`) }}
            </NTag>
            <NText depth="3" class="ml-2">{{ item.description }}</NText>
          </NThing>
        </NCard>
      </NGi>

      <!-- Your Knowledge 板块 -->
      <NGi :span="4" :md="2">
        <NCard :title="$t('dashboard.knowledge.title')" hoverable>
          <NProgress
            v-for="category in dashboardData.knowledgeProgress"
            :key="category.id"
            type="line"
            :percentage="category.percentage"
            :color="category.color"
            :height="24"
            class="my-3"
          >
            {{ $t(`dashboard.knowledge.categories.${category.name}`) }}
          </NProgress>
        </NCard>
      </NGi>

      <!-- Questionnaire Pipeline 板块 -->
      <NGi :span="4">
        <NCard :title="$t('dashboard.questionnaire.title')" hoverable>
          <NTimeline horizontal>
            <NTimelineItem
              v-for="stage in dashboardData.questionnaireStages"
              :key="stage.id"
              :type="stage.status"
              :title="$t(`dashboard.questionnaire.stages.${stage.name}`)"
              :content="stage.date"
            />
          </NTimeline>
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.n-card {
  margin-bottom: 20px;
}
.n-progress {
  --n-font-size: 14px;
}
</style>
