global.fcount=0;

//Make output directory if it doesn't exist
var fs = require('fs');
if (!fs.existsSync('./output')){
    fs.mkdirSync('./output');
}

for (var fcount = 0; fcount < 1; fcount++) {
    var papa=createArray();
    var papajr=papa.slice(0);

    print(papa);

    sortArray(1, papa); //Where first parameter is column to sort by
    
    arrayWriter('FCFS', fcfs(papa));

    arrayWriter('Stride', stride(5, papa));

    arrayWriter('SJF', sjf(papa));

    arrayWriter('Round Robin', roundRobin(papa));

    arrayWriter('PSJF', psjf(papa));

    papa.length=0;

}


function print(papa){
    var heade = ['Job#','Run Time', 'Arrival Time', 'Tickets', 'Stride', 'Start Time', 'End Time', 'Pass', 'Time Left']

    console.log(heade.toString());

    for (var i = 0; i < papa.length; i++) {
    console.log(papa[i])
    }
}

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function sortArray (sortBy, papaA){
	papaA.sort(function(a, b)
	{
		//Sort by whatever recieved field
 	   return a[sortBy] - b[sortBy];	
	});
	//console.log('\nSorted array?')

//used to validate sourcing
//print(papaA);
return papaA;
}

function calcEnd(sortedA){
    for (var i = 0; i < sortedA.length; i++) {
        if (i==0){
            sortedA[i][5]=0;
            sortedA[i][6]=sortedA[i][1];
        }
        else    {
            var j = 6;
            sortedA[i][6]=sortedA[i-1][j]+sortedA[i][1]+1;
            sortedA[i][5]=sortedA[i-1][j]+1;
            //console.log('Reaches else')
        }
    }
    return sortedA;
}

function roundRobin(papa){
    var baseA = papa.splice(0);
    var finalA = new Array ();
    var quant = [5, 10, 15];
    var qSize = 0;
    var clock = 0;

    //Set time left to run time and a few non-important fields to 0
    for (var i=0; i < baseA.length; i++){
        baseA[i][8]=baseA[i][1];
        baseA[i][7]=0;
        baseA[i][5]=0;
        baseA[i][6]=0;
    }

    //Do until the baseA array is empty (finished processing)
    do {
        //Deduct current quant size from time left
        baseA[0][8]-=quant[qSize];

        //Check if time left is less than 0 (job finishes early)
        if (baseA[0][8]<0){

            //Increment global clock by time used on job
            clock+=baseA[0][8]+quant[qSize];

            //Set time left to 0 (a negative doesn't make sense)
            baseA[0][8]=0;

            //Set end time to clock
            baseA[0][6]=clock;

            //Add row to final array because job is complete
            finalA[finalA.length]=baseA[0];

            //Remove it from the original array.
            baseA.splice(0, 1);

        }
        //If time left is not negative
        else {
            //Increment clock by quant size
            clock+=quant[qSize]+1;

            //If job completes with no time wasted
            if (baseA[0][8]==0){

                //End time equals global clock
                baseA[0][6]=clock;

                //Copy the row to final array then splice it from the original
                finalA[finalA.length]=baseA[0];
                baseA.splice(0, 1);
            }
            //If job still has time left
            else{
                //Copy the row to end of array then splice it from the front
                baseA[baseA.length]=baseA[0];
                baseA.splice(0, 1);
            }
            //Sets the quant back to beginning of array (5) if it has reached the end
            if (qSize==2){
                qSize=0;
            }
            //Increments the quant to its next interval
            else {
                qSize++;
            }
        }
    //End when original array has no incomplete jobs left
    } while (baseA.length!=0);

//Sort by job number
finalA=sortArray(0,finalA);

console.log('\nRound Robin with clock='+ clock);
print(finalA);
return finalA;
}

//Used for stride scheduling, pass cpu time and array as parameters
function stride(cpuTime, pArray){
    var papa = pArray.slice(0);
    var q=0;

    //Array for completed rows to be held in
    var stridedArray = new Array(10);
    var clock=0;
    do
    {
        //Sort the array based on pass count sizes
        papa=sortArray(7,papa);

        //Add the rows stride to pass count
        papa[0][7]+=papa[0][4];

        //Reduce the rows time left by cpuTime parameter
        papa[0][8]-=cpuTime;

        //If the rows time hits 0 perfectly
        if (papa[0][8]==0){
            //Increment clock by cpuTime
            clock+=cpuTime;

            //Set the rows end time to the clock
            papa[0][6]=clock;

            //Add clock overhead
            clock+=1;

            //Add a row to strided array for the completed row
            stridedArray[q]=papa[0]

            //Increment the strided arrays spot for next time
            q++;

            //Remove the completed row from papa
            papa.splice(0, 1);
        }

        //if the job completes but its Time Left reaches a negative
        else if (papa[0][8]<0){
            //Add the cpuTime size to the negative remainder so retrieve how much time it actually used, then add to clock
            clock+=(papa[0][8]+cpuTime);

            //Set the Time Left to 0
            papa[0][8]=0;

            //Set End Time to clock
            papa[0][6]=clock;

            //Add remaining wasted time + overhead to clock
            clock+=(papa[0][8]*-1)+1;

            //Add completed row to strided array
            stridedArray[q]=papa[0]

            //Increment strided array row to be used next time
            q++;

            //Remove completed row from papa
            papa.splice(0, 1);
        }
        else{
            clock+=(cpuTime+1);    
        }
        //console.log('clocks at '+clock);
        //print(papa);
        
    } while (papa.length!=0);

    console.log(papa);
    stridedArray=sortArray(0,stridedArray);

    console.log('\nStrided Array:');
    print(stridedArray);

    return stridedArray;
}


function fcfs(fcfsA){
    fcfsA=sortArray(0, fcfsA);

    fcfsA=calcEnd(fcfsA);

    console.log('\nFCFS')
    print(fcfsA);

    arrayWriter("FCFS",fcfsA);

    return fcfsA;
}

//Shotest Job First
function sjf(papa){
    //Sorts the array by arrival times, redudent
    var sjfA = papa.slice(0);
    sjfA=sortArray(2, sjfA);

    //Declare some garbage arrays, temp one for trying random stuff, and hArray for final one.
    var hArray = new Array();
    var tempArray = new Array();
    var tcounter=0;

    //Run first job
    sjfA[0][6]=sjfA[0][1];

    //Move it to hArray, then splice it off main array
    hArray[0]=sjfA[0]
    sjfA.splice(0, 1);

    //While loop until main array is empty
    do{
    //Loop through main array searching for arrival times before previous end time
    //Then add them to temp array while splicing them away.
    for (var i = 0; i < sjfA.length; i++) {
        if (sjfA[i][2]<hArray[(hArray.length)-1][6]){
            tempArray[tempArray.length]=sjfA[i];
            sjfA.splice(0,1);
            i=-1;
        }
    }

    //Sort temp array by run times ascending
    tempArray=sortArray(1, tempArray);

    //If the temp array successfully retrieved some rows
    if (tempArray.length!=0){
        //Append the first row (lowest run time) to the real array.
        hArray[hArray.length]=tempArray[0];
        //Splice the appended row from the temp so it's now only unused ones
        tempArray.splice(0,1);
        //Calculate end time of the last row with function
        hArray=calcSEnd(hArray);
    }
    //If temp array is empty (the next arrival time is after the previous end time)
    else {
        //Sort main array by job numbers
        sjfA=sortArray(0,sjfA);
        //appends the first row of the main array (the next arrival) to the completed array.
        hArray[hArray.length]=sjfA[0];
        //Splicer up
        sjfA.splice(0,1);

        //Set end time to be its arrival time+
        hArray[hArray.length-1][6]=hArray[(hArray.length)-1][1]+hArray[(hArray.length)-1][2];
    }

    //Add the reminaning values of the temporary array back to the main array
    for (var i = 0; i < tempArray.length; i++){
    sjfA[sjfA.length]=tempArray[i];
    }
    //Clear the temp array.
    tempArray.length = 0;

    //Resort the main array base on arrival times
    sjfA=sortArray(2,sjfA);

    //End while loop when length of main array = 0
    } while (sjfA.length!=0);

    // console.log('\nTemp Array');
    // print(tempArray);
   
    // sjfA=sortArray(0, sjfA);
    // console.log('\nOriginal Array');
    // print(sjfA);


    console.log('\nSJF Array:');
    hArray=sortArray(0,hArray);

    print(hArray);

    return hArray;
}

//Shotest Job First
function psjf(papa){
    //Sorts the array by arrival times, redudent
    var originalA=sortArray(2, papa.slice(0));
    var clock=0;

    //Declare some garbage arrays, temp one for trying random stuff, and hArray for final one.
    var completeA = new Array();
    var arrivedArray = new Array();
    var tcounter=0;
    var compareHolder = new Array();
    
    compareHolder[0]=originalA[0];
    arrivedArray[0]=originalA[0];

    originalA.splice(0, 1);

    do{
        clock+=1;
        do {
            if (originalA[0][2]<clock){
                arrivedArray[arrivedArray.length]=originalA[0];
                originalA.splice(0, 1);
            }
            } while (originalA[0][2]<clock);
        arrivedArray=sortArray(1, arrivedArray);

        if (arrivedArray[0][0]!=compareHolder[0][0]){
            clock+=1;
        }

        clock+=1;
        arrivedArray[0][8]-=1;

        if (arrivedArray[0][8]==0){
            completeA[completeA.length]=arrivedArray[0];
            arrivedArray.splice(0, 1);
        }
        
    } while (originalA.length!=0);
}

//Adds newArray to oldArray
function appendArray(oldArray, newArray){
    do{
        oldArray[oldArray.length]=newArray[0];
        newArray.splice(0, 1);
    } while (newArray.length!=0);

    oldArray=sortArray(0, oldArray);

    return oldArray;
}

function calcSEnd(tempA){
    //console.log(tempA[tempA.length-1][6]);
    tempA[tempA.length-1][6]=tempA[tempA.length-2][6]+(tempA[tempA.length-1][1])+1;
    return tempA;
}

function stcf(stcfA){
    stcfA=sortArray(1, stcfA);

    stcfA=calcEnd(stcfA);

    console.log('\nSTCF')

    stcfA=sortArray(0, stcfA);

    print(stcfA);

    return stcfA;
}

function arrayWriter(schedulerName, papa){
    var file='';
    for (var i = 0; i < papa.length; i++) {
    file+= papa[i].toString()+',\n';
    }
    //console.log(file);

    var fs = require('fs');
    fs.writeFile("output/file"+schedulerName+(fcount+1)+".csv", file, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}) 
    return file;
}

//
//  Function to create our random array
//
function createArray(){
	//console.log('Runtimes:')
var runTime = new Array(10);
for (var i = 0; i < runTime.length; i++) {
    runTime[i] = randomIntInc(2,60)
    //console.log(runTime[i])
}

//console.log('\nArrival Times:')
var arrivalTime = new Array(10);
var aTime=0;
arrivalTime[0]=0;
for (var i = 1; i < arrivalTime.length; i++) {
	aTime+=randomIntInc(5,8);
    arrivalTime[i] = aTime;
    //console.log(arrivalTime[i])

}

//console.log('\nTickets:')
var tickets = new Array(10);
for (var i = 0; i < tickets.length; i++) {
    tickets[i] = (randomIntInc(1,4)*50);
    //console.log(tickets[i])
}

//console.log('\nStride:')
var stride = new Array(10);
for (var i = 0; i < stride.length; i++) {
    stride[i] = Math.ceil(1000/tickets[i]);
    //console.log(stride[i])
}

console.log('\nPapa Array:')
var papa = new Array(10);
var titles = new Array(10);
titles = ['Job#','Run Time', 'Arrival Time', 'Tickets', 'Stride', 'Start Time', 'End Time', 'Pass']

var caption='';

for (var i = 0; i < titles.length; i++) {
    caption += (titles[i]+' | ')
}
console.log(caption)


for (var i = 0; i < papa.length; i++) {
    papa[i]=['000'+i,runTime[i], arrivalTime[i], tickets[i], stride[i], 0, 0, 0, runTime[i]];}

return papa;
}