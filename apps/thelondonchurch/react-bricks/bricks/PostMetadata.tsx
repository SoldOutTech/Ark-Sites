import React from 'react'
import { types, usePageValues } from 'react-bricks/frontend'
import dayjs from 'dayjs'
import { ArKUIColours, ArkUIColourValue } from '@bazel-digital/ark-ui/src/colors'

interface PostMetadataProps {
    backgroundColour: ArkUIColourValue
}

const PostMetadata: types.Brick<PostMetadataProps> = ({
    backgroundColour = ArKUIColours.TRANSPARENT.value // Fallback default
}) => {
    const [pageValues] = usePageValues()
    const { date, category } = pageValues.customValues || {}

    if (!date && !category) return null

    return (
        <div
            className="p-6 flex flex-col items-center space-x-4"
            style={{
                backgroundColor: backgroundColour ? backgroundColour.color : 'transparent',
            }}
        >
            <div className="px-6 py-4 space-x-4">
                {category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-900 uppercase tracking-widest border border-gray-200">
                        {category}
                    </span>
                )}
                {date && (
                    <span className="text-md text-gray-500">
                        {dayjs(date).format('MMMM D, YYYY')}
                    </span>
                )}
            </div>
        </div>
    )
}

PostMetadata.schema = {
    name: 'post-metadata',
    label: 'Post Metadata',
    category: 'Blog',
    tags: ['metadata', 'date', 'category'],
    getDefaultProps: () => ({
        backgroundColour: ArKUIColours.TRANSPARENT.value,
    }),
    sideEditProps: [
        {
            groupName: 'Background',
            props: [
                {
                    name: 'backgroundColour',
                    label: 'Background Colour',
                    type: types.SideEditPropType.Select,
                    selectOptions: {
                        display: types.OptionsDisplay.Color,
                        options: [
                            ArKUIColours.TRANSPARENT,
                            ArKUIColours.BLACK,
                            ArKUIColours.GRAY,
                            ArKUIColours.WHITE,
                            ArKUIColours.YELLOW,
                            ArKUIColours.PURPLE,
                            ArKUIColours.ROSE,
                            ArKUIColours.TEAL,
                        ],
                    },
                },
            ],
        },
    ],
}

export default PostMetadata
