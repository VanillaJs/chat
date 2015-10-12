var _ = require('lodash');
var checkValueByType = function(value, type) {
	switch (type) {
	case 'ObjectId':
		return (/^[0-9a-fA-F]{24}$/).test(value);
	case 'Email':
		return (/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i).test(value);
	case 'String':
		return _.trim(value).length > 0;
	case 'Int':
		return parseInt(value, 10) > 0;
	case 'Array':
		return _.isArray(value);
	default:
		return true;
	}
};
var checkDataByParams = function(data, mustKeys) {
	var error = {};
	var boolVar = _.difference(_.keys(data), _.keys(mustKeys)).length === 0;
	if (boolVar) {
		_.forIn(mustKeys, function(value, key) {
			var check = checkValueByType(data[key], value);
			if (check !== true) {
				error[key] = check;
			}
		});
	}

	return (_.keys(error).length === 0) ? true : error;
};
module.exports = checkDataByParams;
