<!-- src/views/questionnaires/index.vue -->
<script setup lang="ts">
import type { FormInst } from 'naive-ui';
import { NBadge, NSpace, NText } from 'naive-ui';
import { computed, h, reactive, ref } from 'vue';
import type { Questionnaire, QuestionnaireStatusConfig, QuestionnaireType } from '@/types/questionnaires';
import { mockQuestionnaires, statusConfigs } from './mocks';

// 响应式状态
const activeTab = ref<'inProgress' | 'all'>('inProgress');
const activeStatus = ref('Processing');
const showModal = ref(false);

// 计算属性
const statusQuestionnaires = computed(() => {
  return statusConfigs.reduce(
    (acc, status) => {
      acc[status.value] = mockQuestionnaires.filter(q => q.status === status.value);
      return acc;
    },
    {} as Record<string, Questionnaire[]>
  );
});

const allQuestionnaires = computed(() => mockQuestionnaires);

const showCreateModal = () => {
  showModal.value = true;
};
// 表单数据类型
interface FormData {
  assignee: string | null;
  collaborators: string[];
  customerName: string;
  description: string;
  dueDate: number | null;
  type: string | null;
  file: [];
  notes: string;
}

// 响应式状态
const formRef = ref<FormInst | null>(null);
const formData = reactive<FormData>({
  assignee: null,
  collaborators: [],
  customerName: '',
  description: '',
  dueDate: null,
  type: null,
  file: [],
  notes: ''
});

const submitting = ref(false);

// 验证规则
const rules = {
  assignee: {
    required: true,
    trigger: ['blur', 'change'],
    message: 'Please select an assignee'
  },
  dueDate: {
    required: true,
    trigger: ['blur', 'change'],
    validator(_rule: unknown, value: number) {
      // 添加自定义验证逻辑
      if (value === null || value <= 0) {
        return new Error('Due date is required');
      }
      // 可添加额外时间验证（可选）
      if (value < Date.now()) {
        return new Error('Due date must be in the future');
      }
      return true;
    },
    message: 'Due date is required'
  },
  customerName: {
    min: 3,
    max: 50,
    message: 'Length should be 3-50 characters',
    trigger: ['blur']
  }
};

// 模拟数据
const teamMembers = [
  { label: 'John Smith (Security)', value: 'john' },
  { label: 'Emma Wilson (Compliance)', value: 'emma' },
  { label: 'Michael Brown (Legal)', value: 'michael' }
];

const questionnaireTypes = [
  { label: 'Security Assessment', value: 'security' },
  { label: 'Vendor Compliance', value: 'compliance' },
  { label: 'GDPR Checklist', value: 'gdpr' },
  { label: 'SOC 2 Audit', value: 'soc2' }
];

// 提交处理
const handleSubmit = async (e: Event) => {
  e.preventDefault();
  submitting.value = true;

  try {
    await formRef.value?.validate();

    // 创建新问卷对象
    const newQuestionnaire = {
      id: Date.now().toString(),
      status: 'Processing' as const,
      created: new Date(),
      customerName: formData.customerName,
      description: formData.description,
      dueDate: formData.dueDate || Date.now() + 604800000, // 默认7天后
      assignee: formData.assignee || '',
      collaborators: formData.collaborators,
      type: 'Security' as QuestionnaireType,
      file: '',
      notes: formData.notes
    };

    // 添加到列表
    mockQuestionnaires.unshift(newQuestionnaire);

    // 重置表单
    showModal.value = false;
    formRef.value?.restoreValidation();
    Object.assign(formData, {
      assignee: null,
      collaborators: [],
      customerName: '',
      description: '',
      dueDate: null,
      type: null,
      file: [],
      notes: ''
    });
  } catch (errors) {
    console.error('Validation failed:', errors);
  } finally {
    submitting.value = false;
  }
};
const renderTab = (item: QuestionnaireStatusConfig) =>
  h(NSpace, { align: 'center', size: 8 }, () => [
    h(NText, null, item.label),
    h(NBadge, { value: statusQuestionnaires.value[item.value].length, type: 'info' })
  ]);
</script>

<template>
  <div class="questionnaire-container">
    <!-- 头部操作栏 -->
    <NSpace justify="space-between" class="mb-4">
      <NH1>Questionnaires</NH1>
      <NButton type="primary" @click="showModal = true">
        <template #icon>
          <Icon icon="mdi:plus-circle-outline" />
        </template>
        Add Questionnaire
      </NButton>
    </NSpace>

    <NTabs v-model:value="activeTab" type="line" animated class="main-tabs">
      <!-- In Progress 标签页 -->
      <NTabPane name="inProgress" tab="In Progress">
        <NTabs v-model:value="activeStatus" type="card" animated class="status-tabs">
          <NTabPane
            v-for="status in statusConfigs"
            :key="status.value"
            :name="status.value"
            :tab="() => renderTab(status)"
          >
            <!--
 <template #tab>
              <NSpace align="center" :size="8">
                <NText>{{ status.label }}</NText>
                <NBadge :value="statusQuestionnaires[status.value].length" :max="99" type="info" />
              </NSpace>
            </template> 
-->

            <NSpace vertical :size="24">
              <NGrid v-if="statusQuestionnaires[status.value].length > 0" x-gap="12" y-gap="16" cols="1 640:2 1024:3">
                <NGi v-for="item in statusQuestionnaires[status.value]" :key="item.id">
                  <QuestionnaireCard :data="item" />
                </NGi>
              </NGrid>

              <NEmpty v-else size="large" description="No questionnaires in this status" class="empty-state">
                <template #extra>
                  <NButton type="primary" size="small" @click="showCreateModal">Create New</NButton>
                </template>
              </NEmpty>
            </NSpace>
          </NTabPane>
        </NTabs>
      </NTabPane>

      <!-- All Questionnaires 标签页 -->
      <NTabPane name="all" tab="All Questionnaires">
        <QuestionnaireTable :data="allQuestionnaires" />
      </NTabPane>
    </NTabs>

    <!-- 新建问卷模态框 -->
    <NModal
      v-model:show="showModal"
      preset="card"
      :title="`New Questionnaire (${allQuestionnaires.length + 1})`"
      style="max-width: 600px"
    >
      <NForm ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="160px">
        <!-- Responding Team -->
        <NH3 class="form-section-title">Responding Team</NH3>
        <NFormItem label="Assignee" path="assignee" required>
          <NSelect
            v-model:value="formData.assignee"
            placeholder="Select primary responsible"
            :options="teamMembers"
            filterable
          />
        </NFormItem>
        <NFormItem label="Collaborators" path="collaborators">
          <NSelect
            v-model:value="formData.collaborators"
            multiple
            placeholder="Select team members"
            :options="teamMembers"
            filterable
          />
        </NFormItem>

        <!-- Connection Details -->
        <NH3 class="form-section-title">Connection Details</NH3>
        <NFormItem label="Customer Name" path="customerName">
          <NInput v-model:value="formData.customerName" placeholder="Enter customer name" />
        </NFormItem>
        <NFormItem label="Due Date" path="dueDate" required>
          <NDatePicker v-model:value="formData.dueDate" type="datetime" clearable style="width: 100%" />
        </NFormItem>
        <NFormItem label="Identifying Details" path="description">
          <NInput
            v-model:value="formData.description"
            type="textarea"
            placeholder="Add identification notes..."
            :autosize="{ minRows: 2 }"
          />
        </NFormItem>

        <!-- Questionnaire Details -->
        <NH3 class="form-section-title">Questionnaire Details</NH3>
        <NFormItem label="Questionnaire Type" path="type">
          <NSelect v-model:value="formData.type" placeholder="Select type" :options="questionnaireTypes" />
        </NFormItem>
        <NFormItem label="Upload File" path="file">
          <NUpload v-model:file-list="formData.file" :max="1" accept=".pdf,.doc,.docx,.xls,.xlsx">
            <NUploadDragger>
              <NIcon size="48" :depth="3">
                <Icon icon="mdi:cloud-upload-outline" />
              </NIcon>
              <NText depth="3">Click or drag file to this area to upload</NText>
              <NP depth="3" style="font-size: 12px">Supported formats: PDF, Word, Excel (Max 10MB)</NP>
            </NUploadDragger>
          </NUpload>
        </NFormItem>
        <NFormItem label="Notes" path="notes">
          <NInput
            v-model:value="formData.notes"
            type="textarea"
            placeholder="Add internal notes..."
            :autosize="{ minRows: 3 }"
          />
        </NFormItem>

        <!-- Form Actions -->
        <NSpace justify="end" :size="24">
          <NButton @click="showModal = false">Cancel</NButton>
          <NButton type="primary" :loading="submitting" @click="handleSubmit">Import Questionnaire</NButton>
        </NSpace>
      </NForm>
    </NModal>
  </div>
</template>

<style scoped>
.questionnaire-container {
  padding: 2rem;
  margin: 0 auto;
  width: 100%;
}

.main-tabs {
  margin-top: 0;
}

.status-tabs {
  margin: 16px 0 0;
}

.empty-state {
  margin: 40px 0;
}

:deep(.n-tab-pane) {
  padding: 16px 0;
}

:deep(.n-grid) {
  padding: 8px;
}
</style>
