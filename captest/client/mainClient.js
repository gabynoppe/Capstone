import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';


/* OutdoorIdeas.allow({
	insert:function(userId, doc){
		if (Meteor.user()){ //user is logged in
			odidea.createdBy = userId;//outdoor idea, force idea to be owned by user
			if (userId != odidea.createdBY){
				return false; //no user messing around
			}
			else { //user is looged in with correct id
				return true;
			}
		}
		else //{//user not logged in
			return false;
		//}
	}

}) */


	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//Global variables//
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var myId; // global id variable used to get each idea loaded for its own page




	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//Routing
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	Router.configure({
		layoutTemplate: 'ApplicationLayout'
	});
	
	Router.route('/', function () {
		this.render('navbar', {
			to: "navbar"
		});
		this.render('welcome', {
			to: "title"
		});	
		this.render('categories', {
			to: "main"
		});		
	});
	
	Router.route('/odcat', function () {
		this.render('navbar', {
			to: "navbar"
		});
		this.render('odcat', {
			to: "main"
		});			
	});
	
	Router.route('/encat', function () {
		this.render('navbar', {
			to: "navbar"
		});
		this.render('encat', {
			to: "main"
		});			
	});
	
	Router.route('/clcat', function () {
		this.render('navbar', {
			to: "navbar"
		});
		this.render('clcat', {
			to: "main"
		});			
	});
	
	Router.route('/gfcat', function () {
		this.render('navbar', {
			to: "navbar"
		});
		this.render('gfcat', {
			to: "main"
		});			
	});
	
	Router.route('/fcat', function () {
		this.render('navbar', {
			to: "navbar"
		});
		this.render('fcat', {
			to: "main"
		});			
	});
	Router.route('/otcat', function () {
		this.render('navbar', {
			to: "navbar"
		});
		this.render('otcat', {
			to: "main"
		});			
	});
		Router.route('/idea/:_id', function () { //takes you to the specific idea in the list
		this.render('navbar', {
			to: "navbar"
		});
		this.render('idea', {
			to: "main",
			data: function(){
				 myId = this.params._id; 
				return OutdoorIdeas.findOne({_id:this.params._id});
			}
		});			
	});

		Router.route('/profile', function () {
		this.render('navbar', {
			to: "navbar"
		});
		this.render('profile', {
			to: "main"
		});			
	});
	
	

	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//Events and helper functions//
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	
	
   //Template.addideaform.helpers({outdoorideas:idea_title});
	
	Template.idea.helpers({ // edit this ? to make idea route render the correct idea values
  outdoorideas: function() {
	     
	var test = OutdoorIdeas.findOne({_id:myId});   // myId = global id variable to pass the id of the page we selected....this._Id doesnt work....
	// return test;
	  //console.log("title: "+idea_title+" desc:"+idea_desc);
    //return OutdoorIdeas.find();
  },
  
  /////////////////////////////////////////////////////////////////////
  //These will be needed when I enable the other collections/categories
  /////////////////////////////////////////////////////////////////////
  
   // entertainmentideas: function() {	     
	// var test = EntertainmentIdeas.findOne({_id:myId});   // myId = global id variable to pass the id of the page we selected....this._Id doesnt work....

  // },
  
   // culturallearningideas: function() {	     
	// var test = CulturalLearningIdeas.findOne({_id:myId});   // myId = global id variable to pass the id of the page we selected....this._Id doesnt work....

  // },
  
   // groupfunideas: function() {	     
	// var test = GroupFunIdeas.findOne({_id:myId});   // myId = global id variable to pass the id of the page we selected....this._Id doesnt work....

  // },
  
   // foodideas: function() {	     
	// var test = FoodIdeas.findOne({_id:myId});   // myId = global id variable to pass the id of the page we selected....this._Id doesnt work....

  // },
  
   // otherideas: function() {	     
	// var test = OtherIdeas.findOne({_id:myId});   // myId = global id variable to pass the id of the page we selected....this._Id doesnt work....

  // },
  
  columns: function() {

	  var result1 = _.values(this.idea_title);
	  var result2 = _.values(this.idea_desc);
	  return result1, result2;
  }
  
	});
      
  ///////////////////////////////////////////////////////////////////////////////
  ////returns the list of ideas belonging to that collection (to be displayed)///
  ///////////////////////////////////////////////////////////////////////////////
	Template.idealist.helpers({
  outdoorideas: function() {
    return OutdoorIdeas.find();
  },
  
  ////////////////////////////////////////////////////////////////////////
  ////These will be for when I finish adding the other idea collections///
  ////////////////////////////////////////////////////////////////////////
  
  // entertainmentideas: function() {
    // return EntertainmentIdeas.find();
  // },
  
  // culturallearningideas: function() {
    // return CulturalLearnigIdeas.find();
  // },
  
 // groupfunideas: function() {
    // return GroupFunIdeas.find();
  // },
  
 // foodideas: function() {
    // return FoodIdeas.find();
  // },
  
  // otherideas: function() {
    // return OtherIdeas.find();
  // },
  
  
  columns: function() {
	  var result1 = _.values(this.idea_title);
	  var result2 = _.values(this.idea_desc);
	  return result1, result2;
  }
	});
	
	
    //////////////////////////////////////////////////////////////////////////////////////
	// function that works with the form to add an idea to the database and help display it
	//////////////////////////////////////////////////////////////////////////////////////
	
      Template.addideaform.events({
		'submit .js-add-idea': function (event){
			var idea_title, idea_desc;
			idea_title = event.target.idea_title.value;
			idea_desc = event.target.idea_desc.value;
			console.log("title: "+idea_title+" desc:"+idea_desc);
			
			
			OutdoorIdeas.insert({
				idea_title:idea_title,
				idea_desc:idea_desc,
				createdOn:new Date()
				
			});
			reset();       ///////////clears/resets the form on after submit
			return false;
		}
	});
	
    //////////////////////////////////////////////////////////////////////
	// allows a 'username' category when signing in and creating a profile
	//////////////////////////////////////////////////////////////////////
	Accounts.ui.config ({
		passwordSignupFields: "USERNAME_AND_EMAIL"
	});
	
	Template.body.helpers({username:function(){
		if (Meteor.user()){
			//return Meteor.user().username;
			//return Meteor.user().emails[0].address;
		}
		else {
			return "";
		}
	}
	
	});

	////////////////////////////////
	// if user is not logged in, and they try to access "profile" they will get an alert saying that they need to sign in.//
	////////////////////////////////
	Template.navbar.events({
		'click .signinalert':function(){
		if (!Meteor.user()){
			return alert("You must sign in to view your profile.");
		}
		}
	  });
	  
	///////////////////////////////////////////////////////////////
	// Only allows the user to follow the 'profile' link to access their profile if they are signed in... 
    ///////////////////////////////////////////////////////////////	
	Template.navbar.helpers({
		
	profile:function(){
		var isprof;
		if (Meteor.user()){
		
	isprof = "/profile";
    } else {
		
		isprof = "#";		
    }
	return isprof;
	}
  });
  ///////////// need to save the rating....not saving for some reason  /////////////////////
     Template.idealist.events({
		'click .js-rate-idea':function(event){
		  var rating = $(event.currentTarget).data("userrating");
		  console.log(rating);
		  var idea_id = this.id;
		  console.log(idea_id);

		  OutdoorIdeas.update({_id:idea_id}, 
						{$set: {rating:rating}});
		
		}
  });
	
	



