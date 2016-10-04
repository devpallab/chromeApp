/**
 * @author LearningMate
 * @date 20130521
 * @objectives
 	- Contains All Constants To Be Used In The Application
 * @revision
 	20130521 - Initial Version -
 */
//General Constants
General = {
	//Attributes
	c_s_ATTR_CLASS: "class",//Attribute Class
	c_s_ATTR_PAGE: "page",//Attribute Page
	c_s_ATTR_SOLUTION: "solution",//Attribute Solution
	c_s_ATTR_PARA: "para",//Attribute Para
        c_s_ATTR_TITLE: "title",//Attribute Para

	//HTML/XML ELement Properties
	c_s_TAG_NAME: "tagName",//Tag Name Properties

	//Classes
	c_s_CLASS_TOGGLE_ACTIVE: "active",//Class For Making An Element Active/Inactive
	c_s_CLASS_ELEM_HIDDEN: "ui_elem_hidden",//Class For Making Element Hidden/Visible

	//Page Number Text
	c_s_PAGE_NUMBER_TEXT: "Page [PageNum] of [BookLength]",//Page Number Text Format
	c_s_PAGE_NUMBER_CURRENT: "[PageNum]",//Page Number Text Format
	c_s_PAGE_NUMBER_LENGTH: "[BookLength]",//Page Number Text Format

	//Spacer Image URL
	c_s_SPACER_URL: "spacer.gif",

	//Action
	c_s_POS_LEFT: "left",//For Left Position
	c_s_POS_TOP: "top",//For Top Position

	//Request Data Keys
	c_s_REQUEST_KEY_PAGE: "page",//Page Key; Will Be Used For Highlight, Notes, Bookmark
	c_s_REQUEST_KEY_ACTIONTYPE: "actionType",//Action Type Key; Will Be Used For Highlight, Notes, Bookmark
	c_s_BOOKID_KEY: "bookid",//Book Id Key In JSON
	c_s_ALL_MARKINGS_KEY: "all",//All Markings Request Key
	c_s_PAGE_NUMBER_KEY: "pagenum",//Page Number Key
	c_s_DELETE_REQ_KEY_PARA: "paragraph",//Para Key In Delete Request

	//response Data Keys
	c_s_RESPONSE_STATUS: "status",//Status Key
	c_s_RESPONSE_CODE: "code",//Code Key
	c_s_RESPONSE_MESSAGE: "msg",//Message Key
	c_s_DATE: "date",//Date Key
	c_s_TIME: "time",//Date Key

	//Specific Page
	c_s_GO_TO_PAGE: "gotopage",//Go To Page Local Storage Key
        c_s_PAGE_LOADING: "pageloading",//Page Loading Local Storage Key

    //Player Page URL
	c_s_PLAYER_URL: "../epub_player/player.php?solutionId=",//Player URL

	//Messages
	c_s_OFFLINE_ALERT: "Browser has no internet access. Changes will not be saved and will be lost when browser comes online or browser cache cleared.",//Offline Notification
        c_s_INVALID_BOOKS_ALERT: "The Session has been Timed Out.",//Invalid Book Page Accessed
        c_s_NONCACHED_BOOK_ALERT: "This book is not cached and so will not be available while offline.",//Non Cached Books Accessed While Offline
        c_s_NONCACHED_PAGE_ALERT: "This Page Might Not Have Cached And So Will Not Be Available While Offline",//Non Cached Pages Accessed While Offline
        c_s_NONPARSED_PAGE_ALERT: "Paragraph Highlighting And Notes Creation Functionalities Will Not Be Available For This Book.",//Non Cached Pages Accessed While Offline

	//Ellipses
	c_s_ELLIPSES_CHARS: "...",//Offline Notification

	//URL
	c_s_URL_HOME: "../solution/index.html",//Home Link
        c_s_URL_LOGOUT: "../",//Login Link

    //URL Key
    c_s_URL_KEY: "key",//URL Key

    //Pages
    c_s_VISITED_PAGES: "visited_pages",//Visited Pages List
    c_s_CACHED: "cached"//Visited Pages List
}

//Book View Functionality
Books = {
	//URL
	//c_s_BOOKLIST_URL: "fetch_book_list.php",//To Fetch Book List
	c_s_BOOKLIST_URL: "../js/fetchbooklist.js",//To Fetch Book List
	c_s_CONTAINER_XML_URL: "META-INF/container.xml",//container.xml URL Within ePub Folder
        c_s_CUSTOM_OPF: "custom_package.opf",//Custom OPF File Name

	//Response Keys
	c_s_SOLUTION_ID_KEY: "book_id",//Solution Id Key
	c_s_PARSED_KEY: "isparsed",//Attribute Para
	c_s_URL_KEY: "url",//Url Key
        c_s_BOOK_PATH_KEY: "book_path",//Url Key
        
        //Book Folder Prefix
        c_s_BOOKFOLDER_PREFIX: "",
        c_s_LIBRARY_URL: "../library.html",
        
        //Booklist Keys
        c_s_BOOKLIST_KEY_CATEGORY: "categorylist"
};

//Tooltips
Tooltips = {
	//Hide Commands
	c_s_HIDE_ALL: "all",//Hide All
	c_s_HIDE_ALL_EXCEPT_BOOKMARK: "except_bookmark",//Hide All Except Bookmark
	c_s_HIDE_ALL_EXCEPT_SEARCH: "except_search",//Hide All Except Search
	c_s_HIDE_ALL_EXCEPT_NOTES: "except_notes",//Hide All Except Notes
	c_s_HIDE_ALL_EXCEPT_STYLESETTING: "except_stylesetting",//Hide All Except Style Setting
    c_s_HIDE_ALL_EXCEPT_HELP: "except_help",//Hide All Except Style Setting
}

//Bookmark Functionality
Bookmark = {
	//URL
	c_s_ADD_BOOKMARK_URL: "../reader/webservice/addbookmark",//JSON File Location
	c_s_FETCH_BOOKMARK_URL: "../reader/webservice/fetchbookmarks",//JSON File Location
	c_s_DELETE_BOOKMARK_URL: "../reader/webservice/deletebookmark",//JSON File Location

	//Action
	c_s_ACTION_FETCH: "fetch",//For Fetch Action
	c_s_ACTION_UPDATE: "update",//For Update Action
	c_obj_ACTION: {
		"fetch": "../reader/webservice/fetchbookmarks",
		"update": "../reader/webservice/addbookmark"
	},//To Fetch URL For Sync

	//Keys
	c_s_BOOKMARKS_KEY: "bookmarks",//Bookmarks Key In JSON
	c_s_PAGE_KEY: "page",//Page Key In JSON
	c_s_NAME_KEY: "name",//Name Key In JSON

	//Blank Bookmark Message
	c_s_MSG_BLANK_NAME: "Please Enter A Name For Bookmark"//Blank Bookmark Message
};

//Search Functionality
Search = {
	//URL
	c_s_SEARCH_URL: "../reader/webservice/search",//Search URL
	//Keys
	c_s_NOCHAPTER: "nochapter",//Key Name For When No Chapter Is Avaialable
	c_s_SEARCHRESULTS: "results",//Result Object Parent Key
	c_s_SEARCHSTR: "searchstr",//Sear String Key
	//Local Storage Key
	c_s_RESULTLIST: "resultlist",
	//Element Wrappers
	c_s_SEARCHWRAPPER_START: "<span class='ui_srch_hglt'>",//Wrapper start
	c_s_SEARCHWRAPPER_END: "</span>",//Wrapper End
    //Delimiter
    c_s_PARA_RESULT_DELIM: "-"//Para Id And Preview Text Delimiter
};

//Highlight Functionality
Highlight = {
	//URL
	c_s_ADD_HIGHLIGHT_URL: "../reader/webservice/syncmarkings",//Modify
	c_s_FETCH_HIGHLIGHT_URL: "../reader/webservice/fetchmarkings",//Fetch
	c_s_DELETE_HIGHLIGHT_URL: "../reader/webservice/deletemarkings",//Delete

	//Highlight Tooltip Ids
	c_s_TOOLTIP_ID_COLOR1: "color1",//Color 1 Highlight
	c_s_TOOLTIP_ID_COLOR2: "color2",//Color 2 Highlight
	c_s_TOOLTIP_ID_COLOR3: "color3",//Color 3 Highlight
	c_s_TOOLTIP_ID_DELETE: "del",//Delete Highlight
	c_s_TOOLTIP_ID_NOTE: "note",//note

	//Highlight CSS Styles
	c_obj_HIGHGLIGHT_STYLES: {
		"color1": "ui_hglt_yellow",//Color1
		"color2": "ui_hglt_red",//Color1
		"color3": "ui_hglt_green"//Color1
	},

	//Request Data Key
	c_s_HIGHLIGHT_REQ_DATA_KEY: "highlight",//highlight Key For JSON

	//Response Key
	c_s_HIGHLIGHT_RES_CLASS_KEY: "class",//Style Class Key For JSON
        c_s_HIGHLIGHT_RES_END_KEY: "end",//Style End Key For JSON
        c_s_HIGHLIGHT_RES_START_KEY: "start",//Style Start Key For JSON
        c_s_HIGHLIGHT_PHRASE_LEVEL_KEY: "phrase_level",//Phrase Level Key
        c_s_HIGHLIGHT_PARA_LEVEL_KEY: "para_level",//Para Level Key

        //Delimiters In Highlight
        c_s_DELIM_PARAGRAPH: "|",//Paragraph Delimiter
        c_s_DELIM_PARAMETER: "$",//Parameter Delimiter
        //Prefixes
        c_s_PHRASE_LEVEL_PREFIX: "type:textContent|",//Phrase Level Prefix
        //Paragraph Id Index
        c_i_PARA_ID_INDEX: 4,//Index For Paragraph Id
	//Request Keys
        c_s_SURROUND_ELEM: "span",//Surround Elements
        c_s_SURROUND_ELEM_DUMMY_ID: "[PRM_ID]",//Surround Element Id
        c_s_SURROUND_ELEM_DUMMY_CLASS: "[PRM_CLASS]",//Surround Element Class
        c_s_SURROUND_ELEM_DUMMY_ORIGSTART: "[PRM_ORIGSTART]",//Surround Element Orig Start
        c_s_SURROUND_ELEM_DUMMY_ORIGEND: "[PRM_ORIGEND]",//Surround Element Orig End
        c_s_SURROUND_ELEM_START: "start",//Surround Element Id Attribute
        c_s_SURROUND_ELEM_END: "end",//Surround Element Id Attribute
        c_s_SURROUND_ELEM_ID: "id",//Surround Element Id Attribute
        c_s_SURROUND_ELEM_PREV_ID: "previd",//Surround Element Id Attribute
        c_s_SURROUND_ELEM_ORIG_END: "origend",//Original End Of Highlight
        c_s_SURROUND_ELEM_ORIG_START: "origstart",//Original start Of Highlight
        c_s_SURROUND_ELEM_ID_PREFIX: "hglt",//Surround Element Id Attribute Prefix
        c_s_SURROUND_ELEM_ID_DELIM: "_"//Surround Element Id Attribute Delim
};

//Notes Functionality
Notes = {
	//URL
	c_s_ADD_NOTES_URL: "../reader/webservice/syncmarkings",//Modify
	c_s_FETCH_NOTES_URL: "../reader/webservice/fetchmarkings",//Fetch
	c_s_DELETE_NOTES_URL: "../reader/webservice/deletemarkings",//Delete

	//Note Icon image Url
	c_s_NOTE_ICON_URL: "note_icon.png",

	//Note Line Delimiter
	c_s_LINE_DELIM: "<br>",//Line Delimiter For The Note Text
	c_s_MAX_LINES: 2,//Maximum Lines To Be Displayed
	c_s_MAX_CHARS: 50,//MAximum Characters To Be Displayed

	//Keys
	c_s_NOTE_KEY: "note",//Note Key In JSON
	c_s_REQ_DATA_KEY: "notes"//Notes Key In Request
}

//Style Settings Functionality
StyleSetting = {
	//URL
	c_s_SYNC_URL: "../reader/webservice/synctheme",//Sync URL
	c_s_FETCH_URL: "../reader/webservice/fetchtheme",//Get URL

	//Attribute
	c_s_ATTR_THEMING: "theming",//Theming Attribute In Body
	c_s_STYLE_THEME: "theme",//Theme Attribute Name
	c_s_STYLE_HREF: "href",//href Attribute Name

	//Path
	c_s_CSS_PATH: "",//CSS File Path

	//Default Theme
	c_s_DEFAULT_THEME: "default.css",//Default Theme

	//Keys
	c_s_THEME_KEY: "theme"//Theme Key
}

//TOC Constants
TOC = {
	//Chapter Key
	c_s_CHAPTER: "chapter",//Chapter Key


	//NCX Elements
	c_s_NAVMAP: "navMap",//navmap Element
	c_s_NAVPOINT: "navPoint",//navmap Element
	c_s_NAVLABEL: "navLabel", //navLabel Element
	c_s_TEXT: "text", //text Element
	c_s_CONTENT: "content",//content Element

    //HTML Elements
    c_s_OL: "ol",//ol Element
    c_s_UL: "ul",//ul Element
    c_s_LI: "li",//li Element
    c_s_ANCHOR: "a",//a Element
    c_s_HREF: "href",//href Element

	//NCX Attributes
	c_s_ID: "id",//ID
	c_s_PLAYORDER: "playOrder",//Play Order
	c_s_SRC: "src",//Source

	//TOC Html Attributes
	c_s_CLASS: "class",//Style Class
	c_s_LEVEL: "level",//Item Level
	c_s_PAGE_LINKED: "page",//Linked Page Key
	c_s_PAGE_TOC_NAME: "title",//TOC Display Name Key

	//Classes
	c_s_CLASS_PAGENUM: "toc_page_no",//Page Number
	c_s_CLASS_TOCHEADING: "toc_headings",//TOC Text
	c_s_CLASS_SUB: "sub",//TOC Text
	c_s_CLASS_CLEAR: "clear",//TOC Text

	//TOC Types
	c_s_NCX: "ncx",//NCX Type
	c_s_NAV: "nav"//NCX Type
}

//Loader Functionality
Loader = {
	//Loader Texts
	c_s_TEXT_LOADING: "",//Loading Text; Default
	c_s_TEXT_SYNCING: "Synchronizing...",//Synchronising Text
	c_s_TEXT_CACHING: "Caching...",//Caching Text
	c_s_TEXT_LOAD_MARKINGS: "Loading Markings...",//Caching Text
    c_s_TEXT_NONCAHCED_PAGE_ACCESS: "Page Not In Cache..."//Caching Text
}

//Theme Functionality
Theme = {
	//URL
	c_s_SYNC_URL: "../reader/webservice/synctheme",//Sync URL

	//Attributes
	c_s_ATTR_THEMING: "theming",//Theming Attribute In Body

	//Keys
	c_s_THEME_KEY: "theme"//Theme Key
}

//Sync
Sync = {
	//Sync URL
	c_s_SYNC_OFFLINE_DATA_URL: "../reader/webservice/syncofflinedata",//Offline Actions Synchronization URL

	//local Storage Keys
	c_s_SCHEDULE: "schedule",//Schedule Key Local Storage; Schedluer Will Be Invoked Based On This Key
	c_s_SCHEDULED: "true",//Flag Value

    //Status Class
    c_s_ONLINE_STATUS_CLASS: "status_online",//Online
    c_s_OFFLINE_STATUS_CLASS: "status_offline",//Offline

    //Status Tooltip
    c_s_TOOLTIP_STATUS_ONLINE: "Online",//Status Online
    c_s_TOOLTIP_STATUS_OFFLINE: "Offline",//Status Offline

    //Status Attributes
    c_s_STATUS: "status",//Status Key
    c_s_MESSAGE: "msg",//Messasge Key
    c_s_CODE: "code",//Code Key
    c_s_STATUS_SUCCESS: "1",//Status Success
    c_s_STATUS_ERROR: "0",//Status Error
    c_s_STATUS_LOGOUT: "-1"//Status Logout
}

//User Agents
UserAgent = {
    //User Agent Types
    c_s_TYPE_DESKTOP: "desktop",//Desktop
    c_s_TYPE_ANDROID_DEFAULT: "android_default",//Desktop
    c_s_TYPE_ANDROID_CHROME: "android_chrome",//Desktop
    c_s_TYPE_ANDROID_FIREFOX: "android_firefox",//Desktop
    c_s_TYPE_IPHONE: "iPhone",//iPhone
    c_s_TYPE_IPAD: "iPad",//iPhone

    //User Agent Keys
    c_s_KEY_WINDOWS: "Windows",//Windows
    c_s_KEY_MACINTOSH: "Macintosh",//Macintosh
    c_s_KEY_ANDROID: "Android",//Android
    c_s_KEY_IPHONE: "iPhone",//iPhone
    c_s_KEY_IPAD: "iPad",//iPhone
    c_s_KEY_FIREFOX: "Firefox",//Firefox
    c_s_KEY_CHROME: "Chrome",//Chrome

    //Landscape Blocked User Agent
    c_arr_LANDSCAPE_BLOCK: "iPhone,GT-N7100,GT-I9300",//Keys
    c_arr_LANDSCAPE_BLOCK_DELIM: ","//Keys
}
