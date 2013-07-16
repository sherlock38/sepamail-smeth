<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : missive_gemme_request_for_copy_transition_MessageBody_xul.xsl
    Created on : May 22, 2013, 11:06 AM
    Author     : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description: Transforming a request.copy@direct.debit XML message to XUL interface
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
        <xsl:variable name="amountCurrency" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:Request/sem:Trans/sem:TrsAmt/attribute::Ccy"/>
        <xsl:variable name="amount" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:Request/sem:Trans/sem:TrsAmt"/>
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
                            <row align="center">
                                <label id="semMessageIdLabel" value="Request for copy message ID"/>
                                <textbox id="semMessageIdTextbox" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:GrpHdr/sem:RequestId"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semCreationDateTimeLabel" value="Creation date and time"/>
                                <textbox id="semCreationDateTimeTextbox" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:GrpHdr/sem:CreDtTm"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semCreditorReferenceLabel" value="Creditor reference"/>
                                <textbox id="semCreditorReferenceTextbox" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:Request/sem:CtrRef"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semCreditorNameLabel" value="Creditor name"/>
                                <textbox id="semCreditorNameTextbox" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:Request/sem:Cdtr/p09:Nm"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semDebtorNameLabel" value="Debtor name"/>
                                <textbox id="semDebtorNameTextbox" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:Request/sem:Dbtr/p09:Nm"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semDebtorIBANLabel" value="Debtor IBAN"/>
                                <textbox id="semDebtorIBANTextbox" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:Request/sem:DbtrAcct/p09:Id/p09:IBAN"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semDebtorFinancialInstitutionIdLabel" value="Debtor financial institution ID"/>
                                <textbox id="semDebtorFinancialInstitutionIdTextbox" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:Request/sem:DbtrAgt/p09:FinInstnId/p09:BIC"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semTransactionDateLabel" value="Transaction date"/>
                                <box pack="start">
                                    <datepicker id="semTransactionDatePicker" type="popup" readonly="true">
                                        <xsl:attribute name="value">
                                            <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitRFCopy/sem:sepamail_message_direct_debit_request_for_copy_001/sem:Request/sem:Trans/sem:TrsDate"/>
                                        </xsl:attribute>
                                    </datepicker>
                                </box>
                            </row>
                            <row align="center">
                                <label id="semAmountLabel" value="Amount"/>
                                <textbox id="semAmountTextbox" flex="1" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of select="concat($amountCurrency, ' ', $amount)"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                        </rows>
                    </grid>
                </vbox>
            </hbox>
        </vbox>
    </xsl:template>

</xsl:stylesheet>