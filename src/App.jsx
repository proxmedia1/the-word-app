import { useState, useMemo, useRef, useEffect } from "react";

// ─── CANON ────────────────────────────────────────────────────
const BOOK_ORDER = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth",
  "1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra",
  "Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon",
  "Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
  "Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah",
  "Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians",
  "2 Corinthians","Galatians","Ephesians","Philippians","Colossians",
  "1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon",
  "Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"
];
const OT_SET = new Set(BOOK_ORDER.slice(0, 39));

function bk(ref) { const m = ref.match(/^(\d?\s?[A-Za-z ]+?)\s+\d/); return m ? m[1].trim() : ref; }
function ch(ref) { const m = ref.match(/(\d+)[:\u2013-]/); return m ? parseInt(m[1]) : 0; }
function vs(ref) { const m = ref.match(/:(\d+)/); return m ? parseInt(m[1]) : 0; }
function canon(a, b) {
  const ia = BOOK_ORDER.indexOf(bk(a.ref)), ib = BOOK_ORDER.indexOf(bk(b.ref));
  if (ia !== ib) return ia - ib;
  const ca = ch(a.ref), cb = ch(b.ref); if (ca !== cb) return ca - cb;
  return vs(a.ref) - vs(b.ref);
}

// ─── DATA ─────────────────────────────────────────────────────
const CATS = [
  { id:"wealth",     label:"Wealth & Prosperity",   color:"var(--prox-gold)", core:true, verses:[
    {ref:"Genesis 12:2",text:"I will make you into a great nation, and I will bless you; I will make your name great, and you will be a blessing."},
    {ref:"Deuteronomy 8:18",text:"Remember the Lord your God, for it is he who gives you the ability to produce wealth, and so confirms his covenant."},
    {ref:"Deuteronomy 14:22",text:"Be sure to set aside a tenth of all that your fields produce each year."},
    {ref:"Deuteronomy 28:1\u20132",text:"If you fully obey the Lord your God and carefully follow all his commands\u2026 all these blessings will come on you and accompany you."},
    {ref:"Deuteronomy 28:11\u201312",text:"The Lord will grant you abundant prosperity\u2026 The Lord will open the heavens, the storehouse of his bounty, to bless all the work of your hands."},
    {ref:"Psalm 35:27",text:"The Lord be exalted, who delights in the well-being of his servant."},
    {ref:"Psalm 128:1\u20132",text:"Blessed are all who fear the Lord. You will eat the fruit of your labor; blessings and prosperity will be yours."},
    {ref:"Proverbs 3:9\u201310",text:"Honor the Lord with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing."},
    {ref:"Proverbs 8:18",text:"With me [wisdom] are riches and honor, enduring wealth and prosperity."},
    {ref:"Proverbs 10:22",text:"The blessing of the Lord brings wealth, without painful toil for it."},
    {ref:"Proverbs 11:24\u201325",text:"One person gives freely, yet gains even more. A generous person will prosper; whoever refreshes others will be refreshed."},
    {ref:"Proverbs 13:11",text:"Dishonest money dwindles away, but whoever gathers money little by little makes it grow."},
    {ref:"Proverbs 13:22",text:"A good person leaves an inheritance for their children\u2019s children."},
    {ref:"Proverbs 21:20",text:"The wise store up choice food and olive oil, but fools gulp theirs down."},
    {ref:"Proverbs 22:4",text:"Humility is the fear of the Lord; its wages are riches and honor and life."},
    {ref:"Proverbs 24:3\u20134",text:"By wisdom a house is built; through knowledge its rooms are filled with rare and beautiful treasures."},
    {ref:"Ecclesiastes 11:1\u20132",text:"Ship your grain across the sea; after many days you may receive a return. Invest in seven ventures, yes, in eight."},
    {ref:"Malachi 3:10",text:"Bring the whole tithe into the storehouse. Test me in this, says the Lord, and see if I will not pour out so much blessing there will not be room enough to store it."},
    {ref:"Matthew 6:33",text:"Seek first his kingdom and his righteousness, and all these things will be given to you as well."},
    {ref:"Matthew 25:14\u201329",text:"The Parable of the Talents: He who received five talents put them to work and gained five more. His master said, \u2018Well done, good and faithful servant!\u2019"},
    {ref:"Luke 6:38",text:"Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap."},
    {ref:"Luke 16:10\u201311",text:"Whoever can be trusted with very little can also be trusted with much. If you have not been trustworthy in handling worldly wealth, who will trust you with true riches?"},
    {ref:"2 Corinthians 9:6\u20138",text:"Whoever sows generously will also reap generously. God loves a cheerful giver. And God is able to bless you abundantly."},
    {ref:"Philippians 4:19",text:"My God will meet all your needs according to the riches of his glory in Christ Jesus."},
    {ref:"1 Timothy 6:10",text:"For the love of money is a root of all kinds of evil. Some people, eager for money, have wandered from the faith."},
    {ref:"3 John 1:2",text:"Dear friend, I pray that you may enjoy good health and that all may go well with you, even as your soul is getting along well."},
  ]},
  { id:"diligence",  label:"Diligence & Work",      color:"var(--prox-blue)", core:true, verses:[
    {ref:"Proverbs 6:6\u20138",text:"Go to the ant, you sluggard; consider its ways and be wise! It stores its provisions in summer and gathers its food at harvest."},
    {ref:"Proverbs 10:4",text:"Lazy hands make for poverty, but diligent hands bring wealth."},
    {ref:"Proverbs 12:11",text:"Those who work their land will have abundant food, but those who chase fantasies have no sense."},
    {ref:"Proverbs 13:4",text:"A sluggard\u2019s appetite is never filled, but the desires of the diligent are fully satisfied."},
    {ref:"Proverbs 14:23",text:"All hard work brings a profit, but mere talk leads only to poverty."},
    {ref:"Proverbs 21:5",text:"The plans of the diligent lead to profit as surely as haste leads to poverty."},
    {ref:"Proverbs 28:19",text:"Those who work their land will have abundant food, but those who chase fantasies will have their fill of poverty."},
    {ref:"Proverbs 31:16\u201317",text:"She considers a field and buys it; out of her earnings she plants a vineyard. She sets about her work vigorously."},
    {ref:"Ecclesiastes 9:10",text:"Whatever your hand finds to do, do it with all your might."},
    {ref:"Colossians 3:23",text:"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters."},
    {ref:"2 Thessalonians 3:10",text:"The one who is unwilling to work shall not eat."},
  ]},
  { id:"stewardship",label:"Stewardship",           color:"#5DCAA5",          core:true, verses:[
    {ref:"Proverbs 27:23\u201324",text:"Be sure you know the condition of your flocks, give careful attention to your herds; for riches do not endure forever."},
    {ref:"Luke 12:48",text:"From everyone who has been given much, much will be demanded; and from the one who has been entrusted with much, much more will be asked."},
    {ref:"Luke 16:10\u201312",text:"Whoever can be trusted with very little can also be trusted with much. If you have not been trustworthy in handling worldly wealth, who will trust you with true riches?"},
    {ref:"Luke 19:13",text:"Put this money to work, he said, until I come back."},
    {ref:"1 Corinthians 4:2",text:"Now it is required that those who have been given a trust must prove faithful."},
    {ref:"1 Peter 4:10",text:"Each of you should use whatever gift you have received to serve others, as faithful stewards of God\u2019s grace."},
  ]},
  { id:"faith",      label:"Faith & Trust",         color:"var(--rose)",      core:true, verses:[
    {ref:"Proverbs 3:5\u20136",text:"Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."},
    {ref:"Proverbs 9:10",text:"The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding."},
    {ref:"Isaiah 41:10",text:"Do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you."},
    {ref:"Jeremiah 29:11",text:"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future."},
    {ref:"Matthew 17:20",text:"If you have faith as small as a mustard seed, you can say to this mountain, \u2018Move from here to there,\u2019 and it will move."},
    {ref:"Romans 10:17",text:"Faith comes from hearing the message, and the message is heard through the word about Christ."},
    {ref:"2 Corinthians 5:7",text:"For we live by faith, not by sight."},
    {ref:"Hebrews 11:1",text:"Now faith is confidence in what we hope for and assurance about what we do not see."},
    {ref:"Hebrews 11:6",text:"Without faith it is impossible to please God, because anyone who comes to him must believe that he exists and that he rewards those who earnestly seek him."},
    {ref:"James 1:6",text:"But when you ask, you must believe and not doubt, because the one who doubts is like a wave of the sea, blown and tossed by the wind."},
  ]},
  { id:"prayer",     label:"Prayer",                color:"#A78BDA",          core:true, verses:[
    {ref:"2 Chronicles 7:14",text:"If my people, who are called by my name, will humble themselves and pray and seek my face and turn from their wicked ways, then I will hear from heaven."},
    {ref:"Psalm 55:17",text:"Evening, morning and noon I cry out in distress, and he hears my voice."},
    {ref:"Psalm 145:18",text:"The Lord is near to all who call on him, to all who call on him in truth."},
    {ref:"Jeremiah 33:3",text:"Call to me and I will answer you and tell you great and unsearchable things you do not know."},
    {ref:"Matthew 6:6",text:"When you pray, go into your room, close the door and pray to your Father, who is unseen. Then your Father, who sees what is done in secret, will reward you."},
    {ref:"Matthew 7:7\u20138",text:"Ask and it will be given to you; seek and you will find; knock and the door will be opened to you."},
    {ref:"John 15:7",text:"If you remain in me and my words remain in you, ask whatever you wish, and it will be done for you."},
    {ref:"Philippians 4:6\u20137",text:"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God will guard your hearts and minds."},
    {ref:"1 Thessalonians 5:17\u201318",text:"Pray continually, give thanks in all circumstances; for this is God\u2019s will for you in Christ Jesus."},
    {ref:"James 5:16",text:"The prayer of a righteous person is powerful and effective."},
    {ref:"1 John 5:14\u201315",text:"If we ask anything according to his will, he hears us. And if we know that he hears us, we know that we have what we asked of him."},
  ]},
  { id:"surrender",  label:"Surrender & Humility",  color:"#E0B4A8",          core:true, verses:[
    {ref:"Psalm 37:4\u20135",text:"Take delight in the Lord, and he will give you the desires of your heart. Commit your way to the Lord; trust in him and he will do this."},
    {ref:"Psalm 46:10",text:"Be still, and know that I am God."},
    {ref:"Proverbs 16:18",text:"Pride goes before destruction, a haughty spirit before a fall."},
    {ref:"Proverbs 18:12",text:"Before a downfall the heart is haughty, but humility comes before honor."},
    {ref:"Isaiah 55:8\u20139",text:"For my thoughts are not your thoughts, neither are your ways my ways, declares the Lord."},
    {ref:"Matthew 16:24\u201325",text:"Whoever wants to be my disciple must deny themselves and take up their cross and follow me."},
    {ref:"Matthew 23:12",text:"Those who exalt themselves will be humbled, and those who humble themselves will be exalted."},
    {ref:"Mark 10:43\u201345",text:"Whoever wants to become great among you must be your servant. For even the Son of Man did not come to be served, but to serve."},
    {ref:"Romans 12:1\u20132",text:"Offer your bodies as a living sacrifice, holy and pleasing to God. Do not conform to the pattern of this world, but be transformed by the renewing of your mind."},
    {ref:"James 4:6",text:"God opposes the proud but shows favor to the humble."},
    {ref:"James 4:10",text:"Humble yourselves before the Lord, and he will lift you up."},
    {ref:"1 Peter 5:6\u20137",text:"Humble yourselves under God\u2019s mighty hand, that he may lift you up in due time. Cast all your anxiety on him because he cares for you."},
  ]},
  { id:"love",       label:"Love",                  color:"#D4537E", verses:[
    {ref:"Leviticus 19:18",text:"Love your neighbor as yourself. I am the Lord."},
    {ref:"Matthew 5:44",text:"Love your enemies and pray for those who persecute you."},
    {ref:"Matthew 22:37\u201339",text:"Love the Lord your God with all your heart and with all your soul and with all your mind. And the second is like it: Love your neighbor as yourself."},
    {ref:"John 13:34\u201335",text:"A new command I give you: Love one another. As I have loved you, so you must love one another."},
    {ref:"John 15:13",text:"Greater love has no one than this: to lay down one\u2019s life for one\u2019s friends."},
    {ref:"1 Corinthians 13:4\u20137",text:"Love is patient, love is kind. It does not envy, it does not boast. It always protects, always trusts, always hopes, always perseveres."},
    {ref:"1 John 4:8",text:"Whoever does not love does not know God, because God is love."},
    {ref:"1 John 4:18",text:"There is no fear in love. But perfect love drives out fear."},
  ]},
  { id:"integrity",  label:"Integrity & Honesty",   color:"#97C459", verses:[
    {ref:"Exodus 20:16",text:"You shall not give false testimony against your neighbor."},
    {ref:"Psalm 15:1\u20132",text:"Lord, who may dwell in your sacred tent? The one whose walk is blameless, who does what is righteous, who speaks the truth from their heart."},
    {ref:"Proverbs 10:9",text:"Whoever walks in integrity walks securely, but whoever takes crooked paths will be found out."},
    {ref:"Proverbs 11:3",text:"The integrity of the upright guides them, but the unfaithful are destroyed by their duplicity."},
    {ref:"Proverbs 12:22",text:"The Lord detests lying lips, but he delights in people who are trustworthy."},
    {ref:"Matthew 5:37",text:"All you need to say is simply \u2018Yes\u2019 or \u2018No\u2019; anything beyond this comes from the evil one."},
    {ref:"Ephesians 4:25",text:"Each of you must put off falsehood and speak truthfully to your neighbor."},
  ]},
  { id:"forgiveness",label:"Forgiveness",           color:"#4CBFA8", verses:[
    {ref:"Psalm 103:12",text:"As far as the east is from the west, so far has he removed our transgressions from us."},
    {ref:"Matthew 6:14\u201315",text:"If you forgive other people when they sin against you, your heavenly Father will also forgive you."},
    {ref:"Matthew 18:21\u201322",text:"Peter asked, \u2018How many times shall I forgive?\u2019 Jesus answered, \u2018Not seven times, but seventy-seven times.\u2019"},
    {ref:"Romans 12:19",text:"Do not take revenge, my dear friends, but leave room for God\u2019s wrath."},
    {ref:"Ephesians 4:32",text:"Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you."},
    {ref:"Colossians 3:13",text:"Bear with each other and forgive one another. Forgive as the Lord forgave you."},
  ]},
  { id:"speech",     label:"Speech & Words",        color:"#D4A24C", verses:[
    {ref:"Psalm 19:14",text:"May these words of my mouth and this meditation of my heart be pleasing in your sight, Lord, my Rock and my Redeemer."},
    {ref:"Proverbs 12:18",text:"The words of the reckless pierce like swords, but the tongue of the wise brings healing."},
    {ref:"Proverbs 15:1",text:"A gentle answer turns away wrath, but a harsh word stirs up anger."},
    {ref:"Proverbs 18:21",text:"The tongue has the power of life and death, and those who love it will eat its fruit."},
    {ref:"Ephesians 4:29",text:"Do not let any unwholesome talk come out of your mouths, but only what is helpful for building others up."},
    {ref:"Colossians 4:6",text:"Let your conversation be always full of grace, seasoned with salt, so that you may know how to answer everyone."},
    {ref:"James 1:19",text:"Everyone should be quick to listen, slow to speak and slow to become angry."},
    {ref:"James 3:5\u20136",text:"The tongue is a small part of the body, but it makes great boasts. Consider what a great forest is set on fire by a small spark."},
  ]},
  { id:"peace",      label:"Peace & Contentment",   color:"#8B9DB5", verses:[
    {ref:"Psalm 23:1\u20133",text:"The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul."},
    {ref:"Psalm 46:1",text:"God is our refuge and strength, an ever-present help in trouble."},
    {ref:"Isaiah 26:3",text:"You will keep in perfect peace those whose minds are steadfast, because they trust in you."},
    {ref:"Matthew 11:28\u201330",text:"Come to me, all you who are weary and burdened, and I will give you rest. For my yoke is easy and my burden is light."},
    {ref:"John 14:27",text:"Peace I leave with you; my peace I give you. Do not let your hearts be troubled."},
    {ref:"Philippians 4:11\u201313",text:"I have learned to be content whatever the circumstances. I can do all things through him who gives me strength."},
    {ref:"Hebrews 12:14",text:"Make every effort to live in peace with everyone and to be holy."},
  ]},
  { id:"sowing",     label:"Sowing & Reaping",      color:"#E0956B", verses:[
    {ref:"Proverbs 11:18",text:"A wicked person earns deceptive wages, but the one who sows righteousness reaps a sure reward."},
    {ref:"Hosea 10:12",text:"Sow righteousness for yourselves, reap the fruit of unfailing love, and break up your unplowed ground."},
    {ref:"Luke 6:38",text:"Give, and it will be given to you. A good measure, pressed down, shaken together and running over."},
    {ref:"2 Corinthians 9:6",text:"Whoever sows sparingly will also reap sparingly, and whoever sows generously will also reap generously."},
    {ref:"Galatians 6:7\u20139",text:"Do not be deceived: God cannot be mocked. A man reaps what he sows. Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up."},
  ]},
  { id:"family",     label:"Family & Relationships",color:"#E07B7B", verses:[
    {ref:"Exodus 20:12",text:"Honor your father and your mother, so that you may live long in the land the Lord your God is giving you."},
    {ref:"Proverbs 22:6",text:"Start children off on the way they should go, and even when they are old they will not turn from it."},
    {ref:"Proverbs 27:17",text:"As iron sharpens iron, so one person sharpens another."},
    {ref:"Ecclesiastes 4:9\u201310",text:"Two are better than one. If either of them falls down, one can help the other up."},
    {ref:"Ephesians 5:25",text:"Husbands, love your wives, just as Christ loved the church and gave himself up for her."},
    {ref:"Ephesians 6:4",text:"Fathers, do not exasperate your children; instead, bring them up in the training and instruction of the Lord."},
  ]},
  { id:"justice",    label:"Justice & Fairness",    color:"#5BA8D4", verses:[
    {ref:"Leviticus 19:15",text:"Do not pervert justice; do not show partiality to the poor or favoritism to the great, but judge your neighbor fairly."},
    {ref:"Proverbs 31:8\u20139",text:"Speak up for those who cannot speak for themselves. Speak up and judge fairly; defend the rights of the poor and needy."},
    {ref:"Isaiah 1:17",text:"Learn to do right; seek justice. Defend the oppressed. Take up the cause of the fatherless; plead the case of the widow."},
    {ref:"Micah 6:8",text:"What does the Lord require of you? To act justly and to love mercy and to walk humbly with your God."},
    {ref:"Matthew 7:12",text:"In everything, do to others what you would have them do to you, for this sums up the Law and the Prophets."},
  ]},
  { id:"redemption", label:"Redemption & Grace",    color:"#A78BDA", verses:[
    {ref:"Psalm 103:2\u20134",text:"Praise the Lord, my soul, and forget not all his benefits \u2014 who forgives all your sins and heals all your diseases, who redeems your life from the pit."},
    {ref:"Isaiah 1:18",text:"Though your sins are like scarlet, they shall be as white as snow; though they are red as crimson, they shall be like wool."},
    {ref:"Romans 3:23\u201324",text:"For all have sinned and fall short of the glory of God, and all are justified freely by his grace through the redemption that came by Christ Jesus."},
    {ref:"Romans 6:23",text:"For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord."},
    {ref:"Romans 8:28",text:"And we know that in all things God works for the good of those who love him, who have been called according to his purpose."},
    {ref:"2 Corinthians 5:17",text:"If anyone is in Christ, the new creation has come: the old has gone, the new is here!"},
    {ref:"Ephesians 2:8\u20139",text:"For it is by grace you have been saved, through faith \u2014 and this is not from yourselves, it is the gift of God \u2014 not by works."},
    {ref:"1 John 1:9",text:"If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness."},
  ]},
];

// ─── APP ──────────────────────────────────────────────────────
export default function App() {
  // view: "home" | "reading" | "principles"
  const [view, setView]         = useState("home");
  const [testament, setTestament] = useState("OT"); // OT | NT
  const [activeBook, setActiveBook] = useState(null);
  const [activePrinciple, setActivePrinciple] = useState(null);
  const [search, setSearch]     = useState("");
  const [expandedTags, setExpandedTags] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [notes, setNotes] = useState({});
  const [noteInput, setNoteInput] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const topRef = useRef(null);

  // Load persisted state on mount
  useEffect(() => {
    try {
      const b = localStorage.getItem('word_bookmarks');
      if (b) setBookmarks(JSON.parse(b));
      const n = localStorage.getItem('word_notes');
      if (n) setNotes(JSON.parse(n));
      const lb = localStorage.getItem('word_last_book');
      if (lb) setActiveBook(lb);
    } catch(e) {}
  }, []);

  // Build deduplicated master verse list
  const allVerses = useMemo(() => {
    const map = {};
    CATS.forEach(cat => {
      cat.verses.forEach(v => {
        if (!map[v.ref]) map[v.ref] = { ...v, cats: [] };
        if (!map[v.ref].cats.find(c => c.id === cat.id))
          map[v.ref].cats.push({ id: cat.id, label: cat.label, color: cat.color });
      });
    });
    return Object.values(map).sort(canon);
  }, []);

  // Books that actually have verses
  const booksWithVerses = useMemo(() => {
    const s = new Set(allVerses.map(v => bk(v.ref)));
    return BOOK_ORDER.filter(b => s.has(b));
  }, [allVerses]);

  const otBooks = booksWithVerses.filter(b => OT_SET.has(b));
  const ntBooks = booksWithVerses.filter(b => !OT_SET.has(b));

  // Verses for reading view (filtered by book + optional principle + search)
  const readingVerses = useMemo(() => {
    if (!activeBook) return [];
    let items = allVerses.filter(v => bk(v.ref) === activeBook);
    if (activePrinciple) items = items.filter(v => v.cats.some(c => c.id === activePrinciple));
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(v => v.ref.toLowerCase().includes(q) || v.text.toLowerCase().includes(q));
    }
    return items;
  }, [allVerses, activeBook, activePrinciple, search]);

  // Verses for principles view
  const principleVerses = useMemo(() => {
    if (!activePrinciple) return [];
    let items = allVerses.filter(v => v.cats.some(c => c.id === activePrinciple));
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(v => v.ref.toLowerCase().includes(q) || v.text.toLowerCase().includes(q));
    }
    return items;
  }, [allVerses, activePrinciple, search]);

  const activePrincipleObj = CATS.find(c => c.id === activePrinciple);

  function openBook(book) {
    setActiveBook(book);
    localStorage.setItem('word_last_book', book);
    setActivePrinciple(null);
    setSearch("");
    setExpandedTags({});
    setView("reading");
    topRef.current?.scrollTo(0, 0);
  }

  function openPrinciple(id) {
    setActivePrinciple(id);
    setSearch("");
    setExpandedTags({});
    setView("principles");
    topRef.current?.scrollTo(0, 0);
  }

  function goHome() {
    setView("home");
    setActiveBook(null);
    setActivePrinciple(null);
    setSearch("");
  }

  function toggleTags(ref) {
    setExpandedTags(p => ({ ...p, [ref]: !p[ref] }));
  }

  function toggleBookmark(v) {
    setBookmarks(prev => {
      const updated = { ...prev };
      if (updated[v.ref]) { delete updated[v.ref]; } else { updated[v.ref] = true; }
      localStorage.setItem('word_bookmarks', JSON.stringify(updated));
      return updated;
    });
  }

  function saveNote(ref) {
    const trimmed = noteDraft.trim();
    setNotes(prev => {
      const updated = { ...prev };
      if (trimmed) { updated[ref] = trimmed; } else { delete updated[ref]; }
      localStorage.setItem('word_notes', JSON.stringify(updated));
      return updated;
    });
    setNoteInput(null);
    setNoteDraft('');
  }

  const verseCountByBook = useMemo(() => {
    const m = {};
    allVerses.forEach(v => { const b = bk(v.ref); m[b] = (m[b] || 0) + 1; });
    return m;
  }, [allVerses]);

  const bookmarkedVerses = useMemo(() => {
    return allVerses.filter(v => bookmarks[v.ref]);
  }, [allVerses, bookmarks]);

  return (
    <>
      <style>{CSS}</style>
      <div className="app" data-theme="dark" ref={topRef}>
        <div className="ambient"><div className="orb orb-1"/><div className="orb orb-2"/><div className="orb orb-3"/></div>
        <div className="grain"/>
        <div className="container">

          {/* ══════════ HOME ══════════ */}
          {view === "home" && (
            <div className="stagger">
              {/* Resume reading card */}
              {activeBook && (
                <div className="glass resume-card" onClick={()=>openBook(activeBook)}>
                  <div>
                    <div className="eyebrow" style={{color:"var(--prox-gold)",marginBottom:3}}>Continue reading</div>
                    <div className="resume-book">{activeBook}</div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--prox-gold)" strokeWidth="2.2" strokeLinecap="round"><polyline points="9,6 15,12 9,18"/></svg>
                </div>
              )}

              {/* Header */}
              <div className="header">
                <div className="eyebrow">Bible study companion</div>
                <h1 className="header-title">The <em>Principles</em></h1>
                <p className="header-quote">Open alongside your Bible. Find principles as you read.</p>
              </div>

              {/* Quick stats */}
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-num">{allVerses.length}</div>
                  <div className="stat-lbl">Scriptures</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num">{booksWithVerses.length}</div>
                  <div className="stat-lbl">Books</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num">{CATS.length}</div>
                  <div className="stat-lbl">Principles</div>
                </div>
              </div>

              {/* Where are you reading? */}
              <div className="glass section-card">
                <div className="section-head-row">
                  <div>
                    <div className="eyebrow" style={{color:"var(--prox-gold)"}}>Reading right now</div>
                    <p className="section-desc">Tap the book you\u2019re in</p>
                  </div>
                  {/* OT / NT toggle */}
                  <div className="mini-seg">
                    {["OT","NT"].map(t => (
                      <button key={t} className={`mini-seg-btn${testament===t?" active":""}`} onClick={()=>setTestament(t)}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="book-grid">
                  {(testament==="OT"?otBooks:ntBooks).map(book => (
                    <button key={book} className="book-chip" onClick={()=>openBook(book)}>
                      <span className="book-chip-name">{book}</span>
                      <span className="book-chip-count">{verseCountByBook[book]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse by principle */}
              <div className="glass section-card">
                <div className="eyebrow" style={{color:"var(--prox-blue)",marginBottom:4}}>Browse by principle</div>
                <p className="section-desc" style={{marginBottom:14}}>See all verses on a specific topic</p>

                <div style={{marginBottom:16}}>
                  <div className="eyebrow" style={{marginBottom:10,fontSize:9.5}}>Core principles</div>
                  <div className="principle-list">
                    {CATS.filter(c=>c.core).map(c=>(
                      <button key={c.id} className="principle-row" onClick={()=>openPrinciple(c.id)}>
                        <div className="principle-dot" style={{background:c.color}}/>
                        <span className="principle-label">{c.label}</span>
                        <span className="principle-count">{c.verses.length}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" style={{color:"var(--text-3)",flexShrink:0}}><polyline points="9,6 15,12 9,18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="eyebrow" style={{marginBottom:10,fontSize:9.5}}>More principles</div>
                  <div className="principle-list">
                    {CATS.filter(c=>!c.core).map(c=>(
                      <button key={c.id} className="principle-row" onClick={()=>openPrinciple(c.id)}>
                        <div className="principle-dot" style={{background:c.color}}/>
                        <span className="principle-label">{c.label}</span>
                        <span className="principle-count">{c.verses.length}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" style={{color:"var(--text-3)",flexShrink:0}}><polyline points="9,6 15,12 9,18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ READING VIEW ══════════ */}
          {view === "reading" && (
            <div className="stagger">
              {/* Back + header */}
              <div className="header">
                <button className="back-btn" onClick={goHome}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="15,6 9,12 15,18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  All books
                </button>
                <h1 className="header-title" style={{fontSize:38}}>{activeBook}</h1>
                <p className="header-quote">
                  {readingVerses.length} scripture{readingVerses.length!==1?"s":""} tagged
                  {activePrinciple && activePrincipleObj ? ` \u2014 ${activePrincipleObj.label}` : ""}
                </p>
              </div>

              {/* Search bar */}
              <div className="glass search-glass">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="s-icon"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                <input className="s-input" placeholder={`Search in ${activeBook}\u2026`} value={search} onChange={e=>setSearch(e.target.value)}/>
                {search && <button className="s-clear" onClick={()=>setSearch("")}><svg width="13" height="13" viewBox="0 0 24 24"><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>}
              </div>

              {/* Filter by principle — compact dropdown-style */}
              <div className="glass principle-filter-bar">
                <span className="eyebrow" style={{flexShrink:0}}>Filter</span>
                <div className="principle-chips">
                  <button className={`pchip${!activePrinciple?" pchip-active":""}`} onClick={()=>setActivePrinciple(null)}>All</button>
                  {CATS.map(c => {
                    const hasVerses = allVerses.filter(v=>bk(v.ref)===activeBook).some(v=>v.cats.some(x=>x.id===c.id));
                    if (!hasVerses) return null;
                    return (
                      <button key={c.id}
                        className={`pchip${activePrinciple===c.id?" pchip-active":""}`}
                        style={activePrinciple===c.id?{background:c.color,borderColor:c.color,color:"#0a0d14"}:{borderColor:`color-mix(in srgb, ${c.color} 40%, transparent)`,color:c.color}}
                        onClick={()=>setActivePrinciple(activePrinciple===c.id?null:c.id)}>
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Verses */}
              {readingVerses.length === 0
                ? <EmptyState/>
                : readingVerses.map((v,i) => (
                    <ReadingCard key={v.ref+i} v={v} expanded={!!expandedTags[v.ref]} onToggle={()=>toggleTags(v.ref)}
                      isBookmarked={!!bookmarks[v.ref]} onBookmark={()=>toggleBookmark(v)}
                      note={notes[v.ref]} onNote={()=>{ setNoteInput(v.ref); setNoteDraft(notes[v.ref]||''); }}/>
                  ))
              }
            </div>
          )}

          {/* ══════════ BOOKMARKS VIEW ══════════ */}
          {view === "bookmarks" && (
            <div className="stagger">
              <div className="header">
                <button className="back-btn" onClick={goHome}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="15,6 9,12 15,18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  Home
                </button>
                <h1 className="header-title" style={{fontSize:38}}>Saved</h1>
                <p className="header-quote">{bookmarkedVerses.length} bookmark{bookmarkedVerses.length!==1?"s":""}</p>
              </div>
              {bookmarkedVerses.length === 0
                ? <div className="glass" style={{textAlign:"center",padding:"40px 20px",marginTop:8}}>
                    <p style={{color:"var(--text-3)",fontSize:14,fontFamily:"var(--font-display)",fontStyle:"italic"}}>No bookmarks yet. Tap the bookmark icon on any verse.</p>
                  </div>
                : bookmarkedVerses.map((v,i) => (
                    <ReadingCard key={v.ref+i} v={v} expanded={!!expandedTags[v.ref]} onToggle={()=>toggleTags(v.ref)}
                      isBookmarked={!!bookmarks[v.ref]} onBookmark={()=>toggleBookmark(v)}
                      note={notes[v.ref]} onNote={()=>{ setNoteInput(v.ref); setNoteDraft(notes[v.ref]||''); }}/>
                  ))
              }
            </div>
          )}

          {/* ══════════ PRINCIPLES VIEW ══════════ */}
          {view === "principles" && activePrincipleObj && (
            <div className="stagger">
              <div className="header">
                <button className="back-btn" onClick={goHome}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="15,6 9,12 15,18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  All principles
                </button>
                <div style={{display:"flex",alignItems:"center",gap:10,marginTop:6}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:activePrincipleObj.color,flexShrink:0}}/>
                  <h1 className="header-title" style={{fontSize:32}}>{activePrincipleObj.label}</h1>
                </div>
                <p className="header-quote">{principleVerses.length} scripture{principleVerses.length!==1?"s":""} \u2014 Genesis to Revelation</p>
              </div>

              {/* Search */}
              <div className="glass search-glass">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="s-icon"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                <input className="s-input" placeholder="Search\u2026" value={search} onChange={e=>setSearch(e.target.value)}/>
                {search && <button className="s-clear" onClick={()=>setSearch("")}><svg width="13" height="13" viewBox="0 0 24 24"><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>}
              </div>

              {principleVerses.length === 0
                ? <EmptyState/>
                : principleVerses.map((v,i) => (
                    <PrincipleCard key={v.ref+i} v={v} accentColor={activePrincipleObj.color}/>
                  ))
              }
            </div>
          )}

        </div>

        {/* ══════ NOTE MODAL ══════ */}
        {noteInput !== null && (
          <>
            <div className="modal-backdrop" onClick={()=>{ setNoteInput(null); setNoteDraft(''); }}/>
            <div className="modal-sheet">
              <div className="eyebrow" style={{color:"var(--prox-gold)",marginBottom:10}}>{noteInput}</div>
              <textarea
                className="note-textarea"
                placeholder="Write a note…"
                value={noteDraft}
                onChange={e=>setNoteDraft(e.target.value)}
                autoFocus
                rows={4}
              />
              <div style={{display:"flex",gap:10,marginTop:14,justifyContent:"flex-end"}}>
                <button className="ghost-btn" onClick={()=>{ setNoteInput(null); setNoteDraft(''); }}>Cancel</button>
                <button className="primary-btn" onClick={()=>saveNote(noteInput)}>Save</button>
              </div>
            </div>
          </>
        )}

        {/* ══════ BOTTOM NAV ══════ */}
        <nav className="nav">
          <button className={`nav-btn${view==="home"?" nav-active":""}`} onClick={goHome}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
            <span>Home</span>
          </button>
          <button className={`nav-btn${view==="reading"?" nav-active":""}`} onClick={()=>activeBook?setView("reading"):null} style={{opacity:activeBook?1:0.35}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            <span>{activeBook || "Reading"}</span>
          </button>
          <button className={`nav-btn${view==="principles"?" nav-active":""}`} onClick={()=>activePrinciple?setView("principles"):null} style={{opacity:activePrinciple?1:0.35}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg>
            <span>Principle</span>
          </button>
          <button className={`nav-btn${view==="bookmarks"?" nav-active":""}`} onClick={()=>setView("bookmarks")}>
            {view==="bookmarks"
              ? <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--prox-gold)" stroke="var(--prox-gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            }
            <span>{bookmarkedVerses.length > 0 ? `Saved (${bookmarkedVerses.length})` : "Saved"}</span>
          </button>
        </nav>
      </div>
    </>
  );
}

function ReadingCard({ v, expanded, onToggle, isBookmarked, onBookmark, note, onNote }) {
  return (
    <div className="glass rcard">
      <div className="rcard-ref-row">
        <span className="rcard-ref">{v.ref}</span>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <button className="tags-toggle" onClick={onNote} title="Add note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={note ? "var(--prox-blue)" : "var(--text-3)"}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
            </svg>
          </button>
          <button className="tags-toggle" onClick={onBookmark} title="Bookmark">
            {isBookmarked
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--prox-gold)" stroke="var(--prox-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            }
          </button>
          <button className="tags-toggle" onClick={onToggle}>
            {expanded ? "hide" : `${v.cats.length} tag${v.cats.length!==1?"s":""}`}
            <svg width="11" height="11" viewBox="0 0 24 24" style={{transform:expanded?"rotate(180deg)":"none",transition:"transform 0.2s",marginLeft:3}}><polyline points="6,9 12,15 18,9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>
      <p className="rcard-text">{v.text}</p>
      {note && (
        <div className="note-chip" onClick={onNote}>{note}</div>
      )}
      {expanded && (
        <div className="rcard-tags">
          {v.cats.map(c=>(
            <span key={c.id} className="rtag" style={{background:`color-mix(in srgb, ${c.color} 18%, transparent)`,color:c.color}}>{c.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function PrincipleCard({ v, accentColor }) {
  const bookName = bk(v.ref);
  const isOT = OT_SET.has(bookName);
  return (
    <div className="glass pcard" style={{borderLeftColor:accentColor}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span className="pcard-ref" style={{color:accentColor}}>{v.ref}</span>
        <span className="tbadge" style={isOT?{background:"color-mix(in srgb, var(--prox-gold) 15%, transparent)",color:"var(--prox-gold)"}:{background:"color-mix(in srgb, var(--prox-blue) 15%, transparent)",color:"var(--prox-blue)"}}>
          {isOT?"OT":"NT"}
        </span>
      </div>
      <p className="pcard-text">{v.text}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass" style={{textAlign:"center",padding:"40px 20px",marginTop:8}}>
      <p style={{color:"var(--text-3)",fontSize:14,fontFamily:"var(--font-display)",fontStyle:"italic"}}>No scriptures found.</p>
    </div>
  );
}

// ─── CSS ──────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

:root,[data-theme="dark"]{
  --bg-0:#0a0d14;--bg-1:#0e1220;
  --surface-0:rgba(255,255,255,0.06);--surface-1:rgba(255,255,255,0.04);
  --border-faint:rgba(255,255,255,0.06);--border:rgba(255,255,255,0.10);
  --specular:rgba(255,255,255,0.15);
  --shadow-soft:0 4px 20px -6px rgba(0,0,0,0.5);
  --shadow-lift:0 10px 30px -10px rgba(0,0,0,0.6);
  --shadow-nav:0 12px 40px -8px rgba(0,0,0,0.7);
  --text-1:#f5f5f7;--text-2:#c8ccd4;--text-3:#7a808c;
  --prox-navy:#1A2233;--prox-blue:#5BBFEA;--prox-gold:#E8B84B;
  --rose:#E0B4A8;--rose-soft:#E8C4B8;--danger:#e74c3c;
  --orb-1:rgba(224,180,168,0.28);--orb-2:rgba(91,191,234,0.26);--orb-3:rgba(232,184,75,0.22);
  --font-display:'Instrument Serif',Georgia,serif;
  --font-body:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif;
  --r-lg:22px;--r-md:16px;--r-sm:12px;--r-pill:999px;
  --ease-spring:cubic-bezier(0.34,1.56,0.64,1);--ease-smooth:cubic-bezier(0.25,0.46,0.45,0.94);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
input:focus,button:focus{outline:none;}
input::placeholder{color:var(--text-3);opacity:0.6;}
button{cursor:pointer;font-family:var(--font-body);border:none;background:none;color:inherit;touch-action:manipulation;}
::-webkit-scrollbar{width:0;}

.app{height:100vh;height:100dvh;background:var(--bg-0);color:var(--text-1);font-family:var(--font-body);font-size:15px;line-height:1.5;position:relative;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch;-webkit-font-smoothing:antialiased;letter-spacing:-0.01em;}
.ambient{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;}
.orb{position:absolute;border-radius:50%;filter:blur(70px);animation:drift 20s ease-in-out infinite;}
.orb-1{top:-140px;left:-90px;width:420px;height:420px;background:radial-gradient(circle,var(--orb-1),transparent 65%);}
.orb-2{top:35%;right:-120px;width:360px;height:360px;background:radial-gradient(circle,var(--orb-2),transparent 65%);animation-delay:-7s;}
.orb-3{bottom:80px;left:-80px;width:340px;height:340px;background:radial-gradient(circle,var(--orb-3),transparent 65%);animation-delay:-14s;}
@keyframes drift{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(40px,-30px) scale(1.1);}66%{transform:translate(-30px,40px) scale(0.95);}}
.grain{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");mix-blend-mode:overlay;}
.container{max-width:480px;margin:0 auto;padding:max(24px,env(safe-area-inset-top)) max(18px,env(safe-area-inset-right)) max(110px,calc(110px + env(safe-area-inset-bottom))) max(18px,env(safe-area-inset-left));position:relative;z-index:2;}

.glass{background:var(--surface-0);backdrop-filter:blur(24px) saturate(1.6);-webkit-backdrop-filter:blur(24px) saturate(1.6);border:1px solid var(--border);border-radius:var(--r-lg);padding:20px;margin-bottom:12px;box-shadow:var(--shadow-soft),inset 0 1px 0 var(--specular);transition:transform 0.4s var(--ease-spring),box-shadow 0.4s var(--ease-smooth);}
.glass:hover{box-shadow:var(--shadow-lift),inset 0 1px 0 var(--specular);}

.header{margin-bottom:20px;padding-bottom:18px;border-bottom:1px solid var(--border-faint);animation:fadeUp 0.5s var(--ease-smooth);}
.header-title{font-family:var(--font-display);font-size:46px;font-weight:400;color:var(--text-1);line-height:1;letter-spacing:-0.035em;margin-top:4px;}
.header-title em{font-style:italic;color:var(--prox-blue);}
.header-quote{font-family:var(--font-display);font-style:italic;font-size:14px;color:var(--text-3);margin-top:8px;letter-spacing:-0.01em;}
.eyebrow{font-size:10.5px;color:var(--text-3);font-weight:600;letter-spacing:1px;text-transform:uppercase;}
.caption{font-size:11.5px;color:var(--text-3);}

.back-btn{display:inline-flex;align-items:center;gap:5px;font-size:13px;color:var(--text-3);font-weight:600;letter-spacing:0.2px;margin-bottom:12px;padding:8px 0;min-height:44px;}
.back-btn:hover{color:var(--text-1);}

/* Stats row */
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;}
.stat-card{background:var(--surface-0);border:1px solid var(--border-faint);border-radius:var(--r-md);padding:14px 10px;text-align:center;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);}
.stat-num{font-family:var(--font-display);font-size:28px;color:var(--prox-gold);line-height:1;letter-spacing:-0.03em;}
.stat-lbl{font-size:10px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin-top:4px;}

/* Section cards */
.section-card{padding:18px 20px;}
.section-head-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;}
.section-desc{font-size:13px;color:var(--text-3);margin-top:3px;}

/* Mini seg for OT/NT */
.mini-seg{display:flex;background:var(--surface-1);border:1px solid var(--border-faint);border-radius:var(--r-pill);padding:2px;}
.mini-seg-btn{padding:8px 14px;border-radius:var(--r-pill);font-size:11px;font-weight:700;color:var(--text-3);transition:all 0.2s var(--ease-smooth);letter-spacing:0.5px;min-height:36px;}
.mini-seg-btn.active{background:var(--surface-0);color:var(--prox-gold);box-shadow:var(--shadow-soft);}

/* Book grid */
.book-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:6px;}
.book-chip{background:var(--surface-1);border:1px solid var(--border-faint);border-radius:var(--r-sm);padding:12px 10px 10px;text-align:left;transition:all 0.2s var(--ease-spring);display:flex;flex-direction:column;gap:3px;min-height:52px;}
.book-chip:hover{background:color-mix(in srgb,var(--prox-gold) 10%,var(--surface-0));border-color:color-mix(in srgb,var(--prox-gold) 35%,transparent);transform:translateY(-1px);}
.book-chip-name{font-size:13px;font-weight:600;color:var(--text-1);letter-spacing:-0.01em;line-height:1.2;}
.book-chip-count{font-size:10px;color:var(--prox-gold);font-weight:600;}

/* Principle list */
.principle-list{display:grid;gap:2px;}
.principle-row{display:flex;align-items:center;gap:10px;padding:12px 12px;border-radius:var(--r-sm);transition:background 0.15s;width:100%;min-height:44px;}
.principle-row:hover{background:var(--surface-1);}
.principle-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.principle-label{flex:1;font-size:14px;font-weight:500;color:var(--text-1);text-align:left;letter-spacing:-0.01em;}
.principle-count{font-size:11px;color:var(--text-3);font-weight:600;min-width:20px;text-align:right;}

/* Search */
.search-glass{padding:12px 16px;margin-bottom:12px;display:flex;align-items:center;}
.s-icon{color:var(--text-3);flex-shrink:0;margin-right:10px;}
.s-input{flex:1;background:transparent;border:none;font-family:var(--font-body);font-size:16px;color:var(--text-1);letter-spacing:-0.01em;}
.s-clear{color:var(--text-3);display:flex;align-items:center;margin-left:8px;padding:8px;min-width:36px;min-height:36px;justify-content:center;}

/* Principle filter chips (reading view) */
.principle-filter-bar{padding:12px 16px;margin-bottom:12px;display:flex;align-items:center;gap:10px;}
.principle-chips{display:flex;gap:6px;overflow-x:auto;flex:1;padding-bottom:2px;}
.principle-chips::-webkit-scrollbar{display:none;}
.pchip{font-size:11px;font-weight:600;padding:8px 13px;border-radius:var(--r-pill);border:1px solid var(--border);color:var(--text-3);white-space:nowrap;transition:all 0.15s;flex-shrink:0;min-height:34px;display:inline-flex;align-items:center;}
.pchip.pchip-active{background:var(--surface-1);border-color:var(--border);color:var(--text-1);}

/* Reading cards */
.rcard{padding:14px 16px;margin-bottom:8px;}
.rcard-ref-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;}
.rcard-ref{font-size:11px;font-weight:700;color:var(--prox-gold);letter-spacing:0.3px;}
.tags-toggle{font-size:10px;color:var(--text-3);font-weight:600;display:flex;align-items:center;letter-spacing:0.2px;padding:8px 0 8px 12px;min-height:36px;}
.tags-toggle:hover{color:var(--text-2);}
.rcard-text{font-size:14.5px;line-height:1.65;color:var(--text-1);font-family:var(--font-display);font-style:italic;letter-spacing:-0.01em;margin:0;}
.rcard-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:12px;padding-top:10px;border-top:1px solid var(--border-faint);}
.rtag{font-size:10px;font-weight:600;padding:3px 9px;border-radius:var(--r-pill);letter-spacing:0.2px;}

/* Principle cards */
.pcard{padding:14px 16px;margin-bottom:8px;border-left:2px solid;}
.pcard-ref{font-size:11px;font-weight:700;letter-spacing:0.3px;}
.pcard-text{font-size:14.5px;line-height:1.65;color:var(--text-1);font-family:var(--font-display);font-style:italic;letter-spacing:-0.01em;margin:0;}

/* Testament badge */
.tbadge{font-size:10px;font-weight:600;padding:2px 8px;border-radius:var(--r-pill);letter-spacing:0.03em;}

/* Nav */
.nav{position:fixed;bottom:0;left:0;right:0;z-index:100;background:var(--surface-0);backdrop-filter:blur(40px) saturate(1.8);-webkit-backdrop-filter:blur(40px) saturate(1.8);border-top:1px solid var(--border);display:flex;justify-content:space-around;align-items:center;padding:10px 0 max(10px,env(safe-area-inset-bottom));box-shadow:var(--shadow-nav),inset 0 1px 0 var(--specular);}
.nav-btn{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 20px;font-size:10px;font-weight:600;letter-spacing:0.3px;color:var(--text-3);transition:color 0.2s var(--ease-smooth);max-width:100px;overflow:hidden;min-height:48px;justify-content:center;}
.nav-btn span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:80px;}
.nav-btn.nav-active{color:var(--prox-gold);}

@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
.stagger>*{opacity:0;animation:fadeUp 0.5s var(--ease-smooth) forwards;}
.stagger>*:nth-child(1){animation-delay:0.04s;}
.stagger>*:nth-child(2){animation-delay:0.1s;}
.stagger>*:nth-child(3){animation-delay:0.16s;}
.stagger>*:nth-child(4){animation-delay:0.22s;}
.stagger>*:nth-child(5){animation-delay:0.28s;}
.stagger>*:nth-child(6){animation-delay:0.34s;}
.stagger>*:nth-child(n+7){animation-delay:0.38s;}

/* ── New: notes, modal, bookmarks, resume ── */
.note-chip{margin-top:10px;padding:8px 12px;border-radius:var(--r-sm);background:color-mix(in srgb,var(--prox-blue) 12%,transparent);color:var(--prox-blue);font-size:13px;font-family:var(--font-display);font-style:italic;line-height:1.5;cursor:pointer;border:1px solid color-mix(in srgb,var(--prox-blue) 25%,transparent);}
.note-chip:hover{background:color-mix(in srgb,var(--prox-blue) 18%,transparent);}

.modal-backdrop{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);}

.modal-sheet{position:fixed;bottom:0;left:0;right:0;z-index:201;background:var(--bg-1);border-top:1px solid var(--border);border-radius:var(--r-lg) var(--r-lg) 0 0;padding:24px 20px max(24px,env(safe-area-inset-bottom));animation:slideUp 0.28s var(--ease-spring);}
@keyframes slideUp{from{transform:translateY(100%);}to{transform:translateY(0);}}

.note-textarea{width:100%;background:var(--surface-0);border:1px solid var(--border);border-radius:var(--r-md);padding:12px 14px;font-family:var(--font-display);font-style:italic;font-size:15px;color:var(--text-1);line-height:1.6;resize:none;-webkit-appearance:none;}
.note-textarea:focus{border-color:var(--prox-blue);outline:none;}
.note-textarea::placeholder{color:var(--text-3);opacity:0.7;}

.primary-btn{background:var(--prox-gold);color:#0a0d14;font-weight:700;font-size:13px;padding:10px 22px;border-radius:var(--r-pill);letter-spacing:0.2px;min-height:40px;}
.primary-btn:hover{opacity:0.88;}

.ghost-btn{background:transparent;color:var(--text-3);font-weight:600;font-size:13px;padding:10px 18px;border-radius:var(--r-pill);border:1px solid var(--border);letter-spacing:0.2px;min-height:40px;}
.ghost-btn:hover{color:var(--text-1);border-color:var(--border);}

.resume-card{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;cursor:pointer;border-left:2px solid var(--prox-gold);}
.resume-book{font-size:17px;font-weight:700;color:var(--text-1);letter-spacing:-0.02em;margin-top:2px;}
`;
