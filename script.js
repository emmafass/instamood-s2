var INSTA_API_BASE_URL = "https://api.instagram.com/v1";
var app = angular.module('Instamood',[]);

app.controller('MainCtrl', function($scope, $http) {
  // get the access token if it exists
  $scope.hasToken = true;
  var token = window.location.hash;
  console.log(token);
  if (!token) {
  	$scope.hasToken = false;
  }
  token = token.split("=")[1];

  // $scope.getInstaPics = function() {
  	console.log("pressed load pictures");
  	var path = "/users/self/media/recent";
  	var mediaUrl = INSTA_API_BASE_URL + path;
  	$http({
  		method: "JSONP",
  		url: mediaUrl,
  		params: {
  			callback: "JSON_CALLBACK",
        // you need to add your access token here, as per the documentation
        access_token: "219938406.a7bd908.7eccbc8c4a034f75b7c75ce93f92048d"
    }
}).then(function(response) {
	console.log(response);
	console.log("test");
	$scope.picArray = response.data.data;

      // now analyze the sentiments and do some other analysis
      // on your images 

    //Ego Score
    var ego = 0;
    for(var i = 0; i < $scope.picArray.length; i++){
    	if($scope.picArray[i].user_has_liked) {
    		ego++;
    	}
    }
    $scope.ego_score = ego;

    //Popularity
    var totalLikes = 0;
    for (var i = 0; i < $scope.picArray.length; i++){
    	var num_likes = parseInt($scope.picArray[i].likes.count,10);
    	// console.log($scope.picArray[i].likes.count);
    	totalLikes += num_likes;
    }
    $scope.pop = totalLikes/$scope.picArray.length;

    //Active Days
    var day = "";
    var days = [];
    for (var i = 0; i < $scope.picArray.length; i++){
    	day = new Date($scope.picArray[i].created_time * 1000);
    	var day_of_week = day.getDay();
    	days.push(day_of_week);
    }
    var mon = 0;
    var tues = 0;
    var wed = 0;
    var thurs = 0;
    var fri = 0;
    var sat = 0;
    var sun = 0;

    for (var i = 0; i < days.length; i++){
    	if (days[i]===0){
    		sun++;
    	}
    	else if (days[i]===1){
    		mon++;
    	}
    	else if (days[i]===2){
    		tues++;
    	}
    	else if (days[i]===3){
    		wed++;
    	}
    	else if (days[i]===4){
    		thurs++;
    	}
    	else if (days[i]===5){
    		fri++;
    	}
    	else if (days[i]===6){
    		sat++;
    	}
    }
    var week = [];
    var x = 0;
    week.push(sun, mon, tues, wed, thurs, fri, sat);
    for (var i = 0; i < week.length; i++) {
    	if (week[i] > x) {
    		x = week[i];
    	}
    }
    var active_day = "";
    if (x === sun) {
    	active_day = "Sunday";
    }
    else if (x === mon) {
    	active_day  = "Monday";
    }
    else if (x === tues) {
    	active_day  = "Tuesday";
    }
    else if (x === wed) {
    	active_day  = "Wednesday";
    }
    else if (x === thurs) {
    	active_day  = "Thursday";
    }
    else if (x === fri) {
    	active_day  = "Friday";
    }
    else if (x === sat) {
    	active_day  = "Saturday";
    }
    console.log(active_day);
    $scope.a_day = active_day;

    //Brevity
    var cap_length = 0;
    for(var i = 0; i < $scope.picArray.length; i++){
    	cap_length += $scope.picArray[i].caption.text.length;
    }
    $scope.brevity = cap_length/$scope.picArray.length;

    //Hashtags
    var num_tags = 0;
    for (var i = 0; i < $scope.picArray.length; i++){
    	num_tags += $scope.picArray[i].tags.length;
    }
    $scope.visibility = num_tags/$scope.picArray.length;

    //Sentiments
    var cap = "";
    for (var i = 0; i < $scope.picArray.length; i++){
    	cap = $scope.picArray[i].caption.text;
    	analyzeSentiments(cap);
    }
    $scope.posArray = [];

  })
;

var analyzeSentiments = function(i) {
    // when you call this function, $scope.picArray should have an array of all 
    // your instas. Use the sentiment analysis API to get a score of how positive your 
    // captions are
    $http({
			url: "https://twinword-sentiment-analysis.p.mashape.com/analyze/",
			method: "GET",
			headers: {
			 'X-Mashape-Key': "zg3suLbBHEmshQMWOmfyLPqK2Vxjp1iWrEIjsnCyTbU9yQHQGA"
			},
			params: {
			 text: i
			}
		}).then(function(response) {
			console.log(response);	
			// $scope.positivity = response.score;
			$scope.posArray.push(response.data.score);
			// console.log("test");
			var total_pos = 0;
			for(var i = 0; i < $scope.posArray.length; i++){
				total_pos += $scope.posArray[i];
				// console.log("added to the positivity array");
			}
			$scope.avg_pos = total_pos/$scope.posArray.length;
		})
}


});
