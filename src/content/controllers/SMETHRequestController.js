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
 * @file SMETHRequestController.js
 * @mvc controller
 * @version 1212
 * @since 1210
 * @author Ammit Heeramun
 * @description SMETHReportController is the class that is responsible for the composition and sending of SEPAmail requests(Simple Test and Activation)
 */

/**
 * The NetUtil.jsm JavaScript code module offers utility routines performing common network related tasks.
 *
 * @include NetUtil.jsm
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/NetUtil.jsm
 */
Components.utils.import("resource://gre/modules/NetUtil.jsm");

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
"use strict";

/**
 * SMETHRequestController class defines all the events that is related to the compose request window
 *
 * @class SMETHRequestController
 */
var SMETHRequestController = {

   /**
    * Declare the SMETHMessageHandler class
    *
    * @attribute _smethMessageHandler
    * @private
    * @default null
    */
    _smethMessageHandler : new SMETHMessageHandler(window),

   /**
    * Preferences object
    *
    * @attribute _smethPreferences
    * @private
    * @default null
    */
    _smethPreferences : null,

   /**
    * Declare the content document
    *
    * @attribute _content
    * @private
    * @default null
    */
    _content : null,

   /**
    * XML Object
    *
    * @attribute _contentXMLObject
    * @private
    * @default null
    */
    _contentXMLObject : null,

   /**
    * Smeth message type
    *
    * @attribute _smethMessageType
    * @private
    * @default null
    */
    _smethMessageType : null,

   /**
    * Smeth utils object
    *
    * @attribute _smethUtils
    * @private
    */
    _smethUtils : new SMETHUtils(window),

    /**
     *init function Initialises all the objects that will be used in "SMETHRequesrController"
     *
     * @method init
     * @see https://developer.mozilla.org/en-US/docs/Code_snippets/Preferences#XPCOM_interfaces_for_preferences_system
     */
    init:function() {

        // Initialise the preference object
        // @see https://developer.mozilla.org/en-US/docs/Code_snippets/Preferences#XPCOM_interfaces_for_preferences_system
        this._smethPreferences = Components.classes["@mozilla.org/preferences-service;1"]
                                           .getService(Components.interfaces.nsIPrefService)
                                           .getBranch("extensions.smeth.");

        this._smethPreferences.QueryInterface(Components.interfaces.nsIPrefBranch2);
    },

    /**
     * isSEPAmailRequest function check if the content of a body contains a valid request missive message
     *
     * @method isSEPAmailRequest
     * @param {String} aContent Message content
     * @return {Boolean} Whether the message is a valid request missive message
     * @todo BKM - Refactorise with one unified method for determinig message type
     */
    isSEPAmailRequest: function(aContent) {

        try {

            // Initialise the default objects
            this.init();

            // Initialise the content object
            this._content = aContent;

            // Parse the content XML
            this._contentXMLObject = new DOMParser().parseFromString(aContent, "text/xml");

            // Verify for any parse error
            if ("parsererror" !=  this._contentXMLObject.documentElement.nodeName) {

                // List of request messages
                var validMessages = new Array("activation.request@payment.activation", "simple.request@test",
                    "send.request@generic", "mandat@direct.debit", "notification@direct.debit",
                    "request.copy@direct.debit");

                // Get the message type xpath
                var smethPrefMissiveMsgTypXpath = this._smethPreferences.getCharPref("missive.prefMsgTypXpath");

                // Get the SEPAmail message type using Xpath
                this._smethMessageType = this._contentXMLObject.evaluate(smethPrefMissiveMsgTypXpath,
                    this._contentXMLObject, SMETHRequestController._smethUtils.nsResolver, XPathResult.STRING_TYPE,null).stringValue;

                // Check whether the xml is of type request
                return validMessages.indexOf(this._smethMessageType) > -1;

            } else {
                return false;
            }

            return false;

        } catch(ex) {
            SMETHRequestController._smethMessageHandler.exception(ex);
        }
    },

    /**
     * NotifyComposeBodyReady event notifies when the compose body is ready
     *
     * @method NotifyComposeBodyReady
     */
    NotifyComposeBodyReady: function() {

        try {

            // Transform the SEPAmail XML document
            var sepamailComposeBody = this._transformXMLDocument(this._contentXMLObject,
                SMETHRequestController._smethUtils.getCompositionTransformationForMessageType(SMETHRequestController._smethMessageType));

            // Populate the default values
            SMETHRequestController._populateDefaultValues(sepamailComposeBody);

            // Get the content window
            var smethComposeBodyFormContainer = document.getElementById("smethComposeBodyFormContainer");

            // Set translated labels for SMETH UI controls
            sepamailComposeBody = SMETHRequestController._smethUtils.translateSEPAmailDocument(sepamailComposeBody,
                SMETHRequestComposeWindowTranslations);

            // Append the child to the content frame
            smethComposeBodyFormContainer.appendChild(sepamailComposeBody.firstChild);

        } catch(ex) {
            SMETHRequestController._smethMessageHandler.exception(ex);
        }
    },

    /**
     * SendMailEventHandler event handles the send event of an email
     *
     * @method SendMailEventHandler
     * @param {Object} anEvent Event parameters
     */
    SendMailEventHandler : function(anEvent) {

        try {

            // Get the message compose window
            var msgcomposeWindow = document.getElementById("msgcomposeWindow");

            // Get the message type
            var msg_type = msgcomposeWindow.getAttribute("msgtype");

            // Check if it is an actual send event
            if (!(msg_type == nsIMsgCompDeliverMode.Now || msg_type == nsIMsgCompDeliverMode.Later)) {
                return;
            }

            // Get the current editor
            var editor = GetCurrentEditor();

            // Begin the transaction
            editor.beginTransaction();

            // Set the date and time at which message is being sent
            SMETHRequestController._smethUtils.setSendDateTime(this._contentXMLObject);

            // Set the message expiry of the request
            SMETHRequestController._smethUtils.setMessageExpiry(this._contentXMLObject);

            // Polulate the values of the missive header
            this._populateMissiveHeader();

            // Populate the QXBANS
            if (SMETHRequestController._smethUtils.populateQXBAN(gMsgCompose, document, this._contentXMLObject)) {

                // Get the mode for the message type
                var mode = SMETHRequestController._smethUtils.getMessageTypeMode(SMETHRequestController._smethMessageType);

                // Get the encrypt checkbox menu item
                var menuSecurityEncryptRequire = document.getElementById("menu_securityEncryptRequire2");

                // Get the sign checkbox menu item
                var menuSecuritySign = document.getElementById("menu_securitySign2");

                // Check if we are in the production mode
                if (mode == 'production') {

                    // Check if the current email is signed and encrypted
                    if (!(menuSecurityEncryptRequire.checked && menuSecuritySign.checked)) {

                        // Show error message
                        SMETHRequestController._smethUtils.showAlert('SMETH',
                            SMETHRequestController._smethUtils.messageBundle.getLocalisedMessage('ecosystem.mode.error'));

                        // Block message sending
                        anEvent.preventDefault();
                    }

                } else {

                    if (menuSecuritySign.getAttribute('checked')) {

                    }

                    if (!(menuSecurityEncryptRequire.checked && menuSecuritySign.checked)) {

                        // Display message about outgoing email being unsigned and unencrypted since we are in test mode
                        SMETHRequestController._smethUtils.showAlert('SMETH',
                            SMETHRequestController._smethUtils.messageBundle.getLocalisedMessage('ecosystem.mode.warning'));
                    }
                }

                // Set the other XML fields
                switch(SMETHRequestController._smethMessageType) {

                    case "activation.request@payment.activation":
                        this._populateRequestXMLWithFieldsValues();
                        break;

                    case "send.request@generic":
                        this._populateTestRequestXMLWithFieldsValues();
                        break;

                    case "simple.request@test":
                        this._populateGenericRequestXMLWithFieldsValues();
                        break;

                    case "mandat@direct.debit":
                        this._populateMandateXMLWithFieldsValues();
                        break;

                    case "notification@direct.debit":
                        this._populateNotificationXMLWithFieldsValues();
                        break;

                    case "request.copy@direct.debit":
                        this._populateRequestCopyXMLWithFieldsValues();
                        break;

                    default:
                        break;
                }

                // Set the text content of the mail being sent
                editor.document.body.textContent = (new XMLSerializer()).serializeToString(this._contentXMLObject);

            } else {
                 anEvent.preventDefault();
            }

            editor.endTransaction();

        } catch(ex) {
            SMETHRequestController._smethMessageHandler.exception(ex);
        }
    },

    /**
     * AttachDocumentEventHandler event handles the attachement of SEPAmail Documents
     *
     * @method AttachDocumentEventHandler
     */
    AttachDocumentEventHandler : function() {

        try {

            switch(SMETHRequestController._smethMessageType) {

                case "activation.request@payment.activation":
                    this._appendAttachmentToXMLDocument(SMETHRequestController._smethUtils.getFile("Open document to attach"));
                    break;

                case "send.request@generic":
                    this._appendAttachmentToTestXmlDocument(SMETHRequestController._smethUtils.getFile("Open document to attach"));
                    break;

                case "simple.request@test":
                    this._appendAttachmentToTestXmlDocument(SMETHRequestController._smethUtils.getFile("Open document to attach"));
                    break;

                default:
                    SMETHRequestController._smethMessageHandler.info("Attachments not yet handled for other type of request");
                    break;
            }

        } catch(ex) {
            SMETHRequestController._smethMessageHandler.exception(ex);
        }
    },

   /**
     * TryHandleMissiveAttachments handles missive attachment operations
     *
     * @method TryHandleMissiveAttachments
     * @param {String} action Action that is being carried out on the missive attachment
     * @param {Object} target Missive attachment item
     */
    TryHandleMissiveAttachments : function(action, target) {

        var i;

        // Get the attachment object
        var missiveAttachmentList = document.getElementById("missiveAttachmentList");

        // Missive attachment items
        var missiveAttachmentItems = missiveAttachmentList.getElementsByTagName("missiveattachmentitem");

        switch (action) {

            case "delete":

                var nodes = this._contentXMLObject.getElementsByTagName("sem:Documents");
                var header = this._contentXMLObject.getElementsByTagName("sem:Header");

                // Check if target has been defined
                if (target == undefined) {

                    // Verify that we have a missive attachment item
                    if (missiveAttachmentItems.length > 0) {

                        // Check if missive attachment data objects could be found
                        if (missiveAttachmentItems[0].data != null) {

                            try {

                                for (i = 0; i <nodes.length;i++) {

                                    if (missiveAttachmentItems[0].data.getAttribute("name") ==
                                        nodes[i].getElementsByTagName("sem:name")[0].textContent) {
                                        header[0].removeChild(nodes[i]);
                                    }
                                }

                                // Initialize the attachment UI
                                SMETHRequestController._disableAttachmentUI();

                                // Initialize the attachment UI
                                SMETHRequestController._initializeAttachmentUI(SMETHRequestController._contentXMLObject);

                            } catch (e) {
                                throw e;
                            }

                        } else {
                            throw new Error("Missive attachment file details could not be found.");
                        }

                    } else {
                        throw new Error("Missive attachment file items could not be found.");
                    }

                } else {

                    // Check if missive attachment data objects could be found
                    if (missiveAttachmentList._currentItem.data != null) {

                        try {

                            for (i = 0; i < nodes.length; i++) {

                                if (missiveAttachmentItems[0].data.getAttribute("name") ==
                                   nodes[i].getElementsByTagName("sem:name")[0].textContent) {
                                    header[0].removeChild(nodes[i]);
                                }
                            }

                            // Initialize the attachment UI
                            SMETHRequestController._disableAttachmentUI();

                            // Initialize the attachment UI
                            SMETHRequestController._initializeAttachmentUI(SMETHRequestController._contentXMLObject);

                        } catch (e) {
                            throw e;
                        }

                    } else {
                        throw new Error("Missive attachment file details could not be found.");
                    }
                }

                break;

            case "deleteAllFromTest":

                var dataNodes = this._contentXMLObject.getElementsByTagName("sem:Data");
                var container = this._contentXMLObject.evaluate("/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:SimpleTestRequest",
                    this._contentXMLObject, SMETHRequestController._smethUtils.nsResolver,
                    XPathResult.FIRST_ORDERED_NODE_TYPE, null);

                try {

                    // Check if target has been defined
                    if (target == undefined) {

                            // Remove data nodes from XML
                            while(dataNodes[0] != null) {
                                container.singleNodeValue.removeChild(dataNodes[0]);
                            }

                    } else {

                        // Scan the list of nodes and delete the attached file selected by the user
                        for (i = 0; i < dataNodes.length; i++) {

                            // Check if we are the required data node
                            if (dataNodes[i].firstChild.data == target.triggerNode.data.textContent) {
                                container.singleNodeValue.removeChild(dataNodes[i]);
                                break;
                            }
                        }
                    }

                    // Initialize the attachment UI
                    SMETHRequestController._disableAttachmentUI();

                    // Initialize the attachment UI
                    SMETHRequestController._initializeAttachmentUI(SMETHRequestController._contentXMLObject);

                } catch (e) {
                    throw e;
                }

                break;

            default:
                break;

        }
    },

    /**
     * _appendAttachmentToTestXmlDocument appends attachment to the XML document of a test request
     *
     * @method _appendAttachmentToTestXmlDocument
     * @param {Object} file File to append as attachment
     */
    _appendAttachmentToTestXmlDocument : function(file) {

        try {

            // Check if file is not null
            if (null != file) {

                // Read the file
                NetUtil.asyncFetch(file, function(inputStream, status) {

                    // Check if there is any reading error
                    if (!Components.isSuccessCode(status)) {
                        throw new Error("Error reading from file");
                        return;
                    }

                    // Read the file
                    var data = NetUtil.readInputStreamToString(inputStream, inputStream.available());

                    // New element for data node
                    var dataNode = SMETHRequestController._contentXMLObject.createElement('sem:Data');
                    dataNode.appendChild(SMETHRequestController._contentXMLObject.createCDATASection(window.btoa(data)));

                    // Get the container node
                    var containerNode = SMETHRequestController._contentXMLObject.evaluate("/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:SimpleTestRequest",
                        SMETHRequestController._contentXMLObject, SMETHRequestController._smethUtils.nsResolver,
                        XPathResult.FIRST_ORDERED_NODE_TYPE, null);

                    // Append the data node to the container node
                    containerNode.singleNodeValue.appendChild(dataNode);

                    // Disable the attachment UI
                    SMETHRequestController._disableAttachmentUI();

                    // Initialize the attachment UI
                    SMETHRequestController._initializeAttachmentUI(SMETHRequestController._contentXMLObject);

                });
            }

        } catch(ex) {
            SMETHRequestController._smethMessageHandler.exception(ex);
        }
    },

    /**
     * _appendAttachmentToXMLDocument appends attachment to XML document
     *
     * @method _appendAttachmentToXMLDocument
     * @param {Object} file File to append as attachment
     */
    _appendAttachmentToXMLDocument: function(file) {

        try {

            // Check if file is not null
            if (null != file) {

                // Read the file
                NetUtil.asyncFetch(file, function(inputStream, status) {

                    // Check if there is any reading error
                    if (!Components.isSuccessCode(status)) {
                        throw new Error("Error reading from file");
                        return;
                    }

                    // New element for documents node
                    var documentNode = SMETHRequestController._contentXMLObject.createElement('sem:Documents');

                    // New element for type node
                    var typeNode = SMETHRequestController._contentXMLObject.createElement('sem:Type');
                    typeNode.textContent = 'mandant';
                    documentNode.appendChild(typeNode);

                    // New element for title node
                    var titleNode = SMETHRequestController._contentXMLObject.createElement('sem:Title');
                    titleNode.textContent = 'Avis de paiement SEPAmail';
                    documentNode.appendChild(titleNode);

                    // New element for Date node
                    var dateNode = SMETHRequestController._contentXMLObject.createElement('sem:Date');
                    dateNode.textContent = '2012-10-25';
                    documentNode.appendChild(dateNode);

                    // New element for Language node
                    var langNode = SMETHRequestController._contentXMLObject.createElement('sem:Lang');
                    langNode.textContent = 'fr';
                    documentNode.appendChild(langNode);

                    // New element for Contents node
                    var contentsNode = SMETHRequestController._contentXMLObject.createElement('sem:Contents');

                    // Try to obtain the attachment file type
                    var mimeService = Components.classes["@mozilla.org/mime;1"]
                                                .getService(Components.interfaces.nsIMIMEService);
                    var mimeType = mimeService.getTypeFromFile(file);

                    // New element for mime-type node
                    var mimeTypeNode = SMETHRequestController._contentXMLObject.createElement('sem:mime-type');
                    mimeTypeNode.textContent = mimeType;
                    contentsNode.appendChild(mimeTypeNode);

                    // New element for name node
                    var nameNode = SMETHRequestController._contentXMLObject.createElement('sem:name');
                    nameNode.textContent = file.leafName;
                    contentsNode.appendChild(nameNode);

                    // Read the file
                    var data = NetUtil.readInputStreamToString(inputStream, inputStream.available());

                    // New element for data node
                    var dataNode = SMETHRequestController._contentXMLObject.createElement('sem:data');
                    dataNode.appendChild(SMETHRequestController._contentXMLObject.createCDATASection(window.btoa(data)));
                    contentsNode.appendChild(dataNode);

                    // Append the content node to the document node
                    documentNode.appendChild(contentsNode);

                    // Get the header node
                    var headerNode = SMETHRequestController._contentXMLObject.evaluate("/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:Header",
                                        SMETHRequestController._contentXMLObject,
                                        SMETHRequestController._smethUtils.nsResolver,
                                        XPathResult.FIRST_ORDERED_NODE_TYPE, null);

                    // Append the document node to the header node
                    headerNode.singleNodeValue.appendChild(documentNode);

                    // Initialize the attachment UI
                    SMETHRequestController._disableAttachmentUI();

                    // Initialize the attachment UI
                    SMETHRequestController._initializeAttachmentUI(SMETHRequestController._contentXMLObject);

                });
            }

        } catch(ex) {
            SMETHRequestController._smethMessageHandler.exception(ex);
        }
    },

    /**
     * _populateDefaultValues populates the default values for the compose body
     *
     * @method _populateDefaultValues
     * @param {XML} aSepamailComposeBody
     */
    _populateDefaultValues : function(aSepamailComposeBody) {

        switch(SMETHRequestController._smethMessageType) {

            case "activation.request@payment.activation":

                // Get the default Currency
                var defaultCurrency =  SMETHRequestController._smethPreferences.getCharPref("defaultCurrency");

                // Set default Currency
                aSepamailComposeBody.getElementById("ccyLabel").setAttribute("value", this._getCurrencyByCode(defaultCurrency));

                break;

            default:
                break;

        }
    },

    /**
     * _populateMissiveHeader populates the header of missive with values specified by the user
     *
     * @method _populateMissiveHeader
     */
    _populateMissiveHeader: function() {

        // Missive header values textboxes
        var missiveIdTextbox = document.getElementById("missiveIdTextbox");
        var typeMissiveTextbox = document.getElementById("typeMissiveTextbox");
        var orderMissiveTextbox = document.getElementById("orderMissiveTextbox");
        var priorityTextbox = document.getElementById("priorityTextbox");
        var messageIdTextbox = document.getElementById("messageIdTextbox");

        // Check if the missive ID textbox is defined
        if (missiveIdTextbox == null) {

            // Automatically generated missive ID
            SMETHRequestController._smethUtils.setMissiveId(this._contentXMLObject);

        } else {

            // Check if a missive ID has been defined
            if (missiveIdTextbox.value.length > 0) {

                // Set the user generated missive ID
                SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                    "/sem:Missive/sem:sepamail_missive_001/sem:MsvId", missiveIdTextbox.value);

            } else {

                // Automatically generated missive ID
                SMETHRequestController._smethUtils.setMissiveId(this._contentXMLObject);
            }
        }

        // Set the missive type
        if (typeMissiveTextbox != null) {
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvTyp", typeMissiveTextbox.value);
        }

        // Set the missive order
        if (orderMissiveTextbox != null) {
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvOrd", orderMissiveTextbox.value);
        }

        // Set the missive priority
        if (priorityTextbox != null) {
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvPri", priorityTextbox.value);
        }

        // Check if the message ID textbox is defined
        if (messageIdTextbox == null) {

            // Automatically generated message ID
            SMETHRequestController._smethUtils.setMessageId(this._contentXMLObject);

        } else {

            // Check if a message ID has been defined
            if (messageIdTextbox.value.length > 0) {

                // Set the user generated message ID
                SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                    "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgHdr/sem:MsgId",
                    messageIdTextbox.value);

            } else {

                // Automatically generated message ID
                SMETHRequestController._smethUtils.setMessageId(this._contentXMLObject);
            }
        }
    },

    /**
     * _populateMandateXMLWithFieldsValues function populates the XML object with form fields' values
     *
     * @method _populateMandateXMLWithFieldsValues
     * @private
     */
    _populateMandateXMLWithFieldsValues : function() {

        try {

            var messageId;
            var messageIdTextbox = document.getElementById("messageIdTextbox");
            var mandateIdTextbox = document.getElementById("semMandateIdTextbox");
            var mandateRequestIdTextbox = document.getElementById("semMandateRequestIdTextbox");
            var creditorNameTextbox = document.getElementById("semCreditorNameTextbox");
            var creditorAccountTextbox = document.getElementById("semCreditorAccountTextbox");
            var debtorNameTextbox = document.getElementById("semDebtorNameTextbox");
            var debtorAccountTextbox = document.getElementById("semDebtorAccountTextbox");
            var creditorBICTextbox = document.getElementById("semCreditorBICTextbox");

            // Check if a message ID has been defined
            if (messageIdTextbox.value.length > 0) {

                // Get the user defined message ID
                messageId = messageIdTextbox.value;

            } else {

                // Automatically generated message ID
                messageId = SMETHRequestController._smethUtils.generateMessageId();
            }

            // Set the message ID
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgHdr/sem:MsgId",
                messageId);

            // Set the message ID for the mandate group header
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:GrpHdr/p09:MsgId",
                messageId);

            // Set the creation date and time
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:GrpHdr/p09:CreDtTm",
                SMETHRequestController._smethUtils.formatDateForSEPAmail(new Date()));

            // Set the mandate identification
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:Mndt/p09:MndtId",
                mandateIdTextbox.value.trim());

            // Set the mandate request identification
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:Mndt/p09:MndtReqId",
                mandateRequestIdTextbox.value.trim());

            // Set the creditor name
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:Mndt/p09:Cdtr/p09:Nm",
                creditorNameTextbox.value.trim());

            // Set the creditor account
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:Mndt/p09:CdtrAcct/p09:Id/p09:IBAN",
                creditorAccountTextbox.value.trim());

            // Set the debtor name
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:Mndt/p09:Dbtr/p09:Nm",
                debtorNameTextbox.value.trim());

            // Set the debtor account
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:Mndt/p09:DbtrAcct/p09:Id/p09:IBAN",
                debtorAccountTextbox.value.trim());

            // Set the creditor BIC
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:Mndt/p09:DbtrAgt/p09:FinInstnId/p09:BIC",
                creditorBICTextbox.value.trim());

        } catch(ex) {
            throw ex;
        }
    },

    /**
     * _populateNotificationXMLWithFieldsValues function populates the XML object with form fields' values
     *
     * @method _populateNotificationXMLWithFieldsValues
     * @private
     * @todo BKM method implementation
     */
    _populateNotificationXMLWithFieldsValues : function() {

        try {

            var groupingMenuList = document.getElementById("semGroupingMenuList");
            var paymentIdTextbox = document.getElementById("semPaymentIdTextbox");
            var mandateIdTextbox = document.getElementById("semMandateIdTextbox");
            var creditorRefTextbox = document.getElementById("semCreditorRefTextbox");
            var creditorNameTextbox = document.getElementById("semCreditorNameTextbox");
            var creditorFinancialInstitutionIdTextbox = document.getElementById("semCreditorFinancialInstitutionIdTextbox");
            var debtorNameTextbox = document.getElementById("semDebtorNameTextbox");
            var debtorIBANTextbox = document.getElementById("semDebtorIBANTextbox");
            var debtorFinancialInstitutionIdTextbox = document.getElementById("semDebtorFinancialInstitutionIdTextbox");
            var transactionDatePicker = document.getElementById("semTransactionDatePicker");
            var amountTextbox = document.getElementById("semAmountTextbox");

            // Set the creation date and time
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:GrpHdr/sem:CreDtTm",
                SMETHRequestController._smethUtils.formatDateForSEPAmail(new Date()));

            // Set the grouping type
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:GrpHdr/sem:Grpg",
                groupingMenuList.value);

            // Set the payment ID
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:PntId",
                paymentIdTextbox.value.trim());

            // Set the mandate ID
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:MndtId",
                mandateIdTextbox.value.trim());

            // Set the creditor reference
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:CtrRef",
                creditorRefTextbox.value.trim());

            // Set the creditor name
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:Cdtr/p09:Nm",
                creditorNameTextbox.value.trim());

            // Set the creditor financial institution ID
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:CdtrAgt/p09:FinInstnId/p09:BIC",
                creditorFinancialInstitutionIdTextbox.value.trim());

            // Set the debtor name
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:Dbtr/p09:Nm",
                debtorNameTextbox.value.trim());

            // Set the debtor IBAN
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:DbtrAcct/p09:Id/p09:IBAN",
                debtorIBANTextbox.value.trim());

            // Set the debtor financial institution ID
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:DbtrAgt/p09:FinInstnId/p09:BIC",
                debtorFinancialInstitutionIdTextbox.value.trim());

            // Set the transaction date
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:Trans/sem:Trs/sem:TrsDate",
                transactionDatePicker.value);

            // Set the transaction amount currency
            SMETHRequestController._smethUtils.setNodeAttribute(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:Trans/sem:Trs/sem:TrsAmt",
                "Ccy",
                SMETHRequestController._smethPreferences.getCharPref("defaultCurrency"));

            // Set the transaction amount
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:Trans/sem:Trs/sem:TrsAmt",
                amountTextbox.value.trim());

        } catch(ex) {
            throw ex;
        }
    },

    /**
     * _populateRequestCopyXMLWithFieldsValues function populates the XML object with form fields' values
     *
     * @method _populateRequestCopyXMLWithFieldsValues
     * @private
     * @todo BKM method implementation
     */
    _populateRequestCopyXMLWithFieldsValues : function() {

        try {

            var messageId;
            var messageIdTextbox = document.getElementById("messageIdTextbox");
            var creditorReferenceTextbox = document.getElementById("semCreditorReferenceTextbox");
            var creditorNameTextbox = document.getElementById("semCreditorNameTextbox");
            var debtorNameTextbox = document.getElementById("semDebtorNameTextbox");
            var debtorIBANTextbox = document.getElementById("semDebtorIBANTextbox");
            var debtorAgentBICTextbox = document.getElementById("semDebtorAgentBICTextbox");
            var transactionDatePicker = document.getElementById("semTransactionDatePicker");
            var amountTextbox = document.getElementById("semAmountTextbox");

            // Check if a message ID has been defined
            if (messageIdTextbox.value.length > 0) {

                // Get the user defined message ID
                messageId = messageIdTextbox.value;

            } else {

                // Automatically generated message ID
                messageId = SMETHRequestController._smethUtils.generateMessageId();
            }

            // Set the message ID
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgHdr/sem:MsgId",
                messageId);

            // Set the message ID for the mandate group header
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:GrpHdr/sem:RequestId",
                messageId);

            // Set the creation date and time
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:GrpHdr/sem:CreDtTm",
                SMETHRequestController._smethUtils.formatDateForSEPAmail(new Date()));

            // Set the creditor reference
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:Request/sem:CtrRef",
                creditorReferenceTextbox.value.trim());

            // Set the creditor name
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:Request/sem:Cdtr/p09:Nm",
                creditorNameTextbox.value.trim());

            // Set the debtor name
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:Request/sem:Dbtr/p09:Nm",
                debtorNameTextbox.value.trim());

            // Set the debtor IBAN
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:Request/sem:DbtrAcct/p09:Id/p09:IBAN",
                debtorIBANTextbox.value.trim());

            // Set the debtor financial institution ID
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:Request/sem:DbtrAgt/p09:FinInstnId/p09:BIC",
                debtorAgentBICTextbox.value.trim());

            // Set the transaction date
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:Request/sem:Trans/sem:TrsDate",
                transactionDatePicker.value);

            // Set the transaction amount currency
            SMETHRequestController._smethUtils.setNodeAttribute(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:Request/sem:Trans/sem:TrsAmt",
                "Ccy",
                SMETHRequestController._smethPreferences.getCharPref("defaultCurrency"));

            // Set the transaction amount
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:Request/sem:Trans/sem:TrsAmt",
                amountTextbox.value.trim());

        } catch(ex) {
            throw ex;
        }
    },

    /**
     *_populateRequestXMLWithFieldsValues function populates the XML Object with the form fields values
     *
     * @method _populateRequestXMLWithFieldsValues
     * @private
     */
    _populateRequestXMLWithFieldsValues: function() {

        try {

            var requestAmountTextbox = document.getElementById("semBdyRequestAmount");
            var requestPaymentTypeMenulist = document.getElementById("semBdyRequestPaymentType");
            var requestDataDatepicker = document.getElementById("semBdyRequestDataValue");
            var requestTitleTextbox = document.getElementById("semBdyRequestSubject");

             // Get the default Currency
            var defaultCurrency = SMETHRequestController._smethPreferences.getCharPref("defaultCurrency");

            // Set the "InstdAmt" value
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:CdtTrfTx/pain013:Amt/pain013:InstdAmt",
                requestAmountTextbox.value);

            // Set the currency
            SMETHRequestController._smethUtils.setNodeAttribute(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:CdtTrfTx/pain013:Amt/pain013:InstdAmt",
                "Ccy",
                defaultCurrency);

            // Set the "PmtMtd" value
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:PmtMtd",
                requestPaymentTypeMenulist.value);

            // Set the "ReqdExctnDt" value
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:ReqdExctnDt",
                requestDataDatepicker.value);

            // Set the "Title" value
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Complements/sem:Title",
                requestTitleTextbox.value);

        } catch(ex) {
            throw ex;
        }
    },

    /**
     *_populateTestRequestXMLWithFieldsValues function populates the XML Object with the form fields values
     *
     * @method _populateTestRequestXMLWithFieldsValues
     */
    _populateTestRequestXMLWithFieldsValues: function() {

        try {

            var requestTestIdTextbox = document.getElementById("requestTestIdTextbox");
            var listboxTestRequestText = document.getElementById("listboxTestRequestText");

            // Set the "TestId" value
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:SimpleTestRequest/sem:TestId",
                requestTestIdTextbox.value);

            // Get the specific node
            var node = this._contentXMLObject.evaluate("/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:SimpleTestRequest",
                this._contentXMLObject, SMETHRequestController._smethUtils.nsResolver,
                XPathResult.FIRST_ORDERED_NODE_TYPE, null);

            // sem:Text nodes
            var textNodes = this._contentXMLObject.getElementsByTagName("sem:Text");

            // Remove all text nodes before adding text content to the test message
            while(textNodes[0] != null) {
                node.singleNodeValue.removeChild(textNodes[0]);
            }

            // Set the "Text" values
            for (var i = 0; i < listboxTestRequestText.itemCount; i++) {

                // New element for text node
                var textNode = this._contentXMLObject.createElement('sem:Text');

                // Set the value of the node
                textNode.textContent = listboxTestRequestText.getItemAtIndex(i).value;

                // Add the text node to the container
                node.singleNodeValue.appendChild(textNode);
            }

        } catch(ex) {

            throw ex;
        }
    },

    /**
     *_populateGenericRequestXMLWithFieldsValues function populates the XML Object with the form fields values
     *
     * @method _populateGenericRequestXMLWithFieldsValues
     */
    _populateGenericRequestXMLWithFieldsValues: function() {

        try {

            var requestTestIdTextbox = document.getElementById("requestTestIdTextbox");
            var listboxTestRequestText = document.getElementById("listboxTestRequestText");

            // Set the "TestId" value
            SMETHRequestController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:SimpleTestRequest/sem:TestId",
                requestTestIdTextbox.value);

            // Get the specific node
            var node = this._contentXMLObject.evaluate("/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:SimpleTestRequest",
                this._contentXMLObject, SMETHRequestController._smethUtils.nsResolver,
                XPathResult.FIRST_ORDERED_NODE_TYPE, null);

            // sem:Text nodes
            var textNodes = this._contentXMLObject.getElementsByTagName("sem:Text");

            // Remove all text nodes before adding text content to the test message
            while(textNodes[0] != null) {
                node.singleNodeValue.removeChild(textNodes[0]);
            }

            // Set the "Text" values
            for (var i = 0; i < listboxTestRequestText.itemCount; i++) {

                // New element for text node
                var textNode = this._contentXMLObject.createElement('sem:Text');

                // Set the value of the node
                textNode.textContent = listboxTestRequestText.getItemAtIndex(i).value;

                // Add the text node to the container
                node.singleNodeValue.appendChild(textNode);
            }

        } catch(ex) {

            throw ex;
        }
    },

    /**
     * _initializeAttachmentUI function initialises the SEPAmail attachment user interface
     *
     * @method _initializeAttachmentUI
     * @param {Object} xmlObject XML DOM containing attachment
     */
    _initializeAttachmentUI : function(xmlObject) {

        try {

            // URL of XSL which transforms an XML document to its attachment UI
            var attachmentXSLUrl = SMETHRequestController._smethUtils.getCompositionAttachmentTransformationForMessageType(SMETHRequestController._smethMessageType);

            // Check if the XSL URL has been defined
            if (attachmentXSLUrl != null) {

                // Regenerate XML object
                var object = new DOMParser().parseFromString((new XMLSerializer()).serializeToString(xmlObject), "text/xml");

                // Transform the SEPAmail XML document
                var attachmentDocument = SMETHRequestController._transformXMLDocument(object, attachmentXSLUrl);

                // Get the content window
                var smethComposeBodyFormContainer = document.getElementById("smethComposeBodyFormContainer");

                // Appends the resulting transformation fragment first child to the sepamailUIContainer
                if (attachmentDocument.firstChild) {
                    smethComposeBodyFormContainer.appendChild(attachmentDocument.firstChild);
                }

            } else {
                SMETHRequestController._smethMessageHandler.info("XSL Url for SEPAmail attachment is not define in the configuration file");
            }

        } catch(ex) {
            throw ex;
        }
    },

    /**
     * _disableAttachmentUI function removes the attachment UI
     *
     * @method _disableAttachmentUI
     */
    _disableAttachmentUI : function() {

        // Get the content window
        var smethComposeBodyFormContainer = document.getElementById("smethComposeBodyFormContainer");

        // Check if the sepamailLogoBox is present
        if (null != document.getElementById("missiveAttachmentContainer")) {

            // Removes the sepamailLogoBox
            smethComposeBodyFormContainer.removeChild(document.getElementById("missiveAttachmentContainer"));
        }
    },

    /**
     * getCurrencyByCode function get currency by code
     *
     * @method _getCurrencyByCode
     * @param {String} aCurCode Currency code
     * @return {String} Currency
     */
    _getCurrencyByCode : function (aCurCode) {

        try {

            switch(aCurCode) {

                case "EUR":
                    return "\u0404(euros)";

                case "DOL":
                    return "$(dollar)";

                default:
                    return "\u0404(euros)";
            }

        } catch (ex) {
            throw ex;
        }
    },

    /**
     * _transformXMLDocument function transforms the parametered XML document using the paramentered XSL file URL
     *
     * @method _transformXMLDocument
     * @param {XML} anXML XML document to transform
     * @param {String} anXSLUrl XSL url
     * @return {XML} Transformed XML document
     */
    _transformXMLDocument : function (anXML, anXSLUrl) {

        try {

            // Decalre the XMLHttpRequest to load the XSL
            var xmlHttpRequest = new XMLHttpRequest();

            // Send request for the XSL document
            xmlHttpRequest.open('GET', anXSLUrl, false);
            xmlHttpRequest.send();

            // Get the XSL document object
            var xslDocument = xmlHttpRequest.responseXML;

            // Instatiate the XSLT Processor
            var xsltProcessor= Components.classes["@mozilla.org/document-transformer;1?type=xslt"]
                                         .createInstance(Components.interfaces.nsIXSLTProcessor);

            // Import the XSL document object in the XSLT processor
            xsltProcessor.importStylesheet(xslDocument);

            // Declare an empty XML document that will own the fragment
            var resultDocumentOwner = document.implementation.createDocument("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "", null);

            // Get the resulting transformation fragment
            var resultFragment = xsltProcessor.transformToFragment(anXML,resultDocumentOwner);

            // Append the result fragment to its fragment owner
            resultDocumentOwner.appendChild(resultFragment);

            return resultDocumentOwner;

        } catch(ex) {
            throw ex;
        }
    }
}
