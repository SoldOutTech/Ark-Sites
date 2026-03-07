
export interface Author {
    id: string
    name: string
    role?: string
    bio?: string
    avatar: string
    socials?: {
        twitter?: string
        linkedin?: string
        website?: string
        instagram?: string
        facebook?: string
        youtube?: string
        spotify?: string
        apple?: string
        phone?: string
        whatsapp?: string
        location?: string
        link?: string
    }
}

export const AUTHORS: Author[] = [
    {
        id: 'michael-williamson',
        name: 'Dr. Michael Williamson',
        role: 'Senior Pastor',
        avatar: 'https://assets.reactbricks.com/k_nYc5liEhSJoo6/images/original/Cv0I1ueTanUvz6X/michael-profile-headshot-solo.webp',
        bio: 'Senior Evangelist at The London Church.',
        socials: {
            instagram: 'https://www.instagram.com/_michaeltwilliamson/',
        },
    },
    {
        id: 'guest',
        name: 'Guest Contributor',
        role: 'Guest',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        bio: 'Sharing insights and stories from the community.',
    },
]
