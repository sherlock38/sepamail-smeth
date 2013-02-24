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
 * @file SMETHHeaderController.js
 * @mvc controller
 * @version 1212
 * @since 1210
 * @author Ammit Heeramun
 * @description SMETHHeaderController initialise the sepamail header UI
 */

/**
 * SMETHMessageHandler class contain functions to handle info, error, warning and exceptions messages
 *
 * @include SMETHMessageHandler.js
 */
Components.utils.import("resource://smeth/smethlib/SMETHMessageHandler.js");

/**
 * SMETHUtils class contains all the useful functions that will be used in Smeth
 *
 * @include SMETHUtils.js
 */
Components.utils.import("resource://smeth/smethlib/SMETHUtils.js");

/**
 * Strict mode for scripts
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Functions_and_function_scope/Strict_mode
 *
 */
"use strict"

/**
 * SMETHHeaderController initialise the sepamail header UI
 *
 * @class SMETHHeaderController
 */
var SMETHHeaderController = {

    /**
     * Declare the SMETHMessageHandler class
     *
     * @attribute _smethMessageHandler
     * @private
     */
    _smethMessageHandler : new SMETHMessageHandler(window),

    /**
     * Declare the SMETHUtils class
     *
     * @attribute _smethUtils
     * @private
     */
    _smethUtils : new SMETHUtils(window),

    /**
     * Declare the flag that indicates whether the smeth preferences have been loaded to "false"
     *
     * @attribute _smethPreferencesHasBeenInitialised
     * @private
     * @default null
     */
    _smethPreferencesHasBeenInitialised : false,

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
     * initializeSEPAmailHeaderUI function initialises the SEPAmail header user interface
     *
     * @method initializeSEPAmailHeaderUI
     */
    initializeSEPAmailHeaderUI : function(){
        try {

            // Initialise SMETH preferences
            this._initSmethPreferences();

            // Get the missive header XSL url based on the SEPAmail type and SEPAmail Message Type
            var headerXSLUrl = this._smethPreferences.getCharPref("missive.header");

            // Check if the Header XSL Url is define
            if("" != headerXSLUrl)
            {
                // Transform the SEPAmail XML document
                var sepamailHeaderDocument = this._smethUtils.transformXMLDocument(SMETHReadMessageController._smethMail.sepamailXMLObject, "chrome://{appname}/content/xsl/" + headerXSLUrl);

                // Set dates
                sepamailHeaderDocument = this._setValuesSEPAmailHeaderDocument(sepamailHeaderDocument);

                if(!this._isAcknowledgementRequired()) {
                    sepamailHeaderDocument.getElementById("semHdrSummaryAck").hidden = true;
                    sepamailHeaderDocument.getElementById("semHdrDetailsAck").hidden = true;
                } else { }

                // Get the sepamailUIContainer
                var sepamailUIContainer = document.getElementById("sepamailUIContainer");

                // Appends the resulting transformation fragment first child to the sepamailUIContainer
                sepamailUIContainer.appendChild(sepamailHeaderDocument.firstChild);
            }
            else
            {
                throw new Error("XSL Url for SEPAmail header is not define in the configuration file");
            }

        } catch(ex) {

            throw ex;
        }
    },

    /**
     * Initialise SMETH preferences class
     *
     * @method _initSmethPreferences
     */
    _initSmethPreferences : function() {

        // Check if SMETH preferences has been initialised
        if (!this._smethPreferencesHasBeenInitialised) {

            // Initialise SMETH preferences
            this._smethPreferences.QueryInterface(Components.interfaces.nsIPrefBranch2);
            this._smethPreferencesHasBeenInitialised = true;
        } else {}
    },

    /**
     * Check whether is acknowledgement required
     *
     * @method _isAcknowledgementRequired
     * @return {Boolean} Whether acknowledgement is required for the selected mail
     */
    _isAcknowledgementRequired : function() {

        // Get the current folder we are in
        var currentFolder = gFolderDisplay.displayedFolder;

        // Check if we are in the sent folder
        if ("Sent" == currentFolder.abbreviatedName) {
            return false
        }

        // Acknowledgement Message types string
        var acknowledgementMessageTypes = this._smethPreferences.getCharPref('acknowledgement.types').split(',');

        for (var i = 0; i < acknowledgementMessageTypes.length; i++) {

            // Check if the current message can be acknowledge
            if(SMETHReadMessageController._smethMail.sepamailMessageType == acknowledgementMessageTypes[i].trim()) {
                return true;
            }
        }

        return false;
    },

    /**
     * setValuesSEPAmailHeaderDocument function set the sent and received dates for SEPAmail header
     *
     * @method _setValuesSEPAmailHeaderDocument
     * @param {XML} aSEPAmailDoc Document
     * @return {XML} SEPAmailDoc
     */
    _setValuesSEPAmailHeaderDocument : function (aSEPAmailDoc) {

        try {

            // Initialise the SEPAmail document
            var sepamailDoc = aSEPAmailDoc;

            // Translations for date
            var sentDate = aSEPAmailDoc.getElementById("sendSndDtTm");

            if ('' != sentDate.textContent) {

                // Get sent date label
                var summarySentDateValue = aSEPAmailDoc.getElementById("semHdrSummarySentValue");
                var detailsSentDateValue = aSEPAmailDoc.getElementById("semHdrDetailsSentValue");
                var messageExpDateValue = aSEPAmailDoc.getElementById("semHdrDetailsMsgExpValue");

                var newSentDate = sentDate.textContent.split('.')[0];

                // Construct the sent date object
                var sentDateObject = new Date(newSentDate.split('T')[0]);
                var sentTimeArray = newSentDate.split('T')[1].split(':');
                sentDateObject.setHours(sentTimeArray[0], sentTimeArray[1], sentTimeArray[2], 0);

                if (this._smethUtils.checkTodayDate(sentDateObject)) {

                    // Set the value for the sent date labels
                    summarySentDateValue.setAttribute("value", SMETHTranslations["dateTodayText"] + " " + sentDateObject.toLocaleTimeString());
                    detailsSentDateValue.setAttribute("value", SMETHTranslations["dateTodayText"] + " " + sentDateObject.toLocaleTimeString());

                } else {

                    // Set the value for the sent date labels
                    summarySentDateValue.setAttribute("value", sentDateObject.toLocaleString());
                    detailsSentDateValue.setAttribute("value", sentDateObject.toLocaleString());
                }

                // Check if we have a message expiry date
                if (messageExpDateValue != null) {

                    if (messageExpDateValue.getAttribute("value").length > 0) {

                        // Message expiry date object
                        var expiryDate = new Date(messageExpDateValue.getAttribute("value").split('T')[0]);
                        var expiryTimeVals = messageExpDateValue.getAttribute("value").split('T')[1].split(':');

                        // Set the message expiry time
                        expiryDate.setHours(expiryTimeVals[0], expiryTimeVals[1], expiryTimeVals[2], 0);

                        // Check if message expires today
                        if (this._smethUtils.checkTodayDate(expiryDate)) {
                            messageExpDateValue.setAttribute("value", SMETHTranslations["dateTodayText"] + " " + expiryDate.toLocaleTimeString());
                        } else {
                            messageExpDateValue.setAttribute("value", expiryDate.toLocaleString());
                        }
                    }
                }
            }

            // Get the received date from the header
            var receivedDateObject = new Date(SMETHReadMessageController._smethMail.header.date/1000);

            // Get sent date label
            var detailsReceivedDateValue = aSEPAmailDoc.getElementById("semHdrDetailsDistributedValue");

            // Check if its today's date
            if (this._smethUtils.checkTodayDate(receivedDateObject)) {

                // Set the value for the sent date labels
                detailsReceivedDateValue.setAttribute("value", SMETHTranslations["dateTodayText"] + " " + receivedDateObject.toLocaleTimeString());

            } else {

                // Set the value for the sent date labels
                detailsReceivedDateValue.setAttribute("value", receivedDateObject.toLocaleString());
            }

            return sepamailDoc;

        } catch(ex) {
            throw ex;
        }
    }
}


