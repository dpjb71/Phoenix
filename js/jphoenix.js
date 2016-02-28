var spinnerOptions = {
  lines: 13, // The number of lines to draw
  length: 13, // The length of each line
  width: 4, // The line thickness
  radius: 13, // The radius of the inner circle
  corners: 0, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 2.2, // Rounds per second
  trail: 100, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};

if(!Object.create) {
    Object.create = (function() {
        function F() {}
        
        return function(o) {
            if(arguments.length !== 1) {
                throw new Error('Object.create implementation only accepts one parameter.');
            }
            
            F.prototype = o;
            return new F();
        }
    })()
}





(function($) 
{
    var token;
    
    $.jPhoenix = function() // constructeur obligatoire
    {
    };

    $.jPhoenix.setToken = function(value) {
        token = value;
    }
    
    $.jPhoenix.getToken = function() {
        return token;
    }

    $.jPhoenix.getJSON = function(
        url, // Url du webService
        postData, // Tableau JSON des donn�es � poster au webserice
        callBack // fonction qui g�re le retour du webservice
    ) {
        //$("body").toggleClass('onLoad');
//        spinner.spin();
        var myToken = $.jPhoenix.getToken();
        postData.token = myToken;

        $.ajax({
            type: 'POST',
            url: url,
            data: postData,
            dataType: 'json',
            async: true
        }).done(function(data, textStatus, xhr) {
            try 
            {
                $.jPhoenix.setToken(data.token);
                if($.isFunction(callBack)) {
                    callBack.call(this, data, textStatus, xhr);
                }
                //$("body").removeClass('onLoad');
//                    spinner.stop();
            }
            catch(e)
            {
                debugLog(e);
            }
        }).fail(function(xhr, options, message) {
            debugLog("Satus : " + xhr.status + "\r\n" +
                    "Options : " + options + "\r\n" +
                    "Message : " + message);
        });
    };

    $.jPhoenix.getJSONP = function(url, postData, callBack) {
        var myToken = $.jPhoenix.getToken();
        postData.token = myToken;

        $.ajax({
            type: 'POST',
            url: url + "&callback=?", // retour en JSONP
            data: postData,
            dataType: 'json',
            async: true
        }).done(function(data, textStatus, xhr) {
            try {
                data.status = textStatus;
                data.headers = xhr.getAllResponseHeaders();
                $.jPhoenix.setToken(data.token);
                if($.isFunction(callBack)) {
                    callBack.call(this, data, textStatus, xhr);
                }
            }
            catch(e) {
                debugLog(e);
            }
        }).fail(function(xhr, options, message) {
            debugLog("Satus : " + xhr.status + "\r\n" +
                "Options : " + options + "\r\n" +
                "Message : " + message);
        });
    };
    
    $.jPhoenix.getView = function (pageName) {
        
        var myToken = $.jPhoenix.getToken();

        $.ajax({
            type: 'POST',
            url: pageName,
            data: {"action" : 'getViewHtml', "token" : myToken},
            dataType: 'json',
            async: true,
            headers: {
                "Accept" : "application/json, text/javascript, request/view, */*; q=0.01"
//            ,   "X-Token:" : myToken
            }
        }).done(function(data, textStatus, xhr) {
            try {
                $.jPhoenix.setToken(data.token);

                var l = data.scripts.length;
                for(i = 0; i < l; i++) {
                    $.getScript(data.scripts[i]);
                }

                var url = TWebObject.parseUrl(pageName);
                TRegistry.item(url.page).origin = xhr.getResponseHeader('origin');

                var html = base64_decode(data.view);
                $("#mainContent").html(html);
            }
            catch(e) {
                debugLog(e);
            }
        }).fail(function(xhr, options, message) {
            debugLog("Satus : " + xhr.status + "\r\n" +
                "Options : " + options + "\r\n" +
                "Message : " + message);
        });
    };
    
    $.jPhoenix.getViewEx = function (pageName, action, attach, postData, callBack) {
        
        var myToken = $.jPhoenix.getToken();
        
        if(postData === undefined) {
            postData = {};
        }
        
        postData.action = action;
        postData.token = myToken;

        $.ajax({
            type: 'POST',
            url: pageName,
            data: postData,
            dataType: 'json',
            async: true,
            headers: {
                "Accept" : "application/json, text/javascript, request/view, */*; q=0.01"
//            ,   "Token:" : myToken
            }
        }).done(function(data, textStatus, xhr) {
            try {
                $.jPhoenix.setToken(data.token);

                if($.isFunction(callBack)) {
                    callBack.call(this, data);
                } else {
                    var html = base64_decode(data.view);
                    $(attach).html(html);

                }

            }
            catch(e) {
                debugLog(e);
            }
        }).fail(function(xhr, options, message) {
            debugLog("Satus : " + xhr.status + "\r\n" +
                "Options : " + options + "\r\n" +
                "Message : " + message);
        });
    };
    
    $.jPhoenix.getPartialView = function (pageName, action, attach, postData, callBack) {
        var myToken = $.jPhoenix.getToken();
        
        if(postData === undefined) {
            postData = {};
        }
        
        postData.action = action;
        postData.token = myToken;

        $.ajax({
            type: 'POST',
            url: pageName,
            data: postData,
            dataType: 'json',
            async: true,
            headers: {
                "Accept" : "application/json, text/javascript, request/partialview, */*; q=0.01"
//            ,   "X-Token:" : myToken
            }
        }).done(function(data, textStatus, xhr) {
            try 
            {
                var l = data.scripts.length;
                for(i = 0; i < l; i++) {
                    $.getScript(data.scripts[i]);
                }

                $.jPhoenix.setToken(data.token);
                if($.isFunction(callBack)) {
                    callBack.call(this, data);
                }
                
                var url = new TWebObject.parseUrl(pageName);
                TRegistry.item(url.page).origin = xhr.getResponseHeader('origin');
             
                var html = base64_decode(data.view);
                $(attach).html(html);
            }
            catch(e)
            {
                debugLog(e);
            }
        }).fail(function(xhr, options, message) {
            debugLog("Satus : " + xhr.status + "\r\n" +
                    "Options : " + options + "\r\n" +
                    "Message : " + message);
        });
    };

    $.jPhoenix.attachWindow = function (pageName, anchor) {
        var myToken = $.jPhoenix.getToken();
        $.jPhoenix.getJSON('' + pageName, {"action" : 'getViewHtml', "token" : myToken}, function(data, status, xhr) {
            try {
                $.jPhoenix.setToken(data.token);

                var url = TWebObject.parseUrl(pageName);
                TRegistry.item(url.page).origin = xhr.getResponseHeader('origin');
 
                var html = base64_decode(data.view);
                $(anchor).html(html);
                
//                TRegistry.write(page, 'origin', xhr.getResponseHeader('origin'));
//                window[page] = {};
//                window[page].origin = xhr.getResponseHeader('origin');

            }
            catch(e) {
                debugLog(e);
            }
        });           
    };

    $.jPhoenix.attachView = function (pageName, anchor) {
        var myToken = $.jPhoenix.getToken();
        $.jPhoenix.getJSON('' + pageName, {"action" : 'getViewHtml', "token" : myToken}, function(data) {
            try {
                $.jPhoenix.setToken(data.token);

                var l = data.scripts.length;
                for(i = 0; i < l; i++) {
                    $.getScript(data.scripts[i]);
                }
                
                var html = base64_decode(data.view);
                $(anchor).html(html);                
            }
            catch(e) {
                debugLog(e);
            }
        });           
    };

    $.jPhoenix.attachViewP = function (pageName, anchor) {
        var myToken = $.jPhoenix.getToken();
        $.jPhoenix.getJSONP('' + pageName, {"action" : 'getViewHtml', "token" : myToken}, function(data) {
            try {
                $.jPhoenix.setToken(data.token);
                var l = data.scripts.length;
                for(i = 0; i < l; i++) {
                    $.getScript(data.scripts[i]);
                }
                
                var html = base64_decode(data.view);
                $(anchor).html(html);
                
            }
            catch(e) {
                debugLog(e);
            }
        });           
    };

    $.jPhoenix.html64 = function(container, html) {
        $(container).html(base64_decode(html));
        //$(container).html(html);
    } 

    $.jPhoenix.selectedValues = function(selectObjectId) {

        var selectedOptions = $('select#' + selectObjectId + ' option:selected');

        var result = $.map(selectedOptions ,function(option) {
            return option.value;
        });    

        return result;
    }

    $.jPhoenix.debugLog = function(message) {
            alert(message);
    }

    $.jPhoenix.phpJsonDecode = function(json)
    {
        if(json === null) return '';
        return json.replace('\"', '', "g").replace("\\u0022", '"', "g").replace("\\u003C", "<", "g").replace("\\u003E", ">", "g").replace("\\/", "/", "g").replace("\\t", '\t', "g").replace("\\r", '\r', "g").replace("\\n", '\n', "g");
    };

    $.jPhoenix.getScripts = function(data) {
        var l = data.scripts.length;
        for(i = 0; i < l; i++) {
            $.getScript(data.scripts[i]);
        }
    }


    /*
    * jQuery getCSS Plugin
    * Copyright 2013, intesso
    * MIT license.
    *
    * cross browser function to dynamically load an external css file.
    * see: [github page](http://intesso.github.com/jquery-getCSS/)
    *
    */

    /*
    arguments: attributes
    attributes can be a string: then it goes directly inside the href attribute.
    e.g.: $.getCSS("fresh.css")

    attributes can also be an objcet.
    e.g.: $.getCSS({href:"cool.css", media:"print"})
    or: $.getCSS({href:"/styles/forest.css", media:"screen"})
    */
    $.jPhoenix.getCSS = function(attributes) {
        // setting default attributes
        if(typeof attributes === "string") {
            var href = attributes;
            attributes = {
                href: href
            };
        }
        if(!attributes.rel) {
            attributes.rel = "stylesheet"
        }
        // appending the stylesheet
        // no jQuery stuff here, just plain dom manipulations
        var styleSheet = document.createElement("link");
        for(var key in attributes) {
            styleSheet.setAttribute(key, attributes[key]);
        }
        var head = document.getElementsByTagName("head")[0];
            head.appendChild(styleSheet);
    };

    $.jPhoenix.bindTriStateCheck = function(parentElement) {
        if($(parentElement).length === 0) return;
        
        var checkboxes = $(parentElement).find("input:checkbox");
        
        checkboxes.each(function() {
            var checkBox = $(this);
            checkBox.click(function() {
                $.jPhoenix.checkNextTriState(checkBox);
            })
       });        
    };
    
    $.jPhoenix.bindBiStateCheck = function(parentElement) {
        if($(parentElement).length === 0) return;
        
        var checkboxes = $(parentElement).find("input:checkbox");
        
        checkboxes.each(function() {
            var checkBox = $(this);
            checkBox.click(function() {
                $.jPhoenix.checkNextBiState(checkBox);
            })
       });        
    };

    $.jPhoenix.checkNextTriState = function (checkBox) {
        var data = checkBox.data('checked');
        switch(data) {
            case 0:
                checkBox.data('checked', 1);
                checkBox.prop('indeterminate', false);
                checkBox.prop('checked', true);                
                break;
            case 1:
                checkBox.data('checked', 2);
                checkBox.prop('indeterminate', true);
                checkBox.prop('checked', true);                
                break;
            case 2:
            default:  
                checkBox.data('checked', 0);
                checkBox.prop('indeterminate', false);
                checkBox.prop('checked', false);
                break;
                // On ne change rien
        }
    }


    $.jPhoenix.checkTriStateByData = function (checkBox, data) {
        switch(data) {
            case 0:
                // unchecked
                checkBox.data('checked', 0);
                checkBox.prop('indeterminate', false);
                checkBox.prop('checked', false);
                break;
            case 1:
                // checked
                checkBox.data('checked', 1);
                checkBox.prop('indeterminate', false);
                checkBox.prop('checked', true);                
                break;
            case 2:
                // indeterminate
                checkBox.data('checked', 2);
                checkBox.prop('indeterminate', true);
                checkBox.prop('checked', true);                
                break;
            case -1:
            default:  
                // On ne change rien
        }
    };
    
    $.jPhoenix.checkNextBiState = function (checkBox) {
        var data = checkBox.data('checked');
        switch(data) {
            case 0:
                // unchecked
                checkBox.data('checked', 1);
                checkBox.prop('indeterminate', true);
                checkBox.prop('checked', true);                
                break;
            case 1:
                checkBox.data('checked', 0);
                checkBox.prop('indeterminate', false);
                checkBox.prop('checked', false);
                // indeterminate
                break;
        }
    }

    $.jPhoenix.checkBiStateByData = function (checkBox, data) {
        
        switch(data) {
            case 1:
                // indeterminate
                checkBox.data('checked', 1);
                checkBox.prop('indeterminate', true);
                checkBox.prop('checked', true);                
                break;
            case 0:
            default:  
                // unchecked
                checkBox.data('checked', 0);
                checkBox.prop('indeterminate', false);
                checkBox.prop('checked', false);
                break;
        }

    };
    
    $.jPhoenix.checkAllTriState = function(parentElement, effect) {
        if($(parentElement).length === 0) return false;
        
        var checkboxes = $(parentElement).find("input:checkbox");
        
        checkboxes.each(function() {
            var checkBox = $(this);
            $.jPhoenix.checkTriStateByData(checkBox, effect);
        });
    };
    
    $.jPhoenix.checkAllBiState = function(parentElement, effect) {
        if($(parentElement).length === 0) return false;
        
        var checkboxes = $(parentElement).find("input:checkbox");
        
        checkboxes.each(function() {
            var checkBox = $(this);
            $.jPhoenix.checkBiStateByData(checkBox, effect);
        });
    };

    $.jPhoenix.selectableInput = function (parentElement) {
        $(parentElement).selectable({
            filter:'label',
            stop: function() {        
                $(".ui-selected input", this).each(function() {
                    //this.checked= !this.checked
                    var checkBox = $(this);
                    $.jPhoenix.checkNextTriState(checkBox);
                });
            }
        });
    };

    $.jPhoenix.selectAll = function (parentElement, functionName) {
        
        if($(parentElement).length === 0) return false;
        alert('parentElement :' + parentElement)        
        
        var callback = window[functionName];
        var checkboxes = $(parentElement).find("input:checkbox");

        alert('checkboxes.length :' + checkboxes.length)        
        
        checkboxes.each(function() {
            var checkBox = $(this);
            checkNextTriState();

            if($.isFunction(callback)) {
                alert('callback :' + functionName)
                callback.call(this, checkBox)
            }

        });
    };
    
    $.jPhoenix.keyValueExists = function(key, value, haystack) {
        var result = -1;
        
        if(haystack.length === 0) return result;
        var first = haystack[0];
        
        if(!first.hasOwnProperty(key)) return result;
        
        for( var k = 0; k < haystack.length; ++k ) {
            if( value === haystack[k][key] ) {
                result = k;
                break;
            }
        }        
        
        return result;
    }
    
    $.jPhoenix.replaceByKeyValue = function(key, value, object, haystack) {
        var result = false;
        
        var index = $.jPhoenix.keyValueExists(key, value, haystack);
        
        if(index > -1) {
            haystack[index] = object ;
            result = true;
        }
        
        return result;
    }
    

})(jQuery);

function escapeDoubleQuotes(phrase) {
    var result = phrase.replace(/\"/g, '&quot;');
    return result;
}

function escapeQuotes(phrase) {
    return phrase.replace(/\'/g, '&apos;');
}

function checkAllBiState(parentElement, data) {
    $.jPhoenix.checkAllBiState(parentElement, data);
}

function checkAllTriState(parentElement, data) {
    $.jPhoenix.checkAllTriState(parentElement, data);
}

function checkNextBiState(checkBox) {
    $.jPhoenix.checkNextBiState(checkBox);
}

function checkNextTriState(checkBox) {
    $.jPhoenix.checkNextTriState(checkBox);
}

function checkBiStateByData(checkBox, data) {
    $.jPhoenix.checkBiStateByData(checkBox, data);
}

function checkTriStateByData(checkBox, data) {
    $.jPhoenix.checkTriStateByData(checkBox, data);
}

function bindBiStateCheck(parentElement) {
    $.jPhoenix.bindBiStateCheck(parentElement);
}

function bindTriStateCheck(parentElement) {
    $.jPhoenix.bindTriStateCheck(parentElement);
}

function selectableInput(parentElement) {
    $.jPhoenix.selectableInput(parentElement);
}

function selectAll(parentElement, functionName) {
    $.jPhoenix.selectAll(parentElement, functionName);
}

function getView(pageName) {
    $.jPhoenix.getView(pageName);
}

function attachView(pageName, anchor) {
    $.jPhoenix.attachView(pageName, anchor);
}

function attachViewP(pageName, anchor) {
    $.jPhoenix.attachViewP(pageName, anchor);
}

function attachWindow(pageName, anchor) {
    $.jPhoenix.attachWindow(pageName, anchor);
}

function attachIframe(id, src, anchor) {
    $.jPhoenix.attachIframe(id, src, anchor);
}

function debugLog(message) {
    $.jPhoenix.debugLog(message);
}
function phpJsonDecode(json) {
    return $.jPhoenix.phpJsonDecode(json);
}

