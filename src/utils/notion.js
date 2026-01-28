export async function getProjects() {
    try {
        const response = await fetch('/api/projects');

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de la récupération');
        }

        const projects = await response.json();

        return projects;
    } catch (error) {
        throw error;
    }
}
