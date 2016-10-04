var sTemplateChanged = false;




function ProcessReceivedData(sRecievedData) {
		sRecievedData = typeof sRecievedData === "object" ? sRecievedData : $.parseJSON(sRecievedData);
        receivedData = sRecievedData;
		skecthdata = typeof receivedData === "object" ? receivedData : $.parseJSON(receivedData);
		
		$("#divSessionPlayerPreviewWindow").show();
		if (skecthdata.ti == "1") //this condition is to check whether to proceed for explanation or image if  ti = 1 then explanation
		{
			recievedID = "";
			recievedID = receivedData.eid;
			skecthdataimage = ExplanationImagePath + skecthdata.bi.replace(".png", ".jpg");
		} else {
			skecthdataimage = skecthdata.bi;
			skecthdataimage = mediaUrl;
			
		}
		if (skecthdata.it == "true" || skecthdata.showTable == "false") //if it is a template then show text else do not show the explanation text
			showexplanationtext = false;
		else
			showexplanationtext = true;
		sketchdynamicArray = [];
		undoRedoDynamicArray = [];
		//console.log(skecthdata);
		if (skecthdata.p.length != 0) {
			for (var i = 0; i < skecthdata.p.length ; i++) {
			
				sketchdynamic = {
					"assetID": "100",
					"sessionStartTime": "58033",
					"isTemplate": "false",
					"colors": ["0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00"],
					"sizes": ["5.00", "5.00", "5.00", "5.00", "5.00", "5.00", "5.00", "5.00", "5.00", "5.00", "5.00"],
					"backgroundImage": ""
				};
				var newPoints = [skecthdata.p[i]];
				var newFCPoints = [skecthdata.fcp[i]];
				var newSCPoints = [skecthdata.scp[i]];
				pencilSize = skecthdata.sz[i];
				sColor = skecthdata.c[i];
				//sColor = skecthdata.cc;

				sketchdynamic.points = newPoints;
				sketchdynamic.firstControlPoints = newFCPoints;
				sketchdynamic.secondControlPoints = newSCPoints;
				sketchdynamicArray.push({
					"dynskt": sketchdynamic,
					"dyncolor": sColor,
					"dynsize": pencilSize
				});
			}
		}

		ProcessExplanations();
  }

  
  
  
function ProcessReceivedData_Old(sRecievedData) {

			sRecievedData = typeof sRecievedData === "object" ? sRecievedData : $.parseJSON(sRecievedData);
			receivedData = sRecievedData[0];
       
       // receivedData = sRecievedData;
       
			 
       // if (receivedData.t == "sketche" || receivedData.t == "sketchb") //if sketchb then appened incoming data to variable when it is sketche process the sketch data
       // {
            skecthdata = receivedData.d;
            if (receivedData.t == "sketche") {
                skecthdata = jQuery.parseJSON(skecthdata);
                //skecthdata = jQuery.parseJSON(skecthdata);
                $("#divSessionPlayerPreviewWindow").show();
                if (skecthdata.ti == "1") //this condition is to check whether to proceed for explanation or image if  ti = 1 then explanation
                {
                    recievedID = "";
                    recievedID = receivedData.eid;
                    skecthdataimage = ExplanationImagePath + skecthdata.bi.replace(".png", ".jpg");
                } else {
                    skecthdataimage = skecthdata.bi;
                    skecthdataimage = mediaUrl;
					
                }
                if (skecthdata.it == "true" || skecthdata.showTable == "false") //if it is a template then show text else do not show the explanation text
                    showexplanationtext = false;
                else
                    showexplanationtext = true;
                sketchdynamicArray = [];
                undoRedoDynamicArray = [];
				//console.log(skecthdata);
                if (skecthdata.p.length != 0) {
					for (var i = 0; i < skecthdata.p.length ; i++) {
					
                        sketchdynamic = {
                            "assetID": "100",
                            "sessionStartTime": "58033",
                            "isTemplate": "false",
                            "colors": ["0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00", "0.00,1.00,0.00,1.00"],
                            "sizes": ["5.00", "5.00", "5.00", "5.00", "5.00", "5.00", "5.00", "5.00", "5.00", "5.00", "5.00"],
                            "backgroundImage": ""
                        };
                        var newPoints = [skecthdata.p[i]];
                        var newFCPoints = [skecthdata.fcp[i]];
                        var newSCPoints = [skecthdata.scp[i]];
                        pencilSize = skecthdata.sz[i];
                        sColor = skecthdata.c[i];
                        //sColor = skecthdata.cc;

                        sketchdynamic.points = newPoints;
                        sketchdynamic.firstControlPoints = newFCPoints;
                        sketchdynamic.secondControlPoints = newSCPoints;
                        sketchdynamicArray.push({
                            "dynskt": sketchdynamic,
                            "dyncolor": sColor,
                            "dynsize": pencilSize
                        });
                    }
                }

                ProcessExplanations();
            }
      //  }
  }



function DrawOnCanvas(canvasElement, sketch) {
    streamingSketchData = "false";
    completeSketchData = "false";
    //$("#MainContainer").html("");
	
    var canvas = document.getElementById(canvasElement);

    var context = canvas.getContext("2d");
    try {
		//console.log(sketch.points.length);
        for (var i = 0; i < sketch.points.length; i++) {

            var points = sketch.points[i];
			//console.log(i);
			//console.log(points);
            firstControlPoints = sketch.firstControlPoints[i];
            secondControlPoints = sketch.secondControlPoints[i];

			
			
            context.beginPath();
			//console.log(points.length);
            context.moveTo(points[0][0], points[0][1]);

            if (points.length >= 3) {
                var p1 = points[1];
                var cp1 = firstControlPoints[0];
                var cp2 = secondControlPoints[0];
				//console.log(cp1);
                context.bezierCurveTo(cp1[0], cp1[1], cp2[0], cp2[1], p1[0], p1[1]);
                var j;
			    //console.log(firstControlPoints.length);
                for (j = 0; j < firstControlPoints.length; j++) {
                    var c0 = points[j + 1];
                    //var c0 = points[j];

                    cp1 = firstControlPoints[j];
                    cp2 = secondControlPoints[j];

                    try {
                        context.bezierCurveTo(cp1[0], cp1[1], cp2[0], cp2[1], c0[0], c0[1]);
                    }
                    catch (e) {
                    }
                }
                if (points.length > j) {
                    p1 = points[j - 1];
                    var p2 = points[j];

                    context.quadraticCurveTo(p1[0], p1[1], p2[0], p2[1]);
                }

            } else if (points.length == 2) {

                var p2 = points[1];
				//alert(p2[0] + " " +  p2[1])
                context.lineTo(p2[0], p2[1]);
				
            } else if (points.length == 1) {
                var p1 = points[0];

					
                context.arc(p1[0], p1[1], 4, 0, 2 * Math.PI, false);
											
                context.fillStyle = "#8ED6FF";
                context.fill();
            }

            context.lineWidth = pencilSize;
            context.strokeStyle = sColor;
            context.strokeStyle = "" + getSketchColor(sColor) + "";
            context.stroke();
        }

    }
    catch (e) {

    }
}

function getSketchColor(sData) {
    switch (sData) {
		
	case "1.00,1.00,1.00,1.00": case "White":
	return "#ffffff";
	break;
	case "1.00,0.80,0.20,1.00": case "Yellow":
	return "#ffcc33";
	break;
	case "1.00,0.60,0.20,1.00": case "Orange":
	return "#ff6600";
	break;
	case "0.80,0.00,0.00,1.00": case "Red":
	return "#cc0000";
	break;
	case "0.80,0.20,0.40,1.00": case "Pink":
	return "#ff3399";
	break;
	case "0.60,0.20,0.80,1.00": case "Violet":
	return "#9900cc";
	break;
	case "0.20,0.20,0.60,1.00": case "Blue": case "Dark_blue": case "#0000A0":
	return "#0000cc";
	break;
	case "0.20,0.60,0.80,1.00": case "#ADD8E6": case "Light_blue":
	return "#0099ff";
	break;
	case "0.20,0.60,0.20,1.00": case "Green":
	return "#009900";
	break;
	case "0.60,0.40,0.00,1.00": case "Brown":
	return "#996600";
	break;
	case "0.00,0.00,0.00,1.00": case "Black":
	return "#000000";
	break;
	case "0.00,1.00,0.00,1.00": case "Black":
	return "#000000";
	break;	
	
	

        default:
            break;
    }
}


function imageRender(){
	$("#MainContainer").html("");
	$("#MainContainer").html('<canvas height="768" width="1024" id="sketch" style="display: block; margin: 0px auto;"></canvas>');
	sketcher = new Sketcher( "sketch" );
	$('#MainContainer').show();  
    $('#MainContainer').css("background","url('"+mediaUrl+"')");
    $('#MainContainer').css("background-repeat","no-repeat"); 
    $('#MainContainer').css("background-position","center top"); 
}


function videoRender(){
	$("#MainContainer").html("");
    $('#MainContainer').show();  
    $('#MainContainer').css("background","");  
	var videourl = mediaUrl;
	var qtHTML = "";
	qtHTML += "<video id=\"video_player\" controls width=\"800\" height=\"575\"  style=\"background-color:black;border:1px solid black;display:block;\">";
	qtHTML += "<source src=\"" + videourl + "\" type=\"video/mp4\">";
	qtHTML += "<source src=\"" + videourl + "\" type=\"video/m4v\">";
	qtHTML += "<source src=\"" + videourl + "\" type=\"video/mov\">";
	qtHTML += "</video>";
	$("#MainContainer").html("<div style=\'width:800px; height:575px;margin:0 auto; overflow: hidden;\'>" + qtHTML + "</div>");
	$("#video_player")[0].autoplay = true;	
}


function surveyRender(){
	$("#MainContainer").html("");
    $('#MainContainer').show();  
    $('#MainContainer').css("background","");  
	
	$("#MainContainer").html('<div id="send_survey" ><h3><!--page title --></h3><div class="theme_content"><!--description--><div><div class="area_btn"><div class="left " id="word"><!--word--></div> </div> </div> <div class="natural_box_space margin_top"> <div class="title_bg" id="question_content"><!--question content--></div><div class="question_box_space">   <ul class="question_part"></ul>   <div class="clear"> </div>  </div>   </div> <div class="clear"></div></div> ');
	
		   

	$.each(ScribbleData,function(i,ques){
		//console.log(ques.content);
		$('#question_content').html(ques.content);


		var num = 64;
		var cnt = 0;
		var tmp = '';
		$.each(ques.answers, function(j,ans){ 

			num++;
			cnt++; 

			var response_id = 'resp_'+String.fromCharCode(num);
			var margin_none = (ques.answers.length == cnt)?'class="margin_none"':'';

			tmp += '<li '+ margin_none +'>';
			tmp += '<div class="feedback_icons" style="display:none;">';

			var display = (ans.is_correct === true)?'display:block;':'display:none;';
			tmp += '<div class="correct sprite" style="'+display+'"></div>';

			var display = (ans.is_correct === false)?'display:block;':'display:none;';
			tmp += '<div class="incorrect sprite" style="'+display+'"></div>';
			tmp += '</div>';

			var chrctr = String.fromCharCode(num);
			tmp += '<div class="answer_key left">'+chrctr+'</div>';                                        
			tmp += '<div style="display:none;" class="no_box right" id="'+response_id+'">0</div>';
			tmp += '<div class="middle">'+ $.trim(ans.answer_text_html) +'</div>';
			tmp += '<div class="clear"></div>';
			tmp += '</li>';

		});

		$('.question_part').html(tmp);
		
});	
	
	
}




var originalImageWidth = 0.0;
var originalImageHeight = 0.0;
var recievedID = "";
function ProcessExplanations() {
    $('#MainContainer').css("background","url('')");  

    var canvas = document.getElementById("sketch");
    var context = canvas.getContext("2d");
    var img = new Image();
    img.src = skecthdataimage;
    img.onload = function () {
        originalImageWidth = this.width;
        originalImageHeight = this.height;
        if (skecthdata.ti == "0") //this is in progress solution for time being needs to be changed, when ti = 0, the condition applies for image broadcast
        {
            var window_height = $("#divSessionPlayerPreviewWindow").height();
            var window_width = $("#divSessionPlayerPreviewWindow").width();
            var multFactor =1;// fn_getScalingFactor("divSessionPlayerPreviewWindow", originalImageWidth, originalImageHeight);
            //scaleFactor = multFactor;
            canvas.width = originalImageWidth * multFactor;
            canvas.height = originalImageHeight * multFactor;
            context.scale(multFactor, multFactor);
        } else {
            canvas.width = originalImageWidth;
            canvas.height = originalImageHeight
        }
        //originally it was here....
        context.drawImage(img, 0, 0, originalImageWidth, originalImageHeight);
        if (skecthdata.ti == "1" && showexplanationtext == true) {
            //put explanation text  
            var expArrayText = explanationArray[skecthdata.lpi];
            expArrayText = expArrayText.split("###");
            var expCount = expArrayText.length - 2;
            var expPageHeight = (expCount * 2 + expCount) * 27;

            if (expPageHeight > originalImageHeight) originalImageHeight = expPageHeight + 20;

            /*canvas.width = imgWidth;
            canvas.height =imgHeight 

            context.drawImage(img, 0, 0, imgWidth, imgHeight);*/
            if (receivedData.a == "complete") {
                if (skecthdataimage.indexOf("green_board") != -1 || skecthdataimage.indexOf("black_board") != -1) context.fillStyle = "White";
                else context.fillStyle = "Black";
            } else context.fillStyle = explanationtextcolor;

            var lineStartX = 0;
            var lineStartY = 0;
            var drawLineStartY = 0;
            var explanationTextWidth = canvas.width - 133;
            var lineHeight = 22;

            for (var i = 0; i <= expArrayText.length - 2; i++) {
                /* Start drawing bullet */
                context.beginPath();
                context.arc(45, (lineStartY + 1) * 30, 5, 0, Math.PI * 2, true);
                context.closePath();
                context.fill();
                /* End drawing bullet */
                context.font = "18px Arial";

                if (expArrayText[i].length <= 71) {
                    wrapText(context, expArrayText[i], (lineStartX + 1) * 69, ((lineStartY + 1) * 30) + 14, explanationTextWidth, lineHeight);
                }
                if (expArrayText[i].length > 71 && expArrayText[i].length <= 159) {
                    wrapText(context, expArrayText[i], (lineStartX + 1) * 69, ((lineStartY + 1) * 30) + 3, explanationTextWidth, lineHeight);
                }
                if (expArrayText[i].length > 159 && expArrayText[i].length >= 160) {

                    wrapText(context, expArrayText[i], (lineStartX + 1) * 69, ((lineStartY + 1) * 30) - 6, explanationTextWidth, lineHeight);
                }
                //wrapText(context, explanationText[i], (lineStartX+1)*69,((lineStartY+1)*30)-6, explanationTextWidth, lineHeight);
                context.beginPath();
                /**** line ****/
                context.moveTo((lineStartX + 1) * 10, ((lineStartY + 1) * 30) + 45); //(drawLineStartY+1)*40);
                context.lineTo(755, ((lineStartY + 1) * 30) + 45);
                context.stroke();
                lineStartY = lineStartY + 2.52; //try this : lineStartY=(lineStartY+3)-10 => put some value to subtract // 2.66
                drawLineStartY = drawLineStartY + 1;
            }
        }
        if (sketchdynamicArray.length > 0) {
            for (cnt = 0; cnt <= sketchdynamicArray.length - 1; cnt++) {
                //console.debug(sketchdynamicArray[cnt]);
                sColor = sketchdynamicArray[cnt].dyncolor;
                pencilSize = sketchdynamicArray[cnt].dynsize;
                DrawOnCanvas("sketch", sketchdynamicArray[cnt].dynskt);
            }
        }

        if (sTemplateChanged == false) {
            //sColor = skecthdata.cc.replace('Dark_blue', '#0000A0').replace('Light_blue', '#ADD8E6');
            pencilSize = skecthdata.cs;
        } else sColor = sTemplateChangeColor;

    }      //image load end
}