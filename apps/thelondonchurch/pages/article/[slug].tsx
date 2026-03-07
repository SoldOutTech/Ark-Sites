import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import {
    PageViewer,
    cleanPage,
    fetchPage,
    fetchPages,
    types,
    useReactBricksContext,
    renderJsonLd,
    renderMeta,
} from 'react-bricks/frontend'

import ErrorNoFooter from '../../components/errorNoFooter'
import ErrorNoHeader from '../../components/errorNoHeader'
import ErrorNoKeys from '../../components/errorNoKeys'
import Layout from '../../components/layout'
import { PostsProvider } from '@bazel-digital/ark-ui'
import config from '../../react-bricks/config'

interface PageProps {
    page: types.Page
    header: types.Page
    footer: types.Page
    errorNoKeys: boolean
    errorPage: boolean
    errorHeader: boolean
    errorFooter: boolean
    posts: types.Page[]
}

const ArticlePage: React.FC<PageProps> = ({
    page,
    header,
    footer,
    errorNoKeys,
    errorPage,
    errorHeader,
    errorFooter,
    posts,
}) => {
    const { pageTypes, bricks } = useReactBricksContext()
    const pageOk = page ? cleanPage(page, pageTypes, bricks) : null
    const headerOk = header ? cleanPage(header, pageTypes, bricks) : null
    const footerOk = footer ? cleanPage(footer, pageTypes, bricks) : null

    return (
        <Layout>
            {pageOk && !errorPage && !errorNoKeys && (
                <>
                    <Head>
                        {renderMeta(pageOk)}
                        {renderJsonLd(pageOk)}
                        <link
                            rel="canonical"
                            href={`https://www.thelondon.church/article/${pageOk.slug}`}
                        />
                    </Head>
                    <PostsProvider posts={posts}>
                        {headerOk && !errorHeader ? (
                            <PageViewer page={headerOk} showClickToEdit={false} />
                        ) : (
                            <ErrorNoHeader />
                        )}
                        <PageViewer page={pageOk} />
                        {footerOk && !errorFooter ? (
                            <PageViewer page={footerOk} showClickToEdit={false} />
                        ) : (
                            <ErrorNoFooter />
                        )}
                    </PostsProvider>
                </>
            )}
            {errorNoKeys && <ErrorNoKeys />}
        </Layout>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    let errorNoKeys: boolean = false
    let errorPage: boolean = false
    let errorHeader: boolean = false
    let errorFooter: boolean = false

    if (!config.apiKey) {
        errorNoKeys = true
        return { props: { errorNoKeys } }
    }

    const { slug } = context.params
    // slug is a string here because file is [slug].tsx (unless catch all)

    const cleanSlug = slug as string

    const [page, header, footer, allPages] = await Promise.all([
        fetchPage(cleanSlug, config.apiKey, context.locale, config.pageTypes).catch(
            () => {
                errorPage = true
                return {}
            }
        ),
        fetchPage('header', config.apiKey, context.locale).catch(() => {
            errorHeader = true
            return {}
        }),
        fetchPage('footer', config.apiKey, context.locale).catch(() => {
            return {}
        }),
        fetchPages(config.apiKey).catch(() => []),
    ])

    const posts = (allPages as types.Page[]).filter(p => p.type === 'post')

    return {
        props: {
            page,
            header,
            footer,
            errorNoKeys,
            errorPage,
            errorHeader,
            errorFooter,
            posts,
        },
        revalidate: 30,
    }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
    if (!config.apiKey) {
        return { paths: [], fallback: true }
    }

    const allPages = await fetchPages(config.apiKey)

    const paths = allPages
        .filter(page => page.type === 'post')
        .map((page) =>
            page.translations
                .filter(
                    (translation) => context.locales.indexOf(translation.language) > -1
                )
                .map((translation) => ({
                    params: {
                        slug: translation.slug, // Single string expected for [slug].tsx
                    },
                    locale: translation.language,
                }))
        )
        .flat()

    return { paths, fallback: false }
}

export default ArticlePage
