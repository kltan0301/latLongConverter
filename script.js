// var test = 'http://www.burpple.com/melben-seafood-blk-232-ang-mo-kio-ave-3?bp_ref=%2Fcategories%2Fsg%2Fzi-char';
// var splitted = test.split('');
// var final_array = [];
// for (var i = 0; i < splitted.length; i++) {
//   if (splitted[i] + splitted[i+1] + splitted[i+2] + splitted[i+3] + splitted[i+4] == 'sg%2F') {
//     for (var j = i+5; j < splitted.length; j++) {
//       final_array.push(splitted[j]);
//     }
//   }
// }
// console.log(final_array.join(''));

$(document).ready(function(){
  var test = [{"title": "Mellben Seafood (Ang Mo Kio)", "url": "http://www.burpple.com/melben-seafood-blk-232-ang-mo-kio-ave-3?bp_ref=%2Fcategories%2Fsg%2Fzi-char", "opening_hours": {"thursday:": ["04:30pm - 11:30pm"], "sunday:": ["04:30pm - 11:30pm"], "tuesday": ["04:30pm - 11:30pm"], "saturday:": ["04:30pm - 11:30pm"], "friday:": ["04:30pm - 11:30pm"], "wednesday:": ["04:30pm - 11:30pm"], "monday:": ["04:30pm - 11:30pm"]}, "contact_no": "+65 62856762", "postal_code": "560232", "address": "Block 232 Ang Mo Kio Avenue 3 #01-1222 Singapore 560232"},{"title": "Potato Head Folk", "url": "http://www.burpple.com/potato-head-folk?bp_ref=%2Fcategories%2Fsg%2Fwestern", "opening_hours": {"thursday:": ["10:00am - 11:30pm"], "sunday:": ["11:00am - 11:30pm"], "tuesday": ["11:00am - 11:30pm"], "saturday:": ["11:00am - 11:30pm"], "friday:": ["11:00am - 11:30pm"], "wednesday:": ["11:00am - 11:30pm"], "monday:": ["closed"]}, "contact_no": "+65 63271939", "postal_code": "089143", "address": "36 Keong Saik Road Singapore  089143"}];

  var geocodeURL =   'https://maps.googleapis.com/maps/api/geocode/json';


  var dbURL;
//return the category from the url
function categorySplit(urlString){
  var splitted = urlString.split('');
  var final_array = [];
  for (var i = 0; i < splitted.length; i++) {
    if (splitted[i] + splitted[i+1] + splitted[i+2] + splitted[i+3] + splitted[i+4] == 'sg%2F') {
      for (var j = i+5; j < splitted.length; j++) {
        final_array.push(splitted[j]);
      }
    }
  }
  return final_array.join('');
}
//ajax call to geocode postal codes
function convertLatLong(postalCode, newPointObj, cb){
  $.ajax({
     url: geocodeURL,
     dataType: 'json',
     data: {'address': postalCode + "Singapore", "key" : "AIzaSyAC6yk_-cvrYiP_NO4l75OcVcJlRbdZ_Gw"}
   }).done(function(data){
     var latitude = data.results[0].geometry.location.lat;
     var longitude = data.results[0].geometry.location.lng;
     newPointObj.latLong.coordinates = [longitude, latitude];

     cb(newPointObj);
   });
}

//reformat opening hours
function getOpeningHours(openingHString){
  var retString = "";
  var count = 0;

  for(var day in openingHString){
    count+=1;
    retString += day + " " + openingHString[day];

    if(count !== 7){
      retString += ", ";
    }
  }
  return retString;
}

//set the lat long in the new point object
function geoCodeReturn(data){
  latitude = data.results[0].geometry.location.lat;
  longitude = data.results[0].geometry.location.lng;
  newPoint.latLong.coordinates = [longitude, latitude];
}
//post request to create locations
function postRequest(dataObj){

  var info = dataObj;

  var jInfo = JSON.stringify(info);
  console.log("testing jinfo " + jInfo);

  $.ajax({
    type: "POST",
    url: "http://localhost:3000/locations",
    dataType: 'json',
    contentType: 'application/json',
    data: jInfo
  }).done(function(data){
    console.log(data);
  }).fail(function(err1, err2, err3){
    console.log(err1);
  });
}
// postRequest();
for(var i = 0; i < test.length; i++){
  var restaurant = test[i];
  var newPoint = {latLong: {}};
  //add variables
  newPoint.name = restaurant.title;
  newPoint.category = categorySplit(restaurant.url);
  newPoint.description = getOpeningHours(restaurant.opening_hours);

  //ajax call to google api
  convertLatLong(restaurant.postal_code, newPoint, function(data) {
    postRequest(newPoint);
  });

}

});
