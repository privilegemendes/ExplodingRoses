export interface Site {
  name: string
  domain: string

  rootNotionPageId: string
  rootNotionSpaceId: string

  // settings
  html?: string
  fontFamily?: string
  darkMode?: boolean
  previewImages?: boolean

  // opengraph metadata
  description?: string
  image?: string
}

export interface SiteMap {
  site: Site
  canonicalPageMap: CanonicalPageMap
}

export interface CanonicalPageMap {
  [canonicalPageId: string]: string
}

export interface PageUrlOverridesMap {
  // maps from a URL path to the notion page id the page should be resolved to
  // (this overrides the built-in URL path generation for these pages)
  [pagePath: string]: string
}

export interface PageUrlOverridesInverseMap {
  // maps from a notion page id to the URL path the page should be resolved to
  // (this overrides the built-in URL path generation for these pages)
  [pageId: string]: string
}

export interface NotionPageInfo {
  pageId: string
  title: string
  image: string
  imageObjectPosition: string
  author: string
  authorImage: string
  detail: string
}
