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
 * @description SMETHAcknowledgementController class sends acknowledgement responses for nominal missive requests
 */

/**
 * SMETHMessageHandler class contain functions to handle info, error, warning and exceptions messages
 *
 * @include SMETHMessageHandler.js
 * @type Object
 */
Components.utils.import("resource://smeth/smethlib/SMETHMessageHandler.js");

/**
 * SMETHUtils class contains all the useful functions that will be used in SMETH
 *
 * @include SMETHUtils.js
 * @type Object
 */
Components.utils.import("resource://smeth/smethlib/SMETHUtils.js");

/**
 * @description Strict mode for scripts
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Functions_and_function_scope/Strict_mode
 */
"use strict";

/**
 * SMETHAcknowledgementController class sends acknowledgement responses for nominal missive requests
 *
 * @class SMETHAcknowledgementController
 */
var SMETHAcknowledgementController = {

    /**
     * Declare the XPath for acknowledgement container
     *
     * @attribute _ackContainerPath
     * @private
     */
    _ackContainerPath : '/sem:Missive/sem:sepamail_missive_001/sem:MsvAcq',

    /**
     * Declare the acknowledgement missive XML document object model
     *
     * @attribute _ackMissiveXmlDom
     * @private
     * @default null
     */
    _ackMissiveXmlDom : null,

    /**
     * Declare the mail content string
     *
     * @attribute _content
     * @private
     * @default null
     */
    _content : null,

    /**
     * Declare the mail header object
     *
     * @attribute _header
     * @private
     * @default null
     */
    _header : null,

    /**
     * Declare the SMETHMessageHandler class
     *
     * @attribute _smethMessageHandler
     * @private
     */
    _smethMessageHandler : new SMETHMessageHandler(window),

    /**
     * Declare the flag that indicates whether the smeth preferences have been loaded to "false"
     *
     * @attribute _smethPreferencesHasBeenInitialised
     * @private
     * @default false
     */
    _smethPreferencesHasBeenInitialised : false,

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
     * Declare the missive mail object
     *
     * @attribute missiveMailObject
     * @default null
     */
    missiveMailObject : null,

    /**
     * Declare the missive message type
     *
     * @attribute missiveMessageType
     * @default null
     */
    missiveMessageType : null,

    /**
     * Generate the acknowledgement missive as per the message type
     *
     * @method generateAcknowledgementMissive
     * @param {Object} account Account by which the acknowledgement missive XML will be sent
     * @return {XML} Acknowledgement missive XML
     */
    generateAcknowledgementMissive : function(account) {

        // Initialise SMETH preferences
        this._initSmethPreferences();

        // Get default settings for the account and message type
        var acknowledgementSettings = this._getAccountDefaults(account.key, this.missiveMessageType);

        // Check if default values setting was obtained
        if (acknowledgementSettings != null) {
            return this._getAckMissiveXml(this._smethPreferences.getCharPref("acknowledgement.XSLUrl"),
                acknowledgementSettings.defaults, this.missiveMailObject.sepamailXMLObject);
        } else {
            return this._getAckMissiveXml(this._smethPreferences.getCharPref("acknowledgement.XSLUrl"),
                {'status':'ACK','retClass':'','subject':'','detail':'','description':''},
                this.missiveMailObject.sepamailXMLObject);
        }
    },

    /**
     * Send missive message receipt acknowledgement
     *
     * @method handleManualAcknowledgement
     * @see https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/NsIMsgCompFields
     * @see http://doxygen.db48x.net/mozilla-full/html/da/d05/interfacensIMsgComposeParams.html
     * @see https://developer.mozilla.org/en-US/docs/Extensions/Thunderbird/HowTos/Common_Thunderbird_Use_Cases/Compose_New_Message
     */
    handleManualAcknowledgement : function() {

        // Initialise SMETH preferences
        this._initSmethPreferences();

        try {

            // Get the account that will be used to send the acknowledgement missive XML
            var account = SMETHAcknowledgementController._smethUtils.getAccountByMsgHeader(this.missiveMailObject.header);

            // Compose service fields instance
            // @see https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/NsIMsgCompFields
            var composeFields = Components.classes["@mozilla.org/messengercompose/composefields;1"]
                                          .createInstance(Components.interfaces.nsIMsgCompFields);

            composeFields.body = (new XMLSerializer()).serializeToString(this.generateAcknowledgementMissive(account));
            composeFields.characterSet = "UTF-8";
            composeFields.from = account.defaultIdentity.email;
            composeFields.messageId = this.missiveMailObject.header.messageId;
            composeFields.replyTo = account.defaultIdentity.replyTo;

            // Check if the subject is the default SEPAmail subject
            if (this.missiveMailObject.header.subject == SMETHTranslations.mailSubject) {
                composeFields.subject = '';
            } else {
                composeFields.subject = this.missiveMailObject.header.subject;
            }

            composeFields.to = this.missiveMailObject.header.mime2DecodedAuthor;

            // Message compose parameters instance
            // @see http://doxygen.db48x.net/mozilla-full/html/da/d05/interfacensIMsgComposeParams.html
            var msgComposeParams = Components.classes["@mozilla.org/messengercompose/composeparams;1"]
                                             .createInstance(Components.interfaces.nsIMsgComposeParams);

            // Define the message composition parameters
            msgComposeParams.composeFields = composeFields;
            msgComposeParams.identity = account.defaultIdentity;
            msgComposeParams.format = Components.interfaces.nsIMsgCompFormat.PlainText
            msgComposeParams.type = Components.interfaces.nsIMsgCompType.New;

            // Message compose service
            // @see https://developer.mozilla.org/en-US/docs/Extensions/Thunderbird/HowTos/Common_Thunderbird_Use_Cases/Compose_New_Message
            var msgComposeService = Components.classes["@mozilla.org/messengercompose;1"]
                                              .getService(Components.interfaces.nsIMsgComposeService);

            // Remove vCards and signatures from missive email
            this._smethUtils.removeEmailExtras(msgComposeService);

            // Open the acknowledgement message
            msgComposeService.OpenComposeWindowWithParams(null, msgComposeParams);

        } catch (e) {
            this._smethMessageHandler.exception(e);
        }
    },

    /**
     * Check if the content of a body contains a valid acknowledgement missive message
     *
     * @method isAcknowledgementMissiveMessage
     * @param {String} content Message content
     * @return {Boolean} Whether the message is a valid acknowledgement missive message
     */
    isAcknowledgementMissiveMessage : function(content) {

        // Initialise SMETH preferences
        this._initSmethPreferences();

        try {

            // Parse content to XML document object model
            var contentXmlDom = new DOMParser().parseFromString(content, "text/xml");

            // Check if content is a valid XML
            if (contentXmlDom.documentElement.nodeName == "parsererror") {

                // Content is not a valid XML
                return false;

            } else {

                // Content is valid XML, so we check for message type
                var msgTypeNodeResult = contentXmlDom.evaluate("/sem:Missive/sem:sepamail_missive_001/sem:MsvTyp",
                    contentXmlDom, this._smethUtils.nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

                // Check if result for message type query was obtained
                if (msgTypeNodeResult != null) {

                    // Check the message type
                    if (msgTypeNodeResult.singleNodeValue.textContent == 'Acquittement') {
                        this._ackMissiveXmlDom = contentXmlDom;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }

        } catch (e) {
            this._smethMessageHandler.exception(e);
        }

        return false;
    },

    /**
     * Send automatic acknowledgement for a given mail header and content
     *
     * @method sendAutomaticAcknowledgement
     * @param {Object} aMailHeader Mail header object
     * @param {String} content Mail content
     */
    sendAutomaticAcknowledgement : function(aMailHeader, content) {

        try {

            // Get message body
            SMETHAcknowledgementController._content = content;

            // Message header
            SMETHAcknowledgementController._header = aMailHeader;

            // Get the account that will be used to send the acknowledgement missive XML
            var account = SMETHAcknowledgementController._smethUtils.getAccountByMsgHeader(aMailHeader);

            // Check if new email is a SEPAmail email
            if (SMETHAcknowledgementController._smethUtils.isSEPAmail(SMETHAcknowledgementController._content)) {

                // Parse content to XML document object model
                var sepaMailXmlDom = new DOMParser().parseFromString(SMETHAcknowledgementController._content,
                    "text/xml");

                // SEPAmail message type
                var sepaMailMessageType = SMETHAcknowledgementController._smethUtils.getSEPAmailMessageType(sepaMailXmlDom);

                // Message types string
                var rawMessageTypes = this._smethPreferences.getCharPref('acknowledgement.types').split(',');

                // Array of message types for which acknowledgements are sent
                var messageTypes = new Array();

                // Fill in the values for message types
                for (var i = 0; i < rawMessageTypes.length; i++) {
                    messageTypes.push(rawMessageTypes[i].trim());
                }

                // Check if acknowledgements are sent for the current message type
                if (messageTypes.indexOf(sepaMailMessageType) > -1) {

                    // Get settings for the account and message type
                    var acknowledgementSettings = this._getAccountDefaults(account.key, sepaMailMessageType);

                    // Check if settings were obtained
                    if (acknowledgementSettings != null) {

                        // Check if we are sending acknowledgements automatically
                        if (acknowledgementSettings.automatic == '1') {

                            // Send acknowledgement missive XML
                            SMETHAcknowledgementController._handleAutomaticAcknowledgement(
                                SMETHAcknowledgementController._smethPreferences.getCharPref("acknowledgement.XSLUrl"),
                                acknowledgementSettings.defaults, sepaMailXmlDom, aMailHeader, account);

                        }
                    }
                }

            } else {

                // We do not handle any other kinds of emails
            }

        } catch (e) {
            SMETHAcknowledgementController._smethMessageHandler.exception(e);
        }
    },

    /**
     * Get default settings for the given account key and message type
     *
     * @method _getAccountDefaults
     * @param {String} accountKey Key associated to the account by which the acknowledgement missive will be sent
     * @param {String} messageType SEPAmail message type
     * @return {Object} Acknowledgement default settings object
     */
    _getAccountDefaults : function(accountKey, messageType) {

        // Acknowledgement settings object
        var smethAcknowledgementSettings = JSON.parse(this._smethPreferences.getCharPref('acknowledgement.settings'));

        // Scan the array of settings that have already been configured
        for (var i = 0; i < smethAcknowledgementSettings.length; i++) {

            // Current account settings
            var currentAccountSettings = smethAcknowledgementSettings[i];

            // Check if we are at the required account settings
            if (currentAccountSettings.account == accountKey) {

                // Scan the list of message type settings for the current account
                for (var j = 0; j < currentAccountSettings.settings.length; j++) {

                    // Current message type settings
                    var currentMessageTypeSettings = currentAccountSettings.settings[j];

                    // Check if we are the required message type
                    if (currentMessageTypeSettings.type == messageType) {

                        // We have the required acknowledgement settings
                        return currentMessageTypeSettings;
                    }
                }

                // Break scanning loop since we have found the required account
                break;
            }
        }

        return null;
    },

    /**
     * Generate the acknowledgement missive XML
     *
     * @method _getAckMissiveXml
     * @param {String} transformerUrl URL of the XSL file that converts a nominal missive to an acknowledgement missive
     * @param {Object} defaults Default values of an acknowledgement missive
     * @param {XML} missiveXmlDom SEPAmail missive XML document object model
     * @return {XML} Acknowledgement missive XML
     * @see https://developer.mozilla.org/en-US/docs/Using_the_Mozilla_JavaScript_interface_to_XSL_Transformations#Using_XSLTProcessor_from_XPCOM_components
     */
    _getAckMissiveXml : function(transformerUrl, defaults, missiveXmlDom) {

        try {

            // XMLHttpRequest instance which loads the XSL transformer
            var xmlHttpRequest = new XMLHttpRequest();

            // Load the XSL transformer
            xmlHttpRequest.open('GET', transformerUrl, false);
            xmlHttpRequest.send();

            // XSL document object
            var xslDocument = xmlHttpRequest.responseXML;

            // Instatiate the XSLT Processor
            // @see https://developer.mozilla.org/en-US/docs/Using_the_Mozilla_JavaScript_interface_to_XSL_Transformations#Using_XSLTProcessor_from_XPCOM_components
            var xsltProcessor= Components.classes["@mozilla.org/document-transformer;1?type=xslt"]
                                         .createInstance(Components.interfaces.nsIXSLTProcessor);
            xsltProcessor.importStylesheet(xslDocument);

            // Acknowledgement document
            var acknowledgementDoc = document.implementation.createDocument(null, "", null);

            // Get acknowledgement missive fragment
            var acknowledgementFragment = xsltProcessor.transformToFragment(missiveXmlDom, acknowledgementDoc);

            // Append the acknowledgement fragment to acknowledgement document owner
            acknowledgementDoc.appendChild(acknowledgementFragment);

            // Get the container for acknowledgement missive details elements
            var ackDetailsContainer = acknowledgementDoc.evaluate(SMETHAcknowledgementController._ackContainerPath,
                acknowledgementDoc, SMETHAcknowledgementController._smethUtils.nsResolver,
                XPathResult.FIRST_ORDERED_NODE_TYPE, null);

            // Check if the container was found
            if (ackDetailsContainer != null) {

                // Set the date and time at which the message is being sent
                SMETHAcknowledgementController._smethUtils.setSendDateTime(acknowledgementDoc);

                // Set the default status of the acknowledgement missive document
                SMETHAcknowledgementController._setNodeInContainer(acknowledgementDoc,
                    ackDetailsContainer.singleNodeValue, "AcqSta", defaults.status);

                // Set the default code of the acknowledgement missive document
                SMETHAcknowledgementController._setNodeInContainer(acknowledgementDoc,
                    ackDetailsContainer.singleNodeValue, "AcqCla", defaults.retClass);

                // Set the default subject of the acknowledgement missive document
                SMETHAcknowledgementController._setNodeInContainer(acknowledgementDoc,
                    ackDetailsContainer.singleNodeValue, "AcqSub", defaults.subject);

                // Set the default detail of the acknowledgement missive document
                SMETHAcknowledgementController._setNodeInContainer(acknowledgementDoc,
                    ackDetailsContainer.singleNodeValue, "AcqDet", defaults.detail);

                // Set the default description of the acknowledgement missive document
                if (defaults.description.trim().length > 0) {
                    SMETHAcknowledgementController._setNodeInContainer(acknowledgementDoc,
                        ackDetailsContainer.singleNodeValue, "AcqDes", defaults.description.trim());
                }

            } else {

                // Current message type has not yet been handled
                throw new Error("Acknowledgement details container element could not be found.");
            }

            // Acknowledgement missive XML
            return acknowledgementDoc;

        } catch (e) {
            throw e;
        }
    },

    /**
     * Get default settings for acknowlegement missive XML as per specified ecosystem
     *
     * @method _getDefaults
     * @param {String} ecosystem SEPAmail eco-system name
     * @return {Object} Default acknowlegement settings object
     */
    _getDefaults : function(ecosystem) {

        var defaults;

        switch (ecosystem) {

            case "activation.request@payment.activation":

                // Acknowledgement missive defaults
                defaults = {
                    code : SMETHAcknowledgementController._smethPreferences.getCharPref("acknowledgement.payment.defaults.code"),
                    detail : SMETHAcknowledgementController._smethPreferences.getCharPref("acknowledgement.payment.defaults.detail"),
                    status : SMETHAcknowledgementController._smethPreferences.getCharPref("acknowledgement.payment.defaults.status"),
                    subject : SMETHAcknowledgementController._smethPreferences.getCharPref("acknowledgement.payment.defaults.subject")
                };

            case "simple.request@test":

                // Acknowledgement missive defaults
                defaults = {
                    code : SMETHAcknowledgementController._smethPreferences.getCharPref("acknowledgement.test.defaults.code"),
                    detail : SMETHAcknowledgementController._smethPreferences.getCharPref("acknowledgement.test.defaults.detail"),
                    status : SMETHAcknowledgementController._smethPreferences.getCharPref("acknowledgement.test.defaults.status"),
                    subject : SMETHAcknowledgementController._smethPreferences.getCharPref("acknowledgement.test.defaults.subject")
                };
        }

        return defaults;
    },

    /**
     * Send missive message receipt acknowledgement automatically
     *
     * @method _handleAutomaticAcknowledgement
     * @param {String} ackTransformerUrl URL of XSL file that will transform the SEPAmail message to the required acknowledgement message
     * @param {Object} defaults Acknowlegement details default settings
     * @param {XML} sepaMailXmlDom SEPAmail message document object model
     * @param {Object} aMsgHdr Header of message for which an automatic acknowledgement is being sent
     * @param {Object} account Account that will be used to send the acknowledgement missive XML
     * @see https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/NsIMsgCompFields
     * @see http://doxygen.db48x.net/mozilla-full/html/da/d05/interfacensIMsgComposeParams.html
     * @see https://developer.mozilla.org/en-US/docs/Extensions/Thunderbird/HowTos/Common_Thunderbird_Use_Cases/Compose_New_Message
     * @see http://doxygen.db48x.net/mozilla/html/interfacensIMsgSend.html
     *
     */
    _handleAutomaticAcknowledgement : function(ackTransformerUrl, defaults, sepaMailXmlDom, aMsgHdr, account) {

        try {

            // Get SEPAmail missive acknowledgement document object model
            var ackMissiveXmlDom = SMETHAcknowledgementController._getAckMissiveXml(ackTransformerUrl, defaults,
                sepaMailXmlDom);

            // Get the SEPAmail IDs of the sender and receiver of the acknowledgement
            var myQXBAN = SMETHAcknowledgementController._smethUtils.getQxbanByEmailAddressAccount(account.key);
            var receiverAccount = SMETHAcknowledgementController._smethUtils.getMailAccountByAlias(aMsgHdr.author);
            var receiverQXBAN = receiverAccount == null ?
                SMETHAcknowledgementController._smethUtils.getReceiverQxbanByEmailAddress(aMsgHdr.author) :
                SMETHAcknowledgementController._smethUtils.getQxbanByEmailAddressAccount(receiverAccount.key);

            // Check that the SEPAmail IDs have been obtained
            if ((myQXBAN != null) && (receiverQXBAN != null)) {

                // Automatically generated and set missive ID
                SMETHAcknowledgementController._smethUtils.setMissiveId(ackMissiveXmlDom);

                // Set the sender IBAN value
                SMETHAcknowledgementController._smethUtils.setNodeValue(ackMissiveXmlDom,
                    "/sem:Missive/sem:sepamail_missive_001/sem:MsvHdr/sem:Snd/sem:IBAN", myQXBAN.qxban);

                // Set the receiver IBAN value
                SMETHAcknowledgementController._smethUtils.setNodeValue(ackMissiveXmlDom,
                    "/sem:Missive/sem:sepamail_missive_001/sem:MsvHdr/sem:Rcv/sem:IBAN", receiverQXBAN.qxban);

                // Serialized SEPAmail missive acknowledgement
                var serializedAckMissiveXml = '<?xml version="1.0" encoding="UTF-8"?>' +
                        (new XMLSerializer()).serializeToString(ackMissiveXmlDom);

                // Compose service fields instance
                // @see https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/NsIMsgCompFields
                var composeFields = Components.classes["@mozilla.org/messengercompose/composefields;1"]
                                              .createInstance(Components.interfaces.nsIMsgCompFields);

                // Define the properties of the compose service fields
                composeFields.body = serializedAckMissiveXml + "\n";
                composeFields.characterSet = "UTF-8";
                composeFields.defaultCharacterSet = "UTF-8";
                composeFields.from = account.defaultIdentity.email;
                composeFields.messageId = aMsgHdr.messageId;
                composeFields.to = aMsgHdr.author;

                // Set the mail subject
                if (aMsgHdr.subject == SMETHTranslations.mailSubject) {
                    composeFields.subject = '';
                } else {
                    composeFields.subject = aMsgHdr.subject;
                }

                // Check if we have a certificate for encryption and signing
                if (account.defaultIdentity.getUnicharAttribute("encryption_cert_name") &&
                        account.defaultIdentity.getUnicharAttribute("signing_cert_name")) {

                    // SMIME message compose fields
                    var smimeCompFields = Components.classes["@mozilla.org/messenger-smime/composefields;1"]
                                                    .createInstance(Components.interfaces.nsIMsgSMIMECompFields);

                    // Sign and encrypt message
                    smimeCompFields.requireEncryptMessage = true;
                    smimeCompFields.signMessage = true;

                    // Set the security info of the message
                    composeFields.securityInfo = smimeCompFields;
                }

                // Message compose parameters instance
                // @see http://doxygen.db48x.net/mozilla-full/html/da/d05/interfacensIMsgComposeParams.html
                var msgComposeParams = Components.classes["@mozilla.org/messengercompose/composeparams;1"]
                                                 .createInstance(Components.interfaces.nsIMsgComposeParams);

                // Define the message composition parameters
                msgComposeParams.composeFields = composeFields;
                msgComposeParams.identity = account.defaultIdentity;
                msgComposeParams.format = Components.interfaces.nsIMsgCompFormat.PlainText
                msgComposeParams.type = Components.interfaces.nsIMsgCompType.New;

                // Compose service instance
                // @see https://developer.mozilla.org/en-US/docs/Extensions/Thunderbird/HowTos/Common_Thunderbird_Use_Cases/Compose_New_Message
                var composeService = Components.classes["@mozilla.org/messengercompose;1"]
                                               .getService(Components.interfaces.nsIMsgComposeService);

                // Message compose instance using message composition parameters
                var msgCompose = composeService.initCompose(msgComposeParams);

                // Remove vCards and signatures from missive email
                SMETHAcknowledgementController._smethUtils.removeEmailExtras(msgCompose);

                // Message send interface instance
                // @see http://doxygen.db48x.net/mozilla/html/interfacensIMsgSend.html
                var msgSend = Components.classes["@mozilla.org/messengercompose/send;1"]
                                        .createInstance(Components.interfaces.nsIMsgSend);

                // Send the acknowledgement missive XML
                msgCompose.SendMsg(msgSend.nsMsgDeliverNow, account.defaultIdentity, account, null, null);

            } else {

                // Required SEPAmail IDs could not be found
                throw new Error("The required SEPAmail IDs could not be found.");
            }

        } catch (e) {
            throw e;
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
        }
    },

    /**
     * Set the text value of a node in a given container
     *
     * @method _setNodeInContainer
     * @param {XML} ackDocument Acknowledgement missive document object model
     * @param {Object} container Acknowledgement details container
     * @param {String} localName Acknowledgement node local name
     * @param {String} nodeValue Value of the acknowledgement node
     */
    _setNodeInContainer : function(ackDocument, container, localName, nodeValue) {

        // Check if container has child nodes
        if (container.hasChildNodes()) {

            // Child nodes
            var children = container.childNodes;

            // Scan the child nodes and check if we have the required node
            for (var i = 0; i < children.length; i++) {

                // Check the current node name
                if (children[i].localName == localName) {

                    // Set the value of the node
                    children[i].textContent = nodeValue;

                    // Exit child nodes scanning
                    return;
                }
            }
        }

        // New element for details node
        var detailNode = ackDocument.createElement('sem:' + localName);

        // Set the value of the node
        detailNode.textContent = nodeValue;

        // Add the details node to the container
        container.appendChild(detailNode);
    },

    /**
     * Event raised when compose window is loaded and fields are ready
     *
     * @method NotifyComposeFieldsReady
     *
     * REM MSO 20121210 Why empty function ?
     */
    NotifyComposeFieldsReady: function() {

    },

    /**
     * Event raised when compose window is loaded and compose body is ready
     *
     * @method NotifyComposeBodyReady
     * @see https://developer.mozilla.org/en-US/docs/Using_the_Mozilla_JavaScript_interface_to_XSL_Transformations#Using_XSLTProcessor_from_XPCOM_components
     */
    NotifyComposeBodyReady: function() {

        try {

            // Get XSL to transform missive to acknowledgement form
            var ackFormTransformerUrl = this._smethPreferences.getCharPref("acknowledgement.form.XSLUrl");

            // XMLHttpRequest instance which loads the XSL transformer
            var xmlHttpRequest = new XMLHttpRequest();

            // Load the XSL transformer
            xmlHttpRequest.open('GET', ackFormTransformerUrl, false);
            xmlHttpRequest.send();

            // XSL document object
            var xslDocument = xmlHttpRequest.responseXML;

            // Instatiate the XSLT Processor
            // @see https://developer.mozilla.org/en-US/docs/Using_the_Mozilla_JavaScript_interface_to_XSL_Transformations#Using_XSLTProcessor_from_XPCOM_components
            var xsltProcessor= Components.classes["@mozilla.org/document-transformer;1?type=xslt"]
                                         .createInstance(Components.interfaces.nsIXSLTProcessor);
            xsltProcessor.importStylesheet(xslDocument);

            // Remove the attach file button
            document.getElementById("button-attach").hidden = true;

            // Acknowledgement form document
            var acknowledgementFormDoc = document.implementation.createDocument(
                "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "", null);

            // Get acknowledgement XUL form fragment
            var acknowledgementFormFragment = xsltProcessor.transformToFragment(this._ackMissiveXmlDom,
                acknowledgementFormDoc);

            // Append the acknowledgement form fragment to acknowledgement form document owner
            acknowledgementFormDoc.appendChild(acknowledgementFormFragment);

            // Get all the labels in the acknowledgement UI
            var ackUiLabels = acknowledgementFormDoc.firstChild.getElementsByTagNameNS(
                "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "label");

            // Loop the array of labels and set their appropriate text
            for (var i = 0; i < ackUiLabels.length; i++) {

                // Get a translated text for the current control
                var localeText = SMETHAcknowledgementTranslations[ackUiLabels[i].id];

                // Check if we have a translation the current control
                if (localeText != null) {

                    // Set the text of the label
                    ackUiLabels[i].setAttribute('value', localeText);
                }
            }

            // Add the acknowledgement form to the message compose window
            document.getElementById("smethComposeBodyFormContainer").appendChild(acknowledgementFormDoc.firstChild);

        } catch (e) {
            this._smethMessageHandler.exception(e);
        }
    },

    /**
     * ComposeProcessDone event notifies when the compose process has been completed
     *
     * @method ComposeProcessDone
     *
     * REM MSO 20121210 Why empty function ?
     */
    ComposeProcessDone: function(aResult) {
    },

    /**
     * SaveInFolderDone event notifies when the save in folder has been completed
     *
     * @method SaveInFolderDone
     *
     * REM MSO 20121210 Why empty function ?
     */
    SaveInFolderDone: function(folderURI) {
    },

    /**
     * SendMailEventHandler event handles the send event of an email
     *
     * @method SendMailEventHandler
     * @param {Object} event Event parameters
     */
    SendMailEventHandler : function(event) {

        var msgcomposeWindow = document.getElementById( "msgcomposeWindow" );
        var msg_type = msgcomposeWindow.getAttribute( "msgtype" );

        // Do not continue unless this is an actual send event
        if (!(msg_type == nsIMsgCompDeliverMode.Now || msg_type == nsIMsgCompDeliverMode.Later))
            return;

        // Alter the body of the acknowledgement to reflect the options chosen by the user
        try {

            // Get acknowledgement header details
            var missiveId = document.getElementById("missiveIdTextbox").value;
            var missiveOrd = document.getElementById("orderMissiveTextbox").value;
            var missivePriority = document.getElementById("priorityTextbox").value;

            // Get user selected values
            var userStatus = document.getElementById("semAcknowledgementStatusValueList").value;
            var userClass = document.getElementById("semAcknowledgementClassValue").value;
            var userSubject = document.getElementById("semAcknowledgementSubValue").value;
            var userDetail = document.getElementById("semAcknowledgementDetValue").value;
            var userDescription = document.getElementById("semAcknowledgementDescriptionValue").value;

            // Populate sender and receiver SEPAmail IDs
            if (SMETHAcknowledgementController._smethUtils.populateQXBAN(gMsgCompose, document,
                SMETHAcknowledgementController._ackMissiveXmlDom)) {

                // Current editor
                var editor = GetCurrentEditor();

                // Set the date and time at which the acknowledgement is being sent
                SMETHAcknowledgementController._smethUtils.setSendDateTime(SMETHAcknowledgementController._ackMissiveXmlDom);

                // Get the container for acknowledgement missive details elements
                var ackDetailsContainer = SMETHAcknowledgementController._ackMissiveXmlDom.evaluate(
                    SMETHAcknowledgementController._ackContainerPath, SMETHAcknowledgementController._ackMissiveXmlDom,
                    SMETHAcknowledgementController._smethUtils.nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

                // Set the missive ID
                if (missiveId.length > 0) {

                    // Set the user generated missive ID
                    SMETHAcknowledgementController._smethUtils.setNodeValue(
                        SMETHAcknowledgementController._ackMissiveXmlDom,
                        "/sem:Missive/sem:sepamail_missive_001/sem:MsvId", missiveId);

                } else {

                    // Automatically generated and set missive ID
                    SMETHAcknowledgementController._smethUtils.setMissiveId(SMETHAcknowledgementController._ackMissiveXmlDom);
                }

                // Set the missive order and priority
                SMETHAcknowledgementController._smethUtils.setNodeValue(
                    SMETHAcknowledgementController._ackMissiveXmlDom,
                    "/sem:Missive/sem:sepamail_missive_001/sem:MsvOrd", missiveOrd);
                SMETHAcknowledgementController._smethUtils.setNodeValue(
                    SMETHAcknowledgementController._ackMissiveXmlDom,
                    "/sem:Missive/sem:sepamail_missive_001/sem:MsvPri", missivePriority);

                // Replace user values in acknowledgement missive
                SMETHAcknowledgementController._setNodeInContainer(SMETHAcknowledgementController._ackMissiveXmlDom,
                    ackDetailsContainer.singleNodeValue, "AcqSta", userStatus);
                SMETHAcknowledgementController._setNodeInContainer(SMETHAcknowledgementController._ackMissiveXmlDom,
                    ackDetailsContainer.singleNodeValue, "AcqCla", userClass);
                SMETHAcknowledgementController._setNodeInContainer(SMETHAcknowledgementController._ackMissiveXmlDom,
                    ackDetailsContainer.singleNodeValue, "AcqSub", userSubject);
                SMETHAcknowledgementController._setNodeInContainer(SMETHAcknowledgementController._ackMissiveXmlDom,
                    ackDetailsContainer.singleNodeValue, "AcqDet", userDetail);

                // Check if user has specified details for acknowledgement
                if (userDescription.trim().length > 0) {
                    SMETHAcknowledgementController._setNodeInContainer(SMETHAcknowledgementController._ackMissiveXmlDom,
                        ackDetailsContainer.singleNodeValue, "AcqDes", userDescription);
                }

                // Start changing editor content
                editor.beginTransaction();

                // Set the editor content
                editor.document.body.textContent = '<?xml version="1.0" encoding="UTF-8"?>' +
                    (new XMLSerializer()).serializeToString(SMETHAcknowledgementController._ackMissiveXmlDom);

                // End changing editor content
                editor.endTransaction();

            } else {
                event.preventDefault();
            }

        } catch (e) {
            SMETHAcknowledgementController._smethMessageHandler.exception(e);
        }
    }
};