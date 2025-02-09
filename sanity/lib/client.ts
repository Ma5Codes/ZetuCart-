import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  stega: {
    studioUrl: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/studio`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/studio`,
  },
})

// Export sanityFetch Function
export async function sanityFetch(query: string, params = {}) {
  return client.fetch(query, params)
}
