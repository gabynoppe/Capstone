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

var myId; // global id variable used to get each idea loaded for its own page
	
	///routing
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
		this.render('welcome', {
			to: "main"
		});			
	});
	
	Router.route('/clcat', function () {
		this.render('navbar', {
			to: "navbar"
		});
		this.render('welcome', {
			to: "main"
		});			
	});
	
	Router.route('/gfcat', function () {
		this.render('navbar', {
			to: "navbar"
		});
		this.render('welcome', {
			to: "main"
		});			
	});
	
	Router.route('/fcat', function () {
		this.render('navbar', {
			to: "navbar"
		});
		this.render('welcome', {
			to: "main"
		});			
	});
	Router.route('/otcat', function () {
		this.render('navbar', {
			to: "navbar"
		});
		this.render('welcome', {
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


   //Template.addideaform.helpers({outdoorideas:idea_title});
	Template.idea.helpers({ // edit this ? to make idea route render the correct idea values
  outdoorideas: function() {
	     
 var test = OutdoorIdeas.findOne({_id:myId});   // myId = global id variable to pass the id of the page we selected....this._Id doesnt work....
	// return test;
	  //console.log("title: "+idea_title+" desc:"+idea_desc);
    //return OutdoorIdeas.find();
  },
  columns: function() {

	  var result1 = _.values(this.idea_title);
	  var result2 = _.values(this.idea_desc);
	  return result1, result2;
	  

  }
	});
      
	Template.idealist.helpers({
  outdoorideas: function() {
    return OutdoorIdeas.find();
  },
  columns: function() {
	  var result1 = _.values(this.idea_title);
	  var result2 = _.values(this.idea_desc);
	  return result1, result2;
  }
	});
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
			return false;
		}
	});
	
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
	
	
	



