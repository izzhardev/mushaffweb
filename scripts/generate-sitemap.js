import fs from 'fs';
import path from 'path';
import https from 'https';

console.log('[Sitemap Builder] Initializing production-grade static sitemap generator...');

// Obtain paths
const CONFIG_FILE = path.join(process.cwd(), 'firebase-applet-config.json');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');
const ROBOTS_PATH = path.join(PUBLIC_DIR, 'robots.txt');

// 1. Verify/Create output directories
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// 2. Base domain detection (with Vercel and production safe options)
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mushaffindonesia.org').replace(/\/$/, '');

// 3. Fallback/Standard static lists for Programmatic SEO
const STATIC_PROGRAMS = ['wakaf-quran', 'rumah-quran', 'donasi-quran', 'belajar-mengaji'];
const STATIC_CITIES = [
  'jakarta', 'bandung', 'surabaya', 'yogyakarta', 'medan', 'makassar', 
  'semarang', 'palembang', 'malang', 'depok', 'tangerang', 'bekasi', 
  'bogor', 'solo', 'denpasar'
];

/**
 * Parses and formats dates from various Firestore forms to YYYY-MM-DD
 */
function parseDateToISOString(data) {
  if (!data) return new Date().toISOString().split('T')[0];
  
  // Handlers for Firestore dates
  const dateObj = data.updatedAt || data.createdAt || data;
  if (!dateObj) return new Date().toISOString().split('T')[0];

  if (typeof dateObj === 'string') {
    try {
      const d = new Date(dateObj);
      if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    } catch (_) {}
  }

  if (typeof dateObj === 'object') {
    if (dateObj.seconds || dateObj._seconds) {
      const sec = dateObj.seconds || dateObj._seconds;
      return new Date(sec * 1000).toISOString().split('T')[0];
    }
  }

  return new Date().toISOString().split('T')[0];
}

/**
 * HTTP request helper using standard https module (safe for Vercel node runtime builds)
 */
async function fetchFirestoreREST(collectionName) {
  console.log(`[Sitemap Builder] Attempting to query '${collectionName}' via REST...`);
  
  if (!fs.existsSync(CONFIG_FILE)) {
    console.warn(`[Sitemap Builder Warning] Config file not found at ${CONFIG_FILE}. Dynamic entries will rely on fallbacks.`);
    return [];
  }

  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    const projectId = config.projectId;
    const dbId = config.firestoreDatabaseId || '(default)';
    const apiKey = config.apiKey;

    if (!projectId) {
      console.warn('[Sitemap Builder Warning] projectId is missing in config file.');
      return [];
    }

    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents/${collectionName}${apiKey ? `?key=${apiKey}` : ''}`;
    
    return new Promise((resolve) => {
      https.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            const result = JSON.parse(rawData);
            if (result && result.error) {
              console.error(`[Sitemap Builder API Error] Database returned error for ${collectionName}:`, result.error.message || JSON.stringify(result.error));
              resolve([]);
              return;
            }

            const docs = [];
            if (result && result.documents) {
              result.documents.forEach((doc) => {
                const nameParts = doc.name.split('/');
                const id = nameParts[nameParts.length - 1];
                const fields = doc.fields || {};
                
                // Normalizing field types from Firestore REST API values
                const data = {};
                Object.keys(fields).forEach((key) => {
                  const valObj = fields[key];
                  if (valObj.stringValue !== undefined) {
                    data[key] = valObj.stringValue;
                  } else if (valObj.integerValue !== undefined) {
                    data[key] = parseInt(valObj.integerValue, 10);
                  } else if (valObj.doubleValue !== undefined) {
                    data[key] = parseFloat(valObj.doubleValue);
                  } else if (valObj.booleanValue !== undefined) {
                    data[key] = valObj.booleanValue;
                  } else if (valObj.timestampValue !== undefined) {
                    data[key] = valObj.timestampValue;
                  } else {
                    data[key] = valObj;
                  }
                });

                if (!data.createdAt && doc.createTime) data.createdAt = doc.createTime;
                if (!data.updatedAt && doc.updateTime) data.updatedAt = doc.updateTime;

                docs.push({ id, data });
              });
            }
            console.log(`[Sitemap Builder Success] Retrieved ${docs.length} records for ${collectionName}.`);
            resolve(docs);
          } catch (e) {
            console.error(`[Sitemap Builder Parser Error] Parsing results for ${collectionName} failed:`, e);
            resolve([]);
          }
        });
      }).on('error', (err) => {
        console.error(`[Sitemap Builder Connection Error] Fetching ${collectionName} failed:`, err);
        resolve([]);
      });
    });
  } catch (err) {
    console.error(`[Sitemap Builder Critical] Fetch init for ${collectionName} crashed:`, err);
    return [];
  }
}

// 4. Core generation logic
async function run() {
  const sitemapEntries = [];
  const currentDateStr = new Date().toISOString().split('T')[0];

  // A. Static core pages
  const corePages = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/about', changefreq: 'weekly', priority: '0.7' },
    { loc: '/gallery', changefreq: 'weekly', priority: '0.7' },
    { loc: '/donate', changefreq: 'daily', priority: '0.9' }
  ];

  corePages.forEach(p => {
    sitemapEntries.push({
      loc: `${BASE_URL}${p.loc}`,
      lastmod: currentDateStr,
      changefreq: p.changefreq,
      priority: p.priority
    });
  });

  // B. Dynamic: Articles
  const articles = await fetchFirestoreREST('articles');
  articles.forEach(article => {
    const slug = article.data.slug || article.id;
    sitemapEntries.push({
      loc: `${BASE_URL}/article/${slug}`,
      lastmod: parseDateToISOString(article.data),
      changefreq: 'weekly',
      priority: '0.8'
    });
  });

  // C. Dynamic: Pages (Custom subpages)
  const pages = await fetchFirestoreREST('pages');
  pages.forEach(page => {
    const slug = page.data.slug || page.id;
    sitemapEntries.push({
      loc: `${BASE_URL}/page/${slug}`,
      lastmod: parseDateToISOString(page.data),
      changefreq: 'weekly',
      priority: '0.7'
    });
  });

  // D. Dynamic: Campaigns (Donations)
  const campaigns = await fetchFirestoreREST('campaigns');
  campaigns.forEach(campaign => {
    sitemapEntries.push({
      loc: `${BASE_URL}/donate/${campaign.id}`,
      lastmod: parseDateToISOString(campaign.data),
      changefreq: 'daily',
      priority: '0.9'
    });
  });

  // E. Dynamic & Preprogrammed: Programs
  // Fetch programs collection dynamically
  const dbPrograms = await fetchFirestoreREST('programs');
  const programUrlsAdded = new Set();

  dbPrograms.forEach(prog => {
    const category = prog.data.category || prog.data.programSlug || prog.id;
    const city = prog.data.city || prog.data.citySlug;
    if (category && city) {
      const fullPath = `/program/${category}/${city}`.toLowerCase();
      if (!programUrlsAdded.has(fullPath)) {
        programUrlsAdded.add(fullPath);
        sitemapEntries.push({
          loc: `${BASE_URL}${fullPath}`,
          lastmod: parseDateToISOString(prog.data),
          changefreq: 'weekly',
          priority: '0.9'
        });
      }
    }
  });

  // Supplement with programmatic regional SEO combos to ensure high coverage
  STATIC_PROGRAMS.forEach(progSlug => {
    STATIC_CITIES.forEach(citySlug => {
      const fullPath = `/program/${progSlug}/${citySlug}`.toLowerCase();
      if (!programUrlsAdded.has(fullPath)) {
        programUrlsAdded.add(fullPath);
        sitemapEntries.push({
          loc: `${BASE_URL}${fullPath}`,
          lastmod: currentDateStr,
          changefreq: 'weekly',
          priority: '0.9'
        });
      }
    });
  });

  // F. Format XML entries
  const xmlElements = sitemapEntries.map(entry => {
    return `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
  }).join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlElements}
</urlset>`;

  // Write sitemap.xml
  try {
    fs.writeFileSync(SITEMAP_PATH, sitemapXml, 'utf8');
    console.log(`[Sitemap Builder Success] Successfully generated stable dynamic sitemap with ${sitemapEntries.length} items at: ${SITEMAP_PATH}`);
  } catch (err) {
    console.error('[Sitemap Builder Error] Unable to write sitemap.xml to disk:', err);
  }

  // G. Autogenerate a clean robots.txt pointing to the correct Vercel-dynamic URL
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
  try {
    fs.writeFileSync(ROBOTS_PATH, robotsTxt, 'utf8');
    console.log(`[Sitemap Builder Success] Successfully generated robots.txt pointing to ${BASE_URL}/sitemap.xml`);
  } catch (err) {
    console.error('[Sitemap Builder Error] Unable to write robots.txt to disk:', err);
  }
}

// Kick off
run().then(() => {
  console.log('[Sitemap Builder] Execution complete.');
}).catch(err => {
  console.error('[Sitemap Builder Failure] Execution crashed:', err);
});
