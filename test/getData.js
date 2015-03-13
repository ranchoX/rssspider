var should=require('should');
var assert=require('assert');
var rssspider=require('../index');

describe('mutil platform rss support',function(){
	it('#support http://fex.baidu.com/feed.xml',function(done){
		rssspider.fetch('http://fex.baidu.com/feed.xml',function(err,items){
			assert.equal(null,err);
			var item=items[0];
			item.should.have.property('title');
			item.should.have.property('link');
			item.should.have.property('pubdate');
			item.should.have.property('content');
			done()
		})
	});
	it('#support http://ued.taobao.org/blog/feed/',function(done){
		rssspider.fetch('http://ued.taobao.org/blog/feed/',function(err,items){
			assert.equal(null,err);
			var item=items[0];
			item.should.have.property('title');
			item.should.have.property('link');
			item.should.have.property('pubdate');
			item.should.have.property('content');
			done()
		})
	});
	it('#support http://feed.cnblogs.com/blog/u/40553/rss',function(done){
		rssspider.fetch('http://feed.cnblogs.com/blog/u/40553/rss',function(err,items){
			assert.equal(null,err);
			var item=items[0];
			item.should.have.property('title');
			item.should.have.property('link');
			item.should.have.property('pubdate');
			item.should.have.property('content');
			done()
		})
	})
	it('#support http://www.zhangxinxu.com/wordpress/feed/',function(done){
		rssspider.fetch('http://www.zhangxinxu.com/wordpress/feed/',function(err,items){
			assert.equal(null,err);
			var item=items[0];
			item.should.have.property('title');
			item.should.have.property('link');
			item.should.have.property('pubdate');
			item.should.have.property('content');
			done()
		})
	})
	//https://blog.domenic.me/atom.xml
	//https://hacks.mozilla.org/feed/
})