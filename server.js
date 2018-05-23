/*
//	This little local server can be accessed at localhost:8080
//
//	It provides you 2 fields : "artist" and "album" ; when filled an HTML page
//	is generated presenting a maximum of 20 items corresponding to your research
//
//	It use Spotify web API to make searches
*/



// Import Node Modules
let express = require('express')
var request = require('request')
var bodyParser = require('body-parser')
let server = express()


// Templates motor
server.set('view engine', 'ejs')


// MIDDLEWARE
server.use('/static', express.static('static'))
server.use(bodyParser.urlencoded({extended: false }))
server.use(bodyParser.json())



////////////////////// Tools ////////////////

// My functions
var fct = require('./functions/functions')

// Global variables
var client_id = '9ae90c2062194ae9955308941b543e77'; // this app client id
var secret_id = '6e3005f3223c46eeba5f8944f4e158b8'; // this app secret id
	// The previous identifier keys have be obtained by registering this app on Spotify's data base
	// Authorization provided can't be used to find any user personnal informations
var bodyjson = ''
var data = ''

// My server authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + secret_id).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};






/////////////// Server configuration //////////////////////


server.get('/', (request, response) =>{
	response.render('pages/index', {info: 'Please enter an artist or an album'})
})

server.get('/index', (request, response) =>{
	response.render('pages/index', {info: 'Please enter an artist or an album'})
})


// when receiving a html form on root :
server.post('/', (request, response) => {
	console.log('post detected')
		// translate artist name or album into query
	fct.trad(request.body, function(search) {
			// Then send query to spotify and sort data
		sendRequest(search, function(data) {
				// When Data have been sorted, redirect client :
			if( data.type === 'artist'){
					// Send a page to present artists found
				response.render('pages/resultArtist', {data: data})
			}else if( data.type === 'album'){
					// Send a page to present albums found
				response.render('pages/resultAlbum', {data: data})
			}else{
				response.render('pages/index', {info: 'Nothing found...'})				
			}

		})

	})

})
	







/////////////	Ask Spotify web API//////////////


// Send query nammed "search" to spotify API
function sendRequest (search, callback) {
	    // First get the access token
	request.post(authOptions, function(error, response, body) {
	  if (!error && response.statusCode === 200) {
	    var token = body.access_token;
	    var options = {
	      url: 'https://api.spotify.com/v1/' + search,
	      headers: {
	        'Authorization': 'Bearer ' + token
	      },
	      json: true
	    };
	    // Then send request to spotify
	    request.get(options, function(error, response, body) {
	    	// As JSON response can be album or artist type, data must be sorted 
	    	fct.sortData(response.body, function(data){
	    		// Now HTML page can be generated and control is
		      	callback(data);
	    	})
	    });
	  }

	});
}




// START server
console.log('listening on 8282')
server.listen(8080)