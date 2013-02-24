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
 * @file SMETHAdvancedPreferencesController.js
 * @mvc controller
 * @version 1212
 * @since 1210
 * @author Bishan Kumar Madhoo
 * @description SMETHAdvancedPreferencesController manages the SMETH advanced preferences pane
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
 * SMETHAdvancedPreferencesController manages the SMETH advanced preferences pane
 * 
 * @class SMETHAdvancedPreferencesController
 */
var SMETHAdvancedPreferencesController = {

    /**
     * Array of message types for which acknowledgement missive XML documents are sent
     * 
     * @attribute _smethAcknowledgementMessageTypes
     * @private
     * @default null
     */
    _smethAcknowledgementMessageTypes: null,

    /**
     * Message composition settings
     * 
     * @attribute _smethCompositionSettings
     * @private
     * @default null
     */
    _smethCompositionSettings: null,

    /**
     * Settings for SMETH controller
     * 
     * @attribute _smethControllerConfigSettings
     * @private
     * @default null
     */
    _smethControllerConfigSettings: null,

    /**
     * List of ecosystems
     * 
     * @attribute _smethEcosystems
     * @private
     * @default null
     */
    _smethEcosystems: null,

    /**
     * Declare the SMETHMessageHandler class
     * 
     * @attribute _smethMessageHandler
     * @private
     */
    _smethMessageHandler : new SMETHMessageHandler(window),

    /**
     * Array of SEPAmail message types
     * 
     * @attribute _smethMessageTypes
     * @private
     * @default null
     */
    _smethMessageTypes : null,

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
                                  .getBranch('extensions.smeth.'),

    /**
     * Add a SEPAmail message type to the list of acknowledgement message types
     * 
     * @method addAcknowledgementMessageType
     */
    addAcknowledgementMessageType : function() {

        // SEPAmail message types listbox
        var listbox = document.getElementById('sepamailMessageTypes');

        // Get selected message type
        var messageType = listbox.getSelectedItem(0).value;

        // Add the message type to the array of acknowledgement message types
        this._smethAcknowledgementMessageTypes.push(messageType);

        // Clear all the items being displayed in the acknowledgement message types listbox
        this._clearListbox('acknowledgementMessageTypes');

        // Repopulate the listbox
        this._populateAcknowledgementMessageTypes();

        // Disable the add SEPAmail message type to acknowledgement message types button
        document.getElementById('addAcknowledgementMessageType').disabled = true;

        // Set focus to the SEPAmail message types listbox
        listbox.focus();
    },

    /**
     * Add a new ecosystem to SMETH
     * 
     * @method addEcosystem
     */
    addEcosystem : function() {

        // Thunderbird prompt service
        var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                .getService(Components.interfaces.nsIPromptService);

        // Prompt window defaults
        var check = {value : false};

        // New ecosystem name
        var name = {value: ''};

        // Prompt user for new ecosystem name
        var result = prompts.prompt(null, SMETHAdvancedPrefpaneLocale.newEcosystemTitle,
            SMETHAdvancedPrefpaneLocale.newEcosystemPrompt, name, null, check);

        // Check if user has chosen to add a new ecosystem and a name has been specified
        if (result && name.value.trim().length > 0) {

            // Unique ID generator
            var uuidGenerator = Components.classes["@mozilla.org/uuid-generator;1"]
                                          .getService(Components.interfaces.nsIUUIDGenerator);

            // Add new ecosystem object
            this._smethEcosystems.push({id : uuidGenerator.generateUUID().toString(), name: name.value.trim()});

            // Refresh the list of ecosystems
            this._populateEcosystems();
        }

        // Set focus to the listbox
        document.getElementById('ecosystemsListbox').focus();
    },

    /**
     * Add a SEPAmail message type
     * 
     * @method addMessageType
     */
    addMessageType : function() {

        // SEPAmail message type textbox
        var textbox = document.getElementById('messageTypeValue');

        // Add the message type to the array of SEPAmail message types
        this._smethMessageTypes.push(textbox.value);

        // Clear all the items being displayed in the SEPAmail message types listbox
        this._clearListbox('sepamailMessageTypes');

        // Populate the list of SEPAmail message types
        this._populateMessageTypes();

        // Add new message type to SEPAmail message types listbox
        document.getElementById('sepamailMessageTypeSettings').appendItem(textbox.value, textbox.value);

        // Create settings UI for new message type
        var messageTypeSettingsUi = document.createElement('sepamailmessagetypesettings');
        messageTypeSettingsUi.setAttribute('flex', '1');
        messageTypeSettingsUi.setAttribute('messageType', textbox.value);
        document.getElementById('sepamailMessageTypeSettingsContainer').appendChild(messageTypeSettingsUi);

        // Clear the new SEPAmail message type textbox
        textbox.value = '';

        // Disable the add new SEPAmail message type button
        document.getElementById('addMessageType').disabled = true;

        // Set focus to the SEPAmail message types listbox
        document.getElementById('sepamailMessageTypes').focus();
    },

    /**
     * Modify an existing ecosystem
     * 
     * @method modifyEcosystem
     * @see https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIPromptService
     */
    modifyEcosystem : function() {

        // Ecosystem listbox
        var listbox = document.getElementById('ecosystemsListbox');

        // Thunderbird prompt service
        // @see https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIPromptService
        var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                .getService(Components.interfaces.nsIPromptService);

        // Prompt window defaults
        var check = {value : false};

        // New ecosystem name
        var name = {value: listbox.selectedItem.label};

        // Prompt user for new ecosystem name
        var result = prompts.prompt(null, SMETHAdvancedPrefpaneLocale.newEcosystemTitle,
            SMETHAdvancedPrefpaneLocale.newEcosystemPrompt, name, null, check);

        // Check if user has chosen to add a new ecosystem and a name has been specified
        if (result && name.value.trim().length > 0) {

            // Get the index of the ecosystem that is being modified
            var ecosystemIndex = this._getEcosystemIndex(listbox.selectedItem.value);

            // Check if the ecosystem was found
            if (ecosystemIndex > -1) {

                // Update the array of ecosystems
                this._smethEcosystems[ecosystemIndex].name = name.value.trim();

                // Refresh the list of ecosystems
                this._populateEcosystems();
            }
        }

        // Set focus to the listbox
        listbox.focus();
    },

    /**
     * Handle the event triggered message composition tab is selected
     * 
     * @method onComposeMessageTabSelected
     */
    onComposeMessageTabSelected : function() {

        // Check if we have ecosystems and SEPAmail message types for message composition
        if (document.getElementById('ecosystemMenuList').itemCount == 0 &&
            document.getElementById('messageTypeMenuList').itemCount == 0) {
            this._showNoComposeMenuUi(SMETHAdvancedPrefpaneLocale.nodefinedEcosystemAndMessageTypeMessage);
        }
    },

    /**
     * Handle the event triggered when a user changes the value in the message composition settings UI
     * 
     * @method onCompositionSettingTextboxesInput
     */
    onCompositionSettingTextboxesInput : function() {

        // Message composition settings UI textboxes
        var textboxXml = document.getElementById('messageCompositionXml');
        var textboxXsl = document.getElementById('messageCompositionXsl');

        // Check if input is valid
        if (textboxXml.value.trim().length > 0 && textboxXsl.value.trim().length > 0) {
            document.getElementById('saveMessageCompositionSetting').disabled = false;
        } else {
            document.getElementById('saveMessageCompositionSetting').disabled = true;
        }
    },

    /**
     * Handle the event called when the SEPAmail message settings tab is selected
     * 
     * @method onMessageTypeSettingsTabSelected
     */
    onMessageTypeSettingsTabSelected : function() {

        // Message types listbox
        var listbox = document.getElementById('sepamailMessageTypeSettings');

        // Check if the listbox has items and no item is selected
        if (listbox.itemCount > 0 && listbox.selectedIndex < 0) {
            listbox.selectedIndex = 0;
        }
    },

    /**
     * Handle the event triggered when user inputs text in the SEPAmail message type textbox
     * 
     * @method onMessageTypeInput
     */
    onMessageTypeInput : function() {

        // SEPAmail message type textbox
        var textbox = document.getElementById('messageTypeValue');

        // Add SEPAmail message type button
        var button = document.getElementById('addMessageType');

        // Check if the textbox contains a valid message type name
        if (textbox.value.trim().length > 0) {

            // Check that the array of SEPAmail message types does not already contain the new message type name
            if (this._getMessageTypeIndex(textbox.value.trim()) == -1) {

                // Enable the add SEPAmail message type button
                button.disabled = false;

            } else {

                // Disable the add SEPAmail message type button
                button.disabled = true;
            }

        } else {

            // Disable the add SEPAmail message type button
            button.disabled = true;
        }
    },

    /**
     * Initialise the SMETH QXBAN preference pane
     * 
     * @method onPaneLoad
     */
    onPaneLoad : function() {

        // Initialise SMETH preferences
        this._initSmethPreferences();

        try {

            // Get missive root tag name
            document.getElementById('rootTagValue').value = this._smethPreferences.getCharPref('missive.prefRootTag');

            // Get XPath for retrieving the message type from a SEPAmail message
            document.getElementById('xPathValue').value = this._smethPreferences.getCharPref('missive.prefMsgTypXpath');

            // List of SEPAmail messages
            this._getMessageTypes();
            this._clearListbox('sepamailMessageTypes');
            this._populateMessageTypes();

            // List of acknowledgement message types
            this._getAcknowledgementMessageTypes();
            this._clearListbox('acknowledgementMessageTypes');
            this._populateAcknowledgementMessageTypes();

            // SMETH ecosystems
            this._smethEcosystems = JSON.parse(this._smethPreferences.getCharPref('ecosystems'));

            // Populate the list of ecosystems
            this._populateEcosystems();

            // Get SEPAmail composition settings
            this._smethCompositionSettings = JSON.parse(this._smethPreferences.getCharPref('compositions'));

            // Populate the list of message composition settings
            this._populateCompositionSettings();

            // Fill in the ecosystem combobox on the message composition tab
            this._fillEcosystems();

            // Fill in the message types combobox on the message composition tab
            this._fillMessageTypes();

            // Check if we have ecosystems and SEPAmail message types for message composition
            if (document.getElementById('ecosystemMenuList').itemCount == 0 &&
                document.getElementById('messageTypeMenuList').itemCount == 0) {
                this._showNoComposeMenuUi(SMETHAdvancedPrefpaneLocale.nodefinedEcosystemAndMessageTypeMessage);
            }

            // SMETH controller settings
            this._smethControllerConfigSettings = JSON.parse(this._smethPreferences.getCharPref('controller.config'));

            // List of message type settings
            this._clearListbox('sepamailMessageTypeSettings');
            this._populateMessageSettingTypes();

            // Create UI each SEPAmail message type
            this._createMessageTypeSettingsUi();

        } catch (e) {
            this._smethMessageHandler.exception(e);
        }
    },

    /**
     * Handle the event triggered when an item in the list of SEPAmail acknowledgement message types is selected
     * 
     * @method onSelectAcknowledgementMessageTypeItem
     */
    onSelectAcknowledgementMessageTypeItem : function() {

        // Enable the remove SEPAmail message type button
        document.getElementById('removeAckMessageType').disabled = false;
    },

    /**
     * Handle the event triggered when an item in the ecosystem listbox is selected
     * 
     * @method onSelectEcosystem
     */
    onSelectEcosystem : function() {

        // Ecosystems listbox
        var listbox = document.getElementById('ecosystemsListbox');

        // Check if an ecosystem was selected
        if (listbox.selectedIndex > -1) {

            // Enable ecosystem action buttons
            document.getElementById('modifyEcosystem').disabled = false;
            document.getElementById('deleteEcosystem').disabled = false;

        } else {

            // Disable ecosystem action buttons
            document.getElementById('modifyEcosystem').disabled = true;
            document.getElementById('deleteEcosystem').disabled = true;
        }
    },

    /**
     * Handle the event triggered when an item in the list of message composition settings is selected
     * 
     * @method onSelectCompositionSetting
     */
    onSelectCompositionSetting : function() {

        // Message composition settings UI elements
        var listbox = document.getElementById('composeMessageSettingsList');

        // Check if an item is selected
        if (listbox.selectedIndex > -1) {

            // Show the parameters for the selected setting
            document.getElementById('ecosystemMenuList').value = this._smethCompositionSettings[listbox.selectedIndex].ecosystemId;
            document.getElementById('messageTypeMenuList').value = this._smethCompositionSettings[listbox.selectedIndex].messageType;
            document.getElementById('messageCompositionXml').value = this._smethCompositionSettings[listbox.selectedIndex].xml;
            document.getElementById('messageCompositionXsl').value = this._smethCompositionSettings[listbox.selectedIndex].xsl;
            document.getElementById('saveMessageCompositionSetting').disabled = false;
            document.getElementById('deleteMessageCompositionSetting').disabled = false;

        } else {

            // Reset the values displayed in the new message composition settings UI
            document.getElementById('ecosystemMenuList').selectedIndex = 0;
            document.getElementById('messageTypeMenuList').selectedIndex = 0;
            document.getElementById('messageCompositionXml').value = '';
            document.getElementById('messageCompositionXsl').value = '';
            document.getElementById('saveMessageCompositionSetting').disabled = true;
            document.getElementById('deleteMessageCompositionSetting').disabled = true;
        }
    },

    /**
     * Handle the event triggered when a message type is selected in the message settings list
     * 
     * @method onSelectMessageSettingType
     */
    onSelectMessageSettingType : function() {

        // Show the message settings for the selected message type
        document.getElementById('sepamailMessageTypeSettingsContainer').selectedIndex =
            document.getElementById('sepamailMessageTypeSettings').selectedIndex;
    },

    /**
     * Handle the event triggered when an item in the list of SEPAmail message types is selected
     * 
     * @method onSelectMessageTypeItem
     */
    onSelectMessageTypeItem : function() {

        // SEPAmail message types listbox
        var listbox = document.getElementById('sepamailMessageTypes');

        // Enable the remove SEPAmail message type button
        document.getElementById('removeMessageType').disabled = false;

        // Check if an item is selected
        if (listbox.selectedIndex > -1) {

            // Check if the selected message type exists in the array of acknowledgement message types
            if (this._getAcknowledgementMessageTypeIndex(listbox.getSelectedItem(0).value) == -1) {

                // Enable the button which allows a user to add a SEPAmail message type to the list of acknowledgement
                // message types
                document.getElementById('addAcknowledgementMessageType').disabled = false;

            } else {

                // Disable the button which allows a user to add a SEPAmail message type to the list of acknowledgement
                // message types
                document.getElementById('addAcknowledgementMessageType').disabled = true;
            }

        } else {

            // Disable the button which allows a user to add a SEPAmail message type to the list of acknowledgement
            // message types
            document.getElementById('addAcknowledgementMessageType').disabled = true;
        }

    },

    /**
     * Remove the selected message type from the acknowledgement message type list
     * 
     * @method removeAckMessage
     */
    removeAckMessage : function() {

        // SEPAmail acknowledgement message types listbox
        var listbox = document.getElementById('acknowledgementMessageTypes');

        // Get the index of the selected message type from the array of acknowledgement message types
        var messageTypeIndex = this._getAcknowledgementMessageTypeIndex(listbox.getSelectedItem(0).value);

        // Check if the message type was found
        if (messageTypeIndex > -1) {

            // Remove the item from the array of acknowledgement message types
            this._smethAcknowledgementMessageTypes.splice(messageTypeIndex, 1);

            // Clear all the items being displayed in the acknowledgement message types listbox
            this._clearListbox('acknowledgementMessageTypes');

            // Repopulate the listbox
            this._populateAcknowledgementMessageTypes();

            // Disable the remove acknowledgement message type button
            document.getElementById('removeAckMessageType').disabled = true;

            // Focus the acknowledgement message types listbox
            listbox.focus();
        }
    },

    /**
     * Delete an existing ecosystem and related compose message settings
     * 
     * @method removeEcosystem
     */
    removeEcosystem : function() {

        // Ecosystem listbox
        var listbox = document.getElementById('ecosystemsListbox');

        // Check if an item has been selected
        if (listbox.selectedIndex > -1) {

            // Thunderbird prompt service
            var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                          .getService(Components.interfaces.nsIPromptService);

            // Check if user really wants to remove the selected SEPAmail message type
            if (promptService.confirm(window, SMETHAdvancedPrefpaneLocale.deleteEcosystemTitle,
                SMETHAdvancedPrefpaneLocale.deleteEcosystemPrompt)) {

                // Find the index of the selected ecosystem
                var ecosystemIndex = this._getEcosystemIndex(listbox.selectedItem.value);

                // Get the ID of the ecosystem
                var ecosystemId = this._smethEcosystems[ecosystemIndex].id;

                // Remove the ecosystem for the array of ecosystems
                this._smethEcosystems.splice(ecosystemIndex, 1);

                // Remove message composition settings for the ecosystem
                this._removeCompositionSettingsByEcosystemId(ecosystemId);

                // Fill in the ecosystem combobox on the message composition tab
                this._fillEcosystems();

                // Refresh the list of ecosystems
                this._populateEcosystems();
            }
        }

        listbox.focus();
    },

    /**
     * Remove message composition setting
     * 
     * @method removeMessageCompositionSetting
     */
    removeMessageCompositionSetting : function() {

        // Message composition settings UI elements
        var listbox = document.getElementById('composeMessageSettingsList');

        // Check if an item has been selected
        if (listbox.selectedIndex > -1) {

            // Remove the selected item from the message composition settings array
            this._smethCompositionSettings.splice(listbox.selectedIndex, 1);

            // Refresh the list of settings
            this._populateCompositionSettings();
        }

        listbox.focus();
    },

    /**
     * Remove the selected SEPAmail message type from the list of SEPAmail message types
     * 
     * @method removeMessageType
     */
    removeMessageType : function() {

        // Thunderbird prompt service
        var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                      .getService(Components.interfaces.nsIPromptService);

        // Check if user really wants to remove the selected SEPAmail message type
        if (promptService.confirm(window, SMETHAdvancedPrefpaneLocale.confirmDialogTitle,
            SMETHAdvancedPrefpaneLocale.confirmDialogPrompt)) {

            // SEPAmail message types listbox
            var listbox = document.getElementById('sepamailMessageTypes');

            // Selected message type
            var selMessageType = listbox.getSelectedItem(0).value;

            // Index of selected SEPAmail message type in the array of acknowledgement message types
            var acknowledgementMessageTypeIndex = this._getAcknowledgementMessageTypeIndex(selMessageType);

            // Check if the SEPAmail message type exists in the list of acknowledgement message types
            if (acknowledgementMessageTypeIndex > -1) {

                // Remove the acknowledgement message type
                this._smethAcknowledgementMessageTypes.splice(acknowledgementMessageTypeIndex, 1);

                // Clear the list of acknowledgement message types
                this._clearListbox('acknowledgementMessageTypes');

                // Populate the list of acknowledgement message types
                this._populateAcknowledgementMessageTypes();

                // Disable the remove acknowledgement message type button
                document.getElementById('removeAckMessageType').disabled = true;
            }

            // Index of the selected SEPAmail message type
            var sepamailMessageTypeIndex = this._getMessageTypeIndex(selMessageType);

            // Remove the SEPAmail message type from the array of SEPAmail message types
            this._smethMessageTypes.splice(sepamailMessageTypeIndex, 1);

            // SEPAmail acknowledgement message types listbox
            var settingsListbox = document.getElementById('sepamailMessageTypeSettings');

            // Settings UI deck
            var deck = document.getElementById('sepamailMessageTypeSettingsContainer');

            // Clear message type settings list selection if the message type is currently selected and reset the
            // selected deck index
            if (settingsListbox.selectedIndex == sepamailMessageTypeIndex) {
                settingsListbox.selectedIndex = -1;
                deck.selectedIndex = -1;
            }

            // Remove message type from the list
            settingsListbox.removeItemAt(sepamailMessageTypeIndex);

            // Remove message composition settings for the current message type
            this._removeCompositionSettingsByMessageType(selMessageType);

            // Update message types combobox on the message composition tab
            this._fillMessageTypes();

            // Remove the settings UI from the settings UI deck
            var deckChild = null;
            for (var i = 0; i < deck.children.length; i++) {

                // Check the message type being handled by the current deck child
                if (deck.children[i].getAttribute('messageType') == selMessageType) {

                    // Deck child that needs to be removed from the deck
                    deckChild = deck.children[i];
                    break;
                }
            }

            // Remove the child from the deck
            deck.removeChild(deckChild);

            // Clear the list of SEPAmail message types being displayed
            this._clearListbox('sepamailMessageTypes');

            // Populate the list of SEPAmail message types
            this._populateMessageTypes();

            // Disable the remove SEPAmail message type button
            document.getElementById('removeMessageType').disabled = true;
        }

        // Set focus to list of SEPAmail message types
        document.getElementById('sepamailMessageTypes').focus();
    },

    /**
     * Persist advanced settings
     * 
     * @method saveAdvancedSettings
     */
    saveAdvancedSettings : function() {

        // Persist missive root tag name
        this._smethPreferences.setCharPref('missive.prefRootTag', document.getElementById('rootTagValue').value.trim());

        // Persist XPath for retrieving the message type from a SEPAmail message
        this._smethPreferences.setCharPref('missive.prefMsgTypXpath', document.getElementById('xPathValue').value.trim());

        // Persist SEPAmail message types
        this._smethPreferences.setCharPref('missive.prefSEPAmailMessageTypes', this._smethMessageTypes.join(';'));

        // Persist SEPAmail acknowledgement message types
        this._smethPreferences.setCharPref('acknowledgement.types', this._smethAcknowledgementMessageTypes.join());

        // Persist ecosystems
        this._smethPreferences.setCharPref('ecosystems', JSON.stringify(this._smethEcosystems));

        // Persist message composition settings
        this._smethPreferences.setCharPref('compositions', JSON.stringify(this._smethCompositionSettings));

        // Message type settings UI container
        var deck = document.getElementById('sepamailMessageTypeSettingsContainer');

        // Message type settings array
        var messageTypeSettings = [];

        // Build the array of settings for message types
        for (var i = 0; i < deck.children.length; i++) {

            // Current deck child
            var currentDeckChild = deck.children[i];

            // Settings for the current message type
            messageTypeSettings.push({"type" : currentDeckChild.getAttribute('messageType'),
                "settings" : currentDeckChild.settings });
        }

        // Persist message type settings
        this._smethControllerConfigSettings = messageTypeSettings;
        this._smethPreferences.setCharPref('controller.config', JSON.stringify(this._smethControllerConfigSettings));
    },

    /**
     * Save message composition settings
     * 
     * @method saveMessageCompositionSetting
     */
    saveMessageCompositionSetting : function() {

        // Message composition settings UI elements
        var ecosystemCombobox = document.getElementById('ecosystemMenuList');
        var messageTypeCombobox = document.getElementById('messageTypeMenuList');
        var xmlTextbox = document.getElementById('messageCompositionXml');
        var xslTextbox = document.getElementById('messageCompositionXsl');

        // Get the message composition setting index
        var messageCompositionSettingIndex = this._getCompositionSettingsIndex(ecosystemCombobox.value,
            messageTypeCombobox.value);

        // Check if a composition setting for the given ecosystem and message type was found
        if (messageCompositionSettingIndex > -1) {

            // Update the details of the existing composition settings
            this._smethCompositionSettings[messageCompositionSettingIndex].xml = xmlTextbox.value.trim();
            this._smethCompositionSettings[messageCompositionSettingIndex].xsl = xslTextbox.value.trim();

        } else {

            // Add a new message composition setting
            this._smethCompositionSettings.push({ ecosystemId: ecosystemCombobox.value,
                messageType: messageTypeCombobox.value, xml: xmlTextbox.value.trim(), xsl: xslTextbox.value.trim()});
        }

        // Repopulate the list of message composition settings
        this._populateCompositionSettings();
    },

    /**
     * Clear the items in a combobox
     *
     * @param {String} comboboxId ID of the combobox that needs to be cleared
     * @method _clearCombobox
     */
    _clearCombobox : function(comboboxId) {

        // Get combobox
        var combobox = document.getElementById(comboboxId);

        // Check if combobox was obtained
        if (combobox != null) {

            // Check if the combobox contains items
            if (combobox.itemCount > 0) {

                // Remove items from the listbox
                while (combobox.itemCount > 0) {
                    combobox.removeItemAt(0);
                }
            }
        }
    },

    /**
     * Clear the items in a listbox
     *
     * @param {String} listboxId ID of the listbox that needs to be cleared
     * @method _clearListbox
     */
    _clearListbox : function(listboxId) {

        // Get listbox
        var listbox = document.getElementById(listboxId);

        // Check if listbox was obtained
        if (listbox != null) {

            // Check if the listbox contains rows
            if (listbox.getRowCount() > 0) {

                // Remove items from the listbox
                while (listbox.getRowCount() > 0) {
                    listbox.removeItemAt(0);
                }
            }
        }
    },

    /**
     * Clear the children of the message type settings deck
     * 
     * @method _clearMessageTypeSettingsDeck
     */
    _clearMessageTypeSettingsDeck : function() {

        // Message type settings deck
        var deck = document.getElementById('sepamailMessageTypeSettingsContainer');

        // Remove the children of the deck
        while (deck.hasChildNodes()) {
            deck.removeChild(deck.lastChild);
        }
    },

    /**
     * Create settings UI for SEPAmail message types
     * 
     * @method _createMessageTypeSettingsUi
     */
    _createMessageTypeSettingsUi : function() {

        // Remove all children in the deck
        this._clearMessageTypeSettingsDeck();

        // Message type settings deck
        var deck = document.getElementById('sepamailMessageTypeSettingsContainer');

        // Scan the list of SEPAmail message types
        for (var i = 0; i < this._smethMessageTypes.length; i++) {

            // Message type settings UI
            var messageTypeSettingsUi = document.createElement('sepamailmessagetypesettings');
            messageTypeSettingsUi.setAttribute('flex', '1');
            messageTypeSettingsUi.setAttribute('messageType', this._smethMessageTypes[i]);

            // Current settings for the message type
            var messageTypeSettings = this._getSettingsForMessageType(this._smethMessageTypes[i]);

            // Check if we have settings for the given message type
            if (messageTypeSettings != null) {
                messageTypeSettingsUi.setAttribute('bodyXSL', messageTypeSettings.body);
                messageTypeSettingsUi.setAttribute('hasAttachment', messageTypeSettings.hasAttachments);
            }

            // Append the panel to the panels container
            deck.appendChild(messageTypeSettingsUi);
        }
    },

    /**
     * Fill the ecosystem combobox on the composition menu tab
     * 
     * @method _fillEcosystems
     */
    _fillEcosystems : function() {

        // Clear items in the combobox
        this._clearCombobox('ecosystemMenuList');

        // Ecosystems combobox
        var combobox = document.getElementById('ecosystemMenuList');

        // Scan the array of SEPAmail ecosystems
        for (var i = 0; i < this._smethEcosystems.length; i++) {

            // Add ecosystem to the combobox
            combobox.appendItem(this._smethEcosystems[i].name, this._smethEcosystems[i].id, '');
        }

        // Select the first item in the combobox if it contains items
        if (combobox.itemCount > 0) {
            combobox.selectedIndex = 0;
        } else {
            this._showNoComposeMenuUi(SMETHAdvancedPrefpaneLocale.nodefinedEcosystemMessage);
        }
    },

    /**
     * Fill the SEPAmail message types combobox on the composition menu tab
     * 
     * @method _fillMessageTypes
     */
    _fillMessageTypes : function() {

        // Clear items in the combobox
        this._clearCombobox('messageTypeMenuList');

        // Message types combobox
        var combobox = document.getElementById('messageTypeMenuList');

        // Scan the array of SEPAmail message types
        for (var i = 0; i < this._smethMessageTypes.length; i++) {

            // Add message type to the combobox
            combobox.appendItem(this._smethMessageTypes[i], this._smethMessageTypes[i], '');
        }

        // Select the first item in the combobox if it contains items
        if (combobox.itemCount > 0) {
            combobox.selectedIndex = 0;
        } else {
            this._showNoComposeMenuUi(SMETHAdvancedPrefpaneLocale.nodefinedMessageTypeMessage);
        }
    },

    /**
     * Get the index of a given acknowledgement message type from the array of acknowledgement message types
     *
     * @method _getAcknowledgementMessageTypeIndex
     * @param {String} messageType Acknowledgement message type
     * @return {Integer} Index of the message type in the array of acknowledgement message type
     */
    _getAcknowledgementMessageTypeIndex : function(messageType) {

        // Scan the array of acknowledgement message types
        for (var i = 0; i < this._smethAcknowledgementMessageTypes.length; i++) {

            // Check if we are at the required message type
            if (this._smethAcknowledgementMessageTypes[i] == messageType) {

                // Required message type has been found
                return i;
            }
        }

        // Message type was not found in the acknowledgement message type array
        return -1;
    },

    /**
     * Build the array of SEPAmail message types for which acknowledgement missive documents are sent
     * 
     * @method _getAcknowledgementMessageTypes
     */
    _getAcknowledgementMessageTypes : function() {

        // Initialise SEPAmail acknowledgement message types array
        if (this._smethAcknowledgementMessageTypes == null) {
            this._smethAcknowledgementMessageTypes = new Array();
        }

        // Acknowledgement message types
        var ackMessageTypes = this._smethPreferences.getCharPref('acknowledgement.types').split(',');

        // Build the array of acknowledgement message types
        for (var i = 0; i < ackMessageTypes.length; i++) {
            this._smethAcknowledgementMessageTypes.push(ackMessageTypes[i].trim());
        }

        // Sort the array of acknowledgement message types
        this._smethAcknowledgementMessageTypes.sort();
    },

    /**
     * Get the index of a message composition setting for a specific ecosystem and message type
     *
     * @method _getCompositionSettingsIndex
     * @param {String} ecosystemId ID of ecosystem
     * @param {String} messageType SEPAmail message type
     * @return {Integer} Index of message composition setting
     */
    _getCompositionSettingsIndex : function(ecosystemId, messageType) {

        // Scan the list of message composition settings
        for (var i = 0; i < this._smethCompositionSettings.length; i++) {

            // Current message composition setting
            var currentCompositionSetting = this._smethCompositionSettings[i];

            // Check if we are the required message composition setting
            if (currentCompositionSetting.ecosystemId == ecosystemId &&
                currentCompositionSetting.messageType == messageType) {
                return i;
            }
        }

        return -1;
    },

    /**
     * Get the index of an ecosystem from the ecosystem array by the given ecosystem ID
     *
     * @method _getEcosystemIndex
     * @param {String} ecosystemId Ecosystem ID
     * @return {Interger} Index of ecosystem with the given ID
     */
    _getEcosystemIndex : function(ecosystemId) {

        // Scan the array of ecosystems
        for (var i = 0; i < this._smethEcosystems.length; i++) {

            // Check if we have the required ID
            if (this._smethEcosystems[i].id == ecosystemId) {
                return i;
            }
        }

        return -1;
    },

    /**
     * Get the index of a given message type from the array of SEPAmail message types
     *
     * @method _getMessageTypeIndex
     * @param {String} messageType SEPAmail message type
     * @return {Interger} Index of the message type in the array of SEPAmail message types
     */
    _getMessageTypeIndex : function(messageType) {

        // Scan the array of SEPAmail message types
        for (var i = 0; i < this._smethMessageTypes.length; i++) {

            // Check if we are at the required message type
            if (this._smethMessageTypes[i] == messageType) {

                // Required message type has been found
                return i;
            }
        }

        // Message type was not found in the SEPAmail message type array
        return -1;
    },

    /**
     * Build the array of SEPAmail message types
     * 
     * @method _getMessageTypes
     */
    _getMessageTypes : function() {

        // Initialise SEPAmail message types array
        if (this._smethMessageTypes == null) {
            this._smethMessageTypes = new Array();
        }

        // Message types
        var messageTypes = this._smethPreferences.getCharPref('missive.prefSEPAmailMessageTypes').split(';');

        // Build the array of message types
        for (var i = 0; i < messageTypes.length; i++) {
            this._smethMessageTypes.push(messageTypes[i].trim());
        }

        // Sort the array of message types
        this._smethMessageTypes.sort();
    },

    /**
     * Get settings for a given message type
     *
     * @method _getSettingsForMessageType
     * @param {String} messageType Message type for which settings need to be obtained
     * @return {Object} Settings for message type
     */
    _getSettingsForMessageType : function(messageType) {

        // Scan the list of settings for message types
        for (var i = 0; i < this._smethControllerConfigSettings.length; i++) {

            // Check the message type for the current message type
            if (this._smethControllerConfigSettings[i].type == messageType) {
                return this._smethControllerConfigSettings[i].settings;
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
     * Fill in the list of SEPAmail acknowledgement message types
     * 
     * @method _populateAcknowledgementMessageTypes
     */
    _populateAcknowledgementMessageTypes : function() {

        // SEPAmail acknowledgement message types listbox
        var listbox = document.getElementById('acknowledgementMessageTypes');

        // Add acknowledgement message types to the listbox
        for (var i = 0; i < this._smethAcknowledgementMessageTypes.length; i++) {
            listbox.appendItem(this._smethAcknowledgementMessageTypes[i], this._smethAcknowledgementMessageTypes[i]);
        }
    },

    /**
     * Fill in the list of message composition settings
     * 
     * @method _populateCompositionSettings
     */
    _populateCompositionSettings : function() {

        // Clear the elements of the message composition type settings list
        this._clearListbox('composeMessageSettingsList');

        // Listbox of message composition settings
        var listbox = document.getElementById('composeMessageSettingsList');

        // Scan the list object
        for (var i = 0; i < this._smethCompositionSettings.length; i++) {

            // Current message composition setting
            var currentItem = this._smethCompositionSettings[i];

            // Listbox row
            var row = document.createElement('listitem');

            // Get the name of the related ecosystem
            var ecosystemIndex = this._getEcosystemIndex(currentItem.ecosystemId);

            // Add the ecosystem to the row
            var ecosystemCell = document.createElement('listcell');
            ecosystemCell.setAttribute('label', this._smethEcosystems[ecosystemIndex].name);
            row.appendChild(ecosystemCell);

            // Add the message type to the row
            var messageTypeCell = document.createElement('listcell');
            messageTypeCell.setAttribute('label', currentItem.messageType);
            row.appendChild(messageTypeCell);

            // Add the row to the listbox
            listbox.appendChild(row);
        }
    },

    /**
     * Fill in the list of ecosystems handled by SMETH
     * 
     * @method _populateEcosystems
     */
    _populateEcosystems : function() {

        // Clear any items that might be present in the ecosystem listbox
        this._clearListbox('ecosystemsListbox');

        // Ecosystem listbox
        var listbox = document.getElementById('ecosystemsListbox');

        // Fill in the list of ecosystems
        for (var i = 0; i < this._smethEcosystems.length; i++) {
            listbox.appendItem(this._smethEcosystems[i].name, this._smethEcosystems[i].id);
        }
    },

    /**
     * Fill in the list of SEPAmail message types
     * 
     * @method _populateMessageTypes
     */
    _populateMessageTypes : function() {

        // SEPAmail message types listbox
        var listbox = document.getElementById('sepamailMessageTypes');

        // Add message types to the listbox
        for (var i = 0; i < this._smethMessageTypes.length; i++) {
            listbox.appendItem(this._smethMessageTypes[i], this._smethMessageTypes[i]);
        }
    },

    /**
     * Fill in the list of SEPAmail message types for settings configuration
     * 
     * @method _populateMessageSettingTypes
     */
    _populateMessageSettingTypes : function() {

        // SEPAmail message types listbox
        var listbox = document.getElementById('sepamailMessageTypeSettings');

        // Add message types to the listbox
        for (var i = 0; i < this._smethMessageTypes.length; i++) {
            listbox.appendItem(this._smethMessageTypes[i], this._smethMessageTypes[i]);
        }
    },

    /**
     * Remove message composition settings for a specific ecosystem
     *
     * @method _removeCompositionSettingsByEcosystemId
     * @param {String} ecosystemId ID of ecosystem for which message composition settings need to be removed
     */
    _removeCompositionSettingsByEcosystemId : function(ecosystemId) {

        var savedCompositionSettings = [];

        // Scan the array of message composition settings
        for (var i = 0; i < this._smethCompositionSettings.length; i++) {

            // Check the ecosystem ID of the current composition setting
            if (this._smethCompositionSettings[i].ecosystemId != ecosystemId) {
                savedCompositionSettings.push(this._smethCompositionSettings[i]);
            }
        }

        // Re-assign the message composition settings array
        this._smethCompositionSettings = savedCompositionSettings;

        // Update the list of message settings
        this._populateCompositionSettings();
    },

    /**
     * Remove message composition settings for a specific type of message
     * 
     * @method _removeCompositionSettingsByMessageType
     * @param {String} messageType Type of SEPAmail message for which message composition settings need to be removed
     */
    _removeCompositionSettingsByMessageType : function(messageType) {

        var savedCompositionSettings = [];

        // Scan the array of message composition settings
        for (var i = 0; i < this._smethCompositionSettings.length; i++) {

            // Check the message type of the current composition setting
            if (this._smethCompositionSettings[i].messageType != messageType) {
                savedCompositionSettings.push(this._smethCompositionSettings[i]);
            }
        }

        // Re-assign the message composition settings array
        this._smethCompositionSettings = savedCompositionSettings;

        // Update the list of message settings
        this._populateCompositionSettings();
    },

    /**
     * Show UI elements which indicate that message composition menus cannot be added to SMETH
     * 
     * @method _showNoComposeMenuUi
     * @param {String} message Message that needs to be displayed to the user
     */
    _showNoComposeMenuUi : function(message) {

        // Get UI elements for message composition
        var compositionUiContainer = document.getElementById('compositionSettingsContainer');
        var noCompositionUi = document.getElementById('noCompositionUiContainer');

        // Check if a message has been defined
        if (message == null) {

            // Show the message composition UI
            compositionUiContainer.hidden = false;

            // Hide the no message composition menu UI if it is defined
            if (noCompositionUi != null) {
                noCompositionUi.hidden = true;
            }

        } else {

            // Hide the message composition UI
            compositionUiContainer.hidden = true;

            // Define the no message composition UI if it is not defined
            if (noCompositionUi == null) {

                // Create no message composition UI
                var container = document.createElement('vbox');
                container.id = 'noCompositionUiContainer';
                container.setAttribute('align', 'center');
                container.setAttribute('flex', '1');
                container.setAttribute('pack', 'center');

                // No message composition UI message
                var description = document.createElement('description');
                description.id = 'noCompositionUiMessage';
                description.setAttribute('crop', 'end');
                description.setAttribute('style', 'text-align:center;');
                description.textContent = message;

                // Add the message to the container
                container.appendChild(description);

                // Add the container to the tab panel
                document.getElementById('messageCompositionTabPanel').appendChild(container);

            } else {

                // Show the no composition UI
                noCompositionUi.hidden = false;

                // Update the message displayed in the no message composition UI
                document.getElementById('noCompositionUiMessage').textContent = message;
            }
        }
    }
};