import React from 'react'
import { types } from 'react-bricks/frontend'
import Link from 'next/link'
import dayjs from 'dayjs'
import { POST_CATEGORIES, PostCategory } from './constants'
import { usePosts } from '../../components/PostsContext'
import { ArKUIColours, ArkUIColourValue } from '@bazel-digital/ark-ui/dist/colors'

interface PostListProps {
    filterCategory?: PostCategory | ''
    backgroundColour: ArkUIColourValue
    borderColour: ArkUIColourValue
    postLimit: number
}

const ArticleCard: React.FC<{ post: types.Page; borderClass: string }> = ({ post, borderClass }) => {
    return (
        <Link
            href={`/article/${post.slug}`}
            className={`group block relative h-72 border-2 ${borderClass} hover:shadow-xl transition-all overflow-hidden`}
        >
            {/* Background Image - spans entire card */}
            {post.customValues?.featuredImage && (
                <img
                    src={post.customValues.featuredImage.src || post.customValues.featuredImage}
                    alt={post.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            )}

            {/* Gradient overlay for text legibility */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.9) 80%)'
                }}
            />

            {/* Text content - positioned at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                {post.customValues?.category && (
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-black/50 text-gray-200 rounded mb-2 backdrop-blur-sm">
                        {post.customValues.category}
                    </span>
                )}
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-gray-100 transition-colors drop-shadow-lg">
                    {post.name}
                </h3>
                {post.customValues?.date && (
                    <div className="text-sm text-gray-300 mb-2 drop-shadow">
                        {dayjs(post.customValues.date).format('MMMM D, YYYY')}
                    </div>
                )}

                {post.customValues?.description && (
                    <p className="text-gray-200 line-clamp-2 drop-shadow">
                        {post.customValues.description}
                    </p>
                )}
            </div>
        </Link>
    )
}

const BORDER_OPTIONS = [
    {
        label: 'Black (Subtle)',
        value: {
            color: '#0D0D0D',
            className: 'border-white/10 hover:border-white/20'
        }
    },
    {
        label: 'Light Gray',
        value: {
            color: '#E5E7EB',
            className: 'border-gray-200 hover:border-gray-300'
        }
    },
    {
        label: 'Slate',
        value: {
            color: '#94A3B8',
            className: 'border-slate-400 hover:border-slate-300'
        }
    },
    {
        label: 'Dark Gray',
        value: {
            color: '#111827',
            className: 'border-gray-900 hover:border-gray-700'
        }
    },
    {
        label: 'Yellow',
        value: {
            color: '#FACC15',
            className: 'border-yellow-400/50 hover:border-yellow-400'
        }
    },
    {
        label: 'Purple',
        value: {
            color: '#D8B4FE',
            className: 'border-purple-300 hover:border-purple-200'
        }
    },
    {
        label: 'Rose',
        value: {
            color: '#FDA4AF',
            className: 'border-rose-300 hover:border-rose-200'
        }
    },
    {
        label: 'Teal',
        value: {
            color: '#2DD4BF',
            className: 'border-teal-400 hover:border-teal-500'
        }
    }
]

const PostList: types.Brick<PostListProps> = ({
    filterCategory,
    backgroundColour = ArKUIColours.BLACK.value,
    borderColour = BORDER_OPTIONS[0].value,
    postLimit = 0, // 0 = unlimited
}) => {
    const { posts } = usePosts()

    // Filter posts based on category and published status (implicit in fetchPages usually, but good to check)
    const filteredPosts = posts
        .filter((post) => {
            if (filterCategory && post.customValues?.category !== filterCategory) {
                return false
            }
            return true
        })
        .sort((a, b) => {
            // Sort by date descending
            const dateA = a.customValues?.date ? new Date(a.customValues.date) : new Date(0)
            const dateB = b.customValues?.date ? new Date(b.customValues.date) : new Date(0)
            return dateB.getTime() - dateA.getTime()
        })

    console.log(posts)

    // Use the className directly from the selected option
    const borderClass = borderColour.className

    return (
        <div
            className="py-12 px-6"
            style={{
                backgroundColor: backgroundColour?.color || ArKUIColours.BLACK.value.color,
            }}
        >
            <div className="max-w-5xl mx-auto">
                {filteredPosts.length === 0 ? (
                    <div className="text-center text-gray-400">No posts found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(postLimit > 0 ? filteredPosts.slice(0, postLimit) : filteredPosts).map((post) => (
                            <ArticleCard key={post.id} post={post} borderClass={borderClass} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

PostList.schema = {
    name: 'post-list',
    label: 'Post List',
    category: 'blog',
    getDefaultProps: () => ({
        filterCategory: '',
        backgroundColour: ArKUIColours.BLACK.value,
        borderColour: BORDER_OPTIONS[0].value,
        postLimit: 0,
    }),
    sideEditProps: [
        {
            groupName: 'Filter',
            props: [
                {
                    name: 'filterCategory',
                    label: 'Filter by Category',
                    type: types.SideEditPropType.Select,
                    selectOptions: {
                        display: types.OptionsDisplay.Select,
                        options: [
                            { value: '', label: 'All Categories' },
                            ...POST_CATEGORIES.map(c => ({ value: c, label: c }))
                        ]
                    },
                },
                {
                    name: 'postLimit',
                    label: 'Post Limit (0 = Unlimited)',
                    type: types.SideEditPropType.Number,
                },
            ],
        },
        {
            groupName: 'Styling',
            props: [
                {
                    name: 'backgroundColour',
                    label: 'Background Colour',
                    type: types.SideEditPropType.Select,
                    selectOptions: {
                        display: types.OptionsDisplay.Color,
                        options: [
                            ArKUIColours.BLACK,
                            ArKUIColours.TRANSPARENT,
                            ArKUIColours.GRAY,
                            ArKUIColours.WHITE,
                            ArKUIColours.YELLOW,
                            ArKUIColours.PURPLE,
                            ArKUIColours.ROSE,
                            ArKUIColours.TEAL,
                        ],
                    },
                },
                {
                    name: 'borderColour',
                    label: 'Border Colour',
                    type: types.SideEditPropType.Select,
                    selectOptions: {
                        display: types.OptionsDisplay.Color,
                        options: BORDER_OPTIONS,
                    },
                },
            ],
        },
    ],
}

export default PostList
