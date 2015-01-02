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
 * @file SMETHOptionController.js
 * @mvc controller
 * @version 1212
 * @since 1210
 * @author Ammit Heeramun
 * @description SMETHOptionController is the class that is attached to SMETHOptionView, it helps in the setting up of the preferences window.
 */

/**
 * SMETHMessageHandler class contain functions to handle info, error, warning and exceptions messages
 *
 * @include SMETHMessageHandler.js
 */
Components.utils.import("resource://smeth/smethlib/SMETHMessageHandler.js");

/**
 * SMETHControlFactory class contain functions to create XUL and HTML controls
 *
 * @include SMETHControlFactory.js
 */
Components.utils.import("resource://smeth/smethlib/SMETHControlFactory.js");

/**
 * SMETHOptionController class defines all the events that is related to "SMETHOptionView"
 *
 * @class SMETHOptionController
 *
 */
var SMETHOptionController = {

    /**
     * Instantiate the SMETHMessageHandler class
     *
     * @attribute _smethMessageHandler
     * @private
     */
    _smethMessageHandler : new SMETHMessageHandler(window),

    /**
     * Instantiate the SMETHControlFactory class
     *
     * @attribute _smethControlFactory
     * @private
     */

    _smethControlFactory : new SMETHControlFactory(document),

    /**
     * Instantiate the contentTypeListDataSource
     *
     * @attribute _contentTypeListDataSource
     * @private
     */
    _contentTypeListDataSource : new Array(),

    /**
     * buttonAddContentTypeClickEvent function adds a content type to the listbox
     *
     * @method buttonAddContentTypeClickEvent
     */
    buttonAddContentTypeClickEvent : function () {

        try
        {
            // Get the content type text box
            var contentTypeTextBox = document.getElementById("textBoxContentType");

            // Check if have obtained the textbox correctly
            if(null != contentTypeTextBox)
            {
                // Check if the textbox is not empty
                if("" != contentTypeTextBox.value)
                {
                    // Check if the content type is already present in the list
                    if(!SMETHOptionController.isContentTypeIsPresentInDataSource(contentTypeTextBox.value))
                    {
                        // Get the content type listbox
                        var contentTypeListbox = document.getElementById("listBoxContentType");
                        alert(contentTypeTextBox.value);
                    }
                    else
                    {
                        // Set a message that the content type is already present
                        SMETHOptionController._smethMessageHandler.info(SMETHOptionLocale.contentTypeIsAlreadyPresent);
                    }
                }
                else
                {
                    // Set a message that the content type textbox is empty
                    SMETHOptionController._smethMessageHandler.info(SMETHOptionLocale.pleaseTypeContentType);
                    // Set focus to the content type textbox
                    contentTypeTextBox.focus();
                }
            }
            else
            {
                // Set a message that the content type textbox does not exists
                SMETHOptionController._smethMessageHandler.error(SMETHOptionLocale.contentTypeTextboxDoesNotExists);
            }

        }
        catch(ex)
        {
            SMETHOptionController._smethMessageHandler.exception.exception(ex);
        }
    },

    /**
     * checkIfContentTypeIsPresent function checks if the parametered content type is present in the data source
     *
     * @method isContentTypeIsPresentInDataSource
     * @param {String} aContentType String
     * @return {Boolean} Either true or false
     */
    isContentTypeIsPresentInDataSource : function(aContentType) {
        try
        {
            for(i=0; i < SMETHOptionController._contentTypeListDataSource.length; i++)
            {
                if(aContentType == SMETHOptionController._contentTypeListDataSource[i])
                {
                    return true;
                }
            }

            return false;
        }
        catch(ex)
        {
            throw ex;
        }
    }

}