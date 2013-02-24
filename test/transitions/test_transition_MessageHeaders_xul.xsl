<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : test001.xsl
    Created on : October 15, 2012, 4:16 PM
    Author     : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description: Transforming an XML to XUL
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:output method="xml"/>

    <xsl:template match="/">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE overlay SYSTEM "chrome://{appname}/locale/overlay.dtd"&gt;</xsl:text>
        <overlay id="dev-xsl" xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">
            <hbox id="messagepanewrapper">
                <vbox>
                    <hbox id="semHdrSummary" collapsed="false">
                        <box align="center" pack="center" style="height:2em; width:2em;">
                            <image id="semHdrExpandButton" height="12" width="12" style="cursor:pointer;">
                                <xsl:attribute name="src">
                                    <xsl:text disable-output-escaping="yes">chrome://{appname}/skin/images/expand.png</xsl:text>
                                </xsl:attribute>
                            </image>
                        </box>
                        <hbox align="center">
                            <xsl:for-each select="/test/header/*">
                                <hbox align="center" style="height: 2em; min-height: 2em;">
                                    <label>
                                        <xsl:attribute name="value"><xsl:value-of select="local-name()"/></xsl:attribute>
                                    </label>
                                    <label value=":"/>
                                    <separator class="thin"/>
                                    <label>
                                        <xsl:attribute name="value"><xsl:value-of select="."/></xsl:attribute>
                                    </label>
                                    <separator width="20"/>
                                </hbox>
                            </xsl:for-each>
                        </hbox>
                    </hbox>
                    <hbox id="semHdrDetails" collapsed="true">
                        <box orient="vertical">
                            <box align="center" pack="center" style="height:2em; width:2em;">
                                <image id="semHdrCollapseButton" height="12" width="12" style="cursor:pointer;">
                                    <xsl:attribute name="src">
                                        <xsl:text disable-output-escaping="yes">chrome://{appname}/skin/images/collapse.png</xsl:text>
                                    </xsl:attribute>
                                </image>
                            </box>
                        </box>
                        <vbox>
                            <xsl:for-each select="/test/header/*">
                                <hbox align="center" style="height: 2em; min-height: 2em;">
                                    <label>
                                        <xsl:attribute name="value"><xsl:value-of select="local-name()"/></xsl:attribute>
                                    </label>
                                    <label value=":"/>
                                    <separator class="thin"/>
                                    <label>
                                        <xsl:attribute name="value"><xsl:value-of select="."/></xsl:attribute>
                                    </label>
                                </hbox>
                            </xsl:for-each>
                        </vbox>
                    </hbox>
                </vbox>
                <browser hidden="true" id="messagepane"/>
            </hbox>
        </overlay>
    </xsl:template>

</xsl:stylesheet>
