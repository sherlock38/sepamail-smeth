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
 * @file SMETHComposeMessageController.js
 * @mvc controller
 * @version 1212
 * @since 1210
 * @author Ammit Heeramun
 * @description SMETHComposeMessageController is the class that is attached to SMETHComposeMessageView, it helps in the setting up the composition windows for the composition of different type of SEPAmail messages.
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
 * SMETHComposeMessageController class defines all the events that is related to "SMETHComposeMessageView"
 *
 * @class SMETHComposeMessageController
 */
var SMETHComposeMessageController = {


   /**
    * Compose window content frame
    *
    * @attribute _contentFrame
    * @private
    * @default null
    */
    _contentFrame : null,

    /**
     * Declare the SMETHMessageHandler class
     *
     * @attribute _smethMessageHandler
     * @private
     */
    _smethMessageHandler : new SMETHMessageHandler(window),

    /**
     * Smeth message type
     *
     * @attribute _smethMessageType
     * @private
     * @default null
     */
    _smethMessageType : null,

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
     * Declare the message compose object
     *
     * @attribute _msgCompose
     * @private
     * @default null
     */
    _msgCompose : null,

    /**
     * Initiation of the compose window
     *
     * @method init
     * @param {Object} event Event parameters
     * @see https://developer.mozilla.org/en-US/docs/Extensions/Thunderbird/HowTos/Common_Thunderbird_Use_Cases/Compose_New_Message
     */
    init : function (event) {

        try {
            // Instantiate the message compose object
            SMETHComposeMessageController._msgCompose = gMsgCompose;

            // Register the compose window state listener
            // @see https://developer.mozilla.org/en-US/docs/Extensions/Thunderbird/HowTos/Common_Thunderbird_Use_Cases/Compose_New_Message
            gMsgCompose.RegisterStateListener(SMETHComposeMessageController);

        } catch(ex) {
            SMETHComposeMessageController._smethMessageHandler.exception(ex);
        }
    },

    /**
     * NotifyComposeFieldsReady event raised when compose window is loaded and fields are ready
     *
     * @method NotifyComposeFieldsReady
     */
    NotifyComposeFieldsReady: function() {

    },

    /**
     * NotifyComposeBodyReady event notifies when the compose body is ready
     *
     * @method NotifyComposeBodyReady
     */
    NotifyComposeBodyReady: function() {

        try {

            // Get the compose window content frame
            this._contentFrame = document.getElementById("content-frame");

            // Get the content body
            var content = this._contentFrame.contentDocument.body.textContent;

             // Check if the SMETH compose window form container is present
            if (null != document.getElementById("smethComposeBodyFormContainer")) {
                 document.getElementById("appcontent").removeChild(document.getElementById("smethComposeBodyFormContainer"));
            }

            // Test for SEPAmail content
            if (content.length > 0) {

                // Check for SEPAmail report content
                if (SMETHReportController.isSEPAmailReport(content)) {

                    // We have a SEPAmail valid report missive XML
                    this._smethMessageType = 'SEPAMAIL_REPORT';

                    // Create SMETH form container
                    this._addSmethFormContainer();

                    // Initialise the compose message window
                    this._initialiseSmethComposeWindow();

                    // Call the NotifyComposeBodyReady event handler for SEPAMAIL_REPORT
                    SMETHReportController.NotifyComposeBodyReady();

                } else {

                    // Check for SEPAmail acknowledgement content
                    if (SMETHAcknowledgementController.isAcknowledgementMissiveMessage(content)) {

                        // We have a SEPAmail valid acknowledgement missive XML
                        this._smethMessageType = 'SEPAMAIL_ACKNOWLEDGEMENT';

                        // Create SMETH form container
                        this._addSmethFormContainer();

                        // Initialise the compose message window
                        this._initialiseSmethComposeWindow();

                        // Call the NotifyComposeBodyReady event handler for SEPAMAIL_REPORT
                        SMETHAcknowledgementController.NotifyComposeBodyReady();

                    } else {

                         // Check for SEPAmail request content
                        if (SMETHRequestController.isSEPAmailRequest(content)) {

                            // We have a SEPAmail valid report missive XML
                            this._smethMessageType = 'SEPAMAIL_REQUEST';

                            // Create SMETH form container
                            this._addSmethFormContainer();

                            // Initialise the compose message window
                            this._initialiseSmethComposeWindow();

                            // Call the NotifyComposeBodyReady event handler for SEPAMAIL_REQUEST
                            SMETHRequestController.NotifyComposeBodyReady();

                        } else {

                            // We do not have a SEPAmail valid content
                            this._smethMessageType = 'NORMAL';

                            // Remove SMETH specific compose window settings
                            this._disableSmethComposeWindow();
                        }
                    }
                }

            } else {

                // We do not have a SEPAmail valid content
                this._smethMessageType = 'NORMAL';

                // Remove SMETH specific compose window settings
                this._disableSmethComposeWindow();
            }

        } catch(ex) {
            SMETHComposeMessageController._smethMessageHandler.exception(ex);
        }
    },

    /**
     * ComposeProcessDone event notifies when the compose process has been completed
     *
     * @method ComposeProcessDone
     */
    ComposeProcessDone: function(aResult) {

    },

    /**
     * SaveInFolderDone event notifies when the save in folder has been completed
     *
     * @method SaveInFolderDone
     *
     */
    SaveInFolderDone: function(folderURI) {

    },

    /**
     * SendMailEventHandler event handles the send event of an email
     *
     * @method SendMailEventHandler
     * @param {Object} anEvent Event parameters
     */
    SendMailEventHandler : function(anEvent) {

        // Call the appropriate SendMailEventHandler as per the compose message window content
        switch (SMETHComposeMessageController._smethMessageType) {

            case 'SEPAMAIL_REPORT':
                try {
                    SMETHReportController.SendMailEventHandler(anEvent);
                } catch (e) {
                    SMETHComposeMessageController._smethMessageHandler.exception(e);
                }
                break;

            case 'SEPAMAIL_ACKNOWLEDGEMENT':
                try {
                    SMETHAcknowledgementController.SendMailEventHandler(anEvent);
                } catch (e) {
                    SMETHComposeMessageController._smethMessageHandler.exception(e);
                }
                break;

            case 'SEPAMAIL_REQUEST':
                try {
                    SMETHRequestController.SendMailEventHandler(anEvent);
                } catch (e) {
                    SMETHComposeMessageController._smethMessageHandler.exception(e);
                }
                break;

            default:
                // We do not handle other types of content and allow Thunderbird to control the sending of messages
        }
    },

    /**
     * AttachDocumentEventHandler event handles the attachment of SEPAmail Documents
     *
     * @method AttachDocumentEventHandler
     */
    AttachDocumentEventHandler : function() {

        // Call the appropriate AttachDocumentEventHandler as per the compose message window content
        switch (SMETHComposeMessageController._smethMessageType) {

            case 'SEPAMAIL_REPORT':

                try {

                    SMETHReportController.AttachDocumentEventHandler();

                } catch (e) {

                    SMETHComposeMessageController._smethMessageHandler.exception(e);
                }

                break;

            case 'SEPAMAIL_ACKNOWLEDGEMENT':

                try {

                    //SMETHAcknowledgementController.AttachDocumentEventHandler();
                    SMETHComposeMessageController._smethMessageHandler.info("SEPAmail attachments not yet handled acknowledgements");

                } catch (e) {

                    SMETHComposeMessageController._smethMessageHandler.exception(e);
                }

                break;

            case 'SEPAMAIL_REQUEST':

                try {

                    SMETHRequestController.AttachDocumentEventHandler();

                } catch (e) {

                    SMETHComposeMessageController._smethMessageHandler.exception(e);

                }

                break;

            default:
                // We do not handle other types of content and allow Thunderbird to control the sending of messages
        }
    },

    /**
     * Add the container for SMETH XUL forms to the compose window
     *
     * @method _addSmethFormContainer
     */
    _addSmethFormContainer : function() {

        // Create XUL VBOX element which will contain SMETH XUL forms for compose window
        var container = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
            "vbox");

        // Set the properties of the container VBOX
        container.setAttribute("id", "smethComposeBodyFormContainer");
        container.setAttribute("flex", "1");

        // Add the container to the compose message window
        document.getElementById("appcontent").appendChild(container);
    },

    /**
     * _adjustAddressingWidget function adjust addressing widget height as per the number of lines
     *
     * @method _adjustAddressingWidget
     * @param {Integer} aLinesNo Number of lines to display
     */
    _adjustAddressingWidget : function(aLinesNo) {

        var addressingWidget = document.getElementById('addressingWidget');
        var MsgHeadersToolbar = document.getElementById('MsgHeadersToolbar');

        //height of one row
        var oneRowHeight = document.getElementById('addressCol1#1').parentNode.boxObject.height;

        //how many height we need to add to get MsgHeadersToolbar height from rows height.
        //include all orther elements on MsgHeadersToolbar except addressingWidget client area
        var ExtraHeight = 2 + MsgHeadersToolbar.boxObject.height - addressingWidget.boxObject.element.clientHeight;

        //set min and current height...
        MsgHeadersToolbar.removeAttribute('minheight');
        MsgHeadersToolbar.style.minHeight = (oneRowHeight + ExtraHeight).toString() + 'px';
        MsgHeadersToolbar.style.height = (oneRowHeight * aLinesNo + ExtraHeight).toString() + 'px';

        //update addressingWidget internals
        awCreateOrRemoveDummyRows();
    },

    /**
     * Check if a given account key has been activated for sending SEPAmail messages
     *
     * @method _checkIfActive
     * @param {String} accountKey Account key that has to be checked for its active status
     * @return Whether the account is activated for sending SEPAmail messages
     */
    _checkIfActive : function(accountKey) {

        // Configuration of email accounts
        var accountsConfig = JSON.parse(this._smethPreferences.getCharPref('myqxbans'));

        // Scan the configuration settings for email accounts
        for (var i = 0; i < accountsConfig.length; i++) {

            // Check if we are at the required account
            if (accountsConfig[i].account == accountKey) {

                // Check the active status of the account
                return accountsConfig[i].status != 'INACTIVE';
            }
        }

        return false;
    },

    /**
     * Remove SMETH specific settings from the  the message compose window
     *
     * @method _disableSmethComposeWindow
     */
    _disableSmethComposeWindow : function() {

        // Get the formatting toolbar
        var formattingToolBox = document.getElementById("FormatToolbox");

        // Show the formatting toolbar
        formattingToolBox.hidden = false;

        // Show the content frame
        this._contentFrame.hidden = false;

        // Get the attachment button popup menu
        var attachmentButtonPopup = document.getElementById("button-attachPopup");

        // Show the attachment button popup menu
        attachmentButtonPopup.hidden = false;

        // Get the attachment button
        var attachmentButton = document.getElementById("button-attach");

        // Customize the attachment button to attache SEPAmail documents
        attachmentButton.setAttribute("type", "menu-button");
        attachmentButton.setAttribute("command", "cmd_attachFile");
        attachmentButton.setAttribute("ondragover", "nsDragAndDrop.dragOver(event, envelopeDragObserver);");
        attachmentButton.setAttribute("ondragdrop", "nsDragAndDrop.drop(event, envelopeDragObserver);");
        attachmentButton.setAttribute("ondragexit", "nsDragAndDrop.dragExit(event, envelopeDragObserver);");
        attachmentButton.setAttribute("oncommand", "goDoCommand('cmd_attachFile')");
    },

    /**
     * Get the index of a given account key in the list of addresses that a user can choose to send a SEPAmail message
     *
     * @method _getIndexOfAccountKeyInAddressList
     * @param {String} accountKey Account key for which corresponding address item index needs to be obtained
     * @return Index of given account in the list of addresses that a user can choose
     */
    _getIndexOfAccountKeyInAddressList : function(accountKey) {

        // List of accounts
        var accountsList = document.getElementById('msgIdentity');

        // Scan the list of accounts
        for (var i = 0; i < accountsList.itemCount; i++) {

            // Check if the we are at the required address item
            if (accountsList.getItemAtIndex(i).getAttribute("accountkey") == accountKey) {
                return i;
            }
        }

        return -1;
    },

    /**
     * Initialise the message compose window for SMETH
     *
     * @method _initialiseSmethComposeWindow
     */
    _initialiseSmethComposeWindow : function() {

        // Remove SMETH inactive accounts from  message composition address list
        this._removeInactiveAccount();

        // Get the formatting toolbar
        var formattingToolBox = document.getElementById("FormatToolbox");

        // Hide the formatting toolbar
        formattingToolBox.hidden = true;

        // Hide the content frame
        this._contentFrame.hidden = true;

        // Get the attachment button popup menu
        var attachmentButtonPopup = document.getElementById("button-attachPopup");

        // Show the attachment button popup menu
        attachmentButtonPopup.hidden = true;

        // Get the attachment button
        var attachmentButton = document.getElementById("button-attach");

        // Customize the attachment button to attache SEPAmail documents
        attachmentButton.setAttribute("type", "");
        attachmentButton.setAttribute("command", "");
        attachmentButton.setAttribute("ondragover", "");
        attachmentButton.setAttribute("ondragdrop", "");
        attachmentButton.setAttribute("ondragexit", "");
        attachmentButton.setAttribute("oncommand", "SMETHComposeMessageController.AttachDocumentEventHandler()");

        // Disable blank subject checking
        var genericSendMessageStr = GenericSendMessage.toString();
        genericSendMessageStr = genericSendMessageStr.replace("if (subject == \"\")", "if (false && subject == \"\")");
        genericSendMessageStr = genericSendMessageStr.replace("let", "var");
        eval("GenericSendMessage = " + genericSendMessageStr);

        // Get the addressing widget
        var addressingWidget = document.getElementById("addressingWidget");

        // Remove the all list item apart for the to list item.
        var menuPopup = addressingWidget.getElementsByTagName("menuitem");
        for (var i = 0; i < menuPopup.length; i++) {
            if("addr_to" != menuPopup[i].getAttribute("value")) {
                menuPopup[i].hidden = true;
            }
        }

        // Remove the compose toolbar sizer
        var composeToolbarSizer = document.getElementById("compose-toolbar-sizer");
        composeToolbarSizer.hidden = true;

        // Set the header box bottom border
        var appContent = document.getElementById("appcontent");
        appContent.setAttribute("style", "border-top: 1px solid threedshadow;");

        // Adjust the addressing widget height by one line
        this._adjustAddressingWidget(1);

        // Disable the addition of new rows in the addressing widget
        var awAppendNewRowStr = awAppendNewRow.toString();
        awAppendNewRowStr  = awAppendNewRowStr.replace("if (listbox && listitem1)", "if (false)");
        eval("awAppendNewRow = " + awAppendNewRowStr);

        // Get the encrypt checkbox menu item
        var menuSecurityEncryptRequire = document.getElementById("menu_securityEncryptRequire2");

        // Get the sign checkbox menu item
        var menuSecuritySign = document.getElementById("menu_securitySign2");

        // Verify that security options have not already been checked
        if (!(menuSecurityEncryptRequire.checked && menuSecuritySign.checked)) {

            // Allow user to setup certificates if not previously done so
            if(!gCurrentIdentity.getUnicharAttribute("encryption_cert_name") ||
                !gCurrentIdentity.getUnicharAttribute("signing_cert_name")) {

                // Show the message to setup certificates
                showNeedSetupInfo();

            }

            // Check if the encryption certificate has been setup
            if(gCurrentIdentity.getUnicharAttribute("encryption_cert_name") && !menuSecurityEncryptRequire.checked) {

                // Check the Encrypt this mail checkbox menu item
                menuSecurityEncryptRequire.click();
            }

            // Check if the sign certificate has been setup
            if (gCurrentIdentity.getUnicharAttribute("signing_cert_name") && !menuSecuritySign.checked) {

                // Check the Sign this mail checkbox menu item
                menuSecuritySign.click();
            }
        }
    },

    /**
     * Remove SMETH inactive accounts from the list of accounts
     *
     * @method _removeInactiveAccount
     */
    _removeInactiveAccount : function() {

        // Account keys that have to be removed
        var accountKeysToRemove = [];

        // List of accounts
        var accountsList = document.getElementById('msgIdentity');

        // Current account
        var currentAccountKey = '';

        // Get the current account key
        if (accountsList.selectedItem != null) {
            currentAccountKey = accountsList.selectedItem.getAttribute("accountkey");
        }

        // Scan the list of accounts
        for (var i = 0; i < accountsList.itemCount; i++) {

            // Check if the we are not at the currently selected account
            if (accountsList.getItemAtIndex(i).getAttribute("accountkey") != currentAccountKey) {

                // Add the account key to the array of keys that have to be removed if account has not been activated
                if (!this._checkIfActive(accountsList.getItemAtIndex(i).getAttribute("accountkey"))) {
                    accountKeysToRemove.push(accountsList.getItemAtIndex(i).getAttribute("accountkey"));
                }
            }
        }

        // Remove items that correspond to inactive accounts
        for (var j = 0; j < accountKeysToRemove.length; j++) {

            // Index of item corresponding to the inactive account
            var inactiveAccountIndex = this._getIndexOfAccountKeyInAddressList(accountKeysToRemove[j]);

            // Check if index of account was found
            if (inactiveAccountIndex > -1) {
                accountsList.removeItemAt(inactiveAccountIndex);
            }
        }
    }
}

// Add the compose window init event listener
// @see https://developer.mozilla.org/en-US/docs/Extensions/Thunderbird/HowTos/Common_Thunderbird_Use_Cases/Compose_New_Message
window.addEventListener("compose-window-init", SMETHComposeMessageController.init, true);

// could use document.getElementById("msgcomposeWindow") instead of window
// @see https://developer.mozilla.org/en-US/docs/Extensions/Thunderbird/HowTos/Common_Thunderbird_Use_Cases/Compose_New_Message
window.addEventListener( "compose-send-message", SMETHComposeMessageController.SendMailEventHandler, true);