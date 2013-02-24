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
 * @file SMETHAddressBookController.js
 * @mvc controller
 * @version green
 * @since green
 * @author Bishan Kumar Madhoo
 * @description SMETHAddressBookController extends the Thunderbird Address Book for SEPAmail message specific fields.
 */

/**
 * The NetUtil.jsm JavaScript code module offers utility routines performing common network related tasks.
 *
 * @include NetUtil.jsm
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/NetUtil.jsm
 */
Components.utils.import("resource://gre/modules/NetUtil.jsm");

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
 * Strict mode for scripts
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Functions_and_function_scope/Strict_mode
 */
"use strict";

/**
 * SMETHAddressBookController adds SEPAmail specific fields to the Thunderbird Address Book
 *
 * @class SMETHAddressBookController
 */
var SMETHAddressBookController = {

    /**
     * Declare the SMETHMessageHandler class
     *
     * @attribute _smethMessageHandler
     * @private
     */
    _smethMessageHandler : new SMETHMessageHandler(window),

    /**
     * Declare the utilities class
     *
     * @attribute _smethUtils
     * @private
     * @default null
     */
    _smethUtils : new SMETHUtils(window),

    /**
     * Load a RIS2D map from local storage
     *
     * @method getLocalRISD2Map
     */
    getLocalRISD2Map : function() {

        // Get the RIS2D map file
        var mapFile = this._smethUtils.getFile('RIS2D map');

        // Check if a file was obtained
        if (mapFile != null) {

            // Reset map type
            this.resetMap();

            // Set the RIS2D map type
            document.getElementById("SMETHRis2DMapType").value = 'file';

            // Display name of file in file field
            document.getElementById('ris2dFile').file = mapFile;

            // Read the content of the map file
            NetUtil.asyncFetch(mapFile, function(inputStream, status) {

                // Check if there is any reading error
                if (!Components.isSuccessCode(status)) {
                    throw new Error("Error reading from file");
                    return;
                }

                // Read the file
                var data = NetUtil.readInputStreamToString(inputStream, inputStream.available());

                // Show the map
                document.getElementById("sepamailRis2d").src = 'data:image;base64,' + window.btoa(data);
            });
        }
    },

    /**
     * Get a RIS2D map from a remote URL
     *
     * @method getRemoteRISD2Map
     */
    getRemoteRISD2Map : function() {

        // Get the map URL
        var mapUrl = document.getElementById("ris2dURI").value;

        // Check if a map URL has properly been defined
        if (mapUrl.length > 0) {

            // IO Service to read remote map document
            var ioserv = Components.classes["@mozilla.org/network/io-service;1"]
                                   .getService(Components.interfaces.nsIIOService);

            // Read the remote map
            var channel = ioserv.newChannel(mapUrl, 0, null);
            var stream = channel.open();

            // Check if the document could be read
            if (channel instanceof Components.interfaces.nsIHttpChannel && channel.responseStatus != 200) {

                // Prompt service
                var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                        .getService(Components.interfaces.nsIPromptService);

                // Remote map could not be read
                prompts.alert(null, "SMETH", SMETHAddressBookTranslations.semUrlUpdateError);

            } else {

                // Create instance of byte stream to get content of remote map document
                var bstream = Components.classes["@mozilla.org/binaryinputstream;1"]
                                        .createInstance(Components.interfaces.nsIBinaryInputStream);
                bstream.setInputStream(stream);

                // Read the remote document content and add to the file data string
                var size = 0;
                var file_data = "";
                while(size = bstream.available()) {
                    file_data += bstream.readBytes(size);
                }

                // Reset map type
                this.resetMap();

                // Map URL
                document.getElementById("ris2dURI").value = mapUrl;

                // Set the RIS2D map type
                document.getElementById("SMETHRis2DMapType").value = 'web';

                // Show the map
                document.getElementById("sepamailRis2d").src = 'data:image;base64,' + window.btoa(file_data);
            }
        }
    },

    /**
     * load is the event triggered when a contact card is loaded
     *
     * @method load
     * @param {Object} aCard nsIAbCard which is being loaded
     * @param {Object} aDocument A reference to the contact editor document
     */
    load : function(aCard, aDocument) {

        // Populate the SEPAmail specific fields on the contact card document
        SMETHAddressBookController.populateSEPAmailValues(aCard, aDocument);
    },

    /**
     * onLoad registers listeners for the loading and saving of contact cards in Thunderbird address book
     *
     * @method onLoad
     */
    onLoad : function() {

        // Register the contact card load listener
        RegisterLoadListener(SMETHAddressBookController.load);

        // Register the contact card save listener
        RegisterSaveListener(SMETHAddressBookController.save);
    },

    /**
     * populateSEPAmailValues populates the SEPAmail specific fields in the contact card
     *
     * @method populateSEPAmailValues
     * @param {Object} aCard nsIAbCard which is being loaded
     * @param {Object} aDocument A reference to the contact editor document
     */
    populateSEPAmailValues : function(aCard, aDocument) {

        // Contact title
        aDocument.getElementById("SMETHTitle").value = aCard.getProperty("SMETHTitle", '');

        // SEPAmail account
        aDocument.getElementById("SMETHSEPAmailAccount").value = aCard.getProperty("SMETHSEPAmailAccount", '');

        // Get the map type
        var mapType = aCard.getProperty("SMETHRIS2DMapType", 'none');

        // RIS2D map type
        aDocument.getElementById("SMETHRis2DMapType").value = mapType;

        // Populate UI based on map type
        switch (mapType) {

            case 'none':
                aDocument.getElementById("sepamailRis2d").src = 'chrome://smeth/skin/images/blank-ris2d.png';
                aDocument.getElementById("ris2dFile").file = null;
                aDocument.getElementById("ris2dFile").label = '';
                aDocument.getElementById("ris2dURI").value = '';
                break;

            case 'file':
                aDocument.getElementById("sepamailRis2d").src = 'data:image;base64,' +
                    aCard.getProperty("SMETHRIS2DMapData", '');
                aDocument.getElementById("ris2dFile").icon = 'moz-icon://file://' +
                    aCard.getProperty("SMETHRIS2DMapFile", '');
                aDocument.getElementById("ris2dFile").label = aCard.getProperty("SMETHRIS2DMapFile", '');
                aDocument.getElementById("ris2dURI").value = '';
                break;

            case 'web':
                aDocument.getElementById("sepamailRis2d").src = 'data:image;base64,' +
                    aCard.getProperty("SMETHRIS2DMapData", '');
                aDocument.getElementById("ris2dFile").file = null;
                aDocument.getElementById("ris2dFile").label = '';
                aDocument.getElementById("ris2dURI").value = aCard.getProperty("SMETHRIS2DMapURL", '');
                break;
        }
    },

    /**
     * Reset the RIS2D map displayed on the UI
     *
     * @method resetMap
     */
    resetMap : function() {

        // Reset RIS2D map
        document.getElementById("sepamailRis2d").src = 'chrome://smeth/skin/images/blank-ris2d.png';
        document.getElementById("ris2dFile").file = null;
        document.getElementById("ris2dFile").label = '';
        document.getElementById("ris2dURI").value = '';
    },

    /**
     * save is the event triggered when a contact card is being saved
     *
     * @method save
     * @param {Object} aCard nsIAbCard which is being saved
     * @param {Object} aDocument A reference to the contact editor document
     */
    save : function(aCard, aDocument) {

        // Contact title
        aCard.setProperty("SMETHTitle",  aDocument.getElementById("SMETHTitle").value);

        // SEPAmail account
        aCard.setProperty("SMETHSEPAmailAccount", aDocument.getElementById("SMETHSEPAmailAccount").value);

        // Get the RIS2D map type
        var mapType = aDocument.getElementById("SMETHRis2DMapType").value;

        // Save the RIS2D map type
        aCard.setProperty("SMETHRIS2DMapType", mapType);

        // Save map data based on map type
        switch (mapType) {

            case 'none':
                aCard.setProperty("SMETHRIS2DMapData", '');
                aCard.setProperty("SMETHRIS2DMapFile", '');
                aCard.setProperty("SMETHRIS2DMapURL", '');
                break;

            case 'file':
                aCard.setProperty("SMETHRIS2DMapData", aDocument.getElementById("sepamailRis2d").src.substr(18));
                aCard.setProperty("SMETHRIS2DMapFile", aDocument.getElementById("ris2dFile").label);
                aCard.setProperty("SMETHRIS2DMapURL", '');
                break;

            case 'web':
                aCard.setProperty("SMETHRIS2DMapData", aDocument.getElementById("sepamailRis2d").src.substr(18));
                aCard.setProperty("SMETHRIS2DMapFile", '');
                aCard.setProperty("SMETHRIS2DMapURL", aDocument.getElementById("ris2dURI").value);
                break;
        }
    }
}

SMETHAddressBookController.onLoad();