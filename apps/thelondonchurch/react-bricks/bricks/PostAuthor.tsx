"use client"

import React from 'react'
import { types, usePageValues, Text, RichText, Repeater, Image } from 'react-bricks/frontend'
import { AUTHORS } from './authors'
import { ArKUIColours, ArkUIColourValue } from '@bazel-digital/ark-ui/dist/colors'
import IconLink from '@bazel-digital/ark-ui/dist/Components/IconLink'

/**
 * PostAuthor - A wrapper that uses the ProfileGridItem layout pattern
 * but dynamically populates data based on the selected author from page metadata.
 * 
 * This component mirrors ProfileGridItem's structure and styling but allows
 * the author to be selected at the page level rather than edited per-brick.
 */

interface PostAuthorProps {
    // Background
    backgroundColour: ArkUIColourValue
}

const PostAuthor: types.Brick<PostAuthorProps> = ({
    backgroundColour = ArKUIColours.BLACK.value, // Fallback default
}) => {
    const [pageValues] = usePageValues()
    const authorId = pageValues.customValues?.author

    // Find the author - default to first author if none selected
    const author = AUTHORS.find(a => a.id === authorId) || AUTHORS[0]

    // Fallback (if AUTHORS array is somehow empty)
    const displayAuthor = author || {
        name: authorId || 'Unknown Author',
        role: 'Contributor',
        avatar: '/react-bricks-icon.svg',
        bio: '',
        socials: {}
    }

    // Create image source from author avatar
    const profileImage = {
        src: displayAuthor.avatar,
        placeholderSrc: displayAuthor.avatar,
        srcSet: '',
        alt: displayAuthor.name,
    }



    // Simple circle image container (no background image needed)
    const imageContentContainer = (
        <div
            style={{
                backgroundColor: backgroundColour ? backgroundColour.color : 'transparent',
            }}
            className="flex flex-col w-52 h-52 max-w-sm cursor-pointer rounded-full overflow-hidden justify-center items-center m-5 relative z-10"
        >
            {/* Profile Image - uses the background image styling from ProfileGridItem to fill the circle */}
            <Image
                source={profileImage}
                readonly
                imageClassName="w-[500px] object-cover rounded-full aspect-square"
                alt={displayAuthor.name}
            />
        </div>
    )

    return (
        <div
            className="flex flex-col items-center"
            style={{
                backgroundColor: backgroundColour ? backgroundColour.color : 'transparent',
            }}
        >
            {imageContentContainer}
            <h2 className="text-center font-bold text-lg text-white">
                {displayAuthor.name}
            </h2>

            {
                displayAuthor.role && (
                    <p className="z-10 text-md font-medium text-center leading-relaxed text-gray-100">
                        {displayAuthor.role}
                    </p>
                )
            }

            {displayAuthor.socials && Object.keys(displayAuthor.socials).length > 0 && (
                <div className="flex mt-2 flex-row space-x-2 items-center justify-center fill-white">
                    {Object.entries(displayAuthor.socials).map(([key, url]) => (
                        <IconLink key={key} iconType={key as any} href={url} />
                    ))}
                </div>
            )}
        </div>
    )

}

PostAuthor.schema = {
    name: 'post-author',
    label: 'Post Author',
    category: 'Blog',
    tags: ['author', 'profile', 'user'],
    hideFromAddMenu: false,
    getDefaultProps: () => ({
        backgroundColour: ArKUIColours.BLACK.value,
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
            ],
        },
    ],
}

export default PostAuthor
