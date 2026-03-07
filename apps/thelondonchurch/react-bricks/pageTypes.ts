import { types } from 'react-bricks/frontend'
import { AUTHORS, POST_CATEGORIES } from '@bazel-digital/ark-ui'

const pageTypes: types.IPageType[] = [
  {
    name: 'page',
    pluralName: 'pages',
    defaultLocked: false,
    defaultStatus: types.PageStatus.Published,
    getDefaultContent: () => [],
    excludedBlockTypes: [],
  },
  {
    name: 'post',
    pluralName: 'Posts',
    defaultLocked: false,
    defaultStatus: types.PageStatus.Published,
    getDefaultContent: () => [
      {
        id: `hero-${Math.random()}`,
        type: 'hero',
        props: {
          title: 'New Post Title',
          subtitle: 'Subtitle or Author Name',
        },
      },
      {
        id: `metadata-${Math.random()}`,
        type: 'post-metadata',
        props: {},
      },
      {
        id: `body-${Math.random()}`,
        type: 'article-body',
        props: {},
      },
      {
        id: `author-${Math.random()}`,
        type: 'post-author',
        props: {},
      },
    ],
    isEntity: true,
    excludedBlockTypes: [],

    customFields: [
      {
        name: 'category',
        label: 'Category',
        type: types.SideEditPropType.Select,
        selectOptions: {
          display: types.OptionsDisplay.Select,
          options: POST_CATEGORIES.map((category) => ({
            value: category,
            label: category,
          })),
        },
      },
      {
        name: 'date',
        label: 'Date',
        type: types.SideEditPropType.Date,
      },
      {
        name: 'description',
        label: 'Description',
        type: types.SideEditPropType.Textarea,
      },
      {
        name: 'author',
        label: 'Author',
        type: types.SideEditPropType.Select,
        selectOptions: {
          display: types.OptionsDisplay.Select,
          options: [
            ...AUTHORS.map((author) => ({
              value: author.id,
              label: author.name,
            })),
            { value: '', label: 'Custom (Legacy)' },
          ],
        },
      },
      {
        name: 'featuredImage',
        label: 'Featured Image',
        type: types.SideEditPropType.Image,
      },
    ],
  },
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
