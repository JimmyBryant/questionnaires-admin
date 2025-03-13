<script setup lang="ts">
import { NCard, NEllipsis, NGi, NGrid, NSpace, NTag } from 'naive-ui';
import { Icon } from '@iconify/vue';

interface Agent {
  name: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  color: string;
}

const agents: Agent[] = [
  {
    name: 'Clara',
    title: 'Intelligent Compliance Guardian',
    description:
      'Clara automates compliance workflows, ensures regulatory alignment, and safeguards customer trust throughout deal cycles.',
    features: [
      'Auto-generates compliance-ready responses',
      'Real-time regulation database integration',
      'Smart exception flagging with audit trails',
      'Multi-lingual support for global standards'
    ],
    icon: 'mdi:shield-check-outline',
    color: '#3b82f6'
  },
  {
    name: 'Orion',
    title: 'Proposal Orchestration Expert',
    description:
      'Orion transforms proposal management with AI-powered content curation, stakeholder alignment, and deal acceleration tools.',
    features: [
      'Automated RFP analysis & response drafting',
      'Cross-team collaboration workflows',
      'Bid library intelligence engine',
      'Win probability analytics'
    ],
    icon: 'mdi:rocket-launch-outline',
    color: '#10b981'
  }
];
</script>

<template>
  <div class="agent-library">
    <h1 class="title">AI Agent Marketplace</h1>
    <p class="subtitle">Specialized digital assistants for enterprise workflows</p>

    <NGrid :cols="2" :x-gap="24" :y-gap="24" responsive="screen">
      <NGi v-for="agent in agents" :key="agent.name">
        <NCard
          :title="agent.name"
          :segmented="{ content: true }"
          :header-style="{ borderBottom: `2px solid ${agent.color}` }"
          hoverable
        >
          <template #header-extra>
            <Icon :icon="agent.icon" width="24" :color="agent.color" />
          </template>

          <div class="agent-content">
            <NTag :color="{ color: agent.color, textColor: 'white' }" round>
              {{ agent.title }}
            </NTag>

            <p class="description">
              <NEllipsis :line-clamp="2">
                {{ agent.description }}
              </NEllipsis>
            </p>

            <NSpace vertical :size="12">
              <div v-for="(feature, index) in agent.features" :key="index" class="feature">
                <Icon icon="mdi:check-circle-outline" :color="agent.color" />
                <span>{{ feature }}</span>
              </div>
            </NSpace>
          </div>

          <template #action>
            <NSpace justify="end">
              <NButton type="primary" ghost :color="agent.color">Deploy Agent</NButton>
              <NButton :color="agent.color">View Details</NButton>
            </NSpace>
          </template>
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.agent-library {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.title {
  font-size: 2.5rem;
  color: var(--n-color-text-primary);
  text-align: center;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--n-color-text-secondary);
  text-align: center;
  margin-bottom: 40px;
}

.agent-content {
  padding: 16px 0;
}

.description {
  margin: 16px 0;
  color: var(--n-color-text-secondary);
  line-height: 1.6;
}

.feature {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.feature span {
  flex: 1;
}

@media (max-width: 768px) {
  .n-grid {
    grid-template-columns: 1fr !important;
  }

  .title {
    font-size: 2rem;
  }
}
</style>
