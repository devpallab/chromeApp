/* Texthelp Systems, Inc. SpeechStream Toolbar Parameters */
function $rw_userParameters()
{
	try{
		
		/* +++ User customizable parameters start here. +++ */
		eba_icons = main_icons + picturedictionary_icon + pause_icon + selectspeed_icon + calculator_icon + vocabulary_icon + strike_icon;
        //		eba_voice = "IVONA 2 Salli - US English female voice [22kHz]";
		eba_voice = "Vocalizer Expressive Ava Premium High 22kHz";
		eba_server = "speechdemo.speechstream.net";
		eba_speech_server="cachedemo.speechstream.net";
		eba_speech_server_backup = "speechdemo.speechstream.net";
        
		eba_picturedictionary_server = "http://speechdemo.speechstream.net";
		eba_translate_server = "http://speechdemo.speechstream.net";
		eba_dictionary_server = "http://speechdemo.speechstream.net";
		
		eba_cache_mode = true;
		eba_cache_live_generation = true;
		eba_local_pronunciation = true;
		eba_check_pronunciation_before_cache = true;
        
		eba_play_start_point = "bodyStart";
		
		eba_login_name = "texthelpdemo";
		eba_cust_id = "1000";
		eba_book_id = "1";
		eba_page_id = "1";
        
		eba_use_html5 = true;
		
		eba_language = ENGLISH_US;
		eba_locale = LOCALE_US;
		
		eba_ignore_buttons = true;
		/* +++ End of user customizable parameters section. +++ */
    }catch(err)
	{
	}
}

var TexthelpSpeechStreamToolbar = new function(){};

//
// Adding toolbar to the page
TexthelpSpeechStreamToolbar.g_bAdded = false;

TexthelpSpeechStreamToolbar.addToolbar = function()
{
	if
		(!TexthelpSpeechStreamToolbar.g_bAdded )
    {
        var elem = document.createElement("script");
        elem.type = "text/javascript";
        elem.src = "http://speechdemo.speechstream.net/SpeechStream/v191/texthelpMain.js";
        document.body.appendChild(elem);
        TexthelpSpeechStreamToolbar.g_bAdded = true;
    }
}