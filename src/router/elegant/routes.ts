/* eslint-disable */
/* prettier-ignore */
// Generated by elegant-router
// Read more: https://github.com/soybeanjs/elegant-router

import type { GeneratedRoute } from '@elegant-router/types';

export const generatedRoutes: GeneratedRoute[] = [
  {
    name: '403',
    path: '/403',
    component: 'layout.blank$view.403',
    meta: {
      title: '403',
      i18nKey: 'route.403',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: '404',
    path: '/404',
    component: 'layout.blank$view.404',
    meta: {
      title: '404',
      i18nKey: 'route.404',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: '500',
    path: '/500',
    component: 'layout.blank$view.500',
    meta: {
      title: '500',
      i18nKey: 'route.500',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: 'agent-library',
    path: '/agent-library',
    component: 'layout.base$view.agent-library',
    meta: {
      title: 'agent-library',
      i18nKey: 'route.agent-library',
      icon: 'mdi:robot-outline',
      order: 2
    }
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    component: 'layout.base$view.dashboard',
    meta: {
      title: 'dashboard',
      i18nKey: 'route.dashboard',
      icon: 'mdi-view-dashboard'
    }
  },
  {
    name: 'home',
    path: '/home',
    component: 'layout.base$view.home',
    meta: {
      title: 'home',
      i18nKey: 'route.home',
      icon: 'mdi:monitor-dashboard',
      order: 1,
      hideInMenu: true
    }
  },
  {
    name: 'iframe-page',
    path: '/iframe-page/:url',
    component: 'layout.base$view.iframe-page',
    props: true,
    meta: {
      title: 'iframe-page',
      i18nKey: 'route.iframe-page',
      constant: true,
      hideInMenu: true,
      keepAlive: true
    }
  },
  {
    name: 'knowledge-base',
    path: '/knowledge-base',
    component: 'layout.base$view.knowledge-base',
    meta: {
      title: 'knowledge-base',
      i18nKey: 'route.knowledge-base',
      icon:'mdi:lightbulb-outline'
    }
  },
  {
    name: 'login',
    path: '/login/:module(pwd-login|code-login|register|reset-pwd|bind-wechat)?',
    component: 'layout.blank$view.login',
    props: true,
    meta: {
      title: 'login',
      i18nKey: 'route.login',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: 'questionnaire',
    path: '/questionnaire',
    component: 'layout.base',
    meta: {
      title: 'questionnaire',
      i18nKey: 'route.questionnaire',
      hideInMenu: true
    },
    children: [
      {
        name: 'questionnaire_details',
        path: '/questionnaire/details/:id',
        component: 'view.questionnaire_details',
        meta: {
          title: 'questionnaire_details',
          i18nKey: 'route.questionnaire_details',
          hideInMenu: true
        }
      }
    ]
  },
  {
    name: 'questionnaires',
    path: '/questionnaires',
    component: 'layout.base$view.questionnaires',
    meta: {
      title: 'questionnaires',
      i18nKey: 'route.questionnaires',
      icon: 'mdi:file-document-outline',
      order: 2
    }
  }
];
