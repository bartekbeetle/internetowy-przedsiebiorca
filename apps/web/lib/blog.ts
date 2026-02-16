export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  content: string;
}

// For v1.0, blog posts are stored as static data.
// Can be migrated to MDX files or a CMS later.
export const blogPosts: BlogPost[] = [
  {
    slug: "jak-zarabiac-na-instagramie-bez-twarzy",
    title:
      "Jak zarabiac na Instagramie bez pokazywania twarzy - kompletny poradnik 2025",
    excerpt:
      "Dowiedz sie, jak budowac dochodowe konto na Instagramie bez koniecznosci nagrywania sie. Konkretne kroki, narzedzia i strategie.",
    category: "Faceless",
    date: "2025-01-15",
    readTime: "12 min",
    content: `## Czy naprawde mozna zarabiac bez pokazywania twarzy?

Tak. I to nie jest zadna magia. Setki kont na Instagramie generuja przychody bez pokazywania twarzy wlasciciela. Uzywaja animacji, stock footage, screencapture, voiceover i wielu innych technik.

## Krok 1: Wybierz nisze

Pierwszym krokiem jest wybor niszy. Najlepsze nisze dla faceless content to:

- **Motywacja i rozwoj osobisty** - cytaty, porady zyciowe, mindset
- **Finanse osobiste** - oszczedzanie, inwestowanie, zarabianie online
- **Technologia** - recenzje, porady, triki
- **Edukacja** - ciekawostki, fakty, nauka
- **Lifestyle** - produktywnosc, zdrowie, nawyki

## Krok 2: Stworz content plan

Nie publikuj losowo. Stwarz plan na 30 dni:
- Poniedzialek: Post edukacyjny
- Sroda: Rolka z porada
- Piatek: Historia/case study

## Krok 3: Narzedzia

Do tworzenia faceless content potrzebujesz tylko:
1. **CapCut** (darmowy) - edycja wideo
2. **Canva** (darmowy) - grafiki i szablony
3. **Pexels/Pixabay** (darmowy) - stock footage
4. **ElevenLabs** - voiceover AI (opcjonalnie)

## Krok 4: Monetyzacja

Glowne sposoby zarabiania:
- Affiliate marketing
- Sprzedaz produktow cyfrowych
- Sponsorowane tresci
- Konsultacje

Zacznij od affiliate - to najlatwiejszy sposob na pierwsze pieniadze.

## Podsumowanie

Zarabianie bez twarzy jest mozliwe. Wymaga konsekwencji, ale nie wymaga specjalnych umiejetnosci ani drogiego sprzetu. Zacznij dzis.`,
  },
  {
    slug: "10-najlepszych-nisz-faceless-content",
    title: "10 najlepszych nisz dla faceless content w Polsce",
    excerpt:
      "Nie kazda nisza nadaje sie do tworzenia tresci bez twarzy. Oto 10 najlepszych, sprawdzonych nisz na polski rynek.",
    category: "Strategia",
    date: "2025-01-20",
    readTime: "8 min",
    content: `## Dlaczego wybor niszy jest wazny?

Nisza determinuje wszystko: jakie tresci tworzysz, kto jest Twoja publicznoscia i jak mozesz zarabiac. Zla nisza = zmarnowany czas.

## Top 10 nisz

### 1. Motywacja i mindset
Najlatwiejszy start. Cytaty, porady, storytelling. Duza publicznosc w Polsce.

### 2. Finanse osobiste
Rosnie jak szalony. Ludzie szukaja porad o oszczedzaniu i inwestowaniu.

### 3. Produktywnosc
Tipy, narzedzia, nawyki produktywnych ludzi. Swietna nisza na faceless.

### 4. Technologia i AI
Najgoretszy temat. Recenzje narzedzi, triki, tutoriale.

### 5. Psychologia
Ciekawostki psychologiczne, mechanizmy zachowan. Ludzie to uwielbiaja.

### 6. Historia i ciekawostki
Krotkie, fascynujace historie. Swietne na rolki.

### 7. Zdrowie i fitness
Porady, mity vs fakty, suplementacja.

### 8. Biznes online
Jak zarabiac w internecie, side hustles, e-commerce.

### 9. Relacje i komunikacja
Porady dotyczace relacji, negocjacji, komunikacji.

### 10. Gotowanie i przepisy
Widok z gory na dlon przygotowujaca potrawe. Klasyka faceless.

## Jak wybrac swoja nisze?

1. Musisz byc zainteresowany tematem
2. Nisza musi miec publicznosc
3. Musi byc mozliwosc monetyzacji
4. Nie moze byc za waski ani za szeroki`,
  },
  {
    slug: "capcut-dla-poczatkujacych",
    title: "CapCut dla poczatkujacych - jak edytowac rolki za darmo",
    excerpt:
      "Kompletny poradnik CapCut dla osob, ktore nigdy nie edytowaly wideo. Od instalacji po pierwsza opublikowana rolke.",
    category: "Narzedzia",
    date: "2025-01-25",
    readTime: "10 min",
    content: `## Dlaczego CapCut?

CapCut jest darmowy, prosty i ma wszystko czego potrzebujesz. Nie musisz kupowac zadnego platnego oprogramowania.

## Instalacja

1. Pobierz CapCut z App Store lub Google Play
2. Mozesz tez uzyc wersji webowej na capcut.com
3. Zaloguj sie lub korzystaj bez konta

## Podstawy edycji

### Importowanie materialu
Kliknij "Nowy projekt" i dodaj swoje klipy. Mozesz uzyc:
- Nagrania z telefonu
- Stock footage z Pexels
- Zdjecia z Canva

### Ciecie klipow
Ustaw marker w miejscu ciecia i kliknij nozyczki. Proste.

### Dodawanie tekstu
Kliknij "Tekst" -> "Dodaj tekst". Wybierz font, kolor i animacje.

### Dodawanie muzyki
CapCut ma wbudowana biblioteke muzyki. Lub dodaj swoj plik audio.

### Efekty i filtry
Delikatne filtry dodaja profesjonalnego wygladu. Nie przesadzaj.

## Eksport

1. Ustaw rozdzielczosc na 1080p
2. FPS: 30
3. Eksportuj i opublikuj bezposrednio na Instagramie

## Pro tipy

- Uzywaj napisow (napisy automatyczne w CapCut sa dobre)
- Ciecia co 2-3 sekundy utrzymuja uwage
- Zacznij od silnego hooka w pierwszych 3 sekundach
- Dodaj CTA na koncu rolki`,
  },
];

export function getAllPosts(): BlogPost[] {
  return blogPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(
    (post) => post.category.toLowerCase() === category.toLowerCase()
  );
}

export function getAllCategories(): string[] {
  return Array.from(new Set(blogPosts.map((post) => post.category)));
}
