
/*============================
||	Dexter Fichuk
||	Assignment 1
||	COIS-3320H
||	0552537
||	Pleaase enjoy my irrational Logic :')
||	***********************************************************************************************************
||	NOT COMPLETELY COMMENTED, to see rest of comments (sorry if this is cheating) but check it out on GitHub)
||	https://github.com/dexterfichuk/Node-Job-Scheduler (don't worry, was a private repository until assignment submitted!)
==============================*/

//Make output directory if it doesn't exist
var fs = require('fs');
if (!fs.existsSync('./output')){
    fs.mkdirSync('./output');
}

//Array to be used for appending turnaround and wait times
var calculatedA= new Array();

//Variable for job loop, and used for file number when writing to csv's
var fcount=0;

//For loop to choose number of times to run the jobs. (20 for this assignment, but why not try 100000?)
for (var fcount = 0; fcount < 20; fcount++) {

	//Create generated array named papa
    var papa=createArray();

    //Had some problems with using the same round robin function more than once in my loop with the same array so had to make copies to pass in
    var papajr=papa.slice(0);
    var papasr=papa.slice(0);
    var papaps=papa.slice(0);

    //Print the original generated array
    print(papa);

    sortArray(1, papa); //Where first parameter is column to sort by
    

    //Used for writing to CSV's for each scheduler, not necessary for this
    // arrayWriter('FCFS', fcfs(papa));
    // arrayWriter('Stride', stride(5, papa));
    // arrayWriter('SJF', sjf(papa));
    // arrayWriter('Round Robin', roundRobin(papa));
    // arrayWriter('STCF', stcf(papajr));

    //Run all the schedulers, then calculate the turnaround and wait times, then append it to the calculated array to be printed to a csv with all results
    calculatedA=calculator('FCFS', fcfs(papa), calculatedA);
    calculatedA=calculator('Stride', stride(5, papa), calculatedA);
    calculatedA=calculator('SJF', sjf(papa), calculatedA);
    calculatedA=calculator('Round Robin 05', roundRobin(5, papa), calculatedA);
    calculatedA=calculator('Round Robin 10', roundRobin(10, papajr), calculatedA);
    calculatedA=calculator('Round Robin 15', roundRobin(15, papasr), calculatedA);
    calculatedA=calculator('STCF', stcf(papaps), calculatedA);

    //Truncate the base array just for safety measures
    papa.length=0;
}

//For the sake of writing the log of all averages, reduce fcount so file name reflects how many times it actually run through, otherwise for 5 jobs file number would say 6
fcount-=1;

//Use my favorite overused sorting algorithm to sort the array by job number
calculatedA = sortArray(1, calculatedA);

//Add the headings to the array
calculatedA.unshift(['Scheduler', 'Round #', 'Avg Turnaround', 'Avg Wait']);

//Write the averages log to a csv
arrayWriter('CalculatedTotals', calculatedA);


//
//	Will calculate the average runtime and wait time for the passed in array, then append it to the master average log, and will add the name of the scheduler to the first column
//
function calculator(schedulerName, scheduledArray, calculatedArray){
    //avgTurnaround = (endtime - arrivaltime)/numJobs
    //avgWaiting = (startTime-arrivalTime)/numjobs
    var avgTurnaround=0, avgWaiting=0, turnSum=0, waitSum=0;

    //Calculate the sums of the turnarounds and waits by looping through entire array.
    for (var i=0; i < scheduledArray.length; i++){
        turnSum+=scheduledArray[i][6]-scheduledArray[i][2];
        waitSum+=(scheduledArray[i][5]-scheduledArray[i][2]);
    }

    //Now divide the sums by the length of the array to get the average
    avgTurnaround=turnSum/scheduledArray.length;
    avgWaiting=waitSum/scheduledArray.length;

    //Print the averages for a little fun validation
    console.log('Avg Waiting = '+avgWaiting);
    console.log('Avg Turnaround = '+avgTurnaround);

    //Make an array of the averages and return it
    calculatedArray[calculatedArray.length]=[schedulerName, fcount, avgTurnaround, avgWaiting];
    return sortArray(1, calculatedArray);
}

//
//	Print Function: Used for looping through multidimesnional arrays and printing them out.
//
function print(papa){
	//Header of jobs, couldn't be bothered to make it all format output nicely, sorry Jacques
    var heade = ['Job#','Run Time', 'Arrival Time', 'Tickets', 'Stride', 'Start Time', 'End Time', 'Pass', 'Time Left']

    //Convert header to string and print
    console.log(heade.toString());

    //Loop through arrays and print elements.
    for (var i = 0; i < papa.length; i++) {
    console.log(papa[i])
    }
}

//
//	Function to generate and random integer between the low and high values (including them)
//
function randomIntInc (low, high) {
	//Rounds the value, then returns it
    return Math.floor(Math.random() * (high - low + 1) + low);
}

//
//	Sorts the array by the index passed into it for sortBy
//
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

//
//	Will calculate the end times of the array, mostly for FCFS
//
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

//
//	Will perform the round robing algorithm on the passed in array with whatever chunk size was passed in
//
function roundRobin( chunkS, papa){
	//
	//truncate and make copies of arrays to ignore weird global problems, and make some other variables
    var baseA = new Array(0);
    baseA.length=0;
    baseA = papa.splice(0);
    var finalA = new Array (0);
    var clock = 0;

    //Set time left to run time and a few non-important fields to 0
    for (var i=0; i < baseA.length; i++){
        baseA[i][8]=baseA[i][1];
        baseA[i][7]=0;
        baseA[i][5]=0;
        baseA[i][6]=0;
    }

    //While loop to run until the original array is completely empty
    do {
    	//Run through array elements in loop until i=the arrays size (will change over the process)
        for (var i=0; i < baseA.length; i++){

        	//If arrival time is greater than clock, then set clock to arrival time without overhead.
            if (baseA[i][2]>clock){
                clock=baseA[i][2]-1;
            }

            //Remove the time chunk from the time left of the i'th element
            baseA[i][8]-=chunkS;


            //Check to if start time is zero for current job, then set it to clock, but never for job #0000 as it will always start first
            if (baseA[i][5]==0 && baseA[i][0]!='0000'){
                baseA[i][5]=clock+1;
            }

            //If time leftt = 0 (job is completed)
            if (baseA[i][8]==0){

            	//Increment clock by chunk size
                clock+=chunkS;

                //Set end time to clock
                baseA[i][6]=clock;

                //Add completed job to finished array then splice away <3
                finalA[finalA.length]=baseA[i];
                baseA.splice(i, 1);

                //Remove 1 from i so a value isn't skipped in the for loop. Will set the index back for when it increments so the row that was moved lower in array will be used next.
                i--;
            }

            //Almost same as previous if, except for if a job finished early
            else if (baseA[i][8]<0)
            {
            	//Clock increments by the time used since the job finished early
                clock+=chunkS+baseA[i][8];

                //Set time left to 0 for looks. Rest is same as before
                baseA[i][8]=0;
                baseA[i][6]=clock+1;
                finalA[finalA.length]=baseA[i];
                baseA.splice(i, 1);
                i--;
            }

            //If job hasn't completed, continue to increase clock by chunk size and go on your merry way
            else {
                clock+=chunkS;
            }
        }

    //Loop until original array is empty
    } while (baseA.length!=0);

    //Sort, print and return finished array
    console.log('Round Robin');
    finalA=sortArray(0,finalA);
    print(finalA);
    return finalA;

    //And old abandoned array I made when I misunderstood round robin scheduling, one day I will revive this and make it a new amazing scheduler
    /*
    var quant = [15, 15, 15];
    qSize = 0;
    //Do until the baseA array is empty (finished processing)
    do {
        //Deduct current quant size from time left
        baseA[0][8]-=chunkS;

        if (baseA[0][5]==0){
            baseA[0][5]=clock;
        }

        //Check if time left is less than 0 (job finishes early)
        if (baseA[0][8]<0){

            //Increment global clock by time used on job
            clock+=baseA[0][8]+chunkS;

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
            clock+=chunkS+1;

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
return finalA;*/
}

//Used for stride scheduling, pass cpu time and array as parameters
function stride(cpuTime, pArray){
    var papa = pArray.slice(0);
    var q=0;

    //Set start time to 0 for all
    for (var i=0; i < pArray.length; i++){
        pArray[i][5]=0;
    }

    //Array for completed rows to be held in
    var stridedArray = new Array(10);
    var clock=0;
    do
    {
        //Sort the array based on pass count sizes
        papa=sortArray(7,papa);

        //Add the rows stride to pass count
        papa[0][7]+=papa[0][4];

        if (papa[0][5]==0){
            papa[0][5]=clock;
        }

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

    //Sort, then print the complete array, then return it.
    console.log(papa);
    stridedArray=sortArray(0,stridedArray);
    console.log('\nStrided Array:');
    print(stridedArray);

    return stridedArray;
}

//First come first serve algorithm
function fcfs(fcfsA){
	//Sort by job number ascending
    fcfsA=sortArray(0, fcfsA);

    //Calculate end times for all
    fcfsA=calcEnd(fcfsA);

    //Print and return the array.
    console.log('\nFCFS')
    print(fcfsA);
    return fcfsA;
}

//Shotest Job First
function sjf(papa){
    //Sorts the array by arrival times, redudent
    var sjfA = papa.slice(0);
    var clock = 0;

    sjfA=sortArray(2, sjfA);

    for (var i=0; i < sjfA.length; i++){
        sjfA[i][5]=0;
    }

    //Declare some garbage arrays, temp one for trying random stuff, and hArray for final one.
    var hArray = new Array();
    var tempArray = new Array();
    var tcounter=0;

    //Run first job
    sjfA[0][6]=sjfA[0][1];
    clock+=sjfA[0][6]+1;

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
        if (tempArray[0][5]==0){
        tempArray[0][5]=clock;
        }

        clock+=tempArray[0][1]+1;

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

//Shortest Job First Algorithm
function stcf(arr){
    //Sorts the array by arrival times, redudent, and makes a copy of parameter array
    var originalA = new Array(arr.length);
    originalA=sortArray(2, arr.slice(0));
    //print(originalA);
    var clock=0;
    var loopCounter=1;
    //console.log('Loop Count: '+loopCounter);
    loopCounter++;

    //Clear some of the columns and set the time left to the run time
    for (var i=0; i < originalA.length; i++){
        originalA[i][8]=originalA[i][1];
        originalA[i][6]=0;
        originalA[i][5]=0;
    }

    //This was extremely weird, but I could only get my loop working but it would not process the very last row with the highest arrival time, 
    //so my way of fixing it was to auto add a row to the very end with a arrival time +1 higher than the highest.
    originalA[originalA.length]=[,,originalA[originalA.length-1][2]+1,,,,];

    //print(originalA);
    //Declare some garbage arrays, temp one for trying random stuff, and hArray for final one.
    var completeA = new Array();
    var arrivedArray = new Array();
    var tcounter=0;
    var compareHolder = new Array();
    
    //Comparison used to see if the previously processed array is now different from the current shorters job
    compareHolder.push(originalA[0]);

    console.log(arrivedArray[0]);

    //while loop that runs until the arrived array has been emptied (every item has been processed)
    do{
    	//Set arrived array to be itself but sorted by run times
        arrivedArray=sortArray(1, arrivedArray);

        //Increment clock overhear
        clock+=1;

        //if the compare holder array is empty, sets it's job number to the first in the arrived array, mostly used for first arrival
        if (compareHolder.length==0){
            compareHolder[0][0]=arrivedArray[0][0];
        }

        //while loop that quits when flag is set to 1 (quitDo)
        do {
        	//Flag for breaking loop
            var quitDo=0;

            //If the start time is less than the clock the the original array has mroe than 1 item
            if (originalA[0][2] < clock && originalA.length!=1){

            	//If the start time = 0, set it to the clock -the overhead (1)
                if (originalA[0][5]==0);{
                    originalA[0][5]=clock-1;
                }
                //Put the item that has arrived into the arrivaed array.
                arrivedArray[arrivedArray.length]=originalA[0];

                //Remove it from original
                originalA.splice(0, 1);
            }
            //Otherwise quit this process and continue the next loop
            else {
                quitDo=1;
            }
            } while (quitDo==0);

        //Sort arrived array by the runtimes
        arrivedArray=sortArray(1, arrivedArray);

        //Check if the shortest job in arrived array is the same as last time, if not, increment clock by the overhead to switch
        if (arrivedArray[0][0]!=compareHolder[0][0]){
            clock+=1;
        }

        //Add sme overhead
        clock+=1;

        //Reduce the time left of the shortest job by 1
        arrivedArray[0][8]-=1;

        //If the time left of the shortest job = 0
        if (arrivedArray[0][8]==0){
        	//Set the end time to the clock
            arrivedArray[0][6]=clock;

            //Add the row to the completed array and remove it from arrived
            completeA[completeA.length]=arrivedArray[0];
            arrivedArray.splice(0, 1);
        }
    //Quit when arrivedArray finished processing        
    } while (arrivedArray.length!=0);

    //Sort and return complete array
    console.log('\nSTCF Array');
    print(sortArray(0, completeA));
    return completeA;
}

//Adds newArray to oldArray, not really used at all
function appendArray(oldArray, newArray){
    do{
        oldArray[oldArray.length]=newArray[0];
        newArray.splice(0, 1);
    } while (newArray.length!=0);

    oldArray=sortArray(0, oldArray);

    return oldArray;
}

//Calcs the end time of the last object in the array
function calcSEnd(tempA){
    tempA[tempA.length-1][6]=tempA[tempA.length-2][6]+(tempA[tempA.length-1][1])+1;
    return tempA;
}

//
//	*******is actually not used. some old code just left here for reference purposes
function stcf(stcfA){
    stcfA=sortArray(1, stcfA);

    stcfA=calcEnd(stcfA);

    console.log('\nSTCF')

    stcfA=sortArray(0, stcfA);

    print(stcfA);

    return stcfA;
}

//
//	Array writer, capable of writing any multi-dimension matrix to a csv file
//	//shedulerName=Name you want at end of file // papa=Passed matrix
function arrayWriter(schedulerName, papa){

	//Set file to null
    var file='';

    //loop through arrays adding commas between and appending it to the file var
    for (var i = 0; i < papa.length; i++) {
    file+= papa[i].toString()+',\n';
    }

    //Write the file, and retrieve the file number for name from global fcount variables (used in for loop at beginning)
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
//  Function to create our random array with all of our beutifully generated values
//
function createArray(){
	//console.log('Runtimes:')
//Creates runtimes between 2 and 60 and puts in a array 10 times
var runTime = new Array(10);
for (var i = 0; i < runTime.length; i++) {
    runTime[i] = randomIntInc(2,60)
    //console.log(runTime[i])
}

//console.log('\nArrival Times:')
//Generates arrival times incremented by a random value between 5 and 8, then adds them to an array 10 times
var arrivalTime = new Array(10);
var aTime=0;
arrivalTime[0]=0;
for (var i = 1; i < arrivalTime.length; i++) {
	aTime+=randomIntInc(5,8);//Increment the times
    arrivalTime[i] = aTime; 
    //console.log(arrivalTime[i])

}

//console.log('\nTickets:')
//Generates tickets of either 50, 100, 150 or 200
var tickets = new Array(10);
for (var i = 0; i < tickets.length; i++) {
	//generate number between 1 and 4, then multiply by 50
    tickets[i] = (randomIntInc(1,4)*50);
    //console.log(tickets[i])
}

//console.log('\nStride:')
//Calculates strides based on tickets and adds them to an array
var stride = new Array(10);
for (var i = 0; i < stride.length; i++) {
	//1000 is our ticket account to be used
    stride[i] = Math.ceil(1000/tickets[i]);
    //console.log(stride[i])
}

console.log('\nPapa Array:')
var papa = new Array(10);
var titles = new Array(10);
//Puts the column headings is an array for reference
titles = ['Job# 0','Run Time 1', 'Arrival Time 2', 'Tickets 3', 'Stride 4', 'Start Time 5', 'End Time 6', 'Pass 7']

var caption='';

//Loop and put titles into a nice string seperated by pipelines
for (var i = 0; i < titles.length; i++) {
    caption += (titles[i]+' | ');
}
console.log(caption)

//Create our master, multi dimensional array by looping through the values of all arrays as i and placing them into rows
for (var i = 0; i < papa.length; i++) {
    papa[i]=['000'+i,runTime[i], arrivalTime[i], tickets[i], stride[i], 0, 0, 0, runTime[i]];
}
return papa;
}
