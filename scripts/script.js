// Set up dimensions and margins
const width = 800;
const height = 500;
const rowHeight = 100;
const margin = { top: 20, right: 30, bottom: 30, left: 110 };
const attributes = ['Intelligence', 'Strength', 'Speed', 'Durability', 'Power'];

const colorMap = {
    Intelligence: "#1f77b4",  // Blue
    Strength: "#ff7f0e",      // Orange
    Speed: "#2ca02c",         // Green
    Durability: "#d62728",    // Red
    Power: "#9467bd"          // Purple
};
let filteredData = [];


// Create SVG container
const svg = d3.select("#timelineContainer")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", rowHeight * attributes.length + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

    let defaultData = []; // Store the initial full dataset here


    d3.csv("superheroes_data.csv").then(data => {
        defaultData = data; // Save full data for reference
        updateTimeline(data,100,"ordered",true); // Initial timeline render

        
    });


    document.getElementById("applyButton").addEventListener("click", () => {
        let numEntries = parseInt(document.getElementById("numEntries").value);
        const orderType = document.getElementById("orderType").value;
    
        // Ensure `numEntries` does not exceed the total entries
        numEntries = Math.min(numEntries, defaultData.length);

        numEntries = Math.max(numEntries, 1);

        document.getElementById("numEntries").value = numEntries;
    
       
    
        // Update the timeline with the filtered data
        updateTimeline(defaultData,numEntries,orderType,false);
    });
    
    


    function updateTimeline(data,numEntries,orderType,firstTime) {
        console.log(window.innerWidth);
        // Clear previous timeline elements
        if(firstTime==true)
        svg.selectAll("*").remove();
        else
       { svg.selectAll("circle")
        .transition()
        .duration(1800)
        .attr('r',10)
        .attr("cy", () => -500 + Math.random() * (height + 1000))  // Move to the right side of the SVG
        .style("opacity", 0)
        .on("end", function() {
            d3.select(this).remove(); // Remove circle after transition completes
        });      // Fade out the points

        // svg.selectAll("circle").remove();

        svg.selectAll("#xAxis")
        .transition()
        .duration(2000)
        .attr("transform", `translate(2000, 0)`)
        .style("opacity", 0)
        .on("end", function() {
            d3.select(this).remove(); // Remove circle after transition completes
        });      // Fade out the points

    }
    
        // Apply the filtering and rendering logic for the timeline here using `data`
        // (This should be your current rendering logic from the `d3.csv` callback)

    console.log("Total Data: "+data.length);
    // Filter out entries with null or missing values for relevant attributes
    const filteredData1 = data.filter(d =>
     d.name && d.intelligence && d.strength && d.speed && d.durability && d.power  && d.url && d.gender  && d.alignment
        && d['first-appearance']
    );

    console.log("Initial Filter: "+filteredData1.length);

    // Convert numerical fields
    filteredData1.forEach(d => {
        const yearMatch = d['first-appearance'].match(/\b\d{4}\b/);

        d.year = yearMatch ? +yearMatch[0] : null;

        // If the superhero name is "Iron Man," set the year to 1999
        if (d.name.toLowerCase() === "junkpile") {
            d.year = 1993;
        }

        if (d.name.toLowerCase() === "cerebra") {
            d.year = 1993;
        }

        if (d.name.toLowerCase() === "bloodhawk") {
            d.year = 1993;
        }

        d.Intelligence = +d.intelligence;
        d.Strength = +d.strength;
        d.Speed = +d.speed;
        d.Durability = +d.durability;
        d.Power = +d.power;
    });

    const filteredData2 =  filteredData1.filter(d => d.year !== null);

    // const filteredData =  filteredData2.slice(100,235);

    const filteredData3 = filteredData2.filter(d => 
        d.name != null && 
        d.Intelligence != null && !Number.isNaN(d.Intelligence) &&
        d.Strength != null && !Number.isNaN(d.Strength) &&
        d.Speed != null && !Number.isNaN(d.Speed) &&
        d.Durability != null && !Number.isNaN(d.Durability) &&
        d.Power != null && !Number.isNaN(d.Power) &&
        d.url != null && 
        d.gender != null && d.gender != '-' && 
        d.alignment != null
    );

     // Filter data based on the number and order
     
     if (orderType === "ordered") {
         filteredData = filteredData3.slice(0, numEntries);
     } else if (orderType === "random") {
         filteredData = filteredData3
             .sort(() => 0.5 - Math.random()) // Shuffle
             .slice(0, numEntries);
     }

     document.getElementById("numEntries").value = filteredData.length;

    console.log("Final Filter: "+filteredData.length);
    

    

   // Calculate rounded start and end years
const yearRange = d3.extent(filteredData, d => d.year);
const startYear = Math.floor(yearRange[0] / 10) * 10; // Round down to the nearest decade
const endYear = Math.ceil(yearRange[1] / 10) * 10;    // Round up to the nearest decade

// Define scales with updated start and end years
const xScale = d3.scaleLinear()
    .domain([startYear, endYear])  // Use rounded start and end years
    .range([0, width]);


    // Draw timelines for each attribute
    attributes.forEach((attribute, index) => {
        const yPosition = rowHeight * index;

        // Create y-scale for the attribute values
        const yScale = d3.scaleLinear()
            .domain(d3.extent(filteredData, d => d[attribute]))
            .range([yPosition + rowHeight - 20, yPosition + 20]);

       // Add row label
       if(firstTime==true)
svg.append("text")
    .attr("class", "row-label")
    .attr("x", -margin.left + (500 + Math.random() * 1500))
    .attr("y", yPosition - (500 + Math.random() * 1500) + rowHeight / 2)
    .attr("dy", ".35em")
    .text(attribute.toUpperCase())
    .style("fill", colorMap[attribute])    // Set the fill color using style
    // .attr("stroke", "black")               // Add black stroke around the text
    // .attr("stroke-width", 0.5)             // Set the stroke width
    .attr("font-family", "Poppins")   // Set the font family
    .attr("font-weight", "bold")           // Set the font weight
    .attr("font-size", "13px")             // Set font size as an attribute
    .style("font-size", "13px")            // Set font size as a style
    .transition()
    .duration(() => 500 + Math.random() * 1500)
    .attr("x", -margin.left + 10)
    .attr("y", yPosition + rowHeight / 2)
    .style("fill", colorMap[attribute]);   // Reapply fill color in transition


     // Draw horizontal grid lines for each attribute y-axis
     const yGridGroup = svg.append("g")
     .attr("class", "y-grid-lines")
     .attr("transform", `translate(0, ${yPosition})`);

 // Define the number of grid lines based on the y-axis scale
 const yGridLinesCount = 5; // For example, 5 grid lines across the y-axis range
 const yGridLineInterval = (yScale.domain()[1] - yScale.domain()[0]) / yGridLinesCount;

 if(firstTime==true)
 for (let j = 0; j <= yGridLinesCount; j++) {
     const yValue = yScale.domain()[0] + j * yGridLineInterval;
     const yGridPosition = yScale(yValue);

     yGridGroup.append("line")
         .attr("x1", 10) // Start of grid line (left edge of the timeline area)
         .attr("y1", yGridPosition - yPosition)
         .attr("x2", 0) // End of grid line (right edge of the timeline area)
         .attr("y2", yGridPosition - yPosition)
         .attr("stroke", colorMap[attribute]) // Color of the grid lines
         .attr("stroke-width", 1)
         .attr("stroke-dasharray", "3,3")
         .transition()
        .duration(1000)
        .attr("x2", width+10)
        ; // Optional: dashed style
 }
 


// Define the number of grid lines
const gridLinesCount = endYear - startYear + 1; // Total number of grid lines from start to end year
const gridGroup = svg.append("g").attr("class", "grid-lines");

// Draw vertical grid lines for the entire timeline area
if(firstTime==true)
for (let i = startYear; i <= endYear; i+=5) {
    const xPosition = xScale(i);  // Get the x position for the current year

    gridGroup.append("line")
        .attr("x1", 0)
        .attr("y1", rowHeight * attributes.length)  // Start at the top of the timeline container
        .attr("x2", 0)
        .attr("y2", rowHeight * attributes.length)  // Extend to the bottom of all rows
        .attr("stroke", "grey")  // Set the color of the grid lines
        .attr("stroke-width", 0.5)
        .attr("stroke-dasharray", "4,2")
        .transition()
        .duration(1000)
        .attr("x1", xPosition+10)
        .attr("x2", xPosition+10);  // Optional: dashed line style
}

   
   

        // Draw axis for each row
        const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d"));

        // if(firstTime==true)
        svg.append("g")
            .attr("class", "x axis")
            .attr("id", "xAxis")
            .attr("transform", `translate(-2000, ${yPosition + rowHeight - 20})`)
            .attr("fill", `translate(-2000, ${yPosition + rowHeight - 20})`)
            .style('stroke-width',1)
            .call(xAxis)
            .transition()
            .delay(1000)
            .duration(1000)
            .attr("transform", `translate(10, ${yPosition + rowHeight - 20})`);

            // Set axis line, tick lines, and labels to white
// svg.selectAll(".x.axis path")
// .attr("stroke", "white");

// svg.selectAll(".x.axis .tick line")
// .attr("stroke", "white");

// svg.selectAll(".x.axis .tick text")
// .style("fill", "white");

         drawPoints(attribute,filteredData,yScale,xScale,1000,firstTime);


        



       
    });




    function drawPoints(attribute,filteredData,yScale,xScale,delayVal,firstTime){

        svg.selectAll(`circle.dot-${attribute}`).remove();

         // Draw dots for each attribute in the row
         svg.selectAll(`.dot-${attribute}`)
         .data(filteredData.filter(d => d[attribute] !== null && d[attribute] !== "" && !isNaN(d[attribute])))  // Filter out null, empty, or non-numeric values
         .enter()
         .append("circle")
         .attr("class", `dot ${attribute}`)
         .attr("fill", colorMap[attribute])  // Set color based on the attribute
        //  .attr("fill", d => `url(${d.url})`)
         // .attr("cx", () => -500 + Math.random() * (width + 1000))  // Random starting position far outside the screen
         // .attr("cy", () => -500 + Math.random() * (height + 1000))  // Random starting position far outside the screen
         .attr("cx", d => 2000+10 + Math.random() * 100)
         .attr("cy", d => 100+ Math.random() * 100)
         .attr("cz", 1000)
         .attr("r", 50)
         .attr('cursor','pointer')
         .style("opacity", 0)  // Start with opacity 0
         .transition()
         .delay(firstTime===true?delayVal:0)
         .duration(() => 2000 + Math.random() * 1000)  // Random duration between 2-3 seconds
         .ease(d3.easeCubicInOut)
         .attr("r", 5)
         .attr("cx", d => xScale(d.year)+10)
         .attr("cy", d => yScale(d[attribute]))
         .attr("cz", 100)
         .style("opacity", 0.8)  // Transition to opacity 1
         .on("end", function() {  // Attach event listeners after the transition
             d3.select(this)
                 .on("mouseover", (event, d) => {

                    try{

                    // Sanitize the pattern ID by replacing any special characters with a hyphen
        const patternId = `pattern-${d.name.replace(/[^a-zA-Z0-9-_]/g, '-')}`;

        // Check if pattern already exists, and create it if not
        if (!svg.select(`#${patternId}`).node()) {
            svg.append("defs")
                .append("pattern")
                .attr("id", patternId)
                .attr("width", 1)
                .attr("height", 1)
                .attr("patternUnits", "objectBoundingBox")
                .append("image")
                .attr("xlink:href", d.url)
                .attr("width", 80)  // Width of the image inside the pattern
                .attr("height", 80)  // Height of the image inside the pattern
                .attr("preserveAspectRatio", "xMidYMid slice");
        }

        // Show only the matching point in the current timeline row with the image pattern fill
        svg.selectAll(`circle.dot.${attribute}`)
            .transition()
            .duration(300)
            .style("opacity", 0.1)  // Dim all points in the row
            .filter(point => point.name === d.name)
            .style("opacity", 1)  // Highlight the selected point
            .attr("r", 40)  // Increase the size of the highlighted point
            .attr("fill", `url(#${patternId})`);  // Set fill to the pattern URL

        // Highlight the corresponding name in the word cloud
        d3.select(`#maleWordCloud text[data-name="${d.name}"]`)
            .transition()
            .style("fill", "black")  // Highlight color
            .style("font-weight", "bold");
        
        

        // Create tooltip with superhero details
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .html(`
                <h3>${d.name}</h3>
                <p><strong>Year:</strong> ${d.year}</p>
                <p><strong>${attribute}:</strong> ${d[attribute]}</p>
                <p>(click for more info)</p>
            `);
        tooltip.style("left", (event.pageX + 30) + "px")
            .style("top", (event.pageY - 10) + "px");

} catch (error) {
    // If an error occurs, show an error message in the tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .html(`
            <p style="color: red; font-weight: bold;">Error:</p>
            <p>Something went wrong while displaying this superhero.</p>
        `);
    tooltip.style("left", (event.pageX + 30) + "px")
        .style("top", (event.pageY - 10) + "px");

    console.error("Error in hover function:", error);  // Log the error for debugging
}

                 })
                 .on("mouseout", (event, d) => {

                     // Remove highlight from the word cloud name
                     d3.select(`#maleWordCloud text[data-name="${d.name}"]`)
                     .transition()
                     .style("fill", d.gender==="Male"?"blue":"red")  // Original color
                     .style("font-weight", "normal");
                 
                


                     d3.select(".tooltip").remove();

                       // Restore all points in the specific timeline row
                    svg.selectAll(`circle.dot.${attribute}`)
                    .transition()
                    .duration(300)
                    .style("opacity", 0.8)  // Restore original opacity for points in the row
                    .attr("r", 5)
                    .attr("fill", colorMap[attribute]);  // Restore original size

                 })
                 .on("click", (event, d) => {
                     // Show the superhero card popup with data
                     d3.select(".tooltip").remove();
                     showSuperheroCard(d);
                 });
         });

        
        

    }


    // Function to get the highest value and corresponding name for each attribute
function getMaxValues(data, attributes) {
    const maxValues = {};
    attributes.forEach(attribute => {
        const maxEntry = data.reduce((max, entry) => (entry[attribute] > max[attribute] ? entry : max), data[0]);
        maxValues[attribute] = { value: maxEntry[attribute], name: maxEntry.name };
    });
    return maxValues;
}




// if(firstTime==false)
initWordClouds(filteredData);

}



function showSuperheroCard(data) {
    const popup = document.getElementById("superheroCard");
    const heroImage = document.getElementById("heroImage");
    const heroName = document.getElementById("heroName");
    const attributeBars = document.getElementById("attributeBars");
    const firstAppearance = document.getElementById("firstAppearance");
    const publisher = document.getElementById("publisher");
    const alignment = document.getElementById("alignment");
    const gender = document.getElementById("gender");
    const overlay = document.getElementById("overlay");

    // Set data for image and name
    heroImage.src = data.url;
    heroName.textContent = data.name;
    
    // Set additional details with animations
    firstAppearance.innerHTML = `First Appearance: <span style="font-weight:normal;">${data['first-appearance'] || "Unknown"}</span>`;
    publisher.innerHTML = `Publisher: <span style="font-weight:normal;">${data.publisher || "Unknown"}</span>`;
    alignment.innerHTML = `<span style="color:#333">Alignment:</span> <span style="font-weight:normal;">${data.alignment}`;
    alignment.style.color = data.alignment === "good" ? "#2ca02c" : "#d62728"; // Green for good, red for bad
    gender.innerHTML = `Gender: <span style="font-weight:normal;color:${data.gender==="Male"?"blue":data.gender==='Female'?"red":"yellow"}">${data.gender}</span>`;
    
    // Clear existing attribute bars
    attributeBars.innerHTML = '';

    // Populate attributes with labels, values, and animated progress bars
    attributes.forEach(attr => {
        const barContainer = document.createElement("div");
        barContainer.className = "attribute-bar";
    
        const label = document.createElement("span");
        label.textContent = `${attr}: `;
        label.className = "attribute-label";
    
        const value = document.createElement("span");
        value.textContent = data[attr.toLowerCase()];
        value.className = "attribute-value";
    
        // Create outer and inner bars
        const progressBarOuter = document.createElement("div");
        progressBarOuter.className = "progress-outer";
    
        const progressBarInner = document.createElement("div");
        progressBarInner.className = "progress-inner";
        progressBarInner.style.width = "0"; // Start width at 0
        progressBarInner.style.backgroundColor = colorMap[attr];
    
        // Append inner bar to outer bar
        progressBarOuter.appendChild(progressBarInner);
    
        // Append elements to bar container
        barContainer.appendChild(label);
        barContainer.appendChild(value);
        barContainer.appendChild(progressBarOuter);
        attributeBars.appendChild(barContainer);
    
        // Animate width to target percentage after a short delay
        setTimeout(() => {
            progressBarInner.style.width = `${data[attr.toLowerCase()]}%`;
        }, 100); // Adjust delay if needed
    });
    
    

    // Add animations for each element
    heroImage.classList.add("hero-image-animation");
    heroName.classList.add("hero-name-animation");
    firstAppearance.classList.add("hero-detail-animation");
    publisher.classList.add("hero-detail-animation");
    alignment.classList.add("hero-detail-animation");
    gender.classList.add("hero-detail-animation");

    // Show overlay and popup with animation
    overlay.classList.remove("hidden");
    popup.classList.remove("hidden");

    // Set timeout to allow animations to complete
    setTimeout(() => {
        popup.style.opacity = 1;
    }, 10);
}



// Hide popup when clicking the close button
document.getElementById("closePopup").addEventListener("click", () => {
    const popup = document.getElementById("superheroCard");
    popup.style.opacity = 0;
    setTimeout(() => popup.classList.add("hidden"), 300);  // Delay to allow fade-out animation

    overlay.classList.add("hidden");
});


// Function to get the names and their power for male and female
function getNamesAndPowerByGender(data) {
    const maleNames = {};
    const femaleNames = {};

    data.forEach(d => {
        const power = d.Power ? +d.Power : 1; // Use 'power' or default to 1 if not available
        // if (d.gender === "Male") {
            maleNames[d.name+":"+d.gender] = power;
        // } else if (d.gender === "Female") {
            femaleNames[d.name] = power;
        // }
    });

    return { maleNames, femaleNames };
}

// Generate the word cloud for a given gender based on power
function generateWordCloud(wordsData, containerId, color, titleText, data) {
    // Calculate font size based on number of words and container dimensions
    const baseFontSize = Math.max(5, 250 / Math.sqrt(Object.keys(wordsData).length))/1.5; // Dynamically calculated base font size
    const padding = Math.max(1, baseFontSize / 4); // Dynamically adjust padding

    const words = Object.keys(wordsData).map(word => ({
        text: word,
        size: baseFontSize * 0.5  // Scale size based on power and base font size
    }));


   
   

  const wordWidth= 400;



    const layout = d3.layout.cloud()
        .size([wordWidth, wordWidth])
        .words(words)
        .padding(words.length >=20 ?(1*100/(words.length)): words.length >=2 ? 5 :0)
        .rotate(() => ~~(Math.random() * 2) * 90)
        // .rotate(0)
        .fontSize(d => (words.length)>1? d.size:45)
        .on("end", draw);

    layout.start();

    function draw(words) {
        const wordCloudContainer = d3.select(`#${containerId}`);
        wordCloudContainer.html("");  // Clear previous results

        console.log("wlength: "+words.length)

           // If no words are generated, show a message and exit the function
      if (words.length === 0) {
        const wordCloudContainer = d3.select(`#${containerId}`);
        wordCloudContainer.html(""); // Clear previous results

        wordCloudContainer.append("div")
            .attr("class", "no-words-message")
            
            .text("No words generated. Please try again.")
            .style("color","red");
 
    }



        wordCloudContainer.append("svg")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .style("border","1px solid black")
            .style("background-color","#ffffffb3")
            .style("padding","4px")
            .append("g")
            .attr("transform", `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => `${d.size}px`)
            .style("fill", d => d.text.includes("Male") ? "blue" :"red")
            .style("opacity", 0.8)
            .style("font-family", "Poppins")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(0,0)")
            .attr("data-name", d => d.text.split(":")[0])
            .text(d => d.text.split(":")[0])
            .transition()
            .duration(1000)
            .delay((d, i) => i * 30)  // Adjust staggered entrance
            .style("opacity", 1)
            .style("cursor","pointer")
            .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
            .on("end", function() {


                d3.select(this)
                .on("mouseover", (event, d) => {

                    d3.select(`#maleWordCloud text[data-name="${d.text.split(":")[0]}"]`)
                    .transition()
                    .style("fill", "black")  // Original color
                    .style("font-weight", "bold");

                    const superheroName = d.text.split(":")[0];

                     // Show only the matching point in the scatter plot
                     svg.selectAll("circle")
                     .transition()
                     .duration(300)
                     .style("opacity", 0.1)  // Dim all points
                     .filter(point => point.name === superheroName)
                     .style("opacity", 1)  // Highlight the selected point
                     .attr("r", 5);  // Optional: Increase the size of the highlighted point

                    
                })
                .on("mouseout", (event, d) => {

                    d3.select(`#maleWordCloud text[data-name="${d.text.split(":")[0]}"]`)
                    .transition()
                    .style("fill", d => d.text.includes("Male") ? "blue" :"red")  // Original color
                    .style("font-weight", "normal");

                    const superheroName = d.text.split(":")[0];


                     // Restore all points in the scatter plot
                     svg.selectAll("circle")
                     .transition()
                     .duration(300)
                     .style("opacity", 0.8)  // Restore original opacity for all points
                     .attr("r", 5);  // Restore original size



                    
                })
                
                .on("click", (event, d) => {
                
                    // Find the full data object based on the clicked name
                    const superheroName = d.text.split(":")[0];
                    const superheroData = data.find(hero => hero.name === superheroName);
                    if (superheroData) {
                        showSuperheroCard(superheroData);  // Pass full data object
                    }
                });

            });
    }
}


// Initialize word clouds for male and female names
function initWordClouds(data) {

    const data1=data.slice(0,data.length);
    const { maleNames, femaleNames } = getNamesAndPowerByGender(data1);

    generateWordCloud(maleNames, "maleWordCloud", "blue" , "Male Characters",data);  // Blue for male
    // generateWordCloud(femaleNames, "femaleWordCloud", "red", "Female Characters");  // Red for female
}
