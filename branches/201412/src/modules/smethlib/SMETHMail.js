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
 * @file SMETHMail.js
 * @mvc modele
 * @version 1212
 * @since 1210
 * @author Ammit Heeramun
 * @description object message for smeth
 */

/**
 * items exported from the module
 * @see https://developer.mozilla.org/en-US/docs/JavaScript_code_modules/Using
 */
var EXPORTED_SYMBOLS = ["SMETHMail"];

/**
 * Strict mode for scripts
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Functions_and_function_scope/Strict_mode
 */
"use strict";

/**
 * SMETHMail class. Represents a message for smeth
 * 
 * @class SMETHMail
 */
SMETHMail = function(aHeader) {
    this._header = aHeader;
};
 
/**
 * SMETHMail class methods.
 * 
 * @class SMETHMail
 */
SMETHMail.prototype = {
    
    /**
     * The header of the message.
     * 
     * @attribute _header
     * @private
     * @default null
     */
    _header : null,
    
    /**
     * The content of the message
     * 
     * @attribute _content
     * @private
     * @default null
     */
    _content : null,

    /**
     * The body of the message
     * 
     * @attribute _body
     * @private
     * @default null
     */
    _body : null,

    /**
     * Whether the mail is a SEPAmail
     * 
     * @attribute _isSEPAmail
     * @private
     * @default false
     */
    _isSEPAmail : false,
    
    /**
     * The type of SEPAmail
     * 
     * @attribute _sepamailType
     * @private
     * @default null
     */
    _sepamailType : null,
    
    /**
     * The XML Object of SEPAmail
     * 
     * @attribute _sepamailXMLObject
     * @private
     * @default null
     */
    _sepamailXMLObject : null,
    
    /** 
     * The type of SEPAmail message type
     * 
     * @attribute _sepamailMessageType
     * @private
     * @default null
     */
    _sepamailMessageType : null,
    
    
 
   /**
    * Gets the message header
    * 
    * @return {Object} the message header
    */
    get header() {
        return this._header;
    },
  
   /**
    * Sets the message header
    * 
    * @param {Object} aHeader
    */
    set header(aHeader) 
    { 
        this._header = aHeader; 
    },
    
   /**
    * Gets the message content object
    * 
    * @return {Object} the message content object
    */
    get content() {
        return this._content;
    },
  
   /**
    * Sets the content of the message
    * 
    * @param {Object} aContent
    */
    set content(aContent) 
    { 
        this._content = aContent; 
    },
 
    /**
    * Gets the message body
    * 
    * @return {String} the message body
    */
    get body() {
        return this._body;
    },
    
   /**
    * Sets the message body
    * 
    * @param {String} aBody
    */
    set body(aBody) 
    { 
        this._body = aBody; 
    },
    
   /**
    * Gets if message is a SEPAmail
    * 
    * @return {Boolean} whether this message is a SEPAmail
    */
    get isSEPAmail() {
        return this._isSEPAmail;
    },
    
   /**
    * Sets whether this message is a SEPAmail
    *
    * @param {Boolean} isSEPAmail
    */
    set isSEPAmail(isSEPAmail) 
    { 
        this._isSEPAmail = isSEPAmail; 
    },
    
   /**
    * Gets the SEPAmail type
    * 
    * @return {String} the SEPAmail type
    */
    get sepamailType() {
        return this._sepamailType;
    },
    
   /**
    * Sets the SEPAmail type
    * 
    * @param {String} aSEPAmailType
    */
    set sepamailType(aSEPAmailType) 
    { 
        this._sepamailType = aSEPAmailType; 
    },
    
   /**
    * Gets the SEPAmail XML Object
    * 
    * @return {XML} the SEPAmail XML Object
    */
    get sepamailXMLObject() {
        return this._sepamailXMLObject;
    },
    
   /**
    * Sets the SEPAmail XML Object
    * 
    * @param {XML} aSEPAmailXMLObject
    */
    set sepamailXMLObject(aSEPAmailXMLObject) 
    { 
        this._sepamailXMLObject = aSEPAmailXMLObject; 
    },
    
   /**
    * Gets the SEPAmail message type
    * 
    * @return {String} the SEPAmail message type
    */
    get sepamailMessageType() {
        return this._sepamailMessageType;
    },
    
   /**
    * Sets the SEPAmail message type
    * 
    * @param {String} aSEPAmailMessageType
    */
    set sepamailMessageType(aSEPAmailMessageType) 
    { 
        this._sepamailMessageType = aSEPAmailMessageType; 
    }
};


