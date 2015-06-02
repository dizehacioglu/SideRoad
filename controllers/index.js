var indexController = {
	index: function(req, res) {
		res.render('index');
	},

	renderLocation: function(req, res){
		console.log(req.body);
	}
};

module.exports = indexController;