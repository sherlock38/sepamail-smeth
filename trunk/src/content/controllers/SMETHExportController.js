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
 * @main smeth
 * @file SMETHExportController.js
 * @mvc controller
 * @version green
 * @since green
 * @author Bishan Kumar Madhoo
 * @description SMETHExportController exports a SEPAmail message to file.
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
 * msgHdrUtils regroups a list of functions pertaining to MIME header value retrieval operations
 *
 * @include msgHdrUtils.js
 */
Components.utils.import("resource://smeth/smethlib/msgHdrUtils.js");

/**
 * SMETHMail class that represent the message object for Smeth
 *
 * @include SMETHMail.js
 */
Components.utils.import("resource://smeth/smethlib/SMETHMail.js");

/**
 * Strict mode for scripts
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Functions_and_function_scope/Strict_mode
 */
"use strict";

/**
 * SMETHExportController allows to export a SEPAmail message
 *
 * @class SMETHExportController
 */
var SMETHExportController = {

    /**
     * Declare the SMETHMessageHandler class
     *
     * @attribute _smethMessageHandler
     * @private
     */
    _smethMessageHandler : new SMETHMessageHandler(window),

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
     * Declare the utils class
     *
     * @attribute _smethUtils
     * @private
     * @default null
     */
    _smethUtils : new SMETHUtils(window),

    /**
     * doExport exports a SEPAmail message to file
     *
     * @method doExport
     * @param {String} exportType Type of export that needs to be carried out
     */
    doExport : function(exportType) {

        // Get currently selected message
        try {

            // Get the selected mail header
            if (gFolderDisplay.selectedMessage != null) {

                // Define the options for the MsgHdrToMimeMessage function
                var options = { examineEncryptedParts: true, partsOnDemand: false };

                // Instantiate the smeth mail object
                this._smethMail = new SMETHMail(gFolderDisplay.selectedMessage);

                // Get the mail content
                MsgHdrToMimeMessage(gFolderDisplay.selectedMessage, null, function (aMailHeader, aMailContent) {

                    try {

                        // Set the mail content object
                        SMETHExportController._smethMail.content = aMailContent;

                        // Set the mail body
                        SMETHExportController._smethMail.body =
                            SMETHExportController._smethUtils.getMailBody(SMETHExportController._smethMail.content.parts[0],
                            document.getElementById("messagepane").contentDocument.body.textContent.replace(/(\n|\t)/gm, ""));

                        // Set whether the selected mail is a SEPAmail
                        SMETHExportController._smethMail.isSEPAmail =
                            SMETHExportController._smethUtils.isSEPAmail(SMETHExportController._smethMail.body);

                        // Check if message is a SEPAmail message
                        if (SMETHExportController._smethMail.isSEPAmail) {

                            // Get the SEPAmail message root node type
                            SMETHExportController._smethMail.sepamailType =
                                SMETHExportController._smethUtils.getSEPAmailMessageRootNodeType(SMETHExportController._smethMail.body);

                            // Parse the raw mail body
                            SMETHExportController._smethMail.sepamailXMLObject =
                                new DOMParser().parseFromString(SMETHExportController._smethMail.body, "text/xml");

                            // Set the SEPAmail message type
                            SMETHExportController._smethMail.sepamailMessageType =
                                SMETHExportController._smethUtils.getSEPAmailMessageType(SMETHExportController._smethMail.sepamailXMLObject);

                            // Export message based on user selected export type
                            switch (exportType) {

                                case 'envelope':
                                    SMETHExportController._exportAsEnvelope(SMETHExportController._smethMail);
                                    break;

                                case 'message':
                                    SMETHExportController._exportAsMessage(SMETHExportController._smethMail);
                                    break;

                                case 'missive':
                                    SMETHExportController._exportAsMissive(SMETHExportController._smethMail);
                                    break;
                            }
                        }

                    } catch(ex) {
                        throw ex;
                    }

                }, true, options);
            }

        } catch(e) {
            throw e;
        }
    },

    /**
     * _exportAsEnvelope exports the message envelope of a SEPAmail message to EML file
     *
     * @method _exportAsEnvelope
     * @param {SMETHMail} smethMail The SMETH object which contains the content of the SEPAmail message
     * @private
     */
    _exportAsEnvelope : function(smethMail) {

        try {

            // XML serializer
            var oSerializer = Components.classes["@mozilla.org/xmlextras/xmlserializer;1"]
                                        .createInstance(Components.interfaces.nsIDOMSerializer);

            // Transform SEPAmail message for export
            var exportDocument = SMETHExportController._smethUtils.transformXMLDocument(smethMail.sepamailXMLObject,
                SMETHExportController._smethPreferences.getCharPref('export.envelope.XSLUrl'));

            // SEPAmail message envelope content
            var envelope = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                XML(oSerializer.serializeToString(exportDocument)).toXMLString();

            // EML filename
            var filename = SMETHExportController._getSEPAmailMessageId(smethMail) + "-envelope.eml";

            // Get message headers for EML
            msgHdrGetHeaders(gFolderDisplay.selectedMessage, function (aHeaders) {

                // EML header string
                var emlHeader = '';
                emlHeader += 'X-Account-Key: ' + (aHeaders.get("x-account-key") == null ? '' : aHeaders.get("x-account-key")) + '\n';
                emlHeader += 'X-UIDL: ' + (aHeaders.get("x-uidl") == null ? '' : aHeaders.get("x-uidl")) + '\n';
                emlHeader += 'X-Mozilla-Status: ' + (aHeaders.get("x-mozilla-status") == null ? '' : aHeaders.get("x-mozilla-status")) + '\n';
                emlHeader += 'X-Mozilla-Status2: ' + (aHeaders.get("x-mozilla-status2") == null ? '' : aHeaders.get("x-mozilla-status2")) + '\n';
                emlHeader += 'X-Mozilla-Keys: ' + (aHeaders.get("x-mozilla-keys") == null ? '' : aHeaders.get("x-mozilla-keys")) + '\n';
                emlHeader += 'Return-path: ' + (aHeaders.get("return-path") == null ? '' : aHeaders.get("return-path")) + '\n';
                emlHeader += 'Envelope-to: ' + (aHeaders.get("envelope-to") == null ? '' : aHeaders.get("envelope-to")) + '\n';
                emlHeader += 'Delivery-date: ' + (aHeaders.get("delivery-date") == null ? '' : aHeaders.get("delivery-date")) + '\n';
                emlHeader += 'Received: ' + (aHeaders.get("received") == null ? '' : aHeaders.get("received")) + '\n';
                emlHeader += 'Message-ID: ' + (aHeaders.get("message-id") == null ? '' : aHeaders.get("message-id")) + '\n';
                emlHeader += 'Date: ' + (aHeaders.get("date") == null ? '' : aHeaders.get("date")) + '\n';
                emlHeader += 'From: ' + (aHeaders.get("from") == null ? '' : aHeaders.get("from")) + '\n';
                emlHeader += 'User-Agent: ' + (aHeaders.get("user-agent") == null ? '' : aHeaders.get("user-agent")) + '\n';
                emlHeader += 'MIME-Version: ' + (aHeaders.get("mime-version") == null ? '' : aHeaders.get("mime-version")) + '\n';
                emlHeader += 'To: ' + (aHeaders.get("to") == null ? '' : aHeaders.get("to")) + '\n';
                emlHeader += 'Subject: ' + (aHeaders.get("subject") == null ? '' : aHeaders.get("subject")) + '\n';
                emlHeader += 'Content-Type: text/plain; charset=UTF-8; format=flowed\n';
                emlHeader += 'Content-Transfer-Encoding: 7bit\n\n';

                // Save content to file
                SMETHExportController._smethUtils.saveEmlToFile(filename, emlHeader + envelope);
            });

        } catch(ex) {
            throw ex;
        }
    },

    /**
     * _exportAsMessage exports the message of a SEPAmail message to EML file
     *
     * @method _exportAsMessage
     * @param {SMETHMail} smethMail The SMETH object which contains the content of the SEPAmail message
     * @private
     */
    _exportAsMessage : function(smethMail) {

        try {

            // XML serializer
            var oSerializer = Components.classes["@mozilla.org/xmlextras/xmlserializer;1"]
                                        .createInstance(Components.interfaces.nsIDOMSerializer);

            // Transform SEPAmail message for export
            var exportDocument = SMETHExportController._smethUtils.transformXMLDocument(smethMail.sepamailXMLObject,
                SMETHExportController._smethPreferences.getCharPref('export.message.XSLUrl'));

            // Save content to file
            SMETHExportController._smethUtils.saveXmlToFile(SMETHExportController._getSEPAmailMessageId(smethMail) +
                "-message.xml", XML(oSerializer.serializeToString(exportDocument)).toXMLString());

        } catch(ex) {
            throw ex;
        }
    },

    /**
     * _exportAsMissive exports the missive of a SEPAmail message to XML file
     *
     * @method _exportAsMissive
     * @param {SMETHMail} smethMail The SMETH object which contains the content of the SEPAmail message
     * @private
     */
    _exportAsMissive : function(smethMail) {

        try {

            // XML serializer
            var oSerializer = Components.classes["@mozilla.org/xmlextras/xmlserializer;1"]
                                        .createInstance(Components.interfaces.nsIDOMSerializer);

            // Transform SEPAmail message for export
            var exportDocument = SMETHExportController._smethUtils.transformXMLDocument(smethMail.sepamailXMLObject,
                SMETHExportController._smethPreferences.getCharPref('export.missive.XSLUrl'));

            // Save content to file
            SMETHExportController._smethUtils.saveXmlToFile(SMETHExportController._getSEPAmailMessageId(smethMail) +
                "-missive.xml", XML(oSerializer.serializeToString(exportDocument)).toXMLString());

        } catch(ex) {
            throw ex;
        }
    },

    /**
     * _exportAsWholeSEPAmailMessage exports a SEPAmail message to EML file
     *
     * @method _exportAsWholeSEPAmailMessage
     * @param {SMETHMail} smethMail The SMETH object which contains the content of the SEPAmail message
     * @private
     */
    _exportAsWholeSEPAmailMessage : function(smethMail) {

        try {

            // XML serializer
            var oSerializer = Components.classes["@mozilla.org/xmlextras/xmlserializer;1"]
                                        .createInstance(Components.interfaces.nsIDOMSerializer);

            // Transform SEPAmail message for export
            var exportDocument = SMETHExportController._smethUtils.transformXMLDocument(smethMail.sepamailXMLObject,
                SMETHExportController._smethPreferences.getCharPref('export.all.XSLUrl'));

            // Save content to file
            SMETHExportController._smethUtils.saveXmlToFile(SMETHExportController._getSEPAmailMessageId(smethMail) +
                "-all.xml", XML(oSerializer.serializeToString(exportDocument)).toXMLString());

        } catch(ex) {
            throw ex;
        }
    },

    /**
     * _getSEPAmailMessageId tries to find the SEPAmail message ID of a SMETH mail object
     *
     * @method _getSEPAmailMessageId
     * @param {SMETHMail} smethMail The SMETH object which contains the content of the SEPAmail message
     * @return SEPAmail message ID
     * @private
     */
    _getSEPAmailMessageId : function(smethMail) {

        try {

            // Get the ID of the SEPAmail message
            var idDocument = SMETHExportController._smethUtils.transformXMLDocument(smethMail.sepamailXMLObject,
                SMETHExportController._smethPreferences.getCharPref('export.messageId.XSLUrl'));

            // Get message ID from the XML DOM
            return idDocument.firstChild.textContent;

        } catch(ex) {
            throw ex;
        }
    }
}