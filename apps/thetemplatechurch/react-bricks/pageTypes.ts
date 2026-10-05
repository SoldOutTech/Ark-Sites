import { types } from 'react-bricks/frontend'

const pageTypes: types.IPageType[] = [
  {
    name: 'page',
    pluralName: 'pages',
    defaultLocked: false,
    defaultStatus: types.PageStatus.Published,
    getDefaultContent: () => [],
    excludedBlockTypes: [],
  },
  // {
  //   name: 'blog',
  //   pluralName: 'Blog',
  //   defaultLocked: false,
  //   defaultStatus: types.PageStatus.Published,
  //   getDefaultContent: () => [],
  //   allowedBlockTypes: [
  //     'title',
  //     'paragraph',
  //     'big-image',
  //     'video',
  //     'code',
  //     'tweet',
  //     'tweet-light',
  //     'blog-title',
  //     'newsletter-subscribe',
  //   ],
  //   excludedBlockTypes: ['pokemon'],
  // },
  {
    name: 'layout',
    pluralName: 'layout',
    defaultLocked: false,
    defaultStatus: types.PageStatus.Published,
    getDefaultContent: () => [],
    isEntity: true,
    excludedBlockTypes: [],
  },
]

export default pageTypes
