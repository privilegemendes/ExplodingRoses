/**
 * Site-wide app configuration.
 *
 * This file pulls from the root "site.config.ts" as well as environment variables
 * for optional depenencies.
 */
import { getEnv, getSiteConfig } from "./get-config-value";

export const environment = process.env.NODE_ENV || 'development'
export const isDev = environment === 'development'

// general site config
export const name: string = getSiteConfig('name')
export const author: string = getSiteConfig('author')
export const domain: string = getSiteConfig('domain')
export const description: string = getSiteConfig('description', 'Notion Blog')
export const language: string = getSiteConfig('language', 'en')

// social accounts
export const twitter: string | null = getSiteConfig('twitter', null)
export const github: string | null = getSiteConfig('github', null)
export const linkedin: string | null = getSiteConfig('linkedin', null)

// ----------------------------------------------------------------------------
export const port = getEnv('PORT', '3000')
export const host = isDev ? `http://localhost:${port}` : `https://${domain}`
// ----------------------------------------------------------------------------
