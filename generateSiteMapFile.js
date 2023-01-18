function generateSiteMapFile(mapIds, baseUrl, isParentSitemap) {
    const keyName = isParentSitemap ? "sitemapindex" : "urlset "
    let ret = '<?xml version="1.0" encoding="UTF-8"?>\n<' + keyName + ' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    ret += generateAllRouteXML(mapIds, baseUrl, isParentSitemap)
    ret += '</' + keyName + '>'
    return ret
}

function generateAllRouteXML(mapIds, baseUrl, isParentSitemap) {
    let ret = ''
    mapIds.forEach((e) => ret = ret + generateRouteXML(baseUrl, e, null, isParentSitemap))
    return ret
}

function generateRouteXML(baseUrl, UUID, dateModified, isParentSitemap) {
    const keyName = isParentSitemap ? "sitemap" : "url"
    let ret = '<' + keyName + '>\n  <loc>' + baseUrl + UUID + '</loc>\n'
    if (dateModified) ret = ret + ' <lastmod>' + dateModified + '</lastmod>\n'
    ret = ret + '</' + keyName + '>\n'
    return ret
}

module.exports = {
    generateSiteMapFile
}