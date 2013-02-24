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
 * @file defaults.js
 * @version 1212
 * @since 1210
 * @author Ammit Heeramun
 * @description
 */


// Thunderbird preference
// Prevents the caching of compose window
user_pref("mail.compose.max_recycled_windows", 0);

// Preference for mail filtering
pref("extensions.smeth.prefIsBodyXML", true);
pref("extensions.smeth.prefSEPAmailXMLTag", "/sem:Missive;/sem:Request;/sem:Report");
pref("extensions.smeth.defaultCurrency", "EUR");

// Message expiry preferences
pref("extensions.smeth.hasExpiry", false);
pref("extensions.smeth.expiryDuration", "1M");

// Preference for missive message type XPath
pref("extensions.smeth.missive.prefMsgTypXpath", "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgHdr/sem:MsgTyp");
pref("extensions.smeth.missive.prefRootTag", "missive");
pref("extensions.smeth.missive.prefSEPAmailMessageTypes", "activation.request@payment.activation;activation.report@payment.activation;activation.enroll@payment.activation;simple.report@test;simple.request@test");

// SMETH message read header settings
pref("extensions.smeth.missive.header", "missive_transition_MessageHeaders_xul.xsl");

// SMETH message read header settings
pref("extensions.smeth.missive.attachment", "missive_transition_MessageAttachment_xul.xsl");

// SMETH controller configuration settings
pref("extensions.smeth.controller.config", '[{"type":"simple.request@test","settings":{"body":"missive_simple_request_transition_MessageBody_xul.xsl","hasAttachments":true}},{"type":"activation.request@payment.activation","settings":{"body":"missive_transition_MessageBody_xul.xsl","hasAttachments":true}},{"type":"simple.report@test","settings":{"body":"missive_transition_testReportBody_xul.xsl","hasAttachments":true}},{"type":"activation.report@payment.activation","settings":{"body":"missive_transition_paymentActivationReportBody_xul.xsl","hasAttachments":false}}]');

// SMETH ecosystems
pref("extensions.smeth.ecosystems", '[]');

// SMETH message composition settings
pref("extensions.smeth.compositions", '[]');

// Export XSL transformation URL
pref("extensions.smeth.export.messageId.XSLUrl", "chrome://{appname}/content/xsl/export/missive_transition_id.xsl");
pref("extensions.smeth.export.envelope.XSLUrl", "chrome://{appname}/content/xsl/export/export_envelope.xsl");
pref("extensions.smeth.export.message.XSLUrl", "chrome://{appname}/content/xsl/export/export_message.xsl");
pref("extensions.smeth.export.missive.XSLUrl", "chrome://{appname}/content/xsl/export/export_missive.xsl");

// Preference for Missive activation request
pref("extensions.smeth.missive.activation.request.compose.templateXMLUrl", "chrome://{appname}/content/xml/payment_activation_request_xml_template.xml");
pref("extensions.smeth.missive.activation.request.compose.bodyXSLUrl", "chrome://{appname}/content/xsl/payment_activation_transition_message_ActivationRequest2ActivationComposeBody_xul.xsl");
pref("extensions.smeth.missive.activation.request.compose.attachmentXSLUrl", "chrome://{appname}/content/xsl/missive_transition_ComposeMessageAttachment_xul.xsl");
pref("extensions.smeth.missive.activation.request.messageIdXpath", "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgHdr/sem:MsgId");

// Preference for Missive activation report
pref("extensions.smeth.missive.activation.report.statusXpath", "sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:OrgnlPmtInfAndSts/pain014:TxInfAndSts/pain014:TxSts");
pref("extensions.smeth.missive.activation.report.compose.attachmentXSLUrl", "chrome://{appname}/content/xsl/missive_transition_ComposeMessageAttachment_xul.xsl");
pref("extensions.smeth.missive.activation.report.compose.bodyXSLUrl", "chrome://{appname}/content/xsl/missive_transition_paymentActivationReportComposeBody_xul.xsl");

// Preferences for Missive simple request
pref("extensions.smeth.missive.simple.request.compose.templateXMLUrl", "chrome://{appname}/content/xml/simple_request_xml_template.xml");
pref("extensions.smeth.missive.simple.request.compose.bodyXSLUrl", "chrome://{appname}/content/xsl/test_transition_message_Test2TestComposeBody_xul.xsl");
pref("extensions.smeth.missive.simple.request.compose.attachmentXSLUrl", "chrome://{appname}/content/xsl/missive_transition_ComposeTestMessageAttachment_xul.xsl");

// Preferences for simple report missive
pref("extensions.smeth.missive.simple.report.testComposeBodyXSLUrl", "chrome://{appname}/content/xsl/missive_transition_testReportComposeBody_xul.xsl");
pref("extensions.smeth.missive.simple.report.compose.attachmentXSLUrl", "chrome://{appname}/content/xsl/missive_transition_ComposeTestMessageReportAttachment_xul.xsl");

// Preference for XSL which transform an acknowledgement to XUL for viewing in message pane
pref("extensions.smeth.acknowledgement.headerXSLUrl", "chrome://{appname}/content/xsl/missive_transition_AckHeaders_xul.xsl");

// Preference for transforming a missive XML to acknowledgement XML
pref("extensions.smeth.acknowledgement.XSLUrl", "chrome://{appname}/content/xsl/missive_transition_Acknowledgement.xsl");

// Preference for transforming an acknowledgement missive XML to XUL form
pref("extensions.smeth.acknowledgement.form.XSLUrl", "chrome://{appname}/content/xsl/missive_transition_Acknowledgement_xul.xsl");

// Preference for sending acknowledgements
pref("extensions.smeth.acknowledgement.policies", '[{"accountKey":"account1","settings":[{"type":"activation.request@payment.activation","automatic":0},{"type":"simple.request@test","automatic":1}]}]');

// List of my email accounts and corresponding QXBAN
pref("extensions.smeth.myqxbans", '[]');

// List of missive message types for which acknowledgements can be sent
pref("extensions.smeth.acknowledgement.types", 'activation.request@payment.activation, simple.request@test, simple.report@test');

// Acknowledgement preferences
pref("extensions.smeth.acknowledgement.settings", '[]');