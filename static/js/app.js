// d3 the JSON data and console log it
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
d3.json(url).then(function(data) {
  console.log(data);
});
console.log("Hi!")
init();

//create the initialization function, just to put something up
function init() {
    //select the dropdown menu
    let dropdown = d3.select("#selDataset");
    // fill the drop-down selector
    d3.json(url).then((data) => {
        // Set a variable for the sample names
        let names = data.names;
        //add ids to dropdown
        names.forEach((id) => {
            //check each id by console logging it.
            console.log(id);
            dropdown.append("option")
            .text(id)
            .property("value",id);
        });
        //just for init, set up 1st one, "940"
        let init_sample = names[0];
        //Just checking!
        console.log(init_sample);
        //call later functions to build charts
        buildInfoChart(init_sample);
        buildHBarChart(init_sample);
        buildBubbleChart(init_sample);
    });
};


//function that builds the bar chart
function buildHBarChart(sample) {
    //parse out data
    d3.json(url).then((data) => {
        // Retrieve all sample data
        let sampleInfo = data.samples;
        //filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);
        //grab the first index from the array
        let valueData = value[0];
        //grab the otu_ids, lables, and sample values from sample
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        //set top ten items in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse()
        //trace creation
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };
        //layout creation
        let layout = {
            title: `Top 10 OTUs Present in Subject ${sample}`,
            width: 900,
            height: 900,
            plot_bgcolor: '#E5E4E3'
        };
        //plot it out!
        Plotly.newPlot("bar", [trace], layout)
    });
};

//function that shows selected sampler info
function buildInfoChart(sample) {
    //retrieve data using d3
    d3.json(url).then((data) => {
        
        let metadata = data.metadata;
        //filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);
        //get the first index from the array
        let valueData = value[0];
        //clear out metadata
        d3.select("#sample-metadata").html("");
        //use Object.entries to add each key/value pair to the info panel
        Object.entries(valueData).forEach(([key,value]) => {
            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);
            d3.select("#sample-metadata")
            .append("h3")
            .text(`${key}: ${value}`);
        });
    });
};

//function that builds the bubble chart
function buildBubbleChart(sample) {
    //use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        //put all sample info in sampleInfo 
        let sampleInfo = data.samples;
        //filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);
        //get the first index from the array
        let valueData = value[0];
        // Get the otu_ids, lables, and sample values and assign to variables
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        //set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                color: otu_ids,
                size: sample_values,
                colorscale: "Browns"
            }
        };
        //set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            height: 700,
            width: 1350,
            plot_bgcolor: '#E5E4E3'

        };
        //create chart using plotly
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

//function checks to see if selected value changes
function newSample(value) { 
    //just checking
    console.log(value); 
    // Call (again) all functions using new selected value
    buildInfoChart(value);
    buildHBarChart(value);
    buildBubbleChart(value);
};


