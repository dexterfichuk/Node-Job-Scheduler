console.log('Hello world')
var aTime=0;
global.fcount=0;
var papa=createArray();
print(papa);

sortArray(1, papa); //Where first parameter is column to sort by
fcfs(papa);
sjf(papa);
stride(papa);


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

function stride(strideA){
    var j=1;
    var clock=0;
    var lowest=0;
        //for (var i = 0; i < 5; i++) {
    for (var i = 0; i < strideA.length; i++) {
    strideA[i][5]=-1;
    strideA[i][6]=0;
    strideA[i][8]=strideA[i][1];
    }
    
        strideA=lowestPriority(strideA);


    console.log('\nFinal Stride Array');
    strideA=sortArray(0, strideA);

    print(strideA);

    return strideA;

}

function lowestPriority(papa){
    var lowestJob=0000;
    var clock=0;
    var j=0;

    //do{
        var current=1000;
        
    for (var i = 0; i < papa.length; i++) {
        j++;
        if (papa[i][7]>current || papa[i][8]<=0){
            console.log('In if section for '+i);
            //lowestJob=-1;
        }

        else{
            //console.log('Reaches else for '+i)
            current=papa[i][7];
            lowestJob=i;

            console.log('\nClock ticks '+clock+' For Array '+ j);
            print(papa);
        }
        //console.log('Reaches outside if\n');
    }
//} while (j!=2);

    console.log('Final array ' + lowestJob+' '+clock);
    print(papa);
    return papa;
}


function fcfs(fcfsA){
    fcfsA=sortArray(0, fcfsA);

    fcfsA=calcEnd(fcfsA);

    console.log('\nFCFS')
    print(fcfsA);

    arrayToString("FCFS",fcfsA);

    return fcfsA;
}

function sjf(sjfA){
    sjfA=sortArray(1, sjfA);

    sjfA=calcEnd(sjfA);

    console.log('\nSJF')

    sjsfA=sortArray(0, sjfA);

    print(sjfA);

    return sjfA;
}

function stcf(stcfA){
    stcfA=sortArray(1, stcfA);

    stcfA=calcEnd(stcfA);

    console.log('\nSTCF')

    stcfA=sortArray(0, stcfA);

    print(stcfA);

    return stcfA;
}

function arrayToString(schedulerName, papa){
    var file='';
    for (var i = 0; i < papa.length; i++) {
    file+= papa[i].toString()+',\n';
    }
    console.log(file);

    var fs = require('fs');
    fs.writeFile("file"+schedulerName+fcount+".csv", file, function(err) {
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
	console.log('Runtimes:')
var runTime = new Array(10);
for (var i = 0; i < runTime.length; i++) {
    runTime[i] = randomIntInc(2,60)
    console.log(runTime[i])
}

console.log('\nArrival Times:')
var arrivalTime = new Array(10);
for (var i = 0; i < arrivalTime.length; i++) {
	aTime+=randomIntInc(5,8);
    arrivalTime[i] = aTime;
    console.log(arrivalTime[i])

}

console.log('\nTickets:')
var tickets = new Array(10);
for (var i = 0; i < tickets.length; i++) {
    tickets[i] = (randomIntInc(1,4)*50);
    console.log(tickets[i])

}

console.log('\nStride:')
var stride = new Array(10);
for (var i = 0; i < stride.length; i++) {
    stride[i] = Math.ceil(1000/tickets[i]);
    console.log(stride[i])
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
    papa[i]=['000'+i,runTime[i], arrivalTime[i], tickets[i], stride[i], 0, 0, 0, 0];
}
return papa;
}