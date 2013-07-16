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
pref("extensions.smeth.missive.prefSEPAmailMessageTypes", "activation.request@payment.activation;activation.report@payment.activation;activation.enroll@payment.activation;simple.report@test;simple.request@test;send.request@generic;mandat@direct.debit;notification@direct.debit;request.copy@direct.debit;rapport@direct.debit");

// SMETH message read header settings
pref("extensions.smeth.missive.header", "missive_transition_MessageHeaders_xul.xsl");

// SMETH message read header settings
pref("extensions.smeth.missive.attachment", "missive_transition_MessageAttachment_xul.xsl");

// SMETH controller configuration settings
pref("extensions.smeth.controller.config", '[{"type":"simple.request@test","settings":{"body":"missive_simple_request_transition_MessageBody_xul.xsl","composition":"test_transition_message_Test2TestComposeBody_xul.xsl","template":"simple_request_xml_template.xml","hasAttachments":true,"attachment":"missive_transition_ComposeTestMessageAttachment_xul.xsl"}},{"type":"activation.request@payment.activation","settings":{"body":"missive_transition_MessageBody_xul.xsl","composition":"payment_activation_transition_message_ActivationRequest2ActivationComposeBody_xul.xsl","template":"payment_activation_request_xml_template.xml","hasAttachments":true,"attachment":"missive_transition_ComposeMessageAttachment_xul.xsl"}},{"type":"simple.report@test","settings":{"body":"missive_transition_testReportBody_xul.xsl","composition":"missive_transition_testReportComposeBody_xul.xsl","template":"","hasAttachments":true,"attachment":"missive_transition_ComposeTestMessageReportAttachment_xul.xsl"}},{"type":"activation.report@payment.activation","settings":{"body":"missive_transition_paymentActivationReportBody_xul.xsl","composition":"missive_transition_paymentActivationReportComposeBody_xul.xsl","template":"","hasAttachments":false,"attachment":"missive_transition_ComposeMessageAttachment_xul.xsl"}},{"type":"send.request@generic","settings":{"body":"missive_generic_request_transition_MessageBody_xul.xsl","composition":"test_transition_message_Generic2GenericComposeBody_xul.xsl","template":"generic_request_xml_template.xml","hasAttachments":true,"attachment":"missive_transition_ComposeTestMessageAttachment_xul.xsl"}},{"type":"mandat@direct.debit","settings":{"body":"missive_gemme_mandate_request_transition_MessageBody_xul.xsl","composition":"missive_transition_mandate_initiationRequest2MandateInitiationRequestComposeBody_xul.xsl","template":"mandate_initiation_request_xml_template.xml","hasAttachments":false,"attachment":""}},{"type":"notification@direct.debit","settings":{"body":"missive_gemme_prenotification_transition_MessageBody_xul.xsl","composition":"missive_transition_prenotification2PrenotificationComposeBody_xul.xsl","template":"prenotification_xml_template.xml","hasAttachments":false,"attachment":""}},{"type":"request.copy@direct.debit","settings":{"body":"missive_gemme_request_for_copy_transition_MessageBody_xul.xsl","composition":"missive_transition_request_for_copy2RequestForCopyComposeBody_xul.xsl","template":"request_for_copy_xml_template.xml","hasAttachments":false,"attachment":""}},{"type":"rapport@direct.debit","settings":{"body":"missive_gemme_mandate_acceptance_report_transition_MessageBody_xul.xsl","composition":"missive_transition_mandate_acceptanceReport2MandateAcceptanceReportComposeBody_xul.xsl","template":"","hasAttachments":false,"attachment":""}}]');

// SMETH ecosystems
pref("extensions.smeth.ecosystems", '[{"id":"{3c36e2d9-3f07-4c63-b353-05c6e558e30c}","messages":["send.request@generic"],"mode":"test","name":"AGATE"},{"id":"{76b9a40e-89e5-4b2b-a89b-4e8e24f3d438}","messages":["mandat@direct.debit","notification@direct.debit","request.copy@direct.debit","rapport@direct.debit"],"mode":"test","name":"GEMME"},{"id":"{e67a4296-cb59-44e8-88fa-b119a50fc440}","messages":["activation.report@payment.activation","activation.request@payment.activation"],"mode":"test","name":"RUBIS"},{"id":"{5b110528-9460-4075-9146-6c6e91b8d484}","messages":["simple.report@test","simple.request@test"],"mode":"test","name":"TEST"}]');

// SMETH message composition settings
pref("extensions.smeth.compositions", '[]');

// Export XSL transformation URL
pref("extensions.smeth.export.messageId.XSLUrl", "chrome://{appname}/content/xsl/export/missive_transition_id.xsl");
pref("extensions.smeth.export.envelope.XSLUrl", "chrome://{appname}/content/xsl/export/export_envelope.xsl");
pref("extensions.smeth.export.message.XSLUrl", "chrome://{appname}/content/xsl/export/export_message.xsl");
pref("extensions.smeth.export.missive.XSLUrl", "chrome://{appname}/content/xsl/export/export_missive.xsl");

// Preference for Missive activation request
pref("extensions.smeth.missive.activation.request.messageIdXpath", "/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgHdr/sem:MsgId");

// Preference for Missive activation report
pref("extensions.smeth.missive.activation.report.statusXpath", "sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:OrgnlPmtInfAndSts/pain014:TxInfAndSts/pain014:TxSts");

// Preference for XSL which transform an acknowledgement to XUL for viewing in message pane
pref("extensions.smeth.acknowledgement.headerXSLUrl", "chrome://{appname}/content/xsl/missive_transition_AckHeaders_xul.xsl");

// Preference for transforming a missive XML to acknowledgement XML
pref("extensions.smeth.acknowledgement.XSLUrl", "chrome://{appname}/content/xsl/missive_transition_Acknowledgement.xsl");

// Preference for displaying an acknowledgement
pref("extensions.smeth.acknowledgement.body.XSLUrl", "chrome://{appname}/content/xsl/missive_transition_AcknowledgementBody_xul.xsl");

// Preference for transforming an acknowledgement missive XML to XUL form
pref("extensions.smeth.acknowledgement.form.XSLUrl", "chrome://{appname}/content/xsl/missive_transition_Acknowledgement_xul.xsl");

// Preference for sending acknowledgements
pref("extensions.smeth.acknowledgement.policies", '[{"accountKey":"account1","settings":[{"type":"activation.request@payment.activation","automatic":0},{"type":"simple.request@test","automatic":1}]}]');

// List of my email accounts and corresponding QXBAN
pref("extensions.smeth.myqxbans", '[]');

// List of missive message types for which acknowledgements can be sent
pref("extensions.smeth.acknowledgement.types", 'activation.request@payment.activation, simple.request@test, simple.report@test, send.request@generic, mandat@direct.debit, notification@direct.debit, request.copy@direct.debit, rapport@direct.debit');
pref("extensions.smeth.acknowledgement.process_queue", '[]');

// Acknowledgement preferences
pref("extensions.smeth.acknowledgement.settings", '[]');
