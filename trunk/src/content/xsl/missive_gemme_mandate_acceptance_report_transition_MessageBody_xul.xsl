<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : missive_gemme_mandate_acceptance_report_transition_MessageBody_xul.xsl
    Created on : May 20, 2012, 09:50 AM
    Author     : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description: Transforming a rapport@direct.debit XML to XUL interface
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
    xmlns:p012="urn:iso:std:iso:20022:tech:xsd:pain.012.001.01"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://xsd.sepamail.eu/1206/ ../xsd/sepamail_missive.xsd"
    xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
    exclude-result-prefixes="sem p012 xsi">

    <xsl:output method="xml" omit-xml-declaration="yes"/>

    <xsl:template match="/">
        <xsl:variable name="status" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001/sem:Report/p012:UndrlygAccptncDtls/p012:AccptncRslt/p012:Accptd"/>
        <xsl:variable name="extensionCount" select="count(/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001/sem:DSExt)"/>
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
                                <label id="semMessageIdLabel" value="Message ID"/>
                                <textbox id="semMessageIdValue" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001/sem:Report/p012:GrpHdr/p012:MsgId"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semMessageCreationLabel" value="Creation date time"/>
                                <textbox id="semMessageCreationValue" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001/sem:Report/p012:GrpHdr/p012:CreDtTm"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semRequestIdLabel" value="Request message ID"/>
                                <textbox id="semRequestIdValue" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001/sem:Report/p012:UndrlygAccptncDtls/p012:OrgnlMsgInf/p012:MsgId"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semRequestDateTimeLabel" value="Request date time"/>
                                <textbox id="semRequestDateTimeValue" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001/sem:Report/p012:UndrlygAccptncDtls/p012:OrgnlMsgInf/p012:CreDtTm"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semStatusLabel" value="Status"/>
                                <label id="semStatusValueLabel" class="form-status">
                                    <xsl:attribute name="value">
                                        <xsl:if test="$status = 'false'">REJECTED</xsl:if>
                                        <xsl:if test="$status = 'true'">ACCEPTED</xsl:if>
                                    </xsl:attribute>
                                </label>
                            </row>
                            <xsl:if test="$status = 'false'">
                                <row align="center" class="grid-row">
                                    <label id="semRejectionCodeLabel" value="Rejection code"/>
                                    <textbox id="semRejectionCodeTextbox" readonly="true">
                                        <xsl:attribute name="value">
                                            <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001/sem:Report/p012:UndrlygAccptncDtls/p012:AccptncRslt/p012:RjctRsn/p012:Cd"/>
                                        </xsl:attribute>
                                    </textbox>
                                </row>
                                <row align="center" class="grid-row">
                                    <label id="semRejectionInfoLabel" value="Rejection info"/>
                                    <textbox id="semRejectionInfoTextbox" readonly="true">
                                        <xsl:attribute name="value">
                                            <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001/sem:Report/p012:UndrlygAccptncDtls/p012:AccptncRslt/p012:AddtlRjctRsnInf"/>
                                        </xsl:attribute>
                                    </textbox>
                                </row>
                            </xsl:if>
                            <xsl:if test="$extensionCount > 0">
                                <row align="center" class="grid-row">
                                    <label id="semNewCreditorAgentLabel" value="New creditor agent"/>
                                    <textbox id="semNewCreditorAgentTextbox" readonly="true">
                                        <xsl:attribute name="value">
                                            <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001/sem:DSExt/sem:BIC"/>
                                        </xsl:attribute>
                                    </textbox>
                                </row>
                                <row align="center" class="grid-row">
                                    <label id="semNewCreditorIBANLabel" value="New creditor IBAN"/>
                                    <textbox id="semNewCreditorIBANTextbox" readonly="true">
                                        <xsl:attribute name="value">
                                            <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001/sem:DSExt/sem:IBAN"/>
                                        </xsl:attribute>
                                    </textbox>
                                </row>
                            </xsl:if>
                        </rows>
                    </grid>
                </vbox>
            </hbox>
        </vbox>
    </xsl:template>

</xsl:stylesheet>