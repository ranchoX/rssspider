var Rss=require('./lib/rss');
var Url=require('url');
module.exports.fetch=function(url,cb){
	Rss.fetch(url,function(err,items){
		if(err){
			cb(err);
		}else{
			var domain=Url.parse(url).hostname;
			items=items.map(function(item){
				return {
					title:item.title,
					domain:domain,
					pubdate:item.pubdate,
					link:item.link,
					content:item.description
				}
			})
			cb(null,items)
		}
	})
}