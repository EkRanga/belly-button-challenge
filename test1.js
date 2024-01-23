let dropdown;
let data;

// Get the Roadster endpoint
const roadster = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to fetch JSON data and initialize dropdown
function init() {
  // Fetch the JSON data and populate the dropdown
  d3.json(roadster).then(function(jsonData) {
    // Log the data to the console
    console.log(jsonData);

    // Assign the loaded data to the 'data' variable
    data = jsonData;

    // Select the dropdown element by ID
    dropdown = d3.select("#selDataset");

    // Populate the dropdown with options from the data
    data.names.forEach(function(name) {
      dropdown.append("option").text(name).property("value", name);
    });

    // Call the function to initialize the bubble chart with the default selected ID
    updateCharts(data.names[0]);
  });
}

// Function to handle dropdown selection change
function optionChanged(selectedID) {
  // Check if 'data' is defined and has the expected structure
  if (data && data.metadata) {
    // Filter the data to get the demographic info for the selected ID
    const selectedData = data.metadata.find(entry => entry.id === parseInt(selectedID));

    if (selectedData) {
      // Select the demographic div and update its content
      const demographicDiv = d3.select("#sample-metadata");
      demographicDiv.html(""); // Clear previous content

      // Append paragraphs with the demographic details
      demographicDiv.append("p").text(`ID: ${selectedData.id}`);
      demographicDiv.append("p").text(`Ethnicity: ${selectedData.ethnicity}`);
      demographicDiv.append("p").text(`Gender: ${selectedData.gender}`);
      demographicDiv.append("p").text(`Age: ${selectedData.age}`);
      demographicDiv.append("p").text(`Location: ${selectedData.location}`);
      demographicDiv.append("p").text(`BBType: ${selectedData.bbtype}`);
      demographicDiv.append("p").text(`WFreq: ${selectedData.wfreq}`);

      // Update both bar and bubble charts
      updateCharts(selectedID);
    } else {
      console.error(`Demographic data not found for ID: ${selectedID}`);
    }
  } else {
    console.error("Invalid or missing 'data' object structure.");
  }
}

// Function to update both bar and bubble charts based on the selected ID
function updateCharts(selectedID) {
  // Update bar chart
  updateBarChart(selectedID);

  // Update bubble chart
  updateBubbleChart(selectedID);
}

// Function to update the bar chart based on the selected ID
function updateBarChart(selectedID) {
  // Find the sample data for the selected ID
  const selectedSample = data.samples.find(sample => sample.id === selectedID);

  // Get the top 10 OTUs
  const topOtuIds = selectedSample.otu_ids.slice(0, 10);
  const topSampleValues = selectedSample.sample_values.slice(0, 10);
  const topOtuLabels = selectedSample.otu_labels.slice(0, 10);

  // Sort sample values and corresponding labels in descending order
  const sortedIndices = topSampleValues.map((_, i) => i).sort((a, b) => topSampleValues[b] - topSampleValues[a]);
  const sortedValues = sortedIndices.map(i => topSampleValues[i]);
  const sortedLabels = sortedIndices.map(i => `OTU ${topOtuIds[i]}`);

  // Create a trace for the bar chart
  const trace = {
    x: sortedValues,
    y: sortedLabels,
    text: topOtuLabels,
    type: 'bar',
    orientation: 'h'
  };

  // Create a layout for the chart
  const layout = {
    title: `Top 10 OTUs for Sample ${selectedID}`,
    xaxis: { title: 'Sample Values' },
    yaxis: { title: 'OTU IDs' }
  };

  // Plot the chart
  Plotly.newPlot('bar', [trace], layout);
}

// Function to update the bubble chart based on the selected ID
function updateBubbleChart(selectedID) {
  // Find the sample data for the selected ID
  const selectedSample = data.samples.find(sample => sample.id === selectedID);

  // Create a trace for the bubble chart
  const trace = {
    x: selectedSample.otu_ids,
    y: selectedSample.sample_values,
    text: selectedSample.otu_labels,
    mode: 'markers',
    marker: {
      size: selectedSample.sample_values,
      color: selectedSample.otu_ids,
      colorscale: 'Viridis'
    }
  };

  // Create a layout for the chart
  const layout = {
    title: `Bubble Chart for Sample ${selectedID}`,
    xaxis: { title: 'OTU IDs' },
    yaxis: { title: 'Sample Values' },
    showlegend: false
  };

  // Plot the chart
  Plotly.newPlot('bubble', [trace], layout);
}

// Call the init function to start the process
init();
