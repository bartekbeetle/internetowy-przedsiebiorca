import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Admin user
  const adminPassword = await bcrypt.hash("admin12345", 12);
  const admin = await prisma.user.upsert({
    where: { email: "bartek@internetowyprzedsiebiorca.pl" },
    update: { onboardingCompleted: true },
    create: {
      email: "bartek@internetowyprzedsiebiorca.pl",
      username: "bartek",
      name: "Bartek",
      password: adminPassword,
      role: "ADMIN",
      level: 10,
      points: 1500,
      bio: "Tworca Internetowego Przedsiebiorcy. Pomagam budowac faceless content od zera.",
      instagramHandle: "internetowy_przedsiebiorca",
      onboardingCompleted: true,
    },
  });
  console.log("Admin created:", admin.username);

  // Test members
  const memberPassword = await bcrypt.hash("member12345", 12);
  const member1 = await prisma.user.upsert({
    where: { email: "michal@test.pl" },
    update: { onboardingCompleted: true },
    create: {
      email: "michal@test.pl",
      username: "michal_k",
      name: "Michal Kowalski",
      password: memberPassword,
      role: "MEMBER",
      level: 3,
      points: 156,
      bio: "Tworca faceless content w niszy produktywnosc.",
      instagramHandle: "michal_faceless",
      onboardingCompleted: true,
    },
  });

  const member2 = await prisma.user.upsert({
    where: { email: "kuba@test.pl" },
    update: { onboardingCompleted: true },
    create: {
      email: "kuba@test.pl",
      username: "kuba_dev",
      name: "Kuba Nowak",
      password: memberPassword,
      role: "MEMBER",
      level: 2,
      points: 67,
      bio: "Poczatkujacy tworca faceless content.",
      onboardingCompleted: true,
    },
  });
  console.log("Test members created");

  // 2. Hierarchical Categories: MainCategory -> SubCategory
  const mainCat1 = await prisma.mainCategory.create({
    data: {
      name: "Tworzenie Tresci",
      slug: "tworzenie-tresci",
      icon: "🎬",
      color: "#F97316",
      order: 1,
    },
  });
  const mainCat2 = await prisma.mainCategory.create({
    data: {
      name: "Rozwoj i Strategia",
      slug: "rozwoj-i-strategia",
      icon: "📈",
      color: "#8B5CF6",
      order: 2,
    },
  });
  const mainCat3 = await prisma.mainCategory.create({
    data: {
      name: "Spolecznosc",
      slug: "spolecznosc",
      icon: "💬",
      color: "#22C55E",
      order: 3,
    },
  });

  // SubCategories
  const subEdycja = await prisma.subCategory.create({
    data: { name: "Edycja Wideo", slug: "edycja-wideo", mainCategoryId: mainCat1.id, order: 1 },
  });
  const subSkrypty = await prisma.subCategory.create({
    data: { name: "Skrypty i Hooki", slug: "skrypty-i-hooki", mainCategoryId: mainCat1.id, order: 2 },
  });
  const subNarzedzia = await prisma.subCategory.create({
    data: { name: "Narzedzia", slug: "narzedzia", mainCategoryId: mainCat1.id, order: 3 },
  });
  const subWzrost = await prisma.subCategory.create({
    data: { name: "Strategie Wzrostu", slug: "strategie-wzrostu", mainCategoryId: mainCat2.id, order: 1 },
  });
  const subMonetyzacja = await prisma.subCategory.create({
    data: { name: "Monetyzacja", slug: "monetyzacja", mainCategoryId: mainCat2.id, order: 2 },
  });
  const subAnalityka = await prisma.subCategory.create({
    data: { name: "Analityka", slug: "analityka", mainCategoryId: mainCat2.id, order: 3 },
  });
  const subLuzne = await prisma.subCategory.create({
    data: { name: "Luzne Rozmowy", slug: "luzne-rozmowy", mainCategoryId: mainCat3.id, order: 1 },
  });
  const subWiny = await prisma.subCategory.create({
    data: { name: "Winy i Sukcesy", slug: "winy-i-sukcesy", mainCategoryId: mainCat3.id, order: 2 },
  });
  const subPytania = await prisma.subCategory.create({
    data: { name: "Pytania i Pomoc", slug: "pytania-i-pomoc", mainCategoryId: mainCat3.id, order: 3 },
  });
  console.log("3 main categories + 9 subcategories created");

  // 3. Tags
  const tagData = [
    { name: "capcut", slug: "capcut" },
    { name: "canva", slug: "canva" },
    { name: "hook", slug: "hook" },
    { name: "skrypt", slug: "skrypt" },
    { name: "reels", slug: "reels" },
    { name: "tiktok", slug: "tiktok" },
    { name: "monetyzacja", slug: "monetyzacja" },
    { name: "produktywnosc", slug: "produktywnosc" },
    { name: "narzedzia", slug: "narzedzia" },
    { name: "wzrost", slug: "wzrost" },
    { name: "faceless", slug: "faceless" },
    { name: "storytelling", slug: "storytelling" },
    { name: "edycja", slug: "edycja" },
    { name: "tutorial", slug: "tutorial" },
    { name: "strategia", slug: "strategia" },
  ];
  const tags: Record<string, { id: string }> = {};
  for (const t of tagData) {
    const tag = await prisma.tag.create({ data: t });
    tags[t.name] = tag;
  }
  console.log("15 tags created");

  // 4. Sample posts with slugs and tags
  const post1 = await prisma.post.create({
    data: {
      title: "Witajcie w spolecznosci! Zasady i porady na start",
      slug: "witajcie-w-spolecznosci-zasady-i-porady-na-start-abc123",
      content: "Witam w spolecznosci Internetowego Przedsiebiorcy!\n\nKilka zasad na start:\n1. Badz konkretny\n2. Pomagaj innym\n3. Dziel sie wynikami",
      type: "RESOURCE",
      authorId: admin.id,
      subCategoryId: subLuzne.id,
      likesCount: 42,
      commentsCount: 5,
      viewsCount: 230,
      isPinned: true,
    },
  });
  await prisma.postTag.createMany({
    data: [
      { postId: post1.id, tagId: tags["faceless"].id },
      { postId: post1.id, tagId: tags["produktywnosc"].id },
    ],
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Jak zrobilem 10k wyswietlen na pierwszej rolce",
      slug: "jak-zrobilem-10k-wyswietlen-na-pierwszej-rolce-d4e5f6",
      content: "Po 2 tygodniach stosowania strategii z kursu udalo mi sie zdobyc 10,000 wyswietlen.\n\nWynik: 10,247 wyswietlen, 342 lajki, +127 followersow",
      type: "WIN",
      authorId: member1.id,
      subCategoryId: subWiny.id,
      likesCount: 15,
      commentsCount: 3,
      viewsCount: 87,
    },
  });
  await prisma.postTag.createMany({
    data: [
      { postId: post2.id, tagId: tags["reels"].id },
      { postId: post2.id, tagId: tags["wzrost"].id },
      { postId: post2.id, tagId: tags["hook"].id },
    ],
  });

  const post3 = await prisma.post.create({
    data: {
      title: "Najlepsze darmowe narzedzia do faceless content?",
      slug: "najlepsze-darmowe-narzedzia-do-faceless-content-g7h8i9",
      content: "Szukam alternatyw do platnych narzedzi. Aktualnie uzywam CapCut i Canva. Co polecacie?",
      type: "QUESTION",
      authorId: member2.id,
      subCategoryId: subNarzedzia.id,
      likesCount: 8,
      commentsCount: 2,
      viewsCount: 54,
    },
  });
  await prisma.postTag.createMany({
    data: [
      { postId: post3.id, tagId: tags["capcut"].id },
      { postId: post3.id, tagId: tags["canva"].id },
      { postId: post3.id, tagId: tags["narzedzia"].id },
    ],
  });

  // Post with high likes for milestone testing
  const post4 = await prisma.post.create({
    data: {
      title: "Moj plan na faceless content - miesiac 1 wyniki",
      slug: "moj-plan-na-faceless-content-miesiac-1-wyniki-j1k2l3",
      content: "Podsumowanie pierwszego miesiaca tworzenia faceless contentu:\n- 28 rolek opublikowanych\n- 45k wyswietlen lacznie\n- 1200 nowych followersow\n- Pierwsze zarobki z programu bonusowego!",
      type: "WIN",
      authorId: member1.id,
      subCategoryId: subWzrost.id,
      likesCount: 55,
      commentsCount: 12,
      viewsCount: 340,
    },
  });
  await prisma.postTag.createMany({
    data: [
      { postId: post4.id, tagId: tags["strategia"].id },
      { postId: post4.id, tagId: tags["wzrost"].id },
      { postId: post4.id, tagId: tags["faceless"].id },
    ],
  });

  // Some comments
  await prisma.comment.create({
    data: {
      content: "Super! Gratulacje wyniku!",
      authorId: admin.id,
      postId: post2.id,
    },
  });
  await prisma.comment.create({
    data: {
      content: "Polecam tez InShot - swietne do szybkiej edycji na telefonie.",
      authorId: member1.id,
      postId: post3.id,
    },
  });

  console.log("4 sample posts with tags + 2 comments created");

  // Update tag usage counts
  await prisma.tag.update({ where: { name: "faceless" }, data: { usageCount: 2 } });
  await prisma.tag.update({ where: { name: "wzrost" }, data: { usageCount: 2 } });
  await prisma.tag.update({ where: { name: "produktywnosc" }, data: { usageCount: 1 } });
  await prisma.tag.update({ where: { name: "reels" }, data: { usageCount: 1 } });
  await prisma.tag.update({ where: { name: "hook" }, data: { usageCount: 1 } });
  await prisma.tag.update({ where: { name: "capcut" }, data: { usageCount: 1 } });
  await prisma.tag.update({ where: { name: "canva" }, data: { usageCount: 1 } });
  await prisma.tag.update({ where: { name: "narzedzia" }, data: { usageCount: 1 } });
  await prisma.tag.update({ where: { name: "strategia" }, data: { usageCount: 1 } });

  // 5. Course 1: Faceless od zera (BEGINNER)
  const course1 = await prisma.course.upsert({
    where: { slug: "faceless-od-zera" },
    update: {},
    create: {
      title: "Faceless Content od Zera",
      slug: "faceless-od-zera",
      description: "Kompletny kurs dla osob rozpoczynajacych przygode z faceless content. Od pomyslu po pierwsza publikacje.",
      difficulty: "BEGINNER",
      isPublished: true,
      isPremium: false,
      order: 1,
    },
  });

  // Module 1: Podstawy
  const mod1 = await prisma.module.create({
    data: {
      title: "Podstawy Faceless Content",
      description: "Czym jest faceless content i dlaczego to dziala",
      courseId: course1.id,
      order: 1,
      duration: 25,
    },
  });
  const lesson1_1 = await prisma.lesson.create({
    data: {
      title: "Czym jest faceless content?",
      slug: "czym-jest-faceless-content",
      content: "## Czym jest faceless content?\n\nFaceless content to tresci tworzone bez pokazywania twarzy autora. Ten format zyskal ogromna popularnosc na platformach takich jak TikTok, Instagram Reels i YouTube Shorts.\n\n### Dlaczego to dziala?\n\n- **Anonimnosc** - nie musisz byc osoba publiczna\n- **Skalowalnosc** - mozesz prowadzic wiele kont jednoczesnie\n- **Niski prog wejscia** - potrzebujesz tylko telefonu i kreatywnosci\n\n### Popularne nisze faceless:\n\n1. Motywacja i produktywnosc\n2. Finanse osobiste\n3. Ciekawostki i fakty\n4. Gotowanie i przepisy\n5. Technologia i lifehacki",
      type: "VIDEO",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 8,
      order: 1,
      moduleId: mod1.id,
    },
  });
  const lesson1_2 = await prisma.lesson.create({
    data: {
      title: "Wybor niszy krok po kroku",
      slug: "wybor-niszy-krok-po-kroku",
      content: "## Wybor niszy\n\nWybor niszy to kluczowa decyzja, ktora wplynie na caly Twoj biznes.\n\n### Kryteria dobrej niszy:\n\n1. **Zainteresowanie** - musisz moc tworzyc content regularnie\n2. **Popyt** - sprawdz czy ludzie szukaja tresci w tej niszy\n3. **Monetyzacja** - czy sa produkty/uslugi do promowania?\n\n### Jak badac nisze?\n\n- Przegladaj TikTok i Instagram w poszukiwaniu trendow\n- Uzyj Google Trends do analizy zainteresowania\n- Sprawdz konkurencje - czy sa konta faceless w tej niszy?",
      type: "TEXT",
      duration: 10,
      order: 2,
      moduleId: mod1.id,
    },
  });
  const lesson1_3 = await prisma.lesson.create({
    data: {
      title: "Zakladanie konta i pierwsze ustawienia",
      slug: "zakladanie-konta-i-pierwsze-ustawienia",
      content: "## Zakladanie konta\n\n### Krok 1: Wybierz platforme\n- Instagram Reels - najlepsza monetyzacja\n- TikTok - najszybszy wzrost\n- YouTube Shorts - najlepsze long-term\n\n### Krok 2: Nazwa konta\n- Krotka i zapamietywalna\n- Zwiazana z nisza\n- Dostepna na wszystkich platformach\n\n### Krok 3: Bio i avatar\n- Jasny przekaz czym sie zajmujesz\n- CTA (wezwanie do dzialania)\n- Link do linktree/strony",
      type: "VIDEO",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 7,
      order: 3,
      moduleId: mod1.id,
    },
  });

  // Module 2: Tworzenie contentu
  const mod2 = await prisma.module.create({
    data: {
      title: "Tworzenie Contentu",
      description: "Skrypty, hooki, nagrywanie i edycja",
      courseId: course1.id,
      order: 2,
      duration: 40,
    },
  });
  const lesson2_1 = await prisma.lesson.create({
    data: {
      title: "Anatomia viralowej rolki",
      slug: "anatomia-viralowej-rolki",
      content: "## Anatomia viralowej rolki\n\n### 3-sekundowa regula\nPierwsze 3 sekundy decyduja o tym, czy widz zostanie. Twoj hook musi byc mocny.\n\n### Struktura:\n1. **Hook** (0-3s) - zatrzymaj scrollowanie\n2. **Wartosc** (3-15s) - dostarcz obiecana tresc\n3. **CTA** (15-20s) - powiedz co dalej\n\n### Typy hookow:\n- Pytanie: \"Czy wiesz ze...?\"\n- Szok: \"To zmieni Twoje zycie\"\n- Lista: \"3 rzeczy ktore musisz wiedziec\"",
      type: "VIDEO",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 12,
      order: 1,
      moduleId: mod2.id,
    },
  });
  const lesson2_2 = await prisma.lesson.create({
    data: {
      title: "Pisanie skutecznych hookow",
      slug: "pisanie-skutecznych-hookow",
      content: "## Pisanie hookow\n\n### Formuly hookow:\n\n1. **Pytanie + ciekawosc**: \"Dlaczego 90% ludzi nigdy nie zarobi na social media?\"\n2. **Kontrowersja**: \"Budzik o 5 rano to najgorszy nawyk\"\n3. **Obietnica**: \"Ten trik podwoil moje zasiegi w 7 dni\"\n4. **Lista**: \"5 darmowych narzedzi ktore zastapilymi Photoshopa\"\n\n### Zasady:\n- Max 10 slow\n- Konkretne liczby dzialaja lepiej\n- Testuj rozne warianty tego samego hooka",
      type: "TEXT",
      duration: 8,
      order: 2,
      moduleId: mod2.id,
    },
  });
  const lesson2_3 = await prisma.lesson.create({
    data: {
      title: "Edycja w CapCut - podstawy",
      slug: "edycja-w-capcut-podstawy",
      content: "## Edycja w CapCut\n\n### Interfejs CapCut\n- Timeline na dole\n- Preview na gorze\n- Narzedzia po bokach\n\n### Podstawowe operacje:\n1. Import materialow\n2. Ciecie i laczenie klipow\n3. Dodawanie tekstu\n4. Muzyka i efekty dzwiekowe\n5. Eksport w odpowiedniej jakosci\n\n### Pro tipy:\n- Uzywaj keyframe dla dynamicznych animacji\n- Dodawaj napisy - 80% ogladajacych nie wlacza dzwieku\n- Tempo edycji: zmiana kadru co 2-3 sekundy",
      type: "VIDEO",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 20,
      order: 3,
      moduleId: mod2.id,
    },
  });

  // Module 3: Strategia i wzrost
  const mod3 = await prisma.module.create({
    data: {
      title: "Strategia i Wzrost",
      description: "Jak rosnac i monetyzowac konto",
      courseId: course1.id,
      order: 3,
      duration: 30,
    },
  });
  const lesson3_1 = await prisma.lesson.create({
    data: {
      title: "Algorytm Instagrama i TikToka",
      slug: "algorytm-instagrama-i-tiktoka",
      content: "## Jak dzialaja algorytmy?\n\n### Instagram Reels\n- Watch time to krol - im dluzej ogladaja, tym lepiej\n- Udostepnienia > komentarze > lajki\n- Pierwsze 30 minut po publikacji jest kluczowe\n\n### TikTok\n- FYP testuje Twoje video na malej grupie (~300 osob)\n- Jesli metryki sa dobre, rozprzestrzenia dalej\n- Completion rate to najwazniejsza metryka\n\n### Najlepsze godziny publikacji:\n- Instagram: 12:00, 18:00, 21:00\n- TikTok: 7:00, 12:00, 19:00",
      type: "VIDEO",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 15,
      order: 1,
      moduleId: mod3.id,
    },
  });
  const lesson3_2 = await prisma.lesson.create({
    data: {
      title: "Plan contentowy na 30 dni",
      slug: "plan-contentowy-na-30-dni",
      content: "## Plan contentowy\n\n### Zasada 4-1-1:\n- 4 posty edukacyjne/wartosciowe\n- 1 post rozrywkowy\n- 1 post sprzedazowy\n\n### Harmonogram tygodniowy:\n- Pon: Edukacja\n- Wt: Tip dnia\n- Sr: Behind the scenes\n- Czw: Q&A / interakcja\n- Pt: Rozrywka\n- Sob: Podsumowanie tygodnia\n- Ndz: Motywacja\n\n### Batch content creation:\nNagraj 7 rolek w 1 dzien, edytuj w kolejny, zaplanuj publikacje na caly tydzien.",
      type: "TEXT",
      duration: 10,
      order: 2,
      moduleId: mod3.id,
    },
  });
  const lesson3_3 = await prisma.lesson.create({
    data: {
      title: "Monetyzacja konta faceless",
      slug: "monetyzacja-konta-faceless",
      content: "## Monetyzacja\n\n### Sposoby zarabiania:\n\n1. **Program bonusowy Instagrama** - od 1000 followersow\n2. **Affiliate marketing** - polecaj produkty i zarabiaj prowizje\n3. **Wlasne produkty cyfrowe** - ebooki, kursy, szablony\n4. **Wspolprace z markami** - sponsorowane tresci\n5. **Sprzedaz kont** - buduj i sprzedawaj konta\n\n### Ile mozna zarobic?\n- 1k-5k followersow: 500-2000 PLN/mc\n- 5k-20k followersow: 2000-8000 PLN/mc\n- 20k+ followersow: 8000+ PLN/mc",
      type: "VIDEO",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 12,
      order: 3,
      moduleId: mod3.id,
    },
  });

  // LessonMaterials
  await prisma.lessonMaterial.create({
    data: {
      title: "Checklista startu konta",
      fileUrl: "/materials/checklista-start.pdf",
      fileType: "PDF",
      lessonId: lesson1_3.id,
    },
  });
  await prisma.lessonMaterial.create({
    data: {
      title: "Szablony hookow (50 przykladow)",
      fileUrl: "/materials/szablony-hookow.pdf",
      fileType: "PDF",
      lessonId: lesson2_2.id,
    },
  });
  await prisma.lessonMaterial.create({
    data: {
      title: "Plan contentowy - szablon Excel",
      fileUrl: "/materials/plan-contentowy.xlsx",
      fileType: "SPREADSHEET",
      lessonId: lesson3_2.id,
    },
  });

  console.log("Course 1 with 3 modules, 9 lessons, 3 materials created");

  // Course 2: Zaawansowane strategie (ADVANCED, premium)
  const course2 = await prisma.course.upsert({
    where: { slug: "zaawansowane-strategie-wzrostu" },
    update: {},
    create: {
      title: "Zaawansowane Strategie Wzrostu",
      slug: "zaawansowane-strategie-wzrostu",
      description: "Dla tworcow gotowych na nastepny poziom. Multi-platformowosc, automatyzacja i skalowanie.",
      difficulty: "ADVANCED",
      isPublished: true,
      isPremium: true,
      order: 2,
    },
  });

  const mod4 = await prisma.module.create({
    data: {
      title: "Multi-platformowosc",
      description: "Jak repurposowac content na wiele platform",
      courseId: course2.id,
      order: 1,
      duration: 25,
    },
  });
  await prisma.lesson.create({
    data: {
      title: "Strategia cross-posting",
      slug: "strategia-cross-posting",
      content: "## Cross-posting\n\nJeden content, wiele platform. Jak repurposowac efektywnie.",
      type: "VIDEO",
      duration: 12,
      order: 1,
      moduleId: mod4.id,
    },
  });
  await prisma.lesson.create({
    data: {
      title: "Dostosowanie formatu do platformy",
      slug: "dostosowanie-formatu-do-platformy",
      content: "## Formaty per platforma\n\nKazda platforma ma swoje wymagania. Naucz sie je spelniac.",
      type: "TEXT",
      duration: 8,
      order: 2,
      moduleId: mod4.id,
    },
  });

  const mod5 = await prisma.module.create({
    data: {
      title: "Automatyzacja i Skalowanie",
      description: "Narzedzia i procesy do skalowania",
      courseId: course2.id,
      order: 2,
      duration: 30,
    },
  });
  await prisma.lesson.create({
    data: {
      title: "Automatyzacja publikacji",
      slug: "automatyzacja-publikacji",
      content: "## Automatyzacja\n\nUzyj narzedzi do planowania i automatycznej publikacji.",
      type: "VIDEO",
      duration: 15,
      order: 1,
      moduleId: mod5.id,
    },
  });
  await prisma.lesson.create({
    data: {
      title: "Budowanie zespolu",
      slug: "budowanie-zespolu",
      content: "## Zespol\n\nKiedy i jak delegowac prace nad contentem.",
      type: "TEXT",
      duration: 10,
      order: 2,
      moduleId: mod5.id,
    },
  });

  console.log("Course 2 with 2 modules, 4 lessons created");

  // Enrollment + progress for member1 on course1
  await prisma.courseEnrollment.create({
    data: {
      userId: member1.id,
      courseId: course1.id,
    },
  });

  // Mark first 5 lessons as completed (~55% progress)
  const completedLessons = [lesson1_1, lesson1_2, lesson1_3, lesson2_1, lesson2_2];
  for (const lesson of completedLessons) {
    await prisma.lessonProgress.create({
      data: {
        userId: member1.id,
        lessonId: lesson.id,
        completed: true,
        completedAt: new Date(),
      },
    });
  }

  // Sample note
  await prisma.lessonNote.create({
    data: {
      userId: member1.id,
      lessonId: lesson2_1.id,
      content: "Pamietaj: hook musi byc w pierwszych 3 sekundach. Testowac rozne warianty!",
    },
  });

  console.log("Enrollment + 5 lesson progress + 1 note created for member1");

  // 6. Reel inspirations
  const reelsData = [
    { title: "Hook: Jeden nawyk zmienil moja produktywnosc o 300%", description: "Klasyczny hook z obietnica transformacji", thumbnailUrl: "/placeholder.jpg", category: "HOOK", niche: "Produktywnosc", script: "Hook -> Problem -> Rozwiazanie -> CTA", tags: "hook,produktywnosc" },
    { title: "3 aplikacje ktore zarobilyci tysiace", description: "Format listy - top performing w niszy finanse", thumbnailUrl: "/placeholder.jpg", category: "EDUCATIONAL", niche: "Finanse", script: "Hook: 3 aplikacje ktore zarobilyci tysiace", tags: "finanse,lista" },
    { title: "Dlaczego budzik o 5 rano NIE dziala", description: "Kontrowersyjny hook", thumbnailUrl: "/placeholder.jpg", category: "CONTROVERSIAL", niche: "Produktywnosc", script: "Hook kontrowersyjny + twist", tags: "kontrowersja,poranek" },
    { title: "Od 0 do 10k w 30 dni", description: "Format storytelling z transformacja", thumbnailUrl: "/placeholder.jpg", category: "STORYTELLING", niche: "Social media", script: "Storytelling: historia transformacji", tags: "storytelling,wzrost" },
    { title: "Tutorial: Edycja w CapCut w 5 minut", description: "Szybki tutorial screen-recording", thumbnailUrl: "/placeholder.jpg", category: "EDUCATIONAL", niche: "Edycja", script: "Tutorial krok po kroku", tags: "tutorial,capcut" },
  ];

  for (const reel of reelsData) {
    await prisma.reelInspiration.create({ data: reel });
  }
  console.log("5 reel inspirations created");

  // 7. Site settings
  await prisma.siteSettings.create({
    data: {
      id: "default",
      siteName: "Klub Internetowy Przedsiebiorca",
      siteDescription: "Spolecznosc tworcow faceless content.",
      registrationOpen: true,
      maxUsersForFree: 100,
      monthlyPrice: 28,
    },
  });
  console.log("Site settings created");

  // ==========================================
  // 8. GAMIFICATION: Badges
  // ==========================================

  const badgeDefinitions = [
    // COMMUNITY (7)
    { name: "first_comment", description: "Napisz swoj pierwszy komentarz", iconUrl: "💬", category: "COMMUNITY", requirement: JSON.stringify({ type: "comment_count", threshold: 1 }), points: 5, order: 1 },
    { name: "commentator", description: "Napisz 10 komentarzy", iconUrl: "🗣️", category: "COMMUNITY", requirement: JSON.stringify({ type: "comment_count", threshold: 10 }), points: 10, order: 2 },
    { name: "discussion_master", description: "Napisz 50 komentarzy", iconUrl: "🎤", category: "COMMUNITY", requirement: JSON.stringify({ type: "comment_count", threshold: 50 }), points: 25, order: 3 },
    { name: "helpful", description: "Polub 10 postow innych", iconUrl: "👍", category: "COMMUNITY", requirement: JSON.stringify({ type: "like_given", threshold: 10 }), points: 5, order: 4 },
    { name: "supporter", description: "Polub 50 postow innych", iconUrl: "🤝", category: "COMMUNITY", requirement: JSON.stringify({ type: "like_given", threshold: 50 }), points: 15, order: 5 },
    { name: "streak_3", description: "Utrzymaj streak 3 dni", iconUrl: "🔥", category: "COMMUNITY", requirement: JSON.stringify({ type: "streak_days", threshold: 3 }), points: 10, order: 6 },
    { name: "streak_7", description: "Utrzymaj streak 7 dni", iconUrl: "⚡", category: "COMMUNITY", requirement: JSON.stringify({ type: "streak_days", threshold: 7 }), points: 25, order: 7 },
    // CONTENT (7)
    { name: "first_post", description: "Opublikuj swoj pierwszy post", iconUrl: "✏️", category: "CONTENT", requirement: JSON.stringify({ type: "post_count", threshold: 1 }), points: 5, order: 1 },
    { name: "author", description: "Opublikuj 5 postow", iconUrl: "📝", category: "CONTENT", requirement: JSON.stringify({ type: "post_count", threshold: 5 }), points: 15, order: 2 },
    { name: "prolific_writer", description: "Opublikuj 20 postow", iconUrl: "📚", category: "CONTENT", requirement: JSON.stringify({ type: "post_count", threshold: 20 }), points: 30, order: 3 },
    { name: "popular_post", description: "Otrzymaj 10 polubien na jednym poscie", iconUrl: "❤️", category: "CONTENT", requirement: JSON.stringify({ type: "post_likes", threshold: 10 }), points: 15, order: 4 },
    { name: "viral_post", description: "Otrzymaj 50 polubien na jednym poscie", iconUrl: "🚀", category: "CONTENT", requirement: JSON.stringify({ type: "post_likes", threshold: 50 }), points: 50, order: 5 },
    { name: "liked_10", description: "Otrzymaj lacznie 10 polubien", iconUrl: "💖", category: "CONTENT", requirement: JSON.stringify({ type: "total_likes_received", threshold: 10 }), points: 10, order: 6 },
    { name: "liked_100", description: "Otrzymaj lacznie 100 polubien", iconUrl: "🌟", category: "CONTENT", requirement: JSON.stringify({ type: "total_likes_received", threshold: 100 }), points: 50, order: 7 },
    // LEARNING (7)
    { name: "student", description: "Zapisz sie na pierwszy kurs", iconUrl: "🎒", category: "LEARNING", requirement: JSON.stringify({ type: "course_enrolled", threshold: 1 }), points: 5, order: 1 },
    { name: "first_lesson", description: "Ukoncz pierwsza lekcje", iconUrl: "📖", category: "LEARNING", requirement: JSON.stringify({ type: "lesson_completed", threshold: 1 }), points: 5, order: 2 },
    { name: "diligent", description: "Ukoncz 10 lekcji", iconUrl: "📗", category: "LEARNING", requirement: JSON.stringify({ type: "lesson_completed", threshold: 10 }), points: 20, order: 3 },
    { name: "scholar", description: "Ukoncz 25 lekcji", iconUrl: "🎓", category: "LEARNING", requirement: JSON.stringify({ type: "lesson_completed", threshold: 25 }), points: 40, order: 4 },
    { name: "graduate", description: "Ukoncz pierwszy kurs", iconUrl: "🏅", category: "LEARNING", requirement: JSON.stringify({ type: "course_completed", threshold: 1 }), points: 25, order: 5 },
    { name: "multi_graduate", description: "Ukoncz 3 kursy", iconUrl: "🏆", category: "LEARNING", requirement: JSON.stringify({ type: "course_completed", threshold: 3 }), points: 75, order: 6 },
    { name: "reel_collector", description: "Zapisz 10 inspiracji", iconUrl: "🎬", category: "LEARNING", requirement: JSON.stringify({ type: "reel_saved", threshold: 10 }), points: 10, order: 7 },
    // SPECIAL (4)
    { name: "early_adopter", description: "Dolacz w pierwszym miesiacu platformy", iconUrl: "🚀", category: "SPECIAL", requirement: JSON.stringify({ type: "early_adopter", threshold: 1 }), points: 20, order: 1 },
    { name: "level_5", description: "Osiagnij poziom 5", iconUrl: "⭐", category: "SPECIAL", requirement: JSON.stringify({ type: "level_reached", threshold: 5 }), points: 15, order: 2 },
    { name: "level_10", description: "Osiagnij poziom 10 - Legenda!", iconUrl: "👑", category: "SPECIAL", requirement: JSON.stringify({ type: "level_reached", threshold: 10 }), points: 100, order: 3 },
    { name: "streak_30", description: "Utrzymaj streak 30 dni", iconUrl: "💎", category: "SPECIAL", requirement: JSON.stringify({ type: "streak_days", threshold: 30 }), points: 100, order: 4 },
    // SECRET (3)
    { name: "night_owl", description: "Opublikuj post miedzy 00:00 a 05:00", iconUrl: "🦉", category: "SECRET", requirement: JSON.stringify({ type: "night_post", threshold: 1 }), points: 10, order: 1, isSecret: true },
    { name: "centurion", description: "Zdobadz 1000 punktow", iconUrl: "🏛️", category: "SECRET", requirement: JSON.stringify({ type: "points_reached", threshold: 1000 }), points: 25, order: 2, isSecret: true },
    { name: "completionist", description: "Zdobadz 20 odznak", iconUrl: "🎪", category: "SECRET", requirement: JSON.stringify({ type: "badges_earned", threshold: 20 }), points: 50, order: 3, isSecret: true },
  ];

  const badges: Record<string, any> = {};
  for (const def of badgeDefinitions) {
    const badge = await prisma.badge.create({ data: def });
    badges[def.name] = badge;
  }
  console.log(`${badgeDefinitions.length} badges created`);

  // Award some badges to member1
  const member1Badges = ["first_comment", "first_post", "student", "first_lesson", "early_adopter"];
  for (const badgeName of member1Badges) {
    if (badges[badgeName]) {
      await prisma.userBadge.create({
        data: { userId: member1.id, badgeId: badges[badgeName].id },
      });
    }
  }
  // Award early_adopter to all existing users
  await prisma.userBadge.create({ data: { userId: admin.id, badgeId: badges["early_adopter"].id } });
  await prisma.userBadge.create({ data: { userId: member2.id, badgeId: badges["early_adopter"].id } });
  console.log("Badges awarded to users");

  // ==========================================
  // 9. GAMIFICATION: Challenges
  // ==========================================

  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const tomorrowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);

  await prisma.challenge.create({
    data: {
      title: "Dzienny Komentarz",
      description: "Napisz 3 komentarze dzisiaj",
      type: "DAILY",
      requirement: JSON.stringify({ type: "comment_count", target: 3 }),
      reward: 5,
      startDate: now,
      endDate: tomorrowEnd,
      isActive: true,
    },
  });

  await prisma.challenge.create({
    data: {
      title: "Tygodniowy Tworca",
      description: "Opublikuj 3 posty w tym tygodniu",
      type: "WEEKLY",
      requirement: JSON.stringify({ type: "post_count", target: 3 }),
      reward: 15,
      startDate: now,
      endDate: weekFromNow,
      isActive: true,
    },
  });

  await prisma.challenge.create({
    data: {
      title: "Miesieczny Maraton Nauki",
      description: "Ukoncz 10 lekcji w tym miesiacu",
      type: "MONTHLY",
      requirement: JSON.stringify({ type: "lesson_completed", target: 10 }),
      reward: 30,
      startDate: now,
      endDate: monthFromNow,
      isActive: true,
    },
  });
  console.log("3 challenges created");

  // ==========================================
  // 10. Backfill user cached stats
  // ==========================================

  // Update admin stats
  const adminPostCount = await prisma.post.count({ where: { authorId: admin.id } });
  const adminCommentCount = await prisma.comment.count({ where: { authorId: admin.id } });
  await prisma.user.update({
    where: { id: admin.id },
    data: {
      totalPosts: adminPostCount,
      totalComments: adminCommentCount,
      totalLikes: 0,
      completedCourses: 0,
      streak: 5,
      longestStreak: 15,
      lastActiveAt: now,
    },
  });

  // Update member1 stats
  const m1PostCount = await prisma.post.count({ where: { authorId: member1.id } });
  const m1CommentCount = await prisma.comment.count({ where: { authorId: member1.id } });
  await prisma.user.update({
    where: { id: member1.id },
    data: {
      totalPosts: m1PostCount,
      totalComments: m1CommentCount,
      totalLikes: 0,
      completedCourses: 0,
      streak: 3,
      longestStreak: 7,
      lastActiveAt: now,
    },
  });

  // Update member2 stats
  const m2PostCount = await prisma.post.count({ where: { authorId: member2.id } });
  const m2CommentCount = await prisma.comment.count({ where: { authorId: member2.id } });
  await prisma.user.update({
    where: { id: member2.id },
    data: {
      totalPosts: m2PostCount,
      totalComments: m2CommentCount,
      totalLikes: 0,
      completedCourses: 0,
      streak: 1,
      longestStreak: 2,
      lastActiveAt: now,
    },
  });
  console.log("User cached stats backfilled");

  console.log("\nSeed completed!");
  console.log("Admin: bartek@internetowyprzedsiebiorca.pl / admin12345");
  console.log("Member: michal@test.pl / member12345");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
