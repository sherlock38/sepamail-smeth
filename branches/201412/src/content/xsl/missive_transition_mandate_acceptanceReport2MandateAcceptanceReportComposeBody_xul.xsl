<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : missive_transition_mandate_acceptanceReport2MandateAcceptanceReportComposeBody_xul.xsl
    Created on : May 17, 2013, 01:14 PM
    Author     : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description: Transform a rapport@direct.debit XML to XUL interface for message composition
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
        <vbox class="request gemme" id="missiveBodyView" flex="1">
            <label id="semTestRequestTitle" value="Mandat acceptance report details"/>
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
                        <caption id="groupboxTestRequestContentCaption" label="Mandate acceptance report content"/>
                        <separator class="thin" orient="horizontal"/>
                        <grid align="stretch" id="gridTestId">
                            <columns>
                                <column/>
                                <column/>
                                <column flex="1"/>
                            </columns>
                            <rows>
                                <row align="center">
                                    <label id="semOriginalMessageIdLabel" value="Original message ID"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="semOriginalMessageIdTextbox" flex="1" readonly="true">
                                        <xsl:attribute name="value">
                                            <xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001/sem:Report/p012:UndrlygAccptncDtls/p012:OrgnlMsgInf/p012:MsgId"/>
                                        </xsl:attribute>
                                    </textbox>
                                </row>
                                <row align="center">
                                    <label id="semOriginalCreationDateTimeLabel" value="Original message creation date and time"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="semOriginalCreationDateTimeTextbox" flex="1" readonly="true">
                                        <xsl:attribute name="value">
                                            <xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001/sem:Report/p012:UndrlygAccptncDtls/p012:OrgnlMsgInf/p012:CreDtTm"/>
                                        </xsl:attribute>
                                    </textbox>
                                </row>
                                <row align="center">
                                    <label id="semOriginalMandateIdLabel" value="Original mandate ID"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="semOriginalMandateIdTextbox" flex="1" readonly="true">
                                        <xsl:attribute name="value">
                                            <xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandateAcceptance/sem:sepamail_message_direct_debit_mandate_acceptance_001/sem:Report/p012:UndrlygAccptncDtls/p012:OrgnlMndt/p012:OrgnlMndtId"/>
                                        </xsl:attribute>
                                    </textbox>
                                </row>
                                <row align="center">
                                    <label id="semStatusLabel" value="Status"/>
                                    <separator class="thin" orient="vertical"/>
                                    <label id="semStatusValueLabel" class="form-status" flex="1">
                                        <xsl:attribute name="value">
                                            <xsl:if test="$status = 'false'">REJECTED</xsl:if>
                                            <xsl:if test="$status = 'true'">ACCEPTED</xsl:if>
                                        </xsl:attribute>
                                    </label>
                                </row>
                                <xsl:if test="$status = 'false'">
                                    <row align="center">
                                        <label id="semRejectionCodeLabel" value="Rejection code"/>
                                        <separator class="thin" orient="vertical"/>
                                        <textbox id="semRejectionCodeTextbox" flex="1"/>
                                    </row>
                                    <row align="center">
                                        <label id="semRejectionInfoLabel" value="Rejection info"/>
                                        <separator class="thin" orient="vertical"/>
                                        <textbox id="semRejectionInfoTextbox" flex="1"/>
                                    </row>
                                </xsl:if>
                                <row align="center">
                                    <checkbox id="changeBankDetailsCheckbox" label="Change bank details" checked="false">
                                        <xsl:attribute name="oncommand">
                                            <xsl:text disable-output-escaping="yes">

                                                // Verify the checked status of the checkbox
                                                if (this.checked) {

                                                    // Enable bank details modification fields
                                                    document.getElementById('semNewAgentLabel').disabled = false;
                                                    document.getElementById('semNewAgentTextbox').disabled = false;
                                                    document.getElementById('semNewIBANLabel').disabled = false;
                                                    document.getElementById('semNewIBANTextbox').disabled = false;

                                                } else {

                                                    // Disable bank details modification fields
                                                    document.getElementById('semNewAgentLabel').disabled = true;
                                                    document.getElementById('semNewAgentTextbox').disabled = true;
                                                    document.getElementById('semNewIBANLabel').disabled = true;
                                                    document.getElementById('semNewIBANTextbox').disabled = true;

                                                    // Clear values in the bank details fields
                                                    document.getElementById('semNewAgentTextbox').value = '';
                                                    document.getElementById('semNewIBANTextbox').value = '';
                                                }

                                            </xsl:text>
                                        </xsl:attribute>
                                    </checkbox>
                                </row>
                                <row align="center">
                                    <label id="semNewAgentLabel" value="New creditor agent" disabled="true"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="semNewAgentTextbox" flex="1" disabled="true"/>
                                </row>
                                <row align="center">
                                    <label id="semNewIBANLabel" value="New creditor IBAN" disabled="true"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="semNewIBANTextbox" flex="1" disabled="true"/>
                                </row>
                            </rows>
                        </grid>
                    </groupbox>
                </vbox>
            </hbox>
        </vbox>
    </xsl:template>
</xsl:stylesheet>