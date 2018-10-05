function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  /* data route */
  var url = "/metadata/" + sample;

  d3.json(url).then(function(response) {
    console.log(response);

    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(response).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
        
      // Inside the loop, use d3 to append new tags for each key-value in the metadata.
      d3.select("#sample-metadata")
        .append()
        .text(`${key}: ${value}`)
        .append("br")
      
    });

  });

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = "/samples/" + sample;

  d3.json(url).then(function(response) {

    console.log(response);


    // @TODO: Build a Bubble Chart using the sample data
    // create trace and layout for bubble chart
    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: "markers",
      marker: {
        size: response.sample_values,
        color: response.otu_ids
      }
    };

    var data1 = [trace1];

    var layout1 = {
      xaxis: {
        title: "OTU ID"
      }
    };

    // Plot bubble chart in 'bubble' id
    Plotly.newPlot("bubble", data1, layout1);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    // sample[:10]
    
    // Create a empty list to store values
    var pieData = [];

    // Loop to add dictionary values to empty list
    for (var i = 0; i < response.sample_values.length; i++) {
      pieData.push({otu_ids : response.otu_ids[i],
        otu_labels: response.otu_labels[i],
        sample_values: response.sample_values[i]
      })
    };

    // Sort list to grab top ten sample values
    pieData.sort(function(a, b) {
      return parseFloat(b.sample_values) - parseFloat(a.sample_values);
    });

    topTen = pieData.slice(0, 10);

    topTen = topTen.reverse();

    console.log(topTen)

    // create trace for pie chart
    var trace2 = {
      values: topTen.map(row => row.sample_values),
      labels: topTen.map(row => row.otu_ids),
      type: "pie",
      hoverinfo: topTen.map(row => row.otu_labels),
      textinfo: "percent"
    };
 
    var data2 = [trace2];

    // plot pie chart in "pie" id
    Plotly.newPlot("pie", data2);

  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
