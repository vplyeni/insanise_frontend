/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SignupImport } from './routes/signup'
import { Route as ResetPasswordImport } from './routes/reset-password'
import { Route as RecoverPasswordImport } from './routes/recover-password'
import { Route as LoginImport } from './routes/login'
import { Route as LayoutImport } from './routes/_layout'
import { Route as LayoutIndexImport } from './routes/_layout/index'
import { Route as LayoutTeamsImport } from './routes/_layout/teams'
import { Route as LayoutTasksImport } from './routes/_layout/tasks'
import { Route as LayoutTaskresultsImport } from './routes/_layout/task_results'
import { Route as LayoutTargetgroupsImport } from './routes/_layout/target_groups'
import { Route as LayoutSettingsImport } from './routes/_layout/settings'
import { Route as LayoutMytasksImport } from './routes/_layout/my_tasks'
import { Route as LayoutMyleavesImport } from './routes/_layout/my_leaves'
import { Route as LayoutItemsImport } from './routes/_layout/items'
import { Route as LayoutEmployeesImport } from './routes/_layout/employees'
import { Route as LayoutAdminImport } from './routes/_layout/admin'

// Create/Update Routes

const SignupRoute = SignupImport.update({
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any)

const ResetPasswordRoute = ResetPasswordImport.update({
  path: '/reset-password',
  getParentRoute: () => rootRoute,
} as any)

const RecoverPasswordRoute = RecoverPasswordImport.update({
  path: '/recover-password',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const LayoutIndexRoute = LayoutIndexImport.update({
  path: '/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutTeamsRoute = LayoutTeamsImport.update({
  path: '/teams',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutTasksRoute = LayoutTasksImport.update({
  path: '/tasks',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutTaskresultsRoute = LayoutTaskresultsImport.update({
  path: '/task_results',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutTargetgroupsRoute = LayoutTargetgroupsImport.update({
  path: '/target_groups',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutSettingsRoute = LayoutSettingsImport.update({
  path: '/settings',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutMytasksRoute = LayoutMytasksImport.update({
  path: '/my_tasks',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutMyleavesRoute = LayoutMyleavesImport.update({
  path: '/my_leaves',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutItemsRoute = LayoutItemsImport.update({
  path: '/items',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutEmployeesRoute = LayoutEmployeesImport.update({
  path: '/employees',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutAdminRoute = LayoutAdminImport.update({
  path: '/admin',
  getParentRoute: () => LayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_layout': {
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/recover-password': {
      preLoaderRoute: typeof RecoverPasswordImport
      parentRoute: typeof rootRoute
    }
    '/reset-password': {
      preLoaderRoute: typeof ResetPasswordImport
      parentRoute: typeof rootRoute
    }
    '/signup': {
      preLoaderRoute: typeof SignupImport
      parentRoute: typeof rootRoute
    }
    '/_layout/admin': {
      preLoaderRoute: typeof LayoutAdminImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/employees': {
      preLoaderRoute: typeof LayoutEmployeesImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/items': {
      preLoaderRoute: typeof LayoutItemsImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/my_leaves': {
      preLoaderRoute: typeof LayoutMyleavesImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/my_tasks': {
      preLoaderRoute: typeof LayoutMytasksImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/settings': {
      preLoaderRoute: typeof LayoutSettingsImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/target_groups': {
      preLoaderRoute: typeof LayoutTargetgroupsImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/task_results': {
      preLoaderRoute: typeof LayoutTaskresultsImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/tasks': {
      preLoaderRoute: typeof LayoutTasksImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/teams': {
      preLoaderRoute: typeof LayoutTeamsImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/': {
      preLoaderRoute: typeof LayoutIndexImport
      parentRoute: typeof LayoutImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  LayoutRoute.addChildren([
    LayoutAdminRoute,
    LayoutEmployeesRoute,
    LayoutItemsRoute,
    LayoutMyleavesRoute,
    LayoutMytasksRoute,
    LayoutSettingsRoute,
    LayoutTargetgroupsRoute,
    LayoutTaskresultsRoute,
    LayoutTasksRoute,
    LayoutTeamsRoute,
    LayoutIndexRoute,
  ]),
  LoginRoute,
  RecoverPasswordRoute,
  ResetPasswordRoute,
  SignupRoute,
])

/* prettier-ignore-end */
