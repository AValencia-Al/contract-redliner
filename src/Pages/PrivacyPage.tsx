import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPage: React.FC = () => {
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

        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              This Privacy Policy explains how Contract Redliner ("we", "us", or "our") collects, uses, discloses,
              and protects your personal information when you use our AI-powered contract review and editing service
              ("the Service"). We are committed to protecting your privacy and handling your data responsibly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              We collect the following types of information:
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">2.1 Account Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Name</li>
              <li>Email address</li>
              <li>Password (encrypted)</li>
              <li>Account creation date</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">2.2 Contract Documents</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Uploaded contract files (PDF, DOCX)</li>
              <li>Document content and metadata</li>
              <li>AI-generated suggestions and modifications</li>
              <li>Your review decisions (accepted/rejected suggestions)</li>
              <li>Revised document versions</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">2.3 Usage Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Log data (IP address, browser type, device information)</li>
              <li>Service usage patterns and interactions</li>
              <li>Upload and download activity</li>
              <li>Error logs and diagnostic data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              We use your information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Providing the Service:</strong> Process your contracts, generate AI suggestions, and deliver document analysis</li>
              <li><strong>Account Management:</strong> Create and maintain your account, authenticate access, and manage settings</li>
              <li><strong>AI Processing:</strong> Send document content to third-party AI providers (Google Generative AI) to generate suggestions</li>
              <li><strong>Service Improvement:</strong> Analyze usage patterns to improve features, performance, and user experience</li>
              <li><strong>Communication:</strong> Send important service updates, security alerts, and respond to support requests</li>
              <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
              <li><strong>Security:</strong> Detect, prevent, and address fraud, abuse, and security issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Third-Party AI Services</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              <strong>IMPORTANT:</strong> We use Google Generative AI to process your contract documents and generate suggestions.
              When you upload a document:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>The document content is transmitted to Google's AI services for analysis</li>
              <li>Google processes this data according to their own privacy policies and terms</li>
              <li>We cannot control how Google handles or stores this data during processing</li>
              <li>By using the Service, you consent to this third-party processing</li>
              <li>We recommend not uploading highly confidential or privileged documents</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              You can review Google's privacy practices at: https://policies.google.com/privacy
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Data Storage and Security</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              We implement reasonable security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Encryption:</strong> Passwords are hashed using bcrypt; data in transit is encrypted via HTTPS</li>
              <li><strong>Access Control:</strong> Only authenticated users can access their own data</li>
              <li><strong>Database Security:</strong> Your documents and data are stored in secure databases with access restrictions</li>
              <li><strong>File Storage:</strong> Uploaded files are stored on our servers with appropriate access controls</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              However, no system is completely secure. You transmit data at your own risk, and we cannot guarantee
              absolute security against unauthorized access, hardware failure, or other threats.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information and documents for as long as your account is active or as needed
              to provide the Service. You may delete individual contracts at any time through the Service interface.
              Upon account closure, we will delete your data within 30 days, except where we are legally required
              to retain it for longer (e.g., for tax, legal, or regulatory purposes).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Your Rights and Choices</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Access:</strong> Request a copy of your personal data we hold</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information through your account settings</li>
              <li><strong>Deletion:</strong> Delete your contracts or request account deletion</li>
              <li><strong>Data Portability:</strong> Request your data in a portable format</li>
              <li><strong>Withdrawal of Consent:</strong> Stop using the Service if you no longer consent to data processing</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications (if any)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              To exercise these rights, contact us through the application support channels.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              We use essential cookies and local storage to maintain your login session and provide basic functionality.
              Specifically, we store your authentication token locally to keep you logged in. We do not use tracking
              cookies for advertising or analytics purposes at this time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              The Service is not intended for users under the age of 18. We do not knowingly collect personal
              information from children. If you believe a child has provided us with personal information, please
              contact us immediately so we can delete it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence.
              These countries may have different data protection laws. By using the Service, you consent to the
              transfer of your information to these countries.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Service Providers:</strong> With third-party AI services (Google) to provide contract analysis</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or legal process</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Protection:</strong> To protect our rights, safety, or property, or that of others</li>
              <li><strong>With Your Consent:</strong> When you explicitly consent to sharing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. Do Not Track Signals</h2>
            <p className="text-gray-700 leading-relaxed">
              We do not currently respond to "Do Not Track" signals from web browsers, as there is no universally
              accepted standard for how to respond to such signals.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">13. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by updating
              the "Last updated" date at the top of this page. Your continued use of the Service after changes
              constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">14. GDPR Compliance (European Users)</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              If you are located in the European Economic Area (EEA), you have additional rights under the General
              Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Right to be informed about data collection and use</li>
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Rights related to automated decision-making</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Our legal basis for processing your data includes: (1) your consent, (2) performance of our contract
              with you, (3) compliance with legal obligations, and (4) our legitimate interests in providing and
              improving the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">15. California Privacy Rights (CCPA)</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Right to know what personal information is collected, used, shared, or sold</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of sale of personal information (we do not sell your information)</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">16. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices,
              please contact us through the application support channels.
            </p>
          </section>

          <section className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
            <h2 className="text-lg font-semibold mb-2">🔒 Privacy Summary</h2>
            <p className="text-sm text-gray-700 mb-2">
              <strong>What we collect:</strong> Account info, uploaded contracts, and usage data
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>How we use it:</strong> To provide AI-powered contract analysis and suggestions
            </p>
            <p className="text-sm text-gray-700">
              <strong>Third parties:</strong> Your documents are processed by Google Generative AI. We do not sell your data.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
