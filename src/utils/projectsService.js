import { getPortfolioItems } from './notion.js';

const STORAGE_KEY = 'portfolio_projects';
const CACHE_DURATION = 1000 * 60 * 60; // 1 heure

// Vérifie si le cache est valide
function isCacheValid(cache) {
  if (!cache) return false;
  return Date.now() - cache.timestamp < CACHE_DURATION;
}

// Transforme les données Notion en format utilisable
function transformNotionProject(project) {
  const props = project.properties ?? {};
  
  // Récupère les images
  const images = props.Image?.files
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

// Récupère les projets (avec cache)
export async function getProjects(forceRefresh = false) {
  // Vérifie le cache d'abord
  if (!forceRefresh) {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (isCacheValid(parsed)) {
          console.log("📦 Projets chargés depuis le cache");
          return parsed.data;
        }
      } catch (e) {
        console.warn("⚠️ Cache corrompu, suppression...");
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  // Sinon, récupère depuis Notion
  console.log("🔄 Récupération des projets depuis Notion...");
  const rawProjects = await getPortfolioItems();
  
  if (!rawProjects || rawProjects.length === 0) {
    console.warn("⚠️ Aucun projet récupéré de Notion");
    return [];
  }

  const projects = rawProjects.map(transformNotionProject);

  // Sauvegarde dans le cache
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      timestamp: Date.now(),
      data: projects,
    })
  );

  console.log("✅ Projets récupérés et mis en cache:", projects.length);
  return projects;
}

// Preload les projets (à appeler au démarrage de l'app)
export async function preloadProjects() {
  const cached = localStorage.getItem(STORAGE_KEY);
  
  // Si le cache est valide, pas besoin de preload
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (isCacheValid(parsed)) {
        console.log("📦 Cache valide, pas de preload nécessaire");
        return;
      }
    } catch (e) {
      // Cache corrompu, on continue
    }
  }

  // Sinon, charge en arrière-plan
  console.log("🚀 Preload des projets en arrière-plan...");
  getProjects().catch(err => {
    console.error("❌ Erreur lors du preload:", err);
  });
}

// Efface le cache (utile pour débugger)
export function clearProjectsCache() {
  localStorage.removeItem(STORAGE_KEY);
  console.log("🗑️ Cache des projets supprimé");
}
