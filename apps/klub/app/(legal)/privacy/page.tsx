export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-primary px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Polityka Prywatności
        </h1>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              1. Informacje ogólne
            </h2>
            <div className="space-y-3 leading-relaxed">
              <p>
                Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych
                przekazanych przez Użytkowników w związku z korzystaniem z Serwisu Klub Internetowy Przedsiębiorca.
              </p>
              <p>
                Administratorem danych osobowych jest Internetowy Przedsiębiorca z siedzibą w Polsce
                (dalej: "Administrator").
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              2. Jakie dane zbieramy
            </h2>
            <div className="space-y-3 leading-relaxed">
              <p>W ramach funkcjonowania Serwisu zbieramy następujące dane osobowe:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Dane konta:</strong> adres e-mail, nazwa użytkownika, hasło (w formie zaszyfrowanej)</li>
                <li><strong className="text-white">Dane profilu:</strong> imię/pseudonim, zdjęcie profilowe, opis bio, link do Instagrama (opcjonalnie)</li>
                <li><strong className="text-white">Dane aktywności:</strong> publikowane posty, komentarze, polubienia, zapisane materiały</li>
                <li><strong className="text-white">Dane techniczne:</strong> adres IP, typ przeglądarki, system operacyjny</li>
                <li><strong className="text-white">Pliki cookies:</strong> informacje o sesji, preferencje użytkownika</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              3. Cel przetwarzania danych
            </h2>
            <div className="space-y-3 leading-relaxed">
              <p>Przetwarzamy dane osobowe w następujących celach:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Świadczenie usług w ramach Serwisu (podstawa prawna: wykonanie umowy)</li>
                <li>Tworzenie i zarządzanie kontem użytkownika</li>
                <li>Umożliwienie publikowania treści i interakcji z innymi użytkownikami</li>
                <li>Zapewnienie bezpieczeństwa i integralności Serwisu</li>
                <li>Kontakt z użytkownikami w sprawach związanych z Serwisem</li>
                <li>Analiza statystyk i optymalizacja funkcjonowania Serwisu (podstawa prawna: prawnie uzasadniony interes)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              4. Udostępnianie danych
            </h2>
            <div className="space-y-3 leading-relaxed">
              <p>
                Dane osobowe mogą być udostępniane następującym kategoriom odbiorców:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Dostawcom usług hostingowych i infrastrukturalnych</li>
                <li>Dostawcom narzędzi analitycznych (jeśli są używane)</li>
                <li>Organom państwowym na podstawie obowiązujących przepisów prawa</li>
              </ul>
              <p className="mt-4">
                <strong className="text-white">Nie sprzedajemy danych osobowych</strong> użytkowników podmiotom trzecim.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              5. Okres przechowywania danych
            </h2>
            <div className="space-y-3 leading-relaxed">
              <p>
                Dane osobowe przechowywane są przez okres niezbędny do realizacji celów, dla których zostały zebrane:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Dane konta: do czasu usunięcia konta przez użytkownika lub Administratora</li>
                <li>Dane aktywności: do czasu usunięcia treści lub konta</li>
                <li>Dane techniczne i logi: przez okres wynikający z przepisów prawa (zazwyczaj do 12 miesięcy)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              6. Prawa użytkowników (RODO)
            </h2>
            <div className="space-y-3 leading-relaxed">
              <p>Każdy użytkownik ma prawo do:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Dostępu do danych</strong> – możliwość przeglądania swoich danych osobowych</li>
                <li><strong className="text-white">Sprostowania danych</strong> – możliwość poprawienia nieprawidłowych danych</li>
                <li><strong className="text-white">Usunięcia danych</strong> – prawo do żądania usunięcia danych (prawo do bycia zapomnianym)</li>
                <li><strong className="text-white">Ograniczenia przetwarzania</strong> – możliwość ograniczenia przetwarzania danych w określonych przypadkach</li>
                <li><strong className="text-white">Przenoszenia danych</strong> – otrzymanie danych w ustrukturyzowanym formacie</li>
                <li><strong className="text-white">Sprzeciwu</strong> – prawo do wyrażenia sprzeciwu wobec przetwarzania danych</li>
                <li><strong className="text-white">Wniesienia skargi</strong> – prawo do złożenia skargi do organu nadzorczego (UODO)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              7. Pliki cookies
            </h2>
            <div className="space-y-3 leading-relaxed">
              <p>
                Serwis wykorzystuje pliki cookies (ciasteczka) w celu:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Zapamiętywania sesji użytkownika (niezbędne do działania Serwisu)</li>
                <li>Zapamiętywania preferencji użytkownika</li>
                <li>Analizy ruchu w Serwisie (cookies analityczne)</li>
              </ul>
              <p className="mt-4">
                Użytkownik może w każdej chwili zmienić ustawienia cookies w swojej przeglądarce.
                Wyłączenie cookies może wpłynąć na funkcjonalność Serwisu.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              8. Bezpieczeństwo danych
            </h2>
            <div className="space-y-3 leading-relaxed">
              <p>
                Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony danych osobowych:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Szyfrowanie haseł użytkowników (bcrypt)</li>
                <li>Połączenie HTTPS (szyfrowanie transmisji danych)</li>
                <li>Regularne aktualizacje zabezpieczeń</li>
                <li>Ograniczony dostęp do danych osobowych</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              9. Zmiany w Polityce Prywatności
            </h2>
            <div className="space-y-3 leading-relaxed">
              <p>
                Administrator zastrzega sobie prawo do wprowadzania zmian w niniejszej Polityce Prywatności.
              </p>
              <p>
                O wszelkich zmianach użytkownicy zostaną poinformowani za pośrednictwem Serwisu.
              </p>
              <p>
                Kontynuowanie korzystania z Serwisu po wprowadzeniu zmian oznacza akceptację nowej Polityki Prywatności.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              10. Kontakt w sprawach danych osobowych
            </h2>
            <div className="space-y-3 leading-relaxed">
              <p>
                W sprawach dotyczących przetwarzania danych osobowych oraz realizacji praw wynikających z RODO
                prosimy o kontakt:
              </p>
              <p className="text-orange-400">
                kontakt@internetowyprzedsiebiorca.pl
              </p>
              <p className="mt-4">
                Odpowiemy na wszystkie zapytania w ciągu 30 dni od otrzymania wiadomości.
              </p>
            </div>
          </section>

          <p className="text-sm text-slate-500 mt-12 pt-6 border-t border-slate-700">
            Ostatnia aktualizacja: 16 lutego 2026
          </p>
        </div>
      </div>
    </div>
  );
}
