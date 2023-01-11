const { getObjectIds } = require('./getObjectKeysFromS3.js')
const { putObjectToS3 } = require('./putObjectToS3.js')
const { generateSiteMapFile } = require('./generateSiteMapFile.js')
const { escapeSpecialXMLCharacters } = require('./utils.js')

const ROUTES = JSON.parse(process.env.ROUTES)

// Todo: Error handling
// Todo: Investigate the fact that it seems we need to run twice for the root sitemap to be written to s3. Maybe the write request is lost because we are still writing the keys?
exports.handler = async (event) => {
    const generatedSiteMaps = await generateSiteMaps()
    await generateRootSiteMap(generatedSiteMaps)
    const response = {
        statusCode: 200,
        body: 'Execution complete. Look at logs to see if any errors where thrown.',
    };
    return response;
};

async function generateSiteMaps() {
    let siteMapCounter = 0 // One sitemap per slice of ids. Should be 50k.
    let startAfter = undefined // Equivalent to SQL offset
    let generatedSiteMaps = []
    while (startAfter || !siteMapCounter) {
        const mapIds = await getObjectIds(startAfter, process.env.MAX_SITEMAP_ITEM_COUNT, process.env.INPUT_BUCKET, process.env.INPUT_BUCKET_PREFIX)
        startAfter = mapIds.startAfter
        if (mapIds.data.length > 0) {
            let storedSiteMaps = storeSiteMaps(mapIds.data, siteMapCounter)
            generatedSiteMaps = generatedSiteMaps.concat(storedSiteMaps)
        }
        siteMapCounter++
    }
    return generatedSiteMaps
}

function storeSiteMaps(mapIds, prefix) {
    let i = 0
    let generatedSiteMaps = []
    ROUTES.forEach(e => {
        const siteMap = generateSiteMapFile(mapIds, escapeSpecialXMLCharacters(process.env.BASE_URL + e))
        putObjectToS3(process.env.OUTPUT_BUCKET, process.env.OUTPUT_BUCKET_PREFIX + prefix + '-' + i + '-sitemap.xml', siteMap)
        generatedSiteMaps.push(process.env.OUTPUT_BUCKET_PREFIX + prefix + '-' + i + '-sitemap.xml')
        i++
    })
    return generatedSiteMaps;
}

async function generateRootSiteMap(siteMaps) {
    const siteMap = generateSiteMapFile(siteMaps, process.env.BASE_URL + '/')
    console.log(siteMap)
    putObjectToS3(process.env.OUTPUT_BUCKET, process.env.ROOT_SITEMAP_OUTPUT_BUCKET_PREFIX + 'sitemap.xml', siteMap)
}
