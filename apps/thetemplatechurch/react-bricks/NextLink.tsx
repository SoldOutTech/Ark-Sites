import Link from 'next/link'
import { useRouter } from 'next/router'
import { types } from 'react-bricks/frontend'

const NextLink: types.RenderLocalLink = ({
  href,
  target,
  className,
  activeClassName,
  children,
}) => {
  const router = useRouter()
  const normalizedHref = href.replace(/^\/(?=https?:\/\/)/, '')
  const isExternal = /^https?:\/\//.test(normalizedHref)

  let anchorClassName = ''

  if (router.asPath === normalizedHref) {
    anchorClassName = `${className} ${activeClassName}`
  } else {
    anchorClassName = className
  }

  if (isExternal) {
    return (
      <a
        href={normalizedHref}
        className={anchorClassName}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={normalizedHref} className={anchorClassName}>
      {children}
    </Link>
  )
}

export default NextLink
