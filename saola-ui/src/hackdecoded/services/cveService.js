// CVE API Service - Fetches CVE information from public APIs

export const searchCVE = async (cveId) => {
  try {
    // Clean the CVE ID (remove CVE- prefix if present, ensure uppercase)
    const cleanId = cveId.toUpperCase().replace('CVE-', '').trim()
    
    // Validate CVE format: CVE-YYYY-XXXXX (or variations)
    const cveRegex = /^\d{4}-\d{4,}$/
    if (!cveRegex.test(cleanId)) {
      throw new Error('Invalid CVE format. Expected: CVE-YYYY-XXXXX')
    }

    // Try to fetch from NVD API (NIST National Vulnerability Database)
    const fullCveId = `CVE-${cleanId}`
    
    // Using the NVD API (no key required for basic access)
    const response = await fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${fullCveId}`)
    
    if (!response.ok) {
      throw new Error('CVE not found in database')
    }

    const data = await response.json()
    
    if (!data.vulnerabilities || data.vulnerabilities.length === 0) {
      throw new Error('CVE not found')
    }

    const vuln = data.vulnerabilities[0].cve
    
    return {
      id: vuln.id,
      description: vuln.descriptions?.[0]?.value || 'No description available',
      cvssScore: vuln.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 
                 vuln.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore ||
                 vuln.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore || 'N/A',
      cvssVector: vuln.metrics?.cvssMetricV31?.[0]?.cvssData?.vectorString ||
                  vuln.metrics?.cvssMetricV30?.[0]?.cvssData?.vectorString ||
                  vuln.metrics?.cvssMetricV2?.[0]?.cvssData?.vectorString || 'N/A',
      severity: vuln.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity ||
                vuln.metrics?.cvssMetricV30?.[0]?.cvssData?.baseSeverity ||
                vuln.metrics?.cvssMetricV2?.[0]?.baseSeverity || 'UNKNOWN',
      published: vuln.published || 'Unknown',
      modified: vuln.lastModified || 'Unknown',
      references: vuln.references?.map(ref => ref.url) || [],
      cwe: vuln.weaknesses?.map(w => ({
        id: w.source === 'NVD' ? w.description?.[0]?.value : w.description?.[0]?.value,
        source: w.source
      })) || [],
      raw: vuln
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch CVE information', { cause: error })
  }
}

// Get severity color for display
export const getSeverityColor = (severity) => {
  const severityMap = {
    'CRITICAL': 'var(--cyber-red)',
    'HIGH': 'var(--cyber-orange)',
    'MEDIUM': 'var(--cyber-yellow)',
    'LOW': 'var(--cyber-green)',
    'NONE': 'var(--cyber-blue)',
    'UNKNOWN': 'var(--cyber-text-dim)'
  }
  return severityMap[severity?.toUpperCase()] || 'var(--cyber-text-dim)'
}

// Format CVSS score with color
export const formatCVSS = (score) => {
  if (score === 'N/A' || !score) return { value: 'N/A', color: 'var(--cyber-text-dim)' }
  
  const numScore = parseFloat(score)
  if (numScore >= 9) return { value: score, color: 'var(--cyber-red)' }
  if (numScore >= 7) return { value: score, color: 'var(--cyber-orange)' }
  if (numScore >= 4) return { value: score, color: 'var(--cyber-yellow)' }
  return { value: score, color: 'var(--cyber-green)' }
}
