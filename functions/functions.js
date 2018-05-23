/* 
//	This file contain functions used to sort data
*/


//Transform a string into query
function addQuery(str){
	var query = ''
	for (i=0;i<str.length;i++){
		if (str[i] === ' '){
			query += '+'
		}else{
			query += str[i]
		}
	}
	return query
}






module.exports = {

	// Translate HTML Form received => query url for Spotify API
	trad: function(body, callback){
		search = 'search?q='
		type = ''
		console.log('body a parser :')
		console.log(body)

			//create search query for an artist
		if (body.artist !== '' && body.artist !== undefined){
			search += addQuery(body.artist) //query core 
			search += '&type=artist' //end of query
			type = 'artist'
		}

			//create search query for an album
		else if(body.album !== '' && body.album !== undefined) {
			search += addQuery(body.album)  //query core
			search += '&type=album'		//end of query
			type = 'album'
		}

		else{
			console.log('rentrez une vraie chaine ! ')
		}

		console.log('######## search done : ' + search)
		callback(search)  //now query can be send
	},

	// This function take raw Json (body) answered by Spotify, and keep only relevant data
    sortData: function(body, callback){
		
			// if it is an artist form
		if(body.artists !== undefined && body.artists.items.length !== 0){
			console.log('######## artist found')
			data = body.artists.items
			data.length = body.artists.items.length // Helpfull to list data later
			data.type = 'artist'	//Helpfull to decide wich type of html page must be send later
			callback(data);
		}
			// if it is an album form
		else if(body.albums !== undefined && body.albums.items.length !== 0){
			console.log('######## album found')
			data = body.albums.items
			data.length = body.albums.items.length		// Helpfull to list data later
			data.type = 'album'		//Helpfull to decide wich type of html page must be send later
			callback(data);
		}

		else{
			callback(data = 0)
		}
	}

};


