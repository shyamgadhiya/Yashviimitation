import { IG, MAP_URL } from "../../lib/config.js";
import { trackLead } from "../../lib/analytics.js";
import { BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_LINK, BUSINESS_WHATSAPP_LINK } from "../../lib/site.js";

export default function MobileLeadBar() {
  return (
    <div className="mobile-lead-bar">
      <a
        href={BUSINESS_WHATSAPP_LINK}
        target="_blank"
        rel="noopener"
        onClick={() => trackLead("whatsapp", { placement: "mobile_bar" })}
      >
        WhatsApp
      </a>
      <a href={BUSINESS_PHONE_LINK} onClick={() => trackLead("call", { placement: "mobile_bar", label: BUSINESS_PHONE_DISPLAY })}>
        Call
      </a>
      <a href={MAP_URL} target="_blank" rel="noopener" onClick={() => trackLead("visit_map", { placement: "mobile_bar" })}>
        Visit Store
      </a>
      <a href={IG} target="_blank" rel="noopener" onClick={() => trackLead("instagram", { placement: "mobile_bar" })}>
        Instagram
      </a>
    </div>
  );
}
