<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : attachment_extraction.xsl
    Created on : October 16, 2012, 8:09 PM
    Author     : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description: Extract attached file from XML missive
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
    xmlns:pain013="urn:iso:std:iso:20022:tech:xsd:pain.013.001.01"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../../../xsd/sepamail_missive.xsd"
    exclude-result-prefixes="sem pain013 xsi">

	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" omit-xml-declaration="no" cdata-section-elements="sem:data"/>

	<xsl:template match="sem:Documents">
		<attachment>
			<title><xsl:apply-templates select="sem:Title"/></title>
			<type><xsl:apply-templates select="sem:Type"/></type>
			<mime-type><xsl:apply-templates select="sem:Contents/sem:mime-type"/></mime-type>
			<filename><xsl:apply-templates select="sem:Contents/sem:name"/></filename>
			<content><xsl:text disable-output-escaping="yes">&lt;![CDATA[</xsl:text><xsl:apply-templates select="sem:Contents/sem:data"/><xsl:text disable-output-escaping="yes">]]&gt;</xsl:text></content>
		</attachment>
	</xsl:template>

	<xsl:template match="/">
		<attachments>
			<xsl:apply-templates select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:Header/sem:Documents"/>
		</attachments>
	</xsl:template>

</xsl:stylesheet>
