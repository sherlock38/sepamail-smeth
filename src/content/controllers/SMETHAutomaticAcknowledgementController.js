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
 * @file SMETHMessageListController.js
 * @mvc controller
 * @version green
 * @since green
 * @author Bishan Kumar Madhoo
 * @description SMETHAutomaticAcknowledgementController manages the sending of automatic acknowledgements.
 */

/**
 * SMETHUtils class contains all the useful functions that will be used in SMETH
 *
 * @include SMETHUtils.js
 */
Components.utils.import("resource://smeth/smethlib/SMETHUtils.js");

/**
 * Strict mode for scripts
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Functions_and_function_scope/Strict_mode
 */
"use strict";

/**
 * SMETHAutomaticAcknowledgementController manages the sending of automatic acknowledgements
 *
 * @class SMETHAutomaticAcknowledgementController
 */
var SMETHAutomaticAcknowledgementController = {

    /**
     * Maximum number of times SMETH will try to obtain the content of a message ID
     *
     * @attribute _maxProcessLimit
     * @default 5
     * @private
     */
    _maxProcessLimit : 10,

    /**
     * Automatic acknowledgement process queue
     *
     * @attribute _processQueue
     * @private
     */
    _processQueue : null,

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
     * Add a message ID to the automatic acknowledgement process queue
     *
     * @method addToProcessQueue
     * @param {Object} aMsgHdr Header of the message for which the ID must be added to the message queue
     */
    addToProcessQueue : function(aMsgHdr) {

        // Add a message header ID to the process queue
        this._processQueue.push({ id : aMsgHdr.messageId, folderURL: aMsgHdr.folder.folderURL, processed : 0 });

        // Persist process queue contents
        this.saveProcessQueue();

    },

    /**
     * Increase the processed number of a given message ID
     *
     * @method incrementProcessed
     * @param {String} messageId Message ID
     */
    incrementProcessed : function(messageId) {

        // Scan the list of message IDs in the process queue
        for (var i = 0; i < this._processQueue.length; i++) {

            // Check if we are at the required message
            if (this._processQueue[i].id == messageId) {

                // Increase the processed count
                this._processQueue[i].processed += 1;

                break;
            }
        }

        // Persist changes made to the process queue
        this.saveProcessQueue();
    },

    /**
     * Initialise the SMETHAutomaticAcknowledgementController class
     *
     * @method init
     */
    init : function() {

        // Initialise the automatic acknowledgement process queue
        //this._processQueue = JSON.parse(this._smethPreferences.getCharPref("acknowledgement.process_queue"));

        this._processQueue = [];

        this.saveProcessQueue();
    },

    /**
     * Process the automatic acknowledgement queue
     *
     * @method processQueue
     * @param {Object} item
     * @param {Object} event
     */
    processQueue : function(item, event) {

        // Check if we are handling the FolderLoaded event
        if (event.toString() == "FolderLoaded") {

            // Scan the list of message IDs in the process queue
            for (var i = 0; i < this._processQueue.length; i++) {

                // Check if the message belongs to the current folder
                if (this._processQueue[i].folderURL == item.folderURL) {

                    // Check if we have reached the maximum number of times we are allowed to leave a message ID in the process queue
                    if (this._processQueue[i].processed < this._maxProcessLimit) {

                        // Message database
                        var database = item.msgDatabase;

                        // Define the options for the MsgHdrToMimeMessage function
                        var options = { examineEncryptedParts: true, partsOnDemand: false };

                        // Scan the messages in the database
                        for each (var msgHdr in fixIterator(database.EnumerateMessages(), Ci.nsIMsgDBHdr)) {

                            // Check if we are at the required message ID
                            if (msgHdr.messageId == this._processQueue[i].id) {

                                // Get the mail content
                                MsgHdrToMimeMessage(msgHdr, null, function (aMailHeader, aMailContent) {

                                    // Message content
                                    var msgContent = SMETHAutomaticAcknowledgementController._smethUtils.getMailContentFromParts(aMailContent.parts[0], "");

                                    // Check if we could get the content of the message
                                    if (msgContent.length > 0) {

                                        // Send automatic acknowledgement via the acknowledgement controller
                                        SMETHAcknowledgementController.sendAutomaticAcknowledgement(aMailHeader, msgContent);

                                        // Remove the message ID from the process queue
                                        SMETHAutomaticAcknowledgementController.removeFromProcessQueue(aMailHeader.messageId);

                                    } else {

                                        // Increment the number of times a message has been processed
                                        SMETHAutomaticAcknowledgementController.incrementProcessed(aMailHeader.messageId);
                                    }

                                }, true, options);
                            }
                        }

                        // Close the message database
                        item.msgDatabase = null;

                    } else {

                        // Remove the message ID from the process queue since we have reached the maximum number of times a message ID can be processed
                        this.removeFromProcessQueue(this._processQueue[i].id);
                    }
                }
            }
        }
    },

    /**
     * Remove a message ID from the process queue
     *
     * @method removeFromProcessQueue
     * @param {String} messageId Message ID that needs to be removed from the process queue
     */
    removeFromProcessQueue : function(messageId) {

        // Scan the process queue
        for (var i = 0; i < this._processQueue.length; i++) {

            // Check the ID of the current message in the process queue
            if (this._processQueue[i].id == messageId) {

                // Remove the message from the process queue
                this._processQueue.splice(i, 1);

                break;
            }
        }

        // Save the process queue
        this.saveProcessQueue();
    },

    /**
     * Persist the automatic acknowledgement process queue
     *
     * @method saveProcessQueue
     */
    saveProcessQueue : function() {

        // Persist process queue content
        this._smethPreferences.setCharPref('acknowledgement.process_queue', JSON.stringify(this._processQueue));
    }
}