import { util } from 'src/scripts/util'
import { storage } from 'src/scripts/storage'

const validation = async (to, from, next) => {
  let auth = storage.auth()
  if (!(util.isString(auth.token) && '' !== auth.token)) {
    next({
      path: '/login',
    })
  } else {
    next()
  }
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: validation,
    children: [
      {
        path: '/',
        component: () => import('pages/Project.vue'),
      },
      {
        path: '/grid',
        component: () => import('pages/grid/Index.vue'),
      },
      {
        path: '/reload',
        component: () => import('pages/Reload.vue'),
      },
      {
        path: '/tool',
        component: () => import('pages/Tool.vue'),
      },
      {
        path: '/audit',
        component: () => import('pages/Audit.vue'),
      },
      {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      {
        path: '/login',
        component: () => import('pages/Login.vue'),
      },
      {
        path: '/blank',
        component: () => import('pages/Blank.vue'),
      },
      {
        path: '/redirect',
        component: () => import('pages/Redirect.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
