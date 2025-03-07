/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as QuestionIndexImport } from './routes/question/index'
import { Route as ChatIndexImport } from './routes/chat/index'
import { Route as ChatChatIdImport } from './routes/chat/$chatId'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const QuestionIndexRoute = QuestionIndexImport.update({
  id: '/question/',
  path: '/question/',
  getParentRoute: () => rootRoute,
} as any)

const ChatIndexRoute = ChatIndexImport.update({
  id: '/chat/',
  path: '/chat/',
  getParentRoute: () => rootRoute,
} as any)

const ChatChatIdRoute = ChatChatIdImport.update({
  id: '/chat/$chatId',
  path: '/chat/$chatId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/chat/$chatId': {
      id: '/chat/$chatId'
      path: '/chat/$chatId'
      fullPath: '/chat/$chatId'
      preLoaderRoute: typeof ChatChatIdImport
      parentRoute: typeof rootRoute
    }
    '/chat/': {
      id: '/chat/'
      path: '/chat'
      fullPath: '/chat'
      preLoaderRoute: typeof ChatIndexImport
      parentRoute: typeof rootRoute
    }
    '/question/': {
      id: '/question/'
      path: '/question'
      fullPath: '/question'
      preLoaderRoute: typeof QuestionIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/chat/$chatId': typeof ChatChatIdRoute
  '/chat': typeof ChatIndexRoute
  '/question': typeof QuestionIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/chat/$chatId': typeof ChatChatIdRoute
  '/chat': typeof ChatIndexRoute
  '/question': typeof QuestionIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/chat/$chatId': typeof ChatChatIdRoute
  '/chat/': typeof ChatIndexRoute
  '/question/': typeof QuestionIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/chat/$chatId' | '/chat' | '/question'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/chat/$chatId' | '/chat' | '/question'
  id: '__root__' | '/' | '/chat/$chatId' | '/chat/' | '/question/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ChatChatIdRoute: typeof ChatChatIdRoute
  ChatIndexRoute: typeof ChatIndexRoute
  QuestionIndexRoute: typeof QuestionIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ChatChatIdRoute: ChatChatIdRoute,
  ChatIndexRoute: ChatIndexRoute,
  QuestionIndexRoute: QuestionIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/chat/$chatId",
        "/chat/",
        "/question/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/chat/$chatId": {
      "filePath": "chat/$chatId.tsx"
    },
    "/chat/": {
      "filePath": "chat/index.tsx"
    },
    "/question/": {
      "filePath": "question/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
