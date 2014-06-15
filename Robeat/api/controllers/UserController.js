/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

 var settings = {
 	"pagelimit" : 10
 };

module.exports = {
    
  
  score: function (req,res) {

  	if( !req.param( 'facebook_id' ) ||
  		!req.param( 'name' ) ||
  		!req.param( 'nationality' ) ||
  		!req.param( 'score' ) ) {

  		return res.json( 
  			{ 
  				success: false, 
  				data:'facebook_id, name, nationality and score are required'
  			}, 
  			401 
  		);
  	}

  	User.findOne( { 'facebook_id' : req.param( 'facebook_id' ) } ).exec( function( err, user ) {
  		// General error
  		if( err ) {
  			return res.json( {success:false, data:{ error:err } }, 500 );
  		}

  		// User not found, create it
  		if( !user ) {
  			console.log('user not found');
  			User.create( {

  				name: req.param( 'name' ),
  				facebook_id: req.param( 'facebook_id' ),
  				nationality: req.param( 'nationality' ),
  				score: req.param( 'score' )

  			} ).done(function( error, user ) {

  				if( error ) {
  					return res.json( 
  						{
  							success: false, 
  							"data":{ 
  								"error":err 
  							} 
  						}, 
  						402 
  					);
  				}

  				return res.json( 
  					{ 
  						success: true, 
  						"data" : { 
  							"user": user 
  						} 
  					}, 
  					200 
  				);

  			});

		// User found!  		
  		} else {

  			// Update score
  			user.score = req.param( 'score' );
  			user.save(function(err) {

  				return res.json( 
  					{ 
  						success: true, 
  						data: { 
  							"user" : user 
  						} 
  					}, 
  					200 
  				);		

			});

  			
  		}

  	});
  },

  scores: function( req, res ) {

  	if( !req.param( 'facebook_id' ) ||
  		!req.param( 'name' ) ||
  		!req.param( 'nationality' ) ||
  		!req.param( 'score' ) ) {

  		return res.json( 
  			{ 
  				success: false, 
  				data:'facebook_id, name, nationality and score are required'
  			}, 
  			401 
  		);
  	}

  	User
  		.count( { "score" : { ">=" : req.param('score') } } )
  		.exec( function( err, usersBetter ) {

  		var page = Math.floor(usersBetter / settings.pagelimit );

  		User
	  		.find()
	  		.limit( settings.pagelimit )
	  		.skip( page * settings.pagelimit )
	  		.sort( 'score DESC' )
	  		.exec( function( err, users ) {

		  		if( err ) {
		  			return res.json( 
			  			{ 
			  				"success": false, 
			  				"data": {
			  					"error" : err
			  				}
			  			}, 
			  			402 
			  		);
		  		}

		  		if( users ) {

		  			return res.json(
		  				{
		  					"page" : page,
		  					"data": users
		  				},
		  				200
		  			);

		  		} else {

		  			return res.json( 
			  			{ 
			  				"success": false, 
			  				"data": {
			  					"error" : err
			  				}
			  			}, 
			  			403
			  		);

		  		}

	  		});
  	});


  	

  },

  scoresbypage: function( req, res ) {

  	if( !req.param( 'page' ) ) {
  		return res.json( 
			  			{ 
			  				"success": false, 
			  				"data": {
			  					"error" : "missing page param"
			  				}
			  			}, 
			  			401
			  		);
  	}

  	User
	  		.find()
	  		.limit( settings.pagelimit )
	  		.skip( req.param('page') * settings.pagelimit )
	  		.sort( 'score DESC' )
	  		.exec( function( err, users ) {

		  		if( err ) {
		  			return res.json( 
			  			{ 
			  				"success": false, 
			  				"data": {
			  					"error" : err
			  				}
			  			}, 
			  			402 
			  		);
		  		}

		  		if( users ) {

		  			return res.json(
		  				{
		  					"page" : parseInt( req.param('page') ),
		  					"data": users
		  				},
		  				200
		  			);

		  		} else {

		  			return res.json( 
			  			{ 
			  				"success": false, 
			  				"data": {
			  					"error" : err
			  				}
			  			}, 
			  			403
			  		);

		  		}

	  		});


  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {}

  
};
