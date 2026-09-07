import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { deliverForm, DeliveryMode } from "@/lib/forms";
import type { GetStaticProps } from "next";
import type { SiteSettings } from "@/data/site";
import { getSiteSettings } from "@/lib/cms";
import { africanCountries } from "@/data/africanCountries";

type Profile = "ecosystem" | "partner" | "individual";

const fieldClass =
  "w-full bg-surface/50 border border-border rounded-2xl px-5 py-3.5 text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:border-highlight focus:ring-2 focus:ring-highlight/25 transition-colors";
const selectClass = `${fieldClass} appearance-none cursor-pointer pr-12`;
const labelClass = "block text-xs font-bold text-textPrimary mb-2 ml-1 uppercase tracking-wider";

function Field({ label, htmlFor, hint, children }: { label: string; htmlFor?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      {htmlFor ? <label htmlFor={htmlFor} className={labelClass}>{label}</label> : <span className={labelClass}>{label}</span>}
      {children}
      {hint ? <p className="mt-1.5 ml-1 text-xs text-textSecondary/70">{hint}</p> : null}
    </div>
  );
}

function SelectField(props: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; hint?: string }) {
  const { label, hint, ...rest } = props;
  return (
    <Field label={label} htmlFor={rest.id} hint={hint}>
      <div className="relative">
        <select {...rest} className={selectClass}>{rest.children}</select>
        <span aria-hidden="true" className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-textSecondary">▾</span>
      </div>
    </Field>
  );
}

const PROFILE_VALUES: Profile[] = ["ecosystem", "partner", "individual"];

export default function JoinPage({ settings }: { settings: SiteSettings }) {
  const { t, lang } = useLanguage();
  const router = useRouter();

  // A CTA elsewhere can deep-link a starting choice, e.g. /join?as=partner.
  const requestedAs = Array.isArray(router.query.as) ? router.query.as[0] : router.query.as;
  const queryProfile: Profile | "" =
    requestedAs && (PROFILE_VALUES as string[]).includes(requestedAs) ? (requestedAs as Profile) : "";
  const [profileChoice, setProfileChoice] = useState<Profile | "" | null>(null);
  const profile: Profile | "" = profileChoice ?? queryProfile;
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    country: "",
    countryOther: "",
    orgName: "",
    role: "",
    orgType: "",
    orgWebsite: "",
    scale: "",
    focus: "",
    message: "",
  });
  const [contributions, setContributions] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));

  const countryOptions = useMemo(
    () =>
      [...africanCountries].sort((a, b) =>
        lang === "FR" ? a.fr.localeCompare(b.fr, "fr") : a.en.localeCompare(b.en, "en"),
      ),
    [lang],
  );

  const profiles: { id: Profile; title: string; blurb: string }[] = [
    {
      id: "ecosystem",
      title: t("A national ecosystem", "Un écosystème national"),
      blurb: t(
        "A robotics association or community applying to join ARCP on behalf of a country.",
        "Une association ou communauté robotique qui demande à rejoindre l'ARCP au nom d'un pays.",
      ),
    },
    {
      id: "partner",
      title: t("A partner organization", "Une organisation partenaire"),
      blurb: t(
        "A company, university, public institution or NGO that wants to collaborate.",
        "Une entreprise, université, institution publique ou ONG qui souhaite collaborer.",
      ),
    },
    {
      id: "individual",
      title: t("An individual supporter", "Un particulier"),
      blurb: t(
        "A person who wants to take part in the movement and contribute.",
        "Une personne qui souhaite participer au mouvement et y contribuer.",
      ),
    },
  ];

  const contributionOptions = [
    t("Volunteering", "Bénévolat"),
    t("Mentoring", "Mentorat"),
    t("Speaking & events", "Interventions & événements"),
    t("Local ambassador", "Ambassadeur local"),
    t("Staying informed", "Rester informé"),
  ];

  const toggleContribution = (value: string) =>
    setContributions((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));

  const membershipLabel = (chosen: Profile) =>
    chosen === "ecosystem" ? "National ecosystem" : chosen === "partner" ? "Partner organization" : "Individual supporter";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile) {
      setError(t("Please choose how you would like to join.", "Veuillez choisir comment vous souhaitez nous rejoindre."));
      return;
    }
    setIsSubmitting(true);
    setError("");

    const country = form.country === "__other__" ? form.countryOther.trim() : form.country;

    const summary: string[] = [`Application type: ${membershipLabel(profile)}`];
    const interestBits: string[] = [];

    if (profile === "ecosystem") {
      summary.push(`Association / network: ${form.orgName}`);
      if (form.position) summary.push(`Applicant role: ${form.position}`);
      if (form.scale) summary.push(`Community size: ${form.scale}`);
      if (form.role) summary.push(`Current initiatives: ${form.role}`);
      if (form.orgWebsite) summary.push(`Website: ${form.orgWebsite}`);
      if (form.scale) interestBits.push(`Community: ${form.scale}`);
      if (form.position) interestBits.push(form.position);
    } else if (profile === "partner") {
      summary.push(`Organization: ${form.orgName}`);
      if (form.orgType) summary.push(`Organization type: ${form.orgType}`);
      if (form.position) summary.push(`Applicant role: ${form.position}`);
      if (form.focus) summary.push(`Partnership focus: ${form.focus}`);
      if (form.orgWebsite) summary.push(`Website: ${form.orgWebsite}`);
      if (form.orgType) interestBits.push(form.orgType);
      if (form.focus) interestBits.push(form.focus);
    } else {
      summary.push(`Affiliation: ${form.orgName}`);
      if (form.orgType) summary.push(`Profile: ${form.orgType}`);
      if (form.focus) summary.push(`Area of interest: ${form.focus}`);
      if (contributions.length) summary.push(`Willing to help with: ${contributions.join(", ")}`);
      if (form.orgType) interestBits.push(form.orgType);
      if (form.focus) interestBits.push(form.focus);
    }

    const composedMessage = [...summary, "", form.message].join("\n").slice(0, 5000);
    const interest = (interestBits.join(" · ") || membershipLabel(profile)).slice(0, 300);
    const subject = `${t("New Join Request", "Nouvelle Demande d'Adhésion")}: ${membershipLabel(profile)} — ${form.fullName}`;

    // Discrete columns for the admin, kept alongside the human-readable message.
    const focusArea = profile === "ecosystem" ? form.role : form.focus;
    const communitySize = profile === "ecosystem" ? form.scale : "";
    const contributionList = profile === "individual" ? contributions.join(", ") : "";

    try {
      const mode = await deliverForm({
        endpoint: process.env.NEXT_PUBLIC_MEMBERSHIP_FORM_ENDPOINT || "/api/forms/join",
        recipient: settings.secretariatEmail,
        subject,
        fields: {
          action: "arcp_join_request",
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          applicant_role: form.position,
          organization: form.orgName || membershipLabel(profile),
          organization_type: form.orgType,
          org_website: form.orgWebsite,
          community_size: communitySize,
          focus_area: focusArea,
          contributions: contributionList,
          country,
          membership_type: membershipLabel(profile),
          interest,
          message: composedMessage,
          consent: "1",
          website: "",
        },
      });
      setDeliveryMode(mode);
    } catch {
      setError(
        t(
          "The request could not be sent. Please contact the secretariat directly.",
          "La demande n'a pas pu être envoyée. Veuillez contacter directement le secrétariat.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: t("Submit your application", "Envoyez votre candidature"),
      text: t("Complete the form below in a few minutes.", "Remplissez le formulaire ci-dessous en quelques minutes."),
    },
    {
      title: t("Review by the secretariat", "Examen par le secrétariat"),
      text: t("We assess each request and reply within about ten working days.", "Nous étudions chaque demande et répondons sous une dizaine de jours ouvrés."),
    },
    {
      title: t("Onboarding", "Intégration"),
      text: t("Approved applicants are introduced to the network and its working groups.", "Les candidatures retenues sont présentées au réseau et à ses groupes de travail."),
    },
  ];

  const orgTypeOptions =
    profile === "partner"
      ? [
          t("Private company", "Entreprise privée"),
          t("University or research lab", "Université ou laboratoire de recherche"),
          t("Public institution or government body", "Institution publique ou organisme gouvernemental"),
          t("NGO or non-profit", "ONG ou organisation à but non lucratif"),
          t("International organization", "Organisation internationale"),
          t("Investor or foundation", "Investisseur ou fondation"),
          t("Other", "Autre"),
        ]
      : [
          t("Student", "Étudiant(e)"),
          t("Researcher or academic", "Chercheur(se) ou universitaire"),
          t("Engineer or developer", "Ingénieur(e) ou développeur(se)"),
          t("Educator or trainer", "Enseignant(e) ou formateur(rice)"),
          t("Entrepreneur or maker", "Entrepreneur(e) ou maker"),
          t("Policy or institutional professional", "Professionnel(le) des politiques publiques ou institutions"),
          t("Other", "Autre"),
        ];

  return (
    <Layout
      title={t("Join Us", "Rejoignez-nous")}
      description={t(
        "Apply to join the African robotics cooperation network as a national ecosystem, a partner organization or an individual supporter.",
        "Déposez une candidature pour rejoindre le réseau africain de coopération robotique en tant qu'écosystème national, organisation partenaire ou particulier.",
      )}
      path="/join"
      settings={settings}
    >
      <section className="py-14 sm:py-16 md:py-20 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-highlight/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cta/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-10 md:mb-14"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-black mb-4 md:mb-6">
              {t("Join the", "Rejoignez le")} <span className="text-highlight">{t("Movement.", "Mouvement.")}</span>
            </h1>
            <p className="text-base md:text-lg text-textSecondary">
              {t(
                "One application form, three ways to take part: bring your national ecosystem into ARCP, partner with us as an organization, or contribute as an individual.",
                "Un seul formulaire, trois façons de participer : faire entrer votre écosystème national dans l'ARCP, devenir organisation partenaire, ou contribuer à titre individuel.",
              )}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto mb-10 md:mb-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {steps.map((step, index) => (
              <div key={step.title} className="glass rounded-2xl border-highlight/10 p-5 text-left">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-highlight/10 text-highlight font-black text-sm mb-3">
                  {index + 1}
                </span>
                <h3 className="font-heading font-bold text-textPrimary text-sm mb-1">{step.title}</h3>
                <p className="text-textSecondary text-xs leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            {deliveryMode ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-6 sm:p-8 md:p-12 rounded-[2rem] text-center border-highlight/20 shadow-xl"
              >
                <div className="w-20 h-20 bg-cta/10 rounded-full flex items-center justify-center mx-auto mb-6 text-cta text-4xl">✓</div>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-4">
                  {deliveryMode === "endpoint"
                    ? t("Application received", "Candidature reçue")
                    : t("Email ready to send", "Email prêt à être envoyé")}
                </h2>
                <p className="text-textSecondary text-base md:text-lg mb-8">
                  {deliveryMode === "endpoint"
                    ? t(
                        "Your application was delivered to the secretariat. You will hear back within about ten working days.",
                        "Votre candidature a été transmise au secrétariat. Vous recevrez une réponse sous une dizaine de jours ouvrés.",
                      )
                    : t(
                        "Your email application has opened. Send the prepared message to complete your request.",
                        "Votre application de messagerie s'est ouverte. Envoyez le message préparé pour finaliser votre demande.",
                      )}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryMode(null);
                    setProfileChoice("");
                    setContributions([]);
                    setConsent(false);
                  }}
                  className="bg-highlight hover:bg-highlight/80 text-white px-8 py-3 rounded-full font-bold transition-all"
                >
                  {t("Submit another application", "Envoyer une autre candidature")}
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass p-5 sm:p-6 md:p-12 rounded-[1.75rem] md:rounded-[2.5rem] border-highlight/10 shadow-2xl space-y-8 md:space-y-10"
              >
                {/* Step 1 — profile */}
                <fieldset className="space-y-4">
                  <legend className="text-xs font-black uppercase tracking-[0.2em] text-highlight mb-3">
                    {t("Step 1 — I am applying as", "Étape 1 — Je candidate en tant que")}
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {profiles.map((option) => (
                      <label
                        key={option.id}
                        className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                          profile === option.id
                            ? "border-highlight bg-highlight/10 ring-2 ring-highlight/30"
                            : "border-border bg-surface/40 hover:border-highlight/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="profile"
                          value={option.id}
                          checked={profile === option.id}
                          onChange={() => {
                            setProfileChoice(option.id);
                            setError("");
                          }}
                          className="sr-only"
                        />
                        <span className="block font-heading font-bold text-textPrimary mb-1">{option.title}</span>
                        <span className="block text-xs text-textSecondary leading-relaxed">{option.blurb}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {profile && (
                  <>
                    {/* Step 2 — contact */}
                    <fieldset className="space-y-5 md:space-y-6">
                      <legend className="text-xs font-black uppercase tracking-[0.2em] text-highlight mb-3">
                        {t("Step 2 — Who you are", "Étape 2 — Qui êtes-vous")}
                      </legend>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                        <Field label={t("Full name", "Nom complet")} htmlFor="fullName">
                          <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            autoComplete="name"
                            required
                            value={form.fullName}
                            onChange={onInput}
                            placeholder={t("Enter your full name", "Entrez votre nom complet")}
                            className={fieldClass}
                          />
                        </Field>
                        <Field label={t("Email address", "Adresse email")} htmlFor="email">
                          <input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            required
                            value={form.email}
                            onChange={onInput}
                            placeholder="you@organization.org"
                            className={fieldClass}
                          />
                        </Field>
                        <Field label={t("Phone / WhatsApp", "Téléphone / WhatsApp")} htmlFor="phone" hint={t("Optional", "Facultatif")}>
                          <input
                            id="phone"
                            type="tel"
                            name="phone"
                            autoComplete="tel"
                            value={form.phone}
                            onChange={onInput}
                            placeholder="+237…"
                            className={fieldClass}
                          />
                        </Field>
                        <Field
                          label={
                            profile === "individual"
                              ? t("Your role / title", "Votre fonction / titre")
                              : t("Your role in the organization", "Votre fonction dans l'organisation")
                          }
                          htmlFor="position"
                        >
                          <input
                            id="position"
                            type="text"
                            name="position"
                            required
                            value={form.position}
                            onChange={onInput}
                            placeholder={
                              profile === "individual"
                                ? t("e.g. Robotics student", "ex. Étudiant en robotique")
                                : t("e.g. President, Director, Coordinator", "ex. Président, Directeur, Coordinateur")
                            }
                            className={fieldClass}
                          />
                        </Field>
                        <SelectField
                          id="country"
                          name="country"
                          label={t("Country", "Pays")}
                          required
                          value={form.country}
                          onChange={onInput}
                        >
                          <option value="" disabled>
                            {t("Select a country", "Sélectionnez un pays")}
                          </option>
                          {countryOptions.map((country) => (
                            <option key={country.en} value={country.en}>
                              {lang === "FR" ? country.fr : country.en}
                            </option>
                          ))}
                          <option value="__other__">{t("My country is not listed", "Mon pays n'est pas dans la liste")}</option>
                        </SelectField>
                        {form.country === "__other__" && (
                          <Field label={t("Country name", "Nom du pays")} htmlFor="countryOther">
                            <input
                              id="countryOther"
                              type="text"
                              name="countryOther"
                              required
                              value={form.countryOther}
                              onChange={onInput}
                              placeholder={t("Enter your country", "Saisissez votre pays")}
                              className={fieldClass}
                            />
                          </Field>
                        )}
                      </div>
                    </fieldset>

                    {/* Step 3 — profile-specific */}
                    <fieldset className="space-y-5 md:space-y-6">
                      <legend className="text-xs font-black uppercase tracking-[0.2em] text-highlight mb-3">
                        {profile === "ecosystem" && t("Step 3 — Your national ecosystem", "Étape 3 — Votre écosystème national")}
                        {profile === "partner" && t("Step 3 — Your organization", "Étape 3 — Votre organisation")}
                        {profile === "individual" && t("Step 3 — Your involvement", "Étape 3 — Votre implication")}
                      </legend>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                        <Field
                          label={
                            profile === "ecosystem"
                              ? t("National association or network", "Association ou réseau national")
                              : profile === "partner"
                                ? t("Organization name", "Nom de l'organisation")
                                : t("Affiliation", "Affiliation")
                          }
                          htmlFor="orgName"
                          hint={
                            profile === "individual"
                              ? t("School, company, or “Independent”", "École, entreprise, ou « Indépendant »")
                              : undefined
                          }
                        >
                          <input
                            id="orgName"
                            type="text"
                            name="orgName"
                            required
                            value={form.orgName}
                            onChange={onInput}
                            placeholder={
                              profile === "ecosystem"
                                ? t("e.g. Cameroon Robotics Association", "ex. Association Camerounaise de Robotique")
                                : profile === "partner"
                                  ? t("Company, university or institution", "Entreprise, université ou institution")
                                  : t("Your school, employer or “Independent”", "Votre école, employeur ou « Indépendant »")
                            }
                            className={fieldClass}
                          />
                        </Field>

                        {profile === "ecosystem" && (
                          <SelectField id="scale" name="scale" label={t("Community size", "Taille de la communauté")} value={form.scale} onChange={onInput}>
                            <option value="">{t("Select an estimate", "Sélectionnez une estimation")}</option>
                            <option value="1–20 people">{t("1–20 people", "1–20 personnes")}</option>
                            <option value="20–100 people">{t("20–100 people", "20–100 personnes")}</option>
                            <option value="100–500 people">{t("100–500 people", "100–500 personnes")}</option>
                            <option value="500+ people">{t("500+ people", "500+ personnes")}</option>
                          </SelectField>
                        )}

                        {(profile === "partner" || profile === "individual") && (
                          <SelectField
                            id="orgType"
                            name="orgType"
                            label={profile === "partner" ? t("Type of organization", "Type d'organisation") : t("You are", "Vous êtes")}
                            required
                            value={form.orgType}
                            onChange={onInput}
                          >
                            <option value="" disabled>
                              {t("Please choose", "Veuillez choisir")}
                            </option>
                            {orgTypeOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </SelectField>
                        )}

                        {(profile === "ecosystem" || profile === "partner") && (
                          <Field label={t("Website or main link", "Site web ou lien principal")} htmlFor="orgWebsite" hint={t("Optional", "Facultatif")}>
                            <input
                              id="orgWebsite"
                              type="url"
                              name="orgWebsite"
                              value={form.orgWebsite}
                              onChange={onInput}
                              placeholder="https://…"
                              className={fieldClass}
                            />
                          </Field>
                        )}

                        {profile === "partner" && (
                          <Field label={t("Partnership focus", "Axe de partenariat")} htmlFor="focus">
                            <input
                              id="focus"
                              type="text"
                              name="focus"
                              required
                              value={form.focus}
                              onChange={onInput}
                              placeholder={t("Funding, training, R&D, hardware, events…", "Financement, formation, R&D, matériel, événements…")}
                              className={fieldClass}
                            />
                          </Field>
                        )}

                        {profile === "individual" && (
                          <Field label={t("Area of interest", "Domaine d'intérêt")} htmlFor="focus">
                            <input
                              id="focus"
                              type="text"
                              name="focus"
                              required
                              value={form.focus}
                              onChange={onInput}
                              placeholder={t("Education, research, industry, policy…", "Éducation, recherche, industrie, politiques…")}
                              className={fieldClass}
                            />
                          </Field>
                        )}
                      </div>

                      {profile === "ecosystem" && (
                        <Field label={t("Current initiatives", "Initiatives en cours")} htmlFor="role">
                          <input
                            id="role"
                            type="text"
                            name="role"
                            value={form.role}
                            onChange={onInput}
                            placeholder={t("Competitions, training programs, hackathons…", "Compétitions, formations, hackathons…")}
                            className={fieldClass}
                          />
                        </Field>
                      )}

                      {profile === "individual" && (
                        <Field label={t("How would you like to contribute?", "Comment souhaitez-vous contribuer ?")}>
                          <div className="flex flex-wrap gap-2.5">
                            {contributionOptions.map((option) => {
                              const active = contributions.includes(option);
                              return (
                                <button
                                  type="button"
                                  key={option}
                                  onClick={() => toggleContribution(option)}
                                  aria-pressed={active}
                                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                                    active
                                      ? "border-highlight bg-highlight/15 text-textPrimary"
                                      : "border-border bg-surface/40 text-textSecondary hover:border-highlight/40"
                                  }`}
                                >
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                        </Field>
                      )}
                    </fieldset>

                    {/* Step 4 — message */}
                    <fieldset className="space-y-3">
                      <legend className="text-xs font-black uppercase tracking-[0.2em] text-highlight mb-3">
                        {t("Step 4 — Tell us more", "Étape 4 — Dites-nous en plus")}
                      </legend>
                      <Field
                        label={
                          profile === "ecosystem"
                            ? t("Why should your ecosystem join ARCP?", "Pourquoi votre écosystème devrait-il rejoindre l'ARCP ?")
                            : profile === "partner"
                              ? t("What would this partnership achieve?", "Que permettrait ce partenariat ?")
                              : t("What would you like to achieve with ARCP?", "Qu'aimeriez-vous accomplir avec l'ARCP ?")
                        }
                        htmlFor="message"
                      >
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          value={form.message}
                          onChange={onInput}
                          placeholder={t("A short paragraph is enough.", "Un court paragraphe suffit.")}
                          className={`${fieldClass} resize-none`}
                        />
                      </Field>
                    </fieldset>

                    <label className="flex items-start gap-3 text-sm text-textSecondary">
                      <input
                        type="checkbox"
                        required
                        checked={consent}
                        onChange={(event) => setConsent(event.target.checked)}
                        className="mt-1 h-4 w-4 accent-green-500"
                      />
                      <span>
                        {t(
                          "I agree to ARCP processing this information to review my application.",
                          "J'accepte que l'ARCP traite ces informations pour examiner ma candidature.",
                        )}{" "}
                        <Link href="/privacy" className="text-highlight hover:underline">
                          {t("Privacy policy", "Politique de confidentialité")}
                        </Link>
                      </span>
                    </label>

                    {error && (
                      <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-red-200">
                        {error}
                      </p>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-cta hover:bg-ctaHover text-background font-black text-lg md:text-xl py-4 md:py-6 rounded-2xl transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
                      >
                        {isSubmitting ? t("Sending…", "Envoi…") : t("Submit application", "Envoyer la candidature")}
                      </button>
                      <p className="text-center text-textSecondary text-xs mt-6 uppercase tracking-widest font-bold opacity-60">
                        {t(`Direct contact: ${settings.secretariatEmail}`, `Contact direct : ${settings.secretariatEmail}`)}
                      </p>
                    </div>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<{ settings: SiteSettings }> = async () => ({
  props: { settings: await getSiteSettings() },
  revalidate: 60,
});
