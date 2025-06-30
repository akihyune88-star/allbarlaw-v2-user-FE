import { useEffect, useState } from 'react'

type UseDelayedLoadingProps = {
  delay?: number
  initialLoading?: boolean
}

const useDelayedLoading = ({ delay = 3000, initialLoading = true }: UseDelayedLoadingProps = {}) => {
  const [showLoading, setShowLoading] = useState(initialLoading)

  useEffect(() => {
    if (!initialLoading) return undefined

    const timer = setTimeout(() => {
      setShowLoading(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, initialLoading])

  return { showLoading, setShowLoading }
}

export default useDelayedLoading
