export async function getPortfolioItems() {
  const databaseId = import.meta.env.NOTION_DATABASE_ID;
  const apiKey = import.meta.env.NOTION_API_KEY;
  const url = `https://api.notion.com/v1/databases/${databaseId}/query`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sorts: [
          {
            property: "Date",
            direction: "descending",
          },
        ],
      })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || response.statusText);
    }

    const data = await response.json();
    return data.results;

  } catch (error) {
    console.error("Erreur récupération Notion:", error);
    return [];
  }
}
