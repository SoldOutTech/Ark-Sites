import React, { createContext, useContext } from 'react'
import { types } from 'react-bricks/frontend'

interface PostsContextType {
    posts: types.Page[]
}

const PostsContext = createContext<PostsContextType>({ posts: [] })

export const PostsProvider: React.FC<{ posts: types.Page[]; children: React.ReactNode }> = ({
    posts,
    children,
}) => {
    return (
        <PostsContext.Provider value={{ posts }}>
            {children}
        </PostsContext.Provider>
    )
}

export const usePosts = () => useContext(PostsContext)
