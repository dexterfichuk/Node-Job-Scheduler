console.log('Hello world')
var aTime=0;

var papa=createArray();
sortArray(1, papa); //Where first parameter is column to sort by




function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function sortArray (sortBy, papaA){
	papaA.sort(function(a, b)
	{
		//Sort by whatever recieved field
 	   return a[sortBy] - b[sortBy];	
	});
	console.log('\nSorted array?')

for (var i = 0; i < papaA.length; i++) {
    console.log(papaA[i])
}

return papaA;
}

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
titles = ['Job#','Run Time', 'Arrival Time', 'Tickets', 'Stride']

var caption='';

for (var i = 0; i < titles.length; i++) {
    caption += (titles[i]+' | ')
}
console.log(caption)


for (var i = 0; i < papa.length; i++) {
    papa[i]=['000'+i,runTime[i], arrivalTime[i], tickets[i], stride[i]];    
    console.log(papa[i])
}
return papa;
}