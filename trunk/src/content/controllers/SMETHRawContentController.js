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
 * @file SMETHAcknowledgmentControler.js
 * @mvc controller
 * @version 1212
 * @since 1210
 * @author Bishan Kumar Madhoo
 * @description SMETHRawContentController handles the displaying of SEPAmail messages in raw mode, that is, displaying
 * the content of the XML document that defines a SEPAmail message.
 */

/**
 * SMETHMessageHandler class contain functions to handle info, error, warning and exceptions messages
 *
 * @include SMETHMessageHandler.js
 */
Components.utils.import("resource://smeth/smethlib/SMETHMessageHandler.js");

/**
 * SMETHUtils class contains all the useful functions that will be used in SMETH
 *
 * @include SMETHUtils.js
 */
Components.utils.import("resource://smeth/smethlib/SMETHUtils.js");

/**
 * @description Strict mode for scripts
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Functions_and_function_scope/Strict_mode
 */
"use strict";

/**
 * SMETHRawContentController handles the displaying of SEPAmail messages in raw mode, that is, displaying the content of
 * the XML document that defines a SEPAmail message.
 *
 * @class SMETHRawContentController
 */
var SMETHRawContentController = {

    /**
     * Declare the SMETHMessageHandler class
     *
     * @attribute _smethMessageHandler
     * @private
     */
    _smethMessageHandler : new SMETHMessageHandler(window),

    /**
     * Declare the utils class
     *
     * @attribute _smethUtils
     * @private
     * @default null
     */
    _smethUtils : new SMETHUtils(window),

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
     * displayMessage displays the formatted content of a given message header in the given XUL browser
     *
     * @method displayMessage
     * @param {Object} aBrowser XUL browser used to display SEPAmail message raw content
     * @param {Object} aMsgHdr The header of a SEPAmail message
     * @param {Object} mailXMLDom XML DOM object containing mail object
     */
    displayMessage : function(aBrowser, aMsgHdr, mailXMLDom) {

        // Messenger service instance
        var messenger = Components.classes["@mozilla.org/messenger;1"]
                                  .createInstance(Components.interfaces.nsIMessenger);

        // Serializer for XML content
        var oSerializer = Components.classes["@mozilla.org/xmlextras/xmlserializer;1"]
                                    .createInstance(Components.interfaces.nsIDOMSerializer);

        // Get the URI of the message
        var uri = aMsgHdr.folder.getUriForMsg(aMsgHdr);

        // Get the URL of the message
        var neckoUrl = {};
        var msgService = messenger.messageServiceFromURI(uri);
        msgService.GetUrlForUri(uri, neckoUrl, null);

        // Get the textbox that contains the unformatted SEPAmail message content
        var content = aBrowser.contentDocument.getElementById('content');

        // Set the value of the unformatted SEPAmail message content textbox
        content.value = oSerializer.serializeToString(mailXMLDom);

        // Get the iFrame used for loading SEPAmail message content
        var iframe = aBrowser.contentDocument.getElementById('content-loader');

        // Load message content
        iframe.src = neckoUrl.value.spec + "?header=quotebody";
    }
};