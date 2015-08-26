// auth module
// var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = {

	validate: function(user){
		var errors = {};
		//console.log(user);

		if(!user.username){
			errors.username = "Please fill in a username";
		}

		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(!re.test(user.email)){
			errors.email = "Please fill in a valid email";
		}

		if(!user.password){
			errors.password = "Please fill in a password";
		}

		if((user.password !== user.password2) && user.password){
			errors.password2 = "Passwords do not match";
		}

		return errors;
	}
};
