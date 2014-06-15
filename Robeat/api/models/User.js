/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	name : 'string',
  	facebook_id : 'string',
  	
  	nationality : {
  		type : 'string'
  	},
  	score : {
  		type : 'integer',
  		maxLength : 8
  	}
    
  }

};
