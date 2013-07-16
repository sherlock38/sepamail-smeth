<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : test_transition_message_Test2TestComposeBody_xul.xsl
    Created on : May 20, 2013, 02:24 PM
    Author     : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description: Transforming a notification@direct.debit XML to message composition XUL interface
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
        <xsl:variable name="groupingMethod" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitPrenotif/sem:sepamail_message_direct_debit_prenotif_001/sem:GrpHdr/sem:Grpg"/>
        <vbox class="request gemme" id="missiveBodyView" flex="1">
            <label id="semTestRequestTitle" value="Notification details"/>
            <separator class="thin" orient="horizontal"/>
            <hbox id="semBdy" flex="1">
                <box align="start" class="semModeToggleParentContainer" pack="center">
                    <box align="center" class="semModeToggleContainer" pack="center">
                        <image id="semBdyToogleButton" class="link-image" height="12" width="12">
                            <xsl:attribute name="src">
                                <xsl:text disable-output-escaping="yes">chrome://smeth/skin/images/expand.png</xsl:text>
                            </xsl:attribute>
                            <xsl:attribute name="onclick">
                                <xsl:text disable-output-escaping="yes">

                                    // Array of elements that are displayed / hidden between display modes
                                    var elements = document.getElementById('vboxTestRequestDetails').getElementsByAttribute('collapsed', '*');

                                    // Show collapsed elements if form is collapsed
                                    if (this.getAttribute('src') == 'chrome://smeth/skin/images/expand.png') {

                                        // Scan the array of collapsed elements
                                        for (var i = 0; i &lt; elements.length; i++) {
                                            elements[i].setAttribute('collapsed', false);
                                        }

                                        // Set the image of the collapse button
                                        this.setAttribute('src', 'chrome://smeth/skin/images/collapse.png');

                                    } else {

                                        // Scan the array of visible elements
                                        for (var i = 0; i &lt; elements.length; i++) {
                                            elements[i].setAttribute('collapsed', true);
                                        }

                                        // Set the image of the collapse button
                                        this.setAttribute('src', 'chrome://smeth/skin/images/expand.png');
                                    }

                                </xsl:text>
                            </xsl:attribute>
                        </image>
                    </box>
                </box>
                <vbox align="stretch" flex="1" id="vboxTestRequestDetails">
                    <grid align="stretch" collapsed="true" id="gridTestIdElements">
                        <columns>
                            <column/>
                            <column/>
                            <column flex="1"/>
                            <column/>
                            <column/>
                        </columns>
                        <rows>
                            <row align="center">
                                <label id="semBdyMissiveIdLabel" value="Missive ID"/>
                                <separator class="thin" orient="vertical"/>
                                <textbox id="missiveIdTextbox" flex="1" readonly="true"/>
                                <separator class="thin" orient="vertical"/>
                                <button id="semMissiveIdButton" label="Generate">
                                    <xsl:attribute name="onclick">
                                        <xsl:text disable-output-escaping="yes">

                                            // UUID generator instance
                                            var uuidGenerator = Components.classes["@mozilla.org/uuid-generator;1"]
                                                                          .getService(Components.interfaces.nsIUUIDGenerator);

                                            // Get a new UUID and assign it to the missive ID textbox
                                            var testId = ((uuidGenerator.generateUUID().toString().replace(/-/g, "")).substring(1, 17)).toUpperCase();
                                            document.getElementById('missiveIdTextbox').setAttribute('value', testId);

                                        </xsl:text>
                                    </xsl:attribute>
                                </button>
                            </row>
                            <row align="center">
                                <label id="semBdyTypeMissiveLabel" value="Missive Type"/>
                                <separator class="thin" orient="vertical"/>
                                <textbox id="typeMissiveTextbox" flex="1">
                                    <xsl:attribute name="value">
                                        <xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvTyp"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semBdyOrderMissiveLabel" value="Missive Order"/>
                                <separator class="thin" orient="vertical"/>
                                <textbox id="orderMissiveTextbox" flex="1">
                                    <xsl:attribute name="value">
                                        <xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvOrd"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semBdyPriorityLabel" value="Priority"/>
                                <separator class="thin" orient="vertical"/>
                                <textbox id="priorityTextbox" flex="1">
                                    <xsl:attribute name="value">
                                        <xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvPri"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semBdyMessageIdLabel" value="Message ID"/>
                                <separator class="thin" orient="vertical"/>
                                <textbox id="messageIdTextbox" flex="1" readonly="true"/>
                                <separator class="thin" orient="vertical"/>
                                <button id="semMessageIdButton" label="Generate">
                                    <xsl:attribute name="onclick">
                                        <xsl:text disable-output-escaping="yes">

                                            // UUID generator instance
                                            var uuidGenerator = Components.classes["@mozilla.org/uuid-generator;1"]
                                                                          .getService(Components.interfaces.nsIUUIDGenerator);

                                            // Get a new UUID and assign it to the missive ID textbox
                                            var testId = ((uuidGenerator.generateUUID().toString().replace(/-/g, "")).substring(1, 33)).toUpperCase();
                                            document.getElementById('messageIdTextbox').setAttribute('value', testId);

                                        </xsl:text>
                                    </xsl:attribute>
                                </button>
                            </row>
                        </rows>
                    </grid>
                    <separator class="thin" collapsed="true" orient="horizontal"/>
                    <groupbox flex="1" id="groupboxTestRequestContent">
                        <caption id="groupboxTestRequestContentCaption" label="Notification content"/>
                        <separator class="thin" orient="horizontal"/>
                        <grid align="stretch" id="gridTestId">
                            <columns>
                                <column/>
                                <column/>
                                <column flex="1"/>
                            </columns>
                            <rows>
                                <row align="center">
                                    <label id="semGroupingLabel" value="Grouping"/>
                                    <separator class="thin" orient="vertical"/>
                                    <menulist id="semGroupingMenuList">
                                        <menupopup>
                                            <menuitem label="GRPD" value="GRPD">
                                                <xsl:if test="$groupingMethod = 'GRPD'">
                                                    <xsl:attribute name="selected">true</xsl:attribute>
                                                </xsl:if>
                                            </menuitem>
                                            <menuitem label="MIXD" value="MIXD">
                                                <xsl:if test="$groupingMethod = 'MIXD'">
                                                    <xsl:attribute name="selected">true</xsl:attribute>
                                                </xsl:if>
                                            </menuitem>
                                            <menuitem label="SNGL" value="SNGL">
                                                <xsl:if test="$groupingMethod = 'SNGL'">
                                                    <xsl:attribute name="selected">true</xsl:attribute>
                                                </xsl:if>
                                            </menuitem>
                                        </menupopup>
                                    </menulist>
                                </row>
                                <row align="center">
                                    <label id="semPaymentIdLabel" value="Payment ID"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="semPaymentIdTextbox" flex="1"/>
                                </row>
                                <row align="center">
                                    <label id="semMandateIdLabel" value="Mandate ID"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="semMandateIdTextbox" flex="1"/>
                                </row>
                                <row align="center">
                                    <label id="semCreditorRefLabel" value="Creditor reference"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="semCreditorRefTextbox" flex="1"/>
                                </row>
                                <row align="center">
                                    <label id="semCreditorNameLabel" value="Creditor name"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="semCreditorNameTextbox" flex="1"/>
                                </row>
                                <row align="center">
                                    <label id="semCreditorFinancialInstitutionIdLabel" value="Creditor financial institution ID"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="semCreditorFinancialInstitutionIdTextbox" flex="1"/>
                                </row>
                                <row align="center">
                                    <label id="semDebtorNameLabel" value="Debtor name"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="semDebtorNameTextbox" flex="1"/>
                                </row>
                                <row align="center">
                                    <label id="semDebtorIBANLabel" value="Debtor IBAN"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="semDebtorIBANTextbox" flex="1"/>
                                </row>
                                <row align="center">
                                    <label id="semDebtorFinancialInstitutionIdLabel" value="Debtor financial institution ID"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="semDebtorFinancialInstitutionIdTextbox" flex="1"/>
                                </row>
                                <row align="center">
                                    <label id="semTransactionDateLabel" value="Transaction date"/>
                                    <separator class="thin" orient="vertical"/>
                                    <datepicker id="semTransactionDatePicker" type="popup"/>
                                </row>
                                <row align="center">
                                    <label id="semAmountLabel" value="Amount"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="semAmountTextbox" flex="1"/>
                                </row>
                            </rows>
                        </grid>
                    </groupbox>
                </vbox>
            </hbox>
        </vbox>
    </xsl:template>
</xsl:stylesheet>