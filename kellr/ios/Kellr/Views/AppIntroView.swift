import SwiftUI

// MARK: - App Intro / Welcome Onboarding
// Shown on first launch (hasSeenOnboarding = false).
// Separate from OnboardingView which handles household setup.
// v2.0.1: Updated to showcase Shopping List, Kellr Pro & Push Notifications.

struct AppIntroView: View {
    @AppStorage("hasSeenOnboarding") private var hasSeenOnboarding = false
    @State private var currentPage = 0

    private let pages: [IntroPage] = [
        IntroPage(
            icon: "archivebox.fill",
            iconColor: Color.kellrPrimary,
            gradient: [Color.kellrPrimary.opacity(0.18), Color.clear],
            title: "Dein digitaler Keller",
            subtitle: "Behalte den Überblick über alles in deinem Vorrat — von der Küche bis zum Keller.",
            bullets: [
                "📦 Barcode-Scanner & manuelle Eingabe",
                "📍 Mehrere Lagerorte",
                "⚡ Echtzeit-Sync für die ganze Familie"
            ],
            isLast: false,
            onFinish: nil
        ),
        IntroPage(
            icon: "cart.fill",
            iconColor: Color.kellrPrimary,
            gradient: [Color.kellrPrimary.opacity(0.18), Color.clear],
            title: "Einkaufsliste für die ganze Familie",
            subtitle: "Gemeinsam einkaufen, direkt einlagern. Die Einkaufsliste gehört dem ganzen Haushalt.",
            bullets: [
                "🛒 Geteilt mit dem ganzen Haushalt",
                "✅ CheckOff: direkt ins Inventar einbuchen",
                "📂 Kategorien & Teilen-Funktion"
            ],
            isLast: false,
            onFinish: nil
        ),
        IntroPage(
            icon: "star.fill",
            iconColor: Color(red: 1.0, green: 0.78, blue: 0.0),
            gradient: [Color(red: 1.0, green: 0.78, blue: 0.0).opacity(0.18), Color.clear],
            title: "Kellr Pro",
            subtitle: "Unbegrenzte Einkaufsliste, direkt einlagern beim Abhaken, und mehr — für nur €\u{202F}7,99/Jahr.",
            bullets: [
                "⭐ Unbegrenzte Einkaufslisten-Einträge",
                "⚡ CheckOff: direkt einlagern",
                "🔓 €\u{202F}7,99 / Jahr — jederzeit kündbar"
            ],
            isLast: false,
            onFinish: nil
        ),
        IntroPage(
            icon: "bell.fill",
            iconColor: .orange,
            gradient: [Color.orange.opacity(0.18), Color.clear],
            title: "Push-Benachrichtigungen",
            subtitle: "Kellr warnt dich, bevor Vorräte ablaufen oder zu Neige gehen — direkt am Sperrbildschirm.",
            bullets: [
                "⏰ Ablauf-Warnungen (3, 7 & 14 Tage vorher)",
                "📉 Niedrigbestand-Alerts",
                "👆 Direkt zur Einkaufsliste hinzufügen"
            ],
            isLast: false,
            onFinish: nil
        ),
        IntroPage(
            icon: "checkmark.circle.fill",
            iconColor: Color.kellrPrimary,
            gradient: [Color.kellrPrimary.opacity(0.18), Color.clear],
            title: "Los geht's!",
            subtitle: "Dein Haushalt wartet. Richte jetzt deine Vorratskammer ein und verlier nie wieder den Überblick.",
            bullets: [],
            isLast: true,
            onFinish: nil
        )
    ]

    var body: some View {
        ZStack(alignment: .bottom) {
            TabView(selection: $currentPage) {
                ForEach(pages.indices, id: \.self) { index in
                    IntroPageView(
                        page: pages[index],
                        onFinish: index == pages.count - 1 ? { hasSeenOnboarding = true } : nil
                    )
                    .tag(index)
                }
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
            .ignoresSafeArea()

            // Custom page indicator + CTA area
            VStack(spacing: 20) {
                // Page dots
                HStack(spacing: 8) {
                    ForEach(pages.indices, id: \.self) { index in
                        Capsule()
                            .fill(currentPage == index ? Color.kellrPrimary : Color.secondary.opacity(0.35))
                            .frame(width: currentPage == index ? 24 : 8, height: 8)
                            .animation(.spring(response: 0.3, dampingFraction: 0.7), value: currentPage)
                    }
                }

                // Last page: finish button, others: skip / next
                if currentPage == pages.count - 1 {
                    Button {
                        hasSeenOnboarding = true
                    } label: {
                        Text("Los geht\u{2019}s")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(
                                RoundedRectangle(cornerRadius: 16)
                                    .fill(Color.kellrPrimary)
                            )
                            .foregroundStyle(.white)
                    }
                    .padding(.horizontal, 32)
                    .transition(.opacity.combined(with: .move(edge: .bottom)))
                } else {
                    HStack {
                        Button {
                            hasSeenOnboarding = true
                        } label: {
                            Text("Überspringen")
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                        }

                        Spacer()

                        Button {
                            withAnimation {
                                currentPage = min(currentPage + 1, pages.count - 1)
                            }
                        } label: {
                            HStack(spacing: 6) {
                                Text("Weiter")
                                    .font(.headline)
                                Image(systemName: "arrow.right")
                                    .font(.headline)
                            }
                            .foregroundStyle(.white)
                            .padding(.horizontal, 24)
                            .padding(.vertical, 12)
                            .background(
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(Color.kellrPrimary)
                            )
                        }
                    }
                    .padding(.horizontal, 32)
                }
            }
            .padding(.bottom, 48)
            .animation(.easeInOut(duration: 0.2), value: currentPage)
        }
    }
}

// MARK: - Page Data Model

struct IntroPage {
    let icon: String
    let iconColor: Color
    let gradient: [Color]
    let title: String
    let subtitle: String
    let bullets: [String]
    var isLast: Bool = false
    var onFinish: (() -> Void)? = nil
}

// MARK: - Single Intro Page

struct IntroPageView: View {
    let page: IntroPage
    var onFinish: (() -> Void)? = nil

    var body: some View {
        ZStack {
            // Subtle gradient background
            LinearGradient(
                colors: page.gradient,
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            VStack(spacing: 0) {
                Spacer()

                // Icon
                ZStack {
                    Circle()
                        .fill(page.iconColor.opacity(0.12))
                        .frame(width: 130, height: 130)

                    Circle()
                        .fill(page.iconColor.opacity(0.18))
                        .frame(width: 100, height: 100)

                    Image(systemName: page.icon)
                        .font(.system(size: 52, weight: .semibold))
                        .foregroundStyle(page.iconColor)
                }
                .padding(.bottom, 36)

                // Title & subtitle
                VStack(spacing: 14) {
                    Text(page.title)
                        .font(.system(size: 28, weight: .bold, design: .rounded))
                        .multilineTextAlignment(.center)
                        .foregroundStyle(Color.primary)

                    Text(page.subtitle)
                        .font(.body)
                        .foregroundStyle(.secondary)
                        .multilineTextAlignment(.center)
                        .lineSpacing(4)
                        .padding(.horizontal, 32)
                }

                // Bullet points
                if !page.bullets.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        ForEach(page.bullets, id: \.self) { bullet in
                            HStack(alignment: .top, spacing: 12) {
                                Text(bullet)
                                    .font(.callout)
                                    .foregroundStyle(.primary.opacity(0.85))
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 40)
                    .padding(.top, 32)
                    .padding(.bottom, 8)
                    .background(
                        RoundedRectangle(cornerRadius: 16)
                            .fill(Color(.secondarySystemGroupedBackground))
                            .padding(.horizontal, 24)
                    )
                    .padding(.top, 28)
                }

                Spacer()

                // Reserve space for bottom controls (indicator + buttons rendered in parent)
                Spacer().frame(height: 140)
            }
            .padding()
        }
    }
}

// MARK: - Preview

#Preview {
    AppIntroView()
}
