 
    var randomNum = Math.random();
		// var randomNum = 1;

        
	//<!-- Google Analytics -->

	//   (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	// 	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	// 	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	// 	})(window,document,'script','js/analytics.js','ga');

	// 	createGoogleTrackerObject(GTRACKID); // id is account specific, second parameter is optional; based on the tracking code account provides
        

//create nodes for script and link
        function createNode(url,elem,callback){
	var src = document.createElement(elem);
    if(elem === "script"){src.setAttribute("src", url + randomNum); src.setAttribute("type","text/javascript");src.onload=callback}
    else{src.setAttribute("href", url + randomNum);  src.setAttribute("media","all"); src.setAttribute("rel","stylesheet");}
  
    return src;
    };

	function setInitialize(){
        document.getElementsByTagName("head")[0].appendChild(createNode("js/common.js?","script",null));
         document.getElementsByTagName("head")[0].appendChild(createNode("js/instructor_login.js?","script",null));
          document.getElementsByTagName("head")[0].appendChild(createNode("js/instructor.js?","script"),function(){myEldImplementation();});
		//document.getElementsByTagName("head").appendChild('<script type="text/javascript" src="js/common.js?'+ randomNum + '"></scr' + 'ipt>');
		// document.getElementsByTagName("head").appendChild('<script type="text/javascript" src="js/instructor_login.js?'+ randomNum + '"></scr' + 'ipt>');
		// document.getElementsByTagName("head").appendChild('<script type="text/javascript" src="js/instructor.js?'+ randomNum + '"></scr' + 'ipt>');
     };
 function myEldImplementation(){
	//<!-- myEld implementation  -->
    
 		switch(PRODTYPE){
			case GENERAL.c_s_PROD_TYPE_MYELD:
            document.getElementsByTagName("head")[0].appendChild(createNode("css/style-myeld.css?","link"));
			//	document.getElementsByTagName("head").appendChild('<link media="all" rel="stylesheet" href="css/style-myeld.css?'+ randomNum + '">');
			break;
			
			case GENERAL.c_s_PROD_TYPE_ILIT:
             document.getElementsByTagName("head")[0].appendChild(createNode("css/style.css?","link"));
			//	document.getElementsByTagName("head").appendChild('<link media="all" rel="stylesheet" href="css/style.css?'+ randomNum + '">');
			break;
			
			case GENERAL.c_s_PROD_TYPE_WTW:
                 document.getElementsByTagName("head")[0].appendChild(createNode("css/style-wtw.css?","link"));
			//	document.getElementsByTagName("head").appendChild('<link media="all" rel="stylesheet" href="css/style-wtw.css?'+ randomNum + '">');
			break;
				
			default:
             document.getElementsByTagName("head")[0].appendChild(createNode("css/style.css?","link"));
			//document.getElementsByTagName("head").appendChild('<link media="all" rel="stylesheet" href="css/style.css?'+ randomNum + '">');
		}
 }
 	// <!--[if gte IE 9]>
	//   <style type="text/css">
	// 	.gradient {
	// 	   filter: none !important;
	// 	}
	//   </style>
	// <![endif]-->

setInitialize();