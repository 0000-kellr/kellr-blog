// === KELLR BLOG DATA ===
// Edit this file to add new journal entries and update stats.

const JOURNAL = [
    {
        day: 3,
        date: "2026-03-02",
        title: { de: "Bugs, Limits und Lernen", en: "Bugs, Limits and Lessons" },
        body: {
            de: `<p>Tag 3 war ern&uuml;chternd &mdash; aber genau das war wertvoll.</p>
<p>Nach der Euphorie von Tag 2 kam heute die Realit&auml;t. Die KI hat gestern w&auml;hrend dem Code-Review Probleme gefunden, die sie selbst eingebaut hatte. Heute wurden sie gefixt. Das ist das Paradoxon des KI-Codings: Dieselbe Intelligenz, die den Bug baut, l&ouml;st ihn auch wieder.</p>

<h3>Was heute passiert ist</h3>
<ul>
<li><strong>Kostenoptimierung:</strong> Wir haben auf Sonnet f&uuml;r den normalen Chat umgestellt. Opus nur noch f&uuml;r Coding-Aufgaben. Tag-3-Kosten: ~100&euro;. Ziel: unter 50&euro;/Tag.</li>
<li><strong>Security-Fixes aus Review:</strong> Hardcoded API Keys wurden zu sicheren Variablen. Supabase-URL und Anon Key jetzt richtig in Config.swift und Keychain gespeichert.</li>
<li><strong>Build-Pipeline geblockt:</strong> Gestern wurde TestFlight zu oft getriggert. Apple sperrt f&uuml;r 24 Stunden. Lektion: Build-Trigger sparsamer einsetzen.</li>
<li><strong>Amazon Barcode-Suche:</strong> Versucht, EAN-Barcodes direkt in Amazon-Affiliate-Links umzuwandeln. Ergebnis: Leere Suchergebnisse. R&uuml;ckzug auf Produktnamenssuche &mdash; funktioniert zuverl&auml;ssig.</li>
<li><strong>Packungsgr&ouml;&szlig;e gesperrt:</strong> Nach dem Erstellen eines Produkts kann die Packungsgr&ouml;&szlig;e nicht mehr ge&auml;ndert werden. Logisch &mdash; sonst stimmt der Verlauf nicht mehr.</li>
<li><strong>Swipe-Aktionen:</strong> Plus und Minus per Swipe im Lagerbestand. Funktioniert &mdash; mit einem kleinen Bug den wir noch jagen.</li>
<li><strong>kellr.app live:</strong> Die Homepage ist &ouml;ffentlich. Mit Building-in-Public-Journal, Impressum und Datenschutz.</li>
<li><strong>E-Mail-Infrastruktur:</strong> Resend f&uuml;r noreply@kellr.app (Passwort-Reset, Einladungen). Office-365-Postfach f&uuml;r contact@kellr.app.</li>
<li><strong>Dokumentation:</strong> Prognose-Logik und CI/CD-Ablauf intern dokumentiert. Damit die KI beim n&auml;chsten Mal wei&szlig; was gilt.</li>
</ul>

<h3>Das pers&ouml;nliche Fazit</h3>
<p>KI-Coding ist kein Selbstl&auml;ufer. Das merkt man sp&auml;testens wenn man sieht, dass ein simpler Stock-Swipe nicht vollst&auml;ndig synchronisiert &mdash; weil die KI beim Bauen die Nebenbedingungen nicht mitgedacht hat.</p>
<p>Der Punkt ist: Man muss <strong>sehr genau wissen, was man will</strong>. Nicht nur das Feature, sondern alle Abh&auml;ngigkeiten. Wenn ich sage &quot;f&uuml;ge Stock hinzu&quot;, muss ich gleichzeitig sagen: &quot;und sync die UI, und update die DB, und zeig mir ein Feedback&quot;. Das geht nicht automatisch.</p>
<p>Klingt frustrierend? Ist es manchmal. Aber ich schreibe immer noch keinen eigenen Code. Und morgen debuggen wir weiter.</p>`,
            en: `<p>Day 3 was humbling &mdash; and that was exactly what made it valuable.</p>
<p>After the euphoria of Day 2, reality set in. The AI found issues during yesterday&apos;s code review that it had built itself. Today we fixed them. That&apos;s the paradox of AI coding: the same intelligence that introduces a bug also resolves it.</p>

<h3>What happened today</h3>
<ul>
<li><strong>Cost optimization:</strong> Switched to Sonnet for normal chat. Opus only for coding tasks now. Day 3 cost: ~&euro;100. Target: under &euro;50/day.</li>
<li><strong>Security fixes from review:</strong> Hardcoded API keys replaced with secure variables. Supabase URL and Anon Key now properly stored in Config.swift and Keychain.</li>
<li><strong>Build pipeline blocked:</strong> TestFlight was triggered too many times yesterday. Apple locks you out for 24 hours. Lesson: use build triggers sparingly.</li>
<li><strong>Amazon barcode search:</strong> Tried converting EAN barcodes directly into Amazon affiliate links. Result: empty search results. Reverted to product name search &mdash; works reliably.</li>
<li><strong>Pack size locked:</strong> After creating a product, pack size can no longer be changed. Makes sense &mdash; otherwise the transaction history doesn&apos;t add up.</li>
<li><strong>Swipe actions:</strong> Plus and minus via swipe in the inventory view. Works &mdash; with a small bug we&apos;re still chasing.</li>
<li><strong>kellr.app live:</strong> The homepage is public. With building-in-public journal, legal notice and privacy policy.</li>
<li><strong>Email infrastructure:</strong> Resend for noreply@kellr.app (password reset, invitations). Office 365 mailbox for contact@kellr.app.</li>
<li><strong>Documentation:</strong> Forecast logic and CI/CD process documented internally. So the AI knows the rules next time.</li>
</ul>

<h3>Personal takeaway</h3>
<p>AI coding is not on autopilot. You realize that when a simple stock swipe doesn&apos;t fully sync &mdash; because the AI didn&apos;t think through the side effects while building it.</p>
<p>The key insight: you need to <strong>know exactly what you want</strong>. Not just the feature, but all its dependencies. When I say &quot;add stock&quot;, I also need to say: &quot;and sync the UI, and update the DB, and show me feedback.&quot; That doesn&apos;t happen automatically.</p>
<p>Sounds frustrating? Sometimes it is. But I&apos;m still not writing my own code. And tomorrow we debug on.</p>`
        },
        stats: {
            features: 6,
            commits: 15,
            issues: 0,
            cost: "~100&euro;",
            time: "~2h",
            messages: "~40"
        },
        tags: ["Fixes", "CI/CD", "Homepage", "Learnings", "Day 3"]
    },
    {
        day: 2,
        date: "2026-03-01",
        title: { de: "Der erste Build-Tag", en: "First Build Day" },
        body: {
            de: `<p>Der Wahnsinn. Ein Tag, eine App. 24 Features in rund 6 Stunden &mdash; gesteuert komplett &uuml;ber WhatsApp-Sprachnachrichten vom Handy.</p>
<p>Was heute passiert ist:</p>
<ul>
<li>45 Commits pushed</li>
<li>20 GitHub Issues erstellt und bearbeitet</li>
<li>3 Security-Fixes (ja, die KI hat auch Sicherheitsl&uuml;cken gebaut)</li>
<li>5 fehlgeschlagene Builds (Xcode war nicht immer einverstanden)</li>
<li>~50 WhatsApp-Nachrichten an OpenClaw</li>
</ul>
<p>Meine eigene Zeit? Ungef&auml;hr 2 Stunden. Den Rest hat Claude gemacht. Ich hab gesagt was ich will, die KI hat es gebaut. Manchmal musste ich nachjustieren, manchmal lief es auf Anhieb.</p>
<p>Was nicht lief: Build-Fehler wegen fehlender Imports, ein paar Race Conditions, und einmal hat die KI ein Feature komplett missverstanden. Aber: Alles fixbar &uuml;ber eine kurze Sprachnachricht.</p>`,
            en: `<p>Insane. One day, one app. 24 features in about 6 hours &mdash; controlled entirely via WhatsApp voice messages from my phone.</p>
<p>What happened today:</p>
<ul>
<li>45 commits pushed</li>
<li>20 GitHub issues created and resolved</li>
<li>3 security fixes (yes, the AI built security holes too)</li>
<li>5 failed builds (Xcode wasn&apos;t always on board)</li>
<li>~50 WhatsApp messages to OpenClaw</li>
</ul>
<p>My own time? About 2 hours. Claude did the rest. I said what I wanted, the AI built it. Sometimes I had to adjust, sometimes it worked first try.</p>
<p>What didn&apos;t work: Build errors from missing imports, a few race conditions, and once the AI completely misunderstood a feature. But: All fixable with a quick voice message.</p>`
        },
        stats: {
            features: 24,
            commits: 45,
            issues: 20,
            cost: "~200&euro;",
            time: "~2h",
            messages: "~50"
        },
        tags: ["SwiftUI", "Supabase", "OpenClaw", "Day 1 Build"]
    },
    {
        day: 1,
        date: "2026-02-28",
        title: { de: "Die Idee", en: "The Idea" },
        body: {
            de: `<p>Es ist Wochenende. Der kleine Sohn ist krank, wir liegen auf der Couch. Und ich denke: Jeder redet &uuml;ber KI. Alle sagen &quot;KI kann programmieren&quot;. Aber kann sie es wirklich?</p>
<p>Ich komme aus der Microsoft-Welt. PowerShell, Azure, Automatisierung &mdash; das ist meine Komfortzone. Ich verstehe wie Programmierung funktioniert, aber iOS? SwiftUI? Xcode? Noch nie ber&uuml;hrt.</p>
<p>Also mache ich ein Experiment: Ich baue eine komplette iOS App, ohne selbst eine Zeile Code zu schreiben. Alles &uuml;ber Sprache. WhatsApp-Nachrichten an OpenClaw, das dann Claude Opus steuert.</p>
<p>Die App-Idee: <strong>Kellr</strong> &mdash; ein Vorratskammer-Tracker. Simpel genug um realistisch zu sein, komplex genug um KI herauszufordern.</p>
<p>Kein Tutorial. Keine Vorbereitung. Einfach loslegen und schauen was passiert. Building in Public.</p>`,
            en: `<p>It&apos;s the weekend. My little son is sick, we&apos;re lying on the couch. And I think: Everyone talks about AI. Everyone says &quot;AI can code.&quot; But can it really?</p>
<p>I come from the Microsoft world. PowerShell, Azure, automation &mdash; that&apos;s my comfort zone. I understand how programming works, but iOS? SwiftUI? Xcode? Never touched it.</p>
<p>So I&apos;m running an experiment: Building a complete iOS app without writing a single line of code myself. All through voice. WhatsApp messages to OpenClaw, which controls Claude Opus.</p>
<p>The app idea: <strong>Kellr</strong> &mdash; a pantry tracker. Simple enough to be realistic, complex enough to challenge AI.</p>
<p>No tutorial. No preparation. Just start and see what happens. Building in public.</p>`
        },
        stats: {
            features: 0,
            commits: 0,
            issues: 0,
            cost: "0&euro;",
            time: "~1h",
            messages: "Planung"
        },
        tags: ["Konzept", "Planung"]
    }
];

const STATS = {
    totalDays: 3,
    totalFeatures: 30,
    totalCommits: 60,
    totalIssues: 20,
    totalCost: "~300&euro;",
    totalTime: "~5h",
    totalMessages: "~90",
    failedBuilds: 10,
    securityFixes: 3
};
