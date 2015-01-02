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
 * @file SMETHReadMessageController.js
 * @mvc controller
 * @version 1212
 * @since 1210
 * @author Ammit Heeramun
 * @description SMETHReadMessageController is the class that is attached to SMETHReadMessageView, it helps in the setting up of the thunderbird main window interface for displaying of different type of SEPAmail messages.
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
 * SMETHControlFactory class contain functions to create XUL and HTML controls
 *
 * @include SMETHControlFactory.js
 */
Components.utils.import("resource://smeth/smethlib/SMETHControlFactory.js");

/**
 * SMETHMail class that represent the message object for Smeth
 *
 * @include SMETHMail.js
 */
Components.utils.import("resource://smeth/smethlib/SMETHMail.js");

/**
 * The FileUtils.jsm JavaScript code module offers utility routines dealing with files.
 *
 * @include FileUtils.jsm
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/FileUtils.jsm
 */
Components.utils.import("resource://gre/modules/FileUtils.jsm");

/**
 * The NetUtil.jsm JavaScript code module provides easy-to-use APIs for performing common network related tasks.
 *
 * @include NetUtil.jsm
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/NetUtil.jsm
 */
Components.utils.import("resource://gre/modules/NetUtil.jsm");

/**
 * Strict mode for scripts
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Functions_and_function_scope/Strict_mode
 *
 */
"use strict";

/**
 * SMETHReadMessageController is the class that is attached to SMETHReadMessageView, it helps in the setting up of the thunderbird main window interface for displaying of different type of SEPAmail messages.
 *
 * @class SMETHReadMessageController
 */
var SMETHReadMessageController = {

   /**
    * Declare the SMETHMessageHandler class
    *
    * @attribute _smethMessageHandler
    * @private
    * @default null
    */
    _smethMessageHandler : null,

   /**
    * Declare the utils class
    *
    * @attribute _smethUtils
    * @private
    * @default null
    */
    _smethUtils : new SMETHUtils(window),

   /**
    * Declare the SMETHControlFactory class
    *
    * @attribute _smethControlFactory
    * @private
    * @default null
    */
    _smethControlFactory : null,

   /**
    * Declare the smeth mail object
    *
    * @attribute _smethMail
    * @private
    * @default null
    */
    _smethMail : null,

   /**
    * Preferences object
    *
    * @attribute _smethPreferences
    * @private
    * @default null
    */
    _smethPreferences : null,

   /**
    * Preference prefIsBodyXML
    *
    * @attribute _smethPrefIsBodyXML
    * @private
    * @default null
    */
    _smethPrefIsBodyXML : null,

   /**
    * Preference prefSEPAmailXMLTag
    *
    * @attribute _smethPrefSEPAmailXMLTag
    * @private
    * @default null
    */
    _smethPrefSEPAmailXMLTag : null,

   /**
    * Preference for missive message type XPath
    *
    * @attribute _smethPrefMissiveMsgTypXpath
    * @private
    * @default null
    */
    _smethPrefMissiveMsgTypXpath : null,

   /**
    * Preference for the missive root tag
    *
    * @attribute _smethPrefMissiveRootTag
    * @private
    * @default null
    */
    _smethPrefMissiveRootTag : null,

   /**
    * Preference for SEPAmail accounts
    *
    * @attribute _smethEmailToQxbanObj
    * @private
    * @default null
    */
    _smethEmailToQxbanObj : null,

   /**
    * Smeth config object
    *
    * @attribute _smethConfigObject
    * @private
    * @default null
    */
    _smethConfigObject : null,

    /**
     * Smeth message type
     *
     * @attribute _smethMessageType
     * @private
     * @default null
     */
    _smethMessageType : null,

    /**
     * Initiation of the Smeth plugin
     *
     * @method init
     * @see https://developer.mozilla.org/en-US/docs/Code_snippets/Preferences#XPCOM_interfaces_for_preferences_system
     */

    init : function() {

        try {

            // Instantiate the SMETHMessageHandler class
            this._smethMessageHandler = new SMETHMessageHandler(window);

            // Instantiate the
            //this._smethUtils = new SMETHUtils(window);

            // Instantiate the SMETHControlFactory class
            this._smethControlFactory = new SMETHControlFactory(document);

            // Register to receive notifications of preference changes
            // @see https://developer.mozilla.org/en-US/docs/Code_snippets/Preferences#XPCOM_interfaces_for_preferences_system
            this._smethPreferences = Components.classes["@mozilla.org/preferences-service;1"]
                                    .getService(Components.interfaces.nsIPrefService)
                                    .getBranch("extensions.smeth.");
            this._smethPreferences.QueryInterface(Components.interfaces.nsIPrefBranch2);

            // Add an observer for changes in preferences
            this._smethPreferences.addObserver("", this, false);

            // Retreive the value of the preference "prefIsBodyXML"
            this._smethPrefIsBodyXML = this._smethPreferences.getBoolPref("prefIsBodyXML");

            // Retreive the value of the preference "prefSEPAmailXMLTag"
            this._smethPrefSEPAmailXMLTag = this._smethPreferences.getCharPref("prefSEPAmailXMLTag");

            // Retreive the value of the missive preference "prefMsgTypXpath"
            this._smethPrefMissiveMsgTypXpath = this._smethPreferences.getCharPref("missive.prefMsgTypXpath");

            // Retreive the value of the missive preference "prefRootTag"
            this._smethPrefMissiveRootTag = this._smethPreferences.getCharPref("missive.prefRootTag");

            // Get SEPAmail account preferences "myqxbans"
            this._smethEmailToQxbanObj = JSON.parse(this._smethPreferences.getCharPref('myqxbans'));

        } catch (ex) {
            SMETHReadMessageController._smethMessageHandler.exception(ex);
        }

    },

    /**
     * observe function Called when events occur on the preferences
     *
     * @method observe
     * @param {String} aSubject Event Subject
     * @param {String} aTopic Event Topic
     * @param {Object} aData Event Data
     */
    observe: function(aSubject, aTopic, aData) {

        try {

            if (aTopic != "nsPref:changed") {
                return;
            }

            switch(aData) {

                case "prefIsBodyXML":

                    // Retreive the value of the preference "prefIsBodyXML"
                    this._smethPrefIsBodyXML = this._smethPreferences.getBoolPref("prefIsBodyXML");
                    break;
            }

        } catch(ex) {
            SMETHReadMessageController._smethMessageHandler.exception(ex);
        }
    },

    /**
     * onMessagePaneLoad listener to be triggered on each mail select
     *
     * @method onMessagePaneLoad
     * @param {Object} aEvent Event data
     * @see https://developer.mozilla.org/en-US/docs/Code_snippets/On_page_load
     */
    onMessagePaneLoad : function(aEvent) {

        try {

            // Get the selected mail header
            var selectedMailHeader = gFolderDisplay.selectedMessage;

            if (null != selectedMailHeader) {

                // Intatiate the smeth mail object
                SMETHReadMessageController.initializeSmethMailObject(selectedMailHeader);
            }

        } catch(ex) {
            SMETHReadMessageController._smethMessageHandler.exception(ex);
        }
    },

    /**
     * initializeSmethMailObject function initialize a SmethMail Object using the mail selected header
     *
     * @method initializeSmethMailObject
     * @param {Object} aSelectedMailHeader Selected mail header
     */
    initializeSmethMailObject : function (aSelectedMailHeader) {

        try {

            // Define the options for the MsgHdrToMimeMessage function
            var options = { examineEncryptedParts: true, partsOnDemand: false };

            // Instantiate the smeth mail object
            this._smethMail = new SMETHMail(aSelectedMailHeader);

            // Get the mail content
            MsgHdrToMimeMessage(aSelectedMailHeader, null, function (aMailHeader, aMailContent) {

                try {

                    // Set the mail content object
                    SMETHReadMessageController._smethMail.content = aMailContent;

                    // Set the mail body
                    SMETHReadMessageController._smethMail.body =
                        SMETHReadMessageController._smethUtils.getMailBody(SMETHReadMessageController._smethMail.content.parts[0],
                        document.getElementById("messagepane").contentDocument.body.textContent.replace(/(\n|\t)/gm, ""));

                    // Set whether the selected mail is a SEPAmail
                    SMETHReadMessageController._smethMail.isSEPAmail =
                        SMETHReadMessageController._smethUtils.isSEPAmail(SMETHReadMessageController._smethMail.body);

                    // Check if message is a SEPAmail message
                    if (SMETHReadMessageController._smethMail.isSEPAmail) {

                        // Get the SEPAmail message root node type
                        SMETHReadMessageController._smethMail.sepamailType =
                            SMETHReadMessageController._smethUtils.getSEPAmailMessageRootNodeType(SMETHReadMessageController._smethMail.body);

                        // Initialize the messagepane UI using the smeth mail object
                        SMETHReadMessageController.initializeMessagePaneUI(SMETHReadMessageController._smethMail);

                        // Set the mail object for the acknowledgement controller
                        SMETHAcknowledgementController.missiveMailObject = SMETHReadMessageController._smethMail;

                    } else {

                        // Message is not a SEPAmail message
                        SMETHReadMessageController.disableSEPAmailUI();
                    }

                } catch(ex) {
                    SMETHReadMessageController._smethMessageHandler.exception(ex);
                }

            }, true, options);

        } catch(ex) {
            throw ex;
        }

    },

    /**
     * initializeMessagePaneUI initialises the messagepane user interface using the parametered SmethMail object
     *
     * @method initializeMessagePaneUI
     * @param {object} aSmethMail Selected mail object
     */
    initializeMessagePaneUI : function(aSmethMail) {

        try {

            // Check if a mail is a SEPAmail
            if (aSmethMail.isSEPAmail) {

                // Initialise
                SMETHReadMessageController.initializeSEPAmailUI();

                // Parse the raw mail body
                this._smethMail.sepamailXMLObject = new DOMParser().parseFromString(aSmethMail.body, "text/xml");

                //Set the SEPAmail message type
                this._smethMail.sepamailMessageType = SMETHReadMessageController._smethUtils.getSEPAmailMessageType(this._smethMail.sepamailXMLObject);

                // Initializes the SEPAmail SMTP header
                SMETHReadMessageController.initializeSEPAmailSMTPHeaderUI();

                //TODO:Proper handling for different message types
                if (this._smethMail.sepamailMessageType != '') {

                    // Retrieve the Smeth config object from the preferences
                    this._smethConfigObject = this._smethUtils.getControllerConfigObject(this._smethMail.sepamailMessageType);

                    if (this._smethConfigObject != null) {

                        // Set the missive message type for the acknowledgement controller
                        SMETHAcknowledgementController.missiveMessageType = this._smethMail.sepamailMessageType;

                        // Check for SEPAmail request content
                        if (SMETHRequestController.isSEPAmailRequest(aSmethMail.body)) {

                            // We have a SEPAmail valid report missive XML
                            this._smethMessageType = 'SEPAMAIL_REQUEST';

                        } else if (SMETHReportController.isSEPAmailReport(aSmethMail.body)) {

                            // We have a SEPAmail valid report missive XML
                            this._smethMessageType = 'SEPAMAIL_REPORT';
                        }

                        // Initializes the SEPAmail header
                        SMETHHeaderController.initializeSEPAmailHeaderUI();

                        // Initializes the SEPAmail body
                        SMETHReadMessageController.initializeSEPAmailBodyUI();

                        // Check if there are attachments for the current message type
                        if (this._smethConfigObject.settings.hasAttachments) {

                            // Initializes the SEPAmail attachment
                            SMETHReadMessageController.initializeSEPAmailAttachmentUI();
                        }

                        // Set translated labels for SMETH UI controls
                        this._smethUtils.translateSEPAmailDocument(document.getElementById("sepamailUIContainer"),
                            SMETHTranslations);

                        // TODO: Freeze form if we are not in the message inbox
                        if (SMETHReadMessageController._smethUtils.getFolderType(gFolderDisplay) != 'INBOX') {

                            // Freeze the SEPAmail UI content
                            SMETHReadMessageController._smethUtils.freezeContent(document.getElementById("sepamailUIContainer"));
                        }

                    } else {

                        this.disableSEPAmailUI();
                        SMETHReadMessageController._smethMessageHandler.info("SEPAmail message type config not yet defined");
                    }

                } else {

                    if (SMETHAcknowledgementController.isAcknowledgementMissiveMessage(aSmethMail.body)) {

                        // We have a SEPAmail valid acknowledgement missive XML
                        this._smethMessageType = 'SEPAMAIL_ACKNOWLEDGEMENT';

                        // Initializes the SEPAmail header
                        SMETHHeaderController.initializeSEPAmailHeaderUI();

                        // Initializes the SEPAmail body
                        SMETHReadMessageController.initializeSEPAmailBodyUI();

                    } else {

                        this.disableSEPAmailUI();
                        SMETHReadMessageController._smethMessageHandler.info("SEPAmail message type not yet handled");
                    }
                }

                // Check if we have a SEPAmail raw browser
                if (document.getElementById("sepamailRawBrowser") != null) {

                    // Use the load event of the browser to show SEPAmail message content
                    document.getElementById("sepamailRawBrowser").addEventListener("load", function load(event) {

                            // Remove the listener
                            document.getElementById("sepamailRawBrowser").removeEventListener("load", load, true);

                            // Display SEPAmail message content
                            SMETHRawContentController.displayMessage(this, gFolderDisplay.selectedMessage,
                                SMETHReadMessageController._smethMail.sepamailXMLObject);

                        }, true);

                    // Load the raw mode template
                    document.getElementById("sepamailRawBrowser").loadURI('chrome://smeth/content/codemirror/template/rawModeViewerTemplate.html');
                }

            } else {
                this.disableSEPAmailUI();
            }

        } catch(ex) {
            throw ex;
        }

    },

    /**
     * handleRawModeToggle enables or disables the SMETH raw mode
     *
     * @method initializeSEPAmailUI
     */
    handleRawModeToggle : function() {

        // Mode toggle button
        var button = document.getElementById("smethSepamailRawModeToggle");

        // Check the toggle button state
        if (button.checked) {

            // Check if we need to create the raw mode display textbox
            if (document.getElementById("sepamailRawBrowser") == null) {

                // Create a multiline textbox for the raw mode
                var browser = SMETHReadMessageController._smethControlFactory.createBrowserXULElement();

                // Set the properties of the browser
                browser.setAttribute('autofind', false);
                browser.setAttribute('disablehistory', true);
                browser.setAttribute('disablesecurity', true);
                browser.setAttribute('flex', 1);
                browser.setAttribute('id', 'sepamailRawBrowser');
                browser.setAttribute('name', 'sepamailRawBrowser');
                browser.setAttribute('src', 'about:blank');
                browser.setAttribute('type', 'content');

                // Add the browser to the message pane
                document.getElementById("messagepanewrapper").appendChild(browser);
            }

            // Use the load event of the browser to show SEPAmail message content
            document.getElementById("sepamailRawBrowser").addEventListener("load", function load(event) {

                    // Remove the listener
                    document.getElementById("sepamailRawBrowser").removeEventListener("load", load, true);

                    // Display SEPAmail message content
                    SMETHRawContentController.displayMessage(this, gFolderDisplay.selectedMessage,
                        SMETHReadMessageController._smethMail.sepamailXMLObject);

                }, true);

            // Load the raw mode template
            document.getElementById("sepamailRawBrowser").loadURI('chrome://smeth/content/codemirror/template/rawModeViewerTemplate.html');

            // Show/hide message pane controls
            document.getElementById("sepamailRawBrowser").setAttribute('hidden', false);
            document.getElementById("sepamailUIContainer").setAttribute('hidden', true);

        } else {
            document.getElementById("sepamailRawBrowser").setAttribute('hidden', true);
            document.getElementById("sepamailUIContainer").setAttribute('hidden', false);
            document.getElementById("messagepanewrapper").removeChild(document.getElementById("sepamailRawBrowser"));
        }

        // Remove focus from the toggle button
        button.blur();
    },

    /**
     * initializeSEPAmailUI function initialises the SEPAmail UI
     *
     * @method initializeSEPAmailUI
     */
    initializeSEPAmailUI : function(){

        // Toggle the message header buttons
        SMETHReadMessageController.toggleMessageHeaderButtons();

        // Get message pane wrapper
        var messagePaneWrapper = document.getElementById("messagepanewrapper");

        // Get and hide the message pane browser displaying the raw XML
        var messagePaneBrowser = document.getElementById("messagepane");
        messagePaneBrowser.hidden = true;

        // Get the SEPAmailUIContainer
        var sepamailUIContainer = document.getElementById("sepamailUIContainer");

        // Check if the sepamailUIContainer is present
        if (null != sepamailUIContainer) {

            // Removes the sepamailUIContainer childrens
            while (sepamailUIContainer.hasChildNodes()) {
                sepamailUIContainer.removeChild(sepamailUIContainer.firstChild);
            }

        } else {

            // Create the SEPAmailUIContainer
            sepamailUIContainer = this._smethControlFactory.createVBoxXULElement("sepamailUIContainer")
            sepamailUIContainer.setAttribute("flex", 1);

            // Add a the SEPAmailUIContainer vbox in which all the parts of the SEPAmail UI will be added
            messagePaneWrapper.appendChild(sepamailUIContainer);
        }

        // Get the export menu
        var menuExport = document.getElementById("menu_Export");

        // Enable the export menu
        menuExport.setAttribute("disabled", "false");
    },

    /**
     * disableSEPAmailUI function disables the SEPAmail UI
     *
     * @method disableSEPAmailUI
     */
    disableSEPAmailUI : function() {

        // Toogle the message header buttons
        SMETHReadMessageController.toggleMessageHeaderButtons();

        // Get the message header toolbox
        var messageheaderToolBox = document.getElementById("dateValueBox");

        // Get message pane wrapper
        var messagePaneWrapper = document.getElementById("messagepanewrapper");

        // Check if the sepamailLogoBox is present
        if (null != document.getElementById("sepamailLogoBox")) {

            // Removes the sepamailLogoBox
            messageheaderToolBox.removeChild(document.getElementById("sepamailLogoBox"));
        }

        // Remove the SMETH Raw mode button
        if (document.getElementById("smethSepamailRawModeToggle") != null) {
            messageheaderToolBox.removeChild(document.getElementById("smethSepamailRawModeToggle"));
        }

        // Check if the raw mode browser is available
        if (document.getElementById("sepamailRawBrowser") != null) {

            // Remove the SMETH raw mode browser
            messagePaneWrapper.removeChild(document.getElementById("sepamailRawBrowser"));
        }

        // Check if the sepamailUIContainer is present
        if (null != document.getElementById("sepamailUIContainer")) {

            // Removes the sepamailUIContainer
            messagePaneWrapper.removeChild(document.getElementById("sepamailUIContainer"));
        }

        // Get and show the message pane browser
        var messagePaneBrowser = document.getElementById("messagepane");
        messagePaneBrowser.hidden = false;

        // Get the export menu
        var menuExport = document.getElementById("menu_Export");

        // Disable the export menu
        menuExport.setAttribute("disabled", "true");
    },

    /**
     * initializeSEPAmailSMTPHeaderUI function initialises the SEPAmail SMTP header user interface
     *
     * @method initializeSEPAmailSMTPHeaderUI
     */
    initializeSEPAmailSMTPHeaderUI : function() {

        try {

            // Get the message header toolbox
            var messageheaderToolBox = document.getElementById("dateValueBox");

            // Check if the SEPAmail logo is present
            if (null == document.getElementById("sepamailLogoBox")) {

                // Create the box XUL element to contain the SEPAmail logo
                var imageBoxXUL = SMETHReadMessageController._smethControlFactory.createBoxXULElement("sepamailLogoBox");

                // Create the image XUL element
                var imageXUL = SMETHReadMessageController._smethControlFactory.createImageXULElement("sepamailLogo","chrome://{appname}/skin/images/sepamailLogo.png", "32px", "32px");
                imageXUL.setAttribute("onclick", "SMETHReadMessageController.handleSEPAmailInfo();");

                // Append the SEPAmail logo to the box
                imageBoxXUL.appendChild(imageXUL);

                // Append SEPAmail logo box to the message header toolbox
                messageheaderToolBox.insertBefore(imageBoxXUL, document.getElementById("smimeBox"));
            }

            // Check if we need to add the raw mode button
            if ((document.getElementById("smethSepamailRawModeToggle") == null) && (document.getElementById("sepamailLogoBox") != null)) {

                // Create the XUL button element
                var button = SMETHReadMessageController._smethControlFactory.createButtonXULElement('smethSepamailRawModeToggle', 'Raw mode');

                // Set the button properties
                button.setAttribute('type', 'checkbox');
                button.setAttribute('oncommand', 'SMETHReadMessageController.handleRawModeToggle();');

                // Add the button to the header
                messageheaderToolBox.insertBefore(button, document.getElementById("sepamailLogoBox"));
            }

        } catch(ex) {
            throw ex;
        }

    },

    /**
     * initializeSEPAmailBodyUI function initialises the SEPAmail body user interface
     *
     * @method initializeSEPAmailBodyUI
     */
    initializeSEPAmailBodyUI : function() {

        try {

            // Check if we are displaying an acknowledgement
            if (this._smethMessageType == 'SEPAMAIL_ACKNOWLEDGEMENT') {

                // Transform the SEPAmail acknowledgement document
                var sepamailAckBodyDocument = this._smethUtils.transformXMLDocument(this._smethMail.sepamailXMLObject,
                        this._smethPreferences.getCharPref("acknowledgement.body.XSLUrl"));

                // Get the sepamailUIContainer
                var sepamailAckUIContainer = document.getElementById("sepamailUIContainer");

                // Appends the resulting transformation fragment first child to the sepamailUIContainer
                sepamailAckUIContainer.appendChild(sepamailAckBodyDocument.firstChild);

            } else {

                // Check if the Body XSL Url is defined
                if (this._smethConfigObject.settings.body != "") {

                    // Transform the SEPAmail XML document
                    var sepamailBodyDocument = this._smethUtils.transformXMLDocument(this._smethMail.sepamailXMLObject,
                        "chrome://{appname}/content/xsl/" + this._smethConfigObject.settings.body);

                    // Get the sepamailUIContainer
                    var sepamailUIContainer = document.getElementById("sepamailUIContainer");

                    // Appends the resulting transformation fragment first child to the sepamailUIContainer
                    sepamailUIContainer.appendChild(sepamailBodyDocument.firstChild);

                } else {
                    throw new Error("XSL Url for SEPAmail body is not define in the configuration file");
                }
            }

        } catch(ex) {
            throw ex;
        }
    },

    /**
     * initializeSEPAmailAttachmentUI function initialises the SEPAmail attachment user interface
     *
     * @method initializeSEPAmailAttachmentUI
     */
    initializeSEPAmailAttachmentUI : function() {

        try {

            // Declare the attachment XSL url
            var attachmentXSLUrl = this._smethPreferences.getCharPref("missive.attachment");

            // Check if the attachment XSL Url is define
            if (attachmentXSLUrl != '') {

                // Transform the SEPAmail XML document
                var sepamailAttachmentDocument = this._smethUtils.transformXMLDocument(this._smethMail.sepamailXMLObject, "chrome://{appname}/content/xsl/" + attachmentXSLUrl);

                // Get the sepamailUIContainer
                var sepamailUIContainer = document.getElementById("sepamailUIContainer");

                // Appends the resulting transformation fragment first child to the sepamailUIContainer
                sepamailUIContainer.appendChild(sepamailAttachmentDocument.firstChild);

                // Calculates and sets the attachements size
                SMETHAttachmentController.calculateAttachmentSize();

            } else {
                throw new Error("XSL Url for SEPAmail attachment is not define in the configuration file");
            }

        } catch(ex) {
            throw ex;
        }
    },

    /**
     * checkAttachmentsContentType function checks if the mail content
     * contains an attachement of the parametred content type
     *
     * @method checkAttachmentsContentType
     * @param {Object} aMailContent Object
     * @param {String} aContentType String
     * @return {Boolean} Whether the mail is of type xml
     */
    checkAttachmentsContentType : function(aMailContent, aContentType){

        try
        {
            for (var i = 0; i < aMailContent.allAttachments.length; i++) {
                if(aContentType == aMailContent.allAttachments[i].contentType) {
                    return true;
                } else {
                    return false;
                }
            }

            return false;

        } catch(ex) {
            throw ex;
        }
    },

    /**
     * toggleMessageHeaderButtons function toggle the message header buttons depending whether its a SEPAmail or not
     *
     * @method toggleMessageHeaderButtons
     */
    toggleMessageHeaderButtons : function()
    {
        try
        {
            // Get the header view toolbar
            var headerViewToolbar = document.getElementById("header-view-toolbar");

            // Get the header other actions button
            var otherActionsButton = document.getElementById("otherActionsButton");

            // Get the header subject row and textbox
            var subjectRow = document.getElementById("expandedsubjectRow");

            // Get the to label
            var toLabel = document.getElementById("expandedtoLabel");

            if (SMETHReadMessageController._smethMail.isSEPAmail)
            {

                // Hide the header buttons
                headerViewToolbar.hidden = true;
                otherActionsButton.hidden = true;

                // Hide Subject
                if(SMETHReadMessageController._smethMail.header.subject == "")
                {
                    // Collapse the subject row
                    subjectRow.collapsed = true;

                    // Correct the to label when the subject row is collapsed
                    toLabel.setAttribute("style", "margin-left:2.8em;");
                }
                else
                {
                    // Expand the subject row
                    subjectRow.collapsed = false;

                    // Remove the correction for the to label
                    toLabel.removeAttribute("style");
                }
            }
            else
            {
                // Unhide the header buttons
                headerViewToolbar.hidden = false;
                otherActionsButton.hidden = false;

                /// Expand the subject row
                subjectRow.collapsed = false;

                 // Remove the correction for the to label
                toLabel.removeAttribute("style");
            }
        }
        catch(ex)
        {
            throw ex;
        }
    },

    /**
     * handleReportButtonClick function handles the click event for report buttons
     *
     * @method handleReportButtonClick
     * @param {String} anXSLUrl XSL Url for report form
     */
    handleReportButtonClick : function (anXSLUrl) {

        try {

            // Transform the SEPAmail XML document to get the report XML
            var sepamailReportDocument = this._smethUtils.transformXMLDocument(this._smethMail.sepamailXMLObject, "chrome://{appname}/content/xsl/" + anXSLUrl);

            // Get the account that will be used to send the report
            var account = SMETHReadMessageController._smethUtils.getAccountByMsgHeader(this._smethMail.header);

            // Open the compose window
            this._smethUtils.openComposeWindow((new XMLSerializer()).serializeToString(sepamailReportDocument), account,
                this._smethMail.header, SMETHTranslations.mailSubject);

        } catch (ex) {
            throw ex;
        }
    },

    /**
     * defaultSmethAccount function returns the default smeth account to send mail
     *
     * @method getDefaultSmethAccount
     * @return {Object} Default smeth account to send mail
     * @see https://developer.mozilla.org/en-US/docs/Thunderbird/Account_interfaces
     * @see https://developer.mozilla.org/en-US/docs/Thunderbird/Account_examples
     */
    getDefaultSmethAccount : function() {
        try
        {
            // Intantiate the account manager interface
            // @see https://developer.mozilla.org/en-US/docs/Thunderbird/Account_interfaces
            // @see https://developer.mozilla.org/en-US/docs/Thunderbird/Account_examples
            var accountMgr = Components.classes["@mozilla.org/messenger/account-manager;1"]
                             .getService(Components.interfaces.nsIMsgAccountManager);

            // Get the acceptation report XSL url based on the SEPAmail type and SEPAmail Message Type
            var smethAccountEmail = this._smethPreferences.getCharPref( "defaultAccountEmail");

            if ("" != smethAccountEmail) {

                var accounts = accountMgr.accounts;

                for (var i = 0; i < accounts.Count(); i++){

                    var account = accounts.QueryElementAt(i, Components.interfaces.nsIMsgAccount);

                    if (account.defaultIdentity) {

                        if (smethAccountEmail == account.defaultIdentity.email) {
                            return account;
                        }
                    }
                }

            } else {
                 throw new Error("Default SMETH account is not define in the configuration file so we are using the default thunderbird account.");
            }

            return accountMgr.defaultAccount;

        } catch (ex) {
            throw ex;
        }
    },

    /**
     * composeGenericButtonClick function handles the click event for the composeGenericButton
     *
     * @method composeGenericButtonClick
     * @see https://developer.mozilla.org/en-US/docs/Extensions/Thunderbird/HowTos/Common_Thunderbird_Use_Cases/Compose_New_Message
     * @see https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIIOService
     */
    composeGenericButtonClick : function() {

        try {

            // Get account to send message
            var account = this._getMessageCompositionAccount();

            // Check if we have an appriate account to compose a message
            if (account != null) {

                // Open message composition window with appropriate content
                this._openMessageComposition(account,
                    this._smethUtils.getTemplateForMessageType('send.request@generic'));

            } else {
                alert(SMETHTranslations.noSuitableAccounts);
            }

        } catch (ex) {
            throw ex;
        }
    },

    /**
     * composeMandateInitiationRequestButtonClick function handles the click event for the composeMandateInitiationRequestButton
     *
     * @method composeMandateInitiationRequestButtonClick
     * @see https://developer.mozilla.org/en-US/docs/Extensions/Thunderbird/HowTos/Common_Thunderbird_Use_Cases/Compose_New_Message
     * @see https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIIOService
     */
    composeMandateInitiationRequestButtonClick : function() {

        try {

            // Get account to send message
            var account = this._getMessageCompositionAccount();

            // Check if we have an appriate account to compose a message
            if (account != null) {

                // Open message composition window with appropriate content
                this._openMessageComposition(account,
                    this._smethUtils.getTemplateForMessageType('mandat@direct.debit'));

            } else {
                alert(SMETHTranslations.noSuitableAccounts);
            }

        } catch (ex) {
            throw ex;
        }
    },

    /**
     * composePrenotificationButtonClick function handles the click event for the composePrenotificationButton
     *
     * @method composePrenotificationButtonClick
     * @see https://developer.mozilla.org/en-US/docs/Extensions/Thunderbird/HowTos/Common_Thunderbird_Use_Cases/Compose_New_Message
     * @see https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIIOService
     */
    composePrenotificationButtonClick : function() {

        try {

            // Get account to send message
            var account = this._getMessageCompositionAccount();

            // Check if we have an appriate account to compose a message
            if (account != null) {

                // Open message composition window with appropriate content
                this._openMessageComposition(account,
                    this._smethUtils.getTemplateForMessageType('notification@direct.debit'));

            } else {
                alert(SMETHTranslations.noSuitableAccounts);
            }

        } catch (ex) {
            throw ex;
        }
    },

    /**
     * composeRequestForCopyButtonClick function handles the click event for the composeRequestForCopyButton
     *
     * @method composeRequestForCopyButtonClick
     * @see https://developer.mozilla.org/en-US/docs/Extensions/Thunderbird/HowTos/Common_Thunderbird_Use_Cases/Compose_New_Message
     * @see https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIIOService
     */
    composeRequestForCopyButtonClick : function() {

        try {

            // Get account to send message
            var account = this._getMessageCompositionAccount();

            // Check if we have an appriate account to compose a message
            if (account != null) {

                // Open message composition window with appropriate content
                this._openMessageComposition(account,
                    this._smethUtils.getTemplateForMessageType('request.copy@direct.debit'));

            } else {
                alert(SMETHTranslations.noSuitableAccounts);
            }

        } catch (ex) {
            throw ex;
        }
    },

    /**
     * composeRequestButtonClick function handles the click event for the composeRequestButton
     *
     * @method composeRequestButtonClick
     * @see https://developer.mozilla.org/en-US/docs/Extensions/Thunderbird/HowTos/Common_Thunderbird_Use_Cases/Compose_New_Message
     * @see https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIIOService
     */
    composeRequestButtonClick : function() {

        try {

            // Get account to send message
            var account = this._getMessageCompositionAccount();

            // Check if we have an appriate account to compose a message
            if (account != null) {

                // Open message composition window with appropriate content
                this._openMessageComposition(account,
                    this._smethUtils.getTemplateForMessageType('activation.request@payment.activation'));

            } else {
                alert(SMETHTranslations.noSuitableAccounts);
            }

        } catch (ex) {
            throw ex;
        }
    },

    /**
     * composeTestRequestButtonClick function handles the click event for the composeTestRequestButton
     *
     * @method composeTestRequestButtonClick
     * @see https://developer.mozilla.org/en-US/docs/Extensions/Thunderbird/HowTos/Common_Thunderbird_Use_Cases/Compose_New_Message
     * @see https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIIOService
     */
    composeTestRequestButtonClick : function() {

        try {

            // Get account to send message
            var account = this._getMessageCompositionAccount();

            // Check if we have an appriate account to compose a message
            if (account != null) {

                // Open message composition window with appropriate content
                this._openMessageComposition(account,
                    this._smethUtils.getTemplateForMessageType('simple.request@test'));

            } else {
                alert(SMETHTranslations.noSuitableAccounts);
            }

        } catch (ex) {
            throw ex;
        }
    },

    /**
     * handleSEPAmailInfo function handles SEPAmail logo click event
     *
     * @method handleSEPAmailInfo
     */
    handleSEPAmailInfo : function() {

        // Create the SEPAmail namespace resolver object
        var sender, qxban;

        switch (SMETHReadMessageController._smethMessageType) {

            case 'SEPAMAIL_ACKNOWLEDGEMENT':

                try {

                    // Get the sender
                    sender = this._smethMail.sepamailXMLObject.evaluate("/sem:Missive/sem:sepamail_missive_001/sem:MsvHdr/sem:Snd/sem:IBAN", this._smethMail.sepamailXMLObject, this._smethUtils.nsResolver, XPathResult.STRING_TYPE,null).stringValue;
                    qxban = this._smethMail.sepamailXMLObject.evaluate("/sem:Missive/sem:sepamail_missive_001/sem:MsvHdr/sem:Snd/sem:IBAN", this._smethMail.sepamailXMLObject, this._smethUtils.nsResolver, XPathResult.STRING_TYPE,null).stringValue;

                } catch (e) {
                    SMETHReadMessageController._smethMessageHandler.exception(e);
                }

                break;

            case 'SEPAMAIL_REQUEST':

                try {

                    // Get the sender
                    sender = this._smethMail.sepamailXMLObject.evaluate("/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:Dbtr/pain013:Nm", this._smethMail.sepamailXMLObject, this._smethUtils.nsResolver, XPathResult.STRING_TYPE,null).stringValue;
                    qxban = this._smethMail.sepamailXMLObject.evaluate("/sem:Missive/sem:sepamail_missive_001/sem:MsvHdr/sem:Snd/sem:IBAN", this._smethMail.sepamailXMLObject, this._smethUtils.nsResolver, XPathResult.STRING_TYPE,null).stringValue;

                } catch (e) {
                    SMETHReadMessageController._smethMessageHandler.exception(e);
                }

                break;

            default:
                // We do not handle other types of content and allow Thunderbird to control the sending of messages
        }

        // Open the dialogue
        window.openDialog("chrome://Smeth/content/SMETHInfoView.xul", "", "chrome,resizable=1,modal=1,dialog=1",sender,qxban);

    },

    /**
     * Handle the message added event
     *
     * @method msgAdded
     * @param {Object} aMsgHdr Header of the message being added to the mail session
     */
    msgAdded : function(aMsgHdr) {

        // Check if message is new
        if (!aMsgHdr.isRead) {

            // Add a message header to the automatic acknowledgement processing queue
            SMETHAutomaticAcknowledgementController.addToProcessQueue(aMsgHdr);
        }

    },

    /**
     * Get the status of a given email account
     *
     * @method _getAccountStatus
     * @param {Object} account Email account object
     * @return The status of the given account
     */
    _getAccountStatus : function(account) {

        // Check if the account key has been defined
        if (account.key != null) {

            // Scan the list of email accounts for which SEPAmail accounts have been configured
            for (var i = 0; i < this._smethEmailToQxbanObj.length; i++) {

                // Check if we are at the required account
                if (this._smethEmailToQxbanObj[i].account == account.key) {

                    // Get the status of the email account
                    return this._smethEmailToQxbanObj[i].status;
                }
            }
        }

        return 'INACTIVE';
    },

    /**
     * Get the default active SEPAmail account
     *
     * @method _getDefaultActiveAccount
     * @return Default active account or null if the account has not been defined
     */
    _getDefaultActiveAccount : function() {

        // Key of the default SEPAmail account
        var defaultAccountKey = null;

        // Get the key of the default account
        for (var i = 0; i < this._smethEmailToQxbanObj.length; i++) {

            // Check the status of the current account
            if (this._smethEmailToQxbanObj[i].status == 'DEFAULT_ACTIVE') {
                defaultAccountKey = this._smethEmailToQxbanObj[i].account;
                break;
            }
        }

        // Check if the key of the default account has been found
        if (defaultAccountKey != null) {

            // Account manager interface instance
            var accountManager = Components.classes["@mozilla.org/messenger/account-manager;1"]
                                           .getService(Components.interfaces.nsIMsgAccountManager);

            // List of registered accounts
            var accounts = accountManager.accounts;

            // Scan the list of accounts
            for (var j = 0; j < accounts.Count(); j++) {

                // Current account
                var currentAccount = accounts.QueryElementAt(j, Components.interfaces.nsIMsgAccount);

                // Check the key of the current account
                if (currentAccount.key == defaultAccountKey) {
                    return currentAccount;
                }
            }
        }

        return null;
    },

    /**
     * _getMessageCompositionAccount gets the account by which a message needs to be composed
     *
     * @method _getMessageCompositionAccount
     * @return The account that needs to be used to send a SEPAmail message
     */
    _getMessageCompositionAccount : function() {

        // Reload the SEPAmail account preferences "myqxbans"
        this._smethEmailToQxbanObj = JSON.parse(this._smethPreferences.getCharPref('myqxbans'));

        // Composition account
        var account = null;

        // Get the currently selected folder
        var msgFolder = gFolderDisplay ? GetFirstSelectedMsgFolder() : null;

        // Check if a folder has been selected
        if (msgFolder != null) {

            // Selected folder related account
            account = this._smethUtils.getAccountByFolder(msgFolder);

            // Check if an account was obtained
            if (account != null) {

                // Check the status of the account
                if (this._getAccountStatus(account) == 'INACTIVE') {

                    // Get the default SEPAmail account since selected account is not active
                    account = this._getDefaultActiveAccount();
                }
            }

        } else {

            // Get default SEPAmail account
            account = this._getDefaultActiveAccount();
        }

        // Check if an account for sending message has been determined
        if (account == null) {

            // Check if user selected a folder
            if (msgFolder != null) {

                // Use selected folder account to send SEPAmail message
                account = this._smethUtils.getAccountByFolder(msgFolder);

            } else {

                // Account manager interface instance
                var accountManager = Components.classes["@mozilla.org/messenger/account-manager;1"]
                                               .getService(Components.interfaces.nsIMsgAccountManager);

                // List of registered accounts
                var accounts = accountManager.accounts;

                // Check the number of accounts defined
                if (accounts.Count() > 0) {
                    account = accounts.QueryElementAt(0, Components.interfaces.nsIMsgAccount);
                }
            }
        }

        return account;
    },

    /**
     * Open a message composition window for a given template file name and account
     *
     * @method _openMessageComposition
     * @param {Object} account Thunderbird account object
     * @param {String} templateUrl The URL of the message type XML template
     */
    _openMessageComposition : function(account, templateUrl) {

        // Decalre the XMLHttpRequest to load the template XML
        var xmlHttpRequest = new XMLHttpRequest();

        // Send request for the template XML document
        xmlHttpRequest.open('GET', templateUrl, false);
        xmlHttpRequest.send();

        // Get the temple XML document object
        var templateXMLDocument = xmlHttpRequest.responseXML;

        // Compose service fields instance
        // @see https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/NsIMsgCompFields
        var composeFields = Components.classes["@mozilla.org/messengercompose/composefields;1"]
                                      .createInstance(Components.interfaces.nsIMsgCompFields);

        composeFields.body = ((new XMLSerializer()).serializeToString(templateXMLDocument));
        composeFields.characterSet = "UTF-8";
        composeFields.from = account.defaultIdentity.email;

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
    }
}

// Add the window load event listener
// Entry point of the Smeth plugin
// @see https://developer.mozilla.org/en-US/docs/Code_snippets/On_page_load
window.addEventListener("load", function load(event) {

    try {

        //remove listener, no longer needed
        window.removeEventListener("load", load, false);

        // Get the message pane
        var messagepane = document.getElementById("messagepane");

        // Check if the message pane is valid
        if (messagepane) {

            // Initialize the SMETHReadMessageController
            SMETHReadMessageController.init();

            // Initialise the automatic acknowledgement controller
            SMETHAutomaticAcknowledgementController.init();

            // Add load event for message pane to be triggered on each message select
            // @see https://developer.mozilla.org/en-US/docs/Code_snippets/On_page_load
            messagepane.addEventListener("load", function(event) {SMETHReadMessageController.onMessagePaneLoad(event);}, true);
        }

        // Message listener service
        // @see https://developer.mozilla.org/en-US/docs/Extensions/Thunderbird/HowTos/Common_Thunderbird_Use_Cases/Open_Folder
        var notificationService = Components.classes["@mozilla.org/messenger/msgnotificationservice;1"]
                                            .getService(Components.interfaces.nsIMsgFolderNotificationService);

        // Register listener for new messages
        // @see https://developer.mozilla.org/en-US/docs/Extensions/Thunderbird/HowTos/Common_Thunderbird_Use_Cases/Open_Folder
        notificationService.addListener(SMETHReadMessageController, notificationService.msgAdded);

        // Mail session instance
        var mailSession = Components.classes["@mozilla.org/messenger/services/session;1"]
                                    .getService(Components.interfaces.nsIMsgMailSession);

        // Define listeners for mail session events
        var folderListener = {
            OnItemAdded: function(parent, item, viewString) {},
            OnItemRemoved: function(parent, item, viewString) {},
            OnItemPropertyChanged: function(parent, item, viewString) {},
            OnItemIntPropertyChanged: function(item, property, oldValue, newValue) {},
            OnItemBoolPropertyChanged: function(item, property, oldValue, newValue) {},
            OnItemUnicharPropertyChanged: function(item, property, oldValue, newValue) {},
            OnItemPropertyFlagChanged: function(item, property, oldFlag, newFlag) {},
            OnItemEvent: function(item, event) {
                SMETHMessageListController.OnItemEvent(item, event);
                SMETHAutomaticAcknowledgementController.processQueue(item, event);
            },
            OnDeleteOrMoveMessagesCompleted: function(aFolder) {}
        }

        // Register listener on all folders of the mail session
        mailSession.AddFolderListener(folderListener, Components.interfaces.nsIFolderListener.all);

    } catch(ex) {
        SMETHReadMessageController._smethMessageHandler.exception(ex);
    }

}, false);