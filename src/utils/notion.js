const CACHE_KEY = 'portfolio_projects';
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 heures

let fetchPromise = null;
let imagesPreloaded = false;


function isCacheValid(cache) {
  if (!cache || !cache.timestamp || !cache.data) return false;
  return Date.now() - cache.timestamp < CACHE_DURATION;
}

function getFromCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    if (isCacheValid(parsed)) {
      return parsed.data;
    }

    console.log("Cache expiré");
    return null;
  } catch (e) {
    console.warn("Cache corrompu, suppression...");
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function saveToCache(projects) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data: projects,
      })
    );
    console.log("Projets sauvegardés dans le cache");
  } catch (e) {
    console.error("Erreur lors de la sauvegarde du cache:", e);
  }
}

async function fetchFromAPI() {
  
  const response = await fetch('/api/projects');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de la récupération');
  }
  
  const projects = await response.json();
  
  return projects;
}

function preloadImages(projects) {
  if (imagesPreloaded) {
    console.log("Images déjà préchargées");
    return;
  }

  const allImages = projects.flatMap(project => project.images || []);
  
  if (allImages.length === 0) {
    imagesPreloaded = true;
    return;
  }

  let loadedCount = 0;
  
  allImages.forEach((imageUrl, index) => {
    const img = new Image();
    
    img.onload = () => {
      loadedCount++;
      if (loadedCount === allImages.length) {
        imagesPreloaded = true;
      }
    };
    
    img.onerror = () => {
      loadedCount++;
      console.warn(`Erreur de chargement pour l'image ${index + 1}`);
      if (loadedCount === allImages.length) {
        imagesPreloaded = true;
      }
    };
    
    img.src = imageUrl;
  });
}

export async function getProjects() {
  const cachedProjects = getFromCache();
  if (cachedProjects) {
    if (!imagesPreloaded) {
      preloadImages(cachedProjects);
    }
    return cachedProjects;
  }

  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = fetchFromAPI()
    .then(projects => {
      saveToCache(projects);
      preloadImages(projects);
      fetchPromise = null;
      return projects;
    })
    .catch(error => {
      fetchPromise = null;
      throw error;
    });

  return fetchPromise;
}

export async function preloadProjects() {
  const cachedProjects = getFromCache();
  if (cachedProjects) {
    if (!imagesPreloaded) {
      preloadImages(cachedProjects);
    }
    return;
  }

  getProjects().catch(err => {
    console.error("Erreur lors du préchargement:", err);
  });
}

export function clearProjectsCache() {
  localStorage.removeItem(CACHE_KEY);
  fetchPromise = null;
  imagesPreloaded = false;
}
