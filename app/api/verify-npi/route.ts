export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const npi = searchParams.get('npi')

  if (!npi || npi.length !== 10) {
    return Response.json({ error: 'Invalid NPI' }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://npiregistry.cms.hhs.gov/api/?number=${npi}&version=2.1`,
      { headers: { 'Content-Type': 'application/json' } }
    )
    const data = await res.json()
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: 'Failed to reach NPI registry' }, { status: 500 })
  }
}
