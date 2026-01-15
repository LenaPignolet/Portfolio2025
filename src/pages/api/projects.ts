import { getPortfolioItems } from '../../lib/notion'

export async function GET() {
  const projects = await getPortfolioItems()

  return new Response(JSON.stringify(projects), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
