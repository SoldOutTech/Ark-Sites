export const POST_CATEGORIES = [
    'Bible Studies',
    'News',
    'General',
] as const

export type PostCategory = typeof POST_CATEGORIES[number]
