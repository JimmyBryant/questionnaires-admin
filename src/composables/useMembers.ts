// src/composables/useMembers.ts
import { ref } from 'vue';

interface Member {
  id: string;
  name: string;
  role: string;
  email?: string;
}

const members = ref<Member[]>([
  { id: 'john', name: 'John Smith', role: 'Security Analyst' },
  { id: 'emma', name: 'Emma Wilson', role: 'Compliance Officer' },
  { id: 'michael', name: 'Michael Brown', role: 'Legal Counsel' }
]);

export const useMembers = () => {
  const getMemberName = (memberId: string | null): string => {
    const member = members.value.find(m => m.id === memberId);
    return member?.name || 'Unassigned';
  };

  const getMemberDetails = (memberId: string | null): Member | null => {
    return members.value.find(m => m.id === memberId) || null;
  };

  return {
    members,
    getMemberName,
    getMemberDetails
  };
};