import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PrintableStudentRegistrationProps {
  studentData: {
    name: string;
    studentId: string;
    batch: string;
    email: string;
    mobile: string;
    password: string;
  };
  onClose: () => void;
}

export const PrintableStudentRegistration: React.FC<PrintableStudentRegistrationProps> = ({
  studentData,
  onClose
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = async () => {
    try {
      setIsGeneratingPDF(true);

      // Extract last 3 digits from student ID
      const lastThreeDigits = studentData.studentId.slice(-3);

      // Create filename: {StudentName}-{BatchName}-{LastThreeDigits}.pdf
      const filename = `${studentData.name}-${studentData.batch}-${lastThreeDigits}.pdf`;

      // Get the printable element
      const element = document.getElementById('printable-registration');

      if (!element) {
        console.error('Printable element not found');
        setIsGeneratingPDF(false);
        return;
      }

      // Capture the element as canvas with high quality
      const canvas = await html2canvas(element, {
        scale: 2.5, // High quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        windowHeight: 1697, // A4 ratio
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('printable-registration');
          if (clonedElement) {
            // Make sure the cloned element is visible and properly sized
            clonedElement.style.display = 'block';
            clonedElement.style.position = 'relative';
            clonedElement.style.width = '1200px';
            clonedElement.style.padding = '60px';
            clonedElement.style.backgroundColor = '#ffffff';
            clonedElement.style.transform = 'scale(1)';
          }
        }
      });

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;

      // Calculate dimensions to fit the canvas on A4
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // If content is taller than A4, scale it to fit
      if (imgHeight > pdfHeight) {
        const scale = pdfHeight / imgHeight;
        const scaledWidth = imgWidth * scale;
        const scaledHeight = pdfHeight;
        const xOffset = (pdfWidth - scaledWidth) / 2;

        pdf.addImage(imgData, 'JPEG', xOffset, 0, scaledWidth, scaledHeight);
      } else {
        // Center vertically if shorter than A4
        const yOffset = (pdfHeight - imgHeight) / 2;
        pdf.addImage(imgData, 'JPEG', 0, yOffset, imgWidth, imgHeight);
      }

      // Save the PDF
      pdf.save(filename);

      setIsGeneratingPDF(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Non-printable controls */}
        <div className="print:hidden bg-gray-100 p-4 flex justify-between items-center border-b sticky top-0 z-10">
          <h2 className="text-lg font-bold text-gray-800">Student Registration Document - Print Preview</h2>
          <div className="flex gap-3">
            <button
              onClick={handleSavePDF}
              disabled={isGeneratingPDF}
              className={`px-6 py-2 rounded-lg transition-colors font-semibold flex items-center gap-2 ${
                isGeneratingPDF
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isGeneratingPDF ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Save as PDF
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
              </svg>
              Print Document
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable content */}
        <div className="p-10 bg-white" id="printable-registration">
          {/* Header with Logo */}
          <div className="flex items-start justify-between mb-6 pb-5 border-b-2 border-gray-900">
            <div className="flex items-center gap-5">
              <img
                src="/shah-sultan-academy-logo.png"
                alt="Shah Sultan IELTS Academy"
                className="h-24 w-24 object-contain print-logo"
              />
              <div>
                <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-wide print-title">
                  Shah Sultan IELTS Academy
                </h1>
                <p className="text-lg text-gray-700 font-semibold print-subtitle mt-1">
                  Student Registration Document
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Date</p>
              <p className="text-base font-bold text-gray-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Student Details Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-400 uppercase">
              Student Information
            </h2>
            <div className="bg-gray-50 p-4 rounded border border-gray-300">
              <div className="grid grid-cols-3 gap-4 text-base">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Name</p>
                  <p className="font-bold text-gray-900">{studentData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Student ID</p>
                  <p className="font-bold text-blue-600 font-mono">{studentData.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Batch</p>
                  <p className="font-bold text-gray-900">{studentData.batch}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Email</p>
                  <p className="text-gray-900">{studentData.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Mobile Number</p>
                  <p className="text-gray-900">{studentData.mobile}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Credentials Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-400 uppercase">
              Login Credentials
            </h2>
            <div className="bg-blue-50 p-4 rounded border border-blue-300">
              <div className="grid grid-cols-2 gap-4 text-base mb-3">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Portal URL</p>
                  <p className="text-sm font-bold text-blue-600">https://shah-sultan-s-ielts-academy.web.app/</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Student ID</p>
                  <p className="font-bold text-gray-900 font-mono">{studentData.studentId}</p>
                </div>
              </div>
              <div className="bg-yellow-100 p-4 rounded border border-yellow-400">
                <p className="text-sm text-gray-600 font-semibold mb-2">Password</p>
                <p className="text-lg font-bold text-gray-900 font-mono">{studentData.password}</p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Note:</strong> Keep this password secure. Contact the office for password changes.
                </p>
              </div>
            </div>
          </div>

          {/* Portal Features Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-400 uppercase">
              Portal Features
            </h2>
            <div className="bg-gray-50 p-4 rounded border border-gray-300">
              <ul className="grid grid-cols-2 gap-x-5 gap-y-3 text-base text-gray-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg">•</span>
                  <span>Full-length IELTS mock tests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg">•</span>
                  <span>Individual section practice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg">•</span>
                  <span>Detailed band scores (L, R, W, S)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg">•</span>
                  <span>Performance tracking & analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg">•</span>
                  <span>Complete result history</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg">•</span>
                  <span>Detailed feedback & reports</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact & Office Hours Section - Bento Grid */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-400 uppercase">
              Contact Information & Office Hours
            </h2>
            <div className="bg-gray-50 p-4 rounded border border-gray-300">
              {/* Bento Grid Layout */}
              <div className="grid grid-cols-3 gap-3 text-base">
                {/* Left Column - Branches (Stacked) */}
                <div className="col-span-1 flex flex-col gap-3">
                  <div className="bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
                    <p className="font-bold text-gray-900 mb-2">Main Branch</p>
                    <p className="text-gray-700 text-sm">R.B. Complex, 6th Floor, East Zindabazar, Sylhet</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
                    <p className="font-bold text-gray-900 mb-2">Jalalpur Branch</p>
                    <p className="text-gray-700 text-sm">Mosahid Plaza, 2nd Floor, Jalalpur Bazaar, College Road</p>
                  </div>
                </div>

                {/* Middle Column - Contact Details (Stacked) */}
                <div className="col-span-1 flex flex-col gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 shadow-sm flex-1 flex flex-col justify-center">
                    <p className="font-semibold text-gray-600 mb-2 text-sm">Phone / WhatsApp</p>
                    <p className="font-bold text-gray-900">+880 1777-476142</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 shadow-sm flex-1 flex flex-col justify-center">
                    <p className="font-semibold text-gray-600 mb-2 text-sm">Email</p>
                    <p className="font-bold text-gray-900 text-sm">shahsultans.ieltsacademy02@gmail.com</p>
                  </div>
                </div>

                {/* Right Column - Office Hours (Full Height) */}
                <div className="col-span-1">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm h-full flex flex-col justify-center">
                    <p className="font-semibold text-gray-600 mb-3 text-sm">Office Hours</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Sat - Thu</span>
                        <span className="font-bold text-gray-900">9AM - 8PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Friday</span>
                        <span className="font-bold text-red-600">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Section - Condensed */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-400 uppercase">
              About Shah Sultan's IELTS Academy
            </h2>
            <div className="bg-gray-50 p-4 rounded border border-gray-300">
              <p className="text-base text-gray-800 leading-relaxed">
                We are committed to helping students achieve their target IELTS band scores through personalized
                coaching and structured learning programs. Our experienced instructors use modern teaching methods
                to provide comprehensive IELTS preparation in a supportive environment.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-700 border-t border-gray-900 pt-4">
            <p className="font-semibold">Official Registration Document - Shah Sultan IELTS Academy</p>
            <p className="text-gray-600 mt-2">
              Generated: {new Date().toLocaleString()} | CONFIDENTIAL - Keep this document secure
            </p>
            <p className="text-gray-600 mt-2">
              © {new Date().getFullYear()} Shah Sultan's IELTS Academy. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          /* Hide everything except printable content */
          body * {
            visibility: hidden !important;
          }

          #printable-registration,
          #printable-registration * {
            visibility: visible !important;
          }

          /* Position printable content */
          #printable-registration {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            padding: 8mm !important;
            margin: 0 !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
          }

          /* Hide print button and modal controls */
          .print\\:hidden {
            display: none !important;
            visibility: hidden !important;
          }

          /* Page setup - SINGLE PAGE ONLY */
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }

          /* Reduce header logo size */
          #printable-registration .h-24,
          #printable-registration .print-logo {
            height: 3rem !important;
            width: 3rem !important;
          }
          #printable-registration .w-24 {
            width: 3rem !important;
          }

          /* Font size adjustments - Larger but still fits */
          #printable-registration .text-4xl {
            font-size: 1.5rem !important;
            line-height: 1.2 !important;
          }

          #printable-registration .text-xl {
            font-size: 1rem !important;
            line-height: 1.2 !important;
          }

          #printable-registration .text-lg {
            font-size: 0.95rem !important;
            line-height: 1.2 !important;
          }

          #printable-registration .text-base {
            font-size: 0.85rem !important;
            line-height: 1.2 !important;
          }

          #printable-registration .text-sm {
            font-size: 0.75rem !important;
            line-height: 1.2 !important;
          }

          #printable-registration .print-title {
            font-size: 1.5rem !important;
            line-height: 1.2 !important;
          }

          #printable-registration .print-subtitle {
            font-size: 0.9rem !important;
            line-height: 1.2 !important;
          }

          /* Reduce padding and margins - Balanced */
          #printable-registration .p-10 {
            padding: 0.65rem !important;
          }
          #printable-registration .p-4 {
            padding: 0.45rem !important;
          }

          #printable-registration .mb-6 {
            margin-bottom: 0.55rem !important;
          }
          #printable-registration .mb-5 {
            margin-bottom: 0.5rem !important;
          }
          #printable-registration .mb-4 {
            margin-bottom: 0.45rem !important;
          }
          #printable-registration .mb-3 {
            margin-bottom: 0.35rem !important;
          }
          #printable-registration .mb-2 {
            margin-bottom: 0.25rem !important;
          }
          #printable-registration .mb-1 {
            margin-bottom: 0.15rem !important;
          }

          #printable-registration .mt-6 {
            margin-top: 0.55rem !important;
          }
          #printable-registration .mt-4 {
            margin-top: 0.45rem !important;
          }
          #printable-registration .mt-3 {
            margin-top: 0.35rem !important;
          }
          #printable-registration .mt-2 {
            margin-top: 0.25rem !important;
          }
          #printable-registration .mt-1 {
            margin-top: 0.15rem !important;
          }

          #printable-registration .pb-5 {
            padding-bottom: 0.5rem !important;
          }
          #printable-registration .pb-4 {
            padding-bottom: 0.45rem !important;
          }
          #printable-registration .pb-2 {
            padding-bottom: 0.25rem !important;
          }

          #printable-registration .pt-4 {
            padding-top: 0.45rem !important;
          }

          #printable-registration .gap-5 {
            gap: 0.5rem !important;
          }
          #printable-registration .gap-4 {
            gap: 0.45rem !important;
          }
          #printable-registration .gap-3 {
            gap: 0.35rem !important;
          }
          #printable-registration .gap-2 {
            gap: 0.25rem !important;
          }

          #printable-registration .gap-x-5 {
            column-gap: 0.5rem !important;
          }
          #printable-registration .gap-y-3 {
            row-gap: 0.35rem !important;
          }

          /* Reduce border widths for print */
          #printable-registration .border-2 {
            border-width: 1px !important;
          }
          #printable-registration .border {
            border-width: 0.5px !important;
          }

          /* Bento grid specific styles */
          #printable-registration .shadow-sm {
            box-shadow: none !important;
          }

          #printable-registration .rounded-lg {
            border-radius: 0.25rem !important;
          }

          #printable-registration .space-y-2 > * + * {
            margin-top: 0.2rem !important;
          }

          /* Section headings */
          #printable-registration h2 {
            font-size: 1rem !important;
            margin-bottom: 0.45rem !important;
            padding-bottom: 0.25rem !important;
            page-break-after: avoid !important;
          }

          /* Prevent page breaks */
          #printable-registration > div {
            page-break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
};
