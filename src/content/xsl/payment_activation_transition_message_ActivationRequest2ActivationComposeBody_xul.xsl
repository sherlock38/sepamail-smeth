<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : payment_activation_transition_message_ActivationRequest2ActivationComposeBody_xul.xsl
    Created on : November 19, 2012, 2:22 PM
    Author     : Ammit Heeramun <ammit.heeramun@idsoft.mu>
    Edited     : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Last edited: Febuary 20, 2013
    Description: Transforming a template payment activation request to a payment activation compose window body XUL
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
    xmlns:pain013="urn:iso:std:iso:20022:tech:xsd:pain.013.001.01"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../../../xsd/sepamail_missive.xsd"
    xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
    exclude-result-prefixes="sem pain013 xsi">

    <xsl:output method="xml" omit-xml-declaration="yes"/>

    <xsl:template match="/">
        <vbox class="request rubis" id="missiveBodyView" flex="1">
            <label id="semTestRequestTitle" value="Payment activation request details"/>
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
                                    var elements = document.getElementById('vboxPaymentActivationRequestDetails').getElementsByAttribute('collapsed', '*');

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
                <vbox align="stretch" flex="1" id="vboxPaymentActivationRequestDetails">
                    <grid align="stretch" collapsed="true" id="gridTestIdElements">
                        <columns>
                            <column/>
                            <column/>
                            <column flex="1"/>
                            <column/>
                            <column/>
                        </columns>
                        <rows>
                            <row align="center" class="grid-row">
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
                            <row align="center" class="grid-row">
                                <label id="semBdyTypeMissiveLabel" value="Missive Type"/>
                                <separator class="thin" orient="vertical"/>
                                <textbox id="typeMissiveTextbox" flex="1">
                                    <xsl:attribute name="value">
                                        <xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvTyp"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semBdyOrderMissiveLabel" value="Missive Order"/>
                                <separator class="thin" orient="vertical"/>
                                <textbox id="orderMissiveTextbox" flex="1">
                                    <xsl:attribute name="value">
                                        <xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvOrd"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semBdyPriorityLabel" value="Priority"/>
                                <separator class="thin" orient="vertical"/>
                                <textbox id="priorityTextbox" flex="1">
                                    <xsl:attribute name="value">
                                        <xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvPri"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center" class="grid-row">
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
                    <grid id="bdyGrid">
                        <columns>
                            <column/>
                            <column flex="1"/>
                            <column/>
                        </columns>
                        <rows>
                            <row align="center" class="grid-row">
                                <label id="semBdyRequestDateLabel" value="Date du demande"/>
                                <datepicker type="popup" id="semBdyRequestDataValue"/>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semBdyRequestAmountLabel" value="Montant demandé"/>
                                <textbox id="semBdyRequestAmount" flex="1"/>
                                <label id="ccyLabel" value="€ (euros)"/>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semBdyRequestPaymentMethodLabel" value="Moyen de paiement"/>
                                <menulist id="semBdyRequestPaymentType" flex="1">
                                    <menupopup>
                                        <menuitem id="semBdyRequestPaymentMethodCheck" label="Check" value="CHK"/>
                                        <menuitem id="semBdyRequestPaymentMethodTransfer" label="Transfer" value="TRF"/>
                                        <menuitem id="semBdyRequestPaymentMethodDirectDebit" label="Direct Debit" value="DD"/>
                                        <menuitem id="semBdyRequestPaymentMethodPaymentCard" label="Payment Card" value="CARD"/>
                                    </menupopup>
                                </menulist>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semBdyRequestSubjectLabel" value="Intitulé"/>
                                <textbox id="semBdyRequestSubject" flex="1"/>
                            </row>
                        </rows>
                    </grid>
                </vbox>
            </hbox>
        </vbox>
        <!--<hbox id="missiveBodyView" flex="1" xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">
            <vbox flex="1">
                <hbox id="semBdy">
                    <box align="start" class="semModeToggleParentContainer" pack="center">
                        <box align="center" class="semModeToggleContainer" pack="center">
                            <image id="semBdyToogleButton" class="link-image" height="12" width="12">
                            <xsl:attribute name="src">
                                <xsl:text disable-output-escaping="yes">chrome://smeth/skin/images/expand.png</xsl:text>
                            </xsl:attribute>
                            <xsl:attribute name="onclick">
                                <xsl:text disable-output-escaping="yes">
                                    // Get the collapsible elements
                                    var elements = document.getElementById('bdyGrid').getElementsByAttribute('collapsed', '*');

                                    // Instantiate a variable to indicate whether the grid is in collapsed mode or not
                                    var collapse = true;

                                    // For each collapsible elements toogle its state
                                    for(i = 0; i &lt; elements.length; i++) {

                                        if(elements[i].hasAttribute("collapsed")) {

                                            if(elements[i].collapsed) {
                                                collapse = false;
                                                elements[i].setAttribute('collapsed', 'false')
                                            } else {
                                                collapse = true;
                                                elements[i].setAttribute('collapsed', 'true')
                                            }
                                        }
                                    }

                                    // Set the image of the button as per our mode
                                    if(collapse) {
                                        this.src = "chrome://smeth/skin/images/expand.png";
                                    } else {
                                        this.src = "chrome://smeth/skin/images/collapse.png";
                                    }

                                    event.stopPropagation();
                                </xsl:text>
                            </xsl:attribute>
                            </image>
                        </box>
                    </box>
                    <vbox flex="1">
                        <grid id="bdyGrid">
                            <columns>
                                <column/>
                                <column flex="1"/>
                                <column/>
                            </columns>
                            <rows>
                                <row align="center" class="grid-row">
                                    <label id="semBdyRequestDateLabel" value="Date du demande"/>
                                    <datepicker type="popup" id="semBdyRequestDataValue"/>
                                </row>
                                <row align="center" class="grid-row">
                                    <label id="semBdyRequestAmountLabel" value="Montant demandé"/>
                                    <textbox id="semBdyRequestAmount" flex="1"/>
                                    <label id="ccyLabel" value="€ (euros)"/>
                                </row>
                                <row align="center" class="grid-row">
                                    <label id="semBdyRequestPaymentMethodLabel" value="Moyen de paiement"/>
                                    <menulist id="semBdyRequestPaymentType" flex="1">
                                        <menupopup>
                                            <menuitem id="semBdyRequestPaymentMethodCheck" label="Check" value="CHK"/>
                                            <menuitem id="semBdyRequestPaymentMethodTransfer" label="Transfer" value="TRF"/>
                                            <menuitem id="semBdyRequestPaymentMethodDirectDebit" label="Direct Debit" value="DD"/>
                                            <menuitem id="semBdyRequestPaymentMethodPaymentCard" label="Payment Card" value="CARD"/>
                                        </menupopup>
                                    </menulist>
                                </row>
                                <row align="center" class="grid-row">
                                    <label id="semBdyRequestSubjectLabel" value="Intitulé"/>
                                    <textbox id="semBdyRequestSubject" flex="1"/>
                                </row>
                            </rows>
                        </grid>
                    </vbox>
                    <spacer flex="1"/>
                </hbox>
            </vbox>
        </hbox>!-->
    </xsl:template>

</xsl:stylesheet>
