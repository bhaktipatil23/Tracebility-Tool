import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency for Indian Rupees
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

// Format weight with kg unit
export function formatWeight(kg: number): string {
  return `${kg.toFixed(1)} kg`;
}

// Format date for Indian timezone
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format datetime for Indian timezone
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Mass balance validation
export function validateMassBalance(inputKg: number, outputKg: number, tolerance = 0.2): boolean {
  return Math.abs(inputKg - outputKg) <= tolerance;
}

// Generate unique codes
export function generateLotCode(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `LOT-${dateStr}-${random}`;
}

export function generatePackCode(sku: string): string {
  const date = new Date();
  const monthStr = date.toISOString().slice(2, 7).replace('-', '');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  const unitType = sku.startsWith('REW') ? 'Carton' : 'Bale';
  return `${unitType}-${monthStr}-${random}`;
}

export function generateChallanNo(): string {
  const date = new Date();
  const monthStr = date.toISOString().slice(2, 7).replace('-', '');
  const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  return `CH-${monthStr}-${random}`;
}

// SKU helpers
export function getSkuLabel(sku: string): string {
  const labels: Record<string, string> = {
    'REW-MEN': 'Rewear - Men',
    'REW-WOM': 'Rewear - Women',
    'REW-KID': 'Rewear - Kids',
    'RAG-LGSM-WHITE': 'Rags - Low GSM White',
    'RAG-LGSM-COLOR': 'Rags - Low GSM Color',
    'RAG-HGSM-WHITE': 'Rags - High GSM White',
    'RAG-HGSM-COLOR': 'Rags - High GSM Color',
    'REC-COT-WHITE': 'Recycle - Cotton White',
    'REC-COT-COLOR': 'Recycle - Cotton Color',
    'REC-POLY-WHITE': 'Recycle - Poly White',
    'REC-POLY-COLOR': 'Recycle - Poly Color',
    'REC-MIX': 'Recycle - Mixed',
    'RLF-WTE': 'Relife - Waste to Energy'
  };
  return labels[sku] || sku;
}

// Source type labels
export function getSourceTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'BRAND': 'Brand',
    'NGO': 'NGO',
    'WAGHRI': 'Waghri',
    'CONSUMER': 'Consumer',
    'SCHOOL': 'School',
    'HOTEL': 'Hotel',
    'OFFICE': 'Office',
    'AGGREGATOR': 'Aggregator',
    'IMPORTED': 'Imported',
    'OTHER': 'Other'
  };
  return labels[type] || type;
}

// Contamination flag labels
export function getContaminationLabel(flag: string): string {
  const labels: Record<string, string> = {
    'WET': 'Wet',
    'SOILED': 'Soiled',
    'MIXED': 'Mixed',
    'INFESTED': 'Infested'
  };
  return labels[flag] || flag;
}

// Status badge variants
export function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    'DRAFT': 'outline',
    'ALLOCATED': 'secondary',
    'DISPATCHED': 'default',
    'CLOSED': 'secondary'
  };
  return variants[status] || 'default';
}

// Export data as CSV
export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string): void {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Print utilities
export function printElement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}