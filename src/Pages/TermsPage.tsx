import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Contract Redliner ("the Service"), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed">
              Contract Redliner is an AI-powered document review and editing platform that helps users analyze, review,
              and modify contract documents. The Service uses artificial intelligence to provide suggestions and insights
              on uploaded documents.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              To use the Service, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be responsible for all activities that occur under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. AI-Generated Content and Disclaimers</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              <strong>IMPORTANT:</strong> The AI suggestions and modifications provided by the Service are for informational
              purposes only and do not constitute legal advice.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>AI-generated suggestions may contain errors or inaccuracies</li>
              <li>You should always consult with a qualified attorney before making legal decisions</li>
              <li>We do not guarantee the accuracy, completeness, or reliability of AI suggestions</li>
              <li>You are solely responsible for reviewing and approving all changes to your documents</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. User Content and Data</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              By uploading documents to the Service, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>You own or have the necessary rights to upload and process the documents</li>
              <li>Your use of the Service does not violate any third-party rights</li>
              <li>Your documents do not contain illegal, harmful, or malicious content</li>
              <li>You grant us a limited license to process your documents solely to provide the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Prohibited Uses</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Upload documents containing malware, viruses, or harmful code</li>
              <li>Attempt to gain unauthorized access to the Service or its systems</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Share your account credentials with others</li>
              <li>Upload documents that violate third-party intellectual property rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Data Security and Storage</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement reasonable security measures to protect your data. However, no system is completely secure.
              You acknowledge that you transmit data at your own risk and that we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The Service, including its software, design, and content (excluding user-uploaded documents), is owned by
              us and protected by intellectual property laws. You may not copy, modify, or distribute our intellectual
              property without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>The Service is provided "as is" without warranties of any kind</li>
              <li>We are not liable for any damages arising from your use of the Service</li>
              <li>We are not responsible for errors in AI-generated suggestions</li>
              <li>We are not liable for any loss of data or documents</li>
              <li>Our total liability shall not exceed the amount you paid for the Service in the past 12 months</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold us harmless from any claims, losses, or damages arising from your use of
              the Service, your violation of these Terms, or your violation of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed">
              The Service uses third-party AI providers (including but not limited to Google Generative AI) to process
              your documents. Your data may be transmitted to these providers in accordance with our Privacy Policy.
              We are not responsible for the practices of third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violation of these Terms or for
              any other reason at our discretion. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">13. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may modify these Terms at any time. We will notify you of material changes by updating the "Last updated"
              date. Your continued use of the Service after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">14. Data Retention and Deletion</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your documents and data for as long as your account is active. You may delete your documents at
              any time through the Service. Upon account closure, we will delete your data within 30 days, except where
              we are required to retain it by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">15. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of your jurisdiction, without
              regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">16. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms, please contact us through the application support channels.
            </p>
          </section>

          <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
            <h2 className="text-lg font-semibold mb-2">⚠️ Important Notice</h2>
            <p className="text-sm text-gray-700">
              This Service provides AI-powered document analysis tools and does not provide legal advice. Always consult
              with a licensed attorney for legal matters. By using this Service, you acknowledge that AI suggestions are
              not a substitute for professional legal counsel.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
