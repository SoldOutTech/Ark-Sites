import React from 'react'
import { types, RichText } from 'react-bricks/frontend'
import { ArKUIColours, ArkUIColourValue } from '@bazel-digital/ark-ui/src/colors'

interface ArticleBodyProps {
    textAlign: 'left' | 'center' | 'right' | 'justify'
    backgroundColour: ArkUIColourValue
    textColour: ArkUIColourValue
}

const ArticleBody: types.Brick<ArticleBodyProps> = ({
    textAlign = 'left',
    backgroundColour = ArKUIColours.BLACK.value,
    textColour = ArKUIColours.WHITE.value,
}) => {
    // Get text color for inline styles
    const textColor = textColour?.color || 'white'

    return (
        <div
            className={`px-6 py-4 text-${textAlign}`}
            style={{
                backgroundColor: backgroundColour?.color || ArKUIColours.BLACK.value.color,
            }}
        >
            <div className="max-w-3xl mx-auto">
                <RichText
                    propName="content"
                    placeholder="Start writing your story..."
                    allowedFeatures={[
                        types.RichTextFeatures.Bold,
                        types.RichTextFeatures.Italic,
                        types.RichTextFeatures.Highlight,
                        types.RichTextFeatures.Code,
                        types.RichTextFeatures.Link,
                        types.RichTextFeatures.Quote,
                        types.RichTextFeatures.Heading2,
                        types.RichTextFeatures.Heading3,
                        types.RichTextFeatures.OrderedList,
                        types.RichTextFeatures.UnorderedList,
                    ]}
                    renderH2={({ children }) => (
                        <h2
                            className="text-3xl font-bold mt-10 mb-4 lh-tight tracking-tight"
                            style={{ color: textColor }}
                        >
                            {children}
                        </h2>
                    )}
                    renderH3={({ children }) => (
                        <h3
                            className="text-2xl font-bold mt-8 mb-3 tracking-tight"
                            style={{ color: textColor, opacity: 0.9 }}
                        >
                            {children}
                        </h3>
                    )}
                    renderQuote={({ children }) => (
                        <blockquote
                            className="border-l-4 pl-6 py-2 my-8 italic text-xl font-serif leading-relaxed"
                            style={{ color: textColor, borderColor: textColor, opacity: 0.85 }}
                        >
                            {children}
                        </blockquote>
                    )}
                    renderUL={({ children }) => (
                        <ul
                            className="list-disc list-outside ml-6 mb-6 space-y-2 text-lg"
                            style={{ color: textColor, opacity: 0.9 }}
                        >
                            {children}
                        </ul>
                    )}
                    renderOL={({ children }) => (
                        <ol
                            className="list-decimal list-outside ml-6 mb-6 space-y-2 text-lg"
                            style={{ color: textColor, opacity: 0.9 }}
                        >
                            {children}
                        </ol>
                    )}
                    renderLink={({ children, href, target, rel }) => (
                        <a
                            href={href}
                            target={target}
                            rel={rel}
                            className="underline decoration-2 hover:opacity-80 transition-all font-medium"
                            style={{ color: textColor }}
                        >
                            {children}
                        </a>
                    )}
                    renderBlock={({ children }) => (
                        <p
                            className="text-lg font-medium leading-loose mb-6"
                            style={{ color: textColor, opacity: 0.9 }}
                        >
                            {children}
                        </p>
                    )}
                />
            </div>
        </div>
    )
}

ArticleBody.schema = {
    name: 'article-body',
    label: 'Article Body',
    category: 'Blog',
    tags: ['blog', 'text', 'rich content'],
    playgroundLinkLabel: 'View Code',
    playgroundLinkUrl: 'https://docs.reactbricks.com/documentation/bricks/rich-text',
    getDefaultProps: () => ({
        textAlign: 'left',
        backgroundColour: ArKUIColours.BLACK.value,
        textColour: ArKUIColours.WHITE.value,
        content: [
            {
                type: 'paragraph',
                children: [
                    { text: 'Start writing your story here. You can now use ' },
                    { text: 'headers', bold: true },
                    { text: ', quotes, and more!' },
                ],
            },
        ],
    }),
    sideEditProps: [
        {
            groupName: 'Layout',
            props: [
                {
                    name: 'textAlign',
                    label: 'Text Alignment',
                    type: types.SideEditPropType.Select,
                    selectOptions: {
                        display: types.OptionsDisplay.Radio,
                        options: [
                            { value: 'left', label: 'Left' },
                            { value: 'center', label: 'Center' },
                            { value: 'right', label: 'Right' },
                            { value: 'justify', label: 'Justify' },
                        ],
                    },
                },
            ],
        },
        {
            groupName: 'Colours',
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
                    name: 'textColour',
                    label: 'Text Colour',
                    type: types.SideEditPropType.Select,
                    selectOptions: {
                        display: types.OptionsDisplay.Color,
                        options: [
                            ArKUIColours.WHITE,
                            ArKUIColours.BLACK,
                            ArKUIColours.GRAY,
                            ArKUIColours.YELLOW,
                            ArKUIColours.PURPLE,
                            ArKUIColours.ROSE,
                            ArKUIColours.TEAL,
                            ArKUIColours.BLUE,
                        ],
                    },
                },
            ],
        },
    ],
}

export default ArticleBody
