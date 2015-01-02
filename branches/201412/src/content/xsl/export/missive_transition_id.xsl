<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : missive_transition_id.xsl
    Created on : January 24, 2013, 15:13 AM
    Author     : Bishan Kumar Madhoo
    Description: Get the message ID of a SEPAmail message
-->

<xsl:stylesheet version="1.0" xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output indent="no" method="xml" omit-xml-declaration="yes" />

    <xsl:template match="/">
		<xsl:variable name="isTestMessage" select="count(/*/sem:TestId)"/>
        <xsl:if test="$isTestMessage = 0">
            <messageId>
                <xsl:value-of disable-output-escaping="yes" select="/*/sem:sepamail_missive_001/sem:MsvId"/>
            </messageId>
        </xsl:if>
        <xsl:if test="$isTestMessage = 1">
            <messageId>
                <xsl:value-of disable-output-escaping="yes" select="/*/sem:TestId"/>
            </messageId>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>
