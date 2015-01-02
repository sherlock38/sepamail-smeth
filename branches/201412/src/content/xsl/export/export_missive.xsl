<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : export_all.xsl
    Created on : January 24, 2013, 11:22 AM
    Author     : Bishan Kumar Madhoo
    Description: Pretty print all content of SEPAmail message and preserve CDATA for sem:Data elements
-->

<xsl:stylesheet version="1.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge">

    <xsl:output method="xml" encoding="UTF-8" indent="yes" omit-xml-declaration="yes" cdata-section-elements="sem:Data"/>

    <xsl:template match="/">
        <xsl:copy-of select="."/>
    </xsl:template>

</xsl:stylesheet>
