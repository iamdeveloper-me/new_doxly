window.onload = function() {
  PDFViewerApplication.download = function() {
    path = PDFViewerApplication.url
    queryString = path.split('?')[1]
    pathArray = path.split('/')
    pathArray.pop()
    downloadPath = pathArray.join('/') + "/download?" + queryString
    PDFViewerApplication.downloadManager.downloadUrl(downloadPath)
  }
  PDFViewerApplication.viewerPrefs.showPreviousViewOnLoad = false
  PDFViewerApplication.viewerPrefs.disableTextLayer = true
  PDFViewerApplication.appConfig.defaultUrl = null
  PDFJS.locale = "en-US"
}
