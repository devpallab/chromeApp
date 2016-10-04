var TexthelpSpeechStream = new function (){};

// Adding toolbar to the page
TexthelpSpeechStream.g_bAdded = false;
/*  TexthelpSpeechStream.g_strServer = "ilittoolbar.speechstream.net";  */
 /*TexthelpSpeechStream.g_strServer = "http://52.11.144.110/classview/texthelp"; */
 /* TexthelpSpeechStream.g_strServer = "https://iseriesqa-bts2016.learningmate.com/classview/texthelp";  */
/*  TexthelpSpeechStream.g_strServer = "https://stage.ilitserver.com/ClassView/texthelp";   */ 
 /* TexthelpSpeechStream.g_strServer = "https://prod.ilitserver.com/ClassView/texthelp"; */ 
 //TexthelpSpeechStream.g_strServer = "http://52.37.108.246:8003/texthelp";
 TexthelpSpeechStream.g_strServer = "https://production.pearsonapi.com/ClassView/texthelp";
 
TexthelpSpeechStream.g_strSpeechServer = "speechstreamservices.speechstream.net";
TexthelpSpeechStream.g_strSpeechServerBackup = "speechstreamservicesbackup.speechstream.net";
TexthelpSpeechStream.g_strCacheServer = "speechstreamcache.speechstream.net";
TexthelpSpeechStream.g_strBuild = "198";

TexthelpSpeechStream.g_strBookId = null;
TexthelpSpeechStream.g_strPageId = null;

TexthelpSpeechStream.addToolbar = function (p_strBookId, p_strPageId)
{
    if(typeof(p_strBookId) == "string")
    {
        TexthelpSpeechStream.g_strBookId = p_strBookId;
    }

    if(typeof(p_strPageId) == "string")
    {
        TexthelpSpeechStream.g_strPageId = p_strPageId;
    }


    if(!TexthelpSpeechStream.g_bAdded)
    {
        var elem = document.createElement("script");
        elem.type = "text/javascript";
        elem.src = TexthelpSpeechStream.g_strServer + "/speechstream/v" + TexthelpSpeechStream.g_strBuild + "/texthelpMain.js";
        document.body.appendChild(elem);
        TexthelpSpeechStream.g_bAdded = true;
    }
};


function $rw_userParameters()
{
    try
    {
        eba_server = TexthelpSpeechStream.g_strServer;
        eba_server_version  = TexthelpSpeechStream.g_strBuild;
        eba_live_servers = [TexthelpSpeechStream.g_strSpeechServer, TexthelpSpeechStream.g_strSpeechServerBackup];
        eba_cache_servers = [TexthelpSpeechStream.g_strCacheServer];
        eba_login_name = "learningmate";
        eba_icons = main_icons | selectspeed_icon | calculator_icon | picturedictionary_icon;
        eba_voice = "Vocalizer Expressive Ava Premium High 22kHz";
        eba_ignore_buttons = true;
        eba_locale = LOCALE_US;
        eba_use_html5 = true;
        eba_ssl_flag = (location.protocol == "https:");

        eba_break_list = "!z";

        eba_cust_id = "2290";
        eba_book_id = TexthelpSpeechStream.g_strBookId;
        eba_page_id = TexthelpSpeechStream.g_strPageId;

        eba_cache_mode = true;								// Looks for cached audio on server
        eba_cache_live_generation = true;					// Enables live speech generation if cached audio not found

        eba_translate_source = "English";
        eba_translate_target = "Spanish";
        eba_translate_type = "paragraph";


        eba_speech_started_callback = "textRead_speechStartedCallback()";
        eba_speech_complete_callback = "textRead_completedCallback()";

    }
    catch(err)
    {
    }
}



