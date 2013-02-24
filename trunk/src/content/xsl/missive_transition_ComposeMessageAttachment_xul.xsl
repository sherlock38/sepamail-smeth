<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : missive_transition_MessageAttachment_xul.xsl
    Created on : November 5, 2012, 9:53 AM
    Author     : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description: Transforming a nominal missive to list of attachments
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
    xmlns:pain013="urn:iso:std:iso:20022:tech:xsd:pain.013.001.01"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../../../xsd/sepamail_missive.xsd"
    xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
    exclude-result-prefixes="sem pain013 xsi">

    <xsl:output method="xml" omit-xml-declaration="yes"/>

    <xsl:template match="sem:Header">
        <xsl:variable name="noAttachments" select="count(/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:Header/sem:Documents)"/>
        <xsl:if test="$noAttachments = 0">
            <vbox id="missiveAttachmentContainer" collapsed="true"/>
        </xsl:if>
        <xsl:if test="$noAttachments = 1">
            <vbox id="missiveAttachmentContainer">
                <menupopup id="missiveAttachmentListContext" onpopupshowing="return SMETHAttachmentController.onMissiveAttachmentListContextMenuShowing(event);">
                    <menuitem id="openAllMissiveAttachmentListContextMenu" label="Open All..." accesskey="O" oncommand="SMETHAttachmentController.TryHandleMissiveAttachments('openAll');"/>
                    <menuitem id="deleteAllMissiveAttachmentListContextMenu" label="Delete All..." accesskey="D" oncommand="SMETHRequestController.TryHandleMissiveAttachments('deleteAll');"/>
                </menupopup>
                <menupopup id="missiveAttachmentListItemContext" onpopuphidding="return SMETHAttachmentController.onMissiveAttachmentListItemContextMenuHidding();" onpopupshowing="return SMETHAttachmentController.onMissiveAttachmentListItemContextMenuShowing();">
                    <menuitem id="openMissiveAttachmentListItemContextMenu" label="Open" accesskey="O" oncommand="SMETHAttachmentController.TryHandleMissiveAttachments('open', this.parentNode);"/>
                    <menuitem id="deleteMissiveAttachmentListItemContextMenu" label="Delete" accesskey="D" oncommand="SMETHRequestController.TryHandleMissiveAttachments('delete', this.parentNode);"/>
                </menupopup>
                <splitter id="missiveAttachmentSplitter" collapse="after" resizebefore="closest" resizeafter="closest" collapsed="true"/>
                <vbox id="missiveAttachmentView">
                    <hbox align="center" id="missiveAttachmentBar" tooltiptext="Show the attachment pane" onclick="if (event.button == 0) SMETHAttachmentController.toggleMissiveComposeWindowAttachmentList(); event.stopPropagation();">
                        <hbox>
                            <button id="missiveAttachmentToggle" type="checkbox" checkstate="0" onclick="event.stopPropagation();" onmousedown="event.preventDefault();" oncommand="SMETHAttachmentController.toggleMissiveComposeWindowAttachmentList();"/>
                            <hbox id="missiveAttachmentInfo" align="center" flex="1" context="missiveAttachmentListContextMenu">
                                <image id="missiveAttachmentIcon"/>
                                <label id="missiveAttachmentCount" value="1 attachment:"/>
                                <label id="missiveAttachmentName" crop="center" flex="1" tooltiptext="Open the attached file" onclick="if (event.button == 0) {{ SMETHAttachmentController.TryHandleMissiveAttachments('open'); SMETHAttachmentController.restoreFocusAfterButton(); event.stopPropagation(); }}">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:Header/sem:Documents/sem:Contents/sem:name"/>
                                    </xsl:attribute>
                                </label>
                                <label id="missiveAttachmentSize" value=""/>
                            </hbox>
                        </hbox>
                        <spacer flex="9999"/>
                        <toolbox id="missiveAttachment-view-toolbox" class="inline-toolbox" defaulticonsize="small" minwidth="50px" defaultlabelalign="end" defaultmode="full" inlinetoolbox="true" mode="full" iconsize="small" labelalign="end">
                            <toolbar id="missiveAttachment-view-toolbar" class="inline-toolbar" customizable="false" mode="full" context="missiveAttachment-toolbar-context-menu" defaulticonsize="small" defaultmode="full" defaultSet="missiveAttachmentSaveAll" iconsize="small">
                                <toolbaritem id="missiveAttachmentSaveAll" removable="false" title="Delete">
                                    <toolbarbutton type="menu-button" id="missiveAttachmentSaveAllSingle" class="toolbarbutton-1 msgHeaderView-button" label="Delete" onclick="event.stopPropagation();" oncommand="SMETHRequestController.TryHandleMissiveAttachments('delete'); event.stopPropagation();" tooltiptext="Delete the attached files">
                                        <menupopup id="missiveAttachmentSaveAllSingleMenu">
                                            <menuitem id="button-openMissiveAttachment" label="Open" accesskey="O" oncommand="SMETHAttachmentController.TryHandleMissiveAttachments('open'); event.stopPropagation();"/>
                                            <menuitem id="button-deleteMissiveAttachment" label="Delete" accesskey="D" oncommand="SMETHRequestController.TryHandleMissiveAttachments('delete'); event.stopPropagation();"/>
                                        </menupopup>
                                    </toolbarbutton>
                                </toolbaritem>
                            </toolbar>
                        </toolbox>
                    </hbox>
                    <xsl:variable name="attachmentType" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:Header/sem:Documents/sem:Contents/sem:mime-type"/>
                    <xsl:variable name="attachmentName" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:Header/sem:Documents/sem:Contents/sem:name"/>
                    <missiveattachmentlist id="missiveAttachmentList" collapsed="true" context="missiveAttachmentListContext" flex="1" itemcontext="missiveAttachmentListItemContext" orient="horizontal" seltype="multiple" view="small">
                        <missiveattachmentitem size="" imagesize="16">
                            <xsl:attribute name="name">
                                <xsl:value-of disable-output-escaping="yes" select="$attachmentName"/>
                            </xsl:attribute>
                            <xsl:attribute name="tooltiptext">
                                <xsl:value-of disable-output-escaping="yes" select="$attachmentName"/>
                            </xsl:attribute>
                            <xsl:attribute name="image16">moz-icon://<xsl:value-of disable-output-escaping="yes" select="$attachmentName"/>?size=16&amp;contentType=<xsl:value-of disable-output-escaping="yes" select="$attachmentType"/></xsl:attribute>
                            <xsl:attribute name="image32">moz-icon://<xsl:value-of disable-output-escaping="yes" select="$attachmentName"/>?size=32&amp;contentType=<xsl:value-of disable-output-escaping="yes" select="$attachmentType"/></xsl:attribute>
                            <data>
                                <xsl:attribute name="type">
                                    <xsl:value-of disable-output-escaping="yes" select="$attachmentType"/>
                                </xsl:attribute>
                                <xsl:attribute name="name">
                                    <xsl:value-of disable-output-escaping="yes" select="$attachmentName"/>
                                </xsl:attribute>
                                <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:Header/sem:Documents/sem:Contents/sem:data"/>
                            </data>
                        </missiveattachmentitem>
                    </missiveattachmentlist>
                </vbox>
            </vbox>
        </xsl:if>
        <xsl:if test="$noAttachments > 1">
            <vbox id="missiveAttachmentContainer">
                <menupopup id="missiveAttachmentListContext" onpopupshowing="return SMETHAttachmentController.onMissiveAttachmentListContextMenuShowing(event);">
                    <menuitem id="openAllMissiveAttachmentListContextMenu" label="Open All..." accesskey="O" oncommand="SMETHAttachmentController.TryHandleMissiveAttachments('openAll');"/>
                    <menuitem id="deleteAllMissiveAttachmentListContextMenu" label="Delete All..." accesskey="D" oncommand="SMETHRequestController.TryHandleMissiveAttachments('deleteAll');"/>
                </menupopup>
                <menupopup id="missiveAttachmentListItemContext" onpopuphidding="return SMETHAttachmentController.onMissiveAttachmentListItemContextMenuHidding();" onpopupshowing="return SMETHAttachmentController.onMissiveAttachmentListItemContextMenuShowing();">
                    <menuitem id="openMissiveAttachmentListItemContextMenu" label="Open" accesskey="O" oncommand="SMETHAttachmentController.TryHandleMissiveAttachments('open', this.parentNode);"/>
                    <menuitem id="deleteMissiveAttachmentListItemContextMenu" label="Delete" accesskey="D" oncommand="SMETHRequestController.TryHandleMissiveAttachments('delete', this.parentNode);"/>
                </menupopup>
                <splitter id="missiveAttachmentSplitter" collapse="after" resizebefore="closest" resizeafter="closest" collapsed="true"/>
                <vbox id="missiveAttachmentView">
                    <hbox align="center" id="missiveAttachmentBar" tooltiptext="Show the attachment pane" onclick="if (event.button == 0) SMETHAttachmentController.toggleMissiveComposeWindowAttachmentList(); event.stopPropagation();">
                        <hbox>
                            <button id="missiveAttachmentToggle" type="checkbox" checkstate="0" onclick="event.stopPropagation();" onmousedown="event.preventDefault();" oncommand="SMETHAttachmentController.toggleMissiveComposeWindowAttachmentList();"/>
                            <hbox id="missiveAttachmentInfo" align="center" flex="1" context="missiveAttachmentListContextMenu">
                                <image id="missiveAttachmentIcon"/>
                                <label id="missiveAttachmentCount">
                                    <xsl:attribute name="value">
                                        <xsl:value-of select="$noAttachments"/><xsl:text> attachments</xsl:text>
                                    </xsl:attribute>
                                </label>
                                <label id="missiveAttachmentName" collapsed="true"/>
                                <label id="missiveAttachmentSize" value=""/>
                            </hbox>
                        </hbox>
                        <spacer flex="9999"/>
                        <toolbox id="missiveAttachment-view-toolbox" class="inline-toolbox" defaulticonsize="small" minwidth="50px" defaultlabelalign="end" defaultmode="full" inlinetoolbox="true" mode="full" iconsize="small" labelalign="end">
                            <toolbar id="missiveAttachment-view-toolbar" class="inline-toolbar" customizable="false" mode="full" context="missiveAttachment-toolbar-context-menu" defaulticonsize="small" defaultmode="full" defaultSet="missiveAttachmentSaveAll" iconsize="small">
                                <toolbaritem id="missiveAttachmentSaveAll" removable="false" title="Delete">
                                    <toolbarbutton type="menu-button" id="missiveAttachmentSaveAllSingle" class="toolbarbutton-1 msgHeaderView-button" label="Delete" onclick="event.stopPropagation();" oncommand="SMETHRequestController.TryHandleMissiveAttachments('delete'); event.stopPropagation();" tooltiptext="Delete the attached files">
                                        <menupopup id="missiveAttachmentSaveAllSingleMenu">
                                            <menuitem id="button-openMissiveAttachment" label="Open" accesskey="O" oncommand="SMETHAttachmentController.TryHandleMissiveAttachments('open'); event.stopPropagation();"/>
                                            <menuitem id="button-deleteMissiveAttachment" label="Delete" accesskey="D" oncommand="SMETHRequestController.TryHandleMissiveAttachments('delete'); event.stopPropagation();"/>
                                        </menupopup>
                                    </toolbarbutton>
                                </toolbaritem>
                            </toolbar>
                        </toolbox>
                    </hbox>
                    <missiveattachmentlist id="missiveAttachmentList" collapsed="true" context="missiveAttachmentListContext" flex="1" itemcontext="missiveAttachmentListItemContext" orient="horizontal" seltype="multiple" view="small">
                        <xsl:for-each select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:Header/sem:Documents">
                            <xsl:variable name="attachmentType" select="./sem:Contents/sem:mime-type"/>
                            <xsl:variable name="attachmentName" select="./sem:Contents/sem:name"/>
                            <missiveattachmentitem size="" imagesize="16">
                                <xsl:attribute name="name">
                                    <xsl:value-of disable-output-escaping="yes" select="$attachmentName"/>
                                </xsl:attribute>
                                <xsl:attribute name="image16">moz-icon://<xsl:value-of disable-output-escaping="yes" select="$attachmentName"/>?size=16&amp;contentType=<xsl:value-of disable-output-escaping="yes" select="$attachmentType"/></xsl:attribute>
                                <xsl:attribute name="image32">moz-icon://<xsl:value-of disable-output-escaping="yes" select="$attachmentName"/>?size=32&amp;contentType=<xsl:value-of disable-output-escaping="yes" select="$attachmentType"/></xsl:attribute>
                                <xsl:attribute name="tooltiptext">
                                    <xsl:value-of disable-output-escaping="yes" select="$attachmentType"/>
                                </xsl:attribute>
                                <data>
                                    <xsl:attribute name="type">
                                        <xsl:value-of disable-output-escaping="yes" select="$attachmentType"/>
                                    </xsl:attribute>
                                    <xsl:attribute name="name">
                                        <xsl:value-of disable-output-escaping="yes" select="$attachmentName"/>
                                    </xsl:attribute>
                                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:Header/sem:Documents/sem:Contents/sem:data"/>
                                </data>
                            </missiveattachmentitem>
                        </xsl:for-each>
                    </missiveattachmentlist>
                </vbox>
            </vbox>
        </xsl:if>
    </xsl:template>

    <xsl:template match="/">
        <xsl:apply-templates select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:Header"/>
    </xsl:template>

</xsl:stylesheet>
