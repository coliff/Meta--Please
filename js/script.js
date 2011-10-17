/* Author: 

*/
var $code;
var $wtf;
var $header;
$(function() {
	$code = $('#code');
	$header = $('#header');
	$('#accordion').accordion();
	$('#accordion input, #accordion select').change(metaPlease);
	$('#geo').click(setupMap);
	$('#searchMap').click(updateGeoAddress);
	$wtf = $('#wtf');
	$('h1 a').click(toggleWTP);
});

var wtfOpen = false;
function toggleWTP(open){
	var height = $('#wtf').height();
	
	if(!wtfOpen){
		wtfOpen = true;
		$wtf.css('top',-height);
		$wtf.animate({top: 0}, 500);
		$header.animate({"padding-top": height - 30}, 500);
	}else{
		wtfOpen = false;
		$wtf.animate({top: -(height)}, 500);
		$header.animate({"padding-top": 0}, 500);
	}
}

var geocoder;
var marker;
var map;

function setupMap(){
	geocoder = new google.maps.Geocoder();
	latlng = new google.maps.LatLng(44.590467, -40.78125);
	var myOptions = {
				zoom: 2,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
	
	map = new google.maps.Map(document.getElementById("gmap"), myOptions);
	
	marker = new google.maps.Marker({
									position: latlng, 
									map: map, 
									draggable: true,
									flat: false,
									title:"Drag Me"
								});
								
	google.maps.event.addListener(marker, 'dragend', function() {
		getGeoAddress(this.getPosition().toUrlValue());
	});
}

function updateGeoAddress(){
	var address = $('input[name=address]').val();
	
	if (geocoder) {
		geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				newLocation = results[0].geometry.location;
				marker.setPosition(newLocation);
				map.panTo(newLocation);
				getGeoAddress(newLocation.toUrlValue());
			} else {
				alert("Geocode was not successful for the following reason: " + status);
			}
		});
	}
}

function getGeoAddress(latlng){
	var latlngStr = latlng.split(",",2);
	var lat = parseFloat(latlngStr[0]);
	var lng = parseFloat(latlngStr[1]);
	var latlng = new google.maps.LatLng(lat, lng);
		
	if (geocoder) {
		geocoder.geocode({'latLng': latlng}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					$('input[name=latitude]').val(lat);
					$('input[name=longitude]').val(lng);
					
					$('input[name=original_latitude]').val(lat);
					$('input[name=original_longitude]').val(lng);
					
					$('input[name=address]').val(results[0].formatted_address);
					
					$('input[name=countryCode]').val('');
					$('input[name=regionCode]').val('');
					$('input[name=city]').val('');
					
					var len = results[0].address_components.length;
					for(var i = 0; i < len; i++){
						switch(results[0].address_components[i].types[0]){
						    case 'locality':
								$('input[name=city]').val(results[0].address_components[i].long_name);
							break;
						    case 'administrative_area_level_1':
								$('input[name=regionCode]').val(results[0].address_components[i].short_name);
							break;
						    case 'country':
								$('input[name=countryCode]').val(results[0].address_components[i].short_name);
							break;
						}
				    }
					
					metaPlease();
				}
			} else {
				alert("Geocoder failed due to: " + status);
			}
		});
	}
}

function metaPlease(){
	var newCode = [];
	
	// Character Set - <meta charset="utf-8">
	var charset = $('select[name=char_set]').val();
	if(charset && charset != 0){
		newCode.push('<meta charset="' + charset + '">');
	}
	
	// Language - <meta http-equiv="content-language" content="en">
	var lang = $('input[name=language]').val();
	if(lang){
		newCode.push('<meta http-equiv="content-language" content="' + lang + '">');
	}
	
	// Content Type - <META http-equiv="Content-Type" CONTENT="text/html; charset=iso-8859-1">
	var contentType = $('input[name=contentType]').val();
	if(contentType){
		if(charset){
			contentType += '; charset=' + charset;
		}
		newCode.push('<meta http-equiv="Content-Type" content="' + contentType + '">');
	}
	
	// Keywords - <meta name="keywords" lang="" content="HTML,CSS,XML,JavaScript" />
	var keywords = $('input[name=keywords]').val();
	if(keywords){
		var l = ($('input[name=keywords_lang]').is(':checked')) ? ' lang="' + lang + '"' : '';
		newCode.push('<meta name="keywords"' + l + ' content="' + keywords + '">');
	}
	
	// Description - <meta name="description" lang="" content="HTML,CSS,XML,JavaScript" />
	var description = $('input[name=description]').val();
	if(description){
		var l = ($('input[name=description_lang]').is(':checked')) ? ' lang="' + lang + '"' : '';
		newCode.push('<meta name="description"' + l + ' content="' + description + '">');
	}
		
	// Date Created - <meta http-equiv="date" content="Wed, 16 Feb 2011 22:34:13 GMT" />
	var dateCreated = $('input[name=dateCreated]').val();
	if(dateCreated){
		newCode.push('<meta http-equiv="date" content="' + dateCreated + '">');
	}
	
	// Expires - <meta http-equiv="expires" content="Wed, 16 Feb 2011 22:34:13 GMT" />
	var expires = $('input[name=expires]').val();
	if(expires){
		newCode.push('<meta http-equiv="expires" content="' + expires + '">');
	}
	
	// Last Modified - <meta http-equiv="last-modified" content="Wed, 16 Feb 2011 22:34:13 GMT" />
	var lastModified = $('input[name=lastModified]').val();
	if(lastModified){
		newCode.push('<meta http-equiv="last-modified" content="' + lastModified + '">');
	}
	
	// Revist After - <meta name="rating" content="noimageindex">
	var revistAfter = $('input[name=revistAfter]').val();
	if(revistAfter){
		newCode.push('<meta name="revisit-after" content="' + revistAfter + '">');
	}
	
	// ISBN - <meta name="identifier" scheme="isbn" content="978-0596101992">
	var isbn = $('input[name=isbn]').val();
	if(isbn){
		newCode.push('<meta name="identifier" scheme="isbn" content="' + isbn + '">');
	}
	
	// Author - <meta name="identifier" scheme="isbn" content="978-0596101992">
	var author = $('input[name=author]').val();
	if(author){
		var l = ($('input[name=author_lang]').is(':checked')) ? ' lang="' + lang + '"' : '';
		newCode.push('<meta name="author"' + l + ' content="' + author + '">');
	}
	
	// Copyright - <meta name="copyright" content="&copy; 2004 Tex Texin">
	var copyright = $('input[name=copyright]').val();
	if(copyright){
		var l = ($('input[name=copyright_lang]').is(':checked')) ? ' lang="' + lang + '"' : '';
		newCode.push('<meta name="copyright"' + l + ' content="&copy; ' + copyright + '">');
	}
	
	// Generator - <meta name="generator" content="Wordpress">
	var generator = $('input[name=generator]').val();
	if(generator){
		newCode.push('<meta name="generator" content="' + generator + '">');
	}

	// Browser Version Targeting - <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	var browserVersionTargeting = $('input[name=browserVersionTargeting]').val();
	if(browserVersionTargeting){
		newCode.push('<meta http-equiv="X-UA-Compatible" content="' + browserVersionTargeting + '">');
	}
	
	// Cache Control - <meta http-equiv="Cache-Control" content="no-cache">
	var cacheControl = $('select[name=cacheControl]').val();
	if(cacheControl && cacheControl != 0){
		newCode.push('<meta http-equiv="Cache-Control" content="' + cacheControl + '">');
	}
	
	// Robots - <meta name="robots" content="noindex">
	var robots = $('input[name=robots]').val();
	if(robots){
		newCode.push('<meta name="robots" content="' + robots + '">');
	}
	
	// Googlebot - <meta name="googlebot" content="noimageindex">
	var googleBot = $('input[name=googleBot]').val();
	if(googleBot){
		newCode.push('<meta name="googlebot" content="' + googleBot + '">');
	}
	
	// Rating - <meta name="rating" content="general">
	var rating = $('select[name=rating]').val();
	if(rating && rating != 0){
		newCode.push('<meta name="rating" content="' + rating + '">');
	}
	
	// Apple Mobile Web App Capable - <meta name="apple-mobile-web-app-capable" content="yes">
	var appleMobileWebAppCapable = $('select[name=appleMobileWebAppCapable]').val();
	if(appleMobileWebAppCapable && appleMobileWebAppCapable != 0){
		newCode.push('<meta name="apple-mobile-web-app-capable" content="' + appleMobileWebAppCapable + '">');
	}
	
	// Apple Mobile Web App Status Bar Style - <meta name="apple-mobile-web-app-status-bar-style" content="black">
	var appleMobileWebAppStatusBarStyle = $('select[name=appleMobileWebAppStatusBarStyle]').val();
	if(appleMobileWebAppStatusBarStyle && appleMobileWebAppStatusBarStyle != 0){
		newCode.push('<meta name="apple-mobile-web-app-status-bar-style" content="' + appleMobileWebAppStatusBarStyle + '">');
	}
	
	// Format Detection - <meta name="format-detection" content="telephone=no">
	var formatDetection = $('select[name=formatDetection]').val();
	if(formatDetection && formatDetection != 0){
		newCode.push('<meta name="format-detection" content="telephone=' + formatDetection + '">');
	}
	
	// Viewport - <meta name="viewport" content="width=320,initial-scale=2.3, user-scalable=no">
	var viewport = $('input[name=viewport]').val();
	if(viewport){
		newCode.push('<meta name="viewport" content="' + viewport + '">');
	}
	
	// Format Lat/Lng
	var accuracy_approximation = $('select[name=accuracy_approximation]').val();
	
	var o_latitude = parseFloat($('input[name=original_latitude]').val());
	var o_longitude = parseFloat($('input[name=original_longitude]').val());
	
	if(!isNaN(o_latitude)){
		$('input[name=latitude]').val(o_latitude.toFixed(accuracy_approximation));
	}
	
	if(!isNaN(o_longitude)){
		$('input[name=longitude]').val(o_longitude.toFixed(accuracy_approximation));
	}
	
	// Latitude / Longitude - <meta name="geo.position" content="37.09024;-95.712891" />
	// 						<meta name="ICBM" content="37.09024, -95.712891" />
	var latitude = $('input[name=latitude]').val();
	var longitude = $('input[name=longitude]').val();
	if(latitude != '' && longitude != ''){
		newCode.push('<meta name="ICBM" content="' + latitude + ', ' + longitude + '">');
		newCode.push('<meta name="geo.position" content="' + latitude + ';' + longitude + '">');
	}
	
	// Region Code - <meta name="geo.region" content="US-AK" />
	var countryCode = $('input[name=countryCode]').val();
	var regionCode = $('input[name=regionCode]').val();
	if(regionCode || countryCode){
		if(countryCode && regionCode){
			countryCode += '-';
		}
		newCode.push('<meta name="geo.region" content="' + countryCode + regionCode + '">');
	}
	
	// City - <meta name="geo.placename" content="St. Louis" />
	var city = $('input[name=city]').val();
	if(city){
		newCode.push('<meta name="geo.placename" content="' + city + '">');
	}
	
	// Dublin Core Title - <meta name="DC.title" content="the title" />
	var dublinCoreTitle = $('input[name=dublinCoreTitle]').val();
	if(dublinCoreTitle){
		newCode.push('<meta name="DC.title" content="' + dublinCoreTitle + '">');
	}
		
	$code.val('');
	if(newCode.length){
		var c = '';
		
		for(var i = 0; i < newCode.length; i++){
			if(i > 0){
				c += "\n";
			}
			c += newCode[i]
		}
		
		$code.val(c);
	}
}