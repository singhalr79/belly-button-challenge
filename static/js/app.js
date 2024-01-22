//function to populate the #sample-metadata on the html index
//metadata is the demographic info on the page
function populateDemographic(cases)
{
//load the data on json file, pulling data.metadata into casesDemoInfo
    d3.json("samples.json").then((data) =>{
        let casesDemoInfo = data.metadata;
//filter casesDemoInfo based on the case
        let response = casesDemoInfo.filter(casesList => casesList.id == cases);
//access the first case data 
        let responseList = response[0];
//clear the output
        d3.select("#sample-metadata").html("");
//populate the demographic info with value key pairs
        Object.entries(responseList).forEach(([key,value]) => {
//append the info obtained to the id #sample-metadata on the html index
        d3.select("#sample-metadata")
//text added as h6 heading
            .append("h6").text(`${key}:${value}`);  
        });
});
}
//functions to create the charts
//start with function to create bar chart
function createBar(cases)
{
//load the data on json file, pulling data.samples into barInfo
    d3.json("samples.json").then((data) =>{
        let barInfo = data.samples;
//filter barInfo based on the case
        let response = barInfo.filter(casesList => casesList.id == cases);
//access the first cases data 
        let responseList = response[0];
//create the bar chart with top 10 OTUs
//create chart horizontally
        let barChart = {
// sample_values are the operational taxonomic units values
// sample_values are the x values
                x: (responseList.sample_values).slice(0,10).reverse(),
// otu_ids are the operational taxonomic units ids
// otu_ids are the yticks
                y: (responseList.otu_ids).slice(0,10).map(id => `OTU ${id}`).reverse(),
// otu_labels are the operational taxonomic units labels
// otu_labels are the text values
                text: (responseList.otu_labels).slice(0,10).reverse(),
                type: "bar",
                orientation: "h"
    }
//set the layout
        let layoutBar ={
            title : "Top 10 Belly Button Bacteria"
    }
//call Plotly to render the bar chart 
        Plotly.newPlot("bar",[barChart], layoutBar);
    })
}
//function to create bubble chart
function createBubble (cases) {
//load the data on json file, pulling data.samples into bubbleInfo
    d3.json("samples.json").then((data) =>{
        let bubbleInfo = data.samples;
//filter bubbleInfo based on the case
        let response = bubbleInfo.filter(casesList => casesList.id == cases);
//access the first case data 
        let responseList = response[0];
//create the bubble chart
        let bubleChart = {
// otu_ids are the operational taxonomic units ids
// otu_ids are the x values
            x: responseList.otu_ids,
// sample_values are the operational taxonomic units values
// sample_values are the y values 
            y: responseList.sample_values,
// otu_labels are the operational taxonomic units labels
// otu_labels are the text values    
            text: responseList.otu_labels,
            mode: "markers",
            marker: {
                size: responseList.sample_values,
                color: responseList.otu_ids,
                colorscale: "Bluered"
            }
        }
//set the layout
        let layoutBubble = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "Operational Taxonomic Units (OTU) ID"}
        };
//call Plotly to render the bubble chart 
        Plotly.newPlot("bubble",[bubleChart], layoutBubble);
        })  
}
//function to start the dashboard 
function startDashboard()
{
//access the dropdown id #selDataset on the html index
    var dropdown  = d3.select("#selDataset");
//load the data on json file, pulling data.names as the dropdown id
    d3.json("samples.json").then((data) =>{
        let dropdownIds= data.names;
//append the cases info to the id on #selDataset html         
        dropdownIds.forEach((cases) => {
            dropdown.append("option")
            .text(cases)
            .property("value", cases);
        });
//access the first case data 
        let startcases = dropdownIds[0];
//call the functions to start the dashboard
        populateDemographic(startcases); 
        createBar(startcases);
        createBubble(startcases);
        });    
}
//function to update the dashboard
function optionChanged(cases)
{
    populateDemographic(cases);
    createBar(cases);
    createBubble(cases);
}
//call the startDashboard function
startDashboard();
