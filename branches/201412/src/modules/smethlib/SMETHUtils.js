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
 * @file SMETHUtils.js
 * @version 1212ou
 * @since 1210
 * @author Ammit Heeramun
 * @description some tools for all smeth classes
 */

/**
 * The FileUtils.jsm JavaScript code module offers utility routines dealing with files.
 *
 * @include FileUtils.jsm
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/FileUtils.jsm
 * @type {Object}
 */
Components.utils.import("resource://gre/modules/FileUtils.jsm");

/**
 * The NetUtil.jsm JavaScript code module provides easy-to-use APIs for performing common network related tasks.
 *
 * @include NetUtil.jsm
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/NetUtil.jsm
 * @type {Object}
 */
Components.utils.import("resource://gre/modules/NetUtil.jsm");

/**
 * SMETHMessageHandler class contain functions to handle info, error, warning and exceptions messages
 *
 * @include SMETHMessageHandler.js
 * @type {Object}
 */
Components.utils.import("resource://smeth/smethlib/SMETHMessageHandler.js");

/**
 * items exported from the module
 * @see https://developer.mozilla.org/en-US/docs/JavaScript_code_modules/Using
 * @type {Array}
 */
var EXPORTED_SYMBOLS = ["SMETHUtils"];

/**
 * Strict mode for scripts
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Functions_and_function_scope/Strict_mode
 */
"use strict";

/**
 * SMETHUtils contains all the useful functions that will be used in Smeth
 *
 * @class SMETHUtils
 */
SMETHUtils = function(aWindow) {

    this._window = aWindow;

    /**
     * Message bundle for localised messages
     *
     * @attribute messageBundle
     * @private
     * @default Object
     */
    this.messageBundle = {

        // Initialise internationalisation component
        _bundle: Components.classes["@mozilla.org/intl/stringbundle;1"]
                           .getService(Components.interfaces.nsIStringBundleService)
                           .createBundle("chrome://smeth/locale/smeth.properties"),

        // Get the localised message for the specified key
        getLocalisedMessage: function(key) {
            return this._bundle.GetStringFromName(key);
        }
    };

    this._smethMessageHandler = new SMETHMessageHandler(aWindow);

};

/**
 * SMETHUtils class methods.
 *
 * @class SMETHUtils
 */
SMETHUtils.prototype = {

    /**
     * Declare the smeth preferences class
     *
     * @attribute _smethPreferences
     * @private
     * @see https://developer.mozilla.org/en-US/docs/Code_snippets/Preferences#XPCOM_interfaces_for_preferences_system
     */
    _smethPreferences : Components.classes["@mozilla.org/preferences-service;1"]
                                  .getService(Components.interfaces.nsIPrefService)
                                  .getBranch("extensions.smeth."),

    /**
     * Check if user is allowed to carry out EBICS upload for a given message type
     *
     * @method allowEbicsUpload
     * @param {String} messageType SEPAmail message type
     * @return Whether the user is allowed to upload file via EBICS
     */
    allowEbicsUpload : function(messageType) {

        // Get list of message types for which EBICS file upload is allowed
        var ebicsUpload = JSON.parse(this._smethPreferences.getCharPref('ebics.uploads'));

        // Scan the list of message types
        for (var i = 0; i < ebicsUpload.length; i++) {
            var currentMessageType = ebicsUpload[i];
            if (currentMessageType.type == messageType) {
                return true;
            }
        }

        return false;
    },

    /**
     * checkTodayDate function checks if a date is today's date
     *
     * @method checkTodayDate
     * @param {Date} aDate Object
     * @return {Boolean} true if aDate is today, else false
     * REM MSO 20121210 I prefer method name "isToday" and we can share a method getDateMidnight
     */
    checkTodayDate : function(aDate){

        try
        {
            // Create date from input value
            var inputDate = new this._window.Date(aDate);

            // Get today's date
            // We could use method now()
            var todaysDate = new this._window.Date();

            // call setHours to take the time out of the comparison
            todaysDate.setHours(0,0,0,0);
            inputDate.setHours(0,0,0,0);

            if (todaysDate.valueOf() == inputDate.valueOf()) {
                return true;
            } else {
            	return false;
            }

        } catch(ex) {
            throw ex;
        }
    },

    /**
     * Format a given date object in a SEPAmail date and time format
     *
     * @method formatDateForSEPAmail
     * @param {Date} date The date that needs to be formatted for a SEPAmail message
     * @return {String} Current date and time value in a SEPAmail valid format
     */
    formatDateForSEPAmail : function(date) {

        // Formatted date and time value
        return date.getFullYear() + '-' +
            ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' +
            (date.getDate() > 9 ? date.getDate() : ('0' + date.getDate())) + 'T' +
            (date.getHours() > 9 ? date.getHours() : ('0' + date.getHours())) + ':' +
            (date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes())) + ':' +
            (date.getSeconds() > 9 ? date.getSeconds() : ('0' + date.getSeconds()));
    },

    /**
     * Freeze the given SEPAmail UI form to disable user interaction
     *
     * @method freezeContent
     * @param {XML} content XUL fragment which contains the SMETH UI
     */
    freezeContent : function(content) {

        // Make all textboxes read-only
        var textboxes = content.getElementsByTagNameNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
            "textbox");
        for (var i = 0; i < textboxes.length; i++) {
            textboxes[i].readOnly = true;
        }

        // Disable all buttons
        var buttons = content.getElementsByTagNameNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
            "button");
        for (var j = 0; j < buttons.length; j++) {
            buttons[j].disabled = true;
        }

        // Make all list boxes read-only
        var listboxes = content.getElementsByTagNameNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
            "listbox");
        for (var k = 0; k < listboxes.length; k++) {
            listboxes[k].readOnly = true;
        }

        // Make all date pickers read-only
        var datepickers = content.getElementsByTagNameNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
            "datepicker");
        for (var l = 0; l < datepickers.length; l++) {
            datepickers[l].readOnly = true;
        }
    },

    /**
     * generateMessageId generates a unique message ID
     *
     * @method generateMessageId
     */
    generateMessageId : function() {

        // UUID generator instance
        var uuidGenerator = Components.classes["@mozilla.org/uuid-generator;1"]
                                      .getService(Components.interfaces.nsIUUIDGenerator);

        return (uuidGenerator.generateUUID().toString().replace(/-/g, "")).substring(1, 33).toUpperCase();
    },

    /**
     * getAccountByFolder matches an email account to a given folder
     *
     * @method getAccountByFolder
     * @param {Object} aFolder Folder object
     * @return {Object} Account object
     */
    getAccountByFolder : function(aFolder) {

        try {

            // Check if the folder object has been defined
            if (aFolder != null) {

                // Account manager interface instance
                var accountManager = Components.classes["@mozilla.org/messenger/account-manager;1"]
                                               .getService(Components.interfaces.nsIMsgAccountManager);

                // List of registered accounts
                var accounts = accountManager.accounts;

                // Scan the list of accounts
                for (var i = 0; i < accounts.Count(); i++) {

                    // Current account
                    var currentAccount = accounts.QueryElementAt(i, Components.interfaces.nsIMsgAccount);

                    // Check if folder has the incomingServer property
                    if (currentAccount.incomingServer != undefined) {

                        // Current account root folder
                        var rootFolder = currentAccount.incomingServer.rootFolder;

                        // Check if the root folder has sub-folders
                        if (rootFolder.hasSubFolders) {

                            // List of sub-folders
                            var subfolders = rootFolder.subFolders;

                            // Scan the list of sub-folders and try to match the folder with the give folder
                            while (subfolders.hasMoreElements()) {

                                // Check if the folders match
                                if (subfolders.getNext().QueryInterface(Components.interfaces.nsIMsgFolder)
                                    == aFolder) {
                                    return currentAccount;
                                }
                            }
                        }

                        // Check if the root folder matches the given folder
                        if (rootFolder == aFolder) {
                            return currentAccount;
                        }
                    }
                }
            }

            // No matching account could be found
            return null;

        } catch (ex) {
            throw ex;
        }
    },

    /**
     * Get the account on which the email corresponding to the specified header was obtained
     *
     * @method getAccountByMsgHeader
     * @param {Object} aMsgHdr Message header
     * @return Get account on which the header of the corresponding email was obtained
     * @see https://developer.mozilla.org/en-US/docs/Thunderbird/Account_interfaces
     * @see https://developer.mozilla.org/en-US/docs/Thunderbird/Account_examples
     */
    getAccountByMsgHeader : function(aMsgHdr) {

        // Obtain the accounted related to the message by using the folder in which the current message resides
        return this.getAccountByFolder(aMsgHdr.folder);
    },

    /**
     * Get the XSL file name for managing attachments when composing a given message type
     *
     * @method getCompositionAttachmentTransformationForMessageType
     * @param {String} messageType Message type
     * @return {String} XSL file name for managing attachments when composing given message type
     */
    getCompositionAttachmentTransformationForMessageType : function(messageType) {

        // Controller configuration
        var config = JSON.parse(this._smethPreferences.getCharPref('controller.config'));

        // Scan the list of settings
        for (var i = 0; i < config.length; i++) {

            // Check if we are at the required message type
            if (config[i].type == messageType) {
                if (config[i].settings.attachment.trim().length > 0) {
                    return "chrome://{appname}/content/xsl/" + config[i].settings.attachment.trim();
                } else {
                    return null;
                }
            }
        }

        return null;
    },

    /**
     * Get the XSL file name for composing a given message type
     *
     * @method getCompositionTransformationForMessageType
     * @param {String} messageType Message type
     * @return {String} XSL file name for composing given message type
     */
    getCompositionTransformationForMessageType : function(messageType) {

        // Controller configuration
        var config = JSON.parse(this._smethPreferences.getCharPref('controller.config'));

        // Scan the list of settings
        for (var i = 0; i < config.length; i++) {

            // Check if we are at the required message type
            if (config[i].type == messageType) {
                if (config[i].settings.composition.trim().length > 0) {
                    return "chrome://{appname}/content/xsl/" + config[i].settings.composition.trim();
                } else {
                    return null;
                }
            }
        }

        return null;
    },

    /**
     * getControllerConfigObject function get the controllers config object as per the message type
     *
     * @method getControllerConfigObject
     * @param {String} aMessageType
     * @return {Object} Controller config object or null
     * REM MSO 20121210 if controllerConfigObject is an object, loop "for" is inappropriate
     * TODO rewrite this, dirty
     */
    getControllerConfigObject : function(aMessageType) {

        try {
            // Register to receive notifications of preference changes
            var smethPreferences = Components.classes["@mozilla.org/preferences-service;1"]
                                    .getService(Components.interfaces.nsIPrefService)
                                    .getBranch("extensions.smeth.");

            smethPreferences.QueryInterface(Components.interfaces.nsIPrefBranch2);

            var controllerConfigObject = JSON.parse(smethPreferences.getCharPref("controller.config"));

            for(var i = 0; i < controllerConfigObject.length; i++)
            {
                if(aMessageType == controllerConfigObject[i].type)
                {
                    return controllerConfigObject[i];
                }
                else {}
            }

            return null;
        }
        catch(ex)
        {
            throw ex;
        }
    },

    /**
     * Get the EBICS file format associated with a given SEPAmail message type
     *
     * @method getEBICSFileFormat
     * @param {String} messageType SEPAmail message type
     * @return EBICS file format
     */
    getEBICSFileFormat : function(messageType) {

        // Get list of message types for which EBICS file upload is allowed
        var ebicsUpload = JSON.parse(this._smethPreferences.getCharPref('ebics.uploads'));

        // Scan the list of message types
        for (var i = 0; i < ebicsUpload.length; i++) {
            var currentMessageType = ebicsUpload[i];
            if (currentMessageType.type == messageType) {
                return currentMessageType.format;
            }
        }

        return null;
    },

    /**
     * getFile function opens the file picker, allows the user to select a file and returns a file object corresponding
     * to the user selection
     *
     * @method getFile
     * @param {String} title The title of the Open File dialog box
     * @return {Object} The file object corresponding to the user selected file
     */
    getFile : function(title) {

        try {

            // Instantiate the nsIFilePicker
            const nsIFilePicker = Components.interfaces.nsIFilePicker;

            // File picker instance
            var fp = Components.classes["@mozilla.org/filepicker;1"]
                               .createInstance(nsIFilePicker);
            fp.init(this._window, title , nsIFilePicker.modeOpen);

            // Show the file picker
            var rv = fp.show();

            // Check if user has chosen a file to attach
            if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {

                // Check if file exists
                if (false == fp.file.exists()) {
                    throw new Error("File could not be found.");
                }

                return fp.file;
            }

            return null

        } catch(ex) {
            throw(ex);
        }
    },

    /**
     * Get the type of a given message folder
     *
     * @method getFolderType
     * @param {Object} folder Current message folder
     * @return Message folder type
     */
    getFolderType : function(folder) {

        // Get the base message URI parts
        var baseMessageUriParts = folder.displayedFolder.baseMessageURI.split("/");

        return baseMessageUriParts[baseMessageUriParts.length - 1].toUpperCase();
    },

    /**
     * Get the Thunderbird mail account that corresponds to a give mail account alias - an alias can be the name
     * displayed for the mail account or the mail account name itself
     *
     * @method getMailAccountByAlias
     * @param {String} alias Mail account alias
     * @return Thunderbird mail account corresponding to the given alias
     */
    getMailAccountByAlias : function(alias) {

        // Account manager interface instance
        var accountManager = Components.classes["@mozilla.org/messenger/account-manager;1"]
                                       .getService(Components.interfaces.nsIMsgAccountManager);

        // List of registered accounts
        var accounts = accountManager.accounts;

        // Scan the list of accounts
        for (var i = 0; i < accounts.Count(); i++) {

            // Current account
            var currentAccount = accounts.QueryElementAt(i, Components.interfaces.nsIMsgAccount);

            // Check if the defaultIdentity property has been defined the current account
            if (currentAccount.defaultIdentity != undefined) {

                // Check the email address associated with the current account
                if ((currentAccount.defaultIdentity.email.trim().toLowerCase() == alias.trim().toLowerCase()) ||
                    (alias.trim().toLowerCase().indexOf('<' + currentAccount.defaultIdentity.email.trim().toLowerCase()
                        + '>') > -1)) {
                    return currentAccount;
                }
            }
        }

        return null;
    },

    /**
     * getMailBody recursive function get the message body from the message content parts parametered
     *
     * @method getMailBody
     * @param {Object} aMessageParts Object
     * @param {String} displayedMessage Message string being displayed in the message pane
     * @return {String} Message body String
     */
    getMailBody : function (aMessageParts, displayedMessage) {

        try {

            if (!aMessageParts) {

                // If the part contains a body
                if(aMessageParts.body) {

                    // Return the body
                    return aMessageParts.body;

                } else {

                    // Call the getMessageBody function again
                    return this.getMailBody(aMessageParts.parts[0], displayedMessage);
                }

            } else {
                return displayedMessage;
            }

        } catch(ex) {
            throw ex;
        }
    },

    /**
     * getMailContentFromParts recursively gets the message body from the given message content parts
     *
     * @method getMailContentFromParts
     * @param {Object} aMessagePart Message content parts
     * @param {String} defaultMessage Message string that is returned when mail content could not be determined from the given parts
     * @return {String} Message body String
     */
    getMailContentFromParts : function(aMessagePart, defaultMessage) {

        try {

            // Check if message part has been defined
            if (aMessagePart != undefined) {

                // Check if we have a body at the current message part node
                if (aMessagePart.body != undefined) {

                    // Return the body of the message
                    return aMessagePart.body;

                } else {

                    // Check if there are more parts in the current part
                    if (aMessagePart.parts != undefined) {

                        // Check the length of the message parts
                        if (aMessagePart.parts.length > 0) {

                            // Call the function again with the new sub-part
                            return this.getMailContentFromParts(aMessagePart.parts[0], defaultMessage);

                        } else {

                            // Return default message since message part is defined but does not contain any element
                            return defaultMessage;
                        }

                    } else {

                        // Return default message since message part and body is not defined
                        return defaultMessage;
                    }
                }

            } else {

                // Return default message since message part does not exist
                return defaultMessage;
            }

        } catch(ex) {
            throw ex;
        }
    },

    /**
     * Get the message expiry duration
     *
     * @method getMessageExpiryDuration
     * @return {Object} Message expiry duration
     */
    getMessageExpiryDuration : function() {

        // Get user defined message expiry duration string
        var durationStr = this._smethPreferences.getCharPref("expiryDuration");

        // Check if expiry duration has been specified
        if (durationStr.length > 1) {

            var intPart = '';
            var strPart = '';
            var duration = {years: 0, months: 0, days: 0};

            // Try to parse the given duration string
            for (var i = 0; i < durationStr.length; i++) {

                // Check if the current character is a number
                if (isNaN(durationStr.charAt(i))) {

                    // Get the period definition character
                    strPart = durationStr.charAt(i).toLowerCase();

                    // Action based on period definition character
                    switch(strPart) {

                        case 'y':

                            // Set the number of years in the expiry duration object
                            duration.years = parseInt(intPart, 10);

                            break;

                        case 'm':

                            // Set the number of months in the expiry duration object
                            duration.months = parseInt(intPart, 10);

                            break;

                        case 'd':

                            // Set the number of days in the expiry duration object
                            duration.days = parseInt(intPart, 10);

                            break;

                        default:

                            // Return default duration since an invalid duration character was found
                            return {years: 0, months: 1, days: 0};
                    }

                    // Check if we are at the end of the duration string
                    if (i == (durationStr.length - 1)) {
                        return duration;
                    } else {
                        intPart = '';
                        strPart = '';
                    }

                } else {

                    // Concatenate the integer part
                    intPart += durationStr.charAt(i);
                }
            }
        }

        // Default message expiry duration
        return {years: 0, months: 1, days: 0};
    },

    /**
     * Check if a given message type has attachments
     *
     * @method getMessageTypeHasAttachments
     * @param {String} messageType Message type
     * @return {boolean} Whether the given message type has attachments
     */
    getMessageTypeHasAttachments : function(messageType) {

        // Controller configuration
        var config = JSON.parse(this._smethPreferences.getCharPref('controller.config'));

        // Scan the list of settings
        for (var i = 0; i < config.length; i++) {

            // Check if we are at the required message type
            if (config[i].type == messageType) {
                return config[i].settings.hasAttachments;
            }
        }

        return false;
    },

    /**
     * Get the mode associated to a given message type - defaults to test is message type cannot be found in the
     * configuration settings for ecosystems
     *
     * @method getMessageTypeMode
     * @param {String} messageType SEPAmail message type for which mode needs to be determined
     * @return Mode for given message type
     */
    getMessageTypeMode : function(messageType) {

        // Ecosystem settings
        var ecosystemSettings = JSON.parse(this._smethPreferences.getCharPref('ecosystems'));

        // Traverse the list of ecosystem settings objects and find the required message type
        for (var i = 0; i < ecosystemSettings.length; i++) {

            // Traverse the list of messages for the current ecosystem settings
            for (var j = 0; j < ecosystemSettings[i].messages.length; j++) {

                // Check if we are at the required message type
                if (ecosystemSettings[i].messages[j] == messageType) {

                    // Get the mode
                    return ecosystemSettings[i].mode;
                }
            }
        }

        return 'test';
    },

    /**
     * Get the email account key to QXBAN association object
     *
     * @method getQxbanByEmailAddressAccount
     * @param {Object} account Account for which association object is required
     * @return {String} Email address account to QXBAN association object
     */
    getQxbanByEmailAddressAccount : function(account) {

        var qxbanConfig = JSON.parse(this._smethPreferences.getCharPref("myqxbans"));

        // Scan the array of email address account to QXBAN association objects
        for (var i = 0; i < qxbanConfig.length; i++) {

            // Current association object
            var currentItem = qxbanConfig[i];

            // Check if we have the required object
            if (currentItem.account == account) {

                // Check if QXBAN has been defined for the account
                if (currentItem.qxban.trim().length > 0) {
                    return currentItem;
                } else {
                    break;
                }
            }
        }

        return null;
    },

    /**
     * Get the QXBAN of a specified email address from the array of email address to QXBAN objects
     *
     * @method getReceiverQxbanByEmailAddress
     * @param {String} email Email address
     * @return {Object} QXBAN of email address in the array of email addresses to QXBAN objects
     */
    getReceiverQxbanByEmailAddress : function(email) {

        // Regular expression for retrieving email address
        var emailRegEx = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

        // Retrieve the email address from the given email string
        var emailAddressMatches = email.match(emailRegEx);

        // Check if a match for the email address was found
        if (emailAddressMatches != null) {

            // Get address book manager instance
            var abManager = Components.classes["@mozilla.org/abmanager;1"]
                                      .getService(Components.interfaces.nsIAbManager);

            // Directories of the address book
            var directories = abManager.directories;

            // Scan the directories
            while (directories.hasMoreElements()) {

                // Current address book directory
                var currentDirectory = directories.getNext().QueryInterface(Components.interfaces.nsIAbDirectory);

                // Check the current directory instance
                if (currentDirectory instanceof Components.interfaces.nsIAbDirectory) {

                    // Find the contact card with the given email address
                    var card = currentDirectory.cardForEmailAddress(emailAddressMatches[0]);

                    // Check if a card was found
                    if (card != null) {

                        // Return the SEPAmail account of the receiver
                        return card.getProperty("SMETHSEPAmailAccount", '').trim().length > 0 ?
                            {qxban : card.getProperty("SMETHSEPAmailAccount", '').trim()} : null;
                    }
                }
            }
        }

        // Item could not be found
        return null;
    },

    /**
     * Get the SEPAmail message root node type for a given SEPAmail message string
     *
     * @method getSEPAmailMessageRootNodeType
     * @param @param {String} content Content of email
     * @return {String} SEPAmail message root node type
     */
    getSEPAmailMessageRootNodeType : function(content) {

        // Check if content has been defined
        if (content != null) {

            try {

                // DOM parser
                var parser = Components.classes["@mozilla.org/xmlextras/domparser;1"]
                                       .createInstance(Components.interfaces.nsIDOMParser);

                // Parse content to XML document object model
                var contentXmlDom = parser.parseFromString(content, "text/xml");

                // Check if content is a valid XML
                if (contentXmlDom.documentElement.nodeName != "parsererror") {

                    // Valid SEPAmail message root node types
                    var rootNodes = this._smethPreferences.getCharPref("prefSEPAmailXMLTag").split(";");

                    // Scan the list of valid XML root node tags
                    for (var i = 0; i < rootNodes.length; i++) {

                        // Content is valid XML, so we check if the message is a valid SEPAmail XML
                        var msgTypeNodeResult = contentXmlDom.evaluate(rootNodes[i], contentXmlDom, this.nsResolver,
                            9, null);

                        // Check if result for query was obtained
                        if (msgTypeNodeResult != null) {

                            // Check SEPAmail root node was obtained
                            if (msgTypeNodeResult.singleNodeValue != null) {
                                return rootNodes[i].split(':')[1].toLowerCase();
                            }
                        }
                    }
                }

            } catch (e) {
                throw e;
            }
        }

        return null;
    },

    /**
     * Get the SEPAmail message type for a given SEPAmail XML document object model
     *
     * @method getSEPAmailMessageType
     * @param {XML} sepaMailXmlDom SEPAmail XML document object model
     * @return {String} SEPAmail message type
     */
    getSEPAmailMessageType : function(sepaMailXmlDom) {

        // SEPAmail message type node
        var msgTypeNodeResult = sepaMailXmlDom.evaluate(this._smethPreferences.getCharPref("missive.prefMsgTypXpath"),
            sepaMailXmlDom, this.nsResolver, 9, null);

        // Check if SEPAmail message type node query returned a result
        if (msgTypeNodeResult != null) {

            // Check if the SEPAmail message type node was found
            if (msgTypeNodeResult.singleNodeValue != null) {

                return msgTypeNodeResult.singleNodeValue.textContent;

            } else {

                // SEPAmail message type node was not found - we could be handling a SEPAmail acknowledgement
                return '';
            }

        } else {

            // SEPAmail message type could not be determine
            return '';
        }
    },

    /**
     * Get the XML template file name for a given message type
     *
     * @method getTemplateForMessageType
     * @param {String} messageType Message type
     * @return {String} XML template file name for given message type
     */
    getTemplateForMessageType : function(messageType) {

        // Controller configuration
        var config = JSON.parse(this._smethPreferences.getCharPref('controller.config'));

        // Scan the list of settings
        for (var i = 0; i < config.length; i++) {

            // Check if we are at the required message type
            if (config[i].type == messageType) {
                if (config[i].settings.template.trim().length > 0) {
                    return "chrome://{appname}/content/xml/" + config[i].settings.template.trim();
                } else {
                    return null;
                }
            }
        }

        return null;
    },

    /**
     * Check if the content of a body contains a valid acknowledgement missive message
     *
     * @method isAcknowledgementMissiveMessage
     * @param {String} content Message content
     * @return {Boolean} Whether the message is a valid acknowledgement missive message
     */
    isAcknowledgementMissiveMessage : function(content) {

        try {

            // Parse content to XML document object model
            var contentXmlDom = new DOMParser().parseFromString(content, "text/xml");

            // Check if content is a valid XML
            if (contentXmlDom.documentElement.nodeName != "parsererror") {

                // Content is valid XML, so we check for message type
                var msgTypeNodeResult = contentXmlDom.evaluate("/sem:Missive/sem:sepamail_missive_001/sem:MsvTyp",
                    contentXmlDom, this.nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

                // Check if result for message type query was obtained
                if (msgTypeNodeResult != null) {

                    // Check the message type
                    if (msgTypeNodeResult.singleNodeValue.textContent == 'Acquittement') {
                        return true;
                    }
                }
            }

            return false;

        } catch (e) {
            this._smethMessageHandler.exception(e);
        }
    },

    /**
     * Check if the content of an email is a SEPAmail message
     *
     * @method isSEPAmail
     * @param {String} content Content of email
     * @return {Boolean} Whether the content is a valid SEPAmail message
     */
    isSEPAmail : function(content) {

        // Check if content has been defined
        if (content != null) {

            // Check for XML declaration
            if (content.indexOf('<?xml version="1.0" encoding="UTF-8"?>') == 0) {

                try {

                    // DOM parser
                    var parser = Components.classes["@mozilla.org/xmlextras/domparser;1"]
                                           .createInstance(Components.interfaces.nsIDOMParser);

                    // Parse content to XML document object model
                    var contentXmlDom = parser.parseFromString(content, "application/xml");

                    // Check if content is a valid XML
                    if (contentXmlDom.documentElement.nodeName != "parsererror") {

                        // Valid SEPAmail message root node types
                        var rootNodes = this._smethPreferences.getCharPref("prefSEPAmailXMLTag").split(";");

                        // Scan the list of valid XML root node tags
                        for (var i = 0; i < rootNodes.length; i++) {

                            // Content is valid XML, so we check if the message is a valid SEPAmail XML
                            var msgTypeNodeResult = contentXmlDom.evaluate(rootNodes[i], contentXmlDom, this.nsResolver,
                                9, null);

                            // Check if result for query was obtained
                            if (msgTypeNodeResult != null) {

                                // Check SEPAmail root node was obtained
                                if (msgTypeNodeResult.singleNodeValue != null) {
                                    return true;
                                }
                            }
                        }
                    }

                } catch (e) {
                    throw e;
                }
            }
        }

        return false;
    },

    /**
     * Get the URI associated with a given prefix
     *
     * @method nsResolver
     * @param {String} prefix Namespace prefix
     * @return {String} URI associated with the given prefix
     */
    nsResolver : function(prefix) {

        // Namespace prefix mapping object
        var ns = {
            'p09' : 'urn:iso:std:iso:20022:tech:xsd:pain.009.001.01',
            'p012' : 'urn:iso:std:iso:20022:tech:xsd:pain.012.001.01',
            'pain013' : 'urn:iso:std:iso:20022:tech:xsd:pain.013.001.01',
            'pain014' : 'urn:iso:std:iso:20022:tech:xsd:pain.014.001.01',
            'sem' : 'http://www.sepamail.eu/xsd/bleedingEdge',
            'xsi' : 'http://www.w3.org/2001/XMLSchema-instance'
        };

        // Get the namespace URI for the given prefix
        return ns[prefix] || null;
    },

    /**
     * openComposeWindow function opens a compose window based on the parametered content
     *
     * @method openComposeWindow
     * @param {String} aContent
     * @param {Object} account Account Object
     * @param {Object} aHeader Header object to reply to or null for a new mail
     * @param {String} defaultSubject The default subject of a SEPAmail message
     */
    openComposeWindow : function(aContent, account, aHeader, defaultSubject) {

        try {

            // Compose service fields instance
            var composeFields = Components.classes["@mozilla.org/messengercompose/composefields;1"]
                                          .createInstance(Components.interfaces.nsIMsgCompFields);

            composeFields.body = aContent;
            composeFields.characterSet = "UTF-8";
            composeFields.from = account.defaultIdentity.email;

            if (null != aHeader) {
                composeFields.messageId = aHeader.messageId;
                // REM MSO why not mime2DecodedSubject ?
                if (aHeader.subject == defaultSubject) {
                    composeFields.subject = '';
                } else {
                    composeFields.subject = aHeader.subject;
                }
                // REM MSO explain mime2DecodedAuthor
                composeFields.to = aHeader.mime2DecodedAuthor;
            }

            // Message compose parameters instance
            var msgComposeParams = Components.classes["@mozilla.org/messengercompose/composeparams;1"]
                                             .createInstance(Components.interfaces.nsIMsgComposeParams);

            // Define the message composition parameters
            msgComposeParams.composeFields = composeFields;
            msgComposeParams.identity = account.defaultIdentity;
            msgComposeParams.format = Components.interfaces.nsIMsgCompFormat.PlainText
            msgComposeParams.type = Components.interfaces.nsIMsgCompType.New;

            // Message compose service
            var msgComposeService = Components.classes["@mozilla.org/messengercompose;1"]
                                              .getService(Components.interfaces.nsIMsgComposeService);

            // Remove vCards and signatures from missive email
            this.removeEmailExtras(msgComposeService);

            // Open the message composition window
            msgComposeService.OpenComposeWindowWithParams(null, msgComposeParams);

        } catch (ex) {
            throw ex;
        }
    },

    /**
     * populateQXBAN function populates the XML Object with sender and receiver QXBAN
     *
     * @method populateQXBAN
     * @param {Object} aMsgCompose Message compose object
     * @param {Object} aDocument Document containing the compose message body
     * @param {Object} xmlContent XML DOM containing SEPAmail message
     */
    populateQXBAN : function(aMsgCompose, aDocument, xmlContent) {

        try {

            var accountMenuItems = aDocument.getElementById("msgIdentityPopup").
                getElementsByTagNameNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "menuitem");

            var accountKey;

            for (var i = 0; i < accountMenuItems.length; i++) {

                if (accountMenuItems[i].selected) {
                    accountKey = accountMenuItems[i].getAttribute("accountkey");
                    break;
                }
            }

            if (accountKey != undefined) {

                var myQXBAN = this.getQxbanByEmailAddressAccount(accountKey);
                var receiverAccount = this.getMailAccountByAlias(aMsgCompose.compFields.to);
                var receiverQXBAN = receiverAccount == null ?
                    this.getReceiverQxbanByEmailAddress(aMsgCompose.compFields.to) :
                    this.getQxbanByEmailAddressAccount(receiverAccount.key);

                // Check if the SEPAmail account of the sender was obtained
                if (myQXBAN == null) {
                    this.showAlert('SMETH', this.messageBundle.getLocalisedMessage('qxban.sender.undefined'));
                    return false;
                }

                if (receiverQXBAN == null) {
                    this.showAlert('SMETH', this.messageBundle.getLocalisedMessage('qxban.receiver.undefined'));
                    return false;
                }

                // Set the sender IBAN value
                this.setNodeValue(xmlContent, "/sem:Missive/sem:sepamail_missive_001/sem:MsvHdr/sem:Snd/sem:IBAN",
                    myQXBAN.qxban);

                // Set the receiver IBAN value
                this.setNodeValue(xmlContent, "/sem:Missive/sem:sepamail_missive_001/sem:MsvHdr/sem:Rcv/sem:IBAN",
                    receiverQXBAN.qxban);

                return true;

            } else {
                throw new Error("No account was detected");
            }

        } catch(ex) {
            throw ex;
        }
    },

    /**
     * Remove extra's such as email signature or vCards from message compose service
     *
     * @method removeEmailExtras
     * @param {Object} msgComposeService Message compose service
     */
    removeEmailExtras : function(msgComposeService) {

        // Remove signature and VCard from default identity
        if (msgComposeService.defaultIdentity != undefined) {
            msgComposeService.defaultIdentity.attachSignature = false;
            msgComposeService.defaultIdentity.attachVCard = false;
        }

        // Remove signature and VCard from identity
        if (msgComposeService.identity != undefined) {
            msgComposeService.identity.attachSignature = false;
            msgComposeService.identity.attachVCard = false;
        }
    },

    /**
     * Save a file to local storage
     *
     * @method saveEmlToFile
     * @param {String} filename Name of the file
     * @param {String} content File content
     */
    saveEmlToFile : function(filename, content) {

        // Obtain the location at which the file needs to be saved
        const nsIFilePicker = Components.interfaces.nsIFilePicker;

        // File picker instance
        var fp = Components.classes["@mozilla.org/filepicker;1"]
                           .createInstance(nsIFilePicker);
        fp.init(this._window, "Save file " + filename, nsIFilePicker.modeSave);
        fp.defaultString = filename;

        // Show the file picker
        var rv = fp.show();

        // Check if user has chosen an attachment file location
        if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {

            try {

                // File to which content needs to be written
                var file = fp.file;

                // Stream for writing to text file
                var ostream = FileUtils.openSafeFileOutputStream(file)

                // UTF-8 convertor
                var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
                                          .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
                converter.charset = "UTF-8";

                // Get the UTF-8 version of the XML file content
                var istream = converter.convertToInputStream(content);

                // Write content to file
                NetUtil.asyncCopy(istream, ostream);

            } catch (e) {
                throw e;
            }
        }
    },

    /**
     * Save a file to local storage
     *
     * @method saveToFile
     * @param {String} filename Name of the file
     * @param {String} content File content
     */
    saveToFile : function(filename, content) {

        // Obtain the location at which the file needs to be saved
        const nsIFilePicker = Components.interfaces.nsIFilePicker;

        // File picker instance
        var fp = Components.classes["@mozilla.org/filepicker;1"]
                           .createInstance(nsIFilePicker);
        fp.init(this._window, "Save file " + filename, nsIFilePicker.modeSave);
        fp.defaultString = filename;

        // Show the file picker
        var rv = fp.show();

        // Check if user has chosen an attachment file location
        if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {

            try {

                // File to which content needs to be written
                var file = fp.file;

                // Decode the content
                var decodedContent = this._window.atob(content);

                // Stream for writing binary file
                var stream = Components.classes["@mozilla.org/network/safe-file-output-stream;1"]
                                       .createInstance(Components.interfaces.nsIFileOutputStream);
                stream.init(file, 0x04 | 0x08 | 0x20, 0600, 0);
                stream.write(decodedContent, decodedContent.length);

                // Close the stream
                if (stream instanceof Components.interfaces.nsISafeOutputStream) {
                    stream.finish();
                } else {
                    stream.close();
                }

            } catch (e) {
                throw e;
            }
        }
    },

    /**
     * Save a file to local storage
     *
     * @method saveToFile
     * @param {String} filename Name of the file
     * @param {String} content File content
     */
    saveXmlToFile : function(filename, content) {

        // Obtain the location at which the file needs to be saved
        const nsIFilePicker = Components.interfaces.nsIFilePicker;

        // File picker instance
        var fp = Components.classes["@mozilla.org/filepicker;1"]
                           .createInstance(nsIFilePicker);
        fp.init(this._window, "Save file " + filename, nsIFilePicker.modeSave);
        fp.defaultString = filename;

        // Show the file picker
        var rv = fp.show();

        // Check if user has chosen an attachment file location
        if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {

            try {

                // File to which content needs to be written
                var file = fp.file;

                // Stream for writing to text file
                var ostream = FileUtils.openSafeFileOutputStream(file)

                // UTF-8 convertor
                var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
                                          .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
                converter.charset = "UTF-8";

                // Get the UTF-8 version of the XML file content
                var istream = converter.convertToInputStream('<?xml version="1.0" encoding="UTF-8"?>\n' + content);

                // Write content to file
                NetUtil.asyncCopy(istream, ostream);

            } catch (e) {
                throw e;
            }
        }
    },

    /**
     * setMessageExpiry sets the validy of the missive message
     *
     * @method setMessageExpiry
     * @param {Object} xmlContent XML DOM containing the missive message
     */
    setMessageExpiry : function(xmlContent) {

        // Message expiry container
        var expiryContainerNode = xmlContent.evaluate("/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgHdr",
            xmlContent, this.nsResolver, 9, null);

        // Check if a message expiry tag exists within the current message
        var msgExpiryNode = xmlContent.getElementsByTagName("sem:MsgExpiry");

        try {

            // Remove the message expiry node from the container
            while (msgExpiryNode[0] != null) {
                expiryContainerNode.singleNodeValue.removeChild(msgExpiryNode[0]);
            }

            // Check if we need to append message expiry to the message being sent
            if (this._smethPreferences.getBoolPref('hasExpiry')) {

                // Get the message expiry duration object
                var expiryDuration = this.getMessageExpiryDuration();

                // Initialise expiry date to now
                var expiryDate = new this._window.Date();

                // Calculate the message expiry date and time
                expiryDate.setFullYear(expiryDate.getFullYear() + expiryDuration.years,
                    expiryDate.getMonth() + expiryDuration.months, expiryDate.getDate() + expiryDuration.days);

                // New element for MsgExpiry node
                var expiryNode = xmlContent.createElement('sem:MsgExpiry');

                // Set the "MsgExpiry" value
                expiryNode.textContent = this.formatDateForSEPAmail(expiryDate);

                // Append the message expiry node to the message
                expiryContainerNode.singleNodeValue.appendChild(expiryNode);
            }

        } catch(ex) {
            this._smethMessageHandler.exception(ex);
        }
    },

    /**
     * setMessageId sets the ID of a message by using the UUID generator of Thunderbird
     *
     * @method setMessageId
     * @param {Object} xmlContent XML DOM for missive content
     */
    setMessageId : function (xmlContent) {

        // Set the "MsgId" value
        this.setNodeValue(xmlContent,
            "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgHdr/sem:MsgId",
            this.generateMessageId());
    },

    /**
     * setMissiveId sets the ID of a missive by using the UUID generator of Thunderbird
     *
     * @method setMissiveId
     * @param {Object} xmlContent XML DOM for missive content
     */
    setMissiveId : function(xmlContent) {

        // UUID generator instance
        var uuidGenerator = Components.classes["@mozilla.org/uuid-generator;1"]
                                      .getService(Components.interfaces.nsIUUIDGenerator);

        // Set the "MsvId" value
        this.setNodeValue(xmlContent, "/sem:Missive/sem:sepamail_missive_001/sem:MsvId",
            ((uuidGenerator.generateUUID().toString().replace(/-/g, "")).substring(1, 17)).toUpperCase());
    },

    /**
     * Set the text value of a node in a given xml doc
     *
     * @method setNodeAttribute
     * @param {XML} anXMLDoc RequestXML Document
     * @param {String} anXpath Node Xpath
     * @param {String} anAttribute Node attribute
     * @param {String} anAttributeValue Node attribute value
     */
    setNodeAttribute : function(anXMLDoc, anXpath, anAttribute, anAttributeValue) {

        // Get the specific node
        var node = anXMLDoc.evaluate(anXpath, anXMLDoc, this.nsResolver, 9, null);

        node.singleNodeValue.setAttribute(anAttribute, anAttributeValue);
    },

    /**
     * Set the text value of a node in a given xml doc
     *
     * @method setNodeValue
     * @param {XML} anXMLDoc RequestXML Document
     * @param {String} anXpath  Node Xpath
     * @param {String} aValue   Node Value
     */
    setNodeValue : function(anXMLDoc, anXpath, aValue) {

        // Get the specific node
        var node = anXMLDoc.evaluate(anXpath, anXMLDoc, this.nsResolver, 9, null);

        node.singleNodeValue.textContent = aValue;
    },

    /**
     * setSendDateTime sets the date and time at which a SEPAmail message was sent
     *
     * @method setSendDateTime
     * @param {Object} xmlContent XML DOM containing the missive message
     */
    setSendDateTime : function(xmlContent) {

        // Set the "SndDtTm" value
        this.setNodeValue(xmlContent, "/sem:Missive/sem:sepamail_missive_001/sem:MsvHdr/sem:SndDtTm",
            this.formatDateForSEPAmail(new this._window.Date()));
    },

    /**
     * Display an alert with the given title and message
     *
     * @method showAlert
     * @param {String} title The title of the alert
     * @param {String} message The message of the alert
     */
    showAlert : function(title, message) {

        // Prompt service instance
        var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                      .getService(Components.interfaces.nsIPromptService);

        // Display alert with given title and message
        promptService.alert(null, title, message);
    },

    /**
     * transformXMLDocument function transforms a XML document using a XSL file URL
     *
     * @method transformXMLDocument
     * @param {XML} anXML XML doucmnet to be transformed
     * @param {String} anXSLUrl XSL Style sheet url which will be use for transformation
     * @return {XML} Transformed XML document
     * @see https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIXSLTProcessor
     * REM MSO 20121210 try not to use xmlHttpRequest, vulnerability (TODO)
     */
    transformXMLDocument : function (anXML, anXSLUrl) {

        try
        {
            // Declare the XMLHttpRequest to load the XSL
            var xmlHttpRequest = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"]
                                 .createInstance();

            // Send request for the XSL document
            xmlHttpRequest.open('GET', anXSLUrl, false);
            xmlHttpRequest.send();

            // Get the XSL document object
            var xslDocument = xmlHttpRequest.responseXML;

            // Instantiate the XSLT Processor
            // @see https://developer.mozilla.org/en-US/docs/Using_the_Mozilla_JavaScript_interface_to_XSL_Transformations#Using_XSLTProcessor_from_XPCOM_components
            var xsltProcessor= Components.classes["@mozilla.org/document-transformer;1?type=xslt"]
                               .createInstance(Components.interfaces.nsIXSLTProcessor);

            // Import the XSL document object in the XSLT processor
            xsltProcessor.importStylesheet(xslDocument);

            // Declare an empty XML document that will own the fragment
            var resultDocumentOwner = this._window.document.implementation.createDocument("", "", null);

            // Get the resulting transformation fragment
            var resultFragment = xsltProcessor.transformToFragment(anXML,resultDocumentOwner);

            // Append the result fragment to its fragment owner
            resultDocumentOwner.appendChild(resultFragment);

            return resultDocumentOwner;
        }
        catch(ex)
        {
            throw ex;
        }
    },

    /**
     * Set the translated text for the given list of controls
     *
     * @method translateSmethControlElements
     * @param {Array} smethControls List of SMETH UI controls
     * @param {Object} smethTranslationObject Contains the tranalations text that will be used to translate
     */
    translateSmethControlElements : function(smethControls, smethTranslationObject) {

        // Loop the array of controls and set the appropriate control labels
        for (var i = 0; i < smethControls.length; i++) {

            // Get a translated text for the current control
            var localeText = smethTranslationObject[smethControls[i].id];

            // Get a translated tooltip text for the current control
            var localeTextTooltip = smethTranslationObject[smethControls[i].id + "Tooltip"];

            // Check if we have a translation the current control
            if (localeText != null) {

                // Set the appropriate label of the control
                switch (smethControls[i].tagName) {

                    case 'label':
                        if (isNaN(smethControls[i].getAttribute('value'))) {
                            smethControls[i].setAttribute('value', localeText);
                        }
                        break;

                    case 'button':
                        smethControls[i].setAttribute('label', localeText);
                        break;

                    case 'menuitem':
                        smethControls[i].setAttribute('label', localeText);
                        break;

                    case 'toolbarbutton':
                        smethControls[i].setAttribute('label', localeText);
                        break;

                }
            } else {}

            // Check if we have a translation the current control
            if (localeTextTooltip != null) {

                // Set the appropriate label of the control
                switch (smethControls[i].tagName) {

                    case 'label':
                        smethControls[i].setAttribute('tooltiptext', localeTextTooltip);
                        break;

                    case 'button':
                        smethControls[i].setAttribute('tooltiptext', localeTextTooltip);
                        break;

                    case 'menuitem':
                        smethControls[i].setAttribute('tooltiptext', localeTextTooltip);
                        break;

                    case 'toolbarbutton':
                        smethControls[i].setAttribute('tooltiptext', localeTextTooltip);
                        break;

                    case 'hbox':
                        smethControls[i].setAttribute('tooltiptext', localeTextTooltip);
                        break;

                }
            } else {}
        }
    },

    /**
     * Set SMETH UI labels as per user locale
     *
     * @method translateSEPAmailDocument
     * @param {XML} smethXulDom XUL fragment which contains the SMETH UI
     * @param {Object} smethTranslationObject Contains the translations text that will be used to translate
     * @return {XML} SMETH UI as XUL fragment with translated labels
     */
    translateSEPAmailDocument : function (smethXulDom, smethTranslationObject) {

        try {

            // Set the text for the list of labels
            this.translateSmethControlElements(smethXulDom.getElementsByTagNameNS(
                "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "label"), smethTranslationObject);

            // Set the text for the buttons from the SMETH UI
            this.translateSmethControlElements(smethXulDom.getElementsByTagNameNS(
                "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "button"), smethTranslationObject);

            // Set the text for the menuitem from the SMETH UI
            this.translateSmethControlElements(smethXulDom.getElementsByTagNameNS(
                "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "menuitem"), smethTranslationObject);

            // Set the text for the toolbarbutton from the SMETH UI
            this.translateSmethControlElements(smethXulDom.getElementsByTagNameNS(
                "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "toolbarbutton"), smethTranslationObject);

                // Set the text for the hbox from the SMETH UI
            this.translateSmethControlElements(smethXulDom.getElementsByTagNameNS(
                "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "hbox"), smethTranslationObject);

            return smethXulDom;

        } catch (e) {
            throw e;
        }
    }
};
