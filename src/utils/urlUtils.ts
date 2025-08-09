import { useSearchParams } from 'react-router-dom'

/**
 * Custom hook to get search query from URL params
 * @returns search query string from 'q' parameter
 */
export const useSearchQuery = () => {
  const [searchParams] = useSearchParams()
  return searchParams.get('q') || ''
}

/**
 * Get search query from URLSearchParams
 * @param searchParams - URLSearchParams object
 * @returns search query string from 'q' parameter
 */
export const getSearchQuery = (searchParams: URLSearchParams) => {
  return searchParams.get('q') || ''
}

/**
 * Create search URL with query parameter
 * @param query - search query string
 * @param basePath - base path for search (default: '/search')
 * @returns formatted search URL with query parameter
 */
export const createSearchUrl = (query: string, basePath: string = '/search') => {
  if (!query) return basePath
  return `${basePath}?q=${encodeURIComponent(query)}`
}

/**
 * Update search query in current URL
 * @param newQuery - new search query
 * @returns URLSearchParams with updated query
 */
export const updateSearchQuery = (newQuery: string) => {
  const params = new URLSearchParams(window.location.search)
  if (newQuery) {
    params.set('q', newQuery)
  } else {
    params.delete('q')
  }
  return params
}