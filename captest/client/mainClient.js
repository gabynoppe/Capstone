import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';



	
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
				return Ideas.findOne({
				_id:this.params._id
				});
			}	
		});
	});

	Router.route('/profile/:profileUserNameParam', function () { //takes user to their specific profile
		this.render('navbar', {
			to: "navbar"
		});
		this.render('profilePage', {
			to: "main",
			data: function(){
				return this.params.profileUserNameParam;
			}	

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
	
	

      
  ///////////////////////////////////////////////////////////////////////////////
  ////returns the list of ideas belonging to that collection (to be displayed)///
  ///////////////////////////////////////////////////////////////////////////////
	Template.idealist.helpers({

		ideasHelper: function(categoryPathParam) {

		return Ideas.find({"ideaCategory":categoryPathParam}); //Filter for categoryPath
	}
	});
	
	Template.profilePage.events({
		'click .rateIdeaEvent': function(event){
			var rating = $(event.currentTarget).data("userrating");	
			ProfileIdeas.update({_id:event.currentTarget.id}, 
                    {$set: {profileIdeaRating:rating}});
		}
	});
	
	Template.profilePage.helpers({
		
		profileIdeaHelper: function(profileUserNameParam) {
		return ProfileIdeas.find({"ideaUsername":profileUserNameParam}); //Filter for userName
		
	},
	 getProfileName: function(){	 		
		return Meteor.user().username;
	 }, 
	 profileTitleDescHelper:function(ideaId){
		 return Ideas.find({_id:ideaId});
		 
	 }
	});
	
    //////////////////////////////////////////////////////////////////////////////////////
	// function that works with the form to add an idea to the database and help display it
	//////////////////////////////////////////////////////////////////////////////////////
	
     Template.addideaform.events({
		'submit .addIdeaEvent': function (event, template){

			Ideas.insert({
				ideaCategory:template.data.categoryPathParam,   // this catches the parameter passed in the template and has the value of the collection ideaCategory we are in
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
	Accounts.ui.config ({
		passwordSignupFields: "USERNAME_AND_EMAIL"
	});
	
	Template.welcome.helpers({myUserName:function(){
		if (Meteor.user()){
			return Meteor.user().username;
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
	 Template.profilePage.events({
		'click .deleteProfileIdeaEvent':function(event){
			ProfileIdeas.remove({_id:this._id})
		} 
	 });
	///////////////////////////////////////////////////////////////
	// Only allows the user to follow the 'profile' link to access their profile if they are signed in... 
    ///////////////////////////////////////////////////////////////	
	Template.navbar.helpers({
		
	profileHelper:function(){
		var isprof;
		if (Meteor.user()){
		
	isprof = "/profile/" + Meteor.user().username;
    } else {
		
		isprof = "#";		
    }
	return isprof;
	}
  });

     Template.idea.events({
		'click .saveIdeaEvent':function(event){
			var checkIfIdeaExists = ProfileIdeas.findOne(
			{$and: [
				{ideaId:this._id},
				{ideaUsername:event.currentTarget.id}
				
				]
				}
			);
			if(typeof(checkIfIdeaExists) == "undefined" ) {
				//if( checkIfIdeaExists.length == 0  ) {
				ProfileIdeas.insert(
				{
					ideaId:this._id,
					ideaUsername: event.currentTarget.id	
				}					
				);
			} else 
			{
				return alert ("You've previously saved this idea");
			}
		},
	  'click. takeBackEvent':function(event) { 
			window.history.back();		
		}

	});
 
  
  Template.idea.helpers({
	  getUserNameHelper:function(){
		  return Meteor.user().username;
	  }
  });

	



