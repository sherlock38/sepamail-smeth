<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : missive_gemme_mandate_request_transition_MessageBody_xul.xsl
    Created on : May 2, 2013, 09:39 AM
    Author     : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description: Transforming a mandat@direct.debit XML to XUL interface for displaying content
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
    xmlns:p09="urn:iso:std:iso:20022:tech:xsd:pain.009.001.01"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../../../xsd/sepamail_missive.xsd"
    xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
    exclude-result-prefixes="sem p09 xsi">

    <xsl:output method="xml" omit-xml-declaration="yes"/>

    <xsl:template match="/">
        <vbox class="request gemme" id="missiveBodyView" flex="1" xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">
            <separator class="thin" orient="horizontal"/>
            <hbox id="semBdy">
                <box align="start" class="semModeToggleParentContainer" pack="center"/>
                <vbox flex="1">
                    <grid align="stretch" id="bdyGrid">
                        <columns>
                            <column/>
                            <column flex="1"/>
                        </columns>
                        <rows>
                            <row align="center" class="grid-row">
                                <label id="semMessageIdLabel" value="Message identification"/>
                                <textbox id="semMessageIdValue" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:GrpHdr/p09:MsgId"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semCreationDtTmLabel" value="Creation date time"/>
                                <textbox id="semCreationDtTmValue" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:GrpHdr/p09:CreDtTm"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semMandateIdenitificationLabel" value="Mandate identification"/>
                                <textbox id="semMandateIdenitificationValue" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:Mndt/p09:MndtId"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semMandateRequestIdenitificationLabel" value="Mandate request identification"/>
                                <textbox id="semMandateRequestIdenitificationValue" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:Mndt/p09:MndtReqId"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semCreditorNameLabel" value="Creditor name"/>
                                <textbox id="semCreditorNameValue" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:Mndt/p09:Cdtr/p09:Nm"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semCreditorAccountLabel" value="Creditor account"/>
                                <textbox id="semCreditorAccountValue" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:Mndt/p09:CdtrAcct/p09:Id/p09:IBAN"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semDebtorNameLabel" value="Creditor account"/>
                                <textbox id="semDebtorNameValue" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:Mndt/p09:Dbtr/p09:Nm"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semDebtorAccountLabel" value="Debtor account"/>
                                <textbox id="semDebtorAccountValue" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:Mndt/p09:DbtrAcct/p09:Id/p09:IBAN"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semCreditorAgentLabel" value="Creditor agent"/>
                                <textbox id="semCreditorAgentValue" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:Mndt/p09:DbtrAgt/p09:FinInstnId/p09:BIC"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                        </rows>
                    </grid>
                    <separator class="thin" orient="horizontal"/>
                    <hbox align="stretch" id="semBdyOperations" pack="start">
                        <button id="semBdyReplyMandateAcceptButton" disabled="false" label="Accept" oncommand="SMETHReadMessageController.handleReportButtonClick('missive_gemme_request_transition_accept_report_xml.xsl');"/>
                        <button id="semBdyReplyMandateRefuseButton" disabled="false" label="Decline" oncommand="SMETHReadMessageController.handleReportButtonClick('missive_gemme_request_transition_decline_report_xml.xsl');"/>
                    </hbox>
                </vbox>
            </hbox>
        </vbox>
    </xsl:template>

</xsl:stylesheet>