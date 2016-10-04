// JavaScript

function SnapShot (poConfig) {
	PageTemplate.call(this, poConfig);
};
SnapShot.prototype = Object.create(PageTemplate.prototype);
SnapShot.prototype.render = function () {
	this.getContainer().html(
		_.template(
			this.getMainTemplate().html(),
			{
				'imgSrc':	'media/' + this.getDemoImageName(),
				'module':	this.getModuleName()
			}
		)
	);
};
SnapShot.prototype.resize = function () {
	var oSelf = this,
		oContainer = this.getContainer(),
		dHeight = (this.getWindowHeight() - 25);
	
	oContainer.css({
		'max-height':	dHeight + 'px',
		'overflow':		'auto',
		'text-align':	'center'
	});
	
	$('#snapshot_2').css('max-height', (dHeight - 5) + 'px');
};
SnapShot.prototype.bindEvents = function () {
	//popup handler
	$('#snapshot_2').on('click',function(){
		if($(this).attr('data-click-state') == 1) {
			$(this).attr('data-click-state', 0);
			$(this).attr("src","media/iLit20_Tproto_Snapshot6b.jpg"); 
		} 
		else {
			$(this).attr('data-click-state', 1);
			$(this).attr("src","media/iLit20_Tproto_Snapshot6a.jpg");
		}
	});
};