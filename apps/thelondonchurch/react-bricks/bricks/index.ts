import { types } from 'react-bricks/frontend'
import arkUI from "@bazel-digital/ark-ui"

import PostList from './PostList'
import ArticleBody from './ArticleBody'
import PostAuthor from './PostAuthor'
import PostMetadata from './PostMetadata'

// Helper to add 'post' to restrictedTo
const spreadArkUI = (theme: types.Theme) => {
  theme.categories.forEach((category) => {
    category.bricks.forEach((brick) => {
      // If the brick has restrictions, add 'post' to them
      const schema = brick.schema as any
      if (
        schema &&
        schema.restrictedTo &&
        schema.restrictedTo.length > 0 &&
        !schema.restrictedTo.includes('post')
      ) {
        schema.restrictedTo.push('post')
      }
    })
  })
  return theme
}

const bricks: types.Theme[] = [
  spreadArkUI(arkUI),
  {
    themeName: 'Default',
    categories: [
      {
        categoryName: 'Blog',
        bricks: [PostList, ArticleBody, PostAuthor, PostMetadata],
      },
    ],
  },
]

export default bricks
