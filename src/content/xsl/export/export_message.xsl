<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : export_message.xsl
    Created on : January 25, 2013, 4:29 PM
    Author     : Bishan Kumar Madhoo
    Description: Get the message part of a SEPAmail message
-->

<xsl:stylesheet version="1.0" xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="xml" omit-xml-declaration="yes" indent="no" cdata-section-elements="sem:Data"/>

    <xsl:template match="sem:MsvId"/>
    <xsl:template match="sem:MsvTyp"/>
    <xsl:template match="sem:MsvOrd"/>
    <xsl:template match="sem:MsvPri"/>
    <xsl:template match="sem:MsvHdr"/>
    <xsl:template match="sem:sepamail_message_001">
        <xsl:copy-of select="."/>
    </xsl:template>

</xsl:stylesheet>
