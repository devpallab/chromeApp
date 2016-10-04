  var sUrl = "";
  switch(PRODTYPE){
           
			case GENERAL.c_s_PROD_TYPE_MYELD:
				sUrl ='<link media="all" rel="stylesheet" href="css/style-myeld.css?'+ randomNum + '">';
			break;
			
			case GENERAL.c_s_PROD_TYPE_ILIT:
				sUrl = '<link media="all" rel="stylesheet" href="css/style.css?'+ randomNum + '">';
			break;
			
			case GENERAL.c_s_PROD_TYPE_WTW:
				sUrl = '<link media="all" rel="stylesheet" href="css/style-wtw.css?'+ randomNum + '">';
			break;
				
			default:
				sUrl = '<link media="all" rel="stylesheet" href="css/style.css?'+ randomNum + '">';
		}
         var s = document.createElement('script');
        s.type = 'text/javascript';
        
        try {
        s.appendChild(document.createTextNode(sUrl));
        document.body.appendChild(s);
        } catch (e) {
        s.text = code;
        document.body.appendChild(s);
        }


         (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','js/analytics.js','ga');

		createGoogleTrackerObject(GTRACKID); // id is account specific, second parameter is optional; based on the tracking code account provides

	