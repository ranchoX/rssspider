var request=require('request');
var FeedParser=require('feedparser');
var Iconv=require('iconv-lite').Iconv;
var zlib=require('zlib');
function fetch(feed,cb){
	var hasError;
	function done(err){
		if(!hasError){
			hasError=err;
			cb(err);
		}else{
			console.log('twice cb error');
		}
	}
	var req=request({
		url:feed,
		headers:{
			'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
			'accept':'text/html,application/xhtml+xml'
		},
		timeout:10000,
		pool:false
	});
	req.setMaxListeners(50);
  var feedParser=new FeedParser();
  //request 的错误
  req.on('error',done);
  req.on('response',function(res){
  	if (res.statusCode!==200) {
  		return this.emit('error',new Error('Bad status code'));
  	};
  	var encoding=this.headers['content-encoding']||'identity';
  	var charset=getParams(res.headers['content-type']||'').charset;
  	res=maybeDecompress(res,encoding);
  	res=maybeTranslate(res,charset,done);
  	res.pipe(feedParser);
  	//解析的错误，可能有多次
  	feedParser.on('error',done);
  	var posts=[];
  	feedParser.on('end',function(){
        if(!hasError){
            cb(null,posts);
        }
  	});
  	feedParser.on('readable',function(){
  		var post;
  		while(post=this.read()){
  			posts.push(post);
  		}
  	})
  })
}
function maybeDecompress(res,encoding){
	var decompress;
	if (encoding.match(/\bdeflate\b/)) {
		decompress=zilb.createInflate();
	}else if(encoding.match(/\bgzip\b/)){
		decompress=zilb.createGunzip();
	}
	return decompress?res.pipe(decompress):res;
}
function maybeTranslate(res,charset,done){
	var iconv;
	if(!iconv&&charset&&!/utf-*8/i.test(charset)){
		try{
			iconv=new Iconv(charset,'utf-8');
			iconv.on(error,done);
			res=res.pipe(iconv);
		}catch(err){
			res.emit('error',err);
		}
	}
	return res;
}
function getParams(str){
	var params=str.split(';').reduce(function(params,param){
		var parts=param.split('=').map(function(part){
			return part.trim();
		});
		if(parts.length==2){
			params[parts[0]]=parts[1];
		}
		return params;
	},{});
	return params;
}
module.exports.fetch=fetch;