function generateSiteMapFile(mapIds, baseUrl) {
    let ret = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    ret += generateAllRouteXML(mapIds, baseUrl)
    ret += '</urlset>'
    return ret
}

function generateAllRouteXML(mapIds, baseUrl) {
    let ret = ''
    mapIds.forEach((e) => ret = ret + generateRouteXML(baseUrl, e, null))
    return ret
}

function generateRouteXML(baseUrl, UUID, dateModified) {
    let ret = '<url>\n  <loc>' + baseUrl + UUID + '</loc>\n'
    if (dateModified) ret = ret + ' <lastmod>' + dateModified + '</lastmod>\n'
    ret = ret + '</url>\n'
    return ret
}

module.exports = {
    generateSiteMapFile
}