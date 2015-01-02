<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : missive_gemme_prenotification_transition_MessageBody_xul.xsl
    Created on : May 21, 2013, 11:18 AM
    Author     : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description: Transforming a notification@direct.debut XML to XUL interface
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
    xmlns:p09="urn:iso:std:iso:20022:tech:xsd:pain.009.001.01"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../xsd/sepamail_missive.xsd"
    xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
    exclude-result-prefixes="sem p09 xsi">

    <xsl:output method="xml" omit-xml-declaration="yes"/>

    <xsl:template match="/">
        <xsl:variable name="amountCurrency" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:Trans/sem:Trs/sem:TrsAmt/attribute::Ccy"/>
        <xsl:variable name="amount" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:Trans/sem:Trs/sem:TrsAmt"/>
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
                                <label id="semGroupingLabel" value="Grouping"/>
                                <textbox id="semGroupingTextbox" flex="1" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:GrpHdr/sem:Grpg"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semPaymentIdLabel" value="Payment ID"/>
                                <textbox id="semPaymentIdTextbox" flex="1" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:PntId"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semMandateIdLabel" value="Mandate ID"/>
                                <textbox id="semMandateIdTextbox" flex="1" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:MndtId"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semCreditorRefLabel" value="Creditor reference"/>
                                <textbox id="semCreditorRefTextbox" flex="1" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:CtrRef"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semCreditorNameLabel" value="Creditor name"/>
                                <textbox id="semCreditorNameTextbox" flex="1" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:Cdtr/p09:Nm"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semCreditorFinancialInstitutionIdLabel" value="Creditor financial institution ID"/>
                                <textbox id="semCreditorFinancialInstitutionIdTextbox" flex="1" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:CdtrAgt/p09:FinInstnId/p09:BIC"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semDebtorNameLabel" value="Debtor name"/>
                                <textbox id="semDebtorNameTextbox" flex="1" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:Dbtr/p09:Nm"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semDebtorIBANLabel" value="Debtor IBAN"/>
                                <textbox id="semDebtorIBANTextbox" flex="1" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:DbtrAcct/p09:Id/p09:IBAN"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semDebtorFinancialInstitutionIdLabel" value="Debtor financial institution ID"/>
                                <textbox id="semDebtorFinancialInstitutionIdTextbox" flex="1" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:DbtrAgt/p09:FinInstnId/p09:BIC"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semTransactionDateLabel" value="Transaction date"/>
                                <box pack="start">
                                    <datepicker id="semTransactionDatePicker" type="popup" readonly="true">
                                        <xsl:attribute name="value">
                                            <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:Notif/sem:Trans/sem:Trs/sem:TrsDate"/>
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