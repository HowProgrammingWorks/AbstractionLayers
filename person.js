var postAction = require('./postAction'),
      getAction = require('./getAction');
	  
	  
exports.execute = function(req, res) {
		if (req.method === 'GET') {
			getAction.get(req, res);
        } else if (req.method === 'POST') {
			postAction.post(req, res);
        }
}