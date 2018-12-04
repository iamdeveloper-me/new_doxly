App.Reports = {

  getReportData: function(type, responseData) {
    let reportData = {}
    let labels
    let ykeys = []

    if (type == "type"){
      labels = responseData.types
      for (var i = 0; i < labels.length; i++) {
        ykeys[i] = labels[i].replace(/[^a-z0-9]/ig, "_").replace(/_+/g, "_")
      }

    } else if (type == "size") {
      labels = responseData.sizes
      ykeys = labels
    }

    let data = []
    let results = responseData.results

    if (type != "member") {
      let xColumns = responseData.group_values
      for (var i = 0; i < xColumns.length; i++) {
        let d = {}
        d.x = xColumns[i]
        for (var j = 0; j < labels.length; j++) {
          let label = labels[j]
          let r

          for (var k = 0; k < results.length; k++) {
            let result = results[k]
            if (result.date == d.x) {
              if (type == "type") {
                if (result.deal_type_name == label) {
                  r = result
                }
              } else if (type == "size") {
                if (result.deal_size == label) {
                  r = result
                }
              }
            }
          }

          if (type == "type") {
            d[ykeys[j]] = (r ? r.count : 0)
          } else if (type == "size") {
            d[ykeys[j]] = (r ? r.count : 0)
          }
        }

        data.push(d)
      }
    }

    var displayedLabels = []
    if (type == "size") {
      for (var i = 0; i < labels.length; i++) {
        displayedLabels[i] = "$" + App.Helpers.formatNumber(labels[i], 0)
      }
    } else {
      displayedLabels = labels
    }

    reportData.ykeys = ykeys
    reportData.labels = displayedLabels
    reportData.data = data

    return reportData
  },

  buildReportByType: function(data) {
    const _this = this
    const reportData = App.Reports.getReportData("type", data)
    if (reportData && reportData.data && reportData.data.length > 0) {
      const labels = App.Reports.unique(reportData.labels)
      const ykeys = App.Reports.unique(reportData.ykeys)
      $('#report_11 #report_legend_11').html('')
      this.report1 = Morris.Bar({
          element: 'report_11',
          data: reportData.data,
          xkey: 'x',
          ykeys: ykeys,
          labels: labels,
          stacked: true,
          hideHover: true
      })

      this.report1.options.labels.forEach(function(label, i){
          const legendItem = $('<span></span>').css('background', _this.report1.options.barColors[i])
          const legendText = $('<i></i>').text(label)
          $('#report_legend_11').append(legendItem).append(legendText)
      })
    }
  },

  buildReportBySize: function(data) {
    const _this = this
    const reportData = App.Reports.getReportData("size", data)
    if (reportData && reportData.data && reportData.data.length > 0) {
      $('#report_22 #report_legend_22').html('')
      this.report2 = Morris.Area({
          element: 'report_22',
          data: reportData.data,
          xkey: 'x',
          ykeys: reportData.ykeys,
          labels: reportData.labels,
          hideHover: true,
          smooth: false
      })

      this.report2.options.labels.forEach(function(label, i){
          const legendItem = $('<span></span>').css('background', _this.report2.options.lineColors[i])
          const legendText = $('<i></i>').text(label)
          $('#report_legend_22').append(legendItem).append(legendText)
      })
    }
  },

  unique: function(array) {
    return array.filter(function(item, i, ar){ return ar.indexOf(item) === i; })
  }
}
