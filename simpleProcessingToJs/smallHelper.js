  var translateFromFormIntoForm = function() {
    document.getElementById('translatedSketch').value = Processing.compile(document.getElementById('processingCode').value);
    addHashCode();
  };

  var insertInProcessingSourceForm = function(theProcessingSketchAsString) {
    document.getElementById('processingCode').value = theProcessingSketchAsString;
  };

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

  var testAll = function() {
	clearHashCodes();
	var programToRun = "";
	
	var i=0;
	for (i=1;i<5;i++) {
		programToRun = programToRun + "insertInProcessingSourceForm(example"+pad(i,2)+"); translateFromFormIntoForm();";
	}
	eval(programToRun);
	alert(document.getElementById('overallHashCode').value);
  };

function addHashCode() {
  document.getElementById('hashCodes').value = document.getElementById('hashCodes').value + MD5(document.getElementById('translatedSketch').value) + '\n';
  document.getElementById('overallHashCode').value = MD5(document.getElementById('hashCodes').value);
}

function runExample(whichExample) {
  insertInProcessingSourceForm(whichExample);
  translateFromFormIntoForm();
}

function clearHashCodes() {
  document.getElementById('hashCodes').value = "";
  document.getElementById('overallHashCode').value = "";
}