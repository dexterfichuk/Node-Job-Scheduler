console.log('Hello world')
var aTime=0;

var papa=createArray();
print(papa);

sortArray(1, papa); //Where first parameter is column to sort by
fcfs(papa);
sjsf(papa);



function print(papa){
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
            sortedA[i][5]=sortedA[i][1];
        }
        else    {
            var j = 5;
            sortedA[i][5]=sortedA[i-1][j]+sortedA[i][1]+1;
            //console.log('Reaches else')
        }
    }
    return sortedA;
}

function fcfs(fcfsA){
    fcfsA=sortArray(0, fcfsA);

    fcfsA=calcEnd(fcfsA);

    console.log('\nFCFS')
    print(fcfsA);

    return fcfsA;
}

function sjsf(sjsfA){
    sjsfA=sortArray(1, sjsfA);

    sjsfA=calcEnd(sjsfA);

    console.log('\nSJSF')

    sjsfA=sortArray(0, sjsfA);

    print(sjsfA);

    return sjsfA;
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
titles = ['Job#','Run Time', 'Arrival Time', 'Tickets', 'Stride', 'End Time']

var caption='';

for (var i = 0; i < titles.length; i++) {
    caption += (titles[i]+' | ')
}
console.log(caption)


for (var i = 0; i < papa.length; i++) {
    papa[i]=['000'+i,runTime[i], arrivalTime[i], tickets[i], stride[i], 0];
}
return papa;
}