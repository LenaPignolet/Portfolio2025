const apiKey = import.meta.env.VITE_NOTION_API_KEY;
const databaseId = import.meta.env.VITE_NOTION_DATABASE_ID;

export async function GET() {
    console.log('🔄 API Route: Récupération des projets depuis Notion...');

    const url = `https://api.notion.com/v1/databases/${databaseId}/query`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sorts: [
                    {
                        property: 'Date',
                        direction: 'descending',
                    },
                ],
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Erreur Notion API:', error);
            return new Response(JSON.stringify({ error: error.message }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const data = await response.json();
        console.log(`✅ ${data.results.length} projet(s) récupéré(s)`);

        // Transforme les données
        const projects = data.results.map(transformProject);

        return new Response(JSON.stringify(projects), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('❌ Erreur:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

function transformProject(project) {
    const props = project.properties ?? {};

    const images =
        props.Image?.files
            ?.map((file) => {
                if (file.type === 'file') return file.file.url;
                if (file.type === 'external') return file.external.url;
                return null;
            })
            .filter(Boolean) ?? [];

    return {
        id: project.id,
        title: props.Nom?.title?.[0]?.plain_text ?? 'Sans titre',
        description: props.Description?.rich_text?.[0]?.plain_text ?? '',
        date: props.Date?.date?.start ?? '',
        tags: props.Tag?.multi_select?.map((t) => t.name) ?? [],
        images,
    };
}
