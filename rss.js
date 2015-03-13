var rss=require('./index');
var MongoClient = require('mongodb').MongoClient;
var Collection = require('mongodb').Collection;
var ObjectID = require('mongodb').ObjectID;
var async=require('async');
var DbUri='mongodb://localhost/rss';
var logger=require('./logger');
var _=require('underscore');
var DB;
MongoClient.connect(DbUri,function(err,db){
	if(err){
		console.log(err);
	}else{
		DB=db;
		start();
	}
})
function handleError(err){
	logger.log(err);
	process.exit(1);
}
process.on('uncaughtException', function (err) {
  logger.error(err.stack);
});
function start(){
	logger.info("*********begin**********");
	var Sources=DB.collection('sources');
	var RssContents=DB.collection('rssContents');
	RssContents.ensureIndex({source:1,link:1},{unique:true},function(){});
	//Sources.insert({_id:'http://fex.baidu.com/feed.xml'},function(err){});
	// Sources.insert({_id:'http://www.zhangxinxu.com/wordpress/feed/'},function(err){});
	// Sources.insert({_id:'http://feed.cnblogs.com/blog/u/40553/rss'},function(err){});
	// Sources.insert({_id:'http://ued.taobao.org/blog/feed/'},function(err){});
	Sources.find({}).toArray(function(err,sources){
		if(err){
			handleError(err);
		}else{
			var tasks=[];
			_.each(sources,function(source){
				tasks.push(function(cb){
					rss.fetch(source._id,function(err,contents){
						contents=contents||[];
						var arr=[];
						for (var i = 0; i < contents.length; i++) {
							if((!source.uat)||contents[i].pubdate>source.uat){
								contents[i].source=source._id;
								arr.push(contents[i]);
							}
						};
						var uat=contents[0]&&contents[0].pubdate;
						logger.info('url:'+source._id+';at:'+source.uat+'; new data:'+arr.length+';new at:'+uat);
						if(arr.length===0){
							return cb();
						}
						async.parallel([
								function(cb){
									Sources.update({_id:source._id},{"$set":{uat:uat}},cb)
								},
								function(cb){
									RssContents.insert(arr,cb);
								}
							],cb);
					})
				})
			})
			async.parallel(tasks,function(err){
				if(err){
					handleError(err);
				}
				logger.info("**********end************");
				process.exit(0);
			})
		}

	})
	
}