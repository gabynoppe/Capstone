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


//var myId; // global id variable used to get each idea loaded for its own page




	
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
	
	// The user clicked on a menu item such as href="/category/odcat"
	Router.route('/category/:categoryPathParam', function () {
		this.render('navbar', {
			to: "navbar"
			});
		this.render('categoryPageTemplate', 
		{ 
			to: "main",
			data: function() {
				return this.params.categoryPathParam;
			}
		});			
	});
	

	Router.route('/idea/:_id', function () { //takes you to the specific idea in the list
		this.render('navbar', {
			to: "navbar"
		});
		this.render('idea', {
			to: "main",
			data: function(){
				// myId = this.params._id; 
				return Ideas.findOne({ ////////////////////////////change collection
					// $and: [
					// {_id:this.params._id},
					// {ideaCategory:this.params.categoryPathParam}
					// ]
				_id:this.params._id
				});
			}	
		});
	});

	Router.route('/profile/:profileUserName', function () {
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
	
	//this function on the categoryPage template, can be used to pull the path (e.g. /odcat, or /encat, etc.)
	Template.categoryPageTemplate.helpers({
			categoryPathHelper: function() {
				return this.toString(); //Return the categoryPath value such as he path (e.g. /odcat, or /encat, etc.) 
			}, 
			categoryNameHelper: function() {
				switch (this.toString()) {
					case "odcat":
						return "Outdoors";
						
					case "encat":
						return "Entertainment";
						
					case "clcat":
						return "Cultural and Learning";
						
					case "gfcat":
						return "Group Fun";
						
					case "fcat":
						return "Food";
						
					case "otcat":
						return  "Other";	
					
				}

			},
			glyphIconHelper: function() {
				switch (this.toString()) {
					case "odcat":
						return " glyphicon glyphicon-tree-deciduous";
						
					case "encat":
						return "glyphicon glyphicon-star";
						
					case "clcat":
						return "glyphicon glyphicon-globe";
						
					case "gfcat":
						return "glyphicon glyphicon-user";
						
					case "fcat":
						return "glyphicon glyphicon-cutlery";
						
					case "otcat":
						return  "glyphicon glyphicon-asterisk";	
					
				}
			},
			glyphColorHelper: function() {
				switch (this.toString()) {
					case "odcat":
						return "#00cc00";
						
					case "encat":
						return "#ffff1a";
						
					case "clcat":
						return "#1a8cff";
						
					case "gfcat":
						return "#b300b3";
						
					case "fcat":
						return "#ff5c33";
						
					case "otcat":
						return  "#00e6b8";	
					
				}
			}
	});
	
	
   //Template.addideaform.helpers({outdoorideas:idea_title});
	
	//Template.idea.helpers({ // edit this ? to make idea route render the correct idea values
	//oneIdeaHelper: function(categoryPathParam) {
	     
	//var test = Ideas.findOne(
	//	{
	//		$and: [
	//			{_id:myId},
	//			{ideaCategory:categoryPathParam}
	//			]
	//	}
	//)
		
					//_id:myId});   // myId = global id variable to pass the id of the page we selected....this._Id doesnt work....
	// return test;
	  //console.log("title: "+idea_title+" desc:"+idea_desc);
    //return OutdoorIdeas.find();
  //}
  //,
  //columns: function() {

	//  var result1 = _.values(this.idea_title);
	//  var result2 = _.values(this.idea_desc);
	//  return result1, result2;
  //}
  
	//});
      
  ///////////////////////////////////////////////////////////////////////////////
  ////returns the list of ideas belonging to that collection (to be displayed)///
  ///////////////////////////////////////////////////////////////////////////////
	Template.idealist.helpers({
	ideasHelper: function(categoryPathParam) {
    return Ideas.find({"ideaCategory":categoryPathParam}); //Filter for categoryPath
	}
	});
	
	
    //////////////////////////////////////////////////////////////////////////////////////
	// function that works with the form to add an idea to the database and help display it
	//////////////////////////////////////////////////////////////////////////////////////
	
      Template.addideaform.events({
		'submit .addIdeaEvent': function (event, template){

			Ideas.insert({
				ideaCategory:template.data.categoryPathParam,   // this catches the parameter we passes in the template and has the value of the collection ideaCategory we are in
				ideaTitle:event.target.ideaTitleInput.value,
				ideaDesc:event.target.ideaDescInput.value,
				createdOn:new Date()
				
			});
			reset();       ///////////clears/resets the form on after submit
			return false;
		}
	});
	
    //////////////////////////////////////////////////////////////////////
	// allows a 'username' category when signing in and creating a profile
	//////////////////////////////////////////////////////////////////////
	// Accounts.ui.config ({
		// passwordSignupFields: "USERNAME_AND_EMAIL"
	// });
	
	Template.welcome.helpers({myUserName:function(){
		if (Meteor.user()){
			return Meteor.user().username;
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
		
	isprof = "/profile/" + Meteor.user().username;
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
	
	



