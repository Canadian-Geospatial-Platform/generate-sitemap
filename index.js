const { getObjectIds } = require('./getObjectKeysFromS3.js')
const { putObjectToS3 } = require('./putObjectToS3.js')
const { generateSiteMapFile } = require('./generateSiteMapFile.js')
const { escapeSpecialXMLCharacters } = require('./utils.js')

// Todo: Catch error if routes is not set and return helpful error
const ROUTES = JSON.parse(process.env.ROUTES)

// Todo: Error handling
exports.handler = async (event) => {
    console.log("Start of sitemap generation.")
    const generatedSiteMaps = await generateSiteMaps()
    let res = await generateRootSiteMap(generatedSiteMaps)
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
            let storedSiteMaps = await storeSiteMaps(mapIds.data, siteMapCounter)
            generatedSiteMaps = generatedSiteMaps.concat(storedSiteMaps)
        }
        siteMapCounter++
    }
    return generatedSiteMaps
}

//todo: return result and handle error on s3 write
async function storeSiteMaps(mapIds, prefix) {
    let i = 0
    let generatedSiteMaps = []
    let writeToS3Requests = []
    ROUTES.forEach(e => {
        const siteMap = generateSiteMapFile(mapIds, escapeSpecialXMLCharacters(process.env.BASE_URL + e))
        writeToS3Requests.push(putObjectToS3(process.env.OUTPUT_BUCKET, process.env.OUTPUT_BUCKET_PREFIX + prefix + '-' + i + '-sitemap.xml', siteMap))
        generatedSiteMaps.push(process.env.OUTPUT_BUCKET_PREFIX + prefix + '-' + i + '-sitemap.xml')
        i++
    })
    await Promise.all(writeToS3Requests)
    return generatedSiteMaps;
}

async function generateRootSiteMap(siteMaps) {
    const siteMap = generateSiteMapFile(siteMaps, process.env.BASE_URL + '/')
    console.log("Putting root sitemap here:", process.env.OUTPUT_BUCKET, process.env.ROOT_SITEMAP_OUTPUT_BUCKET_PREFIX + 'sitemap.xml')
    const ret = await putObjectToS3(process.env.OUTPUT_BUCKET, process.env.ROOT_SITEMAP_OUTPUT_BUCKET_PREFIX + 'sitemap.xml', siteMap)
    return ret
}

