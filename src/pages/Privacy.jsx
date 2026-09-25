import { BIZ } from "../data/site.js";
import LegalPage from "./LegalPage.jsx";

export default function Privacy() {
  return (
    <LegalPage title="Privacy policy" lede="How 360 Biz Health collects, uses and protects the information you share with us.">
      <h2>What we collect</h2>
      <p>When you submit an enquiry we collect the details you enter: your name, company name, work email, phone number, city, company size, the service you are interested in, your current HRMS if you choose to tell us, and your message. We also record the page you enquired from and any campaign parameters in the link you arrived through.</p>
      <p>If you become a client, we collect the information needed to deliver the service &mdash; which, for payroll and compliance work, includes employee data supplied by you as the employer.</p>
      <h2>Why we collect it</h2>
      <p>Enquiry details are used to respond to your enquiry, understand the requirement and send you the information you asked for. Client data is used only to deliver the agreed services. We do not sell your information and we do not share it for third-party marketing.</p>
      <h2>Who we share it with</h2>
      <p>Where a service is delivered with an HRMS technology partner or an allied service partner, we share only the information that partner needs to deliver that part of the engagement, under confidentiality terms. We may also share information where we are required to by law.</p>
      <h2>How long we keep it</h2>
      <p>Enquiry records are retained for as long as needed to respond and to maintain a record of the conversation. Client records are retained for the period required by the engagement and by applicable statutory record-keeping obligations.</p>
      <h2>How we protect it</h2>
      <p>Access to enquiry and client data is limited to the people working on your account. Payroll and employee data is handled on a need-to-know basis under confidentiality agreements.</p>
      <h2>Your choices</h2>
      <p>You can ask us what information we hold about you, ask for corrections, or ask us to delete your enquiry record, by writing to {BIZ.email}. You can opt out of any communication at any time.</p>
      <h2>Cookies and analytics</h2>
      <p>We use analytics to understand how the website is used &mdash; for example, which pages lead to enquiries. Analytics and marketing tags load in line with the consent choices available to you in your region.</p>
      <h2>Contact</h2>
      <p>Questions about this policy can be sent to {BIZ.email}.</p>
    </LegalPage>
  );
}
