<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Icon } from '@iconify/vue';

const { t } = useI18n();

// 模拟数据
const currentDate = ref(new Date().toLocaleDateString());

const dashboardData = reactive({
  todoCount: 5,
  needsAttention: [
    {
      id: 1,
      title: t('page.dashboard.attention.items.training'),
      description: t('page.dashboard.attention.descriptions.training', { count: 3 }),
      status: 'urgent'
    },
    {
      id: 2,
      title: t('page.dashboard.attention.items.approval'),
      description: t('page.dashboard.attention.descriptions.approval', { count: 2 }),
      status: 'pending'
    },
    {
      id: 3,
      title: t('page.dashboard.attention.items.compliance'),
      description: t('page.dashboard.attention.descriptions.compliance'),
      status: 'warning'
    }
  ],
  knowledgeProgress: [
    { id: 1, name: 'safety', percentage: 78, color: '#19be6b' },
    { id: 2, name: 'operations', percentage: 65, color: '#2d8cf0' },
    { id: 3, name: 'regulations', percentage: 92, color: '#ff9900' },
    { id: 4, name: 'gdpr', percentage: 83, color: '#ed4014' }
  ],
  questionnaireStages: [
    { id: 1, name: 'design', date: '2024-02-15', status: 'success' },
    { id: 2, name: 'collection', date: '2024-03-01', status: 'success' },
    { id: 3, name: 'analysis', date: '2024-03-15', status: 'info' },
    { id: 4, name: 'reporting', date: '2024-04-01', status: 'default' }
  ],
  businessImpact: {
    revenue: 4.8,
    efficiency: 35,
    risk: 18
  }
});
</script>

<template>
  <div class="dashboard-container p-4">
    <NGrid x-gap="12" y-gap="12" :cols="4" responsive="screen" item-responsive>
      <!-- 欢迎板块 -->
      <NGi :span="4" :md="4">
        <NCard :title="$t('page.dashboard.welcome.title')" hoverable>
          <div class="flex justify-between">
            <NStatistic :label="$t('page.dashboard.welcome.currentDate')">
              {{ currentDate }}
            </NStatistic>
            <NStatistic :label="$t('page.dashboard.welcome.systemHealth')" class="text-right">
              98%
              <template #suffix>
                <Icon icon="mdi:heart-pulse" class="ml-1 text-red-500" />
              </template>
            </NStatistic>
          </div>
          <NSpace vertical class="mt-4">
            <NText type="info">
              {{ $t('page.dashboard.welcome.todoItems', { count: dashboardData.todoCount }) }}
            </NText>
          </NSpace>
        </NCard>
      </NGi>

      <!-- 重点关注 -->
      <NGi :span="4" :md="2">
        <NCard :title="$t('page.dashboard.attention.title')" hoverable>
          <NThing v-for="item in dashboardData.needsAttention" :key="item.id" class="mb-4">
            <template #header>
              <Icon
                :icon="item.status === 'urgent' ? 'mdi:alert' : 'mdi:information'"
                :color="item.status === 'urgent' ? '#ff4d4f' : '#faad14'"
              />
              {{ item.title }}
            </template>
            <NTag
              :type="item.status === 'urgent' ? 'error' : item.status === 'warning' ? 'warning' : 'info'"
              size="small"
            >
              {{ $t(`page.dashboard.attention.status.${item.status}`) }}
            </NTag>
            <NText depth="3" class="ml-2">{{ item.description }}</NText>
          </NThing>
        </NCard>
      </NGi>

      <!-- 知识库进度 -->
      <NGi :span="4" :md="2">
        <NCard :title="$t('page.dashboard.knowledge.title')" hoverable>
          <NProgress
            v-for="category in dashboardData.knowledgeProgress"
            :key="category.id"
            type="line"
            :percentage="category.percentage"
            :color="category.color"
            :height="24"
            class="my-3"
          >
            <div class="flex justify-between">
              <span>{{ $t(`page.dashboard.knowledge.categories.${category.name}`) }}</span>
              <span>{{ category.percentage }}%</span>
            </div>
          </NProgress>
        </NCard>
      </NGi>

      <!-- 问卷流程 -->
      <NGi :span="4" :md="4">
        <NCard :title="$t('page.dashboard.questionnaire.title')" hoverable>
          <NTimeline horizontal>
            <NTimelineItem
              v-for="stage in dashboardData.questionnaireStages"
              :key="stage.id"
              :type="stage.status"
              :title="$t(`page.dashboard.questionnaire.stages.${stage.name}`)"
              :content="stage.date"
            >
              <template #icon>
                <Icon v-if="stage.status === 'success'" icon="mdi:check-circle" class="text-green-500" />
                <Icon v-else-if="stage.status === 'info'" icon="mdi:clock" class="text-blue-500" />
                <Icon v-else icon="mdi:circle" class="text-gray-400" />
              </template>
            </NTimelineItem>
          </NTimeline>
        </NCard>
      </NGi>

      <!-- 业务影响 -->
      <NGi :span="4" :md="4">
        <NCard :title="$t('page.dashboard.business.impact')" hoverable>
          <NGrid :cols="3" responsive="screen" x-gap="12">
            <NGi :span="3" :md="1">
              <NStatistic :label="$t('page.dashboard.business.revenue')">
                ${{ dashboardData.businessImpact.revenue }}M
                <template #suffix>
                  <Icon icon="mdi:trending-up" class="ml-1 text-green-600" />
                </template>
              </NStatistic>
            </NGi>
            <NGi :span="3" :md="1">
              <NStatistic :label="$t('page.dashboard.business.efficiency')">
                {{ dashboardData.businessImpact.efficiency }}%
                <template #suffix>
                  <Icon icon="mdi:speedometer" class="ml-1 text-blue-500" />
                </template>
              </NStatistic>
            </NGi>
            <NGi :span="3" :md="1">
              <NStatistic :label="$t('page.dashboard.business.risk')">
                {{ dashboardData.businessImpact.risk }}%
                <template #suffix>
                  <Icon icon="mdi:alert-octagon" class="ml-1 text-red-500" />
                </template>
              </NStatistic>
            </NGi>
          </NGrid>
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.dashboard-container {
  width: 100%;
  margin: 0 auto;
}

.n-card {
  margin-bottom: 20px;
  transition: transform 0.2s ease;
}

.n-card:hover {
  transform: translateY(-2px);
}

.n-progress {
  --n-font-size: 14px;
}

svg{
  display: inline-block;
}
</style>
