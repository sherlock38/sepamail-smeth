/* ***** BEGIN LICENSE BLOCK *****
 * This file is part of smeth (https://code.google.com/p/sepamail-smeth/)
 *
 * Version: MPL 2.0/GPL 3.0/LGPL 3.0
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/2.0/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Initials Developers of the Original Code are :
 *  Ammit Heeramun, idSoft
 *  Bishan Kumar Madhoo, idSoft
 *  Manfred Sherlock Olm, deciBI & vizGet
 * Portions created by the Initials Developers are Copyright (C) 2012
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *  Ammit Heeramun
 *  Bishan Kumar Madhoo 
 *  Manfred Sherlock Olm, smeth@decibi.fr
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 3 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 3.0 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * @module smeth
 * @file SMETHMessageHandler.js
 * @version 1212
 * @since 1210
 * @author Ammit Heeramun
 * @description TODO
 */

/**
 * items exported from the module
 * @see https://developer.mozilla.org/en-US/docs/JavaScript_code_modules/Using
 */
var EXPORTED_SYMBOLS = ["SMETHMessageHandler"];

/**
 * Strict mode for scripts
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Functions_and_function_scope/Strict_mode
 */
"use strict";

/**
 * SMETHMessageHandler class containg functions to handle info, error, warning and exceptions messages
 * 
 * @class SMETHMessageHandler
 */
SMETHMessageHandler = function(aWindow) {
    this._window = aWindow;
};
 
/**
 * SMETHMessageHandler class methods.
 * 
 * @class SMETHMessageHandler
 */
SMETHMessageHandler.prototype = {
      
    /**
     * The window that we will be the parent of the message displayed
     * 
     * @attribute _window
     * @private
     * @default null
     */
    _window : null,
    
    /**
    * exception function displays the exception message
    *  
    * @method exception
    * @param {Object} anException Exception object to be handled
    */
    exception : function(anException){
        try
        {
            //this._window.alert("Exception : " + anException.message);
            Components.utils.reportError(anException);
        }
        catch(ex)
        {
            //TODO: class for handling exceptions
            Components.utils.reportError(anException);
        }
    },

    /**
    * info function displays the information message
    *  
    * @method info
    * @param {String} anInfo Info message to be displayed
    */
    info : function(anInfo){
        try
        {
            this._window.alert("Info : " + anInfo);
        }
        catch(ex)
        {
            //TODO: class for handling exceptions
            this._window.alert("Exception : " + ex.message);
        }
    }, 

    /**
    * warning function displays the warning message
    *  
    * @method warning
    * @param {String} aWarning Warning message to be displayed
    */
    warning : function(aWarning){
        try
        {
            this._window.alert("Warning : " + aWarning);
        }
        catch(ex)
        {
            //TODO: class for handling exceptions
            this._window.alert("Exception : " + ex.message);
        }
    }, 

    /**
    * error function displays the error message
    *  
    * @method error
    * @param {String} anError Error Message to be displayed
    */
    error : function(anError){
        try
        {
            this._window.alert("Error : " + anError);
        }
        catch(ex)
        {
            //TODO: class for handling exceptions
            this._window.alert("Exception : " + ex.message);
        }
    }
};