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
 * @file SMETHAttachmentController.js
 * @mvc controller
 * @version 1212
 * @since 1210
 * @author Bishan Kumar Madhoo
 * @description SMETHAttachmentController class listens to missive attachment UI events and responds to user actions
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
 * @description Strict mode for scripts
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Functions_and_function_scope/Strict_mode
 */
"use strict";

/**
 * SMETHAttachmentController class listens to missive attachment UI events and responds to user actions
 *
 * @class SMETHAttachmentController
 */
var SMETHAttachmentController = {

    /**
     * Declare the SMETHMessageHandler class
     *
     * @attribute _smethMessageHandler
     * @private
     * @default null
     */
    _smethMessageHandler : new SMETHMessageHandler(window),

    /**
     * Declare the utils class
     *
     * @attribute _smethUtils
     * @private
     * @default null
     */
    _smethUtils : new SMETHUtils(window),

    /**
     * onMissiveAttachmentListContextMenuShowing is triggered when the context menu for the list of missive attachments
     * is shown
     *
     * @method onMissiveAttachmentListContextMenuShowing
     * @param {Object} event Event parameters
     */
    onMissiveAttachmentListContextMenuShowing : function(event) {

    },

    /**
     * TryHandleMissiveAttachments handles missive attachment operations
     *
     * @method TryHandleMissiveAttachments
     * @param {Object} action Action that is being carried out on the missive attachment
     * @param {Object} target Missive attachment item
     */
    TryHandleMissiveAttachments : function(action, target) {

        try {
            this.handleMissiveAttachments(action, target);
        } catch (e) {
            this._smethMessageHandler.exception(e);
        }
    },

    /**
     * handleMissiveAttachments handles missive attachment operations
     *
     * @method handleMissiveAttachments
     * @param {Object} action Action that is being carried out on the missive attachment
     * @param {Object} target Missive attachment item
     */
    handleMissiveAttachments : function(action, target) {

        // Get the attachment object
        var missiveAttachmentList = document.getElementById("missiveAttachmentList");

        // Missive attachment items
        var missiveAttachmentItems = missiveAttachmentList.getElementsByTagName("missiveattachmentitem");

        switch (action) {

            case "open":
                throw new Error("open action not yet implemented.");

            case "openAll":
                 throw new Error("openAll action not yet implemented.");

            case "saveAll":

                // Check if we have a list of *selected* items
                if (missiveAttachmentList.selectedItems.length > 0) {

                    // Save all the missive attachments *selected* by the user
                    this.saveAttachements(missiveAttachmentList.selectedItems);

                } else {

                    // if not *selected* items, we save all attachments
                    this.saveAttachements(missiveAttachmentItems);
                }

                return;

            case "saveAs":

                // Check if target has been defined
                if (target == undefined) {

                    // Verify that we have a missive attachment item
                    if (missiveAttachmentItems.length > 0) {

                        // Check if missive attachment data objects could be found
                        if (missiveAttachmentItems[0].data != null) {

                            try {

                                // Save missive attachment to local storage
                                this._smethUtils.saveToFile(missiveAttachmentItems[0].data.getAttribute("name"),
                                    missiveAttachmentItems[0].data.textContent);

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

                            // Save missive attachment to local storage
                            this._smethUtils.saveToFile(missiveAttachmentList._currentItem.data.getAttribute("name"),
                                missiveAttachmentList._currentItem.data.textContent);

                        } catch (e) {
                            throw e;
                        }

                    } else {
                        throw new Error("Missive attachment file details could not be found.");
                    }
                }

                return;

            default:
                throw new Error("unknown handleMissiveAttachments action: " + action);
        }
    },

    /**
     * onMissiveAttachmentListItemContextMenuHidding is triggered when the context menu for a missive attachment item is
     * hidden
     *
     * @method onMissiveAttachmentListItemContextMenuHidding
     */
    onMissiveAttachmentListItemContextMenuHidding : function() {

    },

    /**
     * onMissiveAttachmentListItemContextMenuShowing is triggered when the context menu for a missive attachment item is
     * shown
     *
     * @method onMissiveAttachmentListItemContextMenuShowing
     */
    onMissiveAttachmentListItemContextMenuShowing : function() {

    },

    /**
     * toggleMissiveAttachmentList is triggered when the user clicks on the attachments header or the attachments
     * expansion button
     *
     * @method toggleMissiveAttachmentList
     */
    toggleMissiveAttachmentList : function() {

        // Get UI elements
        var missiveAttachmentBar = document.getElementById("missiveAttachmentBar");
        var missiveAttachmentList = document.getElementById("missiveAttachmentList");
        var missiveAttachmentSplitter = document.getElementById("missiveAttachmentSplitter");
        var missiveAttachmentToggle = document.getElementById("missiveAttachmentToggle");
        var missiveAttachmentView = document.getElementById("missiveAttachmentView");

        // Check the current of the list of attachments bar
        if (missiveAttachmentList.collapsed) {

            // Attachments bar is hidden so we show its contents
            missiveAttachmentBar.setAttribute("tooltiptext", SMETHTranslations.missiveAttachmentBarHideTooltip);
            missiveAttachmentList.collapsed = false;
            missiveAttachmentList.focus();
            missiveAttachmentList.setOptimumWidth();
            missiveAttachmentSplitter.collapsed = false;
            missiveAttachmentToggle.checkState = 1;
            missiveAttachmentToggle.checked = true;

            // Height of the missive attachment list
            var missiveAttachmentHeight = missiveAttachmentView.boxObject.height -
                missiveAttachmentList.boxObject.height + missiveAttachmentList.preferredHeight;

            // Maximum height that the missive attachment list can occupy
            var maxMissiveAttachmentList = document.getElementById("messagepanebox").boxObject.height / 4;

            // Set the height of the missive attachment view
            missiveAttachmentView.setAttribute("height", Math.min(missiveAttachmentHeight, maxMissiveAttachmentList));

            // Set the maximum height of the missive attachment view
            missiveAttachmentView.setAttribute("maxheight", missiveAttachmentHeight);

        } else {

            // Attachments bar is visible so we hide its contents
            missiveAttachmentBar.setAttribute("tooltiptext", SMETHTranslations.missiveAttachmentBarShowTooltip);
            missiveAttachmentList.blur();
            missiveAttachmentList.collapsed = true;
            missiveAttachmentSplitter.collapsed = true;
            missiveAttachmentToggle.checkState = 0;
            missiveAttachmentToggle.checked = false;
            missiveAttachmentView.removeAttribute("height");
            missiveAttachmentView.removeAttribute("maxheight");
        }
    },

    /**
     * saveAttachements saves a given list of attachments
     *
     * @method saveAttachements
     * @param {Array} attachmentList Array of attachments
     */
    saveAttachements : function(attachmentList) {

        // Save all the missive attachments since nothing has been selected by the user
        for (var i = 0; i < attachmentList.length; i++) {

            // Current data object
            var currentData = attachmentList[i].data;

            try {

                // Save missive attachment to local storage
                this._smethUtils.saveToFile(currentData.getAttribute("name"), currentData.textContent);

            } catch (e) {
                throw e;
            }
        }
    },

    /**
     * toggleMissiveAttachmentList is triggered when the user clicks on the attachments header or the attachments
     * expansion button
     *
     * @method toggleMissiveComposeWindowAttachmentList
     */
    toggleMissiveComposeWindowAttachmentList : function() {

        // Get UI elements
        var missiveAttachmentBar = document.getElementById("missiveAttachmentBar");
        var missiveAttachmentList = document.getElementById("missiveAttachmentList");
        var missiveAttachmentSplitter = document.getElementById("missiveAttachmentSplitter");
        var missiveAttachmentToggle = document.getElementById("missiveAttachmentToggle");
        var missiveAttachmentView = document.getElementById("missiveAttachmentView");

        // Check the current of the list of attachments bar
        if (missiveAttachmentList.collapsed) {

            // Attachments bar is hidden so we show its contents
            missiveAttachmentBar.setAttribute("tooltiptext", SMETHTranslations.missiveAttachmentBarHideTooltip);
            missiveAttachmentList.collapsed = false;
            missiveAttachmentList.focus();
            missiveAttachmentList.setOptimumWidth();
            missiveAttachmentSplitter.collapsed = false;
            missiveAttachmentToggle.checkState = 1;
            missiveAttachmentToggle.checked = true;

            // Height of the missive attachment list
            var missiveAttachmentHeight = missiveAttachmentView.boxObject.height -
                missiveAttachmentList.boxObject.height + missiveAttachmentList.preferredHeight;

            // Maximum height that the missive attachment list can occupy
            if (document.getElementById("appcontent") != null) {

                var maxMissiveAttachmentList = document.getElementById("appcontent").boxObject.height / 4;

                // Set the height of the missive attachment view
                missiveAttachmentView.setAttribute("height", Math.min(missiveAttachmentHeight, maxMissiveAttachmentList));

                // Set the maximum height of the missive attachment view
                missiveAttachmentView.setAttribute("maxheight", missiveAttachmentHeight);
            }

        } else {

            // Attachments bar is visible so we hide its contents
            missiveAttachmentBar.setAttribute("tooltiptext", SMETHTranslations.missiveAttachmentBarShowTooltip);
            missiveAttachmentList.blur();
            missiveAttachmentList.collapsed = true;
            missiveAttachmentSplitter.collapsed = true;
            missiveAttachmentToggle.checkState = 0;
            missiveAttachmentToggle.checked = false;
            missiveAttachmentView.removeAttribute("height");
            missiveAttachmentView.removeAttribute("maxheight");
        }
    },

    /**
     * Restore focus after bringing up file name and file location dialog
     *
     * @method restoreFocusAfterButton
     */
    restoreFocusAfterButton : function() {

    },

    /**
     * Calculate the size of a missive attachment and display it on the missive attachments UI
     *
     * @method calculateAttachmentSize
     * @param {Object} event Event details
     * @see https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIFileOutputStream
     * @see https://developer.mozilla.org/en-US/docs/Code_snippets/File_I_O
     */
    calculateAttachmentSize : function(event) {

        var totalSize = 0;

        // Get the attachment object
        var missiveAttachmentList = document.getElementById("missiveAttachmentList");

        // Element which display size of attachment(s) on missive attachment header bar
        var sizeElement = document.getElementById("missiveAttachmentSize");

        // Check if the missive attachment XUL component was found
        if (missiveAttachmentList != null) {

            // Missive attachment items
            var missiveAttachmentItems = missiveAttachmentList.getElementsByTagName("missiveattachmentitem");

            // Scan the list of missive attachment items and get the size of the missive attachment
            for (var i = 0; i < missiveAttachmentItems.length; i++) {

                try {
                    // TODO : MSO 201212 look at the security issues with this method of temporary storage
                    // Get unique temporary file
                    var file = FileUtils.getFile("TmpD", ["suggestedName.tmp"]);
                    file.createUnique(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, FileUtils.PERMS_FILE);

                    // Decode missive file attachment data
                    var decodedData = window.atob(missiveAttachmentItems[i].data.textContent);

                    // Stream for writing binary file
                    // @see https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIFileOutputStream
                    // @see https://developer.mozilla.org/en-US/docs/Code_snippets/File_I_O
                    var stream = Components.classes["@mozilla.org/network/safe-file-output-stream;1"]
                                           .createInstance(Components.interfaces.nsIFileOutputStream);
                    stream.init(file, 0x04 | 0x08 | 0x20, 0600, 0);
                    stream.write(decodedData, decodedData.length);

                    // Close the stream
                    if (stream instanceof Components.interfaces.nsISafeOutputStream) {
                        stream.finish();
                    } else {
                        stream.close();
                    }

                    // Set the size of the missive attachment file
                    totalSize += file.fileSize;
                    missiveAttachmentItems[i].size = file.fileSize;

                    // Delete the temporary file
                    file.remove(false);

                } catch (e) {
                    throw e;
                }
            }
        }

        // Set the size of attachment(s) on the missive attachment(s) header bar
        // TODO : MSO 201212 this *toString* method must exist somewhere in the code
        if (totalSize > 0) {


            if (totalSize < 1024) {

                // Show attachment size in bytes
                sizeElement.setAttribute("value", totalSize.toLocaleString() + " bytes");

            } else if (totalSize < 1048576) {

                // Show attachment size in kilobytes
                var formattedKbSize = totalSize / 1024.00;
                sizeElement.setAttribute("value", formattedKbSize.toFixed(2).toLocaleString() + " KB");

            } else {

                // Show attachment size in megabytes
                var formattedMbSize = totalSize / 1048576.00;
                sizeElement.setAttribute("value", formattedMbSize.toFixed(2).toLocaleString() + " MB");
            }
        }
    }
};