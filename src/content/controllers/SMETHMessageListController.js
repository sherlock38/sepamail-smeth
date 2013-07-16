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
 * @description SMETHMessageListController manages the appearance of SEPAmail messages in the message list pane.
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
 * SMETHMessageListController manages the appearance of SEPAmail messages in the message list pane
 *
 * @class SMETHMessageListController
 */
var SMETHMessageListController = {

    /**
     * Declare the utils class
     *
     * @attribute _smethUtils
     * @private
     * @default null
     */
    _smethUtils : new SMETHUtils(window),

    /**
     * Set the subject of SEPAmail messages if not specified
     *
     * @method OnItemEvent
     * @param {Object} item Item on which the event was raised
     * @param {Object} event Event objet
     */
    OnItemEvent : function(item, event) {

        // Check if we are handling the FolderLoaded event
        if (event.toString() == "FolderLoaded") {

            // Set the subject of SEPAmail messages without subjects on a folder
            SMETHMessageListController._setSubjectOnFolder(item);

        }
    },

    /**
     * Set the subject of a message with the given message header
     *
     * @method _setSubject
     * @param {Object} aMsgHdr Message header
     * @private
     */
    _setSubject : function(aMsgHdr) {
        aMsgHdr.subject = SMETHTranslations.mailSubject;
    },

    /**
     * Set the subject of SEPAmail messages without subjects on a folder
     *
     * @param {Object} aFolder Message folder
     * @method _setSubjectOnFolder
     * @private
     */
    _setSubjectOnFolder : function(aFolder) {

        // Message database
        var database = aFolder.msgDatabase;

        // Scan the messages in the database
        for each (var msgHdr in fixIterator(database.EnumerateMessages(), Ci.nsIMsgDBHdr)) {

            // Check if the current message has a subject
            if (msgHdr.mime2DecodedSubject.length == 0) {

                // Define the options for the MsgHdrToMimeMessage function
                var options = { examineEncryptedParts: true, partsOnDemand: false };

                // Get the mail content
                MsgHdrToMimeMessage(msgHdr, null, function (aMailHeader, aMailContent) {

                    // TODO MSO 20130427 content accessor is not the better one, to include in SMETHUtils
                    // Check if message content is a SEPAmail
                    if (SMETHMessageListController._smethUtils.isSEPAmail(
                        SMETHMessageListController._smethUtils.getMailContentFromParts(aMailContent.parts[0], ""))) {

                        // Set the subject of the email
                        SMETHMessageListController._setSubject(aMailHeader);

                    }

                }, true, options);
            }
        }

        // Close the message database
        aFolder.msgDatabase = null;
    }
}
