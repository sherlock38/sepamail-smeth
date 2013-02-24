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
 * @file SMETHAcknowledgementPreferencesController.js
 * @mvc controller
 * @version 1212
 * @since 1210
 * @author Bishan Kumar Madhoo
 * @description SMETHAcknowledgementPreferencesController manages the SMETH Acknowledgement configurations preference pane
 */

/**
 * SMETHMessageHandler class contain functions to handle info, error, warning and exceptions messages
 * 
 * @include SMETHMessageHandler.js
 */
Components.utils.import("resource://smeth/smethlib/SMETHMessageHandler.js");

/**
 * Strict mode for scripts
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Functions_and_function_scope/Strict_mode
 *
 */
"use strict";

/**
 * SMETHAcknowledgementPreferencesController manages the SMETH Acknowledgement configurations preference pane
 * 
 * @class SMETHAcknowledgementPreferencesController
 */
var SMETHAcknowledgementPreferencesController = {

    /**
     * Array of messages for which acknowledgement are allowed
     * 
     * @attribute _smethAcknowledgementMessageTypes
     * @private
     * @default null
     */
    _smethAcknowledgementMessageTypes : null,

    /**
     * Automatic acknowledgement configuration settings object
     * 
     * @attribute _smethAcknowledgementSettings
     * @private
     * @default null
     */
    _smethAcknowledgementSettings : null,

    /**
     * Declare the SMETHMessageHandler class
     * 
     * @attribute _smethMessageHandler
     * @private
     */
    _smethMessageHandler : new SMETHMessageHandler(window),

    /**
     * SMETH preferences initialisation flag
     * 
     * @attribute _smethPreferencesHasBeenInitialised
     * @private
     * @default false
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
     * Handle the focus event of the email addresses listbox
     * 
     * @method onEmailListGotFocus
     */
    onEmailListGotFocus : function() {

        // Listbox of email addresses
        var listboxEmailAddresses = document.getElementById('listboxEmail');

        // Check if an item in the listbox has been selected
        if (listboxEmailAddresses.selectedIndex == -1 && listboxEmailAddresses.getRowCount() > 0) {

            // Select the first item in the listbox
            listboxEmailAddresses.selectedIndex = 0;
        }
    },

    /**
     * Initialise the SMETH Acknowledgement configurations preference pane
     * 
     * @method onPaneLoad
     */
    onPaneLoad : function() {

        // Initialise SMETH preferences
        this._initSmethPreferences();

        // Get the list of email accounts for which acknowledgement settings can be configured
        this._populateEmailsList(this._getEmailAccounts(), true);

        // Setup UI as per availability of valid email accounts
        this._showNoAccountsUi(document.getElementById('listboxEmail').getRowCount() == 0);

        // Initialise message types
        this._smethAcknowledgementMessageTypes = new Array();

        // Message types string
        var messageTypes = this._smethPreferences.getCharPref('acknowledgement.types').split(',');

        // Fill in the values for message types
        for (var i = 0; i < messageTypes.length; i++) {
            this._smethAcknowledgementMessageTypes.push(messageTypes[i].trim());
        }

        // Sort the array of message types
        this._smethAcknowledgementMessageTypes.sort();

        try {

            // Initialise acknowledgement configuration settings object
            this._smethAcknowledgementSettings = JSON.parse(this._smethPreferences.getCharPref('acknowledgement.settings'));

        } catch (e) {
            this._smethMessageHandler.exception(e);
        }

    },

    /**
     * onPaneShown is called when the acknowledgement preference pane is displayed on the preference window
     * 
     * @method onPaneShown
     */
    onPaneShown : function() {

        // Message types string
        var messageTypes = this._smethPreferences.getCharPref('acknowledgement.types').split(',');

        // Check if the message types array has been defined
        if (this._smethAcknowledgementMessageTypes != null) {

            // Remove all message types
            if (this._smethAcknowledgementMessageTypes.length > 0) {
                this._smethAcknowledgementMessageTypes.splice(0, this._smethAcknowledgementMessageTypes.length);
            }

            // Fill in the values for message types
            for (var i = 0; i < messageTypes.length; i++) {
                this._smethAcknowledgementMessageTypes.push(messageTypes[i].trim());
            }

            // Sort the array of message types
            this._smethAcknowledgementMessageTypes.sort();
        }

        // Listbox of email addresses
        var listboxEmailAddresses = document.getElementById('listboxEmail');

        // Check if the listbox of email addresses was found
        if (listboxEmailAddresses != null) {

            // Check if an item in the listbox has been selected
            if (listboxEmailAddresses.getRowCount() > 0) {

                // Select the first item in the listbox
                listboxEmailAddresses.focus();

                // Reload UI for acknowledgement settings
                this.onSelectEmailItem();
            }
        }
    },

    /**
     * Handle the event triggered when an item in the email addresses listbox is selected
     * 
     * @method onSelectEmailItem
     */
    onSelectEmailItem : function() {

        // Listbox of email addresses
        var listboxEmailAddresses = document.getElementById('listboxEmail');

        // Tabs container
        var tabs = document.getElementById('ackConfigTabs');

        // Clear acknowledgement settings UI
        this._clearTabPanelsContent();
        this._clearTabs();

        // Create acknowledgement settings UI for selected item
        for (var i = 0; i < this._smethAcknowledgementMessageTypes.length; i++) {

            // Create tab element
            tabs.appendItem(this._smethAcknowledgementMessageTypes[i], this._smethAcknowledgementMessageTypes[i]);

            // Panel for acknowledgement settings UI
            var tabpanel = document.createElement('tabpanel');

            // Acknowledgement settings UI
            var acknowledgementSettingsUi = document.createElement('acknowledgementsettings');
            acknowledgementSettingsUi.setAttribute('automatic', '0');
            acknowledgementSettingsUi.setAttribute('id', listboxEmailAddresses.selectedItem.value + i);
            acknowledgementSettingsUi.setAttribute('flex', '1');

            // Add the acknowledgement settings UI to the panel
            tabpanel.appendChild(acknowledgementSettingsUi);

            // Append the panel to the panels container
            document.getElementById('ackConfigTabpanels').appendChild(tabpanel);

            // Acknowledgement settings
            var acknowledgementSettingsObj = this._getAcknowledgementSettings(listboxEmailAddresses.selectedItem.value,
                this._smethAcknowledgementMessageTypes[i]);

            // Set the acknowledgement settings
            if (acknowledgementSettingsObj != null) {
                acknowledgementSettingsUi.automatic = acknowledgementSettingsObj.automatic;
                acknowledgementSettingsUi.setAcknowledgementSettings(acknowledgementSettingsObj.defaults);
            }
        }

        // Select the first tab
        if (tabs.itemCount > 0) {
            tabs.selectedIndex = 0;
        }
    },

    /**
     * Save acknowledgement settings
     * 
     * @method saveSettings
     */
    saveSettings : function() {

        // Settings array
        var settings = new Array();

        // Listbox of email addresses
        var listboxEmailAddresses = document.getElementById('listboxEmail');

        // Tabs container
        var tabs = document.getElementById('ackConfigTabs');

        // Scan the list of tabs
        for (var i = 0; i < tabs.itemCount; i++) {

            // Acknowledgement settings element for current tab
            var acknowledgementSettings = document.getElementById(listboxEmailAddresses.selectedItem.value + i);

            // Settings for the current message type
            var messageTypeSettings = {
                'type' : tabs.getItemAtIndex(i).value,
                'automatic' : acknowledgementSettings.automaticSending ? '1' : '0',
                'defaults' : acknowledgementSettings.defaultSettings
            }

            // Add message type configurations to the settings array
            settings.push(messageTypeSettings);
        }

        // Index of acknowledgement settings for the current account
        var accountSettingIndex = this._getAccountAcknowledgementSettingsIndex(listboxEmailAddresses.selectedItem.value);

        // Remove the account settings from the acknowledgement settings object if found
        if (accountSettingIndex > -1) {
            this._smethAcknowledgementSettings.splice(accountSettingIndex, 1);
        }

        // Add account acknowledgement settings to acknowledgement settings object
        this._smethAcknowledgementSettings.push({"account" : listboxEmailAddresses.selectedItem.value,
            "settings" : settings});

        // Save acknowledgement settings
        this._smethPreferences.setCharPref('acknowledgement.settings',
            JSON.stringify(this._smethAcknowledgementSettings));
    },

    /**
     * Clear tab panels contents that might be defined in the tab panel container
     * 
     *  @method _clearTabPanelsContent
     */
    _clearTabPanelsContent : function() {

        // Tabpanels container
        var tabpanels = document.getElementById('ackConfigTabpanels');

        // Remove child nodes from the tabpanels container
        while (tabpanels.hasChildNodes()) {
            tabpanels.removeChild(tabpanels.lastChild);
        }
    },

    /**
     * Clear tab box content that might be defined in the tab box container
     * 
     * @method _clearTabs
     */
    _clearTabs : function() {

        // Tabs container
        var tabs = document.getElementById('ackConfigTabs');

        // Remove child nodes from the tabs container
        while (tabs.itemCount > 0) {
            tabs.removeItemAt(0);
        }
    },

    /**
     * Get the acknowledgement settings index for the specified account within the object of acknowledgement settings
     * 
     * @method _getAccountAcknowledgementSettingsIndex
     * @param {String} account Account key
     * @return {Integer} Index of acknowledgement settings object for the given account
     */
    _getAccountAcknowledgementSettingsIndex : function(account) {

        // Scan the array of settings
        for (var i = 0; i < this._smethAcknowledgementSettings.length; i++) {

            // Current account settings
            var currentAccountSettings = this._smethAcknowledgementSettings[i];

            // Check if we are at the settings for the required account
            if (currentAccountSettings.account == account) {
                return i;
            }
        }

        return -1;
    },

    /**
     * Get the automatic acknowledgement settings for a given account and message type
     *
     * @method _getAcknowledgementSettings
     * @param {String} account Email account key
     * @param {String} messageType Missive message type
     * @return {Object} Acknowledgement settings object
     */
    _getAcknowledgementSettings : function(account, messageType) {

        // Scan the array of settings that have already been configured
        for (var i = 0; i < this._smethAcknowledgementSettings.length; i++) {

            // Current account settings
            var currentAccountSettings = this._smethAcknowledgementSettings[i];

            // Check if we are at the required account settings
            if (currentAccountSettings.account == account) {

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
     * Get the list of email accounts for which acknowledgement settings can be configured
     *
     * @method _getEmailAccounts
     * @return {Array} Array of objects with email account settings
     */
    _getEmailAccounts : function() {

        var emailAccounts = new Array();

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

                // Add the account to the array of email accounts
                emailAccounts.push({"key" : currentAccount.key, "email" : currentAccount.defaultIdentity.email});
            }
        }

        return emailAccounts;
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
     * Fill the list of email addresses with email addresses for which acknowledgement settings can be configured
     *
     * @method _populateEmailsList
     * @param {array} emailAccounts Array of email account names and their associated keys
     */
    _populateEmailsList : function(emailAccounts) {

        // Listbox of email addresses
        var listboxEmailAddresses = document.getElementById('listboxEmail');

        // Add items to the listbox
        for (var i = 0; i < emailAccounts.length; i++) {
            listboxEmailAddresses.appendItem(emailAccounts[i].email, emailAccounts[i].key);
        }
    },

    /**
     * Setup the acknowledgement preferences UI as per availability of accounts for acknowledgement configuration settings
     *
     * @method _showNoAccountsUi
     * @param {boolean} hasNoAccount Whether we have accounts that can be configured with acknowledgement configuration settings
     */
    _showNoAccountsUi : function(hasNoAccount) {

        // Remove tabs
        this._clearTabs();

        // Remove tabpanels content
        this._clearTabPanelsContent();

        // Check if we have configurable accounts
        if (hasNoAccount) {

            // Disable listbox for email accounts
            document.getElementById('listboxEmail').disabled = true;

            // Disable Save button
            document.getElementById('buttonSaveAckConfig').disabled = true;

            // No accounts message container
            var container = document.createElement('vbox');
            container.setAttribute('align', 'center');
            container.setAttribute('flex', '1');
            container.setAttribute('pack', 'center');

            // No accounts message
            var description = document.createElement('description');
            description.setAttribute('crop', 'end');
            description.setAttribute('style', 'text-align:center;');
            description.textContent = SMETHAcknowledgementLocaleTexts.noAccountsAvailable;

            // Add label to container
            container.appendChild(description);

            // Display message
            document.getElementById('ackConfigTabpanels').appendChild(container);

        } else {

            // Disable listbox for email accounts
            document.getElementById('listboxEmail').disabled = false;

            // Disable Save button
            document.getElementById('buttonSaveAckConfig').disabled = false;
        }
    }
};