import { useRouter } from 'next/router'
import { useEffect } from 'react'

const IndexPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/swap')
  }, [router])

  return null
}

IndexPage.chains = []

export default IndexPage
