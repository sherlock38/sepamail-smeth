<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : export_envelope.xsl
    Created on : January 25, 2013, 10:32 AM
    Author     : Bishan Kumar Madhoo
    Description: Get the envelope of a SEPAmail message
-->

<xsl:stylesheet version="1.0" xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="xml" omit-xml-declaration="yes" indent="yes"/>

    <xsl:template match="sem:MsvBdy"/>
    <xsl:template match="sem:Data"/>
    <xsl:template match="sem:Text"/>

    <xsl:template match="*|@*">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>

</xsl:stylesheet>
