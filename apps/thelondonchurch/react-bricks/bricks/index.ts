import { types } from 'react-bricks/frontend'
import arkUI from "@bazel-digital/ark-ui"

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
]

export default bricks
