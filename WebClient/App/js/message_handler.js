/* 
 * exception_handler.js
 * Points:
    - Handles All Exception And Error Messages
    - Application Will Handle Messaging With This Method Only
    - Exceptions Can Be Template Specific Messages
 */
//Message Object
function Message () {}

//Constants
//Environment
Message.c_s_ENVIRONMENT_DEV = "dev";
Message.c_s_ENVIRONMENT_PRD = "prod";
Message.c_s_APP_ENVIRONMENT = Message.c_s_ENVIRONMENT_DEV;
//Message Types
Message.c_s_MESSAGE_TYPE_ERR = "error";//Error Messsages; Will Be Displayed Based On Environment
Message.c_s_MESSAGE_TYPE_ALERT = "alert";//Alert Message; Native
Message.c_s_MESSAGE_TYPE_CONSOLE = "console";//Console Message; Will be Written Only If Console Exists
Message.c_s_MESSAGE_TYPE_DIV = "div";//Messages To Be Displayed In "div"; Handles Message Text As HTML; HTML/Text Both Can Be Passed
Message.c_s_MESSAGE_TYPE_INFO = "information";//Information Messages; Will Be Turned Off By Default In Production Environment
//General Error Message
Message.c_s_GENERAL_ERROR_MESSAGE = "Error Occurred During Processing.";

/**
 * Message Write Method
 * Parameters:
    msgtext - String - Message Text Or HTML To Be Displayed
    type - String - Message Type As Above
    elem - Object - Used For Div Elements Only; Div Element Where The Message To Be Displayed
 */
Message.write = function  (msgtext, type, elem) {
    //Variables
    var excpMsg = "";
    
    //Initialization
    excpMsg = "Within displayMessage: \n";
    
    //Exception
    try {
        //Display Messages As Per The Type Passed
        switch (type) {
            case Message.c_s_MESSAGE_TYPE_ERR://Exception Message
                /**
                 * Display Message Only In Development Mode;
                 * Otherwise Too Much Console Messages Will Be Genrated In Production
                 */
                if (Message.c_s_APP_ENVIRONMENT == Message.c_s_ENVIRONMENT_DEV) {//Development
                    /**
                     * If Console Exists, Print In Console
                     * Else, Display Alert
                     */
                    if (window.console) console.log(msgtext);
                    else alert(msgtext);
                } else {//Production
                    //Display General Error Message
                    alert(Message.c_s_GENERAL_ERROR_MESSAGE);
                }
                break;
            case Message.c_s_MESSAGE_TYPE_ALERT://Alert Message
                //Display Alert Message
                alert(msgtext);
                break;
            case Message.c_s_MESSAGE_TYPE_DIV://Message To Be Displayed In A div
                //Print Text/Html In The Passed Div
                elem.innerHTML = msgtext;
                break;
            case Message.c_s_MESSAGE_TYPE_CONSOLE://Console Message
                //Print In Console If Console Exists
                if (window.console && Message.c_s_APP_ENVIRONMENT == Message.c_s_ENVIRONMENT_DEV) console.log(msgtext);
                break;
            case Message.c_s_MESSAGE_TYPE_INFO://Information Message
                //Print In Console If Console Exists And In Development Environment
                if (window.console && Message.c_s_APP_ENVIRONMENT == Message.c_s_ENVIRONMENT_DEV) console.log(msgtext);
                break;
        } 
    } catch (excp) {
        //Create Exception Message
        excpMsg += excp;
        //Display Message
        console.log(excpMsg);
    }
}