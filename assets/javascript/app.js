// Global Variables
var selectedFilter;
var cuisineReel = 0;

// Write restaurant filters to the page on page load as well as AJAX response as a default setting
$(document).ready(function () {

	loadRestaurantFilters(); 
	restaurantAJAXonLoad();
	console.log("Default Filters: " + $(".default").text());
	$("#chat").hide();
});


function loadRestaurantFilters() { 
	// Change filter listing
	$("#filterList").html("<option class='all-food default'>Whatcha craving? (Everything!)</option> <option class='american'>American</option> <option class='bbq'>BBQ/Steakhouse</option>" 
	+ "<option class='breakfast'>Breakfast</option> <option class='chinese'>Chinese</option> <option class='coffee'>Coffee Shops</option> <option class='delis'>Delis</option>"
	+ "<option class='fast-food'>Fast Food</option> <option class='french'>French</option> <option class='greek'>Greek</option> <option class='dessert'>Ice Cream/Dessert</option>"
	+ "<option class='indian'>Indian</option> <option class='italian'>Italian</option> <option class='japanese'>Japanese</option> <option class='mexican'>Mexican</option>"
	+ "<option class='pizza'>Pizza</option> <option class='seafood'>Seafood</option> <option class='spanish'>Spanish</option> <option class='thai'>Thai</option>");
	$("option").addClass("food currentFilterOptions");
}


function loadEventFilters() {
	$("#filterList").html("<option class='all-events default'>Whatcha interested in? (Show me it all!)</option>"

	+ "<optgroup label='Arts/Entertainment'> <option class='all-entertainment'>All Entertainment</option>"
	+ "<option class='art'>Art Exhibitions</option> <option class='carnivals'>Carnivals</option> <option class='comedy'>Comedy Shows</option> <option class='kids'>Kids' Events</option>"
	+ "<option class='theatre'>Theatre</option> </optgroup>"

	+ "<optgroup label='Concerts'> <option class='all-concerts'>All Concerts</option>"
	+ "<option class='classical'>Classical</option> <option class='country'>Country</option> <option class='hip-hop'>Hip-Hop</option> <option class='jazz'>Jazz</option>"
	+ "<option class='music-festivals'>Music Festivals</option> <option class='reggae'>Reggae</option> <option class='rock'>Rock</option> </optgroup>"

	+ "<optgroup label='Sporting Events'> <option class='all-sports'>All Sporting Events</option>"
	+ "<option class='baseball'>Baseball</option> <option class='basketball'>Basketball</option> <option class='football'>Football</option> <option class='golf'>Golf</option>"
	+ "<option class='horse-racing'>Horse Racing</option> <option class='hockey'>Ice Hockey</option> <option class='nascar'>Nascar</option> <option class='soccer'>Soccer</option>"
	+ "<option class='tennis'>Tennis</option> </optgroup>");
	$("option").addClass("event currentFilterOptions");
}

function createErrorMessage() {
    $(".error-message").html("Please enter a valid US zip code or City and State.");
}

function createNoEventMessage() {
	$(".no-event-message").html("The server did not return any results. Please try again later or enter a different location above.");	
}

function selectFilter() {
	$("select.filters").change(function () {
		selectedFilter = $(".filters option:selected").text();
		console.log("User Selected Filter: " + selectedFilter);
		// Write AJAX response information to the page based on selected filter
		var zip = $("#zipCode").val();
    var city = $("#cityState").val();
    console.log(zip.length);
    console.log(city.length);

    if (zip.length != 5 && $("#cityState").val() === "") {
      createErrorMessage();
      return false;
    } else {
				if ($(".filters option:selected").hasClass("food")) {
				restaurantAJAX();
				console.log("Running restaurantAJAX");
				}
				if ($(".filters option:selected").hasClass("event")) {
					eventAJAX();
					console.log("Running eventAJAX");
				}
        $(".error-message").html("");
        $(".no-event-message").html("");
    }
	});
}
selectFilter();


function restaurantAJAXonLoad() { 
		// Write AJAX restaurant response information to the page
	  var cuisine = selectedFilter;
	  var cuisineID = ""
	  
	  var lat = "40.742051";
	  var lng = "-74.004821";

	 	// var api = "a442d0d2eb4fdb705d8f8a1d8331989e"
	  var api = "a46b84ae7de46097b35a230d8d7bfd23"
	  // var api = "a39dc6d6f11e4a9ba81caba88c332778"
	  var url = "https://developers.zomato.com/api/v2.1/geocode?lat="+lat+"&lon="+lng+"&apikey="+api

	  console.log(url)

	  $.ajax({
	  url: url,
	  method: 'GET',
	  }).done(function(result) {
	  console.log(result);
	    for (var i = 0; i < result.nearby_restaurants.length; i++) {
	      var restaurant = $("<div>");
	      restaurant.addClass("food-listing");
	      restaurant.append("<h5>"+(i+1)+"</h5>");
	      restaurant.append("<h4><strong>"+result.nearby_restaurants[i].restaurant.name + "</strong></h4><a class='view-menu' href="+result.nearby_restaurants[i].restaurant.url+" target=_blank>Zomato Page</a>");
	      restaurant.append(result.nearby_restaurants[i].restaurant.location.address + "<br>");
	      restaurant.append(result.nearby_restaurants[i].restaurant.cuisines + "<br>");
	      restaurant.append("Average cost for two: $"+result.nearby_restaurants[i].restaurant.average_cost_for_two+"<br>");
	      restaurant.append("<em>Rating: "+result.nearby_restaurants[i].restaurant.user_rating.aggregate_rating+" out of 5</em>"+"<br>");
	      restaurant.append("<em>Rating Grade: "+result.nearby_restaurants[i].restaurant.user_rating.rating_text+"</em><br>");
	      $("#eventInfo").append(restaurant);

	      var restaurantImage = $("<img>").addClass("food-listing-image");
	      restaurantImage.attr("src", result.nearby_restaurants[i].restaurant.thumb);
	      $("#eventImage").append(restaurantImage);
	    };
	}).fail(function(err) {
	  createNoEventMessage();
	});
}

function restaurantAJAXEverything() {

	  var zipcode = $("#zipCode").val();
    console.log(zipcode);
    var cuisine = selectedFilter;
    var cuisineID = ""

	  geocoder = new google.maps.Geocoder();
    
    var lat = "";
    var lng = "";
    var address = "";

    if ($("#cityState").val() === "") {
    address = zipcode;
  	} else {
  		address = $("#cityState").val();
  	}

  	console.log("User inputted address: "+address);

    geocoder.geocode( { 'address': address, componentRestrictions: {country:'US'}}, function(results, status) {
    	console.log(results)
      if (status == google.maps.GeocoderStatus.OK) {
         lat = results[0].geometry.location.lat();
         lng = results[0].geometry.location.lng();
        }

      console.log("Latitude: "+lat);
      console.log("Longitude: "+lng);

      console.log(results)

      if (results[0].formatted_address.indexOf(address) == -1) {
      	createErrorMessage();
      	return false;
      };

      if (results[0].geometry.location_type === "RANGE_INTERPOLATED") {
      	createErrorMessage();
      	return false;
      }

      if (results[0].geometry.location_type === "GEOMETRIC_CENTER") {
      	createErrorMessage();
      	return false;
      }

      if (address === " "){
      createErrorMessage();
      return false;
      };

      console.log(results);

    // var api = "a442d0d2eb4fdb705d8f8a1d8331989e"
    var api = "a46b84ae7de46097b35a230d8d7bfd23"
    // var api = "a39dc6d6f11e4a9ba81caba88c332778"
	  var url = "https://developers.zomato.com/api/v2.1/geocode?lat="+lat+"&lon="+lng+"&apikey="+api

	  console.log(url)

	  $.ajax({
	  url: url,
	  method: 'GET',
	  }).done(function(result) {
	  console.log(result);
	    for (var i = 0; i < result.nearby_restaurants.length; i++) {
	    	$(".error-message").html("")
	    	$(".no-event-message").html("");
	      var restaurant = $("<div>");
	      restaurant.addClass("food-listing");
	      restaurant.append("<h5>"+(i+1)+"</h5>");
	      restaurant.append("<h4><strong>"+result.nearby_restaurants[i].restaurant.name + "</strong></h4><a class='view-menu' href="+result.nearby_restaurants[i].restaurant.url+" target=_blank>Zomato Page</a>");
	      restaurant.append(result.nearby_restaurants[i].restaurant.location.address + "<br>");
	      restaurant.append(result.nearby_restaurants[i].restaurant.cuisines + "<br>");
	      restaurant.append("Average cost for two: $"+result.nearby_restaurants[i].restaurant.average_cost_for_two+"<br>");
	      restaurant.append("<em>Rating: "+result.nearby_restaurants[i].restaurant.user_rating.aggregate_rating+" out of 5</em>"+"<br>");
	      restaurant.append("<em>Rating Grade: "+result.nearby_restaurants[i].restaurant.user_rating.rating_text+"</em><br>");
	      $("#eventInfo").append(restaurant);

	      var restaurantImage = $("<img>").addClass("food-listing-image");
	      restaurantImage.attr("src", "assets/images/everything.jpg");
	      cuisineImage = result.nearby_restaurants[i].restaurant.cuisines.split(",");
	      if (cuisineImage[0] === "") {
	      cuisineImage[0] = "everything";	
	      }
	     	restaurantImage.attr("src", "assets/images/cuisines/"+cuisineImage[0]+".jpg");
	      $("#eventImage").append(restaurantImage);
	    };
		}).fail(function(err) {
	  	createNoEventMessage();
		});
	});
}

function restaurantAJAX() { 
		// Write AJAX restaurant response information to the page
	  event.preventDefault();

	  $(".no-event-message").html("");

	  $("#eventInfo").empty();
	  $("#eventImage").empty();

    var zipcode = $("#zipCode").val();
    console.log(zipcode);
    var cuisine = selectedFilter;
    var cuisineID = ""

    $("#zipCode").empty();
	  $("#cityState").empty();

    geocoder = new google.maps.Geocoder();
    
    var lat = "";
    var lng = "";
    var address = "";

    if ($("#cityState").val() === "") {
    address = zipcode;
  	} else {
  		address = $("#cityState").val();
  	}

  	console.log("User inputted address: "+address);

    geocoder.geocode( { 'address': address, componentRestrictions: {country:'US'}}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
         lat = results[0].geometry.location.lat();
         lng = results[0].geometry.location.lng();
        };

      console.log(results) 

      if (results[0].formatted_address.indexOf(address) == -1) {
      	createErrorMessage();
      	return false;
      };

      if (results[0].geometry.location_type === "RANGE_INTERPOLATED") {
      	createErrorMessage();
      	return false;
      }

      if (results[0].geometry.location_type === "GEOMETRIC_CENTER") {
      	createErrorMessage();
      	return false;
      }

      if (address === " "){
      createErrorMessage();
      return false;
      };

      console.log(results);

      console.log("Latitude: "+lat);
      console.log("Longitude: "+lng);

      if (cuisine === "American"){
		  cuisineID = 1;
		  } else if (cuisine === "BBQ/Steakhouse"){
		  cuisineID = 193;
		  } else if (cuisine === "Breakfast"){
		  cuisineID = 182;
		  } else if (cuisine === "Chinese"){
		  cuisineID = 25;
		  } else if (cuisine === "Coffee Shops"){
		  cuisineID = 161;
		  } else if (cuisine === "Delis"){
		  cuisineID = 192;
		  } else if (cuisine === "Fast Food"){
		  cuisineID = 40;
		  } else if (cuisine === "French"){
		  cuisineID = 45;
		  } else if (cuisine === "Greek"){
		  cuisineID = 156;
		  } else if (cuisine === "Ice Cream/Dessert"){
		  cuisineID = 233;
		  } else if (cuisine === "Indian"){
		  cuisineID = 148;
		  } else if (cuisine === "Italian"){
		  cuisineID = 55;
		  } else if (cuisine === "Japanese"){
		  cuisineID = 60;
		  } else if (cuisine === "Mexican"){
		  cuisineID = 73;
		  } else if (cuisine === "Pizza"){
		  cuisineID = 82;
		  } else if (cuisine === "Seafood"){
		  cuisineID = 83;
		  } else if (cuisine === "Spanish"){
		  cuisineID = 89;
		  } else if (cuisine === "Thai"){
		  cuisineID = 95;
		  } else {
		  	restaurantAJAXEverything();
		  	return false;
		  }

		  console.log("Cuisine ID: "+cuisineID);

		  // var api = "a442d0d2eb4fdb705d8f8a1d8331989e"
      var api = "a46b84ae7de46097b35a230d8d7bfd23"
      // var api = "a39dc6d6f11e4a9ba81caba88c332778"
      var url = "https://developers.zomato.com/api/v2.1/search?start=0&count=10&sort=rating&sort=desc&lat="+lat+"&lon="+lng+"&cuisines="+cuisineID+"&radius=16090&apikey="+api

      console.log(url)

      $.ajax({
      url: url,
      method: 'GET',
      }).done(function(result) {
      console.log(result);
      if (result.status === "404") {
      	createNoEventMessage();
      }
      $(".error-message").html("")
      $(".no-event-message").html("");
        for (var i = 0; i < 10; i++) {
          var restaurant = $("<div>");
          restaurant.addClass("food-listing");
          restaurant.append("<h5>"+(i+1)+"</h5>");
          restaurant.append("<h4><strong>"+result.restaurants[i].restaurant.name + "</strong></h4><a class='view-menu' href="+result.restaurants[i].restaurant.url+" target=_blank>Zomato Page</a>");
          restaurant.append(result.restaurants[i].restaurant.location.address + "<br>");
          restaurant.append(result.restaurants[i].restaurant.cuisines + "<br>");
          restaurant.append("Average cost for two: $"+result.restaurants[i].restaurant.average_cost_for_two+"<br>");
          restaurant.append("Rating: "+result.restaurants[i].restaurant.user_rating.aggregate_rating+" out of 5"+"<br>");
          restaurant.append("Rating Grade: "+result.restaurants[i].restaurant.user_rating.rating_text+"<br>");
         	$("#eventInfo").append(restaurant);

         	var restaurantImage = $("<img>").addClass("food-listing-image");
         	++cuisineReel
          restaurantImage.attr("src", "assets/images/cuisinereels/"+cuisineID+"-"+cuisineReel+".jpg");
          if (cuisineReel >= 5) {
          cuisineReel = 0;
          }
	      	$("#eventImage").append(restaurantImage);
        };
    }).fail(function(err) {
      createNoEventMessage();
    });
  });
}

function eventAJAX() {
	// Write all AJAX response information to the page upon category click
	$("#eventInfo").empty();
	$("#eventImage").empty();

	var api_key = "ZS4T7zGnxq66H8Kv";
	// var queryURL = "https://eventful-proxy.herokuapp.com/search?";
	var queryURL = "https://api.eventful.com/json/events/search?";

	var address = $("#zipCode").val().trim();
	if (address === "") {
		address = $("#cityState").val().trim();
	}

	getKeyword();

	var searchURL = queryURL + "app_key=" + api_key + "&location=" + address + "&within=10&keywords=" + keywords + "&date=today";
	console.log(searchURL);

	$.ajax({
		url: searchURL,
		dataType: 'jsonp',
		method: "POST",
	}).done(function(response) {
		// console.log(JSON.parse(response).events);
		console.log(response);
		if (response.events === null) {
			createNoEventMessage();
		}
		else {
			$(".no-event-message").html("");
		results = response.events.event;
		for (var i = 0; i < results.length; i++) {
			var title = results[i].title;
			var description = results[i].description;
			var start = results[i].start_time;
			var end = results[i].stop_time;
			var address = results[i].venue_address;
			var city = results[i].city_name;
			var state = results[i].region_name;
			var code = results[i].postal_code;
			var link = results[i].url;

			var startDate = start.slice(0,11);
			startDate = moment(startDate, "YYYY/MM/DD");
			startDate = moment(startDate).format("ll");
			
			var startTime = start.slice(11,21);
			startTime = moment(startTime, "HH:mm:ss");
			startTime = moment(startTime).format("LT");

			if (title === null) {title = "";}
			if (start === null) {start = "";}
			if (end === null) {
				var endDate = "Unknown";
				var endTime = "";
			}
			else {
				var endDate = end.slice(0,11);
				endDate = moment(endDate, "YYYY/MM/DD");
				endDate = moment(endDate).format("ll");

				var endTime = end.slice(11,21);
				endTime = moment(endTime, "HH:mm:ss");
				endTime = moment(endTime).format("LT");
			}
			if (address === null) {address = "";}
			if (city === null) {city = "";}
			if (state === null) {state = "";}
			if (code === null) {code = "";}
			if (link === null) {link = "";}

			var article = $("<div>");
			article.addClass("event-listing");
			article.append("<h4><strong>"+ title + "</strong></h4>");
			// article.append("<p>" + description + "</p>");
			article.append("<p>Start Date: " + startDate + " " + startTime + "<br>End Date: " + endDate + " " + endTime + "</p>");
			article.append("<p>" + address + "<br>" + city + ", " + state + " " + code + "</p>");
			article.append("<p><a href=" + link + " target='_blank'>Read More</a></p>");
			var eventImage = $("<img>").addClass("event-listing-image");
			// eventImage.attr("src", "http://via.placeholder.com/350x150");
			eventImage.attr("src", "assets/images/" + keywords + ".jpg");
			

			$("#eventInfo").append(article);
			$("#eventImage").append(eventImage);
			}
		}
	});
}

function getKeyword() {
	keywords = $(".filters option:selected").text().toLowerCase();
	console.log(keywords);
	if (keywords === "whatcha interested in? (show me it all!)") {
		keywords = "activity";
	}
	if (keywords === "all entertainment") {
		keywords = "community";
	}
	if (keywords === "all concerts") {
		keywords = "music";
	}
	if (keywords === "all sporting events") {
		keywords = "sports";
	}
	if (keywords === 'art exhibitions') {
		keywords = "art";
	}
	if (keywords === "carnivals") {
		keywords = "carnival";
	}
	if (keywords === "comedy shows") {
		keywords = "comedy";
	}
	if (keywords === "hip-hop") {
		keywords = "hiphop";
	}
	if (keywords === "kids' events") {
		keywords = "kid";
	}
	if (keywords === "horse racing") {
		keywords = "horseracing";
	}
	if (keywords === "ice hockey") {
		keywords = "icehockey";
	}
	if (keywords === "music festivals") {
		keywords = "musicfestival";
	}
}

function loadSearchScreen() {
	loadRestaurantFilters(); 
	restaurantAJAXonLoad();
	$(".login").hide();
	$(".new-account").hide();
	$("#chat").hide();
	$(".user-input").show();
	$("#filterList").show();
	$(".category-buttons").show();
	$(".bored-label").show();
	$(".bored-input").show();
	$(".category").removeAttr("id", "selected");
	$(".cat-restaurants").attr("id", "selected");
}

// Create chat room and append it to the screen
function loadChatScreen() {
	$(".login").hide();
	$(".new-account").hide();
	$(".user-input").hide();
	$("#filterList").hide();
	$(".category-buttons").hide();
	$(".bored-label").hide();
	$(".bored-input").hide();
	var chatHeading = ($("<h3>The Official Cure My Boredom Chat</h3>"
										 + "<h5>Discuss events and restaurants you are going to and meet up with new friends!</h5>"));
	var chatInput   = ($("<input type='text' class='form-control' id='message-input' placeholder='Message'></div></div></div>"
									   + "<button id='send' class='btn btn-default submit-button'>Send</button>"));

	$("#chat-heading").html(chatHeading);
	$("#chat-input").html(chatInput);
}

// Create sign in form and append it to the sceen
function loadSignInScreen() {
	$("#eventInfo").empty();
	$("#eventImage").empty();
	$(".user-input").hide();
	$("#filterList").hide();
	$(".category-buttons").hide();
	var signInScreen = ($("<h1 class='login-message'></h1>"
						+ "<h3 class='login-heading'>Log in or Sign Up</h3><br><h5 class='create-account'>"
						+ "<button id='continue-as-guest' class='btn btn-default submit-button'>Continue as Guest</button>"
						+ "<button id='continue' class='btn btn-default submit-button'>Continue</button>"
						+ "<div class='account-error-message'></div>"
						+ "<div class='row'><div class='col-md-12'><div class='form-group login-form'>"
						+ "<input type='text' class='form-control' id='userName' placeholder='First Name'>"
						+ "<input type='email' class='form-control' id='userEmail' placeholder='Email'>"
						+ "<input type='password' class='form-control' id='userPassword' placeholder='Password'></div></div></div>"
						+ "<button id='login' class='btn btn-default submit-button'>Log in</button>"
						+ "<button id='add-user' class='btn btn-default submit-button'>Sign Up</button>"
						+ "<button id='logout' class='btn btn-default submit-button'>Log Out</button>"
						));

	$(signInScreen).addClass("login");
	$("#eventView").append(signInScreen);
}

// When the user logs in, display a login message
function loadLoginMessage() {
	var loginMessage = $("<div>");
	loginMessage.html("Hello " + userName);
	loginMessage.addClass("capitalize-center");
	$(".login-message").html(loginMessage);
}

// Empty the values of the input fields
function clearUserInput() {
   $("#userName").val("");
   $("#userPassword").val("");
   $("#userEmail").val("");
 }


// All on click events

// When the user clicks the search icon in the navbar
$(document).on("click", ".search", function() {
	$("#eventInfo").empty();
	$("#eventImage").empty();
	$("#chat").hide();
  $(".user-input").show();
	$(".sign-in").prop("disabled", false);
	loadSearchScreen();
});

// When the user clicks the chat icon in the navbar
$(document).on("click", ".chat", function() {
	$("#eventInfo").empty();
	$("#eventImage").empty();
	$(".sign-in").prop("disabled", false);
	$("#chat").show();
	$("#chat-heading").show();
	$("#chat-messages").show();
	loadChatScreen();
	$("#chat-messages").animate({"scrollTop": $("#chat-messages")[0].scrollHeight}, "fast");
});

// When the user clicks the sign-in icon in the navbar
$(document).on("click", ".sign-in", function() {
	loadSignInScreen();
	$("#chat").hide();
	$(".search").prop("disabled", true);
	$(".chat").prop("disabled", true);
	$(".sign-in").prop("disabled", true);
	if(userName === " "){
		$("#logout").hide();
		$("#continue").hide();
		} else {
			$("#add-user").hide();
   		$("#continue-as-guest").hide();
   			$("#login").hide();

   		  $(".login-form").hide();
   		  $(".login-heading").hide();

   			$("#continue").show();
		}
});

// When the user clicks Continue as Guest in login screen
$(document).on("click", "#continue-as-guest", function() {
    location.reload();
});

// When the user clicks Continue in login screen
$(document).on("click", "#continue", function() {
    location.reload();
 		$(".search").prop("disabled", false);
		$(".chat").prop("disabled", false);
});

// When the user clicks the submit button to input their zip/city on main screen
$(document).on("click", ".bored-submit-button", function(event) {
    event.preventDefault();
    var zip = $("#zipCode").val();
    var city = $("#cityState").val();

    $(".error-message").html("");
    $(".no-event-message").html("");

    if (zip.length != 5 && $("#cityState").val() === "") {
      createErrorMessage();
      return false;
    } else {
				if ($(".filters option:selected").hasClass("food")) {
				restaurantAJAX();
				console.log("Running restaurantAJAX");
				}
				if ($(".filters option:selected").hasClass("event")) {
					eventAJAX();
					console.log("Running eventAJAX");
				}
        $(".error-message").html("");
        $(".no-event-message").html("");
    }
});


// On click events for categories - List different options in each category
$(document).on("click", ".category", function() {
	$("#eventInfo").empty();
	$("#eventImage").empty();
	$(".cat-restaurants").removeAttr("id", "selected");
	$(".category").removeAttr("id", "selected");
	$(this).attr("id", "selected");

	if($(this).hasClass("cat-restaurants")) {
		// Change filter listing
		loadRestaurantFilters();
		// Retrieve default filters on category click with ".default"
		console.log("Default Filters: " + $(".default").text());
		// Write all AJAX response information to the page upon category click
		restaurantAJAX();
	}

	if($(this).hasClass("cat-events")) {
		// Change filter listing
		loadEventFilters();
		// Retrieve default filters on category click with ".default"
		console.log("Default Filters: " + $(".default").text());
		// Write all AJAX response information to the page upon category click
		eventAJAX();
	}
});

// On click event for the send message button in chat
 $(document).on("click", "#send", function() {
 	if(userName === " ") {
 		// User must be logged in to utilize chat
 		$("#chat-input").append("<p class='chat-error-message'>Please login or create an account to utilize the chatroom.</p>");
 	} else if (userName) { 
		console.log("send button pressed");
		// If userName is valid, obtain message-input value 
		var messageInput = $("#message-input").val();
		var sendMessage = userName + ": " + messageInput;
		var sentMessages = $("<div>").addClass("sent-messages");
		console.log("message input " + messageInput);

		if(!messageInput) {
			// Don't allow user to send a blank message
		  $("#chat-input").append("<p class='chat-error-message'>Please enter a message.</p>");
		} else if (messageInput) {
		// Send valid message-input to Firebase for storage.
		  database.ref().push({
		    sentMessages: sendMessage,
        dateAdded: firebase.database.ServerValue.TIMESTAMP // Getting current time
		  });
	  }
		// Delete text in message-input field after it has been sent. 
  	$("#message-input").val(" ");
  }
});




// Initialize Firebase. Firebase used to save user login information as well as enable a chat room feature.
var config = {
apiKey: "AIzaSyAH0p97UUJUHYcSXplmLkCUDPTbTOWituw",
authDomain: "curingboredom-d4b4e.firebaseapp.com",
databaseURL: "https://curingboredom-d4b4e.firebaseio.com",
projectId: "curingboredom-d4b4e",
storageBucket: "curingboredom-d4b4e.appspot.com",
messagingSenderId: "403783343234"
};

firebase.initializeApp(config);

// Get elements
var database = firebase.database();
var userName;
var userPassword;
var userEmail;
var sentMessages;
var filter;
var li;
var input;
var a;
var i;

// Allow user to filter through chat results
function filterChat() {
  chat = $("#chat-messages").text();
  filter = sentMessages;
 	input = $("#myInput");
  filter = input.val().toUpperCase();
	li = $("li");

	// Loop through all list items, and hide those who don't match the search query
	for (i = 0; i < li.length; i++) {
		console.log("all messages" + li);
		a = li[i];
		if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
			  li[i].style.display = "";
		} else {
			li[i].style.display = "none";
		}
	}
}


database.ref().on("child_added", function(childSnapshot) {
// Display the username in the navbar to let the user know they are logged in while they use the app.
if (childSnapshot.child("userName").exists()) { 
      // console.log("snapshot username " + childSnapshot.val().userName);
      userName = childSnapshot.val().userName; 
      $(".user-name-message").html(userName).addClass("capitalize");
  }
// If chat messages are stored in Firebase, append them to the chat-messages div. 
if (childSnapshot.child("sentMessages").exists()) { 
      // console.log("sent message " + childSnapshot.val().sentMessages);
      sentMessages = childSnapshot.val().sentMessages;
      $("#chat-messages").append("<li class='chat-message'><a>" + sentMessages + "</a></li>");
      $("#chat-messages").animate({"scrollTop": $("#chat-messages")[0].scrollHeight}, "fast");
      $("#chat-filter").html("<div class='form-group'><input type='text' class='form-control' id='myInput' onkeyup='filterChat()' placeholder='Filter chat by keyword..'></div>");
  }
});



// When user creates a new account
$(document).on("click", "#add-user", e => { 
userName = $("#userName").val();
userPassword = $("#userPassword").val();
userEmail = $("#userEmail").val();
// Check e-mail format
var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  $(".account-error-message").html("");

  if ((userEmail.match(re) !== null) && (userPassword) && (userName)) {
  	console.log(userEmail);
			// Create user account in Firebase through userEmail, userPassword Firebase authentication.
		var promise = firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword);
		promise.catch(e => console.log(e.code));
		$(".account-error-message").show();
		promise.catch(e => $(".account-error-message").html(e.message));

  } else if ((!userEmail) || (!userName) || (!userPassword)) {
   	$(".account-error-message").html("Please enter a username, email and password.");

  } else if (userEmail.match(re) === null) {
  	$(".account-error-message").html("Please enter a valid email.");
  }
});


// When user logs in, get and check input fields. Utilize Firebase email/password authentication.
$(document).on("click", "#login", e => { 
userName = $("#userName").val();
userPassword = $("#userPassword").val();
userEmail = $("#userEmail").val();
console.log("username: " + userName);

if ((userName) && (userEmail)) { 
var promise = firebase.auth().signInWithEmailAndPassword(userEmail, userPassword);

promise.catch(e => console.log(e.code));
$(".account-error-message").show();
promise.catch(e => $(".account-error-message").html(e.message));

} else if ((userName) && (userEmail) && (userPassword)) {
	loadLoginMessage();
		database.ref().push({
    	userName: userName
    });
} else if ((!userName) && (!userPassword) && (!userEmail)) {
	$(".account-error-message").html("Please enter your username, email and password.");
} else if ((!userName) && (!userPassword)) {
	$(".account-error-message").html("Please enter your username and password.");
} else if (!userName) {
	$(".account-error-message").html("Please enter your username.");
} else if ((!userPassword) && (!userEmail)) {
	var promise = firebase.auth().signInWithEmailAndPassword(userEmail, userPassword);
	promise.catch(e => console.log(e.code));
	$(".account-error-message").show();
	$(".account-error-message").html("Invalid email and password. Please enter your correct credentials.");
} else if (!userPassword) {
	var promise = firebase.auth().signInWithEmailAndPassword(userEmail, userPassword);
	promise.catch(e => console.log(e.code));
	$(".account-error-message").show();
	$(".account-error-message").html("Password invalid. Please enter a correct password.");
} else if (!userEmail) {
	var promise = firebase.auth().signInWithEmailAndPassword(userEmail, userPassword);
 	promise.catch(e => console.log(e.code));
	$(".account-error-message").show();
	$(".account-error-message").html("Invalid email. Please enter a correct email.");
}
});

// When user logs out
$(document).on("click", "#logout", e => {
  userName = " ";
	    database.ref().push({
			userName: userName
		});
 	firebase.auth().signOut();
  $(".user-name-message").removeClass();
  location.reload();
  $("#logout").hide();
});


// Add real-time authentication to know when the user logs in and logs out.
firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser) {
			console.log(firebaseUser);
			authdata = firebaseUser;
		  console.log("user logged in");
		  loadLoginMessage();
		  clearUserInput();

		  $(".login-form").hide();
		  $(".login-heading").hide();
		  $(".account-error-message").hide();
			$("#logout").show();
			$("#add-user").hide();
			$("#continue").show();
			$("#continue-as-guest").hide();
			$("#login").hide();
	    database.ref().push({
			userName: userName
		});

		} else {
			console.log("not logged in");
		  authdata = null;
		  userName = " ";
			$("#logout").hide();
		}
});