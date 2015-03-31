var winston=require('winston');
var transports =[
		new (winston.transports.DailyRotateFile)(
	  	{
	  		dirname : __dirname+'/logs',
	  		filename:'daily',
	  		handleExceptions: true
	  	}),
		new (winston.transports.Console)(
	  	{
	  		colorize : true,
	  		timestamp:true
	  	})
	];
var logger = new (winston.Logger)({
	transports: transports,
  	exitOnError: false
});
module.exports=logger