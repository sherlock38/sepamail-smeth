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
 * @file SMETHBankPreferencesController.js
 * @mvc controller
 * @version 1212
 * @since 1210
 * @author Bishan Kumar Madhoo
 * @description SMETHBankPreferencesController manages the SMETH bank details preference pane
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
 * SMETHBankPreferencesController manages the SMETH bank details preference pane
 *
 * @class SMETHBankPreferencesController
 */
var SMETHBankPreferencesController = {

    /**
     * Email accounts
     *
     * @attribute _emailAccounts
     * @private
     * @default null
     */
    _emailAccounts : null,

    /**
     * SMETH email addresses and QXBAN list object
     *
     * @attribute _smethEmailToQxbanObj
     * @private
     * @default null
     */
    _smethEmailToQxbanObj : null,

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
     * Initialise the SMETH bank details preference pane
     *
     * @method onPaneLoad
     */
    onPaneLoad : function() {

        // Initialise SMETH preferences
        this._initSmethPreferences();

        // Get the list of email accounts
        this._emailAccounts = this._getEmailAccounts();

        try {

            // Initialise the email addresses to QXBAN list object
            this._smethEmailToQxbanObj = JSON.parse(this._smethPreferences.getCharPref('myqxbans'));

        } catch (e) {
            this._smethMessageHandler.exception(e);
        }

        // Populate the listbox of email addresses and corresponding QXBAN
        this._refreshList();
    },

    /**
     * Handle the list of email address and corresponding QXBAN selection event
     *
     * @method onSelectListItem
     */
    onSelectListItem : function() {

        // Listbox of email addresses and corresponding QXBAN
        var listboxQxban = document.getElementById('listboxMyQxban');

        // Check if an item is selected
        if (listboxQxban.selectedItem != null) {

            // Set the values of the email address and QXBAN textboxes as per the selected item
            document.getElementById('textboxMyEmail').value =
                listboxQxban.selectedItem.children[0].getAttribute('label');
            document.getElementById('textboxMyQxban').value =
                listboxQxban.selectedItem.children[1].getAttribute('label');
            document.getElementById('menulistMyEmailStatus').value =
                this._getEmailStatusValue(listboxQxban.selectedItem.children[2].getAttribute('label'));

            // Enable the save button
            document.getElementById('buttonAddMyEmailQxbanTuple').disabled = false;
        }
    },

    /**
     * Save the QXBAN associated to an email address
     *
     * @method save
     */
    save : function() {

        // Email account status
        var status = document.getElementById('menulistMyEmailStatus').value;

        // Check if we are setting a default active email
        if (status == 'DEFAULT_ACTIVE') {

            // Reset the current default active
            this._removeDefaultActive();
        }

        // Get the key associated to the email address
        for (var i = 0; i < this._emailAccounts.length; i++) {

            // Check if we are at the required email address
            if (this._emailAccounts[i].email == document.getElementById('textboxMyEmail').value) {

                // Flag to indicate that the QXBAN associated was set
                var setFlag = false;

                // Set the QXBAN for the associated email address
                for (var j = 0; j < this._smethEmailToQxbanObj.length; j++) {

                    // Check if we have the required email address account
                    if (this._smethEmailToQxbanObj[j].account == this._emailAccounts[i].key) {
                        this._smethEmailToQxbanObj[j].qxban = document.getElementById('textboxMyQxban').value.trim();
                        this._smethEmailToQxbanObj[j].status = status;
                        setFlag = true;
                        break;
                    }
                }

                // Check if associated QXBAN was not updated
                if (!setFlag) {
                    this._smethEmailToQxbanObj.push({"account": this._emailAccounts[i].key,
                        "qxban" : document.getElementById('textboxMyQxban').value.trim(), "status" : status});
                }
            }
        }

        // Get the current selected index in the list
        var currentSelectedIndex = document.getElementById('listboxMyQxban').selectedIndex;

        // Clear the items in the listbox
        this._clearList();

        // Refresh the listbox
        this._refreshList();

        // Re-select the previously selected row
        document.getElementById('listboxMyQxban').selectedIndex = currentSelectedIndex;

        // Clear the email address and QXBAN textfields
        document.getElementById('textboxMyEmail').value = '';
        document.getElementById('textboxMyQxban').value = '';

        // Persist email address account to QXBAN associations
        this._smethPreferences.setCharPref('myqxbans', JSON.stringify(this._smethEmailToQxbanObj));

        // Disable the save button
        document.getElementById('buttonAddMyEmailQxbanTuple').disabled = true;

        // Set focus to the listbox
        document.getElementById('listboxMyQxban').focus();
    },

    /**
     * Remove the rows that are being displayed in the list of email addresses and corresponding QXBAN
     *
     * @method _clearList
     */
    _clearList : function() {

        // Listbox of email addresses and corresponding QXBAN
        var listboxQxban = document.getElementById('listboxMyQxban');

        // Remove all the rows in the list
        for (var i = listboxQxban.itemCount; i > -1; i--) {
            listboxQxban.removeItemAt(i);
        }
    },

    /**
     * Get the list of email accounts for which acknowledgement settings can be configured
     *
     * @method _getEmailAccounts
     * @return Array of objects with email account settings
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
     * Get the status label of an email account
     *
     * @method _getEmailStatusLabel
     * @param {Object} smethEmailToQxbanObj SEPAmail to email account association object
     * @return {String} Status label of the email account
     */
    _getEmailStatusLabel : function(smethEmailToQxbanObj) {

        // Email status label based on the status of the email
        switch (smethEmailToQxbanObj.status) {
            case 'DEFAULT_ACTIVE':
                return SMETHOptionLocale.defaultActiveStatus;
            case 'ACTIVE':
                return SMETHOptionLocale.activeStatus;
            case 'INACTIVE':
                return SMETHOptionLocale.inactiveStatus;
        }
    },

    /**
     * Get the status value of an email account
     *
     * @method _getEmailStatusValue
     * @param {String} emailStatusLabel Status label associated to an email account
     * @return {String} Status value of the email account
     */
    _getEmailStatusValue : function(emailStatusLabel) {

        // Email status value based on the status label of the email
        switch (emailStatusLabel) {
            case SMETHOptionLocale.defaultActiveStatus:
                return 'DEFAULT_ACTIVE';
            case SMETHOptionLocale.activeStatus:
                return 'ACTIVE';
            case SMETHOptionLocale.inactiveStatus:
                return 'INACTIVE';
        }
    },

    /**
     * Get the email account key to QXBAN association object
     *
     * @method _getQxbanByEmailAddressAccount
     * @param {String} account Account for which association object is required
     * @return {String} Email address account to QXBAN association object
     */
    _getQxbanByEmailAddressAccount : function(account) {

        // Scan the array of email address account to QXBAN association objects
        for (var i = 0; i < this._smethEmailToQxbanObj.length; i++) {

            // Current association object
            var currentItem = this._smethEmailToQxbanObj[i];

            // Check if we have the required object
            if (currentItem.account == account) {
                return currentItem;
            }
        }

        return null;
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
     * Remove any existing default active email account and set its status to active
     *
     * @method _removeDefaultActive
     */
    _removeDefaultActive : function() {

        // Check if we have more than 1 email account
        if (this._smethEmailToQxbanObj.length > 1) {

            // Scan the list of emails to SEPAmail account association objects
            for (var i = 0; i < this._smethEmailToQxbanObj.length; i++) {

                // Check the status of the current association object
                if (this._smethEmailToQxbanObj[i].status == 'DEFAULT_ACTIVE') {

                    // Reset the status of the default active email account
                    this._smethEmailToQxbanObj[i].status = 'ACTIVE';

                    // Exit the loop since there can only be one default active account
                    break;
                }
            }
        }
    },

    /**
     * Update the list of email addresses to QXBAN rows in the listbox
     *
     * @method _refreshList
     */
    _refreshList : function() {

        // Listbox of email addresses and corresponding QXBAN
        var listboxQxban = document.getElementById('listboxMyQxban');

        // Scan the array of email addresses
        for (var i = 0; i < this._emailAccounts.length; i++) {

            // Current email address
            var currentEmailAddress = this._emailAccounts[i];

            // Listbox row
            var row = document.createElement('listitem');

            // Add the email address to the row
            var emailCell = document.createElement('listcell');
            emailCell.setAttribute('label', currentEmailAddress.email);
            row.appendChild(emailCell);

            // Get email address account to QXBAN association object
            var associationObj = this._getQxbanByEmailAddressAccount(currentEmailAddress.key);

            // Add the corresponding QXBAN to the row
            var qxbanCell = document.createElement('listcell');
            qxbanCell.setAttribute('label', associationObj == null ? '' : associationObj.qxban);
            row.appendChild(qxbanCell);

            // Add email account status cell
            var statusCell = document.createElement('listcell');
            statusCell.setAttribute('label', associationObj == null ? SMETHOptionLocale.inactiveStatus :
                this._getEmailStatusLabel(associationObj));
            row.appendChild(statusCell);

            // Add the row to the listbox
            listboxQxban.appendChild(row);
        }
    }
};