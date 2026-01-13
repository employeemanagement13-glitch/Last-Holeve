// components/PrivacyPolicy.tsx
'use client';

import { useState } from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

interface SubSectionProps {
  id: string;
  children: React.ReactNode;
}

const Section = ({ id, title, children, defaultOpen = true }: SectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start justify-between text-left focus:outline-none focus:ring-2 focus:ring-[#D55900] focus:ring-opacity-50 rounded-lg p-2 transition-all duration-200 hover:bg-gray-50"
      >
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <span className="ml-6 shrink-0">
          {isOpen ? (
            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </span>
      </button>
      {isOpen && (
        <div className="mt-4">
          <div className="text-gray-600 space-y-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const SubSection = ({ id, children }: SubSectionProps) => {
  return (
    <div className="mt-4" id={id}>
      <div className="text-gray-700 space-y-3">
        {children}
      </div>
    </div>
  );
};

export default function PrivacyPolicy() {
  const [openSection, setOpenSection] = useState<string | null>('1');

  const handleSectionClick = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      {/* Full width container */}
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Privacy Policy
          </h1>
          <div className="h-1 w-20 md:w-24 bg-[#D55900] mx-auto mb-4"></div>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Main Content - Full Width */}
        <div className="bg-white w-full">
          {/* Introduction */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Section id="1" title="1. Introduction" defaultOpen={true}>
              <p className="mb-4">
                Holeve (referred to below as &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) takes the privacy of your personal data very seriously. 
                This Privacy Policy sets out the basis on which we will process personal data that we collect when you use our website at 
                <a href="https://Holeve.com" className="text-[#D55900] hover:text-[#D55900]/80 ml-1">https://Holeve.com</a> (the &ldquo;Site&rdquo;), 
                or otherwise in connection with our professional practice. Please read it carefully.
              </p>
              <p className="mb-4">
                For further details about us, see the <em className="text-[#D55900] font-medium">How to contact us</em> section at the end of this Privacy Policy. 
                For the purposes of the applicable Data Protection legislation, we may be a data controller in respect of any personal data 
                that we collect from or about you, whether you are, or you are acting on behalf of, a client or potential client, 
                or a professional or business contact, or if you are a job applicant.
              </p>
            </Section>
          </div>

          {/* Personal data we collect */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Section id="2" title="2. Personal data we collect">
              <SubSection id="2.1">
                <p>
                  <strong className="text-[#D55900]">2.1</strong> If you wish to contact us about our professional practice (either through the Site or by phone, email or post), 
                  or become a client of the firm (or represent such a client), we ask you to supply essential contact details 
                  (your name, e-mail address, phone number, and country of residence, and (where applicable) the company you represent 
                  and your job title), which we need in order (if you instruct us, or the entity you represent does so) to perform the 
                  contract that we have with you (or the entity you represent) to identify you, as well as the firm&apos;s professional 
                  services which may be of interest to you.
                </p>
              </SubSection>
              
              <SubSection id="2.2">
                <p>
                  <strong className="text-[#D55900]">2.2</strong> If you wish to become a client (or the entity you represent wishes to become a client) and, if you do 
                  so (or the entity you represent does so), in the course of providing our professional services, we may collect further 
                  personal information from you.
                </p>
              </SubSection>
              
              <SubSection id="2.3">
                <p>
                  <strong className="text-[#D55900]">2.3</strong> We may also need to ask you to provide personal information, and we will carry out background checks 
                  about you with credit reference agencies and fraud prevention agencies, for credit control purposes and in order to 
                  satisfy our obligations under applicable legislation. If you do not provide the information we require, we will not be 
                  able to provide our professional services for you or the entity you represent.
                </p>
              </SubSection>
              
              <SubSection id="2.4">
                <p>
                  <strong className="text-[#D55900]">2.4</strong> Holeve obtains contact details and other personal information regarding media contacts and influencers 
                  from a variety of sources, including Cision. If you wish to know more about how such information is collected and used, 
                  please refer to Cision&apos;s privacy notice at 
                  <a href="https://www.cision.com/us/legal/privacy-policy/" className="text-[#D55900] hover:text-[#D55900]/80 ml-1">
                    www.cision.com/us/legal/privacy-policy/
                  </a>.
                </p>
              </SubSection>
            </Section>
          </div>

          {/* How we use your personal data */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Section id="3" title="3. How we use your personal data">
              <SubSection id="3.1">
                <p>
                  <strong className="text-[#D55900]">3.1</strong> When you make an enquiry, we will process the personal data that you give us, or we collect from you, 
                  so that we can supply you with the information you request, on the basis that it is necessary for our legitimate interests 
                  in promoting and marketing our professional services and, if you instruct us (or the entity you represent does so), to 
                  perform the contract that we have with you (or the entity you represent).
                </p>
              </SubSection>
              
              <SubSection id="3.2">
                <p>
                  <strong className="text-[#D55900]">3.2</strong> We will also process your personal data for internal record keeping, billing and accounting, and to respond 
                  to any queries, complaints or requests for further information, on the basis that it is necessary for our performance of the 
                  contract we have with you, or it is necessary for our legitimate interests in managing our business and improving our 
                  professional services.
                </p>
              </SubSection>
              
              <SubSection id="3.3">
                <p>
                  <strong className="text-[#D55900]">3.3</strong> We also use the personal data that you provide or that we collect for market research purposes and to improve 
                  the content or lay-out of the Site, on the basis that it is necessary for our legitimate interest in promoting and marketing 
                  our goods and services, managing the Site and providing a better service for our customers, on the basis that it is necessary 
                  for our legitimate interests in promoting and marketing our professional services.
                </p>
              </SubSection>
              
              <SubSection id="3.4">
                <p>
                  <strong className="text-[#D55900]">3.4</strong> We may use collected information to enhance the visitor experience of the Site or professional services we 
                  may offer to you in the future (the &ldquo;Service&rdquo;), to operate and maintain the Site, to investigate and understand how our Service 
                  is used, to monitor and protect the security and integrity of the Site or the Service, and to otherwise analyze our business.
                </p>
                <p className="mt-3">
                  We analyze traffic to the Site in various ways, including using a service called Google Analytics. We use this information to 
                  generate statistics and to measure activity to improve the usefulness of the Site and the Service. Google Analytics is subject 
                  to the privacy policy of Google. By visiting the Site or using the Service, you are agreeing to the terms of the Google Privacy 
                  Policy that apply to Google Analytics. These terms can be found at &ldquo;How Google uses data when you use our partners&apos; sites or apps&rdquo;, 
                  located at 
                  <a href="https://www.google.com/policies/privacy/partners/" className="text-[#D55900] hover:text-[#D55900]/80 ml-1">
                    https://www.google.com/policies/privacy/partners/
                  </a> or any other URL Google may provide from time to time. We are not responsible for any changes made to the Google Privacy 
                  Policy or of advising you of such changes. We reserve the right to change analytical service providers at any time without notice.
                </p>
              </SubSection>
              
              <SubSection id="3.5">
                <p>
                  <strong className="text-[#D55900]">3.5</strong> We may use the personal data that we collect from you to contact you by email with marketing information 
                  about services that are the same as or similar to those you have enquired about or ordered, unless you tick the relevant 
                  box situated on the form on which we collect your data. You can always opt-out of receiving marketing emails from us. 
                  All future marketing communications will also contain a simple way to opt out of receiving such further communications from us.
                </p>
              </SubSection>
              
              <SubSection id="3.6">
                <p>
                  <strong className="text-[#D55900]">3.6</strong> We may also contact you by email with marketing information about other goods and services we feel may 
                  interest you, on the basis that it is necessary for our legitimate interests in promoting and marketing our professional 
                  services, provided that you consent to receiving such emails by ticking the relevant box situated on the form on which we 
                  collect your data. You can always opt-out of receiving marketing emails from us. All future marketing communications will 
                  also contain a simple way to opt out of receiving such further communications from us.
                </p>
              </SubSection>
              
              <SubSection id="3.7">
                <p>
                  <strong className="text-[#D55900]">3.7</strong> If you provide us (or one of our employees or other personnel) with your professional or business 
                  contact details or other relevant personal data, we will use this in order to keep in touch with you and exchange information 
                  that we believe is, or may become, relevant to our and your business or profession, on the basis that it is necessary for our 
                  legitimate interests in promoting and marketing our professional services.
                </p>
              </SubSection>
              
              <SubSection id="3.8">
                <p>
                  <strong className="text-[#D55900]">3.8</strong> If you submit a job application or enquire about a potential position with a Group member, or another 
                  person does so on your behalf, we will ask you (or them) to provide relevant personal information about you. Further details 
                  of the personal data that we collect, and of the basis on which we will process your personal data, will be provided by our 
                  HR Department at the time.
                </p>
              </SubSection>
              
              <SubSection id="3.9">
                <p>
                  <strong className="text-[#D55900]">3.9</strong> Your personal data will not be used for any other purpose, or disclosed to any third party, unless we 
                  are required to do so by law, or as mentioned in the next paragraph.
                </p>
              </SubSection>
            </Section>
          </div>

          {/* Who we share your information with */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Section id="4" title="4. Who we share your information with">
              <SubSection id="4.1">
                <p>
                  <strong className="text-[#D55900]">4.1</strong> We are part of the Holeve international group of companies (for which see the Site page About Us) and 
                  may share your personal data with other members of the group on the basis that it is necessary for our legitimate interests 
                  in promoting and marketing the group and its professional services, and (if you instruct us, or the entity you represent does 
                  so) to perform the contract that we have with you (or the entity you represent). See also the paragraph below on Where we 
                  store your data.
                </p>
              </SubSection>
              
              <SubSection id="4.2">
                <p>
                  <strong className="text-[#D55900]">4.2</strong> When we provide some of the services we may do so with the assistance of third party suppliers, who will 
                  need to have access to your personal data for that purpose. Such third party suppliers will be appointed on the basis that they 
                  provide sufficient guarantees to implement appropriate technical and organizational measures so that the processing will carry 
                  out processing only on our written instructions, ensure the protection of the rights of data subjects, and otherwise meet the 
                  requirements of the applicable Data Protection legislation.
                </p>
              </SubSection>
              
              <SubSection id="4.3">
                <p>
                  <strong className="text-[#D55900]">4.3</strong> We may disclose your personal data if it is necessary for us to do so in order to comply with any legal or 
                  regulatory obligation, or where we have a legitimate interests in doing so, such as in order to enforce or apply our contract 
                  with you, to investigate potential breaches, or to protect our property and rights or those of others. This may include 
                  exchanging information with other companies and organizations for the purposes of fraud protection and credit risk reduction.
                </p>
              </SubSection>
              
              <SubSection id="4.4">
                <p>
                  <strong className="text-[#D55900]">4.4</strong> External organizations may conduct audit or quality checks for us. These external organizations are required 
                  to maintain confidentiality in relation to your files. If you do not want your file to be part of this process, please tell us 
                  as soon as possible.
                </p>
              </SubSection>
              
              <SubSection id="4.5">
                <p>
                  <strong className="text-[#D55900]">4.5</strong> If another company acquires substantially all of our business or assets, that company will possess the same 
                  information and will assume the rights and obligations with respect to that information, and any transfer of your personal data 
                  will be made on the basis that it is necessary for our legitimate interests in transferring our business or assets.
                </p>
              </SubSection>
              
              <SubSection id="4.6">
                <p>
                  <strong className="text-[#D55900]">4.6</strong> Except as set out above or in accordance with the operation of law or lawful demand, we will never sell, 
                  distribute or disclose any of your personal data (except anonymous aggregate information) with any third party without your 
                  express consent.
                </p>
              </SubSection>
            </Section>
          </div>

          {/* How long do we keep personal data for */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Section id="5" title="5. How long do we keep personal data for">
              <SubSection id="5.1">
                <p>
                  <strong className="text-[#D55900]">5.1</strong> We normally retain contract information (including personal data) for a reasonable period after the end of 
                  the relevant contract, or for longer where we it is necessary for us to do so for the establishment, exercise or defense of 
                  legal claims or for compliance with legal obligations.
                </p>
              </SubSection>
              
              <SubSection id="5.2">
                <p>
                  <strong className="text-[#D55900]">5.2</strong> Personal data relating to our professional contacts will be retained for so long as is necessary, or until 
                  you indicate otherwise to us, but we will aim to update our contacts&apos; preferences on a periodic basis.
                </p>
              </SubSection>
              
              <SubSection id="5.4">
                <p>
                  <strong className="text-[#D55900]">5.4</strong> In certain case, it may not be physically possible to delete certain data (for instance, where it is stored 
                  on a secure external server), in which case we will take appropriate steps to ensure that it is not available for re-use or 
                  disclosure to third parties.
                </p>
              </SubSection>
            </Section>
          </div>

          {/* Your rights as a data subject */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Section id="6" title="6. Your rights as a data subject">
              <p className="mb-4">
                As a data subject you have certain legal rights subject to certain exceptions under the applicable Data Protection legislation) including:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li className="text-gray-700">the right to access the personal data held about you;</li>
                <li className="text-gray-700">the right to ask us not to process your personal data for marketing purposes;</li>
                <li className="text-gray-700">the right to withdraw at any time any consent you have given to receive marketing material from us, or in any other case where we process your personal data on the basis of a consent that you have given (and not on some other legal basis);</li>
                <li className="text-gray-700">the right to ask us to rectify inaccurate personal data about you;</li>
                <li className="text-gray-700">the right to ask for the restriction of personal data concerning yourself that is inaccurate, unlawfully processed, or no longer required;</li>
                <li className="text-gray-700">the right to ask for the transfer of your personal data in a structured, commonly used and machine readable format where the processing is based on your consent;</li>
                <li className="text-gray-700">the right the right to ask for the erasure of personal data concerning yourself where processing is no longer necessary, or the legitimate interests we have in processing your personal data are overridden by your interests, rights and freedoms as the data subject;</li>
                <li className="text-gray-700">and the right to make a complaint about to the Information Commissioner&apos;s Office.</li>
              </ul>
            </Section>
          </div>

          {/* Where we store your data */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Section id="7" title="7. Where we store your data">
              <p>
                The personal data that we collect from you may be shared with other members of the Holeve international group of companies 
                (see the paragraph above on Who we share your information with) transferred to and stored at a destination outside the European 
                Economic Area (&ldquo;EEA&rdquo;), in countries whose laws provide for a lower standard of protection for personal data than in the 
                European Union. However, we will provide contractual or other safeguards are in place and provide that your personal data is 
                appropriately protected, and that enforceable rights and effective legal remedies are available for data subjects, including 
                by means of the EU Model Contract Clauses for the transfer of personal data to third countries 
                {/* (for which see 
                <a href="https://ec.europa.eu/info/law/law-topic/data-protection/data-transfers-outside-eu/model-contracts-transfer-personal-data-third-countries_en" 
                  className="text-[#D55900] hover:text-[#D55900]/80 ml-1">
                  https://ec.europa.eu/info/law/law-topic/data-protection/data-transfers-outside-eu/model-contracts-transfer-personal-data-third-countries_en
                </a>). */}
              </p>
            </Section>
          </div>

          {/* Security */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Section id="8" title="8. Security">
              <p>
                We follow generally accepted industry standards to protect the personal data submitted to us, both during transmission and once we receive it. 
                However, no method of transmission over the internet or via other devices is 100% secure. We will take reasonable steps so that your 
                Information is treated securely and in accordance with this Privacy Policy, but we cannot take responsibility for any unauthorized 
                access or loss of personal data that is beyond our control.
              </p>
            </Section>
          </div>

          {/* Cookies */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Section id="9" title="9. Cookies">
              <p className="mb-4">
                A cookie is a small file of letters and numbers that we put on your computer if you agree. These cookies allow us to distinguish you 
                from other users of our Site, which helps us to provide you with a good experience when you browse our Site and also allows us to 
                improve our site.
              </p>
              <p className="mb-4">
                The cookies we use on the Site allow us to recognize and count the number of visitors and to see how visitors move around the site 
                when they are using it. This helps us to improve the way our Site works, for example by ensuring that users are finding what they 
                are looking for easily.
              </p>
              <p>
                Standing alone, cookies do not personally identify you; they merely recognize your Web browser. Unless you choose to identify 
                yourself by opening an account, or filling out a form, you remain anonymous to us.
              </p>
            </Section>
          </div>

          {/* Links */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Section id="10" title="10. Links">
              <p>
                The Site may contain links to unaffiliated third-party websites. A link does not constitute an endorsement of the content, 
                viewpoint, accuracy, opinions, policies, products, services, or accessibility of that website, and we are not responsible for 
                their privacy practices. Once you link to another website from the Site you are subject to the terms and conditions of that website, 
                including its privacy policy, and we therefore suggest that you read the privacy policies on all third party websites. We do not 
                accept responsibility for the protection of any data supplied to other websites.
              </p>
            </Section>
          </div>

          {/* Changes to Privacy Policy & Future developments */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Section id="11" title="11. Changes to Privacy Policy & Future developments">
              <p>
                We may revise this Privacy Policy from time to time. The most current version of this Privacy Policy will govern our use of 
                information about you and will be located on this page. If we make material changes to this Privacy Policy, then where appropriate 
                we will post a notice on the Site prior to the effective date of the changes.
              </p>
            </Section>
          </div>

          {/* How to contact us */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Section id="12" title="12. How to contact us">
              <p className="mb-4">
                If you have any questions, comments or requests about the Site generally, please contact us by email to: 
                <a href="mailto:privacy@Holeve.com" className="text-[#D55900] hover:text-[#D55900]/80 ml-1">privacy@Holeve.com</a> 
                or write to us at Holeve, 410 N Michigan Ave, Chicago, IL 60611.
              </p>
            </Section>
          </div>

          {/* Quick Navigation */}
          {/* <div className="bg-gray-50 mt-8 py-8 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Navigation</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <button
                    key={num}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSectionClick(num.toString());
                      document.getElementById(num.toString())?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[#D55900] hover:text-white hover:bg-[#D55900] px-3 py-2 rounded-lg text-sm transition-all duration-200 border border-[#D55900]/30 hover:border-[#D55900]"
                  >
                    {num === 1 && 'Introduction'}
                    {num === 2 && 'Data Collection'}
                    {num === 3 && 'Data Usage'}
                    {num === 4 && 'Data Sharing'}
                    {num === 5 && 'Data Retention'}
                    {num === 6 && 'Your Rights'}
                    {num === 7 && 'Data Storage'}
                    {num === 8 && 'Security'}
                    {num === 9 && 'Cookies'}
                    {num === 10 && 'Links'}
                    {num === 11 && 'Changes'}
                    {num === 12 && 'Contact'}
                  </button>
                ))}
              </div>
            </div>
          </div> */}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-500 text-sm px-4">
          <p>© {new Date().getFullYear()} Holeve. All rights reserved.</p>
          <p className="mt-1">This Privacy Policy is effective as of {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
      </div>
    </div>
  );
}