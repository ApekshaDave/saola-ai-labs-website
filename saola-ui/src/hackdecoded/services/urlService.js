export async function fetchArticleFromUrl(url) {
  try { new URL(url) } catch { throw new Error('Please enter a valid URL starting with https://') }
  const response = await fetch('/api/fetchArticle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  })
  if (!response.ok) {
    if (response.status === 404) throw new Error('URL fetching only works on the deployed site. Use Paste Text tab for local testing.')
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to fetch article')
  }
  const data = await response.json()
  return data.text
}