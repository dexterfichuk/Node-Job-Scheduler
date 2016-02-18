console.log('Hello world')
var aTime=0;
global.fcount=0;


for (var fcount = 0; fcount < 1; fcount++) {
    var papa=createArray();
    print(papa);
    sortArray(1, papa); //Where first parameter is column to sort by
    //fcfs(papa);
    sjf(papa);
    //stride(5, papa);
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

//Used for stride scheduling, pass cpu time and array as parameters
function stride(cpuTime, papa){
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

        //if the job compeltes but its Time Left reaches a negative
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
    arrayWriter("StrideS",stridedArray);

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

function sjf(sjfA){
    sjfA=sortArray(2, sjfA);
    var hArray = new Array();
    var tempArray = new Array();
    var tcounter=0;
    var breaker='true';
    var tempArray = new Array();
    var clock = 0;

    sjfA[0][6]=sjfA[0][1];
    clock=sjfA[0][1];

    //console.log('\nSJF');

    hArray[0]=sjfA[0]
    sjfA.splice(0, 1);
    var j=0;

    do{
    //do{
    for (var i = 0; i < sjfA.length; i++) {
    //print(sjfA);
        if (sjfA[i][2]<hArray[(hArray.length)-1][6]){
            tempArray[tempArray.length]=sjfA[i];
            //tcounter++;
            sjfA.splice(0,1);
            i=-1;
        }
    }
    //}while(sjfA[0][2]<hArray[(hArray.length)-1][6])

    tempArray=sortArray(1, tempArray);

    console.log('\nTemp?')
    print(tempArray);


    if (tempArray.length!=0){
        hArray[hArray.length]=tempArray[0];
        tempArray.splice(0,1);
        hArray=calcEnd(hArray);
    }
    else {
        console.log('None of the arrival times are before the previous end time');
    }

    for (var i = 0; i < tempArray.length; i++){
    sjfA[sjfA.length]=tempArray[i];
    }

    tempArray.length = 0;

    sjfA=sortArray(2,sjfA);
    j++;
    } while (j!=10);


    console.log('\nTemp Array');
    print(tempArray);

    //console.log(hArray[counter][6]);
    //do{
    /*console.log('The end time is' +hArray[hArray.length])

    if (sjfA[0][2]<=hArray[hArray.length][6] && sjfA.length!=0){
        console.log('Loop Works!');
        tempArray[tempArray.length]=sjfA[0];
        sjfA.splice(0, 1);
        console.log('\nTemp Array:');
        print(tempArray);
    }

    else{
        console.log('Made it to else');
        tempArray=sortArray(1, tempArray);
        hArray[hArray.length]=tempArray[0];

        sjfA=appendArray(sjfA, tempArray);
        tempArray.length = 0;
        //hArray=calcSEnd(hArray);*/
    //}}while (j!=3);

    //}while(sjfA!=0);
                //var index=0;

    /*do {
        //breaker='true';


        if (sjfA[0][2]<=hArray[hArray.length-1][6] ){

            tempArray[tempArray.length]=sjfA[0];
            sjfA.splice(0, 1);
            //index++;
            console.log('reaches if');
            print(sjfA);
            console.log(sjfA[(sjfA.length)-1][2]);
        }
        else{
            breaker='false';
            index=0;
            tempArray=sortArray(1, tempArray);
            counter++;
            hArray[counter]=tempArray[0];
            tempArray.splice(0, 1);
            console.log('reaches else');
            print(sjfA);


            do{
                sjfA.push(tempArray[0]);
                tempArray.splice(0, 1);
            }while (tempArray.length!=0)

            console.log([hArray.length-1][6]);

            hArray[hArray.length-1][6]=hArray[(hArray.length-2)][6]+hArray[hArray.length-1][1]+1;
        }

    } while (sjfA.length!=0);*/

    
    sjfA=sortArray(0, sjfA);
    console.log('\nOriginal Array');
    print(sjfA);

    console.log('\nhArray');
    print(hArray);

    return sjfA;
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
    console.log(tempA[tempA.length-1][6]);
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
    console.log(file);

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
for (var i = 0; i < arrivalTime.length; i++) {
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