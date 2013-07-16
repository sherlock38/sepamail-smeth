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
 * @file SMETHReportController.js
 * @mvc controller
 * @version 1212
 * @since 1210
 * @author Ammit Heeramun
 * @description SMETHReportController is the class that is responsible for the composition and sending of SEPAmail reports(Simple Test and Activation)
 */

/**
 * SMETHMessageHandler class contain functions to handle info, error, warning and exceptions messages
 *
 * @include SMETHMessageHandler.js
 */
Components.utils.import("resource://smeth/smethlib/SMETHMessageHandler.js");

/**
 * @description Strict mode for scripts
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Functions_and_function_scope/Strict_mode
 */
"use strict";

/**
 * SMETHReportController class defines all the events that is related to the compose report window
 *
 * @class SMETHReportController
 *
 */
var SMETHReportController = {

   /**
    * Declare the SMETHMessageHandler class
    *
    * @attribute _smethMessageHandler
    * @private
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
    * Smeth report status
    *
    * @attribute _smethReportStatus
    * @private
    * @default null
    */
    _smethReportStatus : null,

   /**
    * Smeth utils object
    *
    * @attribute _smethUtils
    * @private
    * @default null
    */
    _smethUtils : null,

    /**
     *_init fucntion Initialises all the objects that will be used in "SMETHReportController"
     *
     * @method _init
     * @private
     * @see https://developer.mozilla.org/en-US/docs/Code_snippets/Preferences#XPCOM_interfaces_for_preferences_system
     */
    _init:function() {

        // Instantiate the SMETHUtils class
        this._smethUtils = new SMETHUtils(window);

        // Initialise the preference object
        // @see https://developer.mozilla.org/en-US/docs/Code_snippets/Preferences#XPCOM_interfaces_for_preferences_system
        this._smethPreferences = Components.classes["@mozilla.org/preferences-service;1"]
                                           .getService(Components.interfaces.nsIPrefService)
                                           .getBranch("extensions.smeth.");

        this._smethPreferences.QueryInterface(Components.interfaces.nsIPrefBranch2);
    },

    /**
     * AttachDocumentEventHandler event handles the attachement of SEPAmail Documents
     *
     * @method AttachDocumentEventHandler
     */
    AttachDocumentEventHandler : function() {

        try {

            switch(SMETHReportController._smethMessageType) {

                case "simple.report@test":
                    this._appendAttachmentToTestXmlDocument(SMETHReportController._smethUtils.getFile("Open document to attach"));
                    break;

                default:
                    SMETHReportController._smethMessageHandler.info("Attachments not yet handled for other type of reports");
                    break;
            }

        } catch(ex) {
            SMETHReportController._smethMessageHandler.exception(ex);
        }
    },

    /**
     * NotifyComposeBodyReady event notifies when the compose body is ready
     *
     * @method NotifyComposeBodyReady
     */
    NotifyComposeBodyReady: function() {

        try {

            switch(SMETHReportController._smethMessageType) {

                case "activation.report@payment.activation":

                    // Get the report status XPath
                    var reportStatusXpath = this._smethPreferences.getCharPref("missive.activation.report.statusXpath");

                    // Get the SEPAmail message type using Xpath
                    this._smethReportStatus = this._contentXMLObject.evaluate(reportStatusXpath, this._contentXMLObject, SMETHReportController._smethUtils.nsResolver, XPathResult.STRING_TYPE,null).stringValue;

                    break;

                default:
                    break;
            }

            // Transform the SEPAmail XML document
            var sepamailComposeBody = this.transformXMLDocument(this._contentXMLObject,
                SMETHReportController._smethUtils.getCompositionTransformationForMessageType(SMETHReportController._smethMessageType));

            // Get the content window
            var smethComposeBodyFormContainer = document.getElementById("smethComposeBodyFormContainer");

            // Set translated labels for SMETH UI controls
            sepamailComposeBody = SMETHReportController._smethUtils.translateSEPAmailDocument(sepamailComposeBody, SEMTHReportComposeWindowTranslations);

            // Append the child to the content frame
            smethComposeBodyFormContainer.appendChild(sepamailComposeBody.firstChild);

            // Initialise attachment UI
            this._initializeAttachmentUI(this._contentXMLObject);

        } catch(ex) {
            SMETHReportController._smethMessageHandler.exception(ex);
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
            SMETHReportController._smethUtils.setSendDateTime(this._contentXMLObject);

            // Set the message expiry of the request
            SMETHReportController._smethUtils.setMessageExpiry(this._contentXMLObject);

            // Polulate the values of the missive header
            this._populateMissiveHeader();

            // Populate the QXBANS
            if (SMETHReportController._smethUtils.populateQXBAN(gMsgCompose, document, this._contentXMLObject)) {

                // Get the mode for the message type
                var mode = SMETHReportController._smethUtils.getMessageTypeMode(SMETHReportController._smethMessageType);

                // Get the encrypt checkbox menu item
                var menuSecurityEncryptRequire = document.getElementById("menu_securityEncryptRequire2");

                // Get the sign checkbox menu item
                var menuSecuritySign = document.getElementById("menu_securitySign2");

                // Check if we are in the production mode
                if (mode == 'production') {

                    // Check if the current email is signed and encrypted
                    if (!(menuSecurityEncryptRequire.checked && menuSecuritySign.checked)) {

                        // Show error message
                        SMETHReportController._smethUtils.showAlert('SMETH',
                            SMETHReportController._smethUtils.messageBundle.getLocalisedMessage('ecosystem.mode.error'));

                        // Block message sending
                        anEvent.preventDefault();
                    }

                } else {

                    if (!(menuSecurityEncryptRequire.checked && menuSecuritySign.checked)) {

                        // Display message about outgoing email being unsigned and unencrypted since we are in test mode
                        SMETHReportController._smethUtils.showAlert('SMETH',
                            SMETHReportController._smethUtils.messageBundle.getLocalisedMessage('ecosystem.mode.warning'));
                    }
                }

                switch(SMETHReportController._smethMessageType) {

                    case "activation.report@payment.activation":

                        // populate the XML object with the forms values
                        this._populateReportXMLWithFieldsValues();
                        break;

                    case "simple.report@test":

                        // populate the XML object with the forms values
                        this._populateTestReportXMLWithFieldsValues();
                        break;

                    case "rapport@direct.debit":

                        // populate the XML object with the forms values
                        this._populateMandateReportXMLWithFieldsValues();
                        break;

                    default:
                        break;
                }

                // Set the text content of the mail being sent
                editor.document.body.textContent = '<?xml version="1.0" encoding="UTF-8"?>' +
                    (new XMLSerializer()).serializeToString(this._contentXMLObject);

            } else {
                anEvent.preventDefault();
            }

            editor.endTransaction();

        } catch(ex) {
            SMETHReportController._smethMessageHandler.exception(ex);
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

        switch (action) {

            case "deleteAllFromTest":

                var dataNodes = this._contentXMLObject.getElementsByTagName("sem:Data");
                var container = this._contentXMLObject.evaluate("/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:SimpleTestReport",
                    SMETHReportController._smethUtils.nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

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
                    SMETHReportController._disableAttachmentUI();

                    // Initialize the attachment UI
                    SMETHReportController._initializeAttachmentUI(SMETHReportController._contentXMLObject);

                } catch (e) {
                    throw e;
                }

                break;

            default:
                break;

        }
    },

    /**
     * _appendAttachmentToTestXmlDocument appends attachment to the XML document of a test report
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
                    var dataNode = SMETHReportController._contentXMLObject.createElement('sem:Data');
                    dataNode.appendChild(SMETHReportController._contentXMLObject.createCDATASection(window.btoa(data)));

                    // Get the container node
                    var containerNode = SMETHReportController._contentXMLObject.evaluate("/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:SimpleTestReport",
                        SMETHReportController._contentXMLObject, SMETHReportController._smethUtils.nsResolver,
                        XPathResult.FIRST_ORDERED_NODE_TYPE, null);

                    // Append the data node to the container node
                    containerNode.singleNodeValue.appendChild(dataNode);

                    // Disable the attachment UI
                    SMETHReportController._disableAttachmentUI();

                    // Initialize the attachment UI
                    SMETHReportController._initializeAttachmentUI(SMETHReportController._contentXMLObject);

                });
            }

        } catch(ex) {
            SMETHRequestController._smethMessageHandler.exception(ex);
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
     * _initializeAttachmentUI function initialises the SEPAmail attachment user interface for report messages
     *
     * @method _initializeAttachmentUI
     * @param {Object} xmlObject XML DOM containing attachment
     */
    _initializeAttachmentUI : function(xmlObject) {

        try {

            // URL of XSL which transforms an XML document to its attachment UI
            var attachmentXSLUrl = SMETHReportController._smethUtils.getCompositionAttachmentTransformationForMessageType(SMETHReportController._smethMessageType);

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

                // Show the attach button
                document.getElementById("button-attach").hidden = false;

            } else {

                // Hide the attach button since we are not adding attachments to the message
                document.getElementById("button-attach").hidden = true;
            }

        } catch(ex) {
            throw ex;
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
            SMETHReportController._smethUtils.setMissiveId(this._contentXMLObject);

        } else {

            // Check if a missive ID has been defined
            if (missiveIdTextbox.value.length > 0) {

                // Set the user generated missive ID
                SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                    "/sem:Missive/sem:sepamail_missive_001/sem:MsvId", missiveIdTextbox.value);

            } else {

                // Automatically generated missive ID
                SMETHReportController._smethUtils.setMissiveId(this._contentXMLObject);
            }
        }

        // Set the missive type
        if (typeMissiveTextbox != null) {
            SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvTyp", typeMissiveTextbox.value);
        }

        // Set the missive order
        if (orderMissiveTextbox != null) {
            SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvOrd", orderMissiveTextbox.value);
        }

        // Set the missive priority
        if (priorityTextbox != null) {
            SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvPri", priorityTextbox.value);
        }

        // Check if the message ID textbox is defined
        if (messageIdTextbox == null) {

            // Automatically generated message ID
            SMETHReportController._smethUtils.setMessageId(this._contentXMLObject);

        } else {

            // Check if a message ID has been defined
            if (messageIdTextbox.value.length > 0) {

                // Set the user generated message ID
                SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                    "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgHdr/sem:MsgId",
                    messageIdTextbox.value);

            } else {

                // Automatically generated message ID
                SMETHReportController._smethUtils.setMessageId(this._contentXMLObject);
            }
        }
    },

    /**
     *_populateReportXMLWithFieldsValues function populates the XML Object with the form fields values
     *
     * @method _populateReportXMLWithFieldsValues
     * @private
     */
    _populateReportXMLWithFieldsValues: function() {

        try {

            var reportAmountTextbox = document.getElementById("semBdyReportAmount");
            var reportPaymentTypeMenulist = document.getElementById("semBdyReportPaymentMethod");
            var reportRequestDataDatepicker = document.getElementById("semBdyReportDataValue");

            // Date and time value for pain attributes
            var painAttributeDateTime = SMETHReportController._smethUtils.formatDateForSEPAmail(new Date());

            // Set the date and time for pain attributes
            SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:Header/sem:CreDtTm",
                painAttributeDateTime);
            SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:GrpHdr/pain014:CreDtTm",
                painAttributeDateTime);

            switch (this._smethReportStatus) {

                case "ACSP":

                    // Set the "InstdAmt" value
                    SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                        "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:OrgnlPmtInfAndSts/pain014:TxInfAndSts/pain014:OrgnlTxRef/pain014:Amt/pain014:InstdAmt",
                        reportAmountTextbox.value);

                    // Set the "PmtMtd" value
                    SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                        "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:OrgnlPmtInfAndSts/pain014:TxInfAndSts/pain014:OrgnlTxRef/pain014:PmtMtd",
                        reportPaymentTypeMenulist.value);

                    // Set the "ReqdExctnDt" value
                    SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                        "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:OrgnlPmtInfAndSts/pain014:TxInfAndSts/pain014:OrgnlTxRef/pain014:ReqdExctnDt",
                        reportRequestDataDatepicker.value);

                    break;

                case "RJCT":

                    // Set the "InstdAmt" value
                    SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                        "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:OrgnlPmtInfAndSts/pain014:TxInfAndSts/pain014:OrgnlTxRef/pain014:Amt/pain014:InstdAmt",
                        reportAmountTextbox.value);

                    // Set the "PmtMtd" value
                    SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                        "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:OrgnlPmtInfAndSts/pain014:TxInfAndSts/pain014:OrgnlTxRef/pain014:PmtMtd",
                        reportPaymentTypeMenulist.value);

                    // Set the "ReqdExctnDt" value
                    SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                        "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:OrgnlPmtInfAndSts/pain014:TxInfAndSts/pain014:OrgnlTxRef/pain014:ReqdExctnDt",
                        reportRequestDataDatepicker.value);

                    break;

                default:

                    // Current report status has not yet been handled
                    throw new Error("Report for the message status '" + this._smethReportStatus + "' has not been handled yet.");
            }

        } catch(ex) {
            throw ex;
        }
    },

    /**
     * _populateMandateReportXMLWithFieldsValues function populates the XML object with form fields' values
     *
     * @method _populateMandateReportXMLWithFieldsValues
     * @private
     * @todo BKM method implementation
     */
    _populateMandateReportXMLWithFieldsValues : function() {

        try {

            var messageId;
            var messageIdTextbox = document.getElementById("messageIdTextbox");
            var rejectionCodeTextbox = document.getElementById("semRejectionCodeTextbox");
            var rejectionInfoTextbox = document.getElementById("semRejectionInfoTextbox");
            var changeBankDetailsCheckbox = document.getElementById("changeBankDetailsCheckbox");
            var newAgentTextbox = document.getElementById("semNewAgentTextbox");
            var newIBANTextbox = document.getElementById("semNewIBANTextbox");

            // Check if a message ID has been defined
            if (messageIdTextbox.value.length > 0) {

                // Get the user defined message ID
                messageId = messageIdTextbox.value;

            } else {

                // Automatically generated message ID
                messageId = SMETHReportController._smethUtils.generateMessageId();
            }

            // Set the message ID
            SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgHdr/sem:MsgId",
                messageId);

            // Set the message ID for the mandate group header
            SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001/sem:Report/p012:GrpHdr/p012:MsgId",
                messageId);

            // Set the creation date and time
            SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001/sem:Report/p012:GrpHdr/p012:CreDtTm",
                SMETHRequestController._smethUtils.formatDateForSEPAmail(new Date()));

            // Check if we have a rejected request
            if (rejectionCodeTextbox != null) {

                // Set the rejection code
                SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                    "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001/sem:Report/p012:UndrlygAccptncDtls/p012:AccptncRslt/p012:RjctRsn/p012:Cd",
                    rejectionCodeTextbox.value.trim());

                // Set the rejection info
                SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                    "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001/sem:Report/p012:UndrlygAccptncDtls/p012:AccptncRslt/p012:AddtlRjctRsnInf",
                    rejectionInfoTextbox.value.trim());
            }

            // Check if user is changing bank details
            if (changeBankDetailsCheckbox.checked) {

                // New element for extension node
                var extensionNode = this._contentXMLObject.createElement('sem:DSExt');

                // Create node for new agent
                var agentNode = this._contentXMLObject.createElement('sem:BIC');
                agentNode.textContent = newAgentTextbox.value.trim();

                // Create node for new IBAN
                var ibanNode = this._contentXMLObject.createElement('sem:IBAN');
                ibanNode.textContent = newIBANTextbox.value.trim();

                // Append the agent and IBAN nodes to the extension node
                extensionNode.appendChild(agentNode);
                extensionNode.appendChild(ibanNode);

                // Get the container node of the extension node
                var exTContainerNode = this._contentXMLObject.evaluate("/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001",
                    this._contentXMLObject, SMETHReportController._smethUtils.nsResolver,
                    XPathResult.FIRST_ORDERED_NODE_TYPE, null);

                // Add the extension node to the container
                exTContainerNode.singleNodeValue.appendChild(extensionNode);
            }

        } catch(ex) {
            throw ex;
        }
    },

    /**
     * _populateTestReportXMLWithFieldsValues function populates the XML Object with the form fields values
     *
     * @method _populateTestReportXMLWithFieldsValues
     * @private
     */
    _populateTestReportXMLWithFieldsValues : function() {

        try {

            var requestTestIdTextbox = document.getElementById("requestTestIdTextbox");
            var listboxTestRequestText = document.getElementById("listboxTestRequestText");

            // Set the "TestId" value
            SMETHReportController._smethUtils.setNodeValue(this._contentXMLObject,
                "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:SimpleTestReport/sem:TestId",
                requestTestIdTextbox.value);

            // Get the specific node
            var node = this._contentXMLObject.evaluate("/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:SimpleTestReport",
                this._contentXMLObject, SMETHReportController._smethUtils.nsResolver,
                XPathResult.FIRST_ORDERED_NODE_TYPE, null);

            // sem:Text nodes
            var textNodes = this._contentXMLObject.getElementsByTagName("sem:Text");

            // Remove all sem:Text nodes from the report
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

            // Re-create data nodes so that they contain CDDATA elements
            var dataNodes = this._contentXMLObject.getElementsByTagName("sem:Data");

            var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                           .getService(Components.interfaces.nsIConsoleService);

            // Scan the list of data nodes and recreate data nodes with CDDATA elements
            for (var j = 0; j < dataNodes.length; j++) {
                consoleService.logStringMessage(dataNodes[j].textContent);
                var currentData = dataNodes[j].textContent;
                dataNodes[j].textContent = null;
                dataNodes[j].appendChild(this._contentXMLObject.createCDATASection(currentData));
            }

        } catch(ex) {

            throw ex;
        }
    },

    /**
     * isSEPAmailReport function check if the content of a body contains a valid report missive message
     *
     * @method isSEPAmailReport
     * @param {String} aContent Mail body content
     * @return {Boolean} Wether the content is of type SEPAmail report
     * @todo BKM - Refactorise with one unified method for determinig message type
     */
    isSEPAmailReport: function(aContent) {

        try {
            // Initialise the default objects
            this._init();

            // Initialise the content object
            this._content = aContent;

            // Parse the content XML
            this._contentXMLObject = new DOMParser().parseFromString(aContent, "text/xml");

            // Verify for any parse error
            if ("parsererror" !=  this._contentXMLObject.documentElement.nodeName) {

                // List of request messages
                var validMessages = new Array("activation.report@payment.activation", "simple.report@test",
                    "rapport@direct.debit");

                // Get the message type xpath
                var smethPrefMissiveMsgTypXpath = this._smethPreferences.getCharPref("missive.prefMsgTypXpath");

                // Get the SEPAmail message type using Xpath
                this._smethMessageType = this._contentXMLObject.evaluate(smethPrefMissiveMsgTypXpath,
                    this._contentXMLObject, SMETHReportController._smethUtils.nsResolver, XPathResult.STRING_TYPE,
                    null).stringValue;

                // Check whether the xml is of type report
                return validMessages.indexOf(this._smethMessageType) > -1;

            } else {
                return false;
            }

            return false;

        } catch(ex) {
            SMETHReportController._smethMessageHandler.exception(ex);
        }
    },

    /**
     * transformXMLDocument function transforms the parametered XML document using the paramentered XSL file URL
     *
     * @method transformXMLDocument
     * @param {XML} anXML Document
     * @param {String} anXSLUrl String
     * @return {XML} Transformed XML document
     * @see https://developer.mozilla.org/en-US/docs/Using_the_Mozilla_JavaScript_interface_to_XSL_Transformations#Using_XSLTProcessor_from_XPCOM_components
     */
    transformXMLDocument : function (anXML, anXSLUrl) {

        try {
            // Decalre the XMLHttpRequest to load the XSL
            var xmlHttpRequest = new XMLHttpRequest();

            // Send request for the XSL document
            xmlHttpRequest.open('GET', anXSLUrl, false);
            xmlHttpRequest.send();

            // Get the XSL document object
            var xslDocument = xmlHttpRequest.responseXML;

            // Instatiate the XSLT Processor
            // @see https://developer.mozilla.org/en-US/docs/Using_the_Mozilla_JavaScript_interface_to_XSL_Transformations#Using_XSLTProcessor_from_XPCOM_components
            var xsltProcessor= Components.classes["@mozilla.org/document-transformer;1?type=xslt"]
                                .createInstance(Components.interfaces.nsIXSLTProcessor);

            // Import the XSL document object in the XSLT processor
            xsltProcessor.importStylesheet(xslDocument);

            // Declare an empty XML document that will own the fragment
            var resultDocumentOwner = document.implementation.createDocument("", "", null);

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
