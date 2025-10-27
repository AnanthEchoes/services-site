// lib/sanity.ts
import { createClient } from '@sanity/client';

export const sanity = createClient({
  projectId: 'e7jhrjvu', // replace with your Sanity project ID
  dataset: 'production',        // or your dataset name
  useCdn: false,                // `true` for faster, cached responses
  apiVersion: '2025-09-30',     // use today's date
});
